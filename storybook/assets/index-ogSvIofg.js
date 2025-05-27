function l(u){for(var d=[],i=1;i<arguments.length;i++)d[i-1]=arguments[i];var n=Array.from(typeof u=="string"?[u]:u);n[n.length-1]=n[n.length-1].replace(/\r?\n([\t ]*)$/,"");var o=n.reduce(function(t,f){var a=f.match(/\n([\t ]+|(?!\s).)/g);return a?t.concat(a.map(function(g){var e,r;return(r=(e=g.match(/[\t ]/g))===null||e===void 0?void 0:e.length)!==null&&r!==void 0?r:0})):t},[]);if(o.length){var s=new RegExp(`
[	 ]{`+Math.min.apply(Math,o)+"}","g");n=n.map(function(t){return t.replace(s,`
`)})}n[0]=n[0].replace(/^\r?\n/,"");var c=n[0];return d.forEach(function(t,f){var a=c.match(/(?:^|\n)( *)$/),g=a?a[1]:"",e=t;typeof t=="string"&&t.includes(`
`)&&(e=String(t).split(`
`).map(function(r,h){return h===0?r:""+g+r}).join(`
`)),c+=e+n[f+1]}),c}export{l as d};
