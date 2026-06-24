import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'

const routes = [
  // Public routes
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
  { path: '/categories', name: 'Categories', component: () => import('@/views/CategoryList.vue'), meta: { title: '分类大全' } },
  { path: '/category/:id', name: 'CategoryArticles', component: () => import('@/views/CategoryArticles.vue'), meta: { title: '分类文章' } },
  { path: '/tags', name: 'Tags', component: () => import('@/views/TagList.vue'), meta: { title: '标签大全' } },
  { path: '/tag/:id', name: 'TagArticles', component: () => import('@/views/TagArticles.vue'), meta: { title: '标签文章' } },
  { path: '/article/:id', name: 'ArticleDetail', component: () => import('@/views/ArticleDetail.vue'), meta: { title: '文章详情' } },

  // Admin routes
  { path: '/admin/login', name: 'AdminLogin', component: () => import('@/views/admin/Login.vue'), meta: { title: '管理员登录' } },

  // Admin layout (protected)
  {
    path: '/admin',
    component: () => import('@/views/admin/Layout.vue'),
    meta: { requiresAuth: true, title: '管理后台' },
    children: [
      { path: '', name: 'AdminDashboard', component: () => import('@/views/admin/Dashboard.vue'), meta: { title: '仪表盘' } },
      { path: 'articles', name: 'AdminArticles', component: () => import('@/views/admin/Articles.vue'), meta: { title: '文章管理' } },
      { path: 'articles/new', name: 'AdminArticleNew', component: () => import('@/views/admin/ArticleEdit.vue'), meta: { title: '写文章' } },
      { path: 'articles/:id', name: 'AdminArticleEdit', component: () => import('@/views/admin/ArticleEdit.vue'), meta: { title: '编辑文章' } },
      { path: 'categories', name: 'AdminCategories', component: () => import('@/views/admin/Categories.vue'), meta: { title: '分类管理' } },
      { path: 'tags', name: 'AdminTags', component: () => import('@/views/admin/Tags.vue'), meta: { title: '标签管理' } }
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

// Auth guard
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 个人博客` : '个人博客'

  if (to.meta.requiresAuth && !isLoggedIn()) {
    return next('/admin/login')
  }

  // Redirect logged-in users away from login page
  if (to.path === '/admin/login' && isLoggedIn()) {
    return next('/admin')
  }

  next()
})

export default router
