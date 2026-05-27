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
    "Create a new test scenario for a runner. The prompt describes what user flow to test (e.g. 'As a shopper, browse products, add to cart, and check out').",
    {
      runnerId: z.number().describe("The runner ID"),
      title: z.string().describe("Scenario title (e.g. 'Shopper adds item to cart')"),
      startingPath: z.string().describe("URL path to start from (e.g. '/')"),
      prompt: z.string().describe("Description of what to test (e.g. 'As a shopper, browse products, add an item to the cart, proceed to checkout')"),
      personaId: z.number().optional().describe("Persona ID to associate with this scenario"),
      sizeClass: z.string().optional().describe("Device class: 'desktop' or 'mobile' (default: desktop)"),
    },
    async ({ runnerId, title, startingPath, prompt, personaId, sizeClass }) => {
      const result = await client.post(`/api/v1/scanner/test-scenarios`, {
        runnerId,
        title,
        startingPath,
        prompt,
        personaId,
        sizeClass,
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
