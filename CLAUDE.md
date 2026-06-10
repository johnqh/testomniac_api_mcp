# Testomniac API MCP Server

MCP (Model Context Protocol) server that exposes the Testomniac API to AI assistants like Claude Code and Claude Desktop.

**Package**: `@sudobility/testomniac_api_mcp` (private, BUSL-1.1)

## Tech Stack

- **Runtime**: Bun
- **Package Manager**: Bun
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Validation**: Zod
- **Transport**: stdio

## Architecture

```
AI Assistant (Claude Code/Desktop)
    ↕ stdio (MCP protocol)
Testomniac API MCP Server (this project)
    ↕ HTTP/REST
Testomniac API (Hono, port 8027)
```

The MCP server is a thin HTTP client that translates MCP tool calls into REST API requests.

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
├── client.ts      # HTTP client wrapper (auth headers, error handling)
└── tools/
    ├── scan.ts           # start_scan
    ├── runs.ts           # get_run_status, get_run_summary, list_run_findings, get_run_structure, get_navigation_map
    ├── products.ts       # list_products, get_product, list_product_runs
    ├── pages.ts          # list_run_pages, get_page_summary
    ├── test-structure.ts # list_test_surfaces, list_test_elements, get_test_actions, get_element_run_details, get_element_run_findings
    ├── scenarios.ts      # list_scenarios, create_scenario, delete_scenario
    ├── environments.ts   # list_environments
    ├── personas.ts       # detect_personas, list_personas
    └── sequences.ts      # generate_sequence, list_sequences, run_sequence, get_sequence_run
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TESTOMNIAC_API_URL` | Yes | Base URL of the API (e.g., `http://localhost:8027`) |
| `TESTOMNIAC_AUTH_TOKEN` | No* | Firebase Bearer token for user-facing routes |
| `TESTOMNIAC_API_KEY` | No* | API key for scanner routes |

*At least one auth method required.

## Tools (26)

### Scan & Runs
- `start_scan` — Start a discovery scan for a URL
- `get_run_status` — Get current status of a test run
- `get_run_summary` — Aggregated summary with expertise breakdown
- `list_run_findings` — All findings for a run
- `get_run_structure` — Full test hierarchy
- `get_navigation_map` — Site map / page navigation graph

### Products
- `list_products` — Products the user has access to
- `get_product` — Product details with runners
- `list_product_runs` — Root test runs for a product

### Pages
- `list_run_pages` — Pages discovered with finding counts
- `get_page_summary` — Detailed page findings breakdown

### Test Structure
- `list_test_surfaces` — Test surfaces for a runner
- `list_test_elements` — Test elements in a surface
- `get_test_actions` — Step-by-step actions for a test element
- `get_element_run_details` — Element run details
- `get_element_run_findings` — Findings for an element run

### Scenarios
- `list_scenarios` — Test scenarios for a runner
- `create_scenario` — Create a new test scenario
- `delete_scenario` — Delete a test scenario

### Environments
- `list_environments` — Test environments for a product

### Personas
- `detect_personas` — AI-detect user personas for a product using page analysis
- `list_personas` — List detected personas for a product

### Sequences
- `generate_sequence` — AI-generate a test sequence from a scenario
- `list_sequences` — List test sequences for a scenario
- `run_sequence` — Start a test sequence run
- `get_sequence_run` — Get status of a sequence run

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

## Related Projects

- **testomniac_api** — The Hono API this MCP wraps
- **testomniac_types** — Shared type definitions (`@sudobility/testomniac_types`)
- **testomniac_runner_mcp** — Companion MCP for browser automation (this MCP is for API queries)
- **testomniac_app** — Web frontend
- **testomniac_runner** — Server-side test runner worker
- **testomniac_runner_service** — Shared test execution library
