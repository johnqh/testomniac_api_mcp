# Testomniac API MCP Server

> **Git policy — never auto-commit or auto-push.** Leave work in the working tree.
> Run `git commit`/`git push`/`gh pr create` **only when the user explicitly asks in
> that turn** — approval for an earlier change does not carry forward, and finishing a
> task is not permission to commit it. Stay on the current branch (`main`); do not
> create feature branches for code changes.

MCP (Model Context Protocol) server that exposes the Testomniac API to AI assistants
(Claude Code / Desktop). See `README.md` for the full tool list, env-var table, and
client config — this file holds only what is non-obvious.

## Stack

- **Runtime + package manager + bundler**: Bun (no npm/node). `tsc` is typecheck-only.
- **MCP SDK**: `@modelcontextprotocol/sdk` (`McpServer`, `server.tool(...)`).
- **Validation**: Zod — imported as `zod/v4`, **not** `"zod"` (the SDK's tool schemas
  expect the v4 namespace). Every tools file does `import { z } from "zod/v4"`.
- **Transport**: stdio only.
- Package is `@sudobility/testomniac_api_mcp` (private, BUSL-1.1). `.npmrc` points
  `@sudobility` at GitHub Packages.

## Commands

```bash
bun run dev        # Run server (stdio)
bun run build      # Bundle to dist/index.js (--target bun --minify)
bun run typecheck  # tsc --noEmit
bun run start      # Run production bundle
```

No test suite. Smoke-test registration by piping `initialize` + `tools/list` JSON-RPC
into `bun run src/index.ts` and reading the tool count (expect 50) — see README.

## Architecture

Thin HTTP client: each of the 50 tools maps to exactly one REST call under
`/api/v1`, unwraps the API's `{ success, data }` envelope, and returns `data` as
pretty JSON (`jsonReply`). No local state, caching, or business logic — when
`testomniac_api` changes, this project changes with it.

```
src/
├── index.ts       # Entry: env config, server setup, stdio transport
├── client.ts      # HTTP client: auth headers, query() builder, envelope unwrap
├── reply.ts       # jsonReply() — MCP content wrapper every tool returns
└── tools/         # One file per category; each exports register*Tools(server)
    scan · entities · products · environments · runs · pages ·
    test-structure · findings · personas · scenarios · sequences
```

`index.ts` requires `TESTOMNIAC_API_URL` and at least one of `TESTOMNIAC_AUTH_TOKEN`
/ `TESTOMNIAC_API_KEY`, else it exits at startup.

## Auth (non-obvious)

`client.ts` mirrors the API's `firebaseAuthMiddleware`, which accepts three
credentials in order: entity API key (`tst_`-prefixed), the global scanner key
(`SCANNER_API_KEY`, un-prefixed), then a Firebase `Bearer` token. This client sends
`TESTOMNIAC_API_KEY` as the `X-Scanner-Key` header and `TESTOMNIAC_AUTH_TOKEN` as
`Authorization: Bearer`. Sending both is harmless — the key wins. There is no
separate scanner router any more; `/api/v1/scanner/*` is gone.

Key auth reaches every tool **except** `list_entities`, which resolves membership by
Firebase UID and returns an empty list under key auth — supply the entity slug
directly in that case.

## Gotchas

- **Terminology follows the API: "interaction", not "element".** The API renamed
  `test_element` → `test_interaction`; tool names and params use the new word.
- **Scenario CRUD is runner-scoped.** `create_scenario`/`update_scenario`/
  `delete_scenario` all take a `runnerId` because the routes live under
  `/api/v1/runners/:runnerId/test-scenarios`. (`get_scenario` reads the
  un-scoped `/api/v1/test-scenarios/:id`.)
- **Sequence read/write paths are asymmetric (the API's doing).** Reading a sequence
  is `/api/v1/test-scenarios/sequences/:id/...` and a sequence run is
  `/api/v1/test-scenarios/sequence-runs/:id`, but starting one is
  `POST /api/v1/test-scenario-sequence-runs`.
- **AI tools need server-side credentials.** `detect_personas`, `detect_scenarios`
  and `generate_sequence` return 503 unless the API has its `SHAPESHYFT_*` config,
  and 404 unless a discovery scan has already run.

## Verifying against the API

This project mirrors `testomniac_api`'s route table, so the check that matters is
path-by-path. `src/routes/index.ts` there holds mount prefixes; each route file
declares sub-paths. Where two routers share a prefix, Hono runs handlers in
registration order and the first responder wins — e.g. `GET /api/v1/runs/:id` is
served by `projects.ts`'s `runsRouter`, not `runs-read.ts`.

Endpoints deliberately **not** wrapped:

- `/api/v1/scan/begin|next|end` — the runner's per-interaction loop.
- `/api/v1/environments/:envId/navigation-graph|route|next-step|plan|replan` —
  webgraph pass-throughs that return raw upstream JSON (not the `{ success, data }`
  envelope) and 503 without `WEBGRAPH_API_URL`.
- `/api/v1/runs/:runId/stream` — SSE; MCP tools are request/response.
- Discovery/execution write endpoints (`/discovered-pages`, `/page-states`,
  `/test-interaction-runs` writes, …) — the runner owns those.

## Related projects

`testomniac_api` (the Hono backend wrapped here), `testomniac_types` (shared types),
`testomniac_runner_mcp` (companion MCP for browser automation), `testomniac_app`
(web frontend), `testomniac_runner` / `testomniac_runner_service` (execution).
