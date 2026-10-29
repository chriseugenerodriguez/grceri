import test from 'node:test';
import assert from 'node:assert/strict';
import { saveDatabaseRows, withDatabase } from './database.mjs';

test('password-based imports use parameterized queries and a transaction', async () => {
  const calls = [];
  const payload = { name: "O'Brien's milk" };
  await saveDatabaseRows({ query: async (...args) => { calls.push(args); } }, [
    { id: 'id', source: 'fixture', source_id: '123', payload }
  ]);
  assert.equal(calls[0][0], 'begin');
  assert.match(calls[1][0], /insert into grceri\.demo_products/);
  assert.match(calls[1][0], /on conflict \(id\) do update/);
  assert.ok(!calls[1][0].includes(payload.name));
  assert.equal(JSON.parse(calls[1][1][3]).name, payload.name);
  assert.equal(calls.at(-1)[0], 'commit');
});

test('database imports roll back if any row fails', async () => {
  const queries = [];
  await assert.rejects(saveDatabaseRows({ query: async sql => {
    queries.push(sql);
    if (sql.startsWith('insert')) throw new Error('test failure');
  } }, [{ id: 'id', payload: {} }]), /test failure/);
  assert.equal(queries.at(-1), 'rollback');
  assert.ok(!queries.includes('commit'));
});

test('database client verifies TLS, closes connections and redacts errors', async () => {
  let options;
  let ended = false;
  await assert.rejects(withDatabase(() => {}, {
    SUPABASE_DB_HOST: 'db.example.com', SUPABASE_DB_PASSWORD: 'not-a-real-password'
  }, config => {
    options = config;
    return {
      connect: async () => { throw Object.assign(new Error('secret connection details'), { code: '28P01' }); },
      end: async () => { ended = true; }
    };
  }), error => error.message.includes('28P01') && !error.message.includes('secret connection details'));
  assert.equal(options.ssl.rejectUnauthorized, true);
  assert.equal(ended, true);
});
