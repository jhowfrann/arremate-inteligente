# 🏛️ Arremate Inteligente

Curso gratuito e didático sobre **arrematação judicial** e **venda direta** de imóveis, do zero ao primeiro arremate.

🔗 **Acesse:** [https://jhowfrann.github.io/arremate-inteligente/](https://jhowfrann.github.io/arremate-inteligente/)

---

## 📚 Sobre o projeto

O **Arremate Inteligente** é um material de estudo em formato web sobre como comprar imóveis em leilão judicial e venda direta no Brasil, com foco em iniciantes que querem começar com pouco capital.

Cobre desde os fundamentos jurídicos (CPC, editais, prazos) até o passo a passo operacional (caução, pregão, carta de arrematação, imissão na posse, reforma e revenda).

---

## 🗂️ Módulos

| # | Módulo | Conteúdo |
|---|--------|----------|
| 1 | **O Jogo da Arrematação** | Judicial vs. venda direta, 1ª/2ª praça, preço vil |
| 2 | **Pagamento e Parcelamento** | Art. 895 do CPC, entrada de 25%, até 30x, custos ocultos |
| 3 | **A Estratégia da Venda Direta** | Modalidades da Caixa, outros bancos, prazos e passo a passo |
| 4 | **A Arrematação na Prática** | Cadastro, caução, pregão, carta, registro e imissão na posse |
| 5 | **Análise e Due Diligence** | Matrícula, certidões, vistoria e riscos ocultos |
| 6 | **Pós-Arrematação e Flip** | Reforma por ROI, regularização, IR sobre ganho de capital |
| 7 | **Plano de Ação com Pouco Capital** | Funil, alavancagens (FGTS, consórcio, parceria) e roteiro de 90 dias |
| 8 | **Modelo de Petição** | Formulário interativo que gera petição de proposta parcelada em PDF |

---

## ✨ Funcionalidades

- 📱 **Design responsivo** — funciona no celular e no computador
- 🧭 **Menu lateral** com destaque automático do módulo atual
- 📊 **Tabelas comparativas** e callouts (dicas, avisos, informações)
- 🖨️ **Módulo 8 interativo** com:
  - Auto-cálculo de valores, percentuais e parcelas
  - Salvamento automático dos campos via `localStorage`
  - Conversão automática de valores para extenso
  - Geração de petição pronta para impressão/PDF
- 🖼️ **Open Graph** — prévia bonita ao compartilhar no WhatsApp e redes sociais

---

## 🛠️ Tecnologias

- **HTML5** — 10 páginas estáticas (index + 8 módulos + estilos)
- **CSS3** — layout responsivo, variáveis CSS, media queries para impressão
- **JavaScript** (vanilla) — menu, formulário, cálculo, localStorage e geração de petição
- **GitHub Pages** — hospedagem gratuita

Sem frameworks, sem dependências externas. Só o básico que funciona.

---

## 📁 Estrutura

```text
arremate-inteligente/
├── index.html                    # Home com sumário
├── modulo-1.html                 # O Jogo da Arrematação
├── modulo-2.html                 # Pagamento e Parcelamento
├── modulo-3.html                 # A Estratégia da Venda Direta
├── modulo-4.html                 # A Arrematação na Prática
├── modulo-5.html                 # Análise e Due Diligence
├── modulo-6.html                 # Pós-Arrematação e Flip
├── modulo-7.html                 # Plano de Ação com Pouco Capital
├── modulo-8.html                 # Modelo de Petição
├── style.css                     # CSS compartilhado
├── script.js                     # JS compartilhado
├── logo.png                      # Logo do curso
└── capa-compartilhamento.jpg     # Imagem de preview (Open Graph)
```

---

## 🚀 Como rodar localmente

### Opção 1 — abrir direto (mais simples)

Baixe os arquivos e clique duas vezes em `index.html`. A maioria das funções funciona, **exceto o salvamento automático** do Módulo 8 (que exige `http://` ou `https://`).

### Opção 2 — servidor local (recomendado)

Se você tem Python instalado:

```bash
cd arremate-inteligente
python -m http.server 8000
```

Depois abra: [http://localhost:8000](http://localhost:8000)

Se você tem Node.js:

```bash
npx serve .
```

---

## 📤 Deploy no GitHub Pages

1. Suba os arquivos para um repositório público no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Source**, escolha:
   - Branch: `main`
   - Pasta: `/ (root)`
4. Clique em **Save**.
5. Em 1–2 minutos, o site estará em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

---

## ⚠️ Aviso

Este material é **didático** e **informativo**. Não constitui:

- Consultoria jurídica
- Recomendação de investimento
- Garantia de resultado financeiro

Antes de dar qualquer lance em leilão, **consulte um advogado** e faça a **devida diligência** nos autos do processo e na matrícula do imóvel.

---

## 👤 Autor

**Jhowfrann Silva** — São Luís/MA

Estudante e investidor em formação na área de leilões de imóveis.

---

## 📄 Licença

Este projeto está disponível para fins **pessoais e educacionais**. Se for usar o conteúdo em outro material, dê os devidos créditos e referencie o repositório original.

---

## 🤝 Contribuições

Sugestões, correções e melhorias são bem-vindas. Se encontrar algum erro no conteúdo ou no código, abra uma **issue** ou envie um **pull request**.
