import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        src="../images/avatar.png"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      />
      <p>
        Experienced software engineer with solid knowledge of Ruby & JavaScript ⚒️.
        <br/>
        Amateur explorer, professional thinker 🤔.
        <br/>
        Frontend Engineer <a target="blank" rel="noopener" href="https://twitter.com/remote">@remote</a>.
      </p>
    </div>
  )
}

export default Bio
