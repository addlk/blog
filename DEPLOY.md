# 部署指南

## 架构

```
Vercel (前端静态文件)         Render (后端 API + SQLite)
    │                               │
    ├── https://your-blog.vercel.app  ├── https://your-app.onrender.com
    │                               │
    └───── /api/* ─── CORS ────────→┘
```

---

## 第一步：部署后端到 Render

1. 打开 [https://dashboard.render.com](https://dashboard.render.com) → **New + → Web Service**
2. 连接你的 GitHub 仓库，选择 `server` 目录
3. 填写配置：

   | 字段 | 值 |
   |------|-----|
   | **Name** | `blog-api` |
   | **Root Directory** | `server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Plan** | **Free** |

4. 在 **Advanced → Add Environment Variable** 中添加：

   | 变量 | 值 |
   |------|------|
   | `DB_PATH` | `/data/blog.db` |
   | `UPLOADS_DIR` | `/data/uploads` |
   | `PUBLIC_URL` | `https://your-app.onrender.com`（部署后填入实际地址） |
   | `JWT_SECRET` | 设置一个随机字符串 |

5. 在 **Advanced → Add Disk** 中添加持久磁盘：

   | 字段 | 值 |
   |------|-----|
   | **Mount Path** | `/data` |
   | **Size** | `1 GB` |

6. 点击 **Create Web Service**，等待部署完成
7. 部署完成后，复制分配的域名（例如 `https://blog-api.onrender.com`）

---

## 第二步：部署前端到 Vercel

1. 打开 [https://vercel.com](https://vercel.com) → **Add New → Project**
2. 导入同一个 GitHub 仓库
3. 框架会自动检测为 **Vite**（如果没检测到，手动选择 `Vite`）
4. 在 **Environment Variables** 中添加：

   | 变量 | 值 |
   |------|------|
   | `VITE_API_URL` | `https://your-app.onrender.com`（上一步 Render 的域名） |

5. 点击 **Deploy**，等待部署完成
6. 部署完成后访问分配的 Vercel 域名即可

---

## 第三步：首次启动

1. 首次打开博客时，后端会自动创建数据库和示例文章（5 篇）
2. 管理后台地址：`https://your-blog.vercel.app/admin/login`
3. 默认管理员：`admin` / `admin123`
4. **务必修改默认密码！**

---

## 更新代码

推送到 GitHub 仓库后：
- **Vercel**：自动重新构建和部署前端
- **Render**：自动重新部署后端（如果设置了 Auto-Deploy）

---

## 本地开发

```bash
# 启动后端
cd server && npm start

# 启动前端（另开终端）
cd web && npm run dev
```

前端开发环境通过 Vite 代理将 `/api` 请求转发到 `http://localhost:8080`。
