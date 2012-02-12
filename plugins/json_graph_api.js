// Mathieu Jacomy @ Sciences Po Médialab & WebAtlas
// version 0.2
var json_graph_api = {
	parseGEXF: function(gexf, graph){
		var viz='http://www.gexf.net/1.2draft/viz';	// Vis namespace
		
		// Parse Attributes
		// This is confusing, so I'll comment heavily
		var nodesAttributes = [];	// The list of attributes of the nodes of the graph that we build in json
		var edgesAttributes = [];	// The list of attributes of the edges of the graph that we build in json
		var attributesNodes = gexf.getElementsByTagName('attributes');	// In the gexf (that is an xml), the list of xml nodes 'attributes' (note the plural 's')
		
		for(i = 0; i<attributesNodes.length; i++){
			var attributesNode = attributesNodes[i];	// attributesNode is each xml node 'attributes' (plural)
			if(attributesNode.getAttribute('class') == 'node'){
				var attributeNodes = attributesNode.getElementsByTagName('attribute');	// The list of xml nodes 'attribute' (no 's')
				for(ii = 0; ii<attributeNodes.length; ii++){
					var attributeNode = attributeNodes[ii];	// Each xml node 'attribute'
					
					var id = attributeNode.getAttribute('id'),
						title = attributeNode.getAttribute('title'),
						type = attributeNode.getAttribute('type');
					
					var attribute = {id:id, title:title, type:type};
					nodesAttributes.push(attribute);
					
				}
			} else if(attributesNode.getAttribute('class') == 'edge'){
				var attributeNodes = attributesNode.getElementsByTagName('attribute');	// The list of xml nodes 'attribute' (no 's')
				for(ii = 0; ii<attributeNodes.length; ii++){
					var attributeNode = attributeNodes[ii];	// Each xml node 'attribute'
					
					var id = attributeNode.getAttribute('id'),
						title = attributeNode.getAttribute('title'),
						type = attributeNode.getAttribute('type');
						
					var attribute = {id:id, title:title, type:type};
					edgesAttributes.push(attribute);
					
				}
			}
		}
		
		var nodes = [];	// The nodes of the graph
		var nodesNodes = gexf.getElementsByTagName('nodes')	// The list of xml nodes 'nodes' (plural)
		
		for(i=0; i<nodesNodes.length; i++){
			var nodesNode = nodesNodes[i];	// Each xml node 'nodes' (plural)
			var nodeNodes = nodesNode.getElementsByTagName('node');	// The list of xml nodes 'node' (no 's')
			for(ii=0; ii<nodeNodes.length; ii++){
				var nodeNode = nodeNodes[ii];	// Each xml node 'node' (no 's')
				
				var id = nodeNode.getAttribute('id');
				var label = nodeNode.getAttribute('label') || id;
				
				//viz
				var size = 1;
				var x = 100 - 200*Math.random();
				var y = 100 - 200*Math.random();
				var color = {r:0, g:0, b:0};
				
				var sizeNodes = nodeNode.getElementsByTagName('size');
				if(sizeNodes.length>0){
					sizeNode = sizeNodes[0];
					size = parseFloat(sizeNode.getAttribute('value'));
				}
				var positionNodes = nodeNode.getElementsByTagName('position');
				if(positionNodes.length>0){
					var positionNode = positionNodes[0];
					x = parseFloat(positionNode.getAttribute('x'));
					y = parseFloat(positionNode.getAttribute('y'));
				}
				var colorNodes = nodeNode.getElementsByTagName('color');
				if(colorNodes.length>0){
					colorNode = colorNodes[0];
					color = '#'+sigma.tools.rgbToHex(parseFloat(colorNode.getAttribute('r')),
														 							 parseFloat(colorNode.getAttribute('g')),
														 							 parseFloat(colorNode.getAttribute('b')));
				}
				
				// Create Node
				var node = {label:label, size:size, x:x, y:y, attributes:[], color:color};	// The graph node
				
				// Attribute values
				var attvalueNodes = nodeNode.getElementsByTagName('attvalue');
				for(iii=0; iii<attvalueNodes.length; iii++){
					var attvalueNode = attvalueNodes[iii];
					var attr = attvalueNode.getAttribute('for');
					var val = attvalueNode.getAttribute('value');
					node.attributes.push({attr:attr, val:val});
				}

				// Hack for sigma.js
				try{
					graph.addNode(id,node);
				}catch(e){
					console.log('catch error',e);	
				}
			}
		}

		var edges = [];
		var edgeId = 0;
		var edgesNodes = gexf.getElementsByTagName('edges');
		for(i=0; i<edgesNodes.length; i++){
			var edgesNode = edgesNodes[i];
			var edgeNodes = edgesNode.getElementsByTagName('edge');
			for(ii=0; ii<edgeNodes.length; ii++){
				var edgeNode = edgeNodes[ii];
				var source = edgeNode.getAttribute('source');
				var target = edgeNode.getAttribute('target');
				var edge = {id:ii, sourceID:source, targetID:target, attributes:[]};
				var attvalueNodes = edgeNode.getElementsByTagName('attvalue');
				for(iii=0; iii<attvalueNodes.length; iii++){
					var attvalueNode = attvalueNodes[iii];
					var attr = attvalueNode.getAttribute('for');
					var al = attvalueNode.getAttribute('value');
					edge.attributes.push({attr:attr, val:val});
				}

				// Hack for sigma.js
				graph.addEdge(edgeId++,source,target,edge);
			}
		}
	}
}