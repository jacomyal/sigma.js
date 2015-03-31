sigma.parsers.json
==================

Plugin developed by [Benoît Simard](https://github.com/sim51).

---

This plugin provides a single function, `sigma.parsers.cypher()`, that will run a cypher query on a neo4j instance, parse th response, eventually instanciate sigma and fill the graph with the `graph.read()` method.

Node are create with the following structure :
 * id -> Neo4j node id
 * label -> Neo4j node id
 * neo4j_labels -> Labels of Neo4j node
 * neo4j_data -> All the properties of the neo4j node

Edge are create with the following structure :
      * id -> Neo4j edge id
      * label -> Neo4j edge type
      * neo4j_type -> Neo4j edge type
      * neo4j_data -> All the properties of Neo4j node

The most basic way to use this helper is to call it with a neo4j server url and a cypher query. It will then instanciate sigma, but after having added the graph into the config object.

For neo4j < 2.2
````javascript
sigma.parsers.cypher(
  'http://localhost:7474',
  'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100',
  { container: 'myContainer' }
);
````

For neo4j >= 2.2, you must set pass a neo4j user with its password.
````javascript
sigma.parsers.cypher(
  'http://localhost:7474',
  'neo4j',
  'admin'
  ''MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100',
  { container: 'myContainer' }
);
````

It is also possible to update an existing instance's graph instead.

````javascript
sigma.parsers.cypher(
  'http://localhost:7474',
  'neo4j',
  'admin'
  'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100',
  myExistingInstance,
  function() {
    myExistingInstance.refresh();
  }
);
````
