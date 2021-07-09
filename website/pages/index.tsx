import React, { FC } from "react";
import Head from "next/head";
import Link from "next/link";

import PageLayout from "../components/page-layout";

const Home: FC<{}> = () => (
  <PageLayout>
    <Head>
      <title>Sigma.js website</title>
    </Head>

    <h1 className="mt-5">
      <img src="/images/sigma-logo.svg" alt="" /> sigma.js
    </h1>

    <h3>
      is an open-source JavaScript library <strong>dedicated to graph drawing</strong>.
    </h3>
    <h3>
      It is based on the{" "}
      <Link href="https://graphology.github.io/">
        <a>Graphology</a>
      </Link>{" "}
      graph library, and uses{" "}
      <Link href="https://get.webgl.org/">
        <a>WebGL</a>
      </Link>{" "}
      for rendering
    </h3>

    <h4>Pros</h4>
    <ul>
      <li>Plug-and-play</li>
      <li>Allows drawing large graphs with high framerate</li>
      <li>
        Benefits from the{" "}
        <Link href="https://github.com/graphology/">
          <a>Graphology ecosystem</a>
        </Link>
      </li>
      <li>Multi-touch support</li>
    </ul>

    <h4>Cons</h4>
    <ul>
      <li>
        Not very flexible for custom rendering (compared to{" "}
        <Link href="https://d3js.org/">
          <a>d3.js</a>
        </Link>{" "}
        for instance)
      </li>
    </ul>
  </PageLayout>
);

export default Home;

export const config = {
  unstable_runtimeJS: false,
};
