<template>
  <article class="article-card" @click="goDetail" :style="{ animationDelay: delay + 's' }">
    <div class="card-cover" v-if="article.cover_image">
      <img :src="article.cover_image" :alt="article.title" loading="lazy" />
    </div>
    <div class="card-body">
      <div class="card-meta">
        <router-link v-if="article.category" :to="'/category/' + article.category.id" class="card-badge" @click.stop>
          {{ article.category.name }}
        </router-link>
        <span class="card-date">{{ formatDate(article.created_at) }}</span>
        <span class="card-次阅读" v-if="article.view_count !== undefined">
          {{ article.view_count }} 次阅读
        </span>
      </div>
      <h2 class="card-title">{{ article.title }}</h2>
      <p class="card-summary" v-if="article.summary">{{ article.summary }}</p>
      <div class="card-tags" v-if="article.tags && article.tags.length">
        <router-link v-for="tag in article.tags.slice(0, 3)" :key="tag.id" :to="'/tag/' + tag.id" class="card-tag" @click.stop>
          {{ tag.name }}
        </router-link>
        <span v-if="article.tags.length > 3" class="card-tag-more">+{{ article.tags.length - 3 }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  article: { type: Object, required: true },
  delay: { type: Number, default: 0 }
})

const router = useRouter()

function goDetail() { router.push('/article/' + props.article.id) }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + day
}
</script>

<style scoped>
.article-card {
  background: var(--color-surface);
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: 4px 4px 0 0 var(--color-border);
  transition: all 0.1s steps(3);
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: cardIn 0.4s cubic-bezier(1, 0, 0.2, 1) forwards;
}

@keyframes cardIn {
  to { opacity: 1; }
}

.article-card:hover {
  background: var(--color-surface-hover);
  box-shadow: 2px 2px 0 0 var(--color-border);
  transform: translate(2px, 2px);
}

.article-card::after {
  content: '';
  position: absolute;
  inset: -100% 0 0 0;
  background: linear-gradient(transparent 0%, rgba(255, 179, 71, 0.04) 50%, transparent 100%);
  transition: top 0.15s steps(3);
  pointer-events: none;
}

.article-card:hover::after { top: 100%; }

.card-cover { width: 100%; height: 180px; overflow: hidden; }
.card-cover img { width: 100%; height: 100%; object-fit: cover; }

.card-body { padding: 20px; }

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 11px;
}

.card-badge {
  padding: 3px 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 400;
  box-shadow: 2px 2px 0 0 var(--color-border);
  text-decoration: none;
}

.card-badge:hover { color: var(--color-primary); filter: brightness(1.2); }

.card-date { color: var(--color-text-dim); font-size: 11px; }
.card-次阅读 { color: var(--color-text-dim); font-size: 11px; margin-left: auto; }

.card-title {
  font-size: 16px;
  font-weight: 400;
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card:hover .card-title { color: var(--color-primary); }

.card-summary {
  font-size: 13px;
  color: var(--color-text-dim);
  line-height: 1.7;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags { display: flex; gap: 6px; flex-wrap: wrap; }

.card-tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-bg);
  color: var(--color-tag);
  font-size: 10px;
  text-decoration: none;
  box-shadow: 2px 2px 0 0 var(--color-border);
  transition: all 0.1s steps(3);
}

.card-tag:hover { background: var(--color-surface-hover); color: var(--color-tag); }

.card-tag-more {
  font-size: 10px;
  color: var(--color-text-dim);
  padding: 2px 4px;
}
</style>

