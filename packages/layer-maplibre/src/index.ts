import Graph from "graphology";
import { Attributes } from "graphology-types";
import { LngLat, Map, MapOptions } from "maplibre-gl";
import { Sigma } from "sigma";

import { graphToLatlng, latlngToGraph, syncMapWithSigma, syncSigmaWithMap } from "./utils";

/**
 * On the graph, we store the 2D projection of the geographical lat/long.
 *
 * @param sigma The sigma instance
 * @param opts.mapOptions Options that will be provided to map constructor.
 * @param opts.getNodeLatLng Function to retrieve lat/long values from a node's attributs (default is lat & lng)
 */
export default function bindMaplibreLayer(
  sigma: Sigma,
  opts?: {
    mapOptions?: Omit<MapOptions, "container" | "center" | "zoom" | "minPitch" | "maxPitch">;
    getNodeLatLng?: (nodeAttributes: Attributes) => { lat: number; lng: number };
  },
) {
  // Keeping data for the cleanup
  let isKilled = false;
  const prevSigmaSettings = sigma.getSettings();

  // Creating map container
  const mapLayerName = "layer-maplibre";
  const mapContainer = sigma.createLayer(mapLayerName, "div", {
    style: { position: "absolute", inset: "0" },
    // 'edges' is the first sigma layer
    beforeLayer: "edges",
  });
  sigma.getContainer().prepend(mapContainer);

  // Initialize the map
  const map = new Map({
    container: mapContainer,
    style: "https://demotiles.maplibre.org/style.json",
    center: [0, 0],
    zoom: 1,
    minPitch: 0,
    maxPitch: 0,
    ...(opts?.mapOptions || {}),
  });

  // `stagePadding: 0` is mandatory, so the bbox of the map & Sigma is the same.
  sigma.setSetting("stagePadding", 0);

  // disable camera rotation
  sigma.setSetting("enableCameraRotation", false);

  // Function that change the given graph by generating the sigma x,y coords by taking the geo coordinates
  // and project them in the 2D space of the map
  function updateGraphCoordinates(graph: Graph) {
    graph.updateEachNodeAttributes((_node, attrs) => {
      const coords = latlngToGraph(
        map,
        opts?.getNodeLatLng ? opts.getNodeLatLng(attrs) : { lat: attrs.lat, lng: attrs.lng },
      );
      return {
        ...attrs,
        x: coords.x,
        y: coords.y,
      };
    });
  }

  // Function that sync the map with sigma
  function fnSyncMapWithSigma() {
    syncMapWithSigma(sigma, map);
  }

  // Function that sync sigma with map if it's needed
  function fnSyncSigmaWithMap() {
    if (!sigma.getCamera().isAnimated() && !map.isMoving()) {
      // Check that sigma & map are already in sync
      const southWest = graphToLatlng(map, sigma.viewportToGraph({ x: 0, y: sigma.getDimensions().height }));
      const northEast = graphToLatlng(map, sigma.viewportToGraph({ x: sigma.getDimensions().width, y: 0 }));

      const diff = Math.max(
        map.getBounds().getSouthWest().distanceTo(new LngLat(southWest.lng, southWest.lat)),
        map.getBounds().getNorthEast().distanceTo(new LngLat(northEast.lng, northEast.lat)),
      );
      if (diff > 1) {
        syncSigmaWithMap(sigma, map);
      }
    }
  }

  // When sigma is resize, we need to update the graph coordinate (the ref has changed)
  // and recompute the zoom bounds
  function fnOnResize() {
    // Avoid sync map with sigma while we do the resize
    // otherwise there is a sideeffect...
    sigma.off("afterRender", fnSyncMapWithSigma);
    const center = map.getCenter();

    // Ask the map to resize
    map.once("resize", () => {
      // NB: resize can change the center of the map, and we want to keep it
      map.setCenter(center);

      // Map ref has changed, we need to update the graph coordinates
      updateGraphCoordinates(sigma.getGraph());

      // Do the sync
      fnSyncSigmaWithMap();

      // Re-enable the map sync with sigma in the next frame
      setTimeout(() => {
        fnSyncMapWithSigma();
        sigma.on("afterRender", fnSyncMapWithSigma);
      }, 0);
    });
    map.resize();
  }

  // Clean up function to remove everything
  function clean() {
    if (!isKilled) {
      isKilled = true;

      map.off("moveend", fnSyncSigmaWithMap);
      map.remove();

      sigma.killLayer(mapLayerName);

      sigma.off("afterRender", fnSyncMapWithSigma);
      sigma.off("resize", fnOnResize);

      // Reset settings
      sigma.setSetting("stagePadding", prevSigmaSettings.stagePadding);
      sigma.setSetting("enableCameraRotation", prevSigmaSettings.enableCameraRotation);
    }
  }

  // Update the sigma graph for geospatial coords
  updateGraphCoordinates(sigma.getGraph());

  // When the map is ready
  map.once("load", () => {
    // Compute sigma ratio bounds
    // /!\ must be done after the first map render
    map.once("moveend", () => {
      fnSyncSigmaWithMap();
    });
    // Do the first sync
    fnSyncMapWithSigma();

    // At each render of sigma, we do the map sync
    sigma.on("afterRender", fnSyncMapWithSigma);
    // Listen on resize
    sigma.on("resize", fnOnResize);
    // Do the cleanup
    sigma.on("kill", clean);
    // Keep sigma camera on the map
    map.on("moveend", fnSyncSigmaWithMap);
  });

  return {
    clean,
    map,
    updateGraphCoordinates,
  };
}

export { graphToLatlng, latlngToGraph };
