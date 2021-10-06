import React, { FC } from "react";
import Head from "next/head";
import Link from "next/link";
import { BsCheckCircle, BsCodeSlash } from "react-icons/bs";
import { AiFillCodeSandboxCircle, AiFillGithub, AiOutlineLink } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import cx from "classnames";

import PageLayout from "../components/page-layout";
import { getExamples } from "../lib/examples-api";
import { Example } from "../lib/types";
import { getExampleURL } from "../lib/examples-utils";

const Home: FC<{ examples: Example[] }> = ({ examples }) => (
  <PageLayout>
    <Head>
      <title>Sigma.js</title>
    </Head>

    <h1 className="mt-5 text-center">
      <img src="/images/sigma-logo-disc.svg" alt="sigma.js logo" style={{ width: "4em" }} />
    </h1>

    <h2 className="w-75 m-auto mb-4 text-center">
      <strong>Sigma.js</strong> is an open-source JavaScript library <strong>dedicated to graph drawing</strong>, based
      on{" "}
      <Link href="https://graphology.github.io/">
        <a>Graphology</a>
      </Link>{" "}
      and{" "}
      <Link href="https://get.webgl.org/">
        <a>WebGL</a>
      </Link>
    </h2>

    <section className="my-5">
      <h3>
        <small className="align-middle text-muted">
          <BsCheckCircle />
        </small>{" "}
        When to use sigma
      </h3>
      <p>
        WebGL based rendering allows drawing larger graphs with a <strong>high framerate</strong> than SVG or Canvas
        based alternatives such as{" "}
        <Link href="https://d3js.org/">
          <a>d3.js</a>
        </Link>
        .
      </p>
      <p>
        Sigma is <strong>easy to use for simple cases</strong>, while being <strong>heavily customisable</strong>. It
        benefits from the{" "}
        <Link href="https://graphology.github.io/standard-library.html">
          <a>Graphology ecosystem</a>
        </Link>
        , with lots of graph algorithms, from{" "}
        <Link href="https://github.com/graphology/graphology-pagerank#readme">
          <a>PageRank</a>
        </Link>{" "}
        to{" "}
        <Link href="https://github.com/graphology/graphology-layout-forceatlas2#readme">
          <a>ForceAtlas2</a>
        </Link>
        . Finally, it offers Google Maps like <strong>multitouch support</strong>.
      </p>
    </section>

    <section className="my-5">
      <h3>
        <small className="align-middle text-muted">
          <IoWarningOutline />
        </small>{" "}
        When <strong>not</strong> to use sigma
      </h3>
      <p>
        Custom rendering is <strong>way harder</strong> to do with WebGL than with SVG, Canvas or even CSS. Also, some
        things are impossible to implement, such as <strong>transitions or animations on node/edge styles</strong>.
      </p>
      <p>
        So, for usages requiring highly customized rendering or small graphs (some hundreds of nodes and edges), we
        advise to use an alternative such as{" "}
        <Link href="https://d3js.org/">
          <a>d3.js</a>
        </Link>
        .
      </p>
    </section>

    <section className="my-5">
      <h3>
        <small className="align-middle text-muted">
          <BsCodeSlash />
        </small>{" "}
        See sigma in action
      </h3>
      <div className="examples">
        {examples.map((example, i) => (
          <div
            key={example.name}
            className={cx(
              "d-flex",
              "align-items-center",
              "justify-content-between",
              i % 2 ? "flex-row" : "flex-row-reverse",
            )}
          >
            <img
              src={"data:image/png;base64, " + example.imageBase64}
              className={i % 2 ? "me-2" : "ms-2"}
              alt=""
              style={{ maxHeight: 200 }}
            />
            <div>
              <h4>{example.name}</h4>
              <p>{example.description}</p>
              <Link as={getExampleURL(example)} href="/examples/[example]">
                <a className="d-block">
                  <strong>
                    <AiOutlineLink /> Open
                  </strong>
                </a>
              </Link>
              <Link href={example.githubURL}>
                <a className="d-block">
                  <AiFillCodeSandboxCircle /> Open in CodeSandbox
                </a>
              </Link>
              <Link href={example.codesandboxURL}>
                <a className="d-block">
                  <AiFillGithub /> Open in GitHub
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  </PageLayout>
);

export default Home;

export const getStaticProps = async () => {
  const examples = getExamples();

  return {
    props: {
      examples,
      bodyClassName: "homepage",
    },
  };
};

export const config = {
  unstable_runtimeJS: false,
};
