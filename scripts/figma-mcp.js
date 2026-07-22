#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const figmaConfig = require('../figma-config.js');

let figmaApiKey = figmaConfig.FIGMA_API_TOKEN;

if (!figmaApiKey) {
  console.error('Figma API token not found. Please set FIGMA_API_TOKEN environment variable.');
  console.error('Example: export FIGMA_API_TOKEN="your_api_token_here"');
  process.exit(1);
}

const args = process.argv.slice(2);
const mode = args[0] || 'http';

function getServerConfig(serverMode) {
  switch (serverMode) {
    case 'stdio':
      return {
        command: 'npx',
        commandArgs: ['figma-developer-mcp', '--figma-api-key', figmaApiKey, '--stdio']
      };
    case 'dev':
    case 'development':
      return {
        command: 'npx',
        commandArgs: ['figma-developer-mcp', '--figma-api-key', figmaApiKey, '--port', figmaConfig.FIGMA_CONFIG.mcp.serverPort.toString()]
      };
    case 'stop':
      return null;
    case 'http':
    default:
      return {
        command: 'npx',
        commandArgs: ['figma-developer-mcp', '--figma-api-key', figmaApiKey, '--port', figmaConfig.FIGMA_CONFIG.mcp.serverPort.toString()]
      };
  }
}

function stopServer() {
  console.log('Stopping Figma MCP server...');
  const { exec } = require('child_process');
  exec('pkill -f "figma-developer-mcp" || true', (error) => {
    if (error) {
      console.log('No running Figma MCP server found');
    } else {
      console.log('Figma MCP server stopped');
    }
  });
  process.exit(0);
}

function startServer(serverMode) {
  if (serverMode === 'stop') {
    stopServer();
    return;
  }

  const config = getServerConfig(serverMode);
  if (!config) {
    console.error(`Invalid server mode: ${serverMode}`);
    process.exit(1);
  }

  console.log(`Starting Figma MCP server in ${serverMode} mode...`);
  console.log(`Server URL: ${figmaConfig.FIGMA_MCP_SERVER_URL}`);
  console.log(`Using API key: ${figmaApiKey.substring(0, 8)}...${figmaApiKey.substring(figmaApiKey.length - 4)}`);

  const child = spawn(config.command, config.commandArgs, {
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error('Failed to start Figma MCP server:', error);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Figma MCP server exited with code ${code}`);
      process.exit(code);
    }
  });

  process.on('SIGINT', () => {
    console.log('\nShutting down Figma MCP server...');
    child.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down Figma MCP server...');
    child.kill('SIGTERM');
    process.exit(0);
  });
}

if (require.main === module) {
  startServer(mode);
}

module.exports = { startServer, stopServer, getServerConfig };
