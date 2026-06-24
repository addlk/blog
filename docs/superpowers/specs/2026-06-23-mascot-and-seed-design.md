# Mascot Roaming + Seed Data — Design Spec

## 1. Mascot Fullscreen Roaming

### Current State
Mascot is fixed at `bottom: 60px; left: 16px` with only vertical float animation and mouse eye-tracking.

### Target Behavior
- Cat starts at a random position near bottom-left
- Every 3-5 seconds picks a random waypoint within viewport (40px padding from edges)
- Moves to waypoint at walking speed (~120px over ~0.8s) using CSS `transition: all 0.15s steps(4)`
- Arrives, pauses 2-4s (idle float animation + looking around)
- Repeats

### States
| State | Visual | CSS |
|-------|--------|-----|
| Idle | Gentle up/down float | `animation: mascotFloat 2s steps(6) infinite` |
| Walking | Slight tilt in movement direction, no float | `transition: all 0.5s steps(6)` on container |
| Looking | Eyes glance toward random direction | Same as idle + JS eye movement |

### Implementation
- Mascot container: `position: fixed; z-index: 9992;` with `left` and `top` set by JS
- Roaming loop: `setInterval` picks waypoint, updates left/top via CSS transition
- Idle/walking toggle: add/remove a `.walking` class
- Near mouse detection: when cursor within 60px, pause roaming and look at cursor
- Keep existing blink interval (3.5s) and click→toast + particles

## 2. Seed Data

### Categories
| Name | Description |
|------|-------------|
| 前端技术 | Web 前端开发相关 |
| 后端开发 | 后端与服务器技术 |
| 设计 | UI/UX 与视觉设计 |

### Tags
Vue, JavaScript, TypeScript, Node.js, Express, SQLite, CSS, 设计

### Articles (5)
1. **Vue 3 组合式 API 快速上手** — 前端技术 [Vue, JavaScript]
2. **从零搭建 Express API 服务** — 后端开发 [Node.js, Express, SQLite]
3. **用 CSS 实现像素风格 UI** — 前端技术, 设计 [CSS, 设计]
4. **TypeScript 入门：类型系统基础** — 前端技术 [TypeScript, JavaScript]
5. **个人博客部署实战** — 后端开发 [Node.js, Express]

All articles published with realistic HTML content (paragraphs, code blocks, headings).
