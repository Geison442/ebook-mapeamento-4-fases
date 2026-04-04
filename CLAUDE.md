# CLAUDE.md — Ebook 1: Mapeamento das 4 Fases Internas
# Ecossistema Código Lunar

> Consultar SEMPRE antes de qualquer sessão neste repositório.
> Manual completo de padrões: C:\Users\DELL\AIOX-Negocio\aprendizados\manual-padrao-ebooks.md

---

## IDENTIDADE DO PRODUTO

- **Nome:** Mapeamento das 4 Fases Internas
- **Produto:** Ebook 1 do ecossistema Código Lunar
- **Deploy:** Cloudflare Pages (auto-deploy via GitHub)
- **URL:** https://codigo-lunar-mapeamento.pages.dev
- **Stack:** HTML puro + CSS + JS vanilla (sem frameworks)
- **Arquivo principal:** `index.html` (contém HTML + CSS inline crítico + todo o JS)
- **Estilos:** `styles.css` (CSS completo separado)
- **Service Worker:** `service-worker.js` — estratégia Stale-While-Revalidate v1.0.8

---

## ALMA VISUAL — REGRA ABSOLUTA

Este ebook deve parecer um **livro físico luxuoso em modo noturno**.
**NUNCA** parecer um app genérico.

Elementos obrigatórios que já estão implementados:
- Cormorant Garamond como fonte principal
- Drop cap dourado no início de cada capítulo
- Blockquotes com aspas gigantes e borda dourada
- Ornamentos entre seções: ✦ ✧ ☽ ◆ ❋
- Numeração romana nos capítulos
- Sombra lateral simulando espessura de livro físico
- Efeito de virada de página 2D entre capítulos (translateX + opacity)

---

## PALETA DE CORES

```
--bg:          #0B0F19  (fundo principal)
--surface:     #111827  (superfície principal — book container)
--surface-2:   #1a2235  (superfície secundária)
--primary:     #4F46E5  (azul índigo)
--secondary:   #8B5CF6  (roxo)
--text:        #F3F4F6  (texto principal)
--text-muted:  #9CA3AF  (texto secundário)
--gold:        #C5A059  (dourado — cor de destaque)
```

**White mode:** bg `#F5F0E8`, surface `#FFFFFF`, gold `#8B6914`

---

## FUNCIONALIDADES IMPLEMENTADAS

### Leitura
- Grifar parágrafos em 4 cores (ouro, roxo, rosa, verde)
  - Sistema por parágrafo: modo grifo → toque no `<p>` → tooltip de cores
  - NUNCA usar Selection API — quebra no iOS
  - Android: touchend handler + user-select:none + touch-action:manipulation em grifo-mode
- Notas marginais com ícone 📝 por parágrafo
- Marcador de página com banner e indicador no índice
- Ajuste de fonte A- A+ com 5 tamanhos
- Modo foco com pop-up explicativo
- Flip de página 2D animado entre capítulos (translateX + opacity — NUNCA rotateY)
- Swipe horizontal entre capítulos no mobile (com edge guard de 22px)
- 4 modos de leitura: Dark, White, Sépia, Night
- Barra de ferramentas fixa com tooltips

### Acompanhamento vitalício
- Relógio ao vivo e saudação dinâmica por horário
- Fase atual sugerida pelo dia do mês
- Calendário real com todos os dias do mês (28/29/30/31)
- Navegação entre meses
- Modal de registro diário (humor, energia, práticas, nota)
- Questionário mensal automático
- Insights semanais e mensais com tom ancestral
- Recomendações de cristais, ervas e rituais por fase
- Gráfico de energia diário (últimos 30 dias)
- Gráfico de energia média por mês
- Linha do tempo com marcos celebrados (9 marcos expandidos)
- Frase motivacional personalizada por tempo de uso
- Modo cerimônia com vela animada

### Exportação
- Download elegante em HTML com layout premium escuro
  - Fonte Cormorant Garamond via Google Fonts
  - Capa com nome, data, ornamentos ✦ ✧ ☽ ◆
  - Seções: Exercícios, Grifos, Anotações, Insights
  - Botão "Imprimir / Salvar PDF"
  - Nome do arquivo: `Mapeamento-4-Fases-[Nome]-[Data].html`
- Exportação PDF elegante da biblioteca (abre em nova aba)
- Exportação .txt da biblioteca

### Biblioteca pessoal
- Abas: Grifos e Anotações
- Grifos com cor e texto do parágrafo original
- Anotações com data/hora de criação

### PWA
- Service Worker Stale-While-Revalidate (NUNCA cache-first para HTML/CSS/JS)
- Cache-first apenas para ícones PNG e fontes
- Todos os paths com `./`
- Botão instalação PWA
- Ícones: icon-512.png, icon-192.png, icon-180.png

---

## PROBLEMAS JÁ RESOLVIDOS (não regredir)

| Problema | Solução aplicada |
|----------|-----------------|
| Grifo quebra no iOS | NUNCA usar Selection API — sistema por parágrafo com classe CSS |
| Grifo não funciona no Android | touchend handler + user-select:none + touch-action:manipulation em grifo-mode |
| Texto invisível no White/Sépia | Usar sempre var(--text), var(--text-muted) — nunca hardcode |
| Flip causa jank no mobile | Usar translateX + opacity (2D puro) — NUNCA perspective/rotateY |
| Safari swipe conflita | Edge guard: ignorar touchstart nos 22px das bordas |
| iOS auto-zoom em inputs | font-size mínimo 16px em inputs no mobile |
| Layout quebrado após deploy | Sem @import duplicado + paths ./ + CSS crítico inline + versão SW incrementada |
| Deploy bloqueado | NUNCA usar Co-Authored-By nos commits |
| Double padding nas seções Jornada/Biblioteca | Removido padding CSS do #section-journey e #section-library (o inner div já provê padding) |
| White mode — worksheets e inputs escuros | Overrides em body.mode-white para .worksheet, .input-text, .phase-card, etc. |

---

## ESTRUTURA DE ARQUIVOS

```
index.html          — HTML + CSS crítico inline + TODO o JavaScript
styles.css          — CSS completo
app.js              — JS auxiliar mínimo (apenas service worker register + app state)
service-worker.js   — SW Stale-While-Revalidate (versão atual: 1.0.8)
manifest.json       — PWA manifest
icon-512.png        — Ícone PWA
icon-192.png        — Ícone PWA
icon-180.png        — Ícone Apple Touch
base-conhecimento/  — PDFs de referência (não deployados)
```

---

## REGRAS OBRIGATÓRIAS

### ARQUITETURA MULTI-FILE — REGRA ABSOLUTA DO ECOSSISTEMA
- `index.html` → estrutura HTML + CSS crítico inline
- `app.js` → todo o JavaScript (sem exceção)
- `sw.js` → Service Worker Stale-While-Revalidate
- `manifest.json` → configuração PWA
- ícones: `icon-180.png`, `icon-192.png`, `icon-512.png`

**NUNCA single-file. NUNCA JavaScript inline no HTML.**

1. **NUNCA** adicionar `Co-Authored-By` nos commits — bloqueia o deploy automático no Cloudflare Pages
2. **SEMPRE** incrementar versão do SW ao alterar CSS/JS/HTML
3. **SEMPRE** usar `./` em todos os paths de recursos
4. **NUNCA** usar `@import` no CSS quando o HTML já carrega a fonte via `<link>`
5. Animar flip de página **apenas** com translateX + opacity (não rotateY)
6. Grifo: **apenas** sistema por parágrafo — **nunca** Selection API
7. Inputs mobile: **sempre** font-size mínimo 16px
8. Modos de leitura: **nunca** hardcode de cor — sempre `var(--text)`, `var(--surface)` etc.

---

## CHECKLIST ANTES DE COMMIT

- [ ] Versão do SW incrementada (service-worker.js)
- [ ] Sem @import duplicado no CSS
- [ ] Todos os paths com ./
- [ ] Testado localmente
- [ ] Commit sem Co-Authored-By
