import{r as Re,G as xe,S as Oe,w as Ae}from"./sigma-CUkpdr6a.js";import{r as Te}from"./add-edge-DJG1E9TZ.js";import{f as Ee}from"./index-DE-rwKI7.js";import{g as Se}from"./_commonjsHelpers-BosuxZz1.js";import{r as De}from"./circular-BMfGPNjs.js";import"./getters-sgVfsx1C.js";var ee={},me={},we;function ze(){return we||(we=1,me.copyNode=function(T,P,y){return y=Object.assign({},y),T.addNode(P,y)}),me}var _e,be;function Ie(){if(be)return _e;be=1;function T(P){this.graph=P,this.stack=new Array(P.order),this.seen=new Set,this.size=0}return T.prototype.hasAlreadySeenEverything=function(){return this.seen.size===this.graph.order},T.prototype.countUnseenNodes=function(){return this.graph.order-this.seen.size},T.prototype.forEachNodeYetUnseen=function(P){var y=this.seen,_=this.graph;_.someNode(function(G,J){if(y.size===_.order)return!0;if(y.has(G))return!1;var re=P(G,J);return!!re})},T.prototype.has=function(P){return this.seen.has(P)},T.prototype.push=function(P){var y=this.seen.size;return this.seen.add(P),y===this.seen.size?!1:(this.stack[this.size++]=P,!0)},T.prototype.pushWith=function(P,y){var _=this.seen.size;return this.seen.add(P),_===this.seen.size?!1:(this.stack[this.size++]=y,!0)},T.prototype.pop=function(){if(this.size!==0)return this.stack[--this.size]},_e=T,_e}var ke;function Le(){if(ke)return ee;ke=1;var T=Re(),P=ze().copyNode,y=Te().copyEdge,_=Ie();function G(s,g){if(!T(s))throw new Error("graphology-components: the given graph is not a valid graphology instance.");if(s.order){var l=new _(s),d=l.push.bind(l);l.forEachNodeYetUnseen(function(x){var B=[];l.push(x);for(var S;l.size!==0;)S=l.pop(),B.push(S),s.forEachNeighbor(S,d);g(B)})}}function J(s,g){if(!T(s))throw new Error("graphology-components: the given graph is not a valid graphology instance.");if(s.order){var l=new _(s),d=l.push.bind(l);l.forEachNodeYetUnseen(function(x){var B=0;l.push(x);for(var S;l.size!==0;)S=l.pop(),B++,s.forEachNeighbor(S,d);g(B)})}}function re(s,g,l){if(!T(s))throw new Error("graphology-components: the given graph is not a valid graphology instance.");if(!s.order)return;var d=new _(s),x;function B(S,Z,Q,q,v,e,t){x===q&&(q=Q),g(S,Z,Q,q,v,e,t)&&d.push(q)}d.forEachNodeYetUnseen(function(S){var Z=0;for(d.push(S);d.size!==0;)x=d.pop(),Z++,s.forEachEdge(x,B);l(Z)})}function ie(s){var g=0;return J(s,function(){g++}),g}function le(s){var g=[];return G(s,function(l){g.push(l)}),g}function u(s){if(!T(s))throw new Error("graphology-components: the given graph is not a valid graphology instance.");if(!s.order)return[];var g=new _(s),l=g.push.bind(g),d=[],x;return g.forEachNodeYetUnseen(function(B){x=[],g.push(B);for(var S;g.size!==0;)S=g.pop(),x.push(S),s.forEachNeighbor(S,l);return x.length>d.length&&(d=x),d.length>g.countUnseenNodes()}),d}function V(s){var g=u(s),l=s.nullCopy();return g.forEach(function(d){P(l,d,s.getNodeAttributes(d))}),s.forEachEdge(function(d,x,B,S,Z,Q,q){l.hasNode(B)&&y(l,q,d,B,S,x)}),l}function oe(s){var g=new Set(u(s));s.forEachNode(function(l){g.has(l)||s.dropNode(l)})}function U(s){if(!T(s))throw new Error("graphology-components: the given graph is not a valid graphology instance.");if(!s.order)return[];if(s.type==="undirected")throw new Error("graphology-components: the given graph is undirected");var g=s.nodes(),l=[],d,x;if(!s.size){for(d=0,x=g.length;d<x;d++)l.push([g[d]]);return l}var B=1,S=[],Z=[],Q=new Map,q=new Set,v,e,t,n=function(r){var i,f=s.outboundNeighbors(r),D;Q.set(r,B++),S.push(r),Z.push(r);for(var W=0,R=f.length;W<R;W++)if(i=f[W],Q.has(i)){if(D=Q.get(i),!q.has(i))for(;Q.get(S[S.length-1])>D;)S.pop()}else n(i);if(Q.get(S[S.length-1])===Q.get(r)){v=[];do e=Z.pop(),v.push(e),q.add(e);while(e!==r);l.push(v),S.pop()}};for(d=0,x=g.length;d<x;d++)t=g[d],q.has(t)||n(t);return l}return ee.forEachConnectedComponent=G,ee.forEachConnectedComponentOrder=J,ee.forEachConnectedComponentOrderWithEdgeFilter=re,ee.countConnectedComponents=ie,ee.connectedComponents=le,ee.largestConnectedComponent=u,ee.largestConnectedComponentSubgraph=V,ee.cropToLargestConnectedComponent=oe,ee.stronglyConnectedComponents=U,ee}var Ne=Le(),Fe=De();const je=Se(Fe);var ge={exports:{}};/* @license
Papa Parse
v5.5.1
https://github.com/mholt/PapaParse
License: MIT
*/var Me=ge.exports,Ce;function qe(){return Ce||(Ce=1,function(T,P){((y,_)=>{T.exports=_()})(Me,function y(){var _=typeof self<"u"?self:typeof window<"u"?window:_!==void 0?_:{},G,J=!_.document&&!!_.postMessage,re=_.IS_PAPA_WORKER||!1,ie={},le=0,u={};function V(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},(function(t){var n=Q(t);n.chunkSize=parseInt(n.chunkSize),t.step||t.chunk||(n.chunkSize=null),this._handle=new l(n),(this._handle.streamer=this)._config=n}).call(this,e),this.parseChunk=function(t,n){var r=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<r){let f=this._config.newline;f||(i=this._config.quoteChar||'"',f=this._handle.guessLineEndings(t,i)),t=[...t.split(f).slice(r)].join(f)}this.isFirstChunk&&v(this._config.beforeFirstChunk)&&(i=this._config.beforeFirstChunk(t))!==void 0&&(t=i),this.isFirstChunk=!1,this._halted=!1;var r=this._partialLine+t,i=(this._partialLine="",this._handle.parse(r,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(t=i.meta.cursor,r=(this._finished||(this._partialLine=r.substring(t-this._baseIndex),this._baseIndex=t),i&&i.data&&(this._rowCount+=i.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),re)_.postMessage({results:i,workerId:u.WORKER_ID,finished:r});else if(v(this._config.chunk)&&!n){if(this._config.chunk(i,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=i=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(i.data),this._completeResults.errors=this._completeResults.errors.concat(i.errors),this._completeResults.meta=i.meta),this._completed||!r||!v(this._config.complete)||i&&i.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),r||i&&i.meta.paused||this._nextChunk(),i}this._halted=!0},this._sendError=function(t){v(this._config.error)?this._config.error(t):re&&this._config.error&&_.postMessage({workerId:u.WORKER_ID,error:t,finished:!1})}}function oe(e){var t;(e=e||{}).chunkSize||(e.chunkSize=u.RemoteChunkSize),V.call(this,e),this._nextChunk=J?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(n){this._input=n,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(t=new XMLHttpRequest,this._config.withCredentials&&(t.withCredentials=this._config.withCredentials),J||(t.onload=q(this._chunkLoaded,this),t.onerror=q(this._chunkError,this)),t.open(this._config.downloadRequestBody?"POST":"GET",this._input,!J),this._config.downloadRequestHeaders){var n,r=this._config.downloadRequestHeaders;for(n in r)t.setRequestHeader(n,r[n])}var i;this._config.chunkSize&&(i=this._start+this._config.chunkSize-1,t.setRequestHeader("Range","bytes="+this._start+"-"+i));try{t.send(this._config.downloadRequestBody)}catch(f){this._chunkError(f.message)}J&&t.status===0&&this._chunkError()}},this._chunkLoaded=function(){t.readyState===4&&(t.status<200||400<=t.status?this._chunkError():(this._start+=this._config.chunkSize||t.responseText.length,this._finished=!this._config.chunkSize||this._start>=(n=>(n=n.getResponseHeader("Content-Range"))!==null?parseInt(n.substring(n.lastIndexOf("/")+1)):-1)(t),this.parseChunk(t.responseText)))},this._chunkError=function(n){n=t.statusText||n,this._sendError(new Error(n))}}function U(e){(e=e||{}).chunkSize||(e.chunkSize=u.LocalChunkSize),V.call(this,e);var t,n,r=typeof FileReader<"u";this.stream=function(i){this._input=i,n=i.slice||i.webkitSlice||i.mozSlice,r?((t=new FileReader).onload=q(this._chunkLoaded,this),t.onerror=q(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var i=this._input,f=(this._config.chunkSize&&(f=Math.min(this._start+this._config.chunkSize,this._input.size),i=n.call(i,this._start,f)),t.readAsText(i,this._config.encoding));r||this._chunkLoaded({target:{result:f}})},this._chunkLoaded=function(i){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(i.target.result)},this._chunkError=function(){this._sendError(t.error)}}function s(e){var t;V.call(this,e=e||{}),this.stream=function(n){return t=n,this._nextChunk()},this._nextChunk=function(){var n,r;if(!this._finished)return n=this._config.chunkSize,t=n?(r=t.substring(0,n),t.substring(n)):(r=t,""),this._finished=!t,this.parseChunk(r)}}function g(e){V.call(this,e=e||{});var t=[],n=!0,r=!1;this.pause=function(){V.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){V.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(i){this._input=i,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){r&&t.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):n=!0},this._streamData=q(function(i){try{t.push(typeof i=="string"?i:i.toString(this._config.encoding)),n&&(n=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(f){this._streamError(f)}},this),this._streamError=q(function(i){this._streamCleanUp(),this._sendError(i)},this),this._streamEnd=q(function(){this._streamCleanUp(),r=!0,this._streamData("")},this),this._streamCleanUp=q(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function l(e){var t,n,r,i,f=Math.pow(2,53),D=-f,W=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,R=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,C=this,a=0,Y=0,h=!1,ae=!1,p=[],o={data:[],errors:[],meta:{}};function M(c){return e.skipEmptyLines==="greedy"?c.join("").trim()==="":c.length===1&&c[0].length===0}function L(){if(o&&r&&($("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+u.DefaultDelimiter+"'"),r=!1),e.skipEmptyLines&&(o.data=o.data.filter(function(w){return!M(w)})),H()){let w=function(A,N){v(e.transformHeader)&&(A=e.transformHeader(A,N)),p.push(A)};if(o)if(Array.isArray(o.data[0])){for(var c=0;H()&&c<o.data.length;c++)o.data[c].forEach(w);o.data.splice(0,1)}else o.data.forEach(w)}function O(w,A){for(var N=e.header?{}:[],m=0;m<w.length;m++){var k=m,z=w[m],z=((b,I)=>(F=>(e.dynamicTypingFunction&&e.dynamicTyping[F]===void 0&&(e.dynamicTyping[F]=e.dynamicTypingFunction(F)),(e.dynamicTyping[F]||e.dynamicTyping)===!0))(b)?I==="true"||I==="TRUE"||I!=="false"&&I!=="FALSE"&&((F=>{if(W.test(F)&&(F=parseFloat(F),D<F&&F<f))return 1})(I)?parseFloat(I):R.test(I)?new Date(I):I===""?null:I):I)(k=e.header?m>=p.length?"__parsed_extra":p[m]:k,z=e.transform?e.transform(z,k):z);k==="__parsed_extra"?(N[k]=N[k]||[],N[k].push(z)):N[k]=z}return e.header&&(m>p.length?$("FieldMismatch","TooManyFields","Too many fields: expected "+p.length+" fields but parsed "+m,Y+A):m<p.length&&$("FieldMismatch","TooFewFields","Too few fields: expected "+p.length+" fields but parsed "+m,Y+A)),N}var E;o&&(e.header||e.dynamicTyping||e.transform)&&(E=1,!o.data.length||Array.isArray(o.data[0])?(o.data=o.data.map(O),E=o.data.length):o.data=O(o.data,0),e.header&&o.meta&&(o.meta.fields=p),Y+=E)}function H(){return e.header&&p.length===0}function $(c,O,E,w){c={type:c,code:O,message:E},w!==void 0&&(c.row=w),o.errors.push(c)}v(e.step)&&(i=e.step,e.step=function(c){o=c,H()?L():(L(),o.data.length!==0&&(a+=c.data.length,e.preview&&a>e.preview?n.abort():(o.data=o.data[0],i(o,C))))}),this.parse=function(c,O,E){var w=e.quoteChar||'"',w=(e.newline||(e.newline=this.guessLineEndings(c,w)),r=!1,e.delimiter?v(e.delimiter)&&(e.delimiter=e.delimiter(c),o.meta.delimiter=e.delimiter):((w=((A,N,m,k,z)=>{var b,I,F,ce;z=z||[",","	","|",";",u.RECORD_SEP,u.UNIT_SEP];for(var de=0;de<z.length;de++){for(var se,K=z[de],ue=0,j=0,X=0,te=(F=void 0,new x({comments:k,delimiter:K,newline:N,preview:10}).parse(A)),he=0;he<te.data.length;he++)m&&M(te.data[he])?X++:(se=te.data[he].length,j+=se,F===void 0?F=se:0<se&&(ue+=Math.abs(se-F),F=se));0<te.data.length&&(j/=te.data.length-X),(I===void 0||ue<=I)&&(ce===void 0||ce<j)&&1.99<j&&(I=ue,b=K,ce=j)}return{successful:!!(e.delimiter=b),bestDelimiter:b}})(c,e.newline,e.skipEmptyLines,e.comments,e.delimitersToGuess)).successful?e.delimiter=w.bestDelimiter:(r=!0,e.delimiter=u.DefaultDelimiter),o.meta.delimiter=e.delimiter),Q(e));return e.preview&&e.header&&w.preview++,t=c,n=new x(w),o=n.parse(t,O,E),L(),h?{meta:{paused:!0}}:o||{meta:{paused:!1}}},this.paused=function(){return h},this.pause=function(){h=!0,n.abort(),t=v(e.chunk)?"":t.substring(n.getCharIndex())},this.resume=function(){C.streamer._halted?(h=!1,C.streamer.parseChunk(t,!0)):setTimeout(C.resume,3)},this.aborted=function(){return ae},this.abort=function(){ae=!0,n.abort(),o.meta.aborted=!0,v(e.complete)&&e.complete(o),t=""},this.guessLineEndings=function(A,w){A=A.substring(0,1048576);var w=new RegExp(d(w)+"([^]*?)"+d(w),"gm"),E=(A=A.replace(w,"")).split("\r"),w=A.split(`
`),A=1<w.length&&w[0].length<E[0].length;if(E.length===1||A)return`
`;for(var N=0,m=0;m<E.length;m++)E[m][0]===`
`&&N++;return N>=E.length/2?`\r
`:"\r"}}function d(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function x(e){var t=(e=e||{}).delimiter,n=e.newline,r=e.comments,i=e.step,f=e.preview,D=e.fastMode,W=null,R=e.quoteChar==null?'"':e.quoteChar,C=R;if(e.escapeChar!==void 0&&(C=e.escapeChar),(typeof t!="string"||-1<u.BAD_DELIMITERS.indexOf(t))&&(t=","),r===t)throw new Error("Comment character same as delimiter");r===!0?r="#":(typeof r!="string"||-1<u.BAD_DELIMITERS.indexOf(r))&&(r=!1),n!==`
`&&n!=="\r"&&n!==`\r
`&&(n=`
`);var a=0,Y=!1;this.parse=function(h,ae,p){if(typeof h!="string")throw new Error("Input must be a string");var o=h.length,M=t.length,L=n.length,H=r.length,$=v(i),c=[],O=[],E=[],w=a=0;if(!h)return K();if(D||D!==!1&&h.indexOf(R)===-1){for(var A=h.split(n),N=0;N<A.length;N++){if(E=A[N],a+=E.length,N!==A.length-1)a+=n.length;else if(p)return K();if(!r||E.substring(0,H)!==r){if($){if(c=[],F(E.split(t)),ue(),Y)return K()}else F(E.split(t));if(f&&f<=N)return c=c.slice(0,f),K(!0)}}return K()}for(var m=h.indexOf(t,a),k=h.indexOf(n,a),z=new RegExp(d(C)+d(R),"g"),b=h.indexOf(R,a);;)if(h[a]===R)for(b=a,a++;;){if((b=h.indexOf(R,b+1))===-1)return p||O.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:c.length,index:a}),de();if(b===o-1)return de(h.substring(a,b).replace(z,R));if(R===C&&h[b+1]===C)b++;else if(R===C||b===0||h[b-1]!==C){m!==-1&&m<b+1&&(m=h.indexOf(t,b+1));var I=ce((k=k!==-1&&k<b+1?h.indexOf(n,b+1):k)===-1?m:Math.min(m,k));if(h.substr(b+1+I,M)===t){E.push(h.substring(a,b).replace(z,R)),h[a=b+1+I+M]!==R&&(b=h.indexOf(R,a)),m=h.indexOf(t,a),k=h.indexOf(n,a);break}if(I=ce(k),h.substring(b+1+I,b+1+I+L)===n){if(E.push(h.substring(a,b).replace(z,R)),se(b+1+I+L),m=h.indexOf(t,a),b=h.indexOf(R,a),$&&(ue(),Y))return K();if(f&&c.length>=f)return K(!0);break}O.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:c.length,index:a}),b++}}else if(r&&E.length===0&&h.substring(a,a+H)===r){if(k===-1)return K();a=k+L,k=h.indexOf(n,a),m=h.indexOf(t,a)}else if(m!==-1&&(m<k||k===-1))E.push(h.substring(a,m)),a=m+M,m=h.indexOf(t,a);else{if(k===-1)break;if(E.push(h.substring(a,k)),se(k+L),$&&(ue(),Y))return K();if(f&&c.length>=f)return K(!0)}return de();function F(j){c.push(j),w=a}function ce(j){var X=0;return X=j!==-1&&(j=h.substring(b+1,j))&&j.trim()===""?j.length:X}function de(j){return p||(j===void 0&&(j=h.substring(a)),E.push(j),a=o,F(E),$&&ue()),K()}function se(j){a=j,F(E),E=[],k=h.indexOf(n,a)}function K(j){if(e.header&&!ae&&c.length){var X=c[0],te={},he=new Set(X);let ye=!1;for(let fe=0;fe<X.length;fe++){let ne=X[fe];if(te[ne=v(e.transformHeader)?e.transformHeader(ne,fe):ne]){let pe,ve=te[ne];for(;pe=ne+"_"+ve,ve++,he.has(pe););he.add(pe),X[fe]=pe,te[ne]++,ye=!0,(W=W===null?{}:W)[pe]=ne}else te[ne]=1,X[fe]=ne;he.add(ne)}ye&&console.warn("Duplicate headers found and renamed.")}return{data:c,errors:O,meta:{delimiter:t,linebreak:n,aborted:Y,truncated:!!j,cursor:w+(ae||0),renamedHeaders:W}}}function ue(){i(K()),c=[],O=[]}},this.abort=function(){Y=!0},this.getCharIndex=function(){return a}}function B(e){var t=e.data,n=ie[t.workerId],r=!1;if(t.error)n.userError(t.error,t.file);else if(t.results&&t.results.data){var i={abort:function(){r=!0,S(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:Z,resume:Z};if(v(n.userStep)){for(var f=0;f<t.results.data.length&&(n.userStep({data:t.results.data[f],errors:t.results.errors,meta:t.results.meta},i),!r);f++);delete t.results}else v(n.userChunk)&&(n.userChunk(t.results,i,t.file),delete t.results)}t.finished&&!r&&S(t.workerId,t.results)}function S(e,t){var n=ie[e];v(n.userComplete)&&n.userComplete(t),n.terminate(),delete ie[e]}function Z(){throw new Error("Not implemented.")}function Q(e){if(typeof e!="object"||e===null)return e;var t,n=Array.isArray(e)?[]:{};for(t in e)n[t]=Q(e[t]);return n}function q(e,t){return function(){e.apply(t,arguments)}}function v(e){return typeof e=="function"}return u.parse=function(e,t){var n=(t=t||{}).dynamicTyping||!1;if(v(n)&&(t.dynamicTypingFunction=n,n={}),t.dynamicTyping=n,t.transform=!!v(t.transform)&&t.transform,!t.worker||!u.WORKERS_SUPPORTED)return n=null,u.NODE_STREAM_INPUT,typeof e=="string"?(e=(r=>r.charCodeAt(0)!==65279?r:r.slice(1))(e),n=new(t.download?oe:s)(t)):e.readable===!0&&v(e.read)&&v(e.on)?n=new g(t):(_.File&&e instanceof File||e instanceof Object)&&(n=new U(t)),n.stream(e);(n=(()=>{var r;return!!u.WORKERS_SUPPORTED&&(r=(()=>{var i=_.URL||_.webkitURL||null,f=y.toString();return u.BLOB_URL||(u.BLOB_URL=i.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",f,")();"],{type:"text/javascript"})))})(),(r=new _.Worker(r)).onmessage=B,r.id=le++,ie[r.id]=r)})()).userStep=t.step,n.userChunk=t.chunk,n.userComplete=t.complete,n.userError=t.error,t.step=v(t.step),t.chunk=v(t.chunk),t.complete=v(t.complete),t.error=v(t.error),delete t.worker,n.postMessage({input:e,config:t,workerId:n.id})},u.unparse=function(e,t){var n=!1,r=!0,i=",",f=`\r
`,D='"',W=D+D,R=!1,C=null,a=!1,Y=((()=>{if(typeof t=="object"){if(typeof t.delimiter!="string"||u.BAD_DELIMITERS.filter(function(p){return t.delimiter.indexOf(p)!==-1}).length||(i=t.delimiter),typeof t.quotes!="boolean"&&typeof t.quotes!="function"&&!Array.isArray(t.quotes)||(n=t.quotes),typeof t.skipEmptyLines!="boolean"&&typeof t.skipEmptyLines!="string"||(R=t.skipEmptyLines),typeof t.newline=="string"&&(f=t.newline),typeof t.quoteChar=="string"&&(D=t.quoteChar),typeof t.header=="boolean"&&(r=t.header),Array.isArray(t.columns)){if(t.columns.length===0)throw new Error("Option columns is empty");C=t.columns}t.escapeChar!==void 0&&(W=t.escapeChar+D),t.escapeFormulae instanceof RegExp?a=t.escapeFormulae:typeof t.escapeFormulae=="boolean"&&t.escapeFormulae&&(a=/^[=+\-@\t\r].*$/)}})(),new RegExp(d(D),"g"));if(typeof e=="string"&&(e=JSON.parse(e)),Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return h(null,e,R);if(typeof e[0]=="object")return h(C||Object.keys(e[0]),e,R)}else if(typeof e=="object")return typeof e.data=="string"&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||C),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:typeof e.data[0]=="object"?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||typeof e.data[0]=="object"||(e.data=[e.data])),h(e.fields||[],e.data||[],R);throw new Error("Unable to serialize unrecognized input");function h(p,o,M){var L="",H=(typeof p=="string"&&(p=JSON.parse(p)),typeof o=="string"&&(o=JSON.parse(o)),Array.isArray(p)&&0<p.length),$=!Array.isArray(o[0]);if(H&&r){for(var c=0;c<p.length;c++)0<c&&(L+=i),L+=ae(p[c],c);0<o.length&&(L+=f)}for(var O=0;O<o.length;O++){var E=(H?p:o[O]).length,w=!1,A=H?Object.keys(o[O]).length===0:o[O].length===0;if(M&&!H&&(w=M==="greedy"?o[O].join("").trim()==="":o[O].length===1&&o[O][0].length===0),M==="greedy"&&H){for(var N=[],m=0;m<E;m++){var k=$?p[m]:m;N.push(o[O][k])}w=N.join("").trim()===""}if(!w){for(var z=0;z<E;z++){0<z&&!A&&(L+=i);var b=H&&$?p[z]:z;L+=ae(o[O][b],z)}O<o.length-1&&(!M||0<E&&!A)&&(L+=f)}}return L}function ae(p,o){var M,L;return p==null?"":p.constructor===Date?JSON.stringify(p).slice(1,25):(L=!1,a&&typeof p=="string"&&a.test(p)&&(p="'"+p,L=!0),M=p.toString().replace(Y,W),(L=L||n===!0||typeof n=="function"&&n(p,o)||Array.isArray(n)&&n[o]||((H,$)=>{for(var c=0;c<$.length;c++)if(-1<H.indexOf($[c]))return!0;return!1})(M,u.BAD_DELIMITERS)||-1<M.indexOf(i)||M.charAt(0)===" "||M.charAt(M.length-1)===" ")?D+M+D:M)}},u.RECORD_SEP="",u.UNIT_SEP="",u.BYTE_ORDER_MARK="\uFEFF",u.BAD_DELIMITERS=["\r",`
`,'"',u.BYTE_ORDER_MARK],u.WORKERS_SUPPORTED=!J&&!!_.Worker,u.NODE_STREAM_INPUT=1,u.LocalChunkSize=10485760,u.RemoteChunkSize=5242880,u.DefaultDelimiter=",",u.Parser=x,u.ParserHandle=l,u.NetworkStreamer=oe,u.FileStreamer=U,u.StringStreamer=s,u.ReadableStreamStreamer=g,_.jQuery&&((G=_.jQuery).fn.parse=function(e){var t=e.config||{},n=[];return this.each(function(f){if(!(G(this).prop("tagName").toUpperCase()==="INPUT"&&G(this).attr("type").toLowerCase()==="file"&&_.FileReader)||!this.files||this.files.length===0)return!0;for(var D=0;D<this.files.length;D++)n.push({file:this.files[D],inputElem:this,instanceConfig:G.extend({},t)})}),r(),this;function r(){if(n.length===0)v(e.complete)&&e.complete();else{var f,D,W,R,C=n[0];if(v(e.before)){var a=e.before(C.file,C.inputElem);if(typeof a=="object"){if(a.action==="abort")return f="AbortError",D=C.file,W=C.inputElem,R=a.reason,void(v(e.error)&&e.error({name:f},D,W,R));if(a.action==="skip")return void i();typeof a.config=="object"&&(C.instanceConfig=G.extend(C.instanceConfig,a.config))}else if(a==="skip")return void i()}var Y=C.instanceConfig.complete;C.instanceConfig.complete=function(h){v(Y)&&Y(h,C.file,C.inputElem),i()},u.parse(C.file,C.instanceConfig)}}function i(){n.splice(0,1),r()}}),re&&(_.onmessage=function(e){e=e.data,u.WORKER_ID===void 0&&e&&(u.WORKER_ID=e.workerId),typeof e.input=="string"?_.postMessage({workerId:u.WORKER_ID,results:u.parse(e.input,e.config),finished:!0}):(_.File&&e.input instanceof File||e.input instanceof Object)&&(e=u.parse(e.input,e.config))&&_.postMessage({workerId:u.WORKER_ID,results:e,finished:!0})}),(oe.prototype=Object.create(V.prototype)).constructor=oe,(U.prototype=Object.create(V.prototype)).constructor=U,(s.prototype=Object.create(s.prototype)).constructor=s,(g.prototype=Object.create(V.prototype)).constructor=g,u})}(ge)),ge.exports}var Pe=qe();const Ue=Se(Pe),Be=()=>{let T=null;return Ue.parse("./data.csv",{download:!0,header:!0,delimiter:",",complete:P=>{const y=new xe;P.data.forEach(U=>{const s=U.name,g=U.acronym;y.addNode(s,{nodeType:"institution",label:[g,s].filter(d=>!!d).join(" - ")}),(U.subject_terms.match(/(?:\* )[^\n\r]*/g)||[]).map(d=>d.replace(/^\* /,"")).forEach(d=>{y.hasNode(d)||y.addNode(d,{nodeType:"subject",label:d}),y.addEdge(s,d,{weight:1})})}),Ne.cropToLargestConnectedComponent(y);const _={institution:"#FA5A3D",subject:"#5A75DB"};y.forEachNode((U,s)=>y.setNodeAttribute(U,"color",_[s.nodeType]));const G=y.nodes().map(U=>y.degree(U)),J=Math.min(...G),re=Math.max(...G),ie=2,le=15;y.forEachNode(U=>{const s=y.degree(U);y.setNodeAttribute(U,"size",ie+(s-J)/(re-J)*(le-ie))}),je.assign(y);const u=Ee.inferSettings(y);Ee.assign(y,{settings:u,iterations:600});const V=document.getElementById("loader");V.style.display="none";const oe=document.getElementById("sigma-container");T=new Oe(y,oe)}}),()=>{T&&T.kill()}},We=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  }
  #loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4em;
  }
</style>
<div id="sigma-container"></div>
<div id="loader"><span>⌛</span></div>
`,He=`/**
 * This example shows how to use graphology and sigma to interpret a dataset and
 * to transform it to a mappable graph dataset, without going through any other
 * intermediate step.
 *
 * To do this, we start from a dataset from "The Cartography of Political
 * Science in France" extracted from:
 * https://cartosciencepolitique.sciencespo.fr/#/en
 *
 * The CSV contains one line per institution, with an interesting subject_terms
 * column. We will here transform this dataset to a institution/subject
 * bipartite network map.
 */
import Graph from "graphology";
import { cropToLargestConnectedComponent } from "graphology-components";
import forceAtlas2 from "graphology-layout-forceatlas2";
import circular from "graphology-layout/circular";
import Papa from "papaparse";
import Sigma from "sigma";

export default () => {
  let renderer: Sigma | null = null;

  // 1. Load CSV file:
  Papa.parse<{ name: string; acronym: string; subject_terms: string }>("./data.csv", {
    download: true,
    header: true,
    delimiter: ",",
    complete: (results) => {
      const graph: Graph = new Graph();

      // 2. Build the bipartite graph:
      results.data.forEach((line) => {
        const institution = line.name;
        const acronym = line.acronym;

        // Create the institution node:
        graph.addNode(institution, {
          nodeType: "institution",
          label: [acronym, institution].filter((s) => !!s).join(" - "),
        });

        // Extract subjects list:
        const subjects = (line.subject_terms.match(/(?:\\* )[^\\n\\r]*/g) || []).map((str) => str.replace(/^\\* /, ""));

        // For each subject, create the node if it does not exist yet:
        subjects.forEach((subject) => {
          if (!graph.hasNode(subject)) graph.addNode(subject, { nodeType: "subject", label: subject });

          graph.addEdge(institution, subject, { weight: 1 });
        });
      });

      // 3. Only keep the main connected component:
      cropToLargestConnectedComponent(graph);

      // 4. Add colors to the nodes, based on node types:
      const COLORS: Record<string, string> = { institution: "#FA5A3D", subject: "#5A75DB" };
      graph.forEachNode((node, attributes) =>
        graph.setNodeAttribute(node, "color", COLORS[attributes.nodeType as string]),
      );

      // 5. Use degrees for node sizes:
      const degrees = graph.nodes().map((node) => graph.degree(node));
      const minDegree = Math.min(...degrees);
      const maxDegree = Math.max(...degrees);
      const minSize = 2,
        maxSize = 15;
      graph.forEachNode((node) => {
        const degree = graph.degree(node);
        graph.setNodeAttribute(
          node,
          "size",
          minSize + ((degree - minDegree) / (maxDegree - minDegree)) * (maxSize - minSize),
        );
      });

      // 6. Position nodes on a circle, then run Force Atlas 2 for a while to get
      //    proper graph layout:
      circular.assign(graph);
      const settings = forceAtlas2.inferSettings(graph);
      forceAtlas2.assign(graph, { settings, iterations: 600 });

      // 7. Hide the loader from the DOM:
      const loader = document.getElementById("loader") as HTMLElement;
      loader.style.display = "none";

      // 8. Finally, draw the graph using sigma:
      const container = document.getElementById("sigma-container") as HTMLElement;
      renderer = new Sigma(graph, container);
    },
  });

  return () => {
    if (renderer) renderer.kill();
  };
};
`,Ve={id:"csv-to-network-map",title:"Core library/Features showcases"},Ze={name:"From CSV to network maps",render:()=>We,play:Ae(Be),args:{},parameters:{storySource:{source:He}}};export{Ve as default,Ze as story};