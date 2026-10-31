import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const wordmarkPath = path.join(scriptDir, "fonts", "wordmark.png");

const articlePath = process.argv[2];

if (!articlePath) {
  console.error("Usage: node scripts/render-question-card.mjs content/articles/<slug>.md");
  process.exit(1);
}

const slug = path.basename(articlePath, ".md");
const markdown = fs.readFileSync(articlePath, "utf8");
const { items, ordered } = firstList(markdown);

if (items.length < 3 || items.length > 6) {
  console.error(`Expected 3 to 6 questions in ${articlePath}, found ${items.length}.`);
  process.exit(1);
}

const svg = cardSvg(items, ordered);
const outDir = path.join("public", "blog", slug);
const outFile = path.join(outDir, "check-in-questions.webp");

fs.mkdirSync(outDir, { recursive: true });
await sharp(Buffer.from(svg.svg))
  .composite([{ input: wordmarkPath, left: svg.wordLeft, top: svg.wordTop }])
  .webp({ quality: 90 })
  .toFile(outFile);
console.log(`Wrote ${outFile}`);

function firstList(source) {
  let ordered = true;
  const items = [];
  let started = false;

  for (const line of source.split("\n")) {
    const match = line.match(/^(\d+\.|[-*+])\s+(?:#{1,6}\s+)?(.+)$/);

    if (match) {
      const itemOrdered = /^\d/.test(match[1]);
      if (started && itemOrdered !== ordered) break;
      ordered = itemOrdered;
      started = true;
      items.push(match[2].trim());
      continue;
    }

    // Item detail is indented. The list ends at the first unindented line of other text.
    if (started && line.trim() !== "" && !/^\s/.test(line)) {
      break;
    }
  }

  return { items, ordered };
}

function cardSvg(items, ordered) {
  const width = 1200;
  const row = 84;
  const lineHeight = 42;
  const top = 96;
  const margin = 96;
  const logoHeight = 88;
  const footerGap = 16;
  const footerPadBottom = 72;
  const wordGap = 20;
  const wrapped = items.map((item) => wrap(item, 60));
  const listHeight = wrapped.reduce((sum, itemLines) => sum + row + (itemLines.length - 1) * lineHeight, 0);
  const footerTop = top + listHeight + footerGap;
  const height = footerTop + logoHeight + footerPadBottom;
  const logo = logoMark(width - margin, footerTop, logoHeight);
  const lineY = footerTop + logoHeight / 2;
  const lineEnd = logo.x - 28;
  // Wordmark PNG is DM Sans ExtraBold, 28px, tracking -0.025em. Its right edge
  // sits 20px left of the hand, and its baseline is 37px under the gold line.
  const wordLeft = Math.round(logo.x - wordGap - 241);
  const wordTop = Math.round(lineY + 37 - 20);
  let offset = top;
  const lines = wrapped
    .map((itemLines, index) => {
      const y = offset + 36;
      offset += row + (itemLines.length - 1) * lineHeight;
      const spans = itemLines
        .map((line, lineIndex) => `<tspan x="168" dy="${lineIndex === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
        .join("");
      return `<text x="96" y="${y}" fill="#4F46E5" font-family="DM Sans" font-size="32" font-weight="700">${ordered ? index + 1 : "•"}</text>
  <text x="168" y="${y}" fill="#1E293B" font-family="DM Sans" font-size="32" font-weight="500">${spans}</text>`;
    })
    .join("\n  ");

  return {
    wordLeft,
    wordTop,
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#FFFFFF"/>
  ${lines}
  <line x1="${margin}" y1="${lineY}" x2="${lineEnd}" y2="${lineY}" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
  ${logo.markup}
</svg>`,
  };
}

function logoMark(right, y, height) {
  const svg = fs.readFileSync(path.join(process.cwd(), "public/high-five-moments-logo.svg"), "utf8");
  const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const viewWidth = Number(viewBox[1]);
  const viewHeight = Number(viewBox[2]);
  const paths = [...svg.matchAll(/<path[^>]*d="([^"]+)"/g)].map((match) => match[1]);
  const scale = height / viewHeight;
  const width = viewWidth * scale;
  const x = right - width;

  return {
    x,
    markup: `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="${paths[0]}" fill="#4F46E5"/>
    <path d="${paths[1]}" fill="#F59E0B"/>
  </g>`,
  };
}

function wrap(text, maxChars) {
  const lines = [];
  let line = "";

  for (const word of text.split(/\s+/)) {
    if (line && line.length + 1 + word.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }

  lines.push(line);
  return lines;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
