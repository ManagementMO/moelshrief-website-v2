"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import {
  ROOMS,
  WALK,
  VENTS,
  BUTTON,
  SPAWN,
  WORLD,
  pointInWalk,
  roomAt,
} from "./ship";

// ---------------------------------------------------------------------------
// themes — the site's stone/amber palette, extended into 3d.
// ---------------------------------------------------------------------------
const THEMES = {
  dark: {
    bg: 0x060504,
    fogDensity: 0.00038,
    floor: 0x171310,
    floorOpacity: 0.9,
    floorRough: 0.2,
    floorMetal: 0.4,
    wall: 0x27221f,
    wallRough: 0.6,
    trim: 0xfbbf24,
    trimIntensity: 0.5,
    stone: 0x38322e,
    hemiSky: 0x3c3630,
    hemiGround: 0x100d0a,
    hemiInt: 0.6,
    dir: 0xe9e4dc,
    dirInt: 1.5,
    point: 0xffc75e,
    pointInt: 26000,
    envInt: 0.45,
    bloom: 0.28,
    bloomThreshold: 0.72,
    starsVisible: true,
    body: 0xfbbf24,
    pack: 0xd97706,
    visor: 0xaec3cf,
    mirrorOpacity: 0.24,
    label: "#a8a29e",
    hud: "#a8a29e",
    hudDim: "#57534e",
    accent: "#fbbf24",
    toast: "#d6d3d1",
  },
  light: {
    bg: 0xf5f5f4,
    fogDensity: 0.00013,
    floor: 0xf4f1ee,
    floorOpacity: 0.96,
    floorRough: 0.24,
    floorMetal: 0.15,
    wall: 0xccc6c0,
    wallRough: 0.7,
    trim: 0xf59e0b,
    trimIntensity: 0.5,
    stone: 0xa49c94,
    hemiSky: 0xffffff,
    hemiGround: 0xc9c4bf,
    hemiInt: 0.55,
    dir: 0xffffff,
    dirInt: 2.1,
    point: 0xffce74,
    pointInt: 12000,
    envInt: 0.5,
    bloom: 0.07,
    bloomThreshold: 0.85,
    starsVisible: false,
    body: 0xf59e0b,
    pack: 0xd97706,
    visor: 0xb9d0dc,
    mirrorOpacity: 0.14,
    label: "#6f6a64",
    hud: "#78716c",
    hudDim: "#a8a29e",
    accent: "#d97706",
    toast: "#57534e",
  },
};

const MEETING_LINES = [
  "> emergency meeting called",
  "> nobody came.",
  "> it's just you out here.",
  "> was it you? it was probably you.",
  "> somewhere, a goose honks.",
];

const KEYS = {
  KeyW: [0, -1],
  KeyS: [0, 1],
  KeyA: [-1, 0],
  KeyD: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};
const INTERACT_CODES = new Set(["KeyE", "Space", "Enter"]);

const R = 20; // collision radius
const SPEED = 300; // walk speed, world units/s
const WALL_H = 86;
const WALL_T = 16;

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fits(x, y) {
  if (!pointInWalk(x, y)) return false;
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2;
    if (!pointInWalk(x + Math.cos(ang) * R, y + Math.sin(ang) * R)) {
      return false;
    }
  }
  return true;
}

// subtract [a,b] from a list of intervals
function subtractIv(ivs, a, b) {
  const out = [];
  for (const [s, e] of ivs) {
    if (b <= s || a >= e) {
      out.push([s, e]);
    } else {
      if (a > s) out.push([s, a]);
      if (b < e) out.push([b, e]);
    }
  }
  return out;
}

// derive wall segments: every rect edge, minus the spans where another
// walkable rect continues across it (those are doorways/openings).
function wallSegments() {
  const segs = [];
  for (const r of WALK) {
    for (const [z, topSide] of [
      [r.y, true],
      [r.y + r.h, false],
    ]) {
      let ivs = [[r.x, r.x + r.w]];
      for (const o of WALK) {
        if (o === r) continue;
        const covers = topSide
          ? o.y < z && o.y + o.h >= z
          : o.y <= z && o.y + o.h > z;
        if (!covers) continue;
        const a = Math.max(o.x, r.x);
        const b = Math.min(o.x + o.w, r.x + r.w);
        if (b > a) ivs = subtractIv(ivs, a, b);
      }
      for (const [a, b] of ivs) {
        if (b - a > 4) segs.push({ h: true, a, b, line: z });
      }
    }
    for (const [x, leftSide] of [
      [r.x, true],
      [r.x + r.w, false],
    ]) {
      let ivs = [[r.y, r.y + r.h]];
      for (const o of WALK) {
        if (o === r) continue;
        const covers = leftSide
          ? o.x < x && o.x + o.w >= x
          : o.x <= x && o.x + o.w > x;
        if (!covers) continue;
        const a = Math.max(o.y, r.y);
        const b = Math.min(o.y + o.h, r.y + r.h);
        if (b > a) ivs = subtractIv(ivs, a, b);
      }
      for (const [a, b] of ivs) {
        if (b - a > 4) segs.push({ h: false, a, b, line: x });
      }
    }
  }
  return segs;
}

// a crewmate build — called twice (real + floor reflection).
function makeCrewmate(bodyMat, packMat, visorMat) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(20, 22, 8, 20), bodyMat);
  body.position.y = 36;
  const packG = new THREE.CapsuleGeometry(9, 16, 6, 12);
  const pack = new THREE.Mesh(packG, packMat);
  pack.scale.set(1.5, 1, 0.9);
  pack.position.set(0, 36, -24);
  const visor = new THREE.Mesh(new THREE.SphereGeometry(13, 24, 16), visorMat);
  visor.scale.set(1, 0.72, 0.62);
  visor.position.set(0, 46, 15);
  const hipL = new THREE.Group();
  const hipR = new THREE.Group();
  hipL.position.set(-10, 22, 0);
  hipR.position.set(10, 22, 0);
  const legG = new THREE.CapsuleGeometry(7.5, 9, 6, 12);
  const legL = new THREE.Mesh(legG, bodyMat);
  const legR = new THREE.Mesh(legG, bodyMat);
  legL.position.y = -12;
  legR.position.y = -12;
  hipL.add(legL);
  hipR.add(legR);
  g.add(body, pack, visor, hipL, hipR);
  return { group: g, hipL, hipR, meshes: [body, pack, visor, legL, legR] };
}

// ---------------------------------------------------------------------------
// component
// ---------------------------------------------------------------------------
export default function SusGame() {
  const wrapRef = useRef(null);
  const glRef = useRef(null);
  const hudRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [touchMode, setTouchMode] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const glCanvas = glRef.current;
    const hudCanvas = hudRef.current;
    if (!wrap || !glCanvas || !hudCanvas) return;

    const hud = hudCanvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (window.matchMedia("(pointer: coarse)").matches) setTouchMode(true);

    let theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    let T = THEMES[theme];

    // -- renderer / scene ------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      canvas: glCanvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 10, 7000);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const hemi = new THREE.HemisphereLight(T.hemiSky, T.hemiGround, T.hemiInt);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(T.dir, T.dirInt);
    dir.position.set(-420, 760, -300);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    dir.shadow.bias = -0.0004;
    dir.shadow.normalBias = 3;
    scene.add(dir);
    scene.add(dir.target);
    const lamp = new THREE.PointLight(T.point, T.pointInt, 1500, 2);
    lamp.position.set(SPAWN.x, 230, SPAWN.y);
    scene.add(lamp);

    // -- materials -------------------------------------------------------
    const floorMat = new THREE.MeshPhysicalMaterial({
      color: T.floor,
      roughness: T.floorRough,
      metalness: T.floorMetal,
      clearcoat: 1,
      clearcoatRoughness: 0.28,
      transparent: true,
      opacity: T.floorOpacity,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: T.wall,
      roughness: T.wallRough,
      metalness: 0.12,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: T.trim,
      emissiveIntensity: T.trimIntensity,
      roughness: 0.4,
    });
    const stoneMat = new THREE.MeshStandardMaterial({
      color: T.stone,
      roughness: 0.55,
      metalness: 0.1,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      emissive: T.trim,
      emissiveIntensity: 0.85,
      roughness: 0.35,
    });
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: T.body,
      roughness: 0.36,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
    });
    const packMat = new THREE.MeshPhysicalMaterial({
      color: T.pack,
      roughness: 0.45,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.25,
    });
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: T.visor,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.6,
    });
    const mirrorBody = bodyMat.clone();
    const mirrorPack = packMat.clone();
    const mirrorVisor = visorMat.clone();
    for (const m of [mirrorBody, mirrorPack, mirrorVisor]) {
      m.transparent = true;
      m.opacity = T.mirrorOpacity;
      m.depthWrite = false;
    }

    // -- floor -----------------------------------------------------------
    const floorGroup = new THREE.Group();
    for (const r of WALK) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(r.w + 8, 10, r.h + 8), floorMat);
      m.position.set(r.x + r.w / 2, -5, r.y + r.h / 2);
      m.receiveShadow = true;
      floorGroup.add(m);
    }
    scene.add(floorGroup);

    // -- walls + amber trim ----------------------------------------------
    const walls = new THREE.Group();
    for (const s of wallSegments()) {
      const len = s.b - s.a + WALL_T;
      const wallGeo = s.h
        ? new THREE.BoxGeometry(len, WALL_H, WALL_T)
        : new THREE.BoxGeometry(WALL_T, WALL_H, len);
      const wall = new THREE.Mesh(wallGeo, wallMat);
      const cx = s.h ? (s.a + s.b) / 2 : s.line;
      const cz = s.h ? s.line : (s.a + s.b) / 2;
      wall.position.set(cx, WALL_H / 2, cz);
      wall.castShadow = true;
      wall.receiveShadow = true;
      walls.add(wall);
      const trimLen = Math.max(6, len - 14);
      const trimGeo = s.h
        ? new THREE.BoxGeometry(trimLen, 2.6, 4)
        : new THREE.BoxGeometry(4, 2.6, trimLen);
      const trim = new THREE.Mesh(trimGeo, trimMat);
      trim.position.set(cx, WALL_H + 1.4, cz);
      walls.add(trim);
    }
    scene.add(walls);

    // -- room decor ------------------------------------------------------
    const reactorPulse = [];
    const pulseMats = [];
    // pulsing items get their own material so phases don't fight
    const pulseMat = () => {
      const m = accentMat.clone();
      pulseMats.push(m);
      return m;
    };
    const decor = new THREE.Group();
    const addM = (mesh, x, y, z, cast = true) => {
      mesh.position.set(x, y, z);
      mesh.castShadow = cast;
      mesh.receiveShadow = true;
      decor.add(mesh);
      return mesh;
    };
    for (const room of ROOMS) {
      const cx = room.x + room.w / 2;
      const cz = room.y + room.h / 2;
      switch (room.id) {
        case "cafeteria": {
          for (const [dx, dz] of [
            [-150, 60],
            [150, 60],
            [0, 150],
          ]) {
            addM(new THREE.Mesh(new THREE.CylinderGeometry(12, 14, 22, 12), stoneMat), cx + dx, 11, cz + dz);
            addM(new THREE.Mesh(new THREE.CylinderGeometry(42, 42, 5, 28), stoneMat), cx + dx, 25, cz + dz);
          }
          break;
        }
        case "reactor": {
          const core = addM(new THREE.Mesh(new THREE.SphereGeometry(22, 24, 16), pulseMat()), cx, 30, cz + 20);
          reactorPulse.push(core);
          const ring = new THREE.Mesh(new THREE.TorusGeometry(48, 6, 12, 40), stoneMat);
          ring.rotation.x = Math.PI / 2;
          addM(ring, cx, 12, cz + 20);
          break;
        }
        case "upperEngine":
        case "lowerEngine": {
          addM(new THREE.Mesh(new THREE.BoxGeometry(70, 54, 104), stoneMat), cx + 8, 27, cz);
          const jet = addM(new THREE.Mesh(new THREE.BoxGeometry(8, 30, 78), pulseMat()), cx - 32, 24, cz, false);
          reactorPulse.push(jet);
          break;
        }
        case "medbay": {
          for (const dz of [-46, 22]) {
            addM(new THREE.Mesh(new THREE.BoxGeometry(74, 16, 40), stoneMat), cx - 20, 8, cz + dz);
          }
          const scan = new THREE.Mesh(new THREE.TorusGeometry(24, 2.4, 10, 32), pulseMat());
          scan.rotation.x = Math.PI / 2;
          addM(scan, cx + 78, 3, cz + 28, false);
          reactorPulse.push(scan);
          break;
        }
        case "storage": {
          addM(new THREE.Mesh(new THREE.BoxGeometry(46, 40, 46), stoneMat), cx - 40, 20, cz + 52);
          addM(new THREE.Mesh(new THREE.BoxGeometry(34, 26, 34), stoneMat), cx + 8, 13, cz + 60);
          addM(new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 34, 16), stoneMat), cx + 48, 17, cz - 10);
          break;
        }
        case "admin": {
          addM(new THREE.Mesh(new THREE.BoxGeometry(124, 26, 76), stoneMat), cx, 13, cz + 42);
          addM(new THREE.Mesh(new THREE.BoxGeometry(100, 3, 56), accentMat), cx, 28, cz + 42, false);
          break;
        }
        case "weapons": {
          const tor = new THREE.Mesh(new THREE.TorusGeometry(42, 4, 10, 36), stoneMat);
          tor.rotation.x = Math.PI / 2;
          addM(tor, cx, 8, cz + 14);
          addM(new THREE.Mesh(new THREE.CylinderGeometry(6, 8, 40, 10), stoneMat), cx, 20, cz + 14);
          break;
        }
        case "navigation": {
          addM(new THREE.Mesh(new THREE.BoxGeometry(90, 30, 34), stoneMat), cx, 15, cz + 74);
          addM(new THREE.Mesh(new THREE.BoxGeometry(70, 16, 4), accentMat), cx, 40, cz + 84, false);
          break;
        }
        case "o2": {
          for (const dx of [-20, 16]) {
            addM(new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 56, 14), stoneMat), cx + dx, 28, cz + 10);
          }
          break;
        }
        case "shields": {
          for (const [dx, dz] of [
            [-30, 24],
            [30, 24],
            [0, -32],
          ]) {
            addM(new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 8, 6), stoneMat), cx + dx, 4, cz + dz, false);
          }
          break;
        }
        case "comms": {
          addM(new THREE.Mesh(new THREE.CylinderGeometry(4, 6, 44, 8), stoneMat), cx - 6, 22, cz + 16);
          const dish = new THREE.Mesh(new THREE.SphereGeometry(26, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.6), stoneMat);
          dish.rotation.x = Math.PI * 0.82;
          addM(dish, cx - 6, 48, cz + 8);
          break;
        }
        case "electrical": {
          addM(new THREE.Mesh(new THREE.BoxGeometry(86, 60, 14), stoneMat), cx - 24, 30, cz + 24);
          const led = addM(new THREE.Mesh(new THREE.BoxGeometry(60, 3, 3), pulseMat()), cx - 24, 52, cz + 17, false);
          reactorPulse.push(led);
          break;
        }
        case "security": {
          for (const dx of [-46, 0, 46]) {
            addM(new THREE.Mesh(new THREE.BoxGeometry(38, 26, 6), stoneMat), cx + dx, 26, cz - 20);
          }
          break;
        }
        default:
          break;
      }
    }
    scene.add(decor);

    // -- vents + emergency button ----------------------------------------
    const ventRings = [];
    for (const v of VENTS) {
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(48, 9, 36), stoneMat);
      base.position.y = 4.5;
      base.castShadow = true;
      base.receiveShadow = true;
      g.add(base);
      for (let i = -1; i <= 1; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(32, 2.4, 5), wallMat);
        slat.position.set(0, 10, i * 9);
        g.add(slat);
      }
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(32, 2, 10, 36),
        new THREE.MeshStandardMaterial({
          color: 0x000000,
          emissive: T.trim,
          emissiveIntensity: 1.4,
          transparent: true,
          opacity: 0,
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 3;
      g.add(ring);
      g.position.set(v.x, 0, v.y);
      scene.add(g);
      ventRings.push({ v, ring });
    }

    const btnGroup = new THREE.Group();
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(30, 36, 12, 24), stoneMat);
    pedestal.position.y = 6;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(16, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      accentMat
    );
    dome.position.y = 12;
    const btnRing = new THREE.Mesh(
      new THREE.TorusGeometry(42, 2.2, 10, 40),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: T.trim,
        emissiveIntensity: 1.4,
        transparent: true,
        opacity: 0,
      })
    );
    btnRing.rotation.x = Math.PI / 2;
    btnRing.position.y = 3;
    const flashRing = new THREE.Mesh(
      new THREE.TorusGeometry(40, 3, 10, 48),
      new THREE.MeshBasicMaterial({
        color: T.trim,
        transparent: true,
        opacity: 0,
      })
    );
    flashRing.rotation.x = Math.PI / 2;
    flashRing.position.y = 5;
    btnGroup.add(pedestal, dome, btnRing, flashRing);
    btnGroup.position.set(BUTTON.x, 0, BUTTON.y);
    scene.add(btnGroup);

    // -- stars below the glass floor -------------------------------------
    const starGeo = new THREE.BufferGeometry();
    const rnd = mulberry32(4242);
    const starPos = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      starPos[i * 3] = WORLD.x - 1200 + rnd() * (WORLD.w + 2400);
      starPos[i * 3 + 1] = -140 - rnd() * 1400;
      starPos[i * 3 + 2] = WORLD.y - 1200 + rnd() * (WORLD.h + 2400);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xcfc7bd,
      size: 3.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // -- crewmate + its reflection ---------------------------------------
    const crew = makeCrewmate(bodyMat, packMat, visorMat);
    for (const m of crew.meshes) m.castShadow = true;
    scene.add(crew.group);
    const mirror = makeCrewmate(mirrorBody, mirrorPack, mirrorVisor);
    mirror.group.scale.y = -1;
    scene.add(mirror.group);

    // -- painted floor labels (canvas textures) --------------------------
    let labelMeshes = [];
    const monoFamily = () => getComputedStyle(wrap).fontFamily || "monospace";
    const buildLabels = () => {
      for (const m of labelMeshes) {
        m.material.map?.dispose();
        m.material.dispose();
        m.geometry.dispose();
        scene.remove(m);
      }
      labelMeshes = [];
      const fam = monoFamily();
      for (const room of ROOMS) {
        const text = `// ${room.name}`;
        const c = document.createElement("canvas");
        const cctx = c.getContext("2d");
        cctx.font = `500 48px ${fam}`;
        const tw = Math.ceil(cctx.measureText(text).width);
        c.width = tw + 16;
        c.height = 64;
        cctx.font = `500 48px ${fam}`;
        cctx.textBaseline = "middle";
        cctx.fillStyle = THEMES[theme].label;
        cctx.fillText(text, 8, 34);
        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.colorSpace = THREE.SRGBColorSpace;
        const h = 24;
        const w = (c.width / c.height) * h;
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0.92,
            depthWrite: false,
          })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(room.x + 20 + w / 2, 0.9, room.y + 34);
        scene.add(mesh);
        labelMeshes.push(mesh);
      }
    };
    setTimeout(buildLabels, 0);

    // -- theme application ------------------------------------------------
    const applyTheme = () => {
      T = THEMES[theme];
      scene.background = new THREE.Color(T.bg);
      scene.fog = new THREE.FogExp2(T.bg, T.fogDensity);
      hemi.color.set(T.hemiSky);
      hemi.groundColor.set(T.hemiGround);
      hemi.intensity = T.hemiInt;
      dir.color.set(T.dir);
      dir.intensity = T.dirInt;
      lamp.color.set(T.point);
      lamp.intensity = T.pointInt;
      floorMat.color.set(T.floor);
      floorMat.opacity = T.floorOpacity;
      floorMat.roughness = T.floorRough;
      floorMat.metalness = T.floorMetal;
      wallMat.color.set(T.wall);
      wallMat.roughness = T.wallRough;
      trimMat.emissive.set(T.trim);
      trimMat.emissiveIntensity = T.trimIntensity;
      stoneMat.color.set(T.stone);
      accentMat.emissive.set(T.trim);
      for (const m of pulseMats) m.emissive.set(T.trim);
      bodyMat.color.set(T.body);
      packMat.color.set(T.pack);
      visorMat.color.set(T.visor);
      mirrorBody.color.set(T.body);
      mirrorPack.color.set(T.pack);
      mirrorVisor.color.set(T.visor);
      mirrorBody.opacity = T.mirrorOpacity;
      mirrorPack.opacity = T.mirrorOpacity;
      mirrorVisor.opacity = T.mirrorOpacity;
      for (const { ring } of ventRings) ring.material.emissive.set(T.trim);
      btnRing.material.emissive.set(T.trim);
      flashRing.material.color.set(T.trim);
      stars.visible = T.starsVisible;
      scene.environmentIntensity = T.envInt;
      if (bloomPass) {
        bloomPass.strength = T.bloom;
        bloomPass.threshold = T.bloomThreshold;
      }
      buildLabels();
    };
    const themeObserver = new MutationObserver(() => {
      const next = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      if (next !== theme) {
        theme = next;
        applyTheme();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // -- post ------------------------------------------------------------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      T.bloom,
      0.55,
      T.bloomThreshold
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
    applyTheme();

    // -- sizing ----------------------------------------------------------
    let cssW = 1;
    let cssH = 1;
    let dpr = 1;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(cssW, cssH, false);
      composer.setPixelRatio(dpr);
      composer.setSize(cssW, cssH);
      camera.aspect = cssW / cssH;
      camera.updateProjectionMatrix();
      hudCanvas.width = Math.round(cssW * dpr);
      hudCanvas.height = Math.round(cssH * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // -- game state ------------------------------------------------------
    const player = {
      x: SPAWN.x,
      y: SPAWN.y,
      vx: 0,
      vy: 0,
      angle: 0,
      walk: 0,
      scale: 0,
    };
    const cam = { x: SPAWN.x, y: SPAWN.y };
    const pressed = new Set();
    const toasts = [];
    let venting = null;
    let flash = null;
    let meetings = 0;
    let born = performance.now();
    let joy = null;
    let raf = 0;
    let last = performance.now();

    const toast = (text) => {
      toasts.push({ text, born: performance.now() });
      if (toasts.length > 4) toasts.shift();
    };
    setTimeout(() => toast("> you wake up in the cafeteria"), 500);
    setTimeout(() => toast("> everyone else already left"), 2300);

    window.__SUS = {
      get pos() {
        return { x: Math.round(player.x), y: Math.round(player.y) };
      },
      get room() {
        return roomAt(player.x, player.y)?.name ?? "hallway";
      },
    };

    const nearVent = () => {
      let best = null;
      let bd = 54;
      for (const v of VENTS) {
        const d = Math.hypot(player.x - v.x, player.y - v.y);
        if (d < bd) {
          bd = d;
          best = v;
        }
      }
      return best;
    };
    const nearButton = () =>
      Math.hypot(player.x - BUTTON.x, player.y - BUTTON.y) < 70;

    const interact = () => {
      if (venting) return;
      const v = nearVent();
      if (v) {
        const net = VENTS.filter((n) => n.net === v.net);
        const to = net[(net.indexOf(v) + 1) % net.length];
        venting = { from: v, to, t: 0 };
        toast(`> vented: ${v.room} → ${to.room}`);
        return;
      }
      if (nearButton()) {
        flash = { t: 0 };
        toast(MEETING_LINES[Math.min(meetings, MEETING_LINES.length - 1)]);
        meetings += 1;
        if (meetings >= MEETING_LINES.length) meetings = 1;
      }
    };

    const onKeyDown = (e) => {
      if (KEYS[e.code]) {
        pressed.add(e.code);
        e.preventDefault();
      } else if (INTERACT_CODES.has(e.code)) {
        interact();
        e.preventDefault();
      }
    };
    const onKeyUp = (e) => pressed.delete(e.code);
    const clearKeys = () => pressed.clear();
    wrap.addEventListener("keydown", onKeyDown);
    wrap.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);
    document.addEventListener("visibilitychange", clearKeys);

    const btnPos = () => ({ x: cssW - 64, y: cssH - 64, r: 30 });
    const onPointerDown = (e) => {
      if (e.pointerType !== "touch") return;
      const rect = hudCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const b = btnPos();
      if (Math.hypot(x - b.x, y - b.y) < b.r + 14) {
        interact();
        return;
      }
      if (!joy) joy = { ox: x, oy: y, dx: 0, dy: 0, id: e.pointerId };
    };
    const onPointerMove = (e) => {
      if (!joy || e.pointerId !== joy.id) return;
      const rect = hudCanvas.getBoundingClientRect();
      joy.dx = e.clientX - rect.left - joy.ox;
      joy.dy = e.clientY - rect.top - joy.oy;
      const len = Math.hypot(joy.dx, joy.dy);
      if (len > 48) {
        joy.dx = (joy.dx / len) * 48;
        joy.dy = (joy.dy / len) * 48;
      }
    };
    const onPointerEnd = (e) => {
      if (joy && e.pointerId === joy.id) joy = null;
    };
    hudCanvas.addEventListener("pointerdown", onPointerDown);
    hudCanvas.addEventListener("pointermove", onPointerMove);
    hudCanvas.addEventListener("pointerup", onPointerEnd);
    hudCanvas.addEventListener("pointercancel", onPointerEnd);

    // -- sim step --------------------------------------------------------
    const step = (dt, now) => {
      let ix = 0;
      let iy = 0;
      for (const code of pressed) {
        const k = KEYS[code];
        if (k) {
          ix += k[0];
          iy += k[1];
        }
      }
      if (joy) {
        ix += joy.dx / 40;
        iy += joy.dy / 40;
      }
      const ilen = Math.hypot(ix, iy);
      if (ilen > 1) {
        ix /= ilen;
        iy /= ilen;
      }
      if (venting) {
        ix = 0;
        iy = 0;
      }

      const k = 1 - Math.exp(-14 * dt);
      player.vx += (ix * SPEED - player.vx) * k;
      player.vy += (iy * SPEED - player.vy) * k;

      const steps = Math.max(
        1,
        Math.ceil((Math.hypot(player.vx, player.vy) * dt) / 10)
      );
      for (let i = 0; i < steps; i++) {
        const sx = (player.vx * dt) / steps;
        const sy = (player.vy * dt) / steps;
        if (fits(player.x + sx, player.y + sy)) {
          player.x += sx;
          player.y += sy;
        } else if (fits(player.x + sx, player.y)) {
          player.x += sx;
          player.vy = 0;
        } else if (fits(player.x, player.y + sy)) {
          player.y += sy;
          player.vx = 0;
        } else {
          player.vx = 0;
          player.vy = 0;
          break;
        }
      }

      const speed = Math.hypot(player.vx, player.vy);
      if (speed > 40) {
        const target = Math.atan2(player.vx, player.vy);
        let da = target - player.angle;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        player.angle += da * (1 - Math.exp(-12 * dt));
      }
      player.walk = speed > 40 ? player.walk + dt * (speed / 26) : 0;

      const age = (now - born) / 1000;
      player.scale = reduceMotion
        ? 1
        : Math.min(
            1,
            age < 0.35
              ? 1.15 * (age / 0.35)
              : 1 + Math.max(0, 0.15 - (age - 0.35) * 1.2)
          );

      if (venting) {
        venting.t += dt;
        if (venting.t >= 0.22 && venting.from) {
          player.x = venting.to.x;
          player.y = venting.to.y + 30;
          cam.x = player.x + (cam.x - player.x) * 0.25;
          cam.y = player.y + (cam.y - player.y) * 0.25;
          venting.from = null;
        }
        if (venting.t >= 0.5) venting = null;
      }
      if (flash) {
        flash.t += dt;
        if (flash.t > 0.9) flash = null;
      }

      const look = reduceMotion ? 0 : 52;
      const tx = player.x + (speed > 40 ? (player.vx / SPEED) * look : 0);
      const ty = player.y + (speed > 40 ? (player.vy / SPEED) * look : 0);
      const ck = 1 - Math.exp(-(venting ? 13 : 6.5) * dt);
      cam.x += (tx - cam.x) * ck;
      cam.y += (ty - cam.y) * ck;
    };

    // -- 3d sync + hud ---------------------------------------------------
    const V = new THREE.Vector3();
    const project = (x, y3, z) => {
      V.set(x, y3, z).project(camera);
      return [((V.x + 1) / 2) * cssW, ((1 - V.y) / 2) * cssH, V.z < 1];
    };
    let fontFam = "monospace";
    setTimeout(() => {
      fontFam = monoFamily();
    }, 0);

    const sync = (t) => {
      const ventScale = venting
        ? venting.from
          ? Math.max(0.03, 1 - venting.t / 0.2)
          : Math.min(1, (venting.t - 0.24) / 0.22)
        : 1;
      const s = Math.max(0.02, player.scale * ventScale);
      const sink = venting && venting.from ? (1 - ventScale) * 26 : 0;
      const bob = reduceMotion
        ? 0
        : player.walk > 0
          ? Math.abs(Math.sin(player.walk * Math.PI)) * 3
          : Math.sin(t * 2.2) * 1.2;

      crew.group.position.set(player.x, bob - sink, player.y);
      crew.group.scale.setScalar(s);
      crew.group.rotation.y = player.angle;
      const swing = player.walk > 0 ? Math.sin(player.walk * Math.PI) * 0.65 : 0;
      crew.hipL.rotation.x = swing;
      crew.hipR.rotation.x = -swing;

      mirror.group.position.set(player.x, -(bob - sink), player.y);
      mirror.group.scale.set(s, -s, s);
      mirror.group.rotation.y = player.angle;
      mirror.hipL.rotation.x = swing;
      mirror.hipR.rotation.x = -swing;

      lamp.position.set(player.x, 230, player.y + 40);

      const pulse = reduceMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 3.2);
      const nv = venting ? null : nearVent();
      for (const { v, ring } of ventRings) {
        const on = nv === v || (venting && venting.to === v);
        ring.material.opacity += ((on ? 0.55 + pulse * 0.35 : 0) - ring.material.opacity) * 0.25;
      }
      btnRing.material.opacity +=
        ((nearButton() && !venting ? 0.5 + pulse * 0.35 : 0) - btnRing.material.opacity) * 0.25;
      if (flash) {
        const ft = flash.t / 0.9;
        const r = 1 + ft * (reduceMotion ? 1.5 : 13);
        flashRing.scale.setScalar(r);
        flashRing.material.opacity = (1 - ft) * 0.5;
      } else {
        flashRing.material.opacity = 0;
      }
      for (let i = 0; i < reactorPulse.length; i++) {
        reactorPulse[i].material.emissiveIntensity =
          0.85 + (reduceMotion ? 0 : Math.sin(t * 2.1 + i * 1.7) * 0.25);
      }

      // camera: tilted follow, north-up so controls stay screen-aligned
      const fit = Math.min(Math.max(Math.max(1120 / cssW, 660 / cssH), 0.95), 1.7);
      camera.position.set(cam.x, 500 * fit, cam.y + 330 * fit);
      camera.lookAt(cam.x, 10, cam.y - 40);
      dir.target.position.set(cam.x, 0, cam.y);
      dir.position.set(cam.x - 420, 760, cam.y - 300);

      composer.render();

      // ---- hud ----
      hud.setTransform(dpr, 0, 0, dpr, 0, 0);
      hud.clearRect(0, 0, cssW, cssH);
      hud.font = `500 12px ${fontFam}`;
      hud.textBaseline = "alphabetic";
      const room = roomAt(player.x, player.y)?.name ?? "hallway";
      hud.fillStyle = T.hudDim;
      hud.fillText("~/the-m0/", 14, 24);
      hud.fillStyle = T.accent;
      hud.fillText(room, 14 + hud.measureText("~/the-m0/").width, 24);

      const hint = !venting && (nv || (nearButton() ? { x: BUTTON.x, y: BUTTON.y, label: "emergency meeting" } : null));
      if (hint) {
        const [sx, sy, ok] = project(hint.x, 46, hint.y);
        if (ok) {
          const label = `[e] ${hint.label ?? "vent"}`;
          hud.font = `500 13px ${fontFam}`;
          hud.fillStyle = T.accent;
          hud.fillText(label, sx - hud.measureText(label).width / 2, sy);
        }
      }

      hud.font = `500 12px ${fontFam}`;
      const now = performance.now();
      let ty = cssH - (touchMode ? 96 : 40);
      for (let i = toasts.length - 1; i >= 0; i--) {
        const age = (now - toasts[i].born) / 1000;
        if (age > 4.2) continue;
        const a =
          Math.min(1, age / 0.18) *
          (age > 3.5 ? Math.max(0, 1 - (age - 3.5) / 0.7) : 1);
        hud.globalAlpha = a;
        hud.fillStyle = T.toast;
        hud.fillText(toasts[i].text, 14, ty);
        ty -= 18;
      }
      hud.globalAlpha = 1;

      if (!touchMode) {
        const ch = "[wasd] move · [e] interact";
        hud.fillStyle = T.hudDim;
        hud.fillText(ch, cssW - hud.measureText(ch).width - 14, cssH - 14);
      } else {
        const b = btnPos();
        hud.strokeStyle = T.hudDim;
        hud.lineWidth = 2;
        hud.beginPath();
        hud.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        hud.stroke();
        hud.fillStyle = T.accent;
        hud.font = `500 14px ${fontFam}`;
        hud.fillText("e", b.x - hud.measureText("e").width / 2, b.y + 5);
        if (joy) {
          hud.strokeStyle = T.hudDim;
          hud.beginPath();
          hud.arc(joy.ox, joy.oy, 40, 0, Math.PI * 2);
          hud.stroke();
          hud.fillStyle = T.accent;
          hud.globalAlpha = 0.5;
          hud.beginPath();
          hud.arc(joy.ox + joy.dx, joy.oy + joy.dy, 16, 0, Math.PI * 2);
          hud.fill();
          hud.globalAlpha = 1;
        }
      }
    };

    // -- loop ------------------------------------------------------------
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt, now);
      sync(now / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      wrap.removeEventListener("keydown", onKeyDown);
      wrap.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      document.removeEventListener("visibilitychange", clearKeys);
      hudCanvas.removeEventListener("pointerdown", onPointerDown);
      hudCanvas.removeEventListener("pointermove", onPointerMove);
      hudCanvas.removeEventListener("pointerup", onPointerEnd);
      hudCanvas.removeEventListener("pointercancel", onPointerEnd);
      delete window.__SUS;
      scene.traverse((o) => {
        o.geometry?.dispose?.();
        if (o.material) {
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
            m.map?.dispose?.();
            m.dispose?.();
          }
        }
      });
      envTex.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, [touchMode]);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="application"
      aria-label="a small solo spaceship you can walk around with wasd or arrow keys. e interacts with vents and the emergency button."
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="group relative w-full overflow-hidden rounded-md border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-black/40 font-mono outline-none select-none touch-none focus-visible:border-amber-500/60 dark:focus-visible:border-amber-400/50"
      style={{ height: "clamp(420px, 62vh, 640px)" }}
    >
      <canvas ref={glRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={hudRef} className="absolute inset-0 h-full w-full" />
      {!focused && !touchMode && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4"
        >
          <span className="rounded border border-stone-300 dark:border-stone-700 bg-stone-100/90 dark:bg-stone-900/90 px-2.5 py-1 text-xs text-stone-500 dark:text-stone-400 animate-fade-in">
            [click] to take the controls
          </span>
        </div>
      )}
    </div>
  );
}
