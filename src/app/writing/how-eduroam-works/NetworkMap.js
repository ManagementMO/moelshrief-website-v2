import * as motion from "motion/react-client";
import styles from "./article.module.css";

const routeVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, ease: [0.77, 0, 0.175, 1] },
      opacity: { duration: 0.16, ease: [0.23, 1, 0.32, 1] },
    },
  },
};

const directionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.24, delay: 0.8, ease: [0.23, 1, 0.32, 1] },
  },
};

export default function NetworkMap({ mapData }) {
  const [arrowX, arrowY] = mapData.direction.point;

  return (
    <figure className={styles.networkMapFigure}>
      <div className={styles.figureTopline}>
        <strong>An example: Berlin asks Waterloo</strong>
        <span>not a packet trace</span>
      </div>
      <div className={styles.mapFrame}>
        <div className={styles.mapLegend}>
          <span className={styles.authKey}>sign-in request</span>
        </div>
        <motion.svg
          viewBox={`0 0 ${mapData.width} ${mapData.height}`}
          role="img"
          aria-labelledby="eduroam-map-title eduroam-map-description"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <title id="eduroam-map-title">An example eduroam login between Berlin and Waterloo</title>
          <desc id="eduroam-map-description">
            A world map with one line showing a sign-in request traveling from a visited campus in
            Berlin toward a home institution in Waterloo.
          </desc>
          <path d={mapData.graticulePath} className={styles.graticule} />
          <path d={mapData.landPath} className={styles.worldLand} />
          <motion.path d={mapData.route} className={styles.authMapRoute} variants={routeVariants} />
          <motion.g
            className={styles.routeDirection}
            transform={`translate(${arrowX} ${arrowY}) rotate(${mapData.direction.angle})`}
            variants={directionVariants}
            aria-hidden="true"
          >
            <path d="M -8 -5 L 0 0 L -8 5" />
          </motion.g>
          <MapPlace place={mapData.places.home} align="end" />
          <MapPlace place={mapData.places.visited} align="start" />
        </motion.svg>
      </div>
      <figcaption className={styles.figureCaption}>
        The line shows the sign-in request leaving Berlin for Waterloo. The single arrow only shows
        direction; it is not a literal flight or packet path. The real server route varies by
        institution and country.
      </figcaption>
    </figure>
  );
}

function MapPlace({ place, align }) {
  const [x, y] = place.point;
  const anchor = align === "end" ? "end" : "start";
  const offset = align === "end" ? -15 : 15;

  return (
    <g className={styles.mapPlace}>
      <circle cx={x} cy={y} r="5" />
      <text x={x + offset} y={y - 3} textAnchor={anchor} className={styles.mapPlaceLabel}>
        {place.label}
      </text>
      <text x={x + offset} y={y + 13} textAnchor={anchor} className={styles.mapPlaceLocation}>
        {place.location}
      </text>
    </g>
  );
}
