import * as React from "react"
import { graphql } from "gatsby"

import { Bio } from "../components/Bio"
import { Layout } from "../components/Layout"
import { Seo } from "../components/Seo"

import { Navigation } from "../components/Navigation"

const AboutIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <Bio />
      <Navigation />
    </Layout>
  )
}

export default AboutIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
