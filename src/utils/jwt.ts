import jwt from 'jsonwebtoken';

export const generateToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(payload, secret, { expiresIn });
};