import React, { FC, PropsWithChildren } from "react";

import Header from "./header";
import Footer from "./footer";

const PageLayout: FC<{}> = ({ children }: PropsWithChildren<{}>) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

export default PageLayout;
