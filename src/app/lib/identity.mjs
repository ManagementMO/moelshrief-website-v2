export const SITE_URL = "https://moelshrief.com";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const description = "Mohammed Elshrief's personal portfolio. Management Engineering at the University of Waterloo, software engineering and machine learning projects, and technical writing.";

export const identityMetadata = {
  title: "Mohammed Elshrief — Management Engineering at Waterloo",
  description,
  authors: [{ name: "Mohammed Elshrief", url: `${SITE_URL}/` }],
  creator: "Mohammed Elshrief",
  openGraph: {
    title: "Mohammed Elshrief — Management Engineering at Waterloo",
    description,
    siteName: "Mohammed Elshrief",
    url: `${SITE_URL}/`,
    type: "website",
    locale: "en_CA",
    images: ["/my-pfp.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Elshrief — Management Engineering at Waterloo",
    description,
    images: ["/my-pfp.jpg"],
  },
};

export const identityJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Mohammed Elshrief",
      description:
        "Mohammed Elshrief is a Management Engineering student at the University of Waterloo who builds software across engineering, data, and machine learning — including agentic QA tooling, optimization models, and hackathon projects.",
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/my-pfp.jpg`,
      mainEntityOfPage: `${SITE_URL}/`,
      jobTitle: "Management Engineering Student",
      email: "mailto:mkelshri@uwaterloo.ca",
      knowsAbout: [
        "software engineering",
        "machine learning",
        "data engineering",
        "optimization",
        "AI agents",
      ],
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "University of Waterloo",
        url: "https://uwaterloo.ca/",
      },
      sameAs: [
        "https://github.com/ManagementMO",
        "https://www.linkedin.com/in/mohammed-elshrief/",
        "https://devpost.com/ManagementMO",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Mohammed Elshrief",
      alternateName: "moelshrief.com",
      url: `${SITE_URL}/`,
      author: { "@id": PERSON_ID },
      inLanguage: "en",
    },
  ],
};

export const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profile`,
  url: `${SITE_URL}/`,
  name: "Mohammed Elshrief",
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: { "@id": PERSON_ID },
};

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
