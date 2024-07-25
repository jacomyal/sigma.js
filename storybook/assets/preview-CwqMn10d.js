import{d as E}from"./index-DrFu-skq.js";const{useMemo:f,useEffect:v}=__STORYBOOK_MODULE_PREVIEW_API__,{global:M}=__STORYBOOK_MODULE_GLOBAL__,{logger:h}=__STORYBOOK_MODULE_CLIENT_LOGGER__;var p="backgrounds",{document:l,window:B}=M,x=()=>B.matchMedia("(prefers-reduced-motion: reduce)").matches,O=(r,e=[],a)=>{if(r==="transparent")return"transparent";if(e.find(n=>n.value===r))return r;let d=e.find(n=>n.name===a);if(d)return d.value;if(a){let n=e.map(o=>o.name).join(", ");h.warn(E`
        Backgrounds Addon: could not find the default color "${a}".
        These are the available colors for your story based on your configuration:
        ${n}.
      `)}return"transparent"},k=r=>{(Array.isArray(r)?r:[r]).forEach(S)},S=r=>{var a;let e=l.getElementById(r);e&&((a=e.parentElement)==null||a.removeChild(e))},w=(r,e)=>{let a=l.getElementById(r);if(a)a.innerHTML!==e&&(a.innerHTML=e);else{let d=l.createElement("style");d.setAttribute("id",r),d.innerHTML=e,l.head.appendChild(d)}},A=(r,e,a)=>{var n;let d=l.getElementById(r);if(d)d.innerHTML!==e&&(d.innerHTML=e);else{let o=l.createElement("style");o.setAttribute("id",r),o.innerHTML=e;let i=`addon-backgrounds-grid${a?`-docs-${a}`:""}`,t=l.getElementById(i);t?(n=t.parentElement)==null||n.insertBefore(o,t):l.head.appendChild(o)}},L=(r,e)=>{var c;let{globals:a,parameters:d}=e,n=(c=a[p])==null?void 0:c.value,o=d[p],i=f(()=>o.disable?"transparent":O(n,o.values,o.default),[o,n]),t=f(()=>i&&i!=="transparent",[i]),s=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",u=f(()=>`
      ${s} {
        background: ${i} !important;
        ${x()?"":"transition: background-color 0.3s;"}
      }
    `,[i,s]);return v(()=>{let g=e.viewMode==="docs"?`addon-backgrounds-docs-${e.id}`:"addon-backgrounds-color";if(!t){k(g);return}A(g,u,e.viewMode==="docs"?e.id:null)},[t,u,e]),r()},T=(r,e)=>{var y;let{globals:a,parameters:d}=e,n=d[p].grid,o=((y=a[p])==null?void 0:y.grid)===!0&&n.disable!==!0,{cellAmount:i,cellSize:t,opacity:s}=n,u=e.viewMode==="docs",c=d.layout===void 0||d.layout==="padded"?16:0,g=n.offsetX??(u?20:c),m=n.offsetY??(u?20:c),$=f(()=>{let b=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",_=[`${t*i}px ${t*i}px`,`${t*i}px ${t*i}px`,`${t}px ${t}px`,`${t}px ${t}px`].join(", ");return`
      ${b} {
        background-size: ${_} !important;
        background-position: ${g}px ${m}px, ${g}px ${m}px, ${g}px ${m}px, ${g}px ${m}px !important;
        background-blend-mode: difference !important;
        background-image: linear-gradient(rgba(130, 130, 130, ${s}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${s}) 1px, transparent 1px),
         linear-gradient(rgba(130, 130, 130, ${s/2}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${s/2}) 1px, transparent 1px) !important;
      }
    `},[t]);return v(()=>{let b=e.viewMode==="docs"?`addon-backgrounds-grid-docs-${e.id}`:"addon-backgrounds-grid";if(!o){k(b);return}w(b,$)},[o,$,e]),r()},I=[T,L],R={[p]:{grid:{cellSize:20,opacity:.5,cellAmount:5},values:[{name:"light",value:"#F8F8F8"},{name:"dark",value:"#333333"}]}},G={[p]:null};export{I as decorators,G as globals,R as parameters};
