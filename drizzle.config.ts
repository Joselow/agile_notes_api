import { defineConfig } from "drizzle-kit";

// CLI para desarrollo 

export default defineConfig({
    schema: "./src/database/schemes/*",
    out: './src/database/drizzle',
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT!),
        database: process.env.DB_NAME!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        ssl: false,
    },
});
