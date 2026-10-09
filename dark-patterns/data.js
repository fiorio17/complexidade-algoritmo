/* Dados do site — Dark Patterns */

const CATEGORIAS = {
  pressao:   { nome: "Pressão e urgência", cor: "#ff7a45" },
  obstrucao: { nome: "Obstrução e fricção", cor: "#b37bff" },
  engano:    { nome: "Engano e ocultação", cor: "#ffc53d" },
  dados:     { nome: "Dados e privacidade", cor: "#36cfc9" }
};

const PADROES = [
  {
    id: "falsa-urgencia", nome: "Falsa urgência", en: "Fake urgency", cat: "pressao", icone: "⏳",
    resumo: "Cronômetros e prazos inventados para forçar uma decisão rápida.",
    como: "A interface mostra uma contagem regressiva ou um aviso de “oferta acaba hoje” que, na prática, reinicia ou nunca expira. O usuário acredita que precisa decidir agora.",
    vies: "Aversão à perda e desconto hiperbólico: tememos perder uma oportunidade mais do que valorizamos o ganho equivalente.",
    efeito: "Compra por impulso, menos tempo para comparar preços, arrependimento posterior.",
    juridico: "CDC art. 37 (publicidade enganosa) e art. 39, IV (prevalecer-se da fraqueza ou ignorância do consumidor). Oferta divulgada obriga o fornecedor (art. 30).",
    exemplo: "“Oferta termina em 09:59” — ao zerar, o relógio volta para 10:00.",
    demo: "urgencia"
  },
  {
    id: "falsa-escassez", nome: "Falsa escassez", en: "Fake scarcity", cat: "pressao", icone: "📉",
    resumo: "“Restam só 2 unidades!” quando o estoque é amplo.",
    como: "Mensagens de baixo estoque ou de alta demanda (“17 pessoas vendo agora”) são geradas aleatoriamente ou sem relação com dados reais.",
    vies: "Heurística da escassez: o que é raro parece mais valioso. Reforçada pelo efeito manada.",
    efeito: "Pressa, decisão sem pesquisa, percepção de valor inflada.",
    juridico: "CDC art. 37 §1º (informação falsa ou capaz de induzir a erro sobre característica do produto) e art. 6º, III (informação adequada e clara).",
    exemplo: "Hotel mostra “Só 1 quarto restante!” — mas é o último daquele tipo no site, não no hotel.",
    demo: "urgencia"
  },
  {
    id: "prova-social", nome: "Prova social falsa", en: "Fake social proof", cat: "pressao", icone: "👥",
    resumo: "Avaliações, notificações de compra e números de usuários fabricados.",
    como: "Pop-ups de “Maria acabou de comprar”, avaliações inventadas ou contadores de usuários inflados criam a impressão de que todo mundo já aderiu.",
    vies: "Efeito manada (herd effect) e viés de autoridade: seguimos o que parece ser a escolha da maioria.",
    efeito: "Confiança indevida em produto/serviço, decisão baseada em informação fabricada.",
    juridico: "CDC art. 37 (publicidade enganosa) e art. 36 (publicidade deve ser identificável); possível prática abusiva do art. 39.",
    exemplo: "Notificação: “Carlos, de Porto Alegre, comprou há 3 minutos” — gerada por script.",
    demo: "urgencia"
  },
  {
    id: "confirmshaming", nome: "Confirmshaming", en: "Confirmshaming", cat: "pressao", icone: "😔",
    resumo: "A opção de recusar é escrita para fazer o usuário se sentir mal.",
    como: "O botão de recusa usa linguagem de culpa ou ridicularização: “Não, prefiro pagar mais caro”, “Não quero economizar”.",
    vies: "Efeito de enquadramento (framing) e aversão ao arrependimento: evitamos escolhas que nos fazem parecer tolos.",
    efeito: "Aceitação de newsletter, rastreamento ou compra adicional por constrangimento, não por vontade.",
    juridico: "LGPD art. 8º §3º e art. 5º, XII: consentimento deve ser livre; pressão emocional compromete a liberdade. CDC art. 39, IV.",
    exemplo: "Pop-up com botão verde “Quero 10% OFF!” e link cinza “Não, obrigado, gosto de gastar mais”.",
    demo: "popup"
  },
  {
    id: "dificil-cancelar", nome: "Difícil de cancelar", en: "Roach motel / Hard to cancel", cat: "obstrucao", icone: "🪤",
    resumo: "Assinar leva 1 clique; cancelar exige ligar, enviar e-mail ou atravessar 6 telas.",
    como: "O caminho de saída é escondido, longo ou exige canal diferente do de contratação (telefone em horário comercial, carta, chat que “nunca atende”).",
    vies: "Viés do status quo e custo de esforço: a fricção faz o usuário desistir e manter o que já tem.",
    efeito: "Cobranças recorrentes indesejadas, perda financeira, sensação de aprisionamento.",
    juridico: "CDC art. 39, V (vantagem manifestamente excessiva), art. 51 (cláusulas abusivas). Decreto 7.962/2013 (e-commerce) e regulamento do SAC exigem canal facilitado.",
    exemplo: "Assinatura contratada pelo app, mas cancelamento só “ligando para 0800 de seg. a sex., 9h–17h”.",
    demo: "cancelar"
  },
  {
    id: "obstrucao", nome: "Obstrução", en: "Obstruction", cat: "obstrucao", icone: "🚧",
    resumo: "Tornar uma ação legítima propositalmente trabalhosa.",
    como: "Exclusão de conta, pedido de reembolso ou download dos próprios dados exigem múltiplas etapas, formulários e confirmações sem sentido.",
    vies: "Custo de esforço cognitivo e procrastinação: quanto mais passos, menor a chance de concluir.",
    efeito: "Direitos existem “no papel”, mas poucos conseguem exercê-los.",
    juridico: "LGPD art. 18 (direitos do titular: acesso, correção, eliminação) e art. 6º, IV (livre acesso) — o exercício deve ser facilitado.",
    exemplo: "Para excluir a conta é preciso abrir ticket, anexar documento e esperar resposta em até 30 dias.",
    demo: "cancelar"
  },
  {
    id: "nagging", nome: "Insistência (nagging)", en: "Nagging", cat: "obstrucao", icone: "🔔",
    resumo: "Pedidos repetidos até o usuário ceder por cansaço.",
    como: "Notificações, pop-ups e lembretes voltam a cada acesso, geralmente com “Agora não” mas sem “Nunca”.",
    vies: "Fadiga de decisão: a repetição vence a resistência, não o convencimento.",
    efeito: "Consentimento obtido por exaustão; experiência interrompida e irritante.",
    juridico: "LGPD art. 5º, XII e art. 8º: consentimento “livre, informado e inequívoco” não se confunde com cansaço. Possível prática abusiva (CDC art. 39).",
    exemplo: "App pergunta “Ativar notificações?” toda vez que abre, com opções “Sim” e “Depois”.",
    demo: "cookies"
  },
  {
    id: "acao-forcada", nome: "Ação forçada", en: "Forced action", cat: "obstrucao", icone: "🔒",
    resumo: "Exigir algo não relacionado para liberar o que o usuário quer.",
    como: "Criar conta, aceitar rastreamento ou fornecer dados desnecessários vira condição para usar uma função simples.",
    vies: "Efeito de compromisso: após investir tempo, o usuário tende a concluir o processo.",
    efeito: "Coleta de dados além do necessário; consentimento condicionado.",
    juridico: "LGPD art. 6º, III (necessidade) e art. 9º §3º (quando dados são condição para o serviço, o titular deve ser informado com destaque). Consentimento “forçado” não é livre.",
    exemplo: "Ler uma receita exige cadastro com CPF e telefone.",
    demo: "cookies"
  },
  {
    id: "custos-ocultos", nome: "Custos ocultos", en: "Hidden costs / Drip pricing", cat: "engano", icone: "💸",
    resumo: "Taxas que só aparecem no último passo da compra.",
    como: "O preço anunciado é baixo; a cada etapa surgem taxas de serviço, conveniência, processamento e seguro, elevando o total no checkout.",
    vies: "Ancoragem e custo afundado: o primeiro preço vira referência e, após o esforço, desistir parece desperdício.",
    efeito: "O consumidor paga mais do que o anunciado ou abandona a compra frustrado.",
    juridico: "CDC art. 6º, III e art. 31 (preço informado de forma clara) e art. 37. Decreto 7.962/2013, art. 2º: informações claras sobre preço total e despesas adicionais.",
    exemplo: "Ingresso “R$ 120” vira R$ 175 no pagamento.",
    demo: "custos"
  },
  {
    id: "insercao", nome: "Inserção sorrateira", en: "Sneak into basket", cat: "engano", icone: "🛒",
    resumo: "Itens adicionados ao carrinho sem o usuário pedir.",
    como: "Seguros, garantias ou doações aparecem automaticamente no resumo do pedido, contando com a falta de atenção.",
    vies: "Viés de omissão e inatenção: poucos conferem linha a linha o resumo da compra.",
    efeito: "Gasto não intencional; contratação de serviços não desejados.",
    juridico: "CDC art. 39, III (enviar produto/serviço sem solicitação prévia) — considerado prática abusiva.",
    exemplo: "“Seguro de entrega R$ 14,90” já aparece incluído no carrinho.",
    demo: "checkout"
  },
  {
    id: "preselecao", nome: "Pré-seleção", en: "Preselection", cat: "engano", icone: "☑️",
    resumo: "Opções que favorecem a empresa já vêm marcadas.",
    como: "Caixas de aceite de marketing, compartilhamento de dados ou extras são entregues marcadas, exigindo que o usuário desmarque.",
    vies: "Viés do status quo e efeito padrão (default): a maioria aceita o que já está selecionado.",
    efeito: "Consentimento “automático”, dados compartilhados sem escolha real.",
    juridico: "LGPD art. 8º §4º (autorizações genéricas são nulas) e art. 5º, XII (consentimento inequívoco). ANPD orienta que opt-in deve ser ação afirmativa.",
    exemplo: "☑ “Quero receber ofertas de parceiros” já marcado ao criar conta.",
    demo: "checkout"
  },
  {
    id: "linguagem-confusa", nome: "Linguagem confusa", en: "Trick wording", cat: "engano", icone: "🌀",
    resumo: "Frases com dupla negação ou termos ambíguos que invertem o sentido da escolha.",
    como: "Textos como “Desmarque para não deixar de não receber…” fazem o usuário escolher o contrário do que pretendia.",
    vies: "Sobrecarga cognitiva e leitura em modo automático (sistema 1).",
    efeito: "Decisões opostas à intenção; consentimento viciado.",
    juridico: "LGPD art. 9º §1º: consentimento é nulo se a informação for enganosa ou não clara. CDC art. 46 e art. 54 §3º (clareza e destaque).",
    exemplo: "“Desmarque se você não quiser deixar de não receber ofertas.”",
    demo: "checkout"
  },
  {
    id: "anuncio-disfarcado", nome: "Anúncio disfarçado", en: "Disguised ads", cat: "engano", icone: "🎭",
    resumo: "Publicidade que imita conteúdo, botões de download ou resultados de busca.",
    como: "Anúncios usam o mesmo layout de resultados orgânicos ou botões falsos (“Baixar”), levando o clique ao lugar errado.",
    vies: "Viés de confirmação e heurística de reconhecimento: clicamos no que parece familiar.",
    efeito: "Cliques acidentais, instalação de software indesejado, confusão entre conteúdo e propaganda.",
    juridico: "CDC art. 36: a publicidade deve ser identificada fácil e imediatamente. Art. 37 §1º (enganosa).",
    exemplo: "Anúncio com botão verde “Download” enorme, em página de downloads de um programa gratuito.",
    demo: null
  },
  {
    id: "interferencia-visual", nome: "Interferência visual", en: "Visual interference", cat: "engano", icone: "🎨",
    resumo: "Cores, tamanho e contraste que destacam a opção da empresa e escondem a do usuário.",
    como: "Botão de aceitar é grande e colorido; o de recusar é cinza claro, pequeno, sobre fundo parecido — quase invisível.",
    vies: "Saliência visual: o olhar vai ao elemento de maior contraste, e o cérebro escolhe o caminho mais fácil.",
    efeito: "Aceite inconsciente; recusa percebida como inexistente.",
    juridico: "LGPD art. 6º, VI (transparência) e art. 9º §1º. CDC art. 54 §4º (destaque de cláusulas limitativas).",
    exemplo: "“Aceitar todos” em botão azul de 300 px; “recusar” em texto cinza de 11 px.",
    demo: "popup"
  },
  {
    id: "privacy-zuckering", nome: "Privacy Zuckering", en: "Privacy Zuckering", cat: "dados", icone: "🕵️",
    resumo: "Induzir o usuário a compartilhar mais dados do que gostaria.",
    como: "Configurações de privacidade ficam escondidas e o padrão é o compartilhamento máximo. Cookies banners oferecem “Aceitar” em 1 clique e “Rejeitar” em 6 cliques.",
    vies: "Efeito padrão e fadiga de decisão: ninguém lê 40 toggles; aceita-se tudo para continuar.",
    efeito: "Perfilamento, venda de dados e rastreamento sem consentimento real.",
    juridico: "LGPD art. 7º e 8º (bases legais e consentimento), art. 9º, art. 6º I–III (finalidade, adequação, necessidade) e art. 52 (sanções da ANPD). Guia de Cookies da ANPD (2022).",
    exemplo: "Banner: “Aceitar todos” grande; “Configurar” em texto, com 12 categorias já ativadas.",
    demo: "cookies"
  }
];

const VIESES = [
  { icone: "📉", nome: "Aversão à perda", desc: "Perder dói mais do que ganhar a mesma coisa agrada. Cronômetros e “últimas unidades” exploram esse medo.", usado: ["Falsa urgência", "Falsa escassez"] },
  { icone: "📌", nome: "Viés do status quo / efeito padrão", desc: "Tendemos a manter a opção que já está selecionada, mesmo quando outra seria melhor.", usado: ["Pré-seleção", "Privacy Zuckering"] },
  { icone: "🐑", nome: "Efeito manada", desc: "Se muita gente está fazendo, parece certo. Notificações de compra e avaliações fabricadas apostam nisso.", usado: ["Prova social falsa"] },
  { icone: "⚓", nome: "Ancoragem", desc: "O primeiro número que vemos vira referência. Taxas depois dele parecem “pequenas”.", usado: ["Custos ocultos"] },
  { icone: "🖼️", nome: "Efeito de enquadramento", desc: "A mesma escolha, escrita de outro jeito, muda a decisão. “Não, prefiro pagar mais caro” é framing puro.", usado: ["Confirmshaming", "Linguagem confusa"] },
  { icone: "🥱", nome: "Fadiga de decisão", desc: "Depois de muitas escolhas, aceitamos o padrão só para acabar logo.", usado: ["Insistência", "Privacy Zuckering", "Obstrução"] },
  { icone: "🧱", nome: "Custo afundado", desc: "Já investi tempo, então concluo. Passos extras no checkout aproveitam isso.", usado: ["Custos ocultos", "Difícil de cancelar"] },
  { icone: "👁️", nome: "Saliência visual", desc: "O que é grande, colorido e contrastante atrai o clique; o resto some.", usado: ["Interferência visual", "Anúncio disfarçado"] }
];

const LEIS = {
  lgpd: {
    titulo: "LGPD — Lei nº 13.709/2018",
    intro: "O foco é o consentimento e a transparência no tratamento de dados pessoais. Dark patterns que obtêm aceite sem escolha real tornam o consentimento questionável.",
    itens: [
      { art: "Art. 5º, XII", txt: "Consentimento é a manifestação livre, informada e inequívoca do titular.", pad: ["Pré-seleção", "Confirmshaming", "Insistência"] },
      { art: "Art. 6º, I–III", txt: "Princípios da finalidade, adequação e necessidade: só se coleta o necessário para a finalidade informada.", pad: ["Ação forçada", "Privacy Zuckering"] },
      { art: "Art. 6º, VI", txt: "Transparência: informações claras, precisas e facilmente acessíveis.", pad: ["Interferência visual", "Linguagem confusa"] },
      { art: "Art. 8º, §§3º–5º", txt: "Vedado tratamento com vício de consentimento; autorizações genéricas são nulas; revogação por procedimento gratuito e facilitado.", pad: ["Pré-seleção", "Difícil de cancelar"] },
      { art: "Art. 9º, §1º", txt: "Consentimento é nulo se a informação for enganosa, abusiva ou não apresentada de forma clara e inequívoca.", pad: ["Linguagem confusa", "Privacy Zuckering"] },
      { art: "Art. 18", txt: "Direitos do titular (acesso, correção, eliminação, revogação) devem poder ser exercidos sem obstáculos.", pad: ["Obstrução"] },
      { art: "Art. 52", txt: "Sanções administrativas pela ANPD: advertência, multa de até 2% do faturamento (limitada a R$ 50 mi por infração), bloqueio e eliminação de dados.", pad: [] }
    ]
  },
  cdc: {
    titulo: "CDC — Lei nº 8.078/1990",
    intro: "O foco é a relação de consumo: o consumidor é vulnerável e tem direito à informação clara e à proteção contra práticas abusivas.",
    itens: [
      { art: "Art. 6º, III e IV", txt: "Direito à informação adequada e clara e à proteção contra publicidade enganosa e abusiva.", pad: ["Falsa escassez", "Custos ocultos"] },
      { art: "Art. 30 e 31", txt: "A oferta obriga o fornecedor e deve informar preço e características de forma correta, clara e precisa.", pad: ["Falsa urgência", "Custos ocultos"] },
      { art: "Art. 36", txt: "A publicidade deve ser identificada fácil e imediatamente como tal.", pad: ["Anúncio disfarçado", "Prova social falsa"] },
      { art: "Art. 37, §1º", txt: "É enganosa a publicidade inteira ou parcialmente falsa, ou que por omissão induza a erro.", pad: ["Falsa urgência", "Falsa escassez", "Prova social falsa"] },
      { art: "Art. 39, III, IV e V", txt: "Práticas abusivas: enviar produto sem solicitação; prevalecer-se da fraqueza do consumidor; exigir vantagem manifestamente excessiva.", pad: ["Inserção sorrateira", "Confirmshaming", "Difícil de cancelar"] },
      { art: "Art. 49", txt: "Direito de arrependimento em 7 dias nas compras fora do estabelecimento (inclui internet).", pad: ["Difícil de cancelar"] },
      { art: "Art. 51", txt: "Cláusulas abusivas são nulas de pleno direito.", pad: ["Difícil de cancelar", "Obstrução"] }
    ]
  },
  outros: {
    titulo: "Outras normas e referências",
    intro: "O tema também é regulado em outras frentes, no Brasil e no exterior.",
    itens: [
      { art: "Decreto 7.962/2013", txt: "Regulamenta o comércio eletrônico: informações claras sobre preço total, canal de atendimento facilitado e arrependimento.", pad: ["Custos ocultos", "Difícil de cancelar"] },
      { art: "Marco Civil da Internet", txt: "Lei 12.965/2014, art. 7º, VIII e IX: consentimento expresso e destacado para coleta e uso de dados.", pad: ["Privacy Zuckering"] },
      { art: "Guia de Cookies (ANPD)", txt: "Orientações sobre banners: rejeitar deve ser tão fácil quanto aceitar; não usar pré-marcação nem design que induza.", pad: ["Interferência visual", "Pré-seleção"] },
      { art: "DSA (União Europeia)", txt: "Regulamento (UE) 2022/2065, art. 25: proíbe interfaces de plataformas online que enganem ou manipulem usuários.", pad: [] },
      { art: "FTC (EUA)", txt: "Relatório “Bringing Dark Patterns to Light” (2022) e ações contra empresas por assinaturas difíceis de cancelar.", pad: ["Difícil de cancelar"] }
    ]
  }
};

const QUIZ = [
  { cena: "Em um site de hotéis: “🔥 Restam apenas 2 quartos! 23 pessoas estão vendo este hotel agora.”", resp: "falsa-escassez", expl: "Escassez e demanda são afirmadas sem evidência verificável — usa aversão à perda para apressar a decisão." },
  { cena: "Pop-up de desconto. Botões: [Quero 10% OFF!] e [Não, obrigado, prefiro pagar mais caro].", resp: "confirmshaming", expl: "A recusa foi redigida para causar vergonha e empurrar o aceite." },
  { cena: "Em uma busca, os três primeiros resultados parecem normais, mas só têm um pequeno “Ad” cinza de 9 px.", resp: "anuncio-disfarcado", expl: "A publicidade imita conteúdo orgânico e contraria o art. 36 do CDC." },
  { cena: "Cadastro com caixa: “Desmarque se você não quiser deixar de não receber nossas ofertas.”", resp: "linguagem-confusa", expl: "Dupla negação faz o usuário escolher o contrário do que quer." },
  { cena: "Você assina um streaming em 2 cliques pelo app. Para cancelar, o site diz: “Ligue para 0800… de seg. a sex., 9h–17h.”", resp: "dificil-cancelar", expl: "A saída é mais difícil que a entrada — “roach motel”." },
  { cena: "Você escolhe uma passagem. No resumo aparece sozinho “Seguro viagem Premium — R$ 79”.", resp: "insercao", expl: "Item não solicitado foi adicionado ao carrinho (CDC art. 39, III)." },
  { cena: "Ingresso anunciado por R$ 120. Na etapa final: taxa de serviço, conveniência e processamento. Total: R$ 175.", resp: "custos-ocultos", expl: "Preço total só aparece no fim, após investimento de tempo (ancoragem + custo afundado)." },
  { cena: "Todo dia que abre o app, aparece “Ativar notificações?” com [Ativar] e [Depois]. Não existe “Nunca”.", resp: "nagging", expl: "A insistência vence por cansaço, não por convencimento." },
  { cena: "Banner de cookies: [ACEITAR TODOS] azul e grande; “configurar” em texto cinza pequeno, com 14 categorias já ligadas.", resp: "privacy-zuckering", expl: "Aceitar custa 1 clique, recusar custa vários: o design empurra o compartilhamento máximo de dados." }
];
