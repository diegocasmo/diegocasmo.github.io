import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = (await getCollection('posts')).filter(
    (post) => !post.data.draft
  );

  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      pubDate: post.data.pubDate,
    },
  }));
};

const WIDTH = 1200;
const HEIGHT = 630;

const fontRegular = fs.readFileSync(
  path.resolve('public/fonts/FiraCode-Regular.ttf')
);
const fontSemiBold = fs.readFileSync(
  path.resolve('public/fonts/FiraCode-SemiBold.ttf')
);

export const GET: APIRoute = async ({ props }) => {
  const { title, description, tags } = props as {
    title: string;
    description: string;
    tags: string[];
    pubDate: Date;
  };

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1c1e22',
          padding: '60px',
          fontFamily: 'Fira Code',
          position: 'relative',
        },
        children: [
          // Top accent border
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
          // Title + Description (vertically centered)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              },
              children: [
                // Title
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 60 ? '44px' : '60px',
                      fontWeight: 600,
                      color: '#e2e2e2',
                      lineHeight: 1.3,
                      marginBottom: '20px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    },
                    children: title,
                  },
                },
                // Description
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '30px',
                      color: '#b0b0b0',
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    },
                    children: description,
                  },
                },
                // Tags
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginTop: '20px',
                    },
                    children: tags.slice(0, 3).map((tag) => ({
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '22px',
                          color: '#d4a857',
                          border: '2px solid #d4a857',
                          borderRadius: '4px',
                          padding: '6px 14px',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'Fira Code',
          data: fontRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Fira Code',
          data: fontSemiBold,
          weight: 600,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  });
  const pngBuffer = resvg.render().asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { 'Content-Type': 'image/png' },
  });
};
