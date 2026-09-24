// t = tema (conceitos | notacoes | recorrencias | algoritmos); a = índice da resposta correta
const MCQ = [
/* ---------- CONCEITOS ---------- */
{t:'conceitos',q:'A complexidade temporal de um algoritmo é medida, em geral, como:',
 o:['O tempo em segundos em um computador específico','O número de instruções básicas executadas em função do tamanho da entrada','A quantidade de memória usada','O número de linhas do código'],a:1,
 e:'Complexidade = nº de instruções básicas em função de n. Segundos dependem da máquina; memória é complexidade espacial.'},
{t:'conceitos',q:'A complexidade <b>espacial</b> se refere a:',
 o:['Ao número de comparações','À quantidade de recursos (memória, hardware, banda) necessários para resolver o problema','Ao tempo de execução no pior caso','Ao tamanho do código-fonte'],a:1,
 e:'Espacial = recursos (memória, hardware, banda). Temporal = tempo/nº de instruções.'},
{t:'conceitos',q:'Qual é a ordem de crescimento de <code>3n² + 10n + 7</code>?',
 o:['O(n)','O(n²)','O(n³)','O(10n)'],a:1,
 e:'Ignoram-se constantes e termos de menor ordem. Fica n².'},
{t:'conceitos',q:'Qual a ordem de crescimento de <code>n⁴ + n³ · n² + 19</code>?',
 o:['O(n⁴)','O(n⁶)','O(n⁵)','O(19)'],a:2,
 e:'n³·n² = n⁵, que domina n⁴ e 19. Resposta: O(n⁵).'},
{t:'conceitos',q:'Qual a ordem de crescimento de <code>n! + nⁿ</code>?',
 o:['O(n!)','O(nⁿ)','O(2ⁿ)','O(n²)'],a:1,
 e:'nⁿ cresce mais rápido que n! (n! = n·(n−1)·…·1, com fatores menores que n).'},
{t:'conceitos',q:'Por que em <code>n² + n</code> dizemos que a complexidade é O(n²) e não consideramos o n?',
 o:['Porque n é sempre igual a zero','Porque, conforme n cresce, n² representa quase todo o valor; o n vira irrelevante (e n² + n ≤ 2n² para n ≥ 1)','Porque o professor decidiu assim','Porque n² + n = n²'],a:1,
 e:'Com n = 1.000.000, n² = 10¹² e o n contribui só 0,0001 %. Formalmente n²+n ≤ 2n² (c=2, n₀=1).'},
{t:'conceitos',q:'Ordem CRESCENTE correta de crescimento:',
 o:['O(n) < O(log n) < O(n²) < O(2ⁿ)','O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)','O(log n) < O(1) < O(n) < O(n²)','O(n²) < O(n log n) < O(n) < O(n!)'],a:1,
 e:'Constante < logarítmica < linear < linear-logarítmica < quadrática < exponencial < fatorial.'},
{t:'conceitos',q:'Em qual caso concentramos a análise de complexidade nesta disciplina?',
 o:['Melhor caso','Caso médio','Pior caso','Nenhum'],a:2,
 e:'O pior caso é o foco (dá garantia de limite superior). Há algoritmos em que ele é o mais frequente, como buscar um item ausente.'},
{t:'conceitos',q:'Qual a complexidade?<pre><code>for (i=0; i&lt;n; i++) print i\nfor (j=0; j&lt;n; j++) print j</code></pre>',
 o:['O(n²)','O(n)','O(log n)','O(2n²)'],a:1,
 e:'Laços em sequência somam: n + n = 2n ⇒ O(n).'},
{t:'conceitos',q:'Qual a complexidade?<pre><code>for (i=0; i&lt;n; i++)\n  for (j=0; j&lt;n; j++)\n    print i + j</code></pre>',
 o:['O(n)','O(n log n)','O(n²)','O(2n)'],a:2,
 e:'Laços aninhados multiplicam: n·n = n².'},
{t:'conceitos',q:'Qual a complexidade?<pre><code>for (i=0; i&lt;n; i++)\n  for (j=0; j&lt;n; j++) print i + j\nfor (w=1; w&lt;n; w=w*2) print w</code></pre>',
 o:['O(n² log n)','O(n²)','O(n)','O(n + log n)'],a:1,
 e:'n² + log n ⇒ o termo dominante é n². (O laço com w=w*2 é O(log n).)'},
{t:'conceitos',q:'Qual a complexidade (pior caso)?<pre><code>for (i=0; i&lt;n; i++)\n  if (n &gt;= 100)\n    for (j=0; j&lt;n; j++) print i + j</code></pre>',
 o:['O(n)','O(n²)','O(1)','O(100n)'],a:1,
 e:'No pior caso (n ≥ 100) o laço interno executa sempre ⇒ n·n = n². A condição não muda a ordem assintótica.'},
{t:'conceitos',q:'Um laço <code>for (w=1; w&lt;n; w=w*2)</code> tem complexidade:',
 o:['O(n)','O(n²)','O(log n)','O(2ⁿ)'],a:2,
 e:'w dobra a cada volta; chega em n após log₂ n voltas.'},
{t:'conceitos',q:'Na tabela do slide (ordem de crescimento × tempo), com n = 30, qual algoritmo leva ~18 minutos?',
 o:['O(n²)','O(n log n)','O(2ⁿ)','O(n!)'],a:2,
 e:'Para n = 30: n, n log n, n² e n³ levam &lt; 1 s; 2ⁿ ≈ 18 min; n! é astronômico (10²⁵ anos no slide).'},
{t:'conceitos',q:'Por que o mesmo algoritmo pode ter tempos diferentes em ambientes diferentes?',
 o:['Porque sua complexidade assintótica muda','Porque as constantes (hardware, compilador, linguagem, memória/cache, SO) variam, embora a ordem de crescimento seja a mesma','Porque o algoritmo muda sozinho','Não pode: o tempo é sempre igual'],a:1,
 e:'A notação assintótica esconde as constantes, que dependem do ambiente. A ordem de crescimento é a mesma.'},

/* ---------- NOTAÇÕES ---------- */
{t:'notacoes',q:'A notação O(g(n)) fornece:',
 o:['Um limite assintótico inferior','Um limite assintótico superior','Sempre o limite justo','O caso médio'],a:1,
 e:'O = limite superior (f ≤ c·g). Ω = inferior. Θ = justo.'},
{t:'notacoes',q:'A notação Ω(g(n)) fornece:',
 o:['Limite superior','Limite inferior','Limite justo','Limite estrito superior'],a:1,
 e:'Ω: 0 ≤ c·g(n) ≤ f(n) — o tempo é no mínimo c·g(n).'},
{t:'notacoes',q:'Qual definição corresponde a Θ(g(n))?',
 o:['0 ≤ f(n) ≤ c·g(n)','0 ≤ c·g(n) ≤ f(n)','0 ≤ c₁·g(n) ≤ f(n) ≤ c₂·g(n) para n ≥ n₀','f(n) &lt; c·g(n) para todo c'],a:2,
 e:'Θ = “espremida” entre c₁g e c₂g. A 1ª é O, a 2ª é Ω, a 4ª é o.'},
{t:'notacoes',q:'Teorema: f(n) = Θ(g(n)) se e somente se…',
 o:['f = O(g) ou f = Ω(g)','f = O(g) e f = Ω(g)','f = o(g)','f = ω(g)'],a:1,
 e:'Θ exige os dois limites simultaneamente (superior E inferior).'},
{t:'notacoes',q:'Qual afirmação é verdadeira?',
 o:['n ∈ Θ(n²)','n ∈ O(n²)','n² ∈ O(n)','n³ ∈ Θ(n²)'],a:1,
 e:'n ≤ n², então n ∈ O(n²), mas não é Θ (limite não justo).'},
{t:'notacoes',q:'Para f(n) = 2n² + 100n ∈ Θ(n²) com c₁ = 2 e c₂ = 4, qual o menor n₀ que funciona?',
 o:['10','25','50','100'],a:2,
 e:'2n²+100n ≤ 4n² ⇔ 100n ≤ 2n² ⇔ n ≥ 50.'},
{t:'notacoes',q:'Qual é verdadeira?',
 o:['2n² = o(n²)','2n = o(n²)','n² = o(n)','n = ω(n)'],a:1,
 e:'o é limite superior <i>não justo</i>: 2n cresce estritamente menos que n². 2n² = Θ(n²), logo não é o(n²).'},
{t:'notacoes',q:'“n² = ω(n)” significa que:',
 o:['n² é limite superior justo de n','n² cresce estritamente mais rápido que n (limite inferior não justo)','n e n² crescem igual','n² = O(n)'],a:1,
 e:'ω = limite inferior não justo (f estritamente maior que g assintoticamente).'},
{t:'notacoes',q:'A notação assintótica é útil principalmente porque:',
 o:['Depende do compilador','Permite comparar algoritmos de forma independente de máquina, linguagem e compilador','Mede o tempo real exato','Só serve para recursão'],a:1,
 e:'Ela ignora constantes/termos menores e fala só do crescimento em função de n.'},

/* ---------- RECORRÊNCIAS ---------- */
{t:'recorrencias',q:'Uma recorrência é:',
 o:['Um laço de repetição','Uma expressão que dá o valor de uma função em termos de valores anteriores da mesma função','Uma constante','Um tipo de ordenação'],a:1,
 e:'Ex.: Fibonacci F(n) = F(n−1) + F(n−2). Para algoritmos recursivos, T(n) descreve o tempo.'},
{t:'recorrencias',q:'Qual método exige uma estimativa inicial que é provada por indução?',
 o:['Método mestre','Árvore de recursão','Substituição','Nenhum'],a:2,
 e:'Substituição: chuta a forma da solução e prova por indução. Abrange todas as recorrências.'},
{t:'recorrencias',q:'A recorrência do fatorial recursivo é T(n) = T(n−1) + 1, T(0) = 1. Sua complexidade é:',
 o:['O(1)','O(log n)','O(n)','O(n²)'],a:2,
 e:'Expandindo: T(n) = T(n−k) + k ⇒ T(n) = n + 1 = O(n).'},
{t:'recorrencias',q:'A recorrência da busca binária, T(n) = T(⌊n/2⌋) + 1, resulta em:',
 o:['O(n)','O(log n)','O(n log n)','O(√n)'],a:1,
 e:'A cada chamada o problema cai à metade: ⌊log n⌋ + 1 chamadas no máximo.'},
{t:'recorrencias',q:'Quantas iterações no máximo faz a busca binária em uma lista de 1000 elementos? (⌊log₂n⌋ + 1)',
 o:['8','9','10','11'],a:2,
 e:'log₂ 1000 ≈ 9,97 ⇒ ⌊9,97⌋ + 1 = 10.'},
{t:'recorrencias',q:'Uma árvore de recursão serve para:',
 o:['Provar por indução','Visualizar as chamadas recursivas e obter uma estimativa para o método da substituição','Ordenar uma lista','Calcular o espaço em disco'],a:1,
 e:'É um método informal: soma o custo local de cada nó/nível.'},
{t:'recorrencias',q:'Método mestre: T(n) = 2T(n/2) + n resulta em:',
 o:['Θ(n)','Θ(n log n)','Θ(n²)','Θ(log n)'],a:1,
 e:'a=2, b=2, n^log₂2 = n = f(n) ⇒ caso 2 ⇒ Θ(n log n).'},
{t:'recorrencias',q:'Método mestre: T(n) = 4T(n/2) + n resulta em:',
 o:['Θ(n)','Θ(n log n)','Θ(n²)','Θ(n³)'],a:2,
 e:'n^log₂4 = n². f = n é menor ⇒ caso 1 ⇒ Θ(n²).'},
{t:'recorrencias',q:'Método mestre: T(n) = T(n/2) + n resulta em:',
 o:['Θ(log n)','Θ(n)','Θ(n log n)','Θ(n²)'],a:1,
 e:'a=1, b=2 ⇒ n⁰ = 1. f = n domina ⇒ caso 3 (regularidade ok: n/2 ≤ ½·n) ⇒ Θ(n).'},
{t:'recorrencias',q:'Método mestre: T(n) = 7T(n/3) + n² resulta em:',
 o:['Θ(n^log₃7) ≈ Θ(n^1,77)','Θ(n²)','Θ(n² log n)','Θ(n³)'],a:1,
 e:'log₃7 ≈ 1,77 &lt; 2 ⇒ f(n) = n² domina ⇒ caso 3 ⇒ Θ(n²) (regularidade: 7(n/3)² = 7n²/9 ≤ c·n², c = 7/9 &lt; 1).'},
{t:'recorrencias',q:'Qual recorrência NÃO pode ser resolvida pelo método mestre?',
 o:['T(n) = 2T(n/2) + n','T(n) = 3T(n/4) + n','T(n) = T(n−1) + T(n−2) + 1','T(n) = T(n/2) + 1'],a:2,
 e:'Fibonacci reduz por subtração, não por divisão n/b. O mestre exige n/b.'},
{t:'recorrencias',q:'Por que o método mestre não se aplica a T(n) = 2T(n/2) + n lg n?',
 o:['Porque a = 2','Porque n lg n não é polinomialmente maior que n^log₂2 = n (difere só por um fator log)','Porque b = 2','Porque tem log'],a:1,
 e:'Os casos 1 e 3 exigem diferença polinomial (n^ε). Aqui há “lacuna” entre os casos 2 e 3.'},
{t:'recorrencias',q:'Por que T(n) = T(n/2) + T(n/4) + n foge do método mestre?',
 o:['Porque f(n) = n','Porque os subproblemas têm tamanhos diferentes, então não é possível identificar um único a e b','Porque não tem caso base','Porque n/4 é fracionário'],a:1,
 e:'A forma exigida é aT(n/b) com subproblemas de mesmo tamanho.'},
{t:'recorrencias',q:'Uma recorrência com dois termos de mesmo tamanho, como <code>2T(n/4) + 3T(n/4) + n^(1/3)</code>, pode ser reescrita como:',
 o:['5T(n/4) + n^(1/3) ⇒ Θ(n^log₄5)','6T(n/4) + n^(1/3)','T(n/2) + n^(1/3)','Não pode ser reescrita'],a:0,
 e:'Somando os termos iguais: a = 5, b = 4. log₄5 ≈ 1,16 &gt; 1/3 ⇒ caso 1 ⇒ Θ(n^log₄5).'},

/* ---------- ALGORITMOS ---------- */
{t:'algoritmos',q:'Qual a complexidade do bubble sort no pior caso?',
 o:['O(n)','O(n log n)','O(n²)','O(log n)'],a:2,
 e:'Dois laços aninhados: ~n²/2 comparações.'},
{t:'algoritmos',q:'Em qual condição o bubble sort (com flag de parada) é mais eficiente que seu pior caso?',
 o:['Lista invertida','Lista já ordenada (uma passada sem trocas e termina: O(n))','Lista muito grande','Nunca'],a:1,
 e:'Se nenhuma troca ocorre numa passada, a lista está ordenada e o algoritmo para: O(n).'},
{t:'algoritmos',q:'Quick sort: em que situação o pior caso O(n²) ocorre?',
 o:['Quando o pivô divide a lista ao meio','Quando o pivô escolhido é sempre o menor ou o maior elemento (ex.: lista ordenada com pivô nas pontas)','Quando n é par','Quando há elementos repetidos'],a:1,
 e:'Partições desbalanceadas (n−1 e 0) ⇒ T(n) = T(n−1) + n = O(n²). Evita-se com pivô aleatório ou mediana de três.'},
{t:'algoritmos',q:'Qual estratégia ajuda a evitar o pior caso do quick sort?',
 o:['Usar pivô sempre no primeiro elemento','Escolher o pivô aleatoriamente ou pela mediana de três','Ordenar antes com bubble sort','Usar mais memória'],a:1,
 e:'Pivô aleatório / mediana de três tornam improvável uma partição muito desbalanceada.'},
{t:'algoritmos',q:'O merge sort baseia-se em qual paradigma?',
 o:['Programação dinâmica','Algoritmo guloso','Divisão e conquista','Força bruta'],a:2,
 e:'Divide a lista até 1 item e depois combina (intercala) ordenadamente.'},
{t:'algoritmos',q:'A recorrência do merge sort é:',
 o:['T(n) = T(n−1) + n','T(n) = 2T(n/2) + n','T(n) = T(n/2) + 1','T(n) = 2T(n−1)'],a:1,
 e:'Duas metades resolvidas recursivamente + intercalação linear.'},
{t:'algoritmos',q:'No merge sort, a etapa de “conquista” consiste em:',
 o:['Dividir a lista ao meio','Intercalar sub-listas ordenadas, escolhendo sempre o menor entre os primeiros elementos','Escolher um pivô','Construir um heap'],a:1,
 e:'É a etapa “quem é menor?”: compara os cabeças das sub-listas e copia o menor.'},
{t:'algoritmos',q:'Em um heap (vetor iniciando em 1), os filhos do nó i estão em:',
 o:['i−1 e i+1','2i e 2i+1','i/2 e i/2+1','2i−1 e 2i'],a:1,
 e:'Left(i) = 2i, Right(i) = 2i+1, Parent(i) = ⌊i/2⌋.'},
{t:'algoritmos',q:'Qual tipo de heap é usado no heap sort para ordenar em ordem crescente?',
 o:['Min heap','Max heap','Heap de Fibonacci','Heap binomial'],a:1,
 e:'O maior fica no topo e é enviado à sua posição final no fim do vetor.'},
{t:'algoritmos',q:'Qual é a altura de um heap com n elementos?',
 o:['n','⌊log n⌋','n/2','√n'],a:1,
 e:'É uma árvore binária quase completa ⇒ altura ⌊log₂ n⌋. Por isso as operações custam O(log n).'},
{t:'algoritmos',q:'A complexidade do heap sort é:',
 o:['O(n²)','O(n log n) em todos os casos','O(n) no pior caso','O(log n)'],a:1,
 e:'Construir o heap ≈ O(n) + (n−1) chamadas de criaHeap de O(log n) ⇒ O(n log n).'},
{t:'algoritmos',q:'Heap sort × quick sort:',
 o:['O heap sort é melhor no pior caso; o quick sort é um pouco mais rápido no caso médio','O quick sort é melhor em todos os casos','O heap sort é sempre O(n²)','São idênticos'],a:0,
 e:'Slide: heap sort é levemente mais lento que o quick sort no caso médio, mas melhor no pior caso (n log n contra n²).'},
{t:'algoritmos',q:'Após trocar a raiz com a última folha no heap sort, o que é feito?',
 o:['Termina o algoritmo','Remove-se a folha (agora na posição final) do heap e reconstrói-se o heap para levar o maior valor ao topo','Divide-se o vetor ao meio','Inverte-se o vetor'],a:1,
 e:'Repete-se até não restarem nós. O vetor fica ordenado crescentemente.'},
{t:'algoritmos',q:'Heap sort com 16 números: após colocar o último elemento na posição correta, qual o máximo de comparações para manter o maior no topo do heap restante (15 elementos)?',
 o:['3','4','6','15'],a:2,
 e:'Heap de 15 nós tem altura 3. A cada nível o criaHeap faz 2 comparações (filho × filho, e nó × maior filho): 3 × 2 = 6.'},
];

// Lista de revisão G1 (17 questões) com respostas-modelo
const OPEN = [
{q:'Descreva o que são as complexidades temporal e espacial.',
 a:`<p><b>Temporal:</b> quantidade de tempo (ou nº de instruções básicas) necessária para resolver um problema, em função do tamanho da entrada n.</p>
<p><b>Espacial:</b> quantidade de recursos necessários — principalmente memória, mas também hardware e banda.</p>`},
{q:'Qual a complexidade temporal do bubble sort? Descreva também uma desvantagem desse algoritmo.',
 a:`<p><b>O(n²)</b> no pior e no caso médio (dois laços aninhados; ~n²/2 comparações).</p>
<p><b>Desvantagem:</b> é muito ineficiente para listas grandes — faz muitas comparações e trocas; elementos pequenos perto do final andam apenas uma posição por passada. (Sem otimização, mesmo lista já ordenada custa n².)</p>`},
{q:'Descreva o funcionamento do heap sort. Qual sua complexidade?',
 a:`<ol><li>Constrói um <b>max heap</b> a partir do vetor (árvore binária em que o pai ≥ filhos).</li>
<li>Troca a raiz (maior) com a última folha — o maior fica na posição final.</li>
<li>Remove essa folha do heap (heap diminui 1).</li>
<li>Reconstrói o heap (criaHeap): a nova raiz desce trocando com o maior filho até respeitar a regra.</li>
<li>Repete até não sobrar nós; o vetor fica em ordem crescente.</li></ol>
<p>Complexidade: <b>O(n log n)</b> (melhor, médio e pior caso).</p>`},
{q:'Por que quando a complexidade temporal é n² + n dizemos que é O(n²)? Por que o n não é considerado? (use tabelas e desenhos)',
 a:`<p>Porque, à medida que n cresce, o termo de maior ordem representa praticamente todo o valor:</p>
<table><tr><th>n</th><th>n²</th><th>n² + n</th><th>n / (n²+n)</th></tr>
<tr><td>10</td><td>100</td><td>110</td><td>9,1%</td></tr>
<tr><td>100</td><td>10.000</td><td>10.100</td><td>0,99%</td></tr>
<tr><td>1.000</td><td>1.000.000</td><td>1.001.000</td><td>0,1%</td></tr>
<tr><td>100.000</td><td>10¹⁰</td><td>10¹⁰ + 10⁵</td><td>0,001%</td></tr></table>
<p>Desenho: no gráfico, as curvas de n² e n² + n ficam praticamente sobrepostas para n grande, enquanto n é quase uma reta rente ao eixo.</p>
<p>Formalmente: n² + n ≤ 2n² para todo n ≥ 1 ⇒ existem c = 2 e n₀ = 1 tais que f(n) ≤ c·n² ⇒ f(n) = O(n²). (E também é Θ(n²): n² ≤ n² + n ≤ 2n².) Além disso, constantes e termos menores dependem do sistema, mas a taxa de crescimento não.</p>`},
{q:'Qual a ordem de crescimento? a) n² + 10n + 3 &nbsp; b) n⁴ + n³·n² + 19 &nbsp; c) n! + nⁿ',
 a:`<p><b>a)</b> O(n²)</p>
<p><b>b)</b> n³·n² = n⁵, que domina n⁴ e 19 ⇒ <b>O(n⁵)</b></p>
<p><b>c)</b> nⁿ cresce mais que n! ⇒ <b>O(nⁿ)</b></p>`},
{q:'O que é a notação assintótica? Para que serve?',
 a:`<p>É a linguagem usada para descrever o tempo (assintótico) de um algoritmo como função de n (domínio ℕ), ignorando constantes e termos de menor ordem, e descrevendo o crescimento quando n → ∞.</p>
<p>Serve para projetar e analisar algoritmos e <b>comparar</b> algoritmos para um mesmo problema de forma independente de arquitetura, linguagem de programação e compilador.</p>`},
{q:'Descreva as notações O, Θ e Ω. Qual a diferença entre elas?',
 a:`<ul>
<li><b>O(g)</b> – limite assintótico <u>superior</u>: 0 ≤ f(n) ≤ c·g(n) para n ≥ n₀. (“no máximo”)</li>
<li><b>Ω(g)</b> – limite assintótico <u>inferior</u>: 0 ≤ c·g(n) ≤ f(n) para n ≥ n₀. (“no mínimo”)</li>
<li><b>Θ(g)</b> – limite <u>justo</u>: 0 ≤ c₁·g(n) ≤ f(n) ≤ c₂·g(n) para n ≥ n₀. (“exatamente da ordem de”)</li></ul>
<p>Θ = O e Ω ao mesmo tempo. Ex.: n ∈ O(n²) mas n ∉ Θ(n²); 2n²+100n ∈ Θ(n²).</p>`},
{q:'Existe alguma condição de entrada que torna o bubble sort mais eficiente que seu pior caso? Por quê?',
 a:`<p><b>Sim.</b> Se a lista já está ordenada (ou quase) e o algoritmo tem a otimização de parada (flag “houve troca?”): na primeira passada nenhuma troca ocorre, então ele termina após n−1 comparações ⇒ <b>O(n)</b> (melhor caso) em vez de O(n²).</p>
<p>Sem a flag, o bubble sort faz o mesmo nº de comparações independentemente da entrada.</p>`},
{q:'A complexidade do quick sort no caso médio é n log n. Em qual situação pode ser n²? Qual estratégia evita o pior caso?',
 a:`<p><b>Pior caso:</b> quando o pivô é sempre o menor ou o maior elemento (ex.: lista já ordenada ou invertida com pivô no primeiro/último elemento). As partições ficam n−1 e 0 ⇒ T(n) = T(n−1) + n ⇒ <b>O(n²)</b>.</p>
<p><b>Estratégias:</b> escolher o pivô <b>aleatoriamente</b>, usar a <b>mediana de três</b> (primeiro, meio e último) ou embaralhar a lista antes.</p>`},
{q:'Ao usar o heap sort para ordenar 16 números positivos, após colocar o último elemento na posição correta, qual o número máximo de comparações para manter o maior valor no topo do heap?',
 a:`<p>Após a troca, o heap tem 15 elementos ⇒ árvore de altura ⌊log₂15⌋ = <b>3</b>.</p>
<p>A nova raiz pode descer até 3 níveis. A cada nível o criaHeap faz <b>2 comparações</b> (irmão × irmão para achar o maior filho; nó × maior filho).</p>
<p>Máximo: 3 × 2 = <b>6 comparações</b>. <i>(Se contar apenas o nº de níveis percorridos, são 3 trocas/descidas.)</i></p>`},
{q:'Descreva o funcionamento do algoritmo merge sort.',
 a:`<p>Usa <b>divisão e conquista</b> (criado por von Neumann, 1945):</p>
<ol><li><b>Divisão:</b> a lista é dividida ao meio, e cada metade de novo, até sub-listas de 1 item (que já estão ordenadas).</li>
<li><b>Conquista:</b> as sub-listas são combinadas (intercaladas) de forma ordenada: compara-se o primeiro elemento de cada sub-lista, copia-se o menor, repete-se até acabar, subindo níveis até a lista completa.</li></ol>
<p>Recorrência T(n) = 2T(n/2) + n ⇒ <b>O(n log n)</b> em todos os casos (usa O(n) de memória extra).</p>`},
{q:'O que são recorrências?',
 a:`<p>Uma recorrência é uma expressão que dá o valor de uma função em termos de valores anteriores da própria função (ex.: Fibonacci, fatorial). Em análise de algoritmos, é a função T(n) que descreve o tempo de execução de um algoritmo recursivo, com um <b>caso base</b>, por exemplo T(n) = 2T(n/2) + n, T(1) = 1.</p>
<p>Resolver a recorrência é encontrar uma fórmula direta em n (substituição, árvore de recursão, método mestre).</p>`},
{q:'Analise o algoritmo abaixo:<pre><code>n = &lt;inteiro positivo&gt;\nk = 1\nfor (i = 1; i &lt;= n; i++) {\n  if (n for par) { i++; }\n  escreve i;\n}</code></pre>a) Qual a complexidade temporal? b) Qual o pior caso de entrada? c) Se cada instrução básica custa 1 s, quanto tempo para a entrada 90?',
 a:`<p><b>a)</b> O laço roda até n vezes ⇒ <b>O(n)</b> (linear).</p>
<p><b>b)</b> O pior caso é <b>n ímpar</b>: o i++ interno nunca executa, então o laço faz as n iterações. Com n par, i avança de 2 em 2 e são só n/2 iterações.</p>
<p><b>c)</b> n = 90 (par): i = 1, 3, 5, …, 89 ⇒ <b>45 iterações</b>. Convenção de contagem: k = 1 (1) + i = 1 (1) + por iteração [comparação i&lt;=n, teste do if, i++ interno, escreve, i++ do for = 5] × 45 = 225 + comparação final (1) ⇒ <b>228 s</b>.<br>
<i>Se você contar apenas as escritas: 45 s. Indique sempre a convenção usada.</i></p>`},
{q:'Resolva as recorrências pelo método mestre: <br>a) T(n) = 8T(n/4) + 8T(n/2) + n² &nbsp; b) T(n) = 7T(n/3) + n² &nbsp; c) T(n) = 2T(n/4) + 3T(n/4) + n^(1/3) &nbsp; d) T(n) = 2T(n/3) + 2^(6n)',
 a:`<p><b>b)</b> a = 7, b = 3, n<sup>log₃7</sup> ≈ n<sup>1,77</sup>. f(n) = n² é polinomialmente maior; regularidade: 7(n/3)² = (7/9)n² ≤ c·n² com c = 7/9 &lt; 1 ⇒ <b>caso 3: Θ(n²)</b>.</p>
<p><b>c)</b> Termos com o mesmo tamanho n/4 somam-se: 5T(n/4) + n<sup>1/3</sup>. a = 5, b = 4, log₄5 ≈ 1,16 &gt; 1/3 ⇒ <b>caso 1: Θ(n<sup>log₄5</sup>) ≈ Θ(n<sup>1,16</sup>)</b>.</p>
<p><b>d)</b> a = 2, b = 3, n<sup>log₃2</sup> ≈ n<sup>0,63</sup>. f(n) = 2<sup>6n</sup> (exponencial) cresce polinomialmente mais; regularidade: 2·2<sup>6n/3</sup> = 2·2<sup>2n</sup> ≤ c·2<sup>6n</sup> para n grande ⇒ <b>caso 3: Θ(2<sup>6n</sup>)</b>.</p>
<p><b>a)</b> Tem <b>dois subproblemas de tamanhos diferentes</b> (n/4 e n/2) ⇒ o método mestre <u>não</u> se aplica diretamente (questão 15). Para estimar: como T(n/4) ≤ T(n/2), temos 16T(n/2) + n² como limite superior ⇒ pelo mestre O(n<sup>log₂16</sup>) = O(n⁴), e 16T(n/4) + n² como inferior ⇒ Ω(n²). O valor exato vem de Akra-Bazzi: resolvendo 8·4<sup>−p</sup> + 8·2<sup>−p</sup> = 1 obtém-se p ≈ 3,15 ⇒ Θ(n<sup>3,15</sup>).</p>
<div class="expl">Se o enunciado do professor pretendia que “a” fosse identificado, a lição da questão é notar quando o método não se aplica e o que fazer (questão 15).</div>`},
{q:'Na solução de recorrências, em quais situações o método mestre não pode ser usado? Quais estratégias poderiam ser utilizadas?',
 a:`<p><b>Não se aplica quando:</b></p>
<ul><li>A recorrência não tem a forma aT(n/b) + f(n) — ex.: Fibonacci T(n) = T(n−1) + T(n−2) + 1 (redução por subtração).</li>
<li>Os subproblemas têm tamanhos diferentes — ex.: T(n) = T(n/2) + T(n/4) + n (não dá para achar a e b).</li>
<li>f(n) não é polinomialmente maior/menor que n<sup>log<sub>b</sub>a</sup> — ex.: T(n) = 2T(n/2) + n lg n.</li>
<li>a &lt; 1 ou b ≤ 1, ou f(n) fora do domínio dos inteiros não negativos.</li></ul>
<p><b>Estratégias:</b> <b>substituição</b> (chute + prova por indução; cobre todos os casos), <b>árvore de recursão</b> (para obter o chute), expansão/iteração e Akra-Bazzi.</p>`},
{q:'Por que a complexidade temporal do heap sort é n log n? Descreva com detalhes.',
 a:`<ul>
<li>Um heap é uma árvore binária quase completa, com altura <b>⌊log n⌋</b>. Toda operação de conserto (criaHeap) desce no máximo a altura ⇒ <b>O(log n)</b>.</li>
<li><b>1º laço</b> (construção do heap, i de (N−1)/2 até 0): ~n/2 chamadas de criaHeap; somando com cuidado (nós próximos às folhas quase não descem) ⇒ <b>O(n)</b>.</li>
<li><b>2º laço</b> (i de N−1 até 1): cada uma das n−1 iterações faz 1 troca (O(1)) e 1 criaHeap (O(log n)) ⇒ <b>O((n−1)·log n)</b>.</li>
<li>Total: n + (n−1)·log n ⇒ o termo dominante é n log n ⇒ <b>O(n log n)</b>, independente da entrada (melhor, médio e pior caso).</li></ul>`},
{q:'Por que o mesmo algoritmo de ordenação pode ter tempo de execução diferente em ambientes computacionais diferentes? Descreva com detalhes.',
 a:`<p>A análise de complexidade assume premissas simplificadoras: máquina genérica, custo de operações desprezado (“uma instrução é uma instrução”) e ignora os níveis de memória. Na prática:</p>
<ul><li><b>Hardware:</b> velocidade da CPU, nº de núcleos, tamanho de cache e velocidade da RAM/disco alteram o custo de cada instrução.</li>
<li><b>Software:</b> linguagem, compilador/otimizações, sistema operacional e outros processos concorrendo pelo processador.</li>
<li><b>Dados:</b> a entrada (ordenada, aleatória, invertida) pode variar o caso.</li></ul>
<p>Tudo isso mexe nas <b>constantes</b> escondidas na notação assintótica, mas <b>não na ordem de crescimento</b>: o algoritmo continua sendo, p.ex., O(n log n) em todos os ambientes; só o tempo absoluto muda. As premissas são falsas quando é preciso otimizar para um ambiente específico.</p>`},
];
