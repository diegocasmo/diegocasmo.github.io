import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export const Bio = () => (
  <section className="bio">
    <StaticImage
      alt="Profile picture"
      className="bio-avatar"
      formats={["auto", "webp", "avif"]}
      height={100}
      imgStyle={{ borderRadius: "100%" }}
      layout="fixed"
      quality={95}
      src="../images/avatar.jpg"
      width={100}
    />
    <div>
      <hr />
      <p>
        Curious software engineer with a keen interest in craftsmanship and design
        principles. At{' '}
        <a target="blank" rel="noopener" href="https://buffer.com/">
          Buffer
        </a>
        , I work with a fully remote team building tools that help creators and
        small businesses plan, publish, and analyze their social media so they can
        grow their audience and connect with their communities.
      </p>
      <hr />
      <p>
        Improvising bits and melodies{' '}
        <a
          target="blank"
          rel="noopener"
          href="https://www.youtube.com/diegocasmo"
        >
          @diegocasmo
        </a>
        .
      </p>
    </div>
  </section>
)
