// assets/js/config.js
export const CONFIG = {
  // --- Casal ---
  noiva: 'Patricia',                 // ex.: 'Ana'
  noivo: 'Marcio',                   // ex.: 'Carlos'
  dataCasamento: 'AAAA-MM-DD',       // ex.: '2027-03-20'

  // --- Evento (opcional: se vazio, a seção "O grande dia" não aparece) ---
  horario: '',                       // ex.: '16h30'
  localNome: '',                     // ex.: 'Espaço Jardim das Flores'
  localEndereco: '',                 // ex.: 'Rua das Acácias, 123 – São Paulo, SP'
  localMapaUrl: '',                  // link do Google Maps

  // --- Textos (opcional: se vazio, usa o texto padrão do §11) ---
  mensagemBoasVindas: '',
  historia: '',                      // "Nossa história" – se vazio, a seção não aparece
  fotoCasal: '',                     // ex.: 'assets/img/casal.jpg' – se vazio, mostra monograma

  // --- PIX (obrigatório) ---
  pix: {
    chave: '+55 11 99969-2929',
    tipo: 'telefone',                // 'aleatoria' | 'email' | 'telefone' | 'cpf' | 'cnpj'
    nomeTitular: 'NOME_DO_TITULAR',  // nome completo da conta que recebe
    cidadeTitular: 'CIDADE_DO_TITULAR',
    descricao: '',                   // opcional; deixe vazio para máxima compatibilidade
  },

  // --- Backend de confirmações (opcional; ver §9) ---
  appsScriptUrl: '',                 // URL do Web App do Google Apps Script
  muralAtivo: true,

  // --- Outros ---
  valorLivre: { minimo: 10, maximo: 50000 },   // em reais
  pagamentoExterior: '',             // texto livre para quem está fora do Brasil; vazio = oculto
  credito: '',                       // ex.: 'Feito com 💛 pelo Roni' – vazio = oculto
  siteUrl: 'https://USUARIO.github.io/REPOSITORIO/',
};
