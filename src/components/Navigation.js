import * as React from "react"
import { Link } from "gatsby"

export const Navigation = () => (
  <nav className="navigation">
    <Link to="/" itemProp="url">
      Home
    </Link>
    {" • "}
    <Link to="/products" itemProp="url">
      Products
    </Link>
    {" • "}
    <a target="blank" rel="noopener" href="https://diegocasmo.start.page/">
      Find Me
    </a>
    <hr />
  </nav>
)
