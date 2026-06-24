import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { getDb } from '../db.js'
import { authMiddleware } from '../auth.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'blog-admin-secret-key-change-in-production'
const JWT_EXPIRES = '7d'

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.json({ code: 400, msg: '请输入用户名和密码' })
    }
    const db = getDb()
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
    if (!user) {
      return res.json({ code: 400, msg: '用户不存在' })
    }
    const valid = bcrypt.compareSync(password, user.password)
    if (!valid) {
      return res.json({ code: 400, msg: '密码错误' })
    }
    const token = jsonwebtoken.sign(
      { id: user.id, username: user.username, nickname: user.nickname },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )
    res.json({
      code: 200,
      data: {
        token,
        user: { id: user.id, username: user.username, nickname: user.nickname }
      },
      msg: '登录成功'
    })
  } catch (err) {
    res.status(500).json({ code: 500, msg: err.message })
  }
})

router.get('/profile', authMiddleware, (req, res) => {
  const db = getDb()
  const user = db.prepare('SELECT id, username, nickname, created_at FROM users WHERE id = ?').get(req.user.id)
  res.json({ code: 200, data: user, msg: 'success' })
})

export default router
