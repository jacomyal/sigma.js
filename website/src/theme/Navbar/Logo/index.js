import React from "react";

export default function NavbarLogo() {
  return (
    <a className="navbar__brand" href="/">
      <div className="navbar__logo">
        <img src="/img/logo-sigma-ruby.svg" alt="sigma.js logo" />
      </div>
      <b className="navbar__title text--truncate">
        <span className="text-ruby">sigma</span>
        <span className="text-grey">.js</span>
      </b>
    </a>
  );
}
