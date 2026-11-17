/** Formata centavos inteiros como moeda pt-BR, com espaço não separável. */
export function formatarBRL(centavos) {
  const valor = Math.trunc(Number(centavos));
  const negativo = valor < 0;
  const abs = Math.abs(valor);
  const reais = Math.floor(abs / 100);
  const cents = abs % 100;
  const reaisFmt = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const texto = `R$\u00A0${reaisFmt},${String(cents).padStart(2, '0')}`;
  return negativo ? `-${texto}` : texto;
}

/**
 * Converte um valor digitado em reais para centavos inteiros.
 * Aceita "150", "150,5", "1.234,56", "1234.56" e "R$ 200".
 * Retorna null quando o texto não é um número.
 */
export function parseReais(entrada) {
  if (entrada == null) return null;
  let s = String(entrada).trim().replace(/[\s\u00A0\u202F]/g, '');
  if (!s) return null;
  s = s.replace(/^R\$/i, '');
  if (!s || !/^[\d.,]+$/.test(s)) return null;

  const ultimaVirgula = s.lastIndexOf(',');
  const ultimoPonto = s.lastIndexOf('.');
  let normalizado;
  if (ultimaVirgula === -1 && ultimoPonto === -1) {
    normalizado = s;
  } else if (ultimaVirgula > ultimoPonto) {
    normalizado = s.replace(/\./g, '').replace(',', '.');
  } else {
    normalizado = s.replace(/,/g, '');
  }
  if (!/^\d+(\.\d+)?$/.test(normalizado)) return null;

  const [inteiro, frac = ''] = normalizado.split('.');
  if (frac.length > 2) {
    const numero = Number(normalizado);
    if (!Number.isFinite(numero)) return null;
    return Math.round(numero * 100);
  }
  const centavos = Number(inteiro) * 100 + Number((frac + '00').slice(0, 2));
  if (!Number.isSafeInteger(centavos)) return null;
  return centavos;
}

export function totalLinha(qtd, valorUnitarioCentavos) {
  return Math.trunc(qtd) * Math.trunc(valorUnitarioCentavos);
}
