import bcrypt from 'bcryptjs'
import { getDb } from './db.js'

export function ensureAdmin() {
  const db = getDb()
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get('admin')
  if (!existing) {
    const hash = bcrypt.hashSync('admin123', 10)
    db.prepare('INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)').run('admin', hash, '管理员')
    console.log('Default admin created: admin / admin123')
  }
}

const categories = [
  { name: '前端技术', description: 'Web 前端开发相关技术文章，涵盖 HTML、CSS、JavaScript 及主流框架' },
  { name: '后端开发', description: '服务端编程、API 设计、数据库与架构相关' },
  { name: '设计', description: 'UI/UX 设计、视觉风格、前端工程化' }
]

const tags = ['Vue', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'SQLite', 'CSS', '设计']

const articles = [
  {
    title: 'Vue 3 组合式 API 快速上手',
    summary: '从 Options API 到 Composition API 的思维转变，通过实际示例快速掌握 setup、ref、reactive 等核心概念。',
    content: '<h2>为什么使用组合式 API</h2><p>组合式 API 让我们能够更灵活地组织组件逻辑。与 Options API 按选项类型（data、methods、computed）组织代码不同，组合式 API 让我们可以按功能组织代码。</p><h2>setup 函数</h2><p>setup 是组合式 API 的入口，在组件创建之前执行。在 setup 中定义的变量和函数可以直接在模板中使用。</p><pre><code>import { ref, onMounted } from "vue"\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const increment = () => count.value++\n    return { count, increment }\n  }\n}</code></pre><h2>响应式核心</h2><p>ref 用于基本类型，reactive 用于对象。两者都是响应式的，改变值时会自动更新视图。</p><blockquote><p>提示：ref 在模板中自动解包，不需要写 .value</p></blockquote>',
    status: 'published', categoryName: '前端技术', tagNames: ['Vue', 'JavaScript']
  },
  {
    title: '从零搭建 Express API 服务',
    summary: '使用 Express.js 和 SQLite 构建 RESTful API，涵盖路由设计、中间件、错误处理和数据库操作。',
    content: '<h2>项目初始化</h2><p>Express 是 Node.js 最流行的 Web 框架。搭配 SQLite 可以快速搭建轻量级 API 服务。</p><pre><code>import express from "express"\nimport Database from "better-sqlite3"\n\nconst app = express()\nconst db = new Database("blog.db")\n\napp.use(express.json())\n\napp.get("/api/articles", (req, res) => {\n  const articles = db.prepare("SELECT * FROM articles").all()\n  res.json(articles)\n})</code></pre><h2>路由设计</h2><p>将路由按资源拆分到独立文件，保持代码清晰。使用 Router 模块化组织。</p><h2>错误处理</h2><p>全局错误处理中间件捕获未处理的异常，统一返回格式化的错误响应。</p>',
    status: 'published', categoryName: '后端开发', tagNames: ['Node.js', 'Express', 'SQLite']
  },
  {
    title: '用 CSS 实现像素风格 UI',
    summary: '纯 CSS 实现复古像素风格界面设计，包括像素边框、8-bit 配色、像素字体和像素级动画。',
    content: '<h2>像素边框技巧</h2><p>使用 box-shadow 可以模拟像素艺术的硬边效果，代替传统的 border。</p><pre><code>.pixel-border {\n  box-shadow:\n    4px 0 0 0 #2a2a5e,\n    -4px 0 0 0 #2a2a5e,\n    0 4px 0 0 #2a2a5e,\n    0 -4px 0 0 #2a2a5e;\n}</code></pre><h2>配色方案</h2><p>像素风格使用有限调色板，常见搭配包括深色背景搭配亮色主色。</p><h2>steps() 动画</h2><p>使用 animation-timing-function 的 steps() 替代 ease，让动画带有像素感的步进效果。</p><blockquote><p>像素风不等于粗糙，每个像素都应该是精心设计的。</p></blockquote>',
    status: 'published', categoryName: '设计', tagNames: ['CSS', '设计']
  },
  {
    title: 'TypeScript 入门：类型系统基础',
    summary: '理解 TypeScript 的核心类型系统，从基础类型到泛型，帮助你写出更健壮的 JavaScript 代码。',
    content: '<h2>基础类型</h2><p>TypeScript 为 JavaScript 添加了静态类型检查。string、number、boolean 是最基础的类型。</p><pre><code>let name: string = "TypeScript"\nlet age: number = 5\nlet isAwesome: boolean = true</code></pre><h2>接口与类型别名</h2><p>interface 和 type 都可以定义对象结构，选择哪个取决于使用场景。interface 可以被扩展，type 更灵活。</p><h2>泛型</h2><p>泛型让组件可以处理多种类型，同时保持类型安全。是编写可复用代码的关键工具。</p>',
    status: 'published', categoryName: '前端技术', tagNames: ['TypeScript', 'JavaScript']
  },
  {
    title: '个人博客部署实战',
    summary: '从开发到部署的完整流程，涵盖域名配置、Nginx 反向代理、HTTPS 证书自动续签。',
    content: '<h2>部署架构</h2><p>前端 Vue 应用构建为静态文件，由 Nginx 托管。后端 Express API 通过 PM2 守护进程运行。</p><pre><code># Nginx 配置示例\nserver {\n  listen 80;\n  server_name blog.example.com;\n\n  location / {\n    root /var/www/blog/dist;\n    try_files $uri $uri/ /index.html;\n  }\n\n  location /api {\n    proxy_pass http://localhost:8080;\n  }\n}</code></pre><h2>HTTPS</h2><p>使用 Certbot 自动获取和续签 Let\'s Encrypt SSL 证书，一行命令即可完成配置。</p><h2>自动化部署</h2><p>配置 GitHub Actions 或简单的部署脚本，实现 git push 自动构建和发布。</p>',
    status: 'published', categoryName: '后端开发', tagNames: ['Node.js', 'Express']
  }
]

export function ensureSeedData() {
  const db = getDb()
  ensureAdmin()

  // Categories
  const catStmt = db.prepare('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)')
  const catIds = {}
  for (const c of categories) {
    const result = catStmt.run(c.name, c.description)
    catIds[c.name] = result.lastInsertRowid || db.prepare('SELECT id FROM categories WHERE name = ?').get(c.name).id
  }

  // Tags
  const tagStmt = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)')
  const tagIds = {}
  for (const t of tags) {
    const result = tagStmt.run(t)
    tagIds[t] = result.lastInsertRowid || db.prepare('SELECT id FROM tags WHERE name = ?').get(t).id
  }

  // Articles (only if no articles exist)
  const existingCount = db.prepare('SELECT COUNT(*) as cnt FROM articles').get().cnt
  if (existingCount === 0) {
    const articleStmt = db.prepare('INSERT INTO articles (title, summary, content, status, category_id) VALUES (?, ?, ?, ?, ?)')
    const articleTagStmt = db.prepare('INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)')

    for (const a of articles) {
      const result = articleStmt.run(a.title, a.summary, a.content, a.status, catIds[a.categoryName] || null)
      const articleId = result.lastInsertRowid
      for (const tn of a.tagNames) {
        if (tagIds[tn]) {
          articleTagStmt.run(articleId, tagIds[tn])
        }
      }
    }
    console.log('Seed articles created: ' + articles.length)
  } else {
    console.log('Articles already exist, skipping seed')
  }
}

// Direct execution
ensureSeedData()
console.log('Seed complete')
