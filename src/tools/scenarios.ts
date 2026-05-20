import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerScenarioTools(server: McpServer) {
  server.tool(
    "list_scenarios",
    "List test scenarios for a runner",
    { runnerId: z.number().describe("The runner ID") },
    async ({ runnerId }) => {
      const result = await client.get(`/api/v1/runners/${runnerId}/test-scenarios`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "create_scenario",
    "Create a new test scenario",
    {
      runnerId: z.number().describe("The runner ID"),
      title: z.string().describe("Scenario title"),
      description: z.string().optional().describe("Scenario description"),
    },
    async ({ runnerId, title, description }) => {
      const result = await client.post(`/api/v1/scanner/test-scenarios`, {
        runnerId,
        title,
        description,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_scenario",
    "Delete a test scenario",
    { scenarioId: z.number().describe("The test scenario ID") },
    async ({ scenarioId }) => {
      const result = await client.del(`/api/v1/scanner/test-scenarios/${scenarioId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
