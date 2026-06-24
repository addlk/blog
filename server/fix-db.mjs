import { readFileSync, writeFileSync } from 'fs';
const path = 'D:\\新建文件夹\\博客\\server\\src\\db.js';
let c = readFileSync(path, 'utf-8');

const correctSchema = `function initSchema() {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, nickname TEXT, created_at TEXT DEFAULT (datetime(\'now\')))')
  db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT DEFAULT \'\', created_at TEXT DEFAULT (datetime(\'now\')))')
  db.run('CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, created_at TEXT DEFAULT (datetime(\'now\')))')
  db.run(\`CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, summary TEXT DEFAULT '', content TEXT DEFAULT '', cover_image TEXT DEFAULT '', status TEXT DEFAULT 'draft' CHECK(status IN ('draft','published')), category_id INTEGER, view_count INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (category_id) REFERENCES categories(id))\`)
  db.run(\`CREATE TABLE IF NOT EXISTS article_tags (article_id INTEGER NOT NULL, tag_id INTEGER NOT NULL, PRIMARY KEY (article_id, tag_id), FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE, FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE)\`)
  db.run(\`CREATE TABLE IF NOT EXISTS mp_users (id INTEGER PRIMARY KEY AUTOINCREMENT, openid TEXT NOT NULL UNIQUE, nickname TEXT DEFAULT '', avatar TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now'))))\`)
  db.run(\`CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, article_id INTEGER NOT NULL, user_id INTEGER NOT NULL, content TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES mp_users(id)))\`)
  db.run(\`CREATE TABLE IF NOT EXISTS likes (article_id INTEGER NOT NULL, user_id INTEGER NOT NULL, created_at TEXT DEFAULT (datetime('now')), PRIMARY KEY (article_id, user_id), FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES mp_users(id)))\`)
  db.run(\`CREATE TABLE IF NOT EXISTS bookmarks (article_id INTEGER NOT NULL, user_id INTEGER NOT NULL, created_at TEXT DEFAULT (datetime('now')), PRIMARY KEY (article_id, user_id), FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES mp_users(id)))\`)
  save()
}`;

const idx = c.indexOf('function initSchema()');
const endIdx = c.indexOf('export async function initDb()');
if (idx >= 0 && endIdx > idx) {
  c = c.substring(0, idx) + correctSchema + c.substring(endIdx);
  writeFileSync(path, c, 'utf-8');
  console.log('OK');
}
