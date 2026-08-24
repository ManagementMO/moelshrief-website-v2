"""Generate the credited Alexandria origin map used by the homepage.

Install the upstream renderer first:
    python -m pip install prettymaps

The renderer fetches OpenStreetMap data at build time. The website ships the
resulting raster asset so visitors do not depend on an OSM/Overpass request.
"""

from pathlib import Path

import geopandas as gpd
import matplotlib
from shapely.geometry import Point

matplotlib.use("Agg")

import prettymaps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "maps" / "alexandria.png"
ORIGIN = (31.2001, 29.9187)


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


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    plot = prettymaps.plot(
        ORIGIN,
        layers=LAYERS,
        style=STYLE,
        use_preset=False,
        circle=False,
        radius=4500,
        dilate=0,
        figsize=(10, 10),
        credit=CREDIT,
        show=False,
        logging=True,
    )
    x_limits = plot.ax.get_xlim()
    y_limits = plot.ax.get_ylim()

    # Keep the map centered on the city while giving the visitor one quiet
    # human marker. This is the city center, not a claim about an exact address.
    point = gpd.GeoSeries([Point(ORIGIN[1], ORIGIN[0])], crs="EPSG:4326").to_crs(
        "EPSG:32635"
    )
    x, y = point.geometry.iloc[0].x, point.geometry.iloc[0].y
    plot.ax.scatter(
        [x], [y], s=160, facecolors="none", edgecolors="#d6a85c", linewidths=0.9, zorder=40
    )
    plot.ax.scatter([x], [y], s=18, c="#d6a85c", edgecolors="#11120f", linewidths=0.8, zorder=41)
    plot.ax.annotate(
        "alexandria",
        (x, y),
        xytext=(10, 12),
        textcoords="offset points",
        color="#d6a85c",
        fontsize=7,
        fontfamily="DejaVu Sans",
        fontweight="bold",
        bbox={"boxstyle": "square,pad=0.28", "fc": "#11120f", "ec": "none", "alpha": 0.8},
        zorder=42,
    )
    plot.ax.set_xlim(x_limits)
    plot.ax.set_ylim(y_limits)
    plot.fig.patch.set_facecolor("#11120f")
    plot.fig.savefig(OUTPUT, dpi=220, bbox_inches="tight", pad_inches=0)
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
