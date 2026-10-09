const on=i=>i,sn=i=>i*i,ln=i=>i*(2-i),dn=i=>(i*=2)<1?.5*i*i:-.5*(--i*(i-2)-1),hn=i=>i*i*i,un=i=>--i*i*i+1,cn=i=>(i*=2)<1?.5*i*i*i:.5*((i-=2)*i*i+2),fn=i=>i===0?0:Math.pow(2,10*(i-1)),gn=i=>i===1?1:1-Math.pow(2,-10*i),pn=i=>i===0?0:i===1?1:i<.5?Math.pow(2,10*(2*i-1))/2:(2-Math.pow(2,-10*(2*i-1)))/2,mi={linear:on,quadraticIn:sn,quadraticOut:ln,quadraticInOut:dn,cubicIn:hn,cubicOut:un,cubicInOut:cn,exponentialIn:fn,exponentialOut:gn,exponentialInOut:pn};function qt(i){return i?typeof i=="function"?i:mi[i]:mi.linear}const la={easing:"quadraticInOut",duration:150};function Ql(i,e,t,a){const n=Object.assign({},la,t),r=qt(n.easing),o=Date.now(),s={};for(const d in e){const u=e[d];s[d]={};for(const c in u)s[d][c]=i.getNodeAttribute(d,c)}let l=null;const h=()=>{l=null;let d=(Date.now()-o)/n.duration;if(d>=1){for(const u in e){const c=e[u];for(const f in c)i.setNodeAttribute(u,f,c[f])}return}d=r(d);for(const u in e){const c=e[u],f=s[u];for(const g in c)i.setNodeAttribute(u,g,c[g]*d+f[g]*(1-d))}l=requestAnimationFrame(h)};return h(),()=>{l&&cancelAnimationFrame(l)}}function Q(){return Float32Array.of(1,0,0,0,1,0,0,0,1)}function tt(i,e,t){return i[0]=e,i[4]=typeof t=="number"?t:e,i}function bi(i,e){const t=Math.sin(e),a=Math.cos(e);return i[0]=a,i[1]=t,i[3]=-t,i[4]=a,i}function xi(i,e,t){return i[6]=e,i[7]=t,i}function se(i,e){const t=i[0],a=i[1],n=i[2],r=i[3],o=i[4],s=i[5],l=i[6],h=i[7],d=i[8],u=e[0],c=e[1],f=e[2],g=e[3],b=e[4],p=e[5],m=e[6],y=e[7],v=e[8];return i[0]=u*t+c*r+f*l,i[1]=u*a+c*o+f*h,i[2]=u*n+c*s+f*d,i[3]=g*t+b*r+p*l,i[4]=g*a+b*o+p*h,i[5]=g*n+b*s+p*d,i[6]=m*t+y*r+v*l,i[7]=m*a+y*o+v*h,i[8]=m*n+y*s+v*d,i}function da(i,e){const t=Math.cos(e),a=Math.sin(e);return{x:t*i.x+a*i.y,y:-a*i.x+t*i.y}}function Ke(i,e,t=1){const a=i[0],n=i[1],r=i[3],o=i[4],s=i[6],l=i[7],h=e.x,d=e.y;return{x:h*a+d*r+s*t,y:h*n+d*o+l*t}}function mn(i,e){const t=i.height/i.width,a=e.height/e.width;return t<1&&a>1||t>1&&a<1?1:Math.min(Math.max(a,1/a),Math.max(1/t,t))}function pe(i,e,t,a,n){const{angle:r,ratio:o,x:s,y:l}=i,{width:h,height:d}=e,u=Q(),c=Math.min(h,d)-2*a,f=mn(e,t);return n?(se(u,xi(Q(),s,l)),se(u,tt(Q(),o)),se(u,bi(Q(),r)),se(u,tt(Q(),h/c/2/f,d/c/2/f))):(se(u,tt(Q(),2*(c/h)*f,2*(c/d)*f)),se(u,bi(Q(),-r)),se(u,tt(Q(),1/o)),se(u,xi(Q(),-s,-l))),u}function bn(i,e,t){const{x:a,y:n}=Ke(i,{x:Math.cos(e.angle),y:Math.sin(e.angle)},0);return 1/Math.sqrt(Math.pow(a,2)+Math.pow(n,2))/t.width}function ha(i,e,t,a,n){const r=Math.floor(e/n*a),o=Math.floor(i.drawingBufferHeight/n-t/n*a);return[r,o]}const Ue={black:"#000000",silver:"#C0C0C0",gray:"#808080",grey:"#808080",white:"#FFFFFF",maroon:"#800000",red:"#FF0000",purple:"#800080",fuchsia:"#FF00FF",green:"#008000",lime:"#00FF00",olive:"#808000",yellow:"#FFFF00",navy:"#000080",blue:"#0000FF",teal:"#008080",aqua:"#00FFFF",darkblue:"#00008B",mediumblue:"#0000CD",darkgreen:"#006400",darkcyan:"#008B8B",deepskyblue:"#00BFFF",darkturquoise:"#00CED1",mediumspringgreen:"#00FA9A",springgreen:"#00FF7F",cyan:"#00FFFF",midnightblue:"#191970",dodgerblue:"#1E90FF",lightseagreen:"#20B2AA",forestgreen:"#228B22",seagreen:"#2E8B57",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",limegreen:"#32CD32",mediumseagreen:"#3CB371",turquoise:"#40E0D0",royalblue:"#4169E1",steelblue:"#4682B4",darkslateblue:"#483D8B",mediumturquoise:"#48D1CC",indigo:"#4B0082",darkolivegreen:"#556B2F",cadetblue:"#5F9EA0",cornflowerblue:"#6495ED",rebeccapurple:"#663399",mediumaquamarine:"#66CDAA",dimgray:"#696969",dimgrey:"#696969",slateblue:"#6A5ACD",olivedrab:"#6B8E23",slategray:"#708090",slategrey:"#708090",lightslategray:"#778899",lightslategrey:"#778899",mediumslateblue:"#7B68EE",lawngreen:"#7CFC00",chartreuse:"#7FFF00",aquamarine:"#7FFFD4",skyblue:"#87CEEB",lightskyblue:"#87CEFA",blueviolet:"#8A2BE2",darkred:"#8B0000",darkmagenta:"#8B008B",saddlebrown:"#8B4513",darkseagreen:"#8FBC8F",lightgreen:"#90EE90",mediumpurple:"#9370DB",darkviolet:"#9400D3",palegreen:"#98FB98",darkorchid:"#9932CC",yellowgreen:"#9ACD32",sienna:"#A0522D",brown:"#A52A2A",darkgray:"#A9A9A9",darkgrey:"#A9A9A9",lightblue:"#ADD8E6",greenyellow:"#ADFF2F",paleturquoise:"#AFEEEE",lightsteelblue:"#B0C4DE",powderblue:"#B0E0E6",firebrick:"#B22222",darkgoldenrod:"#B8860B",mediumorchid:"#BA55D3",rosybrown:"#BC8F8F",darkkhaki:"#BDB76B",mediumvioletred:"#C71585",indianred:"#CD5C5C",peru:"#CD853F",chocolate:"#D2691E",tan:"#D2B48C",lightgray:"#D3D3D3",lightgrey:"#D3D3D3",thistle:"#D8BFD8",orchid:"#DA70D6",goldenrod:"#DAA520",palevioletred:"#DB7093",crimson:"#DC143C",gainsboro:"#DCDCDC",plum:"#DDA0DD",burlywood:"#DEB887",lightcyan:"#E0FFFF",lavender:"#E6E6FA",darksalmon:"#E9967A",violet:"#EE82EE",palegoldenrod:"#EEE8AA",lightcoral:"#F08080",khaki:"#F0E68C",aliceblue:"#F0F8FF",honeydew:"#F0FFF0",azure:"#F0FFFF",sandybrown:"#F4A460",wheat:"#F5DEB3",beige:"#F5F5DC",whitesmoke:"#F5F5F5",mintcream:"#F5FFFA",ghostwhite:"#F8F8FF",salmon:"#FA8072",antiquewhite:"#FAEBD7",linen:"#FAF0E6",lightgoldenrodyellow:"#FAFAD2",oldlace:"#FDF5E6",magenta:"#FF00FF",deeppink:"#FF1493",orangered:"#FF4500",tomato:"#FF6347",hotpink:"#FF69B4",coral:"#FF7F50",darkorange:"#FF8C00",lightsalmon:"#FFA07A",orange:"#FFA500",lightpink:"#FFB6C1",pink:"#FFC0CB",gold:"#FFD700",peachpuff:"#FFDAB9",navajowhite:"#FFDEAD",moccasin:"#FFE4B5",bisque:"#FFE4C4",mistyrose:"#FFE4E1",blanchedalmond:"#FFEBCD",papayawhip:"#FFEFD5",lavenderblush:"#FFF0F5",seashell:"#FFF5EE",cornsilk:"#FFF8DC",lemonchiffon:"#FFFACD",floralwhite:"#FFFAF0",snow:"#FFFAFA",lightyellow:"#FFFFE0",ivory:"#FFFFF0"},ua=new Int8Array(4),ut=new Int32Array(ua.buffer,0,1),ca=new Float32Array(ua.buffer,0,1),xn=/^\s*rgba?\s*\(/,yn=/^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;function _t(i){let e=0,t=0,a=0,n=1;const r=i.toLowerCase();if(r==="transparent")return{r:0,g:0,b:0,a:0};if(r in Ue)return _t(Ue[r]);if(i[0]==="#")i.length===4?(e=parseInt(i.charAt(1)+i.charAt(1),16),t=parseInt(i.charAt(2)+i.charAt(2),16),a=parseInt(i.charAt(3)+i.charAt(3),16)):(e=parseInt(i.charAt(1)+i.charAt(2),16),t=parseInt(i.charAt(3)+i.charAt(4),16),a=parseInt(i.charAt(5)+i.charAt(6),16)),i.length===9&&(n=parseInt(i.charAt(7)+i.charAt(8),16)/255);else if(xn.test(i)){const o=i.match(yn);o&&(e=+o[1],t=+o[2],a=+o[3],o[4]&&(n=+o[4]))}return{r:e,g:t,b:a,a:n}}function _n(i,e=!1){const{r:t,g:a,b:n,a:r}=_t(i);return e?[t/255*r,a/255*r,n/255*r,r]:[t/255,a/255,n/255,r]}const Re={};for(const i in Ue)Re[i]=te(Ue[i]),Re[Ue[i]]=Re[i];function Tn(i,e,t,a,n){return ut[0]=a<<24|t<<16|e<<8|i,ut[0]=ut[0]&4278190079,ca[0]}function te(i){if(i=i.toLowerCase(),typeof Re[i]<"u")return Re[i];const e=_t(i),{r:t,g:a,b:n}=e;let{a:r}=e;r=r*255|0;const o=Tn(t,a,n,r);return Re[i]=o,o}function Oe(i,e){ca[0]=te(i);let t=ut[0];const a=t&255,n=t>>8&255,r=t>>16&255,o=t>>24&255;return[a,n,r,o]}function mt(i){const e=i>>>8&255,t=i>>>16&255,a=i>>>24&255;return((i&255)<<24|a<<16|t<<8|e)>>>0}function fa(i,e,t,a){return(t<<24|e<<16|i<<8|a)>>>0}function vn(i,e,t,a,n,r){const[o,s]=ha(i,t,a,n,r),l=new Uint8Array(4);i.bindFramebuffer(i.FRAMEBUFFER,e),i.readPixels(o,s,1,1,i.RGBA,i.UNSIGNED_BYTE,l);const[h,d,u,c]=l;return[h,d,u,c]}function Sn(i){const{r:e,g:t,b:a,a:n}=_t(i),r=(e/255).toFixed(6),o=(t/255).toFixed(6),s=(a/255).toFixed(6),l=n.toFixed(6);return`vec4(${r}, ${o}, ${s}, ${l})`}function yi(i,e){const t=e.size;if(t===0)return;const a=i.length;i.length+=t;let n=0;e.forEach(r=>{i[a+n]=r,n++})}function En(i,...e){i=i||{};for(let t=0,a=e.length;t<a;t++){const n=e[t];n&&Object.assign(i,n)}return i}function Ge(i,e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t)&&e[t]!==i[t])return!0;return!1}function wn(i,e){const t=i,a=e;for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&t[n]!==a[n])return!1;for(const n in a)if(Object.prototype.hasOwnProperty.call(a,n)&&a[n]!==t[n])return!1;return!0}function ve(i,e,t){t?i.add(e):i.delete(e)}function me(i){return i.labelVisibility==="visible"&&i.visibility!=="hidden"}function _i(i){return i.backdropVisibility==="visible"&&i.visibility!=="hidden"}function Ct(i){return[i.rotationAlignment==="graph"?1:0,i.labelRotationAlignment==="graph"?1:0]}function Ti(i,e,t){const a=i[e];if(a)for(let n=0;n<a.length;n++){const r=a[n];if(!(t<r.offset||t>=r.offset+r.count)){if(r.count===1)a.splice(n,1);else if(t===r.offset)r.offset++,r.count--;else if(t===r.offset+r.count-1)r.count--;else{const o=t+1,s=r.offset+r.count-o;r.count=t-r.offset,a.splice(n+1,0,{offset:o,count:s})}return}}}function vi(i,e,t){if(!i[e]){i[e]=[{offset:t,count:1}];return}const a=i[e];let n=a.length;for(let h=0;h<a.length;h++)if(t<a[h].offset){n=h;break}const r=n>0?a[n-1]:null,o=n<a.length?a[n]:null,s=r&&r.offset+r.count===t,l=o&&t+1===o.offset;s&&l?(r.count+=1+o.count,a.splice(n,1)):s?r.count++:l?(o.offset--,o.count++):a.splice(n,0,{offset:t,count:1})}var Jl=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Dn(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ed(i){if(Object.prototype.hasOwnProperty.call(i,"__esModule"))return i;var e=i.default;if(typeof e=="function"){var t=function a(){return this instanceof a?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};t.prototype=e.prototype}else t={};return Object.defineProperty(t,"__esModule",{value:!0}),Object.keys(i).forEach(function(a){var n=Object.getOwnPropertyDescriptor(i,a);Object.defineProperty(t,a,n.get?n:{enumerable:!0,get:function(){return i[a]}})}),t}var Lt,Si;function An(){return Si||(Si=1,Lt=function(e){return e!==null&&typeof e=="object"&&typeof e.addUndirectedEdgeWithKey=="function"&&typeof e.dropNode=="function"&&typeof e.multi=="boolean"}),Lt}var Rn=An();const Cn=Dn(Rn);function Ln(i){if(!Cn(i))throw new Error("Sigma: invalid graph instance.")}const Pn=new Set(["italic","oblique"]),Fn=new Set(["bold","bolder","lighter"]);function Pt(i){let e="normal",t="normal";const a=i.trim(),n=a.split(/\s+/);let r=0;for(let s=0;s<n.length;s++){const l=n[s].toLowerCase();if(Pn.has(l))t=l,r=s+1;else if(Fn.has(l)||/^\d{3}$/.test(l))e=l,r=s+1;else if(l==="normal")r=s+1;else break}return{family:n.slice(r).join(" ")||a,weight:e,style:t}}function Ye(i,e,t){const a=document.createElement(i);if(e)for(const n in e)a.style[n]=e[n];if(t)for(const n in t)a.setAttribute(n,t[n]);return a}function Ut(){return typeof window.devicePixelRatio<"u"?window.devicePixelRatio:1}function Ot(i){const{x:[e,t],y:[a,n]}=i;let r=Math.max(t-e,n-a),o=(t+e)/2,s=(n+a)/2;(r===0||Math.abs(r)===1/0||isNaN(r))&&(r=1),isNaN(o)&&(o=0),isNaN(s)&&(s=0);const l=h=>({x:.5+(h.x-o)/r,y:.5+(h.y-s)/r});return l.applyTo=h=>{h.x=.5+(h.x-o)/r,h.y=.5+(h.y-s)/r},l.inverse=h=>({x:o+r*(h.x-.5),y:s+r*(h.y-.5)}),l.ratio=r,l}const In=2;function kn(i,e,t,a=In){const{width:n,height:r}=e.canvas;let{x:o,y:s,rowHeight:l,maxRowWidth:h}=t;const d={},u=[];for(const c of i){const f=c.width+a,g=c.height+a;if(f>n||g>r||o+f>n&&s+l+g>r){u.push(c);continue}o+f>n&&(h=Math.max(h,o),o=0,s+=l,l=g),c.draw(e,o,s),d[c.key]={x:o,y:s,width:c.width,height:c.height},o+=f,l=Math.max(l,g)}return h=Math.max(h,o),{atlas:d,cursor:{x:o,y:s,rowHeight:l,maxRowWidth:h},remaining:u}}const Tt={hideEdgesOnMove:!1,hideLabelsOnMove:!1,renderLabels:!0,renderEdgeLabels:!1,edgeLabelAnchors:"nodeLabels",enableEdgeEvents:!1,nodeLabelEvents:!1,edgeLabelEvents:!1,pickingDownSizingRatio:2,nodePickingPadding:0,edgePickingPadding:4,labelPickingPadding:10,stagePadding:30,minEdgeThickness:1.7,antiAliasingFeather:1,antialiasEdges:!0,antialiasNodes:!0,dragTimeout:100,draggedEventsTolerance:3,inertiaDuration:200,inertiaRatio:3,zoomDuration:250,zoomingRatio:1.7,doubleClickTimeout:300,doubleClickZoomingRatio:2.2,doubleClickZoomingDuration:200,tapMoveTolerance:10,zoomToSizeRatioFunction:Math.sqrt,itemSizesReference:"positions",autoRescale:!0,autoRescaleContent:"positions",enableNodeDrag:!1,getDraggedNodes:i=>[i],dragPositionToAttributes:null,labelDensity:1,labelGridCellSize:100,labelRenderedSizeThreshold:6,labelPixelSnapping:!0,minCameraRatio:null,maxCameraRatio:null,enableCameraZooming:!0,enableCameraPanning:!0,enableCameraRotation:!0,enableCameraMouseRotation:!0,cameraPanBoundaries:null,gestureTarget:"graph",sharedGestureWheelMessage:"Use Ctrl + scroll to zoom the graph",sharedGestureAppleWheelMessage:"Use ⌘ + scroll to zoom the graph",sharedGestureTouchMessage:"Use two fingers to move the graph",allowInvalidContainer:!1,DEBUG_displayPickingLayer:!1,DEBUG_logShaders:!1,DEBUG_logRenderStats:!1,DEBUG_gpuTimerQueries:!1};function Ft(i){if(typeof i.labelDensity!="number"||i.labelDensity<0)throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");const{minCameraRatio:e,maxCameraRatio:t}=i;if(typeof e=="number"&&typeof t=="number"&&t<e)throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.")}function Gn(i){return En({},Tt,i)}var it={exports:{}},Ei;function Nn(){if(Ei)return it.exports;Ei=1;var i=typeof Reflect=="object"?Reflect:null,e=i&&typeof i.apply=="function"?i.apply:function(x,T,S){return Function.prototype.apply.call(x,T,S)},t;i&&typeof i.ownKeys=="function"?t=i.ownKeys:Object.getOwnPropertySymbols?t=function(x){return Object.getOwnPropertyNames(x).concat(Object.getOwnPropertySymbols(x))}:t=function(x){return Object.getOwnPropertyNames(x)};function a(_){console&&console.warn&&console.warn(_)}var n=Number.isNaN||function(x){return x!==x};function r(){r.init.call(this)}it.exports=r,it.exports.once=m,r.EventEmitter=r,r.prototype._events=void 0,r.prototype._eventsCount=0,r.prototype._maxListeners=void 0;var o=10;function s(_){if(typeof _!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof _)}Object.defineProperty(r,"defaultMaxListeners",{enumerable:!0,get:function(){return o},set:function(_){if(typeof _!="number"||_<0||n(_))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+_+".");o=_}}),r.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},r.prototype.setMaxListeners=function(x){if(typeof x!="number"||x<0||n(x))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+x+".");return this._maxListeners=x,this};function l(_){return _._maxListeners===void 0?r.defaultMaxListeners:_._maxListeners}r.prototype.getMaxListeners=function(){return l(this)},r.prototype.emit=function(x){for(var T=[],S=1;S<arguments.length;S++)T.push(arguments[S]);var E=x==="error",D=this._events;if(D!==void 0)E=E&&D.error===void 0;else if(!E)return!1;if(E){var w;if(T.length>0&&(w=T[0]),w instanceof Error)throw w;var A=new Error("Unhandled error."+(w?" ("+w.message+")":""));throw A.context=w,A}var F=D[x];if(F===void 0)return!1;if(typeof F=="function")e(F,this,T);else for(var R=F.length,P=g(F,R),S=0;S<R;++S)e(P[S],this,T);return!0};function h(_,x,T,S){var E,D,w;if(s(T),D=_._events,D===void 0?(D=_._events=Object.create(null),_._eventsCount=0):(D.newListener!==void 0&&(_.emit("newListener",x,T.listener?T.listener:T),D=_._events),w=D[x]),w===void 0)w=D[x]=T,++_._eventsCount;else if(typeof w=="function"?w=D[x]=S?[T,w]:[w,T]:S?w.unshift(T):w.push(T),E=l(_),E>0&&w.length>E&&!w.warned){w.warned=!0;var A=new Error("Possible EventEmitter memory leak detected. "+w.length+" "+String(x)+" listeners added. Use emitter.setMaxListeners() to increase limit");A.name="MaxListenersExceededWarning",A.emitter=_,A.type=x,A.count=w.length,a(A)}return _}r.prototype.addListener=function(x,T){return h(this,x,T,!1)},r.prototype.on=r.prototype.addListener,r.prototype.prependListener=function(x,T){return h(this,x,T,!0)};function d(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function u(_,x,T){var S={fired:!1,wrapFn:void 0,target:_,type:x,listener:T},E=d.bind(S);return E.listener=T,S.wrapFn=E,E}r.prototype.once=function(x,T){return s(T),this.on(x,u(this,x,T)),this},r.prototype.prependOnceListener=function(x,T){return s(T),this.prependListener(x,u(this,x,T)),this},r.prototype.removeListener=function(x,T){var S,E,D,w,A;if(s(T),E=this._events,E===void 0)return this;if(S=E[x],S===void 0)return this;if(S===T||S.listener===T)--this._eventsCount===0?this._events=Object.create(null):(delete E[x],E.removeListener&&this.emit("removeListener",x,S.listener||T));else if(typeof S!="function"){for(D=-1,w=S.length-1;w>=0;w--)if(S[w]===T||S[w].listener===T){A=S[w].listener,D=w;break}if(D<0)return this;D===0?S.shift():b(S,D),S.length===1&&(E[x]=S[0]),E.removeListener!==void 0&&this.emit("removeListener",x,A||T)}return this},r.prototype.off=r.prototype.removeListener,r.prototype.removeAllListeners=function(x){var T,S,E;if(S=this._events,S===void 0)return this;if(S.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):S[x]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete S[x]),this;if(arguments.length===0){var D=Object.keys(S),w;for(E=0;E<D.length;++E)w=D[E],w!=="removeListener"&&this.removeAllListeners(w);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(T=S[x],typeof T=="function")this.removeListener(x,T);else if(T!==void 0)for(E=T.length-1;E>=0;E--)this.removeListener(x,T[E]);return this};function c(_,x,T){var S=_._events;if(S===void 0)return[];var E=S[x];return E===void 0?[]:typeof E=="function"?T?[E.listener||E]:[E]:T?p(E):g(E,E.length)}r.prototype.listeners=function(x){return c(this,x,!0)},r.prototype.rawListeners=function(x){return c(this,x,!1)},r.listenerCount=function(_,x){return typeof _.listenerCount=="function"?_.listenerCount(x):f.call(_,x)},r.prototype.listenerCount=f;function f(_){var x=this._events;if(x!==void 0){var T=x[_];if(typeof T=="function")return 1;if(T!==void 0)return T.length}return 0}r.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]};function g(_,x){for(var T=new Array(x),S=0;S<x;++S)T[S]=_[S];return T}function b(_,x){for(;x+1<_.length;x++)_[x]=_[x+1];_.pop()}function p(_){for(var x=new Array(_.length),T=0;T<x.length;++T)x[T]=_[T].listener||_[T];return x}function m(_,x){return new Promise(function(T,S){function E(w){_.removeListener(x,D),S(w)}function D(){typeof _.removeListener=="function"&&_.removeListener("error",E),T([].slice.call(arguments))}v(_,x,D,{once:!0}),x!=="error"&&y(_,E,{once:!0})})}function y(_,x,T){typeof _.on=="function"&&v(_,"error",x,T)}function v(_,x,T,S){if(typeof _.on=="function")S.once?_.once(x,T):_.on(x,T);else if(typeof _.addEventListener=="function")_.addEventListener(x,function E(D){S.once&&_.removeEventListener(x,E),T(D)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof _)}return it.exports}var Kt=Nn();function Mn(i){const e=i.type===WebGL2RenderingContext.FLOAT&&!i.normalized,t=i.type===WebGL2RenderingContext.UNSIGNED_BYTE&&i.size===4&&i.normalized;if(!e&&!t)throw new Error(`Attribute "${i.name}" is invalid: only non-normalized FLOAT and normalized UNSIGNED_BYTE with size 4 are supported.`);return i.normalized?1:i.size}function It(i){let e=0;return i.forEach(t=>e+=Mn(t)),e}function ga(i,e,t){const a=i==="VERTEX"?e.VERTEX_SHADER:e.FRAGMENT_SHADER,n=e.createShader(a);if(n===null)throw new Error("loadShader: error while creating the shader");if(e.shaderSource(n,t),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS)){const o=e.getShaderInfoLog(n);throw e.deleteShader(n),new Error(`loadShader: error while compiling the shader:
${o}
${t}`)}return n}function Yt(i,e){return ga("VERTEX",i,e)}function Zt(i,e){return ga("FRAGMENT",i,e)}function Qt(i,e){const t=i.createProgram();if(t===null)throw new Error("loadProgram: error while creating the program.");let a,n;for(a=0,n=e.length;a<n;a++)i.attachShader(t,e[a]);if(i.linkProgram(t),!i.getProgramParameter(t,i.LINK_STATUS)){const o=i.getProgramInfoLog(t);throw i.deleteProgram(t),new Error(`loadProgram: error while linking the program: ${o}`)}return t}function wi({gl:i,buffer:e,program:t,vertexShader:a,fragmentShader:n}){i.deleteShader(a),i.deleteShader(n),i.deleteProgram(t),i.deleteBuffer(e)}function W(i){return i%1===0?i.toFixed(1):i.toString()}const bt=new Map,pa=new Map;let zn=0;function ma(i,e){const t=i.variables?.[e.source||e.name.replace(/^a_/,"")]?.default,a=typeof t=="number"?t:typeof e.defaultValue=="number"?e.defaultValue:0;return W(a)}function vt(i,e,t,a=n=>`v_${n.name.replace(/^a_/,"")}`){const n=[e,t,...i.uniforms.filter(r=>r.type==="float").map(r=>W(r.value??0)),...(i.attributes??[]).map(a)];return`sdf_${i.name}(${n.join(", ")})`}function $n(i){let e=i.name;const t=i.uniforms.filter(r=>r.type==="float"&&r.value!==void 0&&r.value!==0).map(r=>`${r.name.replace("u_","")}=${r.value}`).sort(),a=(i.attributes??[]).map(r=>`${r.name}@${r.source??""}=${ma(i,r)}`),n=[...t,...a];return n.length>0&&(e+="#"+n.join("#")),e}function Wn(i){const e=$n(i);if(!bt.has(e)){const t={};for(const a of i.uniforms)a.type==="float"&&a.value!==void 0&&(t[a.name]=a.value);bt.set(e,{shape:i,uniformValues:t,slug:e}),pa.set(e,zn++)}return e}function ct(i){return pa.get(i)??-1}function ba(i){const e=[],t=new Set,a=new Set,n=/mat2 rotate2D\(float angle\)\s*\{[^}]+\}/;for(const r of i){if(a.has(r.name))continue;a.add(r.name);let o=r.glsl;n.test(o)&&(t.has("rotate2D")?o=o.replace(n,""):t.add("rotate2D")),e.push(o)}return e.join(`
`)}function Bn(){return ba(Array.from(bt.values()).map(i=>i.shape))}function Un(i){const e=Array.from(bt.entries());return e.length===0?`
float querySDF(int shapeId, vec2 uv, float size) {
  return length(uv) - size;
}
`:`
float querySDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
${e.map(([a,{shape:n}],r)=>{const o=vt(n,"uv","size",s=>{const l=s.name.replace(/^a_/,"");return i?.has(l)?`g_${l}`:ma(n,s)});return`    case ${r}: return ${o}; // ${a}`}).join(`
`)}
    default: return length(uv) - size;
  }
}
`}function Jt(i){return ba(i)}function Qe(i){return[...new Map(i.flatMap(e=>e.uniforms).map(e=>[e.name,e])).values()]}function On(i,e){if(i.length===0)return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = length(uv) - size;
  context.inradiusFactor = 1.0;
}
`;const t=l=>vt(l,"uv","size"),a=l=>l.inradiusFactorGLSL??W(l.inradiusFactor??1);if(i.length===1){const l=i[0];return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = ${t(l)};
  context.inradiusFactor = ${a(l)};
}
`}const n=i.map((l,h)=>`    case ${h}: // ${l.name}
      context.sdf = ${t(l)};
      context.inradiusFactor = ${a(l)};
      break;`).join(`
`),r=i[0];let o="",s="shapeId";return e&&e.length>1&&(o=`
int globalToLocalShapeId(int globalId) {
  switch (globalId) {
${e.map((h,d)=>`    case ${h}: return ${d}; // ${i[d].name}`).join(`
`)}
    default: return 0;
  }
}
`,s="globalToLocalShapeId(shapeId)"),`${o}
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  switch (${s}) {
${n}
    default:
      context.sdf = ${t(r)};
      context.inradiusFactor = ${a(r)};
  }
}
`}const He={right:0,left:1,above:2,below:3,over:4},Ze=5,Di=3,xa=`
float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;
`,Hn=`
mat2 rotate2D(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
`,ya=`
vec2 getLabelDirection(float positionMode) {
  if (positionMode < 0.5) return vec2(1.0, 0.0);   // Right
  if (positionMode < 1.5) return vec2(-1.0, 0.0);  // Left
  if (positionMode < 2.5) return vec2(0.0, -1.0);  // Above
  if (positionMode < 3.5) return vec2(0.0, 1.0);   // Below
  return vec2(0.0);                                 // Over (centered)
}
`,Vn=`
float sdfBox(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,Xn=`
float sdfRotatedBox(vec2 p, vec2 halfSize, float angle) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfBox(rotatedP, halfSize);
}
`,jn=`
float sdfRoundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 d = abs(p) - halfSize + radius;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
`,qn=`
float sdfRoundedRotatedBox(vec2 p, vec2 halfSize, float angle, float radius) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfRoundedBox(rotatedP, halfSize, radius);
}
`,_a=`
vec2 labelBoxCenter(float positionMode, float labelStart, vec2 halfSize, float textHalfY) {
  if (positionMode < 0.5) return vec2(labelStart + halfSize.x, 0.0);    // right
  if (positionMode < 1.5) return vec2(-(labelStart + halfSize.x), 0.0); // left
  if (positionMode < 2.5) return vec2(0.0, -(labelStart + textHalfY));  // above
  if (positionMode < 3.5) return vec2(0.0, labelStart + textHalfY);     // below
  return vec2(0.0);                                                     // over
}
`,ei=2,re=`
vec4 readNodeData(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * ${ei};
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`,_e=`
vec4 readNodeFlags(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * ${ei} + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`,Kn=`
vec4 readNodeColor(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * ${ei} + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  vec4 texel = texelFetch(nodeDataTexture, coord, 0);
  float r = floor(texel.b / 65536.0);
  float g = floor(mod(texel.b, 65536.0) / 256.0);
  float b = mod(texel.b, 256.0);
  return vec4(r / 255.0, g / 255.0, b / 255.0, texel.a);
}
`,Le=`
vec4 readFrameTexel(sampler2D frameTexture, int frameTextureWidth, int index) {
  ivec2 coord = ivec2(index % frameTextureWidth, index / frameTextureWidth);
  return texelFetch(frameTexture, coord, 0);
}
`;function Yn(i,e){const t=r=>vt(r,"uv","size");return i.length===1?{code:Ai(t(i[0])),multiShape:!1}:{code:`
float queryShapeSDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
${i.map((r,o)=>`    case ${e?e[o]:o}: return ${t(r)};`).join(`
`)}
    default: return ${t(i[0])};
  }
}
int g_shapeId;
${Ai("queryShapeSDF(g_shapeId, uv, size)")}
`,multiShape:!0}}function Ai(i){return`
float findEdgeDistance(vec2 direction, float size) {
  float lo = 0.0, hi = 2.0;
  for (int i = 0; i < 8; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 uv = direction * mid;
    if (${i} < 0.0) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}
`}const Zn=1024,Qn=1.5,Jn=4096,Ta=-1;class ti{constructor(e,t,a=Zn){this.texture=null,this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1,this.indexMap=new Map,this.freeIndices=[],this.nextIndex=0,this.gl=e,this.TEXELS_PER_ITEM=t,this.capacity=this.roundUpToPowerOfTwo(a);const n=this.computeTextureDimensions(this.capacity);this.textureWidth=n.width,this.textureHeight=n.height,this.data=new Float32Array(this.textureWidth*this.textureHeight*4),this.createTexture()}computeTextureDimensions(e){const t=e*this.TEXELS_PER_ITEM,a=Math.min(t,Jn),n=Math.ceil(t/a);return{width:a,height:n}}roundUpToPowerOfTwo(e){return Math.pow(2,Math.ceil(Math.log2(Math.max(1,e))))}createTexture(){const{gl:e}=this;this.texture=e.createTexture(),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,this.textureWidth,this.textureHeight,0,e.RGBA,e.FLOAT,this.data),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null)}resize(e){if(e<=this.capacity)return;const t=this.roundUpToPowerOfTwo(Math.ceil(e*Qn)),{gl:a}=this,n=this.computeTextureDimensions(t),r=new Float32Array(n.width*n.height*4);r.set(this.data),this.texture&&a.deleteTexture(this.texture),this.data=r,this.capacity=t,this.textureWidth=n.width,this.textureHeight=n.height,this.createTexture(),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.nextIndex}allocate(e){const t=this.indexMap.get(e);if(t!==void 0)return t;let a;return this.freeIndices.length>0?a=this.freeIndices.pop():(a=this.nextIndex++,a>=this.capacity&&this.resize(a+1)),this.indexMap.set(e,a),a}free(e){const t=this.indexMap.get(e);if(t===void 0)return;this.indexMap.delete(e),this.freeIndices.push(t);const a=t*this.TEXELS_PER_ITEM*4;for(let n=0;n<this.TEXELS_PER_ITEM*4;n++)this.data[a+n]=0;this.markDirty(t)}getIndex(e){return this.indexMap.get(e)??-1}has(e){return this.indexMap.has(e)}markDirty(e){this.dirty=!0,this.dirtyRangeStart=Math.min(this.dirtyRangeStart,e),this.dirtyRangeEnd=Math.max(this.dirtyRangeEnd,e+1)}upload(){if(!this.dirty||!this.texture)return;const{gl:e,textureWidth:t}=this;e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture);const a=this.dirtyRangeStart*this.TEXELS_PER_ITEM,n=Math.min(this.dirtyRangeEnd*this.TEXELS_PER_ITEM,this.capacity*this.TEXELS_PER_ITEM);if(a<n){const r=Math.floor(a/t),o=Math.floor((n-1)/t);for(let s=r;s<=o;s++){const l=s*t,h=Math.min(l+t,this.capacity*this.TEXELS_PER_ITEM),d=Math.max(a,l),u=Math.min(n,h);if(d<u){const c=d-l,f=u-d,g=this.data.subarray(d*4,u*4);e.texSubImage2D(e.TEXTURE_2D,0,c,s,f,1,e.RGBA,e.FLOAT,g)}}}e.bindTexture(e.TEXTURE_2D,null),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}bind(e){const{gl:t}=this;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.texture)}getTexture(){return this.texture}getCapacity(){return this.capacity}getTextureWidth(){return this.textureWidth}getTextureHeight(){return this.textureHeight}getTexelsPerItem(){return this.TEXELS_PER_ITEM}getCount(){return this.indexMap.size}getHighWaterMark(){return this.nextIndex}isDirty(){return this.dirty}clear(){this.indexMap.clear(),this.freeIndices=[],this.nextIndex=0,this.data.fill(0),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.capacity}restore(){this.createTexture(),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}kill(){this.texture&&(this.gl.deleteTexture(this.texture),this.texture=null),this.indexMap.clear(),this.freeIndices=[]}}function q(i){const e={},t={};let a=0;for(const n of i)for(const r of n.attributes){const o=r.name.replace(/^a_/,"");o in e||(e[o]=a,t[o]=r,a+=r.size)}return{floatsPerItem:a,texelsPerItem:Math.max(1,Math.ceil(a/4)),offsets:e,specs:t}}class St extends ti{constructor(e,t,a){super(e,t.texelsPerItem,a),this.floatsPerItem=t.floatsPerItem}updateAllAttributes(e,t){let a=this.indexMap.get(e);a===void 0&&(a=this.allocate(e));const n=a*this.TEXELS_PER_ITEM*4,r=Math.min(t.length,this.floatsPerItem);for(let o=0;o<r;o++)this.data[n+o]=t[o];this.markDirty(a)}updateAllAttributesAtRow(e,t){e>=this.capacity&&this.resize(e+1);const a=e*this.TEXELS_PER_ITEM*4,n=Math.min(t.length,this.floatsPerItem);for(let r=0;r<n;r++)this.data[a+r]=t[r];this.markDirty(e)}}function Et(i,e,t){const a=[],n=new Set;for(let r=0;r<i.length;r++){const o=i[r];for(const s of o.attributes){const l=s.name.replace(/^a_/,"");if(n.has(l))continue;n.add(l);const h=e.offsets[l];if(h===void 0)continue;const d=t?.get(r);a.push({sourceKey:s.source||l,packedOffset:h,size:s.size,isColor:s.size===4&&!!s.normalized,defaultNum:typeof s.defaultValue=="number"?s.defaultValue:s.defaultValue===!0?1:0,defaultColor:typeof s.defaultValue=="string"?s.defaultValue:"",sourceIndex:r,hasLifecycleHook:!!d?.getAttributeData})}}return a}function wt(i,e,t,a,n,r){t.fill(0);for(let o=0,s=i.length;o<s;o++){const l=i[o],h=l.packedOffset;let d;if(l.hasLifecycleHook?(d=n.get(l.sourceIndex-r).getAttributeData(e,l.sourceKey),d===null&&(d=e[l.sourceKey])):d=e[l.sourceKey],l.isColor){const u=typeof d=="string"?d:l.defaultColor||a,[c,f,g,b]=Oe(u);t[h]=c/255,t[h+1]=f/255,t[h+2]=g/255,t[h+3]=b/255}else if(l.size===1)t[h]=typeof d=="number"?d:typeof d=="boolean"?d?1:0:l.defaultNum;else{const u=Array.isArray(d)?d:null;if(u)for(let c=0;c<l.size;c++)t[h+c]=u[c]??0}}}const at=["r","g","b","a"];function Ce(i,e){const{offsets:t,specs:a,texelsPerItem:n,floatsPerItem:r}=i,o=Object.keys(t);if(o.length===0||r===0)return{fetchCode:"",varyingAssignments:""};const{varPrefix:s,baseTexelExpr:l,textureWidthUniform:h,textureSamplerUniform:d,outputPrefix:u="v_"}=e,c=[];c.push(`  int ${s}BaseTexel = ${l};`),c.push("");for(let g=0;g<n;g++)c.push(`  ivec2 ${s}Coord${g} = ivec2((${s}BaseTexel + ${g}) % ${h}, (${s}BaseTexel + ${g}) / ${h});`),c.push(`  vec4 ${s}Texel${g} = texelFetch(${d}, ${s}Coord${g}, 0);`);c.push("");const f=[];for(const g of o){const b=a[g],p=t[g],m=Math.floor(p/4),y=p%4,v=`${s}Texel${m}`,_=`${s}Texel${m+1}`,x=`${s}Fetched_${g}`;if(b.size===1)c.push(`  float ${x} = ${v}.${at[y]};`);else if(b.size===4&&y===0)c.push(`  vec4 ${x} = ${v};`);else{const T=y+b.size;if(T<=4){const S=`vec${b.size}`,E=at.slice(y,T).join("");c.push(`  ${S} ${x} = ${v}.${E};`)}else{const S=b.size===4?"vec4":`vec${b.size}`,E=at.slice(y).map(A=>`${v}.${A}`),D=at.slice(0,T-4).map(A=>`${_}.${A}`),w=[...E,...D].join(", ");c.push(`  ${S} ${x} = ${S}(${w});`)}}f.push(`  ${u}${g} = ${x};`)}return{fetchCode:c.join(`
`),varyingAssignments:f.join(`
`)}}function ii(i,e,t){if(!(!e||t.type==="sampler2D"))switch(t.type){case"float":i.uniform1f(e,t.value);break;case"int":case"bool":i.uniform1i(e,t.value);break;case"vec2":i.uniform2fv(e,t.value);break;case"vec3":i.uniform3fv(e,t.value);break;case"vec4":i.uniform4fv(e,t.value);break;case"mat3":i.uniformMatrix3fv(e,!1,t.value);break;case"mat4":i.uniformMatrix4fv(e,!1,t.value);break}}const er={[WebGL2RenderingContext.BOOL]:1,[WebGL2RenderingContext.BYTE]:1,[WebGL2RenderingContext.UNSIGNED_BYTE]:1,[WebGL2RenderingContext.SHORT]:2,[WebGL2RenderingContext.UNSIGNED_SHORT]:2,[WebGL2RenderingContext.INT]:4,[WebGL2RenderingContext.UNSIGNED_INT]:4,[WebGL2RenderingContext.FLOAT]:4};function nt(i){const e=i.match(/^(#version[^\n]*\n)/);return e?e[1]+`#define PICKING_MODE
`+i.slice(e[1].length):`#define PICKING_MODE
`+i}class Te{constructor(e,t,a){this.floats=new Float32Array,this.ints=new Uint32Array,this.constantArray=new Float32Array,this.capacity=0,this.verticesCount=0,this.bufferGeneration=0,this.uploadedGeneration=new Map,this.constantBufferGeneration=0,this.uploadedConstantGeneration=new Map,this.renderOffset=0,this.renderCount=-1,this.debugStats={drawCalls:0,verticesDrawn:0,bufferUploadBytes:0},this.shadersLogged=!1,this.pickProgram=null;const n=this.getDefinition();if(this.VERTICES=n.VERTICES,this.VERTEX_SHADER_SOURCE=n.VERTEX_SHADER_SOURCE,this.FRAGMENT_SHADER_SOURCE=n.FRAGMENT_SHADER_SOURCE,this.UNIFORMS=n.UNIFORMS,this.ATTRIBUTES=n.ATTRIBUTES,this.METHOD=n.METHOD,this.CONSTANT_ATTRIBUTES="CONSTANT_ATTRIBUTES"in n?n.CONSTANT_ATTRIBUTES:[],this.CONSTANT_DATA="CONSTANT_DATA"in n?n.CONSTANT_DATA:[],this.isInstanced="CONSTANT_ATTRIBUTES"in n,this.ATTRIBUTES_ITEMS_COUNT=It(this.ATTRIBUTES),this.STRIDE=this.VERTICES*this.ATTRIBUTES_ITEMS_COUNT,this.renderer=a,this.normalProgram=this.getProgramInfo("normal",e,n.VERTEX_SHADER_SOURCE,n.FRAGMENT_SHADER_SOURCE,null),this.pickProgram=this.getProgramInfo("pick",e,nt(n.VERTEX_SHADER_SOURCE),nt(n.FRAGMENT_SHADER_SOURCE),null),this.isInstanced){const r=It(this.CONSTANT_ATTRIBUTES);if(this.CONSTANT_DATA.length!==this.VERTICES)throw new Error(`Program: error while getting constant data (expected ${this.VERTICES} items, received ${this.CONSTANT_DATA.length} instead)`);this.constantArray=new Float32Array(this.CONSTANT_DATA.length*r);for(let o=0;o<this.CONSTANT_DATA.length;o++){const s=this.CONSTANT_DATA[o];if(s.length!==r)throw new Error(`Program: error while getting constant data (one vector has ${s.length} items instead of ${r})`);for(let l=0;l<s.length;l++)this.constantArray[o*r+l]=s[l]}this.STRIDE=this.ATTRIBUTES_ITEMS_COUNT}}kill(){wi(this.normalProgram),this.pickProgram&&wi(this.pickProgram)}resetDebugStats(){this.debugStats.drawCalls=0,this.debugStats.verticesDrawn=0,this.debugStats.bufferUploadBytes=0}getProgramInfo(e,t,a,n,r){const o=t.createBuffer();if(o===null)throw new Error("Program: error while creating the WebGL buffer.");const s=Yt(t,a),l=Zt(t,n),h=Qt(t,[s,l]),d={};this.UNIFORMS.forEach(f=>{const g=t.getUniformLocation(h,f);g&&(d[f]=g)});const u={};this.ATTRIBUTES.forEach(f=>{u[f.name]=t.getAttribLocation(h,f.name)});let c;if(this.isInstanced&&(this.CONSTANT_ATTRIBUTES.forEach(f=>{u[f.name]=t.getAttribLocation(h,f.name)}),c=t.createBuffer(),c===null))throw new Error("Program: error while creating the WebGL constant buffer.");return{name:e,program:h,gl:t,frameBuffer:r,buffer:o,constantBuffer:c||{},uniformLocations:d,attributeLocations:u,isPicking:e==="pick",vertexShader:s,fragmentShader:l}}bindProgram(e){let t=0;const{gl:a,buffer:n}=e;this.isInstanced?(a.bindBuffer(a.ARRAY_BUFFER,e.constantBuffer),t=0,this.CONSTANT_ATTRIBUTES.forEach(r=>t+=this.bindAttribute(r,e,t,!1)),this.uploadedConstantGeneration.get(e.constantBuffer)!==this.constantBufferGeneration&&(a.bufferData(a.ARRAY_BUFFER,this.constantArray,a.STATIC_DRAW),this.uploadedConstantGeneration.set(e.constantBuffer,this.constantBufferGeneration),this.renderer?.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.constantArray.byteLength)),a.bindBuffer(a.ARRAY_BUFFER,e.buffer),t=this.renderOffset*this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT,this.ATTRIBUTES.forEach(r=>t+=this.bindAttribute(r,e,t,!0)),this.uploadedGeneration.get(n)!==this.bufferGeneration&&(a.bufferData(a.ARRAY_BUFFER,this.floats,a.DYNAMIC_DRAW),this.uploadedGeneration.set(n,this.bufferGeneration),this.renderer?.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength))):(a.bindBuffer(a.ARRAY_BUFFER,n),t=0,this.ATTRIBUTES.forEach(r=>t+=this.bindAttribute(r,e,t)),this.uploadedGeneration.get(n)!==this.bufferGeneration&&(a.bufferData(a.ARRAY_BUFFER,this.floats,a.DYNAMIC_DRAW),this.uploadedGeneration.set(n,this.bufferGeneration),this.renderer?.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength))),a.bindBuffer(a.ARRAY_BUFFER,null)}unbindProgram(e){this.isInstanced?(this.CONSTANT_ATTRIBUTES.forEach(t=>this.unbindAttribute(t,e,!1)),this.ATTRIBUTES.forEach(t=>this.unbindAttribute(t,e,!0))):this.ATTRIBUTES.forEach(t=>this.unbindAttribute(t,e))}bindAttribute(e,t,a,n){const r=er[e.type];if(typeof r!="number")throw new Error(`Program.bind: yet unsupported attribute type "${e.type}"`);const o=t.attributeLocations[e.name],s=t.gl;if(o!==-1){s.enableVertexAttribArray(o);const l=this.isInstanced?(n?this.ATTRIBUTES_ITEMS_COUNT:It(this.CONSTANT_ATTRIBUTES))*Float32Array.BYTES_PER_ELEMENT:this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT;s.vertexAttribPointer(o,e.size,e.type,e.normalized||!1,l,a),this.isInstanced&&n&&s.vertexAttribDivisor(o,1)}return e.size*r}unbindAttribute(e,t,a){const n=t.attributeLocations[e.name],r=t.gl;n!==-1&&(r.disableVertexAttribArray(n),this.isInstanced&&a&&r.vertexAttribDivisor(n,0))}reallocate(e){e!==this.capacity&&(this.capacity=e,this.verticesCount=this.VERTICES*e,this.floats=new Float32Array(this.isInstanced?this.capacity*this.ATTRIBUTES_ITEMS_COUNT:this.verticesCount*this.ATTRIBUTES_ITEMS_COUNT),this.ints=new Uint32Array(this.floats.buffer),this.invalidateBuffers())}invalidateBuffers(){this.bufferGeneration++,this.constantBufferGeneration++}hasNothingToRender(){return this.verticesCount===0}setTypedUniform(e,t){ii(t.gl,t.uniformLocations[e.name]??null,e)}renderProgram(e,t){const{gl:a,program:n,isPicking:r}=t;r?a.disable(a.BLEND):a.enable(a.BLEND),a.useProgram(n),this.setUniforms(e,t),this.drawWebGL(this.METHOD,t)}render(e,t,a){if(!this.shadersLogged&&this.renderer?.getSetting("DEBUG_logShaders")&&(this.shadersLogged=!0,console.log(`[sigma] DEBUG_logShaders: ${this.constructor.name}`,{normal:{vertexShaderSource:this.VERTEX_SHADER_SOURCE,fragmentShaderSource:this.FRAGMENT_SHADER_SOURCE},pick:{vertexShaderSource:nt(this.VERTEX_SHADER_SOURCE),fragmentShaderSource:nt(this.FRAGMENT_SHADER_SOURCE)}})),this.hasNothingToRender())return;this.renderOffset=t??0,this.renderCount=a??-1;const n=this.normalProgram.gl;if(n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,e.width*e.pixelRatio,e.height*e.pixelRatio),this.bindProgram(this.normalProgram),this.renderProgram(e,this.normalProgram),this.unbindProgram(this.normalProgram),this.pickProgram&&e.pickingFrameBuffer){const r=Math.ceil(e.width*e.pixelRatio/e.downSizingRatio),o=Math.ceil(e.height*e.pixelRatio/e.downSizingRatio);n.bindFramebuffer(n.FRAMEBUFFER,e.pickingFrameBuffer),n.viewport(0,0,r,o),this.bindProgram(this.pickProgram),this.renderProgram(e,this.pickProgram),this.unbindProgram(this.pickProgram),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,e.width*e.pixelRatio,e.height*e.pixelRatio)}}drawWebGL(e,{gl:t}){const a=this.renderCount>=0?this.renderCount:this.capacity;this.renderer?.getSetting("DEBUG_logRenderStats")&&(this.debugStats.drawCalls++,this.debugStats.verticesDrawn+=a*this.VERTICES),this.isInstanced?t.drawArraysInstanced(e,0,this.VERTICES,a):t.drawArrays(e,this.renderOffset*this.VERTICES,a*this.VERTICES)}}const rt=new Map;let Ri=!1;function tr(i){return new Promise((e,t)=>{const a=new FileReader;a.onload=()=>e(a.result),a.onerror=t,a.readAsDataURL(i)})}function ir(i){if(!rt.has(i)){const e=fetch(i).then(t=>t.blob()).then(tr).catch(()=>(rt.delete(i),null));rt.set(i,e)}return rt.get(i)}async function ar(i){const e=document.createElement("div");e.innerHTML=i;const a=Array.from(e.querySelectorAll("img[src]")).filter(n=>!n.getAttribute("src").startsWith("data:"));return await Promise.all(a.map(async n=>{const r=await ir(n.getAttribute("src"));r&&n.setAttribute("src",r)})),e.innerHTML}async function va(i,e=1){const t=i instanceof SVGElement?new XMLSerializer().serializeToString(i):i,r=new DOMParser().parseFromString(t,"image/svg+xml").querySelector("svg");if(!r)return null;let o=parseFloat(r.getAttribute("width")||""),s=parseFloat(r.getAttribute("height")||"");if(!(o>0)||!(s>0)){const c=r.getAttribute("viewBox");if(c){const f=c.trim().split(/[\s,]+/);o=parseFloat(f[2]),s=parseFloat(f[3])}}if(!(o>0)||!(s>0))return console.warn("Sigma: SVG label attachment has no parseable dimensions — skipped."),null;const l=Math.ceil(o*e),h=Math.ceil(s*e),d=new Blob([t],{type:"image/svg+xml"}),u=URL.createObjectURL(d);return new Promise(c=>{const f=new Image;f.onload=()=>{const g=document.createElement("canvas");g.width=l,g.height=h,g.getContext("2d").drawImage(f,0,0,l,h),URL.revokeObjectURL(u);try{g.getContext("2d").getImageData(0,0,1,1)}catch(b){if(b instanceof DOMException&&b.name==="SecurityError"){Ri||(Ri=!0,console.warn('Sigma: A label attachment was skipped because the rendered canvas is tainted. SVG with <foreignObject> (used by the "html" attachment type) is blocked in Chromium and Safari. Use type: "canvas" with Canvas 2D rendering instead.')),c(null);return}throw b}c(g)},f.onerror=()=>{URL.revokeObjectURL(u),c(null)},f.src=u})}function nr(i,e){const t=document.createElement("div");t.style.cssText="position:fixed;left:-99999px;top:0;visibility:hidden;width:max-content;height:max-content",t.innerHTML=(e?`<style>${e}</style>`:"")+i,document.body.appendChild(t);const{width:a,height:n}=t.getBoundingClientRect();return document.body.removeChild(t),{width:Math.ceil(a),height:Math.ceil(n)}}async function rr(i,e,t,a,n=1){const r=i instanceof HTMLElement?i.outerHTML:i,o=await ar(r);if(t==null||a==null){const u=nr(o,e);t=t??u.width,a=a??u.height}const s=Math.ceil(t*n),l=Math.ceil(a*n),h=e?`<style>${e}</style>`:"",d=`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${l}" viewBox="0 0 ${t} ${a}"><foreignObject width="${t}" height="${a}"><body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0">${h}${o}</body></foreignObject></svg>`;return va(d,1)}async function or(i,e=1){switch(i.type){case"canvas":return i.canvas;case"svg":return va(i.svg,e);case"html":return rr(i.html,i.css,i.width,i.height,e)}}const ge=2,ai=7,sr={below:0,above:1,left:2,right:3};function lr(){return`#version 300 es
precision highp float;

uniform mat3 u_matrix;
uniform vec2 u_resolution;
uniform float u_labelPixelSnapping;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;

uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

// Atlas size is fixed at 2048×2048 — matches AttachmentManager.ATLAS_SIZE.
uniform sampler2D u_atlasTexture;
const vec2 u_atlasSize = vec2(2048.0);

// Per-instance
in float a_nodeIndex;           // node-data texture index
in vec4 a_atlasRect;            // x, y, width, height in atlas pixels
in vec2 a_attachmentSize;       // attachment dimensions (CSS px)
in float a_positionMode;        // label position: 0=right 1=left 2=above 3=below 4=over
in float a_attachmentPlacement; // 0=below 1=above 2=left 3=right (relative to label)
in float a_labelWidth;          // label width (CSS px)
in float a_labelHeight;         // label height: font line box (CSS px)
in float a_textHeight;          // actual glyph height (CSS px)
in float a_labelAngle;          // label rotation angle (radians)

// Per-vertex (constant)
in vec2 a_quadCorner;           // [-1,-1], [1,-1], [-1,1], [1,1]

out vec2 v_texCoord;

${re}
${_e}
${Le}
${_a}
${Hn}

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePos = nodeData.xy;
  float nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; we just read the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  vec3 nodeClip = u_matrix * vec3(nodePos, 1.0);

  // Node radius in physical pixels (matches label/background).
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusPixels = nodeRadiusGraphSpace * matrixScaleX * u_resolution.x / 2.0;

  // CSS-px inputs -> physical px, scaled by the zoom-dependent label ratio, so
  // the attachment stays glued to the label box exactly as the label scales.
  float zoomScale = u_zoomLabelSizeRatio;
  vec2 labelHalf = vec2(a_labelWidth, a_labelHeight) * 0.5 * zoomScale * u_pixelRatio;
  vec2 attachHalf = a_attachmentSize * 0.5 * zoomScale * u_pixelRatio;
  float gap = ${ge.toFixed(1)} * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Graph-aligned labels add the camera angle so the attachment orbits with the box.
  mat2 labelRotMat = rotate2D(a_labelAngle - labelRotation * u_cameraAngle);

  // Label box center relative to the node center (pre-rotation). The shape-aware
  // edge distance comes from the frame texture, so placement matches the label.
  vec2 boxCenter = vec2(0.0);
  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * 0.5 * zoomScale * u_pixelRatio;
    boxCenter = labelBoxCenter(a_positionMode, labelStart, labelHalf, textHalf);
  }

  // Horizontal anchor of below/above attachments tracks the label position, so
  // the attachment hangs from the label edge nearest the node (or is centered
  // when the label itself is node-centered): right->left, left->right, else center.
  float anchorX = 0.0;
  if (a_positionMode < 0.5) anchorX = -labelHalf.x + attachHalf.x;       // right label
  else if (a_positionMode < 1.5) anchorX = labelHalf.x - attachHalf.x;   // left label

  // Attachment center relative to the box (pre-rotation, Y-down). This offset
  // depends only on the box, the gap and the attachment size — never the shape.
  vec2 attachCenter;
  if (a_attachmentPlacement < 0.5) {
    // below
    attachCenter = boxCenter + vec2(anchorX, labelHalf.y + gap + attachHalf.y);
  } else if (a_attachmentPlacement < 1.5) {
    // above
    attachCenter = boxCenter + vec2(anchorX, -(labelHalf.y + gap + attachHalf.y));
  } else if (a_attachmentPlacement < 2.5) {
    // left, top-aligned
    attachCenter = boxCenter + vec2(-(labelHalf.x + gap + attachHalf.x), -labelHalf.y + attachHalf.y);
  } else {
    // right, top-aligned
    attachCenter = boxCenter + vec2(labelHalf.x + gap + attachHalf.x, -labelHalf.y + attachHalf.y);
  }

  // Rotate the whole assembly by the label angle, around the node center.
  vec2 rotatedCenter = labelRotMat * attachCenter;
  vec2 cornerOffset = labelRotMat * (a_quadCorner * attachHalf);

  // Node center in screen px (Y-down).
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;

  // Snap node center to the pixel grid so label/backdrop/attachment move as one.
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Snap the quad's top-left to integer pixels so atlas texels map 1:1.
  vec2 centerScreen = nodeScreen + rotatedCenter + snapDelta;
  vec2 topLeft = centerScreen - attachHalf;
  topLeft = mix(topLeft, round(topLeft), u_labelPixelSnapping);
  centerScreen = topLeft + attachHalf;

  vec2 vertexScreen = centerScreen + cornerOffset;
  gl_Position = vec4(
    vertexScreen.x * 2.0 / u_resolution.x - 1.0,
    1.0 - vertexScreen.y * 2.0 / u_resolution.y,
    0.0, 1.0
  );

  vec2 texOrigin = a_atlasRect.xy / u_atlasSize;
  vec2 texSize = a_atlasRect.zw / u_atlasSize;
  vec2 uv = (a_quadCorner + 1.0) / 2.0;
  v_texCoord = texOrigin + uv * texSize;
}
`}const dr=`#version 300 es
precision highp float;

uniform sampler2D u_atlasTexture;

in vec2 v_texCoord;

layout(location = 0) out vec4 fragColor;
#ifdef PICKING_MODE
layout(location = 1) out vec4 pickColor;
#endif

void main() {
  // Canvas textures are premultiplied; output directly for (ONE, 1-SRC_ALPHA) blending
  vec4 color = texture(u_atlasTexture, v_texCoord);
  if (color.a < 0.01) discard;
  fragColor = color;
#ifdef PICKING_MODE
  pickColor = vec4(0.0); // Attachments are not pickable
#endif
}
`;function hr(i,e,t,a){const{label:n={}}=a,r=n.margin??Ze,o=n.zoomToLabelSizeRatioFunction??(()=>1),s=lr(),l=dr;class h extends Te{constructor(){super(...arguments),this.totalCount=0,this.bufferCapacity=0}static{this.labelMargin=r}getDefinition(){const{FLOAT:u,TRIANGLE_STRIP:c}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:s,FRAGMENT_SHADER_SOURCE:l,METHOD:c,UNIFORMS:["u_matrix","u_resolution","u_labelPixelSnapping","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_atlasTexture"],ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:u},{name:"a_atlasRect",size:4,type:u},{name:"a_attachmentSize",size:2,type:u},{name:"a_positionMode",size:1,type:u},{name:"a_attachmentPlacement",size:1,type:u},{name:"a_labelWidth",size:1,type:u},{name:"a_labelHeight",size:1,type:u},{name:"a_textHeight",size:1,type:u},{name:"a_labelAngle",size:1,type:u}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:u}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}processAttachment(u,c){const{floats:f}=this;let g=u*this.STRIDE;f[g++]=c.nodeIndex,f[g++]=c.atlasX,f[g++]=c.atlasY,f[g++]=c.atlasW,f[g++]=c.atlasH,f[g++]=c.attachWidth,f[g++]=c.attachHeight,f[g++]=c.positionMode,f[g++]=c.attachmentPlacement,f[g++]=c.labelWidth,f[g++]=c.labelHeight,f[g++]=c.textHeight,f[g++]=c.labelAngle}setUniforms(u,{gl:c,uniformLocations:f}){c.uniformMatrix3fv(f.u_matrix,!1,u.matrix),c.uniform2f(f.u_resolution,u.width*u.pixelRatio,u.height*u.pixelRatio),c.uniform1f(f.u_labelPixelSnapping,u.labelPixelSnapping),c.uniform1f(f.u_sizeRatio,u.sizeRatio),c.uniform1f(f.u_correctionRatio,u.correctionRatio),c.uniform1f(f.u_cameraAngle,u.cameraAngle),c.uniform1f(f.u_pixelRatio,u.pixelRatio),c.uniform1f(f.u_labelMargin,h.labelMargin),c.uniform1f(f.u_zoomLabelSizeRatio,1/o(u.zoomRatio)),c.uniform1i(f.u_nodeDataTexture,u.nodeDataTextureUnit),c.uniform1i(f.u_nodeDataTextureWidth,u.nodeDataTextureWidth),c.uniform1i(f.u_nodeFrameTexture,u.nodeFrameTextureUnit),c.uniform1i(f.u_nodeFrameTextureWidth,u.nodeFrameTextureWidth),c.uniform1i(f.u_atlasTexture,ai)}reallocateAttachments(u){this.totalCount=u,u>this.bufferCapacity&&(this.bufferCapacity=Math.max(u,Math.ceil(this.bufferCapacity*1.5)||10),super.reallocate(this.bufferCapacity))}hasNothingToRender(){return this.totalCount===0}drawWebGL(u,{gl:c}){this.totalCount!==0&&c.drawArraysInstanced(u,0,this.VERTICES,this.totalCount)}}return new h(i,e,t)}const Se=2048;class ur{constructor(e,t,a){this.cache=new Map,this.pending=new Set,this.atlas={},this.glTexture=null,this.dirty=!0,this.gl=e,this.renderers=t,this.scheduleRender=a,this.packCanvas=document.createElement("canvas"),this.packCanvas.width=Se,this.packCanvas.height=Se,this.packCtx=this.packCanvas.getContext("2d")}renderAttachment(e,t,a){const n=`${e}:${t}`;if(this.cache.has(n)||this.pending.has(n))return;const r=this.renderers[t];if(!r)return;const o=r(a);if(!o)return;this.pending.add(n);const{pixelRatio:s}=a;Promise.resolve(o).then(async l=>{if(!this.pending.has(n)||(this.pending.delete(n),!l))return;const h=await or(l,s);!h||h.width===0||h.height===0||(this.cache.set(n,{image:h,width:h.width,height:h.height}),this.dirty=!0,this.scheduleRender())})}regenerateAtlas(){if(!this.dirty)return;this.dirty=!1;const e=[];if(this.cache.forEach((s,l)=>{e.push({key:l,width:s.width,height:s.height,draw:(h,d,u)=>{h.drawImage(s.image,d,u)}})}),e.length===0){this.atlas={},this.deleteGLTexture();return}const t={x:0,y:0,rowHeight:0,maxRowWidth:0};this.packCtx.clearRect(0,0,Se,Se);const{atlas:a,remaining:n}=kn(e,this.packCtx,t);this.atlas=a,n.length>0&&console.warn(`Sigma: ${n.length} label attachment(s) could not fit in the ${Se}x${Se} atlas and will not be rendered.`),this.deleteGLTexture();const r=this.gl,o=r.createTexture();r.activeTexture(r.TEXTURE0+ai),r.bindTexture(r.TEXTURE_2D,o),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,this.packCanvas),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),this.glTexture=o}bindTexture(e){if(!this.glTexture)return;const t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.glTexture)}getEntry(e,t){const a=`${e}:${t}`;return this.atlas[a]||null}invalidateNode(e){const t=`${e}:`;for(const a of this.cache.keys())a.startsWith(t)&&(this.cache.delete(a),this.dirty=!0);for(const a of this.pending)a.startsWith(t)&&this.pending.delete(a)}restore(){this.glTexture=null,this.dirty=!0}clear(){this.cache.clear(),this.pending.clear(),this.atlas={},this.dirty=!0,this.deleteGLTexture()}kill(){this.clear(),this.packCanvas=null,this.packCtx=null,this.gl=null}deleteGLTexture(){this.glTexture&&(this.gl.deleteTexture(this.glTexture),this.glTexture=null)}}const he=5;function Dt(i,e){return[...e,...i.map(t=>({attributes:t.attributes??[]}))]}function Pe(i,e){const t=q(Dt(i,e)),a=new Set(i.flatMap(o=>o.attributes??[]).map(o=>o.name.replace(/^a_/,""))),n={},r={};for(const o of a)n[o]=t.offsets[o],r[o]=t.specs[o];return{...t,offsets:n,specs:r}}function cr(i,e){const t=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_pickingPadding","u_nodeDataTexture","u_layerAttributeTexture"]),a=new Set,n=i.flatMap(c=>c.uniforms).filter(c=>t.has(c.name)||a.has(c.name)?!1:(a.add(c.name),!0)).map(c=>`uniform ${c.type} ${c.name};`).join(`
`),r=e.flatMap(c=>c.uniforms).filter(c=>t.has(c.name)||a.has(c.name)?!1:(a.add(c.name),!0)).map(c=>`uniform ${c.type} ${c.name};`).join(`
`),o=Dt(i,e),s=new Set,l=o.flatMap(c=>c.attributes).filter(c=>{const f=c.name.replace(/^a_/,"");return s.has(f)?!1:(s.add(f),!0)}).map(c=>{const f=c.name.replace(/^a_/,"");return`out ${c.size===1?"float":`vec${c.size}`} v_${f};`}).join(`
`),{fetchCode:h,varyingAssignments:d}=Ce(q(o),{varPrefix:"layer",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"});return`#version 300 es

// Standard node attributes (per instance) - minimal buffer usage
in float a_nodeIndex;  // Index into node data texture AND layer attribute texture
in vec4 a_id;          // Node ID for picking
in float a_opacity;    // Node opacity, applied once to the final fragment

// Constant attributes (per vertex, same for all instances)
in vec2 a_quadCorner;  // (-1,-1), (1,-1), (1,1), (-1,1) for quad corners

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;

// Layer attribute texture uniforms
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

${n}
${r}

// Standard varyings
out vec2 v_uv;                    // Normalized coordinates [-1, 1]
out vec4 v_id;
out float v_opacity;
out float v_antialiasingWidth;    // Width for antialiasing in UV space
out float v_pixelSize;            // Node size in pixels (for pixel-mode borders)
out float v_pixelToUV;            // Conversion factor: multiply by this to convert screen pixels to UV units
out float v_shapeId;              // Shape ID for multi-shape programs

// Layer varyings
${l}

// Node-data fetch helpers (geometry texel + rotation-flags texel)
${re}
${_e}

void main() {
  // Fetch node geometry: vec4(x, y, size, shapeId).
  int nodeIdx = int(a_nodeIndex);

  // Hidden nodes are flagged with a negative row by NodeProgram.process(). Push
  // the whole quad outside the clip volume: every vertex lands at the same
  // out-of-range position, so the primitive is fully clipped and rasterizes
  // nothing — neither to the frame buffer nor to the picking buffer.
  if (nodeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    return;
  }

  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_position = nodeData.xy;
  float a_size = nodeData.z;
  v_shapeId = nodeData.w;  // Pass shape ID to fragment shader

  // Per-node rotation alignment: 0 = viewport (screen-upright), 1 = graph.
  float nodeRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).r;

${h}

  // Calculate the actual size in pixels
  float size = a_size * u_correctionRatio / u_sizeRatio * 2.0;

  // In PICKING_MODE, inflate the quad by nodePickingPadding pixels on each side
  #ifdef PICKING_MODE
    float paddedSize = size + u_pickingPadding * u_correctionRatio;
    vec2 offset = a_quadCorner * paddedSize;
  #else
    vec2 offset = a_quadCorner * size;
  #endif
  // Counter-rotate the quad offset so viewport-aligned nodes stay upright as the
  // camera turns. Graph-aligned nodes (nodeRotation=1) skip it and turn with the
  // camera. The angle scales by (1 - nodeRotation) so both fall out of one path.
  {
    float ca = u_cameraAngle * (1.0 - nodeRotation);
    float c = cos(ca);
    float s = sin(ca);
    offset = mat2(c, s, -s, c) * offset;
  }
  vec2 position = a_position + offset;

  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  // In PICKING_MODE, UV is scaled beyond [-1, 1] to match the inflated quad
  #ifdef PICKING_MODE
    v_uv = a_quadCorner * (paddedSize / size);
  #else
    v_uv = a_quadCorner;
  #endif

  // Pass ID to fragment shader
  v_id = a_id;
  v_opacity = a_opacity;

  // Pass pixel size for layers that need pixel-mode calculations
  // Multiply by 2 because 'size' is half-width (offset from center), not full diameter
  v_pixelSize = size * 2.0;

  // Conversion factor from screen pixels to UV units
  // Same derivation as v_antialiasingWidth which represents ~1 pixel in UV space
  // P pixels in UV space = P * u_correctionRatio / size
  v_pixelToUV = u_correctionRatio / size;

  // We use an antialiasing width of 1px (so v_pixelToUV)
  v_antialiasingWidth = v_pixelToUV;

  // Pass layer attributes to fragment shader (fetched from texture)
${d}
}
`}function fr(i,e,t,a=!0){const n=e.map((g,b)=>{const p=`layer_${g.name}`,m=[...g.attributes.map(y=>`v_${y.name.replace(/^a_/,"")}`),...g.uniforms.map(y=>y.name)].join(", ");return`  // Layer ${b+1}: ${g.name}
  color = blendOver(color, ${p}(${m}));`}).join(`

`),r=new Set(["u_correctionRatio"]),o=new Set,s=i.flatMap(g=>g.uniforms).filter(g=>r.has(g.name)||o.has(g.name)?!1:(o.add(g.name),!0)).map(g=>`uniform ${g.type} ${g.name};`).join(`
`),l=e.flatMap(g=>g.uniforms).filter(g=>r.has(g.name)||o.has(g.name)?!1:(o.add(g.name),!0)).map(g=>`uniform ${g.type} ${g.name};`).join(`
`),h=new Set,d=Dt(i,e).flatMap(g=>g.attributes).filter(g=>{const b=g.name.replace(/^a_/,"");return h.has(b)?!1:(h.add(b),!0)}).map(g=>{const b=g.name.replace(/^a_/,"");return`in ${g.size===1?"float":`vec${g.size}`} v_${b};`}).join(`
`),u=Jt(i),c=On(i,t);return`#version 300 es
precision highp float;

// Standard varyings
in vec2 v_uv;
in vec4 v_id;
in float v_opacity;
in float v_antialiasingWidth;
in float v_pixelSize;
in float v_pixelToUV;
in float v_shapeId;  // Shape ID for multi-shape programs

// Standard uniforms (needed for some layer calculations like pixel-mode borders)
uniform float u_correctionRatio;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Shape uniforms
${s}

// Layer uniforms
${l}

// Layer varyings
${d}

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

// LayerContext struct - provides rendering context to all layers
struct LayerContext {
  float sdf;             // Signed distance from shape boundary (negative inside)
  vec2 uv;               // UV coordinates [-1, 1], center at (0,0)
  float shapeSize;       // Effective shape size (~diameter) in UV space (1.0 - aaWidth)
  float shapeHalfSize;   // Effective shape half size (~radius) in UV space
  float pixelSize;       // Node full size (~diameter) in screen pixels
  float aaWidth;         // Anti-aliasing width for smooth transitions
  float correctionRatio; // Scaling factor for consistent rendering across zoom levels
  float pixelToUV;       // Conversion factor: multiply screen pixels by this to get UV units
  float inradiusFactor;  // Ratio of inradius to circumradius (shape depth factor)
};

LayerContext context;  // Global instance, populated before layer calls

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// SDF shape functions
${u}

// Shape selector function (sets context.sdf and context.inradiusFactor)
${c}

// Layer functions
${e.map(g=>g.glsl).join(`

`)}

void main() {
  // 1. Setup LayerContext (available to all layer functions)
  context.shapeSize = 1.0 - v_antialiasingWidth;
  context.shapeHalfSize = context.shapeSize * 0.5;
  context.pixelSize = v_pixelSize;
  context.uv = v_uv;
  context.aaWidth = v_antialiasingWidth;
  context.correctionRatio = u_correctionRatio;
  context.pixelToUV = v_pixelToUV;

  // Query shape SDF based on shapeId (sets context.sdf and context.inradiusFactor)
  queryNodeSDF(int(v_shapeId), v_uv, context.shapeSize);

  // 2. Early discard for pixels fully outside the shape (with AA margin)
  // In PICKING_MODE, allow extra fragments up to the picking padding distance
  #ifdef PICKING_MODE
    if (context.sdf > u_pickingPadding * v_pixelToUV + context.aaWidth) discard;
  #else
    if (context.sdf > context.aaWidth) discard;
  #endif

  // 3. Apply layers sequentially with "over" compositing
  vec4 color = vec4(0.0);

${n}

  #ifdef PICKING_MODE
    // Picking pass: output node ID for pixels within the picking area.
    if (context.sdf > u_pickingPadding * v_pixelToUV) discard;
    fragColor = v_id;
  #else
${a?`    // Visual pass: apply antialiasing at shape boundary, node opacity once
    // smoothstep provides smooth transition from opaque to transparent
    float alpha = smoothstep(context.aaWidth, -context.aaWidth, context.sdf) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) shape boundary, node opacity applied once
    float alpha = (context.sdf < 0.0 ? 1.0 : 0.0) * v_opacity;`}
    // Mix with transparent to fade both color AND alpha together (avoids bright halo)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`}function gr(i,e){const t=new Set;return t.add("u_matrix"),t.add("u_sizeRatio"),t.add("u_correctionRatio"),t.add("u_cameraAngle"),t.add("u_pickingPadding"),t.add("u_nodeDataTexture"),t.add("u_nodeDataTextureWidth"),t.add("u_layerAttributeTexture"),t.add("u_layerAttributeTextureWidth"),t.add("u_layerAttributeTexelsPerNode"),i.forEach(a=>{a.uniforms.forEach(n=>t.add(n.name))}),e.forEach(a=>{a.uniforms.forEach(n=>t.add(n.name))}),Array.from(t)}function pr(i){const{UNSIGNED_BYTE:e,FLOAT:t}=WebGL2RenderingContext;return[{name:"a_nodeIndex",size:1,type:t},{name:"a_id",size:4,type:e,normalized:!0},{name:"a_opacity",size:1,type:t}]}function Ci(i){const{shapes:e,layers:t,shapeGlobalIds:a,antialias:n=!0}=i;return{vertexShader:cr(e,t),fragmentShader:fr(e,t,a,n),uniforms:gr(e,t),attributes:pr()}}function Sa(i,e,t){const{specs:a}=Pe(i,e);return Object.keys(a).map(n=>`flat ${t} ${a[n].size===1?"float":`vec${a[n].size}`} v_${n};`).join(`
`)}function mr(i){const{shapes:e,layers:t,shapeGlobalIds:a}=i,n=Ce(Pe(e,t),{varPrefix:"nodeAttr",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),r=e.length===1?`float inradiusFactor = ${W(e[0].inradiusFactor??1)};`:`float inradiusFactor = ${W(e[0].inradiusFactor??1)};
  switch (int(shapeId)) {
${e.map((s,l)=>`    case ${a?a[l]:l}: inradiusFactor = ${W(s.inradiusFactor??1)}; break;`).join(`
`)}
    default: break;
  }`;return`#version 300 es

in float a_nodeIndex;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in vec4 a_backdropColor;
in vec4 a_backdropShadowColor;
in float a_backdropShadowBlur;
in float a_backdropPadding;
in vec4 a_backdropBorderColor;
in vec4 a_backdropExtra; // [borderWidth, cornerRadius, labelPadding, area]
in vec2 a_labelBoxOffset;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

out vec2 v_uv;
out vec2 v_nodeCenter;
out float v_nodeRadius;
out vec2 v_labelCenter;
out vec2 v_labelHalfSize;
out float v_aaWidth;
out float v_shapeId;
out float v_nodeRotation;
out float v_labelAngle;
out vec4 v_backdropColor;
out vec4 v_backdropShadowColor;
out float v_backdropShadowBlur;
out float v_backdropPadding;
out vec4 v_backdropBorderColor;
out float v_backdropBorderWidth;
out float v_backdropCornerRadius;
out float v_backdropArea;
${Sa(e,t,"out")}

${re}
${_e}
${Le}

void main() {
  int nodeIdx = int(a_nodeIndex);
${n.fetchCode}
${n.varyingAssignments}

  // Node data: (x, y, size, shapeId). shapeId (global) is forwarded to the
  // fragment shader, which keeps the shape SDF for the outline.
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;
  float shapeId = nodeData.w;

  // Per-node rotation alignment (0 = viewport, 1 = graph). nodeRotation drives
  // the fragment's shape outline; labelRotation turns the label box with camera.
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;
  v_nodeRotation = nodeRotation;

  ${xa}
  // CSS pixel attributes are multiplied by u_pixelRatio to match nodeRadiusPixels,
  // which is already in physical pixels (nodeRadiusNDC * u_resolution.x / 2.0).
  float padding = a_backdropPadding * u_pixelRatio;
  float shadowBlur = a_backdropShadowBlur * u_pixelRatio;
  // Unpack a_backdropExtra: [borderWidth, cornerRadius, labelPadding, area]
  float borderWidth = a_backdropExtra.x * u_pixelRatio;
  float cornerRadius = a_backdropExtra.y * u_pixelRatio;
  float labelPad = a_backdropExtra.z * u_pixelRatio;
  float backdropArea = a_backdropExtra.w;
  // Use 2x shadowBlur so the Gaussian fully decays before the quad edge
  float totalExpansion = shadowBlur * 2.0 + borderWidth;
  float enlargedRadius = nodeRadiusPixels + padding;

  // Circumscribed radius for the quad bounds. Non-circular shapes reach past
  // their inradius out to their circumradius (= enlargedRadius / inradiusFactor),
  // in any direction once rotated. The axis-aligned quad must contain that, or
  // the fill/shadow gets clipped (square corners, triangle tip, etc.).
  ${r}
  float boundRadius = enlargedRadius / inradiusFactor;

  // Apply zoom-dependent label size scaling
  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Only apply labelPad when a label is actually present
  float effectiveLabelPad = labelW > 0.0 ? labelPad : 0.0;
  vec2 labelHalfSize = vec2(labelW * 0.5 + effectiveLabelPad, labelH * 0.5 + effectiveLabelPad);
  vec2 labelOffset = vec2(0.0);

  // Effective label angle: intrinsic angle plus the camera angle when the label
  // is graph-aligned, so the box orbits the node in lockstep with the frame-pass.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 snapDelta = vec2(0.0);

  if (labelW > 0.0) {
    // labelW > 0.0 means this node's label is displayed, so the frame-pass wrote
    // its edge distance this frame.
    float edgeDistPixels = nodeRadiusPixels * readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;
    // labelMargin matches the label shader's margin (gap from node edge to text)
    float labelStart = edgeDistPixels + labelMargin;
    // Above/below center on the actual glyph height, not the font line box, so
    // the box stays aligned with the rendered text (matches labelBoxCenter()).
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;

    // Snap node center to pixel grid so label/backdrop/attachment move as a unit
    vec2 nodeScreen = vec2(
      (nodeClip.x + 1.0) * u_resolution.x,
      (1.0 - nodeClip.y) * u_resolution.y
    ) * 0.5;
    snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

    if (a_positionMode < 0.5) {
      // Right: box spans from node center to text end + padding
      float boxRightEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(boxRightEdge * 0.5, 0.0);
      labelHalfSize.x = boxRightEdge * 0.5;
    } else if (a_positionMode < 1.5) {
      // Left: mirror of right
      float boxLeftEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(-boxLeftEdge * 0.5, 0.0);
      labelHalfSize.x = boxLeftEdge * 0.5;
    } else if (a_positionMode < 2.5) {
      // Above: text bottom at labelStart, centered horizontally
      labelOffset = vec2(0.0, -(labelStart + textHalf));
    } else if (a_positionMode < 3.5) {
      // Below: text top at labelStart, centered horizontally
      labelOffset = vec2(0.0, labelStart + textHalf);
    }
    // over (>=4): labelOffset stays (0,0) — text centered on the node.

    // The attachment-cover shift is in label space (like the attachment itself),
    // so rotate it together with the position offset — otherwise the box drifts
    // off the attachment as the label angle grows.
    labelOffset = labelRotMat * (labelOffset + a_labelBoxOffset * zoomScale * u_pixelRatio);
  }

  // For node-only mode, zero out label dimensions
  if (backdropArea > 0.5 && backdropArea < 1.5) {
    labelHalfSize = vec2(0.0);
    labelOffset = vec2(0.0);
  }

  vec2 minBound, maxBound;

  bool hasLabelBounds = labelW > 0.0 && (backdropArea > 1.5 || backdropArea < 0.5);

  if (hasLabelBounds) {
    // Union with label bounds (area=both) or label-only bounds (area=label)
    vec2 labelMin, labelMax;

    if (a_labelAngle != 0.0) {
      vec2 corner1 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, -labelHalfSize.y);
      vec2 corner2 = labelOffset + labelRotMat * vec2(labelHalfSize.x, -labelHalfSize.y);
      vec2 corner3 = labelOffset + labelRotMat * vec2(labelHalfSize.x, labelHalfSize.y);
      vec2 corner4 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, labelHalfSize.y);
      labelMin = min(min(corner1, corner2), min(corner3, corner4));
      labelMax = max(max(corner1, corner2), max(corner3, corner4));
    } else {
      labelMin = labelOffset - labelHalfSize;
      labelMax = labelOffset + labelHalfSize;
    }

    if (backdropArea > 1.5) {
      // Label-only: bounds from label rect only
      minBound = labelMin - totalExpansion;
      maxBound = labelMax + totalExpansion;
    } else {
      // Both: union of node + label
      minBound = min(-vec2(boundRadius), labelMin) - totalExpansion;
      maxBound = max(vec2(boundRadius), labelMax) + totalExpansion;
    }
  } else {
    // Node-only or no visible label
    float totalRadius = boundRadius + totalExpansion;
    minBound = -vec2(totalRadius);
    maxBound = vec2(totalRadius);
  }

  vec2 quadSize = maxBound - minBound;
  vec2 quadCenter = (minBound + maxBound) * 0.5;

  vec2 localPos = quadCenter + a_quadCorner * quadSize * 0.5 + snapDelta;
  vec2 ndcOffset = localPos * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);

  v_uv = localPos;
  v_nodeCenter = vec2(0.0);
  v_nodeRadius = nodeRadiusPixels;
  v_labelCenter = labelOffset;
  v_labelHalfSize = labelHalfSize;
  v_aaWidth = 1.0;
  v_shapeId = shapeId;
  v_labelAngle = labelAngle;
  v_backdropColor = a_backdropColor;
  v_backdropShadowColor = a_backdropShadowColor;
  v_backdropShadowBlur = a_backdropShadowBlur;
  v_backdropPadding = a_backdropPadding;
  v_backdropBorderColor = a_backdropBorderColor;
  v_backdropBorderWidth = borderWidth;
  v_backdropCornerRadius = cornerRadius;
  v_backdropArea = backdropArea;
}
`}function br(i){const{shapes:e,layers:t,shapeGlobalIds:a}=i,n=Jt(e),r=Qe(e).map(d=>`uniform ${d.type} ${d.name};`).join(`
`),o=d=>vt(d,"nodeUV","1.0");let s;if(e.length===1)s=`float nodeSdfNormalized = ${o(e[0])};`;else{const d=e.map((c,f)=>`    case ${a?a[f]:f}: nodeSdfNormalized = ${o(c)}; break;`).join(`
`),u=o(e[0]);s=`float nodeSdfNormalized;
  int shapeId = int(v_shapeId);
  switch (shapeId) {
${d}
    default: nodeSdfNormalized = ${u};
  }`}return`#version 300 es
precision highp float;

in vec2 v_uv;
in vec2 v_nodeCenter;
in float v_nodeRadius;
in vec2 v_labelCenter;
in vec2 v_labelHalfSize;
in float v_aaWidth;
in float v_shapeId;
in float v_nodeRotation;
in float v_labelAngle;
in vec4 v_backdropColor;
in vec4 v_backdropShadowColor;
in float v_backdropShadowBlur;
in float v_backdropPadding;
in vec4 v_backdropBorderColor;
in float v_backdropBorderWidth;
in float v_backdropCornerRadius;
in float v_backdropArea;
${Sa(e,t,"in")}

uniform float u_cameraAngle;
${r}

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 fragPicking;

${n}
${Vn}
${Xn}
${jn}
${qn}

void main() {
  vec4 backdropColor = v_backdropColor;
  vec4 shadowColor = v_backdropShadowColor;
  float shadowBlur = v_backdropShadowBlur;
  float padding = v_backdropPadding;
  vec4 borderColor = v_backdropBorderColor;
  float borderWidth = v_backdropBorderWidth;
  float cornerRadius = v_backdropCornerRadius;

  float enlargedRadius = v_nodeRadius + padding;
  vec2 screenUV = v_uv - v_nodeCenter;
  float effectiveRadius = max(enlargedRadius - cornerRadius, 0.01);
  float ca = u_cameraAngle * v_nodeRotation;
  float ca_c = cos(ca);
  float ca_s = sin(ca);
  vec2 rotatedScreenUV = mat2(ca_c, -ca_s, ca_s, ca_c) * screenUV;
  vec2 nodeUV = vec2(rotatedScreenUV.x, -rotatedScreenUV.y) / effectiveRadius;

  // Query the correct shape SDF based on shapeId
  ${s}
  float nodeSdfPixels = nodeSdfNormalized * effectiveRadius - cornerRadius;

  // Label SDF with optional corner radius and rotation
  float labelSdfPixels;
  if (v_labelHalfSize.x > 0.0) {
    vec2 labelP = v_uv - v_labelCenter;
    labelSdfPixels = sdfRoundedRotatedBox(labelP, v_labelHalfSize, v_labelAngle, cornerRadius);
  } else {
    labelSdfPixels = 10000.0;
  }

  // Select area: 0=both, 1=node, 2=label
  float combinedSdf;
  if (v_backdropArea > 1.5) {
    combinedSdf = labelSdfPixels;
  } else if (v_backdropArea > 0.5) {
    combinedSdf = nodeSdfPixels;
  } else {
    combinedSdf = min(nodeSdfPixels, labelSdfPixels);
  }

  // Fill + border composite
  float outerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf);
  vec4 background;
  if (borderWidth > 0.5) {
    float innerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf + borderWidth);
    float fillAlpha = innerEdge * backdropColor.a;
    vec4 fill = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
    float borderAlpha = (outerEdge - innerEdge) * borderColor.a;
    vec4 border = vec4(borderColor.rgb * borderAlpha, borderAlpha);
    background = fill + border * (1.0 - fill.a);
  } else {
    float fillAlpha = outerEdge * backdropColor.a;
    background = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
  }

  // Gaussian-like shadow falloff (mimics canvas shadowBlur)
  vec4 shadow = vec4(0.0);
  float sigma = shadowBlur / 2.5;
  if (sigma > 0.001) {
    float shadowDist = max(0.0, combinedSdf);
    float shadowAlpha = exp(-(shadowDist * shadowDist) / (2.0 * sigma * sigma)) * shadowColor.a;
    shadow = vec4(shadowColor.rgb * shadowAlpha, shadowAlpha);
  }

  fragColor = background + shadow * (1.0 - background.a);
  fragPicking = vec4(0.0);
}
`}function xr(i){const e=["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_labelPixelSnapping","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode"];for(const t of Qe(i))e.includes(t.name)||e.push(t.name);return e}function yr(i){return{vertexShader:mr(i),fragmentShader:br(i),uniforms:xr(i.shapes)}}function _r(i,e,t,a){const{label:n={},shapes:r,layers:o,getAttributeTexture:s,shapeGlobalIds:l}=a;if(r.length===0)throw new Error("createBackdropProgram: at least one shape must be provided in 'shapes'");const h=n.margin??5,d=n.zoomToLabelSizeRatioFunction??(()=>1),c=yr({shapes:r,layers:o,shapeGlobalIds:l});class f extends Te{constructor(){super(...arguments),this.totalBackdropCount=0,this.bufferCapacity=0}static{this.labelMargin=h}getDefinition(){const{FLOAT:b,TRIANGLE_STRIP:p}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:c.vertexShader,FRAGMENT_SHADER_SOURCE:c.fragmentShader,METHOD:p,UNIFORMS:c.uniforms,ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:b},{name:"a_labelWidth",size:1,type:b},{name:"a_labelHeight",size:1,type:b},{name:"a_textHeight",size:1,type:b},{name:"a_positionMode",size:1,type:b},{name:"a_labelAngle",size:1,type:b},{name:"a_backdropColor",size:4,type:b},{name:"a_backdropShadowColor",size:4,type:b},{name:"a_backdropShadowBlur",size:1,type:b},{name:"a_backdropPadding",size:1,type:b},{name:"a_backdropBorderColor",size:4,type:b},{name:"a_backdropExtra",size:4,type:b},{name:"a_labelBoxOffset",size:2,type:b}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:b}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}processBackdrop(b,p){const{floats:m,STRIDE:y}=this;let v=b*y;m[v++]=p.nodeIndex,m[v++]=p.labelWidth,m[v++]=p.labelHeight,m[v++]=p.textHeight,m[v++]=He[p.position],m[v++]=p.labelAngle,m[v++]=p.backdropColor[0],m[v++]=p.backdropColor[1],m[v++]=p.backdropColor[2],m[v++]=p.backdropColor[3],m[v++]=p.backdropShadowColor[0],m[v++]=p.backdropShadowColor[1],m[v++]=p.backdropShadowColor[2],m[v++]=p.backdropShadowColor[3],m[v++]=p.backdropShadowBlur,m[v++]=p.backdropPadding,m[v++]=p.backdropBorderColor[0],m[v++]=p.backdropBorderColor[1],m[v++]=p.backdropBorderColor[2],m[v++]=p.backdropBorderColor[3],m[v++]=p.backdropBorderWidth,m[v++]=p.backdropCornerRadius,m[v++]=p.backdropLabelPadding,m[v++]=p.backdropArea,m[v++]=p.labelBoxOffset[0],m[v++]=p.labelBoxOffset[1]}setUniforms(b,p){const{gl:m,uniformLocations:y}=p;m.uniformMatrix3fv(y.u_matrix,!1,b.matrix),m.uniform1f(y.u_sizeRatio,b.sizeRatio),m.uniform1f(y.u_correctionRatio,b.correctionRatio),m.uniform1f(y.u_cameraAngle,b.cameraAngle),m.uniform2f(y.u_resolution,b.width*b.pixelRatio,b.height*b.pixelRatio),m.uniform1f(y.u_pixelRatio,b.pixelRatio),m.uniform1f(y.u_labelMargin,f.labelMargin),m.uniform1f(y.u_zoomLabelSizeRatio,1/d(b.zoomRatio)),m.uniform1f(y.u_labelPixelSnapping,b.labelPixelSnapping),m.uniform1i(y.u_nodeDataTexture,b.nodeDataTextureUnit),m.uniform1i(y.u_nodeDataTextureWidth,b.nodeDataTextureWidth),m.uniform1i(y.u_nodeFrameTexture,b.nodeFrameTextureUnit),m.uniform1i(y.u_nodeFrameTextureWidth,b.nodeFrameTextureWidth);const v=s();y.u_layerAttributeTexture&&v&&(v.bind(he),m.uniform1i(y.u_layerAttributeTexture,he),m.uniform1i(y.u_layerAttributeTextureWidth,v.getTextureWidth()),m.uniform1i(y.u_layerAttributeTexelsPerNode,v.getTexelsPerItem()));for(const _ of Qe(r))this.setTypedUniform(_,p)}hasNothingToRender(){return this.totalBackdropCount===0}drawWebGL(b,{gl:p}){this.totalBackdropCount!==0&&(this.isInstanced?p.drawArraysInstanced(b,0,this.VERTICES,this.totalBackdropCount):p.drawArrays(b,0,this.totalBackdropCount*this.VERTICES))}reallocate(b){this.totalBackdropCount=b,b>this.bufferCapacity&&(this.bufferCapacity=Math.max(b,Math.ceil(this.bufferCapacity*1.5)||10),super.reallocate(this.bufferCapacity))}}return new f(i,e,t)}class Ea extends Te{constructor(){super(...arguments),this.totalCharacterCount=0,this.bufferCapacity=0}processLabel(e,t,a){if(a.hidden||!a.text)return 0;const n=a.text,r=n.length;for(let o=0;o<r;o++){const s=n[o];this.processCharacter(t+o,a,s,o)}return r}hasNothingToRender(){return this.totalCharacterCount===0}drawWebGL(e,{gl:t}){this.totalCharacterCount!==0&&(this.isInstanced?t.drawArraysInstanced(e,0,this.VERTICES,this.totalCharacterCount):t.drawArrays(e,0,this.totalCharacterCount*this.VERTICES))}reallocate(e){this.totalCharacterCount=e,e>this.bufferCapacity&&(this.bufferCapacity=Math.max(e,Math.ceil(this.bufferCapacity*1.5)||1e3),super.reallocate(this.bufferCapacity))}}function Tr(){return`#version 300 es

in float a_nodeIndex;
in vec4 a_id;
in vec4 a_color;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in float a_padding;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pickingPadding;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

out vec4 v_id;
out vec4 v_color;

${re}
${_e}
${Le}
${_a}

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;

  // Shape-aware edge distance, read once from the shared frame texture.
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  ${xa}

  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;
#ifdef PICKING_MODE
  float padding = u_pickingPadding * u_pixelRatio;
#else
  float padding = a_padding * u_pixelRatio;
#endif

  if (labelW <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    v_color = vec4(0.0);
    return;
  }

  vec2 labelHalfSize = vec2(labelW * 0.5 + padding, labelH * 0.5 + padding);
  vec2 labelOffset = vec2(0.0);

  // Graph-aligned labels add the camera angle so the rect orbits with the text.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;
    // Box center uses the text half-size; the padding expands the quad below.
    labelOffset = labelRotMat * labelBoxCenter(a_positionMode, labelStart, vec2(labelW * 0.5, labelH * 0.5), textHalf);
  }

  // Rotate the rect with the label so it stays aligned with the (rotated) text.
  vec2 localPos = labelOffset + labelRotMat * (a_quadCorner * labelHalfSize);
  vec2 ndcOffset = (localPos + snapDelta) * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);
  v_id = a_id;
  v_color = a_color;
}
`}const vr=`#version 300 es
precision highp float;

in vec4 v_id;
in vec4 v_color;

out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    fragColor = v_id;
  #else
    if (v_color.a <= 0.0) discard;
    // v_color is non-premultiplied RGBA (0-1); convert to premultiplied for blending
    fragColor = vec4(v_color.rgb * v_color.a, v_color.a);
  #endif
}
`;function Sr(i,e,t,a){const{label:n={}}=a,r=n.margin??Ze,o=n.zoomToLabelSizeRatioFunction??(()=>1),s=Tr();class l extends Te{constructor(){super(...arguments),this.totalCount=0,this.bufferCapacity=0}static{this.labelMargin=r}getDefinition(){const{FLOAT:d,UNSIGNED_BYTE:u,TRIANGLE_STRIP:c}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:s,FRAGMENT_SHADER_SOURCE:vr,METHOD:c,UNIFORMS:["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_labelPixelSnapping","u_pickingPadding","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth"],ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:d},{name:"a_id",size:4,type:u,normalized:!0},{name:"a_color",size:4,type:u,normalized:!0},{name:"a_labelWidth",size:1,type:d},{name:"a_labelHeight",size:1,type:d},{name:"a_textHeight",size:1,type:d},{name:"a_positionMode",size:1,type:d},{name:"a_labelAngle",size:1,type:d},{name:"a_padding",size:1,type:d}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:d}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}processLabelBackground(d,u){const{floats:c,ints:f}=this;let g=d*this.STRIDE;c[g++]=u.nodeIndex,f[g++]=u.id,c[g++]=u.color,c[g++]=u.labelWidth,c[g++]=u.labelHeight,c[g++]=u.textHeight,c[g++]=u.positionMode,c[g++]=u.labelAngle,c[g++]=u.padding}setUniforms(d,{gl:u,uniformLocations:c}){u.uniformMatrix3fv(c.u_matrix,!1,d.matrix),u.uniform1f(c.u_sizeRatio,d.sizeRatio),u.uniform1f(c.u_correctionRatio,d.correctionRatio),u.uniform1f(c.u_cameraAngle,d.cameraAngle),u.uniform2f(c.u_resolution,d.width*d.pixelRatio,d.height*d.pixelRatio),u.uniform1f(c.u_pixelRatio,d.pixelRatio),u.uniform1f(c.u_labelMargin,l.labelMargin),u.uniform1f(c.u_zoomLabelSizeRatio,1/o(d.zoomRatio)),u.uniform1f(c.u_labelPixelSnapping,d.labelPixelSnapping),u.uniform1f(c.u_pickingPadding,d.labelPickingPadding),u.uniform1i(c.u_nodeDataTexture,d.nodeDataTextureUnit),u.uniform1i(c.u_nodeDataTextureWidth,d.nodeDataTextureWidth),u.uniform1i(c.u_nodeFrameTexture,d.nodeFrameTextureUnit),u.uniform1i(c.u_nodeFrameTextureWidth,d.nodeFrameTextureWidth)}hasNothingToRender(){return this.totalCount===0}drawWebGL(d,{gl:u}){this.totalCount!==0&&u.drawArraysInstanced(u.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}reallocate(d){this.totalCount=d,d>this.bufferCapacity&&(this.bufferCapacity=Math.max(d,Math.ceil(this.bufferCapacity*1.5)||10),super.reallocate(this.bufferCapacity))}}return new l(i,e,t)}const ie={fontSize:64,buffer:8,radius:24,cutoff:.25,maxTextureSize:2048,debounceTimeout:100},Ne=2,Ve=1e20;function Er(i,e,t,a,n){const r=i+n*4,o=document.createElement("canvas");o.width=r,o.height=r;const s=o.getContext("2d",{willReadFrequently:!0});return s.font=`${a} ${t} ${i}px ${e}`,s.textBaseline="alphabetic",s.textAlign="left",s.fillStyle="black",{ctx:s,canvasSize:r,gridOuter:new Float64Array(r*r),gridInner:new Float64Array(r*r),f:new Float64Array(r),z:new Float64Array(r+1),v:new Uint16Array(r)}}function wr(i,e,t,a,n){const{ctx:r,canvasSize:o}=i,s=r.measureText(e),l=s.width,{actualBoundingBoxAscent:h,actualBoundingBoxDescent:d,actualBoundingBoxLeft:u,actualBoundingBoxRight:c}=s,f=Math.ceil(h),g=Math.ceil(u),b=Math.max(0,Math.min(o-t,Math.ceil(u)+Math.ceil(c))),p=Math.min(o-t,f+Math.ceil(d)),m=b+2*t,y=p+2*t,v=Math.max(m*y,0),_=new Uint8ClampedArray(v),x={data:_,width:m,height:y,glyphWidth:b,glyphHeight:p,glyphTop:f,glyphLeft:g,glyphAdvance:l};if(b===0||p===0)return x;const{gridInner:T,gridOuter:S}=i;r.clearRect(t,t,b,p),r.fillText(e,t+g,t+f);const E=r.getImageData(t,t,b,p);S.fill(Ve,0,v),T.fill(0,0,v);for(let D=0;D<p;D++)for(let w=0;w<b;w++){const A=E.data[4*(D*b+w)+3]/255;if(A===0)continue;const F=(D+t)*m+w+t;if(A===1)S[F]=0,T[F]=Ve;else{const R=.5-A;S[F]=R>0?R*R:0,T[F]=R<0?R*R:0}}Li(S,0,0,m,y,m,i.f,i.v,i.z),Li(T,t,t,b,p,m,i.f,i.v,i.z);for(let D=0;D<v;D++){const w=Math.sqrt(S[D])-Math.sqrt(T[D]);_[D]=Math.round(255-255*(w/a+n))}return x}function Li(i,e,t,a,n,r,o,s,l){for(let h=e;h<e+a;h++)Pi(i,t*r+h,r,n,o,s,l);for(let h=t;h<t+n;h++)Pi(i,h*r+e,1,a,o,s,l)}function Pi(i,e,t,a,n,r,o){r[0]=0,o[0]=-Ve,o[1]=Ve,n[0]=i[e];for(let s=1,l=0,h=0;s<a;s++){n[s]=i[e+s*t];const d=s*s;do{const u=r[l];h=(n[s]-n[u]+d-u*u)/(s-u)/2}while(h<=o[l]&&--l>-1);l++,r[l]=s,o[l]=h,o[l+1]=Ve}for(let s=0,l=0;s<a;s++){for(;o[l+1]<s;)l++;const h=r[l],d=s-h;i[e+s*t]=n[h]+d*d}}class ye extends Kt.EventEmitter{constructor(e={}){super(),this.fonts=new Map,this.textures=[],this.cursor={x:0,y:0,rowHeight:0,atlasIndex:0},this.pendingGlyphs=[],this.debounceTimer=null,this.options={...ie,...e},this.canvas=document.createElement("canvas"),this.canvas.width=this.options.maxTextureSize,this.canvas.height=this.options.maxTextureSize,this.ctx=this.canvas.getContext("2d",{willReadFrequently:!0}),this.measureCanvas=document.createElement("canvas"),this.measureCtx=this.measureCanvas.getContext("2d"),this.textures.push(this.ctx.getImageData(0,0,1,1))}static{this.ATLAS_UPDATED_EVENT="atlasUpdated"}getFontKey(e){return`${e.family}-${e.weight}-${e.style}`}registerFont(e){const t=this.getFontKey(e);if(this.fonts.has(t))return t;const a=Er(this.options.fontSize,e.family,e.weight,e.style,this.options.buffer);return this.fonts.set(t,{descriptor:e,generator:a,glyphs:new Map}),t}ensureGlyphs(e,t){const a=this.fonts.get(t);if(!a)throw new Error(`Font "${t}" is not registered. Call registerFont() first.`);let n=!1;for(const r of e){const o=r.codePointAt(0);o!==void 0&&(a.glyphs.has(o)||(this.pendingGlyphs.push({fontKey:t,charCode:o}),n=!0))}n&&this.scheduleTextureGeneration()}measureText(e,t){const a=this.fonts.get(t);if(!a)throw new Error(`Font "${t}" is not registered.`);const{family:n,weight:r,style:o}=a.descriptor;return this.measureCtx.font=`${o} ${r} ${this.options.fontSize}px ${n}`,this.measureCtx.measureText(e).width}getGlyph(e,t){const a=this.fonts.get(t);if(a)return a.glyphs.get(e)}getTextures(){return this.textures}getFontCount(){return this.fonts.size}getGlyphCount(){let e=0;for(const t of this.fonts.values())e+=t.glyphs.size;return e}hasPendingGlyphs(){return this.pendingGlyphs.length>0}flush(){this.debounceTimer&&(clearTimeout(this.debounceTimer),this.debounceTimer=null),this.generateTextures()}destroy(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.fonts.clear(),this.textures=[],this.pendingGlyphs=[],this.removeAllListeners()}scheduleTextureGeneration(){this.debounceTimer===null&&(this.options.debounceTimeout===null?this.generateTextures():this.debounceTimer=setTimeout(()=>{this.debounceTimer=null,this.generateTextures()},this.options.debounceTimeout))}generateTextures(){if(this.pendingGlyphs.length===0)return;const{maxTextureSize:e,buffer:t,radius:a,cutoff:n}=this.options;for(const{fontKey:r,charCode:o}of this.pendingGlyphs){const s=this.fonts.get(r);if(!s||s.glyphs.has(o))continue;const l=String.fromCodePoint(o),h=wr(s.generator,l,t,a,n),d=h.width,u=h.height;this.cursor.x+d+Ne>e&&(this.cursor.x=0,this.cursor.y+=this.cursor.rowHeight+Ne,this.cursor.rowHeight=0),this.cursor.y+u+Ne>e&&(this.finalizeCurrentTexture(),this.cursor={x:0,y:0,rowHeight:0,atlasIndex:this.cursor.atlasIndex+1},this.ctx.clearRect(0,0,e,e));const c=h.data,f=new Uint8ClampedArray(d*u*4);for(let p=0;p<c.length;p++){const m=p*4;f[m]=255,f[m+1]=255,f[m+2]=255,f[m+3]=c[p]}const g=new ImageData(f,d,u);this.ctx.putImageData(g,this.cursor.x,this.cursor.y);const b={charCode:o,width:h.glyphWidth,height:h.glyphHeight,bearingX:-h.glyphLeft-t,bearingY:h.glyphTop+t,advance:h.glyphAdvance,atlasX:this.cursor.x,atlasY:this.cursor.y,atlasWidth:d,atlasHeight:u,atlasIndex:this.cursor.atlasIndex};s.glyphs.set(o,b),this.cursor.x+=d+Ne,this.cursor.rowHeight=Math.max(this.cursor.rowHeight,u)}this.finalizeCurrentTexture(),this.pendingGlyphs=[],this.emit(ye.ATLAS_UPDATED_EVENT,{textures:this.textures,glyphCount:this.getGlyphCount()})}finalizeCurrentTexture(){const{maxTextureSize:e}=this.options,t=this.cursor.y>0||this.cursor.rowHeight>0,a=Math.min(e,Math.max(this.cursor.x,t?e:1)),n=Math.min(e,this.cursor.y+this.cursor.rowHeight+Ne),r=this.ctx.getImageData(0,0,a,n);this.cursor.atlasIndex>=this.textures.length?this.textures.push(r):this.textures[this.cursor.atlasIndex]=r}}const Dr=ie.fontSize;function Ar(){return`#version 300 es

// ============================================================================
// Attributes
// ============================================================================

// Per-character (instanced)
in float a_nodeIndex;        // Index into node data texture
in vec2 a_charOffset;        // Character offset from label origin (pixels)
in vec2 a_charSize;          // Character dimensions (pixels)
in vec4 a_texCoords;         // Atlas coords: (x, y, width, height) in pixels
in vec4 a_color;             // Text color (RGBA)
in float a_margin;           // Gap between node edge and label (pixels)
in float a_positionMode;     // Position: 0=right, 1=left, 2=above, 3=below, 4=over
in float a_labelWidth;       // Total label width (pixels)
in float a_labelHeight;      // Label height (pixels)
in float a_verticalCenter;   // Vertical center offset from baseline (pixels)
in float a_textHeight;       // Actual text height: maxAscent + maxDescent (pixels)
in float a_labelAngle;       // Label rotation angle (radians)

// Per-vertex (constant quad corners)
in vec2 a_quadCorner;        // Quad corner: [-1,-1], [1,-1], [-1,1], [1,1]

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pixelRatio;

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
out float v_fontScale;

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float ATLAS_FONT_SIZE = ${W(Dr)};

// ============================================================================
// Helper Functions
// ============================================================================

${re}
${_e}
${Le}
${ya}

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Step 0: Fetch node data + shared edge distance from textures
  // -------------------------------------------------------------------------
  // Node-data texture format: vec4(x, y, size, shapeId)
  // 2D texture layout: texCoord = (index % width, index / width)
  int nodeIdx = int(a_nodeIndex);
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_anchorPosition = nodeData.xy;
  float a_nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; the label just reads the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  // Apply zoom-dependent label size scaling
  // Positional values are in CSS pixels; multiply by u_pixelRatio to convert to
  // physical pixels, which is what the NDC conversion (/ u_resolution) expects.
  float zoomScale = u_zoomLabelSizeRatio;
  float margin = a_margin * zoomScale * u_pixelRatio;
  vec2 charOffset = a_charOffset * zoomScale * u_pixelRatio;
  vec2 charSize = a_charSize * zoomScale * u_pixelRatio;
  float labelWidth = a_labelWidth * zoomScale * u_pixelRatio;
  float labelHeight = a_labelHeight * zoomScale;

  // Font scale: ratio of CSS label size to the base atlas font size.
  // Divided by u_pixelRatio because the atlas is generated at ATLAS_FONT_SIZE * pixelRatio,
  // which cancels out the u_pixelRatio in the fragment shader's gamma formula and keeps
  // the anti-aliasing band width consistent across pixel densities.
  v_fontScale = a_labelHeight * zoomScale / (ATLAS_FONT_SIZE * u_pixelRatio);

  // -------------------------------------------------------------------------
  // Step 1: Transform node position to clip space
  // -------------------------------------------------------------------------
  vec3 anchorClip = u_matrix * vec3(a_anchorPosition, 1.0);

  // -------------------------------------------------------------------------
  // Step 2: Convert node size to screen pixels
  // -------------------------------------------------------------------------
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = a_nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
  float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;

  // -------------------------------------------------------------------------
  // Step 3: Calculate position offset from the shared edge distance
  // -------------------------------------------------------------------------
  vec2 positionOffset = vec2(0.0);

  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    float boundaryDistPixels = nodeRadiusPixels * edgeDist;
    positionOffset = screenDir * (boundaryDistPixels + margin);
  }

  // -------------------------------------------------------------------------
  // Step 4: Calculate final vertex position
  // -------------------------------------------------------------------------
  vec2 cornerOffset = (a_quadCorner + 1.0) * 0.5;
  vec2 charPixelPos = positionOffset + charOffset + cornerOffset * charSize;

  // Apply text alignment based on position mode
  float verticalCenter = a_verticalCenter * zoomScale * u_pixelRatio;
  float textHeight = a_textHeight * zoomScale * u_pixelRatio;
  float baselineToDescent = textHeight / 2.0 - verticalCenter;
  float baselineToAscent = textHeight / 2.0 + verticalCenter;

  if (a_positionMode < 0.5) {
    // Right: vertically center
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 1.5) {
    // Left: right-align and vertically center
    charPixelPos.x -= labelWidth;
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 2.5) {
    // Above: center horizontally, bottom of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y -= baselineToDescent;
  } else if (a_positionMode < 3.5) {
    // Below: center horizontally, top of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += baselineToAscent;
  } else {
    // Over: center both
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += verticalCenter;
  }

  // Apply label angle rotation. Graph-aligned labels add the camera angle so the
  // whole label orbits the node in lockstep with the frame-pass edge distance.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);
  charPixelPos = labelRotMat * charPixelPos;

  // Snap node center to pixel grid so label/backdrop/attachment move as a unit
  vec2 nodeScreen = vec2(
    (anchorClip.x + 1.0) * u_resolution.x,
    (1.0 - anchorClip.y) * u_resolution.y
  ) * 0.5;
  charPixelPos += (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Convert to NDC (flip Y: screen Y-down -> clip Y-up)
  vec2 ndcOffset = vec2(charPixelPos.x, -charPixelPos.y) * 2.0 / u_resolution;
  gl_Position = vec4(anchorClip.xy + ndcOffset, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 5: Texture coordinates
  // -------------------------------------------------------------------------
  v_texCoord = (a_texCoords.xy + cornerOffset * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 6: Pass color
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
}
`}function Rr(){return`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
in float v_fontScale;

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Labels are not pickable - discard all fragments in picking mode
    discard;
  #else
    // Sample SDF value from atlas (high = inside glyph, low = outside)
    float sdfValue = texture(u_atlas, v_texCoord).a;

    // Edge threshold: 1.0 - cutoff = 0.75 for default cutoff=0.25
    // This is where the glyph edge is located in the SDF
    float edgeThreshold = 1.0 - u_sdfBuffer;

    // Gamma controls the anti-aliasing band width.
    // Scale inversely with font scale so small labels get a wider AA band
    // (smoother) and large labels get a tighter band (sharper).
    float gamma = u_gamma / (u_pixelRatio * v_fontScale);

    // Pure gamma-based anti-aliasing using smoothstep
    // The AA band extends from (threshold - gamma) to (threshold + gamma)
    float alpha = smoothstep(edgeThreshold - gamma, edgeThreshold + gamma, sdfValue);

    // Premultiplied alpha output for correct blending
    float finalAlpha = v_color.a * alpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  #endif
}
`}function Cr(){return["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_atlasSize","u_atlas","u_gamma","u_sdfBuffer","u_pixelRatio","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_zoomLabelSizeRatio","u_labelPixelSnapping"]}function Lr(){return{vertexShader:Ar(),fragmentShader:Rr(),uniforms:Cr()}}function Pr(i,e,t,a){const{label:n={}}=a,r=n.margin??Ze,o=n.zoomToLabelSizeRatioFunction??(()=>1),s=Lr();class l extends Ea{constructor(d,u,c){if(super(d,u,c),this.atlasTexture=null,this.atlasNeedsUpdate=!1,this.labelGlyphCache=new Map,this.atlasFontSize=ie.fontSize*Ut(),this.atlasManager=new ye({fontSize:this.atlasFontSize}),this.gamma=.025,this.sdfBuffer=ie.cutoff,this.atlasTexture=d.createTexture(),!this.atlasTexture)throw new Error("NodeLabelProgram: failed to create atlas texture");d.bindTexture(d.TEXTURE_2D,this.atlasTexture),d.texParameteri(d.TEXTURE_2D,d.TEXTURE_WRAP_S,d.CLAMP_TO_EDGE),d.texParameteri(d.TEXTURE_2D,d.TEXTURE_WRAP_T,d.CLAMP_TO_EDGE),d.texParameteri(d.TEXTURE_2D,d.TEXTURE_MIN_FILTER,d.LINEAR),d.texParameteri(d.TEXTURE_2D,d.TEXTURE_MAG_FILTER,d.LINEAR),d.bindTexture(d.TEXTURE_2D,null),this.atlasManager.on(ye.ATLAS_UPDATED_EVENT,()=>{this.atlasNeedsUpdate=!0});const f={family:n.font?.family||"sans-serif",weight:n.font?.weight||"normal",style:n.font?.style||"normal"};this.defaultFontKey=this.atlasManager.registerFont(f)}static{this.labelMargin=r}static{this.zoomToLabelSizeRatioFunction=o}getDefinition(){const{FLOAT:d,UNSIGNED_BYTE:u,TRIANGLE_STRIP:c}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:s.vertexShader,FRAGMENT_SHADER_SOURCE:s.fragmentShader,METHOD:c,UNIFORMS:s.uniforms,ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:d},{name:"a_charOffset",size:2,type:d},{name:"a_charSize",size:2,type:d},{name:"a_texCoords",size:4,type:d},{name:"a_color",size:4,type:u,normalized:!0},{name:"a_margin",size:1,type:d},{name:"a_positionMode",size:1,type:d},{name:"a_labelWidth",size:1,type:d},{name:"a_labelHeight",size:1,type:d},{name:"a_verticalCenter",size:1,type:d},{name:"a_textHeight",size:1,type:d},{name:"a_labelAngle",size:1,type:d}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:d}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}prepareLabelGlyphs(d,u){if(u.hidden||!u.text){this.labelGlyphCache.delete(d);return}const c=u.text,f=u.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(c,f);const g=[],b=[];let p=0,m=0,y=0;for(const v of c){const _=v.codePointAt(0);if(_===void 0){g.push(void 0),b.push(p);continue}const x=this.atlasManager.getGlyph(_,f);g.push(x),b.push(p),x&&(p+=x.advance,m=Math.max(m,x.bearingY),y=Math.max(y,x.atlasHeight-x.bearingY))}this.labelGlyphCache.set(d,{glyphs:g,xOffsets:b,totalWidth:p,totalHeight:m+y,verticalCenterOffset:(m-y)/2})}processCharacter(d,u,c,f){const{floats:g,STRIDE:b}=this,p=d*b,m=this.labelGlyphCache.get(u.parentKey);if(!m||!m.glyphs[f]){for(let S=0;S<b;S++)g[p+S]=0;return}const y=m.glyphs[f],v=m.xOffsets[f],_=u.size/this.atlasFontSize,x=te(u.color);let T=p;g[T++]=u.nodeIndex,g[T++]=(v+y.bearingX)*_,g[T++]=-y.bearingY*_,g[T++]=y.atlasWidth*_,g[T++]=y.atlasHeight*_,g[T++]=y.atlasX,g[T++]=y.atlasY,g[T++]=y.atlasWidth,g[T++]=y.atlasHeight,g[T++]=x,g[T++]=u.margin,g[T++]=He[u.position],g[T++]=m.totalWidth*_,g[T++]=u.size,g[T++]=m.verticalCenterOffset*_,g[T++]=m.totalHeight*_,g[T++]=u.labelAngle}processLabel(d,u,c){return this.prepareLabelGlyphs(d,c),super.processLabel(d,u,c)}updateAtlasTexture(){if(!this.atlasNeedsUpdate)return;const d=this.normalProgram.gl,u=this.atlasManager.getTextures();if(u.length===0)return;const c=u[0];d.bindTexture(d.TEXTURE_2D,this.atlasTexture),d.texImage2D(d.TEXTURE_2D,0,d.RGBA,c.width,c.height,0,d.RGBA,d.UNSIGNED_BYTE,c.data),d.bindTexture(d.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}setUniforms(d,u){const{gl:c,uniformLocations:f}=u;c.uniformMatrix3fv(f.u_matrix,!1,d.matrix),c.uniform1f(f.u_sizeRatio,d.sizeRatio),c.uniform1f(f.u_correctionRatio,d.correctionRatio),c.uniform1f(f.u_cameraAngle,d.cameraAngle),c.uniform2f(f.u_resolution,d.width*d.pixelRatio,d.height*d.pixelRatio);const g=this.atlasManager.getTextures();g.length>0?c.uniform2f(f.u_atlasSize,g[0].width,g[0].height):c.uniform2f(f.u_atlasSize,1,1),c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,this.atlasTexture),c.uniform1i(f.u_atlas,0),f.u_nodeDataTexture!==void 0&&c.uniform1i(f.u_nodeDataTexture,d.nodeDataTextureUnit),f.u_nodeDataTextureWidth!==void 0&&c.uniform1i(f.u_nodeDataTextureWidth,d.nodeDataTextureWidth),c.uniform1i(f.u_nodeFrameTexture,d.nodeFrameTextureUnit),c.uniform1i(f.u_nodeFrameTextureWidth,d.nodeFrameTextureWidth),c.uniform1f(f.u_gamma,this.gamma),c.uniform1f(f.u_sdfBuffer,this.sdfBuffer),c.uniform1f(f.u_pixelRatio,d.pixelRatio),c.uniform1f(f.u_zoomLabelSizeRatio,1/l.zoomToLabelSizeRatioFunction(d.zoomRatio)),c.uniform1f(f.u_labelPixelSnapping,d.labelPixelSnapping)}renderProgram(d,u){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),super.renderProgram(d,u)}registerFont(d,u="normal",c="normal"){return this.atlasManager.registerFont({family:d,weight:u,style:c})}getAtlasManager(){return this.atlasManager}measureLabel(d,u,c){const f=c||this.defaultFontKey;this.atlasManager.ensureGlyphs(d,f),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();let g=0,b=0,p=0;for(const y of d){const v=y.codePointAt(0);if(v===void 0)continue;const _=this.atlasManager.getGlyph(v,f);_&&(g+=_.advance,b=Math.max(b,_.bearingY),p=Math.max(p,_.atlasHeight-_.bearingY))}const m=u/this.atlasFontSize;return{width:g*m,height:u,textHeight:(b+p)*m}}ensureGlyphsReady(d,u){const c=u||this.defaultFontKey;for(const f of d)this.atlasManager.ensureGlyphs(f,c);this.atlasManager.flush()}kill(){const d=this.normalProgram.gl;this.atlasTexture&&(d.deleteTexture(this.atlasTexture),this.atlasTexture=null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),super.kill()}}return new l(i,e,t)}const Fr=`#version 300 es
precision highp float;

in float v_edgeDist;

// R32F target: only the .r channel is stored.
out vec4 fragColor;

void main() {
  fragColor = vec4(v_edgeDist, 0.0, 0.0, 0.0);
}
`;function Ir(i,e,t){const a=Jt(i),n=Qe(i).map(c=>`uniform ${c.type} ${c.name};`).join(`
`),{code:r,multiShape:o}=Yn(i,t),s=Pe(i,e),l=Object.keys(s.specs).map(c=>`float v_${c};`).join(`
`),{fetchCode:h,varyingAssignments:d}=Ce(s,{varPrefix:"nodeAttr",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"});return`#version 300 es
precision highp float;

uniform float u_cameraAngle;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;
${n}

in float a_nodeIndex;     // node-data texture index (also the target frame texel)
in float a_positionMode;  // 0=right 1=left 2=above 3=below 4=over
in float a_labelAngle;    // intrinsic label angle (radians)

out float v_edgeDist;

// Shape attributes (plain globals: this pass is vertex-only)
${l}

${re}
${_e}
${a}
${r}
${ya}

void main() {
  int nodeIdx = int(a_nodeIndex);
${h}
${d}
  ${o?`// Multi-shape: the shape id lives in the node-data texture's .w channel:
  g_shapeId = int(readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).w);`:"// Single-shape mode, shape id not needed"}

  // Per-node rotation alignment (0 = viewport, 1 = graph).
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;

  // Effective angle: intrinsic (style-given) plus the camera angle when the label
  // is graph-aligned. The companions place the box at this same angle.
  float effectiveAngle = a_labelAngle - labelRotation * u_cameraAngle;

  // The "over" mode (4) sits on the node center, so it has no edge distance.
  float edgeDist = 0.0;
  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    // Rotate by the effective label angle. Inlined rather than via rotate2D()
    // because the shape SDFs (getShapeGLSLForShapes) already define that helper
    // for multi-shape programs, and redefining it would be a GLSL error.
    float ea_c = cos(effectiveAngle);
    float ea_s = sin(effectiveAngle);
    vec2 rotatedScreenDir = mat2(ea_c, -ea_s, ea_s, ea_c) * screenDir;
    // Screen (Y-down) -> SDF (Y-up).
    vec2 sdfDir = vec2(rotatedScreenDir.x, -rotatedScreenDir.y);
    // Counter-rotate into the shape's local frame for graph-aligned nodes, so the
    // boundary is queried against the shape's actual on-screen orientation.
    float nodeCa = -u_cameraAngle * nodeRotation;
    float nc = cos(nodeCa), ns = sin(nodeCa);
    sdfDir = mat2(nc, -ns, ns, nc) * sdfDir;
    edgeDist = findEdgeDistance(sdfDir, 1.0);
  }
  v_edgeDist = edgeDist;

  // Scatter to this node's texel center in the frame texture.
  float x = mod(a_nodeIndex, u_frameTextureWidth);
  float y = floor(a_nodeIndex / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`}class xt{constructor(e,t){this.uniformLocations={};const{shapes:a,layers:n,shapeGlobalIds:r}=t;if(a.length===0)throw new Error("NodeLabelFramePass: at least one shape must be provided");this.gl=e,this.shapeUniforms=Qe(a),this.hasAttributeData=Object.keys(Pe(a,n).offsets).length>0,this.vertexShader=Yt(e,Ir(a,n,r)),this.fragmentShader=Zt(e,Fr),this.program=Qt(e,[this.vertexShader,this.fragmentShader]);const o=["u_cameraAngle","u_nodeDataTexture","u_nodeDataTextureWidth","u_frameTextureWidth","u_frameTextureHeight","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode",...this.shapeUniforms.map(l=>l.name)];for(const l of o)this.uniformLocations[l]=e.getUniformLocation(this.program,l);const s=xt.FLOATS_PER_POINT*4;this.vao=e.createVertexArray(),this.buffer=e.createBuffer(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.buffer);for(const[l,h]of[["a_nodeIndex",0],["a_positionMode",4],["a_labelAngle",8]]){const d=e.getAttribLocation(this.program,l);d>=0&&(e.enableVertexAttribArray(d),e.vertexAttribPointer(d,1,e.FLOAT,!1,s,h))}e.bindVertexArray(null)}static{this.FLOATS_PER_POINT=3}run(e,t,a,n,r){if(t===0)return;const{gl:o}=this;o.useProgram(this.program),o.bindVertexArray(this.vao),o.bindBuffer(o.ARRAY_BUFFER,this.buffer),o.bufferData(o.ARRAY_BUFFER,e.subarray(0,t*xt.FLOATS_PER_POINT),o.DYNAMIC_DRAW);const s=this.uniformLocations;o.uniform1f(s.u_cameraAngle,n.cameraAngle),o.uniform1i(s.u_nodeDataTexture,n.nodeDataTextureUnit),o.uniform1i(s.u_nodeDataTextureWidth,n.nodeDataTextureWidth),o.uniform1f(s.u_frameTextureWidth,a.getTextureWidth()),o.uniform1f(s.u_frameTextureHeight,a.getTextureHeight()),this.hasAttributeData&&r&&(r.bind(he),s.u_layerAttributeTexture&&o.uniform1i(s.u_layerAttributeTexture,he),s.u_layerAttributeTextureWidth&&o.uniform1i(s.u_layerAttributeTextureWidth,r.getTextureWidth()),s.u_layerAttributeTexelsPerNode&&o.uniform1i(s.u_layerAttributeTexelsPerNode,r.getTexelsPerItem()));for(const l of this.shapeUniforms)ii(o,this.uniformLocations[l.name],l);a.bindAsRenderTarget(),o.disable(o.BLEND),o.disable(o.DEPTH_TEST),o.drawArrays(o.POINTS,0,t),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindVertexArray(null)}kill(){const{gl:e}=this;e.deleteProgram(this.program),e.deleteShader(this.vertexShader),e.deleteShader(this.fragmentShader),e.deleteBuffer(this.buffer),e.deleteVertexArray(this.vao)}}function kr(i,e,t,a,n){const{label:r={},shapes:o}=a;if(o.length===0)throw new Error("createNodeProgram: at least one shape must be provided in 'shapes'");const s={},l=[];let h;o.forEach((x,T)=>{const S=Wn(x);T===0&&(h=S),s[x.name]=T,l[T]=ct(S)});let d=[...a.layers],u=Ci({shapes:o,layers:d,shapeGlobalIds:o.length>1?l:void 0,antialias:n});const c=Pr(i,null,t,{label:r}),f=_r(i,null,t,{shapes:o,layers:d,getAttributeTexture:()=>_.getAttributeTexture(),label:r,shapeGlobalIds:o.length>1?l:void 0}),g=Sr(i,e,t,{label:r}),b=a.labelAttachments&&Object.keys(a.labelAttachments).length>0?hr(i,null,t,{label:r}):null,p=new xt(i,{shapes:o,layers:d,shapeGlobalIds:o.length>1?l:void 0}),m=Dt(o,d),y=q(m),v=class extends Te{constructor(x,T,S){super(x,T,S),this.layerLifecycles=new Map,this.layersNeedingRegeneration=new Set,this.attrDescriptors=[],this._pickingBuffer=T;let E=v.layerTextures.get(x);E||(E=new St(x,y),v.layerTextures.set(x,E)),this.layerAttributeTexture=E;const D=v.textureRefCounts.get(x)||0;v.textureRefCounts.set(x,D+1),this.packedAttributeData=new Float32Array(y.floatsPerItem),d.forEach((A,F)=>{if(A.lifecycle){const R={gl:x,renderer:{refresh:()=>S.refresh()},getUniformLocation:G=>x.getUniformLocation(this.normalProgram.program,G),requestShaderRegeneration:()=>{this.layersNeedingRegeneration.add(F)},requestRefresh:()=>{S.refresh()}},P=A.lifecycle(R);this.layerLifecycles.set(F,P)}}),this.layerLifecycles.forEach(A=>{A.init?.()});const w=new Map;this.layerLifecycles.forEach((A,F)=>{A.getAttributeData&&w.set(F,A)}),this.attrDescriptors=Et(m,y,w)}static{this.layerTextures=new WeakMap}static{this.textureRefCounts=new WeakMap}getDefinition(){const{FLOAT:x,TRIANGLE_STRIP:T}=WebGL2RenderingContext;return{VERTICES:4,VERTEX_SHADER_SOURCE:u.vertexShader,FRAGMENT_SHADER_SOURCE:u.fragmentShader,METHOD:T,UNIFORMS:u.uniforms,ATTRIBUTES:u.attributes,CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:x}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}maybeRegenerateShaders(){if(this.layersNeedingRegeneration.size===0)return;d=d.map((w,A)=>{if(this.layersNeedingRegeneration.has(A)){const F=this.layerLifecycles.get(A);if(F?.regenerate)return{...F.regenerate(),lifecycle:w.lifecycle}}return w}),this.layersNeedingRegeneration.clear(),u=Ci({shapes:o,layers:d,shapeGlobalIds:o.length>1?l:void 0,antialias:this.renderer.getSetting("antialiasNodes")});const x=this.normalProgram.gl,{program:T,buffer:S,vertexShader:E,fragmentShader:D}=this.normalProgram;x.deleteProgram(T),x.deleteBuffer(S),x.deleteShader(E),x.deleteShader(D),this.normalProgram=this.getProgramInfo("normal",x,u.vertexShader,u.fragmentShader,this._pickingBuffer)}allocateNode(x){this.layerAttributeTexture.allocate(x)}freeNode(x){this.layerAttributeTexture.free(x)}getAttributeTexture(){return this.layerAttributeTexture}uploadLayerTexture(){this.layerAttributeTexture.upload()}process(x,T,S,E,D){let w=T*this.STRIDE;if(S.visibility==="hidden"){for(let A=w+this.STRIDE;w<A;w++)this.floats[w]=0;this.floats[T*this.STRIDE]=Ta;return}this.processVisibleItem(mt(x),w,S,E,D)}processVisibleItem(x,T,S,E,D){const{floats:w,ints:A}=this;if(w[T++]=E,A[T++]=x,w[T++]=S.opacity??1,y.floatsPerItem===0)return;const F=this.packedAttributeData;wt(this.attrDescriptors,S,F,S.color,this.layerLifecycles,0),this.layerAttributeTexture.updateAllAttributes(D,F)}setUniforms(x,T){const{gl:S,uniformLocations:E}=T;E.u_matrix&&S.uniformMatrix3fv(E.u_matrix,!1,x.matrix),E.u_sizeRatio&&S.uniform1f(E.u_sizeRatio,x.sizeRatio),E.u_correctionRatio&&S.uniform1f(E.u_correctionRatio,x.correctionRatio),E.u_pickingPadding&&S.uniform1f(E.u_pickingPadding,x.nodePickingPadding),E.u_cameraAngle&&S.uniform1f(E.u_cameraAngle,x.cameraAngle),E.u_nodeDataTexture&&S.uniform1i(E.u_nodeDataTexture,x.nodeDataTextureUnit),E.u_nodeDataTextureWidth&&S.uniform1i(E.u_nodeDataTextureWidth,x.nodeDataTextureWidth),E.u_layerAttributeTexture&&(this.layerAttributeTexture.bind(he),S.uniform1i(E.u_layerAttributeTexture,he)),E.u_layerAttributeTextureWidth&&S.uniform1i(E.u_layerAttributeTextureWidth,this.layerAttributeTexture.getTextureWidth()),E.u_layerAttributeTexelsPerNode&&S.uniform1i(E.u_layerAttributeTexelsPerNode,this.layerAttributeTexture.getTexelsPerItem()),o.forEach(D=>{D.uniforms.forEach(w=>{this.setTypedUniform(w,T)})}),d.forEach(D=>{D.uniforms.forEach(w=>{this.setTypedUniform(w,T)})})}renderProgram(x,T){this.maybeRegenerateShaders();const{gl:S,program:E}=T;S.useProgram(E),T===this.normalProgram&&this.layerLifecycles.forEach(D=>{D.beforeRender?.()}),super.renderProgram(x,T)}kill(){this.layerLifecycles.forEach(S=>{S.kill?.()}),this.layerLifecycles.clear();const x=this.normalProgram.gl,T=(v.textureRefCounts.get(x)||1)-1;T<=0?(this.layerAttributeTexture.kill(),v.layerTextures.delete(x),v.textureRefCounts.delete(x)):v.textureRefCounts.set(x,T),super.kill()}},_=new v(i,null,t);return{nodeProgram:_,labelProgram:c,backdropProgram:f,labelBackgroundProgram:g,attachmentProgram:b,framePass:p,shapeSlug:h,shapeNameToIndex:o.length>1?s:void 0,shapeGlobalIds:o.length>1?l:void 0}}function de(i){return typeof i=="object"&&i!==null&&"attribute"in i}function Gr(){return{name:"circle",glsl:`
float sdf_circle(vec2 uv, float size) {
  return length(uv) - size;
}
`,uniforms:[]}}function Nr(i){const{UNSIGNED_BYTE:e}=WebGL2RenderingContext,t=i?.color??{attribute:"color"};if(!de(t)){const o=`
vec4 layer_fill() {
  return ${Sn(t)};
}
`;return{name:"fill",uniforms:[],attributes:[],glsl:o}}const a=t.attribute;return{name:"fill",uniforms:[],attributes:[{name:"fillColor",size:4,type:e,normalized:!0,source:a}],glsl:`
vec4 layer_fill(vec4 v_fillColor) {
  return v_fillColor;
}
`}}const ue=6;function Je(i){const{offsets:e,specs:t,floatsPerItem:a}=i,n=Object.keys(e);if(n.length===0||a===0)return{uniformDeclarations:"",uniformNames:[],vertexVaryingDeclarations:"",fragmentVaryingDeclarations:"",fetchCode:"",varyingAssignments:""};const r=`
uniform sampler2D u_edgeAttributeTexture;
uniform int u_edgeAttributeTextureWidth;
uniform int u_edgeAttributeTexelsPerEdge;`,o=["u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"],s=n.map(c=>`${t[c].size===1?"float":`vec${t[c].size}`} v_${c};`),l=s.map(c=>`out ${c}`).join(`
`),h=s.map(c=>`in ${c}`).join(`
`),{fetchCode:d,varyingAssignments:u}=Ce(i,{varPrefix:"attr",baseTexelExpr:"edgeIdx * u_edgeAttributeTexelsPerEdge",textureWidthUniform:"u_edgeAttributeTextureWidth",textureSamplerUniform:"u_edgeAttributeTexture"});return{uniformDeclarations:r,uniformNames:o,vertexVaryingDeclarations:l,fragmentVaryingDeclarations:h,fetchCode:d,varyingAssignments:u}}function Mr(i){return`
float findSourceClampT_${i}(vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  float lo = 0.0, hi = 0.5;
  float nodeExtent = sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // Counter-rotate the query point so viewport-aligned nodes (rotateAlign=0) are
  // clamped against their on-screen orientation; graph-aligned nodes skip it.
  float ca = u_cameraAngle * (1.0 - sourceRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_${i}_position(mid, source, target);
    vec2 localPos = rot * ((pos - source) / nodeExtent);
    float sdf = querySDF(sourceShapeId, localPos, effectiveSize);
    if (sdf < 0.0) lo = mid;
    else hi = mid;
  }

  float pathLen = path_${i}_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 + marginT;
}
`}function zr(i){return`
float findTargetClampT_${i}(vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  float lo = 0.5, hi = 1.0;
  float nodeExtent = targetSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // See findSourceClampT_ for the rotation rationale.
  float ca = u_cameraAngle * (1.0 - targetRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_${i}_position(mid, source, target);
    vec2 localPos = rot * ((pos - target) / nodeExtent);
    float sdf = querySDF(targetShapeId, localPos, effectiveSize);
    if (sdf < 0.0) hi = mid;
    else lo = mid;
  }

  float pathLen = path_${i}_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 - marginT;
}
`}function wa(i){return`
// Auto-generated numerical tangent (from position via finite differences)
vec2 path_${i}_tangent(float t, vec2 source, vec2 target) {
  float epsilon = 0.001;
  float t1 = max(0.0, t - epsilon);
  float t2 = min(1.0, t + epsilon);
  vec2 p1 = path_${i}_position(t1, source, target);
  vec2 p2 = path_${i}_position(t2, source, target);
  return normalize(p2 - p1);
}

// Auto-generated normal (perpendicular to tangent)
vec2 path_${i}_normal(float t, vec2 source, vec2 target) {
  vec2 tangent = path_${i}_tangent(t, source, target);
  return vec2(-tangent.y, tangent.x);
}
`}function td(i){return`
// Rotate a 2D vector by angle (counter-clockwise)
vec2 ${i}_rotate(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}
`}function $r(i){return`
// Auto-generated path length (samples position 16 times)
float path_${i}_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_${i}_position(0.0, source, target);
  for (int i = 1; i <= 16; i++) {
    float t = float(i) / 16.0;
    vec2 curr = path_${i}_position(t, source, target);
    len += length(curr - prev);
    prev = curr;
  }
  return len;
}
`}function Wr(i){return`
// Auto-generated closest_t (coarse sample + ternary search)
float path_${i}_closest_t(vec2 p, vec2 source, vec2 target) {
  // Coarse search: find best among 10 samples
  float bestT = 0.0;
  float bestDist = 1e10;
  for (int i = 0; i <= 10; i++) {
    float t = float(i) / 10.0;
    vec2 pos = path_${i}_position(t, source, target);
    float d = length(p - pos);
    if (d < bestDist) {
      bestDist = d;
      bestT = t;
    }
  }

  // Refine with ternary search
  float lo = max(0.0, bestT - 0.1);
  float hi = min(1.0, bestT + 0.1);
  for (int i = 0; i < 10; i++) {
    float mid1 = lo + (hi - lo) / 3.0;
    float mid2 = hi - (hi - lo) / 3.0;
    float d1 = length(p - path_${i}_position(mid1, source, target));
    float d2 = length(p - path_${i}_position(mid2, source, target));
    if (d1 < d2) {
      hi = mid2;
    } else {
      lo = mid1;
    }
  }
  return (lo + hi) * 0.5;
}
`}function Br(i){return`
// Auto-generated signed distance (via closest_t + normal)
float path_${i}_distance(vec2 p, vec2 source, vec2 target) {
  float closestT = path_${i}_closest_t(p, source, target);
  vec2 closest = path_${i}_position(closestT, source, target);
  vec2 diff = p - closest;
  float dist = length(diff);
  if (dist < 0.0001) return 0.0;

  // Get normal at closest point
  vec2 normal = path_${i}_normal(closestT, source, target);
  return dist * sign(dot(diff, normal));
}
`}function Ur(i){return`
// Auto-generated t_at_distance (binary search)
float path_${i}_t_at_distance(float targetDist, vec2 source, vec2 target) {
  if (targetDist <= 0.0) return 0.0;

  float totalLen = path_${i}_length(source, target);
  if (targetDist >= totalLen) return 1.0;

  // Binary search for t
  float lo = 0.0, hi = 1.0;
  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;

    // Compute arc length from 0 to mid
    float arcLen = 0.0;
    vec2 prev = path_${i}_position(0.0, source, target);
    for (int j = 1; j <= 8; j++) {
      float t = mid * float(j) / 8.0;
      vec2 curr = path_${i}_position(t, source, target);
      arcLen += length(curr - prev);
      prev = curr;
    }

    if (arcLen < targetDist) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) * 0.5;
}
`}function ot(i,e){return new RegExp(`\\b(float|vec[234]|void|int|bool)\\s+${e}\\s*\\(`).test(i)}function Da(i,e){const t=[];return ot(e,`path_${i}_length`)||t.push($r(i)),ot(e,`path_${i}_closest_t`)||t.push(Wr(i)),ot(e,`path_${i}_distance`)||t.push(Br(i)),ot(e,`path_${i}_t_at_distance`)||t.push(Ur(i)),t.length>0?`
// ============================================================================
// Auto-generated fallback functions (path only provided position)
// ============================================================================
${t.join(`
`)}`:""}function Aa(i){const{paths:e,layers:t}=i,a=i.extremities??[];if(e.length===0)throw new Error("At least one path is required in 'paths'");if(t.length===0)throw new Error("At least one layer is required in 'layers'");const n=i.defaultHead??"none",r=i.defaultTail??"none";return{paths:e,extremities:a,layers:t,path:e[0],layer:t[0],defaultHead:n,defaultTail:r}}const{FLOAT:Xe,UNSIGNED_BYTE:Fi}=WebGL2RenderingContext;function Or(i,e,t){const a=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"]),n=new Set(a);return i.forEach(r=>r.uniforms.forEach(o=>n.add(o.name))),e.forEach(r=>r.uniforms.forEach(o=>n.add(o.name))),t.forEach(r=>r.uniforms.forEach(o=>n.add(o.name))),Array.from(n)}function ni(i){const e=new Set,t=[];for(const a of i)e.has(a.name)||(e.add(a.name),t.push(`// Path: ${a.name}`),t.push(a.glsl),t.push(wa(a.name)),t.push(Da(a.name,a.glsl)));return t.join(`

`)}function Hr(i){const e=[];for(const t of i)e.push(`// Extremity: ${t.name}`),e.push(t.glsl);return e.join(`

`)}const Vr=[{queryName:"queryPathPosition",pathFunc:"position",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathTangent",pathFunc:"tangent",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathNormal",pathFunc:"normal",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathLength",pathFunc:"length",returnType:"float",params:"vec2 source, vec2 target",args:"source, target"},{queryName:"queryPathClosestT",pathFunc:"closest_t",returnType:"float",params:"vec2 p, vec2 source, vec2 target",args:"p, source, target"}];function Xr(i,e){const{queryName:t,pathFunc:a,returnType:n,params:r,args:o}=e;if(i.length===1)return`${n} ${t}(int pathId, ${r}) {
  return path_${i[0].name}_${a}(${o});
}`;const s=i.map((l,h)=>`    case ${h}: return path_${l.name}_${a}(${o});`).join(`
`);return`${n} ${t}(int pathId, ${r}) {
  switch (pathId) {
${s}
    default: return path_${i[0].name}_${a}(${o});
  }
}`}function ri(i){return Vr.map(e=>Xr(i,e)).join(`

`)}function jr(i){return i.length===1?`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  return extremity_${i[0].name}(uv, lengthRatio, widthRatio);
}`:`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  switch (extremityId) {
${i.map((t,a)=>`    case ${a}: return extremity_${t.name}(uv, lengthRatio, widthRatio);`).join(`
`)}
    default: return extremity_${i[0].name}(uv, lengthRatio, widthRatio);
  }
}`}function qr(i){const e=[];for(const t of i)e.push(Mr(t.name)),e.push(zr(t.name));if(i.length===1)e.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  return findSourceClampT_${i[0].name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  return findTargetClampT_${i[0].name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
}`);else{const t=i.map((n,r)=>`    case ${r}: return findSourceClampT_${n.name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);`).join(`
`),a=i.map((n,r)=>`    case ${r}: return findTargetClampT_${n.name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);`).join(`
`);e.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  switch (pathId) {
${t}
    default: return findSourceClampT_${i[0].name}(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
  }
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  switch (pathId) {
${a}
    default: return findTargetClampT_${i[0].name}(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
  }
}`)}return e.join(`

`)}function Kr(i,e,t,a,n){const r=q([...i,...t]),o=Je(r),s=Pe(a,n),l=Object.keys(s.offsets),h=T=>{const{size:S}=s.specs[T];return S===1?"float":`vec${S}`},d=l.map(T=>`${h(T)} v_source_${T};
${h(T)} v_target_${T};`).join(`
`),u=Ce(s,{varPrefix:"srcNodeAttr",baseTexelExpr:"srcIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture",outputPrefix:"v_source_"}),c=Ce(s,{varPrefix:"tgtNodeAttr",baseTexelExpr:"tgtIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture",outputPrefix:"v_target_"}),f=l.map(T=>`${h(T)} g_${T};`).join(`
`),g=l.map(T=>`  g_${T} = v_source_${T};`).join(`
`),b=l.map(T=>`  g_${T} = v_target_${T};`).join(`
`),p=new Set,m=[],y=T=>{p.has(T.name)||(p.add(T.name),m.push(`uniform ${T.type} ${T.name};`))};i.forEach(T=>T.uniforms.forEach(y)),e.forEach(T=>T.uniforms.forEach(y));const v=e.map(T=>W(T.widthFactor)).join(", "),_=Math.max(...i.map(T=>T.minBodyLengthRatio||0));return`#version 300 es

// Node and edge data textures
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;

// Edge attribute texture (for path-specific attributes like curvature)
${o.uniformDeclarations}

// Node attribute texture (for node shape attributes)
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

// Render params needed for clamping
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;

// Edge-frame texture dimensions, for scattering each point to its texel
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;

// Custom path/extremity uniforms
${m.join(`
`)}

// Path attribute varyings — assigned so path functions can read them as globals
${o.vertexVaryingDeclarations}

// Node size varyings — read by path functions like loop
out float v_sourceNodeSize;
out float v_targetNodeSize;

// Node shape attributes per endpoint, and the ones querySDF reads
${d}
${f}

// Scattered output written to the edge-frame texel: [tStart, tEnd, straightenFactor, pathLength]
out vec4 v_clamp;

// Extremity width factor array (needed for extremityScale computation)
const float EXTREMITY_WIDTH_FACTORS[${e.length}] = float[](${v});

// Node-data fetch helpers (geometry texel + rotation-flags texel)
${re}
${_e}

// Shape SDFs for node boundary clamping
${Bn()}
${Un(new Set(l))}

// Path functions
${ni(i)}
${ri(i)}
${qr(i)}

void main() {
  // One point per edge-data row; the row index is the edge-frame texel target.
  int edgeIdx = gl_VertexID;
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes and assign to path-function globals
${o.fetchCode}
${o.varyingAssignments}

  // Fetch node shape attributes for both endpoints
${u.fetchCode}
${u.varyingAssignments}
${c.fetchCode}
${c.varyingAssignments}

  // Fetch node geometry (texel 0) and rotation flags (texel 1).
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
  float a_sourceSize = srcNodeData.z;
  float a_targetSize = tgtNodeData.z;
  float a_sourceShapeId = srcNodeData.w;
  float a_targetShapeId = tgtNodeData.w;
  // Per-node rotation alignment (0 = viewport, 1 = graph), for boundary clamping.
  float a_sourceRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx).r;
  float a_targetRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx).r;

  v_sourceNodeSize = a_sourceSize;
  v_targetNodeSize = a_targetSize;

  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = ${W(_)};

  // Thickness in WebGL units (needed to compute clamping margin and extremity lengths)
  float pixelsThickness = max(a_thickness, u_minEdgeThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // SDF clamping: find where the edge body meets the node boundaries. Always
  // searched (ungated) so labels get a true boundary clamp; the body re-applies
  // its extremity gating in-shader.
${g}
  float tStart = queryFindSourceClampT(pathId, a_source, a_sourceSize, int(a_sourceShapeId), a_sourceRotateAlign, a_target, 0.0);
${b}
  float tEnd = queryFindTargetClampT(pathId, a_source, a_target, a_targetSize, int(a_targetShapeId), a_targetRotateAlign, 0.0);

  // straightenFactor (frame .z) is consumed only by the body, which runs to the
  // node center when an extremity is absent. Derive the straightening math from
  // these gated clamps — not the ungated boundary ones above — so it matches the
  // geometry it drives. The ungated tStart/tEnd remain what labels read.
  float bodyTStart = tailLengthRatio > 0.0 ? tStart : 0.0;
  float bodyTEnd = headLengthRatio > 0.0 ? tEnd : 1.0;

  // Path length and zone boundaries (needed for straightening check)
  float pathLength = queryPathLength(pathId, a_source, a_target);
  float visibleLength = pathLength * (bodyTEnd - bodyTStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  float tTailEnd = bodyTStart + tailLengthT;
  float tHeadStart = bodyTEnd - headLengthT;
  if (tTailEnd > tHeadStart) {
    float mid = (bodyTStart + bodyTEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Straighten factor: blend toward straight line when path twists in extremity zones
  float straightenFactor = 0.0;
  {
    float maxDeviation = 0.0;
    if (tailLengthT > 0.0001) {
      vec2 tailTang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
      vec2 tailChord = queryPathPosition(pathId, bodyTStart, a_source, a_target)
                     - queryPathPosition(pathId, tTailEnd, a_source, a_target);
      float tailChordLen = length(tailChord);
      if (tailChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(-tailTang, tailChord / tailChordLen));
      }
    }
    if (headLengthT > 0.0001) {
      vec2 headTang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
      vec2 headChord = queryPathPosition(pathId, bodyTEnd, a_source, a_target)
                     - queryPathPosition(pathId, tHeadStart, a_source, a_target);
      float headChordLen = length(headChord);
      if (headChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(headTang, headChord / headChordLen));
      }
    }
    straightenFactor = smoothstep(0.035, 0.5, maxDeviation);
  }

  // When straightening, blend the ungated tStart/tEnd (the label-facing clamps)
  // toward straight-line clamp positions.
  if (straightenFactor > 0.001) {
    if (tailLengthRatio > 0.0) {
${g}
      float srcExtent = a_sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
      float srcEffective = 1.0 - u_correctionRatio / srcExtent;
      float srcCa = u_cameraAngle * (1.0 - a_sourceRotateAlign);
      mat2 srcRot = mat2(cos(srcCa), -sin(srcCa), sin(srcCa), cos(srcCa));
      float lo = 0.0, hi = 0.5;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = srcRot * ((pos - a_source) / srcExtent);
        float sdf = querySDF(int(a_sourceShapeId), localPos, srcEffective);
        if (sdf < 0.0) lo = mid; else hi = mid;
      }
      tStart = mix(tStart, (lo + hi) * 0.5, straightenFactor);
    }
    if (headLengthRatio > 0.0) {
${b}
      float tgtExtent = a_targetSize * u_correctionRatio / u_sizeRatio * 2.0;
      float tgtEffective = 1.0 - u_correctionRatio / tgtExtent;
      float tgtCa = u_cameraAngle * (1.0 - a_targetRotateAlign);
      mat2 tgtRot = mat2(cos(tgtCa), -sin(tgtCa), sin(tgtCa), cos(tgtCa));
      float lo = 0.5, hi = 1.0;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = tgtRot * ((pos - a_target) / tgtExtent);
        float sdf = querySDF(int(a_targetShapeId), localPos, tgtEffective);
        if (sdf < 0.0) hi = mid; else lo = mid;
      }
      tEnd = mix(tEnd, (lo + hi) * 0.5, straightenFactor);
    }
  }

  v_clamp = vec4(tStart, tEnd, straightenFactor, pathLength);

  // Scatter this point to its edge's texel center in the frame texture.
  float x = mod(float(edgeIdx), u_frameTextureWidth);
  float y = floor(float(edgeIdx) / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`}const st=0,Ii=1,lt=2;function Yr(i,e,t){const a=[];t&&(a.push([st,0,-1],[st,0,1]),a.push([st,1,-1],[st,1,1]));for(let n=0;n<=i;n++){const r=n/i;a.push([Ii,r,-1],[Ii,r,1])}return e&&(a.push([lt,0,-1],[lt,0,1]),a.push([lt,1,-1],[lt,1,1])),{data:a,attributes:[{name:"a_zone",size:1,type:Xe},{name:"a_zoneT",size:1,type:Xe},{name:"a_side",size:1,type:Xe}],verticesPerEdge:a.length}}function Zr(i,e,t,a){const n=q([...i,...t]),r=Je(n),o=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding","u_nodeDataTexture"]),s=new Set,l=[],h=p=>{!o.has(p.name)&&!s.has(p.name)&&(s.add(p.name),l.push(`uniform ${p.type} ${p.name};`))};i.forEach(p=>p.uniforms.forEach(h)),e.forEach(p=>p.uniforms.forEach(h)),t.forEach(p=>p.uniforms.forEach(h));const d=a.map(p=>`in ${p.size===1?"float":`vec${p.size}`} ${p.name};`).join(`
`),u=e.map(p=>W(p.widthFactor)).join(", "),c=Math.max(...i.map(p=>p.minBodyLengthRatio||0)),f=t.some(p=>p.needsNodeColors),g=i.some(p=>p.needsNodeSize);return`#version 300 es

// Constant attributes (per vertex)
${d}

// Per-edge attributes
// Edge data (source/target indices, thickness, extremity ratios, path/extremity IDs)
// is fetched from edge data texture via edge index
in float a_edgeIndex;   // Index into edge data texture
in vec4 a_color;        // Edge color
in vec4 a_id;           // Edge ID for picking
in float a_opacity;     // Edge opacity

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture;
uniform int u_edgeFrameTextureWidth;

// Edge path attribute texture uniforms
${r.uniformDeclarations}

// Custom uniforms
${l.join(`
`)}

// Standard varyings
out vec4 v_color;
out float v_opacity;
out vec4 v_id;
out float v_thickness;       // Edge body thickness (in consistent units)
out float v_t;
out float v_tStart;
out float v_tEnd;
out float v_side;
out float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
out vec2 v_source;
out vec2 v_target;
out float v_edgeLength;
${g?`
out float v_sourceNodeSize;  // Source node size (mirrored in labels/generator.ts as plain float)
out float v_targetNodeSize;  // Target node size (mirrored in labels/generator.ts as plain float)`:""}
${f?`
out vec4 v_sourceColor;
out vec4 v_targetColor;`:""}
// Zone varyings
out float v_zone;            // 0=tail, 1=body, 2=head
out float v_zoneT;           // Position within zone [0,1]
out float v_headLengthRatio; // Head length as ratio of thickness
out float v_tailLengthRatio; // Tail length as ratio of thickness
out float v_headWidthRatio;  // Head width factor
out float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat out int v_pathId;
flat out int v_headId;
flat out int v_tailId;

// Path/layer attribute varyings (fetched from edge attribute texture)
${r.vertexVaryingDeclarations}

const float bias = 255.0 / 254.0;

// Width factor array for extremities (shared pool for head/tail)
const float EXTREMITY_WIDTH_FACTORS[${e.length}] = float[](${u});

// All path functions
${ni(i)}

// Path selector functions
${ri(i)}

// Node-data fetch helper (geometry texel of the two-texel node stride)
${re}
${f?Kn:""}
// Per-edge clamp from the frame-pass (tStart, tEnd, straightenFactor, pathLength)
${Le}

void main() {
  // Fetch edge data from edge texture (2 texels per edge)
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, (headId << 4) | tailId
  int edgeIdx = int(a_edgeIndex);

  // Hidden edges are flagged with a negative row by EdgeProgram.process(). Push
  // the whole primitive outside the clip volume: every vertex lands at the same
  // out-of-range position, so it is fully clipped and rasterizes nothing —
  // neither to the frame buffer nor to the picking buffer.
  if (edgeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    return;
  }

  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  // edgeData0.w is now reserved (curvature moved to path attribute texture)
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes from edge attribute texture
${r.fetchCode}

  // Assign path/layer attribute varyings
${r.varyingAssignments}

  // Fetch source and target node geometry (texel 0 of the two-texel node stride)
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
${g?`
  // Assign node size varyings early (path functions like loops need them during clamping)
  v_sourceNodeSize = srcNodeData.z;
  v_targetNodeSize = tgtNodeData.z;`:""}
${f?`
  v_sourceColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  v_targetColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);`:""}

  // Convert thickness to WebGL units
  float minThickness = u_minEdgeThickness;
  float pixelsThickness = max(a_thickness, minThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Extremity parameters from ID lookups (shared pool)
  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = ${W(c)};

  // Per-edge values from the frame-pass texture (read by edge index).
  // tStart/tEnd are the ungated boundary clamps: re-apply the body's extremity
  // gating here (no extremity → body runs to the node center, 0/1).
  vec4 frameClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  float tStart           = a_tailLengthRatio > 0.0 ? frameClamp.x : 0.0;
  float tEnd             = a_headLengthRatio > 0.0 ? frameClamp.y : 1.0;
  float straightenFactor = frameClamp.z;
  float pathLength       = frameClamp.w;

  // Anti-aliasing width (~1 pixel, normalized by thickness)
  float antialiasingWidth = u_correctionRatio / webGLThickness;

  float visibleLength = pathLength * (tEnd - tStart);

  // Compute extremity lengths in world units
  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  // Handle short edges: scale down extremities if needed
  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  // Convert lengths to t-values
  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  // Zone boundaries in t-space
  float tTailEnd = tStart + tailLengthT;
  float tHeadStart = tEnd - headLengthT;

  // Ensure body has non-negative length
  if (tTailEnd > tHeadStart) {
    float mid = (tStart + tEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Convert to webGL units for geometry expansion
  float aaWidthWebGL = antialiasingWidth * webGLThickness;

  // Extra geometry width for picking padding (0 in visual mode)
  #ifdef PICKING_MODE
    float pickingPaddingWebGL = u_pickingPadding * u_correctionRatio;
  #else
    float pickingPaddingWebGL = 0.0;
  #endif

  // Straight-line direction and normal (for blending when straightenFactor > 0)
  vec2 straightDir = length(a_target - a_source) > 0.0001
    ? normalize(a_target - a_source) : vec2(1.0, 0.0);
  vec2 straightNormal = vec2(-straightDir.y, straightDir.x);

  // Zone-based vertex processing using path selectors
  vec2 position;
  vec2 normal;
  float t;
  float zone = a_zone;
  float zoneT = a_zoneT;
  float side = a_side;

  // Scaled extremity width factors (geometry must be at least as wide as body)
  float scaledTailWidth = max(tailWidthFactor * extremityScale, 1.0);
  float scaledHeadWidth = max(headWidthFactor * extremityScale, 1.0);

  if (zone < 0.5) {
    // TAIL ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tStart, a_source, a_target),
                         queryPathPosition(pathId, tTailEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tStart, tTailEnd, zoneT);

  } else if (zone < 1.5) {
    // BODY ZONE: follows path curvature with width = 1.0
    t = mix(tTailEnd, tHeadStart, zoneT);
    normal = queryPathNormal(pathId, t, a_source, a_target);
    float halfWidth = webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = queryPathPosition(pathId, t, a_source, a_target) + normal * side * halfWidth;

  } else {
    // HEAD ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tHeadStart, a_source, a_target),
                         queryPathPosition(pathId, tEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tHeadStart, tEnd, zoneT);
  }

  // Blend toward straight line based on path twist in extremity zones
  if (straightenFactor > 0.001) {
    float zoneWidth = zone < 0.5 ? webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      zone < 1.5 ? webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    vec2 straightPos = mix(a_source, a_target, t) + straightNormal * side * zoneWidth;
    position = mix(position, straightPos, straightenFactor);
  }

  gl_Position = vec4((u_matrix * vec3(position, 1.0)).xy, 0.0, 1.0);

  // Pass varyings to fragment shader
  v_color = a_color;
  v_color.a *= bias;
  v_opacity = a_opacity;
  v_id = a_id;
  v_thickness = webGLThickness;
  v_t = t;
  v_tStart = tStart;
  v_tEnd = tEnd;
  v_side = side;
  v_antialiasingWidth = antialiasingWidth;
  v_source = a_source;
  v_target = a_target;
  v_edgeLength = pathLength;

  // Zone varyings
  v_zone = zone;
  v_zoneT = zoneT;
  v_headLengthRatio = headLengthRatio * extremityScale;
  v_tailLengthRatio = tailLengthRatio * extremityScale;
  // Scale extremity width proportionally with length when crushed
  v_headWidthRatio = headWidthFactor * extremityScale;
  v_tailWidthRatio = tailWidthFactor * extremityScale;

  // Multi-path varyings
  v_pathId = pathId;
  v_headId = headId;
  v_tailId = tailId;
}
`}function Qr(i,e,t,a){const n=q([...i,...t]),r=Je(n),o=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding"]),s=new Set,l=[],h=m=>{!o.has(m.name)&&!s.has(m.name)&&(s.add(m.name),l.push(`uniform ${m.type} ${m.name};`))};i.forEach(m=>m.uniforms.forEach(h)),e.forEach(m=>m.uniforms.forEach(h)),t.forEach(m=>m.uniforms.forEach(h));const d=e.map(m=>W(m.baseRatio??.5)).join(", "),u=m=>e.length>1?`EXTREMITY_BASE_RATIOS[${m}]`:W(e[0]?.baseRatio??.5),c=e.some(m=>de(m.length)?!0:m.length>0),f=t.some(m=>m.needsNodeColors),g=i.some(m=>m.needsNodeSize),b=t.map((m,y)=>`  // Layer ${y+1}: ${m.name}
  color = blendOver(color, layer_${m.name}(context));`).join(`

`);return`#version 300 es
precision highp float;

// Standard varyings
in vec4 v_color;
in float v_opacity;
in vec4 v_id;
in float v_thickness;       // Edge body thickness
in float v_t;
in float v_tStart;
in float v_tEnd;
in float v_side;
in float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
in vec2 v_source;
in vec2 v_target;
in float v_edgeLength;
${g?`
in float v_sourceNodeSize;   // Source node size (mirrored in labels/generator.ts as plain float)
in float v_targetNodeSize;   // Target node size (mirrored in labels/generator.ts as plain float)`:""}
${f?`
in vec4 v_sourceColor;
in vec4 v_targetColor;`:""}
// Zone varyings
in float v_zone;            // 0=tail, 1=body, 2=head
in float v_zoneT;           // Position within zone [0,1]
in float v_headLengthRatio; // Head length as ratio of thickness (scaled for short edges)
in float v_tailLengthRatio; // Tail length as ratio of thickness (scaled for short edges)
in float v_headWidthRatio;  // Head width factor
in float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat in int v_pathId;
flat in int v_headId;
flat in int v_tailId;

// Path/layer attribute varyings (from vertex shader texture fetch)
${r.fragmentVaryingDeclarations}

// Standard uniforms (needed by some path types)
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Custom uniforms
${l.join(`
`)}

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

${e.length>1?`// Base ratio array for extremities (shared pool for head/tail)
const float EXTREMITY_BASE_RATIOS[${e.length}] = float[](${d});`:""}

// EdgeContext struct
struct EdgeContext {
  float t;                   // Position along path [0, 1]
  float sdf;                 // Signed distance from centerline
  vec2 position;             // World position
  vec2 tangent;              // Path tangent
  vec2 normal;               // Path normal
  float thickness;           // Edge thickness
  float aaWidth;             // Anti-aliasing width
  float edgeLength;          // Total path length
  float tStart;              // Clamped start t
  float tEnd;                // Clamped end t
  float distanceFromSource;  // Arc distance from source
  float distanceToTarget;    // Arc distance to target
};

EdgeContext context;

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// All path functions
${ni(i)}

// Path selector functions
${ri(i)}

// All extremity functions
${Hr(e)}

// Extremity SDF selector (shared pool for head/tail)
${jr(e)}

// Layer functions
${t.map(m=>m.glsl).join(`

`)}

// Helper: Compute arc length using path selector
float computeArcLengthMulti(int pathId, float t0, float t1, vec2 source, vec2 target, int samples) {
  float arcLen = 0.0;
  vec2 prev = queryPathPosition(pathId, t0, source, target);
  for (int i = 1; i <= samples; i++) {
    float t = t0 + (t1 - t0) * float(i) / float(samples);
    vec2 curr = queryPathPosition(pathId, t, source, target);
    arcLen += length(curr - prev);
    prev = curr;
  }
  return arcLen;
}

void main() {
  // Compute normalized t within visible edge (0 = start, 1 = end)
  float tNorm = (v_t - v_tStart) / max(v_tEnd - v_tStart, 0.0001);

  // Edge body half-thickness
  float halfThickness = v_thickness * 0.5;

  // Convert normalized AA width to webGL units (~1 pixel)
  float aaWidthWebGL = v_antialiasingWidth * v_thickness;

  // Distance from centerline based on v_side interpolation
  float zoneWidthFactor = v_zone < 0.5 ? v_tailWidthRatio :
                          v_zone < 1.5 ? 1.0 :
                          v_headWidthRatio;
  // In PICKING_MODE, inflate halfGeometryWidth to match the inflated vertex geometry
  #ifdef PICKING_MODE
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL + u_pickingPadding * aaWidthWebGL;
  #else
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL;
  #endif
  float distFromCenter = abs(v_side) * halfGeometryWidth;

  // Populate EdgeContext (for layer functions)
  context.t = tNorm;
  context.sdf = distFromCenter - halfThickness;
  context.position = queryPathPosition(v_pathId, v_t, v_source, v_target);
  context.tangent = queryPathTangent(v_pathId, v_t, v_source, v_target);
  context.normal = vec2(-context.tangent.y, context.tangent.x);
  context.thickness = v_thickness;
  context.aaWidth = aaWidthWebGL;
  context.edgeLength = v_edgeLength;
  context.tStart = v_tStart;
  context.tEnd = v_tEnd;

  // Compute arc distances
  float visibleLength = v_edgeLength * (v_tEnd - v_tStart);
  float pathT = v_t;
  float pathTNorm = tNorm;
${i.every(m=>m.linearParameterization)?`  // All paths have linear parameterization: t maps directly to arc distance
  context.distanceFromSource = pathTNorm * visibleLength;
  context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;`:i.every(m=>!m.linearParameterization)?`  // No paths have linear parameterization: use numerical integration
  context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
  context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);`:`  // Mixed parameterization: use analytical for linear paths, numerical for others
  if (${i.filter(m=>m.linearParameterization).map(m=>`v_pathId == ${i.indexOf(m)}`).join(" || ")}) {
    context.distanceFromSource = pathTNorm * visibleLength;
    context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;
  } else {
    context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
    context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);
  }`}

  // Compute SDF based on zone using extremity selector (shared pool)
  float bodySDF = distFromCenter - halfThickness;
  float finalSDF;

${c?`  // Base ratios, from baseRatioLookup
  float headBaseRatio = ${u("v_headId")};
  float tailBaseRatio = ${u("v_tailId")};

  if (v_zone < 0.5) {
    // TAIL ZONE: v_zoneT goes 0 (tip) to 1 (base)
    vec2 uv = vec2((1.0 - v_zoneT) * v_tailLengthRatio, v_side * v_tailWidthRatio * 0.5);
    float tailSDF = queryExtremitySDF(v_tailId, uv, v_tailLengthRatio, v_tailWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT > 1 - baseRatio)
    if (v_zoneT > 1.0 - tailBaseRatio) {
      finalSDF = min(tailSDF, bodySDF);
    } else {
      finalSDF = tailSDF;
    }
  } else if (v_zone < 1.5) {
    // BODY ZONE: distance from centerline
    finalSDF = bodySDF;
  } else {
    // HEAD ZONE: v_zoneT goes 0 (base) to 1 (tip)
    vec2 uv = vec2(v_zoneT * v_headLengthRatio, v_side * v_headWidthRatio * 0.5);
    float headSDF = queryExtremitySDF(v_headId, uv, v_headLengthRatio, v_headWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT < baseRatio)
    if (v_zoneT < headBaseRatio) {
      finalSDF = min(headSDF, bodySDF);
    } else {
      finalSDF = headSDF;
    }
  }`:`  // No extremity draws tail/head geometry, so every vertex is body zone.
  finalSDF = bodySDF;`}

  #ifdef PICKING_MODE
    // Picking pass: output edge ID for pixels within the picking area
    if (finalSDF > u_pickingPadding * aaWidthWebGL) discard;
    fragColor = v_id;
  #else
${a?`    // Visual pass: anti-aliased edge with layers, edge opacity applied once
    float alpha = smoothstep(aaWidthWebGL, -aaWidthWebGL, finalSDF) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) edge with layers, edge opacity applied once
    float alpha = (finalSDF < 0.0 ? 1.0 : 0.0) * v_opacity;`}
    if (alpha < 0.01) discard;

    // Apply layers sequentially with "over" compositing
    vec4 color = vec4(0.0);

${b}

    // Mix with transparent to fade both color AND alpha (pre-multiplied alpha for correct blending)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`}function Jr(i,e,t){const a=de(e.length)?!0:e.length>0,n=de(t.length)?!0:t.length>0;if(i.generateConstantData){const r=i.generateConstantData();return{data:r.data,attributes:r.attributes,verticesPerEdge:r.verticesPerEdge}}return Yr(i.segments,a,n)}function ki(i){const{paths:e,extremities:t,layers:a}=Aa(i),n=i.antialias??!0,r=new Map,o=new Map,s=new Map;for(const m of e)for(const y of t)for(const v of t){const _=`${m.name}:${y.name}:${v.name}`,x=Jr(m,y,v);r.set(_,x.verticesPerEdge),o.set(_,x.data);for(const T of x.attributes)s.has(T.name)||s.set(T.name,T)}const l=Array.from(s.values()),h={};l.forEach((m,y)=>{h[m.name]=y});let d=0,u="";for(const[m,y]of r)y>d&&(d=y,u=m);const c=o.get(u)||[],[f]=u.split(":"),g=e.find(m=>m.name===f);let b=[];g?.generateConstantData?b=g.generateConstantData().attributes:b=[{name:"a_zone"},{name:"a_zoneT"},{name:"a_side"}];const p=c.map(m=>{const y=new Array(l.length).fill(0);return b.forEach((v,_)=>{const x=h[v.name];x!==void 0&&_<m.length&&(y[x]=m[_])}),y});return{vertexShader:Zr(e,t,a,l),fragmentShader:Qr(e,t,a,n),uniforms:Or(e,t,a),attributes:eo(),verticesPerEdge:d,constantData:p,constantAttributes:l,vertexCountsPerCombination:r,constantDataPerCombination:o}}function eo(i,e,t){return[{name:"a_edgeIndex",size:1,type:Xe},{name:"a_color",size:4,type:Fi,normalized:!0},{name:"a_id",size:4,type:Fi,normalized:!0},{name:"a_opacity",size:1,type:Xe}]}const to=`#version 300 es
precision highp float;

in vec4 v_clamp;

// RGBA32F target: stores (tStart, tEnd, straightenFactor, pathLength).
out vec4 fragColor;

void main() {
  fragColor = v_clamp;
}
`;class io{constructor(e,t){this.uniformLocations={};const{paths:a,extremities:n,layers:r,nodeShapes:o,nodeLayers:s}=t;this.gl=e,this.hasAttributeData=q([...a,...r]).floatsPerItem>0,this.hasNodeAttributeData=Object.keys(Pe(o,s).offsets).length>0,this.vertexShader=Yt(e,Kr(a,n,r,o,s)),this.fragmentShader=Zt(e,to),this.program=Qt(e,[this.vertexShader,this.fragmentShader]);const l=new Set;this.customUniforms=[];for(const d of[...a,...n])for(const u of d.uniforms)l.has(u.name)||(l.add(u.name),this.customUniforms.push(u));const h=["u_sizeRatio","u_correctionRatio","u_cameraAngle","u_minEdgeThickness","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode","u_frameTextureWidth","u_frameTextureHeight",...this.customUniforms.map(d=>d.name)];for(const d of h)this.uniformLocations[d]=e.getUniformLocation(this.program,d);this.vao=e.createVertexArray()}run(e,t,a,n,r){if(a===0)return;const{gl:o}=this,s=this.uniformLocations;o.useProgram(this.program),o.bindVertexArray(this.vao),s.u_sizeRatio&&o.uniform1f(s.u_sizeRatio,e.sizeRatio),s.u_correctionRatio&&o.uniform1f(s.u_correctionRatio,e.correctionRatio),s.u_cameraAngle&&o.uniform1f(s.u_cameraAngle,e.cameraAngle),s.u_minEdgeThickness&&o.uniform1f(s.u_minEdgeThickness,e.minEdgeThickness),s.u_nodeDataTexture&&o.uniform1i(s.u_nodeDataTexture,e.nodeDataTextureUnit),s.u_nodeDataTextureWidth&&o.uniform1i(s.u_nodeDataTextureWidth,e.nodeDataTextureWidth),s.u_edgeDataTexture&&o.uniform1i(s.u_edgeDataTexture,e.edgeDataTextureUnit),s.u_edgeDataTextureWidth&&o.uniform1i(s.u_edgeDataTextureWidth,e.edgeDataTextureWidth),s.u_frameTextureWidth&&o.uniform1f(s.u_frameTextureWidth,t.getTextureWidth()),s.u_frameTextureHeight&&o.uniform1f(s.u_frameTextureHeight,t.getTextureHeight()),this.hasAttributeData&&n&&(n.bind(ue),s.u_edgeAttributeTexture&&o.uniform1i(s.u_edgeAttributeTexture,ue),s.u_edgeAttributeTextureWidth&&o.uniform1i(s.u_edgeAttributeTextureWidth,n.getTextureWidth()),s.u_edgeAttributeTexelsPerEdge&&o.uniform1i(s.u_edgeAttributeTexelsPerEdge,n.getTexelsPerItem())),this.hasNodeAttributeData&&r&&(r.bind(he),s.u_layerAttributeTexture&&o.uniform1i(s.u_layerAttributeTexture,he),s.u_layerAttributeTextureWidth&&o.uniform1i(s.u_layerAttributeTextureWidth,r.getTextureWidth()),s.u_layerAttributeTexelsPerNode&&o.uniform1i(s.u_layerAttributeTexelsPerNode,r.getTexelsPerItem()));for(const l of this.customUniforms)ii(o,this.uniformLocations[l.name],l);t.bindAsRenderTarget(),o.disable(o.BLEND),o.disable(o.DEPTH_TEST),o.drawArrays(o.POINTS,0,a),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindVertexArray(null)}kill(){const{gl:e}=this;e.deleteProgram(this.program),e.deleteShader(this.vertexShader),e.deleteShader(this.fragmentShader),e.deleteVertexArray(this.vao)}}function ao(i,e){if(typeof i=="string"){const[a,n,r,o]=_n(i).map(s=>s.toFixed(6));return{glsl:`vec4(${a}, ${n}, ${r}, ${o})`,attributes:[],needsNodeColors:!1}}if("node"in i&&i.node)return{glsl:i.node==="source"?"v_sourceColor":"v_targetColor",attributes:[],needsNodeColors:!0};const t=i;return{glsl:`v_${e}`,attributes:[{name:`a_${e}`,size:4,type:WebGL2RenderingContext.UNSIGNED_BYTE,normalized:!0,source:t.attribute,defaultValue:t.default}],needsNodeColors:!1}}function et(i){const e=i?.color;if(e===void 0)return{name:"plain",glsl:`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return v_color;
}
`,uniforms:[],attributes:[]};const t=ao(e,"plainColor");return{name:"plain",glsl:`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return ${t.glsl};
}
`,uniforms:[],attributes:t.attributes,needsNodeColors:t.needsNodeColors}}function Me(i,e,t,a,n,r){if(i.length===1)return`${a} ${e}(int pathId, ${n}) {
  return path_${i[0].name}_${t}(${r});
}`;const o=i.map((s,l)=>`    case ${l}: return path_${s.name}_${t}(${r});`).join(`
`);return`${a} ${e}(int pathId, ${n}) {
  switch (pathId) {
${o}
    default: return path_${i[0].name}_${t}(${r});
  }
}`}const no=`
vec3 computeEdgeLabelBodyBounds(
  float tStart, float tEnd, float pathLength,
  float webGLThickness, float headLengthRatio, float tailLengthRatio
) {
  float visibleLength = pathLength * (tEnd - tStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float totalNeededLength = headLength + tailLength;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    float extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float bodyStartDist = tStart * pathLength + tailLength;
  float bodyEndDist = tEnd * pathLength - headLength;
  return vec3(bodyStartDist, bodyEndDist, max(bodyEndDist - bodyStartDist, 0.0));
}
`;function ro(i,e){const t=W(i),a=W(e);return`
float computeEdgeLabelAlpha(float bodyLength, float textWidthWebGL) {
  float ratio = textWidthWebGL > 0.0001 ? min(bodyLength / textWidthWebGL, 1.0) : 1.0;
  if (ratio < ${t}) return 0.0;
  if (ratio < ${a}) return (ratio - ${t}) / (${a} - ${t});
  return 1.0;
}
`}const oo=`
float computeEdgeLabelPerpOffset(
  float positionMode,
  float halfThickness, float marginWebGL, float halfTextHeight,
  vec2 source, vec2 target, mat3 matrix
) {
  float magnitude = halfThickness + marginWebGL + halfTextHeight;
  if (positionMode == 1.0) return magnitude;
  if (positionMode == 2.0) return -magnitude;
  if (positionMode == 3.0) {
    vec3 sc = matrix * vec3(source, 1.0);
    vec3 tc = matrix * vec3(target, 1.0);
    return sc.x < tc.x ? magnitude : -magnitude;
  }
  return 0.0;
}
`;function Ra(i){const{paths:e,minVisibilityThreshold:t,fullVisibilityThreshold:a}=i,n=e.some(s=>s.hasSharpCorners),r=e.map(s=>`// --- Path: ${s.name} ---
${s.glsl}

// Tangent/normal functions: analytical if provided, otherwise numerical
${s.analyticalTangentGlsl||wa(s.name)}

// Auto-generated fallbacks for any missing path functions
${Da(s.name,s.glsl)}

// Corner skip helpers (for paths with sharp corners like step/taxi)
${s.cornerSkipGlsl||""}
`).join(`
`),o=n?`// Corner function selectors (only some paths have sharp corners)
vec2 queryGetCornerTs(int pathId, vec2 source, vec2 target) {
  switch (pathId) {
${e.map((s,l)=>s.hasSharpCorners?`    case ${l}: return path_${s.name}_getCornerTs(source, target);`:`    case ${l}: return vec2(-1.0, -1.0); // No corners for ${s.name}`).join(`
`)}
    default: return vec2(-1.0, -1.0);
  }
}

vec2 queryGetCornerConcavity(int pathId, vec2 source, vec2 target, float perpOffset) {
  switch (pathId) {
${e.map((s,l)=>s.hasSharpCorners?`    case ${l}: return path_${s.name}_getCornerConcavity(source, target, perpOffset);`:`    case ${l}: return vec2(0.0, 0.0); // No corners for ${s.name}`).join(`
`)}
    default: return vec2(0.0, 0.0);
  }
}`:"";return`
// ============================================================================
// Node data fetch (geometry texel) and per-edge clamp fetch (edge-frame texture)
// ============================================================================

${re}
${Le}

// ============================================================================
// Path Functions (one block per path)
// ============================================================================

${r}

// ============================================================================
// Path Query Selectors (dispatch by pathId)
// ============================================================================

${Me(e,"queryPathPosition","position","vec2","float t, vec2 source, vec2 target","t, source, target")}

${Me(e,"queryPathTangent","tangent","vec2","float t, vec2 source, vec2 target","t, source, target")}

${Me(e,"queryPathNormal","normal","vec2","float t, vec2 source, vec2 target","t, source, target")}

${Me(e,"queryPathLength","length","float","vec2 source, vec2 target","source, target")}

${Me(e,"queryPathTAtDistance","t_at_distance","float","float dist, vec2 source, vec2 target","dist, source, target")}

${o}

// ============================================================================
// Shared helpers (body bounds, alpha ramp, perpendicular offset)
// ============================================================================

${no}
${ro(t,a)}
${oo}
`}const so=ie.fontSize,lo=new Map,Ca=24,Gi=(Ca+1)*2;function ho(i){const{paths:e,fontSizeMode:t,headLengthRatio:a,tailLengthRatio:n,minVisibilityThreshold:r,fullVisibilityThreshold:o}=i,s=t==="scaled",l=et(),h=q([...e,l]),d=Je(h);return`#version 300 es

// Per-instance attributes
in float a_edgeIndex;
in float a_edgeAttrIndex;
in float a_baseFontSize;
in float a_totalTextWidth;
in float a_positionMode;
in float a_margin;
in float a_padding;
in vec4 a_color;
in vec4 a_id;

// Per-vertex (constant) attribute: strip vertex index
in float a_vertexIndex;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
${s?"uniform float u_zoomSizeRatio;":""}

${d.uniformDeclarations}

out vec4 v_color;
out vec4 v_id;
out float v_alphaModifier;

const float ATLAS_FONT_SIZE = ${W(so)};
const float HEAD_RATIO = ${W(a)};
const float TAIL_RATIO = ${W(n)};
const int RIBBON_SEGMENTS = ${Ca};

// Path attribute varyings (declared as plain locals since this shader has no FS inputs for them)
${d.vertexVaryingDeclarations.replace(/out /g,"")}

// Node size variables used by some path functions (self-loops, etc.)
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
${Ra({paths:e,minVisibilityThreshold:r,fullVisibilityThreshold:o})}

void main() {
  int vIdx = int(a_vertexIndex);
  int pairIdx = vIdx / 2;
  int side = vIdx - pairIdx * 2; // 0 = left/bottom, 1 = right/top

  // --- Fetch edge data (2 texels per edge) ---
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 e0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 e1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, e0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, e1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  int pathId = int(edgeData1.z);

  // --- Fetch path attributes (curvature, etc.) ---
  {
    int edgeIdx = int(a_edgeAttrIndex);
${d.fetchCode}
${d.varyingAssignments}
  }

  // --- Fetch node data: geometry (texel 0) + rotation flags (texel 1) ---
  vec4 srcN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcN.xy;
  vec2 target = tgtN.xy;
  float sourceSize = srcN.z;
  float targetSize = tgtN.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;

  // --- Pixel-to-graph conversion (fixed font mode) ---
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // --- Body bounds (shared with edge label shader) ---
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, HEAD_RATIO, TAIL_RATIO
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // --- Text dimensions ---
  float baseFontSize = a_baseFontSize;
  ${s?`float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  float textWidthWebGL = a_totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float marginWebGL = a_margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  float textWidthWebGL = a_totalTextWidth * fontScale * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;
  float marginWebGL = a_margin * pixelToGraph;`}
  float paddingWebGL = a_padding * pixelToGraph;

  // --- Alpha modifier (shared with edge label shader) ---
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);
  if (alphaModifier <= 0.0 || textWidthWebGL <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    v_alphaModifier = 0.0;
    return;
  }

  // --- Perpendicular offset (shared with edge label shader) ---
  float halfThickness = webGLThickness * 0.5;
  float perpOffset = computeEdgeLabelPerpOffset(
    a_positionMode, halfThickness, marginWebGL, halfTextHeight, source, target, u_matrix
  );

  // --- Ribbon span (clipped to body) ---
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;
  float halfTextWebGL = textWidthWebGL * 0.5;
  float labelStartDist = max(bodyCenterDist - halfTextWebGL, bodyStartDist);
  float labelEndDist = min(bodyCenterDist + halfTextWebGL, bodyEndDist);

  // Sample centerline at this pair, then apply perpendicular offset.
  // The ribbon follows the centerline path (simple & robust); for curved edges
  // this closely matches the offset path the characters sit on.
  float u = float(pairIdx) / float(RIBBON_SEGMENTS);
  float arcDist = mix(labelStartDist, labelEndDist, u);
  float t = queryPathTAtDistance(pathId, arcDist, source, target);
  vec2 pos = queryPathPosition(pathId, t, source, target);
  vec2 tan = queryPathTangent(pathId, t, source, target);
  vec2 perp = vec2(-tan.y, tan.x);

  vec2 centerPos = pos + perp * perpOffset;

  float halfRibbon = halfTextHeight + paddingWebGL;
  float sideSign = side == 0 ? -1.0 : 1.0;
  vec2 ribbonPos = centerPos + perp * (sideSign * halfRibbon);

  vec3 clipPos = u_matrix * vec3(ribbonPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  v_color = a_color;
  v_id = a_id;
  v_alphaModifier = alphaModifier;
}
`}const uo=`#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_id;
in float v_alphaModifier;

out vec4 fragColor;

void main() {
#ifdef PICKING_MODE
  if (v_alphaModifier <= 0.0) discard;
  fragColor = v_id;
#else
  float alpha = v_color.a * v_alphaModifier;
  if (alpha <= 0.0) discard;
  fragColor = vec4(v_color.rgb * alpha, alpha);
#endif
}
`;function co(i,e,t,a){const{shaderConfig:n}=a,{paths:r,fontSizeMode:o}=n;if(r.length===0)throw new Error("createEdgeLabelBackgroundProgram: shaderConfig must declare at least one path");const s=et(),l=q([...r,s]),h=Et([...r,s],l),d=ho(n);class u extends Te{constructor(f,g,b){super(f,g,b),this.totalCount=0,this.bufferCapacity=0,this.edgeAttributeTexture=null,this.edgeAttributeTexture=new St(f,l),this.packedAttributeData=new Float32Array(l.floatsPerItem)}getDefinition(){const{FLOAT:f,UNSIGNED_BYTE:g,TRIANGLE_STRIP:b}=WebGL2RenderingContext,p=[];for(let y=0;y<Gi;y++)p.push([y]);const m=["u_matrix","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_cameraAngle","u_resolution","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth"];return o==="scaled"&&m.push("u_zoomSizeRatio"),l.floatsPerItem>0&&m.push("u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"),{VERTICES:Gi,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:uo,METHOD:b,UNIFORMS:m,ATTRIBUTES:[{name:"a_edgeIndex",size:1,type:f},{name:"a_edgeAttrIndex",size:1,type:f},{name:"a_baseFontSize",size:1,type:f},{name:"a_totalTextWidth",size:1,type:f},{name:"a_positionMode",size:1,type:f},{name:"a_margin",size:1,type:f},{name:"a_padding",size:1,type:f},{name:"a_color",size:4,type:g,normalized:!0},{name:"a_id",size:4,type:g,normalized:!0}],CONSTANT_ATTRIBUTES:[{name:"a_vertexIndex",size:1,type:f}],CONSTANT_DATA:p}}processEdgeLabelBackground(f,g,b){let p=0;if(this.edgeAttributeTexture&&l.floatsPerItem>0){p=this.edgeAttributeTexture.allocate(g);const _=this.packedAttributeData;wt(h,b.edgeAttributes,_,"",lo,0),this.edgeAttributeTexture.updateAllAttributes(g,_)}const{floats:m,ints:y}=this;let v=f*this.STRIDE;m[v++]=b.edgeIndex,m[v++]=p,m[v++]=b.baseFontSize,m[v++]=b.totalTextWidth,m[v++]=b.positionMode,m[v++]=b.margin,m[v++]=b.padding,m[v++]=b.color,y[v++]=b.id}setUniforms(f,{gl:g,uniformLocations:b}){if(g.uniformMatrix3fv(b.u_matrix,!1,f.matrix),g.uniform1f(b.u_sizeRatio,f.sizeRatio),g.uniform1f(b.u_correctionRatio,f.correctionRatio),g.uniform1f(b.u_pixelRatio,f.pixelRatio),g.uniform1f(b.u_cameraAngle,f.cameraAngle),g.uniform2f(b.u_resolution,f.width,f.height),b.u_nodeDataTexture!==void 0&&g.uniform1i(b.u_nodeDataTexture,f.nodeDataTextureUnit),b.u_nodeDataTextureWidth!==void 0&&g.uniform1i(b.u_nodeDataTextureWidth,f.nodeDataTextureWidth),b.u_edgeDataTexture!==void 0&&g.uniform1i(b.u_edgeDataTexture,f.edgeDataTextureUnit),b.u_edgeDataTextureWidth!==void 0&&g.uniform1i(b.u_edgeDataTextureWidth,f.edgeDataTextureWidth),b.u_edgeFrameTexture!==void 0&&g.uniform1i(b.u_edgeFrameTexture,f.edgeFrameTextureUnit),b.u_edgeFrameTextureWidth!==void 0&&g.uniform1i(b.u_edgeFrameTextureWidth,f.edgeFrameTextureWidth),o==="scaled"&&b.u_zoomSizeRatio!==void 0){const p=this.renderer.getSetting("zoomToSizeRatioFunction");g.uniform1f(b.u_zoomSizeRatio,1/p(f.zoomRatio))}this.edgeAttributeTexture&&l.floatsPerItem>0&&b.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(ue),g.uniform1i(b.u_edgeAttributeTexture,ue),g.uniform1i(b.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),g.uniform1i(b.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()))}renderProgram(f,g){this.edgeAttributeTexture&&l.floatsPerItem>0&&this.edgeAttributeTexture.upload(),super.renderProgram(f,g)}kill(){this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),super.kill()}drawWebGL(f,{gl:g}){this.totalCount!==0&&g.drawArraysInstanced(g.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}reallocate(f){this.totalCount=f,f>this.bufferCapacity&&(this.bufferCapacity=Math.max(f,Math.ceil(this.bufferCapacity*1.5)||10),super.reallocate(this.bufferCapacity))}}return new u(i,e,t)}function La(i){return{paths:i.paths,headLengthRatio:i.headLengthRatio??0,tailLengthRatio:i.tailLengthRatio??0,fontSizeMode:i.fontSizeMode??"fixed",minVisibilityThreshold:i.minVisibilityThreshold??.7,fullVisibilityThreshold:i.fullVisibilityThreshold??.8}}const fo=ie.fontSize,go=17/64;function po(i){const{paths:e,hasBorder:t=!1,fontSizeMode:a="fixed",minVisibilityThreshold:n=.5,fullVisibilityThreshold:r=.6}=i,o=a==="scaled",s=e.some(c=>c.hasSharpCorners),l=et(),h=q([...e,l]),d=Je(h);return`#version 300 es

// ============================================================================
// Attributes - Per Character (Instanced)
// ============================================================================

// Edge geometry: indices for texture lookup
// Edge data (source/target node indices, thickness, head/tail ratios) is fetched from edge data texture
// Edge path attributes (curvature, etc.) are fetched from edge attribute texture
in float a_edgeIndex;       // Index into edge data texture
in float a_edgeAttrIndex;   // Index into edge attribute texture (for curvature, etc.)
in float a_baseFontSize;    // Base font size in pixels (per-label)

// Character metrics (in glyph units = atlas font size pixels)
in vec4 a_charMetrics;      // (charTextOffset, charAdvance, totalTextWidth, positionMode)
in vec4 a_charDims;         // (charSize.x, charSize.y, charOffset.x, charOffset.y)

// Atlas texture coordinates
in vec4 a_texCoords;        // (x, y, width, height) in atlas pixels

// Label parameters
in vec2 a_labelParams;      // (margin, unused)

// Appearance
in vec4 a_color;            // Character color (RGBA, normalized)
${t?"in vec4 a_borderColor;      // Border color (RGBA, normalized)":""}

// ============================================================================
// Attributes - Per Vertex (Constant)
// ============================================================================

in vec2 a_quadCorner;       // Quad corner: (0,0), (1,0), (0,1), (1,1)

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;    // Required by node shape SDFs
// u_sdfBufferPixels kept for ABI compatibility but unused in shader
uniform float u_sdfBufferPixels;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture; // Shared texture with node position/size/shape data
uniform int u_nodeDataTextureWidth;  // Width of 2D node data texture for coordinate calculation
uniform sampler2D u_edgeDataTexture; // Shared texture with edge data
uniform int u_edgeDataTextureWidth;  // Width of 2D edge data texture for coordinate calculation
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
${o?"uniform float u_zoomSizeRatio;  // Zoom-based size ratio from zoomToSizeRatioFunction":""}

// Edge path attribute texture uniforms (for curvature and other path attributes)
${d.uniformDeclarations}

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
${t?"out vec4 v_borderColor;":""}
out float v_edgeFade;  // 0 = fully visible, 1 = fully faded (outside body)
out float v_alphaModifier;  // 0-1 based on label visibility ratio
out float v_fontScale;  // Ratio of rendered font size to atlas font size
${t?"out float v_positionMode;  // Position mode for conditional border (0=over needs border)":""}

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float FADE_WIDTH_PIXELS = 15.0;  // Width of fade gradient in pixels
const float ATLAS_FONT_SIZE = ${W(fo)};  // Base font size used in SDF atlas
const float VERTICAL_CENTER_RATIO = ${W(go)};  // Baseline to visual center ratio

// ============================================================================
// Path Attribute Variables (set in main, used by path functions)
// ============================================================================
// Path attributes are fetched from the edge attribute texture and stored in
// variables with v_ prefix (e.g., v_curvature) for path functions to access.
${d.vertexVaryingDeclarations.replace(/out /g,"")}

// Node size variables (set in main, used by some path functions like loops).
// These mirror the v_sourceNodeSize / v_targetNodeSize varyings in generator.ts,
// but are plain floats here since the label shader is vertex-only.
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
${Ra({paths:e,minVisibilityThreshold:n,fullVisibilityThreshold:r})}

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Fetch edge data from edge texture (2 texels per edge)
  // -------------------------------------------------------------------------
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, extremityIds
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  // edgeData0.w is reserved
  float headLengthRatio = edgeData1.x;
  float tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);  // Path type for multi-path support
  float baseFontSize = a_baseFontSize;

  // -------------------------------------------------------------------------
  // Fetch path attributes from edge attribute texture
  // -------------------------------------------------------------------------
  // Note: The fetch code uses 'edgeIdx' variable, so we set it to the attribute texture index
  {
    int edgeIdx = int(a_edgeAttrIndex);  // Use attribute texture index for path attributes
${d.fetchCode}
${d.varyingAssignments}
  }

  // -------------------------------------------------------------------------
  // Fetch node data from node texture (geometry texel + rotation-flags texel)
  // -------------------------------------------------------------------------
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcNodeData.xy;
  vec2 target = tgtNodeData.xy;
  float sourceSize = srcNodeData.z;
  float targetSize = tgtNodeData.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;
  float charTextOffset = a_charMetrics.x;
  float charAdvance = a_charMetrics.y;
  float totalTextWidth = a_charMetrics.z;
  float positionMode = a_charMetrics.w;
  vec2 charSize = a_charDims.xy;
  vec2 charOffset = a_charDims.zw;
  float margin = a_labelParams.x;

  // -------------------------------------------------------------------------
  // Compute pixel-to-graph conversion (for fixed font size mode)
  // -------------------------------------------------------------------------
  // This converts screen pixels to graph units such that N pixels on screen
  // becomes N pixels regardless of zoom level.
  // matrixScaleX is how much the matrix scales graph units to clip space
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  // -------------------------------------------------------------------------
  // Step 1: Convert thickness to WebGL units
  // -------------------------------------------------------------------------
  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // -------------------------------------------------------------------------
  // Step 2: Compute body bounds (truncated at node boundaries + extremities)
  // -------------------------------------------------------------------------
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, headLengthRatio, tailLengthRatio
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // -------------------------------------------------------------------------
  // Step 3: Compute font scale and text dimensions
  // -------------------------------------------------------------------------
  // Font size modes:
  // - "fixed": Constant pixel size regardless of zoom, using pixelToGraph conversion
  // - "scaled": Scales with zoom using zoomToSizeRatioFunction
  ${o?`// Scaled mode: font scales with zoom
  float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  // Convert glyph-unit metrics to WebGL units (scales with zoom)
  float textWidthWebGL = totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float charOffsetWebGL = charTextOffset * fontScale * u_correctionRatio / u_sizeRatio;
  float charAdvanceWebGL = charAdvance * fontScale * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: font stays constant in screen pixels
  float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  // Convert glyph-unit metrics to graph units using pixelToGraph (zoom-independent)
  float textWidthWebGL = totalTextWidth * fontScale * pixelToGraph;
  float charOffsetWebGL = charTextOffset * fontScale * pixelToGraph;
  float charAdvanceWebGL = charAdvance * fontScale * pixelToGraph;`}

  // Font scale varying for fragment shader gamma scaling.
  // Ratio of rendered font size to atlas font size — used to tighten the
  // anti-aliasing band for large labels so they stay sharp.
  v_fontScale = fontScale;

  // -------------------------------------------------------------------------
  // Step 4: Alpha modifier from how much of the label fits in the body
  // -------------------------------------------------------------------------
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);

  // -------------------------------------------------------------------------
  // Step 5: Compute character center offset (truncation check moved to after curvature adjustment)
  // -------------------------------------------------------------------------
  // Character center position relative to label center (on centerline, before curvature adjustment)
  float charCenterOffset = charOffsetWebGL + charAdvanceWebGL * 0.5 - textWidthWebGL * 0.5;

  // -------------------------------------------------------------------------
  // Step 6: Compute perpendicular offset based on position mode
  // -------------------------------------------------------------------------
  // Position modes: 0=over, 1=above, 2=below, 3=auto
  // Needed early for curvature-adaptive character spacing in Step 7
  float halfThickness = webGLThickness * 0.5;
  ${o?`// Scaled mode: margin and text height scale with zoom (same factor as font)
  float marginWebGL = margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: margin and text height stay constant in screen pixels
  float marginWebGL = margin * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;`}
  float perpOffset = computeEdgeLabelPerpOffset(
    positionMode, halfThickness, marginWebGL, halfTextHeight, source, target, u_matrix
  );

  // -------------------------------------------------------------------------
  // Step 7: Position character on path using offset path traversal
  // -------------------------------------------------------------------------
  // Body center in arc distance
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;

  // For "over" mode (perpOffset = 0), use simple centerline placement
  // For above/below modes, walk along the offset path to find correct position
  float charT;

  if (perpOffset == 0.0) {
    // Simple case: place on centerline
    float charArcDist = bodyCenterDist + charCenterOffset;
    charT = queryPathTAtDistance(pathId, charArcDist, source, target);
  } else {
    // Offset path traversal: walk along the offset curve to find character position
    // This ensures even character spacing regardless of curvature

    // Start from body center on offset path
    float centerT = queryPathTAtDistance(pathId, bodyCenterDist, source, target);

    ${s?`// -----------------------------------------------------------------------
    // Corner skip setup for step/taxi edges with above/below labels
    // -----------------------------------------------------------------------
    // At concave corners (inner side of the bend), characters would bunch up
    // because the offset path has near-zero arc length. We detect corner
    // crossings during the offset path traversal and add skip distance.

    // Get corner t values and concavity
    vec2 cornerTs = queryGetCornerTs(pathId, source, target);
    vec2 concavity = queryGetCornerConcavity(pathId, source, target, perpOffset);

    // Skip distance in graph units, proportional to on-screen font size
    // For fixed mode: use pixelToGraph so gap stays constant regardless of zoom
    // For scaled mode: use the same conversion as text width
    ${o?"float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;":"float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * pixelToGraph;"}

    // Corner t values for detecting crossings during traversal
    float corner1T = cornerTs.x;
    float corner2T = cornerTs.y;
    bool corner1IsConcave = concavity.x > 0.5;
    bool corner2IsConcave = concavity.y > 0.5;`:""}

    // Target distance along offset path from center
    float targetOffsetDist = abs(charCenterOffset);

    // Handle center character (charCenterOffset ≈ 0) - no search needed
    if (targetOffsetDist < 0.0001) {
      charT = centerT;
    } else {
      vec2 centerPos = queryPathPosition(pathId, centerT, source, target);
      vec2 centerNormal = queryPathNormal(pathId, centerT, source, target);
      vec2 offsetCenter = centerPos + centerNormal * perpOffset;

      float searchDir = charCenterOffset > 0.0 ? 1.0 : -1.0;

      // Search bounds (t values for body start and end)
      float tBodyStart = queryPathTAtDistance(pathId, bodyStartDist, source, target);
      float tBodyEnd = queryPathTAtDistance(pathId, bodyEndDist, source, target);

      // Walk along offset path to find character position
      float accumDist = 0.0;
      vec2 prevOffsetPos = offsetCenter;
      float prevT = centerT;
      float foundT = centerT;

      // Search range depends on direction
      float tSearchEnd = searchDir > 0.0 ? tBodyEnd : tBodyStart;

      ${s?`// Track which concave corners we've crossed to add skip distance
      bool crossedCorner1 = false;
      bool crossedCorner2 = false;
      float effectiveTargetDist = targetOffsetDist;`:""}

      const int STEPS = 32;
      for (int i = 1; i <= STEPS; i++) {
        // Step along centerline t, from center toward target
        float stepT = centerT + searchDir * float(i) * abs(tSearchEnd - centerT) / float(STEPS);

        ${s?`// Check for concave corner crossings and add skip distance
        // Corner 1 crossing check
        if (corner1IsConcave && !crossedCorner1) {
          bool crossingCorner1 = (searchDir > 0.0)
            ? (prevT < corner1T && stepT >= corner1T)
            : (prevT > corner1T && stepT <= corner1T);
          if (crossingCorner1) {
            crossedCorner1 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }

        // Corner 2 crossing check
        if (corner2IsConcave && !crossedCorner2) {
          bool crossingCorner2 = (searchDir > 0.0)
            ? (prevT < corner2T && stepT >= corner2T)
            : (prevT > corner2T && stepT <= corner2T);
          if (crossingCorner2) {
            crossedCorner2 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }`:""}

        // Compute offset position at this t
        vec2 stepPos = queryPathPosition(pathId, stepT, source, target);
        vec2 stepNormal = queryPathNormal(pathId, stepT, source, target);
        vec2 offsetPos = stepPos + stepNormal * perpOffset;

        // Distance along offset path
        float segDist = length(offsetPos - prevOffsetPos);

        ${s?`if (accumDist + segDist >= effectiveTargetDist) {
          // Interpolate within segment to find exact t
          float remaining = effectiveTargetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`:`if (accumDist + segDist >= targetOffsetDist) {
          // Interpolate within segment to find exact t
          float remaining = targetOffsetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`}

        accumDist += segDist;
        prevOffsetPos = offsetPos;
        prevT = stepT;
        // Update foundT to last valid position in case loop exhausts without finding target
        foundT = stepT;
      }

      charT = foundT;
    }
  }

  // Get position and tangent at final character position
  vec2 pathPos = queryPathPosition(pathId, charT, source, target);
  vec2 tangent = queryPathTangent(pathId, charT, source, target);

  // Compute perpendicular direction (90 degrees from tangent)
  vec2 perpDir = vec2(-tangent.y, tangent.x);

  // Apply perpendicular offset to path position
  vec2 offsetPathPos = pathPos + perpDir * perpOffset;

  // -------------------------------------------------------------------------
  // Step 8: Build character quad
  // -------------------------------------------------------------------------
  // Character size in screen pixels
  vec2 charSizePixels = charSize * fontScale;

  // Character offset from origin to the atlas region's top-left corner.
  // bearingX/bearingY already include the SDF buffer.
  vec2 charOffsetPixels = charOffset * fontScale;

  // The character's local X offset from pathPos (which is at character center)
  float charLocalX = -charAdvance * 0.5 * fontScale;

  // Build quad position:
  // - Start at character origin (charLocalX on X axis, 0 on Y axis = baseline)
  // - Add bearing offset to get to atlas region corner
  // - Add quad corner * size to get vertex position
  vec2 quadPos;
  quadPos.x = charLocalX + charOffsetPixels.x + a_quadCorner.x * charSizePixels.x;
  // charOffset.y = -bearingY (negated), so -charOffsetPixels.y = bearingY * fontScale
  // (distance from baseline to atlas region top, positive = upward)
  // Quad corner (0,0) = bottom-left, (1,1) = top-right
  quadPos.y = -charOffsetPixels.y - charSizePixels.y * (1.0 - a_quadCorner.y);

  // Center vertically on the path by offsetting by half the visual text height
  // VERTICAL_CENTER_RATIO is the distance from baseline to visual center as a ratio of atlas font size
  float verticalCenterOffset = VERTICAL_CENTER_RATIO * ATLAS_FONT_SIZE * fontScale;
  quadPos.y -= verticalCenterOffset;

  // -------------------------------------------------------------------------
  // Step 9: Rotate quad to align with tangent
  // -------------------------------------------------------------------------
  // Rotation matrix from tangent
  // tangent = (cos(angle), sin(angle)), so we can build rotation directly
  mat2 rotation = mat2(tangent.x, tangent.y, -tangent.y, tangent.x);

  // Convert pixel offset to WebGL units for rotation
  ${o?"vec2 quadPosWebGL = quadPos * u_correctionRatio / u_sizeRatio; // Scaled mode":"vec2 quadPosWebGL = quadPos * pixelToGraph; // Fixed mode: use pixelToGraph for zoom-independent size"}

  // Rotate around character center on path
  vec2 rotatedOffset = rotation * quadPosWebGL;

  // Final position in graph space (using offset path position for above/below modes)
  vec2 worldPos = offsetPathPos + rotatedOffset;

  // -------------------------------------------------------------------------
  // Step 10: Transform to clip space
  // -------------------------------------------------------------------------
  vec3 clipPos = u_matrix * vec3(worldPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 11: Texture coordinates
  // -------------------------------------------------------------------------
  // Flip Y for texture coordinates (texture Y goes down, quad Y goes up)
  vec2 texCorner = vec2(a_quadCorner.x, 1.0 - a_quadCorner.y);
  v_texCoord = (a_texCoords.xy + texCorner * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 12: Pass color, border color, and alpha modifier
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
${t?`  v_borderColor = a_borderColor;
  v_borderColor.a *= bias;
  v_positionMode = positionMode;`:""}
  v_alphaModifier = alphaModifier;

  // -------------------------------------------------------------------------
  // Step 13: Compute edge fade for soft truncation
  // -------------------------------------------------------------------------
  // Convert fade width from pixels to WebGL units
  ${o?"float fadeWidthWebGL = FADE_WIDTH_PIXELS * u_correctionRatio / u_sizeRatio;":"float fadeWidthWebGL = FADE_WIDTH_PIXELS * pixelToGraph;"}

  // Compute the arc position of THIS VERTEX (not just character center)
  // The quad extends from charCenter - advance/2 to charCenter + advance/2
  // a_quadCorner.x is 0 for left edge, 1 for right edge
  float vertexLocalOffset = (a_quadCorner.x - 0.5) * charAdvanceWebGL;
  float vertexArcOffset = charCenterOffset + vertexLocalOffset;

  // Compute distance from body edges (positive = inside body, negative = outside)
  float halfBody = bodyLength * 0.5;
  float distFromStart = vertexArcOffset + halfBody;  // Distance from body start edge
  float distFromEnd = halfBody - vertexArcOffset;    // Distance from body end edge
  float distFromEdge = min(distFromStart, distFromEnd);

  // Compute fade: 0 = fully visible (deep inside body), 1 = fully faded (at body edge)
  // Fade goes from 0 (at 2*fadeWidth inside) to 1 (at body edge)
  // This ensures text is fully transparent before reaching extremities
  v_edgeFade = 1.0 - smoothstep(0.0, fadeWidthWebGL * 2.0, distFromEdge);
}
`}function mo(i={}){const{hasBorder:e=!1}=i;return`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
${e?"in vec4 v_borderColor;":""}
in float v_edgeFade;  // 0 = fully visible, 1 = fully faded
in float v_alphaModifier;  // 0-1 based on label visibility ratio
in float v_fontScale;  // Ratio of rendered font size to atlas font size
${e?"in float v_positionMode;  // Position mode (0=over, 1=above, 2=below, 3=auto)":""}

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;
${e?"uniform float u_borderWidth;  // Border width in SDF units (normalized)":""}

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Edge labels are not pickable - discard all fragments in picking mode
    discard;
  #else
  // SDF stores normalized distance: 0.5 = on edge, >0.5 = inside glyph
  float sdfValue = texture(u_atlas, v_texCoord).a;

  // Edge threshold accounting for SDF buffer padding
  float edge = 1.0 - u_sdfBuffer;

  // Scale gamma inversely with font scale so small labels get a wider AA band
  // (smoother) and large labels get a tighter band (sharper).
  float aaWidth = u_gamma / (u_pixelRatio * v_fontScale);

  // Apply edge fade for soft truncation at body boundaries
  // Also apply visibility-based alpha modifier for short edge labels
  float edgeAlpha = (1.0 - v_edgeFade) * v_alphaModifier;

${e?`  // Fill alpha: fully opaque inside the glyph
  float fillAlpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Only apply border for "over" position mode (v_positionMode == 0.0)
  // Labels positioned above/below/auto don't overlap the edge line and don't need borders
  if (v_positionMode < 0.5) {
    // Border rendering: compute alpha for both fill and border regions
    // Border extends from (edge - borderWidth) to edge
    float borderEdge = edge - u_borderWidth;

    // Border alpha: opaque in the border region (between borderEdge and edge)
    float borderAlpha = smoothstep(borderEdge - aaWidth, borderEdge + aaWidth, sdfValue);

    // Composite: fill on top of border
    // Border is visible where borderAlpha > 0 but fillAlpha < 1
    vec3 borderColorPremult = v_borderColor.rgb * v_borderColor.a * borderAlpha * edgeAlpha;
    vec3 fillColorPremult = v_color.rgb * v_color.a * fillAlpha * edgeAlpha;

    // Blend fill over border (fill replaces border where fill is opaque)
    float finalBorderAlpha = borderAlpha * (1.0 - fillAlpha);
    vec3 finalColor = fillColorPremult + v_borderColor.rgb * v_borderColor.a * finalBorderAlpha * edgeAlpha;
    float finalAlpha = (v_color.a * fillAlpha + v_borderColor.a * finalBorderAlpha) * edgeAlpha;

    fragColor = vec4(finalColor, finalAlpha);
  } else {
    // No border for above/below/auto positions - simple text rendering
    float finalAlpha = v_color.a * fillAlpha * edgeAlpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  }`:`  // Smooth transition from transparent to opaque at glyph edge
  float alpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Premultiplied alpha output
  float finalAlpha = v_color.a * alpha * edgeAlpha;
  fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);`}
  #endif
}
`}function bo(i,e=!1,t="fixed"){const a=["u_matrix","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_cameraAngle","u_sdfBufferPixels","u_resolution","u_atlasSize","u_atlas","u_gamma","u_sdfBuffer","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"];t==="scaled"&&a.push("u_zoomSizeRatio"),e&&a.push("u_borderWidth");for(const n of i)for(const r of n.uniforms)a.includes(r.name)||a.push(r.name);return a}function xo(i){const{hasBorder:e=!1,fontSizeMode:t="fixed"}=i;return{vertexShader:po(i),fragmentShader:mo({hasBorder:e}),uniforms:bo(i.paths,e,t)}}const yo=new Map;function _o(i){switch(i){case"over":return 0;case"above":return 1;case"below":return 2;case"auto":return 3;default:return 0}}function To(i,e,t,a){const{color:n,margin:r,textBorder:o}=a,s=La(a),{paths:l,fontSizeMode:h,minVisibilityThreshold:d,fullVisibilityThreshold:u}=s,c=!!o,f=xo({paths:l,hasBorder:c,fontSizeMode:h,minVisibilityThreshold:d,fullVisibilityThreshold:u});class g extends Ea{constructor(p,m,y){super(p,m,y),this.atlasTexture=null,this.atlasNeedsUpdate=!1,this.labelGlyphCache=new Map,this.edgeAttributeTexture=null;const v=et();if(this.attributeLayout=q([...l,v]),this.attrDescriptors=Et([...l,v],this.attributeLayout),this.edgeAttributeTexture=new St(p,this.attributeLayout),this.packedAttributeData=new Float32Array(this.attributeLayout.floatsPerItem),this.atlasManager=new ye,this.gamma=.025,this.sdfBuffer=ie.cutoff,this.atlasTexture=p.createTexture(),!this.atlasTexture)throw new Error("EdgeLabelProgram: failed to create atlas texture");p.bindTexture(p.TEXTURE_2D,this.atlasTexture),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_S,p.CLAMP_TO_EDGE),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_T,p.CLAMP_TO_EDGE),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MIN_FILTER,p.LINEAR),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MAG_FILTER,p.LINEAR),p.bindTexture(p.TEXTURE_2D,null),this.atlasManager.on(ye.ATLAS_UPDATED_EVENT,()=>{this.atlasNeedsUpdate=!0,setTimeout(()=>this.renderer.refresh(),0)});const _={family:"sans-serif",weight:"normal",style:"normal"};this.defaultFontKey=this.atlasManager.registerFont(_)}static{this.labelColor=n}static{this.labelMargin=r}getDefinition(){const{FLOAT:p,UNSIGNED_BYTE:m,TRIANGLE_STRIP:y}=WebGL2RenderingContext,v=new Set,_=[];for(const x of l)for(const T of x.attributes){const S=T.name.startsWith("a_")?T.name:`a_${T.name}`;v.has(S)||(v.add(S),_.push({name:S,size:T.size,type:T.type}))}return{VERTICES:4,VERTEX_SHADER_SOURCE:f.vertexShader,FRAGMENT_SHADER_SOURCE:f.fragmentShader,METHOD:y,UNIFORMS:f.uniforms,ATTRIBUTES:[{name:"a_edgeIndex",size:1,type:p},{name:"a_edgeAttrIndex",size:1,type:p},{name:"a_baseFontSize",size:1,type:p},{name:"a_charMetrics",size:4,type:p},{name:"a_charDims",size:4,type:p},{name:"a_texCoords",size:4,type:p},{name:"a_labelParams",size:2,type:p},{name:"a_color",size:4,type:m,normalized:!0},...c?[{name:"a_borderColor",size:4,type:m,normalized:!0}]:[],..._.filter(x=>!["a_curvature","curvature"].includes(x.name))],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:p}],CONSTANT_DATA:[[0,0],[1,0],[0,1],[1,1]]}}prepareLabelGlyphs(p,m){if(m.hidden||!m.text){this.labelGlyphCache.delete(p);return}const y=m.text,v=m.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(y,v);const _=[],x=[];let T=0;for(const S of y){const E=S.codePointAt(0);if(E===void 0){_.push(void 0),x.push(T);continue}const D=this.atlasManager.getGlyph(E,v);_.push(D),x.push(T),D&&(T+=D.advance)}this.labelGlyphCache.set(p,{glyphs:_,xOffsets:x,totalWidth:T})}processCharacter(p,m,y,v){const{floats:_}=this,x=this.STRIDE,T=p*x,S=this.labelGlyphCache.get(m.parentKey);if(!S||!S.glyphs[v]){for(let N=0;N<x;N++)_[T+N]=0;return}const E=S.glyphs[v],D=S.xOffsets[v],w=g.labelColor,A=w&&typeof w=="object"&&"color"in w&&w.color?w.color:m.color,F=te(A);let R=T;_[R++]=m.edgeIndex,_[R++]=this.edgeAttributeTexture?.getIndex(m.parentKey)??0,_[R++]=m.size,_[R++]=D,_[R++]=E.advance,_[R++]=S.totalWidth,_[R++]=_o(m.position),_[R++]=E.atlasWidth,_[R++]=E.atlasHeight,_[R++]=E.bearingX,_[R++]=-E.bearingY,_[R++]=E.atlasX,_[R++]=E.atlasY,_[R++]=E.atlasWidth,_[R++]=E.atlasHeight;const P=g.labelMargin??m.margin;if(_[R++]=P,_[R++]=0,_[R++]=F,c&&o){let N;typeof o.color=="string"?N=o.color:N=o.color.color||"#ffffff",_[R++]=te(N)}const G=new Set;for(const N of l)for(const k of N.attributes){const $=k.name.startsWith("a_")?k.name.slice(2):k.name;if($!=="curvature"&&!G.has($)){G.add($);for(let M=0;M<k.size;M++)_[R++]=0}}}processEdgeLabel(p,m,y){if(this.prepareLabelGlyphs(p,y),this.edgeAttributeTexture&&!y.hidden&&y.text){this.edgeAttributeTexture.allocate(p);const v=this.packedAttributeData;wt(this.attrDescriptors,y.edgeAttributes,v,"",yo,0),this.edgeAttributeTexture.updateAllAttributes(p,v)}return super.processLabel(p,m,y)}updateAtlasTexture(){if(!this.atlasNeedsUpdate)return;const p=this.normalProgram.gl,m=this.atlasManager.getTextures();if(m.length===0)return;const y=m[0];p.bindTexture(p.TEXTURE_2D,this.atlasTexture),p.texImage2D(p.TEXTURE_2D,0,p.RGBA,y.width,y.height,0,p.RGBA,p.UNSIGNED_BYTE,y.data),p.bindTexture(p.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}setUniforms(p,m){const{gl:y,uniformLocations:v}=m,_=this.atlasManager.getTextures(),x=_.length>0?[_[0].width,_[0].height]:[1,1];if(y.uniformMatrix3fv(v.u_matrix,!1,p.matrix),y.uniform1f(v.u_sizeRatio,p.sizeRatio),y.uniform1f(v.u_correctionRatio,p.correctionRatio),y.uniform1f(v.u_pixelRatio,p.pixelRatio),y.uniform1f(v.u_cameraAngle,p.cameraAngle),y.uniform1f(v.u_sdfBufferPixels,ie.buffer),y.uniform2f(v.u_resolution,p.width,p.height),y.uniform2f(v.u_atlasSize,x[0],x[1]),y.uniform1f(v.u_gamma,this.gamma),y.uniform1f(v.u_sdfBuffer,this.sdfBuffer),y.activeTexture(y.TEXTURE0),y.bindTexture(y.TEXTURE_2D,this.atlasTexture),y.uniform1i(v.u_atlas,0),v.u_nodeDataTexture!==void 0&&y.uniform1i(v.u_nodeDataTexture,p.nodeDataTextureUnit),v.u_nodeDataTextureWidth!==void 0&&y.uniform1i(v.u_nodeDataTextureWidth,p.nodeDataTextureWidth),v.u_edgeDataTexture!==void 0&&y.uniform1i(v.u_edgeDataTexture,p.edgeDataTextureUnit),v.u_edgeDataTextureWidth!==void 0&&y.uniform1i(v.u_edgeDataTextureWidth,p.edgeDataTextureWidth),v.u_edgeFrameTexture!==void 0&&y.uniform1i(v.u_edgeFrameTexture,p.edgeFrameTextureUnit),v.u_edgeFrameTextureWidth!==void 0&&y.uniform1i(v.u_edgeFrameTextureWidth,p.edgeFrameTextureWidth),c&&o&&v.u_borderWidth!==void 0){const T=o.width/ie.buffer*this.sdfBuffer;y.uniform1f(v.u_borderWidth,T)}if(this.edgeAttributeTexture&&v.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(ue),y.uniform1i(v.u_edgeAttributeTexture,ue),y.uniform1i(v.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),y.uniform1i(v.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem())),h==="scaled"&&v.u_zoomSizeRatio!==void 0){const S=1/this.renderer.getSetting("zoomToSizeRatioFunction")(p.zoomRatio);y.uniform1f(v.u_zoomSizeRatio,S)}}renderProgram(p,m){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),this.edgeAttributeTexture&&this.edgeAttributeTexture.upload(),super.renderProgram(p,m)}registerFont(p,m="normal",y="normal"){return this.atlasManager.registerFont({family:p,weight:m,style:y})}getAtlasManager(){return this.atlasManager}ensureGlyphsReady(p,m){const y=m||this.defaultFontKey;for(const v of p)this.atlasManager.ensureGlyphs(v,y);this.atlasManager.flush()}measureLabelAtlasWidth(p,m){const y=m||this.defaultFontKey;this.atlasManager.ensureGlyphs(p,y),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();let v=0;for(const _ of p){const x=_.codePointAt(0);if(x===void 0)continue;const T=this.atlasManager.getGlyph(x,y);T&&(v+=T.advance)}return v}measureLabel(p,m,y){const v=this.measureLabelAtlasWidth(p,y),_=m/ie.fontSize;return{width:v*_,height:m,textHeight:m}}kill(){const p=this.normalProgram.gl;this.atlasTexture&&(p.deleteTexture(this.atlasTexture),this.atlasTexture=null),this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),super.kill()}}return new g(i,e,t)}function vo(){return{name:"none",glsl:`
// No extremity - always returns positive (outside)
float extremity_none(vec2 uv, float lengthRatio, float widthRatio) {
  return 1.0;
}
`,length:0,widthFactor:1,margin:0,uniforms:[],attributes:[]}}function So(i,e,t,a,n,r,o){const s=Aa(a),{paths:l,layers:h,defaultHead:d,defaultTail:u}=s,c=[vo(),...s.extremities],f={},g={};l.forEach((A,F)=>f[A.name]=F),c.forEach((A,F)=>g[A.name]=F);const b=g[d]??0,p=g[u]??0;let m=null;const y=q([...l,...h]),v=class extends Te{constructor(A,F,R){m||(m=ki({paths:l,extremities:c,layers:h,antialias:n})),super(A,F,R),this.layerLifecycles=new Map,this.needsShaderRegeneration=!1,this.edgeAttributeTexture=null,this.layout=y,this.attrDescriptors=[],this.lifecycleIndexOffset=l.length,this._pickingBuffer=F,this.edgeAttributeTexture=new St(A,this.layout),this.packedAttributeData=new Float32Array(this.layout.floatsPerItem),h.forEach((G,N)=>{if(G.lifecycle){const k={gl:A,renderer:{refresh:()=>R.refresh()},getUniformLocation:$=>A.getUniformLocation(this.normalProgram.program,$),requestShaderRegeneration:()=>{this.needsShaderRegeneration=!0},requestRefresh:()=>{R.refresh()}};this.layerLifecycles.set(N,G.lifecycle(k))}}),this.layerLifecycles.forEach(G=>G.init?.());const P=new Map;this.layerLifecycles.forEach((G,N)=>{G.getAttributeData&&P.set(l.length+N,G)}),this.attrDescriptors=Et([...l,...h],this.layout,P)}getAttributeTexture(){return this.edgeAttributeTexture}resolveEdgeIds(A,F,R){const P=A;let G=0,N=b,k=p;const $=F?P.selfLoopPath:R&&P.parallelPath?P.parallelPath:P.path;$&&f[$]!==void 0&&(G=f[$]),P.head&&P.head!=="none"&&g[P.head]!==void 0&&(N=g[P.head]),P.tail&&P.tail!=="none"&&g[P.tail]!==void 0&&(k=g[P.tail]);const M=c[N],K=c[k];return{pathId:G,headId:N,tailId:k,headLengthRatio:de(M.length)?0:M.length,tailLengthRatio:de(K.length)?0:K.length}}getDefinition(){const{TRIANGLE_STRIP:A}=WebGL2RenderingContext,F=A,R=m;return{VERTICES:R.verticesPerEdge,VERTEX_SHADER_SOURCE:R.vertexShader,FRAGMENT_SHADER_SOURCE:R.fragmentShader,METHOD:F,UNIFORMS:R.uniforms,ATTRIBUTES:R.attributes,CONSTANT_ATTRIBUTES:R.constantAttributes,CONSTANT_DATA:R.constantData}}maybeRegenerateShaders(){if(!this.needsShaderRegeneration)return;this.needsShaderRegeneration=!1;const A=h.map((k,$)=>{const M=this.layerLifecycles.get($);return M?.regenerate?M.regenerate():k});m=ki({paths:l,extremities:c,layers:A,antialias:this.renderer.getSetting("antialiasEdges")});const F=this.normalProgram.gl,{program:R,buffer:P,vertexShader:G,fragmentShader:N}=this.normalProgram;F.deleteProgram(R),F.deleteBuffer(P),F.deleteShader(G),F.deleteShader(N),this.normalProgram=this.getProgramInfo("normal",F,m.vertexShader,m.fragmentShader,this._pickingBuffer)}process(A,F,R,P,G,N){let k=F*this.STRIDE;if(G.visibility==="hidden"||R.visibility==="hidden"||P.visibility==="hidden"){for(let $=k+this.STRIDE;k<$;k++)this.floats[k]=0;this.floats[F*this.STRIDE]=Ta;return}this.processVisibleItem(mt(A),k,R,P,G,N)}processVisibleItem(A,F,R,P,G,N){const{floats:k,ints:$}=this;k[F++]=N,k[F++]=te(G.color),$[F++]=A,k[F++]=G.opacity??1;const M=this.packedAttributeData;wt(this.attrDescriptors,G,M,G.color,this.layerLifecycles,this.lifecycleIndexOffset),this.edgeAttributeTexture.updateAllAttributesAtRow(N,M)}setUniforms(A,F){const{gl:R,uniformLocations:P}=F;P.u_matrix&&R.uniformMatrix3fv(P.u_matrix,!1,A.matrix),P.u_sizeRatio&&R.uniform1f(P.u_sizeRatio,A.sizeRatio),P.u_correctionRatio&&R.uniform1f(P.u_correctionRatio,A.correctionRatio),P.u_zoomRatio&&R.uniform1f(P.u_zoomRatio,A.zoomRatio),P.u_pixelRatio&&R.uniform1f(P.u_pixelRatio,A.pixelRatio),P.u_cameraAngle&&R.uniform1f(P.u_cameraAngle,A.cameraAngle),P.u_feather&&R.uniform1f(P.u_feather,A.antiAliasingFeather),P.u_minEdgeThickness&&R.uniform1f(P.u_minEdgeThickness,A.minEdgeThickness),P.u_pickingPadding&&R.uniform1f(P.u_pickingPadding,A.edgePickingPadding),P.u_nodeDataTexture&&R.uniform1i(P.u_nodeDataTexture,A.nodeDataTextureUnit),P.u_nodeDataTextureWidth&&R.uniform1i(P.u_nodeDataTextureWidth,A.nodeDataTextureWidth),P.u_edgeDataTexture&&R.uniform1i(P.u_edgeDataTexture,A.edgeDataTextureUnit),P.u_edgeDataTextureWidth&&R.uniform1i(P.u_edgeDataTextureWidth,A.edgeDataTextureWidth),P.u_edgeFrameTexture&&R.uniform1i(P.u_edgeFrameTexture,A.edgeFrameTextureUnit),P.u_edgeFrameTextureWidth&&R.uniform1i(P.u_edgeFrameTextureWidth,A.edgeFrameTextureWidth),this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&(this.edgeAttributeTexture.bind(ue),P.u_edgeAttributeTexture&&R.uniform1i(P.u_edgeAttributeTexture,ue),P.u_edgeAttributeTextureWidth&&R.uniform1i(P.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),P.u_edgeAttributeTexelsPerEdge&&R.uniform1i(P.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()));const G=new Set;l.forEach(N=>{N.uniforms.forEach(k=>{G.has(k.name)||(G.add(k.name),this.setTypedUniform(k,F))})}),c.forEach(N=>{N.uniforms.forEach(k=>{G.has(k.name)||(G.add(k.name),this.setTypedUniform(k,F))})}),h.forEach(N=>{N.uniforms.forEach(k=>{G.has(k.name)||(G.add(k.name),this.setTypedUniform(k,F))})})}renderProgram(A,F){this.maybeRegenerateShaders(),this.layerLifecycles.forEach(R=>R.beforeRender?.()),super.renderProgram(A,F)}uploadAttributeTexture(){this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&this.edgeAttributeTexture.upload()}kill(){this.layerLifecycles.forEach(A=>A.kill?.()),this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),super.kill()}},_=c[b],x=c[p],T={paths:l,headLengthRatio:de(_.length)?0:_.length,tailLengthRatio:de(x.length)?0:x.length,...a.label},S=La(T),E=To(i,null,t,T),D=co(i,e,t,{shaderConfig:S}),w=new io(i,{paths:l,extremities:c,layers:h,nodeShapes:r,nodeLayers:o});return{edgeProgram:new v(i,null,t),labelProgram:E,labelBackgroundProgram:D,framePass:w}}function Eo(){return{name:"straight",segments:1,minBodyLengthRatio:0,linearParameterization:!0,glsl:`
// Position at parameter t ∈ [0, 1]
vec2 path_straight_position(float t, vec2 source, vec2 target) {
  return mix(source, target, t);
}

// Total length of the path (analytical - more efficient than sampling)
float path_straight_length(vec2 source, vec2 target) {
  return length(target - source);
}
`,uniforms:[],attributes:[]}}function wo(i){const{segments:e=32}=i??{};return{name:"loop",segments:e,glsl:`
const float LOOP_PI = 3.141592653589793;

float loopWorldRadius() {
  float nodeWorldRadius = v_sourceNodeSize * u_correctionRatio / u_sizeRatio;
  return max(v_loopRadius * nodeWorldRadius, 0.001);
}

// Cubic Bézier with P0 = P3 = source.
// Control points extend outward orthogonal to the node surface at exit/entry angles.
vec2 path_loop_position(float t, vec2 source, vec2 target) {
  float R = loopWorldRadius();
  float angle = v_loopAngle + (v_loopFixedOrientation > 0.5 ? u_cameraAngle : 0.0);
  float halfSpread = v_loopSpread * 0.5;

  float exitAngle = angle - halfSpread;
  float entryAngle = angle + halfSpread;

  // Control point distance: at t=0.5 the Bézier reaches 0.75 * cpDist * cos(halfSpread)
  // from source. Solve for cpDist so the loop tip reaches exactly R.
  float cpDist = R / (0.75 * cos(halfSpread));

  vec2 cp1 = source + cpDist * vec2(cos(exitAngle), sin(exitAngle));
  vec2 cp2 = source + cpDist * vec2(cos(entryAngle), sin(entryAngle));

  float u = 1.0 - t;
  vec2 d1 = cp1 - source;
  vec2 d2 = cp2 - source;
  return source + 3.0 * t * u * (u * d1 + t * d2);
}

// Approximate arc length via chord sampling
float path_loop_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_loop_position(0.0, source, target);
  const int STEPS = 16;
  for (int i = 1; i <= STEPS; i++) {
    float t = float(i) / float(STEPS);
    vec2 cur = path_loop_position(t, source, target);
    len += length(cur - prev);
    prev = cur;
  }
  return len;
}
`,needsNodeSize:!0,uniforms:[],attributes:[{name:"loopRadius",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopAngle",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopSpread",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopFixedOrientation",size:1,type:WebGL2RenderingContext.FLOAT}],variables:{loopRadius:{type:"number",default:4},loopAngle:{type:"number",default:Math.PI/4},loopSpread:{type:"number",default:80*Math.PI/180},loopFixedOrientation:{type:"number",default:0}},spread:{variable:"loopRadius",compute:a=>a+4}}}class Ni{constructor(e){this.buckets=new Map,this.keyDepth=new Map;for(const t of e)this.buckets.set(t,new Set)}has(e){return this.keyDepth.has(e)}getBucket(e){return this.buckets.get(e)}set(e,t){const a=this.keyDepth.get(e);if(a===t)return;const n=this.buckets.get(t);if(!n)throw new Error(`Sigma: "${t}" is not a declared depth layer`);a!==void 0&&this.buckets.get(a)?.delete(e),n.add(e),this.keyDepth.set(e,t)}remove(e){const t=this.keyDepth.get(e);t!==void 0&&(this.buckets.get(t).delete(e),this.keyDepth.delete(e))}clearAll(){for(const e of this.buckets.values())e.clear();this.keyDepth.clear()}getSorted(e,t){const a=this.buckets.get(e);return!a||a.size===0?[]:[...a].sort((n,r)=>t(n)-t(r))}}class Do extends ti{constructor(e,t){super(e,2,t)}updateNode(e,t,a,n,r,o,s,l){const h=this.indexMap.get(e);if(h===void 0)throw new Error(`Node "${e}" not allocated in NodeDataTexture`);const[d,u,c,f]=Oe(l),g=h*2*4;this.data[g]=t,this.data[g+1]=a,this.data[g+2]=n,this.data[g+3]=r,this.data[g+4]=o,this.data[g+5]=s,this.data[g+6]=d*65536+u*256+c,this.data[g+7]=f/255,this.markDirty(h)}}const Ao=1024,Ro=1.5,Co=4096;class Mi{constructor(e,t){if(this.texture=null,this.framebuffer=null,!e.getExtension("EXT_color_buffer_float"))throw new Error("sigma: EXT_color_buffer_float is required for label/edge placement but is unavailable in this WebGL2 context.");this.gl=e,this.channels=t.channels,this.capacity=this.roundUpToPowerOfTwo(t.initialCapacity??Ao);const a=this.computeDimensions(this.capacity);this.textureWidth=a.width,this.textureHeight=a.height,this.create()}roundUpToPowerOfTwo(e){return Math.pow(2,Math.ceil(Math.log2(Math.max(1,e))))}computeDimensions(e){const t=Math.min(e,Co),a=Math.ceil(e/t);return{width:t,height:a}}create(){const{gl:e}=this,t=this.channels===1?e.R32F:e.RGBA32F,a=this.channels===1?e.RED:e.RGBA;if(this.texture=e.createTexture(),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,t,this.textureWidth,this.textureHeight,0,a,e.FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.framebuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("sigma: float framebuffer for frame-pass placement is incomplete.");e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null)}ensureCapacity(e){if(e<=this.capacity)return;const{gl:t}=this;this.capacity=this.roundUpToPowerOfTwo(Math.ceil(e*Ro));const a=this.computeDimensions(this.capacity);this.textureWidth=a.width,this.textureHeight=a.height,this.texture&&t.deleteTexture(this.texture),this.framebuffer&&t.deleteFramebuffer(this.framebuffer),this.create()}bindAsRenderTarget(){const{gl:e}=this;e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.viewport(0,0,this.textureWidth,this.textureHeight)}bind(e){const{gl:t}=this;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.texture)}getTexture(){return this.texture}getTextureWidth(){return this.textureWidth}getTextureHeight(){return this.textureHeight}restore(){this.gl.getExtension("EXT_color_buffer_float"),this.create()}kill(){const{gl:e}=this;this.texture&&(e.deleteTexture(this.texture),this.texture=null),this.framebuffer&&(e.deleteFramebuffer(this.framebuffer),this.framebuffer=null)}}class Lo extends ti{constructor(e,t){super(e,2,t)}updateEdge(e,t,a,n,r,o,s=0,l=0,h=0){const d=this.indexMap.get(e);if(d===void 0)throw new Error(`Edge "${e}" not allocated in EdgeDataTexture`);const u=d*this.TEXELS_PER_ITEM*4;this.data[u+0]=t,this.data[u+1]=a,this.data[u+2]=n,this.data[u+3]=0,this.data[u+4]=r,this.data[u+5]=o,this.data[u+6]=s,this.data[u+7]=(l&15)<<4|h&15,this.markDirty(d)}}function Po(i){return typeof i=="object"&&"glsl"in i&&!("attributes"in i)}function Fo(i){return typeof i=="object"&&"glsl"in i&&!("attributes"in i)}const Ht={shapes:[Gr()],variables:{},layers:[Nr()],label:{},backdrop:{},labelAttachments:{}},ft={paths:[Eo(),wo()],extremities:[],variables:{},layers:[et()],defaultHead:"none",defaultTail:"none",label:{}},Vt=["nodes","topNodes"],Xt=["edges","topEdges"],jt=[...Xt,...Vt],Io={nodes:Ht,edges:ft,depthLayers:[...jt]};function oi(i){return typeof i=="object"&&i!==null&&"attribute"in i}function Pa(i){return typeof i=="function"}function Fa(i){return typeof i=="object"&&i!==null&&"when"in i&&typeof i.when=="function"&&"then"in i}function Ia(i){return typeof i=="object"&&i!==null&&"whenState"in i&&"then"in i}function ka(i){return typeof i=="object"&&i!==null&&"whenData"in i&&"then"in i}const ko={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,isDragged:!1},Go={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,parallelIndex:0,parallelCount:1},No={isIdle:!0,isPanning:!1,isZooming:!1,isDragging:!1,hasHovered:!1,hasHighlighted:!1};function Mo(i){return{...ko,...i}}function zo(i){return{...Go,...i}}function zi(i){return{...No,...i}}const Ga={x:{attribute:"x"},y:{attribute:"y"},size:{whenState:"isHovered",then:{attribute:"size",defaultValue:12},else:{attribute:"size",defaultValue:10}},color:{attribute:"color",defaultValue:"#666"},label:{attribute:"label"},visibility:{whenState:"isHidden",then:"hidden",else:"visible"},labelVisibility:{whenState:"isHovered",then:"visible",else:"auto"},backdropVisibility:{whenState:"isHovered",then:"visible",else:"hidden"},backdropColor:"#ffffff",backdropShadowColor:"rgba(0, 0, 0, 0.5)",backdropShadowBlur:12,backdropPadding:6},Na={size:{attribute:"size",defaultValue:1},color:{attribute:"color",defaultValue:"#ccc"},label:{attribute:"label"},visibility:{whenState:"isHidden",then:"hidden",else:"visible"}},id={nodes:Ga,edges:Na},kt={nodes:{...Ga,depth:{whenState:"isHovered",then:"topNodes",else:"nodes"}},edges:{...Na,depth:{whenState:["isHighlighted","isHovered"],then:"topEdges",else:"edges"}}};function $o(i){return"min"in i||"max"in i||"minValue"in i||"maxValue"in i||"easing"in i}function Wo(i){return"dict"in i}function At(i,e){return typeof i=="string"?e[i]===!0:Array.isArray(i)?i.every(t=>e[t]===!0):typeof i=="object"&&i!==null?Object.entries(i).every(([t,a])=>e[t]===a):!1}function Bo(i,e){const t=e[i.attribute];return t===void 0?i.defaultValue:t}function Uo(i,e,t){const a=e[i.attribute];if(a===void 0)return i.defaultValue;const n=Number(a);if(isNaN(n))return i.defaultValue;if(i.min===void 0&&i.max===void 0)return n;const r=i.minValue??n,o=i.maxValue??n;if(o===r)return i.min??n;let s=(n-r)/(o-r);s=Math.max(0,Math.min(1,s)),s=qt(i.easing)(s);const h=i.min??0,d=i.max??1;return h+s*(d-h)}function Oo(i,e){const t=e[i.attribute];if(t===void 0)return i.defaultValue;const a=String(t);return a in i.dict?i.dict[a]:i.defaultValue}function Ho(i,e,t){return Wo(i)?Oo(i,e):$o(i)?Uo(i,e):Bo(i,e)}function Ma(i,e){return typeof i=="string"?!!e[i]:Array.isArray(i)?i.every(t=>!!e[t]):typeof i=="object"&&i!==null?Object.entries(i).every(([t,a])=>e[t]===a):!1}function gt(i,e,t,a,n,r){if(i==null)return r;if(typeof i!="object"&&typeof i!="function")return i;if(Fa(i)){const o=i.when(e,t,a,n)?i.then:i.else;return o===void 0?r:gt(o,e,t,a,n,r)}if(Ia(i)){const o=At(i.whenState,t)?i.then:i.else;return o===void 0?r:gt(o,e,t,a,n,r)}if(ka(i)){const o=Ma(i.whenData,e)?i.then:i.else;return o===void 0?r:gt(o,e,t,a,n,r)}return Pa(i)?i(e,t,a,n)??r:oi(i)?Ho(i,e)??r:i}function J(i){if(i==null)return"static";if(Fa(i))return"graph-state";if(Ia(i)){const e=J(i.then),t=i.else!==void 0?J(i.else):"static";return X("item-state",X(e,t))}if(ka(i)){const e=J(i.then),t=i.else!==void 0?J(i.else):"static";return X(e,t)}return Pa(i)?"graph-state":(oi(i),"static")}function X(i,e){return i==="graph-state"||e==="graph-state"?"graph-state":i==="item-state"||e==="item-state"?"item-state":"static"}function $i(i){if(!i)return{dependency:"static",xAttribute:null,yAttribute:null};const e=Array.isArray(i)?i:[i];let t="static",a=null,n=null;for(const r of e)if("matchData"in r&&"cases"in r){const o=r.cases;for(const s of Object.values(o))for(const l of Object.values(s))t=X(t,J(l))}else if("matchState"in r&&"cases"in r){t=X(t,"item-state");const o=r.cases;for(const s of Object.values(o))for(const l of Object.values(s))t=X(t,J(l))}else if("when"in r&&"then"in r)t="graph-state";else if("whenState"in r){t=X(t,"item-state");const o=r.then;if(o&&typeof o=="object")for(const l of Object.values(o))t=X(t,J(l));const s=r.else;if(s&&typeof s=="object")for(const l of Object.values(s))t=X(t,J(l))}else if("whenData"in r){const o=r.then;if(o&&typeof o=="object")for(const l of Object.values(o))t=X(t,J(l));const s=r.else;if(s&&typeof s=="object")for(const l of Object.values(s))t=X(t,J(l))}else for(const[o,s]of Object.entries(r))if(!li.has(o)&&(t=X(t,J(s)),(o==="x"||o==="y")&&oi(s))){const l=s.attribute;o==="x"&&!a&&(a=l),o==="y"&&!n&&(n=l)}return{dependency:t,xAttribute:a,yAttribute:n}}const le={size:10,color:"#666",opacity:1,shape:"circle",rotationAlignment:"viewport",labelRotationAlignment:"viewport",visibility:"visible",depth:"nodes",zIndex:0,label:"",labelColor:"#000",labelSize:12,labelFont:"sans-serif",labelVisibility:"auto",labelPosition:"right",labelAngle:0,labelDepth:"nodes",backdropVisibility:"hidden",backdropColor:"transparent",backdropShadowColor:"transparent",backdropShadowBlur:0,backdropPadding:0,backdropBorderColor:"transparent",backdropBorderWidth:0,backdropCornerRadius:0,backdropLabelPadding:-1,backdropArea:"both",labelAttachment:null,labelAttachmentPlacement:"below"},si={size:1,color:"#ccc",opacity:1,path:"straight",selfLoopPath:"loop",parallelSpread:.25,tail:"none",head:"none",visibility:"visible",depth:"edges",zIndex:0,label:"",labelColor:"#666",labelVisibility:"auto",labelDepth:"edges"},li=new Set(["when","whenState","whenData","then","else"]),Wi=Object.keys(le),Vo=Object.values(le),Bi=Object.keys(si),Xo=Object.values(si);function Ee(i,e,t,a,n,r,o){for(const s in e){if(li.has(s))continue;const l=i[s]??o[s];i[s]=gt(e[s],t,a,n,r,l)}"depth"in e&&!("labelDepth"in e)&&(i.labelDepth=i.depth)}function za(i,e,t,a,n,r,o){for(const s of e)if("matchData"in s&&"cases"in s){const l=String(t[s.matchData]??""),h=s.cases;l in h&&Ee(i,h[l],t,a,n,r,o)}else if("matchState"in s&&"cases"in s){const l=String(a[s.matchState]??""),h=s.cases;l in h&&Ee(i,h[l],t,a,n,r,o)}else if("when"in s&&"then"in s){const l=s.when;if(!l(t,a,n,r))continue;Ee(i,s.then,t,a,n,r,o)}else if("whenState"in s&&"then"in s){if(!At(s.whenState,a))continue;Ee(i,s.then,t,a,n,r,o)}else if("whenData"in s&&"then"in s){if(!Ma(s.whenData,t))continue;Ee(i,s.then,t,a,n,r,o)}else Ee(i,s,t,a,n,r,o)}function Ui(i,e,t,a,n,r){const o=r||{},s=o;for(let h=0,d=Wi.length;h<d;h++)s[Wi[h]]=Vo[h];if(s.x=void 0,s.y=void 0,s.labelBackgroundColor=void 0,s.labelBackgroundPadding=void 0,s.labelCursor=void 0,!i)return s.x=e.x??0,s.y=e.y??0,o.size=e.size??10,o.color=e.color??"#666",o.label=e.label??"",o;const l=Array.isArray(i)?i:[i];return za(s,l,e,t,a,n,le),o}function Oi(i,e,t,a,n,r){const o=r||{},s=o;for(let h=0,d=Bi.length;h<d;h++)s[Bi[h]]=Xo[h];if(!i)return o.size=e.size??1,o.color=e.color??"#ccc",o.label=e.label??"",o;const l=Array.isArray(i)?i:[i];return za(s,l,e,t,a,n,si),typeof s.labelPosition=="number"&&(s.labelPosition=void 0),o}function jo(i,e,t){if(i==null)return t;if(typeof i=="function")return i(e)??t;if(typeof i=="object"&&"when"in i){const a=i,r=a.when(e)?a.then:a.else;return r===void 0?t:typeof r=="function"?r(e)??t:r??t}if(typeof i=="object"&&"whenState"in i){const a=i,r=At(a.whenState,e)?a.then:a.else;return r===void 0?t:typeof r=="function"?r(e)??t:r??t}return i??t}function Hi(i,e){const t={};if(!i)return t;const a=Array.isArray(i)?i:[i];for(const n of a)if("when"in n&&"then"in n){const o=n.when(e)?n.then:n.else;o&&typeof o=="object"&&Gt(t,o,e)}else if("whenState"in n&&"then"in n){const o=At(n.whenState,e)?n.then:n.else;o&&typeof o=="object"&&Gt(t,o,e)}else Gt(t,n,e);return t}function Gt(i,e,t){for(const[a,n]of Object.entries(e))li.has(a)||(i[a]=jo(n,t))}class di extends Kt.EventEmitter{constructor(){super(),this.rawEmitter=this}}const qo=Io,Vi=1.5,Nt={x:.5,y:.5,angle:0,ratio:1};class yt extends di{constructor(){super(...arguments),this.minRatio=null,this.maxRatio=null,this.enabled=!0,this.enabledZooming=!0,this.enabledPanning=!0,this.enabledRotation=!0,this.constrainState=null,this.state={...Nt},this.previousState={...Nt},this.nextFrame=null,this.currentAnimationFrom=null,this.currentAnimationTo=null,this.animationCallback=null}get x(){return this.state.x}get y(){return this.state.y}get angle(){return this.state.angle}get ratio(){return this.state.ratio}static from(e){return new yt().setState(e)}getState(){return{...this.state}}getPreviousState(){return{...this.previousState}}getBoundedRatio(e){let t=e;return typeof this.minRatio=="number"&&(t=Math.max(t,this.minRatio)),typeof this.maxRatio=="number"&&(t=Math.min(t,this.maxRatio)),t}validateState(e){const t=this.getState();return this.enabledPanning&&typeof e.x=="number"&&(t.x=e.x),this.enabledPanning&&typeof e.y=="number"&&(t.y=e.y),this.enabledZooming&&typeof e.ratio=="number"&&(t.ratio=this.getBoundedRatio(e.ratio)),this.enabledRotation&&typeof e.angle=="number"&&(t.angle=e.angle),this.constrainState?this.constrainState(t):t}isAnimating(){return this.nextFrame!==null}setState(e){if(!this.enabled)return this;const t=this.validateState(e);return wn(this.state,t)?this:(this.previousState=this.state,this.state=t,this.emit("updated",this.getState()),this)}updateState(e){return this.setState(e(this.getState())),this}animate(e,t){return this.enabled?new Promise(a=>this.runAnimation(e,{...la,...t},a)):Promise.resolve()}cancelAnimation(){return this.nextFrame!==null&&(cancelAnimationFrame(this.nextFrame),this.nextFrame=null),this.resolveAnimation(),this.emitAnimationEnd(!1),this}zoomIn({factor:e=Vi,...t}={}){return this.animate({ratio:this.ratio/e},t)}zoomOut({factor:e=Vi,...t}={}){return this.animate({ratio:this.ratio*e},t)}reset(e){return this.animate(Nt,e)}runAnimation(e,t,a){const n=qt(t.easing),r=Date.now(),o=this.getState(),s=this.validateState(e),l=()=>{if(!this.enabled){this.cancelAnimation();return}const h=t.duration>0?(Date.now()-r)/t.duration:1;if(h>=1){this.nextFrame=null,this.setState(s),this.resolveAnimation(),this.emitAnimationEnd(!0);return}const d=n(h);this.setState({x:o.x+(s.x-o.x)*d,y:o.y+(s.y-o.y)*d,angle:o.angle+(s.angle-o.angle)*d,ratio:o.ratio+(s.ratio-o.ratio)*d}),this.nextFrame=requestAnimationFrame(l)};this.cancelAnimation(),this.currentAnimationFrom=o,this.currentAnimationTo=s,this.animationCallback=a,this.emit("animationStart",{from:o,to:s}),l()}resolveAnimation(){const e=this.animationCallback;this.animationCallback=null,e&&e()}emitAnimationEnd(e){const t=this.currentAnimationFrom,a=this.currentAnimationTo;!t||!a||(this.currentAnimationFrom=null,this.currentAnimationTo=null,this.emit("animationEnd",{from:t,to:a,completed:e}))}}function H(i,e){const t=e.getBoundingClientRect();return{x:i.clientX-t.left,y:i.clientY-t.top}}function ee(i,e){const t={...H(i,e),sigmaDefaultPrevented:!1,preventSigmaDefault(){t.sigmaDefaultPrevented=!0},original:i};return t}function ce(i){const e="x"in i?i:{...i.touches[0]||i.previousTouches[0],original:i.original,sigmaDefaultPrevented:i.sigmaDefaultPrevented,preventSigmaDefault:()=>{i.sigmaDefaultPrevented=!0,e.sigmaDefaultPrevented=!0}};return e}function Ko(i,e){const t=ee(i,e);return t.delta=$a(i),t}const Yo=2;function pt(i){const e=[];for(let t=0,a=Math.min(i.length,Yo);t<a;t++)e.push(i[t]);return e}function ze(i,e,t){const a={touches:pt(i.touches).map(n=>H(n,t)),previousTouches:e.map(n=>H(n,t)),sigmaDefaultPrevented:!1,preventSigmaDefault(){a.sigmaDefaultPrevented=!0},original:i};return a}function $a(i){if(typeof i.deltaY<"u")return i.deltaY*-3/360;if(typeof i.detail<"u")return i.detail/-9;throw new Error("Captor: could not extract delta from event.")}class Wa extends di{constructor(e,t){super(),this.container=e,this.renderer=t}}const Zo=["doubleClickTimeout","doubleClickZoomingDuration","doubleClickZoomingRatio","dragTimeout","draggedEventsTolerance","enableCameraMouseRotation","gestureTarget","inertiaDuration","inertiaRatio","zoomDuration","zoomingRatio"],Qo=Zo.reduce((i,e)=>({...i,[e]:Tt[e]}),{});function $e(i){return i instanceof PointerEvent&&i.pointerType==="touch"}class Jo extends Wa{constructor(e,t){super(e,t),this.enabled=!0,this.draggedEvents=0,this.downStartTime=null,this.lastMouseX=null,this.lastMouseY=null,this.isMouseDown=!1,this.isMoving=!1,this.isPanningStage=!1,this.movingTimeout=null,this.startCameraState=null,this.clicks=0,this.doubleClickTimeout=null,this.isRightMouseDown=!1,this.startRotationAngle=null,this.startCameraAngle=null,this.currentWheelDirection=0,this.lastWheelAnimationId=0,this.settings=Qo,this.handleRightClick=this.handleRightClick.bind(this),this.handleDown=this.handleDown.bind(this),this.handleUp=this.handleUp.bind(this),this.handleMove=this.handleMove.bind(this),this.handleWheel=this.handleWheel.bind(this),this.handleLeave=this.handleLeave.bind(this),this.handleEnter=this.handleEnter.bind(this),e.addEventListener("contextmenu",this.handleRightClick,{capture:!1}),e.addEventListener("pointerdown",this.handleDown,{capture:!1}),e.addEventListener("wheel",this.handleWheel,{capture:!1,passive:!1}),e.addEventListener("pointerleave",this.handleLeave,{capture:!1}),e.addEventListener("pointerenter",this.handleEnter,{capture:!1}),document.addEventListener("pointermove",this.handleMove,{capture:!1}),document.addEventListener("pointerup",this.handleUp,{capture:!1})}kill(){const e=this.container;e.removeEventListener("contextmenu",this.handleRightClick),e.removeEventListener("pointerdown",this.handleDown),e.removeEventListener("wheel",this.handleWheel),e.removeEventListener("pointerleave",this.handleLeave),e.removeEventListener("pointerenter",this.handleEnter),document.removeEventListener("pointermove",this.handleMove),document.removeEventListener("pointerup",this.handleUp)}handleClick(e){if(this.enabled){if(this.clicks++,this.clicks===2)return this.clicks=0,typeof this.doubleClickTimeout=="number"&&(clearTimeout(this.doubleClickTimeout),this.doubleClickTimeout=null),this.handleDoubleClick(e);setTimeout(()=>{this.clicks=0,this.doubleClickTimeout=null},this.settings.doubleClickTimeout),this.draggedEvents<this.settings.draggedEventsTolerance&&this.emit("click",ee(e,this.container))}}handleRightClick(e){this.enabled&&(this.settings.enableCameraMouseRotation&&e.preventDefault(),this.emit("rightClick",ee(e,this.container)))}handleDoubleClick(e){if(!this.enabled)return;e.preventDefault(),e.stopPropagation();const t=ee(e,this.container);if(this.emit("doubleClick",t),t.sigmaDefaultPrevented)return;const a=this.renderer.getCamera(),n=a.getBoundedRatio(a.getState().ratio/this.settings.doubleClickZoomingRatio);a.animate(this.renderer.getViewportZoomedState(H(e,this.container),n),{easing:"quadraticInOut",duration:this.settings.doubleClickZoomingDuration})}handleDown(e){if(!(!this.enabled||$e(e))){if(e.button===0){this.startCameraState=this.renderer.getCamera().getState();const{x:t,y:a}=H(e,this.container);this.lastMouseX=t,this.lastMouseY=a,this.draggedEvents=0,this.downStartTime=Date.now(),this.isMouseDown=!0}if(e.button===2&&this.settings.enableCameraMouseRotation){const{x:t,y:a}=H(e,this.container),n=this.container.offsetWidth/2,r=this.container.offsetHeight/2;this.startRotationAngle=Math.atan2(a-r,t-n),this.startCameraAngle=this.renderer.getCamera().getState().angle,this.isRightMouseDown=!0}this.emit("mousedown",ee(e,this.container))}}handleUp(e){if(!this.enabled||$e(e)||!this.isMouseDown&&!this.isRightMouseDown)return;if(this.isRightMouseDown){this.isRightMouseDown=!1,this.startRotationAngle=null,this.startCameraAngle=null,this.emit("mouseup",ee(e,this.container));return}const t=this.renderer.getCamera();this.isMouseDown=!1,this.isPanningStage&&(this.isPanningStage=!1,this.renderer._setPanning(!1)),typeof this.movingTimeout=="number"&&(clearTimeout(this.movingTimeout),this.movingTimeout=null);const{x:a,y:n}=H(e,this.container),r=t.getState(),o=t.getPreviousState();this.isMoving?t.animate({x:r.x+this.settings.inertiaRatio*(r.x-o.x),y:r.y+this.settings.inertiaRatio*(r.y-o.y)},{duration:this.settings.inertiaDuration,easing:"quadraticOut"}):(this.lastMouseX!==a||this.lastMouseY!==n)&&t.setState({x:r.x,y:r.y}),this.isMoving=!1,setTimeout(()=>{const s=this.draggedEvents>0;this.draggedEvents=0;const l=this.renderer.getSetting("hideEdgesOnMove")||this.renderer.getSetting("hideLabelsOnMove");s&&l&&this.renderer.refresh()},0),this.emit("mouseup",ee(e,this.container)),(e.target===this.container||e.composedPath()[0]===this.container)&&this.handleClick(e)}handleMove(e){if(!this.enabled||$e(e))return;const t=ee(e,this.container);if(this.emit("mousemovebody",t),(e.target===this.container||e.composedPath()[0]===this.container)&&this.emit("mousemove",t),this.isMouseDown&&this.draggedEvents++,!t.sigmaDefaultPrevented){if(this.isMouseDown){this.isMoving=!0,typeof this.movingTimeout=="number"&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(()=>{this.movingTimeout=null,this.isMoving=!1},this.settings.dragTimeout);const a=this.renderer.getCamera(),{x:n,y:r}=H(e,this.container),o=this.renderer.viewportToFramedGraph({x:this.lastMouseX,y:this.lastMouseY}),s=this.renderer.viewportToFramedGraph({x:n,y:r}),l=o.x-s.x,h=o.y-s.y,d=a.getState(),u=d.x+l,c=d.y+h;this.isPanningStage||(this.isPanningStage=!0,this.renderer._setPanning(!0)),a.setState({x:u,y:c}),this.lastMouseX=n,this.lastMouseY=r,e.preventDefault(),e.stopPropagation()}if(this.isRightMouseDown){const{x:a,y:n}=H(e,this.container),r=this.container.offsetWidth/2,o=this.container.offsetHeight/2,l=Math.atan2(n-o,a-r)-this.startRotationAngle;this.renderer.getCamera().setState({angle:this.startCameraAngle+l}),e.preventDefault(),e.stopPropagation()}}}handleLeave(e){$e(e)||this.emit("mouseleave",ee(e,this.container))}handleEnter(e){$e(e)||this.emit("mouseenter",ee(e,this.container))}handleWheel(e){const t=this.renderer.getCamera();if(!this.enabled||!t.enabledZooming)return;const a=Ko(e,this.container);if(this.emit("wheel",a),a.sigmaDefaultPrevented)return;const{gestureTarget:n}=this.settings;if(n==="page")return;if(n==="shared"&&!e.ctrlKey&&!e.metaKey){this.renderer._showGestureHint("wheel");return}const r=$a(e);if(!r)return;e.preventDefault(),e.stopPropagation();const o=t.getState().ratio,s=r>0?1/this.settings.zoomingRatio:this.settings.zoomingRatio,l=t.getBoundedRatio(o*s),h=r>0?1:-1,d=Date.now();if(o===l||this.currentWheelDirection===h&&this.lastWheelTriggerTime&&d-this.lastWheelTriggerTime<this.settings.zoomDuration/5)return;const u=++this.lastWheelAnimationId;t.animate(this.renderer.getViewportZoomedState(H(e,this.container),l),{easing:"quadraticOut",duration:this.settings.zoomDuration}).then(()=>{this.lastWheelAnimationId===u&&(this.currentWheelDirection=0)}),this.currentWheelDirection=h,this.lastWheelTriggerTime=d}setSettings(e){this.settings=e}}const es=["dragTimeout","gestureTarget","inertiaDuration","inertiaRatio","doubleClickTimeout","doubleClickZoomingRatio","doubleClickZoomingDuration","tapMoveTolerance"],ts=es.reduce((i,e)=>({...i,[e]:Tt[e]}),{});class is extends Wa{constructor(e,t){super(e,t),this.enabled=!0,this.isMoving=!1,this.hasMoved=!1,this.isPanningStage=!1,this.isZoomingStage=!1,this.touchMode=0,this.startTouchesPositions=[],this.lastTouches=[],this.lastTap=null,this.settings=ts,this.handleStart=this.handleStart.bind(this),this.handleLeave=this.handleLeave.bind(this),this.handleMove=this.handleMove.bind(this),e.addEventListener("touchstart",this.handleStart,{capture:!1}),e.addEventListener("touchcancel",this.handleLeave,{capture:!1}),document.addEventListener("touchend",this.handleLeave,{capture:!1,passive:!1}),document.addEventListener("touchmove",this.handleMove,{capture:!1,passive:!1})}kill(){const e=this.container;e.removeEventListener("touchstart",this.handleStart),e.removeEventListener("touchcancel",this.handleLeave),document.removeEventListener("touchend",this.handleLeave),document.removeEventListener("touchmove",this.handleMove)}getDimensions(){return{width:this.container.offsetWidth,height:this.container.offsetHeight}}doesCapture(e){const{gestureTarget:t}=this.settings;return t==="graph"?!0:t==="page"?!1:e>=2}syncStageFlags(){const e=this.touchMode===1&&this.hasMoved,t=this.touchMode===2;e!==this.isPanningStage&&(this.isPanningStage=e,this.renderer._setPanning(e)),t!==this.isZoomingStage&&(this.isZoomingStage=t,this.renderer._setZooming(t))}handleStart(e){if(!this.enabled)return;const t=pt(e.touches);if(this.touchMode=t.length,this.startCameraState=this.renderer.getCamera().getState(),this.startTouchesPositions=t.map(a=>H(a,this.container)),this.touchMode===2){const[{x:a,y:n},{x:r,y:o}]=this.startTouchesPositions;this.startTouchesAngle=Math.atan2(o-n,r-a),this.startTouchesDistance=Math.sqrt(Math.pow(r-a,2)+Math.pow(o-n,2))}this.syncStageFlags(),this.emit("touchdown",ze(e,this.lastTouches,this.container)),this.lastTouches=t,this.lastTouchesPositions=this.startTouchesPositions,e.cancelable&&(this.doesCapture(e.touches.length)||this.renderer._hasNodeDrag())&&e.preventDefault()}handleLeave(e){if(!(!this.enabled||!this.startTouchesPositions.length)){switch(e.cancelable&&this.doesCapture(this.touchMode)&&e.preventDefault(),this.movingTimeout&&(this.isMoving=!1,clearTimeout(this.movingTimeout)),this.touchMode){case 2:if(e.touches.length===1){this.handleStart(e);break}case 1:if(this.isMoving){const t=this.renderer.getCamera(),a=t.getState(),n=t.getPreviousState();t.animate({x:a.x+this.settings.inertiaRatio*(a.x-n.x),y:a.y+this.settings.inertiaRatio*(a.y-n.y)},{duration:this.settings.inertiaDuration,easing:"quadraticOut"})}this.hasMoved=!1,this.isMoving=!1,this.touchMode=0;break}if(this.syncStageFlags(),this.emit("touchup",ze(e,this.lastTouches,this.container)),!e.touches.length){const t=H(this.lastTouches[0],this.container),a=this.startTouchesPositions[0],n=(t.x-a.x)**2+(t.y-a.y)**2;if(!e.touches.length&&n<this.settings.tapMoveTolerance**2)if(this.lastTap&&Date.now()-this.lastTap.time<this.settings.doubleClickTimeout){const r=ze(e,this.lastTouches,this.container);if(this.emit("doubletap",r),this.lastTap=null,!r.sigmaDefaultPrevented&&this.settings.gestureTarget!=="page"){const o=this.renderer.getCamera(),s=o.getBoundedRatio(o.getState().ratio/this.settings.doubleClickZoomingRatio);o.animate(this.renderer.getViewportZoomedState(t,s),{easing:"quadraticInOut",duration:this.settings.doubleClickZoomingDuration})}}else{const r=ze(e,this.lastTouches,this.container);this.emit("tap",r),this.lastTap={time:Date.now(),position:r.touches[0]||r.previousTouches[0]}}}this.lastTouches=pt(e.touches),this.startTouchesPositions=[]}}handleMove(e){if(!this.enabled||!this.startTouchesPositions.length)return;const t=this.doesCapture(e.touches.length);t&&e.preventDefault();const a=pt(e.touches),n=a.map(d=>H(d,this.container)),r=this.lastTouches;this.lastTouches=a,this.lastTouchesPositions=n;const o=ze(e,r,this.container);if(this.emit("touchmove",o),o.sigmaDefaultPrevented||(this.hasMoved||=n.some((d,u)=>{const c=this.startTouchesPositions[u];return c&&(d.x!==c.x||d.y!==c.y)}),!this.hasMoved))return;if(!t){this.settings.gestureTarget==="shared"&&this.renderer._showGestureHint("touch");return}this.isMoving=!0,this.syncStageFlags(),this.movingTimeout&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(()=>{this.isMoving=!1},this.settings.dragTimeout);const s=this.renderer.getCamera(),l=this.startCameraState,h=this.renderer.getSetting("stagePadding");switch(this.touchMode){case 1:{const{x:d,y:u}=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0]),{x:c,y:f}=this.renderer.viewportToFramedGraph(n[0]);s.setState({x:l.x+d-c,y:l.y+u-f});break}case 2:{const d={x:.5,y:.5,angle:0,ratio:1},{x:u,y:c}=n[0],{x:f,y:g}=n[1],b=Math.atan2(g-c,f-u)-this.startTouchesAngle,p=Math.hypot(g-c,f-u)/this.startTouchesDistance,m=s.getBoundedRatio(l.ratio/p);d.ratio=m,d.angle=l.angle+b;const y=this.getDimensions(),v=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0],{cameraState:l}),_=Math.min(y.width,y.height)-2*h,x=_/y.width,T=_/y.height,S=m/_;let E=u-_/2/x,D=c-_/2/T;({x:E,y:D}=da({x:E,y:D},d.angle)),d.x=v.x-E*S,d.y=v.y+D*S,s.setState(d);break}}}setSettings(e){this.settings=e}}class as{constructor(e,t,a,n){this.graph=e,this.viewportToGraph=t,this.setNodesState=a,this.emit=n,this.pendingNode=null,this.session=null}start(e,t,a,n,r){const o=a(e);let s=!1;if(this.emit("nodeDragStart",{node:e,allDraggedNodes:o,event:t,preventSigmaDefault(){s=!0}}),s)return!1;const l=new Map;for(const h of o)l.set(h,{x:this.graph.getNodeAttribute(h,n),y:this.graph.getNodeAttribute(h,r)});return this.session={node:e,allNodes:o,startPosition:this.viewportToGraph(t),startNodePositions:l,xAttr:n,yAttr:r},this.setNodesState(o,{isDragged:!0}),!0}applyMove(e,t){const{allNodes:a,startNodePositions:n,startPosition:r,xAttr:o,yAttr:s}=this.session,l=this.viewportToGraph(e),h={x:l.x-r.x,y:l.y-r.y};for(const d of a){const u=n.get(d);if(!u||!this.graph.hasNode(d))continue;const c={x:u.x+h.x,y:u.y+h.y};t?this.graph.mergeNodeAttributes(d,t(c,d)):(this.graph.setNodeAttribute(d,o,c.x),this.graph.setNodeAttribute(d,s,c.y))}}end(){if(this.pendingNode=null,!this.session)return null;const{node:e,allNodes:t}=this.session;return this.setNodesState(t,{isDragged:!1}),this.session=null,{node:e,allNodes:t}}removeNode(e){e===this.pendingNode&&(this.pendingNode=null),this.session&&(this.session.node===e?(this.setNodesState(this.session.allNodes,{isDragged:!1}),this.session=null):this.session.allNodes.includes(e)&&(this.session.allNodes=this.session.allNodes.filter(t=>t!==e),this.session.startNodePositions.delete(e)))}clear(){this.pendingNode=null,this.session=null}}class ns{constructor(e,t){this.graph=e,this.onGroupChanged=t,this.groups=new Map,this.edgeToGroupKey=new Map}getGroupKey(e){const t=this.graph.source(e),a=this.graph.target(e);return t<a?`${t}\0${a}`:`${a}\0${t}`}sortGroup(e,t){const a=t.split("\0")[0];e.sort((n,r)=>{const o=this.graph.source(n)===a||!this.graph.isDirected(n)?0:1,s=this.graph.source(r)===a||!this.graph.isDirected(r)?0:1;return o-s})}register(e){const t=this.getGroupKey(e);let a=this.groups.get(t);a||(a=[],this.groups.set(t,a)),a.includes(e)||a.push(e),this.edgeToGroupKey.set(e,t),this.sortGroup(a,t),this.onGroupChanged(a,a.length)}unregister(e){const t=this.edgeToGroupKey.get(e);if(!t)return;this.edgeToGroupKey.delete(e);const a=this.groups.get(t);if(!a)return;const n=a.indexOf(e);n!==-1&&a.splice(n,1),a.length===0?this.groups.delete(t):this.onGroupChanged(a,a.length)}getGroup(e){const t=this.edgeToGroupKey.get(e);return t?this.groups.get(t)??[]:[]}getSiblings(e){return this.getGroup(e).filter(t=>t!==e)}rebuild(){this.groups.clear(),this.edgeToGroupKey.clear(),this.graph.forEachEdge(e=>{const t=this.getGroupKey(e);let a=this.groups.get(t);a||(a=[],this.groups.set(t,a)),a.push(e),this.edgeToGroupKey.set(e,t)});for(const[e,t]of this.groups)this.sortGroup(t,e),this.onGroupChanged(t,t.length)}clear(){this.groups.clear(),this.edgeToGroupKey.clear()}}function Xi(i,e){if(i===!1||i==="extend"||i==="separate")return i;const t=i[e];return t!==void 0?t:i.default??!1}function ji(i){return i===!1?!1:i==="extend"||i==="separate"?!0:Object.values(i).some(e=>e==="extend"||e==="separate")}function qi(i){return i==="separate"?!0:i===!1||i==="extend"?!1:i.default==="separate"?!0:Object.values(i).includes("separate")}const O={node:{parent:null,eventSuffix:"Node",payloadKey:"node",isEnabled:()=>!0,writesPickingThisFrame:()=>!0,setHover:(i,e,t)=>i.setNodeState(e,{isHovered:t}),getCursor:(i,e)=>i.nodeDataCache[e]?.cursor,isHitValid:(i,e)=>i.nodeDataCache[e]?.visibility!=="hidden"},edge:{parent:null,eventSuffix:"Edge",payloadKey:"edge",isEnabled:i=>!!i.settings.enableEdgeEvents,writesPickingThisFrame:i=>!!i.settings.enableEdgeEvents,setHover:(i,e,t)=>i.setEdgeState(e,{isHovered:t}),getCursor:(i,e)=>i.edgeDataCache[e]?.cursor},nodeLabel:{parent:"node",eventSuffix:"NodeLabel",payloadKey:"node",isEnabled:i=>qi(i.settings.nodeLabelEvents),writesPickingThisFrame:i=>ji(i.settings.nodeLabelEvents),setHover:(i,e,t)=>i.setNodeState(e,{isLabelHovered:t}),getCursor:(i,e)=>i.nodeDataCache[e]?.labelCursor,resolveForVerb:(i,e,t)=>{const a=Xi(t.settings.nodeLabelEvents,e);return a===!1?null:a==="extend"?{kind:"node",key:i.key}:i}},edgeLabel:{parent:"edge",eventSuffix:"EdgeLabel",payloadKey:"edge",isEnabled:i=>qi(i.settings.edgeLabelEvents),writesPickingThisFrame:i=>ji(i.settings.edgeLabelEvents),setHover:(i,e,t)=>i.setEdgeState(e,{isLabelHovered:t}),getCursor:(i,e)=>i.edgeDataCache[e]?.labelCursor,resolveForVerb:(i,e,t)=>{const a=Xi(t.settings.edgeLabelEvents,e);return a===!1?null:a==="extend"?{kind:"edge",key:i.key}:i}}},xe=["node","edge","nodeLabel","edgeLabel"];function rs(){return{lookup:[null],idsByKind:{node:new Map,edge:new Map,nodeLabel:new Map,edgeLabel:new Map},nextId:1}}function be(i,e,t){return i.idsByKind[e].get(t)??0}function Mt(i,e){for(const a of xe)if(a===e||O[a].parent===e){for(const n of i.idsByKind[a].values())i.lookup[n]=null;i.idsByKind[a]=new Map}let t=1;for(const a of xe){if(a===e)break;t+=i.idsByKind[a].size}i.nextId=t}function Ki(i,e,t){const a=i.nextId++;return i.idsByKind[e].set(t,a),i.lookup[a]={kind:e,key:t},a}function os(i,e){for(const t of xe)if(O[t].parent!==null){for(const a of i.idsByKind[t].values())i.lookup[a]=null;i.idsByKind[t]=new Map}i.nextId=1;for(const t of xe)if(O[t].parent===null)for(const a of i.idsByKind[t].values())a>=i.nextId&&(i.nextId=a+1);for(const t of xe){const a=O[t];if(!(a.parent===null||!a.isEnabled(e)))for(const n of i.idsByKind[a.parent].keys())i.idsByKind[t].set(n,i.nextId),i.lookup[i.nextId]={kind:t,key:n},i.nextId++}}function ss(i,e){for(const t of xe){const a=i[t],n=e[t];if(a!==n){if(a.size!==n.size)return!1;for(const[r,o]of a)if(n.get(r)!==o)return!1}}return!0}function Yi(i,e,t){O[e.kind].setHover(i,e.key,t)}function ls(i,e){return O[e.kind].getCursor(i,e.key)}function je(i,e){return`${e}${O[i].eventSuffix}`}function qe(i,e){return{...e,[O[i.kind].payloadKey]:i.key}}function ds(i,e,t){const a=O[e.kind].resolveForVerb;return a?a(e,t,i):e}function hs(i,e){const t=O[e.kind].isHitValid;return t?t(i,e.key):!0}function zt(i){return xe.filter(e=>e===i||O[e].parent===i)}function Ba(i,e,t){return e&&(e=ds(i,e,t)),e&&!hs(i,e)&&(e=null),e}function $t(i,e,t){const a=t==="wheel"?i.stateManager.hovered:i.getHitAtPosition(e);return Ba(i,a,t)}function us(i,e){return!i||!e?i===e:i.kind===e.kind&&i.key===e.key}function Ua(i,e,t){const a={event:t,preventSigmaDefault:()=>t.preventSigmaDefault()},n=i.dragManager.session,r=n?{kind:"node",key:n.node}:Ba(i,e,"enter"),{stateManager:o}=i,s=o.hovered;us(s,r)||(s&&(Yi(i,s,!1),i.emit(je(s.kind,"leave"),qe(s,a))),o.setHovered(r),r&&(Yi(i,r,!0),i.emit(je(r.kind,"enter"),qe(r,a))),i.updateContainerCursor())}function cs(i,e,t,a){a.handleResize=()=>i.scheduleRefresh(),window.addEventListener("resize",a.handleResize),a.handleMove=r=>{i.hoverResolver.pointerMoved(ce(r))},a.handleMoveBody=r=>{const o=ce(r),{dragManager:s}=i;if(s.pendingNode&&!s.session){const{xAttribute:l,yAttribute:h}=i.nodeStyleAnalysis,{settings:d}=i;s.start(s.pendingNode,o,d.getDraggedNodes,l||"x",h||"y"),s.pendingNode=null}s.session&&(s.applyMove(o,i.settings.dragPositionToAttributes),i.emit("nodeDrag",{node:s.session.node,allDraggedNodes:s.session.allNodes,event:o}),o.preventSigmaDefault()),i.emit("moveBody",{event:o,preventSigmaDefault:()=>o.preventSigmaDefault()})},a.handleLeave=r=>{const o=ce(r),s={event:o,preventSigmaDefault:()=>o.preventSigmaDefault()};i.hoverResolver.pointerLeft(),Ua(i,null,o),i.emit("leaveStage",s)},a.handleEnter=r=>{const o=ce(r);i.emit("enterStage",{event:o,preventSigmaDefault:()=>o.preventSigmaDefault()})};const n=r=>o=>{const s=ce(o),l={event:s,preventSigmaDefault:()=>s.preventSigmaDefault()},h=$t(i,s,r);if(h){i.emit(je(h.kind,r),qe(h,l));return}i.emit(`${r}Stage`,l)};a.handleClick=n("click"),a.handleRightClick=n("rightClick"),a.handleDoubleClick=n("doubleClick"),a.handleWheel=n("wheel"),a.handleDown=r=>{const o=ce(r),s={event:o,preventSigmaDefault:()=>o.preventSigmaDefault()},l=$t(i,o,"down");if(l){l.kind==="node"&&i.settings.enableNodeDrag&&(i.dragManager.pendingNode=l.key),i.emit(je(l.kind,"down"),qe(l,s));return}i.emit("downStage",s)},a.handleUp=r=>{const o=ce(r),s={event:o,preventSigmaDefault:()=>o.preventSigmaDefault()},l=i.dragManager.end();l&&i.emit("nodeDragEnd",{node:l.node,allDraggedNodes:l.allNodes,...s});const h=$t(i,o,"up");if(h){i.emit(je(h.kind,"up"),qe(h,s));return}i.emit("upStage",s)},e.on("mousemove",a.handleMove),e.on("mousemovebody",a.handleMoveBody),e.on("click",a.handleClick),e.on("rightClick",a.handleRightClick),e.on("doubleClick",a.handleDoubleClick),e.on("wheel",a.handleWheel),e.on("mousedown",a.handleDown),e.on("mouseup",a.handleUp),e.on("mouseleave",a.handleLeave),e.on("mouseenter",a.handleEnter),t.on("touchdown",a.handleDown),t.on("touchdown",a.handleMove),t.on("touchup",a.handleUp),t.on("touchmove",a.handleMove),t.on("tap",a.handleClick),t.on("doubletap",a.handleDoubleClick),t.on("touchmove",a.handleMoveBody)}function fs(i,e){const{graph:t}=i,a=new Set(["x","y","zIndex","type"]);e.eachNodeAttributesUpdatedGraphUpdate=n=>{const r=n.hints?.attributes,o=!r||r.some(s=>a.has(s));i.refresh({partialGraph:{nodes:t.nodes()},skipIndexation:!o,schedule:!0})},e.eachEdgeAttributesUpdatedGraphUpdate=n=>{const r=n.hints?.attributes,o=r&&["zIndex","type"].some(s=>r?.includes(s));i.refresh({partialGraph:{edges:t.edges()},skipIndexation:!o,schedule:!0})},e.addNodeGraphUpdate=n=>{i.addNode(n.key),i.refresh({partialGraph:{nodes:[n.key]},skipIndexation:!1,schedule:!0})},e.updateNodeGraphUpdate=n=>{i.refresh({partialGraph:{nodes:[n.key]},skipIndexation:!1,schedule:!0})},e.dropNodeGraphUpdate=n=>{i.removeNode(n.key),i.refresh({schedule:!0})},e.addEdgeGraphUpdate=n=>{const r=n.key;i.edgeGroups.register(r),i.addEdge(r);const o=i.edgeGroups.getSiblings(r);for(const s of o)i.addEdge(s);i.refresh({partialGraph:{edges:[r,...o]},schedule:!0})},e.updateEdgeGraphUpdate=n=>{i.refresh({partialGraph:{edges:[n.key]},skipIndexation:!1,schedule:!0})},e.dropEdgeGraphUpdate=n=>{const r=n.key,o=i.edgeGroups.getSiblings(r);i.edgeGroups.unregister(r),i.removeEdge(r);for(const s of o)i.addEdge(s);i.refresh({schedule:!0})},e.clearEdgesGraphUpdate=()=>{i.clearEdgeState(),i.clearEdgeIndices(),i.refresh({schedule:!0})},e.clearGraphUpdate=()=>{i.clearEdgeState(),i.clearNodeState(),i.clearEdgeIndices(),i.clearNodeIndices(),i.refresh({schedule:!0})},t.on("nodeAdded",e.addNodeGraphUpdate),t.on("nodeDropped",e.dropNodeGraphUpdate),t.on("nodeAttributesUpdated",e.updateNodeGraphUpdate),t.on("eachNodeAttributesUpdated",e.eachNodeAttributesUpdatedGraphUpdate),t.on("edgeAdded",e.addEdgeGraphUpdate),t.on("edgeDropped",e.dropEdgeGraphUpdate),t.on("edgeAttributesUpdated",e.updateEdgeGraphUpdate),t.on("eachEdgeAttributesUpdated",e.eachEdgeAttributesUpdatedGraphUpdate),t.on("edgesCleared",e.clearEdgesGraphUpdate),t.on("cleared",e.clearGraphUpdate)}function gs(i,e){i.removeListener("nodeAdded",e.addNodeGraphUpdate),i.removeListener("nodeDropped",e.dropNodeGraphUpdate),i.removeListener("nodeAttributesUpdated",e.updateNodeGraphUpdate),i.removeListener("eachNodeAttributesUpdated",e.eachNodeAttributesUpdatedGraphUpdate),i.removeListener("edgeAdded",e.addEdgeGraphUpdate),i.removeListener("edgeDropped",e.dropEdgeGraphUpdate),i.removeListener("edgeAttributesUpdated",e.updateEdgeGraphUpdate),i.removeListener("eachEdgeAttributesUpdated",e.eachEdgeAttributesUpdatedGraphUpdate),i.removeListener("edgesCleared",e.clearEdgesGraphUpdate),i.removeListener("cleared",e.clearGraphUpdate)}const ps={x:.5,y:.5,angle:0,ratio:1},ms=8,bs=.001;function xs(i){const{coords:e,nodeData:t,dimensions:a,stagePadding:n,zoomToSizeRatioFunction:r,itemSizesReference:o,fitLabels:s,nodeLabelBox:l}=i,h=Object.keys(e);if(!h.length)return i.extent;const d=r(1)||1,u=o==="positions",{width:c,height:f}=a;let g=i.extent;for(let b=0;b<ms;b++){const p=Ot(g),m={width:g.x[1]-g.x[0]||1,height:g.y[1]-g.y[0]||1},y=pe(ps,a,m,n),v=Zi(y,p({x:0,y:0}),c,f),_=Zi(y,p({x:1,y:0}),c,f),x=Math.hypot(_.x-v.x,_.y-v.y)||1;let T=1/0,S=-1/0,E=1/0,D=-1/0;for(let R=0,P=h.length;R<P;R++){const G=h[R],N=t[G],k=N.size/d*(u?x:1);let $=-k,M=k,K=-k,Y=k;if(s){const ae=l(N,k);ae&&(ae.minX<$&&($=ae.minX),ae.maxX>M&&(M=ae.maxX),ae.minY<K&&(K=ae.minY),ae.maxY>Y&&(Y=ae.maxY))}const{x:gi,y:pi}=e[G];T=Math.min(T,gi+$/x),S=Math.max(S,gi+M/x),E=Math.min(E,pi-Y/x),D=Math.max(D,pi-K/x)}const w={x:[T,S],y:[E,D]},A=Math.max(w.x[1]-w.x[0],w.y[1]-w.y[0])||1,F=Math.max(Math.abs(w.x[0]-g.x[0]),Math.abs(w.x[1]-g.x[1]),Math.abs(w.y[0]-g.y[0]),Math.abs(w.y[1]-g.y[1]));if(g=w,F/A<bs)break}return g}function Zi(i,e,t,a){const n=Ke(i,e);return{x:(1+n.x)*t/2,y:(1-n.y)*a/2}}const ys=typeof navigator<"u"&&/Mac|iP(hone|ad|od)/.test(navigator.platform),_s=1500,Ts=`.sigma-gesture-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1em;
  background: #00000066;
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: opacity 0.1s;
}`;function Qi(i){const e=Ye("style");e.textContent=i,document.head.appendChild(e);const t=(e.sheet?.cssRules.length??0)>0;return e.remove(),t}let fe=null;function vs(){return fe===null&&(fe=Ts,Qi("@scope {}")&&(fe=`@scope {
${fe}
}`),Qi("@layer sigma-gesture-hint {}")&&(fe=`@layer sigma-gesture-hint {
${fe}
}`)),fe}class Ss{constructor(e){this.hideTimeout=null,this.styleElement=Ye("style"),this.styleElement.textContent=vs(),e.appendChild(this.styleElement),this.element=Ye("div",{opacity:"0"},{class:"sigma-gesture-hint"}),e.appendChild(this.element)}show(e,t){const a=e==="touch"?t.sharedGestureTouchMessage:ys?t.sharedGestureAppleWheelMessage:t.sharedGestureWheelMessage;a&&(this.element.textContent=a,this.element.style.opacity="1",typeof this.hideTimeout=="number"&&clearTimeout(this.hideTimeout),this.hideTimeout=window.setTimeout(()=>{this.hideTimeout=null,this.element.style.opacity="0"},_s))}kill(){typeof this.hideTimeout=="number"&&clearTimeout(this.hideTimeout),this.styleElement.remove(),this.element.remove()}}class Es{constructor(e){this.readBuffer=null,this.fence=null,this.result=new Uint8Array(4),this.generation=0,this.readGeneration=0,this.lastEvent=null,this.active=!1,this.dirty=!1,this.rafId=null,this.killed=!1,this.options=e}pointerMoved(e){this.lastEvent=e,this.active=!0,this.request()}pointerLeft(){this.active=!1,this.dirty=!1}frameRendered(){this.request()}invalidate(){this.generation++}request(){if(!(this.killed||!this.active||!this.lastEvent)){if(this.fence){this.dirty=!0;return}this.startRead()}}startRead(){const{gl:e,getFrameBuffer:t,getPixelRatio:a,getDownSizingRatio:n}=this.options;this.readGeneration=this.generation;const r=this.lastEvent,[o,s]=ha(e,r.x,r.y,a(),n());this.readBuffer||(this.readBuffer=e.createBuffer()),e.bindFramebuffer(e.FRAMEBUFFER,t()),e.bindBuffer(e.PIXEL_PACK_BUFFER,this.readBuffer),e.bufferData(e.PIXEL_PACK_BUFFER,4,e.STREAM_READ),e.readPixels(o,s,1,1,e.RGBA,e.UNSIGNED_BYTE,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),this.fence=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0),e.flush(),this.schedulePoll(r)}schedulePoll(e){this.rafId=requestAnimationFrame(()=>{this.rafId=null,this.poll(e)})}poll(e){const{gl:t,onIndex:a}=this.options;if(this.killed||!this.fence)return;const n=t.clientWaitSync(this.fence,0,0);if(n===t.TIMEOUT_EXPIRED){this.schedulePoll(e);return}if(t.deleteSync(this.fence),this.fence=null,n!==t.WAIT_FAILED&&this.readGeneration===this.generation){t.bindBuffer(t.PIXEL_PACK_BUFFER,this.readBuffer),t.getBufferSubData(t.PIXEL_PACK_BUFFER,0,this.result),t.bindBuffer(t.PIXEL_PACK_BUFFER,null);const[r,o,s,l]=this.result;this.active&&a(fa(r,o,s,l),e)}this.dirty&&(this.dirty=!1,this.active&&this.lastEvent&&this.startRead())}reset(){this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null,this.fence=null,this.readBuffer=null,this.dirty=!1}kill(){this.killed=!0,this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null;const{gl:e}=this.options;this.fence&&e.deleteSync(this.fence),this.fence=null,this.readBuffer&&e.deleteBuffer(this.readBuffer),this.readBuffer=null}}class Ji{constructor(e,t){this.key=e,this.size=t}static compare(e,t){return e.size>t.size?-1:e.size<t.size||e.key>t.key?1:-1}}class dt{constructor(){this.width=0,this.height=0,this.cellSize=0,this.columns=0,this.rows=0,this.cells={}}resizeAndClear(e,t){this.width=e.width,this.height=e.height,this.cellSize=t,this.columns=Math.ceil(e.width/t),this.rows=Math.ceil(e.height/t),this.cells={}}getIndex(e){const t=Math.floor(e.x/this.cellSize);return Math.floor(e.y/this.cellSize)*this.columns+t}add(e,t,a){const n=new Ji(e,t),r=this.getIndex(a);let o=this.cells[r];o||(o=[],this.cells[r]=o),o.push(n)}organize(){for(const e in this.cells)this.cells[e].sort(Ji.compare)}getLabelsToDisplay(e,t,a){const n=this.cellSize*this.cellSize,o=n/e/e*t/n,s=Math.ceil(o),l=[];if(a){const h=Math.max(0,Math.floor(a.x1/this.cellSize)),d=Math.min(this.columns-1,Math.floor(a.x2/this.cellSize)),u=Math.max(0,Math.floor(a.y1/this.cellSize)),c=Math.min(this.rows-1,Math.floor(a.y2/this.cellSize));for(let f=u;f<=c;f++)for(let g=h;g<=d;g++){const b=f*this.columns+g,p=this.cells[b];if(p)for(let m=0;m<Math.min(s,p.length);m++)l.push(p[m].key)}}else for(const h in this.cells){const d=this.cells[h];for(let u=0;u<Math.min(s,d.length);u++)l.push(d[u].key)}return l}}function ws(i){const{graph:e,hoveredNode:t,highlightedNodes:a,displayedNodeLabels:n}=i,r=new Set,o=new Set(a);t&&o.add(t);for(const s of o)e.hasNode(s)&&e.forEachEdge(s,l=>{r.add(l)});for(const s of n)o.has(s)||e.forEachEdge(s,(l,h,d,u)=>{const c=d===s?u:d;n.has(c)&&r.add(l)});return Array.from(r)}const we=150,De=50,Ds={both:0,node:1,label:2},As={over:0,above:1,below:2,auto:3},ea=12,Rs=3;class Cs{constructor(e){this.internals=e,this.labelGrid=new dt,this.edgeAnchorGrid=new dt,this.displayedNodeLabels=new Set,this.displayedEdgeLabels=new Set,this.edgeLabelCandidates=[],this.renderedNodeLabels=new Set,this.labelSizeCache=new Map,this.framePassPoints=new Float32Array(0),this.labelsDirty=!0}resetFrame(){this.displayedNodeLabels=new Set,this.renderedNodeLabels=new Set,this.labelSizeCache.clear()}clearEdgeLabels(){this.displayedEdgeLabels=new Set}resetLabelGrid(){this.labelGrid=new dt,this.edgeAnchorGrid=new dt}processWebGLLabels(e){const{labelProgram:t,primitives:a,nodeDataCache:n}=this.internals,r=a?.nodes?.label?.font?.family||"sans-serif",o=new Map;for(let s=0,l=e.length;s<l;s++){const h=e[s],d=n[h];if(d.visibility==="hidden"||!d.label)continue;const u=d.labelFont||r,c=o.get(u);c?c.push(d.label):o.set(u,[d.label])}for(const[s,l]of o){const{family:h,weight:d,style:u}=Pt(s),c=t.registerFont(h,d,u);t.ensureGlyphsReady(l,c)}}measureNodeLabel(e){if(!e.label)return{width:0,height:0,textHeight:0};const{labelProgram:t,primitives:a}=this.internals,n=e.labelSize??14,r=e.labelFont||a?.nodes?.label?.font?.family||"sans-serif",o=`${e.label}|${n}|${r}`;if(this.labelSizeCache.has(o))return this.labelSizeCache.get(o);const{family:s,weight:l,style:h}=Pt(r),d=t.registerFont(s,l,h),u=t.measureLabel(e.label,n,d);return this.labelSizeCache.set(o,u),u}nodeLabelBox(e,t){if(e.visibility==="hidden"||e.labelVisibility==="hidden")return null;const{width:a,height:n,textHeight:r}=this.measureNodeLabel(e);if(!a)return null;const o=this.internals.primitives?.nodes?.label?.margin??Ze,s=t+o,l=e.labelBackgroundColor?e.labelBackgroundPadding??Di:0,h=a/2,d=n/2,u=h+l,c=d+l,f=r/2;let g=0,b=0;switch(e.labelPosition??"right"){case"left":g=-(s+h);break;case"above":b=-(s+f);break;case"below":b=s+f;break;case"over":break;default:g=s+h}const p=e.labelAngle??0,{x:m,y}=da({x:g,y:b},p),v=Math.abs(Math.cos(p)),_=Math.abs(Math.sin(p)),x=v*u+_*c,T=_*u+v*c;return{minX:m-x,maxX:m+x,minY:y-T,maxY:y+T}}computeDisplayedNodeLabels(){const e=this.internals.getCameraState(),{width:t,height:a}=this.internals.getDimensions(),n=this.internals.viewportToFramedGraph({x:-we,y:-De}),r=this.internals.viewportToFramedGraph({x:t+we,y:-De}),o=this.internals.viewportToFramedGraph({x:-we,y:a+De}),s=this.internals.viewportToFramedGraph({x:t+we,y:a+De}),l=Math.min(n.x,r.x,o.x,s.x),h=Math.max(n.x,r.x,o.x,s.x),d=Math.min(n.y,r.y,o.y,s.y),u=Math.max(n.y,r.y,o.y,s.y),c=pe({x:.5,y:.5,ratio:1,angle:0},{width:t,height:a},this.internals.getGraphDimensions(),this.internals.getStagePadding()),f=S=>{const E=Ke(c,S);return{x:(1+E.x)*t/2,y:(1-E.y)*a/2}},g=f({x:l,y:d}),b=f({x:h,y:d}),p=f({x:l,y:u}),m=f({x:h,y:u}),y={x1:Math.min(g.x,b.x,p.x,m.x),y1:Math.min(g.y,b.y,p.y,m.y),x2:Math.max(g.x,b.x,p.x,m.x),y2:Math.max(g.y,b.y,p.y,m.y)},{settings:v,nodeDataCache:_,nodesWithForcedLabels:x}=this.internals,T=this.labelGrid.getLabelsToDisplay(e.ratio,v.labelDensity,y);yi(T,x);for(let S=0,E=T.length;S<E;S++){const D=T[S],w=_[D];if(this.displayedNodeLabels.has(D)||w.visibility==="hidden"||w.labelVisibility==="hidden"||!w.label||w.x<l||w.x>h||w.y<d||w.y>u)continue;const{x:A,y:F}=this.internals.framedGraphToViewport(w),R=this.internals.scaleSize(w.size);!me(w)&&R<v.labelRenderedSizeThreshold||A<-we-R||A>t+we+R||F<-De-R||F>a+De+R||this.displayedNodeLabels.add(D)}}buildFramePassPoints(){const{nodeDataCache:e,nodeDataTexture:t}=this.internals;if(!t)return{data:this.framePassPoints,count:0};const a=this.displayedNodeLabels.size*3;this.framePassPoints.length<a&&(this.framePassPoints=new Float32Array(a));const n=this.framePassPoints;let r=0;for(const o of this.displayedNodeLabels){const s=e[o];if(!s)continue;const l=t.getIndex(o);l<0||(n[r*3]=l,n[r*3+1]=He[s.labelPosition||le.labelPosition]??0,n[r*3+2]=s.labelAngle??0,r++)}return{data:n,count:r}}renderWebGLLabels(e,t){const{nodeDataCache:a,labelProgram:n,primitives:r,nodeDataTexture:o}=this.internals,s=[];for(const l of this.displayedNodeLabels){if(this.renderedNodeLabels.has(l))continue;const h=a[l];t&&h.labelDepth!==t||(this.renderedNodeLabels.add(l),s.push(l))}if(s.length!==0){if(this.labelsDirty){let l=0;for(let b=0,p=s.length;b<p;b++){const m=a[s[b]];l+=m.label.length}n.reallocate(l);const h=14,d=r?.nodes?.label?.margin??Ze,u=le.labelPosition,c=r?.nodes?.label?.font?.family||"sans-serif",f=new Map;let g=0;for(let b=0,p=s.length;b<p;b++){const m=s[b],y=a[m],v=y.labelFont||c;let _=f.get(v);if(_===void 0){const{family:S,weight:E,style:D}=Pt(v);_=n.registerFont(S,E,D),f.set(v,_)}const x={text:y.label,x:y.x,y:y.y,size:y.labelSize??h,color:y.labelColor,nodeSize:y.size,margin:d,position:y.labelPosition??u,hidden:!1,forceLabel:me(y),type:"default",zIndex:y.zIndex??0,parentType:"node",parentKey:m,fontKey:_,labelAngle:y.labelAngle??0,nodeIndex:o.getIndex(m)},T=n.processLabel(m,g,x);g+=T}n.invalidateBuffers()}n.render(e)}}renderBackdrops(e,t){const{backdropProgram:a,nodeDataCache:n,nodesWithBackdrop:r,attachmentManager:o,pixelRatio:s,nodeDataTexture:l}=this.internals,h=[];for(const d of r){const u=n[d];if(!u||u.visibility==="hidden"||t&&u.depth!==t)continue;const c=l?.getIndex(d)??-1;c<0||h.push({key:d,nodeIndex:c})}if(h.length!==0){a.reallocate(h.length);for(let d=0;d<h.length;d++){const{key:u,nodeIndex:c}=h[d],f=n[u],g=this.displayedNodeLabels.has(u),b=g?this.measureNodeLabel(f):{width:0,height:0,textHeight:0},p=b.textHeight;let m=b.width,y=b.height,v=0,_=0;if(g&&f.labelAttachment&&o){const M=o.getEntry(u,f.labelAttachment);if(M){const K=f.labelAttachmentPlacement||"below";if(K==="below"||K==="above"){const Y=M.height/s;y+=Y+ge,m=Math.max(m,M.width/s),_=K==="below"?(Y+ge)/2:-(Y+ge)/2}else{const Y=M.width/s;m+=Y+ge,y=Math.max(y,M.height/s),v=K==="right"?(Y+ge)/2:-(Y+ge)/2}}}const x=f.backdropColor?Oe(f.backdropColor):[255,255,255,255],T=f.backdropShadowColor?Oe(f.backdropShadowColor):[0,0,0,128],S=x.map(M=>M/255),E=T.map(M=>M/255),D=f.backdropShadowBlur??12,w=f.backdropPadding??6,F=(f.backdropBorderColor?Oe(f.backdropBorderColor):[0,0,0,0]).map(M=>M/255),R=f.backdropBorderWidth??0,P=f.backdropCornerRadius??0,G=f.backdropLabelPadding??-1,N=G<0?w:G,k=Ds[f.backdropArea??"both"]??0,$={key:u,nodeIndex:c,label:f.label,labelWidth:m,labelHeight:y,textHeight:p,type:"default",position:f.labelPosition||le.labelPosition,labelAngle:f.labelAngle??0,backdropColor:S,backdropShadowColor:E,backdropShadowBlur:D,backdropPadding:w,backdropBorderColor:F,backdropBorderWidth:R,backdropCornerRadius:P,backdropLabelPadding:N,backdropArea:k,labelBoxOffset:[v,_]};a.processBackdrop(d,$)}a.invalidateBuffers(),a.render(e)}}renderLabelBackgrounds(e,t){const{labelBackgroundProgram:a,nodeDataCache:n,nodeDataTexture:r}=this.internals,o=O.nodeLabel.writesPickingThisFrame(this.internals),s=[];for(const l of this.displayedNodeLabels){const h=n[l];!h||h.visibility==="hidden"||t&&h.labelDepth!==t||!o&&!h.labelBackgroundColor||s.push(l)}if(s.length!==0){a.reallocate(s.length);for(let l=0;l<s.length;l++){const h=s[l],d=n[h],u=r?.getIndex(h)??-1;if(u<0)continue;const{width:c,height:f,textHeight:g}=this.measureNodeLabel(d),b=be(this.internals.pickingState,"nodeLabel",h)||be(this.internals.pickingState,"node",h),p=d.labelBackgroundColor?te(d.labelBackgroundColor):te("transparent"),m={nodeIndex:u,id:mt(b),color:p,labelWidth:c,labelHeight:f,textHeight:g,positionMode:He[d.labelPosition||le.labelPosition]??0,labelAngle:d.labelAngle??0,padding:d.labelBackgroundPadding??Di};a.processLabelBackground(l,m)}a.invalidateBuffers(),a.render(e)}}cacheAttachments(e){const{attachmentManager:t,pixelRatio:a,nodeDataCache:n,nodesWithBackdrop:r,graph:o}=this.internals;if(t){for(const s of r){if(!this.displayedNodeLabels.has(s))continue;const l=n[s];if(!l||l.visibility==="hidden"||e&&l.depth!==e||!l.labelAttachment)continue;const h=o.getNodeAttributes(s),{width:d,height:u}=this.measureNodeLabel(l),c={node:s,attributes:h,pixelRatio:a,labelWidth:d,labelHeight:u};t.renderAttachment(s,l.labelAttachment,c)}t.regenerateAtlas()}}renderAttachments(e,t){const{attachmentManager:a,attachmentProgram:n,nodeDataCache:r,nodesWithBackdrop:o,pixelRatio:s,nodeDataTexture:l}=this.internals;if(!a||!n)return;let h=0;n.reallocateAttachments(o.size);for(const d of o){if(!this.displayedNodeLabels.has(d))continue;const u=r[d];if(!u||u.visibility==="hidden"||t&&u.labelDepth!==t||!u.labelAttachment)continue;const c=a.getEntry(d,u.labelAttachment);if(!c)continue;const f=l?.getIndex(d)??-1;if(f<0)continue;const{width:g,height:b,textHeight:p}=this.measureNodeLabel(u),m=sr[u.labelAttachmentPlacement||"below"]??0;n.processAttachment(h,{nodeIndex:f,atlasX:c.x,atlasY:c.y,atlasW:c.width,atlasH:c.height,attachWidth:c.width/s,attachHeight:c.height/s,positionMode:He[u.labelPosition||le.labelPosition]??0,attachmentPlacement:m,labelWidth:g,labelHeight:b,textHeight:p,labelAngle:u.labelAngle??0}),h++}h!==0&&(n.reallocateAttachments(h),a.bindTexture(ai),n.invalidateBuffers(),n.render(e))}computeDisplayedEdgeLabels(){const{graph:e,stateManager:t,settings:a,edgesWithForcedLabels:n}=this.internals,r=t.getHighlightedNodes(),o=a.edgeLabelAnchors==="allNodes"?new Set(this.edgeAnchorGrid.getLabelsToDisplay(this.internals.getCameraState().ratio,a.labelDensity)):this.displayedNodeLabels,s=t.hovered,l=ws({graph:e,hoveredNode:s?.kind==="node"?s.key:null,displayedNodeLabels:o,highlightedNodes:r});yi(l,n),this.edgeLabelCandidates=l,this.displayedEdgeLabels=new Set}filterEdgeLabelsForDepth(e){const{graph:t,nodeDataCache:a,edgeDataCache:n}=this.internals,r=[],o=new Set;for(let s=0,l=this.edgeLabelCandidates.length;s<l;s++){const h=this.edgeLabelCandidates[s];if(o.has(h))continue;o.add(h);const d=t.extremities(h),u=a[d[0]],c=a[d[1]],f=n[h];!f||!u||!c||f.visibility==="hidden"||f.labelVisibility==="hidden"||u.visibility==="hidden"||c.visibility==="hidden"||e&&f.labelDepth!==e||f.label&&r.push(h)}return r}renderEdgeLabels(e,t){const{graph:a,nodeDataCache:n,edgeDataCache:r,primitives:o,edgeLabelProgram:s,nodeDataTexture:l,edgeDataTexture:h}=this.internals,d=this.filterEdgeLabelsForDepth(t);for(const u of d)this.displayedEdgeLabels.add(u);if(d.length!==0){if(this.labelsDirty){let u=0;for(const b of d)u+=r[b].label.length;s.reallocate(u);const c=o?.edges?.label?.margin??5,f="over";let g=0;for(const b of d){const p=a.extremities(b),m=p[0],y=p[1],v=n[m],_=n[y],x=r[b],T=l.getIndex(m),S=l.getIndex(y),E=h.getIndex(b),D={text:x.label,x:(v.x+_.x)/2,y:(v.y+_.y)/2,size:ea,color:x.labelColor,nodeSize:0,nodeIndex:-1,margin:c,position:x.labelPosition??f,hidden:!1,forceLabel:me(x),type:"default",zIndex:x.zIndex??0,parentType:"edge",parentKey:b,fontKey:"",labelAngle:0,sourceX:v.x,sourceY:v.y,targetX:_.x,targetY:_.y,sourceSize:v.size,targetSize:_.size,sourceShape:v.shape||"circle",targetShape:_.shape||"circle",edgeSize:x.size,offset:0,edgeAttributes:x,sourceNodeIndex:T,targetNodeIndex:S,edgeIndex:E},w=s.processEdgeLabel(b,g,D);g+=w}s.invalidateBuffers()}s.render(e)}}renderEdgeLabelBackgrounds(e,t){const{edgeLabelBackgroundProgram:a,edgeLabelProgram:n,edgeDataCache:r,primitives:o,edgeDataTexture:s}=this.internals;if(!s)return;const l=O.edgeLabel.writesPickingThisFrame(this.internals),h=o?.edges?.label?.margin??5,d="over",u=this.filterEdgeLabelsForDepth(t),c=[];for(const f of u)!l&&!r[f].labelBackgroundColor||c.push(f);if(c.length!==0){a.reallocate(c.length);for(let f=0;f<c.length;f++){const g=c[f],b=r[g],p=b.label,m=n.measureLabelAtlasWidth(p),y=b.labelPosition??d,v=typeof y=="string"?As[y]??0:0,_=be(this.internals.pickingState,"edgeLabel",g)||be(this.internals.pickingState,"edge",g),x=b.labelBackgroundColor?te(b.labelBackgroundColor):te("transparent"),T={edgeIndex:s.getIndex(g),baseFontSize:ea,totalTextWidth:m,positionMode:v,margin:h,padding:b.labelBackgroundPadding??Rs,color:x,id:mt(_),edgeAttributes:b};a.processEdgeLabelBackground(f,g,T)}a.invalidateBuffers(),a.render(e)}}}class Ls{constructor(e,t,a,n){this.scheduleRefresh=e,this.customNodeStateDefaults=t,this.customEdgeStateDefaults=a,this.customGraphStateDefaults=n,this.nodeStates=new Map,this.edgeStates=new Map,this.hovered=null,this.dirtyNodes=new Set,this.dirtyEdges=new Set,this.graphStateChanged=!1,this.graphStateFlagsDirty=!1,this.graphState=zi(n)}getNodeState(e){e=""+e;let t=this.nodeStates.get(e);return t||(t=Mo(this.customNodeStateDefaults),this.nodeStates.set(e,t)),t}getEdgeState(e){e=""+e;let t=this.edgeStates.get(e);return t||(t=zo(this.customEdgeStateDefaults),this.edgeStates.set(e,t)),t}getGraphState(){return this.flushGraphStateFlags(),this.graphState}getHighlightedNodes(){const e=new Set;for(const[t,a]of this.nodeStates)a.isHighlighted&&e.add(t);return e}setNodeState(e,t){e=""+e;const a=this.getNodeState(e);if(!Ge(a,t))return;const n={...a,...t};this.nodeStates.set(e,n),this.dirtyNodes.add(e),this.updateHoveredNodeTracking(e,a,n),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}setEdgeState(e,t){e=""+e;const a=this.getEdgeState(e);if(!Ge(a,t))return;const n={...a,...t};this.edgeStates.set(e,n),this.dirtyEdges.add(e),this.updateHoveredEdgeTracking(e,a,n),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}setGraphState(e){if(!Ge(this.graphState,e))return;const t={...this.graphState,...e};t.isIdle=!t.isPanning&&!t.isZooming&&!t.isDragging,this.graphState=t,this.graphStateChanged=!0,this.scheduleRefresh()}setNodesState(e,t){let a=!1;for(let n of e){n=""+n;const r=this.getNodeState(n);if(!Ge(r,t))continue;const o={...r,...t};this.nodeStates.set(n,o),this.dirtyNodes.add(n),this.updateHoveredNodeTracking(n,r,o),a=!0}a&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}setEdgesState(e,t){let a=!1;for(let n of e){n=""+n;const r=this.getEdgeState(n);if(!Ge(r,t))continue;const o={...r,...t};this.edgeStates.set(n,o),this.dirtyEdges.add(n),this.updateHoveredEdgeTracking(n,r,o),a=!0}a&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}removeNode(e){this.nodeStates.delete(e),this.dirtyNodes.delete(e),this.clearHoveredFor("node",e)}removeEdge(e){this.edgeStates.delete(e),this.dirtyEdges.delete(e),this.clearHoveredFor("edge",e)}pruneNodes(e){for(const t of this.nodeStates.keys())e(t)||this.removeNode(t)}pruneEdges(e){for(const t of this.edgeStates.keys())e(t)||this.removeEdge(t)}clearNodes(){this.nodeStates.clear(),this.dirtyNodes.clear(),this.clearHoveredForKinds(zt("node"))}clearEdges(){this.edgeStates.clear(),this.dirtyEdges.clear(),this.clearHoveredForKinds(zt("edge"))}resetGraphState(){this.graphState=zi(this.customGraphStateDefaults),this.graphStateChanged=!1,this.graphStateFlagsDirty=!1}clearDirtyTracking(){this.dirtyNodes.clear(),this.dirtyEdges.clear(),this.graphStateChanged=!1}setHovered(e){this.hovered=e}clearHoveredFor(e,t){this.hovered&&this.hovered.key===t&&zt(e).includes(this.hovered.kind)&&(this.hovered=null)}clearHoveredForKinds(e){this.hovered&&e.includes(this.hovered.kind)&&(this.hovered=null)}updateGraphStateFromNodes(){let e=!1,t=!1,a=!1;for(const[,r]of this.nodeStates)if(r.isHovered&&(e=!0),r.isHighlighted&&(t=!0),r.isDragged&&(a=!0),e&&t&&a)break;!e&&this.hovered?.kind==="edge"&&(e=!0);const n=!this.graphState.isPanning&&!this.graphState.isZooming&&!a;(this.graphState.hasHovered!==e||this.graphState.hasHighlighted!==t||this.graphState.isDragging!==a||this.graphState.isIdle!==n)&&(this.graphStateChanged=!0),this.graphState={...this.graphState,hasHovered:e,hasHighlighted:t,isDragging:a,isIdle:n}}updateGraphStateFromEdges(){let e=this.hovered?.kind==="node";if(!e){for(const[,t]of this.edgeStates)if(t.isHovered){e=!0;break}}this.graphState.hasHovered!==e&&(this.graphStateChanged=!0),this.graphState={...this.graphState,hasHovered:e}}flushGraphStateFlags(){this.graphStateFlagsDirty&&(this.updateGraphStateFromNodes(),this.updateGraphStateFromEdges(),this.graphStateFlagsDirty=!1)}updateHoveredNodeTracking(e,t,a){if(t.isHovered!==a.isHovered)if(a.isHovered){if(this.hovered?.kind==="node"&&this.hovered.key!==e){const n=this.hovered.key,r=this.getNodeState(n);this.nodeStates.set(n,{...r,isHovered:!1}),this.dirtyNodes.add(n)}this.hovered={kind:"node",key:e}}else this.hovered?.kind==="node"&&this.hovered.key===e&&(this.hovered=null)}updateHoveredEdgeTracking(e,t,a){if(t.isHovered!==a.isHovered)if(a.isHovered){if(this.hovered?.kind==="edge"&&this.hovered.key!==e){const n=this.hovered.key,r=this.getEdgeState(n);this.edgeStates.set(n,{...r,isHovered:!1}),this.dirtyEdges.add(n)}this.hovered={kind:"edge",key:e}}else this.hovered?.kind==="edge"&&this.hovered.key===e&&(this.hovered=null)}}function Ps(i){return typeof i=="object"&&"uniforms"in i&&Array.isArray(i.uniforms)}function Fs(i){return typeof i=="object"&&"uniforms"in i&&"attributes"in i&&"glsl"in i}function Is(i){return typeof i=="object"&&"uniforms"in i&&"attributes"in i&&"segments"in i}function ks(i){return typeof i=="object"&&"uniforms"in i&&"attributes"in i&&"length"in i}function Gs(i){return typeof i=="object"&&"uniforms"in i&&"attributes"in i&&"glsl"in i}function Ns(i){return typeof i=="object"&&"glsl"in i&&"name"in i&&!("uniforms"in i)}function Ms(i){return typeof i=="object"&&"glsl"in i&&"name"in i&&!("uniforms"in i)}function zs(i){return typeof i=="object"&&"glsl"in i&&"name"in i&&!("uniforms"in i)}function $s(i){if(Ps(i))return i;if(Ns(i))return{name:i.name,glsl:i.glsl,inradiusFactor:i.inradiusFactor,uniforms:[]};throw new Error(`Invalid node shape specification: ${JSON.stringify(i)}`)}function Ws(i){if(Fs(i))return i;if(Po(i))return{name:i.name,glsl:i.glsl,uniforms:[],attributes:[]};throw new Error(`Invalid node layer specification: ${JSON.stringify(i)}`)}function Bs(i){if(Is(i))return i;if(Ms(i))return{name:i.name,glsl:i.glsl,segments:i.segments,uniforms:[],attributes:[]};throw new Error(`Invalid edge path specification: ${JSON.stringify(i)}`)}function Us(i){if(Gs(i))return i;if(Fo(i))return{name:i.name,glsl:i.glsl,uniforms:[],attributes:[]};throw new Error(`Invalid edge layer specification: ${JSON.stringify(i)}`)}function Os(i){if(ks(i))return i;if(zs(i))return{name:i.name,glsl:i.glsl,length:i.length,widthFactor:i.widthFactor,margin:0,uniforms:[],attributes:[]};throw new Error(`Invalid edge extremity specification: ${JSON.stringify(i)}`)}function Oa(i){const e=i?.shapes??Ht.shapes,t=i?.layers??Ht.layers,a=e.map($s),n=t.map(Ws);if(a.length===0)throw new Error("At least one node shape must be specified.");if(n.length===0)throw new Error("At least one node layer must be specified.");return{shapes:a,layers:n}}function Hs(i){const e=i?.paths??ft.paths,t=i?.extremities??ft.extremities,a=i?.layers??ft.layers,n=e.map(Bs),r=t.map(Os).filter(s=>s!==null),o=a.map(Us);if(n.length===0)throw new Error("At least one edge path must be specified.");if(o.length===0)throw new Error("At least one edge layer must be specified.");return{paths:n,extremities:r,layers:o}}function Ha(i,e){const t={};for(const a of i)a.variables&&Object.assign(t,a.variables);return Object.assign(t,e||{}),t}function Vs(i,e,t,a,n){const{shapes:r,layers:o}=Oa(a),s=Ha(r,a?.variables);return{...kr(i,e,t,{shapes:r,layers:o,label:a?.label,backdrop:a?.backdrop,labelAttachments:a?.labelAttachments},n),variables:s}}function Xs(i,e,t,a,n,r){const{paths:o,extremities:s,layers:l}=Hs(a),{shapes:h,layers:d}=Oa(r),u=Ha(o,a?.variables);return{...So(i,e,t,{paths:o,extremities:s,layers:l,defaultHead:a?.defaultHead,defaultTail:a?.defaultTail,label:a?.label},n,h,d),variables:u,paths:o}}const ta=1,ia=2,aa=3,na=4;class ad extends di{constructor(e,t,a={}){super(),this.nodeReducer=null,this.edgeReducer=null,this.stageCanvas=null,this.mouseLayer=null,this.gestureHint=null,this.extraElements={},this.webGLContext=null,this.pickingFrameBuffer=null,this.pickingTexture=null,this.pickingDepthBuffer=null,this.activeListeners={},this.nodeVariableEntries=[],this.edgeVariableEntries=[],this.edgePathsByName=new Map,this.nodeProgramIndex={},this.edgeProgramIndex={},this.edgeTextureIndexCache={},this.nodeGraphCoords={},this.nodeExtent={x:[0,1],y:[0,1]},this.matrix=Q(),this.invMatrix=Q(),this.correctionRatio=1,this.frameId=0,this.customBBox=null,this.gpuTimerExt=void 0,this.activeGpuTimerQuery=null,this.pendingGpuTimerQueries=[],this.normalizationFunction=Ot({x:[0,1],y:[0,1]}),this.graphToViewportRatio=1,this.pickingState=rs(),this.prevNodeVisibilities={},this.width=0,this.height=0,this.autoRescaleFrozen=!1,this.stylesDeclaration=null,this.resolvedStageStyle={},this.renderFrame=null,this.contextLost=!1,this.pendingProcess="full",this.needToRefreshState=!1,this.checkEdgesEventsFrame=null,this.edgeStyleAnalysis={dependency:"static",xAttribute:null,yAttribute:null},this.depthLayers=[...jt],this.customLayerPrograms=new Map,this.nodeShapeSlug=null,this.sdfAtlas=null,this.depthRanges={nodes:{},edges:{}},this.nodeBaseDepth={},this.edgeBaseDepth={};const{primitives:n,styles:r,settings:o={},nodeReducer:s,edgeReducer:l,customNodeState:h,customEdgeState:d,customGraphState:u}=a;this.stateManager=new Ls(()=>this.scheduleStateRefresh(),h,d,u);const c=n??qo;this.stylesDeclaration=r?{nodes:r.nodes??kt.nodes,edges:r.edges??kt.edges,stage:r.stage}:kt,this.nodeReducer=s??null,this.edgeReducer=l??null;const f=$i(this.stylesDeclaration.nodes);this.nodeReducer&&(f.dependency="graph-state"),this.edgeStyleAnalysis=$i(this.stylesDeclaration.edges),this.edgeReducer&&(this.edgeStyleAnalysis.dependency="graph-state"),this.stylesDeclaration.stage&&(this.resolvedStageStyle=Hi(this.stylesDeclaration.stage,this.stateManager.graphState));const g=Gn(o);if(Ft(g),g.enableNodeDrag){const{xAttribute:D,yAttribute:w}=f;if((!D||!w)&&!g.dragPositionToAttributes)throw new Error('Sigma: `enableNodeDrag` is true but position attribute names could not be inferred from styles. Either use attribute bindings for x/y in your node styles (e.g. `x: { attribute: "x" }`), or provide a `dragPositionToAttributes` setting.')}if(Ln(e),!(t instanceof HTMLElement))throw new Error("Sigma: container should be an html element.");this.container=t,this.edgeGroups=new ns(e,(D,w)=>{for(let A=0;A<D.length;A++){const F=this.stateManager.getEdgeState(D[A]);F.parallelIndex=A,F.parallelCount=w}});const b=new as(e,this.viewportToGraph.bind(this),this.setNodesState.bind(this),(D,w)=>this.emit(D,w));if(this.depthLayers=c.depthLayers??[...jt],!r?.nodes&&!Vt.every(D=>this.depthLayers.includes(D)))throw new Error(`Sigma: depthLayers must include ${Vt.join(", ")} for the built-in node styles.`);if(!r?.edges&&!Xt.every(D=>this.depthLayers.includes(D)))throw new Error(`Sigma: depthLayers must include ${Xt.join(", ")} for the built-in edge styles.`);this.itemBuckets={nodes:new Ni(this.depthLayers),edges:new Ni(this.depthLayers)},this.initWebGLContext(),this.mouseLayer=Ye("div",{position:"absolute",touchAction:"none",userSelect:"none"},{class:"sigma-mouse"}),this.container.appendChild(this.mouseLayer),this.resolvedStageStyle.background&&(this.container.style.backgroundColor=this.resolvedStageStyle.background),this.resolvedStageStyle.cursor&&(this.container.style.cursor=this.resolvedStageStyle.cursor);const p=new Do(this.webGLContext),m=new Mi(this.webGLContext,{channels:1}),y=new Lo(this.webGLContext),v=new Mi(this.webGLContext,{channels:4}),_=this.webGLContext,x=new Es({gl:_,getFrameBuffer:()=>this.pickingFrameBuffer,getPixelRatio:()=>this.internals.pixelRatio,getDownSizingRatio:()=>this.internals.settings.pickingDownSizingRatio,onIndex:(D,w)=>Ua(this.internals,this.pickingState.lookup[D]??null,w)}),T=this.initPrograms(c,g),S=c?.nodes?.labelAttachments;let E=null;S&&Object.keys(S).length>0&&(E=new ur(_,S,()=>this.scheduleRender())),this.internals={nodeDataCache:{},edgeDataCache:{},nodesWithForcedLabels:new Set,nodesWithBackdrop:new Set,edgesWithForcedLabels:new Set,settings:g,primitives:c,pixelRatio:Ut(),graph:e,stateManager:this.stateManager,dragManager:b,hoverResolver:x,nodeStyleAnalysis:f,pickingState:this.pickingState,...T,attachmentManager:E,nodeDataTexture:p,nodeFrameTexture:m,edgeDataTexture:y,edgeFrameTexture:v,getDimensions:()=>this.getDimensions(),getGraphDimensions:()=>this.getGraphDimensions(),getStagePadding:()=>this.getStagePadding(),getCameraState:()=>this.camera.getState(),getHitAtPosition:D=>this.getHitAtPosition(D),setNodeState:(D,w)=>this.setNodeState(D,w),setEdgeState:(D,w)=>this.setEdgeState(D,w),updateContainerCursor:()=>this.updateContainerCursor(),scheduleRefresh:()=>this.scheduleRefresh(),viewportToFramedGraph:D=>this.viewportToFramedGraph(D),viewportToGraph:D=>this.viewportToGraph(D),framedGraphToViewport:D=>this.framedGraphToViewport(D),scaleSize:D=>this.scaleSize(D),emit:(D,w)=>this.emit(D,w)},this.labelRenderer=new Cs(this.internals),this.resize(),this.initializeWebGLLabels(),this.camera=new yt,this.bindCameraHandlers(),this.mouseCaptor=new Jo(this.mouseLayer,this),this.mouseCaptor.setSettings(this.internals.settings),this.touchCaptor=new is(this.mouseLayer,this),this.touchCaptor.setSettings(this.internals.settings),this.bindEventHandlers(),this.bindGraphHandlers(),this.handleSettingsUpdate(),this.refresh()}initializeWebGLLabels(){this.sdfAtlas=new ye,this.sdfAtlas.registerFont({family:"sans-serif",weight:"normal",style:"normal"})}resetWebGLTexture(){const e=this.webGLContext;if(!this.pickingFrameBuffer)return this;const t=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),a=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);e.bindFramebuffer(e.FRAMEBUFFER,this.pickingFrameBuffer),this.pickingTexture&&e.deleteTexture(this.pickingTexture);const n=e.createTexture();n&&(e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,a,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),this.pickingTexture=n),this.pickingDepthBuffer&&e.deleteRenderbuffer(this.pickingDepthBuffer);const r=e.createRenderbuffer();return r&&(e.bindRenderbuffer(e.RENDERBUFFER,r),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,r),this.pickingDepthBuffer=r),e.bindFramebuffer(e.FRAMEBUFFER,null),this}bindCameraHandlers(){return this.activeListeners.camera=()=>{this.refreshMatrices(),this.labelRenderer.labelsDirty=!0,this.scheduleRender()},this.activeListeners.cameraAnimationStart=({from:e,to:t})=>{e.ratio!==t.ratio&&this.stateManager.setGraphState({isZooming:!0})},this.activeListeners.cameraAnimationEnd=()=>{this.stateManager.setGraphState({isZooming:!1})},this.camera.on("updated",this.activeListeners.camera),this.camera.on("animationStart",this.activeListeners.cameraAnimationStart),this.camera.on("animationEnd",this.activeListeners.cameraAnimationEnd),this}unbindCameraHandlers(){return this.camera.removeListener("updated",this.activeListeners.camera),this.camera.removeListener("animationStart",this.activeListeners.cameraAnimationStart),this.camera.removeListener("animationEnd",this.activeListeners.cameraAnimationEnd),this}getHitAtPosition(e){if(this.contextLost)return null;const t=this.webGLContext;t.bindFramebuffer(t.FRAMEBUFFER,this.pickingFrameBuffer);const a=vn(t,this.pickingFrameBuffer,e.x,e.y,this.internals.pixelRatio,this.internals.settings.pickingDownSizingRatio),n=fa(...a);return this.pickingState.lookup[n]??null}bindEventHandlers(){return cs(this.internals,this.mouseCaptor,this.touchCaptor,this.activeListeners),this}bindGraphHandlers(){return fs({graph:this.internals.graph,edgeGroups:this.edgeGroups,addNode:this.addNode.bind(this),updateNode:this.updateNode.bind(this),removeNode:this.removeNode.bind(this),addEdge:this.addEdge.bind(this),updateEdge:this.updateEdge.bind(this),removeEdge:this.removeEdge.bind(this),clearEdgeState:this.clearEdgeState.bind(this),clearNodeState:this.clearNodeState.bind(this),clearEdgeIndices:this.clearEdgeIndices.bind(this),clearNodeIndices:this.clearNodeIndices.bind(this),refresh:this.refresh.bind(this)},this.activeListeners),this}unbindGraphHandlers(){gs(this.internals.graph,this.activeListeners)}getNodeShapeId(e){return this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&e.shape&&e.shape in this.internals.nodeShapeMap?this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[e.shape]]:ct(e.shape||"circle")}processNodes(){const e=this.internals.graph,t=this.internals.settings,a=this.getDimensions(),{autoRescale:n,autoRescaleContent:r}=t;let o=this.nodeExtent;if(n===!1){const{width:g,height:b}=a;o={x:[-g/2,g/2],y:[-b/2,b/2]}}else(n!=="once"||!this.autoRescaleFrozen)&&(o=this.computeNodeExtent(),r!=="positions"&&!this.customBBox&&(o=xs({extent:o,coords:this.nodeGraphCoords,nodeData:this.internals.nodeDataCache,dimensions:a,stagePadding:this.getStagePadding(),zoomToSizeRatioFunction:t.zoomToSizeRatioFunction,itemSizesReference:t.itemSizesReference,fitLabels:r==="labels",nodeLabelBox:(g,b)=>this.labelRenderer.nodeLabelBox(g,b)})),n==="once"&&(this.autoRescaleFrozen=!0));this.nodeExtent=o,this.normalizationFunction=Ot(this.customBBox||this.nodeExtent);const s=new yt,l=pe(s.getState(),a,this.getGraphDimensions(),this.getStagePadding());this.labelRenderer.labelGrid.resizeAndClear(a,t.labelGridCellSize),this.labelRenderer.edgeAnchorGrid.resizeAndClear(a,t.labelGridCellSize);const h=t.renderEdgeLabels&&t.edgeLabelAnchors==="allNodes";let d=!1;Mt(this.pickingState,"node");const u=e.nodes();for(let g=0,b=u.length;g<b;g++){const p=u[g],m=this.internals.nodeDataCache[p],y=this.nodeGraphCoords[p];m.x=y.x,m.y=y.y,this.normalizationFunction.applyTo(m),m.visibility!==this.prevNodeVisibilities[p]&&(d=!0),typeof m.label=="string"&&m.visibility!=="hidden"&&m.labelVisibility!=="hidden"&&this.labelRenderer.labelGrid.add(p,m.size,this.framedGraphToViewport(m,{matrix:l})),h&&m.visibility!=="hidden"&&this.labelRenderer.edgeAnchorGrid.add(p,m.size,this.framedGraphToViewport(m,{matrix:l}))}this.labelRenderer.labelGrid.organize(),this.labelRenderer.edgeAnchorGrid.organize(),this.nodeProgram.reallocate(u.length);let c=0;this.depthRanges.nodes={},this.nodeBaseDepth={};const f=this.internals.nodeDataCache;for(const g of this.depthLayers){const b=this.itemBuckets.nodes.getSorted(g,p=>f[p].zIndex);if(b.length!==0){this.depthRanges.nodes[g]=[{offset:c,count:b.length}];for(const p of b)this.nodeBaseDepth[p]=g,this.nodeProgram.allocateNode(p),Ki(this.pickingState,"node",p),this.addNodeToProgram(p,c++)}}this.nodeProgram.invalidateBuffers();for(let g=0,b=u.length;g<b;g++)this.prevNodeVisibilities[u[g]]=this.internals.nodeDataCache[u[g]].visibility;this.labelRenderer.processWebGLLabels(u);for(const{program:g}of this.customLayerPrograms.values())g.cacheData&&g.cacheData();return d}processEdges(){const t=this.internals.graph.edges();this.edgeProgram.reallocate(t.length);let a=0;Mt(this.pickingState,"edge"),this.depthRanges.edges={},this.edgeBaseDepth={};const n=this.internals.edgeDataCache;for(const r of this.depthLayers){const o=this.itemBuckets.edges.getSorted(r,s=>n[s].zIndex);if(o.length!==0){this.depthRanges.edges[r]=[{offset:a,count:o.length}];for(const s of o)this.edgeBaseDepth[s]=r,Ki(this.pickingState,"edge",s),this.addEdgeToProgram(s,a++)}}this.edgeProgram.invalidateBuffers()}updateNodeDepthRanges(e,t,a){const n=this.nodeProgramIndex[e];n!==void 0&&(Ti(this.depthRanges.nodes,t,n),vi(this.depthRanges.nodes,a,n))}updateEdgeDepthRanges(e,t,a){const n=this.edgeProgramIndex[e];n!==void 0&&(Ti(this.depthRanges.edges,t,n),vi(this.depthRanges.edges,a,n))}handleSettingsUpdate(){const e=this.internals.settings;return this.camera.minRatio=e.minCameraRatio,this.camera.maxRatio=e.maxCameraRatio,this.camera.enabledZooming=e.enableCameraZooming,this.camera.enabledPanning=e.enableCameraPanning,this.camera.enabledRotation=e.enableCameraRotation,e.cameraPanBoundaries?this.camera.constrainState=t=>this.cleanCameraState(t,e.cameraPanBoundaries&&typeof e.cameraPanBoundaries=="object"?e.cameraPanBoundaries:{}):this.camera.constrainState=null,this.camera.setState(this.camera.getState()),this.mouseLayer.style.touchAction=e.gestureTarget==="graph"?"none":e.gestureTarget==="shared"?"pan-x pan-y":"auto",e.gestureTarget!=="shared"&&this.gestureHint&&(this.gestureHint.kill(),this.gestureHint=null),this.mouseCaptor.setSettings(this.internals.settings),this.touchCaptor.setSettings(this.internals.settings),this}cleanCameraState(e,{tolerance:t=0,boundaries:a}={}){const n={...e},{x:[r,o],y:[s,l]}=a||this.nodeExtent,h=[this.graphToViewport({x:r,y:s},{cameraState:e}),this.graphToViewport({x:o,y:s},{cameraState:e}),this.graphToViewport({x:r,y:l},{cameraState:e}),this.graphToViewport({x:o,y:l},{cameraState:e})];let d=1/0,u=-1/0,c=1/0,f=-1/0;h.forEach(({x:_,y:x})=>{d=Math.min(d,_),u=Math.max(u,_),c=Math.min(c,x),f=Math.max(f,x)});const g=u-d,b=f-c,{width:p,height:m}=this.getDimensions();let y=0,v=0;if(g>=p?u<p-t?y=u-(p-t):d>t&&(y=d-t):u>p+t?y=u-(p+t):d<-t&&(y=d+t),b>=m?f<m-t?v=f-(m-t):c>t&&(v=c-t):f>m+t?v=f-(m+t):c<-t&&(v=c+t),y||v){const _=this.viewportToFramedGraph({x:0,y:0},{cameraState:e}),x=this.viewportToFramedGraph({x:y,y:v},{cameraState:e});y=x.x-_.x,v=x.y-_.y,n.x+=y,n.y+=v}return n}refreshMatrices(){const e=this.camera.getState(),t=this.getDimensions(),a=this.getGraphDimensions(),n=this.getStagePadding();this.matrix=pe(e,t,a,n),this.invMatrix=pe(e,t,a,n,!0),this.correctionRatio=bn(this.matrix,e,t),this.graphToViewportRatio=this.getGraphToViewportRatio()}processData(){this.emit("beforeProcess"),this.internals.attachmentManager?.clear();const e={...this.pickingState.idsByKind},t=this.processNodes();(this.pendingProcess==="full"||t)&&this.processEdges(),os(this.pickingState,this.internals),ss(e,this.pickingState.idsByKind)||this.internals.hoverResolver.invalidate(),this.pendingProcess="none",this.emit("afterProcess")}render(){if(this.contextLost)return this;this.emit("beforeRender");const e=()=>(this.internals.hoverResolver.frameRendered(),this.emit("afterRender"),this);if(this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null),this.resize(),(this.pendingProcess!=="none"||this.needToRefreshState)&&(this.labelRenderer.labelsDirty=!0),this.pendingProcess!=="none"&&this.processData(),this.needToRefreshState&&this.refreshState(),this.needToRefreshState=!1,this.stateManager.clearDirtyTracking(),this.pendingProcess!=="none"&&this.processData(),this.clear(),this.resetWebGLTexture(),!this.internals.graph.order)return e();const t=this.mouseCaptor,a=this.camera.isAnimating()||t.isMoving||t.draggedEvents||t.currentWheelDirection;this.refreshMatrices(),this.frameId++;const n=this.internals.settings.DEBUG_logRenderStats?this.getDebugPrograms():null;n&&n.forEach(u=>u.resetDebugStats()),this.internals.settings.DEBUG_gpuTimerQueries&&this.beginGpuTimerQuery(),this.internals.nodeFrameTexture.ensureCapacity(this.internals.nodeDataTexture.getCapacity()),this.internals.edgeFrameTexture.ensureCapacity(this.internals.edgeDataTexture.getCapacity());const r=this.getRenderParams(),o=O.edge.writesPickingThisFrame(this.internals)?r:{...r,pickingFrameBuffer:null};this.labelRenderer.resetFrame();const s=this.webGLContext,l=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),h=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);if(s.bindFramebuffer(s.FRAMEBUFFER,this.pickingFrameBuffer),s.viewport(0,0,l,h),s.clear(s.COLOR_BUFFER_BIT|s.DEPTH_BUFFER_BIT),s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),s.clear(s.COLOR_BUFFER_BIT|s.DEPTH_BUFFER_BIT),this.internals.nodeDataTexture.upload(),this.internals.edgeDataTexture.upload(),this.nodeProgram.uploadLayerTexture(),this.edgeProgram.uploadAttributeTexture(),this.emit("afterTexturesUpload"),this.internals.nodeDataTexture.bind(aa),this.internals.edgeDataTexture.bind(na),this.edgeFramePass.run(r,this.internals.edgeFrameTexture,this.internals.edgeDataTexture.getHighWaterMark(),this.edgeProgram.getAttributeTexture(),this.nodeProgram.getAttributeTexture()),this.internals.edgeFrameTexture.bind(ta),this.internals.settings.renderLabels){this.labelRenderer.computeDisplayedNodeLabels();const{data:u,count:c}=this.labelRenderer.buildFramePassPoints();this.nodeFramePass.run(u,c,this.internals.nodeFrameTexture,r,this.nodeProgram.getAttributeTexture()),this.internals.nodeFrameTexture.bind(ia)}this.internals.settings.renderEdgeLabels&&this.labelRenderer.computeDisplayedEdgeLabels();for(const{program:u}of this.customLayerPrograms.values())u.preRender&&u.preRender(r);s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),s.blendFunc(s.ONE,s.ONE_MINUS_SRC_ALPHA);const d=!this.internals.settings.hideLabelsOnMove||!a;for(const u of this.depthLayers){for(const g of this.customLayerPrograms.values())g.depth===u&&g.program.render(r);const c=this.depthRanges.edges[u];if(c&&(!this.internals.settings.hideEdgesOnMove||!a))for(const{offset:g,count:b}of c)b>0&&this.edgeProgram.render(o,g,b);this.internals.settings.renderEdgeLabels&&d&&(this.labelRenderer.renderEdgeLabelBackgrounds(O.edgeLabel.writesPickingThisFrame(this.internals)?r:{...r,pickingFrameBuffer:null},u),this.labelRenderer.renderEdgeLabels(r,u)),this.labelRenderer.cacheAttachments(u),this.labelRenderer.renderBackdrops({...r,pickingFrameBuffer:null},u);const f=this.depthRanges.nodes[u];if(f)for(const{offset:g,count:b}of f)b>0&&this.nodeProgram.render(r,g,b);d&&(this.labelRenderer.renderAttachments({...r,pickingFrameBuffer:null},u),this.labelRenderer.renderLabelBackgrounds(O.nodeLabel.writesPickingThisFrame(this.internals)?r:{...r,pickingFrameBuffer:null},u),this.internals.settings.renderLabels&&this.labelRenderer.renderWebGLLabels(r,u))}return this.labelRenderer.labelsDirty=!1,this.internals.settings.DEBUG_displayPickingLayer&&(s.bindFramebuffer(s.READ_FRAMEBUFFER,this.pickingFrameBuffer),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.blitFramebuffer(0,0,l,h,0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio,s.COLOR_BUFFER_BIT,s.NEAREST)),this.internals.settings.DEBUG_gpuTimerQueries&&this.endGpuTimerQuery(),this.pollGpuTimerQueries(),n&&this.logRenderStats(n),e()}getDebugPrograms(){return[this.nodeProgram,this.edgeProgram,this.internals.labelProgram,this.internals.edgeLabelProgram,this.internals.edgeLabelBackgroundProgram,this.internals.backdropProgram,this.internals.labelBackgroundProgram,this.internals.attachmentProgram].filter(e=>e!==null)}logRenderStats(e){const t={};for(const a of e)t[a.constructor.name]={...a.debugStats};console.log(`[sigma] DEBUG_logRenderStats: frame #${this.frameId}`),console.table(t)}getGpuTimerExtension(){return this.gpuTimerExt===void 0&&(this.gpuTimerExt=this.webGLContext.getExtension("EXT_disjoint_timer_query_webgl2"),this.gpuTimerExt||console.warn("Sigma: DEBUG_gpuTimerQueries is enabled, but this browser/driver doesn't support EXT_disjoint_timer_query_webgl2.")),this.gpuTimerExt}beginGpuTimerQuery(){const e=this.getGpuTimerExtension();if(!e)return;const t=this.webGLContext,a=t.createQuery();a&&(t.beginQuery(e.TIME_ELAPSED_EXT,a),this.activeGpuTimerQuery=a)}endGpuTimerQuery(){!this.gpuTimerExt||!this.activeGpuTimerQuery||(this.webGLContext.endQuery(this.gpuTimerExt.TIME_ELAPSED_EXT),this.pendingGpuTimerQueries.push({query:this.activeGpuTimerQuery,frameId:this.frameId}),this.activeGpuTimerQuery=null)}pollGpuTimerQueries(){if(this.pendingGpuTimerQueries.length===0)return;const e=this.webGLContext,t=this.gpuTimerExt;if(!t){this.pendingGpuTimerQueries.forEach(({query:r})=>e.deleteQuery(r)),this.pendingGpuTimerQueries=[];return}const a=e.getParameter(t.GPU_DISJOINT_EXT),n=[];for(const r of this.pendingGpuTimerQueries){if(!e.getQueryParameter(r.query,e.QUERY_RESULT_AVAILABLE)){n.push(r);continue}if(!a){const o=e.getQueryParameter(r.query,e.QUERY_RESULT);console.log(`[sigma] DEBUG_gpuTimerQueries: frame #${r.frameId} GPU time = ${(o/1e6).toFixed(2)}ms`)}e.deleteQuery(r.query)}this.pendingGpuTimerQueries=n}postEvaluateNode(e,t,a){const n=e;n.x===void 0&&(n.x=t.x),n.y===void 0&&(n.y=t.y),e.highlighted=a.isHighlighted;for(let r=0,o=this.nodeVariableEntries.length;r<o;r++){const[s,l]=this.nodeVariableEntries[r];n[s]=n[s]??t[s]??l.default}}addNode(e){const t=this.internals.graph.getNodeAttributes(e),a=this.stateManager.getNodeState(e);let n=this.internals.nodeDataCache[e]||{};if(Ui(this.stylesDeclaration.nodes,t,a,this.stateManager.graphState,this.internals.graph,n),this.postEvaluateNode(n,t,a),this.nodeReducer){const r=this.nodeReducer(e,n,t,a,this.stateManager.graphState,this.internals.graph);n={...n,...r}}if(typeof n.x!="number"||typeof n.y!="number")throw new Error(`Sigma: could not find a valid position (x, y) for node "${e}". Provide coordinates via node attributes, styles, or a nodeReducer.`);this.internals.nodeShapeMap?(!n.shape||!(n.shape in this.internals.nodeShapeMap))&&(n.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(n.shape=this.nodeShapeSlug),this.internals.nodeDataCache[e]=n,this.nodeGraphCoords[e]={x:n.x,y:n.y},ve(this.internals.nodesWithForcedLabels,e,me(n)),ve(this.internals.nodesWithBackdrop,e,_i(n)),this.itemBuckets.nodes.set(e,n.depth)}updateNode(e){this.addNode(e);const t=this.internals.nodeDataCache[e];this.normalizationFunction.applyTo(t)}removeNode(e){this.itemBuckets.nodes.remove(e),delete this.internals.nodeDataCache[e],delete this.nodeGraphCoords[e],delete this.nodeProgramIndex[e],this.internals.dragManager.removeNode(e),this.stateManager.removeNode(e),this.internals.nodesWithForcedLabels.delete(e),this.internals.nodesWithBackdrop.delete(e)}postEvaluateEdge(e,t){const a=e;for(let n=0,r=this.edgeVariableEntries.length;n<r;n++){const[o,s]=this.edgeVariableEntries[n];a[o]=a[o]??t[o]??s.default}}applyEdgeSpread(e,t,a){if(a.parallelCount<=1)return;const n=this.internals.graph.source(e),r=this.internals.graph.target(e),o=n===r,s=o?t.selfLoopPath||t.path:t.parallelPath||t.path,l=s?this.edgePathsByName.get(s):void 0;if(!l?.spread)return;const h=t.parallelSpread??.25;let d=l.spread.compute(a.parallelIndex,a.parallelCount,h);!o&&this.internals.graph.isDirected(e)&&n>r&&(d=-d),t[l.spread.variable]=d}addEdge(e){const t=this.internals.graph.getEdgeAttributes(e),a=this.stateManager.getEdgeState(e);let n={};if(Oi(this.stylesDeclaration.edges,t,a,this.stateManager.graphState,this.internals.graph,n),this.postEvaluateEdge(n,t),this.edgeReducer){const r=this.edgeReducer(e,n,t,a,this.stateManager.graphState,this.internals.graph);n={...n,...r}}this.applyEdgeSpread(e,n,a),this.internals.edgeDataCache[e]=n,ve(this.internals.edgesWithForcedLabels,e,me(n)),this.itemBuckets.edges.set(e,n.depth)}updateEdge(e){this.addEdge(e)}removeEdge(e){this.itemBuckets.edges.remove(e),delete this.internals.edgeDataCache[e],delete this.edgeProgramIndex[e],delete this.edgeTextureIndexCache[e],this.internals.edgeDataTexture.free(e),this.stateManager.removeEdge(e),this.internals.edgesWithForcedLabels.delete(e)}clearNodeIndices(){this.labelRenderer.resetLabelGrid(),this.autoRescaleFrozen||(this.nodeExtent={x:[0,1],y:[0,1]}),this.internals.nodeDataCache={},this.nodeGraphCoords={},this.edgeProgramIndex={},this.internals.nodesWithForcedLabels.clear(),this.internals.nodesWithBackdrop.clear(),this.prevNodeVisibilities={},this.itemBuckets.nodes.clearAll(),this.depthRanges.nodes={},this.nodeBaseDepth={}}clearEdgeIndices(){this.internals.edgeDataCache={},this.edgeProgramIndex={},this.edgeTextureIndexCache={},this.internals.edgesWithForcedLabels.clear(),Mt(this.pickingState,"edge"),this.itemBuckets.edges.clearAll(),this.depthRanges.edges={},this.edgeBaseDepth={},this.edgeGroups.clear()}clearIndices(){this.clearEdgeIndices(),this.clearNodeIndices()}clearNodeState(){this.labelRenderer.resetFrame(),this.internals.nodesWithBackdrop.clear(),this.internals.dragManager.clear(),this.autoRescaleFrozen=!1,this.stateManager.clearNodes()}clearEdgeState(){this.labelRenderer.clearEdgeLabels(),this.stateManager.clearEdges()}clearState(){this.clearEdgeState(),this.clearNodeState(),this.stateManager.resetGraphState()}addNodeToProgram(e,t){const a=this.internals.nodeDataCache[e];this.internals.nodeDataTexture.allocate(e),this.internals.nodeDataTexture.updateNode(e,a.x,a.y,a.size,this.getNodeShapeId(a),...Ct(a),a.color);const n=this.internals.nodeDataTexture.getIndex(e);this.nodeProgram.process(be(this.pickingState,"node",e),t,a,n,e),this.nodeProgramIndex[e]=t}addEdgeToProgram(e,t){const a=this.internals.edgeDataCache[e],n=this.internals.graph.source(e),r=this.internals.graph.target(e),o=this.internals.edgeDataTexture.allocate(e);this.edgeTextureIndexCache[e]=o;const s=n===r,l=!s&&(this.stateManager.getEdgeState(e)?.parallelCount??1)>1,{pathId:h,headId:d,tailId:u,headLengthRatio:c,tailLengthRatio:f}=this.edgeProgram.resolveEdgeIds(a,s,l);this.internals.edgeDataTexture.updateEdge(e,this.internals.nodeDataTexture.getIndex(n),this.internals.nodeDataTexture.getIndex(r),a.size,c,f,h,d,u),this.edgeProgram.process(be(this.pickingState,"edge",e),t,this.internals.nodeDataCache[n],this.internals.nodeDataCache[r],a,o),this.edgeProgramIndex[e]=t}getRenderParams(){return{frameId:this.frameId,matrix:this.matrix,invMatrix:this.invMatrix,width:this.width,height:this.height,pixelRatio:this.internals.pixelRatio,zoomRatio:this.camera.ratio,cameraAngle:this.camera.angle,sizeRatio:1/this.scaleSize(),correctionRatio:this.correctionRatio,downSizingRatio:this.internals.settings.pickingDownSizingRatio,minEdgeThickness:this.internals.settings.minEdgeThickness,antiAliasingFeather:this.internals.settings.antiAliasingFeather,nodePickingPadding:this.internals.settings.nodePickingPadding,edgePickingPadding:this.internals.settings.edgePickingPadding,labelPickingPadding:this.internals.settings.labelPickingPadding,nodeDataTextureUnit:aa,nodeDataTextureWidth:this.internals.nodeDataTexture.getTextureWidth(),nodeFrameTextureUnit:ia,nodeFrameTextureWidth:this.internals.nodeFrameTexture.getTextureWidth(),edgeDataTextureUnit:na,edgeDataTextureWidth:this.internals.edgeDataTexture.getTextureWidth(),edgeFrameTextureUnit:ta,edgeFrameTextureWidth:this.internals.edgeFrameTexture.getTextureWidth(),pickingFrameBuffer:this.pickingFrameBuffer,labelPixelSnapping:this.internals.settings.labelPixelSnapping?1:0}}getStagePadding(){const{stagePadding:e,autoRescale:t}=this.internals.settings;return t&&e||0}getLayerElement(e){if(e==="mouse")return this.mouseLayer;const t=this.extraElements[e];if(!t)throw new Error(`Sigma: layer "${e}" does not exist`);return t}initWebGLContext(){const e=this.createWebGLContext("stage");this.stageCanvas=this.extraElements.stage,this.webGLContext=e,this.stageCanvas.addEventListener("webglcontextlost",t=>{this.webGLContext&&(t.preventDefault(),this.contextLost=!0,this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null),this.gpuTimerExt=void 0,this.activeGpuTimerQuery=null,this.pendingGpuTimerQueries=[],this.emit("webglContextLost"))}),this.stageCanvas.addEventListener("webglcontextrestored",()=>{requestAnimationFrame(()=>{this.webGLContext&&!this.webGLContext.isContextLost()&&this.restoreWebGLContext()})}),this.initPickingFramebuffer()}initPickingFramebuffer(){const e=this.webGLContext,t=e.createFramebuffer();if(!t)throw new Error("Sigma: cannot create picking frame buffer");e.bindFramebuffer(e.FRAMEBUFFER,t);const a=e.createTexture();if(!a)throw new Error("Sigma: cannot create picking texture");e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0);const n=e.createRenderbuffer();if(!n)throw new Error("Sigma: cannot create picking depth buffer");if(e.bindRenderbuffer(e.RENDERBUFFER,n),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,1,1),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,n),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("Sigma: picking framebuffer is not complete");e.bindFramebuffer(e.FRAMEBUFFER,null),this.pickingFrameBuffer=t,this.pickingTexture=a,this.pickingDepthBuffer=n}initPrograms(e,t){const a=this,n=this.webGLContext,{nodeProgram:r,labelProgram:o,backdropProgram:s,labelBackgroundProgram:l,attachmentProgram:h,framePass:d,shapeSlug:u,shapeNameToIndex:c,shapeGlobalIds:f,variables:g}=Vs(n,this.pickingFrameBuffer,a,e?.nodes,t.antialiasNodes);this.nodeProgram=r,this.nodeFramePass=d,this.nodeVariableEntries=Object.entries(g),u&&(this.nodeShapeSlug=u);const{edgeProgram:b,labelProgram:p,labelBackgroundProgram:m,framePass:y,variables:v,paths:_}=Xs(n,this.pickingFrameBuffer,a,e?.edges,t.antialiasEdges,e?.nodes);return this.edgeProgram=b,this.edgeFramePass=y,this.edgeVariableEntries=Object.entries(v),this.edgePathsByName=new Map(_.map(x=>[x.name,x])),{labelProgram:o,edgeLabelProgram:p,edgeLabelBackgroundProgram:m,backdropProgram:s,labelBackgroundProgram:l,attachmentProgram:h,nodeShapeMap:c??null,nodeGlobalShapeIds:f??null}}restoreWebGLContext(){const e=this.internals;this.initPickingFramebuffer(),e.nodeDataTexture?.restore(),e.nodeFrameTexture?.restore(),e.edgeDataTexture?.restore(),e.edgeFrameTexture?.restore(),e.attachmentManager?.restore(),e.hoverResolver.reset(),Object.assign(e,this.initPrograms(e.primitives,e.settings));for(const t of this.customLayerPrograms.values())t.program.kill(),t.program=t.factory(this.webGLContext);this.contextLost=!1,this.emit("webglContextRestored"),this.refresh()}createLayer(e,t,a={}){if(this.extraElements[e])throw new Error(`Sigma: a layer named "${e}" already exists`);const n=Ye(t,{position:"absolute"},{class:`sigma-${e}`});return a.style&&Object.assign(n.style,a.style),this.extraElements[e]=n,"beforeLayer"in a&&a.beforeLayer?this.getLayerElement(a.beforeLayer).before(n):"afterLayer"in a&&a.afterLayer?this.getLayerElement(a.afterLayer).after(n):this.container.appendChild(n),n}createCanvas(e,t={}){return this.createLayer(e,"canvas",t)}createWebGLContext(e,t={}){const a=this.createCanvas(e,t);t.hidden&&a.remove();const n=a.getContext("webgl2",{preserveDrawingBuffer:!1,antialias:!1,depth:!0,...t});if(!n)throw new Error("Sigma: WebGL 2 is not supported by your browser. Please use a modern browser (Chrome 56+, Firefox 51+, Safari 15+, Edge 79+).");return n.blendFunc(n.ONE,n.ONE_MINUS_SRC_ALPHA),n}killLayer(e){if(e==="stage"||e==="mouse")throw new Error(`Sigma: cannot kill built-in layer "${e}"`);const t=this.extraElements[e];if(!t)throw new Error(`Sigma: cannot kill layer ${e}, which does not exist`);return t.remove(),delete this.extraElements[e],this}getWebGLContext(){if(!this.webGLContext)throw new Error("Sigma: WebGL context is not available");return this.webGLContext}getNodeDataTexture(){if(!this.internals.nodeDataTexture)throw new Error("Sigma: node data texture is not available");return this.internals.nodeDataTexture}getNormalizationFunction(){return this.normalizationFunction}addCustomLayerProgram(e,t,a){if(!this.depthLayers.includes(t))throw new Error(`Sigma: cannot add custom layer program at depth "${t}", it must be declared in primitives.depthLayers. Current layers: ${this.depthLayers.join(", ")}`);return this.customLayerPrograms.get(e)?.program.kill(),this.customLayerPrograms.set(e,{depth:t,factory:a,program:a(this.webGLContext)}),this.refresh(),this}removeCustomLayerProgram(e){const t=this.customLayerPrograms.get(e);return t&&(t.program.kill(),this.customLayerPrograms.delete(e),this.scheduleRender()),this}getCamera(){return this.camera}setCamera(e){return this.camera.cancelAnimation(),this.unbindCameraHandlers(),this.camera=e,this.bindCameraHandlers(),this.scheduleRender(),this}getContainer(){return this.container}getGraph(){return this.internals.graph}setGraph(e){return e===this.internals.graph?this:(this.stateManager.pruneNodes(t=>e.hasNode(t)),this.stateManager.pruneEdges(t=>e.hasEdge(t)),this.unbindGraphHandlers(),this.checkEdgesEventsFrame!==null&&(cancelAnimationFrame(this.checkEdgesEventsFrame),this.checkEdgesEventsFrame=null),this.internals.graph=e,this.autoRescaleFrozen=!1,this.bindGraphHandlers(),this.refresh(),this)}getMouseCaptor(){return this.mouseCaptor}getTouchCaptor(){return this.touchCaptor}getDimensions(){return{width:this.width,height:this.height}}getGraphDimensions(){const e=this.customBBox||this.nodeExtent;return{width:e.x[1]-e.x[0]||1,height:e.y[1]-e.y[0]||1}}getNodeDisplayData(e){const t=this.internals.nodeDataCache[e];return t?Object.assign({},t):void 0}getEdgeDisplayData(e){const t=this.internals.edgeDataCache[e];return t?Object.assign({},t):void 0}getNodeState(e){return this.stateManager.getNodeState(e)}getEdgeState(e){return this.stateManager.getEdgeState(e)}getGraphState(){return this.stateManager.getGraphState()}setNodeState(e,t){return this.stateManager.setNodeState(e,t),this}setEdgeState(e,t){return this.stateManager.setEdgeState(e,t),this}setGraphState(e){return this.stateManager.setGraphState(e),this}_setPanning(e){this.stateManager.setGraphState({isPanning:e})}_setZooming(e){this.stateManager.setGraphState({isZooming:e})}_hasNodeDrag(){const{dragManager:e}=this.internals;return!!(e.pendingNode||e.session)}_showGestureHint(e){const t=this.internals.settings;t.gestureTarget==="shared"&&(this.gestureHint=this.gestureHint||new Ss(this.container),this.gestureHint.show(e,t))}setNodesState(e,t){return this.stateManager.setNodesState(e,t),this}setEdgesState(e,t){return this.stateManager.setEdgesState(e,t),this}updateContainerCursor(){const e=this.stateManager.hovered,t=this.resolvedStageStyle.cursor||"";this.container.style.cursor=e&&ls(this.internals,e)||t}refreshStageStyle(){this.resolvedStageStyle=Hi(this.stylesDeclaration.stage,this.stateManager.graphState),this.resolvedStageStyle.background!==void 0&&(this.container.style.backgroundColor=this.resolvedStageStyle.background),this.updateContainerCursor()}getNodeDisplayedLabels(){return new Set(this.labelRenderer.displayedNodeLabels)}getEdgeDisplayedLabels(){return new Set(this.labelRenderer.displayedEdgeLabels)}getSettings(){return{...this.internals.settings}}getSetting(e){return this.internals.settings[e]}getStyles(){return{...this.stylesDeclaration}}getPrimitives(){return{...this.internals.primitives}}setSetting(e,t){return this.internals.settings[e]=t,Ft(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}updateSetting(e,t){return this.setSetting(e,t(this.internals.settings[e])),this}setSettings(e){return this.internals.settings={...this.internals.settings,...e},Ft(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}resize(e){const t=this.width,a=this.height;if(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.internals.pixelRatio=Ut(),this.width===0)if(this.internals.settings.allowInvalidContainer)this.width=1;else throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");if(this.height===0)if(this.internals.settings.allowInvalidContainer)this.height=1;else throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");if(!e&&t===this.width&&a===this.height)return this;this.labelRenderer.labelsDirty=!0;for(const n of[this.mouseLayer,...Object.values(this.extraElements)])n.style.width=this.width+"px",n.style.height=this.height+"px";return this.webGLContext&&(this.stageCanvas.setAttribute("width",this.width*this.internals.pixelRatio+"px"),this.stageCanvas.setAttribute("height",this.height*this.internals.pixelRatio+"px"),this.webGLContext.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio)),this.emit("resize"),this}clear(){return this.emit("beforeClear"),this.webGLContext.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER,null),this.webGLContext.clear(WebGLRenderingContext.COLOR_BUFFER_BIT),this.emit("afterClear"),this}scheduleStateRefresh(){this.needToRefreshState=!0,this.scheduleRender()}refreshState(){this.stateManager.flushGraphStateFlags();const e=this.stateManager.graphStateChanged&&this.internals.nodeStyleAnalysis.dependency==="graph-state",t=this.stateManager.graphStateChanged&&this.edgeStyleAnalysis.dependency==="graph-state";let a=!1;if(e)this.internals.graph.forEachNode(n=>{this.refreshNodeState(n)&&(a=!0)});else if(this.internals.nodeStyleAnalysis.dependency!=="static")for(const n of this.stateManager.dirtyNodes)this.refreshNodeState(n)&&(a=!0);if(t)this.internals.graph.forEachEdge(n=>{this.refreshEdgeState(n)&&(a=!0)});else if(this.edgeStyleAnalysis.dependency!=="static")for(const n of this.stateManager.dirtyEdges)this.refreshEdgeState(n)&&(a=!0);this.stateManager.graphStateChanged&&this.stylesDeclaration?.stage&&this.refreshStageStyle(),this.stateManager.clearDirtyTracking(),a&&(this.pendingProcess="full")}refreshNodeState(e){const t=this.internals.nodeDataCache[e];if(!t||this.nodeReducer){const p=this.internals.nodeDataCache[e]?.depth,m=this.internals.nodeDataCache[e]?.zIndex,y=this.internals.nodeDataCache[e]?.labelAttachment;this.updateNode(e);const v=this.internals.nodeDataCache[e];this.internals.attachmentManager&&v.labelAttachment!==y&&this.internals.attachmentManager.invalidateNode(e);let _;this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&v.shape&&v.shape in this.internals.nodeShapeMap?_=this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[v.shape]]:_=ct(v.shape||"circle"),this.internals.nodeDataTexture.updateNode(e,v.x,v.y,v.size,_,...Ct(v),v.color),p&&v.depth!==p&&this.updateNodeDepthRanges(e,p,v.depth);const x=this.nodeProgramIndex[e];return x!==void 0&&(this.addNodeToProgram(e,x),this.nodeProgram.invalidateBuffers()),m!==void 0&&v.zIndex!==m}const a=this.internals.graph.getNodeAttributes(e),n=this.stateManager.getNodeState(e),r=t.size,o=t.shape,s=t.depth,l=t.zIndex,h=t.labelAttachment,d=t.rotationAlignment,u=t.labelRotationAlignment,c=t.color;Ui(this.stylesDeclaration.nodes,a,n,this.stateManager.graphState,this.internals.graph,t),this.postEvaluateNode(t,a,n);const f=this.nodeGraphCoords[e],g=t.x!==f.x||t.y!==f.y;if(g&&(f.x=t.x,f.y=t.y),this.normalizationFunction.applyTo(t),this.internals.nodeShapeMap?(!t.shape||!(t.shape in this.internals.nodeShapeMap))&&(t.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(t.shape=this.nodeShapeSlug),this.internals.attachmentManager&&t.labelAttachment!==h&&this.internals.attachmentManager.invalidateNode(e),ve(this.internals.nodesWithForcedLabels,e,me(t)),ve(this.internals.nodesWithBackdrop,e,_i(t)),g||t.size!==r||t.shape!==o||t.rotationAlignment!==d||t.labelRotationAlignment!==u||t.color!==c){let p;this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&t.shape&&t.shape in this.internals.nodeShapeMap?p=this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[t.shape]]:p=ct(t.shape||"circle"),this.internals.nodeDataTexture.updateNode(e,t.x,t.y,t.size,p,...Ct(t),t.color)}this.itemBuckets.nodes.set(e,t.depth),t.depth!==s&&this.updateNodeDepthRanges(e,s,t.depth);const b=this.nodeProgramIndex[e];return b!==void 0&&(this.addNodeToProgram(e,b),this.nodeProgram.invalidateBuffers()),t.zIndex!==l}refreshEdgeState(e){const t=this.internals.edgeDataCache[e];if(!t||this.edgeReducer){const g=t?.depth,b=t?.zIndex;this.updateEdge(e);const p=this.internals.edgeDataCache[e];g&&p.depth!==g&&this.updateEdgeDepthRanges(e,g,p.depth);const m=this.edgeProgramIndex[e];return m!==void 0&&(this.addEdgeToProgram(e,m),this.edgeProgram.invalidateBuffers()),b!==void 0&&p.zIndex!==b}const a=this.internals.graph.getEdgeAttributes(e),n=this.stateManager.getEdgeState(e),r=t.depth,o=t.zIndex,s=t.size,l=t.path,h=t.selfLoopPath,d=t.parallelPath,u=t.head,c=t.tail;Oi(this.stylesDeclaration.edges,a,n,this.stateManager.graphState,this.internals.graph,t),this.postEvaluateEdge(t,a),this.applyEdgeSpread(e,t,n),ve(this.internals.edgesWithForcedLabels,e,me(t)),this.itemBuckets.edges.set(e,t.depth),t.depth!==r&&this.updateEdgeDepthRanges(e,r,t.depth);const f=this.edgeProgramIndex[e];if(f!==void 0)if(t.size!==s||t.path!==l||t.selfLoopPath!==h||t.parallelPath!==d||t.head!==u||t.tail!==c)this.addEdgeToProgram(e,f),this.edgeProgram.invalidateBuffers();else{const b=this.internals.graph.source(e),p=this.internals.graph.target(e),m=this.internals.nodeDataCache[b],y=this.internals.nodeDataCache[p],v=this.edgeTextureIndexCache[e];this.edgeProgram.process(be(this.pickingState,"edge",e),f,m,y,t,v),this.edgeProgram.invalidateBuffers()}return t.zIndex!==o}refresh(e){const t=e?.skipIndexation!==void 0?e?.skipIndexation:!1,a=e?.schedule!==void 0?e.schedule:!1;if(!e||!e.partialGraph)this.clearEdgeIndices(),this.clearNodeIndices(),this.internals.graph.forEachNode(r=>this.addNode(r)),this.edgeGroups.rebuild(),this.internals.graph.forEachEdge(r=>this.addEdge(r)),this.pendingProcess="full";else{const r=e.partialGraph?.nodes||[];for(let s=0,l=r?.length||0;s<l;s++){const h=""+r[s],d=this.internals.nodeDataCache[h]?.labelAttachment;if(this.updateNode(h),this.internals.attachmentManager&&(this.internals.nodeDataCache[h]?.labelAttachment||d)&&this.internals.attachmentManager.invalidateNode(h),t){const u=this.nodeProgramIndex[h];if(u===void 0)throw new Error(`Sigma: node "${h}" can't be repaint`);this.addNodeToProgram(h,u)}}t&&r.length>0&&(this.nodeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0);const o=e?.partialGraph?.edges||[];for(let s=0,l=o.length;s<l;s++){const h=""+o[s];if(this.updateEdge(h),t){const d=this.edgeProgramIndex[h];if(d===void 0)throw new Error(`Sigma: edge "${h}" can't be repaint`);this.addEdgeToProgram(h,d)}}t&&o.length>0&&(this.edgeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0),!t&&this.pendingProcess!=="full"&&(this.pendingProcess=o.length>0?"full":"nodes")}return a?this.scheduleRender():this.render(),this}scheduleRender(){return this.renderFrame||(this.renderFrame=requestAnimationFrame(()=>{this.render()})),this}scheduleRefresh(e){return this.refresh({...e,schedule:!0})}getViewportZoomedState(e,t){const{ratio:a,angle:n,x:r,y:o}=this.camera.getState(),{minCameraRatio:s,maxCameraRatio:l}=this.internals.settings;typeof l=="number"&&(t=Math.min(t,l)),typeof s=="number"&&(t=Math.max(t,s));const h=t/a,d={x:this.width/2,y:this.height/2},u=this.viewportToFramedGraph(e),c=this.viewportToFramedGraph(d);return{angle:n,x:(u.x-c.x)*(1-h)+r,y:(u.y-c.y)*(1-h)+o,ratio:t}}viewRectangle(){const e=this.viewportToFramedGraph({x:0,y:0}),t=this.viewportToFramedGraph({x:this.width,y:0}),a=this.viewportToFramedGraph({x:0,y:this.height});return{x1:e.x,y1:e.y,x2:t.x,y2:t.y,height:t.y-a.y}}framedGraphToViewport(e,t={}){const a=!!t.cameraState||!!t.viewportDimensions||!!t.graphDimensions||!!t.padding,n=t.matrix||(a?pe(t.cameraState||this.camera.getState(),t.viewportDimensions||this.getDimensions(),t.graphDimensions||this.getGraphDimensions(),t.padding||this.getStagePadding()):this.matrix),r=Ke(n,e);return{x:(1+r.x)*this.width/2,y:(1-r.y)*this.height/2}}viewportToFramedGraph(e,t={}){const a=!!t.cameraState||!!t.viewportDimensions||!!t.graphDimensions||!!t.padding,n=t.matrix||(a?pe(t.cameraState||this.camera.getState(),t.viewportDimensions||this.getDimensions(),t.graphDimensions||this.getGraphDimensions(),t.padding||this.getStagePadding(),!0):this.invMatrix),r=Ke(n,{x:e.x/this.width*2-1,y:1-e.y/this.height*2});return isNaN(r.x)&&(r.x=0),isNaN(r.y)&&(r.y=0),r}viewportToGraph(e,t={}){return this.normalizationFunction.inverse(this.viewportToFramedGraph(e,t))}graphToViewport(e,t={}){return this.framedGraphToViewport(this.normalizationFunction(e),t)}graphToFramedGraph(e){return this.normalizationFunction(e)}framedGraphToGraph(e){return this.normalizationFunction.inverse(e)}getGraphToViewportRatio(){const e={x:0,y:0},t={x:1,y:1},a=Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2)),n=this.graphToViewport(e),r=this.graphToViewport(t);return Math.sqrt(Math.pow(n.x-r.x,2)+Math.pow(n.y-r.y,2))/a}computeNodeExtent(){const e=this.nodeGraphCoords,t=Object.keys(e);if(!t.length)return{x:[0,1],y:[0,1]};let a=1/0,n=-1/0,r=1/0,o=-1/0;for(let s=0,l=t.length;s<l;s++){const{x:h,y:d}=e[t[s]];h<a&&(a=h),h>n&&(n=h),d<r&&(r=d),d>o&&(o=d)}return{x:[a,n],y:[r,o]}}getBBox(){return this.nodeExtent}getCustomBBox(){return this.customBBox}setCustomBBox(e){return this.customBBox=e,this.scheduleRender(),this}kill(){this.emit("kill"),this.removeAllListeners(),this.camera.cancelAnimation(),this.unbindCameraHandlers(),window.removeEventListener("resize",this.activeListeners.handleResize),this.mouseCaptor.kill(),this.touchCaptor.kill(),this.internals.hoverResolver.kill(),this.unbindGraphHandlers(),this.clearIndices(),this.clearState(),this.internals.nodeDataCache={},this.internals.edgeDataCache={},this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null);const e=this.container;for(;e.firstChild;)e.removeChild(e.firstChild);this.nodeProgram.kill(),this.nodeFramePass.kill(),this.edgeProgram.kill(),this.edgeFramePass.kill(),this.internals.labelProgram.kill(),this.internals.edgeLabelProgram.kill(),this.internals.edgeLabelBackgroundProgram.kill(),this.internals.backdropProgram.kill(),this.internals.labelBackgroundProgram.kill(),this.internals.attachmentProgram?.kill(),this.internals.attachmentManager?.kill(),this.internals.attachmentProgram=null,this.internals.attachmentManager=null;for(const{program:t}of this.customLayerPrograms.values())t.kill();this.customLayerPrograms.clear(),this.sdfAtlas&&(this.sdfAtlas=null),this.internals.nodeDataTexture&&(this.internals.nodeDataTexture.kill(),this.internals.nodeDataTexture=null),this.internals.nodeFrameTexture&&(this.internals.nodeFrameTexture.kill(),this.internals.nodeFrameTexture=null),this.internals.edgeDataTexture&&(this.internals.edgeDataTexture.kill(),this.internals.edgeDataTexture=null),this.internals.edgeFrameTexture&&(this.internals.edgeFrameTexture.kill(),this.internals.edgeFrameTexture=null),this.webGLContext&&(this.webGLContext.getExtension("WEBGL_lose_context")?.loseContext(),this.webGLContext=null),this.gestureHint?.kill(),this.gestureHint=null,this.mouseLayer.remove();for(const t in this.extraElements)this.extraElements[t].remove();this.extraElements={}}scaleSize(e=1,t=this.camera.ratio){return e/this.internals.settings.zoomToSizeRatioFunction(t)*(this.getSetting("itemSizesReference")==="positions"?t*this.graphToViewportRatio:1)}getStageCanvas(){return this.stageCanvas}getMouseLayer(){return this.mouseLayer}}typeof window<"u"&&window.self!==window.top&&(Tt.gestureTarget="shared");function js(){const i=arguments[0];for(let e=1,t=arguments.length;e<t;e++)if(arguments[e])for(const a in arguments[e])i[a]=arguments[e][a];return i}let B=js;typeof Object.assign=="function"&&(B=Object.assign);function j(i,e,t,a){const n=i._nodes.get(e);let r=null;return n&&(a==="mixed"?r=n.out&&n.out[t]||n.undirected&&n.undirected[t]:a==="directed"?r=n.out&&n.out[t]:r=n.undirected&&n.undirected[t]),r}function U(i){return typeof i=="object"&&i!==null}function Va(i){let e;for(e in i)return!1;return!0}function V(i,e,t){Object.defineProperty(i,e,{enumerable:!1,configurable:!1,writable:!0,value:t})}function Z(i,e,t){const a={enumerable:!0,configurable:!0};typeof t=="function"?a.get=t:(a.value=t,a.writable=!1),Object.defineProperty(i,e,a)}function ra(i){return!(!U(i)||i.attributes&&!Array.isArray(i.attributes))}function qs(){let i=Math.floor(Math.random()*256)&255;return()=>i++}function ne(){const i=arguments;let e=null,t=-1;return{[Symbol.iterator](){return this},next(){let a=null;do{if(e===null){if(t++,t>=i.length)return{done:!0};e=i[t][Symbol.iterator]()}if(a=e.next(),a.done){e=null;continue}break}while(!0);return a}}}function Fe(){return{[Symbol.iterator](){return this},next(){return{done:!0}}}}class hi extends Error{constructor(e){super(),this.name="GraphError",this.message=e}}class L extends hi{constructor(e){super(e),this.name="InvalidArgumentsGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,L.prototype.constructor)}}class C extends hi{constructor(e){super(e),this.name="NotFoundGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,C.prototype.constructor)}}class I extends hi{constructor(e){super(e),this.name="UsageGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,I.prototype.constructor)}}function Xa(i,e){this.key=i,this.attributes=e,this.clear()}Xa.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.undirectedLoops=0,this.directedLoops=0,this.in={},this.out={},this.undirected={}};function ja(i,e){this.key=i,this.attributes=e,this.clear()}ja.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.directedLoops=0,this.in={},this.out={}};function qa(i,e){this.key=i,this.attributes=e,this.clear()}qa.prototype.clear=function(){this.undirectedDegree=0,this.undirectedLoops=0,this.undirected={}};function Ie(i,e,t,a,n){this.key=e,this.attributes=n,this.undirected=i,this.source=t,this.target=a}Ie.prototype.attach=function(){let i="out",e="in";this.undirected&&(i=e="undirected");const t=this.source.key,a=this.target.key;this.source[i][a]=this,!(this.undirected&&t===a)&&(this.target[e][t]=this)};Ie.prototype.attachMulti=function(){let i="out",e="in";const t=this.source.key,a=this.target.key;this.undirected&&(i=e="undirected");const n=this.source[i],r=n[a];if(typeof r>"u"){n[a]=this,this.undirected&&t===a||(this.target[e][t]=this);return}r.previous=this,this.next=r,n[a]=this,this.target[e][t]=this};Ie.prototype.detach=function(){const i=this.source.key,e=this.target.key;let t="out",a="in";this.undirected&&(t=a="undirected"),delete this.source[t][e],delete this.target[a][i]};Ie.prototype.detachMulti=function(){const i=this.source.key,e=this.target.key;let t="out",a="in";this.undirected&&(t=a="undirected"),this.previous===void 0?this.next===void 0?(delete this.source[t][e],delete this.target[a][i]):(this.next.previous=void 0,this.source[t][e]=this.next,this.target[a][i]=this.next):(this.previous.next=this.next,this.next!==void 0&&(this.next.previous=this.previous))};const Ka=0,Ya=1,Ks=2,Za=3;function oe(i,e,t,a,n,r,o){let s,l,h,d;if(a=""+a,t===Ka){if(s=i._nodes.get(a),!s)throw new C(`Graph.${e}: could not find the "${a}" node in the graph.`);h=n,d=r}else if(t===Za){if(n=""+n,l=i._edges.get(n),!l)throw new C(`Graph.${e}: could not find the "${n}" edge in the graph.`);const u=l.source.key,c=l.target.key;if(a===u)s=l.target;else if(a===c)s=l.source;else throw new C(`Graph.${e}: the "${a}" node is not attached to the "${n}" edge (${u}, ${c}).`);h=r,d=o}else{if(l=i._edges.get(a),!l)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`);t===Ya?s=l.source:s=l.target,h=n,d=r}return[s,h,d]}function Ys(i,e,t){i.prototype[e]=function(a,n,r){const[o,s]=oe(this,e,t,a,n,r);return o.attributes[s]}}function Zs(i,e,t){i.prototype[e]=function(a,n){const[r]=oe(this,e,t,a,n);return r.attributes}}function Qs(i,e,t){i.prototype[e]=function(a,n,r){const[o,s]=oe(this,e,t,a,n,r);return o.attributes.hasOwnProperty(s)}}function Js(i,e,t){i.prototype[e]=function(a,n,r,o){const[s,l,h]=oe(this,e,t,a,n,r,o);return s.attributes[l]=h,this.emit("nodeAttributesUpdated",{key:s.key,type:"set",attributes:s.attributes,name:l}),this}}function el(i,e,t){i.prototype[e]=function(a,n,r,o){const[s,l,h]=oe(this,e,t,a,n,r,o);if(typeof h!="function")throw new L(`Graph.${e}: updater should be a function.`);const d=s.attributes,u=h(d[l]);return d[l]=u,this.emit("nodeAttributesUpdated",{key:s.key,type:"set",attributes:s.attributes,name:l}),this}}function tl(i,e,t){i.prototype[e]=function(a,n,r){const[o,s]=oe(this,e,t,a,n,r);return delete o.attributes[s],this.emit("nodeAttributesUpdated",{key:o.key,type:"remove",attributes:o.attributes,name:s}),this}}function il(i,e,t){i.prototype[e]=function(a,n,r){const[o,s]=oe(this,e,t,a,n,r);if(!U(s))throw new L(`Graph.${e}: provided attributes are not a plain object.`);return o.attributes=s,this.emit("nodeAttributesUpdated",{key:o.key,type:"replace",attributes:o.attributes}),this}}function al(i,e,t){i.prototype[e]=function(a,n,r){const[o,s]=oe(this,e,t,a,n,r);if(!U(s))throw new L(`Graph.${e}: provided attributes are not a plain object.`);return B(o.attributes,s),this.emit("nodeAttributesUpdated",{key:o.key,type:"merge",attributes:o.attributes,data:s}),this}}function nl(i,e,t){i.prototype[e]=function(a,n,r){const[o,s]=oe(this,e,t,a,n,r);if(typeof s!="function")throw new L(`Graph.${e}: provided updater is not a function.`);return o.attributes=s(o.attributes),this.emit("nodeAttributesUpdated",{key:o.key,type:"update",attributes:o.attributes}),this}}const rl=[{name:i=>`get${i}Attribute`,attacher:Ys},{name:i=>`get${i}Attributes`,attacher:Zs},{name:i=>`has${i}Attribute`,attacher:Qs},{name:i=>`set${i}Attribute`,attacher:Js},{name:i=>`update${i}Attribute`,attacher:el},{name:i=>`remove${i}Attribute`,attacher:tl},{name:i=>`replace${i}Attributes`,attacher:il},{name:i=>`merge${i}Attributes`,attacher:al},{name:i=>`update${i}Attributes`,attacher:nl}];function ol(i){rl.forEach(function({name:e,attacher:t}){t(i,e("Node"),Ka),t(i,e("Source"),Ya),t(i,e("Target"),Ks),t(i,e("Opposite"),Za)})}function sl(i,e,t){i.prototype[e]=function(a,n){let r;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const o=""+a,s=""+n;if(n=arguments[2],r=j(this,o,s,t),!r)throw new C(`Graph.${e}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,r=this._edges.get(a),!r)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}return r.attributes[n]}}function ll(i,e,t){i.prototype[e]=function(a){let n;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>1){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const r=""+a,o=""+arguments[1];if(n=j(this,r,o,t),!n)throw new C(`Graph.${e}: could not find an edge for the given path ("${r}" - "${o}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,n=this._edges.get(a),!n)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}return n.attributes}}function dl(i,e,t){i.prototype[e]=function(a,n){let r;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const o=""+a,s=""+n;if(n=arguments[2],r=j(this,o,s,t),!r)throw new C(`Graph.${e}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,r=this._edges.get(a),!r)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}return r.attributes.hasOwnProperty(n)}}function hl(i,e,t){i.prototype[e]=function(a,n,r){let o;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const s=""+a,l=""+n;if(n=arguments[2],r=arguments[3],o=j(this,s,l,t),!o)throw new C(`Graph.${e}: could not find an edge for the given path ("${s}" - "${l}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,o=this._edges.get(a),!o)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}return o.attributes[n]=r,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:n}),this}}function ul(i,e,t){i.prototype[e]=function(a,n,r){let o;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const s=""+a,l=""+n;if(n=arguments[2],r=arguments[3],o=j(this,s,l,t),!o)throw new C(`Graph.${e}: could not find an edge for the given path ("${s}" - "${l}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,o=this._edges.get(a),!o)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}if(typeof r!="function")throw new L(`Graph.${e}: updater should be a function.`);return o.attributes[n]=r(o.attributes[n]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:n}),this}}function cl(i,e,t){i.prototype[e]=function(a,n){let r;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const o=""+a,s=""+n;if(n=arguments[2],r=j(this,o,s,t),!r)throw new C(`Graph.${e}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,r=this._edges.get(a),!r)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}return delete r.attributes[n],this.emit("edgeAttributesUpdated",{key:r.key,type:"remove",attributes:r.attributes,name:n}),this}}function fl(i,e,t){i.prototype[e]=function(a,n){let r;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const o=""+a,s=""+n;if(n=arguments[2],r=j(this,o,s,t),!r)throw new C(`Graph.${e}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,r=this._edges.get(a),!r)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}if(!U(n))throw new L(`Graph.${e}: provided attributes are not a plain object.`);return r.attributes=n,this.emit("edgeAttributesUpdated",{key:r.key,type:"replace",attributes:r.attributes}),this}}function gl(i,e,t){i.prototype[e]=function(a,n){let r;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const o=""+a,s=""+n;if(n=arguments[2],r=j(this,o,s,t),!r)throw new C(`Graph.${e}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,r=this._edges.get(a),!r)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}if(!U(n))throw new L(`Graph.${e}: provided attributes are not a plain object.`);return B(r.attributes,n),this.emit("edgeAttributesUpdated",{key:r.key,type:"merge",attributes:r.attributes,data:n}),this}}function pl(i,e,t){i.prototype[e]=function(a,n){let r;if(this.type!=="mixed"&&t!=="mixed"&&t!==this.type)throw new I(`Graph.${e}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new I(`Graph.${e}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);const o=""+a,s=""+n;if(n=arguments[2],r=j(this,o,s,t),!r)throw new C(`Graph.${e}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(t!=="mixed")throw new I(`Graph.${e}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(a=""+a,r=this._edges.get(a),!r)throw new C(`Graph.${e}: could not find the "${a}" edge in the graph.`)}if(typeof n!="function")throw new L(`Graph.${e}: provided updater is not a function.`);return r.attributes=n(r.attributes),this.emit("edgeAttributesUpdated",{key:r.key,type:"update",attributes:r.attributes}),this}}const ml=[{name:i=>`get${i}Attribute`,attacher:sl},{name:i=>`get${i}Attributes`,attacher:ll},{name:i=>`has${i}Attribute`,attacher:dl},{name:i=>`set${i}Attribute`,attacher:hl},{name:i=>`update${i}Attribute`,attacher:ul},{name:i=>`remove${i}Attribute`,attacher:cl},{name:i=>`replace${i}Attributes`,attacher:fl},{name:i=>`merge${i}Attributes`,attacher:gl},{name:i=>`update${i}Attributes`,attacher:pl}];function bl(i){ml.forEach(function({name:e,attacher:t}){t(i,e("Edge"),"mixed"),t(i,e("DirectedEdge"),"directed"),t(i,e("UndirectedEdge"),"undirected")})}const xl=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function yl(i,e,t,a){let n=!1;for(const r in e){if(r===a)continue;const o=e[r];if(n=t(o.key,o.attributes,o.source.key,o.target.key,o.source.attributes,o.target.attributes,o.undirected),i&&n)return o.key}}function _l(i,e,t,a){let n,r,o,s=!1;for(const l in e)if(l!==a){n=e[l];do{if(r=n.source,o=n.target,s=t(n.key,n.attributes,r.key,o.key,r.attributes,o.attributes,n.undirected),i&&s)return n.key;n=n.next}while(n!==void 0)}}function Wt(i,e){const t=Object.keys(i),a=t.length;let n,r=0;return{[Symbol.iterator](){return this},next(){do if(n)n=n.next;else{if(r>=a)return{done:!0};const o=t[r++];if(o===e){n=void 0;continue}n=i[o]}while(!n);return{done:!1,value:{edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected}}}}}function Tl(i,e,t,a){const n=e[t];if(!n)return;const r=n.source,o=n.target;if(a(n.key,n.attributes,r.key,o.key,r.attributes,o.attributes,n.undirected)&&i)return n.key}function vl(i,e,t,a){let n=e[t];if(!n)return;let r=!1;do{if(r=a(n.key,n.attributes,n.source.key,n.target.key,n.source.attributes,n.target.attributes,n.undirected),i&&r)return n.key;n=n.next}while(n!==void 0)}function Bt(i,e){let t=i[e];if(t.next!==void 0)return{[Symbol.iterator](){return this},next(){if(!t)return{done:!0};const n={edge:t.key,attributes:t.attributes,source:t.source.key,target:t.target.key,sourceAttributes:t.source.attributes,targetAttributes:t.target.attributes,undirected:t.undirected};return t=t.next,{done:!1,value:n}}};let a=!1;return{[Symbol.iterator](){return this},next(){return a===!0?{done:!0}:(a=!0,{done:!1,value:{edge:t.key,attributes:t.attributes,source:t.source.key,target:t.target.key,sourceAttributes:t.source.attributes,targetAttributes:t.target.attributes,undirected:t.undirected}})}}}function Sl(i,e){if(i.size===0)return[];if(e==="mixed"||e===i.type)return Array.from(i._edges.keys());const t=e==="undirected"?i.undirectedSize:i.directedSize,a=new Array(t),n=e==="undirected",r=i._edges.values();let o=0,s,l;for(;s=r.next(),s.done!==!0;)l=s.value,l.undirected===n&&(a[o++]=l.key);return a}function Qa(i,e,t,a){if(e.size===0)return;const n=t!=="mixed"&&t!==e.type,r=t==="undirected";let o,s,l=!1;const h=e._edges.values();for(;o=h.next(),o.done!==!0;){if(s=o.value,n&&s.undirected!==r)continue;const{key:d,attributes:u,source:c,target:f}=s;if(l=a(d,u,c.key,f.key,c.attributes,f.attributes,s.undirected),i&&l)return d}}function El(i,e){if(i.size===0)return Fe();const t=e!=="mixed"&&e!==i.type,a=e==="undirected",n=i._edges.values();return{[Symbol.iterator](){return this},next(){let r,o;for(;;){if(r=n.next(),r.done)return r;if(o=r.value,!(t&&o.undirected!==a))break}return{value:{edge:o.key,attributes:o.attributes,source:o.source.key,target:o.target.key,sourceAttributes:o.source.attributes,targetAttributes:o.target.attributes,undirected:o.undirected},done:!1}}}}function ui(i,e,t,a,n,r){const o=e?_l:yl;let s;if(t!=="undirected"&&(a!=="out"&&(s=o(i,n.in,r),i&&s)||a!=="in"&&(s=o(i,n.out,r,a?void 0:n.key),i&&s))||t!=="directed"&&(s=o(i,n.undirected,r),i&&s))return s}function wl(i,e,t,a){const n=[];return ui(!1,i,e,t,a,function(r){n.push(r)}),n}function Dl(i,e,t){let a=Fe();return i!=="undirected"&&(e!=="out"&&typeof t.in<"u"&&(a=ne(a,Wt(t.in))),e!=="in"&&typeof t.out<"u"&&(a=ne(a,Wt(t.out,e?void 0:t.key)))),i!=="directed"&&typeof t.undirected<"u"&&(a=ne(a,Wt(t.undirected))),a}function ci(i,e,t,a,n,r,o){const s=t?vl:Tl;let l;if(e!=="undirected"&&(typeof n.in<"u"&&a!=="out"&&(l=s(i,n.in,r,o),i&&l)||typeof n.out<"u"&&a!=="in"&&(a||n.key!==r)&&(l=s(i,n.out,r,o),i&&l))||e!=="directed"&&typeof n.undirected<"u"&&(l=s(i,n.undirected,r,o),i&&l))return l}function Al(i,e,t,a,n){const r=[];return ci(!1,i,e,t,a,n,function(o){r.push(o)}),r}function Rl(i,e,t,a){let n=Fe();return i!=="undirected"&&(typeof t.in<"u"&&e!=="out"&&a in t.in&&(n=ne(n,Bt(t.in,a))),typeof t.out<"u"&&e!=="in"&&a in t.out&&(e||t.key!==a)&&(n=ne(n,Bt(t.out,a)))),i!=="directed"&&typeof t.undirected<"u"&&a in t.undirected&&(n=ne(n,Bt(t.undirected,a))),n}function Cl(i,e){const{name:t,type:a,direction:n}=e;i.prototype[t]=function(r,o){if(a!=="mixed"&&this.type!=="mixed"&&a!==this.type)return[];if(!arguments.length)return Sl(this,a);if(arguments.length===1){r=""+r;const s=this._nodes.get(r);if(typeof s>"u")throw new C(`Graph.${t}: could not find the "${r}" node in the graph.`);return wl(this.multi,a==="mixed"?this.type:a,n,s)}if(arguments.length===2){r=""+r,o=""+o;const s=this._nodes.get(r);if(!s)throw new C(`Graph.${t}:  could not find the "${r}" source node in the graph.`);if(!this._nodes.has(o))throw new C(`Graph.${t}:  could not find the "${o}" target node in the graph.`);return Al(a,this.multi,n,s,o)}throw new L(`Graph.${t}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function Ll(i,e){const{name:t,type:a,direction:n}=e,r="forEach"+t[0].toUpperCase()+t.slice(1,-1);i.prototype[r]=function(h,d,u){if(!(a!=="mixed"&&this.type!=="mixed"&&a!==this.type)){if(arguments.length===1)return u=h,Qa(!1,this,a,u);if(arguments.length===2){h=""+h,u=d;const c=this._nodes.get(h);if(typeof c>"u")throw new C(`Graph.${r}: could not find the "${h}" node in the graph.`);return ui(!1,this.multi,a==="mixed"?this.type:a,n,c,u)}if(arguments.length===3){h=""+h,d=""+d;const c=this._nodes.get(h);if(!c)throw new C(`Graph.${r}:  could not find the "${h}" source node in the graph.`);if(!this._nodes.has(d))throw new C(`Graph.${r}:  could not find the "${d}" target node in the graph.`);return ci(!1,a,this.multi,n,c,d,u)}throw new L(`Graph.${r}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)}};const o="map"+t[0].toUpperCase()+t.slice(1);i.prototype[o]=function(){const h=Array.prototype.slice.call(arguments),d=h.pop();let u;if(h.length===0){let c=0;a!=="directed"&&(c+=this.undirectedSize),a!=="undirected"&&(c+=this.directedSize),u=new Array(c);let f=0;h.push((g,b,p,m,y,v,_)=>{u[f++]=d(g,b,p,m,y,v,_)})}else u=[],h.push((c,f,g,b,p,m,y)=>{u.push(d(c,f,g,b,p,m,y))});return this[r].apply(this,h),u};const s="filter"+t[0].toUpperCase()+t.slice(1);i.prototype[s]=function(){const h=Array.prototype.slice.call(arguments),d=h.pop(),u=[];return h.push((c,f,g,b,p,m,y)=>{d(c,f,g,b,p,m,y)&&u.push(c)}),this[r].apply(this,h),u};const l="reduce"+t[0].toUpperCase()+t.slice(1);i.prototype[l]=function(){let h=Array.prototype.slice.call(arguments);if(h.length<2||h.length>4)throw new L(`Graph.${l}: invalid number of arguments (expecting 2, 3 or 4 and got ${h.length}).`);if(typeof h[h.length-1]=="function"&&typeof h[h.length-2]!="function")throw new L(`Graph.${l}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let d,u;h.length===2?(d=h[0],u=h[1],h=[]):h.length===3?(d=h[1],u=h[2],h=[h[0]]):h.length===4&&(d=h[2],u=h[3],h=[h[0],h[1]]);let c=u;return h.push((f,g,b,p,m,y,v)=>{c=d(c,f,g,b,p,m,y,v)}),this[r].apply(this,h),c}}function Pl(i,e){const{name:t,type:a,direction:n}=e,r="find"+t[0].toUpperCase()+t.slice(1,-1);i.prototype[r]=function(l,h,d){if(a!=="mixed"&&this.type!=="mixed"&&a!==this.type)return!1;if(arguments.length===1)return d=l,Qa(!0,this,a,d);if(arguments.length===2){l=""+l,d=h;const u=this._nodes.get(l);if(typeof u>"u")throw new C(`Graph.${r}: could not find the "${l}" node in the graph.`);return ui(!0,this.multi,a==="mixed"?this.type:a,n,u,d)}if(arguments.length===3){l=""+l,h=""+h;const u=this._nodes.get(l);if(!u)throw new C(`Graph.${r}:  could not find the "${l}" source node in the graph.`);if(!this._nodes.has(h))throw new C(`Graph.${r}:  could not find the "${h}" target node in the graph.`);return ci(!0,a,this.multi,n,u,h,d)}throw new L(`Graph.${r}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)};const o="some"+t[0].toUpperCase()+t.slice(1,-1);i.prototype[o]=function(){const l=Array.prototype.slice.call(arguments),h=l.pop();return l.push((u,c,f,g,b,p,m)=>h(u,c,f,g,b,p,m)),!!this[r].apply(this,l)};const s="every"+t[0].toUpperCase()+t.slice(1,-1);i.prototype[s]=function(){const l=Array.prototype.slice.call(arguments),h=l.pop();return l.push((u,c,f,g,b,p,m)=>!h(u,c,f,g,b,p,m)),!this[r].apply(this,l)}}function Fl(i,e){const{name:t,type:a,direction:n}=e,r=t.slice(0,-1)+"Entries";i.prototype[r]=function(o,s){if(a!=="mixed"&&this.type!=="mixed"&&a!==this.type)return Fe();if(!arguments.length)return El(this,a);if(arguments.length===1){o=""+o;const l=this._nodes.get(o);if(!l)throw new C(`Graph.${r}: could not find the "${o}" node in the graph.`);return Dl(a,n,l)}if(arguments.length===2){o=""+o,s=""+s;const l=this._nodes.get(o);if(!l)throw new C(`Graph.${r}:  could not find the "${o}" source node in the graph.`);if(!this._nodes.has(s))throw new C(`Graph.${r}:  could not find the "${s}" target node in the graph.`);return Rl(a,n,l,s)}throw new L(`Graph.${r}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function Il(i){xl.forEach(e=>{Cl(i,e),Ll(i,e),Pl(i,e),Fl(i,e)})}const kl=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function Rt(){this.A=null,this.B=null}Rt.prototype.wrap=function(i){this.A===null?this.A=i:this.B===null&&(this.B=i)};Rt.prototype.has=function(i){return this.A!==null&&i in this.A||this.B!==null&&i in this.B};function We(i,e,t,a,n){for(const r in a){const o=a[r],s=o.source,l=o.target,h=s===t?l:s;if(e&&e.has(h.key))continue;const d=n(h.key,h.attributes);if(i&&d)return h.key}}function fi(i,e,t,a,n){if(e!=="mixed"){if(e==="undirected")return We(i,null,a,a.undirected,n);if(typeof t=="string")return We(i,null,a,a[t],n)}const r=new Rt;let o;if(e!=="undirected"){if(t!=="out"){if(o=We(i,null,a,a.in,n),i&&o)return o;r.wrap(a.in)}if(t!=="in"){if(o=We(i,r,a,a.out,n),i&&o)return o;r.wrap(a.out)}}if(e!=="directed"&&(o=We(i,r,a,a.undirected,n),i&&o))return o}function Gl(i,e,t){if(i!=="mixed"){if(i==="undirected")return Object.keys(t.undirected);if(typeof e=="string")return Object.keys(t[e])}const a=[];return fi(!1,i,e,t,function(n){a.push(n)}),a}function Be(i,e,t){const a=Object.keys(t),n=a.length;let r=0;return{[Symbol.iterator](){return this},next(){let o=null;do{if(r>=n)return i&&i.wrap(t),{done:!0};const s=t[a[r++]],l=s.source,h=s.target;if(o=l===e?h:l,i&&i.has(o.key)){o=null;continue}}while(o===null);return{done:!1,value:{neighbor:o.key,attributes:o.attributes}}}}}function Nl(i,e,t){if(i!=="mixed"){if(i==="undirected")return Be(null,t,t.undirected);if(typeof e=="string")return Be(null,t,t[e])}let a=Fe();const n=new Rt;return i!=="undirected"&&(e!=="out"&&(a=ne(a,Be(n,t,t.in))),e!=="in"&&(a=ne(a,Be(n,t,t.out)))),i!=="directed"&&(a=ne(a,Be(n,t,t.undirected))),a}function Ml(i,e){const{name:t,type:a,direction:n}=e;i.prototype[t]=function(r){if(a!=="mixed"&&this.type!=="mixed"&&a!==this.type)return[];r=""+r;const o=this._nodes.get(r);if(typeof o>"u")throw new C(`Graph.${t}: could not find the "${r}" node in the graph.`);return Gl(a==="mixed"?this.type:a,n,o)}}function zl(i,e){const{name:t,type:a,direction:n}=e,r="forEach"+t[0].toUpperCase()+t.slice(1,-1);i.prototype[r]=function(h,d){if(a!=="mixed"&&this.type!=="mixed"&&a!==this.type)return;h=""+h;const u=this._nodes.get(h);if(typeof u>"u")throw new C(`Graph.${r}: could not find the "${h}" node in the graph.`);fi(!1,a==="mixed"?this.type:a,n,u,d)};const o="map"+t[0].toUpperCase()+t.slice(1);i.prototype[o]=function(h,d){const u=[];return this[r](h,(c,f)=>{u.push(d(c,f))}),u};const s="filter"+t[0].toUpperCase()+t.slice(1);i.prototype[s]=function(h,d){const u=[];return this[r](h,(c,f)=>{d(c,f)&&u.push(c)}),u};const l="reduce"+t[0].toUpperCase()+t.slice(1);i.prototype[l]=function(h,d,u){if(arguments.length<3)throw new L(`Graph.${l}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let c=u;return this[r](h,(f,g)=>{c=d(c,f,g)}),c}}function $l(i,e){const{name:t,type:a,direction:n}=e,r=t[0].toUpperCase()+t.slice(1,-1),o="find"+r;i.prototype[o]=function(h,d){if(a!=="mixed"&&this.type!=="mixed"&&a!==this.type)return;h=""+h;const u=this._nodes.get(h);if(typeof u>"u")throw new C(`Graph.${o}: could not find the "${h}" node in the graph.`);return fi(!0,a==="mixed"?this.type:a,n,u,d)};const s="some"+r;i.prototype[s]=function(h,d){return!!this[o](h,d)};const l="every"+r;i.prototype[l]=function(h,d){return!this[o](h,(c,f)=>!d(c,f))}}function Wl(i,e){const{name:t,type:a,direction:n}=e,r=t.slice(0,-1)+"Entries";i.prototype[r]=function(o){if(a!=="mixed"&&this.type!=="mixed"&&a!==this.type)return Fe();o=""+o;const s=this._nodes.get(o);if(typeof s>"u")throw new C(`Graph.${r}: could not find the "${o}" node in the graph.`);return Nl(a==="mixed"?this.type:a,n,s)}}function Bl(i){kl.forEach(e=>{Ml(i,e),zl(i,e),$l(i,e),Wl(i,e)})}function ht(i,e,t,a,n){const r=a._nodes.values(),o=a.type;let s,l,h,d,u,c;for(;s=r.next(),s.done!==!0;){let f=!1;if(l=s.value,o!=="undirected"){d=l.out;for(h in d){u=d[h];do c=u.target,f=!0,n(l.key,c.key,l.attributes,c.attributes,u.key,u.attributes,u.undirected),u=u.next;while(u)}}if(o!=="directed"){d=l.undirected;for(h in d)if(!(e&&l.key>h)){u=d[h];do c=u.target,c.key!==h&&(c=u.source),f=!0,n(l.key,c.key,l.attributes,c.attributes,u.key,u.attributes,u.undirected),u=u.next;while(u)}}t&&!f&&n(l.key,null,l.attributes,null,null,null,null)}}function Ul(i,e){const t={key:i};return Va(e.attributes)||(t.attributes=B({},e.attributes)),t}function Ol(i,e,t){const a={key:e,source:t.source.key,target:t.target.key};return Va(t.attributes)||(a.attributes=B({},t.attributes)),i==="mixed"&&t.undirected&&(a.undirected=!0),a}function Hl(i){if(!U(i))throw new L('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if(!("key"in i))throw new L("Graph.import: serialized node is missing its key.");if("attributes"in i&&(!U(i.attributes)||i.attributes===null))throw new L("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.")}function Vl(i){if(!U(i))throw new L('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if(!("source"in i))throw new L("Graph.import: serialized edge is missing its source.");if(!("target"in i))throw new L("Graph.import: serialized edge is missing its target.");if("attributes"in i&&(!U(i.attributes)||i.attributes===null))throw new L("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");if("undirected"in i&&typeof i.undirected!="boolean")throw new L("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.")}const Xl=qs(),jl=new Set(["directed","undirected","mixed"]),oa=new Set(["domain","_events","_eventsCount","_maxListeners"]),ql=[{name:i=>`${i}Edge`,generateKey:!0},{name:i=>`${i}DirectedEdge`,generateKey:!0,type:"directed"},{name:i=>`${i}UndirectedEdge`,generateKey:!0,type:"undirected"},{name:i=>`${i}EdgeWithKey`},{name:i=>`${i}DirectedEdgeWithKey`,type:"directed"},{name:i=>`${i}UndirectedEdgeWithKey`,type:"undirected"}],Kl={allowSelfLoops:!0,multi:!1,type:"mixed"};function Yl(i,e,t){if(t&&!U(t))throw new L(`Graph.addNode: invalid attributes. Expecting an object but got "${t}"`);if(e=""+e,t=t||{},i._nodes.has(e))throw new I(`Graph.addNode: the "${e}" node already exist in the graph.`);const a=new i.NodeDataClass(e,t);return i._nodes.set(e,a),i.emit("nodeAdded",{key:e,attributes:t}),a}function sa(i,e,t){const a=new i.NodeDataClass(e,t);return i._nodes.set(e,a),i.emit("nodeAdded",{key:e,attributes:t}),a}function Ja(i,e,t,a,n,r,o,s){if(!a&&i.type==="undirected")throw new I(`Graph.${e}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);if(a&&i.type==="directed")throw new I(`Graph.${e}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);if(s&&!U(s))throw new L(`Graph.${e}: invalid attributes. Expecting an object but got "${s}"`);if(r=""+r,o=""+o,s=s||{},!i.allowSelfLoops&&r===o)throw new I(`Graph.${e}: source & target are the same ("${r}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);const l=i._nodes.get(r),h=i._nodes.get(o);if(!l)throw new C(`Graph.${e}: source node "${r}" not found.`);if(!h)throw new C(`Graph.${e}: target node "${o}" not found.`);const d={key:null,undirected:a,source:r,target:o,attributes:s};if(t)n=i._edgeKeyGenerator();else if(n=""+n,i._edges.has(n))throw new I(`Graph.${e}: the "${n}" edge already exists in the graph.`);if(!i.multi&&(a?typeof l.undirected[o]<"u":typeof l.out[o]<"u"))throw new I(`Graph.${e}: an edge linking "${r}" to "${o}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`);const u=new Ie(a,n,l,h,s);i._edges.set(n,u);const c=r===o;return a?(l.undirectedDegree++,h.undirectedDegree++,c&&(l.undirectedLoops++,i._undirectedSelfLoopCount++)):(l.outDegree++,h.inDegree++,c&&(l.directedLoops++,i._directedSelfLoopCount++)),i.multi?u.attachMulti():u.attach(),a?i._undirectedSize++:i._directedSize++,d.key=n,i.emit("edgeAdded",d),n}function Zl(i,e,t,a,n,r,o,s,l){if(!a&&i.type==="undirected")throw new I(`Graph.${e}: you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead.`);if(a&&i.type==="directed")throw new I(`Graph.${e}: you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead.`);if(s){if(l){if(typeof s!="function")throw new L(`Graph.${e}: invalid updater function. Expecting a function but got "${s}"`)}else if(!U(s))throw new L(`Graph.${e}: invalid attributes. Expecting an object but got "${s}"`)}r=""+r,o=""+o;let h;if(l&&(h=s,s=void 0),!i.allowSelfLoops&&r===o)throw new I(`Graph.${e}: source & target are the same ("${r}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let d=i._nodes.get(r),u=i._nodes.get(o),c,f;if(!t&&(c=i._edges.get(n),c)){if((c.source.key!==r||c.target.key!==o)&&(!a||c.source.key!==o||c.target.key!==r))throw new I(`Graph.${e}: inconsistency detected when attempting to merge the "${n}" edge with "${r}" source & "${o}" target vs. ("${c.source.key}", "${c.target.key}").`);f=c}if(!f&&!i.multi&&d&&(f=a?d.undirected[o]:d.out[o]),f){const y=[f.key,!1,!1,!1];if(l?!h:!s)return y;if(l){const v=f.attributes;f.attributes=h(v),i.emit("edgeAttributesUpdated",{type:"replace",key:f.key,attributes:f.attributes})}else B(f.attributes,s),i.emit("edgeAttributesUpdated",{type:"merge",key:f.key,attributes:f.attributes,data:s});return y}s=s||{},l&&h&&(s=h(s));const g={key:null,undirected:a,source:r,target:o,attributes:s};if(t)n=i._edgeKeyGenerator();else if(n=""+n,i._edges.has(n))throw new I(`Graph.${e}: the "${n}" edge already exists in the graph.`);let b=!1,p=!1;d||(d=sa(i,r,{}),b=!0,r===o&&(u=d,p=!0)),u||(u=sa(i,o,{}),p=!0),c=new Ie(a,n,d,u,s),i._edges.set(n,c);const m=r===o;return a?(d.undirectedDegree++,u.undirectedDegree++,m&&(d.undirectedLoops++,i._undirectedSelfLoopCount++)):(d.outDegree++,u.inDegree++,m&&(d.directedLoops++,i._directedSelfLoopCount++)),i.multi?c.attachMulti():c.attach(),a?i._undirectedSize++:i._directedSize++,g.key=n,i.emit("edgeAdded",g),[n,!0,b,p]}function Ae(i,e){i._edges.delete(e.key);const{source:t,target:a,attributes:n}=e,r=e.undirected,o=t===a;r?(t.undirectedDegree--,a.undirectedDegree--,o&&(t.undirectedLoops--,i._undirectedSelfLoopCount--)):(t.outDegree--,a.inDegree--,o&&(t.directedLoops--,i._directedSelfLoopCount--)),i.multi?e.detachMulti():e.detach(),r?i._undirectedSize--:i._directedSize--,i.emit("edgeDropped",{key:e.key,attributes:n,source:t.key,target:a.key,undirected:r})}class z extends Kt.EventEmitter{constructor(e){if(super(),e=B({},Kl,e),typeof e.multi!="boolean")throw new L(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${e.multi}".`);if(!jl.has(e.type))throw new L(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${e.type}".`);if(typeof e.allowSelfLoops!="boolean")throw new L(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${e.allowSelfLoops}".`);const t=e.type==="mixed"?Xa:e.type==="directed"?ja:qa;V(this,"NodeDataClass",t);const a="geid_"+Xl()+"_";let n=0;const r=()=>{let o;do o=a+n++;while(this._edges.has(o));return o};V(this,"_attributes",{}),V(this,"_nodes",new Map),V(this,"_edges",new Map),V(this,"_directedSize",0),V(this,"_undirectedSize",0),V(this,"_directedSelfLoopCount",0),V(this,"_undirectedSelfLoopCount",0),V(this,"_edgeKeyGenerator",r),V(this,"_options",e),oa.forEach(o=>V(this,o,this[o])),Z(this,"order",()=>this._nodes.size),Z(this,"size",()=>this._edges.size),Z(this,"directedSize",()=>this._directedSize),Z(this,"undirectedSize",()=>this._undirectedSize),Z(this,"selfLoopCount",()=>this._directedSelfLoopCount+this._undirectedSelfLoopCount),Z(this,"directedSelfLoopCount",()=>this._directedSelfLoopCount),Z(this,"undirectedSelfLoopCount",()=>this._undirectedSelfLoopCount),Z(this,"multi",this._options.multi),Z(this,"type",this._options.type),Z(this,"allowSelfLoops",this._options.allowSelfLoops),Z(this,"implementation",()=>"graphology")}_resetInstanceCounters(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0}hasNode(e){return this._nodes.has(""+e)}hasDirectedEdge(e,t){if(this.type==="undirected")return!1;if(arguments.length===1){const a=""+e,n=this._edges.get(a);return!!n&&!n.undirected}else if(arguments.length===2){e=""+e,t=""+t;const a=this._nodes.get(e);return a?a.out.hasOwnProperty(t):!1}throw new L(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasUndirectedEdge(e,t){if(this.type==="directed")return!1;if(arguments.length===1){const a=""+e,n=this._edges.get(a);return!!n&&n.undirected}else if(arguments.length===2){e=""+e,t=""+t;const a=this._nodes.get(e);return a?a.undirected.hasOwnProperty(t):!1}throw new L(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasEdge(e,t){if(arguments.length===1){const a=""+e;return this._edges.has(a)}else if(arguments.length===2){e=""+e,t=""+t;const a=this._nodes.get(e);return a?typeof a.out<"u"&&a.out.hasOwnProperty(t)||typeof a.undirected<"u"&&a.undirected.hasOwnProperty(t):!1}throw new L(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}directedEdge(e,t){if(this.type==="undirected")return;if(e=""+e,t=""+t,this.multi)throw new I("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");const a=this._nodes.get(e);if(!a)throw new C(`Graph.directedEdge: could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new C(`Graph.directedEdge: could not find the "${t}" target node in the graph.`);const n=a.out&&a.out[t]||void 0;if(n)return n.key}undirectedEdge(e,t){if(this.type==="directed")return;if(e=""+e,t=""+t,this.multi)throw new I("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");const a=this._nodes.get(e);if(!a)throw new C(`Graph.undirectedEdge: could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new C(`Graph.undirectedEdge: could not find the "${t}" target node in the graph.`);const n=a.undirected&&a.undirected[t]||void 0;if(n)return n.key}edge(e,t){if(this.multi)throw new I("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");e=""+e,t=""+t;const a=this._nodes.get(e);if(!a)throw new C(`Graph.edge: could not find the "${e}" source node in the graph.`);if(!this._nodes.has(t))throw new C(`Graph.edge: could not find the "${t}" target node in the graph.`);const n=a.out&&a.out[t]||a.undirected&&a.undirected[t]||void 0;if(n)return n.key}areDirectedNeighbors(e,t){e=""+e,t=""+t;const a=this._nodes.get(e);if(!a)throw new C(`Graph.areDirectedNeighbors: could not find the "${e}" node in the graph.`);return this.type==="undirected"?!1:t in a.in||t in a.out}areOutNeighbors(e,t){e=""+e,t=""+t;const a=this._nodes.get(e);if(!a)throw new C(`Graph.areOutNeighbors: could not find the "${e}" node in the graph.`);return this.type==="undirected"?!1:t in a.out}areInNeighbors(e,t){e=""+e,t=""+t;const a=this._nodes.get(e);if(!a)throw new C(`Graph.areInNeighbors: could not find the "${e}" node in the graph.`);return this.type==="undirected"?!1:t in a.in}areUndirectedNeighbors(e,t){e=""+e,t=""+t;const a=this._nodes.get(e);if(!a)throw new C(`Graph.areUndirectedNeighbors: could not find the "${e}" node in the graph.`);return this.type==="directed"?!1:t in a.undirected}areNeighbors(e,t){e=""+e,t=""+t;const a=this._nodes.get(e);if(!a)throw new C(`Graph.areNeighbors: could not find the "${e}" node in the graph.`);return this.type!=="undirected"&&(t in a.in||t in a.out)||this.type!=="directed"&&t in a.undirected}areInboundNeighbors(e,t){e=""+e,t=""+t;const a=this._nodes.get(e);if(!a)throw new C(`Graph.areInboundNeighbors: could not find the "${e}" node in the graph.`);return this.type!=="undirected"&&t in a.in||this.type!=="directed"&&t in a.undirected}areOutboundNeighbors(e,t){e=""+e,t=""+t;const a=this._nodes.get(e);if(!a)throw new C(`Graph.areOutboundNeighbors: could not find the "${e}" node in the graph.`);return this.type!=="undirected"&&t in a.out||this.type!=="directed"&&t in a.undirected}inDegree(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.inDegree: could not find the "${e}" node in the graph.`);return this.type==="undirected"?0:t.inDegree}outDegree(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.outDegree: could not find the "${e}" node in the graph.`);return this.type==="undirected"?0:t.outDegree}directedDegree(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.directedDegree: could not find the "${e}" node in the graph.`);return this.type==="undirected"?0:t.inDegree+t.outDegree}undirectedDegree(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.undirectedDegree: could not find the "${e}" node in the graph.`);return this.type==="directed"?0:t.undirectedDegree}inboundDegree(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.inboundDegree: could not find the "${e}" node in the graph.`);let a=0;return this.type!=="directed"&&(a+=t.undirectedDegree),this.type!=="undirected"&&(a+=t.inDegree),a}outboundDegree(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.outboundDegree: could not find the "${e}" node in the graph.`);let a=0;return this.type!=="directed"&&(a+=t.undirectedDegree),this.type!=="undirected"&&(a+=t.outDegree),a}degree(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.degree: could not find the "${e}" node in the graph.`);let a=0;return this.type!=="directed"&&(a+=t.undirectedDegree),this.type!=="undirected"&&(a+=t.inDegree+t.outDegree),a}inDegreeWithoutSelfLoops(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.inDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);return this.type==="undirected"?0:t.inDegree-t.directedLoops}outDegreeWithoutSelfLoops(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.outDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);return this.type==="undirected"?0:t.outDegree-t.directedLoops}directedDegreeWithoutSelfLoops(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.directedDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);return this.type==="undirected"?0:t.inDegree+t.outDegree-t.directedLoops*2}undirectedDegreeWithoutSelfLoops(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.undirectedDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);return this.type==="directed"?0:t.undirectedDegree-t.undirectedLoops*2}inboundDegreeWithoutSelfLoops(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.inboundDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);let a=0,n=0;return this.type!=="directed"&&(a+=t.undirectedDegree,n+=t.undirectedLoops*2),this.type!=="undirected"&&(a+=t.inDegree,n+=t.directedLoops),a-n}outboundDegreeWithoutSelfLoops(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.outboundDegreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);let a=0,n=0;return this.type!=="directed"&&(a+=t.undirectedDegree,n+=t.undirectedLoops*2),this.type!=="undirected"&&(a+=t.outDegree,n+=t.directedLoops),a-n}degreeWithoutSelfLoops(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.degreeWithoutSelfLoops: could not find the "${e}" node in the graph.`);let a=0,n=0;return this.type!=="directed"&&(a+=t.undirectedDegree,n+=t.undirectedLoops*2),this.type!=="undirected"&&(a+=t.inDegree+t.outDegree,n+=t.directedLoops*2),a-n}source(e){e=""+e;const t=this._edges.get(e);if(!t)throw new C(`Graph.source: could not find the "${e}" edge in the graph.`);return t.source.key}target(e){e=""+e;const t=this._edges.get(e);if(!t)throw new C(`Graph.target: could not find the "${e}" edge in the graph.`);return t.target.key}extremities(e){e=""+e;const t=this._edges.get(e);if(!t)throw new C(`Graph.extremities: could not find the "${e}" edge in the graph.`);return[t.source.key,t.target.key]}opposite(e,t){e=""+e,t=""+t;const a=this._edges.get(t);if(!a)throw new C(`Graph.opposite: could not find the "${t}" edge in the graph.`);const n=a.source.key,r=a.target.key;if(e===n)return r;if(e===r)return n;throw new C(`Graph.opposite: the "${e}" node is not attached to the "${t}" edge (${n}, ${r}).`)}hasExtremity(e,t){e=""+e,t=""+t;const a=this._edges.get(e);if(!a)throw new C(`Graph.hasExtremity: could not find the "${e}" edge in the graph.`);return a.source.key===t||a.target.key===t}isUndirected(e){e=""+e;const t=this._edges.get(e);if(!t)throw new C(`Graph.isUndirected: could not find the "${e}" edge in the graph.`);return t.undirected}isDirected(e){e=""+e;const t=this._edges.get(e);if(!t)throw new C(`Graph.isDirected: could not find the "${e}" edge in the graph.`);return!t.undirected}isSelfLoop(e){e=""+e;const t=this._edges.get(e);if(!t)throw new C(`Graph.isSelfLoop: could not find the "${e}" edge in the graph.`);return t.source===t.target}addNode(e,t){return Yl(this,e,t).key}mergeNode(e,t){if(t&&!U(t))throw new L(`Graph.mergeNode: invalid attributes. Expecting an object but got "${t}"`);e=""+e,t=t||{};let a=this._nodes.get(e);return a?(t&&(B(a.attributes,t),this.emit("nodeAttributesUpdated",{type:"merge",key:e,attributes:a.attributes,data:t})),[e,!1]):(a=new this.NodeDataClass(e,t),this._nodes.set(e,a),this.emit("nodeAdded",{key:e,attributes:t}),[e,!0])}updateNode(e,t){if(t&&typeof t!="function")throw new L(`Graph.updateNode: invalid updater function. Expecting a function but got "${t}"`);e=""+e;let a=this._nodes.get(e);if(a){if(t){const r=a.attributes;a.attributes=t(r),this.emit("nodeAttributesUpdated",{type:"replace",key:e,attributes:a.attributes})}return[e,!1]}const n=t?t({}):{};return a=new this.NodeDataClass(e,n),this._nodes.set(e,a),this.emit("nodeAdded",{key:e,attributes:n}),[e,!0]}dropNode(e){e=""+e;const t=this._nodes.get(e);if(!t)throw new C(`Graph.dropNode: could not find the "${e}" node in the graph.`);let a;if(this.type!=="undirected"){for(const n in t.out){a=t.out[n];do Ae(this,a),a=a.next;while(a)}for(const n in t.in){a=t.in[n];do Ae(this,a),a=a.next;while(a)}}if(this.type!=="directed")for(const n in t.undirected){a=t.undirected[n];do Ae(this,a),a=a.next;while(a)}this._nodes.delete(e),this.emit("nodeDropped",{key:e,attributes:t.attributes})}dropEdge(e){let t;if(arguments.length>1){const a=""+arguments[0],n=""+arguments[1];if(t=j(this,a,n,this.type),!t)throw new C(`Graph.dropEdge: could not find the "${a}" -> "${n}" edge in the graph.`)}else if(e=""+e,t=this._edges.get(e),!t)throw new C(`Graph.dropEdge: could not find the "${e}" edge in the graph.`);return Ae(this,t),this}dropDirectedEdge(e,t){if(arguments.length<2)throw new I("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new I("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");e=""+e,t=""+t;const a=j(this,e,t,"directed");if(!a)throw new C(`Graph.dropDirectedEdge: could not find a "${e}" -> "${t}" edge in the graph.`);return Ae(this,a),this}dropUndirectedEdge(e,t){if(arguments.length<2)throw new I("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new I("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");const a=j(this,e,t,"undirected");if(!a)throw new C(`Graph.dropUndirectedEdge: could not find a "${e}" -> "${t}" edge in the graph.`);return Ae(this,a),this}clear(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit("cleared")}clearEdges(){const e=this._nodes.values();let t;for(;t=e.next(),t.done!==!0;)t.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit("edgesCleared")}getAttribute(e){return this._attributes[e]}getAttributes(){return this._attributes}hasAttribute(e){return this._attributes.hasOwnProperty(e)}setAttribute(e,t){return this._attributes[e]=t,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:e}),this}updateAttribute(e,t){if(typeof t!="function")throw new L("Graph.updateAttribute: updater should be a function.");const a=this._attributes[e];return this._attributes[e]=t(a),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:e}),this}removeAttribute(e){return delete this._attributes[e],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:e}),this}replaceAttributes(e){if(!U(e))throw new L("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=e,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this}mergeAttributes(e){if(!U(e))throw new L("Graph.mergeAttributes: provided attributes are not a plain object.");return B(this._attributes,e),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:e}),this}updateAttributes(e){if(typeof e!="function")throw new L("Graph.updateAttributes: provided updater is not a function.");return this._attributes=e(this._attributes),this.emit("attributesUpdated",{type:"update",attributes:this._attributes}),this}updateEachNodeAttributes(e,t){if(typeof e!="function")throw new L("Graph.updateEachNodeAttributes: expecting an updater function.");if(t&&!ra(t))throw new L("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");const a=this._nodes.values();let n,r;for(;n=a.next(),n.done!==!0;)r=n.value,r.attributes=e(r.key,r.attributes);this.emit("eachNodeAttributesUpdated",{hints:t||null})}updateEachEdgeAttributes(e,t){if(typeof e!="function")throw new L("Graph.updateEachEdgeAttributes: expecting an updater function.");if(t&&!ra(t))throw new L("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");const a=this._edges.values();let n,r,o,s;for(;n=a.next(),n.done!==!0;)r=n.value,o=r.source,s=r.target,r.attributes=e(r.key,r.attributes,o.key,s.key,o.attributes,s.attributes,r.undirected);this.emit("eachEdgeAttributesUpdated",{hints:t||null})}forEachAdjacencyEntry(e){if(typeof e!="function")throw new L("Graph.forEachAdjacencyEntry: expecting a callback.");ht(!1,!1,!1,this,e)}forEachAdjacencyEntryWithOrphans(e){if(typeof e!="function")throw new L("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");ht(!1,!1,!0,this,e)}forEachAssymetricAdjacencyEntry(e){if(typeof e!="function")throw new L("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");ht(!1,!0,!1,this,e)}forEachAssymetricAdjacencyEntryWithOrphans(e){if(typeof e!="function")throw new L("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");ht(!1,!0,!0,this,e)}nodes(){return Array.from(this._nodes.keys())}forEachNode(e){if(typeof e!="function")throw new L("Graph.forEachNode: expecting a callback.");const t=this._nodes.values();let a,n;for(;a=t.next(),a.done!==!0;)n=a.value,e(n.key,n.attributes)}findNode(e){if(typeof e!="function")throw new L("Graph.findNode: expecting a callback.");const t=this._nodes.values();let a,n;for(;a=t.next(),a.done!==!0;)if(n=a.value,e(n.key,n.attributes))return n.key}mapNodes(e){if(typeof e!="function")throw new L("Graph.mapNode: expecting a callback.");const t=this._nodes.values();let a,n;const r=new Array(this.order);let o=0;for(;a=t.next(),a.done!==!0;)n=a.value,r[o++]=e(n.key,n.attributes);return r}someNode(e){if(typeof e!="function")throw new L("Graph.someNode: expecting a callback.");const t=this._nodes.values();let a,n;for(;a=t.next(),a.done!==!0;)if(n=a.value,e(n.key,n.attributes))return!0;return!1}everyNode(e){if(typeof e!="function")throw new L("Graph.everyNode: expecting a callback.");const t=this._nodes.values();let a,n;for(;a=t.next(),a.done!==!0;)if(n=a.value,!e(n.key,n.attributes))return!1;return!0}filterNodes(e){if(typeof e!="function")throw new L("Graph.filterNodes: expecting a callback.");const t=this._nodes.values();let a,n;const r=[];for(;a=t.next(),a.done!==!0;)n=a.value,e(n.key,n.attributes)&&r.push(n.key);return r}reduceNodes(e,t){if(typeof e!="function")throw new L("Graph.reduceNodes: expecting a callback.");if(arguments.length<2)throw new L("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");let a=t;const n=this._nodes.values();let r,o;for(;r=n.next(),r.done!==!0;)o=r.value,a=e(a,o.key,o.attributes);return a}nodeEntries(){const e=this._nodes.values();return{[Symbol.iterator](){return this},next(){const t=e.next();if(t.done)return t;const a=t.value;return{value:{node:a.key,attributes:a.attributes},done:!1}}}}export(){const e=new Array(this._nodes.size);let t=0;this._nodes.forEach((n,r)=>{e[t++]=Ul(r,n)});const a=new Array(this._edges.size);return t=0,this._edges.forEach((n,r)=>{a[t++]=Ol(this.type,r,n)}),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:e,edges:a}}import(e,t=!1){if(e instanceof z)return e.forEachNode((l,h)=>{t?this.mergeNode(l,h):this.addNode(l,h)}),e.forEachEdge((l,h,d,u,c,f,g)=>{t?g?this.mergeUndirectedEdgeWithKey(l,d,u,h):this.mergeDirectedEdgeWithKey(l,d,u,h):g?this.addUndirectedEdgeWithKey(l,d,u,h):this.addDirectedEdgeWithKey(l,d,u,h)}),this;if(!U(e))throw new L("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(e.attributes){if(!U(e.attributes))throw new L("Graph.import: invalid attributes. Expecting a plain object.");t?this.mergeAttributes(e.attributes):this.replaceAttributes(e.attributes)}let a,n,r,o,s;if(e.nodes){if(r=e.nodes,!Array.isArray(r))throw new L("Graph.import: invalid nodes. Expecting an array.");for(a=0,n=r.length;a<n;a++){o=r[a],Hl(o);const{key:l,attributes:h}=o;t?this.mergeNode(l,h):this.addNode(l,h)}}if(e.edges){let l=!1;if(this.type==="undirected"&&(l=!0),r=e.edges,!Array.isArray(r))throw new L("Graph.import: invalid edges. Expecting an array.");for(a=0,n=r.length;a<n;a++){s=r[a],Vl(s);const{source:h,target:d,attributes:u,undirected:c=l}=s;let f;"key"in s?(f=t?c?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:c?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey,f.call(this,s.key,h,d,u)):(f=t?c?this.mergeUndirectedEdge:this.mergeDirectedEdge:c?this.addUndirectedEdge:this.addDirectedEdge,f.call(this,h,d,u))}}return this}nullCopy(e){const t=new z(B({},this._options,e));return t.replaceAttributes(B({},this.getAttributes())),t}emptyCopy(e){const t=this.nullCopy(e);return this._nodes.forEach((a,n)=>{const r=B({},a.attributes);a=new t.NodeDataClass(n,r),t._nodes.set(n,a)}),t}copy(e){if(e=e||{},typeof e.type=="string"&&e.type!==this.type&&e.type!=="mixed")throw new I(`Graph.copy: cannot create an incompatible copy from "${this.type}" type to "${e.type}" because this would mean losing information about the current graph.`);if(typeof e.multi=="boolean"&&e.multi!==this.multi&&e.multi!==!0)throw new I("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");if(typeof e.allowSelfLoops=="boolean"&&e.allowSelfLoops!==this.allowSelfLoops&&e.allowSelfLoops!==!0)throw new I("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");const t=this.emptyCopy(e),a=this._edges.values();let n,r;for(;n=a.next(),n.done!==!0;)r=n.value,Ja(t,"copy",!1,r.undirected,r.key,r.source.key,r.target.key,B({},r.attributes));return t}toJSON(){return this.export()}toString(){return"[object Graph]"}inspect(){const e={};this._nodes.forEach((r,o)=>{e[o]=r.attributes});const t={},a={};this._edges.forEach((r,o)=>{const s=r.undirected?"--":"->";let l="",h=r.source.key,d=r.target.key,u;r.undirected&&h>d&&(u=h,h=d,d=u);const c=`(${h})${s}(${d})`;o.startsWith("geid_")?this.multi&&(typeof a[c]>"u"?a[c]=0:a[c]++,l+=`${a[c]}. `):l+=`[${o}]: `,l+=c,t[l]=r.attributes});const n={};for(const r in this)this.hasOwnProperty(r)&&!oa.has(r)&&typeof this[r]!="function"&&typeof r!="symbol"&&(n[r]=this[r]);return n.attributes=this._attributes,n.nodes=e,n.edges=t,V(n,"constructor",this.constructor),n}}typeof Symbol<"u"&&(z.prototype[Symbol.for("nodejs.util.inspect.custom")]=z.prototype.inspect);ql.forEach(i=>{["add","merge","update"].forEach(e=>{const t=i.name(e),a=e==="add"?Ja:Zl;i.generateKey?z.prototype[t]=function(n,r,o){return a(this,t,!0,(i.type||this.type)==="undirected",null,n,r,o,e==="update")}:z.prototype[t]=function(n,r,o,s){return a(this,t,!1,(i.type||this.type)==="undirected",n,r,o,s,e==="update")}})});ol(z);bl(z);Il(z);Bl(z);class en extends z{constructor(e){const t=B({type:"directed"},e);if("multi"in t&&t.multi!==!1)throw new L("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if(t.type!=="directed")throw new L('DirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}}class tn extends z{constructor(e){const t=B({type:"undirected"},e);if("multi"in t&&t.multi!==!1)throw new L("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if(t.type!=="undirected")throw new L('UndirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}}class an extends z{constructor(e){const t=B({multi:!0},e);if("multi"in t&&t.multi!==!0)throw new L("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");super(t)}}class nn extends z{constructor(e){const t=B({type:"directed",multi:!0},e);if("multi"in t&&t.multi!==!0)throw new L("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if(t.type!=="directed")throw new L('MultiDirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}}class rn extends z{constructor(e){const t=B({type:"undirected",multi:!0},e);if("multi"in t&&t.multi!==!0)throw new L("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if(t.type!=="undirected")throw new L('MultiUndirectedGraph.from: inconsistent "'+t.type+'" type in given options!');super(t)}}function ke(i){i.from=function(e,t){const a=B({},e.options,t),n=new i(a);return n.import(e),n}}ke(z);ke(en);ke(tn);ke(an);ke(nn);ke(rn);z.Graph=z;z.DirectedGraph=en;z.UndirectedGraph=tn;z.MultiGraph=an;z.MultiDirectedGraph=nn;z.MultiUndirectedGraph=rn;z.InvalidArgumentsGraphError=L;z.NotFoundGraphError=C;z.UsageGraphError=I;export{jt as D,Hn as G,Te as P,ad as S,di as T,kt as a,id as b,z as c,Ql as d,Oe as e,_n as f,Jl as g,Kt as h,td as i,ed as j,mn as k,Dn as l,de as m,Nr as n,et as o,Zt as p,Qt as q,Yt as r,W as s,Eo as t,wo as u,An as v,ao as w,Gr as x};
