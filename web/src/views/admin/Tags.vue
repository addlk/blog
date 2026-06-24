<template>
  <div class="manage-page">
    <div class="section-title" style="margin-bottom:16px;">[ 标签管理 ]</div>

    <div class="manage-card">
      <div class="add-form">
        <input v-model="new名称" placeholder="标签名称" class="input-pixel" @keyup.enter="handleAdd" />
        <button class="btn-pixel primary" @click="handleAdd" :disabled="!new名称.trim()">[添加]</button>
      </div>

      <table class="data-table">
        <thead><tr>
          <th>名称</th>
          <th>文章数</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr></thead>
        <tbody>
          <tr v-for="t in list" :key="t.id" class="data-row">
            <td>
              <input v-if="editingId === t.id" v-model="edit名称" class="input-inline" @keyup.enter="handleUpdate(t.id)" />
              <span v-else>{{ t.名称 }}</span>
            </td>
            <td>{{ t.article_文章数 || 0 }}</td>
            <td>{{ (t.创建时间_at || '').slice(0, 10) }}</td>
            <td class="操作-cell">
              <template v-if="editingId === t.id">
                <button class="btn-action save" @click="handleUpdate(t.id)">[保存]</button>
                <button class="btn-action cancel" @click="cancelEdit">[取消]</button>
              </template>
              <template v-else>
                <button class="btn-action edit" @click="startEdit(t)">[编辑]</button>
                <button class="btn-action delete" @click="handleDelete(t.id, t.名称)">[删除]</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="empty-state" v-if="!list.length" style="padding:24px;">
        <p>暂无标签</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminTags, createTag, updateTag, deleteTag } from '@/api'

const list = ref([])
const new名称 = ref('')
const editingId = ref(null)
const edit名称 = ref('')

async function fetchData() {
  try { list.value = await getAdminTags() }
  catch (e) { console.error(e) }
}

async function handleAdd() {
  if (!new名称.value.trim()) return
  try { await createTag({ 名称: new名称.value.trim() }); new名称.value = ''; fetchData() }
  catch (e) { window.showToast('错误: ' + e.message, 'error') }
}

function startEdit(t) { editingId.value = t.id; edit名称.value = t.名称 }
function cancelEdit() { editingId.value = null }

async function handleUpdate(id) {
  try { await updateTag(id, { 名称: edit名称.value.trim() }); editingId.value = null; fetchData() }
  catch (e) { window.showToast('错误: ' + e.message, 'error') }
}

async function handleDelete(id, 名称) {
  if (!confirm('删除 "' + 名称 + '"?')) return
  try { await deleteTag(id); fetchData() }
  catch (e) { window.showToast('错误: ' + e.message, 'error') }
}

onMounted(fetchData)
</script>

<style scoped>
.manage-page { max-width: 700px; }
.manage-card { background: var(--color-surface); box-shadow: 4px 4px 0 0 var(--color-border); overflow: hidden; }
.add-form { display: flex; gap: 8px; padding: 16px; border-bottom: 3px solid var(--color-border); }
.input-pixel {
  flex: 1; min-width: 120px; padding: 8px 10px; background: var(--color-bg);
  border: none; color: var(--color-text); font-size: 13px;
  box-shadow: inset 3px 3px 0 0 var(--color-border); outline: none;
}
.input-pixel:focus { box-shadow: inset 3px 3px 0 0 var(--color-primary); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; font-size: 10px; color: var(--color-text-dim); padding: 10px 12px; border-bottom: 3px solid var(--color-border); }
.data-table td { padding: 8px 12px; font-size: 13px; color: var(--color-text); border-bottom: 1px solid var(--color-border); }
.input-inline { padding: 4px 8px; background: var(--color-bg); border: none; color: var(--color-text); font-size: 13px; box-shadow: inset 2px 2px 0 0 var(--color-primary); outline: none; width: 100%; box-sizing: border-box; }
.操作-cell { display: flex; gap: 4px; white-space: nowrap; }
.btn-action { padding: 4px 8px; font-size: 10px; cursor: pointer; font-family: var(--font-mono); border: none; }
.btn-action.edit { background: var(--color-primary-light); color: var(--color-primary); box-shadow: 2px 2px 0 0 var(--color-border); }
.btn-action.save { background: var(--color-primary); color: var(--color-bg); box-shadow: 2px 2px 0 0 #2a2a5e; }
.btn-action.cancel { background: var(--color-bg); color: var(--color-text-dim); box-shadow: 2px 2px 0 0 var(--color-border); }
.btn-action.删除 { background: #ef444422; color: var(--color-danger); box-shadow: 2px 2px 0 0 var(--color-border); }
.btn-action:hover { box-shadow: 1px 1px 0 0 var(--color-border); transform: translate(1px, 1px); }
.section-title { font-family: var(--font-display); font-size: 12px; color: var(--color-primary); text-shadow: 1px 1px 0 #2a2a5e; }
.empty-state { text-align: center; font-size: 13px; color: var(--color-text-dim); }
</style>

