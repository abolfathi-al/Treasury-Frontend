import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express, { Request, Response, NextFunction, Express } from 'express';
import compression from 'compression';
import { createReadStream, existsSync, promises as fsPromises } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { join, resolve } from 'node:path';
import bootstrap from './main.server';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SERVER_CONSTANTS = {
  DEFAULT_PORT: '4000',
  DEFAULT_BASE_HREF: '/',
  CACHE_MANAGE_INTERVAL: 10,
  CACHE_MAX_AGE_SECONDS: 31536000,
  MILLISECONDS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
} as const;

const HTTP_CONSTANTS = {
  STATUS_CODES: {
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    GATEWAY_TIMEOUT: 504,
    MOVED_PERMANENTLY: 301,
  },
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    CONTENT_LENGTH: 'Content-Length',
    CONTENT_ENCODING: 'Content-Encoding',
    CACHE_CONTROL: 'Cache-Control',
    VARY: 'Vary',
    X_CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
    X_FRAME_OPTIONS: 'X-Frame-Options',
    X_XSS_PROTECTION: 'X-XSS-Protection',
    REFERRER_POLICY: 'Referrer-Policy',
    PERMISSIONS_POLICY: 'Permissions-Policy',
    CONTENT_SECURITY_POLICY: 'Content-Security-Policy',
    STRICT_TRANSPORT_SECURITY: 'Strict-Transport-Security',
    X_SSR_CACHE: 'X-SSR-Cache',
    X_PRECOMPRESSED: 'X-Precompressed',
  },
  HEADER_VALUES: {
    NOSNIFF: 'nosniff',
    SAMEORIGIN: 'SAMEORIGIN',
    XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'geolocation=(), microphone=(), camera=()',
    CACHE_CONTROL: 'public, max-age=31536000, immutable',
    ACCEPT_ENCODING: 'Accept-Encoding',
    PRECOMPRESSED: '1',
    CACHE_HIT: 'HIT',
    CACHE_MISS: 'MISS',
  },
} as const;

const ERROR_CODES = {
  PREMATURE_CLOSE: 'ERR_STREAM_PREMATURE_CLOSE',
  CONNECTION_RESET: 'ECONNRESET',
} as const;

const ENCODING_TYPES = {
  BROTLI: 'br',
  GZIP: 'gzip',
} as const;

const FILE_EXTENSIONS = {
  BROTLI: '.br',
  GZIP: '.gz',
  SOURCE_MAP: '.map',
} as const;

const CONFIG = {
  PORT: parseInt(process.env['PORT'] || SERVER_CONSTANTS.DEFAULT_PORT, 10),
  DIST_FOLDER: join(process.cwd(), 'dist/velora/browser'),
  SSR_CACHE_TTL: 5 * SERVER_CONSTANTS.SECONDS_PER_MINUTE * SERVER_CONSTANTS.MILLISECONDS_PER_SECOND,
  SSR_CACHE_MAX_SIZE: 100,
  SSR_TIMEOUT: 10000,
  COMPRESSION_LEVEL: 6,
  COMPRESSION_THRESHOLD: 1024,
  IS_PRODUCTION: process.env['NODE_ENV'] === 'production',
} as const;

const SSR_WARMUP_ROUTES = ['/dashboard'];

const STATIC_FILE_EXTENSIONS = {
  JAVASCRIPT: ['.js', '.mjs'],
  STYLESHEET: ['.css'],
  DATA: ['.json', '.xml', '.txt', '.webmanifest'],
  IMAGE: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'],
  FONT: ['.woff', '.woff2', '.ttf', '.eot', '.otf'],
  MEDIA: ['.mp4', '.webm', '.mp3', '.wav'],
  ARCHIVE: ['.pdf', '.zip', '.tar'],
  COMPRESSED: ['.gz', '.br'],
  SOURCE_MAP: ['.map'],
} as const;

const STATIC_EXTENSIONS = [
  ...STATIC_FILE_EXTENSIONS.JAVASCRIPT,
  ...STATIC_FILE_EXTENSIONS.STYLESHEET,
  ...STATIC_FILE_EXTENSIONS.DATA,
  ...STATIC_FILE_EXTENSIONS.IMAGE,
  ...STATIC_FILE_EXTENSIONS.FONT,
  ...STATIC_FILE_EXTENSIONS.MEDIA,
  ...STATIC_FILE_EXTENSIONS.ARCHIVE,
  ...STATIC_FILE_EXTENSIONS.COMPRESSED,
  ...STATIC_FILE_EXTENSIONS.SOURCE_MAP,
] as const;

const COMPRESSIBLE_FILE_EXTENSIONS = [
  ...STATIC_FILE_EXTENSIONS.JAVASCRIPT,
  ...STATIC_FILE_EXTENSIONS.STYLESHEET,
  ...STATIC_FILE_EXTENSIONS.DATA,
  '.html',
  '.xml',
  '.svg',
  '.txt',
  '.webmanifest',
] as const;

const MIME_TYPES: Record<string, string> = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

const COMPRESSIBLE_TYPES = [
  'text/',
  'application/javascript',
  'application/json',
  'application/manifest+json',
  'application/xml',
  'application/xhtml+xml',
  'image/svg+xml',
] as const;
const TIMEOUT_HTML = `<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Server Timeout</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5;direction:rtl}.error-container{text-align:center;padding:2rem;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}h1{color:#dc3545;margin:0 0 1rem 0}p{color:#666;margin:0}</style></head><body><div class="error-container"><h1>خطای زمان‌بندی سرور</h1><p>سرور بیش از حد انتظار طول کشید تا پاسخ دهد.</p></div></body></html>`;

// ============================================================================
// TYPES
// ============================================================================

interface SSRCacheEntry {
  html: string;
  timestamp: number;
}

interface CompressionRequest extends Request {
  _precompressed?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

const normalizeUrl = (url: string): string => url.split('?')[0].split('#')[0];
const isStaticFile = (url: string): boolean => STATIC_EXTENSIONS.some(ext => normalizeUrl(url).endsWith(ext));
const getMimeType = (path: string): string => Object.entries(MIME_TYPES).find(([ext]) => path.endsWith(ext))?.[1] || 'application/octet-stream';
const getBasePath = (path: string): string => path.endsWith(FILE_EXTENSIONS.BROTLI) || path.endsWith(FILE_EXTENSIONS.GZIP) ? path.slice(0, -3) : path;
const isLocalhost = (host: string): boolean => host.includes('localhost') || host.includes('127.0.0.1');
const isPrematureCloseError = (error: unknown): boolean => {
  const errorCode = (error as NodeJS.ErrnoException)?.code;
  return errorCode === ERROR_CODES.PREMATURE_CLOSE || errorCode === ERROR_CODES.CONNECTION_RESET;
};

const PATH_ERRORS = {
  TRAVERSAL_DETECTED: 'Path traversal detected',
  UNKNOWN_ERROR: 'Unknown error',
} as const;

function resolvePath(distFolder: string, relativePath: string): { success: boolean; fullPath?: string; error?: string } {
  try {
    const resolved = resolve(join(distFolder, relativePath));
    if (!resolved.startsWith(resolve(distFolder))) {
      return { success: false, error: PATH_ERRORS.TRAVERSAL_DETECTED };
    }
    return { success: true, fullPath: resolved };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : PATH_ERRORS.UNKNOWN_ERROR };
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await fsPromises.access(path);
    return true;
  } catch {
    return false;
  }
}

async function findBestFile(basePath: string, acceptEncoding: string): Promise<{ filePath: string; encoding: string | null; contentType: string | null } | null> {
  if (acceptEncoding.includes(ENCODING_TYPES.BROTLI)) {
    const brPath = `${basePath}${FILE_EXTENSIONS.BROTLI}`;
    if (await fileExists(brPath)) {
      return { filePath: brPath, encoding: ENCODING_TYPES.BROTLI, contentType: getMimeType(getBasePath(basePath)) };
    }
  }
  if (acceptEncoding.includes(ENCODING_TYPES.GZIP)) {
    const gzPath = `${basePath}${FILE_EXTENSIONS.GZIP}`;
    if (await fileExists(gzPath)) {
      return { filePath: gzPath, encoding: ENCODING_TYPES.GZIP, contentType: getMimeType(getBasePath(basePath)) };
    }
  }
  if (await fileExists(basePath)) {
    return { filePath: basePath, encoding: null, contentType: getMimeType(basePath) };
  }
  return null;
}

async function serveFile(req: CompressionRequest, res: Response, options: { filePath: string; encoding: string | null; contentType: string | null }): Promise<void> {
  const stats = await fsPromises.stat(options.filePath);
  if (options.contentType) {
    res.setHeader(HTTP_CONSTANTS.HEADERS.CONTENT_TYPE, options.contentType);
  }
  res.setHeader(HTTP_CONSTANTS.HEADERS.CACHE_CONTROL, HTTP_CONSTANTS.HEADER_VALUES.CACHE_CONTROL);
  res.setHeader(HTTP_CONSTANTS.HEADERS.CONTENT_LENGTH, stats.size.toString());
  
  if (options.encoding) {
    res.setHeader(HTTP_CONSTANTS.HEADERS.CONTENT_ENCODING, options.encoding);
    res.setHeader(HTTP_CONSTANTS.HEADERS.VARY, HTTP_CONSTANTS.HEADER_VALUES.ACCEPT_ENCODING);
    res.setHeader(HTTP_CONSTANTS.HEADERS.X_PRECOMPRESSED, HTTP_CONSTANTS.HEADER_VALUES.PRECOMPRESSED);
    req._precompressed = true;
  }
  
  try {
    await pipeline(createReadStream(options.filePath), res);
  } catch (error) {
    if (isPrematureCloseError(error)) {
      if (!CONFIG.IS_PRODUCTION && !res.headersSent) {
        console.warn(LOG_MESSAGES.STATIC_FILE_CLOSED(req.originalUrl || ''));
      }
      return;
    }
    throw error;
  }
}

function manageCache(cache: Map<string, SSRCacheEntry>): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp >= CONFIG.SSR_CACHE_TTL) {
      cache.delete(key);
      if (!CONFIG.IS_PRODUCTION) console.log(LOG_MESSAGES.SSR_CACHE_EXPIRED(key));
    }
  }
  if (cache.size >= CONFIG.SSR_CACHE_MAX_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) {
      cache.delete(firstKey);
      if (!CONFIG.IS_PRODUCTION) console.log(LOG_MESSAGES.SSR_CACHE_EVICTED(firstKey));
    }
  }
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

const SECURITY_CONSTANTS = {
  CSP_DIRECTIVES: {
    DEFAULT_SRC: "default-src 'self'",
    SCRIPT_SRC: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://picsum.photos",
    STYLE_SRC: "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    FONT_SRC: "font-src 'self' https://fonts.gstatic.com data:",
    IMG_SRC: "img-src 'self' data: https: blob:",
    CONNECT_SRC: "connect-src 'self' https: wss:",
    FRAME_ANCESTORS: "frame-ancestors 'self'",
    BASE_URI: "base-uri 'self'",
    FORM_ACTION: "form-action 'self'",
    OBJECT_SRC: "object-src 'none'",
    UPGRADE_INSECURE_REQUESTS: "upgrade-insecure-requests",
  },
  HSTS_MAX_AGE: 'max-age=31536000; includeSubDomains; preload',
  PROTOCOL_HTTPS: 'https',
  X_FORWARDED_PROTO: 'x-forwarded-proto',
} as const;

function setupSecurityHeaders(server: Express): void {
  server.use((req: Request, res: Response, next: NextFunction) => {
    const host = req.headers.host || req.get('host') || '';
    const localhost = isLocalhost(host);
    
    res.setHeader(HTTP_CONSTANTS.HEADERS.X_CONTENT_TYPE_OPTIONS, HTTP_CONSTANTS.HEADER_VALUES.NOSNIFF);
    res.setHeader(HTTP_CONSTANTS.HEADERS.X_FRAME_OPTIONS, HTTP_CONSTANTS.HEADER_VALUES.SAMEORIGIN);
    
    if (!localhost) {
      res.setHeader(HTTP_CONSTANTS.HEADERS.X_XSS_PROTECTION, HTTP_CONSTANTS.HEADER_VALUES.XSS_PROTECTION);
      res.setHeader(HTTP_CONSTANTS.HEADERS.REFERRER_POLICY, HTTP_CONSTANTS.HEADER_VALUES.REFERRER_POLICY);
      res.setHeader(HTTP_CONSTANTS.HEADERS.PERMISSIONS_POLICY, HTTP_CONSTANTS.HEADER_VALUES.PERMISSIONS_POLICY);
      
      const csp = [
        SECURITY_CONSTANTS.CSP_DIRECTIVES.DEFAULT_SRC,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.SCRIPT_SRC,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.STYLE_SRC,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.FONT_SRC,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.IMG_SRC,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.CONNECT_SRC,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.FRAME_ANCESTORS,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.BASE_URI,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.FORM_ACTION,
        SECURITY_CONSTANTS.CSP_DIRECTIVES.OBJECT_SRC,
        ...(CONFIG.IS_PRODUCTION ? [SECURITY_CONSTANTS.CSP_DIRECTIVES.UPGRADE_INSECURE_REQUESTS] : []),
      ].join('; ');
      res.setHeader(HTTP_CONSTANTS.HEADERS.CONTENT_SECURITY_POLICY, csp);
      
      if (CONFIG.IS_PRODUCTION && !req.secure && req.headers[SECURITY_CONSTANTS.X_FORWARDED_PROTO] !== SECURITY_CONSTANTS.PROTOCOL_HTTPS) {
        return res.redirect(HTTP_CONSTANTS.STATUS_CODES.MOVED_PERMANENTLY, `${SECURITY_CONSTANTS.PROTOCOL_HTTPS}://${host}${req.originalUrl || req.url}`);
      }
      
      if (req.secure || req.headers[SECURITY_CONSTANTS.X_FORWARDED_PROTO] === SECURITY_CONSTANTS.PROTOCOL_HTTPS) {
        res.setHeader(HTTP_CONSTANTS.HEADERS.STRICT_TRANSPORT_SECURITY, SECURITY_CONSTANTS.HSTS_MAX_AGE);
      }
    }
    next();
  });
}

function shouldCompress(req: Request, res: Response): boolean {
  const compReq = req as CompressionRequest;
  if (compReq._precompressed || res.getHeader('Content-Encoding')) {
    return false;
  }
  
  const contentType = String(res.getHeader('Content-Type') || req.headers['content-type'] || '').toLowerCase();
  if (COMPRESSIBLE_TYPES.some(type => contentType.includes(type.toLowerCase()))) {
    return true;
  }
  
  if (!contentType) {
    const url = req.originalUrl || req.url || '';
    return COMPRESSIBLE_FILE_EXTENSIONS.some(ext => url.endsWith(ext));
  }
  
  return false;
}

function setupCompression(server: Express): void {
  server.use(compression({
    filter: shouldCompress,
    level: CONFIG.COMPRESSION_LEVEL,
    threshold: CONFIG.COMPRESSION_THRESHOLD,
  }));
}

const ERROR_MESSAGES = {
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  FILE_NOT_FOUND: 'File not found',
  SOURCE_MAP_NOT_FOUND: 'Source map not found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  AN_ERROR_OCCURRED: 'An error occurred',
} as const;

function setupStaticHandler(server: Express, distFolder: string): void {
  server.use(async (req: CompressionRequest, res: Response, next: NextFunction) => {
    const url = normalizeUrl(req.originalUrl || req.url || '');
    if (!isStaticFile(url) || url.endsWith(FILE_EXTENSIONS.BROTLI) || url.endsWith(FILE_EXTENSIONS.GZIP)) {
      return next();
    }
    
    const relativePath = url.startsWith('/') ? url.substring(1) : url;
    const pathResult = resolvePath(distFolder, relativePath);
    if (!pathResult.success || !pathResult.fullPath) {
      return res.status(HTTP_CONSTANTS.STATUS_CODES.FORBIDDEN).json({ error: pathResult.error || ERROR_MESSAGES.FORBIDDEN });
    }
    
    const acceptEncodingHeader = req.headers[HTTP_CONSTANTS.HEADER_VALUES.ACCEPT_ENCODING];
    const acceptEncoding = Array.isArray(acceptEncodingHeader)
      ? acceptEncodingHeader.join(',')
      : acceptEncodingHeader || '';
    const fileOptions = await findBestFile(pathResult.fullPath, acceptEncoding);
    
    if (fileOptions) {
      try {
        await serveFile(req, res, fileOptions);
      } catch (error) {
        if (isPrematureCloseError(error)) {
          return;
        }
        if (!res.headersSent) {
          next(error);
        }
      }
    } else {
      if (url.endsWith(FILE_EXTENSIONS.SOURCE_MAP) && !CONFIG.IS_PRODUCTION) {
        if (!res.headersSent) {
          res.status(HTTP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.SOURCE_MAP_NOT_FOUND, path: req.originalUrl });
        }
        return;
      }
      next();
    }
  });
}

const SERVER_MESSAGES = {
  STARTUP: {
    LISTENING: (port: number) => `✅ Node Express server listening on http://localhost:${port}`,
    SERVING_FROM: (folder: string) => `📁 Serving from: ${folder}`,
    CACHE_TTL: (ttl: number) => `⚙️  SSR Cache TTL: ${ttl}s`,
    COMPRESSION: (level: number, threshold: number) => `📦 Compression: Level ${level}, Threshold: ${threshold} bytes`,
  },
  SHUTDOWN: {
    GRACEFUL: 'Shutting down gracefully...',
    CLOSED: 'Server closed',
  },
  ERRORS: {
    STARTUP_FAILED: 'Failed to start server:',
    DIST_FOLDER_NOT_FOUND: (folder: string) => `Dist folder not found: ${folder}`,
    INDEX_HTML_NOT_FOUND: (path: string) => `Index HTML not found: ${path}`,
  },
} as const;

const LOG_MESSAGES = {
  SSR_CACHE_HIT: (key: string) => `[SSR Cache HIT] ${key}`,
  SSR_CACHE_MISS: (key: string, ttl: number) => `[SSR Cache MISS] ${key} - Cached for ${ttl}s`,
  SSR_CACHE_EXPIRED: (key: string) => `[SSR Cache EXPIRED] ${key}`,
  SSR_CACHE_EVICTED: (key: string) => `[SSR Cache] Evicted: ${key}`,
  SSR_ERROR: (key: string, message: string) => `[SSR Error] Failed to render ${key}: ${message}`,
  SSR_WARMUP_CACHED: (route: string) => `[SSR Warmup] Cached: ${route}`,
  SSR_WARMUP_FAILED: (route: string, message: string) => `[SSR Warmup] Failed: ${route} ${message}`,
  STATIC_FILE_CLOSED: (url: string) => `[Static File] Client closed connection: ${url}`,
  SERVER_WARNING_SOURCE_MAP: (url: string) => `[Server Warning] Source map request closed: ${url}`,
  DEPRECATION: (message: string) => `[Deprecation] ${message}`,
  DEPRECATION_INFO: 'This warning comes from a dependency and will be resolved in a future update.',
  WARNING: (name: string, message: string) => `[Warning] ${name}: ${message}`,
} as const;

function setupSSRHandler(server: Express, distFolder: string, indexHtml: string, engine: CommonEngine, cache: Map<string, SSRCacheEntry>): void {
  server.use((req: Request, res: Response, next: NextFunction) => {
    const url = normalizeUrl(req.originalUrl);
    
    if (isStaticFile(url)) {
      const relativePath = url.startsWith('/') ? url.substring(1) : url;
      const pathResult = resolvePath(distFolder, relativePath);
      if (pathResult.success && pathResult.fullPath && existsSync(pathResult.fullPath)) {
        return next();
      }
      return res.status(HTTP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.FILE_NOT_FOUND, path: req.originalUrl });
    }
    
    const cacheKey = req.originalUrl;
    if (cache.size > 0 && cache.size % SERVER_CONSTANTS.CACHE_MANAGE_INTERVAL === 0) {
      manageCache(cache);
    }
    
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CONFIG.SSR_CACHE_TTL) {
      if (!res.headersSent) {
        res.setHeader(HTTP_CONSTANTS.HEADERS.X_SSR_CACHE, HTTP_CONSTANTS.HEADER_VALUES.CACHE_HIT);
        if (!CONFIG.IS_PRODUCTION) console.log(LOG_MESSAGES.SSR_CACHE_HIT(cacheKey));
        return res.send(cached.html);
      }
    } else if (cached) {
      cache.delete(cacheKey);
      if (!CONFIG.IS_PRODUCTION) console.log(LOG_MESSAGES.SSR_CACHE_EXPIRED(cacheKey));
    }
    
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(HTTP_CONSTANTS.STATUS_CODES.GATEWAY_TIMEOUT).send(TIMEOUT_HTML);
      }
    }, CONFIG.SSR_TIMEOUT);
    
    const { protocol, headers } = req;
    engine.render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${req.originalUrl}`,
      publicPath: distFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl || SERVER_CONSTANTS.DEFAULT_BASE_HREF }],
    })
      .then((html: string) => {
        clearTimeout(timeout);
        if (!res.headersSent) {
          cache.set(cacheKey, { html, timestamp: Date.now() });
          manageCache(cache);
          if (!CONFIG.IS_PRODUCTION) {
            const ttlSeconds = CONFIG.SSR_CACHE_TTL / SERVER_CONSTANTS.MILLISECONDS_PER_SECOND;
            console.log(LOG_MESSAGES.SSR_CACHE_MISS(cacheKey, ttlSeconds));
          }
          res.setHeader(HTTP_CONSTANTS.HEADERS.X_SSR_CACHE, HTTP_CONSTANTS.HEADER_VALUES.CACHE_MISS);
          res.send(html);
        }
      })
      .catch((err: Error) => {
        clearTimeout(timeout);
        if (!res.headersSent) {
          console.error(LOG_MESSAGES.SSR_ERROR(cacheKey, err.message));
          next(err);
        }
      })
      .finally(() => clearTimeout(timeout));
  });
}

function setupErrorHandler(server: Express): void {
  server.use((req: Request, res: Response) => {
    res.status(HTTP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
      error: ERROR_MESSAGES.NOT_FOUND,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  });
  
  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const isPrematureClose = isPrematureCloseError(err);
    const isSourceMap = req.originalUrl?.endsWith(FILE_EXTENSIONS.SOURCE_MAP);
    
    if (isPrematureClose && isSourceMap) {
      if (!CONFIG.IS_PRODUCTION) {
        console.warn(LOG_MESSAGES.SERVER_WARNING_SOURCE_MAP(req.originalUrl || ''));
      }
      return;
    }
    
    if (!isPrematureClose) {
      console.error('[Server Error]', {
        error: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      });
    }
    
    if (!res.headersSent) {
      res.status(HTTP_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        message: CONFIG.IS_PRODUCTION ? ERROR_MESSAGES.AN_ERROR_OCCURRED : err.message,
        timestamp: new Date().toISOString(),
      });
    }
  });
}

const WARMUP_CONSTANTS = {
  PROTOCOL: 'http',
  HOST: 'localhost',
} as const;

async function warmupCache(engine: CommonEngine, indexHtml: string, distFolder: string, cache: Map<string, SSRCacheEntry>): Promise<void> {
  if (SSR_WARMUP_ROUTES.length === 0) return;
  
  await Promise.allSettled(SSR_WARMUP_ROUTES.map(async (route) => {
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
    if (cache.has(normalizedRoute)) return;
    
    try {
      const html = await engine.render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${WARMUP_CONSTANTS.PROTOCOL}://${WARMUP_CONSTANTS.HOST}:${CONFIG.PORT}${normalizedRoute}`,
        publicPath: distFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: SERVER_CONSTANTS.DEFAULT_BASE_HREF }],
      });
      cache.set(normalizedRoute, { html, timestamp: Date.now() });
      manageCache(cache);
      if (!CONFIG.IS_PRODUCTION) console.log(LOG_MESSAGES.SSR_WARMUP_CACHED(normalizedRoute));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(LOG_MESSAGES.SSR_WARMUP_FAILED(normalizedRoute, errorMessage));
    }
  }));
}

// ============================================================================
// MAIN
// ============================================================================

const STATIC_OPTIONS = {
  maxAge: '1y',
  index: false,
  immutable: true,
  etag: true,
  lastModified: true,
} as const;

const EXPRESS_SETTINGS = {
  VIEW_ENGINE: 'view engine',
  VIEWS: 'views',
  TRUST_PROXY: 'trust proxy',
  VIEW_ENGINE_VALUE: 'html',
  TRUST_PROXY_VALUE: true,
} as const;

function validateServerRequirements(distFolder: string): string {
  if (!existsSync(distFolder)) {
    throw new Error(SERVER_MESSAGES.ERRORS.DIST_FOLDER_NOT_FOUND(distFolder));
  }
  
  const indexOriginal = join(distFolder, 'index.original.html');
  const indexHtml = existsSync(indexOriginal) ? indexOriginal : join(distFolder, 'index.html');
  
  if (!existsSync(indexHtml)) {
    throw new Error(SERVER_MESSAGES.ERRORS.INDEX_HTML_NOT_FOUND(indexHtml));
  }
  
  return indexHtml;
}

function configureExpressServer(server: Express, distFolder: string): void {
  server.set(EXPRESS_SETTINGS.VIEW_ENGINE, EXPRESS_SETTINGS.VIEW_ENGINE_VALUE);
  server.set(EXPRESS_SETTINGS.VIEWS, distFolder);
  server.set(EXPRESS_SETTINGS.TRUST_PROXY, EXPRESS_SETTINGS.TRUST_PROXY_VALUE);
}

function setupMiddleware(server: Express, distFolder: string, indexHtml: string, engine: CommonEngine, cache: Map<string, SSRCacheEntry>): void {
  setupSecurityHeaders(server);
  setupCompression(server);
  setupStaticHandler(server, distFolder);
  server.use(express.static(distFolder, STATIC_OPTIONS));
  setupSSRHandler(server, distFolder, indexHtml, engine, cache);
  setupErrorHandler(server);
}

export async function app(): Promise<Express> {
  const server = express();
  const indexHtml = validateServerRequirements(CONFIG.DIST_FOLDER);
  const engine = new CommonEngine();
  const cache = new Map<string, SSRCacheEntry>();
  
  configureExpressServer(server, CONFIG.DIST_FOLDER);
  setupMiddleware(server, CONFIG.DIST_FOLDER, indexHtml, engine, cache);
  await warmupCache(engine, indexHtml, CONFIG.DIST_FOLDER, cache);
  
  return server;
}

const DEPRECATION_WARNINGS = {
  UTIL_EXTEND: 'DEP0060',
} as const;

function setupDeprecationHandlers(): void {
  process.on('warning', (warning: Error & { code?: string }) => {
    const isUtilExtendDeprecation = warning.name === 'DeprecationWarning' && 
                                     (warning as any).code === DEPRECATION_WARNINGS.UTIL_EXTEND;
    
    if (isUtilExtendDeprecation) {
      if (!CONFIG.IS_PRODUCTION) {
        console.warn(LOG_MESSAGES.DEPRECATION(warning.message));
        console.warn(LOG_MESSAGES.DEPRECATION_INFO);
      }
      return;
    }
    
    if (!CONFIG.IS_PRODUCTION) {
      console.warn(LOG_MESSAGES.WARNING(warning.name, warning.message));
    }
  });
}

function setupShutdownHandlers(httpServer: ReturnType<Express['listen']>): void {
  const shutdown = () => {
    console.log(SERVER_MESSAGES.SHUTDOWN.GRACEFUL);
    httpServer.close(() => {
      console.log(SERVER_MESSAGES.SHUTDOWN.CLOSED);
      process.exit(0);
    });
  };
  
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

function logServerStartup(): void {
  console.log(SERVER_MESSAGES.STARTUP.LISTENING(CONFIG.PORT));
  console.log(SERVER_MESSAGES.STARTUP.SERVING_FROM(CONFIG.DIST_FOLDER));
  const ttlSeconds = CONFIG.SSR_CACHE_TTL / SERVER_CONSTANTS.MILLISECONDS_PER_SECOND;
  console.log(SERVER_MESSAGES.STARTUP.CACHE_TTL(ttlSeconds));
  console.log(SERVER_MESSAGES.STARTUP.COMPRESSION(CONFIG.COMPRESSION_LEVEL, CONFIG.COMPRESSION_THRESHOLD));
}

async function run(): Promise<void> {
  try {
    setupDeprecationHandlers();
    
    const server = await app();
    const httpServer = server.listen(CONFIG.PORT, logServerStartup);
    
    setupShutdownHandlers(httpServer);
  } catch (error) {
    console.error(SERVER_MESSAGES.ERRORS.STARTUP_FAILED, error);
    process.exit(1);
  }
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule?.filename || '';

if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  void run();
}

export default bootstrap;
