// Gera public/og/axon.png (1200x630), a imagem padrão de compartilhamento.
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="a" cx="85%" cy="10%" r="60%"><stop offset="0" stop-color="#c9b6ff"/><stop offset="1" stop-color="#fbfaff" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="70%" cy="80%" r="45%"><stop offset="0" stop-color="#8eeaf8" stop-opacity=".8"/><stop offset="1" stop-color="#fbfaff" stop-opacity="0"/></radialGradient>
    <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#5b2bd6"/><stop offset="1" stop-color="#00b8d9"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#fbfaff"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <text x="80" y="140" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#14112a">Axon</text>
  <text x="80" y="300" font-family="Georgia, serif" font-size="78" fill="#14112a">Nenhum cliente</text>
  <text x="80" y="390" font-family="Georgia, serif" font-size="78" fill="url(#t)">sem resposta</text>
  <text x="80" y="480" font-family="Georgia, serif" font-size="78" fill="#14112a">no seu WhatsApp.</text>
  <text x="80" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#4a4763">Agente de IA para WhatsApp · 24h · a partir de R$ 497/mês</text>
</svg>`;

const logo = await sharp('src/assets/axon-logo.webp').resize(64, 64).toBuffer();
await sharp(Buffer.from(svg)).composite([{ input: logo, left: 1056, top: 92 }]).png().toFile('public/og/axon.png');
console.log('ok');
