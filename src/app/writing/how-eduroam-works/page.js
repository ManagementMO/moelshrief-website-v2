import NextLink from "next/link";
import NetworkMap from "./NetworkMap";
import PacketJourney from "./PacketJourney";
import { IdentityEnvelope, TrafficSplit } from "./ProtocolFigures";
import { buildEduroamMapData } from "./mapGeometry";
import styles from "./article.module.css";

export const metadata = {
  title: "how eduroam works · mohammed elshrief",
  description:
    "i kept connecting to eduroam on other campuses and finally looked into what happens after i press connect.",
  openGraph: {
    type: "article",
    title: "how eduroam works",
    description:
      "what i learned after following an eduroam login from a visiting campus back to its home university.",
    publishedTime: "2026-08-19",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How eduroam works",
  description:
    "What I learned after following an eduroam login from a visiting campus back to its home university.",
  datePublished: "2026-08-19",
  author: {
    "@type": "Person",
    name: "Mohammed Elshrief",
    url: "https://moelshrief.wiki",
  },
};

const sources = [
  {
    label: "How does eduroam work?",
    detail: "eduroam",
    href: "https://eduroam.org/how/",
  },
  {
    label: "The eduroam architecture",
    detail: "RFC 7593",
    href: "https://www.rfc-editor.org/rfc/rfc7593.html",
  },
  {
    label: "The Network Access Identifier",
    detail: "RFC 7542",
    href: "https://www.rfc-editor.org/rfc/rfc7542.html",
  },
  {
    label: "eduroam security guidance",
    detail: "eduroam",
    href: "https://eduroam.org/eduroam-security/",
  },
  {
    label: "Configuration Assistant Tool",
    detail: "eduroam CAT",
    href: "https://eduroam.org/configuration-assistant-tool-cat/",
  },
];

export default function HowEduroamWorks() {
  const mapData = buildEduroamMapData();

  return (
    <article className={styles.breakout}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className={styles.articleChrome}>
        <span aria-hidden="true">┌</span>
        <span className={styles.articlePath}>~/writing/how-eduroam-works.md</span>
        <span className={styles.articleType}>note</span>
      </div>

      <div className={styles.article}>
        <header className={styles.hero}>
          <NextLink href="/writing" className={styles.backLink}>
            ← writing
          </NextLink>
          <h1>How eduroam works</h1>
          <p>
            I used eduroam for years without thinking much about it. If you have ever opened your
            laptop at a different campus and found the same network waiting, you may have wondered the
            same thing I did: who is checking the login, and why does this campus trust the answer?
          </p>
          <div className={styles.heroMeta}>
            <span>5 minute read</span>
            <time dateTime="2026-08-19">19 Aug 2026</time>
          </div>
        </header>

        <section className={styles.proseSection}>
          <h2>The basic idea</h2>
          <p>
            I started with a vague picture of one giant login system. Maybe each university uploaded
            its users somewhere, and every eduroam access point checked the same list. If you have
            never stopped to think about it, that explanation almost sounds reasonable. It would also
            mean copying sensitive account data between institutions, so I went looking for the
            actual handoff.
          </p>
          <p>
            I used my own account to make the handoff concrete. Say I am visiting a university in
            Berlin, but my account belongs to Waterloo. Berlin should not have a copy of my password,
            and it does not need one. Its network asks Waterloo, “Is this one of your people?”
            Waterloo checks my login and sends back yes or no. If your home institution is somewhere
            else, the same basic exchange applies.
          </p>
          <p>
            The split that made the system click for me was simple: the campus you are visiting
            provides the connection, while your home institution confirms who you are. The way I now
            understand eduroam is as the shared way to ask that question, not one enormous Wi-Fi
            network or one central account list.
          </p>
        </section>

        <NetworkMap mapData={mapData} />

        <section className={styles.proseSection}>
          <h2>What happens after I press connect</h2>
          <p>
            The official explanations quickly led me into 802.1X, EAP, and RADIUS. If those labels
            sound dense, they did to me too. I kept treating them as one complicated system until I
            gave each name one small job: 802.1X keeps ordinary traffic blocked during login, EAP is
            the login conversation, and RADIUS passes that conversation to the right university.
          </p>
          <p>
            You may also run into the words “supplicant” for your device and “authenticator” for the
            access point. I found it easier to picture a device asking to enter and a network waiting
            for an answer. The access point is not trying to understand your university password. It
            passes the conversation along and waits for your university&apos;s decision.
          </p>
        </section>

        <PacketJourney />

        <section className={styles.proseSection}>
          <h2>How the username is protected</h2>
          <p>
            The next terms that slowed me down were “outer identity” and “inner identity.” If they
            sound like two accounts, that is how I first read them. I eventually understood them as
            two layers of one login: an address on the outside and the private details inside.
          </p>
          <p>
            In my example, the outside can say <code>anonymous@uwaterloo.ca</code>. The part after the
            <code>@</code> tells the network where to send the request, so Waterloo&apos;s name remains
            visible along the route. Your connection would carry your own institution&apos;s realm there
            instead. The real username and private part of the login stay inside an encrypted tunnel
            that ends at the home institution.
          </p>
          <p>
            This was where I corrected another assumption: hiding the username is not the same as
            becoming anonymous. The visiting network can still see where your account comes from,
            along with normal connection details. The privacy gain is simply that it does not need
            your full username or password to find your university.
          </p>
        </section>

        <IdentityEnvelope />

        <section className={styles.proseSection}>
          <h2>Where my internet traffic goes</h2>
          <p>
            At this point I realized I had mixed up two different paths. Because Waterloo checks the
            login, I assumed the rest of my connection might keep running through Waterloo. If you
            have thought of eduroam as a kind of university VPN, the answer surprised me: it does not
            work that way.
          </p>
          <p>
            Once you are connected, normal internet traffic goes through the campus you are visiting.
            In my Berlin example, Waterloo does not carry the browsing and nothing makes a round trip
            through Ontario. Berlin provides the connection, so its firewall and local network rules
            apply to me while I am there.
          </p>
          <p>
            The way I picture it now is simple: your home institution confirms who you are for the
            connection, then the place you are visiting carries the traffic that follows. Separating
            those two paths cleared up most of my confusion.
          </p>
        </section>

        <TrafficSplit />

        <section className={styles.proseSection}>
          <h2>Why the setup profile matters</h2>
          <p>
            Reading the security guidance changed how I thought about the first-time setup. I had
            treated the university installer as a convenient way to avoid typing settings by hand. If
            you have done the same, the missing piece is that the profile also teaches your device
            which university sign-in server is real.
          </p>
          <p>
            Anyone can name a Wi-Fi network <code>eduroam</code>, so the name by itself does not prove
            much. Before sending anything private, your device checks the server certificate
            against the details your institution gave it. That certificate check is what I had
            overlooked when I thought the network name was enough.
          </p>
          <p>
            I now read an unexpected certificate warning differently. It is not just another setup
            prompt to clear. It may mean your device cannot prove that it reached the right sign-in
            server, which is a good reason to stop and check your institution&apos;s instructions.
          </p>
          <ul className={styles.securityList}>
            <li>Use the setup instructions, CAT profile, or geteduroam app from your institution.</li>
            <li>Do not turn off certificate validation or accept an unexpected certificate.</li>
            <li>Do not enter eduroam credentials into a web page. eduroam does not use a captive portal.</li>
          </ul>
          <p className={styles.smallNote}>
            Your institution may use a different login method or keep different logs. The username
            privacy shown above also depends on anonymous outer identity being configured correctly.
          </p>
        </section>

        <section className={styles.closingSection}>
          <h2>What I came away with</h2>
          <p>
            I began with a simple question: how can the same Waterloo login work on a network in
            another country? I expected either a central database or a connection tunneled back to
            Waterloo. What I found was not one larger system at all, but several smaller systems
            passing one question between them.
          </p>
          <p>
            Each university keeps its own accounts, and the campus you are visiting runs its own
            network. The shared part finds your university, carries the login conversation there, and
            brings the answer back. You do not need to remember every acronym to keep that picture.
          </p>
          <p>
            The next time you connect, you can picture the same short exchange I now do: the place you
            are visiting asks, your home institution answers, and the local network takes over. Once I
            separated those jobs, eduroam stopped feeling like one mysterious worldwide network and
            started feeling like a series of understandable handoffs.
          </p>
        </section>

        <section className={styles.sourcesSection}>
          <h2>Sources</h2>
          <ol>
            {sources.map((source) => (
              <li key={source.href}>
                <a href={source.href}>{source.label}</a>
                <span>{source.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className={styles.articleEnd}>
          <NextLink href="/writing">← back to writing</NextLink>
          <span>(END)</span>
        </div>
      </div>
    </article>
  );
}
