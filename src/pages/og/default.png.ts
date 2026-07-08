import type { APIRoute } from 'astro';
import { OG_COLORS, renderOgPng } from '../../utils/og';

export const GET: APIRoute = async () => {
  return renderOgPng({
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: OG_COLORS.background,
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
              backgroundColor: OG_COLORS.accent,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: '72px',
              fontWeight: 600,
              color: OG_COLORS.title,
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
              color: OG_COLORS.accent,
              lineHeight: 1.4,
            },
            children:
              'Software engineer. Craftsmanship and simple, thoughtful products.',
          },
        },
      ],
    },
  });
};
