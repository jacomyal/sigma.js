"use strict";(self.webpackChunk_sigma_website=self.webpackChunk_sigma_website||[]).push([[8658],{8768:(e,i,s)=>{s.r(i),s.d(i,{assets:()=>r,contentTitle:()=>d,default:()=>h,frontMatter:()=>a,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"advanced/sizes","title":"Node and Edge Sizes","description":"Default Behavior","source":"@site/docs/advanced/sizes.md","sourceDirName":"advanced","slug":"/advanced/sizes","permalink":"/docs/advanced/sizes","draft":false,"unlisted":false,"editUrl":"https://github.com/jacomyal/sigma.js/tree/main/packages/website/docs/advanced/sizes.md","tags":[],"version":"current","sidebarPosition":5,"frontMatter":{"title":"Node and Edge Sizes","sidebar_position":5},"sidebar":"sigmaDocSidebar","previous":{"title":"Coordinate systems","permalink":"/docs/advanced/coordinate-systems"},"next":{"title":"Layers","permalink":"/docs/advanced/layers"}}');var n=s(1085),o=s(1184);const a={title:"Node and Edge Sizes",sidebar_position:5},d="Node and Edge Sizes",r={},l=[{value:"Default Behavior",id:"default-behavior",level:2},{value:"Design Motivation",id:"design-motivation",level:3},{value:"Implementation Details",id:"implementation-details",level:3},{value:"Limitations",id:"limitations",level:3},{value:"Customization Options",id:"customization-options",level:2},{value:"<code>zoomToSizeRatioFunction</code> Setting",id:"zoomtosizeratiofunction-setting",level:3},{value:"<code>itemSizesReference</code> Setting",id:"itemsizesreference-setting",level:3},{value:"<code>autoRescale</code> Setting",id:"autorescale-setting",level:3},{value:"Example",id:"example",level:3}];function c(e){const i={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i.header,{children:(0,n.jsx)(i.h1,{id:"node-and-edge-sizes",children:"Node and Edge Sizes"})}),"\n",(0,n.jsx)(i.h2,{id:"default-behavior",children:"Default Behavior"}),"\n",(0,n.jsx)(i.h3,{id:"design-motivation",children:"Design Motivation"}),"\n",(0,n.jsx)(i.p,{children:"The default behavior of Sigma is designed to ensure:"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["The ",(0,n.jsx)(i.strong,{children:"entire graph is visible"})," and uses the available viewport space efficiently."]}),"\n",(0,n.jsxs)(i.li,{children:["Like how road thickness on map applications isn't true-to-scale (for better readability), nodes and edges ",(0,n.jsx)(i.strong,{children:"adjust to the zoom level"}),", preventing them from becoming too large or too small."]}),"\n",(0,n.jsx)(i.li,{children:"It is easy for developers to adjust the node and edge sizes to the viewport."}),"\n"]}),"\n",(0,n.jsx)(i.p,{children:"This approach allows developers to use a variety of graph layouts, ensuring the graph is visible and readable without requiring additional customization."}),"\n",(0,n.jsx)(i.h3,{id:"implementation-details",children:"Implementation Details"}),"\n",(0,n.jsx)(i.p,{children:"Sigma applies the following rules for rendering nodes and edges relative to data sizes:"}),"\n",(0,n.jsxs)(i.ol,{children:["\n",(0,n.jsxs)(i.li,{children:["Node and edge sizes ",(0,n.jsx)(i.strong,{children:"scale with the square root"})," of the zoom ratio."]}),"\n",(0,n.jsxs)(i.li,{children:["Sizes from data are treated as ",(0,n.jsx)(i.strong,{children:"pixel values"}),", for the default zoom level."]}),"\n",(0,n.jsxs)(i.li,{children:["Node and edge positions are adjusted so that the ",(0,n.jsx)(i.strong,{children:"graph is rescaled and centered"}),", fitting optimally in the viewport at the default camera zoom."]}),"\n"]}),"\n",(0,n.jsx)(i.h3,{id:"limitations",children:"Limitations"}),"\n",(0,n.jsx)(i.p,{children:"These opinionated choices bring some limitations, though:"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["Graph appearance can be ",(0,n.jsx)(i.strong,{children:"inconsistent across different viewports"}),"."]}),"\n",(0,n.jsxs)(i.li,{children:["Node and edge sizes can be ",(0,n.jsx)(i.strong,{children:"difficult to predict"}),", especially in relation to positions, which can lead to overlap on smaller viewports."]}),"\n"]}),"\n",(0,n.jsx)(i.h2,{id:"customization-options",children:"Customization Options"}),"\n",(0,n.jsx)(i.p,{children:"To allow adapting these behaviours, sigma offers various settings to change the way it handles positions and sizes."}),"\n",(0,n.jsxs)(i.h3,{id:"zoomtosizeratiofunction-setting",children:[(0,n.jsx)(i.code,{children:"zoomToSizeRatioFunction"})," Setting"]}),"\n",(0,n.jsxs)(i.p,{children:["To modify rule #1, adjust the ",(0,n.jsx)(i.code,{children:"zoomToSizeRatioFunction"})," setting. This setting takes a transformation function ",(0,n.jsx)(i.code,{children:"(ratio: number) => number"}),". By default, Sigma uses ",(0,n.jsx)(i.code,{children:"Math.sqrt"}),", which keeps nodes and edges reasonably sized when zooming in or out."]}),"\n",(0,n.jsxs)(i.p,{children:["For instance, using ",(0,n.jsx)(i.code,{children:"(ratio) => ratio"})," will make node and edge sizes scale directly with the zoom, similar to most graph visualization tools."]}),"\n",(0,n.jsxs)(i.h3,{id:"itemsizesreference-setting",children:[(0,n.jsx)(i.code,{children:"itemSizesReference"})," Setting"]}),"\n",(0,n.jsxs)(i.p,{children:["To change rule #2, set ",(0,n.jsx)(i.code,{children:"itemSizesReference"})," to ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.code,{children:'"positions"'})}),". This makes sigma interpret node and edge sizes in the same coordinate system as the node positions at the default zoom level."]}),"\n",(0,n.jsxs)(i.p,{children:["If you want sizes to scale with the node positions at ",(0,n.jsx)(i.strong,{children:"all zoom levels"}),", combine this setting with ",(0,n.jsx)(i.code,{children:"zoomToSizeRatioFunction: (ratio) => ratio"}),"."]}),"\n",(0,n.jsxs)(i.h3,{id:"autorescale-setting",children:[(0,n.jsx)(i.code,{children:"autoRescale"})," Setting"]}),"\n",(0,n.jsxs)(i.p,{children:["To disable rule #3, use the ",(0,n.jsx)(i.code,{children:"autoRescale"})," setting. Setting ",(0,n.jsx)(i.code,{children:"autoRescale"})," as ",(0,n.jsx)(i.code,{children:"false"})," prevents Sigma from automatically resizing the graph. Then, node positions are interpreted in pixels, for the default zoom level. The graph remains centered in the viewport, though."]}),"\n",(0,n.jsxs)(i.p,{children:["Also, note that when disabling ",(0,n.jsx)(i.code,{children:"autoRescale"}),", the ",(0,n.jsx)(i.code,{children:"itemSizesReference"})," setting becomes irrelevant, since node and edge sizes become"]}),"\n",(0,n.jsx)(i.h3,{id:"example",children:"Example"}),"\n",(0,n.jsxs)(i.p,{children:["You can play with these three options, in the ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"https://www.sigmajs.org/storybook/?path=/story/fit-sizes-to-positions--story",children:'"Customize how sigma handles sizes and positions"'})})," story in the ",(0,n.jsx)(i.a,{href:"https://www.sigmajs.org/storybook",children:"StoryBook"}),"."]})]})}function h(e={}){const{wrapper:i}={...(0,o.R)(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},1184:(e,i,s)=>{s.d(i,{R:()=>a,x:()=>d});var t=s(4041);const n={},o=t.createContext(n);function a(e){const i=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function d(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),t.createElement(o.Provider,{value:i},e.children)}}}]);