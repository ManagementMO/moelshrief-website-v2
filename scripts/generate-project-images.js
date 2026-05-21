const fs = require('fs');
const path = require('path');

// Create project images directory if it doesn't exist
const projectImagesDir = path.join(__dirname, '../public/images/projects');
if (!fs.existsSync(projectImagesDir)) {
  fs.mkdirSync(projectImagesDir, { recursive: true });
}

// Project image configurations
const projectImages = [
  {
    name: 'mo-planner',
    title: 'MO-Planner',
    description: 'Financial Planning Tool',
    technologies: ['Microsoft Excel', 'VBA', 'Python'],
    color: '#217346',
    animation: `
      <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="rotate" from="0 400 200" to="360 400 200" dur="20s" repeatCount="indefinite" />
    `,
    background: `
      <rect x="100" y="100" width="200" height="200" fill="#217346" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="300" y="150" width="200" height="200" fill="#217346" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="500" y="100" width="200" height="200" fill="#217346" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
      </rect>
    `
  },
  {
    name: 'focus-forge',
    title: 'FocusForge',
    description: 'Time Management System',
    technologies: ['Microsoft Excel', 'VBA', 'Gemini API'],
    color: '#8E24AA',
    animation: `
      <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="rotate" from="0 400 200" to="360 400 200" dur="20s" repeatCount="indefinite" />
    `,
    background: `
      <circle cx="400" cy="200" r="150" fill="#8E24AA" opacity="0.2">
        <animate attributeName="r" values="150;170;150" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="200" r="100" fill="#8E24AA" opacity="0.2">
        <animate attributeName="r" values="100;120;100" dur="3s" repeatCount="indefinite" />
      </circle>
    `
  },
  {
    name: 'scam-mah',
    title: 'Scam-Mah',
    description: 'AI Spam Detection',
    technologies: ['Python', 'Flask', 'Machine Learning', 'HTML/CSS/JS', 'Gemini API'],
    color: '#00BCD4',
    animation: `
      <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="rotate" from="0 400 200" to="360 400 200" dur="20s" repeatCount="indefinite" />
    `,
    background: `
      <path d="M200,200 L600,200 L400,400 Z" fill="#00BCD4" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M300,100 L500,300 L100,300 Z" fill="#00BCD4" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
      </path>
    `
  },
  {
    name: 'paybridge',
    title: 'Paybridge',
    description: 'Financial Transfer Platform',
    technologies: ['Python', 'React.js', 'PostgreSQL', 'MongoDB', 'Docker'],
    color: '#2496ED',
    animation: `
      <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="rotate" from="0 400 200" to="360 400 200" dur="20s" repeatCount="indefinite" />
    `,
    background: `
      <rect x="200" y="100" width="400" height="200" fill="#2496ED" opacity="0.2">
        <animate attributeName="width" values="400;420;400" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="300" y="150" width="200" height="100" fill="#2496ED" opacity="0.2">
        <animate attributeName="height" values="100;120;100" dur="3s" repeatCount="indefinite" />
      </rect>
    `
  }
];

// Generate SVG for each project
projectImages.forEach(project => {
  const svg = `
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${project.color};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${project.color};stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#gradient)" ${project.animation}/>
      ${project.background}
      <text x="400" y="180" font-family="Arial" font-size="48" fill="white" text-anchor="middle">${project.title}</text>
      <text x="400" y="240" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${project.description}</text>
      <text x="400" y="300" font-family="Arial" font-size="18" fill="white" text-anchor="middle">${project.technologies.join(' • ')}</text>
    </svg>
  `;

  fs.writeFileSync(path.join(projectImagesDir, `${project.name}.svg`), svg);
  console.log(`Generated ${project.name}.svg`);
}); 