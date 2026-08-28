import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerEnvironmentTools(server: McpServer) {
  server.tool(
    "list_environment_pages",
    "List every page discovered in a test environment",
    { environmentId: z.number().describe("The test environment ID") },
    async ({ environmentId }) =>
      jsonReply(
        await client.get(`/api/v1/test-environments/${environmentId}/pages`)
      )
  );

  server.tool(
    "list_environment_test_interactions",
    "List test interactions in an environment, paginated and filterable. An environment can hold tens of thousands, so prefer this over fetching them all.",
    {
      environmentId: z.number().describe("The test environment ID"),
      limit: z.number().optional().describe("Page size, 1-200 (default 50)"),
      offset: z.number().optional().describe("Rows to skip (default 0)"),
      testType: z
        .string()
        .optional()
        .describe("Filter by test type (e.g. 'render', 'form', 'navigation')"),
      priority: z.number().optional().describe("Filter by priority"),
      sizeClass: z
        .string()
        .optional()
        .describe("Filter by viewport class: 'desktop' or 'mobile'"),
      search: z.string().optional().describe("Case-insensitive title substring"),
    },
    async ({ environmentId, ...params }) =>
      jsonReply(
        await client.get(
          `/api/v1/test-environments/${environmentId}/test-interactions/page${client.query(params)}`
        )
      )
  );

}
