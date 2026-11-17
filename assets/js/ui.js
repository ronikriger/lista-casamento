import { CONFIG } from './config.js';
import { CATEGORIAS, PRESENTES } from './presentes.js';
import { formatarBRL, parseReais } from './dinheiro.js';
import { gerarPayloadPix } from './pix.js';
import * as sacola from './sacola.js';
import { criarId, enviarConfirmacao } from './api.js';

const TEXTOS = {
  titulo: 'Lista de presentes · {noiva} & {noivo}',
  descricao: 'Escolha um presente para {noiva} e {noivo} e envie por PIX. Obrigado pelo carinho!',
  pular: 'Ir para o conteúdo',
  aviso: '⚠️ Configuração incompleta: preencha a chave PIX e os nomes em assets/js/config.js antes de divulgar o site.',
  nav: {
    inicio: 'Início',
    como: 'Como funciona',
    presentes: 'Presentes',
    recados: 'Recados',
    duvidas: 'Dúvidas',
    sacola: 'Sacola',
    menu: 'Menu',
    abrirMenu: 'Abrir menu',
    fecharMenu: 'Fechar menu',
    secoes: 'Seções',
  },
  hero: {
    kicker: 'Vamos nos casar!',
    ctaLista: 'Ver lista de presentes',
    ctaComo: 'Como funciona',
    faltam: 'Faltam {n} dias',
    falta: 'Falta 1 dia',
    hoje: 'É hoje! 💍',
    casados: 'Recém-casados! 💍',
    altFoto: 'Foto de {noiva} e {noivo}',
  },
  boasVindas: 'Sua presença é o nosso maior presente! Mas, se quiser nos mimar, preparamos esta lista com muito carinho. Escolha um ou mais presentes, faça um PIX com o valor e deixe um recado para a gente. O valor chega direto para nós, e vamos usar cada centavo para começar essa nova fase juntos.',
  grandeDia: {
    titulo: 'O grande dia',
    data: 'Data',
    horario: 'Horário',
    local: 'Local',
    mapa: 'Ver no mapa',
  },
  historia: 'Nossa história',
  como: {
    titulo: 'Como funciona',
    p1t: 'Escolha os presentes',
    p1: 'Navegue pela lista e coloque na sacola quantos presentes quiser.',
    p2t: 'Pague com PIX',
    p2: 'Na finalização, geramos um QR Code e um código PIX copia e cola com o valor total.',
    p3t: 'Confirme e deixe um recado',
    p3: 'Toque em “Já fiz o PIX”, escreva seu nome e mande uma mensagem para os noivos.',
    nota: 'Os presentes são simbólicos: o valor vai direto para os noivos, que vão usá-lo como preferirem. 💛',
  },
  lista: {
    titulo: 'Lista de presentes',
    subtitulo: '{n} ideias para presentear. Escolha com o coração.',
    favoritos: 'Os favoritos dos noivos',
    buscar: 'Buscar presente',
    buscarPh: 'Buscar presente…',
    todos: 'Todos',
    faixa: 'Faixa de preço',
    ordenar: 'Ordenar por',
    destaques: 'Destaques',
    menor: 'Menor preço',
    maior: 'Maior preço',
    nome: 'Nome (A–Z)',
    nPresentes: '{n} presentes',
    umPresente: '1 presente',
    vazio: 'Nenhum presente encontrado com esses filtros.',
    limpar: 'Limpar filtros',
    ouSurpresa: 'Ou dê um presente surpresa com o valor que quiser.',
    presentear: 'Presentear',
    naSacola: 'Na sacola ✓',
    indisponivel: 'Indisponível',
    restam: 'Restam {n}',
    cota: 'Cota',
    cotaDica: 'Pode ser presenteado várias vezes',
    presenteado: 'Já presenteado 💝',
    valor: 'Valor (R$)',
    valorPh: 'Ex.: 150,00',
    adicionar: 'Adicionar à sacola',
    erroValor: 'Digite um valor entre {min} e {max}.',
    faixas: [
      ['qualquer', 'Qualquer valor'],
      ['ate100', 'Até R$ 100'],
      ['100a300', 'R$ 100 a R$ 300'],
      ['300a1000', 'R$ 300 a R$ 1.000'],
      ['acima1000', 'Acima de R$ 1.000'],
    ],
  },
  toast: '“{nome}” foi para a sacola 🎁',
  verSacola: 'Ver sacola',
  anuncios: {
    qtd: 'Quantidade de “{nome}” atualizada para {n}.',
    removido: '“{nome}” foi removido da sacola.',
    copiado: 'Código copiado.',
    chaveCopiada: 'Chave copiada.',
  },
  sacola: {
    titulo: 'Sua sacola de presentes',
    vazia: 'Sua sacola está vazia.',
    convite: 'Que tal começar pelos favoritos dos noivos?',
    ver: 'Ver presentes',
    diminuir: 'Diminuir quantidade',
    aumentar: 'Aumentar quantidade',
    remover: 'Remover {nome}',
    removerBtn: 'Remover',
    fechar: 'Fechar sacola',
    total: 'Total',
    pix: 'Continuar para o PIX',
    continuar: 'Continuar escolhendo',
    barraUm: '🎁 1 presente · {total}',
    barra: '🎁 {n} presentes · {total}',
    badge: 'Sacola com {n} itens',
    conflito: 'Este presente acabou de ser escolhido por outra pessoa. Você pode mantê-lo ou removê-lo.',
    limite: 'A sacola chegou ao limite de 60 presentes de uma vez.',
  },
  checkout: {
    quase: 'Quase lá!',
    pague: 'Pague com PIX',
    obrigado: 'Muito obrigado, {primeiroNome}! 💛',
    resumo: 'Você está presenteando:',
    nome: 'Seu nome',
    ajudaNome: 'Pode ser o nome da família, ex.: Família Souza',
    erroNome: 'Conte pra gente quem está presenteando 😊',
    recado: 'Recado para os noivos (opcional)',
    recadoPh: 'Escreva uma mensagem carinhosa…',
    mural: 'Pode mostrar meu recado no mural do site',
    gerar: 'Gerar PIX',
    valor: 'Valor: {total}',
    para: 'Para: {nomeTitular}',
    qrLegenda: 'Abra o app do seu banco, escolha Pix › Ler QR Code e aponte a câmera.',
    qrAlt: 'QR Code do PIX',
    mostrarQr: 'Mostrar QR Code',
    ocultarQr: 'Ocultar QR Code',
    cola: 'Pix Copia e Cola',
    copiar: 'Copiar código',
    copiado: 'Código copiado! ✓',
    selecione: 'Selecione e copie o código acima.',
    instrucaoCola: 'No app do banco, escolha Pix › Pix Copia e Cola e cole o código. O valor já vem preenchido.',
    chavePergunta: 'Prefere usar a chave PIX?',
    chaveRotulo: 'Chave ({tipo}):',
    copiarChave: 'Copiar chave',
    chaveCopiada: 'Chave copiada! ✓',
    lembrete: 'Lembre-se de digitar o valor de {total}.',
    tipos: {
      aleatoria: 'Chave aleatória',
      email: 'E-mail',
      telefone: 'Celular',
      cpf: 'CPF',
      cnpj: 'CNPJ',
    },
    seguranca: '🔒 Antes de confirmar, verifique se o nome que aparece no seu banco é {nomeTitular}.',
    exterior: 'Está fora do Brasil?',
    jaFiz: 'Já fiz o PIX ✓',
    voltar: 'Voltar',
    registrando: 'Registrando seu presente…',
    felizes: 'Seu presente deixou {noiva} e {noivo} muito felizes. Mal podemos esperar para celebrar com você!',
    notaMural: 'Seu recado vai aparecer no mural em instantes.',
    notaFalha: 'Não conseguimos registrar sua confirmação agora, mas sem preocupação: o PIX chega normalmente para os noivos. Vamos tentar registrar de novo automaticamente.',
    outro: 'Dar outro presente',
    voltarSite: 'Voltar ao site',
    etapas: ['Seus dados', 'PIX', 'Pronto'],
    fechar: 'Fechar',
    pixNaoConfigurado: 'PIX ainda não configurado',
  },
  mural: {
    titulo: 'Recados para os noivos',
    subtitulo: 'Mensagens de quem já presenteou 💌',
    vazio: 'Os primeiros recados vão aparecer aqui. Que tal deixar o primeiro?',
    mais: 'Ver mais recados',
    agora: 'agora há pouco',
  },
  faq: {
    titulo: 'Dúvidas frequentes',
    itens: [
      ['Os presentes são entregues de verdade?', 'Não. Os presentes da lista são simbólicos: o valor vai direto para os noivos por PIX, e eles usam como preferirem na casa nova e na lua de mel.'],
      ['Posso dar mais de um presente?', 'Claro! Coloque quantos quiser na sacola e faça um único PIX com o valor total.'],
      ['Posso escolher outro valor?', 'Pode, sim! Use o “Presente surpresa” e digite o valor que preferir.'],
      ['Como os noivos vão saber que o presente foi meu?', 'Depois de fazer o PIX, toque em “Já fiz o PIX” e informe seu nome. Os noivos recebem a confirmação com os presentes escolhidos e o seu recado.'],
      ['Fiz o PIX, mas não toquei em “Já fiz o PIX”. E agora?', 'Sem problema, o PIX chegou normalmente! Se quiser deixar seu recado, monte a sacola de novo e, na etapa do PIX, toque direto em “Já fiz o PIX”. Não precisa pagar outra vez.'],
      ['É seguro?', 'Sim. O pagamento é feito no app do seu próprio banco. Antes de confirmar, verifique se o nome do recebedor é {nomeTitular}.'],
      ['Posso parcelar?', 'Pelo site o pagamento é por PIX, à vista. Alguns bancos oferecem a opção “Pix Parcelado” no próprio app, então vale conferir no seu!'],
    ],
    fora: 'Moro fora do Brasil. Como posso presentear?',
  },
  footer: '{noiva} & {noivo} · {ano}',
  semJs: 'Esta lista precisa de JavaScript para funcionar.',
};

const CHAVE_NOME = 'lista-casamento:nome:v1';
const PRECOS = new Set(['qualquer', 'ate100', '100a300', '300a1000', 'acima1000']);
const ORDENS = new Set(['destaques', 'preco-asc', 'preco-desc', 'nome']);
const CATS = new Set(['todos', ...CATEGORIAS.map((cat) => cat.id)]);

const porId = new Map(PRESENTES.map((item) => [item.id, item]));
const porCategoria = new Map(CATEGORIAS.map((cat) => [cat.id, cat]));
const ordemCatalogo = new Map(PRESENTES.map((item, indice) => [item.id, indice]));
const catalogo = PRESENTES.filter((item) => item.id !== 'presente-surpresa');

let filtros = { cat: 'todos', q: '', preco: 'qualquer', ordem: 'destaques' };
let contagem = {};
let muralDados = [];
let muralLimite = 12;
let passo = 1;
let enviando = false;
let idConfirmacao = null;
let falhouRegistro = false;
let optouMural = false;
let primeiroNome = '';
let quemAbriuSacola = null;
let quemAbriuCheckout = null;
let scrollTravado = false;
let scrollY = 0;
let buscaTimer = 0;

function preencher(modelo, vars = {}) {
  return String(modelo).replace(/\{(\w+)\}/g, (_, chave) => vars[chave] ?? '');
}

function caminho(obj, rota) {
  return rota.split('.').reduce((acc, chave) => acc?.[chave], obj);
}

function pendente(valor) {
  if (typeof valor !== 'string' || !valor) return false;
  if (valor === 'AAAA-MM-DD') return true;
  if (/^[A-Z0-9]+(?:_[A-Z0-9]+)+$/.test(valor)) return true;
  return valor.includes('USUARIO') || valor.includes('REPOSITORIO');
}

function pixConfigurado() {
  const pix = CONFIG.pix || {};
  return Boolean(pix.chave && pix.nomeTitular && pix.cidadeTitular)
    && !pendente(pix.chave)
    && !pendente(pix.nomeTitular)
    && !pendente(pix.cidadeTitular);
}

function muralLigado() {
  return Boolean(CONFIG.muralAtivo && CONFIG.appsScriptUrl);
}

function movimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function semAcento(texto) {
  return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function anunciar(mensagem) {
  const vivo = document.getElementById('anuncios');
  vivo.textContent = '';
  window.setTimeout(() => {
    vivo.textContent = mensagem;
  }, 30);
}

function mostrarToast(mensagem, rotulo, acao) {
  const caixa = document.createElement('div');
  caixa.className = 'toast';
  const texto = document.createElement('p');
  texto.textContent = mensagem;
  caixa.append(texto);
  if (rotulo && acao) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = rotulo;
    botao.addEventListener('click', () => {
      caixa.remove();
      acao();
    });
    caixa.append(botao);
  }
  document.getElementById('toasts').append(caixa);
  window.setTimeout(() => caixa.remove(), 4500);
}

function dataLocal(iso) {
  if (pendente(iso)) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!match) return null;
  const ano = Number(match[1]);
  const mes = Number(match[2]);
  const dia = Number(match[3]);
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return null;
  return data;
}

function urlHttp(url) {
  try {
    const absoluta = new URL(url, location.href);
    if (absoluta.protocol !== 'http:' && absoluta.protocol !== 'https:') return '';
    return absoluta.href;
  } catch {
    return '';
  }
}

function lerNome() {
  try {
    return localStorage.getItem(CHAVE_NOME) || '';
  } catch {
    return '';
  }
}

function gravarNome(nome) {
  try {
    localStorage.setItem(CHAVE_NOME, nome);
  } catch {
    /* memória */
  }
}

function aplicarTextos() {
  document.querySelectorAll('[data-t]').forEach((el) => {
    const valor = caminho(TEXTOS, el.dataset.t);
    if (typeof valor === 'string') el.textContent = valor;
  });
  document.querySelectorAll('[data-ph]').forEach((el) => {
    const valor = caminho(TEXTOS, el.dataset.ph);
    if (typeof valor === 'string') el.setAttribute('placeholder', valor);
  });
}

function paragrafos(el, texto) {
  el.replaceChildren();
  String(texto).split(/\n\s*\n/).map((parte) => parte.trim()).filter(Boolean).forEach((parte) => {
    const p = document.createElement('p');
    p.textContent = parte;
    el.append(p);
  });
}

function comLinks(el, texto) {
  el.replaceChildren();
  const re = /https?:\/\/[^\s]+/g;
  let ultimo = 0;
  let match = re.exec(texto);
  while (match) {
    el.append(document.createTextNode(texto.slice(ultimo, match.index)));
    const bruto = match[0];
    const limpo = bruto.replace(/[),.;]+$/, '');
    const href = urlHttp(limpo);
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = limpo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      el.append(a);
      if (bruto.length !== limpo.length) el.append(document.createTextNode(bruto.slice(limpo.length)));
    } else {
      el.append(document.createTextNode(bruto));
    }
    ultimo = match.index + bruto.length;
    match = re.exec(texto);
  }
  el.append(document.createTextNode(texto.slice(ultimo)));
}

function inicial(nome) {
  const match = String(nome).match(/\p{L}/u);
  return match ? match[0].toLocaleUpperCase('pt-BR') : '·';
}

function aplicarIdentidade() {
  document.title = preencher(TEXTOS.titulo, { noiva: CONFIG.noiva, noivo: CONFIG.noivo });
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', preencher(TEXTOS.descricao, { noiva: CONFIG.noiva, noivo: CONFIG.noivo }));

  document.getElementById('nome-noiva').textContent = CONFIG.noiva;
  document.getElementById('nome-noivo').textContent = CONFIG.noivo;
  document.getElementById('inicial-noiva').textContent = inicial(CONFIG.noiva);
  document.getElementById('inicial-noivo').textContent = inicial(CONFIG.noivo);
  document.getElementById('marca-a').textContent = inicial(CONFIG.noiva);
  document.getElementById('marca-b').textContent = inicial(CONFIG.noivo);

  const data = dataLocal(CONFIG.dataCasamento);
  const dataEl = document.getElementById('data-casamento');
  const contaEl = document.getElementById('contagem-regressiva');
  if (!data) {
    dataEl.hidden = true;
    contaEl.hidden = true;
  } else {
    dataEl.hidden = false;
    contaEl.hidden = false;
    dataEl.textContent = new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(data);
    const hoje = new Date();
    const a = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const b = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const dias = Math.round((b.getTime() - a.getTime()) / 86400000);
    if (dias > 1) contaEl.textContent = preencher(TEXTOS.hero.faltam, { n: String(dias) });
    else if (dias === 1) contaEl.textContent = TEXTOS.hero.falta;
    else if (dias === 0) contaEl.textContent = TEXTOS.hero.hoje;
    else contaEl.textContent = TEXTOS.hero.casados;
  }

  const boas = CONFIG.mensagemBoasVindas.trim() || TEXTOS.boasVindas;
  paragrafos(document.getElementById('texto-boas-vindas'), boas);

  const grande = document.getElementById('grande-dia');
  const temEvento = Boolean(CONFIG.localNome.trim() || CONFIG.horario.trim());
  grande.hidden = !temEvento;
  if (temEvento) montarEvento(data);

  const historia = document.getElementById('historia');
  const textoHistoria = CONFIG.historia.trim();
  historia.hidden = !textoHistoria;
  if (textoHistoria) paragrafos(document.getElementById('texto-historia'), CONFIG.historia);

  const srcBruto = CONFIG.fotoCasal.trim();
  if (srcBruto && !/^\s*javascript:/i.test(srcBruto)) {
    const src = /^https?:/i.test(srcBruto) ? urlHttp(srcBruto) : srcBruto;
    if (src) {
      const foto = document.createElement('img');
      foto.className = 'foto-casal';
      foto.alt = preencher(TEXTOS.hero.altFoto, { noiva: CONFIG.noiva, noivo: CONFIG.noivo });
      foto.addEventListener('error', () => {
        foto.remove();
        document.getElementById('monograma').hidden = false;
      });
      document.getElementById('monograma').hidden = true;
      document.querySelector('.hero-visual').append(foto);
      foto.src = src;
    }
  }

  const recados = document.getElementById('recados');
  recados.hidden = !muralLigado();
  document.querySelector('[href="#recados"]').hidden = !muralLigado();
  document.getElementById('bloco-mural').hidden = !muralLigado();

  const incompleto = [
    CONFIG.noiva, CONFIG.noivo, CONFIG.dataCasamento, CONFIG.siteUrl,
    CONFIG.pix?.chave, CONFIG.pix?.nomeTitular, CONFIG.pix?.cidadeTitular,
  ].some(pendente);
  document.getElementById('aviso-dev').hidden = !incompleto;

  const rodape = document.getElementById('rodape-casal');
  if (data) {
    rodape.textContent = preencher(TEXTOS.footer, {
      noiva: CONFIG.noiva,
      noivo: CONFIG.noivo,
      ano: String(data.getFullYear()),
    });
  } else {
    rodape.textContent = `${CONFIG.noiva} & ${CONFIG.noivo}`;
  }
  const credito = document.getElementById('rodape-credito');
  if (CONFIG.credito.trim()) {
    credito.hidden = false;
    credito.textContent = CONFIG.credito.trim();
  }

  document.getElementById('subtitulo-lista').textContent = preencher(TEXTOS.lista.subtitulo, {
    n: String(catalogo.length),
  });
  document.getElementById('fechar-sacola').setAttribute('aria-label', TEXTOS.sacola.fechar);
  document.getElementById('fechar-checkout').setAttribute('aria-label', TEXTOS.checkout.fechar);
}

function montarEvento(data) {
  const dl = document.getElementById('dados-evento');
  dl.replaceChildren();
  const linhas = [];
  if (data) {
    linhas.push([TEXTOS.grandeDia.data, new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(data)]);
  }
  if (CONFIG.horario.trim()) linhas.push([TEXTOS.grandeDia.horario, CONFIG.horario.trim()]);
  const local = [CONFIG.localNome.trim(), CONFIG.localEndereco.trim()].filter(Boolean).join('\n');
  if (local) linhas.push([TEXTOS.grandeDia.local, local]);
  linhas.forEach(([rotulo, valor]) => {
    const dt = document.createElement('dt');
    dt.textContent = rotulo;
    const dd = document.createElement('dd');
    dd.textContent = valor;
    dl.append(dt, dd);
  });
  const mapa = urlHttp(CONFIG.localMapaUrl.trim());
  if (mapa) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = mapa;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = TEXTOS.grandeDia.mapa;
    p.append(a);
    dl.after(p);
  }
}

function alternarFundos() {
  const secoes = [...document.querySelectorAll('main > section')].filter((secao) => !secao.hidden);
  secoes.forEach((secao, indice) => {
    secao.classList.toggle('secao-blush', indice % 2 === 1);
  });
}

function medirHeader() {
  const topo = document.querySelector('.topo');
  document.documentElement.style.setProperty('--header-h', `${topo.offsetHeight}px`);
}

function estadoDo(presente) {
  const claimed = contagem[presente.id] || 0;
  const naSacola = sacola.qtdDoPresente(presente.id);
  if (presente.qtd == null) {
    return { badge: 'cota', esgotado: false, naSacola: naSacola > 0, podeMais: naSacola < 20, restante: null };
  }
  const restante = presente.qtd - claimed - naSacola;
  if (claimed >= presente.qtd) {
    return { badge: 'presenteado', esgotado: true, naSacola: naSacola > 0, podeMais: false, restante: 0 };
  }
  if (naSacola > 0 && restante <= 0) {
    return { badge: null, esgotado: false, naSacola: true, podeMais: false, restante: 0 };
  }
  if (presente.qtd > 1 && restante > 0) {
    return { badge: 'restam', esgotado: false, naSacola: naSacola > 0, podeMais: true, restante };
  }
  return { badge: null, esgotado: false, naSacola: false, podeMais: restante > 0, restante };
}

function cabeNaSacola(presente) {
  const linhas = sacola.obterSacola().linhas;
  if (presente.id !== 'presente-surpresa' && linhas.some((linha) => linha.presenteId === presente.id)) return true;
  return linhas.length < 60;
}

function criarCard(presente) {
  const cat = porCategoria.get(presente.categoria);
  const estado = estadoDo(presente);
  const card = document.createElement('article');
  card.className = estado.esgotado ? 'card esgotado' : 'card';

  const emoji = document.createElement('div');
  emoji.className = 'emoji';
  emoji.setAttribute('aria-hidden', 'true');
  if (cat?.tint) emoji.style.background = cat.tint;
  emoji.textContent = presente.emoji;

  const nome = document.createElement('h3');
  nome.className = 'card-nome';
  nome.textContent = presente.nome;

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = presente.descricao;

  const preco = document.createElement('p');
  preco.className = 'preco';
  preco.textContent = formatarBRL(presente.precoCentavos);

  const badge = document.createElement('p');
  badge.className = 'badge';
  if (estado.badge === 'cota') {
    badge.textContent = TEXTOS.lista.cota;
    badge.title = TEXTOS.lista.cotaDica;
  } else if (estado.badge === 'restam') {
    badge.textContent = preencher(TEXTOS.lista.restam, { n: String(estado.restante) });
  } else if (estado.badge === 'presenteado') {
    badge.textContent = TEXTOS.lista.presenteado;
  }

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.dataset.id = presente.id;
  if (estado.esgotado || !estado.podeMais) {
    botao.className = 'btn btn-secundario';
    if (estado.esgotado || !estado.naSacola) {
      botao.disabled = true;
      botao.textContent = TEXTOS.lista.indisponivel;
      botao.setAttribute('aria-label', `${TEXTOS.lista.indisponivel}: ${presente.nome}`);
    } else {
      botao.textContent = TEXTOS.lista.naSacola;
      botao.setAttribute('aria-label', `${TEXTOS.lista.naSacola}: ${presente.nome}`);
    }
  } else {
    botao.className = 'btn btn-primario';
    botao.textContent = TEXTOS.lista.presentear;
    botao.setAttribute('aria-label', `${TEXTOS.lista.presentear} ${presente.nome}`);
  }
  botao.addEventListener('click', () => presentear(presente, botao));
  card.append(emoji, nome, desc, preco, badge, botao);
  return card;
}

function presentear(presente, origem) {
  const estado = estadoDo(presente);
  if (estado.esgotado || !estado.podeMais) {
    if (estado.naSacola) abrirSacola(origem);
    return;
  }
  if (!cabeNaSacola(presente)) {
    mostrarToast(TEXTOS.sacola.limite);
    return;
  }
  if (!sacola.adicionarItem(presente, presente.precoCentavos)) return;
  mostrarToast(preencher(TEXTOS.toast, { nome: presente.nome }), TEXTOS.verSacola, () => {
    abrirSacola(document.getElementById('btn-sacola'));
  });
}

function criarSurpresa() {
  const presente = porId.get('presente-surpresa');
  const card = document.createElement('article');
  card.className = 'card card-surpresa';
  const emoji = document.createElement('div');
  emoji.className = 'emoji';
  emoji.setAttribute('aria-hidden', 'true');
  emoji.style.background = '#F4E7E1';
  emoji.textContent = presente.emoji;
  const nome = document.createElement('h3');
  nome.className = 'card-nome';
  nome.textContent = presente.nome;
  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = presente.descricao;
  const label = document.createElement('label');
  label.htmlFor = 'valor-surpresa';
  label.textContent = TEXTOS.lista.valor;
  const input = document.createElement('input');
  input.id = 'valor-surpresa';
  input.inputMode = 'decimal';
  input.placeholder = TEXTOS.lista.valorPh;
  input.autocomplete = 'off';
  input.setAttribute('aria-describedby', 'erro-surpresa');
  const erro = document.createElement('p');
  erro.id = 'erro-surpresa';
  erro.className = 'erro';
  erro.hidden = true;
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'btn btn-primario';
  botao.textContent = TEXTOS.lista.adicionar;
  botao.addEventListener('click', () => {
    const min = Math.round(Number(CONFIG.valorLivre.minimo) * 100);
    const max = Math.round(Number(CONFIG.valorLivre.maximo) * 100);
    const centavos = parseReais(input.value);
    if (centavos == null || centavos < min || centavos > max) {
      erro.hidden = false;
      erro.textContent = preencher(TEXTOS.lista.erroValor, { min: formatarBRL(min), max: formatarBRL(max) });
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    if (!cabeNaSacola(presente)) {
      mostrarToast(TEXTOS.sacola.limite);
      return;
    }
    erro.hidden = true;
    input.removeAttribute('aria-invalid');
    sacola.adicionarItem(presente, centavos);
    input.value = '';
    mostrarToast(preencher(TEXTOS.toast, { nome: presente.nome }), TEXTOS.verSacola, () => {
      abrirSacola(document.getElementById('btn-sacola'));
    });
  });
  card.append(emoji, nome, desc, label, input, erro, botao);
  return card;
}

function naFaixa(centavos, faixa) {
  if (faixa === 'ate100') return centavos <= 10000;
  if (faixa === '100a300') return centavos > 10000 && centavos <= 30000;
  if (faixa === '300a1000') return centavos > 30000 && centavos <= 100000;
  if (faixa === 'acima1000') return centavos > 100000;
  return true;
}

function filtrar() {
  const q = semAcento(filtros.q.trim());
  return catalogo.filter((item) => {
    if (filtros.cat !== 'todos' && item.categoria !== filtros.cat) return false;
    if (!naFaixa(item.precoCentavos, filtros.preco)) return false;
    if (!q) return true;
    const cat = porCategoria.get(item.categoria);
    const alvo = semAcento(`${item.nome} ${item.descricao} ${cat ? cat.nome : ''}`);
    return alvo.includes(q);
  });
}

function ordenar(lista) {
  const copia = [...lista];
  const indice = (item) => ordemCatalogo.get(item.id) ?? 0;
  if (filtros.ordem === 'preco-asc') copia.sort((a, b) => a.precoCentavos - b.precoCentavos || indice(a) - indice(b));
  else if (filtros.ordem === 'preco-desc') copia.sort((a, b) => b.precoCentavos - a.precoCentavos || indice(a) - indice(b));
  else if (filtros.ordem === 'nome') copia.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  else copia.sort((a, b) => Number(b.destaque) - Number(a.destaque) || indice(a) - indice(b));
  return copia;
}

function renderDestaques() {
  const faixa = document.getElementById('destaques');
  const ativo = document.activeElement;
  const idFoco = ativo && faixa.contains(ativo) ? ativo.dataset.id : '';
  faixa.replaceChildren();
  catalogo.filter((item) => item.destaque).forEach((item) => faixa.append(criarCard(item)));
  if (idFoco) faixa.querySelector(`button[data-id="${CSS.escape(idFoco)}"]`)?.focus();
}

function renderGrade() {
  const grade = document.getElementById('grade');
  const ativo = document.activeElement;
  const idFoco = ativo?.dataset?.id || '';
  const dentro = Boolean(ativo && grade.contains(ativo));
  const focoSurpresa = ativo?.id === 'valor-surpresa';
  const valorSurpresa = document.getElementById('valor-surpresa')?.value || '';
  grade.replaceChildren();
  const mostrarSurpresa = filtros.cat === 'todos' && filtros.q.trim() === '';
  if (mostrarSurpresa) {
    grade.append(criarSurpresa());
    const campo = document.getElementById('valor-surpresa');
    if (valorSurpresa && campo) campo.value = valorSurpresa;
  }
  const visiveis = ordenar(filtrar());
  visiveis.forEach((item) => grade.append(criarCard(item)));
  const contagemEl = document.getElementById('contagem-resultados');
  contagemEl.textContent = visiveis.length === 1
    ? TEXTOS.lista.umPresente
    : preencher(TEXTOS.lista.nPresentes, { n: String(visiveis.length) });
  document.getElementById('vazio').hidden = visiveis.length !== 0;
  if (focoSurpresa) document.getElementById('valor-surpresa')?.focus();
  else if (dentro && idFoco) grade.querySelector(`button[data-id="${CSS.escape(idFoco)}"]`)?.focus();
}

function atualizarChips() {
  document.querySelectorAll('#chips-cat [data-cat]').forEach((botao) => {
    botao.setAttribute('aria-pressed', String(botao.dataset.cat === filtros.cat));
  });
  document.querySelectorAll('#chips-preco [data-preco]').forEach((botao) => {
    botao.setAttribute('aria-pressed', String(botao.dataset.preco === filtros.preco));
  });
}

function escreverHash() {
  const params = new URLSearchParams();
  if (filtros.cat !== 'todos') params.set('cat', filtros.cat);
  if (filtros.q) params.set('q', filtros.q);
  if (filtros.preco !== 'qualquer') params.set('preco', filtros.preco);
  if (filtros.ordem !== 'destaques') params.set('ordem', filtros.ordem);
  const qs = params.toString();
  const proximo = `#presentes${qs ? `?${qs}` : ''}`;
  if (location.hash !== proximo) history.replaceState(null, '', proximo);
}

function lerFiltrosHash() {
  const bruto = location.hash.replace(/^#/, '');
  const i = bruto.indexOf('?');
  if (i === -1 || bruto.slice(0, i) !== 'presentes') return null;
  const params = new URLSearchParams(bruto.slice(i + 1));
  const cat = params.get('cat') || 'todos';
  const preco = params.get('preco') || 'qualquer';
  const ordem = params.get('ordem') || 'destaques';
  return {
    cat: CATS.has(cat) ? cat : 'todos',
    q: params.get('q') || '',
    preco: PRECOS.has(preco) ? preco : 'qualquer',
    ordem: ORDENS.has(ordem) ? ordem : 'destaques',
  };
}

function montarFiltros() {
  const lidos = lerFiltrosHash();
  if (lidos) filtros = lidos;
  const cats = document.getElementById('chips-cat');
  cats.setAttribute('aria-label', 'Categorias');
  const todos = document.createElement('button');
  todos.type = 'button';
  todos.className = 'chip';
  todos.dataset.cat = 'todos';
  todos.textContent = TEXTOS.lista.todos;
  todos.addEventListener('click', () => escolherCat('todos'));
  cats.append(todos);
  CATEGORIAS.forEach((cat) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'chip';
    botao.dataset.cat = cat.id;
    const icone = document.createElement('span');
    icone.setAttribute('aria-hidden', 'true');
    icone.textContent = `${cat.emoji} `;
    botao.append(icone, document.createTextNode(cat.nome));
    botao.addEventListener('click', () => escolherCat(cat.id));
    cats.append(botao);
  });
  const precos = document.getElementById('chips-preco');
  TEXTOS.lista.faixas.forEach(([id, rotulo]) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'chip';
    botao.dataset.preco = id;
    botao.textContent = rotulo;
    botao.addEventListener('click', () => {
      filtros.preco = id;
      atualizarChips();
      renderGrade();
      escreverHash();
    });
    precos.append(botao);
  });
  const select = document.getElementById('ordenar');
  [
    ['destaques', TEXTOS.lista.destaques],
    ['preco-asc', TEXTOS.lista.menor],
    ['preco-desc', TEXTOS.lista.maior],
    ['nome', TEXTOS.lista.nome],
  ].forEach(([valor, rotulo]) => {
    const op = document.createElement('option');
    op.value = valor;
    op.textContent = rotulo;
    select.append(op);
  });
  select.value = filtros.ordem;
  document.getElementById('busca').value = filtros.q;
  atualizarChips();
}

function escolherCat(cat) {
  filtros.cat = cat;
  atualizarChips();
  renderGrade();
  escreverHash();
}

function maximoLinha(linha, presente) {
  if (presente.id === 'presente-surpresa') return 1;
  if (presente.qtd == null) return 20;
  const claimed = contagem[presente.id] || 0;
  const outras = sacola.qtdDoPresente(presente.id) - linha.qtd;
  return presente.qtd - claimed - outras;
}

function criarLinha(linha) {
  const presente = porId.get(linha.presenteId);
  const li = document.createElement('li');
  li.className = 'linha';
  const emoji = document.createElement('span');
  emoji.className = 'linha-emoji';
  emoji.setAttribute('aria-hidden', 'true');
  emoji.textContent = presente?.emoji || '🎁';
  const meio = document.createElement('div');
  const nome = document.createElement('p');
  nome.className = 'linha-nome';
  nome.textContent = presente?.nome || linha.presenteId;
  const unit = document.createElement('p');
  unit.className = 'linha-unit';
  unit.textContent = formatarBRL(linha.valorUnitarioCentavos);
  meio.append(nome, unit);
  const claimed = contagem[linha.presenteId] || 0;
  const conflito = presente && presente.qtd != null && claimed > 0 && claimed + linha.qtd > presente.qtd;
  if (conflito) {
    const nota = document.createElement('p');
    nota.className = 'nota';
    nota.textContent = TEXTOS.sacola.conflito;
    meio.append(nota);
  }
  const qtdBox = document.createElement('div');
  qtdBox.className = 'qtd';
  const semPasso = !presente || presente.id === 'presente-surpresa' || presente.qtd === 1;
  if (semPasso) {
    const fixo = document.createElement('span');
    fixo.textContent = `${linha.qtd}×`;
    qtdBox.append(fixo);
  } else {
    const max = maximoLinha(linha, presente);
    const menos = document.createElement('button');
    menos.type = 'button';
    menos.dataset.linha = linha.linhaId;
    menos.dataset.acao = 'menos';
    menos.setAttribute('aria-label', TEXTOS.sacola.diminuir);
    menos.textContent = '−';
    menos.disabled = linha.qtd <= 1;
    const valor = document.createElement('span');
    valor.textContent = String(linha.qtd);
    const mais = document.createElement('button');
    mais.type = 'button';
    mais.dataset.linha = linha.linhaId;
    mais.dataset.acao = 'mais';
    mais.setAttribute('aria-label', TEXTOS.sacola.aumentar);
    mais.textContent = '+';
    mais.disabled = linha.qtd >= max;
    menos.addEventListener('click', () => mudarQtd(linha, presente, -1));
    mais.addEventListener('click', () => mudarQtd(linha, presente, 1));
    qtdBox.append(menos, valor, mais);
  }
  const sub = document.createElement('p');
  sub.className = 'linha-sub';
  sub.textContent = formatarBRL(linha.qtd * linha.valorUnitarioCentavos);
  const remover = document.createElement('button');
  remover.type = 'button';
  remover.className = 'btn-texto';
  remover.dataset.linha = linha.linhaId;
  remover.dataset.acao = 'remover';
  remover.textContent = TEXTOS.sacola.removerBtn;
  remover.setAttribute('aria-label', preencher(TEXTOS.sacola.remover, { nome: presente?.nome || '' }));
  remover.addEventListener('click', () => {
    sacola.removerLinha(linha.linhaId);
    anunciar(preencher(TEXTOS.anuncios.removido, { nome: presente?.nome || '' }));
  });
  li.append(emoji, meio, qtdBox, sub, remover);
  return li;
}

function mudarQtd(linha, presente, delta) {
  const antes = linha.qtd;
  const max = maximoLinha(linha, presente);
  const nova = sacola.alterarQtd(linha.linhaId, delta, max);
  if (nova != null && nova !== antes) {
    anunciar(preencher(TEXTOS.anuncios.qtd, { nome: presente.nome, n: String(nova) }));
  }
}

function renderSacola() {
  const corpo = document.getElementById('sacola-corpo');
  const rodape = document.getElementById('sacola-rodape');
  const painel = document.getElementById('sacola');
  const ativo = document.activeElement;
  const dentro = Boolean(ativo && painel.contains(ativo));
  const linhaFoco = dentro ? (ativo.dataset.linha || '') : '';
  const acaoFoco = dentro ? (ativo.dataset.acao || '') : '';
  corpo.replaceChildren();
  rodape.replaceChildren();
  const linhas = sacola.obterSacola().linhas;
  if (!linhas.length) {
    const vazio = document.createElement('div');
    vazio.className = 'sacola-vazia';
    const p1 = document.createElement('p');
    p1.textContent = TEXTOS.sacola.vazia;
    const p2 = document.createElement('p');
    p2.textContent = TEXTOS.sacola.convite;
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'btn btn-primario';
    botao.textContent = TEXTOS.sacola.ver;
    botao.addEventListener('click', () => {
      fecharSacola();
      const titulo = document.querySelector('#presentes h2');
      titulo.tabIndex = -1;
      rolar(document.getElementById('presentes'));
      titulo.focus({ preventScroll: true });
    });
    vazio.append(p1, p2, botao);
    corpo.append(vazio);
  } else {
    const lista = document.createElement('ul');
    lista.className = 'linhas';
    linhas.forEach((linha) => lista.append(criarLinha(linha)));
    corpo.append(lista);
    const total = document.createElement('p');
    total.className = 'total-sacola';
    const rotulo = document.createElement('span');
    rotulo.textContent = TEXTOS.sacola.total;
    const forte = document.createElement('strong');
    forte.textContent = formatarBRL(sacola.totalCentavos());
    total.append(rotulo, forte);
    const primario = document.createElement('button');
    primario.type = 'button';
    primario.className = 'btn btn-primario';
    primario.textContent = TEXTOS.sacola.pix;
    primario.addEventListener('click', () => abrirCheckout(primario));
    const secundario = document.createElement('button');
    secundario.type = 'button';
    secundario.className = 'btn btn-secundario';
    secundario.textContent = TEXTOS.sacola.continuar;
    secundario.addEventListener('click', fecharSacola);
    rodape.append(total, primario, secundario);
  }
  if (linhaFoco) {
    const seletor = acaoFoco
      ? `[data-linha="${CSS.escape(linhaFoco)}"][data-acao="${CSS.escape(acaoFoco)}"]`
      : `[data-linha="${CSS.escape(linhaFoco)}"]`;
    (painel.querySelector(seletor) || document.getElementById('fechar-sacola')).focus();
  }
}

function atualizarContadores() {
  const n = sacola.totalItens();
  const total = formatarBRL(sacola.totalCentavos());
  const selo = document.getElementById('selo-sacola');
  selo.textContent = String(n);
  selo.hidden = n === 0;
  document.getElementById('btn-sacola').setAttribute('aria-label', preencher(TEXTOS.sacola.badge, { n: String(n) }));
  const barra = document.getElementById('barra-sacola');
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const aberta = document.body.classList.contains('sacola-aberta');
  const mostrar = n > 0 && mobile && !aberta;
  barra.hidden = !mostrar;
  barra.textContent = n === 1
    ? preencher(TEXTOS.sacola.barraUm, { total })
    : preencher(TEXTOS.sacola.barra, { n: String(n), total });
  document.body.classList.toggle('com-barra', mostrar);
}

function atualizarScroll() {
  const dialog = document.getElementById('checkout');
  const deve = document.body.classList.contains('sacola-aberta') || dialog.open;
  if (deve && !scrollTravado) {
    scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('scroll-travado');
    scrollTravado = true;
  } else if (!deve && scrollTravado) {
    document.body.classList.remove('scroll-travado');
    document.body.style.top = '';
    scrollTravado = false;
    window.scrollTo(0, scrollY);
  }
}

function abrirSacola(origem) {
  quemAbriuSacola = origem || document.activeElement;
  document.body.classList.add('sacola-aberta');
  document.getElementById('overlay-sacola').hidden = false;
  const painel = document.getElementById('sacola');
  painel.classList.add('aberta');
  painel.setAttribute('aria-hidden', 'false');
  painel.removeAttribute('inert');
  renderSacola();
  atualizarContadores();
  atualizarScroll();
  document.getElementById('fechar-sacola').focus();
}

function fecharSacola() {
  document.body.classList.remove('sacola-aberta');
  document.getElementById('overlay-sacola').hidden = true;
  const painel = document.getElementById('sacola');
  painel.classList.remove('aberta');
  painel.setAttribute('aria-hidden', 'true');
  painel.setAttribute('inert', '');
  atualizarContadores();
  atualizarScroll();
  const destino = quemAbriuSacola && !quemAbriuSacola.hidden ? quemAbriuSacola : document.getElementById('btn-sacola');
  quemAbriuSacola = null;
  destino?.focus();
}

function rolar(el) {
  el.scrollIntoView({ behavior: movimentoReduzido() ? 'auto' : 'smooth', block: 'start' });
}

function dataRelativa(iso) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '';
  const diff = Date.now() - data.getTime();
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
  const minutos = Math.floor(diff / 60000);
  if (minutos < 1) return TEXTOS.mural.agora;
  if (minutos < 60) return rtf.format(-minutos, 'minute');
  const horas = Math.floor(diff / 3600000);
  if (horas < 24) return rtf.format(-Math.max(horas, 1), 'hour');
  const dias = Math.floor(diff / 86400000);
  if (dias < 7) return rtf.format(-Math.max(dias, 1), 'day');
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(data);
}

function renderMural() {
  const mural = document.getElementById('mural');
  const vazio = document.getElementById('mural-vazio');
  const mais = document.getElementById('ver-mais');
  mural.replaceChildren();
  if (!muralDados.length) {
    vazio.hidden = false;
    mais.hidden = true;
    return;
  }
  vazio.hidden = true;
  muralDados.slice(0, muralLimite).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'recado';
    const nome = document.createElement('p');
    nome.className = 'recado-nome';
    nome.textContent = item.nome || '';
    const msg = document.createElement('p');
    msg.textContent = item.recado || '';
    const quando = document.createElement('time');
    quando.className = 'recado-data';
    quando.dateTime = item.data || '';
    quando.textContent = dataRelativa(item.data);
    card.append(nome, msg, quando);
    mural.append(card);
  });
  mais.hidden = muralLimite >= muralDados.length;
}

function montarFaq() {
  const lista = document.getElementById('lista-faq');
  TEXTOS.faq.itens.forEach(([pergunta, resposta]) => {
    const det = document.createElement('details');
    const sum = document.createElement('summary');
    sum.textContent = pergunta;
    const p = document.createElement('p');
    const texto = pergunta.startsWith('É seguro')
      ? preencher(resposta, { nomeTitular: CONFIG.pix.nomeTitular })
      : resposta;
    p.textContent = texto;
    det.append(sum, p);
    lista.append(det);
  });
  if (CONFIG.pagamentoExterior.trim()) {
    const det = document.createElement('details');
    const sum = document.createElement('summary');
    sum.textContent = TEXTOS.faq.fora;
    const p = document.createElement('div');
    p.className = 'pre';
    comLinks(p, CONFIG.pagamentoExterior.trim());
    det.append(sum, p);
    lista.append(det);
  }
}

function renderResumo() {
  const lista = document.getElementById('resumo-itens');
  lista.replaceChildren();
  sacola.obterSacola().linhas.forEach((linha) => {
    const presente = porId.get(linha.presenteId);
    const li = document.createElement('li');
    const emoji = document.createElement('span');
    emoji.setAttribute('aria-hidden', 'true');
    emoji.textContent = presente?.emoji || '🎁';
    const nome = document.createElement('span');
    nome.className = 'resumo-nome';
    nome.textContent = linha.presenteId === 'presente-surpresa'
      ? `${presente?.nome || 'Presente surpresa'} · ${formatarBRL(linha.valorUnitarioCentavos)}`
      : (presente?.nome || linha.presenteId);
    const meta = document.createElement('span');
    meta.textContent = `${linha.qtd}× · ${formatarBRL(linha.qtd * linha.valorUnitarioCentavos)}`;
    li.append(emoji, nome, meta);
    lista.append(li);
  });
  document.getElementById('resumo-total').textContent = formatarBRL(sacola.totalCentavos());
}

function celularPagando() {
  return window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 768;
}

function criarQr(payload) {
  const caixa = document.createElement('div');
  caixa.className = 'qr-box';
  caixa.setAttribute('role', 'img');
  caixa.setAttribute('aria-label', TEXTOS.checkout.qrAlt);
  const fabrica = globalThis.qrcode;
  if (typeof fabrica !== 'function') {
    caixa.textContent = TEXTOS.checkout.pixNaoConfigurado;
    return caixa;
  }
  const qr = fabrica(0, 'M');
  qr.addData(payload);
  qr.make();
  // SVG gerado pela biblioteca, sem texto do convidado.
  caixa.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
  return caixa;
}

function blocoQr(payload) {
  const qr = criarQr(payload);
  const legenda = document.createElement('p');
  legenda.className = 'legenda';
  legenda.textContent = TEXTOS.checkout.qrLegenda;
  if (!celularPagando()) {
    const bloco = document.createElement('div');
    bloco.className = 'bloco-qr';
    bloco.append(qr, legenda);
    return bloco;
  }
  const det = document.createElement('details');
  det.className = 'bloco-qr';
  const sum = document.createElement('summary');
  sum.textContent = TEXTOS.checkout.mostrarQr;
  det.append(sum, qr, legenda);
  det.addEventListener('toggle', () => {
    sum.textContent = det.open ? TEXTOS.checkout.ocultarQr : TEXTOS.checkout.mostrarQr;
  });
  return det;
}

async function copiar(texto, botao, sucesso, area, fallback) {
  let ok = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      ok = true;
    }
  } catch {
    ok = false;
  }
  if (!ok) {
    const alvo = area || document.createElement('textarea');
    if (!area) {
      alvo.value = texto;
      alvo.setAttribute('readonly', '');
      alvo.style.position = 'fixed';
      alvo.style.left = '-9999px';
      document.body.append(alvo);
    }
    alvo.focus();
    alvo.select();
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    if (!area) alvo.remove();
  }
  if (ok) {
    const original = botao.dataset.rotulo || botao.textContent;
    botao.dataset.rotulo = original;
    botao.textContent = sucesso;
    anunciar(sucesso);
    window.setTimeout(() => {
      botao.textContent = botao.dataset.rotulo;
    }, 2500);
    if (fallback) fallback.hidden = true;
  } else if (area) {
    area.focus();
    area.select();
    if (fallback) {
      fallback.hidden = false;
      fallback.textContent = TEXTOS.checkout.selecione;
    }
    anunciar(TEXTOS.checkout.selecione);
  }
}

function blocoCola(payload) {
  const bloco = document.createElement('div');
  bloco.className = 'bloco-cola';
  const label = document.createElement('label');
  label.htmlFor = 'pix-payload';
  label.textContent = TEXTOS.checkout.cola;
  const area = document.createElement('textarea');
  area.id = 'pix-payload';
  area.readOnly = true;
  area.className = 'pix-codigo';
  area.value = payload;
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'btn btn-primario';
  botao.textContent = TEXTOS.checkout.copiar;
  const ajuda = document.createElement('p');
  ajuda.className = 'legenda';
  ajuda.textContent = TEXTOS.checkout.instrucaoCola;
  const falha = document.createElement('p');
  falha.className = 'erro';
  falha.hidden = true;
  botao.addEventListener('click', () => copiar(payload, botao, TEXTOS.checkout.copiado, area, falha));
  bloco.append(label, area, botao, ajuda, falha);
  return bloco;
}

function blocoChave(totalFmt) {
  const det = document.createElement('details');
  det.className = 'extra';
  const sum = document.createElement('summary');
  sum.textContent = TEXTOS.checkout.chavePergunta;
  const tipo = TEXTOS.checkout.tipos[CONFIG.pix.tipo] || CONFIG.pix.tipo;
  const rotulo = document.createElement('label');
  rotulo.htmlFor = 'pix-chave';
  rotulo.textContent = preencher(TEXTOS.checkout.chaveRotulo, { tipo });
  const campo = document.createElement('input');
  campo.id = 'pix-chave';
  campo.readOnly = true;
  campo.className = 'chave-pix';
  campo.value = CONFIG.pix.chave;
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'btn btn-secundario';
  botao.textContent = TEXTOS.checkout.copiarChave;
  botao.addEventListener('click', () => copiar(CONFIG.pix.chave, botao, TEXTOS.checkout.chaveCopiada, campo));
  const lembrete = document.createElement('p');
  lembrete.className = 'legenda';
  lembrete.textContent = preencher(TEXTOS.checkout.lembrete, { total: totalFmt });
  det.append(sum, rotulo, campo, botao, lembrete);
  return det;
}

function blocoExterior() {
  const texto = CONFIG.pagamentoExterior.trim();
  if (!texto) return null;
  const det = document.createElement('details');
  det.className = 'extra';
  const sum = document.createElement('summary');
  sum.textContent = TEXTOS.checkout.exterior;
  const corpo = document.createElement('div');
  corpo.className = 'pre';
  comLinks(corpo, texto);
  det.append(sum, corpo);
  return det;
}

function renderPix() {
  const totalFmt = formatarBRL(sacola.totalCentavos());
  document.getElementById('pix-valor').textContent = preencher(TEXTOS.checkout.valor, { total: totalFmt });
  document.getElementById('pix-para').textContent = preencher(TEXTOS.checkout.para, { nomeTitular: CONFIG.pix.nomeTitular });
  document.getElementById('pix-seguranca').textContent = preencher(TEXTOS.checkout.seguranca, {
    nomeTitular: CONFIG.pix.nomeTitular,
  });
  const corpo = document.getElementById('pix-corpo');
  corpo.replaceChildren();
  const botao = document.getElementById('btn-paguei');
  botao.disabled = false;
  botao.textContent = TEXTOS.checkout.jaFiz;
  botao.removeAttribute('aria-busy');

  if (!pixConfigurado()) {
    const aviso = document.createElement('p');
    aviso.className = 'aviso-inline';
    aviso.textContent = TEXTOS.checkout.pixNaoConfigurado;
    corpo.append(aviso);
    botao.disabled = true;
    return;
  }

  let payload = '';
  try {
    payload = gerarPayloadPix({
      chave: CONFIG.pix.chave,
      tipo: CONFIG.pix.tipo,
      nome: CONFIG.pix.nomeTitular,
      cidade: CONFIG.pix.cidadeTitular,
      valorCentavos: sacola.totalCentavos(),
      descricao: CONFIG.pix.descricao,
    });
  } catch (erro) {
    console.warn('Falha ao gerar o PIX', erro);
    const aviso = document.createElement('p');
    aviso.className = 'aviso-inline';
    aviso.textContent = TEXTOS.checkout.pixNaoConfigurado;
    corpo.append(aviso);
    botao.disabled = true;
    return;
  }
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.info('PIX payload', payload);
  }
  const qr = blocoQr(payload);
  const cola = blocoCola(payload);
  const chave = blocoChave(totalFmt);
  const exterior = blocoExterior();
  if (celularPagando()) corpo.append(cola, qr, chave);
  else corpo.append(qr, cola, chave);
  if (exterior) corpo.append(exterior);
}

function renderPassos() {
  const el = document.getElementById('passos');
  el.replaceChildren();
  TEXTOS.checkout.etapas.forEach((nome, indice) => {
    const span = document.createElement('span');
    if (indice + 1 === passo) span.setAttribute('aria-current', 'step');
    span.textContent = `${indice + 1} ${nome}`;
    el.append(span);
    if (indice < TEXTOS.checkout.etapas.length - 1) {
      const sep = document.createElement('span');
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = ' · ';
      el.append(sep);
    }
  });
}

function mostrarPasso(n) {
  passo = n;
  document.getElementById('passo-1').hidden = n !== 1;
  document.getElementById('passo-2').hidden = n !== 2;
  document.getElementById('passo-3').hidden = n !== 3;
  const titulo = document.getElementById('checkout-titulo');
  if (n === 1) titulo.textContent = TEXTOS.checkout.quase;
  if (n === 2) titulo.textContent = TEXTOS.checkout.pague;
  if (n === 3) titulo.textContent = preencher(TEXTOS.checkout.obrigado, { primeiroNome });
  renderPassos();
  if (n === 1) renderResumo();
  if (n === 2) renderPix();
  if (n === 3) {
    document.getElementById('obrigado-texto').textContent = preencher(TEXTOS.checkout.felizes, {
      noiva: CONFIG.noiva,
      noivo: CONFIG.noivo,
    });
    const nota = document.getElementById('obrigado-mural');
    nota.hidden = !optouMural;
    nota.textContent = TEXTOS.checkout.notaMural;
    const falha = document.getElementById('obrigado-falha');
    falha.hidden = !falhouRegistro;
    falha.textContent = TEXTOS.checkout.notaFalha;
    titulo.tabIndex = -1;
    titulo.focus();
  }
}

function celebrar() {
  if (movimentoReduzido()) return;
  const camada = document.createElement('div');
  camada.className = 'celebracao';
  camada.setAttribute('aria-hidden', 'true');
  const simbolos = ['💛', '🤍', '✨', '🌿'];
  for (let i = 0; i < 16; i += 1) {
    const peca = document.createElement('span');
    peca.textContent = simbolos[i % simbolos.length];
    peca.style.left = `${4 + ((i * 17) % 90)}%`;
    peca.style.animationDelay = `${(i % 6) * 0.04}s`;
    camada.append(peca);
  }
  document.getElementById('checkout').append(camada);
  window.setTimeout(() => camada.remove(), 1500);
}

function abrirCheckout(origem) {
  if (sacola.totalItens() === 0) return;
  quemAbriuCheckout = origem || document.activeElement;
  idConfirmacao = null;
  enviando = false;
  falhouRegistro = false;
  const nome = document.getElementById('nome-convidado');
  if (!nome.value) nome.value = lerNome();
  document.getElementById('website').value = '';
  document.getElementById('erro-nome').hidden = true;
  nome.removeAttribute('aria-invalid');
  document.getElementById('contador-recado').textContent = `${document.getElementById('recado').value.length}/500`;
  mostrarPasso(1);
  const dialog = document.getElementById('checkout');
  if (!dialog.open) dialog.showModal();
  atualizarScroll();
  nome.focus();
}

function montarPayload(nome, recado, mostrar) {
  const itens = sacola.obterSacola().linhas.map((linha) => ({
    id: linha.presenteId,
    nome: porId.get(linha.presenteId)?.nome || linha.presenteId,
    qtd: linha.qtd,
    valorUnitarioCentavos: linha.valorUnitarioCentavos,
  }));
  return {
    id: idConfirmacao,
    nome,
    recado,
    mostrarNoMural: mostrar,
    itens,
    totalCentavos: itens.reduce((soma, item) => soma + item.qtd * item.valorUnitarioCentavos, 0),
    site: 'v1',
    website: document.getElementById('website').value,
  };
}

async function confirmarPix() {
  if (enviando || !pixConfigurado()) return;
  enviando = true;
  if (!idConfirmacao) idConfirmacao = criarId();
  const botao = document.getElementById('btn-paguei');
  botao.disabled = true;
  botao.setAttribute('aria-busy', 'true');
  botao.replaceChildren();
  const spinner = document.createElement('span');
  spinner.className = 'spinner';
  spinner.setAttribute('aria-hidden', 'true');
  botao.append(spinner, document.createTextNode(` ${TEXTOS.checkout.registrando}`));
  const nome = document.getElementById('nome-convidado').value.trim();
  const recado = document.getElementById('recado').value.trim();
  const mostrar = muralLigado() && document.getElementById('mostrar-mural').checked;
  const payload = montarPayload(nome, recado, mostrar);
  const resultado = await enviarConfirmacao(payload);
  falhouRegistro = !resultado?.ok;
  optouMural = Boolean(mostrar && recado);
  primeiroNome = nome.split(/\s+/)[0] || nome;
  payload.itens.forEach((item) => {
    if (item.id === 'presente-surpresa') return;
    contagem[item.id] = (contagem[item.id] || 0) + item.qtd;
  });
  sacola.limparSacola();
  enviando = false;
  mostrarPasso(3);
  celebrar();
}

function fecharMenu() {
  const botao = document.getElementById('btn-menu');
  const menu = document.getElementById('menu-principal');
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-label', TEXTOS.nav.abrirMenu);
  menu.classList.remove('aberto');
}

function ligarEventos() {
  const botaoMenu = document.getElementById('btn-menu');
  const menu = document.getElementById('menu-principal');
  botaoMenu.addEventListener('click', () => {
    const aberto = botaoMenu.getAttribute('aria-expanded') === 'true';
    botaoMenu.setAttribute('aria-expanded', String(!aberto));
    botaoMenu.setAttribute('aria-label', aberto ? TEXTOS.nav.abrirMenu : TEXTOS.nav.fecharMenu);
    menu.classList.toggle('aberto', !aberto);
  });
  menu.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) fecharMenu();
  });
  document.addEventListener('click', (evento) => {
    if (!menu.classList.contains('aberto')) return;
    if (evento.target.closest('#menu-principal') || evento.target.closest('#btn-menu')) return;
    fecharMenu();
  });

  document.getElementById('btn-sacola').addEventListener('click', (evento) => abrirSacola(evento.currentTarget));
  document.getElementById('barra-sacola').addEventListener('click', (evento) => abrirSacola(evento.currentTarget));
  document.getElementById('fechar-sacola').addEventListener('click', fecharSacola);
  document.getElementById('overlay-sacola').addEventListener('click', fecharSacola);

  document.getElementById('busca').addEventListener('input', (evento) => {
    window.clearTimeout(buscaTimer);
    const valor = evento.target.value;
    buscaTimer = window.setTimeout(() => {
      filtros.q = valor;
      renderGrade();
      escreverHash();
    }, 150);
  });
  document.getElementById('ordenar').addEventListener('change', (evento) => {
    filtros.ordem = evento.target.value;
    renderGrade();
    escreverHash();
  });
  document.getElementById('limpar-filtros').addEventListener('click', () => {
    filtros = { cat: 'todos', q: '', preco: 'qualquer', ordem: 'destaques' };
    document.getElementById('busca').value = '';
    document.getElementById('ordenar').value = 'destaques';
    atualizarChips();
    renderGrade();
    escreverHash();
    document.getElementById('busca').focus();
  });

  document.getElementById('form-checkout').addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (passo !== 1 || enviando) return;
    const input = document.getElementById('nome-convidado');
    const erro = document.getElementById('erro-nome');
    const nome = input.value.trim();
    if (!nome) {
      erro.hidden = false;
      erro.textContent = TEXTOS.checkout.erroNome;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    erro.hidden = true;
    input.removeAttribute('aria-invalid');
    gravarNome(nome);
    mostrarPasso(2);
  });
  document.getElementById('nome-convidado').addEventListener('input', (evento) => {
    if (!evento.target.value.trim()) return;
    document.getElementById('erro-nome').hidden = true;
    evento.target.removeAttribute('aria-invalid');
  });
  document.getElementById('recado').addEventListener('input', (evento) => {
    document.getElementById('contador-recado').textContent = `${evento.target.value.length}/500`;
  });
  document.getElementById('btn-voltar').addEventListener('click', () => mostrarPasso(1));
  document.getElementById('btn-paguei').addEventListener('click', confirmarPix);
  document.getElementById('fechar-checkout').addEventListener('click', () => {
    document.getElementById('checkout').close();
  });
  document.getElementById('btn-outro').addEventListener('click', () => {
    const titulo = document.querySelector('#presentes h2');
    titulo.tabIndex = -1;
    quemAbriuCheckout = titulo;
    document.getElementById('checkout').close();
    rolar(document.getElementById('presentes'));
  });
  document.getElementById('btn-inicio').addEventListener('click', () => {
    quemAbriuCheckout = document.querySelector('.marca');
    document.getElementById('checkout').close();
    window.scrollTo({ top: 0, behavior: movimentoReduzido() ? 'auto' : 'smooth' });
  });
  document.getElementById('checkout').addEventListener('close', () => {
    atualizarScroll();
    const destino = quemAbriuCheckout;
    quemAbriuCheckout = null;
    if (destino && document.contains(destino)) destino.focus();
    else document.getElementById('btn-sacola').focus();
  });
  document.getElementById('ver-mais').addEventListener('click', () => {
    muralLimite += 12;
    renderMural();
  });

  document.addEventListener('keydown', (evento) => {
    const dialog = document.getElementById('checkout');
    if (dialog.open) return;
    if (evento.key === 'Escape' && document.body.classList.contains('sacola-aberta')) {
      fecharSacola();
      return;
    }
    if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
      fecharMenu();
      botaoMenu.focus();
      return;
    }
    if (evento.key !== 'Tab' || !document.body.classList.contains('sacola-aberta')) return;
    const painel = document.getElementById('sacola');
    const lista = [...painel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])')];
    if (!lista.length) return;
    const primeiro = lista[0];
    const ultimo = lista[lista.length - 1];
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  });

  window.addEventListener('hashchange', () => {
    if (!location.hash.startsWith('#presentes')) return;
    const lidos = lerFiltrosHash();
    filtros = lidos || { cat: 'todos', q: '', preco: 'qualquer', ordem: 'destaques' };
    document.getElementById('busca').value = filtros.q;
    document.getElementById('ordenar').value = filtros.ordem;
    atualizarChips();
    renderGrade();
  });

  const mq = window.matchMedia('(max-width: 767px)');
  mq.addEventListener('change', () => {
    atualizarContadores();
    const dialog = document.getElementById('checkout');
    if (passo === 2 && dialog.open) renderPix();
  });
  new ResizeObserver(medirHeader).observe(document.querySelector('.topo'));

  sacola.aoMudar(() => {
    renderDestaques();
    renderGrade();
    atualizarContadores();
    renderSacola();
  });
}

export function iniciar() {
  aplicarTextos();
  aplicarIdentidade();
  montarFiltros();
  montarFaq();
  renderDestaques();
  renderGrade();
  renderSacola();
  atualizarContadores();
  ligarEventos();
  alternarFundos();
  medirHeader();
  if (location.hash.startsWith('#presentes')) {
    requestAnimationFrame(() => rolar(document.getElementById('presentes')));
  }
  return {
    aplicarResumo(resumo) {
      contagem = {};
      Object.entries(resumo?.contagem || {}).forEach(([id, valor]) => {
        const n = Number(valor);
        if (Number.isInteger(n) && n > 0) contagem[id] = n;
      });
      renderDestaques();
      renderGrade();
      renderSacola();
      if (!muralLigado()) return;
      muralDados = Array.isArray(resumo?.mural) ? resumo.mural.slice(0, 200) : [];
      renderMural();
    },
  };
}
