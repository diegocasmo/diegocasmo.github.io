import type { APIRoute } from 'astro';
import resume from '../data/resume.md?raw';

// Serves the resume as raw Markdown for humans and agents. The canonical
// source is copied into src/data/ so the build (which only sees this repo)
// can read it; see the About-section link in llms.txt.ts.
export const GET: APIRoute = () =>
  new Response(resume, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
