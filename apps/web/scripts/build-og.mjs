import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#0F2A5C"/>
      <stop offset="0.5" stop-color="#1E40AF"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="280" font-family="sans-serif" font-weight="800" font-size="86" fill="#fff">TriaClaw</text>
  <text x="80" y="370" font-family="sans-serif" font-weight="300" font-size="48" fill="#cffafe">Centralita · Agents · CRM</text>
  <text x="80" y="540" font-family="sans-serif" font-size="28" fill="#fff" opacity="0.7">triaclaw.com</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('apps/web/public/og-default.png', png);
console.log('OG written');
