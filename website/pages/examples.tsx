import React, { FC } from "react";
import Link from "next/link";
import Head from "next/head";

import { Example } from "../lib/types";
import { getExamples } from "../lib/examples-api";
import { getExampleURL } from "../lib/examples-utils";
import PageLayout from "../components/page-layout";

const ExampleThumbnail: FC<{ example: Example }> = ({ example }) => {
  return (
    <article>
      <h2>
        <Link as={getExampleURL(example)} href="/examples/[example]">
          <a>{example.name}</a>
        </Link>
      </h2>
    </article>
  );
};

const Blog: FC<{ examples: Example[] }> = ({ examples }) => (
  <PageLayout currentPage="examples">
    <Head>
      <title>Examples</title>
    </Head>

    <h1 className="mt-5">Examples</h1>
    <br />
    {examples.map((example) => (
      <ExampleThumbnail key={example.name} example={example} />
    ))}
  </PageLayout>
);

export default Blog;

export const getStaticProps = async () => {
  const examples = getExamples();

  return {
    props: {
      examples,
    },
  };
};

export const config = {
  unstable_runtimeJS: false,
};
