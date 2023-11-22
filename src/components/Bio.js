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
        ⚒️ Detail-oriented software engineer with over a decade of experience in
        developing user-centric products.
      </p>
      <hr />
      <p>
        🎶 Improvising bits and melodies{" "}
        <a
          target="blank"
          rel="noopener"
          href="https://www.youtube.com/diegocasmo"
        >
          @diegocasmo.
        </a>
      </p>
      <hr />
    </div>
  </section>
)
