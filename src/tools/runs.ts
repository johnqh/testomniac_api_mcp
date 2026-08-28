import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

const runId = { runId: z.number().describe("The test run ID") };

export function registerRunTools(server: McpServer) {
  server.tool(
    "get_run_status",
    "Get the status and stats of a test run. Poll this after start_scan.",
    runId,
    async ({ runId }) => jsonReply(await client.get(`/api/v1/runs/${runId}`))
  );

  server.tool(
    "get_run_summary",
    "Get the aggregated summary of a test run with its expertise breakdown",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/summary`))
  );

  server.tool(
    "get_run_dashboard",
    "Get the live dashboard for a run: progress, counters, recent activity and findings in one call. The best single call while a scan is in flight.",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/live-dashboard`))
  );

  server.tool(
    "list_run_findings",
    "List every finding (issue) for a run and its child runs",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/findings`))
  );

  server.tool(
    "get_run_findings_summary",
    "Group a run's findings by the rule that produced them, so repeated instances of one problem collapse into a single row. Use this before list_run_findings on a large run.",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/findings/summary`))
  );

  server.tool(
    "get_run_expertise_summary",
    "Group a run's findings by expertise (accessibility, seo, performance, security, ...)",
    runId,
    async ({ runId }) =>
      jsonReply(
        await client.get(`/api/v1/runs/${runId}/findings/expertise-summary`)
      )
  );

  server.tool(
    "get_run_structure",
    "Get the full execution hierarchy for a run: bundle -> surfaces -> interactions -> interaction runs",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/structure`))
  );

  server.tool(
    "get_navigation_map",
    "Get the site map / page navigation graph for a run",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/navigation-map`))
  );

  server.tool(
    "list_run_personas",
    "List the personas detected during a run",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/personas`))
  );

  server.tool(
    "list_run_scaffolds",
    "List the scaffolds (headers, navs, footers and other repeated page structures) detected during a run",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/scaffolds`))
  );

  server.tool(
    "list_run_patterns",
    "List the UI patterns detected during a run",
    runId,
    async ({ runId }) =>
      jsonReply(await client.get(`/api/v1/runs/${runId}/patterns`))
  );
}
