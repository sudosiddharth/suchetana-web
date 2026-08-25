import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/components/Register.astro', import.meta.url), 'utf8');
const hasVisitedRule = /\.job:visited\s*\{[^}]*color:\s*var\(--ink\)/s.test(css);
const hasNestedVisitedRule = /\.job:visited\s+\.who\s+b\s*\{[^}]*color:\s*var\(--ink\)/s.test(css);

const result = { hasVisitedRule, hasNestedVisitedRule, pass: hasVisitedRule && hasNestedVisitedRule };
console.log(JSON.stringify(result));
if (!result.pass) process.exit(1);
