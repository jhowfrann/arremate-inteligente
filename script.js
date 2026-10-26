/* ========================================================================
   ARREMATE INTELIGENTE — script.js
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initModulo8();
});

/* ========================================================================
   MENU LATERAL + LINK ATIVO
   ======================================================================== */
function initMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  const openSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.add('open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (sidebar?.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  }

  overlay?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
}

/* ========================================================================
   MÓDULO 8 — PETIÇÃO DE ARREMATAÇÃO A PRAZO
   ======================================================================== */

const STORAGE_KEY = 'ai-petition-form-v1';
const CAMPOS_CALCULAVEIS = [
  'valor_avaliacao', 'percentual_proposta', 'valor_proposta',
  'percentual_entrada', 'valor_entrada', 'saldo',
  'num_parcelas', 'valor_parcela'
];

function initModulo8() {
  const form = document.getElementById('petitionForm');
  if (!form) return;

  carregarDadosPeticao();

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (CAMPOS_CALCULAVEIS.includes(field.id)) {
        autoCalcular(field.id);
      }
      salvarDadosPeticao();
    });
    field.addEventListener('change', salvarDadosPeticao);
  });

  document.getElementById('btnVisualizar')?.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      gerarPeticao();
      salvarDadosPeticao();
    } catch (err) {
      console.error('Erro ao gerar petição:', err);
      alert('Erro ao gerar petição: ' + err.message);
    }
  });

  document.getElementById('btnImprimir')?.addEventListener('click', () => window.print());

  document.getElementById('btnLimpar')?.addEventListener('click', () => {
    if (!confirm('Limpar todos os dados preenchidos?')) return;
    form.reset();
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    const out = document.getElementById('petitionOutput');
    if (out) { out.innerHTML = ''; out.style.display = 'none'; }
    const btnImp = document.getElementById('btnImprimir');
    if (btnImp) btnImp.style.display = 'none';
    setSaveStatus('🗑️ Dados limpos');
  });

  // Recalcula cadeia após restaurar dados
  autoCalcular('valor_avaliacao');

  setSaveStatus('💾 Pronto para digitar');
}

/* ---------- Auto-cálculo dos campos complementares ---------- */

function autoCalcular(origem) {
  const g = (id) => {
    const raw = (document.getElementById(id)?.value || '').toString().replace(',', '.');
    const n = parseFloat(raw);
    return isFinite(n) ? n : 0;
  };
  const set = (id, val) => {
    if (id === origem || !isFinite(val) || val < 0) return;
    const el = document.getElementById(id);
    if (el) el.value = Math.round(val * 100) / 100;
  };

  const aval = g('valor_avaliacao');
  let percProp = g('percentual_proposta');
  let prop = g('valor_proposta');
  let percEnt = g('percentual_entrada');
  let ent = g('valor_entrada');
  let saldo = g('saldo');
  let numParc = g('num_parcelas');
  let valParc = g('valor_parcela');

  // Etapa 1: valor_proposta <-> percentual_proposta
  if (origem === 'valor_avaliacao') {
    if (aval && prop && !percProp) {
      percProp = prop / aval * 100;
      set('percentual_proposta', percProp);
    } else if (aval && percProp) {
      prop = aval * percProp / 100;
      set('valor_proposta', prop);
    }
  } else if (origem === 'percentual_proposta') {
    if (aval && percProp) {
      prop = aval * percProp / 100;
      set('valor_proposta', prop);
    }
  } else if (origem === 'valor_proposta') {
    if (aval) {
      percProp = prop / aval * 100;
      set('percentual_proposta', percProp);
    }
  }

  // Etapa 2: valor_entrada <-> percentual_entrada
  if (origem === 'valor_entrada') {
    if (prop) {
      percEnt = prop ? ent / prop * 100 : 0;
      set('percentual_entrada', percEnt);
    }
  } else if (origem === 'percentual_entrada') {
    if (prop) {
      ent = prop * percEnt / 100;
      set('valor_entrada', ent);
    }
  } else {
    if (prop && percEnt) {
      ent = prop * percEnt / 100;
      set('valor_entrada', ent);
    }
  }

  // Etapa 3: saldo
  if (origem !== 'saldo' && prop && ent) {
    saldo = prop - ent;
    set('saldo', saldo);
  }

  // Etapa 4: parcelas
  if (origem === 'valor_parcela') {
    if (saldo && valParc) {
      numParc = Math.max(1, Math.ceil(saldo / valParc));
      set('num_parcelas', numParc);
    }
  } else if (saldo && numParc) {
    valParc = saldo / numParc;
    set('valor_parcela', valParc);
  }
}

/* ---------- localStorage ---------- */

function salvarDadosPeticao() {
  const data = {};
  document.querySelectorAll('#petitionForm input, #petitionForm textarea').forEach((field) => {
    if (field.id) data[field.id] = field.value;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaveStatus('💾 Salvo automaticamente');
  } catch (e) {
    console.warn('Falha ao salvar:', e);
    setSaveStatus('⚠️ Não foi possível salvar');
  }
}

function carregarDadosPeticao() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const data = JSON.parse(saved);
    let count = 0;
    Object.entries(data).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el && value) { el.value = value; count++; }
    });
    if (count > 0) setSaveStatus('💾 Dados recuperados (' + count + ' campos)');
  } catch (e) {
    console.warn('Falha ao carregar:', e);
  }
}

function setSaveStatus(msg) {
  const el = document.getElementById('saveStatus');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('visible'), 2500);
}

/* ---------- Geração da petição ---------- */

function gerarPeticao() {
  const v = (id) => (document.getElementById(id)?.value || '').trim();
  const ext = (id) => numeroParaExtenso(v(id));

  const campos = {
    juizo: v('juizo'),
    comarca: v('comarca'),
    processo: v('processo'),
    exequente: v('exequente'),
    executado: v('executado'),
    nome: v('nome'),
    nacionalidade: v('nacionalidade'),
    estado_civil: v('estado_civil'),
    profissao: v('profissao'),
    rg: v('rg'),
    cpf: v('cpf'),
    endereco: v('endereco'),
    descricao_imovel: v('descricao_imovel'),
    matricula: v('matricula'),
    cartorio: v('cartorio'),
    data_leilao: formatDate(v('data_leilao')),
    valor_avaliacao: formatBRL(v('valor_avaliacao')),
    valor_avaliacao_ext: ext('valor_avaliacao'),
    valor_proposta: formatBRL(v('valor_proposta')),
    valor_proposta_ext: ext('valor_proposta'),
    percentual_proposta: v('percentual_proposta'),
    valor_entrada: formatBRL(v('valor_entrada')),
    valor_entrada_ext: ext('valor_entrada'),
    percentual_entrada: v('percentual_entrada'),
    saldo: formatBRL(v('saldo')),
    saldo_ext: ext('saldo'),
    num_parcelas: v('num_parcelas'),
    valor_parcela: formatBRL(v('valor_parcela')),
    valor_parcela_ext: ext('valor_parcela'),
    dia_vencimento: v('dia_vencimento'),
    advogado: v('advogado'),
    oab: v('oab'),
    cidade: v('cidade'),
    data_peticao: formatDate(v('data_peticao'))
  };

  const out = document.getElementById('petitionOutput');
  if (!out) throw new Error('Elemento petitionOutput não encontrado.');

  out.innerHTML = montarPeticao(campos);
  out.style.display = 'block';

  const btnImp = document.getElementById('btnImprimir');
  if (btnImp) btnImp.style.display = 'inline-flex';

  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function montarPeticao(c) {
  const E = (texto) =>
    `<span class="petition-field">${texto || '_____________'}</span>`;

  return `
    <p style="text-align:center; font-weight:700;">EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA ${E(c.juizo)} DA COMARCA DE ${E(c.comarca)}</p>

    <p><strong>Processo nº:</strong> ${E(c.processo)}<br>
    <strong>Exequente:</strong> ${E(c.exequente)}<br>
    <strong>Executado(a):</strong> ${E(c.executado)}</p>

    <p>${E(c.nome)}, ${E(c.nacionalidade)}, ${E(c.estado_civil)}, ${E(c.profissao)}, portador(a) do RG nº ${E(c.rg)} e do CPF nº ${E(c.cpf)}, residente e domiciliado(a) em ${E(c.endereco)}, por seu(sua) advogado(a) infra-assinado(a), com procuração em anexo, nos autos da execução em epígrafe, vem, respeitosamente, à presença de Vossa Excelência, com fundamento nos arts. 892, caput, e 895 do Código de Processo Civil, apresentar</p>

    <h2>PROPOSTA DE ARREMATAÇÃO A PRAZO</h2>

    <p>nos seguintes termos:</p>

    <p><strong>1. Imóvel objeto do leilão designado para o dia ${E(c.data_leilao)}:</strong> ${E(c.descricao_imovel)}, matrícula nº ${E(c.matricula)}, registrado no ${E(c.cartorio)}.</p>

    <p><strong>2. Valor da avaliação:</strong> R$ ${E(c.valor_avaliacao)} (${E(c.valor_avaliacao_ext)}).</p>

    <p><strong>3. Proposta:</strong> R$ ${E(c.valor_proposta)} (${E(c.valor_proposta_ext)}), correspondente a ${E(c.percentual_proposta)}% do valor da avaliação.</p>

    <p><strong>4. Forma de pagamento:</strong></p>
    <p style="margin-left: 2rem;">a) entrada à vista, no ato da homologação, de R$ ${E(c.valor_entrada)} (${E(c.valor_entrada_ext)}), correspondente a ${E(c.percentual_entrada)}% do valor da proposta, nos termos do art. 895, § 1º, do CPC;</p>
    <p style="margin-left: 2rem;">b) saldo remanescente de R$ ${E(c.saldo)} (${E(c.saldo_ext)}), em ${E(c.num_parcelas)} parcelas mensais, iguais e sucessivas, no valor de R$ ${E(c.valor_parcela)} (${E(c.valor_parcela_ext)}) cada uma, com vencimento no dia ${E(c.dia_vencimento)} de cada mês, a serem depositadas em conta judicial à disposição deste Juízo (art. 895, § 2º, do CPC).</p>

    <p><strong>5. Garantia:</strong> o próprio imóvel arrematado, por hipoteca judicial, nos termos do art. 895, § 1º, do CPC.</p>

    <p><strong>6. Ciência das condições legais:</strong></p>
    <p style="margin-left: 2rem;">a) a presente proposta não suspende o leilão;</p>
    <p style="margin-left: 2rem;">b) a proposta de pagamento à vista sempre prevalecerá sobre esta proposta parcelada;</p>
    <p style="margin-left: 2rem;">c) em caso de atraso no pagamento de qualquer parcela, incidirá multa de 10% sobre a soma da parcela inadimplida com as parcelas vincendas (art. 895, § 4º, do CPC);</p>
    <p style="margin-left: 2rem;">d) o inadimplemento autoriza o exequente a pedir a resolução da arrematação ou a execução do valor devido (art. 895, § 5º, do CPC).</p>

    <p><strong>Requer, por fim:</strong></p>
    <p style="margin-left: 2rem;">a) a homologação da presente proposta de arrematação, com a expedição da competente carta de arrematação, nos termos acima, para fins de registro junto à matrícula do imóvel;</p>
    <p style="margin-left: 2rem;">b) após a quitação integral do saldo, a expedição de mandado judicial de cancelamento da hipoteca judicial.</p>

    <p>Termos em que,<br>Pede deferimento.</p>

    <p style="text-align:right;">${E(c.cidade)}, ${E(c.data_peticao)}.</p>

    <div class="petition-signature">
      <hr>
      <p><strong>${E(c.advogado)}</strong></p>
      <p>${E(c.oab)}</p>
    </div>
  `;
}

/* ---------- Helpers de formatação ---------- */

function numeroParaExtenso(valor) {
  const num = parseFloat(valor);
  if (!num || isNaN(num) || num < 0) return '';
  const reais = Math.floor(num);
  const centavos = Math.round((num - reais) * 100);
  let texto = inteiroParaExtenso(reais) + (reais === 1 ? ' real' : ' reais');
  if (centavos > 0) {
    texto += ' e ' + inteiroParaExtenso(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
  }
  return texto;
}

function inteiroParaExtenso(n) {
  if (n === 0) return 'zero';
  const u = ['','um','dois','três','quatro','cinco','seis','sete','oito','nove'];
  const d10 = ['dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
  const d = ['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
  const c = ['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];

  if (n === 100) return 'cem';
  if (n < 10) return u[n];
  if (n < 20) return d10[n - 10];
  if (n < 100) {
    const dd = Math.floor(n / 10), uu = n % 10;
    return d[dd] + (uu ? ' e ' + u[uu] : '');
  }
  if (n < 1000) {
    const cc = Math.floor(n / 100), r = n % 100;
    return c[cc] + (r ? ' e ' + inteiroParaExtenso(r) : '');
  }
  if (n < 1000000) {
    const mil = Math.floor(n / 1000), r = n % 1000;
    const parte = mil === 1 ? 'mil' : inteiroParaExtenso(mil) + ' mil';
    return parte + (r ? ' e ' + inteiroParaExtenso(r) : '');
  }
  const mi = Math.floor(n / 1000000), r = n % 1000000;
  const parte = mi === 1 ? 'um milhão' : inteiroParaExtenso(mi) + ' milhões';
  return parte + (r ? ' e ' + inteiroParaExtenso(r) : '');
}

function formatBRL(valor) {
  const n = parseFloat(String(valor).replace(',', '.'));
  if (isNaN(n)) return '';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(valor) {
  if (!valor) return '';
  const parts = valor.split('-');
  if (parts.length !== 3) return valor;
  const [a, m, d] = parts;
  return `${d}/${m}/${a}`;
}