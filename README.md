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
| `TESTOMNIAC_AUTH_TOKEN` | No* | Firebase Bearer token for user-facing routes |
| `TESTOMNIAC_API_KEY` | No* | API key for scanner routes |

*At least one auth method (`TESTOMNIAC_AUTH_TOKEN` or `TESTOMNIAC_API_KEY`) is required.

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

## Available Tools (26)

The server exposes 26 tools across 9 categories:

| Category | Tools | Description |
|----------|-------|-------------|
| **Scan** | `start_scan` | Start a discovery scan for a URL |
| **Runs** | `get_run_status`, `get_run_summary`, `list_run_findings`, `get_run_structure`, `get_navigation_map` | Query run status, summaries, findings, structure, and site maps |
| **Products** | `list_products`, `get_product`, `list_product_runs` | List and inspect products and their runs |
| **Pages** | `list_run_pages`, `get_page_summary` | Discovered pages and their finding breakdowns |
| **Test Structure** | `list_test_surfaces`, `list_test_elements`, `get_test_actions`, `get_element_run_details`, `get_element_run_findings` | Navigate the test surface/element/action hierarchy |
| **Scenarios** | `list_scenarios`, `create_scenario`, `delete_scenario` | Manage test scenarios |
| **Environments** | `list_environments` | List test environments for a product |
| **Personas** | `detect_personas`, `list_personas` | AI-detect and list user personas for a product |
| **Sequences** | `generate_sequence`, `list_sequences`, `run_sequence`, `get_sequence_run` | AI-generate, list, run, and monitor test sequences |

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

The MCP server is a thin HTTP client layer. Each tool maps to one or more REST API endpoints. Authentication headers are injected automatically based on configured environment variables.

## Related Projects

- **testomniac_api** -- The Hono backend API this MCP server wraps
- **testomniac_types** -- Shared TypeScript type definitions
- **testomniac_runner_mcp** -- Companion MCP for browser automation (this MCP is for API queries)
- **testomniac_app** -- Web frontend
- **testomniac_runner** -- Server-side test runner worker
- **testomniac_runner_service** -- Shared test execution library

## License

BUSL-1.1
