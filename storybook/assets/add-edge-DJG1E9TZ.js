var f={},r;function c(){return r||(r=1,f.addEdge=function(n,E,d,i,l,e){return E?d==null?n.addUndirectedEdge(i,l,e):n.addUndirectedEdgeWithKey(d,i,l,e):d==null?n.addDirectedEdge(i,l,e):n.addDirectedEdgeWithKey(d,i,l,e)},f.copyEdge=function(n,E,d,i,l,e){return e=Object.assign({},e),E?d==null?n.addUndirectedEdge(i,l,e):n.addUndirectedEdgeWithKey(d,i,l,e):d==null?n.addDirectedEdge(i,l,e):n.addDirectedEdgeWithKey(d,i,l,e)},f.mergeEdge=function(n,E,d,i,l,e){return E?d==null?n.mergeUndirectedEdge(i,l,e):n.mergeUndirectedEdgeWithKey(d,i,l,e):d==null?n.mergeDirectedEdge(i,l,e):n.mergeDirectedEdgeWithKey(d,i,l,e)},f.updateEdge=function(n,E,d,i,l,e){return E?d==null?n.updateUndirectedEdge(i,l,e):n.updateUndirectedEdgeWithKey(d,i,l,e):d==null?n.updateDirectedEdge(i,l,e):n.updateDirectedEdgeWithKey(d,i,l,e)}),f}export{c as r};
