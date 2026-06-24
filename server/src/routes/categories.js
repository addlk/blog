import { Router } from 'express'
import { getDb } from '../db.js'
import { authMiddleware } from '../auth.js'

const router = Router()

router.get('/', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const cats = db.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM articles a WHERE a.category_id = c.id) as article_count
      FROM categories c ORDER BY c.name
    `).all()
    res.json({ code: 200, data: cats, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
    if (!cat) return res.json({ code: 404, msg: '分类不存在' })
    res.json({ code: 200, data: cat, msg: 'success' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.post('/', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const { name, description } = req.body
    if (!name) return res.json({ code: 400, msg: '请输入分类名称' })
    const result = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)').run(name, description || '')
    res.json({ code: 200, data: { id: result.lastInsertRowid }, msg: '创建成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    const { name, description } = req.body
    db.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?').run(name, description || '', req.params.id)
    res.json({ code: 200, msg: '更新成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const db = getDb()
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id)
    res.json({ code: 200, msg: '删除成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

export default router
