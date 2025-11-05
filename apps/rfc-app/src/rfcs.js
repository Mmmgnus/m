import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RFC_DIRECTORY = path.join(__dirname, '..', '..', '..', 'docs', 'rfc');

function ensureRfcDirectory() {
  if (!fs.existsSync(RFC_DIRECTORY)) {
    return [];
  }
  return fs
    .readdirSync(RFC_DIRECTORY)
    .filter((file) => file.toLowerCase().endsWith('.md'))
    .map((file) => path.join(RFC_DIRECTORY, file));
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  let parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    parsed = new Date(`${trimmed}T00:00:00Z`);
  }

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function parseRfcFile(filePath) {
  const slug = path.basename(filePath, '.md');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  const titleLine = lines.find((line) => line.trim().startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : slug;

  const metadata = {};
  for (const line of lines) {
    if (line.trim() === '---') {
      break;
    }
    const match = line.match(/^\*\*(.+?):\*\*\s*(.+)$/);
    if (match) {
      metadata[match[1].trim().toLowerCase()] = match[2].trim();
    }
  }

  const summaryLines = [];
  const summaryHeadingIndex = lines.findIndex((line) => /^##\s+summary/i.test(line.trim()));
  if (summaryHeadingIndex !== -1) {
    for (let i = summaryHeadingIndex + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (/^##\s+/.test(line.trim()) || line.trim() === '---') {
        break;
      }
      summaryLines.push(line.trimEnd());
    }
  }

  const summary = summaryLines.join('\n').trim();

  const stats = fs.statSync(filePath);
  const createdAt = parseDate(metadata.created) ?? stats.mtime.toISOString();
  const updatedAt = parseDate(metadata.updated) ?? createdAt;

  return {
    slug,
    title,
    summary,
    content,
    createdAt,
    updatedAt,
    metadata: {
      status: metadata.status ?? null,
      author: metadata.author ?? null,
      created: metadata.created ?? null,
      updated: metadata.updated ?? null
    }
  };
}

export function listRfcs() {
  const files = ensureRfcDirectory();
  const rfcs = files.map((file) => parseRfcFile(file));

  return rfcs
    .map((rfc) => ({
      slug: rfc.slug,
      title: rfc.title,
      summary:
        rfc.summary
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean)[0] ?? '',
      createdAt: rfc.createdAt,
      updatedAt: rfc.updatedAt,
      metadata: rfc.metadata
    }))
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    });
}

export function getRfcBySlug(slug) {
  const filePath = path.join(RFC_DIRECTORY, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseRfcFile(filePath);
}
