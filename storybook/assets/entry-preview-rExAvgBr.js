import{d as s}from"./index-DrFu-skq.js";var f=Object.defineProperty,_=(e,n)=>{for(var i in n)f(e,i,{get:n[i],enumerable:!0})};const{simulatePageLoad:u,simulateDOMContentLoaded:l}=__STORYBOOK_MODULE_PREVIEW_API__,{global:a}=__STORYBOOK_MODULE_GLOBAL__;var O={};_(O,{parameters:()=>h,render:()=>y,renderToCanvas:()=>L});var{Node:c}=a,y=(e,n)=>{let{id:i,component:r}=n;if(typeof r=="string"){let o=r;return Object.keys(e).forEach(t=>{o=o.replace(`{{${t}}}`,e[t])}),o}if(r instanceof HTMLElement){let o=r.cloneNode(!0);return Object.keys(e).forEach(t=>{o.setAttribute(t,typeof e[t]=="string"?e[t]:JSON.stringify(e[t]))}),o}if(typeof r=="function")return r(e,n);throw console.warn(s`
    Storybook's HTML renderer only supports rendering DOM elements and strings.
    Received: ${r}
  `),new Error(`Unable to render story ${i}`)};function L({storyFn:e,kind:n,name:i,showMain:r,showError:o,forceRemount:t},p){let d=e();if(r(),typeof d=="string")p.innerHTML=d,u(p);else if(d instanceof c){if(p.firstChild===d&&t===!1)return;p.innerHTML="",p.appendChild(d),l()}else o({title:`Expecting an HTML snippet or DOM node from the story: "${i}" of "${n}".`,description:s`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `})}var h={renderer:"html"};export{h as parameters,y as render,L as renderToCanvas};
