import { CONFIG } from './config.js';

const PENDENTES = 'lista-casamento:pendentes:v1';
const CONFIRMADOS = 'lista-casamento:confirmados:v1';

function lerJson(chave, fallback) {
  try {
    const bruto = localStorage.getItem(chave);
    if (!bruto) return fallback;
    return JSON.parse(bruto);
  } catch {
    return fallback;
  }
}

function gravarJson(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* memória */
  }
}

export function criarId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function lerFila() {
  const fila = lerJson(PENDENTES, []);
  return Array.isArray(fila) ? fila : [];
}

function enfileirar(payload) {
  const fila = lerFila();
  if (!fila.some((item) => item.id === payload.id)) fila.push(payload);
  gravarJson(PENDENTES, fila);
}

function removerFila(id) {
  gravarJson(PENDENTES, lerFila().filter((item) => item.id !== id));
}

function arquivarLocal(payload) {
  const lista = lerJson(CONFIRMADOS, []);
  const atuais = Array.isArray(lista) ? lista : [];
  atuais.push({ ...payload, quando: new Date().toISOString() });
  gravarJson(CONFIRMADOS, atuais);
}

async function buscarComTempo(url, opcoes, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opcoes, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function postar(payload) {
  const resposta = await buscarComTempo(CONFIG.appsScriptUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, 10000);
  return resposta.json();
}

export async function buscarResumo() {
  if (!CONFIG.appsScriptUrl) return null;
  const junta = CONFIG.appsScriptUrl.includes('?') ? '&' : '?';
  try {
    const resposta = await buscarComTempo(`${CONFIG.appsScriptUrl}${junta}acao=resumo`, {}, 6000);
    if (!resposta.ok) throw new Error(`status ${resposta.status}`);
    const dados = await resposta.json();
    if (!dados?.ok) throw new Error('resumo');
    return dados;
  } catch (erro) {
    console.warn('Resumo indisponível. A lista segue com todos os presentes disponíveis.', erro);
    return null;
  }
}

export async function enviarConfirmacao(payload) {
  if (!CONFIG.appsScriptUrl) {
    arquivarLocal(payload);
    return { ok: true, local: true };
  }
  enfileirar(payload);
  try {
    const dados = await postar(payload);
    if (dados?.ok || dados?.erro === 'invalido') removerFila(payload.id);
    return dados || { ok: false };
  } catch (erro) {
    console.warn('Não foi possível registrar a confirmação agora. Ela fica na fila.', erro);
    return { ok: false };
  }
}

export async function reenviarPendentes() {
  if (!CONFIG.appsScriptUrl) return;
  const fila = lerFila();
  for (const payload of fila) {
    try {
      const dados = await postar(payload);
      if (dados?.ok || dados?.erro === 'invalido') removerFila(payload.id);
    } catch (erro) {
      console.warn('Reenvio de confirmação pendente falhou.', erro);
    }
  }
}
