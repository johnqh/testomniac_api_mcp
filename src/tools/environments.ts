import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerEnvironmentTools(server: McpServer) {
  server.tool(
    "list_environments",
    "List test environments for a product",
    { productId: z.number().describe("The product ID") },
    async ({ productId }) => {
      const result = await client.get(
        `/api/v1/products/${productId}/environments`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
