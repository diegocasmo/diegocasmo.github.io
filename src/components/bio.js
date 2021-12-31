import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

export const Bio = () => (
  <>
    <div className="bio">
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
      <p>
        Experienced software engineer with solid knowledge of Ruby & JavaScript
        ⚒️.
        <br />
        Amateur explorer, professional thinker 🤔.
        <br />
        Frontend Engineer{" "}
        <a target="blank" rel="noopener" href="https://twitter.com/remote">
          @remote
        </a>
        .
      </p>
    </div>
  </>
)
