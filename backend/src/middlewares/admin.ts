import { NextFunction, Request, Response } from 'express';
import { RequestError } from '../utils/RequestError';
import { HttpStatusCode } from '../enums/HttpStatusCode';

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user.admin) {
    return next();
  }

  const requestError = new RequestError(HttpStatusCode.FORBIDDEN, 'Ação restrita a administradores');

  return next(requestError);
}