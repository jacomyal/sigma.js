import NAMES from "./resources/names.json";
import naiveSample from "pandemonium/naive-sample";

export function getRandomName(): string {
  return naiveSample(2, NAMES).join(" ");
}
