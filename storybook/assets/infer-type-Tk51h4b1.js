import{r as d}from"./sigma-DZ8Rw7GN.js";var r,t;function c(){if(t)return r;t=1;var n=d();return r=function(e){if(!n(e))throw new Error("graphology-utils/infer-type: expecting a valid graphology instance.");var i=e.type;return i!=="mixed"?i:e.directedSize===0&&e.undirectedSize===0||e.directedSize>0&&e.undirectedSize>0?"mixed":e.directedSize>0?"directed":"undirected"},r}export{c as r};
