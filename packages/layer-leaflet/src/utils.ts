import { LatLngBounds, Map } from "leaflet";
import { Sigma } from "sigma";

export const LEAFLET_MAX_PIXEL = 256 * 2 ** 18;
export const MAX_VALID_LATITUDE = 85.051129;
/**
 * Get the world size in pixel
 */
function getWorldPixelSize(map: Map) {
  const southWest = map.project({ lat: -MAX_VALID_LATITUDE, lng: -180 });
  const northEast = map.project({ lat: MAX_VALID_LATITUDE, lng: 180 });
  return { y: Math.abs(southWest.y - northEast.y), x: Math.abs(northEast.x - southWest.x) };
}

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
 * Synchronise sigma BBOX with the Map one.
 */
export function syncSigmaWithMap(sigma: Sigma, map: Map): void {
  const mapBound = map.getBounds();

  // Compute sigma center
  const center = sigma.viewportToFramedGraph(sigma.graphToViewport(latlngToGraph(map, mapBound.getCenter())));

  // Compute sigma ratio
  const northEast = sigma.graphToViewport(latlngToGraph(map, mapBound.getNorthEast()));
  const southWest = sigma.graphToViewport(latlngToGraph(map, mapBound.getSouthWest()));
  const viewportBoundDimension = {
    width: Math.abs(northEast.x - southWest.x),
    height: Math.abs(northEast.y - southWest.y),
  };
  const viewportDim = sigma.getDimensions();
  const ratio =
    Math.min(viewportBoundDimension.width / viewportDim.width, viewportBoundDimension.height / viewportDim.height) *
    sigma.getCamera().getState().ratio;
  sigma.getCamera().setState({ ...center, ratio: ratio });
}

/**
 * Synchronise map BBOX with the Sigma one.
 */
export function syncMapWithSigma(sigma: Sigma, map: Map, firstIteration = false): void {
  const viewportDimensions = sigma.getDimensions();

  // Graph BBox
  const graphBottomLeft = sigma.viewportToGraph({ x: 0, y: viewportDimensions.height });
  const graphTopRight = sigma.viewportToGraph({ x: viewportDimensions.width, y: 0 });

  // Geo BBox
  const geoSouthWest = graphToLatlng(map, graphBottomLeft);
  const geoNorthEast = graphToLatlng(map, graphTopRight);

  // Set map BBox
  const bounds = new LatLngBounds(geoSouthWest, geoNorthEast);
  map.flyToBounds(bounds, { animate: false });

  if (!firstIteration) {
    // Handle side effects when bounds have some "void" area on top or bottom of the map
    // When it happens, flyToBound don't really do its job and there is a translation of the graph that match the void height.
    // So we have to do a pan in pixel...
    const worldSize = map.getPixelWorldBounds().getSize();
    const mapBottomY = map.getPixelBounds().getBottomLeft().y;
    const mapTopY = map.getPixelBounds().getTopRight().y;
    if (mapTopY < 0 || mapBottomY > worldSize.y) syncSigmaWithMap(sigma, map);
  }
}

/**
 * Settings the min & max camera ratio of sigma to not be over the map's capabilities
 * - Max zoom is when whe can see the whole map
 * - Min zoom is when we are at zoom 18 on leaflet
 */
export function setSigmaRatioBounds(sigma: Sigma, map: Map): void {
  const worldPixelSize = getWorldPixelSize(map);

  // Max zoom
  const maxZoomRatio = worldPixelSize.y / sigma.getDimensions().width;
  sigma.setSetting("maxCameraRatio", maxZoomRatio);
  // Min zoom
  const minZoomRatio = worldPixelSize.y / LEAFLET_MAX_PIXEL;
  sigma.setSetting("minCameraRatio", minZoomRatio);

  const currentRatio = sigma.getCamera().ratio;
  if (currentRatio > maxZoomRatio) sigma.getCamera().setState({ ratio: maxZoomRatio });
  if (currentRatio < minZoomRatio) sigma.getCamera().setState({ ratio: minZoomRatio });
}
