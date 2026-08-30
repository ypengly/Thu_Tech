/* ======================================================================
   THU TECH COM — SITE CONTENT CONFIGURATION
   ======================================================================
   ✏️  EDIT YOUR COMPANY INFORMATION HERE.

   This file is the SINGLE SOURCE OF TRUTH for every piece of text,
   number, and data item shown on the website: company info, services,
   products, projects, testimonials, team, careers, blog posts and FAQs.

   You do NOT need to touch any HTML, CSS, or other JS file to change
   the content of the site — just edit the values below and save.
   Every page reads from this file automatically.

   Structure map:
     COMPANY      -> name, logo text, contact info, social links
     STATS        -> homepage/about statistics
     MISSION_VISION_VALUES
     SERVICES     -> service cards + detail page content
     SOLUTIONS    -> solutions by customer type
     PROJECTS     -> portfolio items
     PRODUCTS     -> Thu Tech com's own products
     TESTIMONIALS
     TEAM
     CAREERS      -> open positions
     BLOG         -> articles
     FAQS
   ====================================================================== */

const SITE_CONTENT = {

  // ---------------------------------------------------------------------
  // 1. COMPANY INFORMATION — edit name, contact details, social links
  // ---------------------------------------------------------------------
  company: {
    name: "Thu Tech com",
    tagline: "Technology that helps your business move forward.",
    shortDescription:
      "Thu Tech com is a technology company focused on creating practical, reliable, and affordable digital solutions. From websites and business software to IT support and custom technology systems, we help our clients turn ideas into useful digital products.",
    email: "info@thutechcom.com",
    supportEmail: "support@thutechcom.com",
    phone: "+855 XX XXX XXX",
    address: "Phnom Penh, Cambodia",
    hours: "Mon – Fri, 8:00 AM – 6:00 PM",
    foundedYear: 2021,
    social: {
      facebook: "https://facebook.com/thutechcom",
      telegram: "https://t.me/thutechcom",
      linkedin: "https://linkedin.com/company/thutechcom",
      tiktok: "https://tiktok.com/@thutechcom",
      youtube: "https://youtube.com/@thutechcom"
    }
  },

  // ---------------------------------------------------------------------
  // 2. STATISTICS — shown on Home + About
  // ---------------------------------------------------------------------
  stats: [
    { value: "50+", label: "Projects Completed" },
    { value: "30+", label: "Happy Clients" },
    { value: "5+", label: "Years Experience" },
    { value: "24/7", label: "Technical Support" }
  ],

  // ---------------------------------------------------------------------
  // 3. MISSION / VISION / VALUES
  // ---------------------------------------------------------------------
  mission:
    "To provide practical and innovative technology solutions that help people and organizations solve problems, improve productivity, and create new opportunities.",
  vision:
    "To become a trusted technology partner known for reliable solutions, creative ideas, and meaningful digital innovation.",
  story:
    "Thu Tech com started with a simple idea: technology should make life easier, not more complicated. What began as a small team helping local businesses get online has grown into a full technology partner — building websites, software, and digital systems for businesses, schools, restaurants, and organizations across Cambodia.",
  values: [
    { icon: "lightbulb", title: "Innovation", description: "We continuously explore better ways to use technology." },
    { icon: "shield-check", title: "Reliability", description: "We build solutions people can depend on." },
    { icon: "sparkles", title: "Simplicity", description: "We make complicated technology easier to use." },
    { icon: "heart-handshake", title: "Customer Focus", description: "We listen carefully to our clients." },
    { icon: "trending-up", title: "Growth", description: "We help our clients grow through technology." }
  ],

  whyChooseUs: [
    { icon: "target", title: "Practical Solutions", description: "We build technology that solves real problems, not just impressive demos." },
    { icon: "wallet", title: "Affordable Technology", description: "Quality solutions that respect small and growing budgets." },
    { icon: "layout-template", title: "Modern Design", description: "Clean, professional interfaces that people enjoy using." },
    { icon: "headset", title: "Reliable Support", description: "Real people who respond quickly when you need help." },
    { icon: "settings-2", title: "Customized Systems", description: "Every solution is built around your specific workflow." },
    { icon: "message-circle", title: "Fast Communication", description: "Clear updates and quick replies throughout your project." },
    { icon: "layers", title: "Scalable Solutions", description: "Systems that grow with your business instead of holding it back." },
    { icon: "handshake", title: "Long-Term Partnership", description: "We stay involved after launch, not just until the invoice is paid." }
  ],

  processSteps: [
    { number: "01", title: "Consultation", description: "We start by listening — understanding your goals, challenges, and the outcome you want." },
    { number: "02", title: "Research", description: "We study your industry, users, and technical requirements before proposing a plan." },
    { number: "03", title: "Planning", description: "We map out scope, timeline, and technology so there are no surprises later." },
    { number: "04", title: "Development", description: "Our team builds the solution using modern, maintainable technology." },
    { number: "05", title: "Testing", description: "We test thoroughly across devices and real-world scenarios before launch." },
    { number: "06", title: "Launch", description: "We deploy your solution and make sure everything runs smoothly on day one." },
    { number: "07", title: "Support", description: "We stay on hand for updates, questions, and ongoing technical support." }
  ],

  // ---------------------------------------------------------------------
  // 4. SERVICES — add/remove services by editing this array
  // ---------------------------------------------------------------------
  services: [
    {
      id: "web-development",
      icon: "code-2",
      title: "Web Development",
      shortDescription: "Modern, responsive websites for businesses, organizations, schools, restaurants, and personal brands.",
      image: "web-development",
      problems: [
        "An outdated or non-existent website that turns customers away",
        "A site that looks broken on mobile phones",
        "No way to update content without hiring a developer every time"
      ],
      provide: [
        "Custom, responsive website design and development",
        "Content management so you can update text and images yourself",
        "SEO-friendly structure and fast loading speed"
      ],
      benefits: [
        "A professional online presence that builds trust",
        "More inquiries and conversions from visitors",
        "A site that works well on every device"
      ],
      faqs: [
        { q: "How long does a website take to build?", a: "Most business websites take 2–6 weeks depending on scope and content readiness." },
        { q: "Can I update the content myself?", a: "Yes — we build with easy-to-edit content structures or a content management system." }
      ]
    },
    {
      id: "software-development",
      icon: "terminal-square",
      title: "Software Development",
      shortDescription: "Custom software designed around specific business requirements.",
      image: "software-development",
      problems: [
        "Spreadsheets and manual processes that don't scale",
        "Off-the-shelf software that doesn't fit your workflow",
        "Disconnected tools that don't talk to each other"
      ],
      provide: [
        "Custom business applications built around your process",
        "Integrations with the tools you already use",
        "Ongoing updates as your requirements evolve"
      ],
      benefits: [
        "Software that matches how your team actually works",
        "Less manual work and fewer errors",
        "A system you own and can grow over time"
      ],
      faqs: [
        { q: "Do you build software from scratch?", a: "Yes, we design and build custom software tailored to your exact requirements." },
        { q: "Can you improve an existing system?", a: "Yes, we can audit, maintain, and extend systems you already have." }
      ]
    },
    {
      id: "mobile-applications",
      icon: "smartphone",
      title: "Mobile Applications",
      shortDescription: "Modern mobile applications for Android and iOS.",
      image: "mobile-apps",
      problems: [
        "No mobile presence while your customers live on their phones",
        "A web-only experience that feels clunky on mobile",
        "Ideas for an app with no technical team to build it"
      ],
      provide: [
        "Native and cross-platform mobile app development",
        "Clean, intuitive mobile interface design",
        "App store publishing support for Android and iOS"
      ],
      benefits: [
        "A dedicated channel to reach customers directly",
        "A smoother, faster experience than a mobile website",
        "New opportunities for engagement and revenue"
      ],
      faqs: [
        { q: "Do you build for both Android and iOS?", a: "Yes, we develop apps for both platforms, often from a single codebase." },
        { q: "Do you help publish to app stores?", a: "Yes, we assist with the full app store submission process." }
      ]
    },
    {
      id: "it-support",
      icon: "headset",
      title: "IT Support",
      shortDescription: "Technical support, troubleshooting, computer setup, networking, and maintenance.",
      image: "it-support",
      problems: [
        "Technical problems that stall your team's work",
        "No in-house IT staff to call when something breaks",
        "Networks and computers that are never quite set up right"
      ],
      provide: [
        "Remote and on-site technical troubleshooting",
        "Computer and network setup and maintenance",
        "Ongoing IT support plans for businesses"
      ],
      benefits: [
        "Faster resolution when technology issues come up",
        "Fewer disruptions to daily operations",
        "Peace of mind knowing help is available"
      ],
      faqs: [
        { q: "Do you offer ongoing support plans?", a: "Yes, we offer monthly IT support plans as well as one-time support requests." },
        { q: "Do you support remote teams?", a: "Yes, most support is available remotely, with on-site visits available in Phnom Penh." }
      ]
    },
    {
      id: "business-automation",
      icon: "workflow",
      title: "Business Automation",
      shortDescription: "Automate repetitive business processes and reduce manual work.",
      image: "automation",
      problems: [
        "Staff spending hours on repetitive manual tasks",
        "Manual data entry that leads to mistakes",
        "Processes that depend on one person remembering every step"
      ],
      provide: [
        "Workflow automation for repetitive business tasks",
        "Automated reporting and notifications",
        "Integration between the systems you already use"
      ],
      benefits: [
        "More time for your team to focus on real work",
        "Fewer manual errors and missed steps",
        "Processes that run consistently every time"
      ],
      faqs: [
        { q: "What kind of tasks can be automated?", a: "Common examples include reporting, notifications, data entry, and approvals." },
        { q: "Will automation replace my staff?", a: "No — automation removes repetitive tasks so your team can focus on higher-value work." }
      ]
    },
    {
      id: "digital-solutions",
      icon: "layout-dashboard",
      title: "Digital Solutions",
      shortDescription: "Technology solutions designed to improve business operations and customer experiences.",
      image: "digital-solutions",
      problems: [
        "Customer experiences that feel outdated compared to competitors",
        "Operations that rely on paper or disconnected tools",
        "Unclear picture of what's happening in the business day to day"
      ],
      provide: [
        "End-to-end digital solutions tailored to your operations",
        "Customer-facing tools that improve the experience you offer",
        "Dashboards and reporting for better decision-making"
      ],
      benefits: [
        "A more modern, competitive customer experience",
        "Streamlined day-to-day operations",
        "Clearer visibility into how the business is performing"
      ],
      faqs: [
        { q: "What counts as a 'digital solution'?", a: "Any combination of software, systems, or tools designed to solve a specific operational problem." }
      ]
    },
    {
      id: "ai-solutions",
      icon: "bot",
      title: "AI Solutions",
      shortDescription: "Practical AI-powered tools for research, automation, content, customer support, and business productivity.",
      image: "ai-solutions",
      problems: [
        "Slow customer response times during busy hours",
        "Repetitive content or research work eating into staff time",
        "Uncertainty about where AI could actually help the business"
      ],
      provide: [
        "AI-powered chat and customer support tools",
        "Content and research assistance tools",
        "Practical AI integrations into existing systems"
      ],
      benefits: [
        "Faster response times for customers",
        "More output from the same team size",
        "Practical, no-hype AI that solves real problems"
      ],
      faqs: [
        { q: "Is AI expensive to implement?", a: "We focus on practical, cost-effective AI tools scaled to your budget and needs." },
        { q: "Will this replace my customer service team?", a: "No — AI tools are designed to support your team, not replace the human touch." }
      ]
    },
    {
      id: "database-systems",
      icon: "database",
      title: "Database & System Solutions",
      shortDescription: "Secure systems for managing business information and organizational data.",
      image: "database-systems",
      problems: [
        "Business data scattered across spreadsheets and paper files",
        "No secure, centralized way to manage information",
        "Difficulty generating reports when you need them"
      ],
      provide: [
        "Secure database design and management systems",
        "Centralized data storage with proper access controls",
        "Reporting tools built on top of your data"
      ],
      benefits: [
        "One reliable source of truth for your business data",
        "Better security and controlled access",
        "Reports and insights available when you need them"
      ],
      faqs: [
        { q: "Is our data kept secure?", a: "Yes, we follow best practices for access control, backups, and data protection." }
      ]
    }
  ],

  // ---------------------------------------------------------------------
  // 5. SOLUTIONS — grouped by customer type
  // ---------------------------------------------------------------------
  solutions: [
    {
      id: "businesses",
      icon: "briefcase",
      title: "For Businesses",
      description: "Practical systems that help businesses operate more efficiently and serve customers better.",
      items: ["Business websites", "POS systems", "Inventory systems", "Customer management", "Business automation"]
    },
    {
      id: "schools",
      icon: "graduation-cap",
      title: "For Schools",
      description: "Digital platforms that simplify school administration, learning, and communication.",
      items: ["Student portals", "School management systems", "Accounting systems", "Online learning platforms"]
    },
    {
      id: "restaurants",
      icon: "utensils",
      title: "For Restaurants",
      description: "Modern ordering and menu tools that improve the dining experience.",
      items: ["QR menus", "Digital ordering", "Restaurant websites", "Menu management"]
    },
    {
      id: "organizations",
      icon: "building-2",
      title: "For Organizations",
      description: "Reliable systems for managing information, registrations, and reporting.",
      items: ["Information systems", "Registration systems", "Data management", "Reporting dashboards"]
    },
    {
      id: "individuals",
      icon: "user",
      title: "For Individuals",
      description: "Personal digital tools and websites built around what you need.",
      items: ["Personal websites", "Portfolio websites", "Digital tools", "Custom applications"]
    }
  ],

  // ---------------------------------------------------------------------
  // 6. PROJECTS / PORTFOLIO
  // ---------------------------------------------------------------------
  projects: [
    {
      id: "restaurant-qr-menu",
      name: "Restaurant QR Menu",
      category: "Websites",
      filterTag: "web-application",
      description: "A digital menu system allowing customers to scan a QR code and browse restaurant menus from their phones.",
      technologies: ["React", "Node.js", "PostgreSQL"],
      image: "qr-menu"
    },
    {
      id: "student-portal",
      name: "Student Portal",
      category: "Education",
      filterTag: "education",
      description: "A secure student portal for accessing academic and financial information.",
      technologies: ["React", "Express", "MySQL"],
      image: "student-portal"
    },
    {
      id: "business-management-system",
      name: "Business Management System",
      category: "Business",
      filterTag: "business",
      description: "A custom system for managing customers, products, sales, and reports.",
      technologies: ["TypeScript", "Node.js", "PostgreSQL"],
      image: "business-system"
    },
    {
      id: "digital-certificate-maker",
      name: "Digital Certificate Maker",
      category: "Websites",
      filterTag: "web-application",
      description: "A web-based tool for creating professional certificates.",
      technologies: ["React", "Canvas API", "Node.js"],
      image: "certificate-maker"
    },
    {
      id: "inventory-tracker",
      name: "Retail Inventory Tracker",
      category: "Business",
      filterTag: "business",
      description: "An inventory and stock management tool built for a growing retail chain.",
      technologies: ["React", "Express", "PostgreSQL"],
      image: "inventory"
    },
    {
      id: "school-mobile-app",
      name: "School Companion App",
      category: "Mobile",
      filterTag: "mobile",
      description: "A mobile app for parents to track school announcements, grades, and attendance.",
      technologies: ["React Native", "Firebase"],
      image: "school-app"
    }
  ],

  // ---------------------------------------------------------------------
  // 7. PRODUCTS — Thu Tech com's own products
  // ---------------------------------------------------------------------
  products: [
    {
      id: "thu-menu",
      name: "Thu Menu",
      tagline: "Digital QR menu solution for restaurants.",
      description: "Thu Menu lets restaurants create beautiful digital menus that customers can browse instantly by scanning a QR code — no app download required.",
      features: ["Instant QR code menus", "Easy menu updates", "Multi-language support", "Works on any device"],
      pricing: "Starting from $19/month",
      icon: "qr-code"
    },
    {
      id: "thu-business",
      name: "Thu Business",
      tagline: "Simple business management software.",
      description: "Thu Business helps small and medium businesses manage customers, sales, and inventory in one simple dashboard.",
      features: ["Customer management", "Sales tracking", "Inventory management", "Simple reports"],
      pricing: "Starting from $29/month",
      icon: "briefcase-business"
    },
    {
      id: "thu-school",
      name: "Thu School",
      tagline: "Digital school management platform.",
      description: "Thu School gives schools a single platform for student records, attendance, grading, and parent communication.",
      features: ["Student records", "Attendance tracking", "Gradebook", "Parent communication"],
      pricing: "Custom pricing for institutions",
      icon: "school"
    },
    {
      id: "thu-forms",
      name: "Thu Forms",
      tagline: "Online form and registration system.",
      description: "Thu Forms makes it easy to build online forms and registration pages, then collect and export the responses.",
      features: ["Drag-and-drop form builder", "Online registrations", "Response export", "Custom branding"],
      pricing: "Starting from $9/month",
      icon: "file-text"
    },
    {
      id: "thu-certificate",
      name: "Thu Certificate",
      tagline: "Certificate and award creation platform.",
      description: "Thu Certificate lets organizations design and generate professional certificates in bulk, ready to print or share digitally.",
      features: ["Custom templates", "Bulk generation", "Digital + printable certificates", "Verification links"],
      pricing: "Starting from $15/month",
      icon: "award"
    }
  ],

  // ---------------------------------------------------------------------
  // 8. TESTIMONIALS
  // ---------------------------------------------------------------------
  testimonials: [
    { quote: "Thu Tech com helped us turn our idea into a working digital solution. The team was professional, responsive, and easy to work with.", name: "Sok Dara", role: "Business Owner" },
    { quote: "Our new website brought in more inquiries in the first month than we had all last year. Communication throughout the project was excellent.", name: "Chan Sophea", role: "Restaurant Owner" },
    { quote: "They understood exactly what our school needed and delivered a system our staff actually enjoy using.", name: "Ly Vannak", role: "School Administrator" },
    { quote: "Reliable, patient, and genuinely helpful — our go-to team whenever we need technical support.", name: "Heng Sreymom", role: "Operations Manager" },
    { quote: "The business management system they built saved us hours of manual work every week.", name: "Pich Ratanak", role: "Retail Owner" },
    { quote: "From the first meeting to launch, everything felt organized and professional.", name: "Kim Sotheary", role: "NGO Director" }
  ],

  // ---------------------------------------------------------------------
  // 9. TEAM / LEADERSHIP
  // ---------------------------------------------------------------------
  team: [
    { name: "Thun Sopheak", role: "Founder & CEO", bio: "Leads company strategy and client partnerships." },
    { name: "Vann Chetra", role: "Head of Engineering", bio: "Oversees software and web development projects." },
    { name: "Ourn Kunthea", role: "Lead Designer", bio: "Shapes the visual identity behind every project." },
    { name: "Sok Piseth", role: "IT Support Lead", bio: "Keeps client systems running smoothly day to day." }
  ],

  // ---------------------------------------------------------------------
  // 10. CLIENT LOGOS (placeholders — replace with real client names/logos)
  // ---------------------------------------------------------------------
  clients: [
    "Placeholder Co.", "Northbridge Retail", "Mekong Learning Group", "Riverside Restaurant Group", "Angkor Trade Partners", "Sunrise NGO Network"
  ],

  // ---------------------------------------------------------------------
  // 11. CAREERS — open positions
  // ---------------------------------------------------------------------
  careers: [
    {
      id: "web-developer",
      title: "Web Developer",
      location: "Phnom Penh / Remote",
      type: "Full-time",
      description: "Build and maintain modern, responsive websites for our clients using React and Tailwind CSS.",
      requirements: ["1+ years experience with HTML/CSS/JavaScript", "Familiarity with React", "Good communication skills"]
    },
    {
      id: "software-developer",
      title: "Software Developer",
      location: "Phnom Penh",
      type: "Full-time",
      description: "Design and build custom software applications for business clients.",
      requirements: ["2+ years experience in software development", "Experience with Node.js or similar backend technology", "Problem-solving mindset"]
    },
    {
      id: "it-support-specialist",
      title: "IT Support Specialist",
      location: "Phnom Penh",
      type: "Full-time",
      description: "Provide remote and on-site technical support to business clients.",
      requirements: ["Experience troubleshooting computers and networks", "Strong customer service skills", "Own transportation preferred"]
    },
    {
      id: "ui-ux-designer",
      title: "UI/UX Designer",
      location: "Remote",
      type: "Full-time / Contract",
      description: "Design clean, modern interfaces for websites, software, and mobile apps.",
      requirements: ["Portfolio of UI/UX work", "Proficiency with Figma", "Understanding of responsive design principles"]
    },
    {
      id: "digital-marketing-specialist",
      title: "Digital Marketing Specialist",
      location: "Phnom Penh",
      type: "Full-time",
      description: "Support marketing efforts for Thu Tech com and select client projects.",
      requirements: ["Experience with social media and content marketing", "Basic understanding of SEO", "Strong written communication"]
    },
    {
      id: "project-assistant",
      title: "Project Assistant",
      location: "Phnom Penh",
      type: "Full-time",
      description: "Support project coordination between clients and the development team.",
      requirements: ["Strong organizational skills", "Comfortable communicating with clients", "Interest in technology"]
    }
  ],

  // ---------------------------------------------------------------------
  // 12. BLOG / NEWS ARTICLES
  // ---------------------------------------------------------------------
  blog: [
    {
      id: "technology-help-small-business-grow",
      title: "How Technology Can Help Small Businesses Grow",
      category: "Business",
      date: "2026-07-14",
      author: "Thun Sopheak",
      excerpt: "From simple websites to full business systems, here's how small businesses can use technology to work smarter and grow faster.",
      featured: true
    },
    {
      id: "every-business-needs-professional-website",
      title: "Why Every Business Needs a Professional Website",
      category: "Web Development",
      date: "2026-06-30",
      author: "Vann Chetra",
      excerpt: "Your website is often the first impression a customer has of your business. Here's why it's worth doing right.",
      featured: false
    },
    {
      id: "ai-changing-business-productivity",
      title: "How AI Is Changing Business Productivity",
      category: "AI Solutions",
      date: "2026-06-10",
      author: "Ourn Kunthea",
      excerpt: "Practical ways businesses are using AI tools today — without the hype.",
      featured: false
    },
    {
      id: "future-of-digital-business-cambodia",
      title: "The Future of Digital Business in Cambodia",
      category: "Industry",
      date: "2026-05-22",
      author: "Thun Sopheak",
      excerpt: "A look at how Cambodian businesses are adopting digital tools, and what's coming next.",
      featured: false
    }
  ],

  // ---------------------------------------------------------------------
  // 13. FAQS
  // ---------------------------------------------------------------------
  faqs: [
    { q: "What services does Thu Tech com provide?", a: "We provide web development, software development, mobile apps, IT support, business automation, AI solutions, and database/system solutions." },
    { q: "Can you build a custom system for my business?", a: "Yes — custom systems built around your specific workflow are one of our core services." },
    { q: "Do you provide technical support?", a: "Yes, we offer both one-time technical support and ongoing support plans." },
    { q: "How much does a website cost?", a: "Pricing depends on scope and features. Contact us for a free estimate based on your needs." },
    { q: "How long does a project take?", a: "Most websites take 2–6 weeks; custom software projects vary based on complexity." },
    { q: "Can you maintain our website after launch?", a: "Yes, we offer ongoing maintenance and support plans after your project launches." },
    { q: "Do you work with small businesses?", a: "Yes — we work with businesses of all sizes, from individuals to established organizations." },
    { q: "Can you build systems specifically for Cambodian businesses?", a: "Yes, we design solutions with local business needs, languages, and workflows in mind." }
  ],

  // ---------------------------------------------------------------------
  // 14. SUPPORT PAGE OPTIONS
  // ---------------------------------------------------------------------
  supportOptions: [
    { icon: "wrench", title: "Technical Support", description: "Get help with an existing product or system." },
    { icon: "circle-help", title: "General Questions", description: "Ask about our services." },
    { icon: "folder-kanban", title: "Project Support", description: "Get help with an existing project." },
    { icon: "triangle-alert", title: "Report a Problem", description: "Report a technical issue." }
  ]
};

// Make available globally
window.SITE_CONTENT = SITE_CONTENT;
