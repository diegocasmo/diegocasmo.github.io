import type { APIRoute, GetStaticPaths } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getPublishedPosts } from '../data/posts';
import { renderPostBody } from '../utils/markdown';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = (await getPublishedPosts()).filter(
    (post) => !post.data.externalLink
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
    ...(tags.length > 0 ? [`tags: ${tags.join(', ')}`] : []),
    '---',
    '',
    '',
  ].join('\n');

  const body = renderPostBody(post);

  return new Response(frontmatter + body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
