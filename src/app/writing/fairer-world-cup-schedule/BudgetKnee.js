import { budgetSeries } from "./scheduleData";
import styles from "./article.module.css";

const W = 940;
const H = 420;
const M = { left: 86, right: 36, top: 42, bottom: 92 };
const xMax = 25.5;
const yMin = 3200;
const yMax = 5200;
const plotBottom = H - M.bottom;
const x = (k) => M.left + (k / xMax) * (W - M.left - M.right);
const y = (value) => plotBottom - ((value - yMin) / (yMax - yMin)) * (plotBottom - M.top);
const line = budgetSeries
  .map((point, index) => `${index === 0 ? "M" : "L"}${x(point.k)},${y(point.maxKm)}`)
  .join("");
const knee = budgetSeries.find((point) => point.k === 10);

export default function BudgetKnee() {
  return (
    <figure className={styles.kneeFigure}>
      <div className={styles.figureHeading}>
        <strong>Ten match moves capture most of the available protection</strong>
        <span className={styles.chartScrollHint} aria-hidden="true">scroll chart →</span>
      </div>
      <div
        className={styles.chartScroller}
        tabIndex="0"
        role="group"
        aria-label="Budget curve. Horizontally scrollable on small screens."
      >
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="knee-title knee-description">
          <title id="knee-title">Worst-team travel by allowed match moves</title>
          <desc id="knee-description">
            The curve drops quickly through ten moves and then flattens. Proven points are solid. The
            24-move point is time-limited.
          </desc>

          <line
            x1={M.left}
            y1={M.top}
            x2={M.left}
            y2={plotBottom}
            className={styles.chartAxisLine}
          />
          <line
            x1={M.left}
            y1={plotBottom}
            x2={W - M.right}
            y2={plotBottom}
            className={styles.chartAxisLine}
          />

          {[3500, 4000, 4500, 5000].map((tick) => (
            <g key={tick}>
              <line
                x1={M.left}
                y1={y(tick)}
                x2={W - M.right}
                y2={y(tick)}
                className={styles.chartGrid}
              />
              <text x={M.left - 10} y={y(tick) + 4} textAnchor="end" className={styles.chartTick}>
                {tick.toLocaleString("en-US")}
              </text>
            </g>
          ))}

          <path d={line} className={styles.chartLine} />

          {budgetSeries.map((point) => (
            <g key={point.k}>
              {point.proven ? (
                <circle
                  cx={x(point.k)}
                  cy={y(point.maxKm)}
                  r="6.5"
                  className={styles.chartPoint}
                >
                  <title>{`${point.k} moves: ${Math.round(point.maxKm).toLocaleString("en-US")} km, proven`}</title>
                </circle>
              ) : (
                <path
                  d={`M ${x(point.k)} ${y(point.maxKm) - 7} L ${x(point.k) + 7} ${y(point.maxKm) + 5.5} L ${x(point.k) - 7} ${y(point.maxKm) + 5.5} Z`}
                  className={styles.chartLimitedPoint}
                >
                  <title>{`${point.k} moves: ${Math.round(point.maxKm).toLocaleString("en-US")} km, time-limited`}</title>
                </path>
              )}
              <line
                x1={x(point.k)}
                y1={plotBottom}
                x2={x(point.k)}
                y2={plotBottom + 7}
                className={styles.chartAxisLine}
              />
              <text x={x(point.k)} y={plotBottom + 25} textAnchor="middle" className={styles.chartTick}>
                {point.k}
                {!point.proven ? "*" : ""}
              </text>
            </g>
          ))}

          <line
            x1={x(knee.k)}
            y1={y(knee.maxKm) + 10}
            x2={x(knee.k)}
            y2={plotBottom}
            className={styles.chartGuide}
          />
          <text
            x={x(knee.k) - 14}
            y={y(knee.maxKm) - 24}
            textAnchor="end"
            className={styles.chartAnnotation}
          >
            ten moves
          </text>
          <text
            x={x(knee.k) - 14}
            y={y(knee.maxKm) - 8}
            textAnchor="end"
            className={styles.chartNote}
          >
            about 90% of the best proven reduction
          </text>

          <g className={styles.chartLegend}>
            <circle cx={W - M.right - 218} cy="20" r="5" className={styles.chartPoint} />
            <text x={W - M.right - 206} y="24">
              proven optimum
            </text>
            <path
              d={`M ${W - M.right - 91} 13 L ${W - M.right - 84} 25 L ${W - M.right - 98} 25 Z`}
              className={styles.chartLimitedPoint}
            />
            <text x={W - M.right - 76} y="24">
              time-limited
            </text>
          </g>

          <text
            transform={`translate(18 ${(M.top + plotBottom) / 2}) rotate(-90)`}
            textAnchor="middle"
            className={styles.chartAxis}
          >
            worst-team travel (km)
          </text>
        </svg>
      </div>
      <p className={styles.chartXAxisLabel}>allowed match moves</p>
      <figcaption className={styles.figureCaption}>
        Most of the improvement arrives early. The ten-move schedule is a useful compromise, but
        it makes nine teams travel farther and should be read that way. The asterisk marks a
        time-limited result: the solver found a valid schedule but ran out of time before proving it
        was the best one.
      </figcaption>
    </figure>
  );
}
