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
      Product builder. Jazz guitarist.
      <hr />
      {/* <p> */}
      {/*   Curious software engineer with a keen interest in craftsmanship and */}
      {/*   design principles. At{" "} */}
      {/*   <a target="blank" rel="noopener" href="https://x.com/remote"> */}
      {/*     Remote */}
      {/*   </a> */}
      {/*   , I work with a great team to create delightful products, ensuring */}
      {/*   everything runs smoothly under the hood, aiming to enable global remote */}
      {/*   work. */}
      {/* </p> */}
      {/* <hr /> */}
      {/* <p> */}
      {/*   Improvising bits and melodies{" "} */}
      {/*   <a */}
      {/*     target="blank" */}
      {/*     rel="noopener" */}
      {/*     href="https://www.youtube.com/diegocasmo" */}
      {/*   > */}
      {/*     @diegocasmo */}
      {/*   </a> */}
      {/*   . */}
      {/* </p> */}
      {/* <hr /> */}
    </div>
  </section>
)
