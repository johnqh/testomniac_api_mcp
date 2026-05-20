import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerTestStructureTools(server: McpServer) {
  server.tool(
    "list_test_surfaces",
    "List test surfaces for a runner",
    { runnerId: z.number().describe("The runner ID") },
    async ({ runnerId }) => {
      const result = await client.get(`/api/v1/runners/${runnerId}/test-surfaces`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_test_elements",
    "List test elements (interactions) in a surface",
    { surfaceId: z.number().describe("The test surface ID") },
    async ({ surfaceId }) => {
      const result = await client.get(`/api/v1/test-surfaces/${surfaceId}/cases`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_test_actions",
    "Get step-by-step actions for a test element",
    { elementId: z.number().describe("The test element ID") },
    async ({ elementId }) => {
      const result = await client.get(`/api/v1/test-interactions/${elementId}/actions`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_element_run_details",
    "Get details and findings for a specific element run",
    { elementRunId: z.number().describe("The test element run ID") },
    async ({ elementRunId }) => {
      const result = await client.get(`/api/v1/test-interaction-runs/${elementRunId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_element_run_findings",
    "Get findings for a specific element run",
    { elementRunId: z.number().describe("The test element run ID") },
    async ({ elementRunId }) => {
      const result = await client.get(
        `/api/v1/test-interaction-runs/${elementRunId}/findings`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
