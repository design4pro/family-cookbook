#!/usr/bin/env node
// Cezar runs this script in a staged copy before publishing a project skill update.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--ref' || !/^[a-f0-9]{40}$/.test(args[1])) {
  throw new Error('Expected --ref followed by an exact upstream commit SHA.');
}
const sha = args[1];
const skillsDir = join(root, '.agents/skills');
const lockPath = join(root, 'skills-lock.json');
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
const owned = Object.entries(lock.skills).filter(([, entry]) => entry.source === 'open-mercato/skills').map(([name]) => name);
for (const name of owned) {
  if (!/^om-[a-z0-9-]+$/.test(name)) throw new Error('Unexpected Open Mercato skill name.');
  const path = join(skillsDir, name);
  if (existsSync(path) && lstatSync(path).isSymbolicLink()) throw new Error('Refusing a symlinked skill directory.');
}
// Removing only proven-owned directories also removes skills retired by upstream.
for (const name of owned) rmSync(join(skillsDir, name), { recursive: true, force: true });
for (const name of owned) delete lock.skills[name];
writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
execFileSync('npx', ['--yes', 'skills', 'add', `https://github.com/open-mercato/skills/tree/${sha}`, '--skill', '*', '--agent', 'codex', '--yes', '--json'], {
  cwd: root, timeout: 180_000, maxBuffer: 4 * 1024 * 1024,
  env: { ...process.env, npm_config_yes: 'true', GIT_TERMINAL_PROMPT: '0' },
});
const installed = JSON.parse(readFileSync(lockPath, 'utf8'));
const names = Object.entries(installed.skills).filter(([, entry]) => entry.source === 'open-mercato/skills').map(([name]) => name).sort();
if (!names.length) throw new Error('No Open Mercato skills were installed.');
const files = [];
function inventory(relative) {
  const path = join(root, relative);
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error('Refusing a symlink in the installed skill inventory.');
  if (stat.isDirectory()) {
    for (const name of readdirSync(path).sort()) inventory(`${relative}/${name}`);
  } else if (stat.isFile()) {
    const data = readFileSync(path);
    const hash = createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
    // The updater compares executable permission with the manifest's Git mode.
    const mode = stat.mode & 0o111 ? '100755' : '100644';
    chmodSync(path, mode === '100755' ? 0o755 : 0o644);
    files.push({ path: relative, sha: hash, mode });
  } else throw new Error('Unsupported skill file type.');
}
for (const name of names) inventory(`.agents/skills/${name}`);
mkdirSync(resolve(root, 'scripts/agents'), { recursive: true });
writeFileSync(join(root, 'scripts/agents/skills-upstream.json'), JSON.stringify({ source: 'open-mercato/skills', branch: 'main', sha, files }, null, 2) + '\n');
const docPath = join(root, 'docs/agents/cezar.md');
const doc = readFileSync(docPath, 'utf8');
if (!/<!-- om-skills-version:start -->[\s\S]*?<!-- om-skills-version:end -->/.test(doc)) throw new Error('Missing skills version marker in Cezar documentation.');
writeFileSync(docPath, doc.replace(/<!-- om-skills-version:start -->[\s\S]*?<!-- om-skills-version:end -->/, `<!-- om-skills-version:start -->\nInstalled Open Mercato commit: \`${sha}\` (${names.length} skills).\n<!-- om-skills-version:end -->`));
console.log(JSON.stringify({ source: 'open-mercato/skills', sha, skills: names.length }));
