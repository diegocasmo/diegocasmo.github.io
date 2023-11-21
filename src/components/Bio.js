import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

import { SocialNetworks } from "../components/SocialNetworks"

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
      <SocialNetworks />
      <p>
        ⚒️ Experienced software engineer with solid knowledge of Ruby &
        JavaScript.
        <br />
        🎶 Improvising bits and melodies{" "}
        <a
          target="blank"
          rel="noopener"
          href="https://www.youtube.com/diegocasmo"
        >
          @diegocasmo.
        </a>
      </p>
    </div>
  </section>
)
