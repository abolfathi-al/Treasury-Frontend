const figmaApiToken = process.env.FIGMA_API_TOKEN || '';
const figmaFileKey = process.env.FIGMA_FILE_KEY || 'Cursor integration';
const figmaMcpServerPort = process.env.FIGMA_MCP_SERVER_PORT || 3333;
const figmaMcpServerHost = process.env.FIGMA_MCP_SERVER_HOST || '127.0.0.1';

const FIGMA_CONFIG = {
  apiToken: figmaApiToken,
  fileKey: figmaFileKey,
  mcp: {
    serverUrl: `http://${figmaMcpServerHost}:${figmaMcpServerPort}/mcp`,
    serverPort: figmaMcpServerPort,
    serverHost: figmaMcpServerHost,
    config: {
      mcpServers: {
        'figma-desktop': {
          url: `http://${figmaMcpServerHost}:${figmaMcpServerPort}/mcp`
        }
      }
    }
  }
};

module.exports = {
  FIGMA_CONFIG,
  FIGMA_API_TOKEN: FIGMA_CONFIG.apiToken,
  FIGMA_FILE_KEY: FIGMA_CONFIG.fileKey,
  FIGMA_MCP_SERVER_URL: FIGMA_CONFIG.mcp.serverUrl,
  FIGMA_MCP_SERVER_CONFIG: FIGMA_CONFIG.mcp.config
};
