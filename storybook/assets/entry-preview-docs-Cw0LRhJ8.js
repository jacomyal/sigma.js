import{c as l,g as i,y}from"./index-BCI4JQNS.js";const{useEffect:n,addons:f}=__STORYBOOK_MODULE_PREVIEW_API__;function _(e){var s;let r=(s=e==null?void 0:e.parameters.docs)==null?void 0:s.source,a=e==null?void 0:e.parameters.__isArgsStory;return(r==null?void 0:r.type)===i.DYNAMIC?!1:!a||(r==null?void 0:r.code)||(r==null?void 0:r.type)===i.CODE}var D=(e,r)=>{var p,u;let a=e(),s=(u=(p=r==null?void 0:r.parameters.docs)==null?void 0:p.source)!=null&&u.excludeDecorators?r.originalStoryFn(r.args,r):a,d;return _(r)||(typeof s=="string"?d=s:s instanceof Element&&(d=s.outerHTML)),n(()=>{let{id:g,unmappedArgs:o}=r;d&&f.getChannel().emit(y,{id:g,args:o,source:d})}),a},A=[D],S={docs:{story:{inline:!0},source:{type:i.DYNAMIC,language:"html",code:void 0,excludeDecorators:void 0}}},m=[l];export{m as argTypesEnhancers,A as decorators,S as parameters};
