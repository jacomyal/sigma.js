import{c as i}from"./chroma-CKzHTTCE.js";import{G as p,S as h,o as v}from"./utils-Ph0PoCvK.js";import{F as f}from"./worker-CV-kllgO.js";import{v as b}from"./v4-D8aEg3BZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./defaults-9mJNxk8k.js";const x=()=>{const c=document.getElementById("sigma-container"),e=new p;e.addNode("n1",{x:0,y:0,size:10,color:i.random().hex()}),e.addNode("n2",{x:-5,y:5,size:10,color:i.random().hex()}),e.addNode("n3",{x:5,y:5,size:10,color:i.random().hex()}),e.addNode("n4",{x:0,y:10,size:10,color:i.random().hex()}),e.addEdge("n1","n2"),e.addEdge("n2","n4"),e.addEdge("n4","n3"),e.addEdge("n3","n1"),new f(e,{isNodeFixed:(n,r)=>r.highlighted}).start();const t=new h(e,c);let a=null,u=!1;t.on("downNode",n=>{u=!0,a=n.node,e.setNodeAttribute(a,"highlighted",!0)}),t.getMouseCaptor().on("mousemovebody",n=>{if(!u||!a)return;const r=t.viewportToGraph(n);e.setNodeAttribute(a,"x",r.x),e.setNodeAttribute(a,"y",r.y),n.preventSigmaDefault(),n.original.preventDefault(),n.original.stopPropagation()}),t.getMouseCaptor().on("mouseup",()=>{a&&e.removeNodeAttribute(a,"highlighted"),u=!1,a=null}),t.getMouseCaptor().on("mousedown",()=>{t.getCustomBBox()||t.setCustomBBox(t.getBBox())}),t.on("clickStage",({event:n})=>{const d={...t.viewportToGraph({x:n.x,y:n.y}),size:10,color:i.random().hex()},m=e.nodes().map(o=>{const s=e.getNodeAttributes(o),g=Math.pow(d.x-s.x,2)+Math.pow(d.y-s.y,2);return{nodeId:o,distance:g}}).sort((o,s)=>o.distance-s.distance).slice(0,2),l=b();e.addNode(l,d),m.forEach(o=>e.addEdge(l,o.nodeId))}),v(()=>{t.kill()})},y=`<style>
  html,
  body {
    font-family: sans-serif;
    background: #f9f9f9;
  }
  main {
    margin: auto;
    max-width: 800px;
  }
  #storybook-root,
  #sigma-container {
    height: 600px;
    background: white;
  }
</style>
<main>
  <p>
    <strong>
      To be able to test the integration of sigma and its mouse interaction capabilities in a scrollable webpage, we
      added some random texts around the container.
    </strong>
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla a justo vel velit efficitur ullamcorper non ut augue.
    Nunc ultrices massa nulla, non rutrum justo accumsan eget. Aenean volutpat pharetra dolor, in mollis felis
    consectetur faucibus. Vestibulum varius ligula et tempor varius. Suspendisse et neque vitae est porttitor malesuada
    sit amet consectetur quam. Nam vestibulum vestibulum ante sit amet bibendum. Integer vel porta massa, ac suscipit
    velit. In auctor ex eu tristique dignissim. Praesent vitae faucibus eros, vel ultricies lectus. Integer at turpis ut
    ex ultrices tristique. Mauris venenatis imperdiet dignissim. Quisque eleifend dui ac neque consectetur, in
    sollicitudin elit consequat. Sed suscipit mauris nec leo tristique, id lacinia purus aliquam.
  </p>
  <p>
    Duis nisl metus, pellentesque nec egestas nec, finibus eu erat. Morbi mollis, dui in rutrum blandit, tellus mauris
    vestibulum eros, ac gravida orci augue eget mauris. Maecenas pharetra convallis est placerat lacinia. Curabitur
    ipsum metus, sagittis vitae efficitur congue, suscipit quis nunc. Integer convallis, nisl sed mattis consectetur, mi
    nunc rutrum purus, at bibendum quam mi nec elit. Aliquam vulputate posuere ipsum, quis condimentum tortor ultricies
    vitae. Nunc vitae justo id neque dictum vulputate quis nec enim. Ut a venenatis metus.
  </p>
  <p>
    Etiam ut mattis ligula. Vestibulum a nisl vel magna fermentum sodales et ac metus. Ut cursus libero tincidunt nisl
    imperdiet, vel vulputate tellus pulvinar. Donec ac nulla tempus, aliquam tellus vitae, ornare velit. Nam quis massa
    ac elit scelerisque finibus eu ac metus. Nullam faucibus nunc id interdum tincidunt. Maecenas ut neque a justo
    ultricies pretium. Integer efficitur sit amet est in mattis. Vivamus interdum erat in quam sodales sagittis. Sed
    laoreet urna at neque volutpat rutrum. Duis id ornare lectus. Praesent in felis vitae tortor viverra congue.
    Pellentesque commodo diam eu lorem dapibus, ac scelerisque turpis tristique.
  </p>
  <p>
    <strong>
      You can move nodes with your mouse. Also, clicking the stage will create new nodes, connected to the closest
      nodes.
    </strong>
  </p>
  <div id="sigma-container"></div>
  <p>
    Duis justo sapien, auctor a ligula eget, iaculis pharetra nulla. In sed malesuada arcu. Quisque viverra tortor sed
    imperdiet euismod. Aliquam quis sem vitae metus consequat posuere id ornare elit. Donec porttitor nulla id euismod
    luctus. In euismod a quam a convallis. Vivamus sit amet vehicula sapien, nec vulputate ex. Fusce non enim a felis
    luctus mattis ac nec nulla.
  </p>
  <p>
    Praesent tortor risus, sagittis at aliquet vel, egestas a ligula. Aliquam euismod lobortis magna, a varius massa
    tincidunt et. Praesent et ultrices turpis, sed rhoncus quam. Praesent quis congue tortor, sed ultrices mi. Curabitur
    tincidunt placerat tincidunt. Sed non varius risus. Proin suscipit magna arcu, a congue augue tempor vel. Sed
    hendrerit nisi a tellus luctus, eu venenatis orci semper. Vestibulum a nulla semper, elementum elit at, consequat
    nisl. Mauris ipsum mauris, ultrices nec ante et, elementum rhoncus diam. Mauris nisl arcu, maximus at ultricies at,
    convallis nec justo. Integer congue placerat sem, id ultrices odio porttitor consequat. Vestibulum porttitor
    tincidunt justo, vel sodales dui imperdiet ut. Mauris eget accumsan sapien, et viverra ante. Donec et turpis et
    neque euismod sollicitudin. Donec sit amet vulputate felis.
  </p>
</main>
`,N=`import chroma from "chroma-js";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import { v4 as uuid } from "uuid";

import { onStoryDown } from "../utils";

export default () => {
  // Retrieve the html document for sigma container
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Create a sample graph
  const graph = new Graph();
  graph.addNode("n1", { x: 0, y: 0, size: 10, color: chroma.random().hex() });
  graph.addNode("n2", { x: -5, y: 5, size: 10, color: chroma.random().hex() });
  graph.addNode("n3", { x: 5, y: 5, size: 10, color: chroma.random().hex() });
  graph.addNode("n4", { x: 0, y: 10, size: 10, color: chroma.random().hex() });
  graph.addEdge("n1", "n2");
  graph.addEdge("n2", "n4");
  graph.addEdge("n4", "n3");
  graph.addEdge("n3", "n1");

  // Create the spring layout and start it
  const layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted });
  layout.start();

  // Create the sigma
  const renderer = new Sigma(graph, container);

  //
  // Drag'n'drop feature
  // ~~~~~~~~~~~~~~~~~~~
  //

  // State for drag'n'drop
  let draggedNode: string | null = null;
  let isDragging = false;

  // On mouse down on a node
  //  - we enable the drag mode
  //  - save in the dragged node in the state
  //  - highlight the node
  //  - disable the camera so its state is not updated
  renderer.on("downNode", (e) => {
    isDragging = true;
    draggedNode = e.node;
    graph.setNodeAttribute(draggedNode, "highlighted", true);
  });

  // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
  renderer.getMouseCaptor().on("mousemovebody", (e) => {
    if (!isDragging || !draggedNode) return;

    // Get new position of node
    const pos = renderer.viewportToGraph(e);

    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    // Prevent sigma to move camera:
    e.preventSigmaDefault();
    e.original.preventDefault();
    e.original.stopPropagation();
  });

  // On mouse up, we reset the autoscale and the dragging mode
  renderer.getMouseCaptor().on("mouseup", () => {
    if (draggedNode) {
      graph.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
  });

  // Disable the autoscale at the first down interaction
  renderer.getMouseCaptor().on("mousedown", () => {
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
  });

  //
  // Create node (and edge) by click
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //

  // When clicking on the stage, we add a new node and connect it to the closest node
  renderer.on("clickStage", ({ event }: { event: { x: number; y: number } }) => {
    // Sigma (ie. graph) and screen (viewport) coordinates are not the same.
    // So we need to translate the screen x & y coordinates to the graph one by calling the sigma helper \`viewportToGraph\`
    const coordForGraph = renderer.viewportToGraph({ x: event.x, y: event.y });

    // We create a new node
    const node = {
      ...coordForGraph,
      size: 10,
      color: chroma.random().hex(),
    };

    // Searching the two closest nodes to auto-create an edge to it
    const closestNodes = graph
      .nodes()
      .map((nodeId) => {
        const attrs = graph.getNodeAttributes(nodeId);
        const distance = Math.pow(node.x - attrs.x, 2) + Math.pow(node.y - attrs.y, 2);
        return { nodeId, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    // We register the new node into graphology instance
    const id = uuid();
    graph.addNode(id, node);

    // We create the edges
    closestNodes.forEach((e) => graph.addEdge(id, e.nodeId));
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,A={id:"mouse-manipulations",title:"Examples"},B={name:"Node drag'n'drop, with mouse graph creation",render:()=>y,play:x,args:{},parameters:{storySource:{source:N}}};export{A as default,B as story};
