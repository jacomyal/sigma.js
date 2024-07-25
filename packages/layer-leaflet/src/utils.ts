import { LatLngBounds, Map } from "leaflet";
import { Sigma } from "sigma";

export const LEAFLET_MAX_PIXEL = 256 * 2 ** 18;

/**
 * Given a geo point returns its graph coords.
 */
export function latlngToGraph(map: Map, coord: { lat: number; lng: number }): { x: number; y: number } {
  const data = map.project({ lat: coord.lat, lng: coord.lng }, 0);
  return {
    x: data.x,
    // Y are reversed between geo / sigma
    y: map.getContainer().clientHeight - data.y,
  };
}

/**
 * Given a graph coords returns its lat/lng coords.
 */
export function graphToLatlng(map: Map, coords: { x: number; y: number }): { lat: number; lng: number } {
  const data = map.unproject([coords.x, map.getContainer().clientHeight - coords.y], 0);
  return { lat: data.lat, lng: data.lng };
}

/**
 * Synchronise the sigma BBox with the leaflet one.
 */
export function syncLeafletBboxWithGraph(sigma: Sigma, map: Map, animate: boolean): void {
  const viewportDimensions = sigma.getDimensions();

  // Graph BBox
  const graphBottomLeft = sigma.viewportToGraph({ x: 0, y: viewportDimensions.height }, { padding: 0 });
  const graphTopRight = sigma.viewportToGraph({ x: viewportDimensions.width, y: 0 }, { padding: 0 });

  // Geo BBox
  const geoSouthWest = graphToLatlng(map, graphBottomLeft);
  const geoNorthEast = graphToLatlng(map, graphTopRight);

  // Set map BBox
  const bounds = new LatLngBounds(geoSouthWest, geoNorthEast);
  const opts = animate ? { animate: true, duration: 0.001 } : { animate: false };
  map.flyToBounds(bounds, opts);

  // Handle side effects when bounds have some "void" area on top or bottom of the map
  // When it happens, flyToBound don't really do its job and there is a translation of the graph that match the void height.
  // So we have to do a pan in pixel...
  const worldSize = map.getPixelWorldBounds().getSize();
  const mapBottomY = map.getPixelBounds().getBottomLeft().y;
  const mapTopY = map.getPixelBounds().getTopRight().y;
  const panVector: [number, number] = [0, 0];
  if (mapTopY < 0) panVector[1] = mapTopY;
  if (mapBottomY > worldSize.y) panVector[1] = mapBottomY - worldSize.y + panVector[1];
  if (panVector[1] !== 0) {
    map.panBy(panVector, { animate: false });
  }
}

/**
 * Settings the min & max camera ratio of sigma to not be over the capabilities of Leaflet
 * - Max zoom is when whe can see the whole map
 * - Min zoom is when we are at zoom 18 on leaflet
 */
export function setSigmaRatioBounds(sigma: Sigma, map: Map): void {
  const worldPixelSize = map.getPixelWorldBounds().getSize();

  // Max zoom
  const maxZoomRatio = Math.min(
    worldPixelSize.x / sigma.getDimensions().height,
    worldPixelSize.y / sigma.getDimensions().width,
  );
  sigma.setSetting("maxCameraRatio", maxZoomRatio);

  // Min zoom
  const minZoomRatio = worldPixelSize.y / LEAFLET_MAX_PIXEL;
  sigma.setSetting("minCameraRatio", minZoomRatio);

  const currentRatio = sigma.getCamera().ratio;
  if (currentRatio > maxZoomRatio) sigma.getCamera().setState({ ratio: maxZoomRatio });
  if (currentRatio < minZoomRatio) sigma.getCamera().setState({ ratio: minZoomRatio });
}
