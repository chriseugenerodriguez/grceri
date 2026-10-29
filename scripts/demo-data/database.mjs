import { readFile } from 'node:fs/promises';
import pg from 'pg';

export async function withDatabase(action, env = process.env, createClient = options => new pg.Client(options)) {
  if (!env.SUPABASE_DB_HOST || !env.SUPABASE_DB_PASSWORD) {
    throw new Error('Set SUPABASE_DB_HOST and SUPABASE_DB_PASSWORD in the root .env. Use the Session pooler host if IPv6 is unavailable.');
  }
  const ssl = { rejectUnauthorized: true };
  if (env.SUPABASE_DB_SSL_CA_FILE) ssl.ca = await readFile(env.SUPABASE_DB_SSL_CA_FILE, 'utf8');
  const client = createClient({
    host: env.SUPABASE_DB_HOST,
    port: Number(env.SUPABASE_DB_PORT || 5432),
    user: env.SUPABASE_DB_USER || 'postgres',
    password: env.SUPABASE_DB_PASSWORD,
    database: env.SUPABASE_DB_NAME || 'postgres',
    connectionTimeoutMillis: 15000,
    query_timeout: 30000,
    ssl
  });
  try {
    await client.connect();
    return await action(client);
  } catch (error) {
    // Connection errors must not print connection strings or credentials.
    const code = /^[A-Z0-9_]+$/.test(error.code || '') ? error.code : 'DATABASE_ERROR';
    throw new Error(`Database operation failed (${code}). Check the host, pooler username, password, and TLS certificate settings.`);
  } finally {
    await client.end();
  }
}

export async function saveDatabaseRows(client, rows) {
  await client.query('begin');
  try {
    for (const row of rows) {
      await client.query(`insert into grceri.demo_products (id, source, source_id, payload, updated_at)
        values ($1, $2, $3, $4::jsonb, now())
        on conflict (id) do update set source = excluded.source, source_id = excluded.source_id,
        payload = excluded.payload, updated_at = now()`,
      [row.id, row.source, row.source_id, JSON.stringify(row.payload)]);
    }
    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  }
}
