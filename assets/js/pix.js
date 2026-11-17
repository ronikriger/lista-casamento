/** CRC-16/CCITT-FALSE. */
export function crc16(str) {
  const bytes = new TextEncoder().encode(str);
  let crc = 0xFFFF;
  for (const b of bytes) {
    crc ^= b << 8;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function sanitizarTexto(str, maxLen) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .replace(/ +/g, ' ')
    .trim()
    .slice(0, maxLen)
    .trim();
}

export function normalizarChave(chave, tipo) {
  const bruto = String(chave ?? '');
  if (tipo === 'email') return bruto.trim().toLowerCase();
  if (tipo === 'telefone') {
    let digitos = bruto.replace(/\D/g, '');
    if (!digitos.startsWith('55')) digitos = `55${digitos}`;
    return `+${digitos}`;
  }
  if (tipo === 'cpf' || tipo === 'cnpj') return bruto.replace(/\D/g, '');
  return bruto.trim().toLowerCase();
}

function campo(id, valor) {
  const texto = String(valor);
  return id + String(texto.length).padStart(2, '0') + texto;
}

export function gerarPayloadPix({ chave, tipo, nome, cidade, valorCentavos, descricao }) {
  const chaveNormalizada = normalizarChave(chave, tipo);
  let conta = campo('00', 'br.gov.bcb.pix') + campo('01', chaveNormalizada);
  const desc = descricao ? sanitizarTexto(descricao, 72) : '';
  if (desc) {
    const comDescricao = conta + campo('02', desc);
    if (comDescricao.length <= 99) conta = comDescricao;
  }

  let payload = '';
  payload += campo('00', '01');
  payload += campo('26', conta);
  payload += campo('52', '0000');
  payload += campo('53', '986');

  const centavos = Math.trunc(Number(valorCentavos));
  if (centavos) {
    const valor = `${Math.floor(centavos / 100)}.${String(Math.abs(centavos % 100)).padStart(2, '0')}`;
    payload += campo('54', valor);
  }

  payload += campo('58', 'BR');
  payload += campo('59', sanitizarTexto(nome, 25));
  payload += campo('60', sanitizarTexto(cidade, 15));
  payload += campo('62', campo('05', '***'));
  payload += '6304';
  payload += crc16(payload);
  return payload;
}
