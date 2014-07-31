/**
* This plugin computes HITS statistics (Authority and Hub measures) for each node of the graph.
* It adds to the graph model a method called "HITS".
*
* Author: Mehdi El Fadil, Mango Information Systems
* License: This plugin for sigma.js follows the same licensing terms as sigma.js library.
* 
* This implementation is based on the original paper J. Kleinberg, Authoritative Sources in a Hyperlinked Environment (http://www.cs.cornell.edu/home/kleinber/auth.pdf), and is inspired by implementation in Gephi software (Patick J. McSweeney <pjmcswee@syr.edu>, Sebastien Heymann <seb@gephi.org>, Dual-licensed under GPL v3 and CDDL)
* https://github.com/Mango-information-systems/gephi/blob/fix-hits/modules/StatisticsPlugin/src/main/java/org/gephi/statistics/plugin/Hits.java
* 
* Bugs in Gephi implementation should not be found in this implementation.
* Tests have been put in place based on a test plan used to test implementation in Gephi, cf. discussion here: https://github.com/jacomyal/sigma.js/issues/309
* No guarantee is provided regarding the correctness of the calculations. Plugin author did not control the validity of the test scenarii.
* 
* Warning: tricky edge-case. Hubs and authorities for nodes without any edge are only reliable in an undirected graph calculation mode. 
* 
* Check the code for more information.
*
* Here is how to use it:
*
* > // directed graph
* > var stats = s.graph.HITS()
* > // returns an object indexed by node Id with the authority and hub measures
* > // like { "n0": {"authority": 0.00343, "hub": 0.023975}, "n1": [...]*
* 
* > // undirected graph: pass 'true' as function parameter
* > var stats = s.graph.HITS(true)
* > // returns an object indexed by node Id with the authority and hub measures
* > // like { "n0": {"authority": 0.00343, "hub": 0.023975}, "n1": [...]
*/

(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

/**
* This method takes a graph instance and returns authority and hub measures computed for each node. It uses the built-in
* indexes from sigma's graph model to search in the graph.
*
* @param {boolean} isUndirected flag informing whether the graph is directed or not. Default false: directed graph.
* @return {object} object indexed by node Ids, containing authority and hub measures for each node of the graph.
*/

  sigma.classes.graph.addMethod(
    'HITS',
    function(isUndirected) {
      var res = {}
      , epsilon = 0.0001
      , hubList = []
      , authList = []
      , nodes = this.nodes()
      , nodesCount = nodes.length
      , tempRes = {}

      if (!isUndirected)
        isUndirected = false

      for (var i in nodes) {
     
        if (isUndirected) {
          hubList.push(nodes[i])
          authList.push(nodes[i])
        }
        else {
          if (this.degree(nodes[i].id, 'out') > 0)
            hubList.push(nodes[i])
            
          if (this.degree(nodes[i].id, 'in') > 0)
            authList.push(nodes[i])
        }
        
        res[nodes[i].id] = { authority : 1, hub: 1 }
      }

      var done
      
      while (true) {
        done  = true
        var authSum = 0
          , hubSum = 0
        
        for (var i in authList) {
          
          tempRes[authList[i].id] = {authority : 1, hub:0 }
          
          var connectedNodes = []

          if (isUndirected)
            connectedNodes =  this.allNeighborsIndex[authList[i].id]
          else
            connectedNodes =  this.inNeighborsIndex[authList[i].id]
          
          for (var j in connectedNodes) {
            if (j != authList[i].id)
              tempRes[authList[i].id].authority += res[j].hub
          }
          
          authSum += tempRes[authList[i].id].authority
          
        }
        
        for (var i in hubList) {
          
          if (tempRes[hubList[i].id])
            tempRes[hubList[i].id].hub = 1
          else
            tempRes[hubList[i].id] = {authority: 0, hub : 1 }
          
          var connectedNodes = []
          
          if (isUndirected)
            connectedNodes =  this.allNeighborsIndex[hubList[i].id]
          else
            connectedNodes =  this.outNeighborsIndex[hubList[i].id]
          
          for (var j in connectedNodes) {
            if (j != hubList[i].id)
              tempRes[hubList[i].id].hub += res[j].authority
          }
          
          hubSum += tempRes[hubList[i].id].hub
          
        }
        
        for (var i in authList) {
          tempRes[authList[i].id].authority /= authSum
          
          if (Math.abs((tempRes[authList[i].id].authority - res[authList[i].id].authority) / res[authList[i].id].authority) >= epsilon)
            done = false
        }
        
        for (var i in hubList) {
          tempRes[hubList[i].id].hub /= hubSum
          
          if (Math.abs((tempRes[hubList[i].id].hub - res[hubList[i].id].hub) / res[hubList[i].id].hub) >= epsilon)
            done = false
        }
        res = tempRes
        
        tempRes = {}

        if (done)
          break
        
      }

      return res

    }
  )

}).call(window)
