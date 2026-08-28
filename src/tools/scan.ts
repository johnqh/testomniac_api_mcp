import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerScanTools(server: McpServer) {
  server.tool(
    "start_scan",
    "Start a discovery scan for a URL. Bootstraps the product, environment, runner and root test run, then returns testRunId/productId/runnerId/testEnvironmentId. Poll get_run_status with the returned testRunId to follow progress.",
    {
      url: z.string().describe("The URL to scan"),
      productId: z
        .number()
        .optional()
        .describe("Scan an existing product instead of resolving one from the URL"),
      testEnvironmentId: z
        .number()
        .optional()
        .describe("Scan an existing test environment"),
      scanMode: z
        .enum(["full", "partial", "minimum"])
        .optional()
        .describe(
          "How much to execute: 'minimum' discovers only, 'partial' runs a subset, 'full' runs everything (default)"
        ),
      quickScan: z
        .boolean()
        .optional()
        .describe("Shallow single-pass scan"),
      sizeClass: z
        .string()
        .optional()
        .describe("Viewport class: 'desktop' or 'mobile'"),
      scanScopePath: z
        .string()
        .optional()
        .describe("Restrict discovery to URLs under this path (e.g. '/docs')"),
      expertiseSlugs: z
        .array(z.string())
        .optional()
        .describe(
          "Limit the checks to these expertises (e.g. ['accessibility', 'seo'])"
        ),
      environmentLabel: z
        .string()
        .optional()
        .describe("Human label for the environment (e.g. 'staging')"),
      environmentKind: z
        .string()
        .optional()
        .describe("Environment kind (e.g. 'local', 'shared')"),
      loginUrl: z
        .string()
        .optional()
        .describe("URL of the login page, if the app needs authenticating"),
      entityCredentialId: z
        .number()
        .optional()
        .describe("Stored entity credential to log in with"),
      reportEmail: z
        .string()
        .optional()
        .describe("Email to send the finished report to"),
      captureApi: z
        .boolean()
        .optional()
        .describe(
          "Send the app's API traffic to the graph service. Off unless explicitly asked for — request and response bodies leave the runner."
        ),
    },
    async args => jsonReply(await client.post("/api/v1/scan", args))
  );
}
