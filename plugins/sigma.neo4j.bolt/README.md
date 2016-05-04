sigma.neo4j.bolt
====================

Plugin developed by [Andrea Santurbano](https://github.com/conker84).

---

This plugin provides connect to neo4j >= 3 via new bolt protocol using bolt javascript api (https://github.com/neo4j/neo4j-javascript-driver), parse the response and fill the graph with the `graph.read()` method.

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

Examples:
````javascript
// Create a connection to neo4j sever via bolt protocol on localhost,
// and instantiate a sigma graph the div#graph-container
sigma.neo4j.connect(
	{ auth : { principal : 'neo4j', password : 'andrea' } },
	{ container: 'graph-container' }
);

// Query neo4j to get all its node label (it returns a Promise object)
var labels = sigma.neo4j.getLabels();

// Query neo4j to get all its relationship type (it returns a Promise object)
var types = sigma.neo4j.getTypes();

// Query neo4j with a statement, the method <b>sigma.neo4j.queryStream(statement, params)</b> invokes
// the bolt stream js api where the results will be added to the graph as they arrive (it returns a Promise object)
var queryStream = sigma.neo4j
	.queryStream('MATCH (n{ name : "Kevin Bacon" })-[r]->(m) RETURN n, r, m LIMIT 10');
	
// You can use Promise api in order to manange the responses:
Promise.all([labels, types, queryStream]).then(function (values) {
    console.log("Node labels %o", values[0]);
    console.log("Relationship types %o", values[1]);
    console.log('query executed', values[2]);
});
````

````javascript
// Create a connection to neo4j sever via bolt protocol on localhost,
// and instantiate a sigma graph the div#graph-container
sigma.neo4j.connect(
	{ auth : { principal : 'neo4j', password : 'andrea' } },
	{ container: 'graph-container' }
);

// Query neo4j to get all its node label (it returns a Promise object)
sigma.neo4j.getLabels()
	.then(function(labels) {
        console.log("Node labels %o", labels);
    });

// Query neo4j to get all its relationship type (it returns a Promise object)
sigma.neo4j.getTypes()
	.then(function(types) {
        console.log("Relationship types %o", types);
    });

// Query neo4j with a statement, the method <b>sigma.neo4j.query(statement, params)</b> invokes
// the bolt Promise js api where the results will be displayed when all they are fetched from neo4j (it returns a Promise object)
sigma.neo4j.query('MATCH (n{name : "Kevin Bacon" })-[r]->(m) RETURN n, r, m LIMIT 10')
    .then(function (sigma) {
        console.log('query executed', sigma);
    });
````