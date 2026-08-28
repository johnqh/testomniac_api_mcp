# Testomniac API MCP Server

MCP (Model Context Protocol) server that exposes the Testomniac API to AI assistants like Claude Code and Claude Desktop. Translates MCP tool calls into REST API requests against the Testomniac backend.

**Package**: `@sudobility/testomniac_api_mcp` (private, BUSL-1.1)

## Installation

```bash
bun install
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TESTOMNIAC_API_URL` | Yes | Base URL of the Testomniac API (e.g., `http://localhost:8027`) |
| `TESTOMNIAC_AUTH_TOKEN` | No* | Firebase ID token, sent as `Authorization: Bearer` |
| `TESTOMNIAC_API_KEY` | No* | Entity API key (`tst_…`) or the API's global `SCANNER_API_KEY`, sent as `X-Scanner-Key` |

*At least one auth method (`TESTOMNIAC_AUTH_TOKEN` or `TESTOMNIAC_API_KEY`) is required.

Both auth methods reach the same routes — the API's `firebaseAuthMiddleware`
accepts an entity API key, the global scanner key, or a Firebase token, in that
order. The one exception is `list_entities`, which resolves entity membership by
Firebase UID and so returns nothing under key auth; supply the entity slug
directly in that case.

### Usage with Claude Code

Add to your `.claude/settings.json`:

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

## Available Tools (50)

| Category | Tools |
|----------|-------|
| **Scan** | `start_scan` |
| **Entities** | `list_entities`, `list_products`, `resolve_product_by_url` |
| **Products** | `get_product`, `list_environments`, `list_product_runs` |
| **Environments** | `list_environment_pages`, `list_environment_test_interactions` |
| **Runs** | `get_run_status`, `get_run_summary`, `get_run_dashboard`, `list_run_findings`, `get_run_findings_summary`, `get_run_expertise_summary`, `get_run_structure`, `get_navigation_map`, `list_run_personas`, `list_run_scaffolds`, `list_run_patterns` |
| **Pages** | `list_run_pages`, `get_page_summary`, `list_page_states` |
| **Test structure** | `list_test_surfaces`, `list_surface_interactions`, `get_test_interaction`, `get_test_actions`, `get_interaction_run`, `get_interaction_run_findings`, `list_surface_run_interaction_runs`, `get_interaction_script`, `get_surface_script` |
| **Findings** | `get_finding_detail`, `get_finding_script`, `list_runner_findings`, `list_expertises` |
| **Personas** | `list_personas`, `detect_personas` |
| **Scenarios** | `list_scenarios`, `get_scenario`, `create_scenario`, `update_scenario`, `delete_scenario`, `detect_scenarios` |
| **Sequences** | `generate_sequence`, `list_sequences`, `get_sequence_interactions`, `get_sequence_script`, `run_sequence`, `get_sequence_run` |

### Typical flow

```
list_entities → list_products → list_environments
start_scan → get_run_status / get_run_dashboard
get_run_findings_summary → list_run_findings → get_finding_detail
```

`get_finding_detail` returns a ready-to-run Playwright script with the finding's
prerequisite interactions replayed in order — that is usually the fastest route
from "a scan found something" to "here is how to reproduce it".

## Development

```bash
bun run dev        # Run MCP server in dev mode (stdio)
bun run build      # Bundle to dist/index.js
bun run typecheck  # TypeScript type checking
bun run start      # Run production bundle
```

## Architecture

```
AI Assistant (Claude Code / Claude Desktop)
    ↕ stdio (MCP protocol)
Testomniac API MCP Server (this project)
    ↕ HTTP / REST
Testomniac API (Hono, port 8027)
```

The MCP server is a thin HTTP client layer. Each tool maps to exactly one REST
endpoint under `/api/v1`, unwraps the API's `{ success, data }` envelope, and
returns `data` as pretty-printed JSON. Auth headers are injected automatically
from the configured environment variables.

## Related Projects

- **testomniac_api** -- The Hono backend API this MCP server wraps
- **testomniac_types** -- Shared TypeScript type definitions
- **testomniac_runner_mcp** -- Companion MCP for browser automation (this MCP is for API queries)
- **testomniac_app** -- Web frontend
- **testomniac_runner** -- Server-side test runner worker
- **testomniac_runner_service** -- Shared test execution library

## License

BUSL-1.1
