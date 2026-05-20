#!/usr/bin/env bun
/**
 * Testomniac API MCP Server
 *
 * Exposes Testomniac API operations as MCP tools for AI assistants.
 * Communicates with the running Testomniac API over HTTP.
 *
 * Environment variables:
 *   TESTOMNIAC_API_URL   - Base URL of the API (e.g., http://localhost:8027)
 *   TESTOMNIAC_AUTH_TOKEN - Firebase Bearer token for user-facing routes
 *   TESTOMNIAC_API_KEY   - API key for scanner routes
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { configure } from "./client.ts";
import { registerScanTools } from "./tools/scan.ts";
import { registerRunTools } from "./tools/runs.ts";
import { registerProductTools } from "./tools/products.ts";
import { registerPageTools } from "./tools/pages.ts";
import { registerTestStructureTools } from "./tools/test-structure.ts";
import { registerScenarioTools } from "./tools/scenarios.ts";
import { registerEnvironmentTools } from "./tools/environments.ts";

const apiUrl = process.env["TESTOMNIAC_API_URL"];
const authToken = process.env["TESTOMNIAC_AUTH_TOKEN"];
const apiKey = process.env["TESTOMNIAC_API_KEY"];

if (!apiUrl) {
  console.error("TESTOMNIAC_API_URL environment variable is required");
  process.exit(1);
}

if (!authToken && !apiKey) {
  console.error(
    "At least one of TESTOMNIAC_AUTH_TOKEN or TESTOMNIAC_API_KEY is required"
  );
  process.exit(1);
}

// Configure the HTTP client
configure({ apiUrl, authToken, apiKey });

// Create the MCP server
const server = new McpServer({
  name: "testomniac-api",
  version: "0.1.0",
});

// Register all tool groups
registerScanTools(server);
registerRunTools(server);
registerProductTools(server);
registerPageTools(server);
registerTestStructureTools(server);
registerScenarioTools(server);
registerEnvironmentTools(server);

// Start stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
