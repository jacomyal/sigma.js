import{r as Oe,a as me}from"./getters-sgVfsx1C.js";import{r as Ae}from"./sigma-DZ8Rw7GN.js";import{g as Te}from"./_commonjsHelpers-BosuxZz1.js";import{r as Pe,a as Le}from"./index-BatcyEFM.js";var ke,be;function We(){if(be)return ke;be=1;function X(V){return function(L,d){return L+Math.floor(V()*(d-L+1))}}var U=X(Math.random);return U.createRandom=X,ke=U,ke}var De,_e;function Fe(){if(_e)return De;_e=1;var X=We().createRandom;function U(L){var d=X(L);return function(w){for(var o=w.length,f=o-1,p=-1;++p<o;){var O=d(p,f),m=w[O];w[O]=w[p],w[p]=m}}}var V=U(Math.random);return V.createShuffleInPlace=U,De=V,De}var Ce,Ge;function $e(){if(Ge)return Ce;Ge=1;var X=Oe(),U=Ae(),V=Fe(),L={attributes:{x:"x",y:"y"},center:0,hierarchyAttributes:[],rng:Math.random,scale:1};function d(n,i,s,l,h){this.wrappedCircle=h||null,this.children={},this.countChildren=0,this.id=n||null,this.next=null,this.previous=null,this.x=i||null,this.y=s||null,h?this.r=1010101:this.r=l||999}d.prototype.hasChildren=function(){return this.countChildren>0},d.prototype.addChild=function(n,i){this.children[n]=i,++this.countChildren},d.prototype.getChild=function(n){if(!this.children.hasOwnProperty(n)){var i=new d;this.children[n]=i,++this.countChildren}return this.children[n]},d.prototype.applyPositionToChildren=function(){if(this.hasChildren()){var n=this;for(var i in n.children){var s=n.children[i];s.x+=n.x,s.y+=n.y,s.applyPositionToChildren()}}};function w(n,i,s){for(var l in i.children){var h=i.children[l];h.hasChildren()?w(n,h,s):s[h.id]={x:h.x,y:h.y}}}function o(n,i){var s=n.r-i.r,l=i.x-n.x,h=i.y-n.y;return s<0||s*s<l*l+h*h}function f(n,i){var s=n.r-i.r+1e-6,l=i.x-n.x,h=i.y-n.y;return s>0&&s*s>l*l+h*h}function p(n,i){for(var s=0;s<i.length;++s)if(!f(n,i[s]))return!1;return!0}function O(n){return new d(null,n.x,n.y,n.r)}function m(n,i){var s=n.x,l=n.y,h=n.r,u=i.x,G=i.y,E=i.r,C=u-s,_=G-l,y=E-h,e=Math.sqrt(C*C+_*_);return new d(null,(s+u+C/e*y)/2,(l+G+_/e*y)/2,(e+h+E)/2)}function k(n,i,s){var l=n.x,h=n.y,u=n.r,G=i.x,E=i.y,C=i.r,_=s.x,y=s.y,e=s.r,W=l-G,H=l-_,a=h-E,r=h-y,R=C-u,b=e-u,j=l*l+h*h-u*u,$=j-G*G-E*E+C*C,A=j-_*_-y*y+e*e,c=H*a-W*r,K=(a*A-r*$)/(c*2)-l,q=(r*R-a*b)/c,ne=(H*$-W*A)/(c*2)-h,Q=(W*b-H*R)/c,ae=q*q+Q*Q-1,Y=2*(u+K*q+ne*Q),S=K*K+ne*ne-u*u,D=-(ae?(Y+Math.sqrt(Y*Y-4*ae*S))/(2*ae):S/Y);return new d(null,l+K+q*D,h+ne+Q*D,D)}function x(n){switch(n.length){case 1:return O(n[0]);case 2:return m(n[0],n[1]);case 3:return k(n[0],n[1],n[2]);default:throw new Error("graphology-layout/circlepack: Invalid basis length "+n.length)}}function re(n,i){var s,l;if(p(i,n))return[i];for(s=0;s<n.length;++s)if(o(i,n[s])&&p(m(n[s],i),n))return[n[s],i];for(s=0;s<n.length-1;++s)for(l=s+1;l<n.length;++l)if(o(m(n[s],n[l]),i)&&o(m(n[s],i),n[l])&&o(m(n[l],i),n[s])&&p(k(n[s],n[l],i),n))return[n[s],n[l],i];throw new Error("graphology-layout/circlepack: extendBasis failure !")}function ie(n){var i=n.wrappedCircle,s=n.next.wrappedCircle,l=i.r+s.r,h=(i.x*s.r+s.x*i.r)/l,u=(i.y*s.r+s.y*i.r)/l;return h*h+u*u}function we(n,i){var s=0,l=n.slice(),h=n.length,u=[],G,E;for(i(l);s<h;)G=l[s],E&&f(E,G)?++s:(u=re(u,G),E=x(u),s=0);return E}function ue(n,i,s){var l=n.x-i.x,h,u,G=n.y-i.y,E,C,_=l*l+G*G;_?(u=i.r+s.r,u*=u,C=n.r+s.r,C*=C,u>C?(h=(_+C-u)/(2*_),E=Math.sqrt(Math.max(0,C/_-h*h)),s.x=n.x-h*l-E*G,s.y=n.y-h*G+E*l):(h=(_+u-C)/(2*_),E=Math.sqrt(Math.max(0,u/_-h*h)),s.x=i.x+h*l-E*G,s.y=i.y+h*G+E*l)):(s.x=i.x+s.r,s.y=i.y)}function fe(n,i){var s=n.r+i.r-1e-6,l=i.x-n.x,h=i.y-n.y;return s>0&&s*s>l*l+h*h}function T(n,i){var s=n.length;if(s===0)return 0;var l,h,u,G,E,C,_,y,e,W;if(l=n[0],l.x=0,l.y=0,s<=1)return l.r;if(h=n[1],l.x=-h.r,h.x=l.r,h.y=0,s<=2)return l.r+h.r;u=n[2],ue(h,l,u),l=new d(null,null,null,null,l),h=new d(null,null,null,null,h),u=new d(null,null,null,null,u),l.next=u.previous=h,h.next=l.previous=u,u.next=h.previous=l;e:for(C=3;C<s;++C){u=n[C],ue(l.wrappedCircle,h.wrappedCircle,u),u=new d(null,null,null,null,u),_=h.next,y=l.previous,e=h.wrappedCircle.r,W=l.wrappedCircle.r;do if(e<=W){if(fe(_.wrappedCircle,u.wrappedCircle)){h=_,l.next=h,h.previous=l,--C;continue e}e+=_.wrappedCircle.r,_=_.next}else{if(fe(y.wrappedCircle,u.wrappedCircle)){l=y,l.next=h,h.previous=l,--C;continue e}W+=y.wrappedCircle.r,y=y.previous}while(_!==y.next);for(u.previous=l,u.next=h,l.next=h.previous=h=u,G=ie(l);(u=u.next)!==h;)(E=ie(u))<G&&(l=u,G=E);h=l.next}l=[h.wrappedCircle],u=h;for(var H=1e4;(u=u.next)!==h&&--H!==0;)l.push(u.wrappedCircle);for(u=we(l,i),C=0;C<s;++C)l=n[C],l.x-=u.x,l.y-=u.y;return u.r}function F(n,i){var s=0;if(n.hasChildren()){for(var l in n.children){var h=n.children[l];h.hasChildren()&&(h.r=F(h,i))}s=T(Object.values(n.children),i)}return s}function P(n,i){F(n,i);for(var s in n.children){var l=n.children[s];l.applyPositionToChildren()}}function J(n,i,s){if(!U(i))throw new Error("graphology-layout/circlepack: the given graph is not a valid graphology instance.");s=X(s,L);var l={},h={},u=i.nodes(),G=s.center,E=s.hierarchyAttributes,C=V.createShuffleInPlace(s.rng),_=s.scale,y=new d;i.forEachNode(function(R,b){var j=b.size?b.size:1,$=new d(R,null,null,j),A=y;E.forEach(function(c){var K=b[c];A=A.getChild(K)}),A.addChild(R,$)}),P(y,C),w(i,y,l);var e=u.length,W,H,a;for(a=0;a<e;a++){var r=u[a];W=G+_*l[r].x,H=G+_*l[r].y,h[r]={x:W,y:H},n&&(i.setNodeAttribute(r,s.attributes.x,W),i.setNodeAttribute(r,s.attributes.y,H))}return h}var Z=J.bind(null,!1);return Z.assign=J.bind(null,!0),Ce=Z,Ce}var Re,Se;function qe(){return Se||(Se=1,Re=function(){var U,V,L={};(function(){var w=0,o=1,f=2,p=3,O=4,m=5,k=6,x=7,re=8,ie=9,we=0,ue=1,fe=2,T=0,F=1,P=2,J=3,Z=4,n=5,i=6,s=7,l=8,h=3,u=10,G=3,E=9,C=10;L.exports=function(y,e,W){var H,a,r,R,b,j,$,A,c,K,q=e.length,ne=W.length,Q=y.adjustSizes,ae=y.barnesHutTheta*y.barnesHutTheta,Y,S,D,I,B,g,v,t=[];for(r=0;r<q;r+=u)e[r+O]=e[r+f],e[r+m]=e[r+p],e[r+f]=0,e[r+p]=0;if(y.outboundAttractionDistribution){for(Y=0,r=0;r<q;r+=u)Y+=e[r+k];Y/=q/u}if(y.barnesHutOptimize){var M=1/0,te=-1/0,N=1/0,se=-1/0,z,le,Ee;for(r=0;r<q;r+=u)M=Math.min(M,e[r+w]),te=Math.max(te,e[r+w]),N=Math.min(N,e[r+o]),se=Math.max(se,e[r+o]);var ce=te-M,ve=se-N;for(ce>ve?(N-=(ce-ve)/2,se=N+ce):(M-=(ve-ce)/2,te=M+ve),t[0+T]=-1,t[0+F]=(M+te)/2,t[0+P]=(N+se)/2,t[0+J]=Math.max(te-M,se-N),t[0+Z]=-1,t[0+n]=-1,t[0+i]=0,t[0+s]=0,t[0+l]=0,H=1,r=0;r<q;r+=u)for(a=0,Ee=h;;)if(t[a+n]>=0){e[r+w]<t[a+F]?e[r+o]<t[a+P]?z=t[a+n]:z=t[a+n]+E:e[r+o]<t[a+P]?z=t[a+n]+E*2:z=t[a+n]+E*3,t[a+s]=(t[a+s]*t[a+i]+e[r+w]*e[r+k])/(t[a+i]+e[r+k]),t[a+l]=(t[a+l]*t[a+i]+e[r+o]*e[r+k])/(t[a+i]+e[r+k]),t[a+i]+=e[r+k],a=z;continue}else if(t[a+T]<0){t[a+T]=r;break}else{if(t[a+n]=H*E,A=t[a+J]/2,c=t[a+n],t[c+T]=-1,t[c+F]=t[a+F]-A,t[c+P]=t[a+P]-A,t[c+J]=A,t[c+Z]=c+E,t[c+n]=-1,t[c+i]=0,t[c+s]=0,t[c+l]=0,c+=E,t[c+T]=-1,t[c+F]=t[a+F]-A,t[c+P]=t[a+P]+A,t[c+J]=A,t[c+Z]=c+E,t[c+n]=-1,t[c+i]=0,t[c+s]=0,t[c+l]=0,c+=E,t[c+T]=-1,t[c+F]=t[a+F]+A,t[c+P]=t[a+P]-A,t[c+J]=A,t[c+Z]=c+E,t[c+n]=-1,t[c+i]=0,t[c+s]=0,t[c+l]=0,c+=E,t[c+T]=-1,t[c+F]=t[a+F]+A,t[c+P]=t[a+P]+A,t[c+J]=A,t[c+Z]=t[a+Z],t[c+n]=-1,t[c+i]=0,t[c+s]=0,t[c+l]=0,H+=4,e[t[a+T]+w]<t[a+F]?e[t[a+T]+o]<t[a+P]?z=t[a+n]:z=t[a+n]+E:e[t[a+T]+o]<t[a+P]?z=t[a+n]+E*2:z=t[a+n]+E*3,t[a+i]=e[t[a+T]+k],t[a+s]=e[t[a+T]+w],t[a+l]=e[t[a+T]+o],t[z+T]=t[a+T],t[a+T]=-1,e[r+w]<t[a+F]?e[r+o]<t[a+P]?le=t[a+n]:le=t[a+n]+E:e[r+o]<t[a+P]?le=t[a+n]+E*2:le=t[a+n]+E*3,z===le)if(Ee--){a=z;continue}else{Ee=h;break}t[le+T]=r;break}}if(y.barnesHutOptimize)for(S=y.scalingRatio,r=0;r<q;r+=u)for(a=0;;)if(t[a+n]>=0)if(g=Math.pow(e[r+w]-t[a+s],2)+Math.pow(e[r+o]-t[a+l],2),K=t[a+J],4*K*K/g<ae){if(D=e[r+w]-t[a+s],I=e[r+o]-t[a+l],Q===!0?g>0?(v=S*e[r+k]*t[a+i]/g,e[r+f]+=D*v,e[r+p]+=I*v):g<0&&(v=-S*e[r+k]*t[a+i]/Math.sqrt(g),e[r+f]+=D*v,e[r+p]+=I*v):g>0&&(v=S*e[r+k]*t[a+i]/g,e[r+f]+=D*v,e[r+p]+=I*v),a=t[a+Z],a<0)break;continue}else{a=t[a+n];continue}else{if(j=t[a+T],j>=0&&j!==r&&(D=e[r+w]-e[j+w],I=e[r+o]-e[j+o],g=D*D+I*I,Q===!0?g>0?(v=S*e[r+k]*e[j+k]/g,e[r+f]+=D*v,e[r+p]+=I*v):g<0&&(v=-S*e[r+k]*e[j+k]/Math.sqrt(g),e[r+f]+=D*v,e[r+p]+=I*v):g>0&&(v=S*e[r+k]*e[j+k]/g,e[r+f]+=D*v,e[r+p]+=I*v)),a=t[a+Z],a<0)break;continue}else for(S=y.scalingRatio,R=0;R<q;R+=u)for(b=0;b<R;b+=u)D=e[R+w]-e[b+w],I=e[R+o]-e[b+o],Q===!0?(g=Math.sqrt(D*D+I*I)-e[R+re]-e[b+re],g>0?(v=S*e[R+k]*e[b+k]/g/g,e[R+f]+=D*v,e[R+p]+=I*v,e[b+f]-=D*v,e[b+p]-=I*v):g<0&&(v=100*S*e[R+k]*e[b+k],e[R+f]+=D*v,e[R+p]+=I*v,e[b+f]-=D*v,e[b+p]-=I*v)):(g=Math.sqrt(D*D+I*I),g>0&&(v=S*e[R+k]*e[b+k]/g/g,e[R+f]+=D*v,e[R+p]+=I*v,e[b+f]-=D*v,e[b+p]-=I*v));for(c=y.gravity/y.scalingRatio,S=y.scalingRatio,r=0;r<q;r+=u)v=0,D=e[r+w],I=e[r+o],g=Math.sqrt(Math.pow(D,2)+Math.pow(I,2)),y.strongGravityMode?g>0&&(v=S*e[r+k]*c):g>0&&(v=S*e[r+k]*c/g),e[r+f]-=D*v,e[r+p]-=I*v;for(S=1*(y.outboundAttractionDistribution?Y:1),$=0;$<ne;$+=G)R=W[$+we],b=W[$+ue],A=W[$+fe],B=Math.pow(A,y.edgeWeightInfluence),D=e[R+w]-e[b+w],I=e[R+o]-e[b+o],Q===!0?(g=Math.sqrt(D*D+I*I)-e[R+re]-e[b+re],y.linLogMode?y.outboundAttractionDistribution?g>0&&(v=-S*B*Math.log(1+g)/g/e[R+k]):g>0&&(v=-S*B*Math.log(1+g)/g):y.outboundAttractionDistribution?g>0&&(v=-S*B/e[R+k]):g>0&&(v=-S*B)):(g=Math.sqrt(Math.pow(D,2)+Math.pow(I,2)),y.linLogMode?y.outboundAttractionDistribution?g>0&&(v=-S*B*Math.log(1+g)/g/e[R+k]):g>0&&(v=-S*B*Math.log(1+g)/g):y.outboundAttractionDistribution?(g=1,v=-S*B/e[R+k]):(g=1,v=-S*B)),g>0&&(e[R+f]+=D*v,e[R+p]+=I*v,e[b+f]-=D*v,e[b+p]-=I*v);var oe,he,ge,ee,pe,ye;if(Q===!0)for(r=0;r<q;r+=u)e[r+ie]!==1&&(oe=Math.sqrt(Math.pow(e[r+f],2)+Math.pow(e[r+p],2)),oe>C&&(e[r+f]=e[r+f]*C/oe,e[r+p]=e[r+p]*C/oe),he=e[r+k]*Math.sqrt((e[r+O]-e[r+f])*(e[r+O]-e[r+f])+(e[r+m]-e[r+p])*(e[r+m]-e[r+p])),ge=Math.sqrt((e[r+O]+e[r+f])*(e[r+O]+e[r+f])+(e[r+m]+e[r+p])*(e[r+m]+e[r+p]))/2,ee=.1*Math.log(1+ge)/(1+Math.sqrt(he)),pe=e[r+w]+e[r+f]*(ee/y.slowDown),e[r+w]=pe,ye=e[r+o]+e[r+p]*(ee/y.slowDown),e[r+o]=ye);else for(r=0;r<q;r+=u)e[r+ie]!==1&&(he=e[r+k]*Math.sqrt((e[r+O]-e[r+f])*(e[r+O]-e[r+f])+(e[r+m]-e[r+p])*(e[r+m]-e[r+p])),ge=Math.sqrt((e[r+O]+e[r+f])*(e[r+O]+e[r+f])+(e[r+m]+e[r+p])*(e[r+m]+e[r+p]))/2,ee=e[r+x]*Math.log(1+ge)/(1+Math.sqrt(he)),e[r+x]=Math.min(1,Math.sqrt(ee*(Math.pow(e[r+f],2)+Math.pow(e[r+p],2))/(1+Math.sqrt(he)))),pe=e[r+w]+e[r+f]*(ee/y.slowDown),e[r+w]=pe,ye=e[r+o]+e[r+p]*(ee/y.slowDown),e[r+o]=ye);return{}}})();var d=L.exports;self.addEventListener("message",function(w){var o=w.data;U=new Float32Array(o.nodes),o.edges&&(V=new Float32Array(o.edges)),d(o.settings,U,V),self.postMessage({nodes:U.buffer},[U.buffer])})}),Re}var Ie,de;function Ue(){if(de)return Ie;de=1;var X=qe(),U=Ae(),V=me().createEdgeWeightGetter,L=Pe(),d=Le();function w(o,f){if(f=f||{},!U(o))throw new Error("graphology-layout-forceatlas2/worker: the given graph is not a valid graphology instance.");var p=V("getEdgeWeight"in f?f.getEdgeWeight:"weight").fromEntry,O=L.assign({},d,f.settings),m=L.validateSettings(O);if(m)throw new Error("graphology-layout-forceatlas2/worker: "+m.message);this.worker=null,this.graph=o,this.settings=O,this.getEdgeWeight=p,this.matrices=null,this.running=!1,this.killed=!1,this.outputReducer=typeof f.outputReducer=="function"?f.outputReducer:null,this.handleMessage=this.handleMessage.bind(this);var k=void 0,x=this;this.handleGraphUpdate=function(){x.worker&&x.worker.terminate(),k&&clearTimeout(k),k=setTimeout(function(){k=void 0,x.spawnWorker()},0)},o.on("nodeAdded",this.handleGraphUpdate),o.on("edgeAdded",this.handleGraphUpdate),o.on("nodeDropped",this.handleGraphUpdate),o.on("edgeDropped",this.handleGraphUpdate),this.spawnWorker()}return w.prototype.isRunning=function(){return this.running},w.prototype.spawnWorker=function(){this.worker&&this.worker.terminate(),this.worker=L.createWorker(X),this.worker.addEventListener("message",this.handleMessage),this.running&&(this.running=!1,this.start())},w.prototype.handleMessage=function(o){if(this.running){var f=new Float32Array(o.data.nodes);L.assignLayoutChanges(this.graph,f,this.outputReducer),this.outputReducer&&L.readGraphPositions(this.graph,f),this.matrices.nodes=f,this.askForIterations()}},w.prototype.askForIterations=function(o){var f=this.matrices,p={settings:this.settings,nodes:f.nodes.buffer},O=[f.nodes.buffer];return o&&(p.edges=f.edges.buffer,O.push(f.edges.buffer)),this.worker.postMessage(p,O),this},w.prototype.start=function(){if(this.killed)throw new Error("graphology-layout-forceatlas2/worker.start: layout was killed.");return this.running?this:(this.matrices=L.graphToByteArrays(this.graph,this.getEdgeWeight),this.running=!0,this.askForIterations(!0),this)},w.prototype.stop=function(){return this.running=!1,this},w.prototype.kill=function(){if(this.killed)return this;this.running=!1,this.killed=!0,this.matrices=null,this.worker.terminate(),this.graph.removeListener("nodeAdded",this.handleGraphUpdate),this.graph.removeListener("edgeAdded",this.handleGraphUpdate),this.graph.removeListener("nodeDropped",this.handleGraphUpdate),this.graph.removeListener("edgeDropped",this.handleGraphUpdate)},Ie=w,Ie}var He=Ue();const Je=Te(He);export{Je as F,$e as r};
