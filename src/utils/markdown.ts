import type { CollectionEntry } from 'astro:content';

/**
 * Strip MDX-only syntax (import/export statements and JSX component tags) from a
 * raw post body so the remaining prose is clean Markdown for LLMs/agents.
 *
 * Plain HTML is left intact because it is valid Markdown. Only capitalized JSX
 * component tags (e.g. <AlgoViz>, <MergeSort />) are removed; their text
 * children are preserved.
 */
export function cleanMdx(raw: string): string {
  return raw
    .replace(/^\s*(import|export)\s.+$/gm, '') // drop import/export lines
    .replace(/<\/?[A-Z][^>]*>/g, '') // drop JSX tags (paired and self-closing), keep inner text
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** A post's body as clean Markdown: MDX posts are stripped of JSX, plain .md pass through. */
export function renderPostBody(post: CollectionEntry<'posts'>): string {
  const body = post.body ?? '';
  return post.filePath?.endsWith('.mdx') ? cleanMdx(body) : body;
}
