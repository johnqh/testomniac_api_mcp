import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerTestStructureTools(server: McpServer) {
  server.tool(
    "list_test_surfaces",
    "List the test surfaces belonging to a runner",
    { runnerId: z.number().describe("The runner ID") },
    async ({ runnerId }) =>
      jsonReply(await client.get(`/api/v1/runners/${runnerId}/test-surfaces`))
  );

  server.tool(
    "list_surface_interactions",
    "List the active test interactions in a surface",
    { surfaceId: z.number().describe("The test surface ID") },
    async ({ surfaceId }) =>
      jsonReply(
        await client.get(`/api/v1/test-surfaces/${surfaceId}/interactions`)
      )
  );

  server.tool(
    "get_test_interaction",
    "Get one test interaction in full, including its steps",
    { interactionId: z.number().describe("The test interaction ID") },
    async ({ interactionId }) =>
      jsonReply(await client.get(`/api/v1/test-interactions/${interactionId}`))
  );

  server.tool(
    "get_test_actions",
    "Get the step-by-step actions of a test interaction",
    { interactionId: z.number().describe("The test interaction ID") },
    async ({ interactionId }) =>
      jsonReply(
        await client.get(`/api/v1/test-interactions/${interactionId}/actions`)
      )
  );

  server.tool(
    "get_interaction_run",
    "Get one test interaction run: its status, timing and result",
    { interactionRunId: z.number().describe("The test interaction run ID") },
    async ({ interactionRunId }) =>
      jsonReply(
        await client.get(`/api/v1/test-interaction-runs/${interactionRunId}`)
      )
  );

  server.tool(
    "get_interaction_run_findings",
    "List the findings raised by one test interaction run",
    { interactionRunId: z.number().describe("The test interaction run ID") },
    async ({ interactionRunId }) =>
      jsonReply(
        await client.get(
          `/api/v1/test-interaction-runs/${interactionRunId}/findings`
        )
      )
  );

  server.tool(
    "list_surface_run_interaction_runs",
    "List the interaction runs inside a surface run",
    { surfaceRunId: z.number().describe("The test surface run ID") },
    async ({ surfaceRunId }) =>
      jsonReply(
        await client.get(
          `/api/v1/test-surface-runs/${surfaceRunId}/interaction-runs`
        )
      )
  );

  server.tool(
    "get_interaction_script",
    "Get a runnable Playwright script for one test interaction, with its prerequisite interactions replayed in order",
    { interactionId: z.number().describe("The test interaction ID") },
    async ({ interactionId }) =>
      jsonReply(
        await client.get(`/api/v1/test-interactions/${interactionId}/script`)
      )
  );

  server.tool(
    "get_surface_script",
    "Get a runnable Playwright script covering every interaction in a surface",
    { surfaceId: z.number().describe("The test surface ID") },
    async ({ surfaceId }) =>
      jsonReply(await client.get(`/api/v1/test-surfaces/${surfaceId}/script`))
  );
}
