import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerFindingTools(server: McpServer) {
  server.tool(
    "get_finding_detail",
    "Get everything about a finding: its description, the interaction that triggered it, the full dependency chain, and a ready-to-run Playwright script that reproduces it. The script replays all prerequisite interactions in execution order.",
    { findingId: z.number().describe("The finding ID") },
    async ({ findingId }) =>
      jsonReply(
        await client.get(`/api/v1/test-run-findings/${findingId}/reproduce`)
      )
  );

  server.tool(
    "get_finding_script",
    "Get just the Playwright reproduction script for a finding, without the surrounding context get_finding_detail returns",
    { findingId: z.number().describe("The finding ID") },
    async ({ findingId }) =>
      jsonReply(
        await client.get(`/api/v1/test-run-findings/${findingId}/script`)
      )
  );

  server.tool(
    "list_runner_findings",
    "List every finding recorded for a runner across all its runs, newest first",
    { runnerId: z.number().describe("The runner ID") },
    async ({ runnerId }) =>
      jsonReply(await client.get(`/api/v1/runners/${runnerId}/findings`))
  );

  server.tool(
    "list_expertises",
    "List the expertises (accessibility, seo, performance, security, ...) the server evaluates. Their slugs are what start_scan's expertiseSlugs accepts.",
    {},
    async () => jsonReply(await client.get("/api/v1/expertises"))
  );

}
