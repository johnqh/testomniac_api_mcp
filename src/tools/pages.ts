import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerPageTools(server: McpServer) {
  server.tool(
    "list_run_pages",
    "List the pages discovered during a run, each with its finding counts",
    { runId: z.number().describe("The test run ID") },
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/pages-summary`))
  );

  server.tool(
    "get_page_summary",
    "Get the detailed findings breakdown for one page in a run",
    {
      runId: z.number().describe("The test run ID"),
      pageId: z.number().describe("The page ID"),
    },
    async ({ runId, pageId }) =>
      jsonReply(
        await client.get(`/api/v1/runs/${runId}/pages/${pageId}/summary`)
      )
  );

  server.tool(
    "list_page_states",
    "List the captured states of a page. A page has one state per distinct rendering (logged out, menu open, ...).",
    { pageId: z.number().describe("The page ID") },
    async ({ pageId }) =>
      jsonReply(await client.get(`/api/v1/pages/${pageId}/states`))
  );

}
