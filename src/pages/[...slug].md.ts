import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { cleanMdx } from '../utils/markdown';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = (await getCollection('posts')).filter(
    (post) => !post.data.draft && !post.data.externalLink
  );

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: CollectionEntry<'posts'> };
  const { title, description, pubDate, updatedDate, tags } = post.data;

  const frontmatter = [
    '---',
    `title: ${title}`,
    `description: ${description}`,
    `pubDate: ${pubDate.toISOString()}`,
    ...(updatedDate ? [`updatedDate: ${updatedDate.toISOString()}`] : []),
    ...(tags && tags.length > 0 ? [`tags: ${tags.join(', ')}`] : []),
    '---',
    '',
    '',
  ].join('\n');

  const isMdx = (post.filePath ?? '').endsWith('.mdx');
  const body = isMdx ? cleanMdx(post.body ?? '') : (post.body ?? '');

  return new Response(frontmatter + body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
