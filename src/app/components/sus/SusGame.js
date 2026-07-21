"use client";

import { useEffect, useRef, useState } from "react";
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
// palette — mirrors the site's stone/amber theme so the game blends in.
// ---------------------------------------------------------------------------
const PALETTES = {
  dark: {
    floor: "#161311",
    floorDot: "#231f1b",
    wall: "#2a2523",
    wallEdge: "#3b3633",
    line: "#57534e",
    lineSoft: "#44403c",
    label: "#6f6a64",
    labelActive: "#a8a29e",
    star: "#78716c",
    accent: "#fbbf24",
    accentSoft: "rgba(251, 191, 36, 0.45)",
    body: "#fbbf24",
    bodyShade: "#d97706",
    visor: "#e7e5e4",
    visorShine: "#ffffff",
    outline: "#0c0a09",
    shadow: "rgba(0, 0, 0, 0.5)",
    glow: "rgba(0, 0, 0, 0.55)",
    hud: "#a8a29e",
    hudDim: "#57534e",
    toast: "#d6d3d1",
  },
  light: {
    floor: "#fafaf9",
    floorDot: "#e7e5e4",
    wall: "#d6d3d1",
    wallEdge: "#bab5b1",
    line: "#a8a29e",
    lineSoft: "#c7c2bd",
    label: "#a8a29e",
    labelActive: "#57534e",
    star: "#a8a29e",
    accent: "#d97706",
    accentSoft: "rgba(217, 119, 6, 0.4)",
    body: "#f59e0b",
    bodyShade: "#d97706",
    visor: "#fafaf9",
    visorShine: "#ffffff",
    outline: "#44403c",
    shadow: "rgba(28, 25, 23, 0.18)",
    glow: "rgba(28, 25, 23, 0.22)",
    hud: "#78716c",
    hudDim: "#a8a29e",
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

const R = 20; // collision radius (world units)
const SPEED = 300; // walk speed (world units / s)

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

function rr(ctx, x, y, w, h, r) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  const rad = Math.min(typeof r === "number" ? r : 8, w / 2, h / 2);
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

// ---------------------------------------------------------------------------
// per-room set dressing — simple line art, drawn in world space.
// ---------------------------------------------------------------------------
function drawDecor(ctx, room, t, P) {
  const cx = room.x + room.w / 2;
  const cy = room.y + room.h / 2;
  ctx.lineWidth = 2;
  ctx.strokeStyle = P.line;

  switch (room.id) {
    case "cafeteria": {
      for (const [dx, dy] of [
        [-150, 60],
        [150, 60],
        [0, 150],
      ]) {
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, 14, 0, Math.PI * 2);
        ctx.strokeStyle = P.lineSoft;
        ctx.stroke();
        ctx.strokeStyle = P.line;
      }
      break;
    }
    case "weapons": {
      ctx.beginPath();
      ctx.arc(cx, cy + 14, 44, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy + 14);
      ctx.lineTo(cx + 60, cy + 14);
      ctx.moveTo(cx, cy - 46);
      ctx.lineTo(cx, cy + 74);
      ctx.strokeStyle = P.lineSoft;
      ctx.stroke();
      break;
    }
    case "navigation": {
      ctx.beginPath();
      ctx.arc(cx, cy + 66, 60, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.beginPath();
      rr(ctx, cx - 22, cy + 10, 44, 26, 6);
      ctx.stroke();
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 4);
      ctx.lineTo(cx, cy - 74);
      ctx.strokeStyle = P.lineSoft;
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    case "o2": {
      for (const dx of [-26, 6]) {
        ctx.beginPath();
        rr(ctx, cx + dx, cy - 8, 22, 54, 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + dx + 5, cy + 6);
        ctx.lineTo(cx + dx + 17, cy + 6);
        ctx.strokeStyle = P.lineSoft;
        ctx.stroke();
        ctx.strokeStyle = P.line;
      }
      break;
    }
    case "shields": {
      for (const [dx, dy, dash] of [
        [-30, 4, false],
        [30, 4, false],
        [0, -40, true],
      ]) {
        if (dash) ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
          const px = cx + dx + Math.cos(a) * 24;
          const py = cy + 20 + dy + Math.sin(a) * 24;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      }
      break;
    }
    case "comms": {
      ctx.beginPath();
      ctx.arc(cx - 6, cy + 8, 40, Math.PI * 1.2, Math.PI * 1.75);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy + 34);
      ctx.lineTo(cx - 6, cy + 8);
      ctx.stroke();
      ctx.beginPath();
      rr(ctx, cx - 24, cy + 34, 36, 16, 4);
      ctx.stroke();
      const blink = Math.sin(t * 2.4) > 0.3;
      if (blink) {
        ctx.fillStyle = P.accentSoft;
        ctx.beginPath();
        ctx.arc(cx + 34, cy - 24, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "storage": {
      ctx.beginPath();
      rr(ctx, cx - 60, cy + 30, 46, 46, 6);
      ctx.stroke();
      ctx.beginPath();
      rr(ctx, cx - 6, cy + 44, 40, 32, 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 46, cy - 10, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy + 53);
      ctx.lineTo(cx - 14, cy + 53);
      ctx.strokeStyle = P.lineSoft;
      ctx.stroke();
      break;
    }
    case "admin": {
      ctx.beginPath();
      rr(ctx, cx - 62, cy + 6, 124, 74, 8);
      ctx.stroke();
      ctx.strokeStyle = P.lineSoft;
      for (const [mx, my, mw, mh] of [
        [-46, 22, 22, 16],
        [-14, 22, 30, 20],
        [24, 24, 26, 14],
        [-38, 48, 30, 18],
        [4, 50, 38, 16],
      ]) {
        ctx.beginPath();
        rr(ctx, cx + mx, cy + my, mw, mh, 3);
        ctx.stroke();
      }
      break;
    }
    case "electrical": {
      ctx.beginPath();
      rr(ctx, cx - 66, cy - 4, 82, 58, 6);
      ctx.stroke();
      ctx.strokeStyle = P.lineSoft;
      for (const dx of [-48, -26, -4]) {
        ctx.beginPath();
        ctx.moveTo(cx + dx, cy + 8);
        ctx.lineTo(cx + dx, cy + 42);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx + 16, cy + 24);
      ctx.lineTo(cx + 30, cy + 12);
      ctx.lineTo(cx + 42, cy + 32);
      ctx.lineTo(cx + 56, cy + 18);
      ctx.stroke();
      break;
    }
    case "medbay": {
      for (const dx of [-52, 4]) {
        ctx.beginPath();
        rr(ctx, cx + dx, cy - 6, 42, 74, 12);
        ctx.stroke();
      }
      const pulse = 20 + Math.sin(t * 2) * 4;
      ctx.beginPath();
      ctx.arc(cx + 80, cy + 30, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = P.lineSoft;
      ctx.stroke();
      break;
    }
    case "security": {
      for (const dx of [-52, -8, 36]) {
        ctx.beginPath();
        rr(ctx, cx + dx, cy - 10, 38, 28, 4);
        ctx.stroke();
      }
      ctx.fillStyle = P.lineSoft;
      const rnd = mulberry32(Math.floor(t * 6));
      for (let i = 0; i < 9; i++) {
        ctx.fillRect(cx - 48 + rnd() * 120, cy - 6 + rnd() * 18, 2, 2);
      }
      break;
    }
    case "reactor": {
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 58, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 30, 0, Math.PI * 2);
      ctx.strokeStyle = P.lineSoft;
      ctx.stroke();
      ctx.strokeStyle = P.line;
      const spin = t * 0.5;
      for (let i = 0; i < 8; i++) {
        const a = spin + (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 40, cy + 20 + Math.sin(a) * 40);
        ctx.lineTo(cx + Math.cos(a) * 50, cy + 20 + Math.sin(a) * 50);
        ctx.stroke();
      }
      break;
    }
    case "upperEngine":
    case "lowerEngine": {
      ctx.beginPath();
      rr(ctx, cx - 30, cy - 52, 76, 108, 14);
      ctx.stroke();
      ctx.strokeStyle = P.lineSoft;
      const flick = Math.sin(t * 7 + (room.id === "lowerEngine" ? 2 : 0));
      for (let i = 0; i < 3; i++) {
        const len = 18 + i * 8 + flick * 4;
        ctx.beginPath();
        ctx.moveTo(cx - 44, cy - 24 + i * 26);
        ctx.lineTo(cx - 44 - len, cy - 24 + i * 26);
        ctx.stroke();
      }
      break;
    }
    default:
      break;
  }
}

// ---------------------------------------------------------------------------
// the crewmate. drawn at (0,0) = feet center; caller translates.
// ---------------------------------------------------------------------------
function drawCrewmate(ctx, P, { face, walk, bob, scale }) {
  ctx.save();
  ctx.scale(scale, scale);

  // shadow
  ctx.fillStyle = P.shadow;
  ctx.beginPath();
  ctx.ellipse(0, 2, 24, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.scale(face, 1);
  ctx.translate(0, bob);
  ctx.lineWidth = 3;
  ctx.strokeStyle = P.outline;

  // legs
  const lift = Math.sin(walk) * 6;
  for (const [side, dx] of [
    [1, -12],
    [-1, 10],
  ]) {
    const up = Math.max(0, side * lift);
    ctx.fillStyle = P.body;
    ctx.beginPath();
    rr(ctx, dx + side * lift * 0.4, -20 - up, 14, 22 + up * 0.4, [
      2, 2, 6, 6,
    ]);
    ctx.fill();
    ctx.stroke();
  }

  // backpack
  ctx.fillStyle = P.bodyShade;
  ctx.beginPath();
  rr(ctx, -34, -46, 14, 32, [7, 4, 4, 7]);
  ctx.fill();
  ctx.stroke();

  // body
  ctx.fillStyle = P.body;
  ctx.beginPath();
  rr(ctx, -23, -58, 46, 46, [22, 24, 12, 12]);
  ctx.fill();
  ctx.stroke();

  // visor
  ctx.fillStyle = P.visor;
  ctx.beginPath();
  rr(ctx, 0, -50, 26, 16, [8, 9, 9, 8]);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = P.visorShine;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  rr(ctx, 5, -47, 10, 5, 3);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// component
// ---------------------------------------------------------------------------
export default function SusGame() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [touchMode, setTouchMode] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) setTouchMode(true);

    // -- theme ------------------------------------------------------------
    let P = PALETTES[
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    ];
    const themeObserver = new MutationObserver(() => {
      P = PALETTES[
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      ];
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // -- sizing -----------------------------------------------------------
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // -- static geometry --------------------------------------------------
    const wallPath = new Path2D();
    const floorPath = new Path2D();
    const T = 10; // wall band thickness
    for (const r of WALK) {
      if (wallPath.roundRect) {
        wallPath.roundRect(r.x - T, r.y - T, r.w + T * 2, r.h + T * 2, 16);
        floorPath.roundRect(r.x, r.y, r.w, r.h, 8);
      } else {
        wallPath.rect(r.x - T, r.y - T, r.w + T * 2, r.h + T * 2);
        floorPath.rect(r.x, r.y, r.w, r.h);
      }
    }

    const rnd = mulberry32(1337);
    const stars = Array.from({ length: 70 }, () => ({
      x: WORLD.x - 200 + rnd() * (WORLD.w + 400),
      y: WORLD.y - 200 + rnd() * (WORLD.h + 400),
      r: 0.8 + rnd() * 1.4,
      p: rnd() * Math.PI * 2,
      s: 0.4 + rnd() * 1.2,
    }));

    // -- state ------------------------------------------------------------
    const player = {
      x: SPAWN.x,
      y: SPAWN.y,
      vx: 0,
      vy: 0,
      face: 1,
      faceT: 1,
      walk: 0,
      scale: 0,
    };
    const cam = { x: SPAWN.x, y: SPAWN.y };
    const pressed = new Set();
    const toasts = [];
    const dust = [];
    let venting = null; // { from, to, t }
    let flash = null; // { x, y, t }
    let meetings = 0;
    let dustT = 0;
    let born = performance.now();
    let joy = null; // { ox, oy, dx, dy, id }
    let raf = 0;
    let last = performance.now();

    const toast = (text) => {
      toasts.push({ text, born: performance.now() });
      if (toasts.length > 4) toasts.shift();
    };
    setTimeout(() => toast("> you wake up in the cafeteria"), 500);
    setTimeout(() => toast("> everyone else already left"), 2300);

    // dev sanity: every walkable rect should be reachable from spawn.
    if (process.env.NODE_ENV === "development") {
      const seen = new Set();
      const touches = (a, b) =>
        a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
      const start = WALK.findIndex(
        (r) =>
          SPAWN.x >= r.x &&
          SPAWN.x <= r.x + r.w &&
          SPAWN.y >= r.y &&
          SPAWN.y <= r.y + r.h
      );
      const queue = [start];
      seen.add(start);
      while (queue.length) {
        const i = queue.pop();
        WALK.forEach((r, j) => {
          if (!seen.has(j) && touches(WALK[i], r)) {
            seen.add(j);
            queue.push(j);
          }
        });
      }
      if (seen.size !== WALK.length) {
        console.warn(`[sus] unreachable rects: ${WALK.length - seen.size}`);
      }
    }

    // debug/verification hook
    window.__SUS = {
      get pos() {
        return { x: Math.round(player.x), y: Math.round(player.y) };
      },
      get room() {
        return roomAt(player.x, player.y)?.name ?? "hallway";
      },
    };

    // -- input ------------------------------------------------------------
    const nearVent = () => {
      let best = null;
      let bd = 52;
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
      Math.hypot(player.x - BUTTON.x, player.y - BUTTON.y) < 64;

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
        flash = { x: BUTTON.x, y: BUTTON.y, t: 0 };
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

    // touch joystick + action button
    const btnPos = () => ({ x: cssW - 64, y: cssH - 64, r: 30 });
    const onPointerDown = (e) => {
      if (e.pointerType !== "touch") return;
      const rect = canvas.getBoundingClientRect();
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
      const rect = canvas.getBoundingClientRect();
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
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerEnd);
    canvas.addEventListener("pointercancel", onPointerEnd);

    // -- simulation -------------------------------------------------------
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

      // collision: substep + axis-separated slide
      const steps = Math.max(1, Math.ceil((Math.hypot(player.vx, player.vy) * dt) / 10));
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
      if (Math.abs(player.vx) > 30) player.face = player.vx > 0 ? 1 : -1;
      player.faceT += (player.face - player.faceT) * (1 - Math.exp(-18 * dt));
      player.walk = speed > 40 ? player.walk + dt * (speed / 26) : 0;

      // spawn pop-in
      const age = (now - born) / 1000;
      player.scale = reduceMotion
        ? 1
        : Math.min(1, age < 0.35 ? 1.15 * (age / 0.35) : 1 + Math.max(0, 0.15 - (age - 0.35) * 1.2));

      // dust
      if (!reduceMotion && speed > 80) {
        dustT += dt;
        if (dustT > 0.12) {
          dustT = 0;
          dust.push({
            x: player.x - (player.vx / speed) * 12 + (Math.random() - 0.5) * 10,
            y: player.y + 20,
            life: 0.45,
          });
        }
      }
      for (let i = dust.length - 1; i >= 0; i--) {
        dust[i].life -= dt;
        if (dust[i].life <= 0) dust.splice(i, 1);
      }

      // venting animation
      if (venting) {
        venting.t += dt;
        if (venting.t >= 0.22 && venting.from) {
          player.x = venting.to.x;
          player.y = venting.to.y + 26;
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

      // camera
      const zoom = Math.min(Math.max(Math.min(cssW / 1150, cssH / 700), 0.62), 1.05);
      const look = reduceMotion ? 0 : 46;
      const tx = player.x + (speed > 40 ? (player.vx / SPEED) * look : 0);
      const ty = player.y + (speed > 40 ? (player.vy / SPEED) * look : 0);
      const ck = 1 - Math.exp(-(venting ? 13 : 6.5) * dt);
      cam.x += (tx - cam.x) * ck;
      cam.y += (ty - cam.y) * ck;
      const hw = cssW / 2 / zoom;
      const hh = cssH / 2 / zoom;
      cam.x = Math.min(Math.max(cam.x, WORLD.x + hw - 160), WORLD.x + WORLD.w - hw + 160);
      cam.y = Math.min(Math.max(cam.y, WORLD.y + hh - 160), WORLD.y + WORLD.h - hh + 160);
      if (WORLD.w < cssW / zoom) cam.x = WORLD.x + WORLD.w / 2;
      if (WORLD.h < cssH / zoom) cam.y = WORLD.y + WORLD.h / 2;
      return zoom;
    };

    // -- render -----------------------------------------------------------
    const mono = () => {
      const fam = getComputedStyle(wrap).fontFamily || "monospace";
      return fam;
    };
    let fontFam = "monospace";
    setTimeout(() => {
      fontFam = mono();
    }, 0);

    const render = (zoom, t) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      // stars (parallax, behind the ship)
      ctx.save();
      ctx.translate(cssW / 2, cssH / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-cam.x * 0.35 - (WORLD.x + WORLD.w / 2) * 0.65, -cam.y * 0.35 - (WORLD.y + WORLD.h / 2) * 0.65);
      for (const s of stars) {
        const tw = reduceMotion ? 0.5 : 0.35 + 0.35 * Math.sin(t * s.s + s.p);
        ctx.globalAlpha = tw * 0.5;
        ctx.fillStyle = P.star;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // world
      ctx.save();
      ctx.translate(cssW / 2, cssH / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-cam.x, -cam.y);

      // hull glow + wall band + floor
      ctx.save();
      ctx.shadowColor = P.glow;
      ctx.shadowBlur = 34;
      ctx.fillStyle = P.wall;
      ctx.fill(wallPath);
      ctx.restore();
      ctx.strokeStyle = P.wallEdge;
      ctx.lineWidth = 1.5;
      ctx.stroke(wallPath);
      ctx.fillStyle = P.floor;
      ctx.fill(floorPath);

      // floor dots (clipped, visible range only)
      ctx.save();
      ctx.clip(floorPath);
      ctx.fillStyle = P.floorDot;
      const gap = 26;
      const x0 = Math.floor((cam.x - cssW / 2 / zoom) / gap) * gap;
      const x1 = cam.x + cssW / 2 / zoom;
      const y0 = Math.floor((cam.y - cssH / 2 / zoom) / gap) * gap;
      const y1 = cam.y + cssH / 2 / zoom;
      for (let gx = x0; gx <= x1; gx += gap) {
        for (let gy = y0; gy <= y1; gy += gap) {
          ctx.fillRect(gx, gy, 2, 2);
        }
      }
      ctx.restore();

      // room labels + decor
      const inRoom = roomAt(player.x, player.y);
      ctx.textBaseline = "top";
      for (const room of ROOMS) {
        drawDecor(ctx, room, t, P);
        ctx.font = `500 15px ${fontFam}`;
        ctx.fillStyle = room === inRoom ? P.labelActive : P.label;
        ctx.fillText(`// ${room.name}`, room.x + 16, room.y + 14);
      }

      // vents
      const nv = (() => {
        let best = null;
        let bd = 52;
        for (const v of VENTS) {
          const d = Math.hypot(player.x - v.x, player.y - v.y);
          if (d < bd) {
            bd = d;
            best = v;
          }
        }
        return best;
      })();
      for (const v of VENTS) {
        const active =
          venting && (venting.to === v || venting.from === v)
            ? Math.sin(t * 40) * 1.6
            : 0;
        ctx.strokeStyle = P.line;
        ctx.lineWidth = 2;
        ctx.beginPath();
        rr(ctx, v.x - 23, v.y - 16, 46, 32, 9);
        ctx.stroke();
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(v.x - 14, v.y + i * 8 + active * i);
          ctx.lineTo(v.x + 14, v.y + i * 8 + active * i);
          ctx.strokeStyle = P.lineSoft;
          ctx.stroke();
        }
        if (v === nv && !venting) {
          const pr = 30 + (reduceMotion ? 0 : Math.sin(t * 3.4) * 3);
          ctx.strokeStyle = P.accentSoft;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(v.x, v.y, pr, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // emergency button
      ctx.strokeStyle = P.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(BUTTON.x, BUTTON.y, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = P.accent;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(BUTTON.x, BUTTON.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = P.outline;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (nearButton() && !venting) {
        const pr = 40 + (reduceMotion ? 0 : Math.sin(t * 3.4) * 3);
        ctx.strokeStyle = P.accentSoft;
        ctx.beginPath();
        ctx.arc(BUTTON.x, BUTTON.y, pr, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (flash) {
        const ft = flash.t / 0.9;
        ctx.strokeStyle = P.accent;
        ctx.globalAlpha = (1 - ft) * 0.35;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, 40 + ft * (reduceMotion ? 60 : 620), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // dust
      for (const d of dust) {
        ctx.globalAlpha = (d.life / 0.45) * 0.5;
        ctx.fillStyle = P.line;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // crewmate
      const ventScale = venting
        ? venting.from
          ? Math.max(0.05, 1 - venting.t / 0.2)
          : Math.min(1, (venting.t - 0.24) / 0.22)
        : 1;
      const bob = reduceMotion
        ? 0
        : Math.sin(t * (player.walk > 0 ? 9 : 2.2)) * (player.walk > 0 ? 2.5 : 1.4);
      ctx.save();
      ctx.translate(player.x, player.y + 26);
      drawCrewmate(ctx, P, {
        face: player.faceT >= 0 ? Math.max(0.25, player.faceT) : Math.min(-0.25, player.faceT),
        walk: player.walk * Math.PI,
        bob,
        scale: Math.max(0.02, player.scale * ventScale),
      });
      ctx.restore();

      // interaction hint (world-space, above target)
      const hintFor = !venting && (nv || (nearButton() ? { x: BUTTON.x, y: BUTTON.y, label: "emergency meeting" } : null));
      if (hintFor) {
        const label = hintFor.label ?? "vent";
        ctx.font = `500 13px ${fontFam}`;
        ctx.textBaseline = "alphabetic";
        const tx = hintFor.x;
        const ty = hintFor.y - 44;
        const tw = ctx.measureText(`[e] ${label}`).width;
        ctx.fillStyle = P.accent;
        ctx.fillText(`[e] ${label}`, tx - tw / 2, ty);
      }

      ctx.restore();

      // ---- HUD (screen space) ----
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textBaseline = "alphabetic";
      ctx.font = `500 12px ${fontFam}`;
      const room = inRoom?.name ?? "hallway";
      ctx.fillStyle = P.hudDim;
      ctx.fillText("~/the-m0/", 14, 24);
      const pw = ctx.measureText("~/the-m0/").width;
      ctx.fillStyle = P.accent;
      ctx.fillText(room, 14 + pw, 24);

      // toasts
      const now = performance.now();
      let ty = cssH - (touchMode ? 96 : 40);
      for (let i = toasts.length - 1; i >= 0; i--) {
        const age = (now - toasts[i].born) / 1000;
        if (age > 4.2) continue;
        const a = Math.min(1, age / 0.18) * (age > 3.5 ? Math.max(0, 1 - (age - 3.5) / 0.7) : 1);
        ctx.globalAlpha = a;
        ctx.fillStyle = P.toast;
        ctx.fillText(toasts[i].text, 14, ty);
        ty -= 18;
      }
      ctx.globalAlpha = 1;

      // controls hint
      if (!touchMode) {
        const hint = "[wasd] move · [e] interact";
        const w = ctx.measureText(hint).width;
        ctx.fillStyle = P.hudDim;
        ctx.fillText(hint, cssW - w - 14, cssH - 14);
      }

      // touch UI
      if (touchMode) {
        const b = btnPos();
        ctx.strokeStyle = P.hudDim;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = P.accent;
        ctx.font = `500 14px ${fontFam}`;
        const ew = ctx.measureText("e").width;
        ctx.fillText("e", b.x - ew / 2, b.y + 5);
        if (joy) {
          ctx.strokeStyle = P.hudDim;
          ctx.beginPath();
          ctx.arc(joy.ox, joy.oy, 40, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = P.accentSoft;
          ctx.beginPath();
          ctx.arc(joy.ox + joy.dx, joy.oy + joy.dy, 16, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // -- loop -------------------------------------------------------------
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const zoom = step(dt, now);
      render(zoom, now / 1000);
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
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
      delete window.__SUS;
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
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
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
