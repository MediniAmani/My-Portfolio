export type Project = {
  slug: string
  title: string
  tagline: string
  category: string
  summary: string
  problem: string
  approach: string
  impact: string
  highlights: string[]
  tools: string[]
  image: string
  externalUrl: string
  externalLabel: string
}

export type ExperienceItem = {
  company: string
  title: string
  dates: string
  bullets: string[]
}

export type WorkProcessStep = {
  title: string
  body: string
}

export type PortfolioContent = {
  site: {
    name: string
    email: string
    phone: string
    location: string
    linkedin: string
    linkedinLabel: string
    fofUrl: string
    fofLabel: string
    cvEn: string
    cvFr: string
  }
  projects: Project[]
  experience: ExperienceItem[]
  designExperience: ExperienceItem[]
  workProcess: WorkProcessStep[]
  skills: {
    technical: string[]
    soft: string[]
  }
  traits: string[]
  nowItems: { title: string; body: string }[]
  awards: { title: string; detail: string }[]
  timeline: { year: string; text: string }[]
  speaking: string[]
  certifications: string[]
  highlights: { slug: string; title: string; meta: string; image: string }[]
  nav: {
    monogram: string
    moreLabel: string
    homeLabel: string
    cvEnLabel: string
    cvFrLabel: string
    linkedinLabel: string
    links: { to: string; label: string }[]
  }
  hero: {
    lead: string
    rest: string
    restDesign: string
    avatarImage: string
  }
  home: {
    banner: {
      image: string
      alt: string
      title: string
      subtitle: string
      relatedSlug: string
      titleDesign: string
      subtitleDesign: string
      relatedSlugDesign: string
    }
    resourcesTitlePrefix: string
    rotatingAudiences: string[]
    darkHeadline: string
    darkHeadlineDesign: string
    features: { to: string; label: string; title: string; cta: string; image: string }[]
    communityCard: {
      eyebrow: string
      title: string
      meta: string
      badge: string
      chips: string[]
    }
    highlightsTitle: string
    highlightsLead: string
    highlightsLeadDesign: string
    cvCtaEn: string
    cvCtaFr: string
    contactCta: string
  }
  profileLens: {
    hint: string
    dataLabel: string
    designLabel: string
    defaultLens: 'data' | 'design'
  }
  aboutPage: {
    title: string
    bio: string
    bioDesign: string
    vision: {
      title: string
      body: string
    }
    sections: {
      now: string
      experience: string
      designExperience: string
      vision: string
      skills: string
      traits: string
      workProcess: string
      awards: string
      timeline: string
      speaking: string
      certifications: string
      findMe: string
    }
    skillsLabels: {
      technical: string
      soft: string
    }
    linkedinLabel: string
    fofLabel: string
  }
  workPage: {
    title: string
    lead: string
    leadDesign: string
    caseStudyCta: string
    backLabel: string
    notFoundTitle: string
    notFoundBody: string
    backToWork: string
    overview: string
    problem: string
    approach: string
    impact: string
    highlights: string
    tools: string
    moreProjects: string
    discuss: string
  }
  contactPage: {
    title: string
    lead: string
    labels: {
      email: string
      linkedin: string
      fof: string
      basedIn: string
      cv: string
      name: string
      message: string
    }
    cvLinks: {
      en: string
      fr: string
    }
    submit: string
    sentNote: string
    mailSubjectPrefix: string
  }
  footer: {
    thanks: string[]
    sign: string
    monogram: string
    hello: {
      title: string
      about: string
      contact: string
      linkedin: string
      fof: string
      email: string
    }
    focus: {
      title: string
      items: string[]
    }
    resources: {
      title: string
      cvEn: string
      cvFr: string
      allWork: string
    }
    socials: {
      linkedin: string
      fof: string
      email: string
    }
  }
}
