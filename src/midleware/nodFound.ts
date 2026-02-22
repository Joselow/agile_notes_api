import type { NextFunction, Request, Response } from "express";

import { NotFoundError404 } from "../errors/NotFoundError404.js";

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError404(`Not Found - ${req.originalUrl}`);
  next(error);
};