const CHAVE = 'lista-casamento:sacola:v1';

let linhas = [];
const ouvintes = new Set();

function ler() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    return Array.isArray(dados?.linhas) ? dados.linhas : [];
  } catch {
    return [];
  }
}

function gravar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ linhas }));
  } catch {
    /* navegação privada: a sacola fica só na memória */
  }
}

function emitir() {
  gravar();
  const foto = obterSacola();
  for (const ouvir of ouvintes) ouvir(foto);
}

function novoId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `linha-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function iniciarSacola(presentes) {
  const porId = new Map(presentes.map((item) => [item.id, item]));
  const validas = [];
  for (const linha of ler()) {
    if (!linha || typeof linha.linhaId !== 'string' || typeof linha.presenteId !== 'string') continue;
    const presente = porId.get(linha.presenteId);
    if (!presente) continue;
    const qtd = Number(linha.qtd);
    if (!Number.isInteger(qtd) || qtd < 1) continue;
    if (presente.id === 'presente-surpresa') {
      const valor = Number(linha.valorUnitarioCentavos);
      if (!Number.isInteger(valor) || valor < 1) continue;
      validas.push({
        linhaId: linha.linhaId,
        presenteId: presente.id,
        qtd: 1,
        valorUnitarioCentavos: valor,
      });
      continue;
    }
    if (!Number.isInteger(presente.precoCentavos) || presente.precoCentavos <= 0) continue;
    const teto = presente.qtd == null ? 20 : presente.qtd;
    validas.push({
      linhaId: linha.linhaId,
      presenteId: presente.id,
      qtd: Math.min(qtd, teto),
      valorUnitarioCentavos: presente.precoCentavos,
    });
  }
  linhas = validas;
  gravar();
}

export function obterSacola() {
  return { linhas: linhas.map((linha) => ({ ...linha })) };
}

export function aoMudar(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

export function qtdDoPresente(presenteId) {
  return linhas.reduce((soma, linha) => (linha.presenteId === presenteId ? soma + linha.qtd : soma), 0);
}

export function totalItens() {
  return linhas.reduce((soma, linha) => soma + linha.qtd, 0);
}

export function totalCentavos() {
  return linhas.reduce((soma, linha) => soma + linha.qtd * linha.valorUnitarioCentavos, 0);
}

export function adicionarItem(presente, valorUnitarioCentavos) {
  if (presente.id === 'presente-surpresa') {
    const valor = Math.trunc(valorUnitarioCentavos);
    if (!Number.isInteger(valor) || valor < 1) return false;
    linhas.push({
      linhaId: novoId(),
      presenteId: presente.id,
      qtd: 1,
      valorUnitarioCentavos: valor,
    });
    emitir();
    return true;
  }
  const teto = presente.qtd == null ? 20 : presente.qtd;
  const existente = linhas.find((linha) => linha.presenteId === presente.id);
  if (existente) {
    if (existente.qtd >= teto) return false;
    existente.qtd += 1;
    existente.valorUnitarioCentavos = presente.precoCentavos;
  } else {
    if (teto < 1) return false;
    linhas.push({
      linhaId: novoId(),
      presenteId: presente.id,
      qtd: 1,
      valorUnitarioCentavos: presente.precoCentavos,
    });
  }
  emitir();
  return true;
}

export function alterarQtd(linhaId, delta, maximo) {
  const linha = linhas.find((item) => item.linhaId === linhaId);
  if (!linha) return null;
  const nova = linha.qtd + delta;
  if (nova < 1 || (maximo != null && nova > maximo)) return linha.qtd;
  linha.qtd = nova;
  emitir();
  return nova;
}

export function removerLinha(linhaId) {
  const antes = linhas.length;
  linhas = linhas.filter((linha) => linha.linhaId !== linhaId);
  if (linhas.length !== antes) emitir();
}

export function limparSacola() {
  linhas = [];
  emitir();
}
