// lib/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Lightweight HTTP client that avoids connection pooling overhead
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });