import * as React from "react"
import { Link } from "gatsby"

export const Navigation = () => (
  <nav className="navigation">
    <Link to="/" itemProp="url">
      Home
    </Link>
    {" • "}
    <Link to="/about" itemProp="url">
      About
    </Link>
  </nav>
)
