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
    <a target="blank" rel="noopener" href="https://linktr.ee/diegocasmo">
      Find Me
    </a>
    {/* <a target="blank" rel="noopener" href="https://github.com/diegocasmo"> */}
    {/*   GitHub */}
    {/* </a> */}
    {/* {" • "} */}
    {/* <a target="blank" rel="noopener" href="https://x.com/diegocasmo"> */}
    {/*   X */}
    {/* </a> */}
    {/* {" • "} */}
    {/* <a */}
    {/*   target="blank" */}
    {/*   rel="noopener" */}
    {/*   href="https://www.linkedin.com/in/diegocasmo/" */}
    {/* > */}
    {/*   LinkedIn */}
    {/* </a> */}
    <hr />
  </nav>
)
