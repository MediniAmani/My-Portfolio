export type Project = {
  slug: string
  title: string
  tagline: string
  category: string
  summary: string
  highlights: string[]
  tools: string[]
  image: string
}

export const site = {
  name: 'Amani Medini',
  email: 'amani.benslah.medini@gmail.com',
  phone: '+216 92495755',
  location: 'Ariana, Tunisia',
  linkedin: 'https://www.linkedin.com/in/amani-medini-9a0791149/',
  linkedinLabel: 'linkedin.com/in/amani-medini-9a0791149',
  cvEn: '/cv/Amani_Medini_Data_Analyst_CV.pdf',
  cvEnDocx: '/cv/Amani_Medini_Data_Analyst_CV.docx',
  cvFrDocx: '/cv/Amani_Medini_Data_Analyst_CV_FR.docx',
}

export const projects: Project[] = [
  {
    slug: 'retail-kpi-storytelling',
    title: 'Retail KPI Storytelling',
    tagline: 'Sales, customers, and stores turned into RFM segments and YTD/MTD KPIs.',
    category: 'Data analysis',
    summary:
      'Hands-on Formation Data & Business Intelligence project on a retail dataset covering Sales, Product, Customer, and Store tables. I built the analytical path from relational modeling and advanced SQL through cleaning, RFM segmentation, time-based KPIs, and visual storytelling for business questions.',
    highlights: [
      'Designed and queried a retail schema with joins, subqueries, CTEs, window functions, views, and stored procedures.',
      'Cleaned and transformed sales data, then built RFM customer segments and Year-to-Date / Month-to-Date KPI views.',
      'Used pandas and NumPy for exploration, then Matplotlib and Seaborn to present trends stakeholders could act on.',
    ],
    tools: ['SQL', 'Python', 'pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'RFM', 'YTD/MTD KPIs'],
    image: '/images/project-retail.jpg',
  },
  {
    slug: 'trusted-test-data-reporting',
    title: 'Trusted Test Data Reporting',
    tagline: 'Large validation datasets cleaned, tracked, and turned into decisions.',
    category: 'Data quality',
    summary:
      'In high-reliability engineering environments at Capgemini Engineering and KPIT Engineering, I analyzed and validated large test and diagnostic datasets, automated collection workflows in JIRA, and delivered clear reports for hardware, software, and systems teams.',
    highlights: [
      'Validated large-scale Hardware-in-the-Loop and system test datasets, surfacing performance trends and anomalies.',
      'Automated data collection and defect-tracking workflows in JIRA to improve traceability and cut analysis turnaround.',
      'Built Python scripts to generate and analyze result data, improving reporting accuracy for cross-functional teams.',
    ],
    tools: ['Python', 'JIRA', 'SQL', 'Data validation', 'Defect metrics', 'Reporting'],
    image: '/images/project-validation.jpg',
  },
  {
    slug: 'friends-of-figma-tunis',
    title: 'Friends of Figma (FoF) Tunis',
    tagline: 'Tunisia’s only Figma-affiliated community - founded and led locally.',
    category: 'Community',
    summary:
      'I founded and lead Friends of Figma (FoF) Tunis, the only Figma-affiliated organization in Tunisia. The chapter connects designers and builders through meetups, Config watch parties, speaker programs, and an inclusive space to learn in public.',
    highlights: [
      'Founded the Tunis chapter and run it as community lead since 2023.',
      'Organize Config watch parties and open calls for local speakers.',
      'Connect design and data storytelling through talks at DevFest, GDG MENAT Summit 2025, and Women Techmakers.',
    ],
    tools: ['Community building', 'Event design', 'Public speaking', 'Figma'],
    image: '/images/project-community.jpg',
  },
]

export const nowItems = [
  {
    title: 'Data Storyteller & Analyst',
    body: 'Working with SQL, Python (pandas, NumPy), and BI workflows to turn complex datasets into KPI narratives.',
  },
  {
    title: 'Friends of Figma (FoF) Tunis',
    body: 'Founder & Leader of Tunisia’s only Figma-affiliated organization - growing a local design community.',
  },
  {
    title: 'Women Techmakers Ambassador',
    body: 'Since 2019, supporting visibility and opportunity for women in tech through WTM programs and events.',
  },
  {
    title: 'GDG Co-Organizer',
    body: 'Co-organizing Google Developer Group meetups, workshops, and talks for the Tunisian developer community.',
  },
]

export const awards = [
  {
    title: 'Top 10 AI Artathon Qualified Team',
    detail: 'Global AI Summit, Riyadh (2020)',
  },
  {
    title: 'Women Developer Academy graduate',
    detail: 'Women Techmakers (2024)',
  },
  {
    title: 'Capgemini Tech Talk Presenter',
    detail: 'Internal tech talk (2024)',
  },
]

export const timeline = [
  {
    year: '2019',
    text: 'Started co-organizing Google Developer Group meetups and became a Women Techmakers Ambassador.',
  },
  {
    year: '2020',
    text: 'Qualified Top 10 at the AI Artathon during the Global AI Summit in Riyadh.',
  },
  {
    year: '2021',
    text: 'Product Owner at UTIK - translating stakeholder needs into data-informed product specs and backlog priorities.',
  },
  {
    year: '2022',
    text: 'Completed a Master’s in Electronics (Microelectronics & Instrumentation) at Monastir University. Joined Capgemini Engineering.',
  },
  {
    year: '2023',
    text: 'Founded Friends of Figma (FoF) Tunis - Tunisia’s only Figma-affiliated community chapter.',
  },
  {
    year: '2024',
    text: 'Completed Women Developer Academy. Presented a Capgemini Tech Talk and kept growing community programs.',
  },
  {
    year: '2025',
    text: 'Spoke at DevFest and GDG MENAT Summit in Dubai. Continued data validation, reporting, and storytelling work at KPIT Engineering.',
  },
  {
    year: '2026',
    text: 'Completed Formation Data & Business Intelligence (SQL, Python, RFM, visualization). Joined Technovation WTM Media Council.',
  },
]

export const speaking = [
  'DevFest speaker',
  'GDG MENAT Summit 2025 - Dubai',
  'Capgemini Tech Talk Presenter (2024)',
  'Friends of Figma (FoF) Tunis - Config watch parties & speaker programs',
  'Women Techmakers and GDG community sessions',
]

export const certifications = [
  'Formation Data & Business Intelligence - Manel Hamdi (2026)',
  'Women Developer Academy (WDA) - Women Techmakers (2024)',
  'Google Cloud Data Analytics Certificate - Google (Coursera)',
  'Google Cloud Professional Data Engineer Certification - Google (Coursera)',
  'Google Project Management Professional Certificate (v2) - Google (Coursera)',
]

export const highlights = [
  {
    slug: 'friends-of-figma-tunis',
    title: 'Friends of Figma (FoF) - only affiliated org in Tunisia',
    meta: 'Community lead · Config · Speakers',
    image: '/images/guide-2.jpg',
  },
  {
    slug: 'retail-kpi-storytelling',
    title: 'Retail KPIs, RFM & YTD/MTD views',
    meta: 'SQL · pandas · Visualization',
    image: '/images/guide-1.jpg',
  },
  {
    slug: 'trusted-test-data-reporting',
    title: 'Faster, clearer validation reporting',
    meta: 'Python · JIRA · Data quality',
    image: '/images/guide-3.jpg',
  },
]

export const nav = {
  monogram: 'AM',
  moreLabel: 'More',
  homeLabel: 'Home',
  links: [
    { to: '/work', label: 'Work' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ],
}

export const hero = {
  lead: '🏕️ Hi, I’m Amani Medini',
  rest: 'Data Storyteller, Data Analyst & community builder ✨ Turning messy data into decisions people trust 🌱 Building Friends of Figma (FoF) Tunis 🎉',
  avatarImage: '/images/Main_picture.jpg',
}

export const home = {
  banner: {
    image: '/images/hero-banner.jpg',
    alt: 'Soft natural light through window blinds',
    title: 'From raw tables to decisions',
    subtitle: 'SQL · Python · Community',
  },
  resourcesTitlePrefix: 'Selected work for',
  rotatingAudiences: ['Data teams', 'Product leaders', 'Communities', 'Hiring managers'],
  darkHeadline: 'I turn complex data into stories people can act on.',
  features: [
    {
      to: '/work',
      label: 'Data storytelling & analysis',
      title: 'SQL, Python, and KPI views that make stakeholder decisions clearer.',
      cta: 'See my work →',
    },
    {
      to: '/about',
      label: 'Community & speaking',
      title: 'Founder of Friends of Figma (FoF) Tunis - and an active WTM / GDG speaker.',
      cta: 'How I help →',
    },
  ],
  communityCard: {
    eyebrow: 'Friends of Figma (FoF) Tunis',
    title: 'Config Watch Party',
    meta: 'Call for speakers · Local voices',
    badge: 'Only Figma-affiliated org in Tunisia',
    chips: ['WTM Ambassador', 'GDG · DevFest'],
  },
  highlightsTitle: 'Highlights',
  highlightsLead:
    'Three proof points: Friends of Figma (FoF) Tunis, retail KPI storytelling, and trusted validation reporting.',
  cvCta: 'Download my CV',
  contactCta: 'Get in touch',
}

export const aboutPage = {
  title: 'About me in 10 seconds',
  bio: 'I’m Amani, a Data Storyteller and Data Analyst in Ariana, Tunisia. I analyze complex datasets, build KPI narratives with SQL and Python, and lead Friends of Figma (FoF) Tunis - the only Figma-affiliated organization in the country.',
  sections: {
    now: 'Now',
    awards: 'Features & awards',
    timeline: 'Timeline',
    speaking: 'Speaking & community',
    certifications: 'Certifications',
    findMe: 'Find me online',
  },
  linkedinLabel: 'LinkedIn',
}

export const workPage = {
  title: 'Selected projects',
  lead: 'Analytics craft, reporting systems, and community programs - each framed around a clear story and outcome.',
  caseStudyCta: 'Read the case study →',
  backLabel: '← All work',
  notFoundTitle: 'Project not found',
  notFoundBody: 'That case study does not exist.',
  backToWork: 'Back to work',
  overview: 'Overview',
  highlights: 'Highlights',
  tools: 'Tools & methods',
  moreProjects: 'More projects',
  discuss: 'Discuss a project',
}

export const contactPage = {
  title: 'Let’s talk',
  lead: 'Open to data analysis work, storytelling collaborations, community partnerships, and speaking invitations.',
  labels: {
    email: 'Email',
    linkedin: 'LinkedIn',
    basedIn: 'Based in',
    cv: 'CV',
    name: 'Name',
    message: 'Message',
  },
  cvLinks: {
    pdf: 'PDF',
    wordEn: 'Word EN',
    wordFr: 'Word FR',
  },
  submit: 'Send message',
  sentNote: 'Opening your email client…',
  mailSubjectPrefix: 'Portfolio inquiry from',
}

export const footer = {
  thanks: ['Thanks for dropping by!', 'I hope you find something useful here.'],
  sign: '- Amani',
  monogram: 'AM',
  hello: {
    title: 'Hello',
    about: 'About',
    contact: 'Contact',
    linkedin: 'LinkedIn',
    email: 'Email',
  },
  focus: {
    title: 'Focus',
    items: ['Data storytelling', 'Data analysis', 'Community building', 'Speaking'],
  },
  resources: {
    title: 'Resources',
    cvPdf: 'CV (PDF)',
    cvWordEn: 'CV (Word EN)',
    cvWordFr: 'CV (Word FR)',
    allWork: 'See all work →',
  },
  socials: {
    linkedin: 'LinkedIn',
    email: 'Email',
  },
}
