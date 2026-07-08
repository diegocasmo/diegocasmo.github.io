import rss from '@astrojs/rss';
import { getPublishedPosts } from '../data/posts';

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: 'Diego Castillo',
    description: 'Blog by Diego Castillo - software engineer at Buffer writing about systems programming, CS fundamentals, and building products.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
