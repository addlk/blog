# 个人博客综合平台 - Web展示端

博客平台的前端展示门户，面向 PC 端访客的核心浏览界面。基于 Vue 3 + Vite 构建，纯展示驱动，与后端 API 实时数据同步。

## 🎯 定位

- **纯展示**：无数据修改/新增/删除能力，专注浏览体验
- **数据同步**：通过后端公开 API 实时获取最新内容，零缓存滞后
- **轻量化**：摒弃冗余功能，聚焦页面加载速度与 SEO

## 🧱 技术栈

| 层       | 技术                        |
| -------- | --------------------------- |
| 框架     | Vue 3 (Composition API)     |
| 构建     | Vite 5                      |
| 路由     | Vue Router 4 (History 模式) |
| 请求     | Axios                       |

## 📁 项目结构

```
web/
├── index.html                 # 入口 HTML
├── package.json               # 依赖配置
├── vite.config.js             # Vite 构建配置 + 代理
└── src/
    ├── main.js                # 应用入口
    ├── App.vue                # 根布局组件
    ├── api/
    │   ├── request.js         # axios 实例 + 拦截器
    │   └── index.js           # API 接口封装
    ├── router/
    │   └── index.js           # 路由配置 (7 个路由)
    ├── components/
    │   ├── AppHeader.vue      # 顶部导航栏
    │   ├── AppFooter.vue      # 页脚
    │   ├── AppSidebar.vue     # 侧边栏 (分类+热门标签)
    │   └── ArticleCard.vue    # 文章卡片组件
    ├── views/
    │   ├── Home.vue           # 首页 (分页文章列表)
    │   ├── CategoryList.vue   # 分类大全
    │   ├── CategoryArticles.vue # 分类筛选文章
    │   ├── TagList.vue        # 标签大全 (标签云)
    │   ├── TagArticles.vue    # 标签筛选文章
    │   └── ArticleDetail.vue  # 文章详情 (富文本渲染)
    └── styles/
        └── global.css         # 全局样式 + CSS 变量
```

## 🚀 快速启动

### 1. 安装 Node.js (≥ 18)

本项目依赖 Node.js 和 npm，请先安装：

- 官网下载：https://nodejs.org/
- 推荐使用 LTS 版本

### 2. 安装依赖

```bash
cd web
npm install
```

### 3. 配置后端 API

编辑 `vite.config.js`，修改 proxy 目标地址为你的后端服务地址：

```js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8080", // 你的后端地址
      changeOrigin: true
    }
  }
}
```

### 4. 启动开发服务器

```bash
npm run dev
```

浏览器访问 http://localhost:3000

### 5. 构建生产版本

```bash
npm run build
```

产物输出到 `web/dist/` 目录。

## 🔌 接口依赖

Web 端需要后端提供以下公开 API（统一响应格式 `{ code, data, msg }`）：

| 接口                                  | 方法 | 说明                   |
| ------------------------------------- | ---- | ---------------------- |
| `/api/public/articles`                | GET  | 文章列表 (支持分页)    |
| `/api/public/articles/:id`            | GET  | 文章详情               |
| `/api/public/categories`              | GET  | 全部分类               |
| `/api/public/tags`                    | GET  | 全部标签               |

### 文章列表接口参数

| 参数       | 类型   | 说明               |
| ---------- | ------ | ------------------ |
| page       | number | 页码 (默认 1)      |
| pageSize   | number | 每页条数 (默认 10) |
| categoryId | number | 分类筛选           |
| tagId      | number | 标签筛选           |

### 预期响应数据结构

**文章列表响应：**
```json
{
  "code": 200,
  "data": {
    "records": [
      {
        "id": 1,
        "title": "文章标题",
        "summary": "文章简介",
        "content": "文章内容 (HTML)",
        "coverImage": "封面图URL",
        "createTime": "2024-01-01T12:00:00",
        "viewCount": 128,
        "category": { "id": 1, "name": "前端" },
        "tags": [
          { "id": 1, "name": "Vue" },
          { "id": 2, "name": "JavaScript" }
        ]
      }
    ],
    "total": 50,
    "pages": 5,
    "current": 1
  },
  "msg": "success"
}
```

**分类/标签响应：**
```json
{
  "code": 200,
  "data": [
    { "id": 1, "name": "前端", "description": "...", "articleCount": 12 }
  ],
  "msg": "success"
}
```

## 🎨 扩展指导

基于当前架构可无缝扩展：

### 文章搜索
```js
// 1. api/index.js 新增接口
export function searchArticles(keyword, params = {}) {
  return request({ url: '/public/articles/search', method: 'get', params: { keyword, ...params } })
}

// 2. 在 AppHeader 中添加搜索输入框
// 3. 创建 SearchResults.vue 视图并使用相同 ArticleCard 组件
```

### 评论/点赞
- 新增 `comments` 表和后端 API
- 在 `ArticleDetail.vue` 中新增评论区组件
- 分页加载评论列表
- 纯展示：访客无需登录即可浏览评论

### 暗黑模式
- 在 `global.css` 中补充 `[data-theme="dark"]` CSS 变量集
- 在 `App.vue` 中添加主题切换逻辑
- 利用 CSS 变量实现一键切换

### 上一篇/下一篇
- 后端新增相邻文章接口：`/api/public/articles/:id/adjacent`
- 在 `ArticleDetail.vue` 底部组件中添加导航

## 📱 响应式适配

- **≥ 1024px**：经典双栏布局 (主内容 + 侧边栏)
- **768px - 1024px**：侧边栏宽度自适应
- **≤ 768px**：单栏布局，侧边栏移至底部
