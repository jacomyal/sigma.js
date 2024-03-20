import Graph from "graphology";
import Sigma from "sigma";
import { EdgeProgramType, NodeProgramType } from "sigma/rendering";

export function rafNTimes(fn: (step: number) => void, n: number): Promise<void> {
  return new Promise((globalResolve) => {
    let count = 0;

    function executeAndRequestFrame() {
      fn(count);

      count++;
      if (count < n) {
        requestAnimationFrame(() => executeAndRequestFrame());
      } else {
        globalResolve(undefined); // ou retournez tout autre résultat que vous souhaitez obtenir
      }
    }

    executeAndRequestFrame();
  });
}

export type BrowserTestDependencies = {
  Graph: typeof Graph;
  Sigma: typeof Sigma;
  data: { [key: string]: Graph };
  nodePrograms: { [key: string]: NodeProgramType };
  edgePrograms: { [key: string]: EdgeProgramType };
  container: HTMLElement;
  rafNTimes: typeof rafNTimes;
};
