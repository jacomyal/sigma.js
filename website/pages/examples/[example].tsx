import React, { FC } from "react";
import Head from "next/head";
import ErrorPage from "next/error";
import { useRouter } from "next/router";

import { Example } from "../../lib/types";
import PageLayout from "../../components/page-layout";
import { findExample, getExampleParams, getExamples } from "../../lib/examples-api";

const ExampleComponent: FC<{ example: Example }> = ({ example }) => {
  const router = useRouter();

  if (!router.isFallback && !example?.name) return <ErrorPage statusCode={404} />;

  return (
    <PageLayout fluid mainClass="page-example">
      <Head>
        <title>Example {example.name}</title>
      </Head>

      <h1 className="mt-2">Example {example.name}</h1>
      <div className="example">
        <div className="code">
          <pre>
            <code dangerouslySetInnerHTML={{ __html: example.codeHTML }} />
          </pre>
        </div>
        <div className="demo">
          <iframe src={example.iframePath} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ExampleComponent;

type Params = {
  params: {
    example: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const example = findExample(params.example);

  return {
    props: {
      example,
    },
  };
}

export async function getStaticPaths() {
  const examples = getExamples();

  return {
    paths: examples.map((example) => ({ params: getExampleParams(example) })),
    fallback: false,
  };
}

export const config = {
  unstable_runtimeJS: false,
};
