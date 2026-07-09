/**
 * Single source of truth for Diego's machine-readable identity facts.
 *
 * Used by both the homepage (`index.astro`) and the about page (`about.astro`),
 * which emit the same `#person` @id. Keeping the facts here (rather than copied
 * into each page) prevents the two from drifting into contradictory structured
 * data for the same entity when Diego's role/employer changes.
 */
export interface PersonOptions {
  /** The site's origin URL, e.g. `https://diegocasmo.github.io/`. */
  siteURL: string;
  /** Optional prose description (used on the ProfilePage, omitted on the homepage). */
  description?: string;
}

export function buildPerson({ siteURL, description }: PersonOptions) {
  return {
    '@type': 'Person',
    '@id': `${siteURL}#person`,
    name: 'Diego Castillo',
    url: siteURL,
    ...(description ? { description } : {}),
    jobTitle: 'Senior Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Buffer',
      url: 'https://buffer.com/',
    },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Uppsala University' },
      { '@type': 'CollegeOrUniversity', name: 'Harding University' },
    ],
    knowsAbout: [
      'Software Engineering',
      'Artificial Intelligence',
      'TypeScript',
      'Elixir',
      'Ruby',
      'Computer Science',
    ],
    sameAs: [
      'https://github.com/diegocasmo',
      'https://www.linkedin.com/in/diegocasmo/',
      'https://x.com/diegocasmo',
    ],
  };
}
