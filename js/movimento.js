(() => {
  "use strict";
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Preparação dos títulos e benefícios ---------- */
  $$(".titulo").forEach((t) => {
    [...t.childNodes].forEach((n) => {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const s = document.createElement("span");
        s.className = "linha-titulo";
        s.textContent = n.textContent;
        n.replaceWith(s);
      } else if (n.nodeType === 1) n.classList.add("linha-titulo");
    });
  });
  $$(".beneficios li").forEach((li, i) => li.style.setProperty("--n", i));

  /* ---------- Efeito scroll do hero ---------- */
  const TOTAL = 50;                       // quadros em imagens/scroll
  const ACENDE = [.24, .36, .48, .60, .70]; // momento em que cada camada acende
  const hero = document.querySelector(".hero");
  const tela = document.getElementById("filme");
  const ctx = tela.getContext("2d");
  const [cena1, cena2] = $$(".cena");
  const itens = $$(".camadas li");
  const raiz = document.documentElement;
  const calmo = raiz.classList.contains("calmo");
  const botao = document.getElementById("movimento");
  botao.textContent = calmo ? "Ativar movimento" : "Reduzir movimento";
  botao.addEventListener("click", () => {
    try { localStorage.setItem("movimento", calmo ? "1" : "0"); } catch (e) { /* sem armazenamento */ }
    scrollTo(0, 0);
    location.reload();
  });
  const limite = (v) => Math.min(1, Math.max(0, v));

  if (calmo) { cena2.inert = true; return; }

  const pequeno = innerWidth <= 760;
  const quadros = new Array(TOTAL);
  if (pequeno) { tela.width = 854; tela.height = 480; }
  const caminho = (i) => `imagens/scroll/${pequeno ? "p" : "g"}-${String(i + 1).padStart(2, "0")}.webp`;

  let alvo = 0, atual = -1, desenhado = -1, rodando = false;
  const maisPerto = (i) => {
    for (let d = 0; d < TOTAL; d++) {
      if (quadros[i - d]) return i - d;
      if (quadros[i + d]) return i + d;
    }
    return -1;
  };
  const desenhar = () => {
    const i = maisPerto(Math.round(limite((atual - .06) / .76) * (TOTAL - 1)));
    if (i < 0 || i === desenhado) return;
    ctx.drawImage(quadros[i], 0, 0, tela.width, tela.height);
    desenhado = i;
  };
  const aplicar = () => {
    hero.style.setProperty("--p", atual.toFixed(4));
    const fase2 = atual > .2;
    hero.classList.toggle("fase-2", fase2);
    cena1.inert = fase2;
    cena2.inert = !fase2;
    const n = ACENDE.filter((x) => atual >= x).length;
    itens.forEach((li, i) => {
      li.classList.toggle("acesa", i < n);
      li.classList.toggle("atual", i === n - 1 && atual < .84);
    });
    desenhar();
  };
  let antes = 0;
  const passo = (agora) => {
    const dt = antes ? Math.min(agora - antes, 400) : 16;
    antes = agora;
    atual += (alvo - atual) * (1 - Math.exp(-dt / 95)); // suaviza a rolagem
    if (Math.abs(alvo - atual) < .0008) atual = alvo;
    aplicar();
    if (atual !== alvo) requestAnimationFrame(passo); else { rodando = false; antes = 0; }
  };
  const medir = () => {
    const curso = hero.offsetHeight - hero.firstElementChild.offsetHeight;
    alvo = limite(-hero.getBoundingClientRect().top / curso);
    if (atual < 0) { atual = alvo; aplicar(); }
    if (!rodando && atual !== alvo) { rodando = true; requestAnimationFrame(passo); }
  };
  addEventListener("scroll", medir, { passive: true });
  addEventListener("resize", medir);
  medir();

  /* Carrega do grosso para o fino: logo há quadros para todo o percurso */
  const ordem = [];
  (pequeno ? [8, 4, 2] : [8, 4, 2, 1]).forEach((salto) => {
    for (let i = 0; i < TOTAL; i += salto) if (!ordem.includes(i)) ordem.push(i);
  });
  const carregar = () => {
    const i = ordem.shift();
    if (i === undefined) return;
    const img = new Image();
    img.onload = () => { quadros[i] = img; desenhar(); carregar(); };
    img.onerror = carregar;
    img.src = caminho(i);
  };
  for (let k = 0; k < 6; k++) carregar();
})();
