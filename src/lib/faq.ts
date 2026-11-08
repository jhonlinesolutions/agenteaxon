export interface Pergunta { q: string; a: string }

// Markdown simples → texto puro (para o schema).
const textoPuro = (md: string) =>
  md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]+/g, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

// Lê a seção "## Perguntas frequentes" do post: cada ### é uma pergunta, o texto abaixo é a resposta.
export function faqDoMarkdown(md: string): Pergunta[] {
  const linhas = md.split(/\r?\n/);
  const ini = linhas.findIndex((l) => /^##\s+perguntas frequentes\s*$/i.test(l.trim()));
  if (ini < 0) return [];
  const out: Pergunta[] = [];
  let atual: { q: string; corpo: string[] } | null = null;
  const fecha = () => {
    if (atual) {
      const a = textoPuro(atual.corpo.join('\n'));
      if (a) out.push({ q: textoPuro(atual.q), a });
    }
  };
  for (const l of linhas.slice(ini + 1)) {
    if (/^##\s/.test(l)) break;
    const m = l.match(/^###\s+(.+)/);
    if (m) {
      fecha();
      atual = { q: m[1], corpo: [] };
    } else if (atual) atual.corpo.push(l);
  }
  fecha();
  return out;
}
