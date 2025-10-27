import * as React from "react"
import { graphql } from "gatsby"

import { Bio } from "../components/Bio"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Navigation } from "../components/Navigation"

const PRODUCTS = [
  {
    title: "tonebuilder.ai",
    description:
      "An AI-powered, chat-based tone architect for Line 6 Helix devices.",
    url: "https://tonebuilder.ai/",
    tech: ["Next.js", "AI SDK", "TypeScript", "Prisma", "PostgreSQL"],
  },
  {
    title: "findmomentum.xyz",
    description:
      "A productivity app that helps track and celebrate daily progress through small wins.",
    url: "https://findmomentum.xyz/",
    githubUrl: "https://github.com/diegocasmo/findmomentum",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
  },
]

const LIST_FORMATTER = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
})

const ProductsPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Products" />
      <Bio />
      <Navigation />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <h1>Products</h1>
        <ol style={{ listStyle: "none" }}>
          {PRODUCTS.map((product, index) => (
            <li key={index} className="post-list-item">
              <header>
                <h2>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {product.title}
                  </a>
                </h2>
              </header>
              <section>
                <p itemProp="description">{product.description}</p>
                <p>Built with: {LIST_FORMATTER.format(product.tech)}.</p>
                <div>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Try it now
                  </a>
                  {product.githubUrl && (
                    <>
                      {" • "}
                      <a
                        href={product.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source Code
                      </a>
                    </>
                  )}
                </div>
              </section>
            </li>
          ))}
        </ol>
      </article>
    </Layout>
  )
}

export default ProductsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
