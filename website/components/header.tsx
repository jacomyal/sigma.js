import { FC } from "react";
import cx from "classnames";
import Link from "next/link";

const NavLinks = [
  { title: "Examples", id: "examples", url: "/examples" },
  { title: "Sources", id: "sources", url: "https://github.com/jacomyal/sigma.js" },
];
const NavLinksIDs = NavLinks.map((o) => o.id);

const Header: FC<{ currentPage?: typeof NavLinksIDs[number]; fluid?: boolean }> = ({ currentPage, fluid }) => (
  <header>
    <nav className={cx("navbar", "navbar-dark", "bg-dark", fluid ? "container-fluid" : "container")}>
      <Link href="/">
        <a className="navbar-brand">
          <img src="/images/sigma-logo-disc.svg" alt="sigma.js logo" /> <span className="ms-1">sigma.js</span>
        </a>
      </Link>

      <ul className="navbar-nav flex-row">
        {NavLinks.map(({ title, id, url }) => (
          <li key={id} className="nav-item ms-2">
            <Link href={url}>
              <a className={cx("nav-link", id === currentPage && "active")}>{title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;
