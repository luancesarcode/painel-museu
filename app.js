import { exhibits } from './acervo.js'
import { themes, pages, slideDetails, arrow, menuButton } from './layout.js'

const W = 1920
const H = 1080
const IDLE_MS = 150_000

const stage = document.querySelector('#stage')
const byId = Object.fromEntries(exhibits.map(item => [item.id, item]))
const screens = {}
let current = null
let originPage = 'cur1'
let idleTimer

const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const pct = (value, total) => `${(value / total) * 100}%`

function box({ x, y, w, h }) {
  return `left:${pct(x, W)};top:${pct(y, H)};width:${pct(w, W)};height:${pct(h, H)}`
}

function screen(id, className, html) {
  const el = document.createElement('section')
  el.className = `screen ${className}`
  el.dataset.screen = id
  el.innerHTML = html
  stage.append(el)
  screens[id] = el
  return el
}

function hot(rect, label, action, extra = '') {
  return `<button type="button" class="hot ${extra}" style="${box(rect)}" aria-label="${esc(label)}" data-go="${action}"></button>`
}

function backToMenu(rect = menuButton) {
  return hot(rect, 'Voltar ao menu principal', 'menu', 'hot-button')
}

/* ---------- menu ---------- */

function buildMenu() {
  const rows = [
    { go: 'historia', cls: 'gold', btn: 'btn-ouro', icon: 'ico-rad', prev: 'prev-hist', text: 'História da Radiação', top: 29, bar: 67, ico: 118 },
    { go: 'cur1', cls: 'green', btn: 'btn-verde', icon: 'ico-pergaminho', prev: 'prev-cur', text: 'Curiosidades Históricas', top: 382, bar: 64, ico: 132 },
    { go: 'apl1', cls: 'blue', btn: 'btn-azul', icon: 'ico-atomo', prev: 'prev-aplic', text: 'Aplicações Modernas da Radiação', top: 735, bar: 71, ico: 134 },
  ]
  screen('menu', 'menu', `
    <video class="menu-video" src="deck/menu.mp4" muted loop playsinline autoplay preload="auto"></video>
    ${rows.map((row, i) => `
      <button type="button" class="menu-row ${row.cls}" data-go="${row.go}" style="--i:${i};--top:${row.top}px;--bar:${row.bar}px;--ico:${row.ico}px">
        <span class="menu-label" style="background-image:url(deck/${row.btn}.webp)">
          <img src="deck/${row.icon}.webp" alt="">
          <span>${row.text}</span>
        </span>
        <span class="menu-preview"><img src="deck/${row.prev}.webp" alt=""></span>
      </button>`).join('')}
  `)
}

/* ---------- grades ---------- */

function buildPage(id) {
  const page = pages[id]
  const theme = themes[page.theme]
  let html = `<img class="bg" src="${page.bg}" alt="">`
  if (page.custom) {
    html += `<h1 class="sr">${theme.name}</h1>`
    html += page.tiles.map((rect, i) => {
      const item = byId[page.items[i]]
      if (!item) return `<div class="tile empty" style="${box(rect)}" aria-hidden="true"></div>`
      return `<button type="button" class="tile ${item.hazard ? 'hazard' : ''}" style="${box(rect)}" data-go="item:${item.id}" aria-label="${esc(item.period ? `${item.period}: ${item.title}` : item.title)}">
        <img src="assets/${item.image}.webp" alt="">
        <span>${item.period ? `<b>${esc(item.period)}</b>` : ''}${esc(item.title)}</span></button>`
    }).join('')
    if (page.total > 1) {
      html += `<button type="button" class="nav-arrow prev" style="${box({ ...arrow, x: arrow.x - 110 })}" data-go="${page.prev}" aria-label="Página anterior">${arrowSvg}</button>
        <button type="button" class="nav-arrow next" style="${box(arrow)}" data-go="${page.next}" aria-label="Próxima página">${arrowSvg}</button>
        <div class="page-count" aria-hidden="true">${page.index + 1} / ${page.total}</div>`
    }
  } else {
    html += `<h1 class="sr">${theme.name}</h1>`
    html += page.tiles.map((rect, i) => hot(rect, byId[page.items[i]].title, `item:${page.items[i]}`)).join('')
  }
  if (page.next && !page.custom) html += hot(arrow, 'Próxima página', page.next, 'hot-round')
  html += backToMenu(page.back)
  screen(id, `page tone-${theme.tone}`, html)
}

/* ---------- fichas ---------- */

const arrowSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="currentColor"/><path d="M26 50h40M50 30l22 20-22 20" fill="none" stroke="#06140b" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" transform="rotate(180 50 50)"/></svg>`

function videoBlock(src, rect) {
  return `<div class="video-wrap" style="${box(rect)}">
    <video src="${src}" playsinline preload="metadata"></video>
    <button type="button" class="video-toggle" aria-label="Reproduzir ou pausar o vídeo"><span></span></button>
  </div>`
}

// Reduz a fonte até o texto caber inteiro na área, sem precisar rolar.
function fitText(copy) {
  if (!copy) return
  let size = parseFloat(getComputedStyle(copy).fontSize)
  while (copy.scrollHeight > copy.clientHeight + 1 && size > 22) {
    size -= 1
    copy.style.fontSize = `${size}px`
  }
}

function buildDetail(id) {
  const item = byId[id]
  const theme = themes[item.section === 'historia' ? 'historia' : item.section]
  const slide = slideDetails[id]
  let html
  if (slide) {
    html = `<img class="bg" src="${slide.bg}" alt=""><h1 class="sr">${esc(item.title)}</h1>
      ${videoBlock(slide.video, slide.box)}
      ${hot(arrow, 'Voltar para a lista', 'back', 'hot-round')}
      ${backToMenu()}`
  } else {
    const photos = item.images ?? [item.image]
    const size = item.description.length > 900 ? 'xs' : item.description.length > 700 ? 's' : item.description.length > 450 ? 'm' : 'l'
    const titleSize = item.title.length > 45 ? 'long' : item.title.length > 28 ? 'mid' : ''
    html = `${theme.tone === 'gold' ? '' : `<img class="bg" src="${theme.bg}" alt="">`}
      <div class="head"><img src="${theme.icon}" alt=""><span>${theme.label}</span></div>
      <h1 class="title ${titleSize}">${esc(item.title)}</h1>
      ${item.period ? `<p class="period ${item.hazard ? 'hazard' : ''}">${item.hazard ? '☢ ' : ''}${esc(item.period)}</p>` : ''}
      <div class="gallery ${photos.length > 1 ? 'multi' : ''}">
        <figure class="photo ${item.object ? 'object' : ''}" style="--bg:url(assets/${photos[0]}.webp)"><img class="main" src="assets/${photos[0]}.webp" alt=""></figure>
        ${photos.length > 1 ? `<div class="thumbs">${photos.map((p, i) => `<button type="button" class="thumb ${i ? '' : 'on'}" data-photo="assets/${p}.webp" aria-label="Foto ${i + 1}"><img src="assets/${p}.webp" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="copy size-${size}">${item.summary ? `<p class="lead">${esc(item.summary)}</p>` : ''}${item.description.split('\n').filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <button type="button" class="back-arrow" data-go="back" aria-label="Voltar para a lista">${arrowSvg}</button>
      <button type="button" class="menu-btn" data-go="menu">Voltar ao Menu Principal</button>`
  }
  const el = screen(`item:${id}`, `detail tone-${theme.tone}`, html)
  el.dataset.item = id
  fitText(el.querySelector('.copy'))
}

/* ---------- navegação ---------- */

function resolve(target) {
  if (target === 'back') return originPage
  return target
}

function ensure(id) {
  if (screens[id]) return
  if (id === 'menu') buildMenu()
  else if (id.startsWith('item:')) buildDetail(id.slice(5))
  else buildPage(id)
}

function preload(id) {
  const src = pages[id]?.bg
  if (src) new Image().src = src
}

// Transições do slide original: menu = fade (0,7 s); Curiosidades 2 = cobrir; Aplicações 2 = puxar.
const TRANSITIONS = {
  'cur1>cur2': 'cover', 'cur2>cur1': 'cover',
  'apl1>apl2': 'pull', 'apl2>apl1': 'pull',
}
let finishTransition = null

function pickTransition(from, to) {
  if (to === 'menu') return 'fade-slow'
  if (pages[from]?.custom && pages[to]?.custom) return pages[from].next === to ? 'cover' : 'cover-back'
  return TRANSITIONS[`${from}>${to}`] ?? 'fade'
}

function go(target) {
  const id = resolve(target)
  if (id === current) return
  ensure(id)
  finishTransition?.()
  if (pages[id]) { originPage = id; preload(pages[id].next) }

  const previous = screens[current]
  const next = screens[id]
  const kind = previous ? pickTransition(current, id) : 'none'
  current = id

  if (previous) {
    previous.querySelectorAll('video').forEach(video => {
      if (!video.classList.contains('menu-video')) { video.pause(); video.currentTime = 0 }
    })
    previous.querySelector('.video-wrap')?.classList.remove('playing')
  }

  // A tela que entra fica por cima e a que sai fica opaca por baixo: nunca há duas telas translúcidas.
  next.classList.add('on', `in-${kind}`)
  if (previous) {
    previous.classList.remove('on')
    previous.classList.add('leaving', `out-${kind}`)
    const done = () => {
      clearTimeout(timer)
      previous.classList.remove('leaving', `out-${kind}`)
      next.classList.remove(`in-${kind}`)
      finishTransition = null
    }
    const timer = setTimeout(done, kind === 'fade-slow' ? 750 : kind === 'fade' ? 450 : 650)
    finishTransition = done
  }

  next.querySelector('.menu-video')?.play().catch(() => {})
  const wrap = next.querySelector('.video-wrap')
  if (wrap) playVideo(wrap)
}

function playVideo(wrap) {
  const video = wrap.querySelector('video')
  video.currentTime = 0
  video.play().then(() => wrap.classList.add('playing')).catch(() => wrap.classList.remove('playing'))
}

stage.addEventListener('click', event => {
  const thumb = event.target.closest('.thumb')
  if (thumb) {
    const gallery = thumb.closest('.gallery')
    gallery.querySelector('.main').src = thumb.dataset.photo
    gallery.querySelector('.photo').style.setProperty('--bg', `url(${thumb.dataset.photo})`)
    gallery.querySelectorAll('.thumb').forEach(t => t.classList.toggle('on', t === thumb))
    return
  }
  const toggle = event.target.closest('.video-toggle')
  if (toggle) {
    const wrap = toggle.closest('.video-wrap')
    const video = wrap.querySelector('video')
    if (video.paused) { video.ended && (video.currentTime = 0); video.play(); wrap.classList.add('playing') }
    else { video.pause(); wrap.classList.remove('playing') }
    return
  }
  const target = event.target.closest('[data-go]')
  if (target) go(target.dataset.go)
})

stage.addEventListener('ended', event => {
  event.target.closest?.('.video-wrap')?.classList.remove('playing')
}, true)

// Foto de proporção parecida com a moldura preenche tudo (sem faixas); as bem diferentes
// (retratos, panorâmicas) ficam inteiras sobre um fundo desfocado da própria foto.
stage.addEventListener('load', event => {
  const img = event.target
  if (!img.classList?.contains('main')) return
  const frame = img.closest('.photo')
  const ratio = (img.naturalWidth / img.naturalHeight) / (frame.clientWidth / frame.clientHeight)
  const fills = ratio > 0.8 && ratio < 1.25
  img.classList.toggle('fill', fills)
  // Ficha com uma foto só: a moldura acompanha a proporção da foto, sem sobras.
  const gallery = frame.closest('.gallery')
  if (!gallery.classList.contains('multi') && !fills) {
    frame.style.flex = 'none'
    frame.style.height = `${Math.min(740, 700 / (img.naturalWidth / img.naturalHeight))}px`
  }
}, true)

/* ---------- palco, ociosidade e modo quiosque ---------- */

// Escala o palco 1920x1080 para caber em qualquer janela ou TV (HD, 4K, vertical, etc.).
function fit() {
  const root = document.documentElement
  const vw = root.clientWidth || innerWidth
  const vh = root.clientHeight || innerHeight
  stage.style.setProperty('--scale', Math.min(vw / W, vh / H))
}
addEventListener('resize', fit)
addEventListener('orientationchange', fit)
addEventListener('load', fit)
visualViewport?.addEventListener('resize', fit)
new ResizeObserver(fit).observe(document.documentElement)
fit()

function resetIdle() {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { if (current !== 'menu') go('menu') }, IDLE_MS)
}
for (const type of ['pointerdown', 'keydown']) addEventListener(type, resetIdle, { passive: true })
resetIdle()

addEventListener('keydown', event => {
  if (event.key === 'Escape') go('menu')
  if (event.key === 'f' || event.key === 'F') {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.().catch(() => {})
  }
})
addEventListener('contextmenu', event => event.preventDefault())
addEventListener('dragstart', event => event.preventDefault())

// Duplo toque não deve dar zoom na TV.
let lastTouch = 0
addEventListener('touchend', event => {
  const now = Date.now()
  if (now - lastTouch < 350) event.preventDefault()
  lastTouch = now
}, { passive: false })

for (const id of Object.keys(pages)) preload(id)
ensure('menu')
go('menu')
