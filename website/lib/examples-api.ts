import fs from "fs";
import { join } from "path";
import hljs from "highlight.js";

import { Example } from "./types";
import examples from "../../examples/.examples.json";

const POSTS_DIRECTORY = join(process.cwd(), "../examples");

/**
 * Returns a cleaned ExampleType object from a full path.
 */
export function getExample(path: string): Example {
  const slug = (path.match(/([^\/\.]+)(\.[^\.\/]+)?$/) || [])[1] as string;
  const rawFileContent = fs.readFileSync(path, "utf8");

  return {
    name: slug,
    codeRaw: rawFileContent,
    codeHTML: hljs.highlightAuto(rawFileContent).value,
    codePath: path,
    htmlPath: path,
    iframePath: `/demos/${slug}.html`,
  };
}

/**
 * Returns the list of all posts.
 */
export function getExamples(): Example[] {
  return Object.values<{ id: string; title: string }>(examples).map((example) =>
    getExample(join(POSTS_DIRECTORY, example.id + ".ts")),
  );
}

/**
 * Returns for a example the params required to build its permalink.
 */
export function getExampleParams(example: Example) {
  return {
    example: example.name,
  };
}

/**
 * Finds and returns the example for a given name.
 */
export function findExample(name: string): Example | undefined {
  const examples = getExamples();

  return examples.find((example) => example.name === name);
}
