import React, { FC } from "react";
import cx from "classnames"

import Header from "./header";
import Footer from "./footer";

const PageLayout: FC<{ mainClass?: string; currentPage?: string; fluid?: boolean }> = ({
  children,
  mainClass,
  currentPage,
  fluid,
}) => (
  <>
    <Header currentPage={currentPage} fluid={fluid} />
    <main className={cx(fluid ? "container-fluid" : "container", mainClass || undefined)}>{children}</main>
    <Footer />
  </>
);

export default PageLayout;
