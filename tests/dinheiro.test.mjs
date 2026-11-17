import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatarBRL, parseReais } from '../assets/js/dinheiro.js';

test('formatarBRL usa espaço não separável', () => {
  assert.equal(formatarBRL(28000), 'R$\u00A0280,00');
});

test('parseReais aceita os formatos brasileiros e rejeita texto', () => {
  assert.equal(parseReais('1.234,56'), 123456);
  assert.equal(parseReais('150'), 15000);
  assert.equal(parseReais('150,5'), 15050);
  assert.equal(parseReais('1234.56'), 123456);
  assert.equal(parseReais('R$ 200'), 20000);
  assert.equal(parseReais('abc'), null);
  assert.equal(parseReais(''), null);
  assert.equal(parseReais('0'), 0);
});
