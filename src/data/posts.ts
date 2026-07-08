import { getCollection } from 'astro:content';

/** Posts per page in the paginated listing (homepage + /page/{n}/). */
export const POSTS_PER_PAGE = 10;

/**
 * All non-draft posts, newest first. Single source of truth for the
 * draft-exclusion invariant and the publish-date ordering used across every
 * listing, feed, and agent-facing route.
 */
export async function getPublishedPosts() {
  return (await getCollection('posts'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
