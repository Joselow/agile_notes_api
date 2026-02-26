import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

import { fileURLToPath } from 'url';
import path from 'path';

import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configuramos el cliente de forma manual para cerrarlo al terminar
const client = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),

  max: 1, // Solo una conexión para migrar
});

async function runMigration() {
  const db = drizzle(client);

  console.log('⏳ Revisando migraciones pendientes...');
  
  try {
    // 2. Esta función busca la tabla de control (__drizzle_migrations)
    // Si no existe, la crea. Si existe, solo aplica los SQL nuevos.
    await migrate(db, { migrationsFolder: path.resolve(__dirname, '../../src/database/drizzle') });
    
    console.log('✅ Base de Datos sincronizada correctamente.');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    await client.end(); // Cerramos la conexión
  }
}

runMigration();