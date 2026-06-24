import initSqlJs from 'sql.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'blog.db')

let db
let SQL

class Statement {
  constructor(database, sql) {
    this.db = database
    this.sql = sql
    this.stmt = null
  }

  get(...params) {
    try {
      this.stmt = this.db.prepare(this.sql)
      if (params.length > 0) this.stmt.bind(params)
      if (this.stmt.step()) return this.stmt.getAsObject()
      return undefined
    } finally {
      if (this.stmt) { this.stmt.free(); this.stmt = null }
    }
  }

  all(...params) {
    try {
      this.stmt = this.db.prepare(this.sql)
      if (params.length > 0) this.stmt.bind(params)
      const results = []
      while (this.stmt.step()) results.push(this.stmt.getAsObject())
      return results
    } finally {
      if (this.stmt) { this.stmt.free(); this.stmt = null }
    }
  }

  run(...params) {
    this.db.run(this.sql, params)
    const result = this.db.exec('SELECT last_insert_rowid() as id')
    const id = result.length > 0 && result[0].values.length > 0 ? result[0].values[0][0] : null
    const changes = this.db.getRowsModified()
    save()
    return { lastInsertRowid: id, changes }
  }
}

function save() {
  if (db) {
    const data = db.export()
    fs.writeFileSync(DB_PATH, Buffer.from(data))
  }
}

function initSchema() {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, nickname TEXT, created_at TEXT DEFAULT (datetime(\'now\')))')
  db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT DEFAULT \'\', created_at TEXT DEFAULT (datetime(\'now\')))')
  db.run('CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, created_at TEXT DEFAULT (datetime(\'now\')))')
  db.run('CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, summary TEXT DEFAULT \'\', content TEXT DEFAULT \'\', cover_image TEXT DEFAULT \'\', status TEXT DEFAULT \'draft\' CHECK(status IN (\'draft\',\'published\')), category_id INTEGER, view_count INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime(\'now\')), updated_at TEXT DEFAULT (datetime(\'now\')), FOREIGN KEY (category_id) REFERENCES categories(id))')
  db.run('CREATE TABLE IF NOT EXISTS article_tags (article_id INTEGER NOT NULL, tag_id INTEGER NOT NULL, PRIMARY KEY (article_id, tag_id), FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE, FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE)')
  db.run('CREATE TABLE IF NOT EXISTS mp_users (id INTEGER PRIMARY KEY AUTOINCREMENT, openid TEXT NOT NULL UNIQUE, nickname TEXT DEFAULT \'\', avatar TEXT DEFAULT \'\', created_at TEXT DEFAULT (datetime(\'now\')))')
  db.run('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, article_id INTEGER NOT NULL, user_id INTEGER NOT NULL, content TEXT NOT NULL, created_at TEXT DEFAULT (datetime(\'now\')), FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES mp_users(id))')
  db.run('CREATE TABLE IF NOT EXISTS likes (article_id INTEGER NOT NULL, user_id INTEGER NOT NULL, created_at TEXT DEFAULT (datetime(\'now\')), PRIMARY KEY (article_id, user_id), FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES mp_users(id))')
  db.run('CREATE TABLE IF NOT EXISTS bookmarks (article_id INTEGER NOT NULL, user_id INTEGER NOT NULL, created_at TEXT DEFAULT (datetime(\'now\')), PRIMARY KEY (article_id, user_id), FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES mp_users(id))')
  save()
}export async function initDb() {
  if (!SQL) SQL = await initSqlJs()
  const dataDir = path.join(__dirname, '..', 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  let buffer
  try { buffer = fs.readFileSync(DB_PATH) } catch { buffer = null }
  db = new SQL.Database(buffer)
  db.run('PRAGMA foreign_keys = ON')
  initSchema()
  return db
}

export function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.')
  return { prepare(sql) { return new Statement(db, sql) }, exec(sql) { return db.exec(sql) }, getRowsModified() { return db.getRowsModified() } }
}

export function closeDb() {
  if (db) { save(); db.close(); db = null }
}


