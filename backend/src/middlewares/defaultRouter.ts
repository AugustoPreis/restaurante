import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { convertBodyWithFiles } from './convertBodyWithFiles';

type RequestFunction = (req: Request, res: Response, next?: NextFunction) => void | Promise<void>;

export class DefaultRouter {
  public readonly router = Router();

  get(path: string, method: RequestFunction) {
    this.router.get(path, method);
  }

  post(path: string, method: RequestFunction) {
    this.router.post(path, method);
  }

  put(path: string, method: RequestFunction) {
    this.router.put(path, method);
  }

  delete(path: string, method: RequestFunction) {
    this.router.delete(path, method);
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