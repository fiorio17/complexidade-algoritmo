/* Dark Patterns — lógica do site */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pad2 = n => String(n).padStart(2, "0");
const byId = id => PADROES.find(p => p.id === id);

/* ---------- Tema, menu, progresso ---------- */
(function () {
  const root = document.documentElement;
  try { const t = localStorage.getItem("dp-theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("#btnTheme").onclick = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("dp-theme", root.dataset.theme); } catch (e) {}
  };
  $("#btnBurger").onclick = () => $("#menu").classList.toggle("open");
  $$("#menu a").forEach(a => a.addEventListener("click", () => $("#menu").classList.remove("open")));

  const bar = $("#progressBar");
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const links = $$("#menu a");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main > section").forEach(s => io.observe(s));

  $$("[data-count]").forEach(el => {
    const to = +el.dataset.count; let n = 0;
    const t = setInterval(() => { n++; el.textContent = n; if (n >= to) clearInterval(t); }, 700 / to);
  });
})();

/* ---------- Modo apresentação ---------- */
(function () {
  const secs = $$("main > section");
  const hint = $("#presHint");
  const cur = () => {
    let best = 0, d = Infinity;
    secs.forEach((s, i) => { const v = Math.abs(s.getBoundingClientRect().top - 56); if (v < d) { d = v; best = i; } });
    return best;
  };
  const go = i => secs[Math.max(0, Math.min(secs.length - 1, i))].scrollIntoView({ behavior: "smooth" });
  const toggle = () => {
    document.body.classList.toggle("pres");
    const on = document.body.classList.contains("pres");
    hint.hidden = !on;
    $("#btnPres").textContent = on ? "■ Sair" : "▶ Apresentar";
    if (on) setTimeout(() => go(cur()), 50);
  };
  $("#btnPres").onclick = toggle;
  addEventListener("keydown", e => {
    if (e.target.closest("input,textarea,select") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.toLowerCase() === "p") { toggle(); return; }
    if (!document.body.classList.contains("pres") || $("#dlg").open) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(cur() + 1); }
    if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(cur() - 1); }
    if (e.key === "Escape") toggle();
  });
})();

/* ---------- Vieses ---------- */
$("#viesGrid").innerHTML = VIESES.map(v => `
  <article class="vies"><div class="ic">${v.icone}</div><h3>${v.nome}</h3><p>${v.desc}</p>
  ${v.usado.map(u => `<span class="tag">${u}</span>`).join("")}</article>`).join("");

/* ---------- Galeria ---------- */
(function () {
  let cat = "todos", q = "";
  const filters = $("#filters"), gal = $("#gallery");
  const chips = [["todos", "Todos (" + PADROES.length + ")"], ...Object.entries(CATEGORIAS).map(([k, v]) => [k, v.nome + " (" + PADROES.filter(p => p.cat === k).length + ")"])];
  filters.innerHTML = chips.map(([k, n]) => `<button class="chip${k === "todos" ? " on" : ""}" data-k="${k}">${n}</button>`).join("");
  filters.onclick = e => {
    const b = e.target.closest(".chip"); if (!b) return;
    cat = b.dataset.k; $$(".chip", filters).forEach(c => c.classList.toggle("on", c === b)); draw();
  };
  $("#search").oninput = e => { q = e.target.value.toLowerCase().trim(); draw(); };

  function draw() {
    const list = PADROES.filter(p => (cat === "todos" || p.cat === cat) &&
      (!q || (p.nome + p.en + p.resumo + p.como + p.exemplo).toLowerCase().includes(q)));
    gal.innerHTML = list.map(p => `
      <button class="gcard" data-id="${p.id}" style="--c:${CATEGORIAS[p.cat].cor}">
        <span class="cat">${CATEGORIAS[p.cat].nome}</span>
        <span class="ic">${p.icone}</span>
        <h3>${p.nome}</h3><small>${p.en}</small>
        <p>${p.resumo}</p>
      </button>`).join("");
    $("#galEmpty").hidden = list.length > 0;
  }
  gal.onclick = e => { const c = e.target.closest(".gcard"); if (c) openDialog(c.dataset.id); };
  draw();

  const dlg = $("#dlg");
  $("#dlgX").onclick = () => dlg.close();
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  window.openDialog = id => {
    const p = byId(id), c = CATEGORIAS[p.cat];
    $("#dlgBody").innerHTML = `
      <div class="dh" style="--c:${c.cor}"><span class="ic">${p.icone}</span>
        <div><h3 id="dlgTitle">${p.nome}</h3><small>${p.en} · ${c.nome}</small></div></div>
      <div class="dl" style="--c:${c.cor}">
        <div><b>Como funciona</b><p>${p.como}</p></div>
        <div><b>Viés explorado</b><p>${p.vies}</p></div>
        <div><b>Efeito no usuário</b><p>${p.efeito}</p></div>
        <div class="jur"><b>Implicação jurídica</b><p>${p.juridico}</p></div>
        <div><b>Exemplo</b><p>${p.exemplo}</p></div>
      </div>
      ${p.demo ? `<p style="margin:18px 0 0"><button class="btn" id="goDemo">Ver demonstração interativa →</button></p>` : ""}`;
    if (p.demo) $("#goDemo").onclick = () => { dlg.close(); selectDemo(p.demo); $("#demos").scrollIntoView({ behavior: "smooth" }); };
    dlg.showModal();
  };
})();

/* ---------- Demos ---------- */
const DEMOS = [
  {
    id: "urgencia", titulo: "🛍️ Loja: urgência e escassez", tags: ["Falsa urgência", "Falsa escassez", "Prova social falsa"],
    law: "CDC art. 37, §1º: publicidade enganosa. Art. 30: a oferta veiculada obriga o fornecedor.",
    notes: {
      dark: ["O relógio <b>reinicia</b> quando chega a zero (aqui acelerado: 15 s).", "“Apenas 2 em estoque” e “pessoas vendo agora” são números fabricados.", "Notificações de “compras recentes” são geradas por script.", "Preço “de” inflado dá a impressão de grande desconto."],
      ethical: ["Sem cronômetro: o preço é o mesmo todos os dias.", "Estoque e prazos reais.", "Avaliações verificadas.", "O usuário decide no seu tempo."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      el.innerHTML = `<div class="mock"><div class="bar">SuperTênis.com <span>🛒 0 itens</span></div>
        <div class="shoe">👟</div><h3>Tênis Corredor X</h3>
        <div class="price">R$ 199,90 ${dark ? "<s>R$ 599,90</s>" : ""}</div>
        ${dark ? `<p><span class="pill r" id="timer">⏳ Oferta termina em 00:15</span></p>
          <p><span class="pill y">🔥 Apenas 2 em estoque!</span> <span class="pill y" id="view">👀 17 pessoas vendo agora</span></p>`
          : `<p><span class="pill g">✔ Em estoque</span> Entrega em 3–5 dias úteis</p><p>Preço igual todos os dias · ★ 4,3 (128 avaliações verificadas)</p>`}
        <button class="mbtn go full" id="buy" style="margin-top:10px">Comprar agora</button><div id="out"></div></div>`;
      const t0 = Date.now(); let secs = 15, resets = 0, viewers = 17;
      const m = () => ctx.metrics(dark ? [["Reinícios do relógio", resets], ["Dados reais por trás", "nenhum"]] : [["Pressão artificial", "nenhuma"]]);
      m();
      if (dark) {
        ctx.every(1000, () => {
          secs--; if (secs < 0) { secs = 15; resets++; m(); }
          $("#timer", el).textContent = `⏳ Oferta termina em 00:${pad2(secs)}`;
        });
        ctx.every(2500, () => { viewers = Math.max(9, viewers + Math.round(Math.random() * 6 - 3)); $("#view", el).textContent = `👀 ${viewers} pessoas vendo agora`; });
        const nomes = ["Maria, de Curitiba", "Carlos, de Porto Alegre", "Ana, de São Paulo", "João, de Recife"];
        ctx.every(5000, () => {
          $$(".toast", el).forEach(x => x.remove());
          el.querySelector(".mock").insertAdjacentHTML("beforeend", `<div class="toast">🛍️ ${nomes[Math.floor(Math.random() * nomes.length)]} comprou há ${1 + Math.floor(Math.random() * 5)} min</div>`);
        });
      }
      $("#buy", el).onclick = () => {
        const s = Math.round((Date.now() - t0) / 1000);
        $("#out", el).innerHTML = dark
          ? `<div class="result">Você decidiu em ${s} s, sem comparar preços. Era a pressão do design, não a necessidade.</div>`
          : `<div class="result good">Compra simulada. Sem pressão: você poderia ter levado o tempo que quisesse.</div>`;
      };
    }
  },
  {
    id: "popup", titulo: "📩 Pop-up de newsletter", tags: ["Confirmshaming", "Interferência visual"],
    law: "LGPD art. 5º, XII e art. 8º: o consentimento deve ser livre; constranger o usuário compromete essa liberdade.",
    notes: {
      dark: ["Botão <b>verde grande</b> para aceitar; recusa em <b>cinza 11 px</b>.", "Texto de recusa envergonha: “prefiro pagar mais caro”.", "O “X” de fechar é quase invisível (cor #e8e8e8 sobre branco).", "Tente fechar o pop-up e veja quantos cliques são necessários."],
      ethical: ["Duas opções com o <b>mesmo peso visual</b>.", "Texto de recusa neutro: “Agora não”.", "Botão de fechar visível e clicável.", "Benefício descrito com clareza."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      const open = () => {
        el.innerHTML = `<div class="mock"><div class="bar">Portal Notícias <span>Hoje</span></div>
          <h3>Como economizar na conta de luz em 2026</h3><p>Especialistas listam 7 dicas simples para reduzir o consumo sem abrir mão do conforto…</p>
          <p style="color:#999">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <div class="overlay"><div class="modal ${dark ? "" : "fair"}">
            <button class="x" id="px" aria-label="Fechar">✕</button>
            <h3>${dark ? "🎁 Ganhe 10% OFF agora!" : "Receba nossas novidades"}</h3>
            <p>${dark ? "Cadastre seu e-mail e receba ofertas exclusivas todos os dias." : "Enviamos 1 e-mail por semana. Cancele quando quiser."}</p>
            ${dark ? `<button class="mbtn go full" id="pyes" style="font-size:1.1rem;padding:16px">QUERO ECONOMIZAR!</button>
              <button class="mlink" id="pno">Não, obrigado. Prefiro pagar mais caro</button>`
              : `<div class="row"><button class="mbtn blue" id="pyes">Assinar</button><button class="mbtn line" id="pno">Agora não</button></div>`}
          </div></div></div>`;
        const done = (txt, good) => {
          el.innerHTML = `<div class="mock"><div class="bar">Portal Notícias <span>Hoje</span></div><h3>Como economizar na conta de luz em 2026</h3>
          <div class="result ${good ? "good" : ""}">${txt}</div><p style="margin-top:14px"><button class="mbtn line" id="reopen">Reabrir pop-up</button></p></div>`;
          $("#reopen", el).onclick = () => { ctx.clicks = -1; open(); ctx.metrics(base()); };
          ctx.metrics(base());
        };
        $("#pyes", el).onclick = () => done("Você entregou seu e-mail e passará a receber mensagens diárias.", false);
        $("#pno", el).onclick = () => done("Pop-up dispensado.", true);
        $("#px", el).onclick = () => done("Pop-up fechado pelo “X”.", true);
      };
      const base = () => [["Cliques dados", ctx.clicks], ["Tamanho do “X”", dark ? "11 px" : "18 px"]];
      ctx.onclick = () => ctx.metrics(base());
      open(); ctx.metrics(base());
    }
  },
  {
    id: "checkout", titulo: "🎧 Checkout: pré-seleção e linguagem confusa", tags: ["Pré-seleção", "Inserção sorrateira", "Linguagem confusa"],
    law: "LGPD art. 8º §4º e art. 9º §1º; CDC art. 39, III (fornecimento de serviço sem solicitação).",
    notes: {
      dark: ["Seguro e garantia já vêm <b>marcados</b> (inserção sorrateira + efeito padrão).", "Compartilhar dados com “parceiros” vem marcado.", "A última opção usa <b>dupla negação</b>: o que significa desmarcar?", "Tente chegar ao menor total possível."],
      ethical: ["Nada marcado por padrão: o usuário escolhe.", "Cada opção diz claramente o que faz e quanto custa.", "Marketing é <b>opt-in</b> opcional, descrito sem ambiguidade."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark", base = 189.9;
      const opts = [
        { id: "seg", t: "Seguro de entrega", d: "R$ 29,90", v: 29.9 },
        { id: "gar", t: "Garantia estendida (2 anos)", d: "R$ 49,90", v: 49.9 },
        { id: "par", t: dark ? "Compartilhar meus dados com parceiros" : "Compartilhar meus dados com empresas parceiras (opcional)", d: dark ? "Grátis" : "Grátis. Você pode recusar", v: 0 },
        { id: "mkt", t: dark ? "Desmarque esta caixa se você não deseja deixar de não receber ofertas" : "Quero receber ofertas por e-mail (opcional)", d: "", v: 0 }
      ];
      el.innerHTML = `<div class="mock"><div class="bar">AudioLoja <span>Passo 3 de 3</span></div>
        <h3>🎧 Fone Bluetooth Pro</h3><p>R$ ${brl(base).replace("R$", "").trim()}</p>
        ${opts.map(o => `<label class="optrow"><input type="checkbox" id="o_${o.id}" ${dark && o.id !== "mkt" ? "checked" : ""} ${dark && o.id === "mkt" ? "checked" : ""}>
          <span>${o.t}<small>${o.d}</small></span></label>`).join("")}
        <div class="sum"><span>Total</span><span id="tot"></span></div>
        <button class="mbtn go full" id="fin" style="margin-top:12px">Finalizar compra</button><div id="out"></div></div>`;
      const calc = () => {
        const sel = opts.filter(o => $("#o_" + o.id, el).checked);
        const extra = sel.reduce((s, o) => s + o.v, 0);
        $("#tot", el).textContent = brl(base + extra);
        ctx.metrics([["Total", brl(base + extra)], ["Extras", brl(extra)], ["Dados compartilhados", $("#o_par", el).checked ? "sim" : "não"]]);
        return { sel, extra };
      };
      el.onchange = calc;
      calc();
      $("#fin", el).onclick = () => {
        const { sel, extra } = calc();
        const par = sel.some(o => o.id === "par"), mkt = sel.some(o => o.id === "mkt");
        const msg = `Você pagou ${brl(base + extra)}` + (extra ? `, incluindo ${brl(extra)} em extras` : ", sem extras") +
          `. Dados compartilhados com parceiros: <b>${par ? "sim" : "não"}</b>. Ofertas por e-mail: <b>${mkt ? "sim" : "não"}</b>.`;
        $("#out", el).innerHTML = `<div class="result ${extra || par ? "" : "good"}">${msg}</div>`;
      };
    }
  },
  {
    id: "cancelar", titulo: "🔁 Cancelar assinatura", tags: ["Difícil de cancelar", "Obstrução"],
    law: "CDC art. 39, V e art. 51; Decreto 7.962/2013 (atendimento facilitado). Cancelar deve ser tão fácil quanto contratar.",
    notes: {
      dark: ["Assinar levou <b>1 clique</b>. Cancelar leva muito mais.", "O botão “Cancelar” é um <b>link cinza minúsculo</b>.", "Cada tela tenta reverter a decisão (culpa, oferta, pesquisa).", "No fim, é preciso <b>ligar</b> em horário comercial: canal diferente do de contratação."],
      ethical: ["Um botão claro “Cancelar assinatura”.", "Uma confirmação, com data de fim do acesso.", "Sem pesquisa obrigatória, sem telefone."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      let step = 0;
      const shell = (inner, n, tot) => `<div class="mock"><div class="bar">StreamMax <span>Minha conta</span></div>
        <div class="steps">${Array.from({ length: tot }, (_, i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</div>${inner}</div>`;
      const draw = () => {
        let h = "";
        if (!dark) {
          if (step === 0) h = shell(`<h3>Plano Premium</h3><p>R$ 39,90/mês · renova em 02/11</p><button class="mbtn red" id="a">Cancelar assinatura</button>`, 0, 2);
          else if (step === 1) h = shell(`<h3>Confirmar cancelamento?</h3><p>Você mantém o acesso até 02/11.</p><div class="row"><button class="mbtn red" id="a">Confirmar</button><button class="mbtn line" id="b">Voltar</button></div>`, 1, 2);
          else h = `<div class="mock"><div class="result good"><b>Assinatura cancelada.</b> Acesso até 02/11. Um e-mail de confirmação foi enviado.</div><p style="margin-top:14px"><button class="mbtn line" id="r">Reiniciar</button></p></div>`;
        } else {
          if (step === 0) h = shell(`<h3>Plano Premium</h3><p>R$ 39,90/mês · renova em 02/11</p><button class="mbtn go full" id="b" style="padding:16px">Manter meu plano 💚</button><button class="mlink" id="a">cancelar assinatura</button>`, 0, 5);
          else if (step === 1) h = shell(`<h3>Tem certeza? 😢</h3><p>Você vai perder: seus perfis, suas listas, downloads offline e <b>todo o seu histórico</b>.</p><button class="mbtn go full" id="b">Continuar com Premium</button><button class="mlink" id="a">prosseguir com o cancelamento</button>`, 1, 5);
          else if (step === 2) h = shell(`<h3>🎉 Oferta exclusiva!</h3><p>50% de desconto por 3 meses.</p><button class="mbtn go full" id="b">Aceitar oferta</button><button class="mlink" id="a">não, quero cancelar mesmo assim</button>`, 2, 5);
          else if (step === 3) h = shell(`<h3>Pesquisa de saída (obrigatória)</h3><p>Por que você está saindo?</p>
            <label class="optrow"><input type="radio" name="w"> Preço</label><label class="optrow"><input type="radio" name="w"> Falta de conteúdo</label><label class="optrow"><input type="radio" name="w"> Outro</label>
            <button class="mbtn blue full" id="a" disabled>Enviar e continuar</button>`, 3, 5);
          else if (step === 4) h = shell(`<h3>Quase lá!</h3><p>Para concluir o cancelamento, ligue para <b>0800 000 0000</b> (seg–sex, 9h–17h) e informe seu CPF.</p><button class="mbtn go full" id="b">Voltar à minha conta</button>`, 4, 5);
          else h = `<div class="mock"><p>Você voltou ao início.</p><button class="mbtn line" id="r">Reiniciar</button></div>`;
        }
        el.innerHTML = h;
        const A = $("#a", el), B = $("#b", el), R = $("#r", el);
        if (dark && step === 3) { el.onchange = () => { A.disabled = false; }; }
        if (A) A.onclick = () => { step++; draw(); };
        if (B) B.onclick = () => { step = dark ? 5 : 0; draw(); };
        if (R) R.onclick = () => { step = 0; ctx.clicks = -1; draw(); };
        ctx.metrics([["Cliques", ctx.clicks], ["Etapa", dark ? Math.min(step + 1, 5) + " / 5" : Math.min(step + 1, 2) + " / 2"], ["Concluído?", dark ? "não, exige ligar" : step >= 2 ? "sim" : "—"]]);
      };
      draw();
      ctx.onclick = () => ctx.metrics([["Cliques", ctx.clicks], ["Etapa", dark ? Math.min(step + 1, 5) + " / 5" : Math.min(step + 1, 2) + " / 2"], ["Concluído?", dark ? "não, exige ligar" : step >= 2 ? "sim" : "—"]]);
    }
  },
  {
    id: "custos", titulo: "🎫 Ingresso: custos ocultos", tags: ["Custos ocultos", "Ancoragem"],
    law: "CDC art. 6º, III e art. 31; Decreto 7.962/2013, art. 2º: preço total e despesas adicionais devem ser informados claramente.",
    notes: {
      dark: ["O preço anunciado é <b>R$ 120</b>.", "Taxas surgem uma a uma, em letras pequenas, nas etapas seguintes.", "No final, o usuário já investiu tempo (<b>custo afundado</b>) e tende a pagar.", "Clique em “Continuar” para ver o preço evoluir."],
      ethical: ["O valor total (R$ 175,00) aparece <b>desde o início</b>, com detalhamento.", "Sem surpresas no pagamento."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      const fees = [["Taxa de serviço", 22.5], ["Taxa de conveniência", 15], ["Taxa de processamento", 9.9], ["Entrega digital", 7.6]];
      const total = 120 + fees.reduce((s, f) => s + f[1], 0);
      let step = 0;
      const draw = () => {
        const shown = dark ? 120 : total;
        const lines = [];
        lines.push(`<div class="tgl"><span>Ingresso Show Nacional (setor B)</span><b>${brl(120)}</b></div>`);
        if (!dark || step >= 1) fees.slice(0, dark ? 1 : 4).forEach(f => lines.push(`<div class="tgl"><span style="${dark ? "font-size:.7rem;color:#999" : ""}">${f[0]}</span><b style="${dark ? "font-size:.75rem;color:#999;font-weight:400" : ""}">${brl(f[1])}</b></div>`));
        if (!dark) { /* tudo já listado */ }
        else if (step >= 2) fees.slice(1).forEach(f => lines.push(`<div class="tgl"><span style="font-size:.7rem;color:#999">${f[0]}</span><b style="font-size:.75rem;color:#999;font-weight:400">${brl(f[1])}</b></div>`));
        const showTotal = !dark || step >= 2 ? total : (step === 1 ? 120 + 22.5 : 120);
        const last = step >= 2;
        el.innerHTML = `<div class="mock"><div class="bar">Ingressos.com <span>Etapa ${Math.min(step + 1, 3)} de 3</span></div>
          <div class="price">${dark && !last ? brl(shown) : brl(showTotal)}${dark && !last ? "" : ""} <small style="font-size:.8rem;color:#777;font-weight:400">${dark ? "" : "total, já com taxas"}</small></div>
          ${lines.join("")}
          ${last || !dark ? `<div class="sum"><span>Total a pagar</span><span>${brl(total)}</span></div>` : ""}
          ${step < 2 ? `<button class="mbtn go full" id="n" style="margin-top:14px">Continuar</button>` : `<button class="mbtn go full" id="n" style="margin-top:14px">Pagar ${brl(total)}</button>`}
          <div id="out"></div></div>`;
        ctx.metrics([["Preço no início", brl(dark ? 120 : total)], ["Preço final", brl(total)], ["Acréscimo", dark ? "+" + (Math.round(((total / 120) - 1) * 1000) / 10).toString().replace(".", ",") + "%" : "0%"]]);
        $("#n", el).onclick = () => {
          if (step < 2) { step++; draw(); return; }
          const pct = Math.round(((total / 120) - 1) * 1000) / 10;
          $("#out", el).innerHTML = dark
            ? `<div class="bars"><div style="background:#1a8f3c;width:${120 / total * 100}%">Anunciado ${brl(120)}</div><div style="background:#e4572e;width:100%">Pago ${brl(total)} (+${String(pct).replace(".", ",")}%)</div></div><div class="result">O preço “de vitrine” era ${String(pct).replace(".", ",")}% menor do que o realmente cobrado.</div>`
            : `<div class="result good">Pago exatamente o valor visto desde o início: ${brl(total)}.</div>`;
        };
      };
      draw();
    }
  },
  {
    id: "cookies", titulo: "🍪 Banner de cookies", tags: ["Privacy Zuckering", "Interferência visual", "Insistência"],
    law: "LGPD art. 7º–9º; Guia de Cookies da ANPD: rejeitar deve ser tão simples quanto aceitar; sem pré-marcação.",
    notes: {
      dark: ["<b>Aceitar</b>: 1 clique, botão azul enorme.", "<b>Recusar</b> não existe: só “Configurar” em texto pequeno.", "O painel traz <b>12 finalidades já ativadas</b>: é preciso desligar uma a uma.", "Meça: quantos cliques para recusar tudo?"],
      ethical: ["“Aceitar” e “Rejeitar” lado a lado, mesmo peso visual.", "Só cookies estritamente necessários vêm ativos.", "Personalizar é opcional."]
    },
    render(mode, el, ctx) {
      const dark = mode === "dark";
      const cats = ["Estatísticas", "Publicidade personalizada", "Perfilamento de interesses", "Compartilhamento com parceiros", "Mapas de calor", "Redes sociais", "Geolocalização", "Teste A/B", "Remarketing", "Análise de comportamento", "Identificação entre dispositivos", "Vendas a terceiros"];
      const page = (inner) => `<div class="mock"><div class="bar">Portal Notícias <span>Hoje</span></div><h3>Resultados do campeonato</h3><p>Confira os melhores momentos da rodada e a tabela atualizada…</p><p style="color:#999">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>${inner}</div>`;
      const metr = (extra) => ctx.metrics([["Cliques dados", ctx.clicks], ["Para aceitar", "1 clique"], ["Para recusar", dark ? "≥ 14 cliques" : "1 clique"], ...(extra || [])]);
      const banner = () => {
        el.innerHTML = page(dark
          ? `<div class="cookie"><p style="margin:0 0 10px;font-size:.85rem">Usamos cookies para melhorar sua experiência e personalizar anúncios.</p>
              <button class="mbtn blue full" id="ac" style="padding:14px">ACEITAR TODOS</button><button class="mlink" id="cf">configurar preferências</button></div>`
          : `<div class="cookie"><p style="margin:0 0 10px;font-size:.85rem">Usamos cookies essenciais para o site funcionar. Os demais só com sua permissão.</p>
              <div class="row"><button class="mbtn blue" id="ac">Aceitar todos</button><button class="mbtn blue" id="rj">Rejeitar</button><button class="mbtn line" id="cf">Personalizar</button></div></div>`);
        $("#ac", el).onclick = () => end("Você consentiu com <b>12 finalidades</b> (incluindo venda a terceiros) com apenas 1 clique.", false);
        if ($("#rj", el)) $("#rj", el).onclick = () => end("Você recusou todos os cookies opcionais com 1 clique.", true);
        $("#cf", el).onclick = panel;
        metr();
      };
      const panel = () => {
        el.innerHTML = page(`<div class="cookie panel"><b>Preferências de privacidade</b>
          ${cats.map((c, i) => `<div class="tgl"><span>${c}</span><input type="checkbox" class="tg" ${dark ? "checked" : ""}></div>`).join("")}
          ${dark ? `<button class="mbtn blue full" id="sv" style="margin-top:10px;padding:14px">ACEITAR E FECHAR</button><button class="mlink" id="sv2">salvar minhas escolhas</button>`
            : `<button class="mbtn blue full" id="sv2" style="margin-top:10px">Salvar minhas escolhas</button>`}</div>`);
        if (dark) $("#sv", el).onclick = () => end("Você acabou aceitando tudo ao clicar no botão grande e colorido.", false);
        $("#sv2", el).onclick = () => {
          const on = $$(".tg", el).filter(x => x.checked).length;
          end(on ? `Você salvou com <b>${on} finalidades ainda ativas</b>.` : `Você recusou tudo, após <b>${ctx.clicks} cliques</b>.`, !on);
        };
        metr();
      };
      const end = (msg, good) => {
        el.innerHTML = page(`<div class="result ${good ? "good" : ""}">${msg}</div><p style="margin-top:12px"><button class="mbtn line" id="rs">Reiniciar</button></p>`);
        $("#rs", el).onclick = () => { ctx.clicks = -1; banner(); };
        metr();
      };
      ctx.onclick = () => metr();
      banner();
    }
  }
];

let demoCur = DEMOS[0].id, demoMode = "dark", timers = [];
const ctx = {
  clicks: 0, onclick: null,
  every(ms, fn) { timers.push(setInterval(fn, ms)); },
  metrics(list) { $("#metrics").innerHTML = list.map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join(""); }
};

function selectDemo(id) { demoCur = id; mountDemo(); }

function mountDemo() {
  timers.forEach(clearInterval); timers = [];
  ctx.clicks = 0; ctx.onclick = null;
  const d = DEMOS.find(x => x.id === demoCur);
  $$(".dtab").forEach(t => t.classList.toggle("on", t.dataset.id === demoCur));
  $$("#modeSwitch button").forEach(b => b.classList.toggle("on", b.dataset.mode === demoMode));
  const n = d.notes[demoMode];
  $("#notes").innerHTML = `<h4>${demoMode === "dark" ? "😈 O que a tela está fazendo" : "😇 O que muda na versão ética"}</h4>
    <ul>${n.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="metric" id="metrics"></div>
    <div>${d.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    <p class="law"><b>⚖️ Base jurídica:</b> ${d.law}</p>`;
  const stage = $("#stage");
  stage.onchange = null;
  stage.onclick = e => { if (e.target.closest("button,input")) { ctx.clicks++; if (ctx.onclick) ctx.onclick(); } };
  d.render(demoMode, stage, ctx);
}

$("#demoTabs").innerHTML = DEMOS.map(d => `<button class="dtab" role="tab" data-id="${d.id}">${d.titulo}</button>`).join("");
$("#demoTabs").onclick = e => { const b = e.target.closest(".dtab"); if (b) selectDemo(b.dataset.id); };
$("#modeSwitch").onclick = e => { const b = e.target.closest("button"); if (b) { demoMode = b.dataset.mode; mountDemo(); } };
$("#demoReset").onclick = mountDemo;
mountDemo();

/* ---------- Jurídico ---------- */
(function () {
  const tabs = $("#leiTabs"), body = $("#leiBody");
  tabs.innerHTML = Object.entries(LEIS).map(([k, v], i) => `<button class="dtab${i ? "" : " on"}" data-k="${k}">${v.titulo}</button>`).join("");
  const show = k => {
    const l = LEIS[k];
    body.innerHTML = `<p class="note" style="max-width:780px">${l.intro}</p><div class="leis">${l.itens.map(i => `
      <div class="lei"><div class="art">${i.art}</div><div><p>${i.txt}</p>${i.pad.map(p => `<span class="tag">${p}</span>`).join("")}</div></div>`).join("")}</div>`;
    $$(".dtab", tabs).forEach(t => t.classList.toggle("on", t.dataset.k === k));
  };
  tabs.onclick = e => { const b = e.target.closest(".dtab"); if (b) show(b.dataset.k); };
  show("lgpd");
})();

/* ---------- Quiz ---------- */
(function () {
  const box = $("#quizBox");
  let i = 0, score = 0;
  const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  function ask() {
    if (i >= QUIZ.length) {
      const msg = score >= 8 ? "Olhar treinado: nenhum dark pattern te engana!" : score >= 5 ? "Bom! Mas alguns ainda passam batido." : "É por isso que dark patterns funcionam: são projetados para não serem notados.";
      box.innerHTML = `<div class="q-end"><p>Seu resultado</p><div class="big">${score} / ${QUIZ.length}</div><p>${msg}</p><button class="btn" id="qr">Refazer</button></div>`;
      $("#qr").onclick = () => { i = 0; score = 0; ask(); };
      return;
    }
    const q = QUIZ[i];
    const opts = shuffle([byId(q.resp), ...shuffle(PADROES.filter(p => p.id !== q.resp)).slice(0, 3)]);
    box.innerHTML = `<div class="q-meta"><span>Pergunta ${i + 1} de ${QUIZ.length}</span><span>Acertos: ${score}</span></div>
      <div class="q-scene">${q.cena}</div>
      <div class="q-opts">${opts.map(o => `<button class="q-opt" data-id="${o.id}">${o.icone} ${o.nome}</button>`).join("")}</div>
      <div id="qfb"></div>`;
    $$(".q-opt", box).forEach(b => b.onclick = () => {
      const ok = b.dataset.id === q.resp;
      if (ok) score++;
      $$(".q-opt", box).forEach(x => { x.disabled = true; if (x.dataset.id === q.resp) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      $("#qfb").innerHTML = `<div class="q-fb"><b>${ok ? "✔ Correto!" : "✘ Não foi dessa vez."}</b> ${q.expl}<p style="margin:12px 0 0"><button class="btn" id="qn">${i + 1 < QUIZ.length ? "Próxima →" : "Ver resultado"}</button></p></div>`;
      $("#qn").onclick = () => { i++; ask(); };
    });
  }
  ask();
})();
