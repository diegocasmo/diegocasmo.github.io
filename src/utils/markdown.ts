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
    .replace(/<[A-Z][^>]*\/>/g, '') // drop self-closing JSX tags
    .replace(/<\/?[A-Z][^>]*>/g, '') // drop paired JSX tags, keep inner text
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
