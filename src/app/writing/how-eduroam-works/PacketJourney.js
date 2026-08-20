import styles from "./article.module.css";

const steps = [
  {
    term: "802.1X",
    title: "Your device connects, but the internet is still blocked.",
    body: "Your device can see and join eduroam, but ordinary internet traffic waits while the login begins.",
  },
  {
    term: "RADIUS",
    title: "The visiting campus looks for your home institution.",
    body: "It reads the realm after the @ sign and passes the request through the eduroam server chain.",
  },
  {
    term: "EAP + TLS",
    title: "Your device checks who is answering.",
    body: "It verifies the home server certificate, then protects the private part of the login inside an encrypted exchange.",
  },
  {
    term: "accept / reject",
    title: "Your home institution sends its answer back.",
    body: "It checks your account. If the answer is yes, the visiting campus opens its local network for your device.",
  },
];

export default function PacketJourney() {
  return (
    <figure className={styles.journeyFigure}>
      <ol className={styles.journeySteps}>
        {steps.map((step, index) => (
          <li key={step.term}>
            <span>{index + 1}</span>
            <small>{step.term}</small>
            <strong>{step.title}</strong>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      <figcaption className={styles.figureCaption}>
        The visiting campus forwards your login, but your home institution still makes the identity
        check.
      </figcaption>
    </figure>
  );
}
