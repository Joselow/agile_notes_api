import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';

import { getUserByEmail } from '../services/userService.js';
import { authenticateToken } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

import { catchErrors, catchMiddlewareErrors } from '../utils/catchErrors.js';
import { success } from '../utils/responses.js';
import { generateToken } from '../utils/jwt.js';


import { BadRequestError400 } from '../errors/BadRequestError400.js';
import { InvalidCredentialsError401 } from '../errors/InvalidCredentials401.js';


const router = Router();

// POST /auth/login - Iniciar sesión
router.post('/login', loginLimiter, catchErrors(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError400('Email y contraseña son requeridos');
    }

    // Buscar usuario por email
    const user = await getUserByEmail(email);
    if (!user) {
        throw new InvalidCredentialsError401('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsError401('Credenciales inválidas');
    }

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Enviar respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = user;

    success(res, 200, {
      message: 'Se ha iniciado sesión correctamente',
      user: userWithoutPassword,
      token
    });
}));


// GET /auth/me - Obtener información del usuario actual
router.get('/me', catchMiddlewareErrors(authenticateToken), catchErrors(async (req: Request, res: Response) => {
    // El middleware de autenticación ya verificó el token
    // y agregó la información del usuario a req.user
    if (!req.user) {
      throw new InvalidCredentialsError401('No autorizado');
    }

    const userFound = req.user

    success(res, 200, userFound);
}));

export default router; 