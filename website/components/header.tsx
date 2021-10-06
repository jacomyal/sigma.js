import { FC } from "react";
import cx from "classnames";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";

const NavLinks = [
  {
    title: (
      <>
        <small className="align-middle">
          <BsGithub className="me-1" />
        </small>{" "}
        Sources
      </>
    ),
    id: "sources",
    url: "https://github.com/jacomyal/sigma.js",
  },
];
const NavLinksIDs = NavLinks.map((o) => o.id);

const Header: FC<{ currentPage?: typeof NavLinksIDs[number]; fluid?: boolean }> = ({ currentPage, fluid }) => (
  <header>
    <nav className={cx("navbar", fluid ? "container-fluid" : "container")}>
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
