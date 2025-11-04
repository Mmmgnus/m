import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rfc_slug TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS login_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

const commentTableInfo = db.prepare('PRAGMA table_info(comments)').all();
const hasLegacyRfcIdColumn = commentTableInfo.some((column) => column.name === 'rfc_id');

if (hasLegacyRfcIdColumn) {
  db.exec(`
    ALTER TABLE comments RENAME TO comments_old;
    CREATE TABLE comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rfc_slug TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      body TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    DROP TABLE comments_old;
  `);
}

const hasRfcsTable = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='rfcs'")
  .get();

if (hasRfcsTable) {
  db.exec('DROP TABLE IF EXISTS rfcs;');
}

const loginTokenTableInfo = db.prepare('PRAGMA table_info(login_tokens)').all();
const expiresAtColumn = loginTokenTableInfo.find((column) => column.name === 'expires_at');
if (expiresAtColumn && expiresAtColumn.type.toUpperCase() !== 'INTEGER') {
  db.exec(`
    ALTER TABLE login_tokens RENAME TO login_tokens_old;
    CREATE TABLE login_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    INSERT INTO login_tokens (user_id, token, expires_at, created_at)
    SELECT user_id, token, CAST(strftime('%s', expires_at) AS INTEGER), created_at FROM login_tokens_old;
    DROP TABLE login_tokens_old;
  `);
}

const userTableInfo = db.prepare('PRAGMA table_info(users)').all();
const hasNotNullPasswordHash = userTableInfo.some(
  (column) => column.name === 'password_hash' && column.notnull === 1
);

if (hasNotNullPasswordHash) {
  db.exec(`
    ALTER TABLE users RENAME TO users_old;
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    INSERT INTO users (id, email, password_hash, created_at)
    SELECT id, email, password_hash, created_at FROM users_old;
    DROP TABLE users_old;
  `);
}

export function getCommentsForRfc(rfcSlug) {
  return db.prepare(
    `SELECT c.id, c.body, c.created_at, u.email
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.rfc_slug = ?
     ORDER BY c.created_at ASC`
  ).all(rfcSlug);
}

export function createComment({ rfcSlug, userId, body }) {
  return db.prepare(
    'INSERT INTO comments (rfc_slug, user_id, body) VALUES (?, ?, ?)'
  ).run(rfcSlug, userId, body);
}

export function getCommentCounts() {
  return db
    .prepare(
      `SELECT rfc_slug AS slug, COUNT(*) AS count
       FROM comments
       GROUP BY rfc_slug`
    )
    .all();
}

export function findUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function createUser({ email }) {
  return db.prepare('INSERT INTO users (email) VALUES (?)').run(email);
}

export function createLoginToken({ userId, token, expiresAt }) {
  return db
    .prepare(
      'INSERT INTO login_tokens (user_id, token, expires_at) VALUES (?, ?, ?)'
    )
    .run(userId, token, expiresAt);
}

export function findLoginToken({ userId, token }) {
  return db
    .prepare(
      `SELECT * FROM login_tokens
       WHERE user_id = ? AND token = ? AND expires_at > strftime('%s', 'now')`
    )
    .get(userId, token);
}

export function deleteLoginTokensForUser(userId) {
  return db.prepare('DELETE FROM login_tokens WHERE user_id = ?').run(userId);
}

export function deleteExpiredLoginTokens() {
  return db
    .prepare("DELETE FROM login_tokens WHERE expires_at <= strftime('%s', 'now')")
    .run();
}

export default db;
