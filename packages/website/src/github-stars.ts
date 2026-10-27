import process from "node:process";

// Set by CI (see .github/workflows/website.yml); null hides the count
const stars = Number.parseInt(process.env.GITHUB_STARS ?? "", 10);

export const GITHUB_STARS = Number.isNaN(stars) ? null : stars;
