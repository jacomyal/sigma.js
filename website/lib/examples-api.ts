import fs from "fs";
import { join } from "path";
import hljs from "highlight.js";

import { Example } from "./types";
import examples from "../../examples/examples.json";
import pkg from "../../package.json";

const POSTS_DIRECTORY = join(process.cwd(), "../examples");

/**
 * Returns a cleaned ExampleType object from a full path.
 */
export function getExample(name: string, title: string): Example {
  const path = join(POSTS_DIRECTORY, `${name}/index.ts`);
  const imagePath = join(POSTS_DIRECTORY, `${name}/thumbnail.png`);
  const packageJsonContent = JSON.parse(fs.readFileSync(join(POSTS_DIRECTORY, `${name}/package.json`), "utf8"));
  const rawFileContent = fs.readFileSync(path, "utf8");
  const githubURL = pkg.repository.url.replace(/\.git$/, "") + `/tree/master/examples/${name}`;
  const codesandboxURL = githubURL.replace("github.com", "githubbox.com");

  return {
    name: title,
    description: packageJsonContent.description,
    codeRaw: rawFileContent,
    codeHTML: hljs.highlightAuto(rawFileContent).value,
    codePath: path,
    htmlPath: path,
    iframePath: `/demos/${name}.html`,
    imageBase64: new Buffer(fs.readFileSync(imagePath)).toString("base64"),
    githubURL,
    codesandboxURL,
  };
}

/**
 * Returns the list of all posts.
 */
export function getExamples(): Example[] {
  return examples
    .filter((example) => !example.skip)
    .map((example) => getExample(example.name, example.title as string));
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
