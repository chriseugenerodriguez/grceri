import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const projects = ['website', 'mobile', 'api/main', 'api/auth', 'api/user', 'api/products',
  'api/transactions', 'api/data-sync', 'api/machine-learning', 'api/functions'];
const results = [];
// Two concurrent read-only audits; no automatic dependency changes.
async function worker() {
  while (projects.length) {
    const project = projects.shift();
    if (!existsSync(resolve(root, project, 'package-lock.json'))) {
      results.push({ project, status: 'No lockfile; dependency audit unavailable' });
      continue;
    }
    let stdout;
    try {
      ({ stdout } = await promisify(execFile)(process.execPath, [process.env.npm_execpath, 'audit', '--json', '--ignore-scripts'],
        { cwd: resolve(root, project), maxBuffer: 20 * 1024 * 1024, timeout: 120000 }));
    } catch (error) { stdout = error.stdout; }
    let audit;
    try { audit = JSON.parse(stdout); } catch { audit = {}; }
    const result = audit.metadata ? {
      project, counts: audit.metadata.vulnerabilities,
      directDependencies: Object.entries(audit.vulnerabilities || {}).filter(([, item]) => item.isDirect)
        .map(([name, item]) => ({ name, severity: item.severity, fixAvailable: item.fixAvailable,
          advisories: item.via.filter(value => typeof value === 'object').map(value => ({ title: value.title, url: value.url })) }))
    } : { project, status: audit.error?.summary || 'Audit failed; see npm registry connectivity' };
    results.push(result);
    console.log(project, JSON.stringify(result.counts || result.status));
  }
}
await Promise.all([worker(), worker()]);
await mkdir(resolve(root, 'docs'), { recursive: true });
await writeFile(resolve(root, 'docs/dependency-audit.json'), JSON.stringify({ scannedAt: new Date().toISOString(),
  note: 'npm advisory counts for lockfiles, not a proof of runtime exploitability. Ignored legacy code is included where present.',
  projects: results.sort((a, b) => a.project.localeCompare(b.project)) }, null, 2) + '\n');
