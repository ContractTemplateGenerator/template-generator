import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = join(__dirname, '../templates');

const PARTIAL_FILES: Record<string, string> = {
  'ownership-table': 'partials/ownership-table.hbs',
  'management-clause': 'partials/management-clause.hbs',
  distributions: 'partials/distributions.hbs',
  voting: 'partials/voting.hbs',
  signatures: 'partials/signatures.hbs',
  directors: 'partials/directors.hbs',
  officers: 'partials/officers.hbs'
};

let registered = false;

export function ensurePartialsRegistered() {
  if (registered) return;

  Handlebars.registerHelper('default', function defaultHelper(value: unknown, fallback: unknown) {
    if (value === undefined || value === null || value === '') {
      return fallback;
    }
    return value;
  });

  for (const [name, relative] of Object.entries(PARTIAL_FILES)) {
    const filePath = join(templatesDir, relative);
    const content = readFileSync(filePath, 'utf8');
    Handlebars.registerPartial(name, content);
  }

  registered = true;
}

export function loadTemplate(relativePath: string) {
  ensurePartialsRegistered();
  const filePath = join(templatesDir, relativePath);
  const source = readFileSync(filePath, 'utf8');
  return Handlebars.compile(source);
}
