(() => {
  "use strict";
  const raiz = document.documentElement;
  const botao = document.getElementById("tema");
  const escuro = () => raiz.dataset.tema === "escuro";
  const rotulo = () => {
    const t = escuro() ? "Ativar modo claro" : "Ativar modo escuro";
    botao.setAttribute("aria-label", t);
    botao.title = t;
  };
  const trocar = () => {
    if (escuro()) delete raiz.dataset.tema; else raiz.dataset.tema = "escuro";
    try { localStorage.setItem("tema", escuro() ? "escuro" : "claro"); } catch (e) { /* sem armazenamento */ }
    rotulo();
  };
  botao.addEventListener("click", () => {
    if (!document.startViewTransition || document.hidden || raiz.classList.contains("calmo")) return trocar();
    const r = botao.getBoundingClientRect();
    raiz.style.setProperty("--tx", r.left + r.width / 2 + "px");
    raiz.style.setProperty("--ty", r.top + r.height / 2 + "px");
    const v = document.startViewTransition(trocar);
    v.ready.catch(() => {}); // sem animação se a página estiver oculta
    v.finished.catch(() => {});
  });
  rotulo();
})();
