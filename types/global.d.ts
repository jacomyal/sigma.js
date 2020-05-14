declare global {
  interface Window {
    sigma: any;
    graphology: any;
    graph: any;
    renderer: any;
    camera: any;
  }

  interface MouseOrTouchEvent {
    offsetX: number;
    offsetY: number;
    clientX: number;
    clientY: number;
    layerX: number;
    layerY: number;
    wheelDelta: number;
  }
  interface TouchEvent extends MouseOrTouchEvent {}
  interface MouseEvent extends MouseOrTouchEvent {}

  interface EventTarget {
    ownerSVGElement: any;
    height: number;
    width: number;
    namespaceURI: any;
  }

  interface Screen {
    deviceXDPI: number;
    logicalXDPI: number;
    systemXDPI: number;
  }
}

export {};
