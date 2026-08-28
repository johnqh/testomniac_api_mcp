import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerPersonaTools(server: McpServer) {
  server.tool(
    "list_personas",
    "List the personas detected for a product",
    { productId: z.number().describe("The product ID") },
    async ({ productId }) =>
      jsonReply(await client.get(`/api/v1/personas${client.query({ productId })}`))
  );

  server.tool(
    "detect_personas",
    "Detect user personas for a product by having the AI read the discovered pages. Requires a prior discovery scan, and the server must have its AI credentials configured.",
    { productId: z.number().describe("The product ID to detect personas for") },
    async ({ productId }) =>
      jsonReply(await client.post("/api/v1/personas/detect", { productId }))
  );

}
