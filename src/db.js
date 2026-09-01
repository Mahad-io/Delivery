'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DATABASE_PATH || './data/delivery-hub.db';
fs.mkdirSync(path.dirname(path.resolve(DB_PATH)), { recursive: true });

const db = new Database(path.resolve(DB_PATH));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/*
 * Schema notes (data protection by design):
 *  - We store the minimum needed to run an account: email, a bcrypt hash, a
 *    display name, and two optional profile fields the user can leave blank.
 *  - We never store raw IP addresses. `ip_hash` is HMAC-SHA256(ip, IP_HASH_SALT)
 *    truncated to 16 bytes, which is enough to spot abuse patterns but is not
 *    reversible to an IP without the salt.
 *  - Consent is append-only: `consent_events` is the evidence trail required by
 *    UK GDPR Art. 7(1). The current state lives on `users` for fast reads.
 *  - Deletion is real deletion, not a flag. See src/routes/gdpr.js.
 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  email                 TEXT    NOT NULL UNIQUE,
  password_hash         TEXT    NOT NULL,
  name                  TEXT    NOT NULL,
  job_role              TEXT,
  organisation          TEXT,
  experience_level      TEXT,
  email_verified        INTEGER NOT NULL DEFAULT 0,
  verify_token          TEXT,
  verify_expires_at     TEXT,
  reset_token           TEXT,
  reset_expires_at      TEXT,
  marketing_consent     INTEGER NOT NULL DEFAULT 0,
  analytics_consent     INTEGER NOT NULL DEFAULT 0,
  terms_version         TEXT,
  privacy_version       TEXT,
  failed_logins         INTEGER NOT NULL DEFAULT 0,
  locked_until          TEXT,
  created_at            TEXT    NOT NULL DEFAULT (datetime('now')),
  last_login_at         TEXT,
  last_seen_at          TEXT
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS consent_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  anon_id     TEXT,
  purpose     TEXT    NOT NULL,
  granted     INTEGER NOT NULL,
  mechanism   TEXT    NOT NULL,
  policy_version TEXT,
  ip_hash     TEXT,
  user_agent  TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_events(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_anon ON consent_events(anon_id);

CREATE TABLE IF NOT EXISTS downloads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id TEXT    NOT NULL,
  format      TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_resource ON downloads(resource_id);

CREATE TABLE IF NOT EXISTS saved_resources (
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, resource_id)
);

CREATE TABLE IF NOT EXISTS module_progress (
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path_id     TEXT    NOT NULL,
  module_id   TEXT    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'complete',
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, path_id, module_id)
);

CREATE TABLE IF NOT EXISTS assessments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind        TEXT    NOT NULL,
  answers     TEXT    NOT NULL,
  scores      TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);

CREATE TABLE IF NOT EXISTS boards (
  id          TEXT    PRIMARY KEY,
  owner_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT    NOT NULL,
  template    TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS board_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id    TEXT    NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  column_id   TEXT    NOT NULL,
  body        TEXT    NOT NULL,
  votes       INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_board_items_board ON board_items(board_id);

CREATE TABLE IF NOT EXISTS audit_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER,
  actor_email TEXT,
  action      TEXT    NOT NULL,
  detail      TEXT,
  ip_hash     TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

CREATE TABLE IF NOT EXISTS deletion_receipts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email_hash    TEXT NOT NULL,
  requested_at  TEXT NOT NULL,
  completed_at  TEXT NOT NULL DEFAULT (datetime('now')),
  reason        TEXT
);
`;

db.exec(SCHEMA);

/** One-way, salted hash of an IP address. Never store the raw value. */
function hashIp(ip) {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || 'insecure-development-salt';
  return crypto.createHmac('sha256', salt).update(String(ip)).digest('hex').slice(0, 32);
}

/** Stable hash of an email, used only in deletion receipts. */
function hashEmail(email) {
  const salt = process.env.IP_HASH_SALT || 'insecure-development-salt';
  return crypto.createHmac('sha256', salt).update(String(email).toLowerCase()).digest('hex');
}

module.exports = { db, hashIp, hashEmail };
