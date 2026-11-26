const orau = ['Museu da Radiação e Radioatividade (ORAU)', 'https://orau.org/health-physics-museum/collection/index.html']
const industria = ['Aplicações de radioisótopos (AIEA)', 'https://www-pub.iaea.org/MTCD/Publications/PDF/te_652_web.pdf']
const tecnologia = ['Aplicações da tecnologia de radiação (AIEA)', 'https://www-pub.iaea.org/MTCD/Publications/PDF/TE-1763_E_web.pdf']
const medicina = ['Radiação no trabalho (AIEA)', 'https://nucleus.iaea.org/sites/orpnet/resources/posters/SitePages/Home.aspx']
const agricultura = ['Técnicas nucleares na alimentação e agricultura (AIEA)', 'https://www.iaea.org/sites/default/files/19/02/boosting-food-security-with-nuclear-and-related-techniques.pdf']

export const sections = {
  todos: 'Todos',
  historia: 'História',
  curiosidades: 'Curiosidades',
  aplicacoes: 'Aplicações modernas',
}

const history = [
  ['raios-x', 'A descoberta dos raios X', 'Uma imagem do interior do corpo.', 'Em 1895, Wilhelm Conrad Röntgen identificou uma radiação capaz de atravessar tecidos e impressionar uma chapa fotográfica. A descoberta abriu caminho para a radiografia.', { image: 'medicina', period: '1895', source: ['Prêmio Nobel de Física de 1901', 'https://www.nobelprize.org/prizes/physics/1901/rontgen/facts/'] }],
  ['becquerel', 'A radioatividade natural', 'Uma descoberta feita com sais de urânio.', 'Em 1896, Henri Becquerel observou que sais de urânio impressionavam chapas fotográficas mesmo sem terem sido expostos à luz. A emissão vinha do próprio material.', { image: 'atomo', object: true, period: '1896', source: ['Prêmio Nobel de Física de 1903', 'https://www.nobelprize.org/prizes/physics/1903/becquerel/facts/'] }],
  ['marie-curie', 'Marie Curie e os novos elementos', 'A investigação que revelou o polônio e o rádio.', 'Marie e Pierre Curie identificaram o polônio e o rádio em 1898. Marie compartilhou o Nobel de Física em 1903 e recebeu o Nobel de Química em 1911.', { image: 'curie', object: true, period: '1898', source: ['Prêmio Nobel de Química de 1911', 'https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/facts/'] }],
]

const curiosities = [
  ['trem', 'Trem atômico', 'Uma locomotiva da era atômica.', 'O slide apresenta uma concepção artística de trem nuclear. A ideia fazia parte das propostas de aplicar a energia nuclear ao transporte.'],
  ['raio-x-beleza', 'O raio X da beleza', 'A imagem do esqueleto como espetáculo.', 'Enquanto a radiografia ganhava espaço na medicina, a novidade de enxergar através do corpo também atraía atenção em demonstrações públicas.'],
  ['fluoroscopio', 'Fluoroscópio de calçados', 'Sapatarias usavam raios X para mostrar os pés dentro dos sapatos.', 'Clientes e vendedores podiam observar a posição dos ossos dentro do calçado. O uso repetido preocupava especialistas, principalmente pela exposição de funcionários.', { video: 'pedoscopio', source: ['Fluoroscópio de calçados (ORAU)', 'https://www.orau.org/blog/museum/what-is-a-shoe-fitting-fluoroscope.html'] }],
  ['pintoras', 'As meninas do rádio', 'Pintoras de mostradores expostas à tinta radioativa.', 'Trabalhadoras que pintavam mostradores luminosos ingeriam traços de tinta ao afinar o pincel com os lábios. Os casos de adoecimento chamaram atenção para a proteção no trabalho.', { video: 'radium-girls', source: orau }],
  ['carro', 'Carro atômico', 'O Ford Nucleon levou a ideia até a maquete.', 'O Ford Nucleon, apresentado em 1958, foi um conceito de carro com propulsão nuclear. A maquete mostra como se imaginava o transporte na era atômica.', { source: ['Ford Nucleon (The Henry Ford)', 'https://www.thehenryford.org/collections/explore/artifact/403679'] }],
  ['brinquedos', 'Brinquedos atômicos', 'Um laboratório de física vendido como brinquedo.', 'O Gilbert U-238 Atomic Energy Lab reunia instrumentos e amostras para demonstrar fenômenos ligados à radioatividade.', { source: orau }],
  ['joias', 'Joias radioativas?', 'O acervo mostra esmaltes e peças antigas.', 'Algumas peças antigas empregavam compostos de urânio em esmaltes. A cor ou o estilo da peça, por si só, é insuficiente para identificar seu conteúdo.', { source: orau }],
  ['radithor', 'Bebidas “revigorantes”', 'Radithor foi vendido como tônico radioativo.', 'O produto era água que continha rádio e foi anunciado com promessas de saúde. É um exemplo histórico do uso comercial da radioatividade em supostos remédios.', { source: orau }],
  ['dentifricio', 'Creme dental radioativo', 'O Doramad usava a radioatividade na publicidade.', 'A embalagem e os anúncios do Doramad mostram como a ideia de radioatividade foi associada à higiene bucal.', { source: orau }],
  ['cosmetico', 'Creme de beleza Tho-Radia', 'O rádio também apareceu na publicidade de cosméticos.', 'No início do século XX, cosméticos da linha Tho-Radia foram promovidos com referências ao rádio e ao tório.', { source: orau }],
  ['parker', 'O sonho atômico da Parker', 'A estética atômica também chegou ao design.', 'A apresentação reúne canetas Parker e ilustrações que remetem à era atômica.'],
  ['uralina', 'Vidros de uralina', 'Peças de vidro que fluorescem sob luz ultravioleta.', 'Compostos de urânio podiam dar ao vidro um tom amarelo ou esverdeado. Sob luz ultravioleta, muitas dessas peças apresentam fluorescência verde.', { source: orau }],
  ['cadernos', 'Os cadernos de Marie Curie', 'Registros de pesquisas preservam vestígios do laboratório.', 'Os cadernos de laboratório são testemunhos materiais das pesquisas de Curie com substâncias radioativas. A contaminação de objetos de trabalho ajuda a explicar os cuidados na sua conservação.'],
  ['simbolo', 'Aviso de radiação ionizante', 'O símbolo internacional e o aviso suplementar.', 'O trifólio sinaliza a presença de radiação ionizante. A imagem também mostra o símbolo suplementar criado para alertar sobre fontes perigosas.'],
  ['relogios', 'Relógios com tinta de rádio', 'Mostradores legíveis no escuro.', 'A tinta luminosa combinava rádio com um material que emitia luz ao receber a energia da radiação. Ela foi usada em ponteiros, mostradores e instrumentos.', { source: ['Objetos radioluminescentes (ORAU)', 'https://www.orau.org/health-physics-museum/collection/radioluminescent/index.html'] }],
  ['saque', 'Saquê de Fukushima', 'A produção local no contexto da recuperação pós-acidente.', 'A apresentação traz o saquê como ponto de partida para discutir a retomada da produção e da atividade econômica na região de Fukushima.'],
  ['oklo', 'O reator natural de Oklo', 'A fissão nuclear ocorreu espontaneamente no atual Gabão.', 'Há cerca de dois bilhões de anos, depósitos de urânio em Oklo reuniram condições para sustentar reações de fissão naturais.'],
  ['atomik', 'A bebida Atomik', 'Um projeto ligado ao entorno de Chernobyl.', 'A apresentação usa a bebida Atomik para introduzir pesquisas e debates sobre a produção agrícola em regiões afetadas pelo acidente.'],
  ['experimentos', 'Experimentos com plutônio', 'Um episódio da história da ética em pesquisa.', 'Experimentos históricos com exposição humana a plutônio levantaram questões de consentimento e responsabilidade. O caso é apresentado pelo seu significado para a ética em pesquisa.'],
  ['pararaios', 'Para-raios radioativos', 'Coletores históricos continham fontes radioativas.', 'Alguns modelos antigos incorporavam uma fonte radioativa, com a expectativa de ionizar o ar junto ao captor. Esses objetos fazem parte da história da radioproteção.'],
]

const applications = [
  ['melhoramento', 'Melhoramento genético de plantas', 'Irradiação para gerar variação e apoiar a seleção agrícola.', 'A mutagênese induzida aumenta a variabilidade genética. Pesquisadores avaliam as plantas resultantes e selecionam características úteis para o cultivo.', { video: 'plantas', source: agricultura }],
  ['diagnostico', 'Radiografia, tomografia e PET', 'Imagens da estrutura e do funcionamento do corpo.', 'Radiografias e tomografias usam raios X. Já o PET detecta sinais associados a um radiofármaco e pode revelar processos metabólicos.', { source: medicina }],
  ['radioterapia', 'Radioterapia', 'Uso terapêutico da radiação ionizante.', 'No tratamento de tumores, as equipes planejam a distribuição da dose para alcançar a região de interesse e limitar a exposição de tecidos próximos.', { source: medicina }],
  ['nuclear', 'Medicina nuclear', 'Radiofármacos para diagnóstico e terapia.', 'Radiofármacos permitem observar processos do organismo e, em terapias específicas, levar radiação ao tecido-alvo.', { source: medicina }],
  ['esterilizacao', 'Esterilização de materiais médicos', 'Irradiação de dispositivos e materiais embalados.', 'Em instalações apropriadas, a radiação pode inativar microrganismos em materiais médicos compatíveis com o processo.', { source: tecnologia }],
  ['alimentos', 'Irradiação de alimentos', 'Uma técnica de conservação e controle de microrganismos.', 'Conforme o alimento e a finalidade, tratamentos controlados podem reduzir microrganismos ou auxiliar no controle de pragas.', { source: agricultura }],
  ['pragas', 'Controle de insetos-praga', 'A técnica do inseto estéril ajuda a reduzir populações.', 'Em programas de controle, insetos esterilizados por irradiação são liberados para reduzir a reprodução da população-alvo.', { source: agricultura }],
  ['aeroporto', 'Segurança aeroportuária', 'Raios X na inspeção de bagagens.', 'Os sistemas de inspeção produzem imagens que facilitam a avaliação do conteúdo das bagagens fechadas.'],
  ['cargas', 'Inspeção de cargas e contêineres', 'Imagens para examinar grandes volumes.', 'Sistemas de imagem por radiação permitem avaliar a distribuição de materiais em cargas antes de uma eventual inspeção física.'],
  ['fumaca', 'Detectores de fumaça', 'Um exemplo de aplicação doméstica.', 'Em detectores por ionização, uma pequena fonte radioativa mantém uma corrente elétrica no ar. A entrada de fumaça altera essa corrente e pode disparar o alarme.', { source: orau }],
  ['gemas', 'Colorização de gemas', 'Irradiação para alterar a cor de certas pedras.', 'A radiação pode modificar a forma como o cristal absorve a luz. Os controles aplicáveis dependem dos materiais e do processo empregado.', { source: tecnologia }],
  ['inspecao', 'Inspeção industrial', 'Radiografia de soldas e componentes.', 'Ensaios não destrutivos com raios X ou gama podem revelar descontinuidades internas em peças e soldas.', { source: industria }],
  ['energia', 'Geração de energia', 'Calor da fissão usado para produzir eletricidade.', 'Em usinas nucleares, o calor liberado pela fissão controlada é usado para produzir vapor. O vapor aciona uma turbina ligada a um gerador.', { video: 'energia' }],
  ['ambiente', 'Monitoramento ambiental', 'Medições em amostras e estações de monitoramento.', 'Equipes podem acompanhar os níveis de radiação e analisar amostras do ambiente ao longo do tempo para identificar variações.'],
  ['industria', 'Radioisótopos na indústria', 'Traçadores ajudam a investigar processos.', 'Radiotraçadores permitem acompanhar o deslocamento de materiais para investigar vazamentos, escoamento e outras etapas de um processo industrial.', { source: tecnologia }],
  ['qualidade', 'Controle de qualidade industrial', 'Medições durante a fabricação.', 'Medidores nucleares podem acompanhar características como nível, densidade ou espessura em linhas de produção.', { source: industria }],
  ['arqueologia', 'Datação arqueológica', 'Carbono-14 na análise de materiais orgânicos.', 'A quantidade de carbono-14 restante em uma amostra orgânica ajuda a estimar o tempo desde que o organismo deixou de trocar carbono com o ambiente.'],
  ['petroleo', 'Exploração de petróleo e gás', 'Medições em poços ajudam a caracterizar as rochas.', 'Instrumentos de perfilagem registram sinais ligados às propriedades das formações geológicas atravessadas pelo poço.', { source: industria }],
  ['insetos', 'Insetos comestíveis', 'A irradiação é uma das técnicas estudadas para alimentos.', 'O painel apresenta a segurança alimentar como assunto de pesquisa. A avaliação depende da espécie, da origem, do processamento e das condições de conservação.', { source: agricultura }],
  ['protecao', 'Radioproteção', 'Trabalhar com radiação exige controle da exposição.', 'Tempo de exposição, distância da fonte e blindagem são fatores considerados na proteção radiológica. As medidas adequadas dependem da fonte e da atividade.', { source: medicina }],
]

function entries(section, rows) {
  return rows.map(([id, title, summary, description, options]) => ({
    id, section, title, summary, description, image: id, ...options,
  }))
}

export const exhibits = [
  ...entries('historia', history),
  ...entries('curiosidades', curiosities),
  ...entries('aplicacoes', applications),
]
