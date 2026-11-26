import { exhibits, sections } from './acervo.js'

const collection = document.querySelector('#acervo')
const search = document.querySelector('#busca')
const grid = document.querySelector('#fichas')
const results = document.querySelector('#resultados')
const filters = [...document.querySelectorAll('.filters button')]
const dialog = document.querySelector('dialog')
const detail = document.querySelector('#ficha')
const previous = document.querySelector('#anterior')
const next = document.querySelector('#proximo')

let activeFilter = 'todos'
let visibleExhibits = []
let activeIndex = 0
let opener

function normalize(text) {
  return text.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function render() {
  const words = normalize(search.value.trim()).split(/\s+/)
  visibleExhibits = exhibits.filter(item => {
    if (activeFilter !== 'todos' && item.section !== activeFilter) return false
    const text = normalize([item.title, item.summary, item.description, item.period].join(' '))
    return words.every(word => text.includes(word))
  })

  const count = visibleExhibits.length
  results.textContent = count === 0
    ? 'Nenhuma ficha encontrada. Experimente outro termo ou filtro.'
    : count === 1 ? '1 ficha' : `${count} fichas`

  grid.innerHTML = visibleExhibits.map(item => `
    <article>
      <button type="button" class="card" data-id="${item.id}" aria-haspopup="dialog">
        <img src="assets/${item.image}.webp" alt="" loading="lazy" class="${item.object ? 'object' : ''}">
        <span class="card-copy">
          <span class="meta">${item.period ?? sections[item.section]}</span>
          <strong>${item.title}</strong>
          <span class="summary">${item.summary}</span>
        </span>
      </button>
    </article>`).join('')
}

function selectFilter(filter) {
  activeFilter = filter
  for (const button of filters) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter))
  }
  render()
}

function syncFromHash() {
  const section = location.hash.slice(1)
  if (Object.hasOwn(sections, section) && section !== 'todos') {
    search.value = ''
    selectFilter(section)
    collection.scrollIntoView()
  }
}

for (const button of filters) {
  button.addEventListener('click', () => {
    if (Object.hasOwn(sections, location.hash.slice(1))) history.replaceState(null, '', '#acervo')
    selectFilter(button.dataset.filter)
  })
}
for (const link of document.querySelectorAll('nav [data-filter]')) {
  link.addEventListener('click', () => {
    if (location.hash === link.hash) syncFromHash()
  })
}
window.addEventListener('hashchange', syncFromHash)
search.addEventListener('input', render)

function showExhibit(index) {
  const item = visibleExhibits[index]
  if (!item) return
  activeIndex = index
  detail.querySelector('video')?.pause()
  detail.innerHTML = `
    <div class="meta">${sections[item.section]}${item.period ? ` · ${item.period}` : ''}</div>
    <h2 id="ficha-titulo" tabindex="-1">${item.title}</h2>
    ${item.video
      ? `<video controls playsinline preload="none" poster="assets/${item.image}.webp" aria-label="Vídeo de ${item.title}">
          <source src="assets/${item.video}.mp4" type="video/mp4">
        </video>`
      : `<img src="assets/${item.image}.webp" alt="">`}
    <p>${item.description}</p>
    ${item.source ? `<p><a href="${item.source[1]}">${item.source[0]}</a></p>` : ''}`
  previous.disabled = index === 0
  next.disabled = index === visibleExhibits.length - 1
  if (!dialog.open) dialog.showModal()
  dialog.scrollTop = 0
  detail.querySelector('h2').focus({ preventScroll: true })
}

grid.addEventListener('click', event => {
  const card = event.target.closest('[data-id]')
  if (!card) return
  opener = card
  showExhibit(visibleExhibits.findIndex(item => item.id === card.dataset.id))
})
previous.addEventListener('click', () => showExhibit(activeIndex - 1))
next.addEventListener('click', () => showExhibit(activeIndex + 1))
dialog.addEventListener('close', () => {
  detail.querySelector('video')?.pause()
  detail.replaceChildren()
  opener?.focus()
})

render()
syncFromHash()
