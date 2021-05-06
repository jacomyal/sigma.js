import React, { FC } from "react";
import Head from "next/head";

import { url } from "../next.config.js";
import PageLayout from "../components/page-layout";

const Home: FC<{}> = () => (
  <PageLayout>
    <Head>
      <title>Sigma.js website</title>
    </Head>

    <h1>
      Welcome to <a href={url}>sigmajs.org!</a>
    </h1>
  </PageLayout>
);

export default Home;

export const config = {
  unstable_runtimeJS: false,
};
