import * as React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        <a target="blank" rel="noopener" href="https://github.com/diegocasmo">GitHub</a>
        {" • "}
        <a target="blank" rel="noopener" href="https://twitter.com/diegocasmo">Twitter</a>
        {" • "}
        <a target="blank" rel="noopener" href="https://www.linkedin.com/in/diegocasmo/">Linkedin</a>
      </footer>
    </div>
  )
}

export default Layout
