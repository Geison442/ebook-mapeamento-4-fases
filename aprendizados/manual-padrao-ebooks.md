# Manual Padrão — Desenvolvimento de Ebooks Código Lunar

> Guia completo e obrigatório para todos os apps do ecossistema Código Lunar.
> Consultar antes de iniciar qualquer novo projeto.

---

## 1. PADRÃO VISUAL OBRIGATÓRIO PARA TODOS OS EBOOKS

**Alma de livro premium — nunca cara de app genérico.**

| Elemento | Especificação |
|---|---|
| Fonte principal | Cormorant Garamond (literária, elegante) |
| Drop cap | Dourado no início de cada capítulo |
| Blockquotes | Borda dourada + aspas decorativas |
| Ornamentos entre seções | ✦ ✧ ☽ ◆ ❋ |
| Margens | Generosas, simulando livro físico |
| Fundo | Efeito de textura de papel |
| Numeração de capítulos | Algarismos romanos (I, II, III…) |

### Por que isso importa
O usuário precisa sentir que está segurando um livro cuidadosamente editado, não abrindo mais um site. Cada detalhe tipográfico reforça a autoridade do conteúdo.

---

## 2. FUNCIONALIDADES OBRIGATÓRIAS EM TODOS OS APPS

### Leitura e marcação
- [ ] **Grifar texto em 3 cores** com modo de grifo adaptado para mobile (tap-and-hold)
- [ ] **Notas marginais** com ícone 📝 por parágrafo
- [ ] **Marcador de página** 🎗️ (persiste via localStorage)
- [ ] **Ajuste de fonte** A- A+ (mínimo 3 tamanhos)
- [ ] **Modo foco** ativado com toque longo (oculta UI, maximiza texto)

### Navegação
- [ ] **Swipe horizontal** entre capítulos no mobile
- [ ] **Barra de ferramentas fixa** no topo (não some ao rolar)

### Onboarding
- [ ] **Tour guiado na primeira abertura** — 5 slides explicando as principais funcionalidades
- [ ] **Seção "Como usar"** acessível a qualquer momento no menu lateral

### PWA
- [ ] **Botão de instalação PWA chamativo** (não escondido, não sutil)
- [ ] **Notificação de nova versão disponível** (discreta, não intrusiva)

---

## 3. CONFIGURAÇÃO TÉCNICA PADRÃO

### Service Worker
```js
// Estratégia padrão por tipo de recurso:
// HTML, CSS, JS  → Stale-While-Revalidate
// Ícones, fontes → Cache-First
```

- Notificação discreta ao detectar atualização disponível
- Versão do cache **incrementada a cada deploy** (ex: `v1.0.0`, `v1.0.1`…)

### CSS
- Todos os paths com `./` (relativo, sem barra inicial)
- **Sem `@import` duplicado** — verificar antes de cada deploy
- **CSS crítico inline no `<head>`** como fallback para carregamento rápido

### Checklist técnico rápido
```
./caminho/para/arquivo.css   ✅
/caminho/para/arquivo.css    ❌
@import url(fonte) duplicado ❌
CSS crítico ausente no head  ❌
```

---

## 4. PADRÃO MOBILE OBRIGATÓRIO

| Regra | Valor mínimo |
|---|---|
| Tamanho dos botões | 44 × 44 px |
| Tamanho de fonte | 16 px |
| Navegação entre capítulos | Swipe horizontal |
| Feedback ao toque | Visual obrigatório (highlight, ripple, etc.) |

### Barra de ferramentas padrão
```
☰  |  ☽  |  🎗️  |  ✏️  |  A-  A+  |  🌙
```
- `☰` Menu / índice
- `☽` Modo noturno
- `🎗️` Marcador de página
- `✏️` Ferramentas de grifo/nota
- `A- A+` Tamanho de fonte
- `🌙` Atalho temático (pode variar por produto)

---

## 5. CHECKLIST ANTES DE PUBLICAR

### Visual
- [ ] Visual tem alma de livro, não de app
- [ ] Tour guiado funcionando na primeira abertura (5 slides)
- [ ] Todas as funcionalidades mobile testadas no dispositivo real

### Técnico
- [ ] Service worker com estratégia Stale-While-Revalidate configurada
- [ ] CSS crítico inline no `<head>`
- [ ] Todos os paths com `./`
- [ ] Sem `@import` duplicado no CSS
- [ ] Versão do cache incrementada

### PWA
- [ ] Botão de instalação PWA funcionando no Android
- [ ] Botão de instalação PWA funcionando no iOS (instruções via Safari)
- [ ] Testado com cache limpo após deploy (`Ctrl+Shift+R`)

### Documentação
- [ ] Documentado no Obsidian (prints + URL publicada)

---

## 6. TEMPLATE DE COMANDO PARA NOVOS APPS

Ao iniciar um novo app, o comando inicial deve conter **todos os itens abaixo**:

```
1. Paleta de cores específica do produto
   (ex: roxo #4A1860 + dourado #D4AF37 + creme #F5F0E8)

2. Alma visual específica
   (ex: livro literário, diário íntimo, laboratório, grimório, etc.)

3. Conteúdo base
   - PDF(s) do conteúdo
   - Código anterior como referência (se existir)

4. Instrução obrigatória:
   "Implemente TODAS as funcionalidades do manual-padrao-ebooks.md"

5. Instrução obrigatória:
   "Alma de livro premium, nunca app genérico"

6. Instrução obrigatória:
   "Preserve e expanda funcionalidades, nunca substitua"
```

### Exemplo de comando completo
```
Crie um ebook interativo para o produto "Diário das Sombras".

Paleta: preto #0A0A0A, vinho #6B0F1A, dourado #C9A84C, creme #F2EDE4.
Alma visual: diário íntimo manuscrito, encadernação de couro.
Conteúdo: [PDF anexo] + estrutura do ebook01 como referência.

Implemente TODAS as funcionalidades do manual-padrao-ebooks.md.
Alma de livro premium, nunca app genérico.
Preserve e expanda funcionalidades, nunca substitua.
```

---

## 7. ORDEM DE EXECUÇÃO PARA CADA NOVO APP

```
1.  Criar pasta no Desktop
        ex: ebook-diario-sombras

2.  Copiar PDFs relevantes da base de conhecimento
        base-conhecimento/ → pasta do novo projeto

3.  Abrir Claude Code na pasta
        claude-code .

4.  Dar comando completo
        paleta + alma + conteúdo + referência ao manual

5.  Aprovar edições com opção 2
        (revisar diff antes de confirmar)

6.  Testar localmente
        start index.html   (Windows)
        open index.html    (Mac)

7.  Commit e push para GitHub
        git add . && git commit -m "..." && git push

8.  Aguardar deploy automático no Netlify
        ~1–2 min após o push

9.  Testar no desktop com cache limpo
        Ctrl+Shift+R

10. Testar no mobile com cache limpo
        Configurações do browser → limpar cache do site

11. Documentar no Obsidian
        URL publicada + prints das telas principais
```

---

## 8. HISTÓRICO DE APRENDIZADOS

> Registrar aqui decisões não óbvias tomadas durante o desenvolvimento de apps anteriores.

### Ebook 1 — Mapeamento das 4 Fases Internas
- Path `/styles.css` causou falha de carregamento no Netlify → corrigido para `./styles.css`
- `@import` duplicado no CSS gerava conflito de fontes
- CSS crítico inline no `<head>` resolveu flash de texto sem estilo no primeiro carregamento
- Service Worker v1 não atualizava conteúdo → adicionado Stale-While-Revalidate + notificação de versão
- Modo foco, marcador, grifo mobile e 4 modos de leitura adicionados na v2 após feedback de uso real
- Flip de página animado reforça a alma de livro físico

---

*Última atualização: 2026-03-24*
*Ecossistema: Código Lunar*
