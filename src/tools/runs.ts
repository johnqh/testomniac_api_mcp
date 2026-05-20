import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerRunTools(server: McpServer) {
  server.tool(
    "get_run_status",
    "Get current status and stats of a test run",
    { runId: z.number().describe("The test run ID") },
    async ({ runId }) => {
      const result = await client.get(`/api/v1/runs/${runId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_run_summary",
    "Get aggregated summary of a test run with expertise breakdown",
    { runId: z.number().describe("The test run ID") },
    async ({ runId }) => {
      const result = await client.get(`/api/v1/runs/${runId}/summary`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_run_findings",
    "List all findings (issues) for a run and its child runs",
    { runId: z.number().describe("The test run ID") },
    async ({ runId }) => {
      const result = await client.get(`/api/v1/runs/${runId}/findings`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_run_structure",
    "Get the full test hierarchy: bundle -> surfaces -> elements -> runs",
    { runId: z.number().describe("The test run ID") },
    async ({ runId }) => {
      const result = await client.get(`/api/v1/runs/${runId}/structure`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_navigation_map",
    "Get the site map / page navigation graph for a run",
    { runId: z.number().describe("The test run ID") },
    async ({ runId }) => {
      const result = await client.get(`/api/v1/runs/${runId}/navigation-map`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
