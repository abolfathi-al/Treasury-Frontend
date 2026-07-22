#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');
const {
  CONSTANTS,
  validateDirectory,
  logSection,
  logConfig,
  handleError,
  getFileSize
} = require('./utils');

const DEFAULT_CONFIG = {
  distPath: CONSTANTS.DIST_PATH,
  backupPath: null, // resolved from distPath
  legacyChunkPatterns: [
    /^416\.[a-f0-9]+\.js$/,
    /^8528\.[a-f0-9]+\.js$/,
    /^4193\.[a-f0-9]+\.js$/,
    /^vendor\.[a-f0-9]+\.js$/
  ],
  babelConfig: {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            chrome: '120',
            firefox: '115',
            safari: '16',
            edge: '120'
          },
          modules: false,
          useBuiltIns: false,
          debug: false
        }
      ]
    ],
    plugins: [],
    compact: true,
    minified: true,
    comments: false
  },
  polyfillRemoval: {
    maxRemovalPercent: 5,
    minFileLines: 10,
    safetyCheckThreshold: 0.95
  }
};

function resolveConfig(overrides = {}) {
  const distPath = path.resolve(overrides.distPath ?? DEFAULT_CONFIG.distPath);
  const backupOverride = overrides.backupPath ?? DEFAULT_CONFIG.backupPath;
  const backupPath = path.resolve(backupOverride || path.join(distPath, '.legacy-backup'));

  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    distPath,
    backupPath,
    legacyChunkPatterns: overrides.legacyChunkPatterns || DEFAULT_CONFIG.legacyChunkPatterns,
    babelConfig: { ...DEFAULT_CONFIG.babelConfig, ...(overrides.babelConfig || {}) },
    polyfillRemoval: { ...DEFAULT_CONFIG.polyfillRemoval, ...(overrides.polyfillRemoval || {}) }
  };
}

const CONFIG = resolveConfig();

const POLYFILL_PATTERNS = [
  { pattern: /\/\*[\s\S]*?polyfill[\s\S]*?\*\//gi, description: 'polyfill comments', priority: 1 },
  { pattern: /\/\/[\s\S]*?polyfill[\s\S]*?\n/gi, description: 'polyfill line comments', priority: 1 },
  { pattern: /Object\.keys\s*\|\|\s*\(Object\.keys\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?var\s*[^=]+\s*=\s*\[\];[\s\S]*?for\s*\([^}]*\)[\s\S]*?Object\.prototype\.hasOwnProperty[\s\S]*?return[\s\S]*?\}\)\s*,/g, description: 'Object.keys polyfill', priority: 2 },
  { pattern: /"function"\s*!=\s*typeof\s*Object\.assign\s*&&\s*\(Object\.assign\s*=\s*function[^}]*\{[\s\S]*?for\s*\([^}]*\)[\s\S]*?Object\.prototype\.hasOwnProperty[\s\S]*?return[\s\S]*?\}\)\s*,/g, description: 'Object.assign polyfill (minified)', priority: 2 },
  { pattern: /Object\.assign\s*\|\|\s*function\s*\([^)]*\)\s*\{[\s\S]*?for\s*\([^}]*\)[\s\S]*?Object\.prototype\.hasOwnProperty[\s\S]*?return[\s\S]*?\}\s*,/g, description: 'Object.assign polyfill', priority: 2 },
  { pattern: /"function"\s*!=\s*typeof\s*Object\.assign\s*&&\s*\(Object\.assign\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?return\s+[^}]+?\}\)\s*;?/g, description: 'Object.assign polyfill (forEach variant)', priority: 2 },
  { pattern: /Array\.prototype\.includes\s*\|\|\s*\(?Array\.prototype\.includes\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?return[\s\S]*?\}\)?/g, description: 'Array.prototype.includes polyfill (generic)', priority: 3 },
  { pattern: /Array\.prototype\.includes\s*\|\|\s*Object\.defineProperty\(Array\.prototype,\s*["']includes["'],\s*\{[\s\S]*?value:\s*function[^}]*\{[\s\S]*?return[\s\S]*?\}[\s\S]*?\}\)/g, description: 'Array.prototype.includes polyfill (defineProperty)', priority: 3 },
  { pattern: /String\.prototype\.includes\s*\|\|\s*\(?String\.prototype\.includes\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?return[\s\S]*?\}\)?/g, description: 'String.prototype.includes polyfill (generic)', priority: 3 },
  { pattern: /Object\.entries\s*\|\|\s*\(Object\.entries\s*=\s*function[^)]*\)\s*\{[\s\S]*?\}\s*\)/g, description: 'Object.entries polyfill (generic)', priority: 3 },
  { pattern: /Object\.getPrototypeOf\s*\|\|\s*\(Object\.getPrototypeOf\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*\)/g, description: 'Object.getPrototypeOf polyfill (generic)', priority: 3 },
  { pattern: /regeneratorRuntime\s*=\s*[^;]+;/g, description: 'regeneratorRuntime shim', priority: 4 }
];

const SYNTAX_CLEANUP_PATTERNS = [
  { pattern: /,\s*,+/g, replacement: ',' },
  { pattern: /,\s*\)/g, replacement: ')' },
  { pattern: /,\s*\}/g, replacement: '}' },
  { pattern: /\(\s*,/g, replacement: '(' },
  { pattern: /\{\s*,/g, replacement: '{' },
  { pattern: /,\s*\]/g, replacement: ']' },
  { pattern: /\[\s*,/g, replacement: '[' },
  { pattern: /,\s*,\s*,/g, replacement: ',' }
];

const SORTED_POLYFILL_PATTERNS = [...POLYFILL_PATTERNS].sort((a, b) => a.priority - b.priority);

function readFileOrThrow(filePath) {
  try {
    const contents = fs.readFileSync(filePath, 'utf8');
    if (!contents || contents.trim().length === 0) {
      throw new Error('File is empty or contains only whitespace');
    }
    return contents;
  } catch (error) {
    throw new Error(`Failed to read file "${filePath}": ${error.message}`);
  }
}

function writeFileOrThrow(filePath, contents) {
  try {
    fs.writeFileSync(filePath, contents, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write file "${filePath}": ${error.message}`);
  }
}

function findLegacyChunks(config = CONFIG) {
  if (!fs.existsSync(config.distPath)) {
    console.warn('⚠️  Dist directory not found. Skipping legacy conversion.');
    return [];
  }

  try {
    const files = fs.readdirSync(config.distPath);
    const legacyChunks = files
      .filter(file => {
        if (!file.endsWith('.js')) return false;
        return config.legacyChunkPatterns.some(pattern => pattern.test(file));
      })
      .map(file => ({
        name: file,
        path: path.join(config.distPath, file),
        size: fs.statSync(path.join(config.distPath, file)).size
      }))
      .sort((a, b) => b.size - a.size);

    return legacyChunks;
  } catch (error) {
    console.error(`❌ Error finding legacy chunks: ${error.message}`);
    return [];
  }
}

function ensureBackupDirectory(config = CONFIG) {
  if (!fs.existsSync(config.backupPath)) {
    fs.mkdirSync(config.backupPath, { recursive: true });
  }
}

function backupFile(filePath, fileName, config = CONFIG) {
  ensureBackupDirectory(config);
  const backupPath = path.join(config.backupPath, fileName);
  try {
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  } catch (error) {
    throw new Error(`Failed to create backup: ${error.message}`);
  }
}

function transformLegacyCode(filePath, config = CONFIG) {
  const originalCode = readFileOrThrow(filePath);

  try {
    const result = transformSync(originalCode, {
      ...config.babelConfig,
      filename: path.basename(filePath),
      sourceFileName: path.basename(filePath),
      sourceType: 'module'
    });

    if (!result || !result.code) {
      throw new Error('Babel transformation returned no code');
    }

    if (result.code.trim().length === 0) {
      throw new Error('Babel transformation produced empty code');
    }

    return result.code;
  } catch (error) {
    throw new Error(`Babel transformation failed: ${error.message}`);
  }
}

function isMinifiedCode(code, config = CONFIG) {
  const lines = code.split('\n');
  return lines.length < config.polyfillRemoval.minFileLines;
}

function shouldProcessPolyfills(fileName, code, config = CONFIG) {
  return true;
}

function removePolyfills(code, fileName, config = CONFIG) {
  let cleanedCode = code;
  const originalLength = code.length;

  if (!shouldProcessPolyfills(fileName, code, config)) {
    return { code: cleanedCode, removalStats: null, removedPercent: 0 };
  }

  const removalStats = {
    totalRemoved: 0,
    patternsMatched: 0,
    details: []
  };

  SORTED_POLYFILL_PATTERNS.forEach(({ pattern, description }) => {
    const before = cleanedCode.length;
    const matches = cleanedCode.match(pattern);

    if (matches && matches.length > 0) {
      cleanedCode = cleanedCode.replace(pattern, '');
      const after = cleanedCode.length;
      const removed = before - after;

      if (removed > 0) {
        removalStats.totalRemoved += removed;
        removalStats.patternsMatched++;
        removalStats.details.push({
          description,
          removed,
          matches: matches.length
        });
      }
    }
  });

  if (removalStats.patternsMatched > 0) {
    console.log(`   🧹 Removed ${removalStats.patternsMatched} polyfill pattern(s)`);
    removalStats.details.forEach(({ description, removed, matches }) => {
      console.log(
        `      • ${description}: ${(removed / 1024).toFixed(2)} KB (${matches} match${matches > 1 ? 'es' : ''})`
      );
    });
  }

  cleanedCode = applySyntaxCleanup(cleanedCode);

  const removedPercent = ((originalLength - cleanedCode.length) / originalLength) * 100;

  if (removedPercent > config.polyfillRemoval.maxRemovalPercent) {
    console.warn(`   ⚠️  Removed ${removedPercent.toFixed(2)}% of code - may indicate over-aggressive removal`);
  } else if (removalStats.totalRemoved > 0) {
    console.log(`   ℹ️  Removed ${removedPercent.toFixed(2)}% of code (${(removalStats.totalRemoved / 1024).toFixed(2)} KB)`);
  }

  return { code: cleanedCode, removalStats, removedPercent };
}

function applySyntaxCleanup(code) {
  let cleaned = code;
  
  SYNTAX_CLEANUP_PATTERNS.forEach(({ pattern, replacement }) => {
    cleaned = cleaned.replace(pattern, replacement);
  });

  return cleaned.trim();
}

function validateTransformedCode(code, originalSize, config = CONFIG) {
  if (!code || code.trim().length === 0) {
    throw new Error('Transformed code is empty');
  }

  if (code.length < originalSize * config.polyfillRemoval.safetyCheckThreshold) {
    throw new Error(
      `Code size reduced by more than ${(1 - config.polyfillRemoval.safetyCheckThreshold) * 100}% - possible syntax breakage`
    );
  }

  try {
    new Function(code);
  } catch (syntaxError) {
    if (isMinifiedCode(code, config)) {
      console.warn(`   ⚠️  Syntax validation warning (may be false positive for minified code): ${syntaxError.message}`);
    } else {
      throw new Error(`Syntax validation failed: ${syntaxError.message}`);
    }
  }
}

function processLegacyChunk(chunk, config = CONFIG) {
  const { name, path: filePath, size: originalSize } = chunk;

  console.log(`\n🔄 Processing: ${name}`);
  console.log(`   Original size: ${getFileSize(filePath)}`);

  let backupPath;
  try {
    backupPath = backupFile(filePath, name, config);
    console.log(`   ✅ Backed up to: ${path.relative(process.cwd(), backupPath)}`);
  } catch (error) {
    console.error(`   ❌ Backup failed: ${error.message}`);
    return {
      name,
      originalSize,
      newSize: originalSize,
      savedBytes: 0,
      savedPercent: 0,
      success: false,
      error: error.message
    };
  }

  try {
    let transformedCode = transformLegacyCode(filePath, config);
    const beforePolyfillRemoval = transformedCode.length;
    
    const { code: polyfillStripped, removalStats, removedPercent } = removePolyfills(transformedCode, name, config);

    validateTransformedCode(polyfillStripped, beforePolyfillRemoval, config);

    writeFileOrThrow(filePath, polyfillStripped);

    const newSize = fs.statSync(filePath).size;
    const savedBytes = originalSize - newSize;
    const savedPercent = savedBytes > 0 ? ((savedBytes / originalSize) * 100).toFixed(2) : '0.00';

    console.log(`   ✅ Transformed size: ${getFileSize(filePath)}`);
    
    if (savedBytes > 0) {
      console.log(`   💾 Saved: ${(savedBytes / 1024).toFixed(2)} KB (${savedPercent}% reduction)`);
    } else {
      const increased = -savedBytes;
      console.log(`   ℹ️  Size increased: ${(increased / 1024).toFixed(2)} KB (expected for ES5→ES2022 transformation)`);
    }

    return {
      name,
      originalSize,
      newSize,
      savedBytes,
      savedPercent: parseFloat(savedPercent),
      success: true,
      removalStats,
      removedPercent
    };
  } catch (error) {
    console.error(`   ❌ Transformation failed: ${error.message}`);
    
    try {
      if (backupPath && fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        console.log(`   🔄 Restored from backup`);
      }
    } catch (restoreError) {
      console.error(`   ⚠️  Failed to restore from backup: ${restoreError.message}`);
    }

    return {
      name,
      originalSize,
      newSize: originalSize,
      savedBytes: 0,
      savedPercent: 0,
      success: false,
      error: error.message
    };
  }
}

function generateReport(results, config = CONFIG) {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNewSize = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSaved = totalOriginalSize - totalNewSize;
  const totalSavedPercent = totalSaved > 0 ? ((totalSaved / totalOriginalSize) * 100).toFixed(2) : '0.00';

  logSection('Legacy to Modern Conversion Report', '📊');

  console.log(`\n📦 Processed Chunks: ${results.length}`);
  console.log(`   ✅ Successful: ${successful.length}`);
  if (failed.length > 0) {
    console.log(`   ❌ Failed: ${failed.length}`);
  }

  console.log(`\n💾 Size Statistics:`);
  console.log(`   Original total: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`   Transformed total: ${(totalNewSize / 1024).toFixed(2)} KB`);
  
  if (totalSaved > 0) {
    console.log(`   Total saved: ${(totalSaved / 1024).toFixed(2)} KB (${totalSavedPercent}% reduction)`);
  } else {
    const increased = -totalSaved;
    console.log(`   Total increased: ${(increased / 1024).toFixed(2)} KB (expected for ES5→ES2022 transformation)`);
  }

  if (successful.length > 0) {
    console.log(`\n✅ Successfully Transformed:`);
    successful.forEach(result => {
      const change = result.savedBytes > 0 ? 'reduction' : 'increase';
      const changeValue = Math.abs(result.savedPercent);
      console.log(`   • ${result.name}: ${(result.originalSize / 1024).toFixed(2)} KB → ${(result.newSize / 1024).toFixed(2)} KB (${changeValue.toFixed(2)}% ${change})`);
    });
  }

  if (failed.length > 0) {
    console.log(`\n❌ Failed Transformations:`);
    failed.forEach(result => {
      console.log(`   • ${result.name}: ${result.error || 'Unknown error'}`);
    });
  }

  console.log(`\n📁 Backup Location: ${path.relative(process.cwd(), config.backupPath)}`);
  console.log('============================================================\n');

  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    totalOriginalSize,
    totalNewSize,
    totalSaved,
    totalSavedPercent: parseFloat(totalSavedPercent),
    results
  };
}

function convert(configOverrides = {}) {
  const config = resolveConfig(configOverrides);

  logSection('Starting Legacy to Modern JavaScript Conversion', '🚀');
  validateDirectory(config.distPath, 'Dist directory');
  logConfig({
    'Dist Path': config.distPath,
    'Backup Path': config.backupPath,
    'Target Browsers': 'Chrome 120+, Firefox 115+, Safari 16+, Edge 120+',
    'Legacy Patterns': config.legacyChunkPatterns.map(p => p.source).join(', '),
    'Max Removal %': `${config.polyfillRemoval.maxRemovalPercent}%`,
    'Safety Threshold': `${config.polyfillRemoval.safetyCheckThreshold * 100}%`
  });

  console.log('🔍 Finding legacy chunks...');
  const legacyChunks = findLegacyChunks(config);

  if (legacyChunks.length === 0) {
    console.log('✅ No legacy chunks found. All JavaScript is already modern!');
    return { success: true, processed: 0, config };
  }

  console.log(`📦 Found ${legacyChunks.length} legacy chunk(s):`);
  legacyChunks.forEach(chunk => {
    console.log(`   • ${chunk.name} (${getFileSize(chunk.path)})`);
  });

  console.log('\n🔄 Starting transformation...');
  const results = legacyChunks.map(chunk => processLegacyChunk(chunk, config));

  const report = generateReport(results, config);
  const success = report.failed === 0;

  if (success) {
    console.log('✅ Legacy to modern conversion completed successfully!\n');
  } else {
    console.warn('⚠️  Some transformations failed. Check the report above for details.');
  }

  return { success, ...report, config };
}

if (require.main === module) {
  try {
    const result = convert();
    if (!result.success) {
      process.exit(1);
    }
  } catch (error) {
    handleError(error, 'Legacy to modern conversion');
  }
}

module.exports = { convert, CONFIG, POLYFILL_PATTERNS, DEFAULT_CONFIG, resolveConfig };
