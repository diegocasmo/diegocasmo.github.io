import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { cleanMdx } from '../utils/markdown';

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('posts'))
    .filter((post) => !post.data.draft && !post.data.externalLink)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const sections = posts.map((post) => {
    const isMdx = (post.filePath ?? '').endsWith('.mdx');
    const body = isMdx ? cleanMdx(post.body ?? '') : (post.body ?? '');
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
