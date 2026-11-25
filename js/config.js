/* =====================================================================
   MARQUINHOS LANCHES: TODOS OS DADOS EDITÁVEIS DO SITE FICAM AQUI
   Deixe "" no que ainda não tiver: o campo simplesmente não aparece.
   ===================================================================== */
window.CONFIG = {

  /* Número oficial: só dígitos, com 55 + DDD. Formato: "55DDNUMERO" */
  whatsapp: "5513997094871",
  telefone: "(13) 99709-4871",   // como aparece na página
  mensagemPadrao: "Olá, Marquinhos Lanches! Quero fazer um pedido.",

  /* Contato */
  endereco: ["R. Barretos, 147", "Jardim São Paulo", "Registro – SP, 11900-000"],
  horarios: [],            // uma linha por item: ["dias: horário", "dias: horário"]
  mapaLink: "https://maps.google.com/?cid=17700254139603749404",
  mapaEmbed: "https://maps.google.com/maps?q=Marquinhos%20Lanches%2C%20R.%20Barretos%2C%20147%20-%20Jardim%20S%C3%A3o%20Paulo%2C%20Registro%20-%20SP%2C%2011900-000&hl=pt-BR&z=17&output=embed",

  /* Nota no Google: atualize quando mudar. Deixe nota: "" para esconder */
  avaliacao: { nota: "4,8", total: 60 },

  /* Redes sociais: URL completa, começando com https:// */
  redes: {
    Instagram: "",
    Facebook: ""
  },

  /* Texto da seção "Sobre" (um item por parágrafo) */
  sobre: [
    "O Marquinhos Lanches fica no Jardim São Paulo, em Registro, e tem um assunto favorito: lanche feito com capricho.",
    "Aqui o pedido é simples. Você escolhe, a chapa esquenta e o lanche sai do jeito que tem que ser: quente, recheado e com vontade de repetir."
  ],

  /* FOTOS
     1. Coloque o arquivo na pasta "imagens" (ao lado do index.html).
     2. Escreva o caminho em src, por exemplo: "imagens/destaque.webp".
     Use WebP ou JPG comprimido. "recorte: true" = PNG/WebP com fundo
     transparente. Se a foto tiver fundo, troque para "recorte: false"
     e ela ganha moldura arredondada. */
  fotos: {
    destaque:      { src: "imagens/destaque.webp",   alt: "Hambúrguer sobre tábua de madeira com tomates e alface ao fundo" },            // 4:3
    cartaoDourado: { src: "imagens/batata.webp",     alt: "Porção de batatas fritas em cesta de metal" },                                          // 1:1
    jeito:         { src: "imagens/hamburguer.webp", alt: "Hambúrguer alto com queijo, tomate e alface servido no prato" },               // 1:1
    promo:         { src: "imagens/chamada.webp",    alt: "Hambúrguer com gergelim e batatas fritas sobre a mesa" },                      // 16:9, lanche à direita
    sobre:         { src: "imagens/preparo.webp",    alt: "Mãos montando um hambúrguer na cozinha" }                                      // 4:3
  }
};
