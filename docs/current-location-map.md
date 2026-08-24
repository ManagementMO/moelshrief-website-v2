# Current location map

The homepage location module is driven by
`src/app/data/current-location.json`. Change the city, region, coordinates,
slug, caption, and radius there, then regenerate the static map:

```sh
python scripts/generate-current-location-map.py
```

The generated asset is written to `public/maps/<slug>.png` and is rendered
inside the primary terminal pane by `CurrentLocationMap`. Visitors do not make
live Overpass requests. The image retains OpenStreetMap and prettymaps credit,
and the component exposes the same attribution to assistive technology.

The upstream prettymaps project is licensed under AGPL-3.0. OpenStreetMap data
is © OpenStreetMap contributors.
