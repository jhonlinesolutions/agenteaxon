export const SITE = {
  url: 'https://agenteaxon.com.br',
  name: 'Axon',
  tagline: 'Agente de IA para WhatsApp',
  whatsapp: '5511963765638',
  whatsappDisplay: '(11) 96376-5638',
  email: 'contato@jhonlinesolutions.com.br',
  ga4: 'G-PMMHJSMB95',
  adsId: 'AW-18148907605',
  pixelId: '1031313369581014',
  priceFrom: 497,
  company: {
    legalName: 'JH Online Solutions LTDA',
    cnpj: '48.194.871/0001-10',
    url: 'https://jhonlinesolutions.com.br',
    street: 'Rua Satélite, 246, Caiçaras',
    city: 'Belo Horizonte',
    region: 'MG',
    postalCode: '30770-380',
  },
} as const;

export const NAV = [
  { href: '/', label: 'Início' },
  { href: '/sobre/', label: 'Sobre' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contato/', label: 'Contato' },
];

export const FOOTER_LINKS = [
  ...NAV,
  { href: '/axon-vs-atendente/', label: 'Axon vs. Atendente' },
  { href: '/quanto-custa-agente-ia-whatsapp/', label: 'Quanto custa' },
  { href: '/vale-a-pena-automatizar-atendimento-whatsapp/', label: 'Vale a pena?' },
  { href: '/scripts-whatsapp/', label: 'Scripts grátis' },
  { href: '/privacidade/', label: 'Privacidade' },
  { href: '/termos/', label: 'Termos' },
];
