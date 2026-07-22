#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';
import vm from 'node:vm';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const appRoot = path.resolve(scriptDir, '..');
const srcApp = path.join(appRoot, 'src/app');
const i18nDir = path.join(srcApp, 'modules/i18n');
const reportJsonPath = path.join(appRoot, 'reports/velora-shell-i18n-inventory.json');

const args = new Set(process.argv.slice(2));
const shouldWriteJson = args.has('--write-json');

const requiredModuleFiles = [
  'common/en.ts',
  'common/fa.ts',
  'layout/en.ts',
  'layout/fa.ts',
  'navigation/en.ts',
  'navigation/fa.ts',
  'validation/en.ts',
  'validation/fa.ts',
  'status/en.ts',
  'status/fa.ts',
  'domain/identity/en.ts',
  'domain/identity/fa.ts',
  'domain/access/en.ts',
  'domain/access/fa.ts',
  'domain/tenant/en.ts',
  'domain/tenant/fa.ts',
  'domain/organization/en.ts',
  'domain/organization/fa.ts',
  'domain/audit/en.ts',
  'domain/audit/fa.ts',
  'index.ts',
];

const legacyKeyPrefixes = [
  'GENERAL.',
  'MENU.',
  'BUTTONS.',
  'FORM_CONTROLS.',
  'AUTH.',
  'ERRORS.',
  'NG_SELECT.',
  'BOOKING_BENEFITS.',
  'CONTACT_SUPPORT.',
  'COUNTDOWN.',
  'TIME_AGO.',
  'TIME_LATER.',
  'SEASON.',
];

const forbiddenCommonValues = new Set([
  'Tenant Health',
  'Grant Simulation',
  'Actor Projection',
  'Context Resolution',
  'SCIM Provisioning',
  'Supplier Context',
  'Booking Lifecycle',
  'Wallet Isolation',
  'Access Decision Trace',
]);

const allowedTextFragments = new Set([
  '|',
  '/',
  ':',
  '-',
  '+',
  '...',
  '&copy;',
  '{{',
  '}}',
]);

const technicalTextPattern = /^(?:[A-Z0-9_./:-]+|[#*]+|\d+(?:[.,]\d+)?%?|[+$-]?\d+(?:[.,]\d+)?[KMB]?|[A-Z]{2,}|v?\d+(?:\.\d+){0,3})$/;
const dateTimeTextPattern = /^[A-Z][a-z]{2,8} \d{1,2}, \d{4}(?: \d{1,2}:\d{2}(?: [AP]M)?)?$/;
const currencyTextPattern = /^[A-Z]{3}\s+\d+(?:[.,]\d+)?$/;
const sampleDataTexts = new Set([
  '&middot;',
  'Brian Cox',
  'Hotelbeds',
  'Hotelbeds Net Rate Policy',
]);

const moduleCache = new Map();

function main() {
  const inventory = discoverInventory();
  const translations = loadTranslations();
  const staticKeys = discoverStaticTranslationKeys();
  const hardcodedTemplateTexts = discoverHardcodedTemplateTexts();
  const hardcodedTemplateEvaluation = evaluateHardcodedTemplateTexts(hardcodedTemplateTexts);
  const dynamicKeyFamilies = discoverDynamicKeyFamilies();
  const checks = [];

  checks.push(...checkRequiredModuleFiles());
  checks.push(...checkLocaleTrees(translations));
  checks.push(...checkStaticKeys(staticKeys, translations));
  checks.push(...checkLegacyKeys(staticKeys));
  checks.push(...checkCommonPollution(translations));
  checks.push(...checkWorkspaceNamespaces(inventory, translations));
  checks.push(...checkHardcodedTemplateTexts(hardcodedTemplateEvaluation));

  const failures = checks.filter((check) => check.status === 'fail');
  const warnings = checks.filter((check) => check.status === 'warn');
  const result = {
    generatedAt: new Date().toISOString(),
    appRoot,
    inventory,
    translations: {
      enKeyCount: translations.enKeys.length,
      faKeyCount: translations.faKeys.length,
      missingInFa: translations.missingInFa,
      missingInEn: translations.missingInEn,
    },
    staticKeys,
    hardcodedTemplateTexts,
    enforcedHardcodedTemplateTexts: hardcodedTemplateEvaluation.enforced,
    ignoredHardcodedTemplateTexts: hardcodedTemplateEvaluation.ignored,
    dynamicKeyFamilies,
    checks,
    summary: {
      featureCount: inventory.features.length,
      staticKeyCount: staticKeys.length,
      hardcodedTemplateTextCount: hardcodedTemplateTexts.length,
      enforcedHardcodedTemplateTextCount: hardcodedTemplateEvaluation.enforced.length,
      ignoredHardcodedTemplateTextCount: hardcodedTemplateEvaluation.ignored.length,
      dynamicKeyFamilyCount: dynamicKeyFamilies.length,
      failureCount: failures.length,
      warningCount: warnings.length,
    },
  };

  if (shouldWriteJson) {
    fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
    fs.writeFileSync(reportJsonPath, `${JSON.stringify(result, null, 2)}\n`);
  }

  printSummary(result);

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

function discoverInventory() {
  const routeFiles = [
    path.join(srcApp, 'app-routing.ts'),
    path.join(srcApp, 'layouts/admin-layout/admin-layout-routing.ts'),
    path.join(srcApp, 'modules/auth/auth-routing.ts'),
    path.join(srcApp, 'modules/errors/errors-routing.ts'),
  ].filter(fs.existsSync);

  const routes = routeFiles.flatMap((file) => extractRoutes(file));
  const componentFiles = walk(srcApp, (file) => file.endsWith('.component.ts'));
  const components = componentFiles.map(extractComponentInfo);
  const componentByClass = new Map(
    components.filter((component) => component.className).map((component) => [component.className, component])
  );

  const routedComponents = routes
    .map((route) => {
      const component = route.componentClass ? componentByClass.get(route.componentClass) : undefined;
      return {
        ...route,
        componentFile: component?.file ?? route.importPath ?? '',
        selector: component?.selector ?? '',
        templateUrl: component?.templateUrl ?? '',
      };
    })
    .filter((route) => route.path !== '**' && route.redirectTo === '');

  const workspaceFeatureRoots = [
    path.join(srcApp, 'modules/access-workspace/pages'),
    path.join(srcApp, 'modules/access-requests/pages'),
    path.join(srcApp, 'modules/access-simulator/pages'),
    path.join(srcApp, 'modules/grant-builder/pages'),
    path.join(srcApp, 'modules/membership-directory/pages'),
  ];
  const workspaceFeatureDirs = workspaceFeatureRoots.flatMap((workspaceRoot) =>
    fs.existsSync(workspaceRoot)
      ? fs.readdirSync(workspaceRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(workspaceRoot, entry.name))
      : []
  );

  const features = workspaceFeatureDirs.map((featureDir) => {
    const slug = path.basename(featureDir);
    const allFiles = walk(featureDir, (file) => file.endsWith('.ts') || file.endsWith('.html'));
    const componentTsFiles = allFiles.filter((file) => file.endsWith('.component.ts'));
    const templateFiles = allFiles.filter((file) => file.endsWith('.html'));
    const rootComponent = componentTsFiles.find((file) => path.basename(file) === `${slug}.component.ts`) ?? componentTsFiles[0] ?? '';
    const routePaths = routedComponents
      .filter((route) => route.componentFile.includes(`/pages/${slug}/`))
      .map((route) => route.fullPath);
    return {
      featureName: toTitle(slug),
      featureSlug: toCamel(slug),
      sourceSlug: slug,
      namespace: `workspace.${toCamel(slug)}`,
      routePaths,
      rootComponent: relative(rootComponent),
      childComponents: componentTsFiles.filter((file) => file !== rootComponent).map(relative),
      templates: templateFiles.map(relative),
      dialogsDrawersModals: componentTsFiles
        .filter((file) => /(dialog|drawer|modal)/i.test(file))
        .map(relative),
      tablesFormsCharts: componentTsFiles
        .filter((file) => /(table|form|chart|filter|bulk|bar)/i.test(file))
        .map(relative),
    };
  });

  return {
    routeFiles: routeFiles.map(relative),
    routes: routedComponents,
    shellComponents: components
      .filter((component) => component.file.includes('/layouts/admin-layout/') || component.file.includes('/layouts/components/'))
      .map((component) => ({ ...component, file: relative(component.file) })),
    sharedComponents: components
      .filter((component) =>
        component.file.includes('/shared/forms/')
        || component.file.includes('/shared/icons/')
        || component.file.includes('/shared/loading-states/')
        || component.file.includes('/shared/ui/')
      )
      .map((component) => ({ ...component, file: relative(component.file) })),
    features,
  };
}

function extractRoutes(file) {
  const source = fs.readFileSync(file, 'utf8');
  const routes = [];
  const routeBlockPattern = /\{\s*path:\s*['"]([^'"]*)['"][\s\S]*?\}/g;
  let match;

  while ((match = routeBlockPattern.exec(source))) {
    const block = match[0];
    const pathValue = match[1];
    const redirectTo = matchStringProperty(block, 'redirectTo');
    const importPath = matchImportPath(block);
    const componentClass = matchThenComponent(block) ?? matchIdentifierProperty(block, 'component');
    const title = matchDataProperty(block, 'title') ?? matchDataProperty(block, 'titleKey');
    const description = matchDataProperty(block, 'description') ?? matchDataProperty(block, 'descriptionKey');

    routes.push({
      file: relative(file),
      path: pathValue,
      fullPath: pathValue.startsWith('/') ? pathValue : `/${pathValue}`.replace(/\/+/g, '/'),
      componentClass: componentClass ?? '',
      importPath: importPath ? relative(resolveImport(file, importPath)) : '',
      redirectTo: redirectTo ?? '',
      title: title ?? '',
      description: description ?? '',
    });
  }

  return routes;
}

function extractComponentInfo(file) {
  const source = fs.readFileSync(file, 'utf8');
  return {
    file,
    className: source.match(/export\s+class\s+([A-Za-z0-9_]+)/)?.[1] ?? '',
    selector: source.match(/selector:\s*['"]([^'"]+)['"]/)?.[1] ?? '',
    templateUrl: source.match(/templateUrl:\s*['"]([^'"]+)['"]/)?.[1] ?? '',
  };
}

function discoverStaticTranslationKeys() {
  const files = walk(srcApp, (file) => file.endsWith('.ts') || file.endsWith('.html'));
  const keys = new Map();

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const patterns = [
      /(?:translate=|\[translate\]=)\s*["']([^"']+)["']/g,
      /['"]([A-Za-z][A-Za-z0-9_.-]+)['"]\s*\|\s*translate/g,
      /(?:instant|get|stream)\(\s*['"]([A-Za-z][A-Za-z0-9_.-]+)['"]/g,
      /(?:titleKey|descriptionKey):\s*['"]([A-Za-z][A-Za-z0-9_.-]+)['"]/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text))) {
        const key = match[1];
        if (!isTranslationKeyLike(key)) {
          continue;
        }
        if (!keys.has(key)) {
          keys.set(key, []);
        }
        keys.get(key).push(relative(file));
      }
    }
  }

  return [...keys.entries()]
    .map(([key, filesForKey]) => ({ key, files: unique(filesForKey).sort() }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

function discoverDynamicKeyFamilies() {
  const files = walk(srcApp, (file) => file.endsWith('.ts') || file.endsWith('.html'));
  const families = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const patterns = [
      /`([^`]*\$\{[^`]+}[^`]*)`/g,
      /\+\s*['"]([A-Za-z][A-Za-z0-9_.-]+\.)['"]/g,
      /['"]([A-Za-z][A-Za-z0-9_.-]+\.)['"]\s*\+/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text))) {
        const raw = match[1] ?? match[0];
        if (!/(translate|workspace|common|domain|status|validation|layout|navigation|GENERAL|MENU|AUTH|ERRORS|BUTTONS)/.test(raw)) {
          continue;
        }
        families.push({
          file: relative(file),
          expression: raw.replace(/\s+/g, ' ').trim(),
        });
      }
    }
  }

  return families.slice(0, 250);
}

function discoverHardcodedTemplateTexts() {
  const templateFiles = walk(srcApp, (file) => file.endsWith('.html'));
  const findings = [];

  for (const file of templateFiles) {
    const source = fs.readFileSync(file, 'utf8');
    const withoutComments = source.replace(/<!--[\s\S]*?-->/g, '');
    const textPattern = />([^<>{}][^<>]*?)</g;
    let match;

    while ((match = textPattern.exec(withoutComments))) {
      const value = normalizeTemplateText(match[1]);
      if (!isVisibleTextCandidate(value)) {
        continue;
      }
      findings.push({
        file: relative(file),
        text: value,
      });
    }
  }

  return findings;
}

function loadTranslations() {
  const enModule = loadTsModule(path.join(i18nDir, 'vocabs/en.ts'));
  const faModule = loadTsModule(path.join(i18nDir, 'vocabs/fa.ts'));
  const enData = enModule.locale?.data ?? {};
  const faData = faModule.locale?.data ?? {};
  const enKeys = flattenKeys(enData);
  const faKeys = flattenKeys(faData);
  const enSet = new Set(enKeys);
  const faSet = new Set(faKeys);

  return {
    enData,
    faData,
    enKeys,
    faKeys,
    missingInFa: enKeys.filter((key) => !faSet.has(key)),
    missingInEn: faKeys.filter((key) => !enSet.has(key)),
  };
}

function checkRequiredModuleFiles() {
  return requiredModuleFiles.map((moduleFile) => {
    const exists = fs.existsSync(path.join(i18nDir, moduleFile));
    return {
      name: `required module file: ${moduleFile}`,
      status: exists ? 'pass' : 'fail',
      detail: exists ? 'present' : 'missing',
    };
  });
}

function checkLocaleTrees(translations) {
  return [
    {
      name: 'EN/FA key tree parity',
      status: translations.missingInFa.length === 0 && translations.missingInEn.length === 0 ? 'pass' : 'fail',
      detail: `missingInFa=${translations.missingInFa.length}; missingInEn=${translations.missingInEn.length}`,
      samples: [...translations.missingInFa.slice(0, 20), ...translations.missingInEn.slice(0, 20)],
    },
  ];
}

function checkStaticKeys(staticKeys, translations) {
  const enSet = new Set(translations.enKeys);
  const faSet = new Set(translations.faKeys);
  const missing = staticKeys.filter(({ key }) => !enSet.has(key) || !faSet.has(key));
  return [
    {
      name: 'static translation keys resolve in EN and FA',
      status: missing.length === 0 ? 'pass' : 'fail',
      detail: `${missing.length} unresolved static keys`,
      samples: missing.slice(0, 50),
    },
  ];
}

function checkLegacyKeys(staticKeys) {
  const legacyUsages = staticKeys.filter(({ key }) => legacyKeyPrefixes.some((prefix) => key.startsWith(prefix)));
  return [
    {
      name: 'static translation keys use modular namespaces',
      status: legacyUsages.length === 0 ? 'pass' : 'fail',
      detail: `${legacyUsages.length} legacy static keys found`,
      samples: legacyUsages.slice(0, 50),
    },
  ];
}

function checkCommonPollution(translations) {
  const common = translations.enData.common ?? {};
  const commonValues = new Set(flattenValues(common));
  const forbidden = [...commonValues].filter((value) => forbiddenCommonValues.has(value));
  return [
    {
      name: 'common namespace excludes feature-only phrases',
      status: forbidden.length === 0 ? 'pass' : 'fail',
      detail: forbidden.length === 0 ? 'clean' : forbidden.join(', '),
    },
  ];
}

function checkWorkspaceNamespaces(inventory, translations) {
  const enData = translations.enData;
  const missingNamespaces = inventory.features
    .filter((feature) => !getPath(enData, feature.namespace))
    .map((feature) => feature.namespace);

  return [
    {
      name: 'all discovered workspace features have namespaces',
      status: missingNamespaces.length === 0 ? 'pass' : 'fail',
      detail: `${missingNamespaces.length} missing workspace namespaces`,
      samples: missingNamespaces,
    },
  ];
}

function checkHardcodedTemplateTexts(evaluation) {
  const dashboardIgnored = evaluation.ignored.filter((finding) => finding.reason === 'dashboard showcase template');
  const sampleIgnored = evaluation.ignored.filter((finding) => finding.reason !== 'dashboard showcase template');
  return [
    {
      name: 'statically detectable enforceable hardcoded template text',
      status: evaluation.enforced.length === 0 ? 'pass' : 'fail',
      detail: `${evaluation.enforced.length} text nodes found`,
      samples: evaluation.enforced.slice(0, 80),
    },
    {
      name: 'dashboard showcase hardcoded text tracked separately',
      status: dashboardIgnored.length === 0 ? 'pass' : 'warn',
      detail: `${dashboardIgnored.length} dashboard text nodes tracked as a remaining blocker`,
      samples: dashboardIgnored.slice(0, 20),
    },
    {
      name: 'sample data literals excluded from localization enforcement',
      status: sampleIgnored.length === 0 ? 'pass' : 'warn',
      detail: `${sampleIgnored.length} sample/date/currency/path literals excluded`,
      samples: sampleIgnored.slice(0, 20),
    },
  ];
}

function printSummary(result) {
  const failing = result.checks.filter((check) => check.status === 'fail');
  const warning = result.checks.filter((check) => check.status === 'warn');
  console.log(`Velora shell i18n inventory: ${result.summary.featureCount} workspace features, ${result.inventory.routes.length} routed entries`);
  console.log(`Translations: EN=${result.translations.enKeyCount}, FA=${result.translations.faKeyCount}`);
  console.log(`Static keys: ${result.summary.staticKeyCount}; enforceable hardcoded template texts: ${result.summary.enforcedHardcodedTemplateTextCount}; tracked/ignored hardcoded template texts: ${result.summary.ignoredHardcodedTemplateTextCount}; dynamic families: ${result.summary.dynamicKeyFamilyCount}`);
  console.log(`Checks: ${result.checks.length - failing.length - warning.length} passed, ${warning.length} warnings, ${failing.length} failures`);

  for (const check of failing) {
    console.log(`FAIL ${check.name}: ${check.detail}`);
    if (check.samples?.length) {
      console.log(JSON.stringify(check.samples.slice(0, 10), null, 2));
    }
  }
}

function loadTsModule(file) {
  const resolved = ensureTsFile(file);
  if (moduleCache.has(resolved)) {
    return moduleCache.get(resolved).exports;
  }

  const source = fs.readFileSync(resolved, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  moduleCache.set(resolved, module);
  const localRequire = (specifier) => loadRequiredModule(resolved, specifier);
  vm.runInNewContext(output, {
    require: localRequire,
    module,
    exports: module.exports,
    console,
  }, { filename: resolved });
  return module.exports;
}

function loadRequiredModule(fromFile, specifier) {
  if (specifier.startsWith('.')) {
    return loadTsModule(path.resolve(path.dirname(fromFile), specifier));
  }
  if (specifier.startsWith('@modules/')) {
    return loadTsModule(path.join(srcApp, 'modules', specifier.slice('@modules/'.length)));
  }
  return require(specifier);
}

function ensureTsFile(file) {
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    return file;
  }
  if (fs.existsSync(`${file}.ts`)) {
    return `${file}.ts`;
  }
  if (fs.existsSync(path.join(file, 'index.ts'))) {
    return path.join(file, 'index.ts');
  }
  throw new Error(`Cannot resolve TS module: ${file}`);
}

function walk(root, predicate) {
  if (!fs.existsSync(root)) {
    return [];
  }
  const results = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', 'coverage', '.angular'].includes(entry.name)) {
          stack.push(fullPath);
        }
      } else if (predicate(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  return results.sort();
}

function flattenKeys(value, prefix = '') {
  if (!isPlainObject(value)) {
    return prefix ? [prefix] : [];
  }
  return Object.entries(value).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
}

function flattenValues(value) {
  if (typeof value === 'string') {
    return [value];
  }
  if (!isPlainObject(value)) {
    return [];
  }
  return Object.values(value).flatMap(flattenValues);
}

function getPath(root, keyPath) {
  return keyPath.split('.').reduce((current, key) => {
    if (!isPlainObject(current)) {
      return undefined;
    }
    return current[key];
  }, root);
}

function isTranslationKeyLike(key) {
  return key.includes('.') || legacyKeyPrefixes.some((prefix) => key.startsWith(prefix)) || ['LANG', 'DIRECTION', 'ISO_LANG'].includes(key);
}

function isVisibleTextCandidate(value) {
  if (!value || value.length < 2) {
    return false;
  }
  if (allowedTextFragments.has(value)) {
    return false;
  }
  if (
    value.startsWith('@') ||
    value.startsWith('} @') ||
    value.includes('{{') ||
    value.includes('}}') ||
    /@\w+/.test(value) ||
    /[{}]/.test(value)
  ) {
    return false;
  }
  if (value.includes('| translate') || value.includes('translate=')) {
    return false;
  }
  if (/^[@#/*()[\].,;!?&\s-]+$/.test(value)) {
    return false;
  }
  if (technicalTextPattern.test(value)) {
    return false;
  }
  return /[A-Za-z\u0600-\u06FF]/.test(value);
}

function evaluateHardcodedTemplateTexts(findings) {
  const enforced = [];
  const ignored = [];

  for (const finding of findings) {
    const reason = hardcodedTemplateIgnoreReason(finding);
    if (reason) {
      ignored.push({ ...finding, reason });
    } else {
      enforced.push(finding);
    }
  }

  return { enforced, ignored };
}

function hardcodedTemplateIgnoreReason(finding) {
  if (finding.file === 'src/app/pages/dashboard/dashboard.component.html') {
    return 'dashboard showcase template';
  }
  if (sampleDataTexts.has(finding.text)) {
    return 'sample data literal';
  }
  if (finding.text.startsWith('/')) {
    return 'technical path literal';
  }
  if (dateTimeTextPattern.test(finding.text)) {
    return 'date/time sample literal';
  }
  if (currencyTextPattern.test(finding.text)) {
    return 'currency sample literal';
  }
  return '';
}

function normalizeTemplateText(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchStringProperty(block, prop) {
  return block.match(new RegExp(`${prop}:\\s*['"]([^'"]+)['"]`))?.[1];
}

function matchIdentifierProperty(block, prop) {
  return block.match(new RegExp(`${prop}:\\s*([A-Za-z0-9_]+)`))?.[1];
}

function matchDataProperty(block, prop) {
  return block.match(new RegExp(`${prop}:\\s*['"]([^'"]+)['"]`))?.[1];
}

function matchImportPath(block) {
  return block.match(/import\(\s*['"]([^'"]+)['"]\s*\)/)?.[1];
}

function matchThenComponent(block) {
  return block.match(/then\(\s*\([^)]*\)\s*=>\s*[^.]+\.([A-Za-z0-9_]+)\s*\)/)?.[1];
}

function resolveImport(fromFile, importPath) {
  const resolved = path.resolve(path.dirname(fromFile), importPath);
  return ensureTsFile(resolved);
}

function relative(file) {
  return path.relative(appRoot, file).replaceAll(path.sep, '/');
}

function unique(items) {
  return [...new Set(items)];
}

function toCamel(value) {
  return value.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function toTitle(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

main();
