import React from "react";
import NotFound from "@theme-original/NotFound";
import { useLocation } from "@docusaurus/router";

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
          The homepage of this website is not in the React-Router workflow: The sources are not in{" "}
          <code>/src/pages</code>, but in{" "}
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
      </div>
    );
  }

  return (
    <>
      <NotFound {...props} />
    </>
  );
}
