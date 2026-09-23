import { cp, mkdir, writeFile } from 'node:fs/promises';
const target = new URL('../public/assets/', import.meta.url);
const source = new URL('../../website/src/assets/', import.meta.url);
await mkdir(target, { recursive: true });
for (const folder of ['fonts', 'svg', 'img', 'json']) {
  await cp(new URL(folder, source), new URL(folder, target), { recursive: true });
}
await writeFile(new URL('demo-config.json', target), '{"mode":"snapshot"}\n');
