import worker from "./worker";
import supervisor from "./supervisor";

export default function extend(sigma) {
  worker(sigma);
  supervisor(sigma);
}
