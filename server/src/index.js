import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDb, getDb } from './db.js'
import authRoutes from './routes/auth.js'
import articleRoutes from './routes/articles.js'
import categoryRoutes from './routes/categories.js'
import tagRoutes from './routes/tags.js'
import mpRoutes from './routes/mp.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Public display APIs
app.get('/api/public/articles', (req, res) => {
  try {
    const db = getDb()
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const categoryId = req.query.categoryId
    const tagId = req.query.tagId
    const offset = (page - 1) * pageSize

    let where = "WHERE a.status = 'published'"
    let joins = ''
    const params = []

    if (categoryId) {
      where += ' AND a.category_id = ?'
      params.push(categoryId)
    }
    if (tagId) {
      joins += ' JOIN article_tags at2 ON a.id = at2.article_id'
      where += ' AND at2.tag_id = ?'
      params.push(tagId)
    }

    const total = db.prepare(`SELECT COUNT(*) as total FROM articles a${joins} ${where}`).get(...params).total

    const records = db.prepare(`
      SELECT a.*, c.name as category_name,
      FROM articles a LEFT JOIN categories c ON a.category_id = c.id
      ${joins} ${where}
      ORDER BY a.created_at DESC LIMIT ? OFFSET ?
    `).all(...params, pageSize, offset)

    const getTagsStmt = db.prepare('SELECT t.id, t.name FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?')
    const articles = records.map(a => ({
      ...a,
      category: a.category_id ? { id: a.category_id, name: a.category_name } : null,
      tags: getTagsStmt.all(a.id)
    }))

    res.json({ code: 200, data: { records: articles, total, pages: Math.ceil(total / pageSize), current: page }, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

app.get('/api/public/articles/:id', (req, res) => {
  try {
    const db = getDb()
    const article = db.prepare('SELECT a.*, c.name as category_name FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.id = ? AND a.status = ?').get(req.params.id, 'published')
    if (!article) return res.json({ code: 200, data: null, msg: '文章不存在' })
    db.prepare('UPDATE articles SET view_count = view_count + 1 WHERE id = ?').run(req.params.id)
    const tags = db.prepare('SELECT t.id, t.name FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').all(article.id)
    res.json({ code: 200, data: { ...article, category: article.category_id ? { id: article.category_id, name: article.category_name } : null, tags }, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

app.get('/api/public/categories', (req, res) => {
  try {
    const db = getDb()
    const cats = db.prepare("SELECT c.*, (SELECT COUNT(*) FROM articles a WHERE a.category_id = c.id AND a.status = 'published') as article_count FROM categories c ORDER BY c.name").all()
    res.json({ code: 200, data: cats, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

app.get('/api/public/tags', (req, res) => {
  try {
    const db = getDb()
    const tags = db.prepare("SELECT t.*, (SELECT COUNT(*) FROM article_tags at JOIN articles a ON at.article_id = a.id WHERE at.tag_id = t.id AND a.status = 'published') as article_count FROM tags t ORDER BY t.name").all()
    res.json({ code: 200, data: tags, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

// Admin routes
app.use('/api/auth', authRoutes)
app.use('/api/admin/articles', articleRoutes)
app.use('/api/admin/categories', categoryRoutes)
app.use('/api/admin/tags', tagRoutes)

// Mini Program routes
app.use('/api/mp', mpRoutes)

// Upload endpoint
import multer from 'multer'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + Math.random().toString(36).slice(2) + path.extname(file.originalname)) }
})
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } })
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ code: 400, msg: '请选择文件' })
  res.json({ code: 200, data: { url: (process.env.PUBLIC_URL || (req.protocol + '://' + req.get('host'))) + '/uploads/' + req.file.filename }, msg: '上传成功' })
})

// Start server after DB init
initDb().then(() => {
  import('./seed.js').then(m => { m.ensureSeedData(); console.log('Seed check complete') })
  app.listen(PORT, () => console.log(`Blog server running at http://localhost:${PORT}`))
}).catch(err => { console.error('Failed to init DB:', err); process.exit(1) })



