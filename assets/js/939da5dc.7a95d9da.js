"use strict";(self.webpackChunk_sigma_website=self.webpackChunk_sigma_website||[]).push([[3977],{787:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>o,contentTitle:()=>l,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>c});const a=JSON.parse('{"id":"advanced/layers","title":"Layers","description":"Sigma renders the graph on multiple layers. Some layers are using WebGL, some are using Canvas.","source":"@site/docs/advanced/layers.md","sourceDirName":"advanced","slug":"/advanced/layers","permalink":"/docs/advanced/layers","draft":false,"unlisted":false,"editUrl":"https://github.com/jacomyal/sigma.js/tree/main/packages/website/docs/advanced/layers.md","tags":[],"version":"current","sidebarPosition":6,"frontMatter":{"title":"Layers","sidebar_position":6},"sidebar":"sigmaDocSidebar","previous":{"title":"Node and Edge Sizes","permalink":"/docs/advanced/sizes"},"next":{"title":"Events","permalink":"/docs/advanced/events"}}');var t=n(1085),r=n(1184);const i={title:"Layers",sidebar_position:6},l="Layers",o={},c=[{value:"List of existing layers",id:"list-of-existing-layers",level:2},{value:"Manipulating layers",id:"manipulating-layers",level:2},{value:"Putting layers behind the <code>mouse</code> layer",id:"putting-layers-behind-the-mouse-layer",level:3},{value:"Creating new layers and inserting in the right spot",id:"creating-new-layers-and-inserting-in-the-right-spot",level:3},{value:"Creating new Canvas or WebGL layers",id:"creating-new-canvas-or-webgl-layers",level:3}];function d(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.header,{children:(0,t.jsx)(s.h1,{id:"layers",children:"Layers"})}),"\n",(0,t.jsxs)(s.p,{children:["Sigma renders the graph on ",(0,t.jsx)(s.strong,{children:"multiple layers"}),". Some layers are using ",(0,t.jsx)(s.a,{href:"https://www.sigmajs.org/docs/advanced/renderers#brief-overview-of-webgl",children:"WebGL"}),", some are using ",(0,t.jsx)(s.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas",children:"Canvas"}),"."]}),"\n",(0,t.jsx)(s.h2,{id:"list-of-existing-layers",children:"List of existing layers"}),"\n",(0,t.jsx)("img",{alt:"Sigma's layouts list",src:"/img/layers/sigma-layers.png"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.code,{children:"sigma-edges"})})," (WebGL)"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.code,{children:"sigma-edgeLabels"})})," (Canvas)"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.code,{children:"sigma-nodes"})})," (WebGL)"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.code,{children:"sigma-labels"})})," (Canvas)"]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.code,{children:"sigma-hovers"})})," (Canvas): This layer draws the hovered and highlighted node labels, with the related backgrounds."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.code,{children:"sigma-hoverNodes"})})," (WebGL): This layer renders the hovered and highlighted nodes ",(0,t.jsx)(s.strong,{children:"again"}),", but on top of the ",(0,t.jsx)(s.code,{children:"sigma-hovers"})," Canvas layer."]}),"\n",(0,t.jsxs)(s.li,{children:[(0,t.jsx)(s.strong,{children:(0,t.jsx)(s.code,{children:"sigma-mouse"})}),": This layer is just here to listen to interaction events."]}),"\n"]}),"\n",(0,t.jsx)(s.h2,{id:"manipulating-layers",children:"Manipulating layers"}),"\n",(0,t.jsxs)(s.p,{children:["By default, all these layers are simply put in the sigma container, with ",(0,t.jsx)(s.code,{children:"position: absolute;"})," and ",(0,t.jsx)(s.code,{children:"inset: 0;"}),". There are multiple ways to manipulate these layers! Here are some examples:"]}),"\n",(0,t.jsxs)(s.h3,{id:"putting-layers-behind-the-mouse-layer",children:["Putting layers behind the ",(0,t.jsx)(s.code,{children:"mouse"})," layer"]}),"\n",(0,t.jsxs)(s.p,{children:["It is sometimes useful to add new layers on top of the sigma graph, but without altering the interactions. It is for instance the case in the ",(0,t.jsx)(s.a,{href:"https://www.sigmajs.org/storybook/?path=/story/events--story",children:(0,t.jsx)(s.strong,{children:"Events"})})," story, where we want to display the events log, on top of the graph, but without breaking the graph interactions."]}),"\n",(0,t.jsx)(s.p,{children:"To do this, the simplest method we could find was:"}),"\n",(0,t.jsxs)(s.ul,{children:["\n",(0,t.jsxs)(s.li,{children:["Insert the logs container after the sigma container in the DOM, also with ",(0,t.jsx)(s.code,{children:"position: absolute; inset: 0;"})]}),"\n",(0,t.jsxs)(s.li,{children:["Put the ",(0,t.jsx)(s.code,{children:"sigma-mouse"})," layer back on top, simply using ",(0,t.jsx)(s.code,{children:"z-index: 1;"})]}),"\n"]}),"\n",(0,t.jsxs)(s.p,{children:["You can check this example's sources ",(0,t.jsx)(s.a,{href:"https://github.com/jacomyal/sigma.js/blob/main/packages/storybook/stories/1-core-features/2-events/index.html",children:"here"}),"."]}),"\n",(0,t.jsx)(s.h3,{id:"creating-new-layers-and-inserting-in-the-right-spot",children:"Creating new layers and inserting in the right spot"}),"\n",(0,t.jsxs)(s.p,{children:["For the ",(0,t.jsx)(s.a,{href:"https://www.sigmajs.org/storybook/?path=/story/cluster-label--story",children:(0,t.jsx)(s.strong,{children:"Adding label on clusters"})})," story, we chose to insert the custom HTML layer, directly using the DOM APIs:"]}),"\n",(0,t.jsx)(s.pre,{children:(0,t.jsx)(s.code,{className:"language-JavaScript",children:'myCustomLayer.insertBefore(clustersLayer, sigmaContainer.querySelector(".sigma-hovers"));\n'})}),"\n",(0,t.jsxs)(s.p,{children:["You can check this example's sources ",(0,t.jsx)(s.a,{href:"https://github.com/jacomyal/sigma.js/blob/main/packages/storybook/stories/2-advanced-usecases/cluster-label/index.ts#L73",children:"here"}),"."]}),"\n",(0,t.jsx)(s.h3,{id:"creating-new-canvas-or-webgl-layers",children:"Creating new Canvas or WebGL layers"}),"\n",(0,t.jsxs)(s.p,{children:["It is also possible to create new layers, directly using sigma's APIs. Sigma exposes a ",(0,t.jsx)(s.a,{href:"https://www.sigmajs.org/docs/typedoc/sigma/src/classes/Sigma#createcanvas",children:(0,t.jsx)(s.code,{children:"createCanvas"})})," method, to create a new Canvas HTML element. This method accepts ",(0,t.jsx)(s.code,{children:"beforeLayer"})," and ",(0,t.jsx)(s.code,{children:"afterLayer"})," options, that take a layer class. Then, the methods ",(0,t.jsx)(s.code,{children:"createCanvasContext"})," and ",(0,t.jsx)(s.code,{children:"createWebGLContext"})," allow retrieving the proper context from the Canvas element."]}),"\n",(0,t.jsxs)(s.p,{children:["The main advantage of this method is that the layer will be properly removed when the ",(0,t.jsx)(s.code,{children:"kill"})," method is called."]}),"\n",(0,t.jsxs)(s.p,{children:["A good example of this method is in the ",(0,t.jsx)(s.a,{href:"https://github.com/jacomyal/sigma.js/tree/main/packages/layer-webgl",children:(0,t.jsx)(s.code,{children:"@sigma/layer-webgl"})})," package, that both ",(0,t.jsx)(s.a,{href:"https://github.com/jacomyal/sigma.js/blob/main/packages/layer-webgl/src/bind-webgl-layer.ts#L11-L12",children:"creates the context"})," and ",(0,t.jsx)(s.a,{href:"https://github.com/jacomyal/sigma.js/blob/main/packages/layer-webgl/src/bind-webgl-layer.ts#L43",children:"destroys it"})," when needed."]})]})}function h(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},1184:(e,s,n)=>{n.d(s,{R:()=>i,x:()=>l});var a=n(4041);const t={},r=a.createContext(t);function i(e){const s=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),a.createElement(r.Provider,{value:s},e.children)}}}]);