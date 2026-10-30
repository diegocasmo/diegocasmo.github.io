import type { APIRoute } from 'astro';
import resume from '../data/resume.md?raw';

// Serves src/data/resume.md (the single source of the resume) as raw Markdown
// for humans and agents; see the About-section link in llms.txt.ts.
export const GET: APIRoute = () =>
  new Response(resume, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
