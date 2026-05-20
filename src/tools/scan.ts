import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerScanTools(server: McpServer) {
  server.tool(
    "start_scan",
    "Start a discovery scan for a URL. Returns a run ID to track progress.",
    { url: z.string().describe("The URL to scan") },
    async ({ url }) => {
      const result = await client.post("/api/v1/scan", { url });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
