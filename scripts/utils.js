#!/usr/bin/env node

/**
 * Shared Utilities for Build Scripts
 * 
 * Common functions and utilities used across all build scripts.
 * Provides consistent error handling, logging, and validation.
 * 
 * @author Angular 20 Upgrade
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Common configuration constants
 */
const CONSTANTS = {
  // Common paths
  DIST_PATH: './dist/velora/browser',
  SRC_PATH: './src',
  ASSETS_PATH: './src/assets',
  
  // Browser support - Angular 20 compatible
  BROWSERSLIST: ['Chrome >= 120', 'Firefox >= 115', 'Safari >= 16', 'Edge >= 120'],
  
  // Common file patterns
  PATTERNS: {
    CSS: '**/*.css',
    JS: '**/*.js',
    HTML: '**/*.html',
    TS: '**/*.ts',
    SCSS: '**/*.scss',
    MAP: '**/*.map'
  },
  
  // Common exclusions
  EXCLUDE_PATTERNS: [
    '**/*.map',
    '**/*.gz',
    '**/*.br',
    '**/*.zst',
    '**/node_modules/**',
    '**/.git/**',
    '**/Thumbs.db',
    '**/.DS_Store'
  ]
};

/**
 * Validates that a directory exists
 * @param {string} dirPath - Path to validate
 * @param {string} name - Human-readable name for error messages
 * @throws {Error} If directory doesn't exist
 */
function validateDirectory(dirPath, name = 'Directory') {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`${name} not found: ${dirPath}`);
  }
  console.log(`✅ ${name} validation passed: ${dirPath}`);
}

/**
 * Validates that a file exists
 * @param {string} filePath - Path to validate
 * @param {string} name - Human-readable name for error messages
 * @throws {Error} If file doesn't exist
 */
function validateFile(filePath, name = 'File') {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${name} not found: ${filePath}`);
  }
  console.log(`✅ ${name} validation passed: ${filePath}`);
}

/**
 * Safely creates a directory if it doesn't exist
 * @param {string} dirPath - Path to create
 * @param {boolean} recursive - Whether to create parent directories
 */
function ensureDirectory(dirPath, recursive = true) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

/**
 * Safely removes a directory
 * @param {string} dirPath - Path to remove
 * @param {boolean} force - Whether to force removal
 */
function removeDirectory(dirPath, force = true) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force });
    console.log(`🗑️  Removed directory: ${dirPath}`);
  }
}

/**
 * Gets file size in human-readable format
 * @param {string} filePath - Path to file
 * @returns {string} Human-readable file size
 */
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const bytes = stats.size;
  
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Lists files in a directory with their sizes
 * @param {string} dirPath - Directory to list
 * @param {string} extension - File extension filter (e.g., '.css')
 * @returns {Array} Array of file objects with name and size
 */
function listFilesWithSizes(dirPath, extension = null) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  
  const files = fs.readdirSync(dirPath);
  const filteredFiles = extension 
    ? files.filter(file => file.endsWith(extension))
    : files;
  
  return filteredFiles.map(file => {
    const filePath = path.join(dirPath, file);
    return {
      name: file,
      size: getFileSize(filePath),
      path: filePath
    };
  });
}

/**
 * Executes a command with consistent error handling
 * @param {string} command - Command to execute
 * @param {Object} options - Execution options
 * @throws {Error} If command fails
 */
function executeCommand(command, options = {}) {
  const defaultOptions = {
    stdio: 'inherit',
    cwd: process.cwd()
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    execSync(command, finalOptions);
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

/**
 * Logs a section header with consistent formatting
 * @param {string} title - Section title
 * @param {string} emoji - Emoji for the section
 */
function logSection(title, emoji = '🚀') {
  console.log('');
  console.log(`${emoji} ${title}`);
  console.log('─'.repeat(title.length + 3));
}

/**
 * Logs configuration information
 * @param {Object} config - Configuration object to log
 * @param {string} title - Configuration title
 */
function logConfig(config, title = 'Configuration') {
  console.log(`📋 ${title}:`);
  Object.entries(config).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      console.log(`   ${key}:`);
      Object.entries(value).forEach(([subKey, subValue]) => {
        console.log(`     ${subKey}: ${subValue}`);
      });
    } else {
      console.log(`   ${key}: ${value}`);
    }
  });
  console.log('');
}

/**
 * Logs file information in a consistent format
 * @param {Array} files - Array of file objects with name and size
 * @param {string} title - Title for the file list
 */
function logFiles(files, title = 'Generated Files') {
  if (files.length > 0) {
    console.log(`📄 ${title}:`);
    files.forEach(file => {
      console.log(`   📄 ${file.name} (${file.size})`);
    });
  }
}

/**
 * Handles script errors with consistent formatting
 * @param {Error} error - Error to handle
 * @param {string} context - Context where error occurred
 */
function handleError(error, context = 'Script execution') {
  console.error('');
  console.error(`❌ ${context} failed:`);
  console.error(`   ${error.message}`);
  console.error('');
  process.exit(1);
}

/**
 * Validates that required tools are available
 * @param {Array} tools - Array of tool names to check
 * @throws {Error} If any tool is not available
 */
function validateTools(tools) {
  tools.forEach(tool => {
    try {
      execSync(`which ${tool}`, { stdio: 'ignore' });
      console.log(`✅ ${tool} is available`);
    } catch (error) {
      throw new Error(`Required tool not found: ${tool}`);
    }
  });
}

module.exports = {
  CONSTANTS,
  validateDirectory,
  validateFile,
  ensureDirectory,
  removeDirectory,
  getFileSize,
  listFilesWithSizes,
  executeCommand,
  logSection,
  logConfig,
  logFiles,
  handleError,
  validateTools
};
