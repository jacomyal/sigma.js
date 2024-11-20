import { LngLatBounds, Map, MercatorCoordinate } from "maplibre-gl";
import { Sigma } from "sigma";

// See https://github.com/maplibre/maplibre-gl-js/blob/330ba249ec80e5ac05d1bc851c41b43bd575792e/src/geo/transform.ts#L16C14-L16C32
export const MAX_VALID_LATITUDE = 85.051129;

/**
 * Given a geo point returns its graph coords.
 */
export function latlngToGraph(map: Map, coord: { lat: number; lng: number }): { x: number; y: number } {
  const data = MercatorCoordinate.fromLngLat(coord);
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
  const mcoords = new MercatorCoordinate(coords.x, map.getContainer().clientHeight - coords.y, 0);
  const data = mcoords.toLngLat();
  return { lat: data.lat, lng: data.lng };
}

/**
 * BBOX sync : map to sigma
 */
export function syncSigmaWithMap(sigma: Sigma, map: Map): void {
  // Compute sigma center
  const center = sigma.viewportToFramedGraph(sigma.graphToViewport(latlngToGraph(map, map.getCenter())));

  // Compute sigma ratio
  const mapBound = map.getBounds();
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
 * BBOX sync : sigma to map
 */
export function syncMapWithSigma(sigma: Sigma, map: Map): void {
  const viewportDimensions = sigma.getDimensions();

  // Graph BBox
  const graphBottomLeft = sigma.viewportToGraph({ x: 0, y: viewportDimensions.height }, { padding: 0 });
  const graphTopRight = sigma.viewportToGraph({ x: viewportDimensions.width, y: 0 }, { padding: 0 });

  // Geo BBox
  const geoSouthWest = graphToLatlng(map, graphBottomLeft);
  const geoNorthEast = graphToLatlng(map, graphTopRight);

  // Set map BBox
  const bounds = new LngLatBounds([geoSouthWest, geoNorthEast]);
  map.fitBounds(bounds, { duration: 0 });
}
