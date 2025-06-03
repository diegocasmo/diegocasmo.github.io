import * as React from "react"
import { graphql } from "gatsby"

import { Bio } from "../components/Bio"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Navigation } from "../components/Navigation"

const PROJECTS = [
  {
    title: "tonebuilder.ai",
    description:
      "An AI-powered chat-based tone architect for modeling multi-effects.",
    url: "https://tonebuilder.ai/",
    githubUrl: "https://github.com/diegocasmo/tonebuilder.ai",
    tech: ["Next.js", "Vercel AI SDK", "TypeScript", "Prisma", "PostgreSQL"],
  },
  {
    title: "findmomentum.xyz",
    description:
      "A productivity app that helps track and celebrate daily progress through small wins.",
    url: "https://findmomentum.xyz/",
    githubUrl: "https://github.com/diegocasmo/findmomentum.xyz",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
  },
]

const LIST_FORMATTER = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
})

const ProjectsPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Projects" />
      <Bio />
      <Navigation />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <h1>Projects</h1>
        <ol style={{ listStyle: "none" }}>
          {PROJECTS.map((project, index) => (
            <li key={index} className="post-list-item">
              <header>
                <h2>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.title}
                  </a>
                </h2>
              </header>
              <section>
                <p itemProp="description">{project.description}</p>
                <p>Built with: {LIST_FORMATTER.format(project.tech)}.</p>
                <div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo
                  </a>
                  {" • "}
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source Code
                  </a>
                </div>
              </section>
            </li>
          ))}
        </ol>
      </article>
    </Layout>
  )
}

export default ProjectsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
