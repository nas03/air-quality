import { DB } from '@/db';
import { config } from 'dotenv';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

config();

const dialect = new PostgresDialect({
	pool: new Pool({
		database: 'postgres',
		host: String(process.env.SUPABASE_DB_HOST),
		user: String(process.env.SUPABASE_DB_USER),
		port: 6543,
		password: String(process.env.SUPABASE_DB_PASSWORD),
		max: 10,
	}),
});

export const db = new Kysely<DB>({
	dialect,
});
