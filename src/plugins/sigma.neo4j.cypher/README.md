sigma.neo4j.cypher
====================

Plugin developed by [Benoît Simard](https://github.com/sim51).

---

This plugin provides a simple function, `sigma.neo4j.cypher()`, that will run a cypher query on a neo4j instance, parse the response, eventually instantiate sigma and fill the graph with the `graph.read()` method.

Nodes are created with the following structure :
 * id -> Neo4j node id
 * label -> Neo4j node id
 * neo4j_labels -> Labels of Neo4j node
 * neo4j_data -> All the properties of the neo4j node

Edges are created with the following structure :
 * id -> Neo4j edge id
 * label -> Neo4j edge type
 * neo4j_type -> Neo4j edge type
 * neo4j_data -> All the properties of Neo4j relationship

The most basic way to use this helper is to call it with a neo4j server url and a cypher query. It will then instantiate sigma, but after having added the graph into the config object.

For neo4j < 2.2
````javascript
sigma.neo4j.cypher(
  'http://localhost:7474',
  'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100',
  { container: 'myContainer' }
);
````

For neo4j >= 2.2, you must pass a neo4j user with its password. So instead of the neo4j url, you have to pass a neo4j server object like this :  
````javascript
sigma.neo4j.cypher(
  { url: 'http://localhost:7474', user:'neo4j', password:'admin' },
  'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100',
  { container: 'myContainer' }
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
