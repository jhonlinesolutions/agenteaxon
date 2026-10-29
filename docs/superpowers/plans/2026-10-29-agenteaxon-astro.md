# agenteaxon.com.br em Astro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o site HTML estático escuro por um site Astro claro, com movimento, mesmas URLs e SEO/GEO melhorados, publicado na Cloudflare Pages da JH a partir do repo `jhonlinesolutions/agenteaxon`.

**Architecture:** Projeto Astro estático na raiz do repo (o HTML antigo vai para `legacy/` como fonte de conteúdo e é apagado no fim). Um layout base concentra SEO, tracking, header/footer e WhatsApp; páginas em `src/pages/` espelham as URLs atuais; posts em content collection Markdown. Testes Vitest rodam sobre o `dist/` gerado e travam URLs, metadados, schema e regras de copy.

**Tech Stack:** Astro (última estável), Tailwind CSS v4 (`@tailwindcss/vite`), `@astrojs/sitemap`, Vitest + `node-html-parser`, Wrangler (Cloudflare Pages).

**Spec:** `docs/superpowers/specs/2026-10-29-agenteaxon-astro-design.md`

## Global Constraints

- `site: 'https://agenteaxon.com.br'`, `trailingSlash: 'always'`, `build.format: 'directory'`, output estático.
- Canonical absoluto no apex com barra final; nunca `www.` em canonical, sitemap, robots, OG ou JSON-LD.
- WhatsApp: `https://wa.me/5511963765638?text=<mensagem por origem>`; nenhum `<form>` em página alguma.
- Tracking em todas as páginas: GA4 `G-PMMHJSMB95`, Google Ads tag `AW-18148907605` (sem rótulo de conversão), Meta Pixel `1031313369581014` (PageView). Clique em WhatsApp: GA4 `whatsapp_click` {origem}, Pixel `Lead` {content_name: origem}. `/obrigado/`: só PageView.
- Preço: só "a partir de R$ 497/mês"; o texto "997" e "1.497" não aparecem em nenhuma página publicada (exceto `docs/stripe-links.md`, fora do build).
- Rodapé: "Desenvolvido por <a href="https://jhonlinesolutions.com.br">JH Online Solutions</a>, tecnologia que move o seu negócio adiante" + "JH Online Solutions LTDA · CNPJ 48.194.871/0001-10 · Belo Horizonte – MG".
- Paleta: roxo `#5b2bd6`, ciano `#00b8d9`, verde `#18c29c`, tinta `#14112a`, fundo `#fbfaff`. Fontes: Instrument Serif (display), Inter Tight (texto).
- Movimento: CSS + IntersectionObserver, sem lib de animação; nada depende de hover; `prefers-reduced-motion: reduce` desliga loops; conteúdo visível sem JS.
- Sem números/estatísticas sem fonte; sem jargão (LLM, RAG, system prompt) na home.
- Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Boas práticas e SEO na home, num post e em `/quanto-custa-agente-ia-whatsapp/`.
- Não tocar em `jomarhanum/agenteaxon-backup` nem no repo `jh-online-solutions`.

## Review Focus

1. Visitante em celular de 360px: nenhuma rolagem horizontal (marquee, orbes e mockup do celular contidos).
2. URL antiga sem barra (`/sobre`) ou com `index.html` (`/sobre/index.html`) continua chegando na página (Cloudflare Pages faz isso por padrão com `directory` — conferir no preview).
3. JS desabilitado/bloqueado: cartões com "reveal" aparecem (a classe de esconder só é aplicada quando o JS roda).
4. Mensagem do WhatsApp com acento e "?" chega legível (encodeURIComponent).
5. `prefers-reduced-motion`: conversa do Hero aparece estática completa, sem loop.

Testes que fixam itens 1, 3, 4 e 5 estão nas Tasks 2 e 3; item 2 é conferido na Task 8.

---

### Task 1: Scaffold Astro + harness de testes sobre o `dist/`

**Files:**
- Move: todo HTML/asset atual → `legacy/` (`git mv`), exceto `.github/`, `docs/`, `CNAME`
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/styles/global.css`, `public/` (favicons, `apple-touch-icon.png`, `axon-logo.webp`, `og-*.png` copiados de `legacy/`)
- Create: `tests/routes.ts`, `tests/helpers.ts`, `tests/site.test.ts`, `vitest.config.ts`

**Interfaces:**
- Produces: `LEGACY_ROUTES: string[]` (as 23 URLs do sitemap atual + `/obrigado/`, `/assinatura/`) e `INDEXABLE_ROUTES` (sem `/obrigado/`, `/assinatura/`) em `tests/routes.ts`; `loadPage(route: string): HTMLElement` em `tests/helpers.ts` (lê `dist/<route>/index.html`); scripts `npm run build`, `npm test` (= `astro build && vitest run`).

- [ ] **Step 1:** `git mv` do site antigo para `legacy/`; `npm create astro@latest` (template minimal, TS strict) na raiz; adicionar Tailwind v4, `@astrojs/sitemap`, `vitest`, `node-html-parser`. Config conforme Global Constraints.
- [ ] **Step 2: Write the failing test** `tests/site.test.ts`:
  - `it.each(LEGACY_ROUTES)('%s existe', r => expect(existsSync(distPath(r))).toBe(true))`
  - `it.each(INDEXABLE_ROUTES)` → `<link rel=canonical>` === `https://agenteaxon.com.br${r}`; `<title>` não vazio e único entre páginas; `meta[name=description]` com 50–170 chars.
  - `/obrigado/` e `/assinatura/` têm `meta[name=robots]` contendo `noindex`.
  - Nenhum HTML em `dist/` contém `<form`, `997`, `1.497`, `www.agenteaxon`, `elegantcormorant`.
  - `dist/sitemap-index.xml` existe; o conjunto de `<loc>` do sitemap === `INDEXABLE_ROUTES` (absolutas).
- [ ] **Step 3:** `npm test` → FAIL (rotas inexistentes).
- [ ] **Step 4:** Commit `chore: scaffold Astro e testes de rotas/SEO` (testes vermelhos são esperados até a Task 6).

### Task 2: Layout base, SEO, tracking e WhatsApp

**Files:**
- Create: `src/config/site.ts`, `src/lib/whatsapp.ts`, `src/layouts/Base.astro`, `src/components/Seo.astro`, `src/components/Tracking.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/WhatsAppFloat.astro`, `src/components/CtaWhatsApp.astro`, `src/scripts/motion.ts`
- Test: `tests/whatsapp.test.ts`, acréscimos em `tests/site.test.ts`

**Interfaces:**
- Produces:
  - `SITE = { url, name: 'Axon', whatsapp: '5511963765638', ga4, adsId, pixelId, cnpj: '48.194.871/0001-10', email: 'contato@jhonlinesolutions.com.br', priceFrom: 497 }`
  - `waLink(origem: string, mensagem?: string): string` — mensagem padrão `Olá! Vim pelo site do Axon (${origem}) e quero um diagnóstico grátis.`
  - `<Base title description path ogImage? noindex? jsonLd?: object[] breadcrumbs?: {name,path}[]>` — inclui Seo, Tracking, Header, Footer, WhatsAppFloat, `<ClientRouter />`.
  - `<CtaWhatsApp origem label variant?: 'primary'|'ghost'>` — `<a data-wa-origem>`; um listener global em Tracking dispara `gtag('event','whatsapp_click',{origem})` e `fbq('track','Lead',{content_name:origem})`.
  - `motion.ts`: elementos `[data-reveal]` recebem `is-hidden` só via JS e `is-in` ao entrar na tela; `[data-count]` conta até o valor; respeita `prefers-reduced-motion`; reexecuta em `astro:page-load`.
- [ ] **Step 1: Failing tests:** `waLink('home-hero')` começa com `https://wa.me/5511963765638?text=` e `decodeURIComponent` da query contém `home-hero` e `diagnóstico`; em `site.test.ts`: toda página tem `G-PMMHJSMB95`, `AW-18148907605`, `1031313369581014`; todo footer contém `href="https://jhonlinesolutions.com.br"`, `tecnologia que move o seu negócio adiante` e `48.194.871/0001-10`; JSON-LD Organization presente e parseável em toda página; nenhum elemento tem a classe `is-hidden` no HTML estático (Review Focus 3); CSS final contém `prefers-reduced-motion` (Review Focus 5); `body`/`html` com `overflow-x: clip` ou equivalente (Review Focus 1).
- [ ] **Step 2:** `npx vitest run tests/whatsapp.test.ts` → FAIL.
- [ ] **Step 3:** Implementar arquivos acima. Header: logo + Início, Sobre, Blog, Contato + CTA; menu mobile acessível. Footer conforme Global Constraints + links do spec. Tokens de cor/fonte em `global.css` (`@theme`). Fontes com `display=swap` e preconnect (ou self-host via `@fontsource`).
- [ ] **Step 4:** testes da Task 2 → PASS. Commit `feat: layout base, SEO, tracking e WhatsApp`.

### Task 3: Home

**Files:**
- Create: `src/pages/index.astro`, `src/components/home/{Hero,ChatLoop,NicheMarquee,Pains,Solution,HowItWorks,Segments,Comparison,Pricing,Video,Faq,FinalCta,Cases}.astro`, `src/content/cases/` (vazio, com `.gitkeep`), `src/content.config.ts` (coleção `cases`: `{nome, segmento, depoimento, resultado?, logo?}`)
- Test: acréscimos em `tests/site.test.ts`

**Interfaces:**
- Consumes: `Base`, `CtaWhatsApp`, `waLink`, `SITE`, `motion.ts`.
- Produces: coleção `cases` (usada só aqui); `Faq` recebe `items: {q,a}[]` e emite FAQPage JSON-LD (reutilizado nas Tasks 4).
- [ ] **Step 1: Failing tests (home):** `h1` texto === `Nenhum cliente sem resposta no seu WhatsApp.`; contém `a partir de R$ 497`; contém `15 dias`; JSON-LD tem `FAQPage` e `Service` com `offers.priceSpecification.minPrice === 497` e `priceCurrency 'BRL'`; nenhuma seção de cases renderizada (`[data-section=cases]` ausente) com 0 itens; o primeiro balão do ChatLoop existe no HTML (conteúdo legível sem animação).
- [ ] **Step 2:** `npm test` → FAIL nesses casos.
- [ ] **Step 3:** Implementar seções 1–12 do spec, com o protótipo aprovado como referência visual (`../.superpowers/brainstorm/1637-1793313023/content/efeitos-a.html`). Vídeo: facade com thumbnail `https://i.ytimg.com/vi/eitwil64aTw/hqdefault.jpg`, iframe `youtube-nocookie` só no clique. Cases renderiza apenas se `cases.length >= 3`. FAQ: reaproveitar as 8 perguntas do site atual revisadas (sem números) + "Quanto custa?" → "a partir de R$ 497/mês…".
- [ ] **Step 4:** testes → PASS; conferir visualmente em 360px e 1440px (`npm run dev` + navegador). Commit `feat: home nova`.

### Task 4: Páginas institucionais e de decisão

**Files:**
- Create: `src/pages/{sobre,contato,axon-vs-atendente,quanto-custa-agente-ia-whatsapp,vale-a-pena-automatizar-atendimento-whatsapp,privacidade,termos,obrigado,assinatura}/index.astro`, `src/pages/404.astro`, `src/components/ArticleShell.astro` (título, resposta direta em destaque, corpo, CTA, breadcrumbs), `docs/stripe-links.md`
- Test: acréscimos em `tests/site.test.ts`

**Interfaces:**
- Consumes: `Base`, `Faq`, `CtaWhatsApp`.
- Produces: `ArticleShell` props `{title, lead, updated: string, breadcrumbs}` — reutilizado pelos scripts (Task 5).
- [ ] **Step 1: Failing tests:** cada página existe com BreadcrumbList; `/quanto-custa-agente-ia-whatsapp/` contém `a partir de R$ 497` e um bloco `[data-answer]` antes do primeiro `h2`; `/assinatura/` contém link WhatsApp e nenhum `buy.stripe.com`; `/contato/` contém `contato@jhonlinesolutions.com.br`; `privacidade` e `termos` não mencionam `newsletter` nem `formulário`; `dist/404.html` existe.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Reescrever o conteúdo a partir de `legacy/` seguindo o spec (preço por fatores; sem números sem fonte; títulos atuais mantidos quando bons). Copiar os 4 links Stripe de `legacy/assinatura/index.html` para `docs/stripe-links.md`.
- [ ] **Step 4:** PASS. Commit `feat: páginas institucionais`.

### Task 5: Páginas de scripts de WhatsApp

**Files:**
- Create: `src/pages/{scripts-whatsapp,scripts-whatsapp-saude,scripts-whatsapp-veicular}/index.astro`, `src/data/scripts/{saude-clinicas,saude,veicular}.ts` (`{categoria, itens: {titulo, texto}[]}[]`), `src/components/ScriptCard.astro` (botão "copiar" com fallback sem JS)
- [ ] **Step 1: Failing tests:** cada página tem ≥ 30 `[data-script]`; nenhuma pede e-mail; cada uma tem `meta description` (já coberto) e CTA WhatsApp com origem própria.
- [ ] **Step 2–3:** extrair os 30 scripts de cada página de `legacy/` para os `.ts`; implementar.
- [ ] **Step 4:** PASS. Commit `feat: páginas de scripts`.

### Task 6: Blog

**Files:**
- Create: coleção `blog` em `src/content.config.ts` (`{title, description, pubDate: Date, updatedDate?: Date, ogImage?, tags?: string[]}`), `src/content/blog/<slug>.md` × 9 (slugs idênticos às pastas atuais), `src/pages/blog/index.astro`, `src/pages/blog/[slug]/index.astro`, `src/layouts/Post.astro`
- [ ] **Step 1: Failing tests:** as 9 URLs de post existem (já em `LEGACY_ROUTES`); cada post tem JSON-LD `BlogPosting` com `datePublished` igual ao atual (2025-05-28/29; whatsapp-business-ai: 2026-06-15) e `author`/`publisher`; `/blog/` lista 9 links para posts; nenhum post contém `<form` (newsletter removida).
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Converter cada post de `legacy/blog/*/index.html` para Markdown (conteúdo, não layout); revisar números sem fonte (remover ou citar fonte com link); `updatedDate` = 2026-10-29 só nos posts cujo texto mudou. Post layout: tipografia legível, índice, CTA por post (`origem: blog/<slug>`), posts relacionados.
- [ ] **Step 4:** `npm test` → **tudo verde**. Commit `feat: blog migrado`.

### Task 7: SEO/GEO final, limpeza e qualidade

**Files:**
- Create: `public/_redirects` (`/sitemap.xml /sitemap-index.xml 301`, pois o Search Console conhece o `sitemap.xml` antigo), `public/robots.txt`, `public/llms.txt`, OG images que faltam em `public/og/` (1200×630)
- Delete: `legacy/`, `CNAME`
- Modify: `astro.config.mjs` (sitemap `filter` excluindo `/obrigado/`, `/assinatura/`; `serialize` com `lastmod`)
- [ ] **Step 1: Failing tests:** `robots.txt` contém `Sitemap: https://agenteaxon.com.br/sitemap-index.xml`; `llms.txt` contém `R$ 497`, `wa.me/5511963765638` e links para home, quanto-custa, vale-a-pena, axon-vs-atendente; toda página indexável tem `og:image` absoluto que existe em `dist/`.
- [ ] **Step 2–3:** implementar; apagar `legacy/` e `CNAME`.
- [ ] **Step 4:** `npm test` verde; `npx astro check` sem erros; Lighthouse mobile (`npx lighthouse` em `npm run preview`) ≥ 90 nas 3 páginas dos Global Constraints — anotar notas no commit. Commit `chore: SEO/GEO final e remoção do site legado`.

### Task 8: Preview na Cloudflare Pages

- [ ] **Step 1:** `npx wrangler pages project create agenteaxon --production-branch main` (rede: rodar com `NODE_OPTIONS=--dns-result-order=ipv4first`).
- [ ] **Step 2:** `npm run build && npx wrangler pages deploy dist --project-name agenteaxon --branch preview` → anotar URL `*.agenteaxon.pages.dev`.
- [ ] **Step 3:** No preview: as `LEGACY_ROUTES` respondem 200; `/sobre` e `/sobre/index.html` chegam em `/sobre/` (Review Focus 2); 404 funciona; abrir no celular/360px.
- [ ] **Step 4:** **Parar e mandar o link ao Jomar para aprovação** (inclui revisar texto da oferta de 15 dias).

### Task 9: Migração e troca de domínio (após aprovação)

- [ ] **Step 1:** Jomar confirma `gh auth status` com `jhonlinesolutions`. `gh api -X POST repos/jomarhanum/agenteaxon/transfer -f new_owner=jhonlinesolutions` (se for convite, Jomar aceita no e-mail); `git remote set-url origin https://github.com/jhonlinesolutions/agenteaxon.git`; `git push origin main`.
- [ ] **Step 2:** Desligar GitHub Pages: `gh api -X DELETE repos/jhonlinesolutions/agenteaxon/pages`.
- [ ] **Step 3:** Confirmar em qual conta Cloudflare está a zona `agenteaxon.com.br`; adicionar `agenteaxon.com.br` e `www.agenteaxon.com.br` como custom domains do projeto `agenteaxon` (dashboard/API); manter regra www → apex (301). Não apagar o TXT `google-site-verification`.
- [ ] **Step 4:** `npx wrangler pages deploy dist --project-name agenteaxon --branch main`.
- [ ] **Step 5:** Verificar no domínio real: as 23 URLs indexáveis → 200; `https://www.agenteaxon.com.br/` → 301 para apex; header sem `x-github-request-id`; tags GA4/Pixel disparando (Network). Avisar o Jomar para reenviar `sitemap-index.xml` no Search Console e remover o antigo `sitemap.xml`.
- [ ] **Step 6:** Commit/push final. Relatar resultado.
