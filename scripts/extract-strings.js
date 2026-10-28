// Lists every UI string: t('...') literals in src/ plus the display strings in the data files.
// Usage: node scripts/extract-strings.js [lang]  → prints keys missing from src/i18n/<lang>.ts
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(f) && !p.includes(`${path.sep}i18n${path.sep}`)) out.push(p);
  }
  return out;
}

const unq = (s) => s.replace(/\\'/g, "'");
const keys = new Set();
const literal = /\bt\(\s*'((?:[^'\\]|\\.)*)'/g;
const prop = /\b(?:label|title|sub|body|name|when|meta|text|food|role|month|question|hint|cta|due|dueShort|day|dow|en)\s*:\s*'((?:[^'\\]|\\.)*)'/g;
const array = /\[(\s*'[^'\]]+'(?:\s*,\s*'[^'\]]+')+\s*)\]/g;

for (const file of walk(SRC)) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(literal)) keys.add(unq(m[1]));
  for (const m of src.matchAll(prop)) keys.add(unq(m[1]));
  for (const m of src.matchAll(array)) for (const s of m[1].matchAll(/'([^']+)'/g)) keys.add(s[1]);
}

const lang = process.argv[2];
let list = [...keys].filter((k) => /[A-Za-z]{2}/.test(k) && !/^\/|^#|^Nunito|^Baloo|^rgba|^[a-z]+$/.test(k)).sort();
if (lang) {
  const dict = require('fs').readFileSync(path.join(SRC, 'i18n', `${lang}.ts`), 'utf8');
  list = list.filter((k) => !dict.includes(JSON.stringify(k)));
}
console.log(JSON.stringify(list, null, 1));
console.error(`${list.length} strings`);
