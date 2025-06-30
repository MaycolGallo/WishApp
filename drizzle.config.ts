import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
// This configuration file is used to generate the database schema and migrations for the Drizzle ORM with Expo SQLite.
// It specifies the SQLite dialect, the Expo driver, the schema file location, and the output