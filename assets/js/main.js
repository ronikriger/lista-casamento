import { CONFIG } from './config.js';
import { CATEGORIAS, PRESENTES } from './presentes.js';
import { iniciarSacola } from './sacola.js';
import { buscarResumo, reenviarPendentes } from './api.js';
import { iniciar } from './ui.js';

function verificarCatalogo() {
  const host = location.hostname;
  const dev = host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:';
  if (!dev) return;
  const ids = new Set();
  const categorias = new Set(CATEGORIAS.map((cat) => cat.id));
  let total = 0;
  for (const item of PRESENTES) {
    if (ids.has(item.id)) console.error('ID duplicado:', item.id);
    ids.add(item.id);
    if (item.categoria !== 'especial' && !categorias.has(item.categoria)) {
      console.error('Categoria inválida:', item.id);
    }
    if (item.id === 'presente-surpresa') continue;
    total += 1;
    if (!Number.isInteger(item.precoCentavos) || item.precoCentavos <= 0) {
      console.error('Preço inválido:', item.id);
    }
  }
  if (total !== 177 || !ids.has('presente-surpresa')) {
    console.error('Total de itens do catálogo:', total, '(esperado 177 + presente surpresa)');
  } else {
    console.info('Catálogo OK: 177 presentes + presente surpresa.');
  }
}

verificarCatalogo();
iniciarSacola(PRESENTES);
const app = iniciar();
reenviarPendentes();
buscarResumo().then((resumo) => {
  if (resumo) app.aplicarResumo(resumo);
});
