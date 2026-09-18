import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

// SAARTHI uses $0-Cost GitHub Repository State Authority
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'saarthi',
    ssl: false,
  },
  verbose: false,
});

