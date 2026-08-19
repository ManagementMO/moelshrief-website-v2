import NextLink from "next/link";
import BudgetKnee from "./BudgetKnee";
import PolicyExplorer from "./PolicyExplorer";
import RouteComparison from "./RouteComparison";
import { buildScheduleMapData } from "./mapGeometry";
import { corrections, infeasibleResult } from "./scheduleData";
import styles from "./article.module.css";

export const metadata = {
  title: "can a world cup schedule be fairer? · mohammed elshrief",
  description:
    "how i rebuilt the world cup group stage and tested two practical ways to reduce travel without making any team travel farther.",
  openGraph: {
    type: "article",
    title: "can a world cup schedule be fairer?",
    description:
      "how i rebuilt the world cup group stage and tested two practical ways to reduce travel without making any team travel farther.",
    publishedTime: "2026-08-18",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Can a World Cup schedule be fairer without making anyone worse off?",
  description:
    "How I rebuilt the World Cup group stage and tested two practical ways to reduce travel without making any team travel farther.",
  datePublished: "2026-08-18",
  author: {
    "@type": "Person",
    name: "Mohammed Elshrief",
    url: "https://moelshrief.wiki",
  },
};

export default function FairerWorldCupSchedule() {
  const geometry = buildScheduleMapData();
  const { landPath, ...mapData } = geometry;

  return (
    <article className={styles.breakout}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <svg className={styles.mapDefs} aria-hidden="true" focusable="false">
        <defs>
          <path id="fifa-north-america" d={landPath} />
        </defs>
      </svg>
      <div className={styles.articleChrome}>
        <span aria-hidden="true">┌</span>
        <span className={styles.articlePath}>~/writing/fairer-world-cup-schedule.md</span>
        <span className={styles.articleType}>case study</span>
      </div>
      <div className={styles.article}>
          <header className={styles.hero}>
            <NextLink href="/writing" className={styles.backLink}>
              ← writing
            </NextLink>
            <h1>Can a World Cup schedule be fairer without making anyone worse off?</h1>
            <p>
              Before the knockout rounds, every team plays three group-stage matches. The cities
              assigned to those games determine how far each team travels. I rebuilt FIFA’s
              schedule from public data and asked how much fairer it could be without sending the
              burden somewhere else.
            </p>
          </header>

          <RouteComparison mapData={mapData} />

          <section className={styles.proseSection}>
            <h2>The schedule looked reasonable until I followed each team.</h2>
            <p>
              The official schedule keeps many matches within the same region, so the average looks
              reasonable. Team by team, the picture changes. Bosnia and Herzegovina crosses the
              continent, while Egypt stays in the Pacific Northwest. A random draw determined their
              opponents. The schedule determined their cities.
            </p>
            <p>
              That separation made the problem useful. I was not trying to change who played whom.
              I wanted to know how much travel could be removed from the worst itinerary without
              making anyone else travel farther.
            </p>
          </section>

          <section className={styles.proseSection}>
            <h2>The real choice was what FIFA would be allowed to change.</h2>
            <p>
              An optimization model searches through many valid schedules and picks the one that
              best meets a goal. Before that search could begin, I had to decide what FIFA would
              actually be willing to move. I tested two versions. The first keeps every match date
              and kickoff time fixed, then changes only the stadium. The second can move a match to
              another venue, date, and time that FIFA had already published.
            </p>
          </section>

          <figure className={styles.modelFigure}>
            <div className={styles.figureHeading}>
              <strong>Two models, each with a different promise</strong>
            </div>
            <div className={styles.modelRow}>
              <div className={styles.modelName}>
                <b>1A</b>
                <span>calendar fixed</span>
              </div>
              <div>
                <small>may change</small>
                <p>the stadium assigned to a match</p>
              </div>
              <div>
                <small>must preserve</small>
                <p>match dates and times, host rules, stadium workload</p>
              </div>
              <div className={styles.modelResult}>
                <small>proven result</small>
                <p>10.2% lower worst itinerary, 29.6% lower total, no team worse off</p>
              </div>
            </div>
            <div className={styles.modelRow}>
              <div className={styles.modelName}>
                <b>1B</b>
                <span>slots may move</span>
              </div>
              <div>
                <small>may change</small>
                <p>the venue, date, and time assigned to a match</p>
              </div>
              <div>
                <small>must preserve</small>
                <p>tournament round, simultaneous final games, host rules, and rest</p>
              </div>
              <div className={styles.modelResult}>
                <small>proven result</small>
                <p>17.5% lower worst itinerary, 33.2% lower total, no team worse off</p>
              </div>
            </div>
            <figcaption className={styles.figureCaption}>
              A “slot” is one venue, date, and kickoff time. The recommendation changes depending on
              whether those slots are fixed or can be reassigned. All percentages compare with
              FIFA’s published schedule.
            </figcaption>
          </figure>

          <div className={styles.equationGrid}>
            <div>
              <span>how travel is counted</span>
              <code tabIndex={0} role="group" aria-label="Travel calculation">
                team travel = venue 1→2 + venue 2→3
              </code>
              <p>
                A team’s travel comes from the journey between consecutive venues. It is not the
                sum of three isolated match assignments.
              </p>
            </div>
            <div>
              <span>how the goal is ordered</span>
              <code tabIndex={0} role="group" aria-label="Optimization objective order">
                1. reduce the worst trip → 2. reduce total travel
              </code>
              <p>
                First find the lowest possible ceiling for the worst-traveling team. Hold that
                ceiling in place, then minimize total travel.
              </p>
            </div>
          </div>

          <div className={styles.auditLine} aria-label="Verification pipeline">
            <span>public data</span><i>→</i><span>check the rules</span><i>→</i>
            <span>search schedules</span><i>→</i><strong>calculate again independently</strong>
          </div>
          <p className={styles.auditNote}>
            I used Gurobi, software built to search large optimization problems, to find candidate
            schedules. Then I rebuilt each result outside Gurobi and calculated every travel total
            again with the same code used for FIFA’s schedule.
          </p>

          <section className={styles.proseSection}>
            <h2>There is no single best schedule. The recommendation depends on the rules.</h2>
            <p>
              With kickoff times fixed, Model 1A reduces the worst itinerary from 5,058 km to 4,544
              km. If FIFA can move the venue, date, and kickoff time together, Model 1B reaches
              4,174 km and lowers total travel from 98,814 km to 65,986 km. Both are proven optimal.
              Under each set of rules, the solver established that no better schedule exists.
              Neither solution makes any team travel farther.
            </p>
          </section>

          <PolicyExplorer mapData={mapData} />

          <blockquote className={styles.recommendation}>
            Keep the “no team worse off” guardrail. Use Model 1A when kickoff times are fixed. Use
            Model 1B when FIFA can move fixtures among its published venue, date, and time
            combinations.
          </blockquote>

          <BudgetKnee />

          <section className={styles.proseSection}>
            <h2>The mistakes changed the answer.</h2>
            <p>
              Several early ideas did not survive scrutiny. I kept the corrections in the project
              log because they explain why the final models look the way they do.
            </p>
            <div className={styles.corrections}>
              {corrections.map((correction) => (
                <article key={correction.title}>
                  <h3>{correction.title}</h3>
                  <p>{correction.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.negativeResult}>
            <p>sometimes the useful answer is no</p>
            <div>
              <strong>{infeasibleResult.restHours} hours of rest</strong>
              <span>+</span>
              <strong>no team travels farther</strong>
              <span>=</span>
              <strong>infeasible</strong>
            </div>
            <p>
              These two requirements cannot both be met. In optimization, “infeasible” does not mean
              the software failed. It means the model proved that no schedule can satisfy all of the
              rules at once. I then relaxed the travel guardrail and asked how much extra travel
              might be unavoidable. That follow-up found a valid schedule but could not prove how
              close it was to the best possible one, so the honest answer is a range: more than 0 km
              and no more than {Math.round(infeasibleResult.upperKm)} km.
            </p>
          </section>

          <section className={styles.proseSection}>
            <h3>Travel is not the only measure of fairness.</h3>
            <p>
              I also tracked the Competitive Neutrality Index, or CNI. It compares what each team
              brings into a match, including recent travel, rest, altitude changes, and eastward
              time-zone shifts. Model 1B improves travel but raises the average CNI from 1.812 to
              2.119. I did not ask the model to optimize this score, so I treat the change as a
              warning to report rather than proof that one schedule is fair in every sense.
            </p>
          </section>

          <section className={styles.learningSection}>
            <h2>What I learned</h2>
            <p className={styles.learningIntro}>
              The hardest parts were not the lines of Gurobi code. They were deciding which changes
              were legitimate, defining what “fairer” should protect, and knowing when a result had
              earned a strong claim.
            </p>
            <div className={styles.lessons}>
              <article>
                <h3>The model starts with permission, not algebra.</h3>
                <p>
                  Models 1A and 1B lead to different recommendations because they give FIFA
                  different permissions. A precise boundary was more useful than a stronger
                  solution to the wrong question.
                </p>
              </article>
              <article>
                <h3>Fairness needs a promise.</h3>
                <p>
                  A lower maximum or total is not automatically fair. Either can move the burden to
                  someone else. The “no team worse off” rule turned fairness from a slogan into a
                  condition I could check.
                </p>
              </article>
              <article>
                <h3>Verification belongs inside the method.</h3>
                <p>
                  The most useful errors appeared when I recalculated results outside the solver.
                  Independent scoring, retained failed runs, and careful proof labels changed how
                  much confidence I placed in the answer.
                </p>
              </article>
            </div>
            <p className={styles.closingThought}>
              I started with a scheduling problem. I finished with a better understanding of how to
              make quantitative recommendations that people can inspect, challenge, and defend.
            </p>
          </section>

          <div className={styles.articleEnd}>
            <NextLink href="/writing">← back to writing</NextLink>
            <span>(END)</span>
          </div>
      </div>
    </article>
  );
}
