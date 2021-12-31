import * as React from "react"
import { Link } from "gatsby"

export const Navigation = () => (
  <section className="navigation">
    <Link to="/" itemProp="url">
      Home
    </Link>
    {" • "}
    <Link to="/about" itemProp="url">
      About
    </Link>
  </section>
)
