import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crc16, gerarPayloadPix, normalizarChave, sanitizarTexto } from '../assets/js/pix.js';

const EXEMPLO_BCB = '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D';

test('crc16 do vetor 123456789', () => {
  assert.equal(crc16('123456789'), '29B1');
});

test('exemplo oficial do Banco Central sem valor', () => {
  assert.equal(crc16(EXEMPLO_BCB.slice(0, -4)), '1D3D');
  assert.equal(EXEMPLO_BCB.slice(-4), '1D3D');
  assert.equal(
    EXEMPLO_BCB,
    '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D',
  );
});

test('gerarPayloadPix com valor', () => {
  const payload = gerarPayloadPix({
    chave: '123e4567-e12b-12d1-a456-426655440000',
    tipo: 'aleatoria',
    nome: 'Maria Silva',
    cidade: 'São Paulo',
    valorCentavos: 34990,
  });
  assert.equal(
    payload,
    '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865406349.905802BR5911MARIA SILVA6009SAO PAULO62070503***63046E00',
  );
});

test('sanitizarTexto corta nome e cidade', () => {
  assert.equal(sanitizarTexto('Maria José da Conceição Ferreira', 25), 'MARIA JOSE DA CONCEICAO F');
  assert.equal(sanitizarTexto('São José dos Campos', 15), 'SAO JOSE DOS CA');
});

test('normalizarChave telefone e cpf', () => {
  assert.equal(normalizarChave('(11) 99999-8888', 'telefone'), '+5511999998888');
  assert.equal(normalizarChave('123.456.789-09', 'cpf'), '12345678909');
});

test('o CRC de qualquer payload confere com os 4 últimos caracteres', () => {
  const payload = gerarPayloadPix({
    chave: 'ana@example.com',
    tipo: 'email',
    nome: 'Ana Beatriz',
    cidade: 'Curitiba',
    valorCentavos: 150000,
    descricao: 'Presente de casamento',
  });
  assert.equal(crc16(payload.slice(0, -4)), payload.slice(-4));
  assert.match(payload, /54071500\.00/);
});
