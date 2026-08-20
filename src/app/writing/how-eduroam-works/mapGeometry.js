import "server-only";
import { geoGraticule10, geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import countries from "world-atlas/countries-110m.json";

export const MAP_WIDTH = 1100;
export const MAP_HEIGHT = 620;

const places = {
  visited: {
    id: "visited",
    label: "visited campus",
    location: "Berlin",
    coordinates: [13.405, 52.52],
  },
  home: {
    id: "home",
    label: "home institution",
    location: "Waterloo",
    coordinates: [-80.5204, 43.4643],
  },
};

const land = feature(countries, countries.objects.countries);
const projection = geoNaturalEarth1().fitExtent(
  [
    [18, 26],
    [MAP_WIDTH - 18, MAP_HEIGHT - 26],
  ],
  land
);
const path = geoPath(projection);

function routePath(from, to) {
  const interpolate = geoInterpolate(from, to);
  const coordinates = Array.from({ length: 65 }, (_, index) => interpolate(index / 64));
  return path({ type: "LineString", coordinates });
}

function routeDirection(from, to, position = 0.64) {
  const interpolate = geoInterpolate(from, to);
  const previous = projection(interpolate(position - 0.01));
  const point = projection(interpolate(position));
  return {
    point,
    angle: (Math.atan2(point[1] - previous[1], point[0] - previous[0]) * 180) / Math.PI,
  };
}

function projectPlace(place) {
  return {
    ...place,
    point: projection(place.coordinates),
  };
}

export function buildEduroamMapData() {
  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    landPath: path(land),
    graticulePath: path(geoGraticule10()),
    places: Object.fromEntries(
      Object.entries(places).map(([key, place]) => [key, projectPlace(place)])
    ),
    route: routePath(places.visited.coordinates, places.home.coordinates),
    direction: routeDirection(places.visited.coordinates, places.home.coordinates),
  };
}
