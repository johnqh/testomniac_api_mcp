# Testomniac API MCP Server

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

MCP (Model Context Protocol) server that exposes the Testomniac API to AI assistants like Claude Code and Claude Desktop.

**Package**: `@sudobility/testomniac_api_mcp` (private, BUSL-1.1)

## Tech Stack

- **Runtime**: Bun
- **Package Manager**: Bun
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Validation**: Zod (imported as `zod/v4`)
- **Transport**: stdio

## Architecture

```
AI Assistant (Claude Code/Desktop)
    ↕ stdio (MCP protocol)
Testomniac API MCP Server (this project)
    ↕ HTTP/REST
Testomniac API (Hono, port 8027)
```

The MCP server is a thin HTTP client. Every tool is one REST call against
`/api/v1`, unwrapping the API's `{ success, data }` envelope and returning
`data` as pretty JSON. There is no local state, no caching, and no business
logic — when the API changes, this project changes with it.

## Commands

```bash
bun run dev        # Run MCP server (stdio mode)
bun run build      # Bundle to dist/index.js
bun run typecheck  # TypeScript check
bun run start      # Run production bundle
```

## Project Structure

```
src/
├── index.ts       # Entry point: env config, server setup, transport
├── client.ts      # HTTP client (auth headers, query builder, envelope unwrapping)
├── reply.ts       # jsonReply() — the MCP content wrapper every tool returns
└── tools/
    ├── scan.ts           # start_scan
    ├── entities.ts       # list_entities, list_products, resolve_product_by_url
    ├── products.ts       # get_product, list_environments, list_product_runs
    ├── environments.ts   # list_environment_pages, list_environment_test_interactions
    ├── runs.ts           # run status, summaries, findings summaries, structure, navigation map, personas/scaffolds/patterns
    ├── pages.ts          # list_run_pages, get_page_summary, list_page_states
    ├── test-structure.ts # surfaces, interactions, actions, interaction runs, Playwright scripts
    ├── findings.ts       # get_finding_detail, get_finding_script, list_runner_findings, list_expertises
    ├── personas.ts       # list_personas, detect_personas
    ├── scenarios.ts      # scenario CRUD + detect_scenarios
    └── sequences.ts      # generate/list/run sequences, sequence scripts and runs
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TESTOMNIAC_API_URL` | Yes | Base URL of the API (e.g., `http://localhost:8027`) |
| `TESTOMNIAC_AUTH_TOKEN` | No* | Firebase ID token, sent as `Authorization: Bearer` |
| `TESTOMNIAC_API_KEY` | No* | Entity API key (`tst_…`) or the API's global `SCANNER_API_KEY`, sent as `X-Scanner-Key` |

*At least one auth method required.

## Auth

The API's `firebaseAuthMiddleware` accepts three credentials in order: an
entity API key (`tst_`-prefixed, via `X-Api-Key` or `X-Scanner-Key`), the
global scanner key (`SCANNER_API_KEY`, same headers, un-prefixed), then a
Firebase `Bearer` token. Sending both a key and a token is harmless — the key
wins. There is no separate scanner router any more; `/api/v1/scanner/*` no
longer exists.

Key auth satisfies `canAccessEntity`, so it reaches every tool here except
`list_entities`, which resolves membership by Firebase UID and returns an empty
list under key auth.

## Tools (50)

### Scan
- `start_scan` — bootstrap a discovery scan from a URL; returns testRunId/productId/runnerId/testEnvironmentId

### Entities
- `list_entities` — workspaces the caller belongs to (Firebase token only)
- `list_products` — products in an entity
- `resolve_product_by_url` — find the product + environment whose base URL matches a URL

### Products
- `get_product` — product details with runners
- `list_environments` — test environments for a product
- `list_product_runs` — root test runs for a product

### Environments
- `list_environment_pages` — pages discovered in an environment
- `list_environment_test_interactions` — paginated, filterable interaction list

### Runs
- `get_run_status`, `get_run_summary`, `get_run_dashboard`
- `list_run_findings`, `get_run_findings_summary`, `get_run_expertise_summary`
- `get_run_structure`, `get_navigation_map`
- `list_run_personas`, `list_run_scaffolds`, `list_run_patterns`

### Pages
- `list_run_pages`, `get_page_summary`, `list_page_states`

### Test Structure
- `list_test_surfaces`, `list_surface_interactions`, `get_test_interaction`, `get_test_actions`
- `get_interaction_run`, `get_interaction_run_findings`, `list_surface_run_interaction_runs`
- `get_interaction_script`, `get_surface_script`

### Findings
- `get_finding_detail` — finding + triggering interaction + dependency chain + Playwright repro
- `get_finding_script` — just the repro script
- `list_runner_findings`, `list_expertises`

### Personas
- `list_personas`, `detect_personas`

### Scenarios
- `list_scenarios`, `get_scenario`, `create_scenario`, `update_scenario`, `delete_scenario`, `detect_scenarios`

### Sequences
- `generate_sequence`, `list_sequences`, `get_sequence_interactions`, `get_sequence_script`, `run_sequence`, `get_sequence_run`

## Usage with Claude Code

Add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "testomniac": {
      "command": "bun",
      "args": ["run", "/path/to/testomniac_api_mcp/src/index.ts"],
      "env": {
        "TESTOMNIAC_API_URL": "http://localhost:8027",
        "TESTOMNIAC_API_KEY": "your-scanner-key"
      }
    }
  }
}
```

## Gotchas

- **Terminology follows the API: "interaction", not "element".** The API renamed
  `test_element` to `test_interaction`; tool names and parameters use the new
  word throughout.

- **Scenario CRUD is runner-scoped.** `create_scenario`, `update_scenario` and
  `delete_scenario` all take a `runnerId` because the routes live under
  `/api/v1/runners/:runnerId/test-scenarios` — the scenario id alone is not
  enough.

- **Sequence reads live under `/test-scenarios`, sequence-run writes do not.**
  Reading a sequence is `/api/v1/test-scenarios/sequences/:id/...` and reading a
  sequence run is `/api/v1/test-scenarios/sequence-runs/:id`, but starting one
  is `POST /api/v1/test-scenario-sequence-runs`. The asymmetry is the API's.

- **The AI tools need server-side credentials.** `detect_personas`,
  `detect_scenarios` and `generate_sequence` return 503 unless the API has its
  `SHAPESHYFT_*` config, and 404 unless a discovery scan has already run.

- **`import { z } from "zod/v4"`** — not `"zod"`. The MCP SDK's tool schemas
  expect the v4 namespace.

- **No smoke test lives in the repo.** To check registration, pipe an
  `initialize` + `tools/list` JSON-RPC pair into `bun run src/index.ts` and read
  the tool count off the response.

## Verifying against the API

The whole project is a mirror of `testomniac_api`'s route table, so the check
that matters is path-by-path. `src/routes/index.ts` in that repo holds the mount
prefixes; each route file declares the sub-paths. Where two routers mount on the
same prefix, Hono runs handlers in registration order and the first responder
wins — that is why `GET /api/v1/runs/:id` is served by `projects.ts`'s
`runsRouter` and not by `runs-read.ts`.

Endpoints deliberately not wrapped:

- `/api/v1/scan/begin|next|end` — the runner's per-interaction loop, not
  something an assistant drives.
- `/api/v1/environments/:envId/navigation-graph|route|next-step|plan|replan` —
  webgraph pass-throughs that return raw upstream JSON rather than the
  `{ success, data }` envelope this client unwraps, and 503 unless
  `WEBGRAPH_API_URL` is set.
- `/api/v1/runs/:runId/stream` — SSE; MCP tools are request/response.
- Discovery and execution write endpoints (`/discovered-pages`, `/page-states`,
  `/test-interaction-runs` writes, …) — the runner owns those.

## Related Projects

- **testomniac_api** — The Hono API this MCP wraps
- **testomniac_types** — Shared type definitions (`@sudobility/testomniac_types`)
- **testomniac_runner_mcp** — Companion MCP for browser automation (this MCP is for API queries)
- **testomniac_app** — Web frontend
- **testomniac_runner** — Server-side test runner worker
- **testomniac_runner_service** — Shared test execution library

## Git Workflow

- Do not use feature branches for code changes. Always stay on the current branch.
