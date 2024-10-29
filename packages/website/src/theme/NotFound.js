import { useLocation } from "@docusaurus/router";
import NotFound from "@theme-original/NotFound";
import React from "react";

export default function NotFoundWrapper(props) {
  const location = useLocation();

  if (location.pathname === "/") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <div>
          The homepage of this website is not in the React-Router workflow: The sources are not in <code>/docs</code>,
          but in{" "}
          <strong>
            <code>/static/index.html</code>
          </strong>{" "}
          instead.
        </div>
        <br />
        <div>
          This page cannot be served in the development version, but you can edit its HTML code directly if it needs
          modifications.
        </div>
        <br />
        <div>
          Please open{" "}
          <a href="/docs">
            <strong>
              <code>/docs</code>
            </strong>
          </a>{" "}
          to access the documentation.
        </div>
      </div>
    );
  }

  return (
    <>
      <NotFound {...props} />
    </>
  );
}
