import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode';

export function convertBodyWithFiles(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body.isMultipartRequest === 'true' && typeof req.body.data === 'string') {
      req.body = JSON.parse(req.body.data);
    }

    next();
  } catch (message) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message });
  }
}