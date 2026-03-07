import * as React from "react"
import { graphql } from "gatsby"

import { Bio } from "../components/Bio"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"
import { Navigation } from "../components/Navigation"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteUrl = data.site.siteMetadata?.siteUrl?.replace(/\/$/, "")
  const image = data.site.siteMetadata?.image

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        pathname={location.pathname}
        ogType="article"
      />
      <Bio />
      <Navigation />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <meta itemProp="datePublished" content={post.frontmatter.dateISO} />
        <meta itemProp="dateModified" content={post.frontmatter.dateISO} />
        {image && <meta itemProp="image" content={`${siteUrl}${image}`} />}
        <div itemProp="author" itemScope itemType="http://schema.org/Person">
          <meta itemProp="name" content={data.site.siteMetadata?.title} />
        </div>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
        image
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        dateISO: date(formatString: "YYYY-MM-DD")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
