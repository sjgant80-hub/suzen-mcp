#!/usr/bin/env node
// suzen-mcp · MCP stdio server wrapping suzen-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'suzen-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'suzen_set_status',
    description: 'setStatus · from suzen-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { setStatus } = await import('@ai-native-solutions/suzen-sdk');
      return typeof setStatus === 'function' ? await setStatus(args) : { error: 'setStatus not callable' };
    }
  },
  {
    name: 'suzen_fetch_json',
    description: 'fetchJson · from suzen-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { fetchJson } = await import('@ai-native-solutions/suzen-sdk');
      return typeof fetchJson === 'function' ? await fetchJson(args) : { error: 'fetchJson not callable' };
    }
  },
  {
    name: 'suzen_fetch_text',
    description: 'fetchText · from suzen-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { fetchText } = await import('@ai-native-solutions/suzen-sdk');
      return typeof fetchText === 'function' ? await fetchText(args) : { error: 'fetchText not callable' };
    }
  },
  {
    name: 'suzen_norm_url',
    description: 'normUrl · from suzen-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { normUrl } = await import('@ai-native-solutions/suzen-sdk');
      return typeof normUrl === 'function' ? await normUrl(args) : { error: 'normUrl not callable' };
    }
  },
  {
    name: 'suzen_reading',
    description: 'reading · from suzen-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { reading } = await import('@ai-native-solutions/suzen-sdk');
      return typeof reading === 'function' ? await reading(args) : { error: 'reading not callable' };
    }
  },
  {
    name: 'suzen_ask',
    description: 'ask · from suzen-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { ask } = await import('@ai-native-solutions/suzen-sdk');
      return typeof ask === 'function' ? await ask(args) : { error: 'ask not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('suzen-mcp v1.0.0 · stdio ready');
