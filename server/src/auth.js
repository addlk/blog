import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'blog-admin-secret-key-change-in-production'
const JWT_EXPIRES = '7d'

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, nickname: user.nickname },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, msg: '未登录或 token 已过期' })
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ code: 401, msg: 'token 无效或已过期' })
  }
}
