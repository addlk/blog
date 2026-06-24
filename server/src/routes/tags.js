import { Router } from 'express'
import { getDb } from '../db.js'
import { authMiddleware } from '../auth.js'

const router = Router()

router.get('/', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const tags = db.prepare(`
      SELECT t.*, (SELECT COUNT(*) FROM article_tags at JOIN articles a ON at.article_id = a.id WHERE at.tag_id = t.id) as article_count
      FROM tags t ORDER BY t.name
    `).all()
    res.json({ code: 200, data: tags, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(req.params.id)
    if (!tag) return res.json({ code: 404, msg: '标签不存在' })
    res.json({ code: 200, data: tag, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.post('/', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const { name } = req.body
    if (!name) return res.json({ code: 400, msg: '请输入标签名称' })
    const result = db.prepare('INSERT INTO tags (name) VALUES (?)').run(name)
    res.json({ code: 200, data: { id: result.lastInsertRowid }, msg: '创建成功' })
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.json({ code: 400, msg: '标签已存在' })
    res.status(500).json({ code: 500, msg: err.message })
  }
})

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const { name } = req.body
    db.prepare('UPDATE tags SET name = ? WHERE id = ?').run(name, req.params.id)
    res.json({ code: 200, msg: '更新成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id)
    res.json({ code: 200, msg: '删除成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

export default router
