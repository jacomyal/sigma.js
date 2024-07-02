import{d as f}from"./index-DrFu-skq.js";const{global:p}=__STORYBOOK_MODULE_GLOBAL__,{simulatePageLoad:l,simulateDOMContentLoaded:u}=__STORYBOOK_MODULE_PREVIEW_API__;var{Node:O}=p,c=(e,d)=>{let{id:s,component:t}=d;if(typeof t=="string"){let o=t;return Object.keys(e).forEach(r=>{o=o.replace(`{{${r}}}`,e[r])}),o}if(t instanceof HTMLElement){let o=t.cloneNode(!0);return Object.keys(e).forEach(r=>{o.setAttribute(r,typeof e[r]=="string"?e[r]:JSON.stringify(e[r]))}),o}if(typeof t=="function")return t(e,d);throw console.warn(f`
    Storybook's HTML renderer only supports rendering DOM elements and strings.
    Received: ${t}
  `),new Error(`Unable to render story ${s}`)};function L({storyFn:e,kind:d,name:s,showMain:t,showError:o,forceRemount:r},n){let i=e();if(t(),typeof i=="string")n.innerHTML=i,l(n);else if(i instanceof O){if(n.firstChild===i&&r===!1)return;n.innerHTML="",n.appendChild(i),u()}else o({title:`Expecting an HTML snippet or DOM node from the story: "${s}" of "${d}".`,description:f`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `})}var h={renderer:"html"};export{h as parameters,c as render,L as renderToCanvas};
