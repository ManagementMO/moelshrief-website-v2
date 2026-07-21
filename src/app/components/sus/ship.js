// the m0 — a small ship for one crewmate. all coordinates in world units.
// rooms + halls are axis-aligned rects; the walkable area is their union.

export const ROOMS = [
  { id: "upperEngine", name: "upper engine", x: 140, y: 140, w: 300, h: 260 },
  { id: "reactor", name: "reactor", x: 100, y: 560, w: 300, h: 320 },
  { id: "lowerEngine", name: "lower engine", x: 140, y: 1040, w: 300, h: 260 },
  { id: "security", name: "security", x: 560, y: 620, w: 220, h: 220 },
  { id: "medbay", name: "medbay", x: 680, y: 340, w: 280, h: 240 },
  { id: "cafeteria", name: "cafeteria", x: 1040, y: 120, w: 480, h: 420 },
  { id: "weapons", name: "weapons", x: 1740, y: 160, w: 280, h: 240 },
  { id: "o2", name: "o2", x: 1760, y: 560, w: 200, h: 180 },
  { id: "navigation", name: "navigation", x: 2300, y: 560, w: 220, h: 280 },
  { id: "shields", name: "shields", x: 1780, y: 960, w: 260, h: 240 },
  { id: "comms", name: "comms", x: 1400, y: 1120, w: 280, h: 200 },
  { id: "storage", name: "storage", x: 1040, y: 920, w: 300, h: 360 },
  { id: "admin", name: "admin", x: 1440, y: 660, w: 280, h: 220 },
  { id: "electrical", name: "electrical", x: 660, y: 940, w: 280, h: 260 },
];

export const HALLS = [
  { x: 440, y: 220, w: 600, h: 100 }, // upper engine → cafeteria
  { x: 1520, y: 220, w: 220, h: 100 }, // cafeteria → weapons
  { x: 1820, y: 400, w: 100, h: 560 }, // right trunk: weapons → o2 → shields
  { x: 1960, y: 600, w: 340, h: 100 }, // o2 → navigation
  { x: 2320, y: 840, w: 100, h: 220 }, // navigation ↓
  { x: 2040, y: 1000, w: 380, h: 100 }, // ↓ → shields
  { x: 1680, y: 1140, w: 100, h: 100 }, // shields → comms
  { x: 1340, y: 1160, w: 60, h: 100 }, // comms → storage
  { x: 1140, y: 540, w: 100, h: 380 }, // cafeteria ↓ storage
  { x: 1430, y: 540, w: 90, h: 120 }, // cafeteria ↓ admin
  { x: 1720, y: 700, w: 100, h: 100 }, // admin → right trunk
  { x: 960, y: 380, w: 80, h: 100 }, // medbay → cafeteria
  { x: 240, y: 400, w: 100, h: 640 }, // left trunk: engines + reactor
  { x: 340, y: 700, w: 220, h: 100 }, // left trunk → security
  { x: 440, y: 1120, w: 220, h: 100 }, // lower engine → electrical
  { x: 940, y: 1020, w: 100, h: 100 }, // electrical → storage
];

export const WALK = [...ROOMS, ...HALLS];

// vents teleport within their network (press e). net index groups them.
export const VENTS = [
  { x: 180, y: 640, net: 0, room: "reactor" },
  { x: 360, y: 200, net: 0, room: "upper engine" },
  { x: 360, y: 1240, net: 0, room: "lower engine" },
  { x: 900, y: 400, net: 1, room: "medbay" },
  { x: 620, y: 780, net: 1, room: "security" },
  { x: 720, y: 1140, net: 1, room: "electrical" },
  { x: 1460, y: 480, net: 2, room: "cafeteria" },
  { x: 1660, y: 820, net: 2, room: "admin" },
  { x: 1100, y: 1220, net: 2, room: "storage" },
  { x: 1960, y: 340, net: 3, room: "weapons" },
  { x: 2460, y: 780, net: 3, room: "navigation" },
  { x: 1980, y: 1140, net: 3, room: "shields" },
];

export const BUTTON = { x: 1280, y: 300 };
export const SPAWN = { x: 1280, y: 410 };

// world bounds derived from geometry, padded for stars/space.
const minX = Math.min(...WALK.map((r) => r.x));
const minY = Math.min(...WALK.map((r) => r.y));
const maxX = Math.max(...WALK.map((r) => r.x + r.w));
const maxY = Math.max(...WALK.map((r) => r.y + r.h));
export const WORLD = {
  x: minX - 120,
  y: minY - 120,
  w: maxX - minX + 240,
  h: maxY - minY + 240,
};

export function pointInWalk(x, y) {
  for (let i = 0; i < WALK.length; i++) {
    const r = WALK[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true;
  }
  return false;
}

export function roomAt(x, y) {
  for (let i = 0; i < ROOMS.length; i++) {
    const r = ROOMS[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r;
  }
  return null;
}
