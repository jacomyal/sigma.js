/* global __dirname */
import * as process from "node:process";
import * as path from "path";
import * as readline from "readline";
import { spawn } from "child_process";
import { promises as fs } from "fs";

async function readJSONFile<T = unknown>(filePath: string): Promise<T> {
  const fileContent = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContent);
}

async function writeJSONFile(filePath: string, data: unknown) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
}

async function copyFolder(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  const copyPromises = entries.map(async (entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      return copyFolder(srcPath, destPath);
    } else {
      return fs.copyFile(srcPath, destPath);
    }
  });

  await Promise.all(copyPromises);
}

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function createPackage() {
  // 1. Ask for a new package name
  const packageName = await prompt("Enter a new package name (lowercase letters, digits, and dashes only): ");

  // Validate the package name
  if (!/^[a-z0-9-]+$/.test(packageName)) {
    throw new Error("Package name can only contain lowercase letters, digits, and dashes.");
  }

  // 2. Copy the template folder
  const srcDir = path.resolve(__dirname, "../packages/template");
  const destDir = path.resolve(__dirname, `../packages/${packageName}`);
  await copyFolder(srcDir, destDir);

  // 3. Update the package.json
  const packageJsonPath = path.join(destDir, "package.json");
  const packageJson = await readJSONFile<Record<string, unknown>>(packageJsonPath);
  packageJson.name = `@sigma/${packageName}`;
  packageJson.description = "TODO";
  (packageJson.repository as Record<string, unknown>).directory = `packages/${packageName}`;
  delete packageJson.private;

  await writeJSONFile(packageJsonPath, packageJson);

  // 4. Update the references in tsconfig.json
  const tsconfigPath = path.resolve(__dirname, "../tsconfig.json");
  const tsconfig = await readJSONFile<Record<string, unknown>>(tsconfigPath);
  (tsconfig.references as { path: string }[]).push({ path: `./packages/${packageName}` });
  await writeJSONFile(tsconfigPath, tsconfig);

  // 5. Add the package to the Preconstruct packages array in package.json
  const rootPackageJsonPath = path.resolve(__dirname, "../package.json");
  const rootPackageJson = await readJSONFile<Record<string, unknown> & { preconstruct: { packages: string[] } }>(
    rootPackageJsonPath,
  );
  rootPackageJson.preconstruct = {
    ...(rootPackageJson.preconstruct || {}),
    packages: (rootPackageJson.preconstruct.packages || []).concat(`packages/${packageName}`),
  };
  await writeJSONFile(rootPackageJsonPath, rootPackageJson);

  // 7. Run npm run prettify and npm install using spawn with stdio inheritance
  await runCommand("npm", ["run", "prettify"]);
  await runCommand("npx", ["preconstruct", "fix"]);
  await runCommand("npm", ["install"]);

  // eslint-disable-next-line no-console
  console.log(`Package ${packageName} has been successfully created.`);
}

// Run the script
createPackage().catch((e: Error) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
