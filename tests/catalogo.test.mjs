import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CATEGORIAS, PRESENTES } from '../assets/js/presentes.js';

test('catálogo tem 177 itens e o presente surpresa', () => {
  const surpresa = PRESENTES.find((item) => item.id === 'presente-surpresa');
  const catalogo = PRESENTES.filter((item) => item.id !== 'presente-surpresa');
  assert.equal(catalogo.length, 177);
  assert.ok(surpresa);
  assert.equal(surpresa.categoria, 'especial');
  assert.equal(surpresa.precoCentavos, null);
  assert.equal(CATEGORIAS.length, 12);
});

test('ids são únicos, categorias existem e preços são inteiros', () => {
  const ids = new Set();
  const categorias = new Set(CATEGORIAS.map((cat) => cat.id));
  for (const item of PRESENTES) {
    assert.equal(ids.has(item.id), false, item.id);
    ids.add(item.id);
    if (item.categoria !== 'especial') assert.ok(categorias.has(item.categoria), item.id);
    if (item.id !== 'presente-surpresa') {
      assert.equal(Number.isInteger(item.precoCentavos) && item.precoCentavos > 0, true, item.id);
    }
    assert.ok(item.qtd === null || (Number.isInteger(item.qtd) && item.qtd > 0), item.id);
  }
  assert.equal(PRESENTES.find((item) => item.id === 'air-fryer').precoCentavos, 52000);
  assert.equal(PRESENTES.find((item) => item.id === 'jogo-toalhas').qtd, 2);
  assert.equal(PRESENTES.find((item) => item.id === 'lm-passagens').qtd, null);
  assert.equal(PRESENTES.find((item) => item.id === 'assistente-voz').descricao, '“Toca a nossa música!”');
  assert.equal(PRESENTES.find((item) => item.id === 'div-conserto').nome, 'Fundo “deixa que eu conserto”');
  assert.equal(PRESENTES.find((item) => item.id === 'div-mapa-geladeira').descricao, '“Amor, cadê o queijo?”');
});
