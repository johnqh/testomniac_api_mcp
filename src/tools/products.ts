import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerProductTools(server: McpServer) {
  server.tool(
    "get_product",
    "Get product details including its runners",
    { productId: z.number().describe("The product ID") },
    async ({ productId }) =>
      jsonReply(await client.get(`/api/v1/products/${productId}`))
  );

  server.tool(
    "list_environments",
    "List test environments for a product. Most scan data is scoped to an environment, so this is usually the second call after get_product.",
    { productId: z.number().describe("The product ID") },
    async ({ productId }) =>
      jsonReply(await client.get(`/api/v1/products/${productId}/environments`))
  );

  server.tool(
    "list_product_runs",
    "List root test runs for a product, newest first",
    { productId: z.number().describe("The product ID") },
    async ({ productId }) =>
      jsonReply(await client.get(`/api/v1/products/${productId}/runs`))
  );

}
