import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublishedPosts } from '../../data/posts';
import { OG_COLORS, renderOgPng } from '../../utils/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, tags } = props as {
    title: string;
    description: string;
    tags: string[];
  };

  return renderOgPng({
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: OG_COLORS.background,
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
              backgroundColor: OG_COLORS.accent,
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
                    color: OG_COLORS.title,
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
                    color: OG_COLORS.body,
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
                        color: OG_COLORS.accent,
                        border: `2px solid ${OG_COLORS.accent}`,
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
  });
};
