import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { InvalidCredentialsError401 } from '../errors/InvalidCredentials401.js';
import { catchMiddlewareErrors } from '../utils/catchErrors.js';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw new InvalidCredentialsError401('Token de acceso requerido');
  }

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const decoded = jwt.verify(token, secret);
  req.user = decoded;
  next();
};

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.EXTERNAL_STATIC_TOKEN) {
    throw new InvalidCredentialsError401('No autorizado');
  }
  next(); // Si coincide, pasa
};

export const authRecordNotes = catchMiddlewareErrors((req: Request, res: Response, next: NextFunction) => {
  const source = req.headers['x-auth-source'];

  if (source === (process.env.AUTH_SOURCE ?? 'external')) {
    // Si la fuente es externa, ejecutamos el middleware de API Key Estática
    return validateApiKey(req, res, next);
  }

  // Por defecto, si no hay header o es 'app', usamos el de JWT
  return authenticateToken(req, res, next);
});
