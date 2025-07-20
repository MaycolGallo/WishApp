import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from '../db/schema';

const expoDb = openDatabaseSync('wishlists');
export const db = drizzle(expoDb, { schema, logger: true });
