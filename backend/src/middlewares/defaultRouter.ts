import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { convertBodyWithFiles } from './convertBodyWithFiles';

type RequestFunction = (req: Request, res: Response, next?: NextFunction) => void | Promise<void>;

export class DefaultRouter {
  public readonly router = Router();

  private normalizeMiddlewares(middlewares: RequestHandler | RequestHandler[]): RequestHandler[] {
    if (!middlewares) {
      return [];
    }

    if (!Array.isArray(middlewares)) {
      return [middlewares];
    }

    return middlewares;
  }

  get(path: string, method: RequestFunction, middlewares?: RequestHandler | RequestHandler[]) {
    this.router.get(path, this.normalizeMiddlewares(middlewares), method);
  }

  post(path: string, method: RequestFunction, middlewares?: RequestHandler | RequestHandler[]) {
    this.router.post(path, this.normalizeMiddlewares(middlewares), method);
  }

  put(path: string, method: RequestFunction, middlewares?: RequestHandler | RequestHandler[]) {
    this.router.put(path, this.normalizeMiddlewares(middlewares), method);
  }

  delete(path: string, method: RequestFunction, middlewares?: RequestHandler | RequestHandler[]) {
    this.router.delete(path, this.normalizeMiddlewares(middlewares), method);
  }

  postUpload(path: string, method: RequestFunction, middlewares: RequestHandler | RequestHandler[]) {
    if (!Array.isArray(middlewares)) {
      middlewares = [middlewares];
    }

    middlewares.push(convertBodyWithFiles);

    this.router.post(path, middlewares, method);
  }

  putUpload(path: string, method: RequestFunction, middlewares: RequestHandler | RequestHandler[]) {
    if (!Array.isArray(middlewares)) {
      middlewares = [middlewares];
    }

    middlewares.push(convertBodyWithFiles);

    this.router.put(path, middlewares, method);
  }
}