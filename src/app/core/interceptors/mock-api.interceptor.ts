import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { delay, from, mergeMap, of } from 'rxjs';
import { IS_SERVER_PLATFORM } from '../tokens';

const MOCK_API_PREFIX = 'api/';
const MOCK_DELAY = 150;
const SINGLETON_COLLECTIONS = new Set(['basicInformation', 'platformMetadata']);

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes(MOCK_API_PREFIX)) {
    return next(req);
  }

  const injector = inject(Injector);
  const isServer = inject(IS_SERVER_PLATFORM);
  const urlParts = req.url.split(MOCK_API_PREFIX)[1]?.split('/') || [];
  const collection = urlParts[0];
  const resourceId = urlParts[1];

  return from(import('@core/services/in-memory-db/in-memory-db.service')).pipe(
    mergeMap(({ InMemoryDbService }) => {
      const db = injector.get(InMemoryDbService);
      let body: unknown;
      let status = 200;

      switch (req.method) {
        case 'GET':
          if (resourceId) {
            body = db.getById(collection, resourceId);
            if (!body) status = 404;
          } else {
            const items = db.getAll(collection);
            body = SINGLETON_COLLECTIONS.has(collection) ? items[0] ?? null : items;
          }
          break;

        case 'POST':
          body = db.create(collection, req.body as Record<string, unknown>);
          status = 201;
          break;

        case 'PUT':
          if (resourceId) {
            body = db.update(collection, resourceId, req.body as Record<string, unknown>);
            if (!body) status = 404;
          } else {
            status = 400;
          }
          break;

        case 'DELETE':
          if (resourceId) {
            const deleted = db.delete(collection, resourceId);
            status = deleted ? 204 : 404;
            body = null;
          } else {
            status = 400;
          }
          break;

        default:
          return next(req);
      }

      const response$ = of(new HttpResponse({ status, body }));
      return isServer ? response$ : response$.pipe(delay(MOCK_DELAY));
    })
  );
};
