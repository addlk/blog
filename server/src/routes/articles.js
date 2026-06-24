import { Router } from 'express'
import { getDb } from '../db.js'
import { authMiddleware } from '../auth.js'

const router = Router()

router.get('/', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const status = req.query.status
    const categoryId = req.query.categoryId
    const keyword = req.query.keyword
    const offset = (page - 1) * pageSize
    let where = 'WHERE 1=1'
    const params = []

    if (status) { where += ' AND a.status = ?'; params.push(status) }
    if (categoryId) { where += ' AND a.category_id = ?'; params.push(categoryId) }
    if (keyword) { where += ' AND (a.title LIKE ? OR a.summary LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`) }

    const total = db.prepare(`SELECT COUNT(*) as total FROM articles a ${where}`).get(...params).total
    const records = db.prepare(`
      SELECT a.*, c.name as category_name
      FROM articles a LEFT JOIN categories c ON a.category_id = c.id
      ${where}
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

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const article = db.prepare('SELECT a.*, c.name as category_name FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.id = ?').get(req.params.id)
    if (!article) return res.json({ code: 404, msg: '文章不存在' })
    const tags = db.prepare('SELECT t.id, t.name FROM tags t JOIN article_tags at ON t.id = at.tag_id WHERE at.article_id = ?').all(article.id)
    res.json({ code: 200, data: { ...article, category: article.category_id ? { id: article.category_id, name: article.category_name } : null, tags }, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.post('/', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const { title, summary, content, cover_image, status, category_id, tags } = req.body
    if (!title) return res.json({ code: 400, msg: '请输入文章标题' })
    const result = db.prepare('INSERT INTO articles (title, summary, content, cover_image, status, category_id) VALUES (?, ?, ?, ?, ?, ?)').run(title, summary || '', content || '', cover_image || '', status || 'draft', category_id || null)
    const articleId = result.lastInsertRowid
    if (tags && tags.length > 0) {
      const insertTag = db.prepare('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)')
      for (const tagId of tags) insertTag.run(articleId, tagId)
    }
    res.json({ code: 200, data: { id: articleId }, msg: '创建成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const { title, summary, content, cover_image, status, category_id, tags } = req.body
    db.prepare("UPDATE articles SET title = ?, summary = ?, content = ?, cover_image = ?, status = ?, category_id = ?, updated_at = datetime('now') WHERE id = ?").run(title, summary || '', content || '', cover_image || '', status || 'draft', category_id || null, req.params.id)
    if (tags !== undefined) {
      db.prepare('DELETE FROM article_tags WHERE article_id = ?').run(req.params.id)
      const insertTag = db.prepare('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)')
      for (const tagId of tags) insertTag.run(req.params.id, tagId)
    }
    res.json({ code: 200, msg: '更新成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id)
    res.json({ code: 200, msg: '删除成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

export default router
