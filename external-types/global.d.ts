declare global {
  interface Window {
    sigma: any;
    graphology: any;
    graph: any;
    renderer: any;
    camera: any;
    startLayout: any;
    stopLayout: any;
    layout: any;
  }

  interface WebGLProgram {
    allocate(capacity: any): void;
    process(...args: any): void;
    computeIndices(): void;
    bufferData(): void;
    render(...args: any): void;
  }
}

export {};
