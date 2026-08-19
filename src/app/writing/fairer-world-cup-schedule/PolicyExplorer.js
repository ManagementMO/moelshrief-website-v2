"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import styles from "./article.module.css";

const km = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "always",
});

export default function PolicyExplorer({ mapData }) {
  const [selectedId, setSelectedId] = useState("model-1b");
  const policy = mapData.policies.find((entry) => entry.id === selectedId);
  const official = mapData.policies[0];
  const boundsRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.35 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.35 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [1.2, -1.2]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-1.5, 1.5]);

  function handlePointerEnter(event) {
    if (reduceMotion || event.pointerType === "touch") return;
    boundsRef.current = event.currentTarget.getBoundingClientRect();
  }

  function handlePointerMove(event) {
    const bounds = boundsRef.current;
    if (reduceMotion || event.pointerType === "touch" || !bounds) return;
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetPointer() {
    boundsRef.current = null;
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <figure className={styles.policyFigure}>
      <div className={styles.figureHeading}>
        <strong>What happens when FIFA is allowed to move more of the schedule?</strong>
      </div>
      <motion.div
        className={styles.policyMapStage}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      >
        <div className={styles.policyControls} aria-label="Choose a schedule">
          {mapData.policies.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={entry.id === selectedId}
              onClick={() => setSelectedId(entry.id)}
            >
              {entry.control}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.svg
            key={policy.id}
            viewBox={`0 0 ${mapData.width} ${mapData.height}`}
            role="img"
            aria-label={`Algeria itinerary under ${policy.label}`}
            initial={reduceMotion ? false : { opacity: 0.3, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0.15, scale: 1.005 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <use href="#fifa-north-america" className={styles.policyLand} />
            {policy.id !== "official" ? (
              <path
                d={official.path}
                className={styles.ghostRoute}
                vectorEffect="non-scaling-stroke"
              />
            ) : null}
            <path
              d={policy.path}
              fill="none"
              stroke={policy.color}
              strokeWidth="3.2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className={styles.policyRoute}
            />
            {mapData.venuePoints.map((venue) => {
              const onRoute = policy.route.includes(venue.id);
              return (
                <circle
                  key={venue.id}
                  cx={venue.point[0]}
                  cy={venue.point[1]}
                  r={onRoute ? 6 : 2.8}
                  className={onRoute ? styles.activeVenue : styles.venueDot}
                  stroke={onRoute ? policy.color : undefined}
                  vectorEffect="non-scaling-stroke"
                >
                  <title>{venue.city}</title>
                </circle>
              );
            })}
            {policy.stops.map(({ id, point }, index) => (
              <text
                key={`${id}-${index}`}
                x={point[0]}
                y={point[1] - 12}
                textAnchor="middle"
                className={styles.policyLabel}
              >
                {id}
              </text>
            ))}
          </motion.svg>
        </AnimatePresence>
      </motion.div>
      <p className={styles.policyResult} aria-live="polite">
        {policy.id === "official" ? (
          <>
            FIFA’s schedule puts the worst itinerary at <strong>{km.format(policy.maxKm)} km</strong>{" "}
            and total team travel at <strong>{km.format(policy.totalKm)} km</strong>.
          </>
        ) : (
          <>
            This version brings the worst itinerary to <strong>{km.format(policy.maxKm)} km</strong> (
            {pct.format(policy.pctMax)}%) and total travel to{" "}
            <strong>{km.format(policy.totalKm)} km</strong> ({pct.format(policy.pctTotal)}%). No team
            travels farther than it does in FIFA’s schedule.
          </>
        )}
      </p>
      <figcaption className={styles.figureCaption}>
        To make the change concrete, the map follows Algeria across its three host cities. The
        sentence above reports the result across all 48 teams.{" "}
        {policy.id === "official" ? null : "The gray line is Algeria’s route in FIFA’s schedule. "}
        {policy.proof}
      </figcaption>
    </figure>
  );
}
