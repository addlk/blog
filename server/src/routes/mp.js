import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { getDb } from '../db.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'blog-admin-secret-key-change-in-production'

// Mini program auth middleware
function mpAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, msg: '未登录' })
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET)
    if (decoded.type !== 'mp') throw new Error()
    req.mpUser = decoded
    next()
  } catch (err) {
    res.status(401).json({ code: 401, msg: 'token 无效' })
  }
}

// Login: WeChat code -> JWT
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body
    let openid
    if (process.env.WECHAT_APPID && process.env.WECHAT_SECRET) {
      const r = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.WECHAT_APPID}&secret=${process.env.WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`)
      const d = await r.json()
      if (!d.openid) return res.json({ code: 400, msg: '微信登录失败: ' + (d.errmsg || 'unknown') })
      openid = d.openid
    } else {
      openid = 'mock_' + (code || 'dev_user')
    }
    const db = getDb()
    let user = db.prepare('SELECT * FROM mp_users WHERE openid = ?').get(openid)
    if (!user) {
      db.prepare('INSERT INTO mp_users (openid) VALUES (?)').run(openid)
      user = db.prepare('SELECT * FROM mp_users WHERE openid = ?').get(openid)
    }
    const token = jwt.sign({ id: user.id, openid, type: 'mp' }, JWT_SECRET, { expiresIn: '30d' })
    res.json({ code: 200, data: { token, user: { id: user.id, nickname: user.nickname || '', avatar: user.avatar || '' } }, msg: 'ok' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

// Update user profile (nickname, avatar from WeChat)
router.post('/profile', mpAuth, (req, res) => {
  try {
    const db = getDb()
    const { nickname, avatar } = req.body
    db.prepare('UPDATE mp_users SET nickname = ?, avatar = ? WHERE id = ?').run(nickname || '', avatar || '', req.mpUser.id)
    res.json({ code: 200, msg: 'ok' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

// Get comments for an article
router.get('/comments/:articleId', (req, res) => {
  try {
    const db = getDb()
    const comments = db.prepare(`
      SELECT c.id, c.content, c.created_at, u.nickname, u.avatar
      FROM comments c JOIN mp_users u ON c.user_id = u.id
      WHERE c.article_id = ? ORDER BY c.created_at DESC
    `).all(req.params.articleId)
    res.json({ code: 200, data: comments, msg: 'ok' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

// Post a comment
router.post('/comments', mpAuth, (req, res) => {
  try {
    const { article_id, content } = req.body
    if (!article_id || !content) return res.json({ code: 400, msg: '参数不完整' })
    if (content.length > 500) return res.json({ code: 400, msg: '评论不能超过500字' })
    const db = getDb()
    const result = db.prepare('INSERT INTO comments (article_id, user_id, content) VALUES (?, ?, ?)').run(article_id, req.mpUser.id, content)
    res.json({ code: 200, data: { id: result.lastInsertRowid }, msg: '评论成功' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

// Toggle like
router.post('/likes', mpAuth, (req, res) => {
  try {
    const db = getDb()
    const { article_id } = req.body
    const existing = db.prepare('SELECT * FROM likes WHERE article_id = ? AND user_id = ?').get(article_id, req.mpUser.id)
    if (existing) {
      db.prepare('DELETE FROM likes WHERE article_id = ? AND user_id = ?').run(article_id, req.mpUser.id)
      res.json({ code: 200, data: { liked: false }, msg: '取消点赞' })
    } else {
      db.prepare('INSERT INTO likes (article_id, user_id) VALUES (?, ?)').run(article_id, req.mpUser.id)
      const count = db.prepare('SELECT COUNT(*) as cnt FROM likes WHERE article_id = ?').get(article_id).cnt
      res.json({ code: 200, data: { liked: true, count }, msg: '点赞成功' })
    }
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

// Check like status
router.get('/likes/status/:articleId', mpAuth, (req, res) => {
  try {
    const db = getDb()
    const existing = db.prepare('SELECT 1 FROM likes WHERE article_id = ? AND user_id = ?').get(req.params.articleId, req.mpUser.id)
    const count = db.prepare('SELECT COUNT(*) as cnt FROM likes WHERE article_id = ?').get(req.params.articleId).cnt
    res.json({ code: 200, data: { liked: !!existing, count }, msg: 'ok' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

// Toggle bookmark
router.post('/bookmarks', mpAuth, (req, res) => {
  try {
    const db = getDb()
    const { article_id } = req.body
    const existing = db.prepare('SELECT * FROM bookmarks WHERE article_id = ? AND user_id = ?').get(article_id, req.mpUser.id)
    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE article_id = ? AND user_id = ?').run(article_id, req.mpUser.id)
      res.json({ code: 200, data: { bookmarked: false }, msg: '取消收藏' })
    } else {
      db.prepare('INSERT INTO bookmarks (article_id, user_id) VALUES (?, ?)').run(article_id, req.mpUser.id)
      res.json({ code: 200, data: { bookmarked: true }, msg: '收藏成功' })
    }
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

// Get user bookmarks
router.get('/bookmarks', mpAuth, (req, res) => {
  try {
    const db = getDb()
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const offset = (page - 1) * pageSize
    const total = db.prepare('SELECT COUNT(*) as cnt FROM bookmarks WHERE user_id = ?').get(req.mpUser.id).cnt
    const rows = db.prepare(`
      SELECT a.id, a.title, a.summary, a.cover_image, a.view_count, a.created_at,
        c.name as category_name, b.created_at as bookmarked_at
      FROM bookmarks b JOIN articles a ON b.article_id = a.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE b.user_id = ? AND a.status = 'published'
      ORDER BY b.created_at DESC LIMIT ? OFFSET ?
    `).all(req.mpUser.id, pageSize, offset)
    res.json({ code: 200, data: { records: rows, total, pages: Math.ceil(total / pageSize), current: page }, msg: 'ok' })
  } catch (err) { res.status(500).json({ code: 500, msg: err.message }) }
})

export { router as default, mpAuth }
