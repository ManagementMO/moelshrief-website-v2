"""Generate the configurable current-location map used by the homepage.

The location is read from src/app/data/current-location.json. Update that file,
then run this script to replace the static map asset for a new city.

Install the upstream renderer first:
    python -m pip install prettymaps
"""

import json
import math
from pathlib import Path

import geopandas as gpd
import matplotlib
from shapely.geometry import Point

matplotlib.use("Agg")

import prettymaps


ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "src" / "app" / "data" / "current-location.json"


LAYERS = {
    "perimeter": {},
    "streets": {
        "custom_filter": '["highway"~"motorway|trunk|primary|secondary|tertiary|residential|service|unclassified|pedestrian|footway"]',
        "width": {
            "motorway": 5,
            "trunk": 4.5,
            "primary": 4,
            "secondary": 3.2,
            "tertiary": 2.6,
            "residential": 2.1,
            "service": 1.5,
            "unclassified": 1.6,
            "pedestrian": 1.5,
            "footway": 0.9,
        },
    },
    "building": {"tags": {"building": True}},
    "water": {"tags": {"natural": ["water", "bay"]}},
    "beach": {"tags": {"natural": "beach"}},
    "green": {
        "tags": {
            "landuse": ["grass", "orchard"],
            "natural": ["wood", "wetland"],
            "leisure": ["park", "garden", "pitch", "sports_centre"],
        }
    },
}

STYLE = {
    "background": {"fc": "#11120f", "ec": "#11120f", "zorder": -1},
    "perimeter": {"fill": False, "lw": 0, "zorder": 0},
    "water": {"fc": "#213538", "ec": "#345154", "lw": 0.7, "zorder": 1},
    "beach": {"fc": "#403b2f", "ec": "#615540", "lw": 0.6, "zorder": 2},
    "green": {"fc": "#1f2d25", "ec": "#385244", "lw": 0.55, "zorder": 2},
    "streets": {"ec": "#927d5b", "alpha": 0.76, "zorder": 4},
    "building": {
        "palette": ["#282722", "#332f27", "#3b352b"],
        "ec": "#51493a",
        "lw": 0.24,
        "zorder": 5,
    },
}

CREDIT = {
    "text": "data © OpenStreetMap contributors\nrendered with prettymaps",
    "x": 0.02,
    "y": 0.025,
    "horizontalalignment": "left",
    "verticalalignment": "bottom",
    "fontsize": 4.5,
    "color": "#9a8b70",
    "bbox": {
        "boxstyle": "square,pad=0.35",
        "fc": "#11120f",
        "ec": "none",
        "alpha": 0.86,
    },
}


def utm_epsg(latitude, longitude):
    zone = math.floor((longitude + 180) / 6) + 1
    return (32600 if latitude >= 0 else 32700) + zone


def main():
    location = json.loads(CONFIG.read_text())
    latitude = location["latitude"]
    longitude = location["longitude"]
    output = ROOT / "public" / "maps" / f"{location['slug']}.png"
    output.parent.mkdir(parents=True, exist_ok=True)

    plot = prettymaps.plot(
        (latitude, longitude),
        layers=LAYERS,
        style=STYLE,
        use_preset=False,
        circle=False,
        radius=location.get("radius", 9000),
        dilate=0,
        figsize=(10, 10),
        credit=CREDIT,
        show=False,
        logging=True,
    )
    x_limits = plot.ax.get_xlim()
    y_limits = plot.ax.get_ylim()

    point = gpd.GeoSeries([Point(longitude, latitude)], crs="EPSG:4326").to_crs(
        epsg=utm_epsg(latitude, longitude)
    )
    x, y = point.geometry.iloc[0].x, point.geometry.iloc[0].y
    plot.ax.scatter(
        [x],
        [y],
        s=160,
        facecolors="none",
        edgecolors="#d6a85c",
        linewidths=0.9,
        zorder=40,
    )
    plot.ax.scatter(
        [x],
        [y],
        s=18,
        c="#d6a85c",
        edgecolors="#11120f",
        linewidths=0.8,
        zorder=41,
    )
    plot.ax.annotate(
        location["city"].lower(),
        (x, y),
        xytext=(10, 12),
        textcoords="offset points",
        color="#d6a85c",
        fontsize=7,
        fontfamily="DejaVu Sans",
        fontweight="bold",
        bbox={
            "boxstyle": "square,pad=0.28",
            "fc": "#11120f",
            "ec": "none",
            "alpha": 0.8,
        },
        zorder=42,
    )
    plot.ax.set_xlim(x_limits)
    plot.ax.set_ylim(y_limits)
    plot.fig.patch.set_facecolor("#11120f")
    # The module renders at 116 CSS pixels, so a compact 2x-ish source keeps
    # the repository and first load light without sacrificing a crisp retina
    # thumbnail.
    plot.fig.savefig(output, dpi=132, bbox_inches="tight", pad_inches=0)
    print(f"wrote {output}")


if __name__ == "__main__":
    main()
