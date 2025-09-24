import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

export interface PreviewPage {
  pngBase64: string;
  width: number;
  height: number;
}

export interface PreviewResult {
  pages: PreviewPage[];
  pageCount: number;
}

async function renderPdf(html: string) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1280, height: 720 },
    executablePath: await chromium.executablePath(),
    headless: true
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

function watermarkSvg(width: number, height: number) {
  const fontSize = Math.round(width * 0.08);
  return Buffer.from(`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(59,130,246,0.08)" />
      <stop offset="100%" stop-color="rgba(79,70,229,0.18)" />
    </linearGradient>
  </defs>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="url(#fade)" font-family="'Inter', Arial, sans-serif" font-size="${fontSize}" transform="rotate(-30 ${width / 2} ${height / 2})" font-weight="700" letter-spacing="8">
    Preview — Terms.law
  </text>
</svg>`);
}

async function applyWatermark(buffer: Buffer, width: number, height: number) {
  const overlay = watermarkSvg(width, height);
  return sharp(buffer)
    .composite([{ input: overlay, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function pdfToPngPages(pdfBuffer: Buffer): Promise<PreviewPage[]> {
  const base = sharp(pdfBuffer);
  const meta = await base.metadata();
  const pages = meta.pages ?? 1;
  const results: PreviewPage[] = [];
  for (let i = 0; i < pages; i += 1) {
    const { data, info } = await sharp(pdfBuffer, { density: 150, page: i })
      .ensureAlpha()
      .png()
      .toBuffer({ resolveWithObject: true });
    const withWatermark = await applyWatermark(data, info.width, info.height);
    results.push({
      pngBase64: withWatermark.toString('base64'),
      width: info.width,
      height: info.height
    });
  }
  return results;
}

export async function generatePreview(html: string): Promise<PreviewResult> {
  const pdf = await renderPdf(html);
  const pages = await pdfToPngPages(pdf);
  return { pages, pageCount: pages.length };
}
