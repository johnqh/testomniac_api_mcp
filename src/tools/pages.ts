import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerPageTools(server: McpServer) {
  server.tool(
    "list_run_pages",
    "List pages discovered during a run with finding counts",
    { runId: z.number().describe("The test run ID") },
    async ({ runId }) => {
      const result = await client.get(`/api/v1/runs/${runId}/pages-summary`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_page_summary",
    "Get detailed findings breakdown for a specific page in a run",
    {
      runId: z.number().describe("The test run ID"),
      pageId: z.number().describe("The page ID"),
    },
    async ({ runId, pageId }) => {
      const result = await client.get(`/api/v1/runs/${runId}/pages/${pageId}/summary`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
