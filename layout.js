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

// Cada tema tem folhas de grade: uma imagem de fundo com as miniaturas já desenhadas, mais as áreas de
// toque ("tiles") na mesma ordem das miniaturas. As folhas de um tema ficam lado a lado numa faixa rolável.
const sheet = (bg, items) => ({ bg, tiles: grid(colsA, colsA, 175, 580, 297, 297 + 64), items })

// Legendas das miniaturas (refeitas em HTML, maiores que as do slide).
export const captions = {
  trem: 'Trem Atômico Quase Existiu', 'raio-x-beleza': 'O Raio X da Beleza', fluoroscopio: 'Fluoroscópio de Calçados', pintoras: 'Meninas do Radium', carro: 'Carro Atômico',
  brinquedos: 'Brinquedos Atômicos', joias: 'Joias Radioativas?', radithor: 'Bebidas Revigorantes', dentifricio: 'Creme Dental', cosmetico: 'Creme de Beleza',
  parker: 'O Sonho Atômico da Parker', uralina: 'Vidros de Uralina', cadernos: 'Cadernos de Marie Curie', simbolo: 'Aviso de Radiação Ionizante', relogios: 'Relógios com Tinta de Rádio',
  saque: 'Saquê de Fukushima', oklo: 'O Reator Natural de Oklo', atomik: 'A Vodca Atomik de Chernobil', experimentos: 'Experimentos Secretos com Plutônio', pararaios: 'Para-raios Radioativos',
  melhoramento: 'Melhoramento Genético de Plantas', diagnostico: 'Radiografia, Tomografia e PET Scan', radioterapia: 'Radioterapia', nuclear: 'Medicina Nuclear', esterilizacao: 'Esterilização de Materiais Médicos',
  alimentos: 'Irradiação de Alimentos', pragas: 'Controle de Insetos-Praga', aeroporto: 'Segurança Aeroportuária', cargas: 'Inspeção de Cargas e Contêineres', fumaca: 'Detectores de Fumaça',
  energia: 'Geração de Energia', ambiente: 'Monitoramento Ambiental', industria: 'Aplicação Industrial', inspecao: 'Inspeção Industrial', gemas: 'Colorização de Gemas',
  qualidade: 'Controle de Qualidade Industrial', arqueologia: 'Datação Arqueológica', petroleo: 'Exploração de Petróleo e Gás', insetos: 'Insetos Comestíveis: É Seguro?', protecao: 'Radioproteção',
}

export const pages = {
  cur1: {
    theme: 'curiosidades',
    sheets: [
      sheet('deck/curiosidades1.webp', ['trem', 'raio-x-beleza', 'fluoroscopio', 'pintoras', 'carro', 'brinquedos', 'joias', 'radithor', 'dentifricio', 'cosmetico']),
      sheet('deck/curiosidades2.webp', ['parker', 'uralina', 'cadernos', 'simbolo', 'relogios', 'saque', 'oklo', 'atomik', 'experimentos', 'pararaios']),
    ],
  },
  apl1: {
    theme: 'aplicacoes',
    sheets: [
      sheet('deck/aplicacoes1.webp', ['melhoramento', 'diagnostico', 'radioterapia', 'nuclear', 'esterilizacao', 'alimentos', 'pragas', 'aeroporto', 'cargas', 'fumaca']),
      sheet('deck/aplicacoes2.webp', ['energia', 'ambiente', 'industria', 'inspecao', 'gemas', 'qualidade', 'arqueologia', 'petroleo', 'insetos', 'protecao']),
    ],
  },
}

export const HISTORY_PER_PAGE = 10
// A História é uma única tela com uma faixa rolável (uma "página" de 10 eventos por vez).
pages.historia = {
  theme: 'historia', bg: 'deck/historia.webp', custom: true,
  strip: Array.from({ length: Math.ceil(timeline.length / HISTORY_PER_PAGE) }, (_, i) =>
    timeline.slice(i * HISTORY_PER_PAGE, (i + 1) * HISTORY_PER_PAGE).map(event => event.id)),
  // O fundo foi limpo (sem os quadros pretos); as miniaturas são desenhadas em HTML, todas do mesmo tamanho.
  tiles: [
    ...[138, 482, 826, 1171, 1515].map(x => ({ x, y: 178, w: 297, h: 297 })),
    ...[145, 489, 834, 1178, 1522].map(x => ({ x, y: 585, w: 297, h: 297 })),
  ],
  back: { x: 1573, y: 990, w: 312, h: 50 },
}

// Fichas que têm slide próprio no original: imagem do slide + vídeo vertical por cima.
export const slideDetails = {
  fluoroscopio: { bg: 'deck/det-fluoroscopio.webp', video: 'deck/fluoroscopio.mp4', box: { x: 112, y: 182, w: 321, h: 568 } },
  pintoras: { bg: 'deck/det-radium.webp', video: 'deck/radium.mp4', box: { x: 125, y: 180, w: 351, h: 626 } },
  melhoramento: { bg: 'deck/det-melhoramento.webp', video: 'deck/melhoramento.mp4', box: { x: 118, y: 176, w: 348, h: 580 } },
  energia: { bg: 'deck/det-energia.webp', video: 'deck/energia.mp4', box: { x: 125, y: 177, w: 344, h: 611 } },
}

export const arrow = { x: 1805, y: 30, w: 76, h: 76 }
export const menuButton = { x: 765, y: 985, w: 395, h: 90 }
