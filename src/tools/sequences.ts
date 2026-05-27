import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerSequenceTools(server: McpServer) {
  server.tool(
    "generate_sequence",
    "AI-generate a test sequence from a test scenario. Analyzes discovered pages and creates ordered test steps. Requires a prior discovery scan.",
    {
      scenarioId: z
        .number()
        .describe("The test scenario ID to generate a sequence for"),
      testEnvironmentId: z
        .number()
        .describe(
          "The test environment ID (determines which discovered pages to use)"
        ),
    },
    async ({ scenarioId, testEnvironmentId }) => {
      const result = await client.post(
        `/api/v1/scanner/test-scenarios/${scenarioId}/generate-sequence`,
        { testEnvironmentId }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "list_sequences",
    "List test sequences for a scenario",
    {
      scenarioId: z.number().describe("The test scenario ID"),
    },
    async ({ scenarioId }) => {
      const result = await client.get(
        `/api/v1/test-scenarios/${scenarioId}/sequences`
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "run_sequence",
    "Start a test sequence run. Creates a pending run that can be executed locally via execute_sequence or picked up by a server-side runner.",
    {
      sequenceId: z.number().describe("The test scenario sequence ID to run"),
    },
    async ({ sequenceId }) => {
      const result = await client.post(
        `/api/v1/scanner/test-scenario-sequence-runs`,
        { testScenarioSequenceId: sequenceId }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "get_sequence_run",
    "Get the status of a test sequence run",
    {
      runId: z.number().describe("The sequence run ID"),
    },
    async ({ runId }) => {
      const result = await client.get(
        `/api/v1/scanner/test-scenario-sequence-runs/${runId}`
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
