import "server-only";
import { geoInterpolate, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import countries from "world-atlas/countries-110m.json";
import { policies, routeComparison, venues } from "./scheduleData";

export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 540;

const projection = geoMercator()
  .center([-98, 37.5])
  .scale(390)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2])
  .clipExtent([
    [0, 0],
    [MAP_WIDTH, MAP_HEIGHT],
  ]);

const path = geoPath(projection);
const countryIds = new Set(["124", "484", "840"]);
const northAmericanCountries = {
  type: "GeometryCollection",
  geometries: countries.objects.countries.geometries.filter((geometry) =>
    countryIds.has(String(geometry.id))
  ),
};
const land = feature(countries, northAmericanCountries);

function projectedRoute(route) {
  return route.map((id) => ({ id, point: projection([venues[id].lon, venues[id].lat]) }));
}

function routePath(route) {
  const coordinates = [];
  for (let index = 0; index < route.length - 1; index += 1) {
    const from = venues[route[index]];
    const to = venues[route[index + 1]];
    const interpolate = geoInterpolate([from.lon, from.lat], [to.lon, to.lat]);
    for (let step = 0; step <= 32; step += 1) {
      if (index > 0 && step === 0) continue;
      coordinates.push(interpolate(step / 32));
    }
  }
  return path({ type: "LineString", coordinates });
}

function localViewBox(route) {
  const points = projectedRoute(route).map(({ point }) => point);
  const centerX = points.reduce((sum, [x]) => sum + x, 0) / points.length;
  const centerY = points.reduce((sum, [, y]) => sum + y, 0) / points.length;
  const width = 360;
  const height = width * (MAP_HEIGHT / MAP_WIDTH);
  const x = Math.max(0, Math.min(MAP_WIDTH - width, centerX - width / 2));
  const y = Math.max(0, Math.min(MAP_HEIGHT - height, centerY - height / 2));
  return `${x} ${y} ${width} ${height}`;
}

function prepareRoute(entry) {
  return {
    ...entry,
    path: routePath(entry.route),
    stops: projectedRoute(entry.route),
  };
}

export function buildScheduleMapData() {
  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    landPath: path(land),
    venuePoints: Object.values(venues).map((venue) => ({
      ...venue,
      point: projection([venue.lon, venue.lat]),
    })),
    comparisons: routeComparison.map((entry) => ({
      ...prepareRoute(entry),
      viewBox: entry.local
        ? localViewBox(entry.route)
        : `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`,
      labelSize: entry.local ? 7 : 16,
      nodeRadius: entry.local ? 3.5 : 7,
    })),
    policies: policies.map(prepareRoute),
  };
}
