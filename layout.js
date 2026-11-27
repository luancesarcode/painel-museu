import { timeline } from './historia.js'
// Geometria das telas, medida sobre os slides originais (palco de 1920 x 1080).

const cols = (xs, w) => xs.map(x => ({ x, w }))
const grid = (xs1, xs2, y1, y2, w = 297, h = 297 + 40) => [
  ...xs1.map(x => ({ x, y: y1, w, h })),
  ...xs2.map(x => ({ x, y: y2, w, h })),
]

const colsA = [127, 473, 820, 1166, 1512]

export const themes = {
  historia: { name: 'História da Radioatividade', label: 'HISTÓRIA DA RADIOATIVIDADE', bg: 'deck/historia.webp', icon: 'deck/ico-rad.webp', tone: 'gold' },
  curiosidades: { name: 'Curiosidades Históricas', label: 'CURIOSIDADES HISTÓRICAS', bg: 'deck/bg-verde.webp', icon: 'deck/ico-pergaminho.webp', tone: 'green' },
  aplicacoes: { name: 'Aplicações Modernas da Radiação', label: 'APLICAÇÕES MODERNAS DA RADIAÇÃO', bg: 'deck/bg-azul.webp', icon: 'deck/ico-atomo.webp', tone: 'blue' },
}

// Cada página de grade é uma imagem de fundo com as miniaturas já desenhadas;
// "tiles" são as áreas de toque, na mesma ordem das miniaturas.
export const pages = {
  // A História tem uma página para cada 10 eventos da linha do tempo (montadas abaixo).
  cur1: {
    theme: 'curiosidades', bg: 'deck/curiosidades1.webp', next: 'cur2',
    tiles: grid(colsA, colsA, 175, 580),
    items: ['trem', 'raio-x-beleza', 'fluoroscopio', 'pintoras', 'carro', 'brinquedos', 'joias', 'radithor', 'dentifricio', 'cosmetico'],
  },
  cur2: {
    theme: 'curiosidades', bg: 'deck/curiosidades2.webp', next: 'cur1',
    tiles: grid(colsA, colsA, 175, 580),
    items: ['parker', 'uralina', 'cadernos', 'simbolo', 'relogios', 'saque', 'oklo', 'atomik', 'experimentos', 'pararaios'],
  },
  apl1: {
    theme: 'aplicacoes', bg: 'deck/aplicacoes1.webp', next: 'apl2',
    tiles: grid(colsA, colsA, 175, 580),
    items: ['melhoramento', 'diagnostico', 'radioterapia', 'nuclear', 'esterilizacao', 'alimentos', 'pragas', 'aeroporto', 'cargas', 'fumaca'],
  },
  apl2: {
    theme: 'aplicacoes', bg: 'deck/aplicacoes2.webp', next: 'apl1',
    tiles: grid(colsA, colsA, 175, 580),
    items: ['energia', 'ambiente', 'industria', 'inspecao', 'gemas', 'qualidade', 'arqueologia', 'petroleo', 'insetos', 'protecao'],
  },
}

export const HISTORY_PER_PAGE = 10
export const historyPageIds = Array.from({ length: Math.ceil(timeline.length / HISTORY_PER_PAGE) }, (_, i) => (i === 0 ? 'historia' : `historia${i + 1}`))
historyPageIds.forEach((id, i) => {
  pages[id] = {
    theme: 'historia', bg: 'deck/historia.webp', custom: true,
    next: historyPageIds[(i + 1) % historyPageIds.length], prev: historyPageIds[(i - 1 + historyPageIds.length) % historyPageIds.length],
    index: i, total: historyPageIds.length,
    // O fundo foi limpo (sem os quadros pretos); as miniaturas são desenhadas em HTML, todas do mesmo tamanho.
    tiles: [
      ...[138, 482, 826, 1171, 1515].map(x => ({ x, y: 178, w: 297, h: 297 })),
      ...[145, 489, 834, 1178, 1522].map(x => ({ x, y: 585, w: 297, h: 297 })),
    ],
    items: timeline.slice(i * HISTORY_PER_PAGE, (i + 1) * HISTORY_PER_PAGE).map(event => event.id),
    back: { x: 1573, y: 990, w: 312, h: 50 },
  }
})

// Fichas que têm slide próprio no original: imagem do slide + vídeo vertical por cima.
export const slideDetails = {
  fluoroscopio: { bg: 'deck/det-fluoroscopio.webp', video: 'deck/fluoroscopio.mp4', box: { x: 112, y: 182, w: 321, h: 568 } },
  pintoras: { bg: 'deck/det-radium.webp', video: 'deck/radium.mp4', box: { x: 125, y: 180, w: 351, h: 626 } },
  melhoramento: { bg: 'deck/det-melhoramento.webp', video: 'deck/melhoramento.mp4', box: { x: 118, y: 176, w: 348, h: 580 } },
  energia: { bg: 'deck/det-energia.webp', video: 'deck/energia.mp4', box: { x: 125, y: 177, w: 344, h: 611 } },
}

export const arrow = { x: 1805, y: 30, w: 76, h: 76 }
export const menuButton = { x: 765, y: 985, w: 395, h: 90 }
