import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  return (
    <div className="bio">
      <StaticImage
        alt="Profile picture"
        className="bio-avatar"
        formats={["auto", "webp", "avif"]}
        height={50}
        imgStyle={{ borderRadius: '100%' }}
        layout="fixed"
        quality={95}
        src="../images/avatar.png"
        width={50}
      />
      <p>
        Amateur explorer, professional thinker 🤔.
        <br/>
        Frontend Engineer <a target="blank" rel="noopener" href="https://twitter.com/remote">@remote</a>.
      </p>
    </div>
  )
}

export default Bio
