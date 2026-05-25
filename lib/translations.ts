export type Language = "en" | "gr";

const en = {
  nav: {
    home: "Home",
    products: "Shop",
    about: "About",
    services: "Services",
    testimonials: "Testimonials",
    blog: "Blog",
    contact: "Contact",
    getQuote: "Visit Showroom",
    switchLang: "ΕΛ",
  },
  hero: {
    badge: "Certified Open Box",
    eyebrow: "Michael Lamidis",
    locationLabel: "Limassol, Cyprus",
    titleLine1: "The Same Appliance.",
    titleLine2: "50% Less. No Compromise.",
    subtitle:
      "Brand-new Samsung, LG, Bosch, Miele & Siemens appliances - certified, warranted, delivered free across Cyprus. Walk into our Limassol showroom or browse online.",
    cta1: "Shop Now",
    cta2: "Visit Showroom",
    cta3: "Visit Our Showroom",
    scrollHint: "Scroll",
    trustItems: [
      "Certified Quality",
      "12-Month Warranty",
      "Free Delivery",
    ],
    stats: [
      { value: "500+", label: "Products In Stock" },
      { value: "4.9", label: "Star Rating" },
      { value: "70%", label: "Max Savings" },
      { value: "12mo", label: "Warranty" },
    ],
  },
  announcement: {
    message: "🔥 Summer Sale — Up to 70% off premium open box appliances. Limited stock!",
    cta: "Shop Now",
  },
  categoryStrip: {
    eyebrow: "Shop by Category",
    items: [
      { id: "all", label: "All Products" },
      { id: "refrigerators", label: "Refrigerators" },
      { id: "washing-machines", label: "Washers" },
      { id: "ovens", label: "Ovens" },
      { id: "dishwashers", label: "Dishwashers" },
      { id: "air-conditioners", label: "Air Conditioning" },
      { id: "tvs", label: "Smart TVs" },
      { id: "small-appliances", label: "Small Appliances" },
    ],
  },
  trust: {
    eyebrow: "Trusted by Thousands",
    title: "Why Families Choose Lamidis",
    items: [
      {
        icon: "ShieldCheck",
        title: "47-Point Inspection",
        description:
          "Every appliance passes our rigorous certification process before reaching you.",
      },
      {
        icon: "Award",
        title: "12-Month Warranty",
        description:
          "Full parts and labor coverage on every open box item. Peace of mind, guaranteed.",
      },
      {
        icon: "Truck",
        title: "Free Delivery & Install",
        description:
          "Complimentary white-glove delivery and installation on orders over €200.",
      },
      {
        icon: "RefreshCw",
        title: "30-Day Returns",
        description:
          "Not satisfied? Return within 30 days for a full refund, no questions asked.",
      },
    ],
  },
  features: {
    eyebrow: "Why Open Box?",
    title: "The Smart Way to Buy Premium Appliances",
    subtitle:
      "Open box means like-new quality at a fraction of retail. Discover why savvy Cypriot families choose Lamidis.",
    items: [
      {
        icon: "Tag",
        title: "Up to 70% Off",
        description:
          "Genuine savings on Samsung, LG, Bosch, Miele, Siemens — all premium brands, not budget alternatives.",
      },
      {
        icon: "CheckCircle2",
        title: "Thoroughly Certified",
        description:
          "Our certified technicians test every function of every unit before it's offered for sale.",
      },
      {
        icon: "Zap",
        title: "In Stock & Ready",
        description:
          "No 8-week backorders. Our inventory ships within 24–48 hours across Cyprus.",
      },
      {
        icon: "Recycle",
        title: "Eco-Friendly",
        description:
          "Give quality appliances a second life and reduce Cyprus's electronic waste footprint.",
      },
      {
        icon: "Star",
        title: "50+ Premium Brands",
        description:
          "Samsung, LG, Bosch, Miele, Siemens, Electrolux, Philips, AEG, Gorenje, and more.",
      },
      {
        icon: "HeartHandshake",
        title: "Expert Guidance",
        description:
          "Our appliance specialists help you find the perfect match for your home and budget.",
      },
    ],
  },
  services: {
    eyebrow: "Our Services",
    title: "Everything You Need, All in One Place",
    subtitle:
      "From sourcing to installation, we provide a complete appliance experience.",
    items: [
      {
        icon: "Search",
        title: "Appliance Sourcing",
        description:
          "Tell us what you need. We'll match you with the perfect certified unit from our extensive inventory.",
        price: "Free",
        badge: "Most Popular",
      },
      {
        icon: "Wrench",
        title: "Professional Installation",
        description:
          "Certified technicians install your appliance, test all functions, and remove old units.",
        price: "From €40",
        badge: null,
      },
      {
        icon: "Settings",
        title: "Repair & Maintenance",
        description:
          "Keep appliances running at peak performance with our scheduled maintenance plans.",
        price: "From €30",
        badge: null,
      },
      {
        icon: "Package",
        title: "White-Glove Delivery",
        description:
          "Delivery, setup, connection, and removal of your old appliance. Fully handled.",
        price: "From €25",
        badge: null,
      },
    ],
  },
  gallery: {
    eyebrow: "Our Collection",
    title: "Explore Premium Inventory",
    subtitle:
      "Browse certified open box appliances from the world's leading brands at exceptional prices.",
    viewAll: "View All Products",
    saveLabel: "Save",
    gradeLabel: "Grade",
    warrantyLabel: "Warranty",
    originalLabel: "Original",
    ctaCard: "Get This Deal",
    categories: {
      all: "All",
      refrigerators: "Refrigerators",
      "washing-machines": "Washing Machines",
      dishwashers: "Dishwashers",
      "air-conditioners": "Air Conditioners",
      tvs: "TVs",
      "small-appliances": "Small Appliances",
    },
  },
  testimonials: {
    eyebrow: "Customer Stories",
    title: "Thousands of Happy Families",
    subtitle:
      "Real reviews from real customers who saved big without compromising quality.",
    items: [
      {
        name: "Maria Papadopoulou",
        role: "Homeowner",
        location: "Limassol",
        content:
          "I was skeptical about open box, but the Samsung refrigerator I bought from Lamidis is absolutely perfect. Saved €400 and got a 12-month warranty. Could not be happier!",
        rating: 5,
      },
      {
        name: "Nikos Alexandris",
        role: "Property Developer",
        location: "Nicosia",
        content:
          "I outfit entire apartments with Lamidis appliances. Consistently excellent quality, unbeatable prices, and an incredibly professional team. My go-to supplier.",
        rating: 5,
      },
      {
        name: "Elena Stavros",
        role: "Interior Designer",
        location: "Limassol",
        content:
          "My clients love the savings they find through Lamidis. The Bosch washer and Siemens dishwasher I selected look brand new — indistinguishable from retail.",
        rating: 5,
      },
      {
        name: "Dimitris Kostopoulos",
        role: "Hotel Manager",
        location: "Paphos",
        content:
          "We equipped 12 rooms with Lamidis appliances and saved over €8,000 vs. buying new. Every unit has been flawless for two full years. Outstanding value.",
        rating: 5,
      },
      {
        name: "Sofia Georgiadis",
        role: "Student",
        location: "Larnaca",
        content:
          "Moving into my first apartment on a student budget, Lamidis made premium appliances possible. The LG washer runs perfectly and the team was so helpful.",
        rating: 5,
      },
    ],
  },
  stats: {
    eyebrow: "Our Impact",
    title: "Numbers That Tell the Story",
    items: [
      { value: 12, suffix: "+", label: "Years in Business" },
      { value: 5000, suffix: "+", label: "Happy Customers" },
      { value: 70, suffix: "%", label: "Average Savings" },
      { value: 50, suffix: "+", label: "Premium Brands" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Your Questions, Answered",
    subtitle:
      "Everything you need to know about open box appliances and shopping with Lamidis.",
    items: [
      {
        question: "What exactly is an open box appliance?",
        answer:
          "An open box appliance is a product that has been returned to a retailer, had its packaging opened, or used as a display model. These items are in like-new or excellent condition, fully tested and certified, and sold at a significant discount — typically 30–70% below retail.",
      },
      {
        question: "Do open box appliances come with a warranty?",
        answer:
          "Yes. Every appliance from Michael Lamidis includes our own 12-month warranty covering parts and labor. Some items also carry remaining manufacturer warranty. You're fully protected.",
      },
      {
        question: "How do I know the appliance works perfectly?",
        answer:
          "Every unit passes our rigorous 47-point inspection conducted by certified technicians. We test all functions, clean thoroughly, and assign a grade (A++, A+, A) that honestly reflects the item's condition before listing it for sale.",
      },
      {
        question: "What brands do you carry?",
        answer:
          "We stock all major premium brands: Samsung, LG, Bosch, Miele, Siemens, Electrolux, Philips, Whirlpool, AEG, Gorenje, Beko, and many more. Over 50 brands in total.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy on all purchases. If you're not completely satisfied, contact us and we'll arrange the return and issue a full refund promptly, no questions asked.",
      },
      {
        question: "Do you offer delivery and installation?",
        answer:
          "Yes. We offer professional white-glove delivery and installation. Delivery is complimentary on orders over €200. Installation starts from €40 and includes removal of your old appliance and full setup.",
      },
      {
        question: "How fast can I receive my appliance?",
        answer:
          "Most in-stock items are delivered within 24–48 hours in Limassol and major Cypriot cities. For remote areas, delivery takes 3–5 business days. Same-day delivery may be available; contact us to check.",
      },
    ],
    cta: "Still have questions?",
    ctaBtn: "Contact Our Team",
  },
  leadCapture: {
    eyebrow: "Get the Best Deal",
    title: "Tell Us What You're Looking For",
    subtitle:
      "Share your needs and we'll find the perfect certified unit at the best possible price — response within 2 hours.",
    benefits: [
      "Response within 2 hours",
      "No-obligation quote",
      "Price-match guarantee",
      "Expert recommendations",
    ],
    form: {
      name: "Your Full Name",
      email: "Email Address",
      phone: "Phone Number",
      interest: "Appliance Type",
      interestOptions: [
        "Refrigerator",
        "Washing Machine",
        "Dishwasher",
        "Air Conditioner",
        "TV",
        "Small Appliance",
        "Other",
      ],
      message: "Specific requirements (brand, model, size, budget)...",
      submit: "Send My Request",
      success: "Request Sent!",
      successMsg:
        "We'll reach out within 2 hours with the best options available for you.",
      sending: "Sending...",
    },
  },
  contact: {
    eyebrow: "Get in Touch",
    title: "We're Here to Help",
    subtitle:
      "Visit our Limassol showroom or reach out online. Our appliance specialists are ready.",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hoursLabel: "Hours",
    mapCta: "Get Directions",
    form: {
      name: "Your Name",
      email: "Email Address",
      subject: "Subject",
      message: "How can we help you?",
      submit: "Send Message",
      success: "Message Sent!",
      successMsg: "We'll get back to you within a few hours.",
    },
  },
  footer: {
    description:
      "Cyprus's premier destination for certified open box appliances. Quality you can trust, savings you'll love.",
    companyTitle: "Company",
    companyLinks: [
      { label: "About Us", href: "/about" },
      { label: "Our Services", href: "/services" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Blog", href: "/blog" },
    ],
    servicesTitle: "Services",
    servicesLinks: [
      { label: "Open Box Appliances", href: "/services" },
      { label: "Installation", href: "/services#installation" },
      { label: "Repair & Maintenance", href: "/services#repair" },
      { label: "Delivery", href: "/services#delivery" },
    ],
    supportTitle: "Support",
    supportLinks: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Warranty Policy", href: "/warranty" },
      { label: "Returns", href: "/returns" },
    ],
    newsletterTitle: "Exclusive Deals",
    newsletterPlaceholder: "Your email address",
    newsletterCta: "Subscribe",
    copyright: "© 2024 Michael Lamidis. All rights reserved.",
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  pages: {
    products: {
      badge: "Certified Inventory",
      titleLine1: "Our Products —",
      titleLine2: "All In One Place",
      subtitle:
        "Every appliance certified, graded, and backed by a 12-month warranty. Up to 70% off retail — ready to ship.",
      statProductsInStock: "Products in stock",
      statPremiumBrands: "Premium brands",
      statMaxSavings: "Max savings",
      sortBestDeals: "Best Deals",
      sortPriceAsc: "Price: Low → High",
      sortPriceDesc: "Price: High → Low",
      viewAll: "View All Products",
      gradeLabel: "Grade",
      warrantyMo: "mo Warranty",
      inStock: "In Stock",
      viewDetails: "View Details",
      showing: "Showing",
      productSingular: "product",
      productPlural: "products",
      inCategory: "in",
      gridView: "Grid view",
      emptyMessage: "No products in this category right now.",
      ctaTitle: "Can't Find What You're Looking For?",
      ctaSubtitle:
        "Our inventory updates weekly. Contact us with your requirements and we'll source the perfect appliance for you.",
      ctaEnquiry: "Send an Enquiry",
      ctaAbout: "About Our Store",
      filters: {
        all: "All Products",
        refrigerators: "Refrigerators",
        "washing-machines": "Washing Machines",
        ovens: "Ovens",
        dishwashers: "Dishwashers",
        "air-conditioners": "Air Conditioners",
        tvs: "Smart TVs",
        "small-appliances": "Small Appliances",
      },
    },
    about: {
      badge: "Our Story",
      defaultHeadline: "Redefining How Cyprus Buys Appliances",
      defaultSubheadline:
        "For over 12 years, Michael Lamidis has been making premium appliances accessible to every Cypriot household.",
      defaultStory: [
        "Michael Lamidis was founded in 2012 with a simple mission: to make premium appliances affordable for every Cypriot family. What started as a small operation has grown into Cyprus's most trusted open box appliance destination.",
        "We believe that everyone deserves access to quality appliances without breaking the bank. By specializing in certified open box products, we bridge the gap between luxury and affordability.",
        "Today, we serve thousands of satisfied customers across Cyprus - from individual homeowners to hotels and businesses. Our certified technicians ensure every product meets our exacting standards.",
      ],
      statYears: "Years",
      statCustomers: "Customers",
      statBrands: "Brands",
      whoWeAre: "Who We Are",
      whoTitle: "A Family Business Built on Trust",
      getInTouch: "Get in Touch",
      valuesEyebrow: "Our Values",
      valuesTitle: "What We Stand For",
      values: [
        { title: "Transparency", desc: "We honestly grade every product and disclose any imperfections. No surprises." },
        { title: "Quality First", desc: "We never compromise on product quality, regardless of the price point." },
        { title: "Customer Care", desc: "Your satisfaction is our priority, before and long after your purchase." },
        { title: "Sustainability", desc: "We proudly reduce electronic waste — one certified appliance at a time." },
      ],
      teamEyebrow: "Our Team",
      teamTitle: "The People Behind Lamidis",
      team: [
        { name: "Michael Lamidis", role: "Founder & CEO" },
        { name: "Katerina Lamidis", role: "Operations Director" },
        { name: "Giorgos Petrou", role: "Head Technician" },
        { name: "Anna Stavridis", role: "Customer Relations" },
      ],
      ctaTitle: "Ready to Start Saving?",
      ctaSubtitle:
        "Browse our certified open box inventory or get a personalised quote from our team.",
      ctaBrowse: "Browse Products",
      ctaQuote: "Get a Quote",
    },
    services: {
      badge: "Our Services",
      titleLine1: "Everything You Need,",
      titleLine2: "All in One Place",
      subtitle:
        "From sourcing to installation, we provide a complete premium appliance experience.",
      features: [
        "Quick turnaround",
        "Certified professionals",
        "Satisfaction guaranteed",
      ],
      bookCta: "Book This Service",
    },
    testimonials: {
      badge: "Real Stories",
      titleLine1: "Thousands of Families",
      titleLine2: "Trust Lamidis",
      subtitle:
        "Real reviews from real customers who saved big without compromising quality.",
      ctaText: "Join thousands of satisfied customers across Cyprus.",
      ctaBtn: "Get Your Free Quote",
    },
    contact: {
      defaultBadge: "Contact",
      defaultHeadline: "We're Here to Help You Save",
      defaultSubheadline:
        "Visit our Limassol showroom or contact us online. Our specialists respond within 2 hours.",
      showroomLabel: "Limassol Showroom",
      sendAnother: "Send Another",
      sending: "Sending...",
    },
    faq: {
      badge: "FAQ",
      titleLine1: "Your Questions,",
      titleLine2: "Answered",
    },
  },
};

const gr: typeof en = {
  nav: {
    home: "Αρχική",
    products: "Κατάστημα",
    about: "Σχετικά",
    services: "Υπηρεσίες",
    testimonials: "Αξιολογήσεις",
    blog: "Blog",
    contact: "Επικοινωνία",
    getQuote: "Επισκεφθείτε το Showroom",
    switchLang: "EN",
  },
  hero: {
    badge: "Πιστοποιημένα Open Box",
    eyebrow: "Michael Lamidis",
    locationLabel: "Λεμεσός, Κύπρος",
    titleLine1: "Η Ίδια Συσκευή.",
    titleLine2: "50% Λιγότερο. Κανένας Συμβιβασμός.",
    subtitle:
      "Ολοκαίνουργιες συσκευές Samsung, LG, Bosch, Miele & Siemens — πιστοποιημένες, με εγγύηση και δωρεάν παράδοση σε όλη την Κύπρο. Επισκεφθείτε το showroom μας στη Λεμεσό ή περιηγηθείτε online.",
    cta1: "Αγοράστε Τώρα",
    cta2: "Επισκεφθείτε το Showroom",
    cta3: "Επισκεφθείτε το Showroom",
    scrollHint: "Κύλιση",
    trustItems: [
      "Πιστοποιημένη Ποιότητα",
      "Εγγύηση 12 Μηνών",
      "Δωρεάν Παράδοση",
    ],
    stats: [
      { value: "500+", label: "Διαθέσιμα Προϊόντα" },
      { value: "4.9", label: "Βαθμολογία" },
      { value: "70%", label: "Μέγιστη Εξοικονόμηση" },
      { value: "12μη", label: "Εγγύηση" },
    ],
  },
  announcement: {
    message: "🔥 Καλοκαιρινές Εκπτώσεις — Έως 70% σε premium open box συσκευές. Περιορισμένο απόθεμα!",
    cta: "Αγοράστε Τώρα",
  },
  categoryStrip: {
    eyebrow: "Αγορά ανά Κατηγορία",
    items: [
      { id: "all", label: "Όλα τα Προϊόντα" },
      { id: "refrigerators", label: "Ψυγεία" },
      { id: "washing-machines", label: "Πλυντήρια" },
      { id: "ovens", label: "Φούρνοι" },
      { id: "dishwashers", label: "Πλυντήρια Πιάτων" },
      { id: "air-conditioners", label: "Κλιματιστικά" },
      { id: "tvs", label: "Τηλεοράσεις" },
      { id: "small-appliances", label: "Μικρές Συσκευές" },
    ],
  },
  trust: {
    eyebrow: "Εμπιστευμένοι από Χιλιάδες",
    title: "Γιατί Οι Οικογένειες Επιλέγουν Lamidis",
    items: [
      {
        icon: "ShieldCheck",
        title: "Έλεγχος 47 Σημείων",
        description:
          "Κάθε συσκευή περνά τη διαδικασία πιστοποίησής μας πριν φτάσει σε εσάς.",
      },
      {
        icon: "Award",
        title: "Εγγύηση 12 Μηνών",
        description:
          "Πλήρης κάλυψη ανταλλακτικών και εργασίας σε κάθε open box προϊόν.",
      },
      {
        icon: "Truck",
        title: "Δωρεάν Παράδοση & Εγκατάσταση",
        description:
          "Δωρεάν white-glove παράδοση και εγκατάσταση σε παραγγελίες άνω €200.",
      },
      {
        icon: "RefreshCw",
        title: "Επιστροφή 30 Ημερών",
        description:
          "Δεν είστε ικανοποιημένοι; Επιστρέψτε εντός 30 ημερών για πλήρη επιστροφή.",
      },
    ],
  },
  features: {
    eyebrow: "Γιατί Open Box;",
    title: "Ο Έξυπνος Τρόπος για Premium Συσκευές",
    subtitle:
      "Το Open Box σημαίνει ποιότητα σαν καινούρια σε ένα κλάσμα του κόστους.",
    items: [
      {
        icon: "Tag",
        title: "Έως 70% Έκπτωση",
        description:
          "Πραγματική εξοικονόμηση σε Samsung, LG, Bosch, Miele, Siemens — premium μάρκες.",
      },
      {
        icon: "CheckCircle2",
        title: "Πλήρης Πιστοποίηση",
        description:
          "Πιστοποιημένοι τεχνικοί ελέγχουν κάθε λειτουργία πριν την πώληση.",
      },
      {
        icon: "Zap",
        title: "Σε Απόθεμα & Έτοιμο",
        description:
          "Χωρίς αναμονή μηνών. Παράδοση εντός 24–48 ωρών σε όλη την Κύπρο.",
      },
      {
        icon: "Recycle",
        title: "Οικολογική Επιλογή",
        description:
          "Δώστε δεύτερη ζωή σε ποιοτικές συσκευές και μειώστε τα ηλεκτρονικά απόβλητα.",
      },
      {
        icon: "Star",
        title: "50+ Premium Μάρκες",
        description:
          "Samsung, LG, Bosch, Miele, Siemens, Electrolux, Philips, AEG, Gorenje και άλλες.",
      },
      {
        icon: "HeartHandshake",
        title: "Εξειδικευμένη Υποστήριξη",
        description:
          "Οι ειδικοί μας σε συσκευές σας καθοδηγούν στην καλύτερη επιλογή.",
      },
    ],
  },
  services: {
    eyebrow: "Οι Υπηρεσίες Μας",
    title: "Ό,τι Χρειάζεστε, σε Ένα Σημείο",
    subtitle:
      "Από την εύρεση έως την εγκατάσταση, παρέχουμε ολοκληρωμένη εμπειρία.",
    items: [
      {
        icon: "Search",
        title: "Εύρεση Συσκευής",
        description:
          "Πείτε μας τι θέλετε. Θα βρούμε την τέλεια πιστοποιημένη μονάδα για εσάς.",
        price: "Δωρεάν",
        badge: "Πιο Δημοφιλές",
      },
      {
        icon: "Wrench",
        title: "Επαγγελματική Εγκατάσταση",
        description:
          "Πιστοποιημένοι τεχνικοί εγκαθιστούν, ελέγχουν και αφαιρούν παλιές συσκευές.",
        price: "Από €40",
        badge: null,
      },
      {
        icon: "Settings",
        title: "Επισκευή & Συντήρηση",
        description:
          "Διατηρήστε τις συσκευές σας σε κορυφαία απόδοση με τα πλάνα συντήρησής μας.",
        price: "Από €30",
        badge: null,
      },
      {
        icon: "Package",
        title: "White-Glove Παράδοση",
        description:
          "Παράδοση, σύνδεση, ρύθμιση και αφαίρεση παλιάς συσκευής. Πλήρης εξυπηρέτηση.",
        price: "Από €25",
        badge: null,
      },
    ],
  },
  gallery: {
    eyebrow: "Η Συλλογή Μας",
    title: "Εξερευνήστε Premium Απόθεμα",
    subtitle:
      "Περιηγηθείτε σε πιστοποιημένες open box συσκευές κορυφαίων μαρκών σε εξαιρετικές τιμές.",
    viewAll: "Δείτε Όλα τα Προϊόντα",
    saveLabel: "Εξοικονόμηση",
    gradeLabel: "Κατηγορία",
    warrantyLabel: "Εγγύηση",
    originalLabel: "Αρχική",
    ctaCard: "Αποκτήστε Αυτό",
    categories: {
      all: "Όλα",
      refrigerators: "Ψυγεία",
      "washing-machines": "Πλυντήρια",
      dishwashers: "Πλυντήρια Πιάτων",
      "air-conditioners": "Κλιματιστικά",
      tvs: "Τηλεοράσεις",
      "small-appliances": "Μικρές Συσκευές",
    },
  },
  testimonials: {
    eyebrow: "Ιστορίες Πελατών",
    title: "Χιλιάδες Ευτυχισμένες Οικογένειες",
    subtitle:
      "Αληθινές αξιολογήσεις από αληθινούς πελάτες που εξοικονόμησαν χωρίς να θυσιάσουν ποιότητα.",
    items: [
      {
        name: "Μαρία Παπαδοπούλου",
        role: "Ιδιοκτήτρια Σπιτιού",
        location: "Λεμεσός",
        content:
          "Ήμουν επιφυλακτική για το open box, αλλά το ψυγείο Samsung από τον Lamidis είναι απολύτως τέλειο. Εξοικονόμησα €400 και έχω εγγύηση 12 μηνών!",
        rating: 5,
      },
      {
        name: "Νίκος Αλεξανδρής",
        role: "Κατασκευαστής Ακινήτων",
        location: "Λευκωσία",
        content:
          "Εξοπλίζω ολόκληρα διαμερίσματα με Lamidis. Σταθερά εξαιρετική ποιότητα, αναντίρρητες τιμές, άκρως επαγγελματική ομάδα.",
        rating: 5,
      },
      {
        name: "Ελένη Σταύρου",
        role: "Εσωτερική Διακοσμήτρια",
        location: "Λεμεσός",
        content:
          "Οι πελάτες μου λατρεύουν τις εξοικονομήσεις μέσω Lamidis. Το Bosch πλυντήριο και Siemens πλυντήριο πιάτων δείχνουν ολοκαίνουρια.",
        rating: 5,
      },
      {
        name: "Δημήτρης Κωστόπουλος",
        role: "Διευθυντής Ξενοδοχείου",
        location: "Πάφος",
        content:
          "Εξοπλίσαμε 12 δωμάτια και εξοικονομήσαμε πάνω από €8.000. Κάθε μονάδα ήταν άψογη για 2 χρόνια. Εξαιρετική αξία.",
        rating: 5,
      },
      {
        name: "Σοφία Γεωργιάδη",
        role: "Φοιτήτρια",
        location: "Λάρνακα",
        content:
          "Ως φοιτήτρια στο πρώτο μου διαμέρισμα, ο Lamidis έκανε τις premium συσκευές προσιτές. Το LG πλυντήριο λειτουργεί τέλεια.",
        rating: 5,
      },
    ],
  },
  stats: {
    eyebrow: "Ο Αντίκτυπός Μας",
    title: "Αριθμοί που Μιλούν",
    items: [
      { value: 12, suffix: "+", label: "Χρόνια στη Βιομηχανία" },
      { value: 5000, suffix: "+", label: "Ευτυχισμένοι Πελάτες" },
      { value: 70, suffix: "%", label: "Μέση Εξοικονόμηση" },
      { value: 50, suffix: "+", label: "Premium Μάρκες" },
    ],
  },
  faq: {
    eyebrow: "Συχνές Ερωτήσεις",
    title: "Οι Ερωτήσεις Σας, Απαντημένες",
    subtitle:
      "Ό,τι χρειάζεστε να γνωρίζετε για τις open box συσκευές και τις αγορές σας.",
    items: [
      {
        question: "Τι ακριβώς είναι μια open box συσκευή;",
        answer:
          "Μια open box συσκευή είναι ένα προϊόν που έχει επιστραφεί σε κατάστημα, έχει ανοιχτεί η συσκευασία του ή έχει χρησιμοποιηθεί ως εκθεσιακό. Βρίσκονται σε εξαιρετική κατάσταση, πλήρως ελεγμένες και πωλούνται με 30–70% έκπτωση.",
      },
      {
        question: "Έχουν εγγύηση οι open box συσκευές;",
        answer:
          "Ναι. Κάθε συσκευή από τον Michael Lamidis συνοδεύεται από εγγύηση 12 μηνών για ανταλλακτικά και εργασία. Ορισμένα προϊόντα φέρουν και εναπομένουσα εγγύηση κατασκευαστή.",
      },
      {
        question: "Πώς γνωρίζω ότι η συσκευή λειτουργεί τέλεια;",
        answer:
          "Κάθε μονάδα περνά τον έλεγχο 47 σημείων από πιστοποιημένους τεχνικούς. Ελέγχουμε όλες τις λειτουργίες, καθαρίζουμε πλήρως και βαθμολογούμε (A++, A+, A) πριν την καταχώριση.",
      },
      {
        question: "Ποιες μάρκες φέρετε;",
        answer:
          "Φέρουμε όλες τις κύριες premium μάρκες: Samsung, LG, Bosch, Miele, Siemens, Electrolux, Philips, Whirlpool, AEG, Gorenje, Beko και πολλές άλλες. Πάνω από 50 μάρκες συνολικά.",
      },
      {
        question: "Ποια είναι η πολιτική επιστροφών;",
        answer:
          "Προσφέρουμε επιστροφή 30 ημερών σε όλες τις αγορές. Αν δεν είστε ικανοποιημένοι, επικοινωνήστε μαζί μας για πλήρη επιστροφή χρημάτων.",
      },
      {
        question: "Προσφέρετε παράδοση και εγκατάσταση;",
        answer:
          "Ναι. Δωρεάν παράδοση σε παραγγελίες άνω €200. Εγκατάσταση από €40, με αφαίρεση παλιάς συσκευής και πλήρη ρύθμιση.",
      },
      {
        question: "Πόσο γρήγορα παραλαμβάνω τη συσκευή μου;",
        answer:
          "Παράδοση εντός 24–48 ωρών στη Λεμεσό και τις μεγάλες πόλεις. Για απομακρυσμένες περιοχές, 3–5 εργάσιμες ημέρες.",
      },
    ],
    cta: "Έχετε ακόμα ερωτήσεις;",
    ctaBtn: "Επικοινωνήστε Μαζί Μας",
  },
  leadCapture: {
    eyebrow: "Αποκτήστε την Καλύτερη Τιμή",
    title: "Πείτε Μας Τι Ψάχνετε",
    subtitle:
      "Μοιραστείτε τις ανάγκες σας και θα βρούμε την τέλεια πιστοποιημένη συσκευή — απάντηση εντός 2 ωρών.",
    benefits: [
      "Απάντηση εντός 2 ωρών",
      "Προσφορά χωρίς δέσμευση",
      "Εγγύηση αντιστοίχισης τιμής",
      "Εξειδικευμένες συστάσεις",
    ],
    form: {
      name: "Ονοματεπώνυμο",
      email: "Διεύθυνση Email",
      phone: "Αριθμός Τηλεφώνου",
      interest: "Τύπος Συσκευής",
      interestOptions: [
        "Ψυγείο",
        "Πλυντήριο",
        "Πλυντήριο Πιάτων",
        "Κλιματιστικό",
        "Τηλεόραση",
        "Μικρή Συσκευή",
        "Άλλο",
      ],
      message: "Ειδικές απαιτήσεις (μάρκα, μοντέλο, μέγεθος, προϋπολογισμός)...",
      submit: "Αποστολή Αιτήματος",
      success: "Το Αίτημα Εστάλη!",
      successMsg:
        "Θα επικοινωνήσουμε εντός 2 ωρών με τις καλύτερες διαθέσιμες επιλογές.",
      sending: "Αποστολή...",
    },
  },
  contact: {
    eyebrow: "Επικοινωνήστε",
    title: "Είμαστε Εδώ για Σας",
    subtitle:
      "Επισκεφτείτε το showroom μας στη Λεμεσό ή επικοινωνήστε online.",
    addressLabel: "Διεύθυνση",
    phoneLabel: "Τηλέφωνο",
    emailLabel: "Email",
    hoursLabel: "Ώρες",
    mapCta: "Οδηγίες",
    form: {
      name: "Όνομά Σας",
      email: "Διεύθυνση Email",
      subject: "Θέμα",
      message: "Πώς μπορούμε να βοηθήσουμε;",
      submit: "Αποστολή Μηνύματος",
      success: "Το Μήνυμα Εστάλη!",
      successMsg: "Θα επικοινωνήσουμε μαζί σας εντός λίγων ωρών.",
    },
  },
  footer: {
    description:
      "Ο κορυφαίος προορισμός της Κύπρου για πιστοποιημένες open box συσκευές. Ποιότητα που εμπιστεύεστε, εξοικονομήσεις που αγαπάτε.",
    companyTitle: "Εταιρεία",
    companyLinks: [
      { label: "Σχετικά με εμάς", href: "/about" },
      { label: "Υπηρεσίες μας", href: "/services" },
      { label: "Αξιολογήσεις", href: "/testimonials" },
      { label: "Blog", href: "/blog" },
    ],
    servicesTitle: "Υπηρεσίες",
    servicesLinks: [
      { label: "Open Box Συσκευές", href: "/services" },
      { label: "Εγκατάσταση", href: "/services#installation" },
      { label: "Επισκευή & Συντήρηση", href: "/services#repair" },
      { label: "Παράδοση", href: "/services#delivery" },
    ],
    supportTitle: "Υποστήριξη",
    supportLinks: [
      { label: "Συχνές Ερωτήσεις", href: "/faq" },
      { label: "Επικοινωνία", href: "/contact" },
      { label: "Πολιτική Εγγύησης", href: "/warranty" },
      { label: "Επιστροφές", href: "/returns" },
    ],
    newsletterTitle: "Αποκλειστικές Προσφορές",
    newsletterPlaceholder: "Η διεύθυνση email σας",
    newsletterCta: "Εγγραφή",
    copyright: "© 2024 Michael Lamidis. Με επιφύλαξη παντός δικαιώματος.",
    legal: [
      { label: "Πολιτική Απορρήτου", href: "/privacy" },
      { label: "Όροι Χρήσης", href: "/terms" },
    ],
  },
  pages: {
    products: {
      badge: "Πιστοποιημένο Απόθεμα",
      titleLine1: "Τα Προϊόντα Μας —",
      titleLine2: "Όλα σε Ένα Σημείο",
      subtitle:
        "Κάθε συσκευή πιστοποιημένη, βαθμολογημένη και με εγγύηση 12 μηνών. Έως 70% έκπτωση — έτοιμη για αποστολή.",
      statProductsInStock: "Προϊόντα σε απόθεμα",
      statPremiumBrands: "Premium μάρκες",
      statMaxSavings: "Μέγιστη εξοικονόμηση",
      sortBestDeals: "Καλύτερες Προσφορές",
      sortPriceAsc: "Τιμή: Χαμηλή → Υψηλή",
      sortPriceDesc: "Τιμή: Υψηλή → Χαμηλή",
      viewAll: "Δείτε Όλα τα Προϊόντα",
      gradeLabel: "Κατηγορία",
      warrantyMo: "μη Εγγύηση",
      inStock: "Σε Απόθεμα",
      viewDetails: "Λεπτομέρειες",
      showing: "Εμφάνιση",
      productSingular: "προϊόν",
      productPlural: "προϊόντα",
      inCategory: "στη κατηγορία",
      gridView: "Προβολή πλέγματος",
      emptyMessage: "Δεν υπάρχουν προϊόντα σε αυτή την κατηγορία αυτή τη στιγμή.",
      ctaTitle: "Δεν Βρίσκετε Αυτό που Ψάχνετε;",
      ctaSubtitle:
        "Το απόθεμά μας ανανεώνεται εβδομαδιαία. Επικοινωνήστε μαζί μας με τις απαιτήσεις σας και θα βρούμε την τέλεια συσκευή για εσάς.",
      ctaEnquiry: "Στείλτε Αίτημα",
      ctaAbout: "Σχετικά με το Κατάστημα",
      filters: {
        all: "Όλα τα Προϊόντα",
        refrigerators: "Ψυγεία",
        "washing-machines": "Πλυντήρια Ρούχων",
        ovens: "Φούρνοι",
        dishwashers: "Πλυντήρια Πιάτων",
        "air-conditioners": "Κλιματιστικά",
        tvs: "Smart Τηλεοράσεις",
        "small-appliances": "Μικρές Συσκευές",
      },
    },
    about: {
      badge: "Η Ιστορία Μας",
      defaultHeadline: "Επανακαθορίζοντας Πώς η Κύπρος Αγοράζει Συσκευές",
      defaultSubheadline:
        "Για περισσότερα από 12 χρόνια, ο Michael Lamidis κάνει τις premium συσκευές προσιτές σε κάθε κυπριακό νοικοκυριό.",
      defaultStory: [
        "Ο Michael Lamidis ιδρύθηκε το 2012 με μια απλή αποστολή: να κάνει τις premium συσκευές προσιτές σε κάθε κυπριακή οικογένεια. Αυτό που ξεκίνησε ως μια μικρή επιχείρηση εξελίχθηκε στον πιο αξιόπιστο προορισμό open box συσκευών στην Κύπρο.",
        "Πιστεύουμε ότι όλοι αξίζουν πρόσβαση σε ποιοτικές συσκευές χωρίς να υπερβούν τον προϋπολογισμό τους. Εξειδικευόμενοι σε πιστοποιημένα open box προϊόντα, γεφυρώνουμε το χάσμα μεταξύ πολυτέλειας και προσιτότητας.",
        "Σήμερα, εξυπηρετούμε χιλιάδες ικανοποιημένους πελάτες σε όλη την Κύπρο — από ιδιοκτήτες σπιτιών μέχρι ξενοδοχεία και επιχειρήσεις. Οι πιστοποιημένοι μας τεχνικοί διασφαλίζουν ότι κάθε προϊόν πληροί τα αυστηρά πρότυπά μας.",
      ],
      statYears: "Χρόνια",
      statCustomers: "Πελάτες",
      statBrands: "Μάρκες",
      whoWeAre: "Ποιοι Είμαστε",
      whoTitle: "Μια Οικογενειακή Επιχείρηση Βασισμένη στην Εμπιστοσύνη",
      getInTouch: "Επικοινωνήστε",
      valuesEyebrow: "Οι Αξίες Μας",
      valuesTitle: "Σε Τι Στεκόμαστε",
      values: [
        { title: "Διαφάνεια", desc: "Βαθμολογούμε ειλικρινά κάθε προϊόν και αποκαλύπτουμε τυχόν ατέλειες. Καμία έκπληξη." },
        { title: "Ποιότητα Πρώτα", desc: "Δεν συμβιβαζόμαστε ποτέ στην ποιότητα του προϊόντος, ανεξάρτητα από την τιμή." },
        { title: "Φροντίδα Πελάτη", desc: "Η ικανοποίησή σας είναι η προτεραιότητά μας, πριν και μετά την αγορά." },
        { title: "Βιωσιμότητα", desc: "Μειώνουμε με υπερηφάνεια τα ηλεκτρονικά απόβλητα — μία πιστοποιημένη συσκευή τη φορά." },
      ],
      teamEyebrow: "Η Ομάδα Μας",
      teamTitle: "Οι Άνθρωποι Πίσω από τον Lamidis",
      team: [
        { name: "Michael Lamidis", role: "Ιδρυτής & CEO" },
        { name: "Katerina Lamidis", role: "Διευθύντρια Λειτουργιών" },
        { name: "Giorgos Petrou", role: "Επικεφαλής Τεχνικός" },
        { name: "Anna Stavridis", role: "Σχέσεις Πελατών" },
      ],
      ctaTitle: "Έτοιμοι να Ξεκινήσετε να Εξοικονομείτε;",
      ctaSubtitle:
        "Περιηγηθείτε στο πιστοποιημένο open box απόθεμά μας ή λάβετε μια εξατομικευμένη προσφορά από την ομάδα μας.",
      ctaBrowse: "Δείτε Προϊόντα",
      ctaQuote: "Λάβετε Προσφορά",
    },
    services: {
      badge: "Οι Υπηρεσίες Μας",
      titleLine1: "Ό,τι Χρειάζεστε,",
      titleLine2: "σε Ένα Σημείο",
      subtitle:
        "Από την εύρεση μέχρι την εγκατάσταση, προσφέρουμε μια ολοκληρωμένη premium εμπειρία συσκευών.",
      features: [
        "Γρήγορη εξυπηρέτηση",
        "Πιστοποιημένοι επαγγελματίες",
        "Εγγύηση ικανοποίησης",
      ],
      bookCta: "Κλείστε αυτή την Υπηρεσία",
    },
    testimonials: {
      badge: "Αληθινές Ιστορίες",
      titleLine1: "Χιλιάδες Οικογένειες",
      titleLine2: "Εμπιστεύονται τον Lamidis",
      subtitle:
        "Αληθινές αξιολογήσεις από αληθινούς πελάτες που εξοικονόμησαν χωρίς να θυσιάσουν την ποιότητα.",
      ctaText: "Γίνετε μέλος χιλιάδων ικανοποιημένων πελατών σε όλη την Κύπρο.",
      ctaBtn: "Λάβετε Δωρεάν Προσφορά",
    },
    contact: {
      defaultBadge: "Επικοινωνία",
      defaultHeadline: "Είμαστε Εδώ για να σας Βοηθήσουμε να Εξοικονομήσετε",
      defaultSubheadline:
        "Επισκεφθείτε το showroom μας στη Λεμεσό ή επικοινωνήστε online. Οι ειδικοί μας απαντούν εντός 2 ωρών.",
      showroomLabel: "Showroom Λεμεσού",
      sendAnother: "Στείλτε Άλλο",
      sending: "Αποστολή...",
    },
    faq: {
      badge: "Συχνές Ερωτήσεις",
      titleLine1: "Οι Ερωτήσεις Σας,",
      titleLine2: "Απαντημένες",
    },
  },
};

export const translations = { en, gr };
export type T = typeof en;
