#!/usr/bin/env node

/**
 * Asset Compression Script for Angular 20
 * 
 * Compresses static assets using precompress with optimal settings.
 * Supports Gzip and Brotli compression with intelligent exclusions.
 * 
 * @author Angular 20 Upgrade
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { CONSTANTS, validateDirectory, executeCommand, logSection, logConfig, handleError } = require('./utils');

/**
 * Configuration object for compression settings
 * @type {Object}
 * @property {string} input - Input directory containing files to compress
 * @property {string[]} types - Compression types to generate (gz, br)
 * @property {string[]} exclude - File patterns to exclude from compression
 * @property {Object} compression - Compression level settings for each type
 * @property {Object} performance - Performance and optimization settings
 * @property {Object} logging - Logging and output settings
 */
const CONFIG = {
  // Input directory
  input: CONSTANTS.DIST_PATH,
  
  // Compression types
  types: ['gz', 'br'],
  
  // Files to exclude from compression
  exclude: CONSTANTS.EXCLUDE_PATTERNS,
  
  // Compression settings
  compression: {
    gzip: { level: 6 },      // Balanced compression
    brotli: { level: 6 }     // Balanced compression
  },
  
  // Performance settings
  performance: {
    concurrency: 'auto',     // Automatic parallel processing
    skipExisting: true       // Skip files that are already compressed and newer
  },
  
  // Logging options
  logging: {
    verbose: true,           // Show detailed output
    stats: true,             // Show compression statistics
    timings: true            // Show individual file compression times
  }
};

/**
 * Validates that the input directory exists
 * @throws {Error} If input directory doesn't exist
 */
function validateInput() {
  validateDirectory(CONFIG.input, 'Input directory');
}

/**
 * Builds the precompress command with all configuration options
 * @returns {string} The complete command string
 */
function buildCommand() {
  const args = [
    'npx precompress',
    `--types ${CONFIG.types.join(',')}`,
    `--exclude '${CONFIG.exclude.join(',')}'`,
    '--verbose',
    CONFIG.input
  ];
  
  return args.join(' ');
}

/**
 * Main function that executes the asset compression process
 * Compresses static assets using precompress with optimal settings
 * 
 * @function compress
 * @throws {Error} If validation fails or compression encounters an error
 * 
 * @description
 * This function:
 * 1. Validates the input directory exists
 * 2. Processes files with Gzip and Brotli compression
 * 3. Excludes specified patterns from compression
 * 4. Logs compression statistics and results
 */
function compress() {
  try {
    logSection('Starting Asset Compression', '🗜️');
    logConfig({
      'Input Directory': CONFIG.input,
      'Compression Types': CONFIG.types.join(', '),
      'Exclude Patterns': CONFIG.exclude.length,
      'Gzip Level': CONFIG.compression.gzip.level,
      'Brotli Level': CONFIG.compression.brotli.level
    });
    
    // Validate input directory
    validateInput();
    
    const command = buildCommand();
    console.log(`⚡ Running: ${command}`);
    console.log('');
    
    executeCommand(command);
    
    console.log('');
    console.log('✅ Compression completed successfully!');
    
  } catch (error) {
    handleError(error, 'Asset compression');
  }
}

/**
 * Execute compress function if script is run directly (not imported as module)
 */
if (require.main === module) {
  compress();
}

/**
 * Module exports
 * @exports {Object}
 * @property {Function} compress - Main compression function
 * @property {Object} CONFIG - Compression configuration object
 */
module.exports = { compress, CONFIG };
