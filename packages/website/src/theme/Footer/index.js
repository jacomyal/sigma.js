import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container container-fluid">
        <div className="row">
          <div className="footer__col col">
            <p>
              <a href="/" className="with-logo">
                <img src="/img/logo-sigma-ruby.svg" alt="" /> <strong className="text-ruby">sigma</strong>
                <strong className="text-grey">.js</strong>
              </a>{" "}
              is published by <a href="https://medialab.sciencespo.fr/en/">Sciences-Po médialab</a> and{" "}
              <a href="https://ouestware.com/en">OuestWare</a>.
            </p>
            <ul>
              <li>
                <a href="/docs">documentation</a>
              </li>
              <li>
                <a href="https://github.com/jacomyal/sigma.js">github.com/jacomyal/sigma.js</a>
              </li>
              <li>
                <a rel="me" href="https://vis.social/@sigmajs">
                  vis.social/@sigmajs (Mastodon)
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__col col">
            <p>
              It is developed under{" "}
              <a href="https://github.com/jacomyal/sigma.js/blob/main/LICENSE.txt">the MIT License</a>.
            </p>
            <p>
              This website uses <a href="https://themeui.net/hauora-sans-free-font/">Hauroa Sans</a>,{" "}
              <a href=" https://public-sans.digital.gov/">Public Sans</a> and{" "}
              <a href="https://github.com/microsoft/cascadia-code">Cascadia Code</a> fonts.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default React.memo(Footer);
