import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';

const root = fileURLToPath(new URL('../', import.meta.url));

function output(path) {
  return readFileSync(join(root, 'dist', path), 'utf8');
}

function page(route) {
  return parse(output(join(decodeURIComponent(route), 'index.html')));
}

function attribute(node, name) {
  return node.attrs?.find((attr) => attr.name === name)?.value;
}

function elements(node, tag, attributes = {}) {
  const matches =
    node.tagName === tag &&
    Object.entries(attributes).every(([name, value]) =>
      name === 'class'
        ? attribute(node, name)?.split(/\s+/).includes(value)
        : attribute(node, name) === value
    );
  return [
    ...(matches ? [node] : []),
    ...(node.childNodes ?? []).flatMap((child) =>
      elements(child, tag, attributes)
    ),
  ];
}

function element(node, tag, attributes = {}) {
  const match = elements(node, tag, attributes)[0];
  assert.ok(match, `Missing <${tag}> matching ${JSON.stringify(attributes)}`);
  return match;
}

function text(node) {
  return node.nodeName === '#text'
    ? node.value
    : (node.childNodes ?? []).map(text).join('');
}

function jsonLd(document, type) {
  const entries = elements(document, 'script', {
    type: 'application/ld+json',
  }).map((script) => JSON.parse(text(script)));
  const entry = entries.find((entry) => entry['@type'] === type);
  assert.ok(entry, `Missing ${type} JSON-LD`);
  assert.equal(entry['@context'], 'https://schema.org');
  return entry;
}

test('homepage contains posts and read-more links', () => {
  const document = page('/');
  const post = element(document, 'article', { class: 'on-list' });
  const readMore = element(post, 'a', { class: 'read-more' });
  assert.ok(attribute(readMore, 'href'));
});

test('blog post contains content and valid BlogPosting JSON-LD', () => {
  const document = page('/fft/');
  const article = element(document, 'article');
  const title = text(element(article, 'h1', { class: 'post-title' })).trim();
  assert.ok(title);
  assert.ok(text(element(article, 'div', { class: 'post-content' })).trim());
  const entry = jsonLd(document, 'BlogPosting');
  assert.equal(entry.headline, title);
  assert.equal(
    entry.mainEntityOfPage['@id'],
    'https://diegocasmo.github.io/fft/'
  );
});

test('blog post links to its Markdown variant', () => {
  const document = page('/fft/');
  const alternates = elements(document, 'link', {
    rel: 'alternate',
    type: 'text/markdown',
  });
  assert.equal(alternates.length, 1);
  const href = new URL(attribute(alternates[0], 'href'));
  assert.equal(href.pathname, '/fft.md');
  assert.match(output(href.pathname), /^---\ntitle: .+/);
});

test('llms.txt lists posts as Markdown', () => {
  const body = output('llms.txt');
  assert.match(body, /^# Diego Castillo\n/);
  assert.ok(body.includes('.md)'));
});

test('RSS feed is well-formed XML with channel and post data', () => {
  const body = output('rss.xml');
  assert.equal(XMLValidator.validate(body), true);
  const parser = new XMLParser({
    isArray: (_name, path) => path === 'rss.channel.item',
  });
  const { channel } = parser.parse(body).rss;
  assert.equal(channel.title, 'Diego Castillo');
  assert.ok(channel.item.length > 0);
  for (const item of channel.item) {
    assert.ok(item.title);
    const url = new URL(item.link);
    assert.equal(url.origin, 'https://diegocasmo.github.io');
    page(url.pathname);
  }
});

test('pagination page 2 contains posts and links to the homepage', () => {
  const document = page('/page/2/');
  element(document, 'article', { class: 'on-list' });
  const previous = element(document, 'a', { class: 'prev' });
  assert.equal(attribute(previous, 'href'), '/');
});

test('tags index links to generated pages with posts', () => {
  const document = page('/tags/');
  assert.equal(text(element(document, 'h1')).trim(), 'Tags');
  const firstTag = element(document, 'a', { class: 'tag-item' });
  const tagPage = page(attribute(firstTag, 'href'));
  element(tagPage, 'article', { class: 'on-list' });
});

test('merge-sort contains animation markup and initial controls', () => {
  const document = page('/merge-sort/');
  const animation = element(document, 'figure', { class: 'algo-viz' });
  const toggle = element(animation, 'button', { class: 'algo-viz__toggle' });
  assert.equal(text(toggle).trim(), 'Play');
  assert.equal(attribute(toggle, 'aria-label'), 'Play animation');
  jsonLd(document, 'BlogPosting');
});

test('about page preserves inline spacing and ProfilePage JSON-LD', () => {
  const document = page('/about/');
  assert.equal(text(element(document, 'h1')).trim(), 'About');
  element(document, 'a', { href: '/resume.md' });
  output('resume.md');
  const body = text(element(document, 'div', { class: 'page' })).replace(
    /\s+/g,
    ' '
  );
  assert.ok(body.includes('team @buffer.com building'));
  const entry = jsonLd(document, 'ProfilePage');
  assert.equal(entry.mainEntity['@type'], 'Person');
  assert.equal(entry.mainEntity.name, 'Diego Castillo');
});

test('plain Markdown mirrors preserve the source body', () => {
  const source = readFileSync(join(root, 'src/content/posts/fft.md'), 'utf8');
  const sourceBody = source.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
  const mirrorBody = output('fft.md')
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .trim();
  assert.equal(mirrorBody, sourceBody);
});

test('MDX mirrors contain prose without MDX syntax', () => {
  const body = output('merge-sort.md');
  assert.ok(body.replace(/^---\n[\s\S]*?\n---\n/, '').trim());
  assert.doesNotMatch(body, /^\s*(import|export)\s/m);
  assert.doesNotMatch(body, /<\/?[A-Z][^>]*>/);
});

test('only src/data/posts.ts reads the posts collection', () => {
  const source = join(root, 'src');
  const offenders = readdirSync(source, {
    recursive: true,
    encoding: 'utf8',
  })
    .filter((file) => /\.(astro|ts|js|mjs)$/.test(file))
    .filter((file) => file !== join('data', 'posts.ts'))
    .filter((file) =>
      readFileSync(join(source, file), 'utf8').includes('getCollection(')
    );
  assert.deepEqual(offenders, []);
});
