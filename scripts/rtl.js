#!/usr/bin/env node

/**
 * RTL (Right-to-Left) CSS Generation Script for Angular 20
 * 
 * Generates RTL CSS variants using webpack with comprehensive configuration.
 * Supports Sass preprocessing, autoprefixing, and RTL transformation.
 * 
 * @author Angular 20 Upgrade
 * @version 1.0.0
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { CONSTANTS, validateDirectory, validateFile, executeCommand, logSection, logConfig, logFiles, handleError, listFilesWithSizes } = require('./utils');

/**
 * Configuration object for RTL generation settings
 * @type {Object}
 * @property {string} distPath - Output directory for generated CSS files
 * @property {string} sourcePath - Source directory containing Sass files
 * @property {Object} entries - Entry points for webpack compilation
 * @property {string} mode - Webpack build mode (development/production)
 * @property {boolean} sourceMap - Whether to generate source maps
 * @property {string[]} browserslist - Browser support list for autoprefixer
 * @property {Object} rtlOptions - RTL transformation options
 * @property {Object} sassOptions - Sass compilation options
 */
const CONFIG = {
  // Paths
  distPath: './src/assets/css',
  sourcePath: './src/assets/sass',
  
  // Entry points
  entries: {
    'styles': './src/assets/sass/main.scss'
  },
  
  // Build settings
  mode: 'development',
  sourceMap: true,
  
  // Browser support - Angular 20 compatible
  browserslist: CONSTANTS.BROWSERSLIST,
  
  // RTL transformation options
  rtlOptions: {
    autoRename: true,
    autoRenameStrict: false,
    greedy: false,
    processUrls: true,
    stringMap: [
      {
        name: 'ltr-rtl',
        priority: 100,
        search: ['ltr', 'LTR'],
        replace: ['rtl', 'RTL'],
        options: {
          scope: 'selector',
          ignoreCase: false
        }
      }
    ]
  },
  
  // Sass compilation options
  sassOptions: {
    includePaths: ['./src/assets/sass'],
    outputStyle: 'expanded',
    precision: 6,
    silenceDeprecations: ['legacy-js-api', 'import', 'color-functions', 'mixed-decls']
  }
};

/**
 * Validates that required source files and directories exist
 * @throws {Error} If validation fails
 */
function validateRequirements() {
  const sourceFile = CONFIG.entries.styles;
  
  validateFile(sourceFile, 'Source file');
  validateDirectory(CONFIG.sourcePath, 'Source directory');
}

/**
 * Cleans up the output directory and creates it if needed
 * @throws {Error} If cleanup fails
 */
function cleanupDirectory() {
  try {
    console.log('🧹 Cleaning CSS directory...');
    if (fs.existsSync(CONFIG.distPath)) {
      fs.rmSync(CONFIG.distPath, { recursive: true, force: true });
    }
    fs.mkdirSync(CONFIG.distPath, { recursive: true });
    console.log('✅ CSS directory cleaned successfully');
  } catch (error) {
    console.warn('⚠️  Could not clean CSS directory:', error.message);
    throw new Error(`Failed to clean directory: ${error.message}`);
  }
}

/**
 * Builds the webpack command with configuration options
 * @returns {string} The complete command string
 */
function buildCommand() {
  const args = [
    'npx webpack',
    '--config', path.join(__dirname, 'webpack-rtl.config.js'),
    '--mode', CONFIG.mode
  ];
  
  if (CONFIG.sourceMap) {
    args.push('--devtool', 'source-map');
  }
  
  return args.join(' ');
}

/**
 * Removes generated JavaScript files (only CSS files are needed)
 */
function cleanupJSFiles() {
  try {
    console.log('🧹 Cleaning up generated JS files...');
    const jsFiles = fs.readdirSync(CONFIG.distPath)
      .filter(file => file.endsWith('.js'));
    
    jsFiles.forEach(file => {
      fs.unlinkSync(path.join(CONFIG.distPath, file));
    });
    
    console.log('✅ JS files cleaned successfully');
  } catch (error) {
    console.warn('⚠️  Could not clean JS files:', error.message);
  }
}

/**
 * Displays information about generated CSS files
 */
function showGeneratedFiles() {
  try {
    const cssFiles = listFilesWithSizes(CONFIG.distPath, '.css');
    logFiles(cssFiles, 'Generated CSS files');
  } catch (error) {
    console.warn('⚠️  Could not list generated files:', error.message);
  }
}

/**
 * Main function that executes the complete RTL CSS generation process
 * Generates RTL CSS variants from Sass source files using webpack
 * 
 * @function generateRTL
 * @throws {Error} If validation fails or generation encounters an error
 * 
 * @description
 * This function:
 * 1. Validates required source files and directories
 * 2. Cleans the output directory
 * 3. Runs webpack to compile Sass and generate RTL CSS
 * 4. Cleans up generated JavaScript files
 * 5. Displays information about generated CSS files
 */
function generateRTL() {
  try {
    logSection('Starting RTL CSS Generation', '🚀');
    logConfig({
      'Output Directory': CONFIG.distPath,
      'Entry Points': Object.keys(CONFIG.entries).join(', '),
      'Build Mode': CONFIG.mode,
      'Source Maps': CONFIG.sourceMap ? 'enabled' : 'disabled',
      'Browser Support': CONFIG.browserslist.join(', '),
      'RTL Auto Rename': CONFIG.rtlOptions.autoRename,
      'Sass Output Style': CONFIG.sassOptions.outputStyle
    });
    
    // Validate requirements
    validateRequirements();
    
    // Clean up directory first
    cleanupDirectory();
    
    const command = buildCommand();
    console.log(`⚡ Running: ${command}`);
    console.log('');
    
    executeCommand(command);
    
    // Clean up JS files
    cleanupJSFiles();
    
    console.log('');
    console.log('✅ RTL CSS generation completed successfully!');
    
    // Show generated files
    showGeneratedFiles();
    
  } catch (error) {
    handleError(error, 'RTL CSS generation');
  }
}

/**
 * Execute generateRTL function if script is run directly (not imported as module)
 */
if (require.main === module) {
  generateRTL();
}

/**
 * Module exports
 * @exports {Object}
 * @property {Function} generateRTL - Main RTL generation function
 * @property {Object} CONFIG - RTL generation configuration object
 */
module.exports = { generateRTL, CONFIG };
