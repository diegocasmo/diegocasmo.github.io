import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const WIDTH = 1200;
const HEIGHT = 630;

const fontRegular = fs.readFileSync(
  path.resolve('public/fonts/FiraCode-Regular.ttf')
);
const fontSemiBold = fs.readFileSync(
  path.resolve('public/fonts/FiraCode-SemiBold.ttf')
);

export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#1c1e22',
          padding: '60px',
          fontFamily: 'Fira Code',
          position: 'relative',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: '#d4a857',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '72px',
                fontWeight: 600,
                color: '#e2e2e2',
                marginBottom: '24px',
              },
              children: 'Diego Castillo',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '34px',
                color: '#d4a857',
                lineHeight: 1.4,
              },
              children:
                'Software engineer. Craftsmanship and simple, thoughtful products.',
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Fira Code', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Fira Code', data: fontSemiBold, weight: 600, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  const pngBuffer = resvg.render().asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { 'Content-Type': 'image/png' },
  });
};
