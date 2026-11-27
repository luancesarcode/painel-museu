import { exhibits } from './acervo.js'
import { themes, pages, slideDetails } from './layout.js'

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
  let html
  let total
  if (page.strip) {
    total = page.strip.length
    html = `<img class="bg" src="${page.bg}" alt=""><h1 class="sr">${theme.name}</h1>
      <div class="strip"><div class="strip-track">${page.strip.map((ids, p) => `<div class="strip-page">${page.tiles.map((rect, i) => tileHtml(rect, byId[ids[i]], p === 0)).join('')}</div>`).join('')}</div></div>`
  } else {
    // Folhas de imagem lado a lado, rolando na horizontal.
    total = page.sheets.length
    html = `<h1 class="sr">${theme.name}</h1>
      <div class="strip"><div class="strip-track">${page.sheets.map(sheet => `<div class="strip-page"><img class="bg" src="${sheet.bg}" alt="">${sheet.tiles.map((rect, i) => hot(rect, byId[sheet.items[i]].title, `item:${sheet.items[i]}`)).join('')}</div>`).join('')}</div></div>`
  }
  const el = screen(id, `page tone-${theme.tone}`, html)
  initStrip(el, total)
}

function tileHtml(rect, item, eager = false) {
  if (!item) return `<div class="tile empty" style="${box(rect)}" aria-hidden="true"></div>`
  return `<button type="button" class="tile ${item.hazard ? 'hazard' : ''}" style="${box(rect)}" data-go="item:${item.id}" aria-label="${esc(item.period ? `${item.period}: ${item.title}` : item.title)}">
    <img src="assets/${item.image}.webp" alt="" loading="${eager ? 'eager' : 'lazy'}">
    <span>${item.period ? `<b>${esc(item.period)}</b>` : ''}${esc(item.title)}</span></button>`
}

// Faixa rolável da História: deslizar com o dedo, rodinha do mouse ou setas.
function initStrip(el, total) {
  const strip = el.querySelector('.strip')
  const index = () => Math.min(total - 1, Math.max(0, Math.round(strip.scrollLeft / W)))
  // "target" é a página pedida; cliques rápidos nas setas somam em vez de se perderem no meio da animação.
  let target = 0
  const goTo = i => {
    target = (i + total) % total
    strip.scrollTo({ left: target * W, behavior: 'smooth' })
  }
  el.pager = { total, index, step: delta => goTo(target + delta) }
  strip.addEventListener('scrollend', () => { target = index() })
  strip.addEventListener('scroll', () => { if (screens[current] === el) syncDock() }, { passive: true })
  let wheelLock = 0
  strip.addEventListener('wheel', event => {
    event.preventDefault()
    const now = Date.now()
    if (now < wheelLock) return
    const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX
    if (Math.abs(delta) < 4) return
    wheelLock = now + 550
    goTo(target + Math.sign(delta))
  }, { passive: false })
  el.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') goTo(target + 1)
    if (event.key === 'ArrowLeft') goTo(target - 1)
  })
}

/* ---------- fichas ---------- */

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
  while (copy.scrollHeight > copy.clientHeight + 1 && size > 30) {
    size -= 1
    copy.style.fontSize = `${size}px`
  }
  copy.classList.toggle('scrolls', copy.scrollHeight > copy.clientHeight + 1)
}

function buildDetail(id) {
  const item = byId[id]
  const theme = themes[item.section === 'historia' ? 'historia' : item.section]
  const slide = slideDetails[id]
  let html
  if (slide) {
    html = `<img class="bg" src="${slide.bg}" alt=""><h1 class="sr">${esc(item.title)}</h1>
      ${videoBlock(slide.video, slide.box)}`
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
`
  }
  const el = screen(`item:${id}`, `detail tone-${theme.tone}`, html)
  el.dataset.item = id
  fitText(el.querySelector('.copy'))
}

/* ---------- barra de navegação (fica fora do conteúdo das telas) ---------- */

const icon = {
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8M5.5 9.5V20h5v-6h3v6h5V9.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}

const dock = document.createElement('nav')
dock.className = 'dock'
dock.dataset.mode = 'hidden'
dock.setAttribute('aria-label', 'Navegação')
dock.innerHTML = `
  <button type="button" class="dock-btn" data-show="item" data-go="back">${icon.back}<span>Voltar</span></button>
  <div class="dock-pager" data-show="page">
    <button type="button" class="dock-round" data-pager="-1" aria-label="Página anterior">${icon.back}</button>
    <span class="dock-count" aria-live="polite">1 / 1</span>
    <button type="button" class="dock-round" data-pager="1" aria-label="Próxima página">${icon.next}</button>
  </div>
  <button type="button" class="dock-btn" data-show="page" data-go="menu">${icon.home}<span>Voltar ao Menu</span></button>`
stage.append(dock)

function syncDock() {
  const el = screens[current]
  const mode = !el || current === 'menu' ? 'hidden' : el.dataset.item ? 'item' : 'page'
  dock.dataset.mode = mode
  dock.dataset.tone = [...(el?.classList ?? [])].find(c => c.startsWith('tone-'))?.slice(5) ?? 'gold'
  if (mode === 'page' && el.pager) {
    dock.querySelector('.dock-count').textContent = `${el.pager.index() + 1} / ${el.pager.total}`
    dock.classList.toggle('single', el.pager.total < 2)
  }
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

let finishTransition = null

function pickTransition(from, to) {
  return to === 'menu' ? 'fade-slow' : 'fade'
}

// Só mostra uma tela quando todas as imagens dela já estão decodificadas; assim nada "pisca"
// ou entra aos poucos por cima da tela anterior.
function ready(el) {
  const imgs = [...el.querySelectorAll('img')].filter(img => !img.closest('.strip-page:not(:first-child)'))
  const loads = imgs.map(img => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()))
  const limit = new Promise(resolve => setTimeout(resolve, 3000))
  return Promise.race([Promise.all(loads), limit])
}

let navToken = 0

async function go(target) {
  const id = resolve(target)
  const token = ++navToken
  if (id === current) return
  ensure(id)
  await ready(screens[id])
  if (token !== navToken) return // outro toque chegou enquanto carregava
  finishTransition?.()
  if (pages[id]) originPage = id

  const previous = screens[current]
  const next = screens[id]
  const kind = previous ? pickTransition(current, id) : 'none'
  current = id
  syncDock()

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

  // Folhas seguintes da faixa: decodifica agora, em segundo plano, para a rolagem não "piscar".
  next.querySelectorAll('.strip-page:not(:first-child) img.bg').forEach(img => img.decode?.().catch(() => {}))
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
  const pager = event.target.closest('[data-pager]')
  if (pager) { screens[current]?.pager?.step(Number(pager.dataset.pager)); return }
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
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scale = Math.min(vw / W, vh / H)
  stage.style.transform = `translate(${(vw - W * scale) / 2}px, ${(vh - H * scale) / 2}px) scale(${scale})`
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

ensure('menu')
go('menu')

// Aquece o cache com as imagens grandes das telas seguintes, sem atrapalhar o menu.
setTimeout(() => {
  const warm = [...Object.values(pages).flatMap(p => p.sheets?.map(s => s.bg) ?? [p.bg]), ...Object.values(slideDetails).map(d => d.bg), ...Object.values(themes).map(t => t.bg)]
  new Set(warm).forEach(src => { new Image().src = src })
}, 1500)
