import React, { FC } from "react";

import Header from "./header";
import Footer from "./footer";

const PageLayout: FC<{ mainClass?: string }> = ({ children, mainClass }) => (
  <>
    <Header />
    <main className={mainClass || undefined}>{children}</main>
    <Footer />
  </>
);

export default PageLayout;
