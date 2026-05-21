export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mohammed Elshrief",
    "alternateName": "Mo Elshrief",
    "description": "Data Artisan and Full Stack Developer specializing in Excel/VBA, Python, and web development",
    "url": "https://moelshrief.wiki",
    "sameAs": [
      "https://github.com/ManagementMO",
      "https://www.linkedin.com/in/mohammed-elshrief" // Add your LinkedIn URL
    ],
    "jobTitle": "Data Artisan & Full Stack Developer",
    "knowsAbout": [
      "Excel/VBA Development",
      "Python Programming",
      "Web Development",
      "Financial Tools",
      "Productivity Software",
      "AI/ML Applications"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Developer",
      "skills": [
        "Microsoft Excel",
        "VBA",
        "Python",
        "React.js",
        "Next.js",
        "Machine Learning"
      ]
    },
    "workExample": [
      {
        "@type": "SoftwareApplication",
        "name": "MO-Planner",
        "applicationCategory": "Finance Application",
        "operatingSystem": "Windows",
        "description": "Financial planning tool utilizing Excel/VBA Formula to forecast student budgets with 90% accuracy"
      },
      {
        "@type": "SoftwareApplication",
        "name": "FocusForge",
        "applicationCategory": "Productivity Software",
        "operatingSystem": "Windows",
        "description": "Comprehensive Time Management DSS in Excel/VBA with AI integration"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 