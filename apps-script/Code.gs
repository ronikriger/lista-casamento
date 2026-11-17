/**
 * Lista de presentes — registro das confirmações.
 *
 * Cole este arquivo em Extensões → Apps Script, na planilha da noiva.
 * Rode configurarPlanilha() uma vez. A coluna J fica oculta e guarda o JSON
 * dos itens (id, nome, qtd, valorUnitarioCentavos). É ela que alimenta a
 * contagem de "Já presenteado" e não deve ser apagada.
 *
 * O formato da coluna D usa o padrão do Apps Script (vírgula de milhar e
 * ponto decimal no código). Com o idioma da planilha em Português (Brasil),
 * a noiva vê R$ #.##0,00.
 */
const EMAIL_AVISO = '';          // e-mail da noiva para avisos; vazio = sem e-mail
const NOME_ABA = 'Presentes';

function configurarPlanilha() {
  const ss = SpreadsheetApp.getActive();
  try {
    ss.setSpreadsheetLocale('pt_BR');
  } catch (erro) {
    // A conta pode impedir a troca de idioma; a formatação numérica ainda é aplicada.
  }
  let sheet = ss.getSheetByName(NOME_ABA);
  if (!sheet) sheet = ss.insertSheet(NOME_ABA, 0);
  const headers = [
    'Data/Hora',
    'Nome',
    'Presentes',
    'Valor total (R$)',
    'Recado',
    'Mostrar no mural',
    'Ocultar do mural',
    'Cancelado',
    'ID',
    'Itens (JSON)',
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  const larguras = [170, 180, 420, 160, 320, 150, 150, 120, 280, 360];
  larguras.forEach((largura, indice) => sheet.setColumnWidth(indice + 1, largura));
  sheet.getRange(2, 4, 1000, 1).setNumberFormat('R$ #,##0.00');
  sheet.getRange(2, 6, 1000, 3).insertCheckboxes();
  sheet.hideColumns(10);
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.acao !== 'resumo') {
    return json({ ok: false });
  }
  const cache = CacheService.getScriptCache();
  const salvo = cache.get('resumo');
  if (salvo) {
    return ContentService.createTextOutput(salvo).setMimeType(ContentService.MimeType.JSON);
  }
  const corpo = JSON.stringify(montarResumo());
  try {
    cache.put('resumo', corpo, 60);
  } catch (erro) {
    // O resumo ainda é devolvido; só não fica em cache.
  }
  return ContentService.createTextOutput(corpo).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let dados;
  try {
    dados = JSON.parse(e.postData.contents);
  } catch (erro) {
    return json({ ok: false, erro: 'invalido' });
  }
  if (!aceitaPost()) return json({ ok: false, erro: 'limite' });

  const website = dados.website == null ? '' : String(dados.website).trim();
  if (website) return json({ ok: true });

  const validado = validar(dados);
  if (!validado) return json({ ok: false, erro: 'invalido' });

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (erro) {
    return json({ ok: false, erro: 'limite' });
  }

  try {
    const sheet = obterAba();
    if (idExiste(sheet, validado.id)) return json({ ok: true, duplicado: true });
    sheet.appendRow([
      new Date(),
      proteger(validado.nome),
      proteger(validado.lista),
      validado.soma / 100,
      proteger(validado.recado),
      validado.mostrar,
      false,
      false,
      proteger(validado.id),
      proteger(JSON.stringify(validado.itens)),
    ]);
  } finally {
    lock.releaseLock();
  }

  try {
    CacheService.getScriptCache().remove('resumo');
  } catch (erro) {
    // Sem cache, o próximo GET lê a planilha direto.
  }
  avisar(validado);
  return json({ ok: true });
}

function obterAba() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(NOME_ABA);
  if (!sheet) sheet = ss.insertSheet(NOME_ABA);
  return sheet;
}

function validar(dados) {
  const nome = String(dados.nome || '').trim();
  const recado = String(dados.recado || '').trim();
  const id = String(dados.id || '').trim();
  if (nome.length < 1 || nome.length > 80) return null;
  if (recado.length > 500) return null;
  if (id.length < 8 || id.length > 80) return null;
  if (!Array.isArray(dados.itens) || dados.itens.length < 1 || dados.itens.length > 60) return null;

  let soma = 0;
  const itens = [];
  for (let i = 0; i < dados.itens.length; i += 1) {
    const item = dados.itens[i];
    if (!item || typeof item.id !== 'string' || typeof item.nome !== 'string') return null;
    const qtd = item.qtd;
    const valor = item.valorUnitarioCentavos;
    if (!Number.isInteger(qtd) || qtd < 1 || qtd > 20) return null;
    if (!Number.isInteger(valor) || valor < 1) return null;
    soma += qtd * valor;
    itens.push({
      id: item.id,
      nome: item.nome,
      qtd: qtd,
      valorUnitarioCentavos: valor,
    });
  }
  if (!Number.isInteger(dados.totalCentavos) || dados.totalCentavos !== soma) return null;
  if (soma < 1000 || soma > 5000000) return null;

  return {
    id: id,
    nome: nome,
    recado: recado,
    mostrar: dados.mostrarNoMural === true,
    itens: itens,
    soma: soma,
    lista: descrever(itens),
  };
}

function descrever(itens) {
  return itens.map((item) => {
    if (item.id === 'presente-surpresa') {
      const vezes = item.qtd > 1 ? ` (${item.qtd}×)` : '';
      return `Presente surpresa – ${formatarReais(item.valorUnitarioCentavos)}${vezes}`;
    }
    return `${item.nome} (${item.qtd}×)`;
  }).join(', ');
}

function formatarReais(centavos) {
  const abs = Math.abs(Math.trunc(centavos));
  const reais = Math.floor(abs / 100);
  const cents = abs % 100;
  const corpo = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${corpo},${String(cents).padStart(2, '0')}`;
}

function idExiste(sheet, id) {
  const ultima = sheet.getLastRow();
  if (ultima < 2) return false;
  const valores = sheet.getRange(2, 9, ultima - 1, 1).getValues();
  return valores.some((linha) => String(linha[0]) === id);
}

function aceitaPost() {
  const cache = CacheService.getScriptCache();
  const janela = Math.floor(Date.now() / 600000);
  const chave = `posts_${janela}`;
  const total = Number(cache.get(chave) || '0');
  if (total >= 60) return false;
  cache.put(chave, String(total + 1), 600);
  return true;
}

function proteger(valor) {
  const texto = String(valor == null ? '' : valor);
  return /^[=+\-@]/.test(texto) ? `'${texto}` : texto;
}

function montarResumo() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(NOME_ABA);
  const contagem = {};
  const mural = [];
  if (!sheet || sheet.getLastRow() < 2) return { ok: true, contagem: contagem, mural: mural };
  const valores = sheet.getDataRange().getValues();
  for (let i = 1; i < valores.length; i += 1) {
    const linha = valores[i];
    if (!linha[8]) continue;
    const cancelado = linha[7] === true;
    if (!cancelado) somarItens(contagem, linha[9]);
    const recado = String(linha[4] || '').trim();
    if (linha[5] === true && linha[6] !== true && !cancelado && recado) {
      mural.push({
        nome: String(linha[1] || '').trim(),
        recado: recado,
        data: iso(linha[0]),
        ordem: tempo(linha[0]),
      });
    }
  }
  mural.sort((a, b) => b.ordem - a.ordem);
  return {
    ok: true,
    contagem: contagem,
    mural: mural.slice(0, 200).map((item) => ({ nome: item.nome, recado: item.recado, data: item.data })),
  };
}

function somarItens(contagem, bruto) {
  if (!bruto) return;
  let itens;
  try {
    itens = JSON.parse(String(bruto));
  } catch (erro) {
    return;
  }
  if (!Array.isArray(itens)) return;
  itens.forEach((item) => {
    if (!item || !item.id) return;
    const qtd = Number(item.qtd);
    if (!Number.isInteger(qtd) || qtd < 1) return;
    contagem[item.id] = (contagem[item.id] || 0) + qtd;
  });
}

function tempo(valor) {
  if (valor instanceof Date) return valor.getTime();
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? 0 : data.getTime();
}

function iso(valor) {
  const data = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(data.getTime())) return '';
  return data.toISOString();
}

function avisar(validado) {
  if (!EMAIL_AVISO) return;
  const total = formatarReais(validado.soma);
  const corpo = [
    `Oba! ${validado.nome} acabou de confirmar um presente para vocês.`,
    '',
    `Presentes: ${validado.lista}`,
    `Valor: ${total}`,
    `Recado: ${validado.recado || '(sem recado)'}`,
    '',
    'Lembrete: esta é a confirmação do convidado. Confira no app do banco se o PIX chegou.',
    `Planilha: ${SpreadsheetApp.getActive().getUrl()}`,
  ].join('\n');
  try {
    MailApp.sendEmail(EMAIL_AVISO, `🎁 ${validado.nome} enviou um presente de ${total}`, corpo);
  } catch (erro) {
    // A confirmação já foi gravada; a falha do e-mail não pode desfazer o presente.
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
