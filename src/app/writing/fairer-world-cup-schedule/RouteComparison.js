import styles from "./article.module.css";

const km = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export default function RouteComparison({ mapData }) {
  return (
    <figure className={styles.routeComparison}>
      <div className={styles.figureHeading}>
        <strong>Same tournament, two very different journeys</strong>
      </div>
      <div className={styles.comparisonGrid}>
        {mapData.comparisons.map((entry, caseIndex) => (
          <section
            key={entry.id}
            className={styles.routeCase}
            style={{ "--route": entry.color }}
            aria-labelledby={`route-case-${entry.id}`}
          >
            <header className={styles.routeCaseHeading}>
              <span className={styles.routeKey}>
                <i />
                {entry.label}
              </span>
              <strong id={`route-case-${entry.id}`}>{entry.team}</strong>
              <b>{km.format(entry.travelKm)} km</b>
            </header>
            <div className={styles.mapShell}>
              <svg viewBox={entry.viewBox} role="img" aria-labelledby={`route-case-${entry.id}`}>
                <use href="#fifa-north-america" className={styles.land} />
                <path
                  d={entry.path}
                  className={styles.routeLine}
                  style={{ "--route-index": caseIndex }}
                  stroke={entry.color}
                  strokeWidth={caseIndex === 0 ? 4.2 : 2.4}
                  vectorEffect="non-scaling-stroke"
                />
                {[...new Map(entry.stops.map((stop) => [stop.id, stop])).values()].map(
                  ({ id, point }) => (
                    <g key={id}>
                      <circle
                        cx={point[0]}
                        cy={point[1]}
                        r={entry.nodeRadius}
                        className={styles.routeNode}
                        stroke={entry.color}
                        strokeWidth={caseIndex === 0 ? 2.2 : 1.2}
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x={point[0]}
                        y={point[1] - entry.nodeRadius * 2}
                        textAnchor="middle"
                        className={styles.mapLabel}
                        fontSize={entry.labelSize}
                      >
                        {id}
                      </text>
                    </g>
                  )
                )}
              </svg>
            </div>
            <p className={styles.routeCode}>{entry.route.join(" → ")}</p>
          </section>
        ))}
      </div>
      <figcaption className={styles.figureCaption}>
        Each line connects the stadiums a team visits for its three group games. I use straight-line
        distance so every schedule is measured in the same way. It is a planning proxy, not a
        literal flight itinerary.
      </figcaption>
    </figure>
  );
}
