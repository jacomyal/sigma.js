/**
 * This example aims at showcasing sigma's performances.
 */

import arrow from 'apache-arrow';

async function request(obj) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(obj.method || 'GET', obj.url || obj);
    if (obj.headers) {
      Object.keys(obj.headers).forEach(key => { xhr.setRequestHeader(key, obj.headers[key]); });
    }
    xhr.onload = () => {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      } catch (e) { reject(e); }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(obj.body);
  });
}

const SERVER             = 'http://localhost:3010';
const DATASET_ROUTE      = '/graphology/read_large_demo?filename=../../public/fewer-edges.json';
const NODES_ROUTE        = '/graphology/get_column/nodes';
const NODES_BOUNDS_ROUTE = '/graphology/nodes/bounds';
const NODES_BUFFER_ROUTE = '/graphology/nodes';
const EDGES_BUFFER_ROUTE = '/graphology/edges';
const TABLE_ROUTE        = '/graphology/get_table';

const GpuLoader = {
  init: async ()          => request({method: 'POST', url: SERVER + DATASET_ROUTE, mode: 'no-cors'}),
  getTable: async (table) => {
    const result = await fetch(SERVER + TABLE_ROUTE + '/' + table, {method: 'GET', headers: {'Access-Control-Allow-Origin': '*'}})
    return arrow.tableFromIPC(result);
  },
  getColumn: async (table, column) => {
    const table_route  = {'nodes': '/graphology/get_column/nodes/'}[table];
    const column_route = SERVER + table_route + column;
    const result = await fetch(column_route, {method: 'GET', headers: {'Access-Control-Allow-Origin': '*'}});
    return arrow.tableFromIPC(result);
  },
  getNodesBounds: async () => request(SERVER + NODES_BOUNDS_ROUTE),
  getNodesBuffer: async () => {
    const route = SERVER + NODES_BUFFER_ROUTE;
    const result = await fetch(route, {method: 'GET', headers: {'Access-Control-Allow-Origin': '*'}});
    return arrow.tableFromIPC(result);
  },
  getEdgesBuffer: async () => {
    const route = SERVER + EDGES_BUFFER_ROUTE;
    const result = await fetch(route, {method: 'GET', headers: {'Access-Control-Allow-Origin': '*'}});
    return arrow.tableFromIPC(result);
  }
};

export default GpuLoader;
