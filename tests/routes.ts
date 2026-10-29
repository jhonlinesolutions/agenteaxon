export const NOINDEX_ROUTES = ['/obrigado/', '/assinatura/'];

export const INDEXABLE_ROUTES = [
  '/',
  '/sobre/',
  '/contato/',
  '/axon-vs-atendente/',
  '/quanto-custa-agente-ia-whatsapp/',
  '/vale-a-pena-automatizar-atendimento-whatsapp/',
  '/scripts-whatsapp/',
  '/scripts-whatsapp-saude/',
  '/scripts-whatsapp-veicular/',
  '/privacidade/',
  '/termos/',
  '/blog/',
  '/blog/por-que-seu-chatbot-esta-perdendo-vendas/',
  '/blog/api-oficial-vs-solucoes-nao-oficiais-whatsapp-2025/',
  '/blog/como-funciona-memoria-agente-ia-sessao-historico-rag/',
  '/blog/5-mensagens-perdidas-sem-atendimento-24h/',
  '/blog/o-que-e-system-prompt-sucesso-agente/',
  '/blog/imobiliarias-qualificar-leads-automaticamente-whatsapp/',
  '/blog/como-calcular-roi-agente-ia-whatsapp/',
  '/blog/clinicas-medicas-ia-reduzir-faltas/',
  '/blog/whatsapp-business-ai-meta-vs-axon/',
];

export const LEGACY_ROUTES = [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES];

export const BLOG_POSTS = INDEXABLE_ROUTES.filter((r) => r.startsWith('/blog/') && r !== '/blog/');
