import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerScenarioTools(server: McpServer) {
  server.tool(
    "list_scenarios",
    "List the test scenarios defined for a runner",
    { runnerId: z.number().describe("The runner ID") },
    async ({ runnerId }) =>
      jsonReply(await client.get(`/api/v1/runners/${runnerId}/test-scenarios`))
  );

  server.tool(
    "get_scenario",
    "Get one test scenario",
    { scenarioId: z.number().describe("The test scenario ID") },
    async ({ scenarioId }) =>
      jsonReply(await client.get(`/api/v1/test-scenarios/${scenarioId}`))
  );

  server.tool(
    "create_scenario",
    "Create a test scenario for a runner. The prompt describes the user flow to test (e.g. 'As a shopper, browse products, add to cart, and check out').",
    {
      runnerId: z.number().describe("The runner ID"),
      title: z
        .string()
        .describe("Scenario title (e.g. 'Shopper adds item to cart')"),
      startingPath: z.string().describe("URL path to start from (e.g. '/')"),
      prompt: z
        .string()
        .describe(
          "What to test (e.g. 'As a shopper, browse products, add an item to the cart, proceed to checkout')"
        ),
      personaId: z
        .number()
        .optional()
        .describe("Persona to run this scenario as"),
      sizeClass: z
        .string()
        .optional()
        .describe("Viewport class: 'desktop' or 'mobile' (default: desktop)"),
    },
    async ({ runnerId, ...body }) =>
      jsonReply(
        await client.post(`/api/v1/runners/${runnerId}/test-scenarios`, body)
      )
  );

  server.tool(
    "update_scenario",
    "Update a test scenario. Only the fields you pass change.",
    {
      runnerId: z.number().describe("The runner ID that owns the scenario"),
      scenarioId: z.number().describe("The test scenario ID"),
      title: z.string().optional().describe("New title"),
      startingPath: z.string().optional().describe("New starting path"),
      prompt: z.string().optional().describe("New prompt"),
      personaId: z.number().optional().describe("New persona"),
      sizeClass: z
        .string()
        .optional()
        .describe("New viewport class: 'desktop' or 'mobile'"),
    },
    async ({ runnerId, scenarioId, ...body }) =>
      jsonReply(
        await client.put(
          `/api/v1/runners/${runnerId}/test-scenarios/${scenarioId}`,
          body
        )
      )
  );

  server.tool(
    "delete_scenario",
    "Delete a test scenario",
    {
      runnerId: z.number().describe("The runner ID that owns the scenario"),
      scenarioId: z.number().describe("The test scenario ID"),
    },
    async ({ runnerId, scenarioId }) =>
      jsonReply(
        await client.del(
          `/api/v1/runners/${runnerId}/test-scenarios/${scenarioId}`
        )
      )
  );

  server.tool(
    "detect_scenarios",
    "Have the AI propose test scenarios for a product from its discovered pages, and persist the new ones. Requires a prior discovery scan and server AI credentials.",
    { productId: z.number().describe("The product ID") },
    async ({ productId }) =>
      jsonReply(await client.post("/api/v1/test-scenarios/detect", { productId }))
  );
}
