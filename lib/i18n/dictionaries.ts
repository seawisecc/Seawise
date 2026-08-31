import type { Locale } from "./config";

/**
 * All copy lives here, keyed by locale. English is the source of truth; the
 * `Dictionary` type is inferred from it so the Indonesian version must match.
 */
const en = {
  meta: {
    title: "Seawise Studio | App & Website Development",
    titleTemplate: "%s | Seawise Studio",
    description:
      "App & website development studio based in Bali, from custom ERP and business apps to fast, modern websites, serving clients across Indonesia.",
  },
  /**
   * Search-result copy, kept separate from the visible `intro` text. The visible
   * intros read well on the page but run short for a meta description, and
   * rewriting them would change the published design.
   */
  breadcrumb: {
    home: "Home",
  },
  seo: {
    layanan: {
      title: "Website & App Development Services",
      description:
        "Custom website and application development from Seawise Studio in Bali. ERP, business apps, and company profile sites, built from how your team actually works.",
    },
    portfolio: {
      title: "Website & App Project Portfolio",
      description:
        "See the websites and apps we have delivered, from manufacturing ERP to pharmacy and point of sale systems. Every project links straight to the live build.",
    },
    testimoni: {
      title: "Client Testimonials",
      description:
        "Feedback from the teams who use our systems every day, covering how the project ran, what shipped, and the support they get after going live.",
    },
    blog: {
      title: "Blog: Website & App Guides",
      description:
        "Practical guides on website cost, choosing business software, and running your own systems, written from the projects we actually deliver.",
    },
    tentang: {
      title: "About Us",
      description:
        "Seawise Studio is a Systems & Software Studio based in Bali. We build ERP and custom applications across industries, from enterprise down to small business.",
    },
    kontak: {
      title: "Free Consultation, Website & Apps",
      description:
        "The first conversation about your website or business app is free. Fill in the form on this page, or email us directly at hello@seawise.id.",
    },
    websiteBali: {
      title: "Website Development in Bali",
      description:
        "Website development for businesses in Bali and across Indonesia. Company profiles, landing pages, and custom builds, with an admin panel you run yourself.",
    },
    appBali: {
      title: "App Development in Bali",
      description:
        "Custom application development from Bali: ERP, point of sale, small business apps, and migration off spreadsheets, built around how your team already works.",
    },
    promo: {
      title: "Business Website from Rp2 Million",
      description:
        "Website development for businesses in Bali and across Indonesia, live in 3–5 working days, with an admin panel you run yourself. Free quote, no commitment.",
    },
    promoApp: {
      title: "Custom Business App Development",
      description:
        "Custom ERP, point of sale, and business apps built around how your team already works. Every system in our portfolio is live and clickable. Free workflow mapping.",
    },
  },
  /** Shared FAQ shown on the services page, also emitted as FAQPage JSON-LD. */
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "How much does a website from Seawise Studio cost?",
        a: "Website packages start from Rp2M across four tiers, from a single landing page through to a fully custom build. The final figure is confirmed after a short discovery call, because it depends on how many sections and features you actually need.",
      },
      {
        q: "How long does a website take to build?",
        a: "Shore takes 3–5 days, Reef 5–10 days, and Current 10–14 days. Trench depends on how complex the request is, so that estimate comes with your written scope. Custom applications are estimated after we map your process.",
      },
      {
        q: "Is hosting and domain included?",
        a: "Domain and hosting are arranged as part of the project. The exact arrangement is confirmed during the discovery call, since it depends on what you already own.",
      },
      {
        q: "Can I edit the content myself afterwards?",
        a: "Yes, from the Reef tier upward. Those packages include an admin panel where you edit text, prices, and photos yourself, without having to come back to us for small changes.",
      },
      {
        q: "What is the difference between a website and an application?",
        a: "A website is your public shopfront: it presents what you sell and brings in enquiries. An application is the system your team runs the business on, such as point of sale, stock, or ERP. Websites have published packages from Rp2M and ship in days. Applications are quoted per project, because the scope follows your workflow.",
      },
      {
        q: "Do you build applications, not just websites?",
        a: "Yes. We build custom ERP and business applications, including migrations off older systems and spreadsheets. Several examples are on the portfolio page.",
      },
      {
        q: "Do you work with clients outside Bali?",
        a: "Yes. We are based in Bali and work with clients across Indonesia. The whole process can run online if that is easier for you.",
      },
    ],
  },
  /** Keyword-targeted local landing pages. */
  landing: {
    website: {
      eyebrow: "Website Development",
      title: "Website development in Bali, built to be run by your own team.",
      intro:
        "We build company profile sites, landing pages, and custom websites for businesses in Bali and across Indonesia, with an admin panel so you are not dependent on us for every edit.",
      pointsTitle: "What you get",
      points: [
        {
          title: "Built for your business, not a template",
          body: "The structure follows how you actually sell, rather than forcing your content into a layout that was designed for someone else.",
        },
        {
          title: "An admin panel you control",
          body: "From the Reef tier upward you edit text, prices, and photos yourself. No monthly fee just to change a headline.",
        },
        {
          title: "SEO and structured data from day one",
          body: "Canonical URLs, sitemap, metadata, and schema.org markup are set up as part of the build, not sold back to you later.",
        },
        {
          title: "Fast on the phone",
          body: "Most of your visitors arrive on mobile data. Pages are built to load quickly there first, not only on a desk connection.",
        },
      ],
      stepsTitle: "How it works",
      steps: [
        {
          title: "Discovery call",
          body: "We map what you sell, who buys it, and what the site has to do. This first conversation is free.",
        },
        {
          title: "Scope and quote",
          body: "You get a written scope and a price before anything is built, so there are no surprises later.",
        },
        {
          title: "Build and review",
          body: "We build, then you review on a live preview link and give feedback before it goes public.",
        },
        {
          title: "Launch and handover",
          body: "We launch, then walk you through the admin panel so your team can keep the site current.",
        },
      ],
      faqTitle: "Frequently asked questions",
      faq: [
        {
          q: "How much does website development in Bali cost?",
          a: "Our website packages start from Rp2M and run across four tiers. Which one fits depends on how many sections you need, how much design customisation you want, and whether you need an admin panel.",
        },
        {
          q: "How long does a website take to build?",
          a: "Shore takes 3–5 days, Reef 5–10 days, and Current 10–14 days. Trench depends on how complex the request is, so that estimate comes with your written scope.",
        },
        {
          q: "Do I need to be in Bali to work with you?",
          a: "No. We are based in Bali and work with clients throughout Indonesia. Discovery, review, and handover can all be done online.",
        },
        {
          q: "Can I update the website without a developer?",
          a: "Yes, from the Reef tier upward. The admin panel lets you edit text, prices, and images directly, and the changes appear on the live site.",
        },
        {
          q: "Is hosting and domain included?",
          a: "Domain and hosting are arranged as part of the project. The exact arrangement is confirmed during the discovery call, since it depends on what you already own.",
        },
        {
          q: "What happens after the site goes live?",
          a: "You get a walkthrough of the admin panel at handover. Ongoing maintenance is available as an optional add-on rather than something you are locked into.",
        },
      ],
      relatedTitle: "Keep reading",
      relatedPortfolio: "See websites we have built",
      relatedServices: "Compare website packages",
      ctaTitle: "Tell us what your business needs.",
      ctaBody:
        "Describe your process and we will help map the scope before you commit to anything.",
      ctaButton: "Start a conversation",
    },
    app: {
      eyebrow: "App Development",
      title: "Custom app development in Bali, shaped around how your team works.",
      intro:
        "We build ERP systems, point of sale, and business applications for companies in Bali and across Indonesia, including migrations away from spreadsheets and ageing software.",
      pointsTitle: "What you get",
      points: [
        {
          title: "Built from your real workflow",
          body: "We start from how your team already works, then remove the steps that only exist because the old system demanded them.",
        },
        {
          title: "Proven across industries",
          body: "Manufacturing and distribution, pharmacy, restaurants, and retail. The portfolio page links straight to working systems.",
        },
        {
          title: "Migration without losing history",
          body: "Moving off spreadsheets or an older system is planned as part of the project, so your existing records come with you.",
        },
        {
          title: "Roles and access control",
          body: "Staff see what they need for their job. Owners get the reporting view without giving everyone full access.",
        },
      ],
      stepsTitle: "How it works",
      steps: [
        {
          title: "Process mapping",
          body: "We sit with your process end to end and write down where the time actually goes. This first session is free.",
        },
        {
          title: "Scope and quote",
          body: "You get a written scope covering modules, roles, and reporting, with a price, before development starts.",
        },
        {
          title: "Build in stages",
          body: "We deliver in stages so you can use and judge the core early, instead of waiting for one big reveal.",
        },
        {
          title: "Rollout and support",
          body: "We help move your data in, train the people who will use it daily, and stay available after go-live.",
        },
      ],
      faqTitle: "Frequently asked questions",
      faq: [
        {
          q: "How much does custom app development cost?",
          a: "Custom applications are quoted per project, because scope varies far more than a website. We confirm the figure after mapping your process, and the mapping session itself is free.",
        },
        {
          q: "What is the difference between a website and an application?",
          a: "A website is your public shopfront: it presents what you sell and brings in enquiries. An application is the system your team runs the business on, such as point of sale, stock, or ERP. Websites have published packages from Rp2M and ship in days. Applications are quoted per project, because the scope follows your workflow.",
        },
        {
          q: "Can you replace the spreadsheets we use now?",
          a: "Yes. Migrating off spreadsheets is one of the most common reasons teams come to us, and moving your existing records is planned as part of the project.",
        },
        {
          q: "What kinds of applications have you built?",
          a: "ERP for manufacturing and distribution, pharmacy systems with batch and expiry tracking, restaurant systems from point of sale through to stock, and retail apps for smaller businesses.",
        },
        {
          q: "Do you work with clients outside Bali?",
          a: "Yes. We are based in Bali and work with clients across Indonesia, and the process can run online end to end.",
        },
        {
          q: "What happens after the system goes live?",
          a: "We help with data migration, train the team who will use it daily, and stay available afterwards. Ongoing support is agreed as part of the scope.",
        },
      ],
      relatedTitle: "Keep reading",
      relatedPortfolio: "See applications we have built",
      relatedServices: "See all our services",
      ctaTitle: "Tell us where the time goes.",
      ctaBody:
        "Walk us through your process and we will help map what a system should actually take off your plate.",
      ctaButton: "Start a conversation",
    },
  },
  /**
   * Paid-ads landing page at /{lang}/promo. Deliberately separate from
   * `landing.website`: that page is written for search and carries the site
   * navigation, this one is written for cold ad traffic and strips every exit
   * that is not the form. The route is noindex so the two never compete for
   * the same query.
   *
   * Every number here is real. Rp2 juta and 3–5 hari are the Shore package,
   * the admin panel claim starts at Reef, and the portfolio proof is whatever
   * is actually live in Supabase. Nothing on this page is invented.
   */
  promo: {
    eyebrow: "Website Development, Bali",
    title: "Your business website, live in 3–5 working days, from Rp2 million.",
    subtitle:
      "The scope and the price are written down before anything is built. From the Reef package upward you hold the admin panel yourself, so changing a price or a photo never costs you another developer fee.",
    ctaPrimary: "Request a free quote",
    ctaSecondary: "Chat on WhatsApp",
    ctaPackages: "See packages and prices",
    trust: [
      "Live portfolio you can open yourself",
      "First conversation free, no commitment",
      "Studio in Bali, clients across Indonesia",
    ],
    painEyebrow: "Sound familiar?",
    painTitle: "A website you cannot maintain is out of date within a month.",
    painItems: [
      {
        title: "Every small edit has a price",
        body: "New price, new photo, new opening hours. If each one means waiting on someone else and paying for it, the site stops matching the business.",
      },
      {
        title: "Slow on a phone",
        body: "Most of your buyers arrive on mobile data. A heavy page loses them before they ever see what you sell.",
      },
      {
        title: "Invisible on Google",
        body: "Without proper metadata, a sitemap, and structured data, even a good looking site never surfaces when someone searches for what you do.",
      },
    ],
    packagesEyebrow: "Packages and prices",
    packagesTitle: "Pick the scope, know the number before we start.",
    packagesNote:
      "Prices are per project. The final figure is confirmed after a short discovery call, because it depends on how many sections and features you actually need.",
    packagesCta: "Ask about this package",
    proofEyebrow: "Proof",
    proofTitle: "Not mockups. Open them yourself.",
    proofBody:
      "Every project below is live right now. Click through and judge the work before you talk to us.",
    proofLive: "Open the live site",
    stepsEyebrow: "How it works",
    stepsTitle: "Four steps, no surprises.",
    steps: [
      {
        title: "Free discovery call",
        body: "We map what you sell, who buys it, and what the site has to do. This first conversation costs nothing.",
      },
      {
        title: "Scope and quote in writing",
        body: "You get the scope and the price before anything is built, so there is nothing to argue about later.",
      },
      {
        title: "Build and review",
        body: "We build, then you review on a live preview link and give feedback before it goes public.",
      },
      {
        title: "Launch and handover",
        body: "We launch, then walk you through the admin panel so your team can keep the site current.",
      },
    ],
    faqTitle: "Before you ask",
    faq: [
      {
        q: "How much does it actually cost?",
        a: "Packages start at Rp2 million across four tiers. Which one fits depends on how many sections you need, how much design customisation you want, and whether you need an admin panel. The current price of each tier is in the list above, and the exact figure is confirmed after the discovery call.",
      },
      {
        q: "How long does it take?",
        a: "Shore takes 3–5 days, Reef 5–10 days, and Current 10–14 days. Trench depends on how complex the request is, so that estimate comes with your written scope.",
      },
      {
        q: "Can I update the site myself afterwards?",
        a: "Yes, from the Reef tier upward. The admin panel lets you edit text, prices, and images directly, and the changes appear on the live site. Shore has no admin panel, so updates go through us.",
      },
      {
        q: "Is hosting and domain included?",
        a: "Domain and hosting are arranged as part of the project. The exact arrangement is confirmed during the discovery call, since it depends on what you already own.",
      },
      {
        q: "Do I need to be in Bali?",
        a: "No. We are based in Bali and work with clients throughout Indonesia. Discovery, review, and handover can all be done online.",
      },
    ],
    formEyebrow: "Free quote",
    formTitle: "Tell us what your business needs.",
    formBody:
      "Describe your business and what the website has to do. We reply with a scope and a price, and you are not obliged to continue.",
    formAside: "Prefer to talk directly",
  },
  /**
   * The second paid-ads landing page, this one for custom applications.
   * Same shape as `promo` minus the pricing block: business apps are quoted per
   * project, so there is no package table to show. The section that replaces it
   * explains why, which turns a missing price into a reason to trust rather
   * than a gap in the page.
   */
  promoApp: {
    eyebrow: "App Development, Bali",
    title: "Your team is back on spreadsheets, and the software is already paid for.",
    subtitle:
      "Most systems fail on the workflow, not the technology. They get built without anyone watching how the team actually works, so the team quietly returns to the old way. We map the process first, then talk code.",
    ctaPrimary: "Tell us your process",
    ctaSecondary: "Chat on WhatsApp",
    ctaProof: "Open the systems we built",
    trust: [
      "Every system below is live and clickable",
      "Workflow mapping is free, with no commitment",
      "We stay on until your team actually uses it",
    ],
    painEyebrow: "Why it stalls",
    painTitle: "Three reasons a system quietly stops being used.",
    painItems: [
      {
        title: "The workflow is not yours",
        body: "Software is bought off the shelf and the team is told to adapt. What happens is the opposite: they go back to the old way, and the system becomes decoration.",
      },
      {
        title: "Only one person can drive it",
        body: "A system nobody else understands ends up owned by one staff member. The week they take leave, the process stops with them.",
      },
      {
        title: "Abandoned at go-live",
        body: "The vendor disappears once the invoice clears. The first months after launch are exactly what decides whether a system gets used at all.",
      },
    ],
    proofEyebrow: "Proof",
    proofTitle: "Not mockups. Open them yourself.",
    proofBody:
      "Every system below is running today and used daily. Click through, look at the real screens, then judge us.",
    proofLive: "Open the live system",
    buildEyebrow: "What we build",
    buildTitle: "From one messy process to a system your team runs.",
    costEyebrow: "About cost",
    costTitle: "Why there is no price on this page.",
    costBody:
      "Business applications have no shelf price. Two shops with the same number of branches can need very different systems. Naming a figure before we understand your process would simply be wrong, and it is usually wrong on the high side.",
    costItems: [
      "We map your workflow first, at no cost",
      "You get the scope and the number in writing, before anything is built",
      "If a custom system is not the right answer, we say so",
    ],
    stepsEyebrow: "How it works",
    stepsTitle: "Four steps, no surprises.",
    steps: [
      {
        title: "Process mapping",
        body: "We sit with the people who run the process every day, not only with the owner. This part costs nothing.",
      },
      {
        title: "Scope and quote in writing",
        body: "You get the scope and the price before a line of code is written.",
      },
      {
        title: "Built in stages, reviewed as we go",
        body: "We build piece by piece and you review on a live link, so nothing is a surprise at the end.",
      },
      {
        title: "Launch and hand holding",
        body: "We train your team and stay on after go-live, until the system is genuinely part of the day.",
      },
    ],
    faqTitle: "Before you ask",
    faq: [
      {
        q: "How much does a custom system cost?",
        a: "It is quoted per project, after we map your process. There is no package price because the work depends entirely on how many people, branches, and steps are involved. The packages published on our services page cover websites, not business applications.",
      },
      {
        q: "How long does it take?",
        a: "It depends on the scope. The estimate comes with your written quote after mapping, rather than as a guess on the first call.",
      },
      {
        q: "What happens to our old data?",
        a: "Spreadsheets and older software are audited first, then migrated in stages, so the team is never left without the numbers they use daily.",
      },
      {
        q: "Our team is not very technical.",
        a: "That is the normal case, and it is exactly why we map the existing workflow instead of imposing a new one. Training is part of handover, and we stay reachable afterwards.",
      },
      {
        q: "Do we need to be in Bali?",
        a: "No. We are based in Bali and work with clients throughout Indonesia. Mapping, review, and handover all work online.",
      },
    ],
    formEyebrow: "Free consultation",
    formTitle: "Tell us about the process that is still messy.",
    formBody:
      "Describe how the work runs today and where it breaks. We reply with what a system should be taking off your plate, and you are not obliged to continue.",
    formAside: "Prefer to talk directly",
  },
  nav: {
    services: "Services",
    portfolio: "Portfolio",
    testimonials: "Testimonials",
    about: "About",
    blog: "Blog",
    contact: "Contact Us",
  },
  blog: {
    eyebrow: "Blog",
    title: "Notes on apps, websites, and running a cleaner business.",
    intro: "Practical guides and insights from our work building custom systems.",
    readMore: "Read",
    empty: "No articles yet. Check back soon.",
    back: "← All articles",
    publishedOn: "Published",
  },
  hero: {
    eyebrow: "Systems & Software Studio",
    titleBefore: "Systems people actually ",
    highlight: "use",
    titleAfter: ", not just deploy.",
    subtitle:
      "We build ERP and custom applications across industries, from enterprise systems to apps for growing small businesses.",
    ctaPrimary: "See Our Apps",
    ctaSecondary: "Discuss a Project",
  },
  home: {
    problemEyebrow: "The problem",
    problemTitle: "Software ships, but the team goes back to spreadsheets.",
    problemBody:
      "Most systems fail not because of the technology, but because they were built without understanding how the team actually works.",
    solutionEyebrow: "How we work",
    solutionTitle: "Start with the workflow, then talk code.",
    solutionBody:
      "We map the real process first, build a system that follows it, then support you until it's genuinely used every day.",
    servicesEyebrow: "Services",
    servicesTitle: "Four ways we help your business run cleaner.",
    servicesLink: "See service details →",
    featuredEyebrow: "Our Apps",
    featuredTitle: "Not mockups, systems that are live and you can open.",
    featuredLink: "See all projects →",
    showcaseEyebrow: "Product Showcase",
    showcaseTitle: "A closer look at what we've shipped.",
    showcaseIntro:
      "Real screens from apps and websites we've built. Swipe through.",
    showcaseApp: "App",
    showcaseWebsite: "Website",
    proofEyebrow: "Why trust us",
    proofTitle: "Judge the work, not the sales pitch.",
    proofItems: [
      {
        title: "Open the systems yourself",
        body: "Every app in our portfolio is live and clickable. No mockups, no slide decks, no promises you can't verify.",
      },
      {
        title: "Transparent pricing upfront",
        body: "Website packages start at Rp2 million with the scope written out. You know the number before the first call ends.",
      },
      {
        title: "Free discovery first",
        body: "We map your workflow before quoting. If a custom system isn't the right answer, we'll say so.",
      },
      {
        title: "Support after go-live",
        body: "Launch isn't the finish line. We stay on until your team actually uses the system day to day.",
      },
    ],
    testimonialsEyebrow: "Testimonials",
    testimonialsTitle: "What clients say.",
    ctaTitle: "Got a messy process? Tell us about it.",
    ctaBody:
      "The first conversation is free. We'll help map your needs before you decide anything.",
    ctaButton: "Start a Conversation",
  },
  services: {
    eyebrow: "Services",
    title: "Four ways we help your business run cleaner.",
    intro:
      "Every service is built from your team's real workflow, not a forced template.",
    pricingEyebrow: "Pricing",
    pricingTitle: "Website development packages.",
    pricingIntro:
      "Transparent starting points. Final scope and price are confirmed after a short discovery call.",
    webTitle: "Website",
    webIntro:
      "From Rp2M. Four tiers, from a single landing page to fully custom.",
    appTitle: "Applications",
    appIntro:
      "See the apps we've already built, or consult us to develop a custom one: ERP, SMB apps, and system migration.",
    appCtaWork: "See Our Apps",
    appCtaConsult: "Consult Us",
    perProject: "/ project",
    popular: "Popular",
    ctaTitle: "Not sure which one fits your business?",
    ctaBody:
      "Tell us your process, and we'll help map your needs before you decide anything.",
    ctaButton: "Discuss a Project",
  },
  about: {
    eyebrow: "About",
    title: "A studio that builds systems, and makes sure they get used.",
    intro:
      "Seawise is a Systems & Software Studio. We build ERP and custom applications across industries, from enterprise systems to apps for growing small businesses.",
    principles: [
      {
        title: "Workflow first, code later",
        body: "We start by understanding how your team really works. A good system follows the workflow, not the other way around.",
      },
      {
        title: "Built to be used",
        body: "Our goal isn't software that finishes deploying, but a system that becomes part of daily work.",
      },
      {
        title: "Supported after launch",
        body: "Launch isn't the end. We support team adoption until the system runs smoothly.",
      },
      {
        title: "One consistent foundation",
        body: "We build on a single, proven technical foundation across every project, so your system stays clean, easy to maintain, and quick to grow.",
      },
    ],
    ctaTitle: "Want to see the results?",
    ctaButton: "See Our Apps",
  },
  portfolio: {
    eyebrow: "Our Work",
    title: "Not mockups, real apps and websites you can open.",
    intro:
      "Every project below links straight to the live app or site. Give it a try.",
    liveButton: "View Live ↗",
    comingSoon: "Coming soon",
    filterAll: "All",
    filterApp: "Apps",
    filterWebsite: "Websites",
    viewDetail: "View details",
    detailBack: "← All work",
    detailCtaTitle: "Want something like this for your business?",
    detailCtaButton: "Discuss a Project",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What clients say.",
    intro:
      "Our work is judged most honestly by the teams who use it every day.",
    emptyTitle: "We're collecting these properly.",
    emptyBody:
      "Rather than fill this page with quotes we can't back up, we'd rather you check the work itself. Every system in our portfolio is live and open to try.",
    emptyCta: "See our work",
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell us about the process that's still messy.",
    intro:
      "The first conversation is free. Fill in the form below, or email us directly at hello@seawise.id.",
    emailLabel: "Email",
    whatsappLabel: "Chat on WhatsApp",
    instagramLabel: "Follow us",
    googleLabel: "Google Business Profile",
    googleValue: "See our profile and reviews",
    helpLabel: "What we can help with",
    helpItems: [
      "Custom ERP & enterprise systems",
      "Apps for growing small businesses",
      "Migration from spreadsheets / legacy software",
      "Websites & web apps",
    ],
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@company.com",
      phone: "WhatsApp number (optional)",
      phonePlaceholder: "08xx xxxx xxxx",
      message: "Message",
      messagePlaceholder:
        "Tell us the process or need you'd like to solve…",
      submit: "Send Message",
      submitting: "Sending…",
    },
    messages: {
      nameRequired: "Please enter your name.",
      emailInvalid: "That email doesn't look valid.",
      messageShort: "Tell us a bit more (min. 10 characters).",
      phoneInvalid: "That phone number doesn't look valid.",
      notConfigured:
        "The database connection isn't configured yet. For now, email us directly at hello@seawise.id.",
      insertError: "Sorry, something went wrong. Please try again shortly.",
      success: "Thanks! Your message is in, we'll reply as soon as we can.",
    },
  },
  footer: {
    tagline: "App & website development studio. Custom ERP, business apps, and modern websites.",
    location: "Based in Bali · Serving all of Indonesia",
    navHeading: "Navigation",
    contactHeading: "Contact",
    contactForm: "Contact form",
    googleBusiness: "Google Business Profile",
    rights: "Systems & Software Studio.",
    builtWith: "Built with Next.js & Supabase.",
    partOf: "Part of",
  },
  servicesList: [
    {
      slug: "erp-custom",
      title: "Custom ERP",
      summary:
        "Enterprise systems designed around your team's real workflow, instead of forcing the team to adapt to the software.",
      points: ["Inventory & purchasing", "Finance & reporting", "Multi-branch & access control"],
    },
    {
      slug: "aplikasi-umkm",
      title: "Apps for Growing SMBs",
      summary:
        "Lightweight, affordable apps for businesses that are starting to need a system, designed to grow alongside the business.",
      points: ["POS & sales", "Stock management", "Upgrade step by step"],
    },
    {
      slug: "migrasi-sistem",
      title: "System Migration",
      summary:
        "Move from spreadsheets or legacy software to a centralized system, without losing data or disrupting operations.",
      points: ["Legacy data audit", "Phased migration", "Team onboarding"],
    },
    {
      slug: "web-dev",
      title: "Web Development",
      summary:
        "Fast, modern, easy-to-manage websites and web apps, from company profiles to internal portals.",
      points: ["Fast & modern", "Connected to your system", "SEO & performance"],
    },
  ],
  fallbackPricing: [
    {
      name: "Shore",
      tagline: "One product/event promo, simple personal branding",
      price: "Rp2M",
      priceNote: "/ project",
      features: ["1 page (max 4–5 sections)", "1 fixed preset theme", "No admin panel (updates via us)", "Standard SEO metadata", "1× minor revision", "Optional maintenance Rp1.5M/yr"],
      featured: false,
    },
    {
      name: "Reef",
      tagline: "SMBs needing a full company profile",
      price: "Rp3.5–4M",
      priceNote: "/ project",
      features: ["Max 5–6 sections", "Choose from available presets", "Admin panel: edit text, price, photos", "SEO + auto structured data", "2× major revisions", "Maintenance Rp1.5M/yr"],
      featured: true,
    },
    {
      name: "Current",
      tagline: "A more personal look, distinct from competitors",
      price: "Rp4.5–5M",
      priceNote: "/ project",
      features: ["Max 8–10 sections, self reorder", "Preset + moderate customization", "Admin + reorder sections", "SEO like Reef", "Add 1 add-on (billed separately)", "2× major revisions"],
      featured: false,
    },
    {
      name: "Trench",
      tagline: "Unique business models / full custom",
      price: "Rp6–7M",
      priceNote: "/ project",
      features: ["Unlimited sections", "Full custom (new vertical/theme)", "Admin with broader access", "SEO + optional SEO Managed bundle discount", "1 add-on included", "2× major revisions + priority support"],
      featured: false,
    },
  ],
};

const id: Dictionary = {
  meta: {
    title: "Seawise Studio | Spesialis Aplikasi & Website",
    titleTemplate: "%s | Seawise Studio",
    description:
      "Studio pengembangan aplikasi & website di Bali, dari ERP dan aplikasi bisnis custom sampai website modern, melayani klien seluruh Indonesia.",
  },
  breadcrumb: {
    home: "Beranda",
  },
  seo: {
    layanan: {
      title: "Layanan Pembuatan Website & Aplikasi",
      description:
        "Jasa pembuatan website dan aplikasi custom dari Seawise Studio di Bali. ERP, aplikasi bisnis, dan company profile, dibangun dari alur kerja tim kamu.",
    },
    portfolio: {
      title: "Portfolio Proyek Website & Aplikasi",
      description:
        "Lihat proyek website dan aplikasi yang sudah kami kerjakan, dari ERP manufaktur sampai sistem apotek dan kasir. Setiap proyek punya link demo langsung.",
    },
    testimoni: {
      title: "Testimoni Klien",
      description:
        "Penilaian dari tim yang memakai sistem buatan kami setiap hari, soal jalannya proyek, hasil yang dipakai, dan pendampingan setelah aplikasi live.",
    },
    blog: {
      title: "Blog: Panduan Website & Aplikasi",
      description:
        "Panduan praktis soal biaya pembuatan website, memilih aplikasi bisnis, dan mengelola sistem sendiri, ditulis dari proyek yang benar-benar kami kerjakan.",
    },
    tentang: {
      title: "Tentang Kami",
      description:
        "Seawise Studio adalah Systems & Software Studio di Bali. Kami membangun ERP dan aplikasi custom lintas industri, dari sistem enterprise sampai UMKM.",
    },
    kontak: {
      title: "Konsultasi Gratis Website & Aplikasi",
      description:
        "Diskusi awal soal pembuatan website atau aplikasi bisnis gratis. Isi form di halaman ini, atau kirim email langsung ke hello@seawise.id.",
    },
    websiteBali: {
      title: "Jasa Pembuatan Website Bali",
      description:
        "Jasa pembuatan website untuk bisnis di Bali dan seluruh Indonesia. Company profile, landing page, dan custom, dengan admin panel yang kamu kelola sendiri.",
    },
    appBali: {
      title: "Jasa Pembuatan Aplikasi Bali",
      description:
        "Jasa pembuatan aplikasi custom dari Bali: ERP, kasir, aplikasi UMKM, dan migrasi dari spreadsheet, dibangun mengikuti alur kerja tim kamu yang sekarang.",
    },
    promo: {
      title: "Website Bisnis Mulai Rp2 Juta",
      description:
        "Jasa pembuatan website untuk bisnis di Bali dan seluruh Indonesia, online dalam 3–5 hari kerja, dengan panel admin yang kamu kelola sendiri. Penawaran gratis, tanpa ikatan.",
    },
    promoApp: {
      title: "Jasa Pembuatan Aplikasi Bisnis Custom",
      description:
        "ERP, kasir, dan aplikasi bisnis custom yang dibangun mengikuti cara kerja tim kamu. Semua sistem di portfolio kami live dan bisa diklik. Pemetaan alur kerja gratis.",
    },
  },
  faq: {
    title: "Pertanyaan yang sering diajukan",
    items: [
      {
        q: "Berapa biaya pembuatan website di Seawise Studio?",
        a: "Paket website kami mulai dari Rp2 juta dengan empat tingkatan, dari satu halaman landing sampai custom penuh. Angka finalnya dikonfirmasi setelah sesi discovery singkat, karena tergantung berapa section dan fitur yang benar-benar kamu butuhkan.",
      },
      {
        q: "Berapa lama pengerjaan websitenya?",
        a: "Shore 3–5 hari, Reef 5–10 hari, dan Current 10–14 hari. Trench tergantung kerumitan permintaannya, jadi estimasinya ikut di cakupan tertulis. Aplikasi custom diestimasi setelah pemetaan proses.",
      },
      {
        q: "Apakah sudah termasuk domain dan hosting?",
        a: "Domain dan hosting diurus sebagai bagian dari proyek. Bentuk pastinya dikonfirmasi saat discovery, karena tergantung apa yang sudah kamu miliki.",
      },
      {
        q: "Apakah saya bisa mengubah isinya sendiri nanti?",
        a: "Bisa, mulai paket Reef ke atas. Paket tersebut sudah termasuk admin panel untuk mengedit teks, harga, dan foto sendiri, tanpa perlu menghubungi kami untuk perubahan kecil.",
      },
      {
        q: "Apa bedanya website dengan aplikasi?",
        a: "Website adalah etalase publik bisnismu: memperkenalkan apa yang kamu jual dan mendatangkan calon pelanggan. Aplikasi adalah sistem yang dipakai timmu untuk menjalankan operasional, misalnya kasir, stok, atau ERP. Website punya paket dengan harga terbuka mulai Rp2 juta dan selesai dalam hitungan hari. Aplikasi dihitung per proyek, karena cakupannya mengikuti alur kerjamu.",
      },
      {
        q: "Apakah bisa mengerjakan aplikasi, bukan cuma website?",
        a: "Bisa. Kami membangun ERP dan aplikasi bisnis custom, termasuk migrasi dari sistem lama dan spreadsheet. Beberapa contohnya ada di halaman portfolio.",
      },
      {
        q: "Apakah melayani klien di luar Bali?",
        a: "Ya. Kami berbasis di Bali dan melayani klien di seluruh Indonesia. Prosesnya bisa berjalan sepenuhnya online kalau itu lebih praktis buat kamu.",
      },
    ],
  },
  landing: {
    website: {
      eyebrow: "Jasa Pembuatan Website",
      title: "Jasa pembuatan website di Bali yang bisa kamu kelola sendiri.",
      intro:
        "Kami membuat company profile, landing page, dan website custom untuk bisnis di Bali dan seluruh Indonesia, lengkap dengan admin panel supaya kamu tidak bergantung ke kami untuk setiap perubahan kecil.",
      pointsTitle: "Yang kamu dapat",
      points: [
        {
          title: "Dibangun untuk bisnismu, bukan template",
          body: "Strukturnya mengikuti cara kamu menjual, bukan memaksa isi kontenmu masuk ke layout yang dirancang untuk bisnis orang lain.",
        },
        {
          title: "Admin panel yang kamu pegang",
          body: "Mulai paket Reef ke atas, kamu mengedit teks, harga, dan foto sendiri. Tidak ada biaya bulanan hanya untuk mengganti satu judul.",
        },
        {
          title: "SEO dan structured data sejak awal",
          body: "Canonical, sitemap, metadata, dan markup schema.org sudah disiapkan sebagai bagian dari pengerjaan, bukan dijual terpisah belakangan.",
        },
        {
          title: "Ringan dibuka di HP",
          body: "Mayoritas pengunjungmu datang lewat kuota internet. Halaman dibuat supaya cepat di kondisi itu dulu, bukan cuma di koneksi kantor.",
        },
      ],
      stepsTitle: "Cara kerjanya",
      steps: [
        {
          title: "Sesi discovery",
          body: "Kami petakan apa yang kamu jual, siapa pembelinya, dan website ini harus melakukan apa. Diskusi pertama ini gratis.",
        },
        {
          title: "Cakupan dan penawaran",
          body: "Kamu terima cakupan tertulis beserta harganya sebelum apa pun dikerjakan, jadi tidak ada kejutan di tengah jalan.",
        },
        {
          title: "Pengerjaan dan review",
          body: "Kami kerjakan, lalu kamu review lewat link preview yang bisa dibuka langsung dan memberi masukan sebelum dipublikasikan.",
        },
        {
          title: "Live dan serah terima",
          body: "Kami publikasikan, lalu memandu tim kamu memakai admin panel supaya isinya bisa terus diperbarui sendiri.",
        },
      ],
      faqTitle: "Pertanyaan yang sering diajukan",
      faq: [
        {
          q: "Berapa biaya jasa pembuatan website di Bali?",
          a: "Paket website kami mulai dari Rp2 juta dengan empat tingkatan. Yang cocok yang mana tergantung berapa section yang kamu butuhkan, seberapa jauh kustomisasi desainnya, dan apakah kamu perlu admin panel.",
        },
        {
          q: "Berapa lama pengerjaan websitenya?",
          a: "Shore 3–5 hari, Reef 5–10 hari, dan Current 10–14 hari. Trench tergantung kerumitan permintaannya, jadi estimasinya ikut di cakupan tertulis.",
        },
        {
          q: "Apakah harus berada di Bali untuk memakai jasa ini?",
          a: "Tidak. Kami berbasis di Bali dan melayani klien di seluruh Indonesia. Discovery, review, sampai serah terima bisa dilakukan online.",
        },
        {
          q: "Bisakah saya update website tanpa bantuan developer?",
          a: "Bisa, mulai paket Reef ke atas. Admin panelnya memungkinkan kamu mengedit teks, harga, dan gambar langsung, dan perubahannya tampil di website.",
        },
        {
          q: "Apakah sudah termasuk domain dan hosting?",
          a: "Domain dan hosting diurus sebagai bagian dari proyek. Bentuk pastinya dikonfirmasi saat discovery, karena tergantung apa yang sudah kamu miliki.",
        },
        {
          q: "Setelah website live, bagaimana?",
          a: "Kamu dapat pemandu pemakaian admin panel saat serah terima. Maintenance lanjutan tersedia sebagai tambahan opsional, bukan sesuatu yang mengikat kamu.",
        },
      ],
      relatedTitle: "Baca juga",
      relatedPortfolio: "Lihat website yang sudah kami buat",
      relatedServices: "Bandingkan paket website",
      ctaTitle: "Ceritakan kebutuhan bisnismu.",
      ctaBody:
        "Jelaskan prosesmu, kami bantu memetakan cakupannya sebelum kamu memutuskan apa pun.",
      ctaButton: "Mulai diskusi",
    },
    app: {
      eyebrow: "Jasa Pembuatan Aplikasi",
      title: "Jasa pembuatan aplikasi di Bali, mengikuti cara kerja tim kamu.",
      intro:
        "Kami membangun ERP, sistem kasir, dan aplikasi bisnis untuk perusahaan di Bali dan seluruh Indonesia, termasuk migrasi dari spreadsheet dan software lama yang sudah tidak memadai.",
      pointsTitle: "Yang kamu dapat",
      points: [
        {
          title: "Dibangun dari alur kerja nyata",
          body: "Kami mulai dari cara tim kamu bekerja sekarang, lalu membuang langkah yang ada hanya karena dituntut sistem lama.",
        },
        {
          title: "Sudah terbukti lintas industri",
          body: "Manufaktur dan distribusi, apotek, restoran, dan retail. Halaman portfolio menautkan langsung ke sistem yang berjalan.",
        },
        {
          title: "Migrasi tanpa kehilangan riwayat",
          body: "Perpindahan dari spreadsheet atau sistem lama direncanakan sebagai bagian proyek, jadi data yang sudah ada ikut terbawa.",
        },
        {
          title: "Hak akses per peran",
          body: "Staf melihat yang mereka perlukan untuk pekerjaannya. Pemilik dapat tampilan laporan tanpa harus membuka akses penuh ke semua orang.",
        },
      ],
      stepsTitle: "Cara kerjanya",
      steps: [
        {
          title: "Pemetaan proses",
          body: "Kami telusuri prosesmu dari ujung ke ujung dan mencatat ke mana waktu sebenarnya habis. Sesi pertama ini gratis.",
        },
        {
          title: "Cakupan dan penawaran",
          body: "Kamu terima cakupan tertulis mencakup modul, peran, dan laporan, beserta harganya, sebelum pengembangan dimulai.",
        },
        {
          title: "Dikerjakan bertahap",
          body: "Kami serahkan bertahap supaya kamu bisa memakai dan menilai bagian intinya lebih awal, bukan menunggu satu peluncuran besar.",
        },
        {
          title: "Rollout dan pendampingan",
          body: "Kami bantu memindahkan data, melatih orang yang memakainya setiap hari, dan tetap tersedia setelah sistem berjalan.",
        },
      ],
      faqTitle: "Pertanyaan yang sering diajukan",
      faq: [
        {
          q: "Berapa biaya jasa pembuatan aplikasi custom?",
          a: "Aplikasi custom dihitung per proyek, karena cakupannya jauh lebih bervariasi dibanding website. Angkanya kami konfirmasi setelah memetakan prosesmu, dan sesi pemetaan itu sendiri gratis.",
        },
        {
          q: "Apa bedanya website dengan aplikasi?",
          a: "Website adalah etalase publik bisnismu: memperkenalkan apa yang kamu jual dan mendatangkan calon pelanggan. Aplikasi adalah sistem yang dipakai timmu untuk menjalankan operasional, misalnya kasir, stok, atau ERP. Website punya paket dengan harga terbuka mulai Rp2 juta dan selesai dalam hitungan hari. Aplikasi dihitung per proyek, karena cakupannya mengikuti alur kerjamu.",
        },
        {
          q: "Bisakah menggantikan spreadsheet yang kami pakai sekarang?",
          a: "Bisa. Beralih dari spreadsheet adalah salah satu alasan paling sering tim datang ke kami, dan pemindahan data yang sudah ada direncanakan sebagai bagian dari proyek.",
        },
        {
          q: "Aplikasi seperti apa saja yang pernah dibuat?",
          a: "ERP untuk manufaktur dan distribusi, sistem apotek dengan pelacakan batch dan kadaluarsa, sistem restoran dari kasir sampai stok bahan, dan aplikasi retail untuk usaha yang lebih kecil.",
        },
        {
          q: "Apakah melayani klien di luar Bali?",
          a: "Ya. Kami berbasis di Bali dan melayani klien di seluruh Indonesia, dan prosesnya bisa berjalan online dari awal sampai akhir.",
        },
        {
          q: "Setelah sistemnya berjalan, bagaimana?",
          a: "Kami bantu migrasi data, melatih tim yang memakainya setiap hari, dan tetap tersedia setelahnya. Bentuk pendampingan lanjutan disepakati sebagai bagian dari cakupan.",
        },
      ],
      relatedTitle: "Baca juga",
      relatedPortfolio: "Lihat aplikasi yang sudah kami buat",
      relatedServices: "Lihat semua layanan kami",
      ctaTitle: "Ceritakan ke mana waktumu habis.",
      ctaBody:
        "Jelaskan prosesmu, kami bantu memetakan apa yang seharusnya bisa diambil alih oleh sistem.",
      ctaButton: "Mulai diskusi",
    },
  },
  promo: {
    eyebrow: "Jasa Pembuatan Website, Bali",
    title: "Website bisnis kamu online dalam 3–5 hari kerja, mulai Rp2 juta.",
    subtitle:
      "Scope dan harga ditulis di depan, sebelum ada yang dikerjakan. Dari paket Reef ke atas, panel adminnya kamu pegang sendiri, jadi ganti harga atau foto tidak perlu bayar developer lagi.",
    ctaPrimary: "Minta penawaran gratis",
    ctaSecondary: "Chat WhatsApp",
    ctaPackages: "Lihat paket dan harga",
    trust: [
      "Portfolio live, bisa kamu buka sendiri",
      "Diskusi awal gratis, tanpa ikatan",
      "Studio di Bali, klien seluruh Indonesia",
    ],
    painEyebrow: "Kedengaran familiar?",
    painTitle: "Website yang tidak bisa kamu urus sendiri akan basi dalam sebulan.",
    painItems: [
      {
        title: "Ganti sedikit saja ada biayanya",
        body: "Harga baru, foto baru, jam buka baru. Kalau setiap perubahan berarti menunggu orang lain dan membayar lagi, isinya berhenti mengikuti keadaan usaha kamu.",
      },
      {
        title: "Berat dibuka di HP",
        body: "Sebagian besar calon pembeli datang dari data seluler. Halaman yang berat kehilangan mereka sebelum sempat melihat apa yang kamu jual.",
      },
      {
        title: "Tidak muncul di Google",
        body: "Tanpa metadata, sitemap, dan structured data yang benar, website sebagus apa pun tidak akan muncul saat orang mencari layanan yang kamu tawarkan.",
      },
    ],
    packagesEyebrow: "Paket dan harga",
    packagesTitle: "Pilih scope-nya, angkanya sudah jelas sebelum mulai.",
    packagesNote:
      "Harga per proyek. Angka finalnya dikonfirmasi setelah sesi discovery singkat, karena tergantung berapa section dan fitur yang benar-benar kamu butuhkan.",
    packagesCta: "Tanya paket ini",
    proofEyebrow: "Bukti",
    proofTitle: "Bukan mockup. Buka sendiri sekarang.",
    proofBody:
      "Semua proyek di bawah ini live saat ini juga. Klik, lihat hasilnya, baru nilai kami sebelum ngobrol.",
    proofLive: "Buka situsnya",
    stepsEyebrow: "Cara kerjanya",
    stepsTitle: "Empat langkah, tanpa kejutan.",
    steps: [
      {
        title: "Discovery call gratis",
        body: "Kami petakan apa yang kamu jual, siapa pembelinya, dan website ini harus melakukan apa. Obrolan pertama ini tidak dipungut biaya.",
      },
      {
        title: "Scope dan penawaran tertulis",
        body: "Kamu terima scope dan harganya sebelum ada yang dikerjakan, jadi tidak ada yang bisa diperdebatkan belakangan.",
      },
      {
        title: "Pengerjaan dan review",
        body: "Kami kerjakan, lalu kamu review lewat link preview yang hidup dan beri masukan sebelum dipublikasikan.",
      },
      {
        title: "Launch dan serah terima",
        body: "Kami luncurkan, lalu memandu kamu memakai panel adminnya supaya timmu bisa menjaga isinya tetap segar.",
      },
    ],
    faqTitle: "Sebelum kamu tanya",
    faq: [
      {
        q: "Sebenarnya biayanya berapa?",
        a: "Paketnya mulai Rp2 juta dalam empat tingkatan. Yang cocok yang mana tergantung berapa section yang kamu butuhkan, seberapa jauh kustomisasi desainnya, dan apakah kamu butuh panel admin. Harga tiap paket ada di daftar di atas, dan angka persisnya dikonfirmasi setelah discovery call.",
      },
      {
        q: "Berapa lama pengerjaannya?",
        a: "Shore 3–5 hari, Reef 5–10 hari, dan Current 10–14 hari. Trench tergantung serumit apa permintaannya, jadi estimasinya ikut di scope tertulis kamu.",
      },
      {
        q: "Nanti bisa saya update sendiri?",
        a: "Bisa, mulai paket Reef ke atas. Panel adminnya memungkinkan kamu mengubah teks, harga, dan gambar langsung, dan perubahannya tampil di situs. Shore belum punya panel admin, jadi perubahannya lewat kami.",
      },
      {
        q: "Hosting dan domain termasuk?",
        a: "Domain dan hosting diurus sebagai bagian dari proyek. Bentuk persisnya dikonfirmasi saat discovery call, karena tergantung apa yang sudah kamu punya.",
      },
      {
        q: "Harus di Bali untuk kerja sama?",
        a: "Tidak. Kami berbasis di Bali dan mengerjakan klien dari seluruh Indonesia. Discovery, review, dan serah terima semuanya bisa online.",
      },
    ],
    formEyebrow: "Penawaran gratis",
    formTitle: "Ceritakan kebutuhan bisnis kamu.",
    formBody:
      "Jelaskan usahamu dan website ini harus melakukan apa. Kami balas dengan scope dan harganya, dan kamu tidak wajib melanjutkan.",
    formAside: "Lebih suka ngobrol langsung",
  },
  promoApp: {
    eyebrow: "Jasa Pembuatan Aplikasi, Bali",
    title: "Timmu balik ke Excel, padahal sistemnya sudah dibeli.",
    subtitle:
      "Kebanyakan sistem gagal di alur kerjanya, bukan di teknologinya. Dibangun tanpa ada yang benar-benar melihat cara tim bekerja, jadi timnya diam-diam kembali ke cara lama. Kami petakan prosesnya dulu, baru bicara kode.",
    ctaPrimary: "Ceritakan prosesmu",
    ctaSecondary: "Chat WhatsApp",
    ctaProof: "Buka sistem yang sudah kami bangun",
    trust: [
      "Semua sistem di bawah live dan bisa diklik",
      "Pemetaan alur kerja gratis, tanpa ikatan",
      "Didampingi sampai timmu benar-benar memakainya",
    ],
    painEyebrow: "Kenapa mandek",
    painTitle: "Tiga alasan sistem diam-diam berhenti dipakai.",
    painItems: [
      {
        title: "Alurnya bukan alur kamu",
        body: "Software dibeli jadi, lalu tim disuruh menyesuaikan diri. Yang terjadi malah sebaliknya: mereka kembali ke cara lama, dan sistemnya jadi hiasan.",
      },
      {
        title: "Cuma satu orang yang bisa",
        body: "Sistem yang tidak dipahami orang lain akhirnya dikuasai satu staf saja. Begitu dia cuti seminggu, prosesnya ikut berhenti.",
      },
      {
        title: "Ditinggal setelah go-live",
        body: "Vendor menghilang begitu invoice lunas. Padahal bulan-bulan pertama setelah peluncuran itu justru yang menentukan sistemnya dipakai atau tidak.",
      },
    ],
    proofEyebrow: "Bukti",
    proofTitle: "Bukan mockup. Buka sendiri sekarang.",
    proofBody:
      "Semua sistem di bawah ini berjalan hari ini dan dipakai setiap hari. Klik, lihat layar aslinya, baru nilai kami.",
    proofLive: "Buka sistemnya",
    buildEyebrow: "Yang kami bangun",
    buildTitle: "Dari satu proses yang berantakan, jadi sistem yang dijalankan timmu.",
    costEyebrow: "Soal biaya",
    costTitle: "Kenapa halaman ini tidak memasang harga.",
    costBody:
      "Aplikasi bisnis tidak punya harga rak. Dua toko dengan jumlah cabang sama bisa butuh sistem yang jauh berbeda. Menyebut angka sebelum kami paham prosesmu jelas akan salah, dan biasanya salahnya ke atas.",
    costItems: [
      "Kami petakan alur kerjamu dulu, tanpa biaya",
      "Kamu terima cakupan dan angkanya tertulis, sebelum ada yang dikerjakan",
      "Kalau aplikasi custom ternyata bukan jawabannya, kami bilang",
    ],
    stepsEyebrow: "Cara kerjanya",
    stepsTitle: "Empat langkah, tanpa kejutan.",
    steps: [
      {
        title: "Pemetaan proses",
        body: "Kami duduk bareng orang yang menjalankan prosesnya setiap hari, bukan cuma dengan pemiliknya. Bagian ini tidak dipungut biaya.",
      },
      {
        title: "Cakupan dan penawaran tertulis",
        body: "Kamu terima ruang lingkup dan harganya sebelum satu baris kode ditulis.",
      },
      {
        title: "Dibangun bertahap, direview sambil jalan",
        body: "Dikerjakan per bagian dan kamu review lewat link yang hidup, jadi tidak ada kejutan di akhir.",
      },
      {
        title: "Live dan pendampingan",
        body: "Kami latih timmu dan tetap mendampingi setelah go-live, sampai sistemnya benar-benar jadi bagian dari hari kerja.",
      },
    ],
    faqTitle: "Sebelum kamu tanya",
    faq: [
      {
        q: "Biaya aplikasi custom berapa?",
        a: "Dihitung per proyek, setelah kami petakan prosesmu. Tidak ada harga paket karena pekerjaannya sepenuhnya tergantung berapa orang, berapa cabang, dan berapa langkah yang terlibat. Paket yang kami pajang di halaman layanan itu untuk website, bukan aplikasi bisnis.",
      },
      {
        q: "Berapa lama pengerjaannya?",
        a: "Tergantung cakupannya. Estimasinya ikut di penawaran tertulis setelah pemetaan, bukan tebakan di obrolan pertama.",
      },
      {
        q: "Data lama kami bagaimana?",
        a: "Spreadsheet dan software lama diaudit dulu, lalu dipindahkan bertahap, jadi tim tidak pernah ditinggal tanpa angka yang mereka pakai harian.",
      },
      {
        q: "Tim kami tidak terlalu paham teknologi.",
        a: "Itu justru kasus yang normal, dan persis alasan kami memetakan alur kerja yang sudah ada, bukan memaksakan alur baru. Pelatihan bagian dari serah terima, dan kami tetap bisa dihubungi sesudahnya.",
      },
      {
        q: "Harus di Bali untuk kerja sama?",
        a: "Tidak. Kami berbasis di Bali dan mengerjakan klien dari seluruh Indonesia. Pemetaan, review, dan serah terima semuanya bisa online.",
      },
    ],
    formEyebrow: "Konsultasi gratis",
    formTitle: "Ceritakan proses yang masih berantakan.",
    formBody:
      "Jelaskan bagaimana pekerjaannya berjalan sekarang dan di mana macetnya. Kami balas dengan apa yang seharusnya bisa diambil alih sistem, dan kamu tidak wajib melanjutkan.",
    formAside: "Lebih suka ngobrol langsung",
  },
  nav: {
    services: "Layanan",
    portfolio: "Portfolio",
    testimonials: "Testimoni",
    about: "Tentang",
    blog: "Blog",
    contact: "Hubungi Kami",
  },
  blog: {
    eyebrow: "Blog",
    title: "Catatan seputar aplikasi, website, dan menjalankan usaha lebih rapi.",
    intro: "Panduan praktis dan insight dari pengalaman kami membangun sistem custom.",
    readMore: "Baca",
    empty: "Belum ada artikel. Nantikan segera.",
    back: "← Semua artikel",
    publishedOn: "Terbit",
  },
  hero: {
    eyebrow: "Systems & Software Studio",
    titleBefore: "Sistem yang benar-benar ",
    highlight: "dipakai",
    titleAfter: ", bukan sekadar di-deploy.",
    subtitle:
      "Kami membangun ERP dan aplikasi custom lintas industri, dari sistem enterprise sampai aplikasi untuk UMKM yang baru berkembang.",
    ctaPrimary: "Lihat Aplikasi Kami",
    ctaSecondary: "Diskusi Proyek",
  },
  home: {
    problemEyebrow: "Masalahnya",
    problemTitle: "Software jadi, tapi tim balik lagi ke spreadsheet.",
    problemBody:
      "Banyak sistem gagal bukan karena teknologinya, tapi karena dibangun tanpa memahami cara kerja tim yang sebenarnya.",
    solutionEyebrow: "Cara kami",
    solutionTitle: "Mulai dari alur kerja, baru bicara kode.",
    solutionBody:
      "Kami petakan proses nyata dulu, bangun sistem yang mengikuti itu, lalu dampingi sampai benar-benar dipakai sehari-hari.",
    servicesEyebrow: "Layanan",
    servicesTitle: "Empat cara kami bantu bisnis kamu jalan lebih rapi.",
    servicesLink: "Lihat detail layanan →",
    featuredEyebrow: "Aplikasi Kami",
    featuredTitle: "Bukan mockup, sistem yang sudah jalan dan bisa kamu buka.",
    featuredLink: "Lihat semua proyek →",
    showcaseEyebrow: "Cuplikan Layar",
    showcaseTitle: "Lihat lebih dekat karya yang sudah kami rilis.",
    showcaseIntro:
      "Screenshot asli dari aplikasi dan website yang kami bangun. Geser untuk lihat.",
    showcaseApp: "Aplikasi",
    showcaseWebsite: "Website",
    proofEyebrow: "Kenapa kami",
    proofTitle: "Nilai hasil kerjanya, bukan janji penjualannya.",
    proofItems: [
      {
        title: "Buka sendiri sistemnya",
        body: "Semua aplikasi di portfolio kami sudah live dan bisa diklik. Bukan mockup, bukan slide, bukan janji yang tak bisa kamu cek.",
      },
      {
        title: "Harga terbuka sejak awal",
        body: "Paket website mulai Rp2 juta dengan cakupan tertulis. Kamu tahu angkanya sebelum obrolan pertama selesai.",
      },
      {
        title: "Diskusi awal gratis",
        body: "Kami petakan alur kerja dulu sebelum menawarkan harga. Kalau sistem custom bukan jawabannya, kami bilang apa adanya.",
      },
      {
        title: "Didampingi setelah live",
        body: "Peluncuran bukan garis akhir. Kami dampingi sampai tim kamu benar-benar memakainya sehari-hari.",
      },
    ],
    testimonialsEyebrow: "Testimoni",
    testimonialsTitle: "Kata mereka yang sudah pakai.",
    ctaTitle: "Punya proses yang masih berantakan? Ceritakan ke kami.",
    ctaBody:
      "Diskusi awal gratis. Kami bantu petakan kebutuhan sebelum kamu putuskan apa-apa.",
    ctaButton: "Mulai Diskusi",
  },
  services: {
    eyebrow: "Layanan",
    title: "Empat cara kami bantu bisnis kamu jalan lebih rapi.",
    intro:
      "Setiap layanan dibangun dari alur kerja nyata tim kamu, bukan template yang dipaksakan.",
    pricingEyebrow: "Harga",
    pricingTitle: "Paket pengembangan website.",
    pricingIntro:
      "Titik awal yang transparan. Cakupan & harga final dikonfirmasi setelah diskusi singkat.",
    webTitle: "Website",
    webIntro:
      "Mulai Rp2 juta. Empat paket, dari satu halaman sampai custom penuh.",
    appTitle: "Aplikasi",
    appIntro:
      "Lihat aplikasi yang sudah kami kembangkan, atau konsultasi untuk develop aplikasi custom: ERP, aplikasi UMKM, dan migrasi sistem.",
    appCtaWork: "Lihat Aplikasi Kami",
    appCtaConsult: "Konsultasi Develop",
    perProject: "/ proyek",
    popular: "Populer",
    ctaTitle: "Belum yakin mana yang cocok untuk bisnis kamu?",
    ctaBody:
      "Ceritakan prosesnya, kami bantu petakan kebutuhan sebelum kamu putuskan apa-apa.",
    ctaButton: "Diskusi Proyek",
  },
  about: {
    eyebrow: "Tentang",
    title: "Studio yang bikin sistem, dan memastikan sistemnya dipakai.",
    intro:
      "Seawise adalah Systems & Software Studio. Kami membangun ERP dan aplikasi custom lintas industri, dari sistem enterprise sampai aplikasi untuk UMKM yang baru berkembang.",
    principles: [
      {
        title: "Alur kerja dulu, kode belakangan",
        body: "Kami mulai dari memahami proses nyata tim kamu. Sistem yang baik mengikuti cara kerja, bukan sebaliknya.",
      },
      {
        title: "Dibangun untuk dipakai",
        body: "Target kami bukan software yang selesai di-deploy, tapi sistem yang benar-benar jadi bagian kerja sehari-hari.",
      },
      {
        title: "Didampingi setelah live",
        body: "Peluncuran bukan akhir. Kami dampingi adopsi tim sampai sistem berjalan mulus.",
      },
      {
        title: "Fondasi yang konsisten",
        body: "Kami membangun di atas fondasi teknis yang sama dan teruji untuk setiap proyek, supaya sistem kamu tetap rapi, mudah dirawat, dan cepat berkembang.",
      },
    ],
    ctaTitle: "Mau lihat hasilnya langsung?",
    ctaButton: "Lihat Aplikasi Kami",
  },
  portfolio: {
    eyebrow: "Karya Kami",
    title: "Bukan mockup, aplikasi & website yang sudah jalan dan bisa kamu buka.",
    intro:
      "Setiap proyek punya link langsung ke aplikasi atau website live. Silakan dicoba.",
    liveButton: "Lihat Live ↗",
    comingSoon: "Segera hadir",
    filterAll: "Semua",
    filterApp: "Aplikasi",
    filterWebsite: "Website",
    viewDetail: "Lihat detail",
    detailBack: "← Semua karya",
    detailCtaTitle: "Mau yang seperti ini untuk bisnismu?",
    detailCtaButton: "Diskusi Proyek",
  },
  testimonials: {
    eyebrow: "Testimoni",
    title: "Kata mereka yang sudah pakai.",
    intro:
      "Hasil kerja kami paling jujur dinilai oleh tim yang memakainya setiap hari.",
    emptyTitle: "Sedang kami kumpulkan dengan benar.",
    emptyBody:
      "Daripada mengisi halaman ini dengan kutipan yang tidak bisa kami pertanggungjawabkan, lebih baik kamu menilai langsung hasil kerjanya. Semua sistem di portfolio kami sudah live dan bisa dicoba.",
    emptyCta: "Lihat karya kami",
  },
  contact: {
    eyebrow: "Kontak",
    title: "Ceritakan proses yang masih berantakan.",
    intro:
      "Diskusi awal gratis. Isi form di bawah, atau kirim email langsung ke hello@seawise.id.",
    emailLabel: "Email",
    whatsappLabel: "Chat via WhatsApp",
    instagramLabel: "Ikuti kami",
    googleLabel: "Profil Bisnis Google",
    googleValue: "Lihat profil dan ulasan kami",
    helpLabel: "Yang bisa kami bantu",
    helpItems: [
      "ERP custom & sistem enterprise",
      "Aplikasi untuk UMKM berkembang",
      "Migrasi dari spreadsheet / software lama",
      "Website & web app",
    ],
    form: {
      name: "Nama",
      namePlaceholder: "Nama kamu",
      email: "Email",
      emailPlaceholder: "nama@perusahaan.com",
      phone: "Nomor WhatsApp (opsional)",
      phonePlaceholder: "08xx xxxx xxxx",
      message: "Pesan",
      messagePlaceholder:
        "Ceritakan proses atau kebutuhan yang mau kamu selesaikan…",
      submit: "Kirim Pesan",
      submitting: "Mengirim…",
    },
    messages: {
      nameRequired: "Mohon isi nama kamu.",
      emailInvalid: "Alamat email belum valid.",
      messageShort: "Ceritakan sedikit lebih detail (min. 10 karakter).",
      phoneInvalid: "Nomor telepon belum valid.",
      notConfigured:
        "Koneksi ke database belum dikonfigurasi. Sementara ini, email langsung ke hello@seawise.id.",
      insertError: "Maaf, ada kendala saat mengirim. Coba lagi sebentar lagi.",
      success: "Terima kasih! Pesan kamu sudah masuk, kami balas secepatnya.",
    },
  },
  footer: {
    tagline: "Studio pengembangan aplikasi & website. ERP, aplikasi bisnis, dan website modern.",
    location: "Berbasis di Bali · Melayani seluruh Indonesia",
    navHeading: "Navigasi",
    contactHeading: "Kontak",
    contactForm: "Form kontak",
    googleBusiness: "Profil Bisnis Google",
    rights: "Systems & Software Studio.",
    builtWith: "Dibangun dengan Next.js & Supabase.",
    partOf: "Bagian dari",
  },
  servicesList: [
    {
      slug: "erp-custom",
      title: "ERP Custom",
      summary:
        "Sistem enterprise yang dirancang mengikuti alur kerja nyata tim kamu, bukan memaksa tim menyesuaikan diri ke software.",
      points: ["Inventori & pembelian", "Keuangan & laporan", "Multi-cabang & hak akses"],
    },
    {
      slug: "aplikasi-umkm",
      title: "Aplikasi UMKM Berkembang",
      summary:
        "Aplikasi ringan dan terjangkau untuk usaha yang mulai butuh sistem, dirancang agar bisa tumbuh seiring bisnis.",
      points: ["Kasir & penjualan", "Manajemen stok", "Bisa upgrade bertahap"],
    },
    {
      slug: "migrasi-sistem",
      title: "Migrasi Sistem",
      summary:
        "Pindah dari spreadsheet atau software lama ke sistem terpusat, tanpa kehilangan data dan tanpa mengganggu operasional.",
      points: ["Audit data lama", "Migrasi bertahap", "Pendampingan tim"],
    },
    {
      slug: "web-dev",
      title: "Web Development",
      summary:
        "Website dan web app cepat, modern, dan mudah dikelola, company profile sampai portal internal.",
      points: ["Cepat & modern", "Terhubung ke sistem", "SEO & performa"],
    },
  ],
  fallbackPricing: [
    {
      name: "Shore",
      tagline: "Promosi 1 produk/acara, personal branding sederhana",
      price: "Rp2 juta",
      priceNote: "/ proyek",
      features: ["1 halaman (maks 4–5 section)", "1 preset tema (tanpa pilihan warna)", "Tanpa admin panel (update via kami)", "SEO metadata standar", "1× revisi minor", "Maintenance opsional Rp1,5jt/th"],
      featured: false,
    },
    {
      name: "Reef",
      tagline: "UMKM yang butuh company profile utuh",
      price: "Rp3,5–4 juta",
      priceNote: "/ proyek",
      features: ["Maks 5–6 section", "Pilih dari preset tersedia", "Admin panel: edit teks, harga, foto", "SEO + structured data otomatis", "2× revisi major", "Maintenance Rp1,5jt/th"],
      featured: true,
    },
    {
      name: "Current",
      tagline: "Tampilan lebih personal, beda dari kompetitor",
      price: "Rp4,5–5 juta",
      priceNote: "/ proyek",
      features: ["Maks 8–10 section, reorder sendiri", "Preset + kustomisasi moderat", "Admin + reorder section", "SEO seperti Reef", "Bisa +1 add-on (charge terpisah)", "2× revisi major"],
      featured: false,
    },
    {
      name: "Trench",
      tagline: "Model bisnis unik / butuh custom penuh",
      price: "Rp6–7 juta",
      priceNote: "/ proyek",
      features: ["Section tak terbatas", "Full custom (vertical/tema baru)", "Admin akses lebih luas", "SEO + bisa bundling SEO Managed diskon", "1 add-on termasuk", "2× revisi major + prioritas support"],
      featured: false,
    },
  ],
};

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, id };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
