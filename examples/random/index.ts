/**
 * The goal of this file is to seed random generators if the query params 'seed' is present.
 * As an example you can go to http://localhost:8000/components.html?seed=foo and refresh multiple times the page
 * you should have the result. This feature is mainly used for the E2E test.
 *
 * For now it :
 * - replace the global `Math.random` with a seed one
 * - seed the faker library
 */
import seed from "seed-random";
import faker from "faker";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const seedParam = urlParams.get("seed");
if (seedParam) {
  seed(seedParam, { global: true });
  faker.seed(Math.random());
}
