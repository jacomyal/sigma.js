import{G as x,S as N,w as f}from"./sigma-BsJT_GRv.js";import{c as u}from"./index-DUfPS_J0.js";import{F as w}from"./worker-DR-cw7A-.js";import"./_commonjsHelpers-C4iS2aBk.js";import"./defaults-BeBqgnWC.js";import"./getters-CXJ0gpj8.js";const a=[];for(let t=0;t<256;++t)a.push((t+256).toString(16).slice(1));function q(t,e=0){return(a[t[e+0]]+a[t[e+1]]+a[t[e+2]]+a[t[e+3]]+"-"+a[t[e+4]]+a[t[e+5]]+"-"+a[t[e+6]]+a[t[e+7]]+"-"+a[t[e+8]]+a[t[e+9]]+"-"+a[t[e+10]]+a[t[e+11]]+a[t[e+12]]+a[t[e+13]]+a[t[e+14]]+a[t[e+15]]).toLowerCase()}let m;const S=new Uint8Array(16);function D(){if(!m){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");m=crypto.getRandomValues.bind(crypto)}return m(S)}const I=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),h={randomUUID:I};function E(t,e,v){var r;if(h.randomUUID&&!t)return h.randomUUID();t=t||{};const n=t.random??((r=t.rng)==null?void 0:r.call(t))??D();if(n.length<16)throw new Error("Random bytes length must be >= 16");return n[6]=n[6]&15|64,n[8]=n[8]&63|128,q(n)}const A=()=>{const t=document.getElementById("sigma-container"),e=new x;e.addNode("n1",{x:0,y:0,size:10,color:u.random().hex()}),e.addNode("n2",{x:-5,y:5,size:10,color:u.random().hex()}),e.addNode("n3",{x:5,y:5,size:10,color:u.random().hex()}),e.addNode("n4",{x:0,y:10,size:10,color:u.random().hex()}),e.addEdge("n1","n2"),e.addEdge("n2","n4"),e.addEdge("n4","n3"),e.addEdge("n3","n1"),new w(e,{isNodeFixed:(i,s)=>s.highlighted}).start();const n=new N(e,t,{minCameraRatio:.5,maxCameraRatio:2});let r=null,c=!1;n.on("downNode",i=>{c=!0,r=i.node,e.setNodeAttribute(r,"highlighted",!0),n.getCustomBBox()||n.setCustomBBox(n.getBBox())}),n.on("moveBody",({event:i})=>{if(!c||!r)return;const s=n.viewportToGraph(i);e.setNodeAttribute(r,"x",s.x),e.setNodeAttribute(r,"y",s.y),i.preventSigmaDefault(),i.original.preventDefault(),i.original.stopPropagation()});const g=()=>{r&&e.removeNodeAttribute(r,"highlighted"),c=!1,r=null};return n.on("upNode",g),n.on("upStage",g),n.on("clickStage",({event:i})=>{const l={...n.viewportToGraph({x:i.x,y:i.y}),size:10,color:u.random().hex()},y=e.nodes().map(o=>{const d=e.getNodeAttributes(o),b=Math.pow(l.x-d.x,2)+Math.pow(l.y-d.y,2);return{nodeId:o,distance:b}}).sort((o,d)=>o.distance-d.distance).slice(0,2),p=E();e.addNode(p,l),y.forEach(o=>e.addEdge(p,o.nodeId))}),()=>{n.kill()}},U=`<style>
  html,
  body {
    font-family: sans-serif;
    background: #f9f9f9 !important;
  }
  main {
    margin: auto;
    max-width: 800px;
  }
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
`,B=`import chroma from "chroma-js";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import { v4 as uuid } from "uuid";

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
  const renderer = new Sigma(graph, container, { minCameraRatio: 0.5, maxCameraRatio: 2 });

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
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
  });

  // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
  renderer.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode) return;

    // Get new position of node
    const pos = renderer.viewportToGraph(event);

    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    // Prevent sigma to move camera:
    event.preventSigmaDefault();
    event.original.preventDefault();
    event.original.stopPropagation();
  });

  // On mouse up, we reset the dragging mode
  const handleUp = () => {
    if (draggedNode) {
      graph.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
  };
  renderer.on("upNode", handleUp);
  renderer.on("upStage", handleUp);

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

  return () => {
    renderer.kill();
  };
};
`,P={id:"mouse-manipulations",title:"Core library/Advanced use cases"},R={name:"Node drag'n'drop, with mouse graph creation",render:()=>U,play:f(A),args:{},parameters:{storySource:{source:B}}};export{P as default,R as story};
