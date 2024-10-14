import{i as Ee,G as we,S as Ce,w as Se}from"./sigma-D6zuMBvc.js";import"./add-edge-CCsz5v3R.js";import{f as ve}from"./index--VWyBF35.js";import{a as xe}from"./circular-4kFIkoUP.js";import{c as Oe,g as Re}from"./_commonjsHelpers-BosuxZz1.js";import"./getters-Dzi6BvTr.js";function re(m){this.graph=m,this.stack=new Array(m.order),this.seen=new Set,this.size=0}re.prototype.hasAlreadySeenEverything=function(){return this.seen.size===this.graph.order};re.prototype.countUnseenNodes=function(){return this.graph.order-this.seen.size};re.prototype.forEachNodeYetUnseen=function(m){var R=this.seen,l=this.graph;l.someNode(function(f,j){if(R.size===l.order)return!0;if(R.has(f))return!1;var $=m(f,j);return!!$})};re.prototype.has=function(m){return this.seen.has(m)};re.prototype.push=function(m){var R=this.seen.size;return this.seen.add(m),R===this.seen.size?!1:(this.stack[this.size++]=m,!0)};re.prototype.pushWith=function(m,R){var l=this.seen.size;return this.seen.add(m),l===this.seen.size?!1:(this.stack[this.size++]=R,!0)};re.prototype.pop=function(){if(this.size!==0)return this.stack[--this.size]};var Ae=re,Te=Ee,De=Ae;function ze(m){if(!Te(m))throw new Error("graphology-components: the given graph is not a valid graphology instance.");if(!m.order)return[];var R=new De(m),l=R.push.bind(R),f=[],j;return R.forEachNodeYetUnseen(function($){j=[],R.push($);for(var J;R.size!==0;)J=R.pop(),j.push(J),m.forEachNeighbor(J,l);return j.length>f.length&&(f=j),f.length>R.countUnseenNodes()}),f}function Ie(m){var R=new Set(ze(m));m.forEachNode(function(l){R.has(l)||m.dropNode(l)})}var Le=Ie,be={exports:{}};/* @license
Papa Parse
v5.4.1
https://github.com/mholt/PapaParse
License: MIT
*/(function(m,R){(function(l,f){m.exports=f()})(Oe,function l(){var f=typeof self<"u"?self:typeof window<"u"?window:f!==void 0?f:{},j=!f.document&&!!f.postMessage,$=f.IS_PAPA_WORKER||!1,J={},de=0,d={parse:function(t,e){var n=(e=e||{}).dynamicTyping||!1;if(_(n)&&(e.dynamicTypingFunction=n,n={}),e.dynamicTyping=n,e.transform=!!_(e.transform)&&e.transform,e.worker&&d.WORKERS_SUPPORTED){var r=function(){if(!d.WORKERS_SUPPORTED)return!1;var u=(z=f.URL||f.webkitURL||null,w=l.toString(),d.BLOB_URL||(d.BLOB_URL=z.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",w,")();"],{type:"text/javascript"})))),c=new f.Worker(u),z,w;return c.onmessage=ke,c.id=de++,J[c.id]=c}();return r.userStep=e.step,r.userChunk=e.chunk,r.userComplete=e.complete,r.userError=e.error,e.step=_(e.step),e.chunk=_(e.chunk),e.complete=_(e.complete),e.error=_(e.error),delete e.worker,void r.postMessage({input:t,config:e,workerId:r.id})}var s=null;return d.NODE_STREAM_INPUT,typeof t=="string"?(t=function(u){return u.charCodeAt(0)===65279?u.slice(1):u}(t),s=e.download?new oe(e):new P(e)):t.readable===!0&&_(t.read)&&_(t.on)?s=new he(e):(f.File&&t instanceof File||t instanceof Object)&&(s=new M(e)),s.stream(t)},unparse:function(t,e){var n=!1,r=!0,s=",",u=`\r
`,c='"',z=c+c,w=!1,a=null,S=!1;(function(){if(typeof e=="object"){if(typeof e.delimiter!="string"||d.BAD_DELIMITERS.filter(function(i){return e.delimiter.indexOf(i)!==-1}).length||(s=e.delimiter),(typeof e.quotes=="boolean"||typeof e.quotes=="function"||Array.isArray(e.quotes))&&(n=e.quotes),typeof e.skipEmptyLines!="boolean"&&typeof e.skipEmptyLines!="string"||(w=e.skipEmptyLines),typeof e.newline=="string"&&(u=e.newline),typeof e.quoteChar=="string"&&(c=e.quoteChar),typeof e.header=="boolean"&&(r=e.header),Array.isArray(e.columns)){if(e.columns.length===0)throw new Error("Option columns is empty");a=e.columns}e.escapeChar!==void 0&&(z=e.escapeChar+c),(typeof e.escapeFormulae=="boolean"||e.escapeFormulae instanceof RegExp)&&(S=e.escapeFormulae instanceof RegExp?e.escapeFormulae:/^[=+\-@\t\r].*$/)}})();var h=new RegExp(U(c),"g");if(typeof t=="string"&&(t=JSON.parse(t)),Array.isArray(t)){if(!t.length||Array.isArray(t[0]))return G(null,t,w);if(typeof t[0]=="object")return G(a||Object.keys(t[0]),t,w)}else if(typeof t=="object")return typeof t.data=="string"&&(t.data=JSON.parse(t.data)),Array.isArray(t.data)&&(t.fields||(t.fields=t.meta&&t.meta.fields||a),t.fields||(t.fields=Array.isArray(t.data[0])?t.fields:typeof t.data[0]=="object"?Object.keys(t.data[0]):[]),Array.isArray(t.data[0])||typeof t.data[0]=="object"||(t.data=[t.data])),G(t.fields||[],t.data||[],w);throw new Error("Unable to serialize unrecognized input");function G(i,b,F){var C="";typeof i=="string"&&(i=JSON.parse(i)),typeof b=="string"&&(b=JSON.parse(b));var I=Array.isArray(i)&&0<i.length,T=!Array.isArray(b[0]);if(I&&r){for(var D=0;D<i.length;D++)0<D&&(C+=s),C+=L(i[D],D);0<b.length&&(C+=u)}for(var o=0;o<b.length;o++){var p=I?i.length:b[o].length,k=!1,A=I?Object.keys(b[o]).length===0:b[o].length===0;if(F&&!I&&(k=F==="greedy"?b[o].join("").trim()==="":b[o].length===1&&b[o][0].length===0),F==="greedy"&&I){for(var y=[],N=0;N<p;N++){var x=T?i[N]:N;y.push(b[o][x])}k=y.join("").trim()===""}if(!k){for(var v=0;v<p;v++){0<v&&!A&&(C+=s);var Q=I&&T?i[v]:v;C+=L(b[o][Q],v)}o<b.length-1&&(!F||0<p&&!A)&&(C+=u)}}return C}function L(i,b){if(i==null)return"";if(i.constructor===Date)return JSON.stringify(i).slice(1,25);var F=!1;S&&typeof i=="string"&&S.test(i)&&(i="'"+i,F=!0);var C=i.toString().replace(h,z);return(F=F||n===!0||typeof n=="function"&&n(i,b)||Array.isArray(n)&&n[b]||function(I,T){for(var D=0;D<T.length;D++)if(-1<I.indexOf(T[D]))return!0;return!1}(C,d.BAD_DELIMITERS)||-1<C.indexOf(s)||C.charAt(0)===" "||C.charAt(C.length-1)===" ")?c+C+c:C}}};if(d.RECORD_SEP="",d.UNIT_SEP="",d.BYTE_ORDER_MARK="\uFEFF",d.BAD_DELIMITERS=["\r",`
`,'"',d.BYTE_ORDER_MARK],d.WORKERS_SUPPORTED=!j&&!!f.Worker,d.NODE_STREAM_INPUT=1,d.LocalChunkSize=10485760,d.RemoteChunkSize=5242880,d.DefaultDelimiter=",",d.Parser=le,d.ParserHandle=fe,d.NetworkStreamer=oe,d.FileStreamer=M,d.StringStreamer=P,d.ReadableStreamStreamer=he,f.jQuery){var ie=f.jQuery;ie.fn.parse=function(t){var e=t.config||{},n=[];return this.each(function(u){if(!(ie(this).prop("tagName").toUpperCase()==="INPUT"&&ie(this).attr("type").toLowerCase()==="file"&&f.FileReader)||!this.files||this.files.length===0)return!0;for(var c=0;c<this.files.length;c++)n.push({file:this.files[c],inputElem:this,instanceConfig:ie.extend({},e)})}),r(),this;function r(){if(n.length!==0){var u,c,z,w,a=n[0];if(_(t.before)){var S=t.before(a.file,a.inputElem);if(typeof S=="object"){if(S.action==="abort")return u="AbortError",c=a.file,z=a.inputElem,w=S.reason,void(_(t.error)&&t.error({name:u},c,z,w));if(S.action==="skip")return void s();typeof S.config=="object"&&(a.instanceConfig=ie.extend(a.instanceConfig,S.config))}else if(S==="skip")return void s()}var h=a.instanceConfig.complete;a.instanceConfig.complete=function(G){_(h)&&h(G,a.file,a.inputElem),s()},d.parse(a.file,a.instanceConfig)}else _(t.complete)&&t.complete()}function s(){n.splice(0,1),r()}}}function K(t){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},(function(e){var n=pe(e);n.chunkSize=parseInt(n.chunkSize),e.step||e.chunk||(n.chunkSize=null),this._handle=new fe(n),(this._handle.streamer=this)._config=n}).call(this,t),this.parseChunk=function(e,n){if(this.isFirstChunk&&_(this._config.beforeFirstChunk)){var r=this._config.beforeFirstChunk(e);r!==void 0&&(e=r)}this.isFirstChunk=!1,this._halted=!1;var s=this._partialLine+e;this._partialLine="";var u=this._handle.parse(s,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var c=u.meta.cursor;this._finished||(this._partialLine=s.substring(c-this._baseIndex),this._baseIndex=c),u&&u.data&&(this._rowCount+=u.data.length);var z=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if($)f.postMessage({results:u,workerId:d.WORKER_ID,finished:z});else if(_(this._config.chunk)&&!n){if(this._config.chunk(u,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);u=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(u.data),this._completeResults.errors=this._completeResults.errors.concat(u.errors),this._completeResults.meta=u.meta),this._completed||!z||!_(this._config.complete)||u&&u.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),z||u&&u.meta.paused||this._nextChunk(),u}this._halted=!0},this._sendError=function(e){_(this._config.error)?this._config.error(e):$&&this._config.error&&f.postMessage({workerId:d.WORKER_ID,error:e,finished:!1})}}function oe(t){var e;(t=t||{}).chunkSize||(t.chunkSize=d.RemoteChunkSize),K.call(this,t),this._nextChunk=j?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(n){this._input=n,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(e=new XMLHttpRequest,this._config.withCredentials&&(e.withCredentials=this._config.withCredentials),j||(e.onload=X(this._chunkLoaded,this),e.onerror=X(this._chunkError,this)),e.open(this._config.downloadRequestBody?"POST":"GET",this._input,!j),this._config.downloadRequestHeaders){var n=this._config.downloadRequestHeaders;for(var r in n)e.setRequestHeader(r,n[r])}if(this._config.chunkSize){var s=this._start+this._config.chunkSize-1;e.setRequestHeader("Range","bytes="+this._start+"-"+s)}try{e.send(this._config.downloadRequestBody)}catch(u){this._chunkError(u.message)}j&&e.status===0&&this._chunkError()}},this._chunkLoaded=function(){e.readyState===4&&(e.status<200||400<=e.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:e.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(n){var r=n.getResponseHeader("Content-Range");return r===null?-1:parseInt(r.substring(r.lastIndexOf("/")+1))}(e),this.parseChunk(e.responseText)))},this._chunkError=function(n){var r=e.statusText||n;this._sendError(new Error(r))}}function M(t){var e,n;(t=t||{}).chunkSize||(t.chunkSize=d.LocalChunkSize),K.call(this,t);var r=typeof FileReader<"u";this.stream=function(s){this._input=s,n=s.slice||s.webkitSlice||s.mozSlice,r?((e=new FileReader).onload=X(this._chunkLoaded,this),e.onerror=X(this._chunkError,this)):e=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var s=this._input;if(this._config.chunkSize){var u=Math.min(this._start+this._config.chunkSize,this._input.size);s=n.call(s,this._start,u)}var c=e.readAsText(s,this._config.encoding);r||this._chunkLoaded({target:{result:c}})},this._chunkLoaded=function(s){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(s.target.result)},this._chunkError=function(){this._sendError(e.error)}}function P(t){var e;K.call(this,t=t||{}),this.stream=function(n){return e=n,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var n,r=this._config.chunkSize;return r?(n=e.substring(0,r),e=e.substring(r)):(n=e,e=""),this._finished=!e,this.parseChunk(n)}}}function he(t){K.call(this,t=t||{});var e=[],n=!0,r=!1;this.pause=function(){K.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){K.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(s){this._input=s,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){r&&e.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),e.length?this.parseChunk(e.shift()):n=!0},this._streamData=X(function(s){try{e.push(typeof s=="string"?s:s.toString(this._config.encoding)),n&&(n=!1,this._checkIsFinished(),this.parseChunk(e.shift()))}catch(u){this._streamError(u)}},this),this._streamError=X(function(s){this._streamCleanUp(),this._sendError(s)},this),this._streamEnd=X(function(){this._streamCleanUp(),r=!0,this._streamData("")},this),this._streamCleanUp=X(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function fe(t){var e,n,r,s=Math.pow(2,53),u=-s,c=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,z=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,w=this,a=0,S=0,h=!1,G=!1,L=[],i={data:[],errors:[],meta:{}};if(_(t.step)){var b=t.step;t.step=function(o){if(i=o,I())C();else{if(C(),i.data.length===0)return;a+=o.data.length,t.preview&&a>t.preview?n.abort():(i.data=i.data[0],b(i,w))}}}function F(o){return t.skipEmptyLines==="greedy"?o.join("").trim()==="":o.length===1&&o[0].length===0}function C(){return i&&r&&(D("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+d.DefaultDelimiter+"'"),r=!1),t.skipEmptyLines&&(i.data=i.data.filter(function(o){return!F(o)})),I()&&function(){if(!i)return;function o(k,A){_(t.transformHeader)&&(k=t.transformHeader(k,A)),L.push(k)}if(Array.isArray(i.data[0])){for(var p=0;I()&&p<i.data.length;p++)i.data[p].forEach(o);i.data.splice(0,1)}else i.data.forEach(o)}(),function(){if(!i||!t.header&&!t.dynamicTyping&&!t.transform)return i;function o(k,A){var y,N=t.header?{}:[];for(y=0;y<k.length;y++){var x=y,v=k[y];t.header&&(x=y>=L.length?"__parsed_extra":L[y]),t.transform&&(v=t.transform(v,x)),v=T(x,v),x==="__parsed_extra"?(N[x]=N[x]||[],N[x].push(v)):N[x]=v}return t.header&&(y>L.length?D("FieldMismatch","TooManyFields","Too many fields: expected "+L.length+" fields but parsed "+y,S+A):y<L.length&&D("FieldMismatch","TooFewFields","Too few fields: expected "+L.length+" fields but parsed "+y,S+A)),N}var p=1;return!i.data.length||Array.isArray(i.data[0])?(i.data=i.data.map(o),p=i.data.length):i.data=o(i.data,0),t.header&&i.meta&&(i.meta.fields=L),S+=p,i}()}function I(){return t.header&&L.length===0}function T(o,p){return k=o,t.dynamicTypingFunction&&t.dynamicTyping[k]===void 0&&(t.dynamicTyping[k]=t.dynamicTypingFunction(k)),(t.dynamicTyping[k]||t.dynamicTyping)===!0?p==="true"||p==="TRUE"||p!=="false"&&p!=="FALSE"&&(function(A){if(c.test(A)){var y=parseFloat(A);if(u<y&&y<s)return!0}return!1}(p)?parseFloat(p):z.test(p)?new Date(p):p===""?null:p):p;var k}function D(o,p,k,A){var y={type:o,code:p,message:k};A!==void 0&&(y.row=A),i.errors.push(y)}this.parse=function(o,p,k){var A=t.quoteChar||'"';if(t.newline||(t.newline=function(x,v){x=x.substring(0,1048576);var Q=new RegExp(U(v)+"([^]*?)"+U(v),"gm"),B=(x=x.replace(Q,"")).split("\r"),Y=x.split(`
`),V=1<Y.length&&Y[0].length<B[0].length;if(B.length===1||V)return`
`;for(var q=0,E=0;E<B.length;E++)B[E][0]===`
`&&q++;return q>=B.length/2?`\r
`:"\r"}(o,A)),r=!1,t.delimiter)_(t.delimiter)&&(t.delimiter=t.delimiter(o),i.meta.delimiter=t.delimiter);else{var y=function(x,v,Q,B,Y){var V,q,E,O;Y=Y||[",","	","|",";",d.RECORD_SEP,d.UNIT_SEP];for(var se=0;se<Y.length;se++){var g=Y[se],ue=0,Z=0,ae=0;E=void 0;for(var ee=new le({comments:B,delimiter:g,newline:v,preview:10}).parse(x),te=0;te<ee.data.length;te++)if(Q&&F(ee.data[te]))ae++;else{var ne=ee.data[te].length;Z+=ne,E!==void 0?0<ne&&(ue+=Math.abs(ne-E),E=ne):E=ne}0<ee.data.length&&(Z/=ee.data.length-ae),(q===void 0||ue<=q)&&(O===void 0||O<Z)&&1.99<Z&&(q=ue,V=g,O=Z)}return{successful:!!(t.delimiter=V),bestDelimiter:V}}(o,t.newline,t.skipEmptyLines,t.comments,t.delimitersToGuess);y.successful?t.delimiter=y.bestDelimiter:(r=!0,t.delimiter=d.DefaultDelimiter),i.meta.delimiter=t.delimiter}var N=pe(t);return t.preview&&t.header&&N.preview++,e=o,n=new le(N),i=n.parse(e,p,k),C(),h?{meta:{paused:!0}}:i||{meta:{paused:!1}}},this.paused=function(){return h},this.pause=function(){h=!0,n.abort(),e=_(t.chunk)?"":e.substring(n.getCharIndex())},this.resume=function(){w.streamer._halted?(h=!1,w.streamer.parseChunk(e,!0)):setTimeout(w.resume,3)},this.aborted=function(){return G},this.abort=function(){G=!0,n.abort(),i.meta.aborted=!0,_(t.complete)&&t.complete(i),e=""}}function U(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function le(t){var e,n=(t=t||{}).delimiter,r=t.newline,s=t.comments,u=t.step,c=t.preview,z=t.fastMode,w=e=t.quoteChar===void 0||t.quoteChar===null?'"':t.quoteChar;if(t.escapeChar!==void 0&&(w=t.escapeChar),(typeof n!="string"||-1<d.BAD_DELIMITERS.indexOf(n))&&(n=","),s===n)throw new Error("Comment character same as delimiter");s===!0?s="#":(typeof s!="string"||-1<d.BAD_DELIMITERS.indexOf(s))&&(s=!1),r!==`
`&&r!=="\r"&&r!==`\r
`&&(r=`
`);var a=0,S=!1;this.parse=function(h,G,L){if(typeof h!="string")throw new Error("Input must be a string");var i=h.length,b=n.length,F=r.length,C=s.length,I=_(u),T=[],D=[],o=[],p=a=0;if(!h)return W();if(t.header&&!G){var k=h.split(r)[0].split(n),A=[],y={},N=!1;for(var x in k){var v=k[x];_(t.transformHeader)&&(v=t.transformHeader(v,x));var Q=v,B=y[v]||0;for(0<B&&(N=!0,Q=v+"_"+B),y[v]=B+1;A.includes(Q);)Q=Q+"_"+B;A.push(Q)}if(N){var Y=h.split(r);Y[0]=A.join(n),h=Y.join(r)}}if(z||z!==!1&&h.indexOf(e)===-1){for(var V=h.split(r),q=0;q<V.length;q++){if(o=V[q],a+=o.length,q!==V.length-1)a+=r.length;else if(L)return W();if(!s||o.substring(0,C)!==s){if(I){if(T=[],ae(o.split(n)),ce(),S)return W()}else ae(o.split(n));if(c&&c<=q)return T=T.slice(0,c),W(!0)}}return W()}for(var E=h.indexOf(n,a),O=h.indexOf(r,a),se=new RegExp(U(w)+U(e),"g"),g=h.indexOf(e,a);;)if(h[a]!==e)if(s&&o.length===0&&h.substring(a,a+C)===s){if(O===-1)return W();a=O+F,O=h.indexOf(r,a),E=h.indexOf(n,a)}else if(E!==-1&&(E<O||O===-1))o.push(h.substring(a,E)),a=E+b,E=h.indexOf(n,a);else{if(O===-1)break;if(o.push(h.substring(a,O)),ne(O+F),I&&(ce(),S))return W();if(c&&T.length>=c)return W(!0)}else for(g=a,a++;;){if((g=h.indexOf(e,g+1))===-1)return L||D.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:T.length,index:a}),te();if(g===i-1)return te(h.substring(a,g).replace(se,e));if(e!==w||h[g+1]!==w){if(e===w||g===0||h[g-1]!==w){E!==-1&&E<g+1&&(E=h.indexOf(n,g+1)),O!==-1&&O<g+1&&(O=h.indexOf(r,g+1));var ue=ee(O===-1?E:Math.min(E,O));if(h.substr(g+1+ue,b)===n){o.push(h.substring(a,g).replace(se,e)),h[a=g+1+ue+b]!==e&&(g=h.indexOf(e,a)),E=h.indexOf(n,a),O=h.indexOf(r,a);break}var Z=ee(O);if(h.substring(g+1+Z,g+1+Z+F)===r){if(o.push(h.substring(a,g).replace(se,e)),ne(g+1+Z+F),E=h.indexOf(n,a),g=h.indexOf(e,a),I&&(ce(),S))return W();if(c&&T.length>=c)return W(!0);break}D.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:T.length,index:a}),g++}}else g++}return te();function ae(H){T.push(H),p=a}function ee(H){var ye=0;if(H!==-1){var ge=h.substring(g+1,H);ge&&ge.trim()===""&&(ye=ge.length)}return ye}function te(H){return L||(H===void 0&&(H=h.substring(a)),o.push(H),a=i,ae(o),I&&ce()),W()}function ne(H){a=H,ae(o),o=[],O=h.indexOf(r,a)}function W(H){return{data:T,errors:D,meta:{delimiter:n,linebreak:r,aborted:S,truncated:!!H,cursor:p+(G||0)}}}function ce(){u(W()),T=[],D=[]}},this.abort=function(){S=!0},this.getCharIndex=function(){return a}}function ke(t){var e=t.data,n=J[e.workerId],r=!1;if(e.error)n.userError(e.error,e.file);else if(e.results&&e.results.data){var s={abort:function(){r=!0,me(e.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:_e,resume:_e};if(_(n.userStep)){for(var u=0;u<e.results.data.length&&(n.userStep({data:e.results.data[u],errors:e.results.errors,meta:e.results.meta},s),!r);u++);delete e.results}else _(n.userChunk)&&(n.userChunk(e.results,s,e.file),delete e.results)}e.finished&&!r&&me(e.workerId,e.results)}function me(t,e){var n=J[t];_(n.userComplete)&&n.userComplete(e),n.terminate(),delete J[t]}function _e(){throw new Error("Not implemented.")}function pe(t){if(typeof t!="object"||t===null)return t;var e=Array.isArray(t)?[]:{};for(var n in t)e[n]=pe(t[n]);return e}function X(t,e){return function(){t.apply(e,arguments)}}function _(t){return typeof t=="function"}return $&&(f.onmessage=function(t){var e=t.data;if(d.WORKER_ID===void 0&&e&&(d.WORKER_ID=e.workerId),typeof e.input=="string")f.postMessage({workerId:d.WORKER_ID,results:d.parse(e.input,e.config),finished:!0});else if(f.File&&e.input instanceof File||e.input instanceof Object){var n=d.parse(e.input,e.config);n&&f.postMessage({workerId:d.WORKER_ID,results:n,finished:!0})}}),(oe.prototype=Object.create(K.prototype)).constructor=oe,(M.prototype=Object.create(K.prototype)).constructor=M,(P.prototype=Object.create(P.prototype)).constructor=P,(he.prototype=Object.create(K.prototype)).constructor=he,d})})(be);var Fe=be.exports;const Ne=Re(Fe),je=()=>{let m=null;return Ne.parse("./data.csv",{download:!0,header:!0,delimiter:",",complete:R=>{const l=new we;R.data.forEach(M=>{const P=M.name,he=M.acronym;l.addNode(P,{nodeType:"institution",label:[he,P].filter(U=>!!U).join(" - ")}),(M.subject_terms.match(/(?:\* )[^\n\r]*/g)||[]).map(U=>U.replace(/^\* /,"")).forEach(U=>{l.hasNode(U)||l.addNode(U,{nodeType:"subject",label:U}),l.addEdge(P,U,{weight:1})})}),Le(l);const f={institution:"#FA5A3D",subject:"#5A75DB"};l.forEachNode((M,P)=>l.setNodeAttribute(M,"color",f[P.nodeType]));const j=l.nodes().map(M=>l.degree(M)),$=Math.min(...j),J=Math.max(...j),de=2,d=15;l.forEachNode(M=>{const P=l.degree(M);l.setNodeAttribute(M,"size",de+(P-$)/(J-$)*(d-de))}),xe.assign(l);const ie=ve.inferSettings(l);ve.assign(l,{settings:ie,iterations:600});const K=document.getElementById("loader");K.style.display="none";const oe=document.getElementById("sigma-container");m=new Ce(l,oe)}}),()=>{m&&m.kill()}},Me=`<style>
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
`,Ue=`/**
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
`,Ge={id:"csv-to-network-map",title:"Core library/Features showcases"},Qe={name:"From CSV to network maps",render:()=>Me,play:Se(je),args:{},parameters:{storySource:{source:Ue}}};export{Ge as default,Qe as story};
