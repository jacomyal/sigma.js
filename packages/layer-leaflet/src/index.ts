import Graph from "graphology";
import { Attributes } from "graphology-types";
import L, { MapOptions } from "leaflet";
import { Sigma } from "sigma";

import { graphToLatlng, latlngToGraph, setSigmaRatioBounds, syncMapWithSigma, syncSigmaWithMap } from "./utils";

/**
 * On the graph, we store the 2D projection of the geographical lat/long.
 *
 * @param sigma The sigma instance
 * @param opts.mapOptions Options that will be provided to the map constructor.
 * @param opts.tileLayer Tile layer configuration for the map (default is openstreetmap)
 * @param opts.getNodeLatLng Function to retrieve lat/long values from a node's attributs (default is lat & lng)
 */
export default function bindLeafletLayer(
  sigma: Sigma,
  opts?: {
    mapOptions?: Omit<MapOptions, "zoomControl" | "zoomSnap" | "zoom" | "maxZoom">;
    tileLayer?: { urlTemplate: string; attribution?: string };
    getNodeLatLng?: (nodeAttributes: Attributes) => { lat: number; lng: number };
  },
) {
  // Keeping data for the cleanup
  let isKilled = false;
  const prevSigmaSettings = sigma.getSettings();

  // Creating map container
  const mapLayerName = "layer-leaflet";
  const mapContainer = sigma.createLayer(mapLayerName, "div", {
    style: { position: "absolute", inset: "0", zIndex: "0" },
    // 'edges' is the first sigma layer
    beforeLayer: "edges",
  });
  sigma.getContainer().prepend(mapContainer);

  // Initialize the map
  const map = L.map(mapContainer, {
    ...(opts?.mapOptions || {}),
    zoomControl: false,
    zoomSnap: 0,
    zoom: 0,
    // we force the maxZoom with a higher tile value so leaflet function are not stuck
    // in a restricted area. It avoids side effect
    maxZoom: 20,
  }).setView([0, 0], 0);
  let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  let tileAttribution: string | undefined =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  if (opts?.tileLayer) {
    tileUrl = opts.tileLayer.urlTemplate;
    tileAttribution = opts.tileLayer.attribution;
  }
  L.tileLayer(tileUrl, { attribution: tileAttribution }).addTo(map);

  let mapIsMoving = false;
  map.on("move", () => {
    mapIsMoving = true;
  });
  map.on("moveend", () => {
    mapIsMoving = false;
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
  function fnSyncMapWithSigma(firstIteration = false) {
    syncMapWithSigma(sigma, map, firstIteration);
  }

  // Function that sync sigma with map if it's needed
  function fnSyncSigmaWithMap() {
    if (!sigma.getCamera().isAnimated() && !mapIsMoving) {
      // Check that sigma & map are already in sync
      const southWest = graphToLatlng(map, sigma.viewportToGraph({ x: 0, y: sigma.getDimensions().height }));
      const northEast = graphToLatlng(map, sigma.viewportToGraph({ x: sigma.getDimensions().width, y: 0 }));
      const diff = Math.max(
        map.getBounds().getSouthWest().distanceTo(southWest),
        map.getBounds().getNorthEast().distanceTo(northEast),
      );
      if (diff > 10000 / map.getZoom()) {
        syncSigmaWithMap(sigma, map);
      }
    }
  }

  // When sigma is resize, we need to update the graph coordinate (the ref has changed)
  // and recompute the zoom bounds
  function fnOnResize() {
    // Ask the map to resize
    // NB: resize can change the center of the map, and we want to keep it
    const center = map.getCenter();
    map.invalidateSize({ pan: false, animate: false, duration: 0 });
    map.setView(center);

    // Map ref has changed, we need to update the graph coordinates & bounds
    updateGraphCoordinates(sigma.getGraph());
    setSigmaRatioBounds(sigma, map);

    // Do the sync
    fnSyncSigmaWithMap();
  }

  // Clean up function to remove everything
  function clean() {
    if (!isKilled) {
      isKilled = true;

      map.remove();

      sigma.killLayer(mapLayerName);

      sigma.off("afterRender", fnSyncMapWithSigma);
      sigma.off("resize", fnOnResize);

      // Reset settings
      sigma.setSetting("stagePadding", prevSigmaSettings.stagePadding);
      sigma.setSetting("enableCameraRotation", prevSigmaSettings.enableCameraRotation);
      sigma.setSetting("minCameraRatio", prevSigmaSettings.minCameraRatio);
      sigma.setSetting("maxCameraRatio", prevSigmaSettings.maxCameraRatio);
    }
  }

  // When the map is ready
  map.whenReady(() => {
    // Update the sigma graph for geospatial coords
    updateGraphCoordinates(sigma.getGraph());

    // Do the first sync
    fnSyncMapWithSigma(true);

    // Compute sigma ratio bounds
    map.once("moveend", () => {
      setSigmaRatioBounds(sigma, map);
      fnSyncSigmaWithMap();
    });

    // At each render of sigma, we do the map sync
    sigma.on("afterRender", fnSyncMapWithSigma);
    // Listen on resize
    sigma.on("resize", fnOnResize);
    // Do the cleanup
    sigma.on("kill", clean);
  });

  return {
    clean,
    map,
    updateGraphCoordinates,
  };
}

export { graphToLatlng, latlngToGraph };
