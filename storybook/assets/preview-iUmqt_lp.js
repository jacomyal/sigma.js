import{d as Y}from"./index-ogSvIofg.js";const{useEffect:_,useMemo:h}=__STORYBOOK_MODULE_PREVIEW_API__,{global:H}=__STORYBOOK_MODULE_GLOBAL__,{logger:K}=__STORYBOOK_MODULE_CLIENT_LOGGER__;var g="backgrounds",C={light:{name:"light",value:"#F8F8F8"},dark:{name:"dark",value:"#333"}},{document:$,window:T}=H,I=()=>{var r;return!!((r=T==null?void 0:T.matchMedia("(prefers-reduced-motion: reduce)"))!=null&&r.matches)},A=r=>{(Array.isArray(r)?r:[r]).forEach(P)},P=r=>{var t;let e=$.getElementById(r);e&&((t=e.parentElement)==null||t.removeChild(e))},z=(r,e)=>{let t=$.getElementById(r);if(t)t.innerHTML!==e&&(t.innerHTML=e);else{let d=$.createElement("style");d.setAttribute("id",r),d.innerHTML=e,$.head.appendChild(d)}},U=(r,e,t)=>{var a;let d=$.getElementById(r);if(d)d.innerHTML!==e&&(d.innerHTML=e);else{let n=$.createElement("style");n.setAttribute("id",r),n.innerHTML=e;let i=`addon-backgrounds-grid${t?`-docs-${t}`:""}`,o=$.getElementById(i);o?(a=o.parentElement)==null||a.insertBefore(n,o):$.head.appendChild(n)}},j={cellSize:100,cellAmount:10,opacity:.8},w="addon-backgrounds",R="addon-backgrounds-grid",X=I()?"":"transition: background-color 0.3s;",N=(r,e)=>{let{globals:t,parameters:d,viewMode:a,id:n}=e,{options:i=C,disable:o,grid:s=j}=d[g]||{},u=t[g]||{},c=u.value,l=c?i[c]:void 0,b=(l==null?void 0:l.value)||"transparent",m=u.grid||!1,y=!!l&&!o,f=a==="docs"?`#anchor--${n} .docs-story`:".sb-show-main",E=a==="docs"?`#anchor--${n} .docs-story`:".sb-show-main",D=d.layout===void 0||d.layout==="padded",L=a==="docs"?20:D?16:0,{cellAmount:k,cellSize:p,opacity:x,offsetX:S=L,offsetY:v=L}=s,B=a==="docs"?`${w}-docs-${n}`:`${w}-color`,G=a==="docs"?n:null;_(()=>{let O=`
    ${f} {
      background: ${b} !important;
      ${X}
      }`;if(!y){A(B);return}U(B,O,G)},[f,B,G,y,b]);let M=a==="docs"?`${R}-docs-${n}`:`${R}`;return _(()=>{if(!m){A(M);return}let O=[`${p*k}px ${p*k}px`,`${p*k}px ${p*k}px`,`${p}px ${p}px`,`${p}px ${p}px`].join(", "),F=`
        ${E} {
          background-size: ${O} !important;
          background-position: ${S}px ${v}px, ${S}px ${v}px, ${S}px ${v}px, ${S}px ${v}px !important;
          background-blend-mode: difference !important;
          background-image: linear-gradient(rgba(130, 130, 130, ${x}) 1px, transparent 1px),
           linear-gradient(90deg, rgba(130, 130, 130, ${x}) 1px, transparent 1px),
           linear-gradient(rgba(130, 130, 130, ${x/2}) 1px, transparent 1px),
           linear-gradient(90deg, rgba(130, 130, 130, ${x/2}) 1px, transparent 1px) !important;
        }
      `;z(M,F)},[k,p,E,M,m,S,v,x]),r()},W=(r,e=[],t)=>{if(r==="transparent")return"transparent";if(e.find(a=>a.value===r)||r)return r;let d=e.find(a=>a.name===t);if(d)return d.value;if(t){let a=e.map(n=>n.name).join(", ");K.warn(Y`
        Backgrounds Addon: could not find the default color "${t}".
        These are the available colors for your story based on your configuration:
        ${a}.
      `)}return"transparent"},q=(r,e)=>{var c;let{globals:t,parameters:d}=e,a=(c=t[g])==null?void 0:c.value,n=d[g],i=h(()=>n.disable?"transparent":W(a,n.values,n.default),[n,a]),o=h(()=>i&&i!=="transparent",[i]),s=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",u=h(()=>`
      ${s} {
        background: ${i} !important;
        ${I()?"":"transition: background-color 0.3s;"}
      }
    `,[i,s]);return _(()=>{let l=e.viewMode==="docs"?`addon-backgrounds-docs-${e.id}`:"addon-backgrounds-color";if(!o){A(l);return}U(l,u,e.viewMode==="docs"?e.id:null)},[o,u,e]),r()},J=(r,e)=>{var y;let{globals:t,parameters:d}=e,a=d[g].grid,n=((y=t[g])==null?void 0:y.grid)===!0&&a.disable!==!0,{cellAmount:i,cellSize:o,opacity:s}=a,u=e.viewMode==="docs",c=d.layout===void 0||d.layout==="padded"?16:0,l=a.offsetX??(u?20:c),b=a.offsetY??(u?20:c),m=h(()=>{let f=e.viewMode==="docs"?`#anchor--${e.id} .docs-story`:".sb-show-main",E=[`${o*i}px ${o*i}px`,`${o*i}px ${o*i}px`,`${o}px ${o}px`,`${o}px ${o}px`].join(", ");return`
      ${f} {
        background-size: ${E} !important;
        background-position: ${l}px ${b}px, ${l}px ${b}px, ${l}px ${b}px, ${l}px ${b}px !important;
        background-blend-mode: difference !important;
        background-image: linear-gradient(rgba(130, 130, 130, ${s}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${s}) 1px, transparent 1px),
         linear-gradient(rgba(130, 130, 130, ${s/2}) 1px, transparent 1px),
         linear-gradient(90deg, rgba(130, 130, 130, ${s/2}) 1px, transparent 1px) !important;
      }
    `},[o]);return _(()=>{let f=e.viewMode==="docs"?`addon-backgrounds-grid-docs-${e.id}`:"addon-backgrounds-grid";if(!n){A(f);return}z(f,m)},[n,m,e]),r()},V=FEATURES!=null&&FEATURES.backgroundsStoryGlobals?[N]:[J,q],ee={[g]:{grid:{cellSize:20,opacity:.5,cellAmount:5},disable:!1,...!(FEATURES!=null&&FEATURES.backgroundsStoryGlobals)&&{values:Object.values(C)}}},Q={[g]:{value:void 0,grid:!1}},re=FEATURES!=null&&FEATURES.backgroundsStoryGlobals?Q:{[g]:null};export{V as decorators,re as initialGlobals,ee as parameters};
