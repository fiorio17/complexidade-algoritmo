/* ===== BANCO DO MÉTODO MESTRE (foco da prova) ===== */
// [recorrência, resposta certa, [3 erradas], explicação]
const NA = 'O método mestre não se aplica';
const MASTER_BANK = [
['T(n) = 2T(n/2) + n','Θ(n log n)',['Θ(n)','Θ(n²)','Θ(log n)'],'a=2, b=2 ⇒ n^log₂2 = n = f(n) ⇒ <b>caso 2</b> ⇒ Θ(n log n).'],
['T(n) = 3T(n/2) + n','Θ(n^log₂3) ≈ Θ(n^1,58)',['Θ(n)','Θ(n log n)','Θ(n²)'],'log₂3 ≈ 1,58 &gt; 1 ⇒ as folhas dominam ⇒ <b>caso 1</b> ⇒ Θ(n^log₂3).'],
['T(n) = 4T(n/2) + n²','Θ(n² log n)',['Θ(n²)','Θ(n³)','Θ(n log n)'],'n^log₂4 = n² = f(n) ⇒ <b>caso 2</b> ⇒ Θ(n² log n).'],
['T(n) = 4T(n/2) + n³','Θ(n³)',['Θ(n²)','Θ(n³ log n)','Θ(n² log n)'],'n^log₂4 = n² &lt; n³ ⇒ <b>caso 3</b> (regularidade: 4(n/2)³ = n³/2 ≤ ½·n³) ⇒ Θ(n³).'],
['T(n) = T(n/2) + 1','Θ(log n)',['Θ(1)','Θ(n)','Θ(n log n)'],'a=1, b=2 ⇒ n⁰ = 1 = f(n) ⇒ <b>caso 2</b> ⇒ Θ(log n) (busca binária).'],
['T(n) = 8T(n/2) + n²','Θ(n³)',['Θ(n²)','Θ(n² log n)','Θ(n⁴)'],'n^log₂8 = n³ &gt; n² ⇒ <b>caso 1</b> ⇒ Θ(n³).'],
['T(n) = 9T(n/3) + n','Θ(n²)',['Θ(n)','Θ(n log n)','Θ(n³)'],'n^log₃9 = n² &gt; n ⇒ <b>caso 1</b> ⇒ Θ(n²).'],
['T(n) = 2T(n/4) + √n','Θ(√n log n)',['Θ(√n)','Θ(n)','Θ(n log n)'],'n^log₄2 = n^½ = √n = f(n) ⇒ <b>caso 2</b> ⇒ Θ(√n log n).'],
['T(n) = 3T(n/4) + n log n','Θ(n log n)',['Θ(n^log₄3)','Θ(n² log n)','Θ(n)'],'log₄3 ≈ 0,79 &lt; 1 ⇒ f(n) = n log n é maior ⇒ <b>caso 3</b>. Regularidade: 3(n/4)log(n/4) ≤ (3/4)·n log n ⇒ Θ(n log n).'],
['T(n) = 2T(n/4) + 3T(n/4) + n^(1/3)','Θ(n^log₄5) ≈ Θ(n^1,16)',['Θ(n^(1/3))','Θ(n log n)','Não se aplica: há dois termos'],'Os termos têm o <b>mesmo tamanho</b> n/4, então somam: 5T(n/4) + n^(1/3). a=5, b=4, log₄5 ≈ 1,16 &gt; 1/3 ⇒ <b>caso 1</b>.'],
['T(n) = 7T(n/3) + n²','Θ(n²)',['Θ(n^log₃7)','Θ(n² log n)','Θ(n³)'],'log₃7 ≈ 1,77 &lt; 2 ⇒ <b>caso 3</b>; regularidade 7(n/3)² = (7/9)n² ≤ c·n² com c &lt; 1 ⇒ Θ(n²).'],
['T(n) = 2T(n/3) + 2^(6n)','Θ(2^(6n))',['Θ(n^log₃2)','Θ(2^(6n) log n)','Θ(n)'],'n^log₃2 ≈ n^0,63 é muito menor que a exponencial f(n) ⇒ <b>caso 3</b>; regularidade: 2·2^(2n) ≤ c·2^(6n) ⇒ Θ(f(n)).'],
['T(n) = T(n/2) + n','Θ(n)',['Θ(log n)','Θ(n log n)','Θ(n²)'],'a=1 ⇒ n⁰ = 1 &lt; n ⇒ <b>caso 3</b> (regularidade: n/2 ≤ ½·n) ⇒ Θ(n).'],
['T(n) = 16T(n/4) + n','Θ(n²)',['Θ(n)','Θ(n log n)','Θ(n² log n)'],'n^log₄16 = n² &gt; n ⇒ <b>caso 1</b> ⇒ Θ(n²).'],
['T(n) = 2T(n/2) + n²','Θ(n²)',['Θ(n log n)','Θ(n² log n)','Θ(n)'],'n^log₂2 = n &lt; n² ⇒ <b>caso 3</b> (regularidade: 2(n/2)² = n²/2 ≤ ½·n²) ⇒ Θ(n²).'],
['T(n) = 6T(n/3) + n² log n','Θ(n² log n)',['Θ(n^log₃6)','Θ(n²)','Θ(n³)'],'log₃6 ≈ 1,63 &lt; 2 ⇒ f(n) = n² log n domina ⇒ <b>caso 3</b> (regularidade: 6(n/3)²log(n/3) ≤ (2/3)n² log n).'],
['T(n) = 27T(n/3) + n²','Θ(n³)',['Θ(n²)','Θ(n² log n)','Θ(n)'],'n^log₃27 = n³ &gt; n² ⇒ <b>caso 1</b> ⇒ Θ(n³).'],
['T(n) = 2T(n/2) + 1','Θ(n)',['Θ(log n)','Θ(n log n)','Θ(1)'],'n^log₂2 = n &gt; 1 ⇒ <b>caso 1</b> ⇒ Θ(n).'],
['T(n) = 3T(n/3) + n','Θ(n log n)',['Θ(n)','Θ(n²)','Θ(n log² n)'],'n^log₃3 = n = f(n) ⇒ <b>caso 2</b> ⇒ Θ(n log n).'],
['T(n) = 3T(n/2) + n²','Θ(n²)',['Θ(n^log₂3)','Θ(n² log n)','Θ(n³)'],'log₂3 ≈ 1,58 &lt; 2 ⇒ <b>caso 3</b> (regularidade: 3(n/2)² = ¾n²) ⇒ Θ(n²).'],
['T(n) = T(2n/3) + 1','Θ(log n)',['Θ(n)','Θ(1)','Θ(n log n)'],'Aqui b = 3/2 &gt; 1 e a = 1 ⇒ n⁰ = 1 = f(n) ⇒ <b>caso 2</b> ⇒ Θ(log n).'],
['T(n) = 5T(n/2) + n²','Θ(n^log₂5) ≈ Θ(n^2,32)',['Θ(n²)','Θ(n² log n)','Θ(n³)'],'log₂5 ≈ 2,32 &gt; 2 ⇒ <b>caso 1</b>.'],
['T(n) = 2T(n/2) + n log n',NA+' (lacuna entre os casos 2 e 3)',['Θ(n log n)','Θ(n log² n) pelo caso 2','Θ(n²)'],'n^log₂2 = n e f(n) = n log n <b>não é polinomialmente maior</b> (só um fator log). Não cai em nenhum caso. (Por substituição/árvore dá Θ(n log² n).)'],
['T(n) = T(n−1) + T(n−2) + 1',NA+' (Fibonacci: redução por subtração)',['Θ(n log n)','Θ(n²)','Θ(2ⁿ) pelo caso 1'],'O mestre exige subproblemas de tamanho n/b (divisão). Aqui o problema diminui por <b>subtração</b>. Use substituição (resultado exponencial).'],
['T(n) = T(n/2) + T(n/4) + n',NA+' (subproblemas de tamanhos diferentes)',['Θ(n)','Θ(n log n)','Θ(n²)'],'Não dá para identificar um único <b>a</b> e <b>b</b>: os subproblemas têm tamanhos diferentes (n/2 e n/4).'],
['T(n) = 8T(n/4) + 8T(n/2) + n²',NA+' (subproblemas de tamanhos diferentes)',['Θ(n²)','Θ(n³)','Θ(n² log n)'],'Termos com n/4 e n/2 ⇒ tamanhos diferentes ⇒ mestre não se aplica (usa-se substituição ou Akra-Bazzi).'],
['T(n) = 0,5·T(n/2) + n',NA+' (a &lt; 1)',['Θ(n)','Θ(n log n)','Θ(log n)'],'O método mestre exige a ≥ 1.'],
['T(n) = 2T(n−1) + 1',NA+' (redução por subtração)',['Θ(n log n)','Θ(n)','Θ(n²)'],'Não tem a forma aT(n/b) + f(n). Por substituição/expansão resulta em Θ(2ⁿ).'],
['T(n) = T(n/3) + T(2n/3) + n',NA+' (subproblemas de tamanhos diferentes)',['Θ(n)','Θ(n log n) pelo caso 2','Θ(n²)'],'Tamanhos n/3 e 2n/3 diferentes ⇒ não se aplica diretamente.'],
];
const MASTER_CONCEPT = [
{q:'No método mestre, T(n) = aT(n/b) + f(n), o parâmetro <b>a</b> representa:',o:['O tamanho de cada subproblema','O número de subproblemas em que o problema é dividido','O custo de dividir e combinar','O caso base'],a:1,e:'a = nº de subproblemas; n/b = tamanho de cada um; f(n) = custo de dividir + combinar.'},
{q:'No método mestre, <b>b</b> representa:',o:['O número de chamadas recursivas','O fator pelo qual o tamanho da entrada é dividido em cada subproblema','O caso base','O expoente de f(n)'],a:1,e:'Cada subproblema tem tamanho n/b, com b &gt; 1.'},
{q:'Quais as condições de a e b para o método mestre?',o:['a ≥ 1 e b &gt; 1','a &gt; 1 e b ≥ 1','a &gt; 0 e b &gt; 0','a = b'],a:0,e:'a ≥ 1 (ao menos um subproblema) e b &gt; 1 (o problema realmente diminui). f(n) deve ser não negativa.'},
{q:'O primeiro passo prático ao aplicar o método mestre é:',o:['Provar por indução','Calcular n^(log_b a) e compará-lo com f(n)','Desenhar a árvore de recursão completa','Somar todos os termos'],a:1,e:'A comparação f(n) × n^(log_b a) determina o caso.'},
{q:'Se f(n) = Θ(n^(log_b a)), o resultado é:',o:['Θ(n^(log_b a))','Θ(n^(log_b a) · log n)','Θ(f(n) · log n²)','Θ(1)'],a:1,e:'Caso 2 (empate): multiplica por log n.'},
{q:'Se f(n) cresce polinomialmente MENOS que n^(log_b a), o resultado é:',o:['Θ(f(n))','Θ(n^(log_b a))','Θ(n^(log_b a) log n)','Não se aplica'],a:1,e:'Caso 1: as folhas dominam ⇒ Θ(n^(log_b a)).'},
{q:'Se f(n) cresce polinomialmente MAIS que n^(log_b a) (e vale a regularidade), o resultado é:',o:['Θ(f(n))','Θ(n^(log_b a))','Θ(n^(log_b a) log n)','Θ(1)'],a:0,e:'Caso 3: a raiz domina ⇒ Θ(f(n)).'},
{q:'A condição de <b>regularidade</b> do caso 3 é:',o:['a·f(n/b) ≤ c·f(n) para alguma constante c &lt; 1','f(n) = n','a = b','a·f(n/b) ≥ f(n)'],a:0,e:'Garante que o custo diminui a cada nível; assim o nível da raiz domina a soma.'},
{q:'Por que T(n) = 2T(n/2) + n log n NÃO pode ser resolvida pelo método mestre?',o:['Porque a = 2','Porque n log n não é polinomialmente maior que n (difere só por um fator log), então não cai nos casos 1, 2 ou 3','Porque tem log','Porque b = 2'],a:1,e:'Os casos 1 e 3 exigem diferença da forma n^ε. Aqui a diferença é só log n.'},
{q:'Qual situação impede o uso do método mestre?',o:['a = 1','b = 4','Subproblemas de tamanhos diferentes, como T(n/2) + T(n/4)','f(n) = 1'],a:2,e:'Não se identifica um único par (a, b).'},
{q:'Qual estratégia usar quando o método mestre não se aplica?',o:['Desistir','Substituição (chute + indução), árvore de recursão para achar o chute, ou Akra-Bazzi','Usar apenas bubble sort','Ignorar f(n)'],a:1,e:'Substituição abrange todas as recorrências.'},
{q:'Em T(n) = 2T(n/4) + 3T(n/4) + n^(1/3), como proceder?',o:['O método mestre é impossível','Somar os termos de mesmo tamanho: 5T(n/4) + n^(1/3), a = 5 e b = 4','Usar a = 2 e b = 3','Usar a = 3 e b = 2'],a:1,e:'Mesmo tamanho n/4 ⇒ a = 2 + 3 = 5. Depois log₄5 ≈ 1,16 &gt; 1/3 ⇒ caso 1.'},
{q:'Calcule n^(log_b a) para T(n) = 8T(n/2) + n:',o:['n','n²','n³','n⁸'],a:2,e:'log₂8 = 3 ⇒ n³.'},
{q:'Fibonacci, T(n) = T(n−1) + T(n−2) + 1, por que não usa o método mestre?',o:['Porque tem +1','Porque o tamanho do problema reduz por subtração (n−1, n−2), e não por divisão (n/b)','Porque a = 2','Porque é iterativo'],a:1,e:'A forma exigida é aT(n/b) + f(n).'},
{q:'Em qual caso do método mestre o resultado contém o fator log n multiplicando?',o:['Caso 1','Caso 2','Caso 3','Nenhum'],a:1,e:'Somente no caso 2 (f e n^(log_b a) crescem igual).'},
];
MASTER_CONCEPT.forEach(q => MCQ.push({ ...q, t: 'mestre' }));
MASTER_BANK.forEach(([rec, ans, wr, e]) => MCQ.push({
  t: 'mestre',
  q: `Resolva pelo método mestre: <b>${rec}</b>`,
  o: [ans, ...wr], a: 0, e
}));
