import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../data/posts';
import { renderPostBody } from '../utils/markdown';

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getPublishedPosts()).filter(
    (post) => !post.data.externalLink
  );

  const sections = posts.map((post) => {
    const body = renderPostBody(post);
    const url = new URL(`/${post.id}/`, site).href;
    return `# ${post.data.title}

Source: ${url}
Published: ${post.data.pubDate.toISOString().slice(0, 10)}${post.data.updatedDate ? `\nUpdated: ${post.data.updatedDate.toISOString().slice(0, 10)}` : ''}

${body}`;
  });

  const body = `# Diego Castillo — Full Blog Content

> Every post on diegocasmo.github.io concatenated as Markdown, for LLMs and agents.

${sections.join('\n\n---\n\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
