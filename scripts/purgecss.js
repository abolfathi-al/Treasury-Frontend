#!/usr/bin/env node

/**
 * CSS Purging Script for Angular 20
 * 
 * Removes unused CSS using PurgeCSS with comprehensive safelist patterns.
 * Optimized for Angular, Bootstrap, and third-party libraries.
 * 
 * @author Angular 20 Upgrade
 * @version 1.0.0
 */

const { PurgeCSS } = require('purgecss');
const path = require('path');
const fs = require('fs');
const { CONSTANTS, validateDirectory, logSection, logConfig, handleError } = require('./utils');

/**
 * Gets the output path from command-line arguments or uses the default dist path
 * @type {string}
 */
const outputIndex = process.argv.indexOf('--output');
const outputPath = outputIndex !== -1 && process.argv[outputIndex + 1] 
  ? process.argv[outputIndex + 1] 
  : CONSTANTS.DIST_PATH;

/**
 * PurgeCSS configuration object
 * @type {Object}
 * @property {string[]} content - Array of glob patterns for content files to scan for class usage
 * @property {string[]} css - Array of glob patterns for CSS files to process
 * @property {Function} defaultExtractor - Custom extractor function to extract class names from content
 * @property {RegExp[]} safelist - Array of regex patterns for CSS classes to preserve
 */
const CONFIG = {
  content: [
    `${outputPath}/*.html`,
    `${outputPath}/*.js`
  ],
  css: [`${outputPath}/*.css`],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  safelist: [
    /^(noUi|gm|grid|gs|pac|ng|di|tns)-/,
    /^drawer-(start|end|on)/,
    /data-velora-(sticky-landing-header)/,
    /^path[1-9]$/,
    /gmnoprint|href/,
    /^threshold/,
  ],
};

/**
 * Validates that the output directory exists and contains CSS files
 * @throws {Error} If the directory doesn't exist or contains no CSS files
 */
function validateInput() {
  validateDirectory(outputPath, 'Output directory');
  
  const cssFiles = fs.readdirSync(outputPath).filter(file => file.endsWith('.css'));
  if (cssFiles.length === 0) {
    throw new Error(`No CSS files found in: ${outputPath}`);
  }
  
  console.log(`📄 Found ${cssFiles.length} CSS files to process`);
}

/**
 * Main function that executes the CSS purging process
 * Removes unused CSS from files in the output directory based on content analysis
 * 
 * @async
 * @function purge
 * @returns {Promise<void>} Resolves when CSS purging is complete
 * @throws {Error} If validation fails or purging encounters an error
 * 
 * @description
 * This function:
 * 1. Validates the output directory and CSS files
 * 2. Processes CSS files using PurgeCSS with the configured settings
 * 3. Writes the purged CSS back to the original files
 * 4. Logs progress and file size reduction statistics
 */
async function purge() {
  try {
    logSection('Starting CSS Purging', '🧹');
    logConfig({
      'Output Path': outputPath,
      'Content Patterns': CONFIG.content.length,
      'CSS Patterns': CONFIG.css.length,
      'Safelist Patterns': CONFIG.safelist.length,
      'Default Extractor': 'Custom regex pattern'
    });
    
    validateInput();
    
    console.log('⚡ Processing CSS files...');
    console.log('');
    
    const purgeCSS = new PurgeCSS();
    const purgeCSSResult = await purgeCSS.purge(CONFIG);
    
    if (!purgeCSSResult || purgeCSSResult.length === 0) {
      throw new Error('No CSS files were processed. Check that CSS files exist in the output path.');
    }
    
    console.log(`📦 Processing ${purgeCSSResult.length} CSS file(s)...`);
    console.log('');
    
    for (const result of purgeCSSResult) {
      if (!result || !result.css) {
        const fileInfo = result?.file || result?.source || 'unknown';
        console.warn(`⚠️  Warning: Skipping file with no CSS content: ${fileInfo}`);
        continue;
      }
      
      const sourceFile = result.file || result.source || '';
      if (!sourceFile) {
        console.warn(`⚠️  Warning: Result has no file path, skipping...`);
        continue;
      }
      
      const outputFile = path.resolve(outputPath, path.basename(sourceFile));
      fs.writeFileSync(outputFile, result.css, 'utf8');
      
      const originalSize = fs.existsSync(sourceFile) 
        ? fs.statSync(sourceFile).size 
        : 0;
      const newSize = Buffer.byteLength(result.css, 'utf8');
      const reduction = originalSize > 0 
        ? ((originalSize - newSize) / originalSize * 100).toFixed(1)
        : 0;
      
      console.log(`✅ Processed: ${path.basename(outputFile)} ${reduction > 0 ? `(${reduction}% reduction)` : ''}`);
    }
    
    console.log('');
    console.log('✅ CSS purging completed successfully!');
    
  } catch (error) {
    handleError(error, 'CSS purging');
  }
}

/**
 * Execute purge function if script is run directly (not imported as module)
 * Handles unhandled promise rejections and exits with error code on failure
 */
if (require.main === module) {
  purge().catch(error => {
    handleError(error, 'CSS purging');
    process.exit(1);
  });
}

/**
 * Module exports
 * @exports {Object}
 * @property {Function} purge - Main purge function
 * @property {Object} CONFIG - PurgeCSS configuration object
 */
module.exports = { purge, CONFIG };
