# agenteaxon.com.br — recriação em Astro

Data: 2026-10-29 · Dono: Jomar (JH Online Solutions)

## Intenção

O agenteaxon.com.br vende o **Axon**, agente de IA que atende clientes no WhatsApp (produto da JH Online Solutions).
O site atual é HTML estático escuro, com "cara de feito por IA", e **não converteu**. O novo site precisa fazer o
visitante (dono de negócio que sofre com falhas, atrasos e gargalos no atendimento pelo WhatsApp) entender **em
poucos segundos, de forma clara, simples e direta**, que encontrou a solução para essa dor, e então chamar no
WhatsApp, onde o próprio Axon o atende (a conversa funciona como demonstração).

## Objetivos

1. Mover o repositório da conta pessoal do GitHub (`jomarhanum/agenteaxon`) para a conta da JH (`jhonlinesolutions`).
2. Recriar o site em **Astro**: visual claro, clean, moderno, com efeitos visuais (inclusive no celular).
3. Nova headline do Hero, focada na dor (ver Hero).
4. Rodapé com crédito da JH no padrão dos outros sites (ver Rodapé).
5. Manter **todas as URLs atuais** e preservar/melhorar SEO e GEO (o domínio já está no Google Search Console).
6. Preço: **sem tabela de planos**; comunicar apenas "planos a partir de R$ 497/mês", com proposta personalizada após diagnóstico.

## Não-objetivos

- Planilha de CRM / mudanças no workflow "Agente Axon" do n8n (projeto separado, tratado pelo Jomar).
- Seção de cases/depoimentos visível agora (só quando houver ≥ 3 cases reais).
- Checkout/assinatura online neste momento.
- Formulários de captura (lead ou newsletter).

## Anti-objetivos (seria fracasso mesmo "funcionando")

- Parecer template de IA: fundo escuro neon, emojis como ícones em grade, números inventados, jargão técnico ("LLM", "RAG", "system prompt") na home.
- Perder posições no Google: URL mudando sem redirect, canonical errado, páginas indexadas sumindo.
- Efeitos que pesem a página (Lighthouse mobile de performance < 90) ou que só funcionem com mouse.
- Afirmar estatística sem fonte.

## Restrições

- Hospedagem: **Cloudflare Pages** na conta jhonlinesolutions@gmail.com. Domínio canônico: `https://agenteaxon.com.br/` (sem www; www → 301 para o apex, já é assim hoje). Barra final em todas as URLs (`/sobre/`), como hoje.
- Repo `jh-online-solutions` é público e de outro site: nada deste projeto vai lá.
- Repo `jomarhanum/agenteaxon-backup`: **não mexer** (fica na conta pessoal até o Jomar decidir).
- Tracking a manter em todas as páginas: GA4 `G-PMMHJSMB95`, Google Ads `AW-18148907605`, Meta Pixel `1031313369581014`.
- WhatsApp: `https://wa.me/5511963765638`.
- Respeitar `prefers-reduced-motion` (movimento reduzido para quem pede).

## Migração GitHub + Cloudflare (decidido)

1. Jomar autentica o `gh` com a conta `jhonlinesolutions` (ou aceita a transferência por e-mail). Transferir `jomarhanum/agenteaxon` → `jhonlinesolutions/agenteaxon` (histórico preservado; GitHub redireciona a URL antiga).
2. O site antigo **não** precisa ser preservado como alternativa (o histórico git basta). O workflow `.github/workflows/backup.yml` pode continuar.
3. **Constatado em 2026-10-29:** a produção hoje é servida pelo **GitHub Pages** (header `x-github-request-id`) atrás do proxy da Cloudflare; **não existe projeto Cloudflare Pages do Axon** (a conta jhonlinesolutions@gmail.com só tem `comibot-landing`). Após a transferência do repo, o GitHub Pages pode parar de servir o domínio até ser reconfigurado: por isso a transferência acontece **junto com a troca**, não antes (ver passo 5).
4. Criar projeto Cloudflare Pages `agenteaxon` (wrangler já autenticado como jhonlinesolutions@gmail.com) com deploy via `wrangler pages deploy` do build Astro (ou Git integration com o repo da JH, se preferível depois). Preview em `agenteaxon.pages.dev`; Jomar aprova.
5. Troca: adicionar `agenteaxon.com.br` e `www.agenteaxon.com.br` como custom domains do projeto Pages (ajusta o DNS na Cloudflare, sem tempo fora do ar; conferir antes em qual conta Cloudflare está a zona DNS); confirmar que o novo site responde; então transferir o repo para `jhonlinesolutions`, desligar o GitHub Pages e remover o arquivo `CNAME`. Manter o redirect www → apex.
6. Depois da troca: conferir as 23 URLs atuais do sitemap (incluindo `/blog/` e os 9 posts) (200), redirects (301), e reenviar o sitemap no Search Console.

## Mapa de páginas (todas mantidas, mesma URL)

| URL | O que vira |
|---|---|
| `/` | Home nova (estrutura abaixo) |
| `/sobre/` | Sobre o Axon e a JH; quem está por trás, como trabalhamos (diagnóstico → proposta → implantação em até 48h) |
| `/contato/` | WhatsApp, e-mail contato@jhonlinesolutions.com.br, dados da empresa. Sem formulário |
| `/axon-vs-atendente/` | Comparativo reescrito sem números inventados; Axon "a partir de R$ 497/mês" |
| `/quanto-custa-agente-ia-whatsapp/` | Explica **o que influencia o preço** (volume, integrações, áudio, agenda, nº de números etc.) e "a partir de R$ 497/mês" |
| `/vale-a-pena-automatizar-atendimento-whatsapp/` | Mantida e revisada |
| `/scripts-whatsapp/`, `/scripts-whatsapp-saude/`, `/scripts-whatsapp-veicular/` | Iscas de conteúdo: mantidas e redesenhadas. Remover qualquer pedido de e-mail/form; conteúdo fica aberto na página |
| `/blog/` + 9 posts | Mantidos (conteúdo migrado para Markdown/content collection), revisados: números sem fonte removidos ou com fonte citada; datas `dateModified` atualizadas quando o texto mudar |
| `/privacidade/`, `/termos/` | Mantidas; revisar menção a formulários/newsletter (não existem mais) |
| `/obrigado/` | Mantida com `noindex`, fora do sitemap (pode ter vínculo com conversões de Ads antigas) |
| `/assinatura/` | **Fica de fora por enquanto, pode voltar.** Não aparece no menu nem no sitemap; página mantida com `noindex` mostrando "fale conosco para uma proposta" + WhatsApp. Links Stripe removidos da página (guardados neste repo em `docs/stripe-links.md` para volta futura) |
| `404` | Nova, no visual novo |

## Home — estrutura

1. **Hero (direção A "Editorial suave", aprovada)**
   - Selo: "● Atendimento 24h no WhatsApp" (bolinha verde pulsando).
   - Headline: **"Nenhum cliente sem resposta no seu WhatsApp."** ("sem resposta" com degradê roxo→ciano animado). Fonte display com serifa (Instrument Serif); texto em Inter Tight.
   - Subtítulo: "O Axon responde na hora, entende o que o cliente quer e leva a conversa até a venda ou o agendamento, de dia, de noite e no fim de semana."
   - CTA principal: "Quero um diagnóstico grátis" → WhatsApp. CTA secundário: "Ver como funciona" (âncora).
   - À direita (abaixo no mobile): mockup de celular flutuando com conversa em loop (balões entram um a um, "digitando…").
   - Fundo: quase branco `#fbfaff` com orbes desfocados roxo/ciano que derivam devagar.
2. Faixa de nichos deslizando (clínicas, imobiliárias, estética, delivery, advocacia, e-commerce, veículos).
3. **Onde o atendimento trava hoje** — dores concretas (mensagem às 21h; fila no pico; mesmas perguntas 50×/dia; lead que some calado; cliente que volta e precisa repetir tudo; "digite 0 para falar com atendente").
4. **Como o Axon resolve** — benefícios em linguagem de dono de negócio (responde na hora; entende mensagem confusa/áudio/imagem; espera o cliente terminar de digitar; lembra do cliente; fala com o nome e o tom da empresa; chama sua equipe quando precisa).
5. **Como funciona** — 3 passos: diagnóstico grátis → proposta sob medida → no ar em até 48h.
6. **Por segmento** — o que o Axon faz em cada nicho (sem % de resultado inventado).
7. **Comparativo** Atendente CLT × Chatbot comum × Axon ("a partir de R$ 497/mês"), montando-se na rolagem.
8. **Investimento** — "Planos a partir de R$ 497/mês. Cada negócio tem gargalos diferentes, por isso o valor sai de um diagnóstico e de uma proposta sob medida." + **oferta de teste de 15 dias continua valendo**. Texto baseado no atual (teste de 15 dias, implantação inclusa, ajustes durante o teste, sem fidelidade; sem citar R$ 997). Não bloqueia publicação: Jomar revisa no preview.
9. **Vídeo** do Axon em ação (YouTube atual `eitwil64aTw`, carregado com facade leve — só carrega o player ao clicar).
10. FAQ (com FAQPage schema).
11. CTA final → WhatsApp.
12. **Cases (oculta)**: componente pronto que só renderiza quando a coleção de cases tiver ≥ 3 itens.

## Visual e movimento (aprovado na prévia)

- Fundo claro, paleta derivada do logo: roxo `#5b2bd6`, ciano `#00b8d9`, verde "online" `#18c29c`, tinta `#14112a`. Logo atual (`axon-logo.webp`) mantido.
- Ícones em SVG (não emojis) nas seções de conteúdo.
- Efeitos: conversa em loop no Hero; celular flutuando; orbes derivando; degradê animado; reflexo no botão principal; faixa de nichos em marquee; cartões entrando em sequência na rolagem; números que contam; comparativo montando na rolagem; transições suaves entre páginas (View Transitions do Astro). Nada depende de hover; tudo funciona no celular. `prefers-reduced-motion` desliga os loops.
- Implementação leve: CSS + IntersectionObserver; sem bibliotecas pesadas de animação, salvo se justificar.

## CTAs e WhatsApp

- Todo CTA vai para `wa.me/5511963765638?text=...` com mensagem pré-preenchida por origem (ex.: home hero, preços, blog/<slug>, scripts-saude), para o Jomar saber de onde veio o lead.
- Evento no clique: GA4 `whatsapp_click` (parâmetro `origem`), Meta Pixel **`Lead`** com `content_name` = origem (mantém o evento que as campanhas já usam hoje) Google Ads: por ora só a tag `AW-18148907605` (sem rótulo de conversão); Jomar importa o evento GA4 no Ads quando quiser.
- GA4 + Pixel (PageView) em **todas** as páginas, inclusive as que hoje não têm. Em `/obrigado/` só PageView, sem evento de conversão.
- Botão flutuante de WhatsApp em todas as páginas.

## Rodapé

Links do site (Início, Sobre, Blog, Contato, Axon vs. Atendente, Quanto custa, Vale a pena?, Privacidade, Termos), dados da empresa e, como nos outros sites da JH:

> Desenvolvido por [JH Online Solutions](https://jhonlinesolutions.com.br), tecnologia que move o seu negócio adiante

CNPJ (decidido): **matriz `48.194.871/0001-10`**, Rua Satélite, 246, Caiçaras, Belo Horizonte-MG, CEP 30770-380 — também no JSON-LD Organization, em /contato/ e nas páginas legais.

## SEO / GEO

- Canonical absoluto no apex com barra final em todas as páginas (corrige a mistura atual de `www`/apex nos canonicals e no robots.txt).
- `title` + `meta description` únicos em todas as páginas (hoje faltam em sobre, contato, scripts-saude, assinatura, obrigado). Manter os títulos atuais quando já bons, para não perder posição.
- Open Graph + Twitter Card por página (OG images existentes reaproveitadas; gerar para as que faltam).
- JSON-LD: Organization (JH Online Solutions como dona/marca Axon), WebSite, Service com `offers` "a partir de R$ 497/mês" (PriceSpecification `minPrice`), FAQPage na home, BreadcrumbList nas internas, BlogPosting/Article nos posts com `datePublished`/`dateModified` e autor.
- `sitemap.xml` gerado (@astrojs/sitemap) sem `/obrigado/` e `/assinatura/`; `robots.txt` apontando para `https://agenteaxon.com.br/sitemap.xml`.
- GEO: `llms.txt` com resumo do Axon, páginas-chave e preço inicial; respostas diretas no topo das páginas de dúvida ("Quanto custa…", "Vale a pena…"), parágrafos auto-contidos, fatos com fonte.
- Verificação do Search Console é por **registro TXT no DNS** (`google-site-verification=uDh3…`): não depende do HTML; só não pode ser apagada do DNS.
- Performance: HTML estático, fontes self-hosted ou com `display=swap` + preload, imagens via `astro:assets`, Lighthouse mobile ≥ 90 em todas as categorias.

## Decidido pelo builder (Claude), revisável

- Stack: Astro (versão estável atual) + Tailwind CSS v4; conteúdo do blog em content collections Markdown; build estático; `trailingSlash: 'always'`.
- Newsletter e formulário de demo removidos (os webhooks em `elegantcormorant-n8n` não existem mais — os forms atuais já estavam quebrados).
- Remoção de números sem fonte, com substituição por estatística pública citada só quando agregar.
- Oferta de teste de 15 dias exibida na home e em "Quanto custa".

## Deixado para o builder

Copy final das seções (seguindo tom: claro, simples, direto, sem jargão), ícones, microinterações, layout das páginas internas e dos posts, imagens OG que faltam.
