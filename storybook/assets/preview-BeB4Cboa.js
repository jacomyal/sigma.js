let o=!1;const s=(e,t)=>{if(o){const r=new URLSearchParams(window.parent.location.search);return r.set("args",Object.keys(t.args).map(a=>`${a}:${t.args[a]}`).join(";")),history.pushState(null,"","?"+r.toString()),window.location.reload(),`<div style="height:100%;width:100%;">
      ${e()}
      <script>document.body.style.visibility = 'hidden';<\/script>
    </div>`}return o=!0,e()},i={decorators:[s]};export{i as default};
