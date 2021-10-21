import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  return (
    <>
      <div className="bio">
        <StaticImage
          alt="Profile picture"
          className="bio-avatar"
          formats={["auto", "webp", "avif"]}
          height={100}
          imgStyle={{ borderRadius: '100%' }}
          layout="fixed"
          quality={95}
          src="../images/avatar.png"
          width={100}
        />
        <p>
          Experienced software engineer with solid knowledge of Ruby & JavaScript ⚒️.
          <br/>
          Amateur explorer, professional thinker 🤔.
          <br/>
          Frontend Engineer <a target="blank" rel="noopener" href="https://twitter.com/remote">@remote</a>.
        </p>
      </div>
      <section className="social-networks">
        <a target="blank" rel="noopener" href="https://github.com/diegocasmo">GitHub</a>
        {" • "}
        <a target="blank" rel="noopener" href="https://twitter.com/diegocasmo">Twitter</a>
        {" • "}
        <a target="blank" rel="noopener" href="https://www.linkedin.com/in/diegocasmo/">LinkedIn</a>
      </section>
    </>
  )
}

export default Bio
