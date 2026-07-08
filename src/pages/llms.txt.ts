import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../data/posts';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();

  const entries = posts.map((post) => {
    // External-link posts have no local Markdown mirror; point at the source.
    const url = post.data.externalLink ?? new URL(`/${post.id}.md`, site).href;
    return `- [${post.data.title}](${url}): ${post.data.description}`;
  });

  const body = `# Diego Castillo

> Blog by Diego Castillo, a senior software engineer at Buffer writing about software craftsmanship, building with AI, CS fundamentals, and building products. Written in TypeScript, Elixir, and Ruby.

This file indexes the blog's posts as Markdown for LLMs and agents. Each post is also available as Markdown by appending \`.md\` to its URL. Full site content is at [llms-full.txt](${new URL('/llms-full.txt', site).href}).

## About

- [About Diego Castillo](${new URL('/about/', site).href}): Bio, experience, and contact links.
- [Products](${new URL('/products/', site).href}): Products Diego has built.

## Posts

${entries.join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
