import express from "express";
import cors from "cors";

import helmet from "helmet";
import morgan from "morgan";

import 'dotenv/config';

import notesRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.js";

import { globalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/nodFound.js";

const app = express();

app.set('trust proxy', 1); // ← importante

// Aplicas el rate limit a TODA la API (todo lo que cuelga de /api)
app.use('/api', globalLimiter);

// Middleware de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors ({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

console.log(process.env.CORS_ORIGIN);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Logging con Morgan en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


app.use("/api/v1", notesRoutes);
app.use("/api/v1", authRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Notes api',
    version: '1.0.0',
    endpoints: {
      api: '/api/v1',
    },
  });
});

app.use(notFound);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

app.use(errorHandler);