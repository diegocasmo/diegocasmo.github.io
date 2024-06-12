import * as React from "react"
import { Link } from "gatsby"

export const Navigation = () => (
  <nav className="navigation">
    <Link to="/" itemProp="url">
      Home
    </Link>
    {" • "}
    <a target="blank" rel="noopener" href="https://github.com/diegocasmo">
      GitHub
    </a>
    {" • "}
    <a target="blank" rel="noopener" href="https://x.com/diegocasmo">
      X/Twitter
    </a>
    {" • "}
    <a
      target="blank"
      rel="noopener"
      href="https://www.linkedin.com/in/diegocasmo/"
    >
      LinkedIn
    </a>
    <hr />
  </nav>
)
