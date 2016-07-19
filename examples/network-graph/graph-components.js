const EVENT_TYPES = [
  // "click",
  "clickNode",
  // "clickNodes",
  "clickEdge",
  // "clickEdges",
  // "clickStage",
  // "doubleClick",
  "doubleClickNode",
  // "doubleClickNodes",
  "doubleClickEdge",
  // "doubleClickEdges",
  // "doubleClickStage",
  // "rightClick",
  "rightClickNode",
  "rightClickEdge",
  // "rightClickNodes",
  // "rightClickEdges",
  // "rightClickStage",
  "overNode",
  // "overNodes",
  "overEdge",
  // "overEdges",
  "outNode",
  // "outNodes",
  "outEdge",
  // "outEdges"
]

var GraphFactory = function(nodes, edges, sigmaSettings, providerFunctions){
  sigmaSettings = sigmaSettings || {};
  let defaultSettings = {
    graph: {
      nodes: nodes || [],
      edges: edges || []
    },
    renderer: {
      container: 'graph-container',
      type: "canvas"
    },
    settings: sigmaSettings
  }

  sigma.classes.graph.addMethod('accept', function(visitor){
    let _self = this;
    visitor.visit(_self);
  });

  sigma.classes.graph.attach('addNode', 'addVisitor', function(){
    let _self = this;
    let newNode = _self.nodesArray[_self.nodesArray.length-1]
    newNode.accept = function(visitor){
      visitor.visit(this);
    };
    if(providerFunctions[newNode.nodeType]){
      Object.keys(providerFunctions[newNode.nodeType].events).forEach(function(item){
        newNode[item] = providerFunctions[newNode.nodeType].events[item]
      })
    }
  });

  sigma.classes.graph.attach('addEdge', 'addVisitor', function(){
    let _self = this;
    let newEdge = _self.edgesArray[_self.edgesArray.length-1]
    newEdge.accept = function(visitor){
      visitor.visit(this);
    };
    if(providerFunctions[newEdge.edgeType]){
      Object.keys(providerFunctions[newEdge.edgeType].events).forEach(function(item){
        newEdge[item] = providerFunctions[newEdge.edgeType].events[item]
      })
    }
  })

  var s = new sigma($.extend(false, {}, defaultSettings, sigmaSettings));

  s.bind('overNode outNode clickNode doubleClickNode rightClickNode', function(e) {
    // console.log(e.data.node[e.type]);
    if(!!e.data.node[e.type]){
      e.data.node[e.type](e);
    }
  });
  s.bind('overEdge outEdge clickEdge doubleClickEdge rightClickEdge', function(e) {
    if(!!e.data.edge[e.type]){
      e.data.edge[e.type](e);
    }
  });
  return {
    graph: s,
    filter: new sigma.plugins.filter(s)
  };
}








