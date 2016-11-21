sigma.neo4j.cypher
====================

Plugin developed by [Benoît Simard](https://github.com/sim51).

---

This plugin provides a simple function, `sigma.neo4j.cypher()`, that will run a cypher query on a neo4j instance, parse the response, eventually instantiate sigma and fill the graph with the `graph.read()` method.

Nodes and Edges created using producer = { nodes: function(neo4j_node): sigma_node, edges: function(neo4j_node): sigma_node }, if producer is not specified plugin is using sigma.neo4j.defaultProducers =
````javascript
    {
        node: function(node) {
            return {
                id : node.id,
                label : node.id,
                x : Math.random(),
                y : Math.random(),
                size : 1,
                color : '#666666',
                neo4j_labels : node.labels,
                neo4j_data : node.properties
            }
        },
        edge: function(edge) {
            return {
                id : edge.id,
                label : edge.type,
                source : edge.startNode,
                target : edge.endNode,
                color : '#7D7C8E',
                neo4j_type : edge.type,
                neo4j_data : edge.properties
            }
        }
    }
````

The most basic way to use this helper is to call it with a neo4j server url and a cypher query. It will then instantiate sigma, but after having added the graph into the config object.

For neo4j < 2.2
````javascript
sigma.neo4j.cypher(
  'http://localhost:7474',
  'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100',
  { container: 'myContainer' },
  producers
);
````

For neo4j >= 2.2, you must pass a neo4j user with its password. So instead of the neo4j url, you have to pass a neo4j server object like this :  
````javascript
sigma.neo4j.cypher(
  { url: 'http://localhost:7474', user:'neo4j', password:'admin' },
  'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100',
  { container: 'myContainer' },
  producers
);
````

It is also possible to update an existing instance's graph instead.

````javascript
sigma.neo4j.cypher(
  { url: 'http://localhost:7474', user:'neo4j', password:'admin' },
  'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100',
  myExistingInstance,
  function() {
    myExistingInstance.refresh();
  }
);
````

There is two additional functions provided by the plugin :

 * ```sigma.neo4j.getTypes({ url: 'http://localhost:7474', user:'neo4j', password:'admin' }, callback)``` : Return all relationship type of the database
 * ```sigma.neo4j.getLabels({ url: 'http://localhost:7474', user:'neo4j', password:'admin' }, callback)``` : Return all node label of the database 
