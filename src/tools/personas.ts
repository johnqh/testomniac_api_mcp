import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as client from "../client.ts";

export function registerPersonaTools(server: McpServer) {
  server.tool(
    "detect_personas",
    "Detect user personas for a product using AI analysis of discovered pages. Requires a prior discovery scan. Returns generated personas with titles and descriptions.",
    {
      productId: z.number().describe("The product ID to detect personas for"),
    },
    async ({ productId }) => {
      const result = await client.post(`/api/v1/scanner/personas/detect`, {
        productId,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "list_personas",
    "List detected personas for a product",
    {
      productId: z.number().describe("The product ID"),
    },
    async ({ productId }) => {
      const result = await client.get(
        `/api/v1/scanner/personas?productId=${productId}`
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
