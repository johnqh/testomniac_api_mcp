import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerSequenceTools(server: McpServer) {
  server.tool(
    "generate_sequence",
    "Have the AI turn a test scenario into an ordered sequence of test interactions, using the pages discovered in one environment. Requires a prior discovery scan and server AI credentials.",
    {
      scenarioId: z
        .number()
        .describe("The test scenario ID to generate a sequence for"),
      testEnvironmentId: z
        .number()
        .describe(
          "The test environment ID (determines which discovered pages are used)"
        ),
    },
    async ({ scenarioId, testEnvironmentId }) =>
      jsonReply(
        await client.post(
          `/api/v1/test-scenarios/${scenarioId}/generate-sequence`,
          { testEnvironmentId }
        )
      )
  );

  server.tool(
    "list_sequences",
    "List the sequences generated for a scenario",
    { scenarioId: z.number().describe("The test scenario ID") },
    async ({ scenarioId }) =>
      jsonReply(
        await client.get(`/api/v1/test-scenarios/${scenarioId}/sequences`)
      )
  );

  server.tool(
    "get_sequence_interactions",
    "List the test interactions in a sequence, in execution order",
    { sequenceId: z.number().describe("The test scenario sequence ID") },
    async ({ sequenceId }) =>
      jsonReply(
        await client.get(
          `/api/v1/test-scenarios/sequences/${sequenceId}/test-interactions`
        )
      )
  );

  server.tool(
    "get_sequence_script",
    "Get a runnable Playwright script for an entire sequence",
    { sequenceId: z.number().describe("The test scenario sequence ID") },
    async ({ sequenceId }) =>
      jsonReply(
        await client.get(
          `/api/v1/test-scenarios/sequences/${sequenceId}/script`
        )
      )
  );

  server.tool(
    "run_sequence",
    "Start a test sequence run. Creates a pending run that a local runner or the server-side runner picks up.",
    { sequenceId: z.number().describe("The test scenario sequence ID to run") },
    async ({ sequenceId }) =>
      jsonReply(
        await client.post("/api/v1/test-scenario-sequence-runs", {
          testScenarioSequenceId: sequenceId,
        })
      )
  );

  server.tool(
    "get_sequence_run",
    "Get the status of one sequence run",
    { sequenceRunId: z.number().describe("The sequence run ID") },
    async ({ sequenceRunId }) =>
      jsonReply(
        await client.get(
          `/api/v1/test-scenarios/sequence-runs/${sequenceRunId}`
        )
      )
  );
}
