import styles from "./article.module.css";

export function IdentityEnvelope() {
  return (
    <figure className={styles.identityFigure}>
      <div className={styles.figureTopline}>
        <strong>What each layer contains</strong>
        <span>common tunneled setup</span>
      </div>
      <div className={styles.identityGrid}>
        <div className={styles.outerIdentity}>
          <small>visible routing label</small>
          <code>anonymous@uwaterloo.ca</code>
          <div className={styles.innerIdentity}>
            <small>encrypted exchange with the home institution</small>
            <strong>real username + login proof</strong>
          </div>
        </div>
        <div className={styles.identityNotes}>
          <p>
            <strong>What other networks need:</strong> the realm after the <code>@</code>, so they know
            where to send the request.
          </p>
          <p>
            <strong>What the home university checks:</strong> the identity and proof protected inside
            the encrypted exchange.
          </p>
        </div>
      </div>
      <figcaption className={styles.figureCaption}>
        In my example, @uwaterloo.ca stays visible. I found it more accurate to think of this as
        hiding the username, not hiding where the account comes from. It also depends on that
        anonymous outside name being configured correctly.
      </figcaption>
    </figure>
  );
}

function PathRow({ label, nodes, note }) {
  return (
    <section className={styles.pathRow}>
      <span>{label}</span>
      <div className={styles.simplePath} role="img" aria-label={nodes.join(" to ")}>
        {nodes.map((node, index) => (
          <div key={node}>
            {index > 0 ? <i aria-hidden="true" /> : null}
            <strong>{node}</strong>
          </div>
        ))}
      </div>
      <p>{note}</p>
    </section>
  );
}

export function TrafficSplit() {
  return (
    <figure className={styles.trafficFigure}>
      <div className={styles.figureTopline}>
        <strong>Two short paths with different jobs</strong>
      </div>
      <div className={styles.trafficRows}>
        <PathRow
          label="while signing in"
          nodes={["your device", "visited campus", "home university"]}
          note="Home checks your login."
        />
        <PathRow
          label="after you connect"
          nodes={["your device", "visited campus", "the internet"]}
          note="The visited campus carries the traffic."
        />
      </div>
      <figcaption className={styles.figureCaption}>
        The way I keep these paths straight is simple: eduroam handles the login, but ordinary
        browsing does not go through the home university.
      </figcaption>
    </figure>
  );
}
