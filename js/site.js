(() => {
  "use strict";
  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    n.append(...kids);
    return n;
  };
  const numero = String(C.whatsapp || "").replace(/\D/g, "");
  const linkZap = (msg) => `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
  const https = (u) => /^https:\/\//.test(u || "");

  /* ---------- Fotos e espaços provisórios ---------- */
  const provisoria = (icone) => {
    const d = el("div", { className: "provisoria" });
    d.setAttribute("aria-hidden", "true");
    d.innerHTML = `<svg viewBox="0 0 200 180"><use href="#${icone}"/></svg><span>Espaço para foto</span>`;
    return d;
  };
  const montarFoto = (alvo, foto, icone) => {
    const semFoto = () => {
      alvo.classList.remove("com-recorte", "com-foto", "com-prato");
      alvo.prepend(provisoria(icone));
    };
    if (!foto || !foto.src) return semFoto();
    const img = el("img", { alt: foto.alt || "", decoding: "async", loading: "lazy" });
    img.addEventListener("error", () => { img.remove(); semFoto(); }, { once: true });
    img.src = foto.src;
    alvo.classList.add("com-foto");
    alvo.classList.toggle("com-recorte", !!foto.recorte);
    alvo.classList.toggle("com-prato", !!foto.prato);
    alvo.prepend(img);
  };
  $$("[data-foto]").forEach((a) =>
    montarFoto(a, C.fotos[a.dataset.foto], a.dataset.icone || "i-burger"));

  /* ---------- Contato, sobre e redes ---------- */
  $("#texto-sobre").replaceChildren(...C.sobre.map((t) => el("p", { textContent: t })));
  const linhas = (id, itens) => {
    const alvo = $(id);
    if (!itens.length) { (alvo.closest("dl > div") || alvo).hidden = true; return; }
    alvo.replaceChildren(...itens.map((t) => el("span", { className: "linha", textContent: t })));
  };
  const fora = (href, texto) => el("a", { href, target: "_blank", rel: "noopener", textContent: texto });
  linhas("#endereco", C.endereco);
  linhas("#horarios", C.horarios);
  linhas("#rodape-endereco", C.endereco.length ? [C.endereco.join(", ")] : []);
  linhas("#telefone", []);
  if (C.telefone) {
    $("#telefone").parentElement.hidden = false;
    $("#telefone").replaceChildren(el("a", { href: "tel:+" + numero, textContent: C.telefone }));
    $("#rodape-zap").replaceChildren(el("a", { href: "tel:+" + numero, textContent: C.telefone }));
  }
  $$("[data-mapa]").forEach((a) => { if (https(C.mapaLink)) a.href = C.mapaLink; else a.hidden = true; });
  $$("[data-nota]").forEach((a) => {
    if (!C.avaliacao.nota) { a.hidden = true; return; }
    a.querySelector("b").textContent = C.avaliacao.nota;
    a.querySelector("span").textContent = `${C.avaliacao.total} avaliações no Google`;
  });
  if (/^https:\/\/(www|maps)\.google\.com\/maps/.test(C.mapaEmbed)) {
    $("#mapa").replaceChildren(el("iframe", {
      src: C.mapaEmbed, title: "Mapa do Marquinhos Lanches em Registro, SP", loading: "lazy",
      referrerPolicy: "no-referrer-when-downgrade" }));
  }
  Object.entries(C.redes).filter(([, url]) => https(url))
    .forEach(([nome, url]) => $("#redes").append(el("li", {}, fora(url, nome))));
  $("#ano").textContent = new Date().getFullYear();

  /* ---------- Menu e cabeçalho ---------- */
  const topo = $("#topo"), alternar = $("#alternar-menu");
  const menu = (aberto) => {
    topo.classList.toggle("menu-aberto", aberto);
    alternar.setAttribute("aria-expanded", String(aberto));
    alternar.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  };
  alternar.addEventListener("click", () => menu(!topo.classList.contains("menu-aberto")));
  $$("#menu a").forEach((a) => a.addEventListener("click", () => menu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && topo.classList.contains("menu-aberto")) { menu(false); alternar.focus(); }
  });
  document.addEventListener("click", (e) => { if (!topo.contains(e.target)) menu(false); });

  /* ---------- Pedidos ---------- */
  const aviso = $("#aviso-zap");
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pedido]");
    if (!b) return;
    e.preventDefault();
    menu(false);
    if (numero) window.open(linkZap(b.dataset.pedido || C.mensagemPadrao), "_blank", "noopener");
    else aviso.showModal();
  });
  aviso.addEventListener("click", (e) => { if (e.target === aviso || e.target.closest("[data-fechar]")) aviso.close(); });

  /* Seção atual no menu e fundo do cabeçalho */
  const links = $$("#menu a");
  const secoes = links.map((a) => $(a.getAttribute("href")));
  let pendente = false;
  const aoRolar = () => {
    pendente = false;
    topo.classList.toggle("rolou", scrollY > 24);
    let atual = 0;
    secoes.forEach((s, i) => { if (s.getBoundingClientRect().top <= innerHeight * 0.35) atual = i; });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) atual = secoes.length - 1;
    links.forEach((a, i) => i === atual ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
  };
  addEventListener("scroll", () => { if (!pendente) { pendente = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  aoRolar();

  /* ---------- Entrada dos elementos ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".surge").forEach((n) => io.observe(n));
})();
