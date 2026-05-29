import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerProductTools(server: McpServer) {
  server.tool(
    "list_products",
    "List products the user has access to within an entity",
    { entitySlug: z.string().describe("The entity slug") },
    async ({ entitySlug }) => {
      const result = await client.get(
        `/api/v1/entities/${encodeURIComponent(entitySlug)}/products`
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_product",
    "Get product details including its runners",
    { productId: z.number().describe("The product ID") },
    async ({ productId }) => {
      const result = await client.get(`/api/v1/products/${productId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_product_runs",
    "List root test runs for a product",
    { productId: z.number().describe("The product ID") },
    async ({ productId }) => {
      const result = await client.get(`/api/v1/products/${productId}/runs`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
