import satori, { type SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Terminal-theme tokens (satori can't read the site's CSS custom properties). */
export const OG_COLORS = {
  background: '#1c1e22',
  accent: '#d4a857',
  title: '#e2e2e2',
  body: '#b0b0b0',
};

const fonts: SatoriOptions['fonts'] = [
  {
    name: 'Fira Code',
    data: fs.readFileSync(path.resolve('public/fonts/FiraCode-Regular.ttf')),
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Fira Code',
    data: fs.readFileSync(path.resolve('public/fonts/FiraCode-SemiBold.ttf')),
    weight: 600,
    style: 'normal',
  },
];

/** Render a satori node tree to a 1200x630 PNG HTTP response. */
export async function renderOgPng(node: Parameters<typeof satori>[0]): Promise<Response> {
  const svg = await satori(node, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } })
    .render()
    .asPng();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
}
