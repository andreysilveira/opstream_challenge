import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, throwError, delay, mergeMap } from 'rxjs';
import { schemas } from '../mocks/schemas';

export const backendServiceInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;

  if (!url.startsWith('/api/')) {
    return next(req);
  }

  const latency = randomLatency();
  const fail = shouldFail();

  return of(null).pipe(
    delay(latency),
    mergeMap(() => {
      if (fail) {
        return throwError(
          () => new HttpErrorResponse({ status: 500, statusText: 'Mock API failure' })
        );
      }

      // GET /api/schemas
      if (url === '/api/schemas' && method === 'GET') {
        return of(new HttpResponse({ status: 200, body: schemas }));
      }

      // GET /api/schemas/:id
      if (url.match(/\/api\/schemas\/[\w-]+$/) && method === 'GET') {
        const id = url.split('/').pop()!;
        const schema = schemas.find((s) => s.id === id);
        if (!schema) {
          return throwError(
            () => new HttpErrorResponse({ status: 404, statusText: 'Schema not found' })
          );
        }
        return of(new HttpResponse({ status: 200, body: schema }));
      }

      // PUT /api/requests/:id/question/:questionId
      if (url.match(/\/api\/requests\/[\w-]+\/question\/\d+$/) && method === 'PUT') {
        const [, , requestId, , questionId] = url.split('/');
        const response = {
          requestId,
          questionId: Number(questionId),
          value: body,
          saved: true,
        };
        return of(new HttpResponse({ status: 200, body: response }));
      }

      return throwError(
        () => new HttpErrorResponse({ status: 404, statusText: 'Not found' })
      );
    })
  );
};

// Helpers
function randomLatency() {
  return Math.floor(Math.random() * (1000 - 600 + 1)) + 600;
}

function shouldFail() {
  return Math.random() < 0.15;
}
