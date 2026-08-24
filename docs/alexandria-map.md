# Alexandria map attribution

`public/maps/alexandria.png` is a static map generated from OpenStreetMap data
with [prettymaps](https://github.com/marceloprates/prettymaps). The map is
included as a credited build artifact so the website does not make a live
Overpass request for every visitor.

To regenerate it:

```sh
python -m pip install prettymaps
python scripts/generate-alexandria-map.py
```

The upstream project is licensed under AGPL-3.0. OpenStreetMap data is ©
OpenStreetMap contributors. The generated image retains both credits in the
image and in the homepage origin detail.
