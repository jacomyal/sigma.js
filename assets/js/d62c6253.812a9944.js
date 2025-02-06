"use strict";(self.webpackChunk_sigma_website=self.webpackChunk_sigma_website||[]).push([[672],{2657:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>t,contentTitle:()=>d,default:()=>h,frontMatter:()=>o,metadata:()=>n,toc:()=>c});const n=JSON.parse('{"id":"advanced/renderers","title":"Renderers","description":"Introduction","source":"@site/docs/advanced/renderers.md","sourceDirName":"advanced","slug":"/advanced/renderers","permalink":"/docs/advanced/renderers","draft":false,"unlisted":false,"editUrl":"https://github.com/jacomyal/sigma.js/tree/main/packages/website/docs/advanced/renderers.md","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"title":"Renderers","sidebar_position":3},"sidebar":"sigmaDocSidebar","previous":{"title":"Customizing appearance","permalink":"/docs/advanced/customization"},"next":{"title":"Coordinate systems","permalink":"/docs/advanced/coordinate-systems"}}');var i=s(1085),a=s(1184);const o={title:"Renderers",sidebar_position:3},d="Renderers in Sigma.js",t={},c=[{value:"Introduction",id:"introduction",level:2},{value:"Brief overview of WebGL",id:"brief-overview-of-webgl",level:3},{value:"NodeProgram and EdgeProgram",id:"nodeprogram-and-edgeprogram",level:2},{value:"Picking",id:"picking",level:2},{value:"Core programs",id:"core-programs",level:2},{value:"For edges",id:"for-edges",level:3},{value:"For nodes",id:"for-nodes",level:3},{value:"Additional programs",id:"additional-programs",level:2},{value:"Additional layers",id:"additional-layers",level:2}];function l(e){const r={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(r.header,{children:(0,i.jsx)(r.h1,{id:"renderers-in-sigmajs",children:"Renderers in Sigma.js"})}),"\n",(0,i.jsx)(r.h2,{id:"introduction",children:"Introduction"}),"\n",(0,i.jsx)(r.p,{children:"Sigma.js utilizes WebGL to render nodes and edges. WebGL is a JavaScript API designed for rendering 2D and 3D graphics in web browsers without requiring plugins. While WebGL offers detailed control over graphics rendering, its direct use can be complex because of its low-level specifications."}),"\n",(0,i.jsx)(r.h3,{id:"brief-overview-of-webgl",children:"Brief overview of WebGL"}),"\n",(0,i.jsx)(r.p,{children:"At its core, WebGL operates using two main components: vertex shaders and fragment shaders."}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:"Vertex Shaders"}),": These are responsible for processing each vertex and determining its position on the screen. They take in attributes of the vertices and output a position."]}),"\n"]}),"\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:"Fragment Shaders"}),": Once the position of vertices is known, fragment shaders determine the color of each pixel in the area bounded by those vertices. They take the output from the vertex shader and produce the final color."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(r.p,{children:["Given the austere nature of WebGL, sigma.js introduces the ",(0,i.jsx)(r.code,{children:"NodeProgram"})," and ",(0,i.jsx)(r.code,{children:"EdgeProgram"})," classes. These classes are designed to manage the data bindings and lifecycle, simplifying the process for developers."]}),"\n",(0,i.jsx)(r.h2,{id:"nodeprogram-and-edgeprogram",children:"NodeProgram and EdgeProgram"}),"\n",(0,i.jsxs)(r.p,{children:["When you're looking to create a custom ",(0,i.jsx)(r.code,{children:"NodeProgram"}),", there are specific components you need to provide:"]}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:"Vertex and Fragment Shaders"}),": These are essential for processing the graphical data. You'll need to provide both to define how your nodes or edges will be rendered."]}),"\n"]}),"\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:"Program definition"}),": The program definition describes how much vertices make each item (node or edge), which attributes (relative to each vertice) and uniforms (constant for all vertices and items) should be given to the shaders."]}),"\n"]}),"\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:"The program class"}),": A class that puts everything together, and adds:"]}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:["A ",(0,i.jsx)(r.code,{children:"getDefinition"})," method that returns the program definition."]}),"\n",(0,i.jsxs)(r.li,{children:["A ",(0,i.jsx)(r.code,{children:"processVisibleItem(offset: number, data: NodeDisplayData)"})," method that populates ",(0,i.jsx)(r.code,{children:"this.array"})," with the appropriate values."]}),"\n",(0,i.jsxs)(r.li,{children:["A ",(0,i.jsx)(r.code,{children:"draw(params: RenderParams)"})," method that manages setting the correct uniform values and the final call to ",(0,i.jsx)(r.code,{children:"gl.drawArrays"}),"."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(r.p,{children:"Additionally, sigma.js offers helpers to compose programs, making it easier to combine different functionalities."}),"\n",(0,i.jsx)(r.h2,{id:"picking",children:"Picking"}),"\n",(0,i.jsxs)(r.p,{children:["To detect collision between a given point (the mouse position, or where a touch event occurred for instance) and nodes and edges, we use a technic called ",(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.a,{href:"https://webglfundamentals.org/webgl/lessons/webgl-picking.html",children:"picking"})}),"."]}),"\n",(0,i.jsx)(r.p,{children:'Basically, we draw two images: One that the users see, with proper nodes and edges colors, antialiasing etc... And another one, where each item is drawn with a unique color. To know which item is at a given position, we look at the color of the corresponding pixel in the "picking image", and if it has a color, we get which item has this unique color.'}),"\n",(0,i.jsxs)(r.p,{children:['Each program must provide code to render on both the normal image and the picking image. For this, we use a "preprocessor" called ',(0,i.jsx)(r.code,{children:"PICKING_MODE"}),". When the program is used to generate the normal image, ",(0,i.jsx)(r.code,{children:"PICKING_MODE"})," is ",(0,i.jsx)(r.code,{children:"false"}),", while it's ",(0,i.jsx)(r.code,{children:"true"})," for picking. Please read the existing programs to have a better idea on how to use that."]}),"\n",(0,i.jsx)(r.h2,{id:"core-programs",children:"Core programs"}),"\n",(0,i.jsxs)(r.p,{children:["Sigma.js comes with a set of predefined programs, all exported from ",(0,i.jsx)(r.code,{children:'"sigma/rendering"'}),":"]}),"\n",(0,i.jsx)(r.h3,{id:"for-edges",children:"For edges"}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"EdgeLineProgram"})}),": This is the most efficient method, rendering edges using the ",(0,i.jsx)(r.code,{children:"gl.LINES"})," method. However, it always draws edges as 1px thick lines, regardless of zoom levels."]}),"\n"]}),"\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"EdgeRectangleProgram"})}),": This is the default edge renderer. It portrays edges as thick rectangles connecting node pairs, with each rectangle being represented by two triangles."]}),"\n"]}),"\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"EdgeArrowProgram"})}),": This is a composite renderer that uses ",(0,i.jsx)(r.code,{children:"EdgeClampedProgram"})," (for drawing the arrow body) and ",(0,i.jsx)(r.code,{children:"EdgeArrowHeadProgram"})," (for drawing the arrow head)."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(r.blockquote,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.em,{children:"NOTE:"})})," The three programs ",(0,i.jsx)(r.code,{children:"EdgeArrowProgram"}),", ",(0,i.jsx)(r.code,{children:"EdgeClampedProgram"})," and ",(0,i.jsx)(r.code,{children:"EdgeArrowHeadProgram"})," each also exist as a factory, to allow generating a program with custom arrow head width and length (relatively to the edge thicknesses). The factory are called ",(0,i.jsx)(r.code,{children:"createEdgeArrowProgram"}),", ",(0,i.jsx)(r.code,{children:"createEdgeClampedProgram"})," and ",(0,i.jsx)(r.code,{children:"createEdgeArrowHeadProgram"}),"."]}),"\n"]}),"\n",(0,i.jsx)(r.h3,{id:"for-nodes",children:"For nodes"}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"NodePointProgram"})}),": This method displays nodes as squares using the ",(0,i.jsx)(r.code,{children:"gl.POINTS"}),' method. A circle is then "carved" into this square in the fragment shader. It\'s highly efficient in terms of both RAM and execution speed. However, due to the limitations of the ',(0,i.jsx)(r.code,{children:"gl.POINTS"})," method, nodes can't be drawn with a radius exceeding 100px."]}),"\n"]}),"\n",(0,i.jsxs)(r.li,{children:["\n",(0,i.jsxs)(r.p,{children:[(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"NodeCircleProgram"})}),": This method displays nodes as squares, represented by two triangles (similar to ",(0,i.jsx)(r.code,{children:"EdgeRectangleProgram"}),'). A circle is then "carved" into this square in the fragment shader.']}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(r.p,{children:"For a deeper understanding and practical examples, developers are encouraged to explore the existing sigma.js sources and examples. This hands-on approach will provide a clearer picture of how to effectively use and customize renderers in sigma.js."}),"\n",(0,i.jsx)(r.h2,{id:"additional-programs",children:"Additional programs"}),"\n",(0,i.jsx)(r.p,{children:"Some more programs are also exposed, but as they carry more complexity, they are published as additional packages."}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:"https://www.npmjs.com/package/@sigma/node-image",children:(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"@sigma/node-image"})})}),": This package exposes a factory to create a program that operates similarly to ",(0,i.jsx)(r.code,{children:"NodeCircleProgram"}),", but filling the circles with images using a texture atlas."]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:"https://www.npmjs.com/package/@sigma/node-border",children:(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"@sigma/node-border"})})}),": This package exposes a factory to create a program that operates similarly to ",(0,i.jsx)(r.code,{children:"NodeCircleProgram"}),", but drawing concentric discs."]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:"https://www.npmjs.com/package/@sigma/node-piechart",children:(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"@sigma/node-piechart"})})}),": This package exposes a factory to create a program that operates similarly to ",(0,i.jsx)(r.code,{children:"NodeCircleProgram"}),", but drawing nodes as pie-charts."]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:"https://www.npmjs.com/package/@sigma/node-square",children:(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"@sigma/node-square"})})}),": This package exposes a simple program that renders nodes as squares."]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:"https://www.npmjs.com/package/@sigma/edge-curve",children:(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"@sigma/edge-curve"})})}),": This package exposes an edge renderer that draw edges as curves."]}),"\n"]}),"\n",(0,i.jsx)(r.h2,{id:"additional-layers",children:"Additional layers"}),"\n",(0,i.jsx)(r.p,{children:"There are also some other packages, that allow rendering additional layers as backgrounds, to display more contextual information."}),"\n",(0,i.jsxs)(r.ul,{children:["\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:"https://www.npmjs.com/package/@sigma/layer-leaflet",children:(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"@sigma/layer-leaflet"})})}),": This package exposes a function to bind a ",(0,i.jsx)(r.a,{href:"https://leafletjs.com/",children:"Leaflet"})," map layer to an existing sigma instance."]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:"https://www.npmjs.com/package/@sigma/layer-maplibre",children:(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"@sigma/layer-maplibre"})})}),": Similarly, this package exposes a function to bind a ",(0,i.jsx)(r.a,{href:"https://maplibre.org/",children:"MapLibre"})," map layer to an existing sigma instance."]}),"\n",(0,i.jsxs)(r.li,{children:[(0,i.jsx)(r.a,{href:"https://www.npmjs.com/package/@sigma/layer-webgl",children:(0,i.jsx)(r.strong,{children:(0,i.jsx)(r.code,{children:"@sigma/layer-webgl"})})}),": This package exposes helpers to create WebGL custom layers and bind them to existing sigma instances. It also exposes some base layers, such as ",(0,i.jsx)(r.a,{href:"https://www.sigmajs.org/storybook/?path=/story/sigma-layer-webgl--metaballs",children:"metaballs"})," or ",(0,i.jsx)(r.a,{href:"https://www.sigmajs.org/storybook/?path=/story/sigma-layer-webgl--contour-line",children:"contour lines"}),"."]}),"\n"]})]})}function h(e={}){const{wrapper:r}={...(0,a.R)(),...e.components};return r?(0,i.jsx)(r,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},1184:(e,r,s)=>{s.d(r,{R:()=>o,x:()=>d});var n=s(4041);const i={},a=n.createContext(i);function o(e){const r=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function d(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),n.createElement(a.Provider,{value:r},e.children)}}}]);