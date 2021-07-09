import React, { FC } from "react";
import Head from "next/head";

import PageLayout from "../components/page-layout";

const Page404: FC<{}> = () => (
  <PageLayout>
    <Head>
      <title>404 - Page not found</title>
    </Head>

    <article>
      <h1 className="mt-5">404 - Page not found</h1>
    </article>
  </PageLayout>
);

export default Page404;

export const config = {
  unstable_runtimeJS: false,
};
