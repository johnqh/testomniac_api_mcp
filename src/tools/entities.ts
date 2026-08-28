import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";
import { jsonReply } from "../reply.ts";

export function registerEntityTools(server: McpServer) {
  server.tool(
    "list_entities",
    "List the entities (workspaces) the caller belongs to, with their role. Start here when you do not yet know an entity slug or id. Needs TESTOMNIAC_AUTH_TOKEN — entity membership is per user, so API-key auth returns nothing here.",
    {},
    async () => jsonReply(await client.get("/api/v1/entities"))
  );

  server.tool(
    "list_products",
    "List products within an entity",
    { entitySlug: z.string().describe("The entity slug, from list_entities") },
    async ({ entitySlug }) =>
      jsonReply(
        await client.get(
          `/api/v1/entities/${encodeURIComponent(entitySlug)}/products`
        )
      )
  );

  server.tool(
    "resolve_product_by_url",
    "Find the product and test environment in an entity whose base URL matches the given URL. Returns null when nothing matches.",
    {
      entityId: z.string().describe("The entity ID (not the slug)"),
      url: z.string().describe("The URL to match against environment base URLs"),
    },
    async ({ entityId, url }) =>
      jsonReply(
        await client.get(
          `/api/v1/products/resolve-by-url${client.query({ entityId, url })}`
        )
      )
  );
}
