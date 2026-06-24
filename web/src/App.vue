<template>
  <div class="app-wrapper">
    <!-- Public layout -->
    <template v-if="!isAdminRoute">
      <AppHeader />
      <div class="page-container">
        <div class="layout-wrapper">
          <main class="main-content">
            <router-view />
          </main>
          <aside class="sidebar">
            <AppSidebar />
          </aside>
        </div>
      </div>
      <AppFooter />

      <!-- Scroll Progress -->
      <div class="scroll-progress" id="scroll-progress" style="display:none;">
        <span style="font-size:9px;color:var(--color-text-dim);white-space:nowrap;">[SCROLL]</span>
        <div class="scroll-progress-bar" id="scroll-bar"></div>
      </div>

      <!-- Mascot -->
      <div id="mascot" class="mascot-container" title="Click me!" @click="mascotClick">
        <div class="mascot-body">
          <div class="m-col"></div><div class="m-col"></div><div class="m-col m-p"></div><div class="m-col m-p"></div><div class="m-col m-p"></div><div class="m-col m-p"></div><div class="m-col"></div><div class="m-col"></div>
          <div class="m-col"></div><div class="m-col m-p"></div><div class="m-col"></div><div class="m-col m-e"><div class="m-eye"></div></div><div class="m-col"></div><div class="m-col m-e"><div class="m-eye"></div></div><div class="m-col"></div><div class="m-col m-p"></div>
          <div class="m-col m-p"></div><div class="m-col"></div><div class="m-col"></div><div class="m-col m-bg"></div><div class="m-col m-bg"></div><div class="m-col"></div><div class="m-col"></div><div class="m-col m-p"></div>
          <div class="m-col m-p"></div><div class="m-col"></div><div class="m-col"></div><div class="m-col m-bg"></div><div class="m-col m-bg"></div><div class="m-col"></div><div class="m-col"></div><div class="m-col m-p"></div>
          <div class="m-col"></div><div class="m-col m-p"></div><div class="m-col m-p"></div><div class="m-col m-p"></div><div class="m-col m-p"></div><div class="m-col m-p"></div><div class="m-col m-p"></div><div class="m-col"></div>
          <div class="m-col"></div><div class="m-col"></div><div class="m-col m-g"></div><div class="m-col m-g"></div><div class="m-col m-g"></div><div class="m-col m-g"></div><div class="m-col"></div><div class="m-col"></div>
          <div class="m-col"></div><div class="m-col"></div><div class="m-col m-g"></div><div class="m-col m-g"></div><div class="m-col m-g"></div><div class="m-col m-g"></div><div class="m-col"></div><div class="m-col"></div>
          <div class="m-col"></div><div class="m-col"></div><div class="m-col m-br"></div><div class="m-col m-br"></div><div class="m-col m-br"></div><div class="m-col m-br"></div><div class="m-col"></div><div class="m-col"></div>
        </div>
      </div>
    </template>

    <!-- Admin layout -->
    <router-view v-else />
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// ===== Global Toast System =====
let toastId = 0
window.showToast = function(msg, type) {
  const container = document.getElementById('toast-container')
  if (!container) return
  const t = document.createElement('div')
  t.className = 'toast ' + (type || '')
  t.textContent = msg
  t.id = 'toast-' + (++toastId)
  container.appendChild(t)
  setTimeout(() => { const el = document.getElementById(t.id); if (el) el.remove() }, 3000)
}

// ===== Scroll Progress =====
function initScrollProgress() {
  const progress = document.getElementById('scroll-progress')
  const bar = document.getElementById('scroll-bar')
  if (!progress || !bar) return

  function update() {
    const h = document.documentElement.scrollHeight - window.innerHeight
    const pct = window.scrollY / h
    if (pct > 0.05 && pct < 0.95) {
      progress.style.display = 'flex'
      const filled = Math.floor(pct * 16)
      let html = ''
      for (let i = 0; i < 16; i++) html += '<div class="sp-pixel' + (i < filled ? ' on' : '') + '"></div>'
      bar.innerHTML = html
    } else {
      progress.style.display = 'none'
    }
  }

  window.addEventListener('scroll', update)
  return () => window.removeEventListener('scroll', update)
}

// ===== Mascot Roaming =====
function initMascot() {
  const mascot = document.getElementById('mascot')
  if (!mascot) return
  const eyes = mascot.querySelectorAll('.m-col.m-e')
  let isWalking = false
  let roamTimer = null
  let pauseTimer = null

  function moveTo(x, y) {
    mascot.classList.add('walking')
    isWalking = true
    mascot.style.left = x + 'px'
    mascot.style.top = y + 'px'
  }

  function pickWaypoint() {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const x = 40 + Math.random() * (vw - 140)
    const y = 60 + Math.random() * (vh - 130)
    moveTo(x, y)
    // Walk for ~0.8s then pause
    if (pauseTimer) clearTimeout(pauseTimer)
    pauseTimer = setTimeout(function() {
      mascot.classList.remove('walking')
      isWalking = false
      // Look around after arriving
      eyes.forEach(function(eye, i) {
        const dx = (i === 0 ? 2 : -2) * (Math.random() > 0.5 ? 1 : -1)
        eye.style.transform = 'translate(' + dx + 'px,-1px)'
      })
      setTimeout(function() {
        eyes.forEach(function(eye) { eye.style.transform = '' })
      }, 1500)
      // Schedule next waypoint
      if (roamTimer) clearTimeout(roamTimer)
      roamTimer = setTimeout(pickWaypoint, 2000 + Math.random() * 3000)
    }, 800 + Math.random() * 400)
  }

  // Eye tracking (keep existing)
  function onMove(e) {
    eyes.forEach(function(eye) {
      const r = eye.getBoundingClientRect()
      const dx = Math.min(Math.max((e.clientX - r.left - r.width / 2) / 20, -2), 2)
      const dy = Math.min(Math.max((e.clientY - r.top - r.height / 2) / 20, -2), 2)
      eye.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'
    })
  }
  document.addEventListener('mousemove', onMove)

  // Periodic blink
  const blinkInterval = setInterval(function() {
    eyes.forEach(function(eye) {
      eye.style.transform = 'scaleY(0.1)'
      setTimeout(function() { eye.style.transform = '' }, 150)
    })
  }, 3500)

  // Start roaming after 1s delay
  setTimeout(pickWaypoint, 1000)

  // Resize handling
  function onResize() {
    mascot.style.left = Math.min(parseFloat(mascot.style.left) || 40, window.innerWidth - 100) + 'px'
    mascot.style.top = Math.min(parseFloat(mascot.style.top) || 60, window.innerHeight - 100) + 'px'
  }
  window.addEventListener('resize', onResize)

  return function() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('resize', onResize)
    if (roamTimer) clearTimeout(roamTimer)
    if (pauseTimer) clearTimeout(pauseTimer)
    clearInterval(blinkInterval)
  }
}

function mascotClick() {
  window.showToast('MEOW!', '')
  // Particle burst on click
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div')
    p.style.cssText = 'position:fixed;z-index:99998;width:6px;height:6px;background:' +
      ['#ffb347','#4ade80','#f472b6','#22d3ee'][Math.floor(Math.random() * 4)] +
      ';left:' + (event.clientX) + 'px;top:' + (event.clientY) + 'px;' +
      'animation:particleFly ' + (0.4 + Math.random() * 0.3) + 's forwards;' +
      '--dx:' + ((Math.random() - 0.5) * 80) + 'px;--dy:' + (-40 - Math.random() * 60) + 'px'
    document.body.appendChild(p)
    setTimeout(() => p.remove(), 800)
  }
}

// Add particle keyframe
const particleStyle = document.createElement('style')
particleStyle.textContent = '@keyframes particleFly { to { transform:translate(var(--dx),var(--dy)); opacity:0; } }'
document.head.appendChild(particleStyle)

let cleanupScroll, cleanupMascot

onMounted(() => {
  // Create toast container
  const tc = document.createElement('div')
  tc.id = 'toast-container'
  tc.className = 'toast-container'
  document.body.appendChild(tc)

  cleanupScroll = initScrollProgress()
  cleanupMascot = initMascot()
})

onBeforeUnmount(() => {
  if (cleanupScroll) cleanupScroll()
  if (cleanupMascot) cleanupMascot()
  const tc = document.getElementById('toast-container')
  if (tc) tc.remove()
})
</script>

<style scoped>
.app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.layout-wrapper { flex: 1; }

/* Mascot */
.mascot-container {
  position: fixed;
  z-index: 9992;
  cursor: pointer;
  animation: mascotFloat 2s steps(6) infinite;
  transition: left 0.5s steps(6), top 0.5s steps(6);
  pointer-events: auto;
}
.mascot-container.walking {
  animation: mascotWalk 0.3s steps(3) infinite;
  transition: left 0.6s steps(8), top 0.6s steps(8);
}
.mascot-container:hover { filter: brightness(1.3); }
@keyframes mascotWalk {
  0%, 100% { transform: translateY(-1px); }
  50% { transform: translateY(1px); }
}

.mascot-body {
  display: grid;
  grid-template-columns: repeat(8, 6px);
  grid-template-rows: repeat(8, 6px);
  gap: 1px;
  image-rendering: pixelated;
}

.m-col { width: 6px; height: 6px; background: transparent; transition: all 0.2s steps(3); }
.m-col.m-p { background: var(--color-accent); }
.m-col.m-g { background: var(--color-secondary); }
.m-col.m-bg { background: var(--color-bg); }
.m-col.m-br { background: var(--color-border); }

.m-col.m-e {
  background: transparent;
  transition: transform 0.2s steps(3);
}

.m-eye {
  width: 6px;
  height: 6px;
  background: var(--color-text);
}
</style>
