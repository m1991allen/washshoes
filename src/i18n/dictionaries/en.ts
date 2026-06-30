import type { Dictionary } from "./zh";

const en: Dictionary = {
  meta: {
    locale: "en",
  },
  nav: {
    home: "Home",
    services: "Services",
    cases: "Case Studies",
    about: "About",
    faq: "FAQ",
    contact: "Contact",
    book: "Book Now",
  },
  common: {
    bookNow: "Book Now",
    viewCases: "View Cases",
    learnMore: "Learn More",
    contactUs: "Contact Us",
    viewAll: "View All",
    lineConsult: "LINE Chat",
    readMore: "Read More",
    backToTop: "Back to top",
    toggleTheme: "Toggle dark / light mode",
  },
  brand: {
    name: "RENU",
    fullName: "RENU Premium Shoe & Bag Care",
    tagline: "Bringing Your Treasures Back to Life",
  },
  hero: {
    eyebrow: "Premium Shoe & Bag Care · Crafted by Artisans",
    titleLine1: "Every Treasure,",
    titleLine2: "Renewed.",
    subtitle:
      "From sneakers to luxury bags — deep cleaning, recolouring and structural repair, handled by a team of specialists who restore them to the way you first fell for them.",
    ctaPrimary: "Book Now",
    ctaSecondary: "View Cases",
    stats: [
      { value: "8", suffix: "yr+", label: "Of Craft" },
      { value: "20,000", suffix: "+", label: "Items Restored" },
      { value: "99", suffix: "%", label: "Satisfaction" },
    ],
  },
  intro: {
    eyebrow: "About RENU",
    title: "We don't just restore objects —\nwe restore the memories within them.",
    paragraphs: [
      "RENU stands for Renew. For eight years we have trained under traditional leather artisans, studying the care of every material with the rigour of a laboratory.",
      "From the sneakers that walked you through countless moments to the heirloom bag passed down by your mother, we believe every piece carries an irreplaceable story worth treating with care.",
    ],
    points: [
      "Material-specific methods",
      "11-person specialist team",
      "Strict pre-delivery QC",
      "Transparent communication",
    ],
    cta: "Read Our Story",
  },
  servicesPreview: {
    eyebrow: "Our Services",
    title: "From Cleaning to Rebirth, All in One Place",
    subtitle:
      "Tailored to each item's material and condition — a complete care solution for shoes and bags.",
  },
  services: [
    {
      id: "shoe-cleaning",
      name: "Shoe Cleaning",
      short: "Deep Clean · De-yellowing",
      desc: "Deep cleaning, de-yellowing, stain removal and material care — with dedicated methods for leather, suede, canvas and knit.",
      items: ["Deep Cleaning", "De-yellowing", "Stain Removal", "Material Care", "Water Repellent"],
    },
    {
      id: "bag-cleaning",
      name: "Bag Cleaning",
      short: "Material-tailored · Gentle",
      desc: "Cleaning and care tailored to material and soiling, treating every detail of a luxury bag gently to preserve its natural lustre.",
      items: [
        "Leather Cleaning",
        "Stain & Mould",
        "Conditioning",
        "Edge Care",
        "Protective Coating",
      ],
    },
    {
      id: "shoe-repair",
      name: "Shoe Repair",
      short: "Resoling · Reinforcement",
      desc: "Sole patching and replacement, heel maintenance and stitch reinforcement — extending the life of your shoes and restoring support and comfort.",
      items: ["Resoling", "Heel Care", "Stitch Reinforcement", "Midsole Repair"],
    },
    {
      id: "bag-repair",
      name: "Bag Repair",
      short: "Handle & Lining Rebuild",
      desc: "Handle restoration, leather replacement, structural reinforcement, interior rebuild and edge finishing — bringing well-worn bags back to their best.",
      items: [
        "Handle Repair",
        "Leather Replacement",
        "Reinforcement",
        "Lining Rebuild",
        "Edge Finishing",
      ],
    },
    {
      id: "recolor",
      name: "Recolour & Renewal",
      short: "Fade Recovery · Recolouring",
      desc: "Fade treatment, custom recolouring and full renewal — re-dyeing leather for a brand-new look or a faithful restoration of its original colour.",
      items: ["Fade Recovery", "Custom Recolour", "Re-dyeing", "Full Renewal"],
    },
    {
      id: "hardware",
      name: "Hardware Care",
      short: "De-oxidation · Renewal",
      desc: "Hardware de-oxidation and renewal — treating oxidised and worn zips, buckles and chains to restore a bright, clean finish.",
      items: ["De-oxidation", "Part Renewal", "Zip Repair", "Re-plating"],
    },
  ],
  process: {
    eyebrow: "Our Process",
    title: "Five Transparent, Rigorous Steps",
    subtitle:
      "Every piece goes through a standardised process and layered quality control — so you can entrust it with confidence.",
    steps: [
      {
        no: "01",
        title: "Book & Receive",
        desc: "Book via LINE or our form; drop off in store or send by courier.",
      },
      {
        no: "02",
        title: "Inspection",
        desc: "Our artisans assess material and condition, then quote transparently.",
      },
      {
        no: "03",
        title: "Clean & Restore",
        desc: "Cleaning, repair and care using methods specific to the material.",
      },
      {
        no: "04",
        title: "Quality Control",
        desc: "A senior QC reviews every detail before the piece is approved.",
      },
      {
        no: "05",
        title: "Delivery",
        desc: "We record the result and return your piece in store or by courier.",
      },
    ],
  },
  casesPreview: {
    eyebrow: "Case Studies",
    title: "A Difference You Can See",
    subtitle: "Real before-and-after results — every renewal is proof of our craft.",
    cta: "View More Cases",
    before: "Before",
    after: "After",
  },
  features: {
    eyebrow: "Why RENU",
    title: "Expertise, Down to Every Visible Detail",
    items: [
      {
        title: "Material-specific Methods",
        desc: "Leather, suede, canvas and knit each have a dedicated process — never a one-size-fits-all approach.",
      },
      {
        title: "Artisan Oversight",
        desc: "An 11-person specialist team — every piece handled and checked by experienced artisans.",
      },
      {
        title: "Transparent Quotes",
        desc: "Clear pricing and an explanation after inspection, with a fully traceable process.",
      },
      {
        title: "Recorded & Guaranteed",
        desc: "Before-and-after records on completion, with a reasonable service guarantee.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "They Trusted Us with Their Treasures",
    items: [
      {
        quote:
          "My white sneakers had yellowed so badly I'd nearly given up — they came back like new, right down to the stitching on the soles.",
        name: "Ms. Chen",
        meta: "Sneaker Deep Clean",
      },
      {
        quote:
          "My mother's luxury bag was scuffed at every corner. After the recolour and renewal the quality is completely back. So worth it.",
        name: "Mr. Lin",
        meta: "Bag Recolour & Renewal",
      },
      {
        quote:
          "Every step from booking to delivery was clear — transparent pricing, careful communication. A shop I'll return to.",
        name: "Vicky",
        meta: "Bag Repair · Hardware Care",
      },
    ],
  },
  cta: {
    title: "Ready to See Your Treasures Renewed?",
    subtitle:
      "Reach out via LINE or our booking form — our artisan team will assess your piece personally.",
    primary: "Book Now",
    secondary: "Chat on LINE",
  },
  footer: {
    tagline: "Premium shoe & bag care · Bringing treasures back to life",
    nav: "Sitemap",
    services: "Services",
    contact: "Contact",
    follow: "Follow Us",
    hours: "Opening Hours",
    hoursValue: "Daily 11:30 – 20:30",
    address: "No. 48, Yiyong St., Bade Dist., Taoyuan City",
    rights: "All rights reserved",
    builtWith: "This is a demo brand website",
  },
  pages: {
    services: {
      eyebrow: "Our Services",
      title: "Complete Shoe & Bag Care",
      subtitle:
        "From everyday cleaning to deep repair and recolouring — the right plan tailored to your piece.",
      includedTitle: "What's Included",
      ctaTitle: "Not sure which service you need?",
      ctaText:
        "Send us a photo of your piece and our artisan team will assess it and provide a transparent quote.",
    },
    cases: {
      eyebrow: "Case Studies",
      title: "Real Before & After",
      subtitle:
        "Every piece is the result of material reading and artisan craft — see the detail of each renewal.",
      filterAll: "All",
      before: "Before",
      after: "After",
      items: [
        {
          id: "c1",
          category: "shoe-cleaning",
          title: "White Sneaker De-yellowing",
          desc: "Heavy yellowing and soiling, restored to white after deep cleaning.",
        },
        {
          id: "c2",
          category: "bag-cleaning",
          title: "Luxury Bag Leather Care",
          desc: "Surface soiling and fine lines treated; lustre restored after conditioning.",
        },
        {
          id: "c3",
          category: "recolor",
          title: "Leather Shoe Recolour",
          desc: "Severe fading and wear, re-dyed and renewed to look brand new.",
        },
        {
          id: "c4",
          category: "bag-repair",
          title: "Handle Restoration",
          desc: "Peeling handle leather replaced and structurally reinforced.",
        },
        {
          id: "c5",
          category: "shoe-repair",
          title: "Sneaker Midsole Repair",
          desc: "Sole separation and wear patched and re-secured.",
        },
        {
          id: "c6",
          category: "hardware",
          title: "Bag Hardware De-oxidation",
          desc: "Oxidised, dull hardware polished and renewed to a bright finish.",
        },
      ],
    },
    about: {
      eyebrow: "About Us",
      title: "Treating Every Treasure with Laboratory Rigour",
      lead: "RENU stands for Renew. We believe a piece that is cared for can travel with you longer, and further.",
      story: [
        "Eight years ago our founder trained under traditional leather artisans — starting with a single brush and a piece of hide, studying the temperament behind every material. We found that too much care on the market treats every material the same way, when true premium care should be tailored to each individual piece.",
        "So RENU was born. Like a laboratory, we build methods, record data and verify repeatedly, with an 11-person specialist team offering complete, transparent service from cleaning and repair to recolouring and hardware care.",
        "What we restore has never been only shoes and bags — it's the irreplaceable memory between you and them.",
      ],
      valuesTitle: "What We Stand For",
      values: [
        {
          title: "Tailored to Material",
          desc: "Methods planned to each material — never a single approach for all.",
        },
        {
          title: "Artisan Oversight",
          desc: "Every piece handled by experienced artisans with layered QC.",
        },
        {
          title: "Transparent Communication",
          desc: "Inspection, quoting and process — all clear and traceable.",
        },
        {
          title: "Honouring Your Trust",
          desc: "We treat every treasure as if it were our own collection.",
        },
      ],
      statsTitle: "The Numbers Behind It",
      stats: [
        { value: "8", suffix: "yr+", label: "Of Craft" },
        { value: "11", suffix: "", label: "Specialists" },
        { value: "20,000", suffix: "+", label: "Items Restored" },
        { value: "99", suffix: "%", label: "Satisfaction" },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "What You Might Want to Know",
      subtitle: "If the answers below don't cover your question, reach out to us directly on LINE.",
      items: [
        {
          q: "How long does the service take?",
          a: "General cleaning takes around 5–7 working days; repair and recolouring around 2–4 weeks depending on condition. The exact timeline is confirmed with your quote.",
        },
        {
          q: "How do drop-off and delivery work?",
          a: "Drop off and collect in store, or use courier service — available across Taiwan. The logistics are confirmed when you book.",
        },
        {
          q: "How is pricing determined?",
          a: "We provide a clear quote after inspection, and only begin work once you confirm. There are never undisclosed extra charges.",
        },
        {
          q: "Can yellowing or heavy soiling always be removed?",
          a: "Most cases improve significantly, but results vary by material, type of soiling and how long it has set. We tell you honestly what's achievable at inspection.",
        },
        {
          q: "Will recolouring damage the leather?",
          a: "We use professional leather dyes and techniques to re-dye and recolour without harming the hide, with strict QC before delivery.",
        },
        {
          q: "Do you offer a guarantee?",
          a: "We provide before-and-after records on completion and a reasonable service guarantee on the work performed; details are explained per item at delivery.",
        },
      ],
    },
    contact: {
      eyebrow: "Contact Us",
      title: "Entrust Your Treasures to Us",
      subtitle:
        "Book or enquire through any of the methods below — we'll get back to you as soon as we can.",
      infoTitle: "Contact Information",
      address: "Address",
      addressValue: "No. 48, Yiyong St., Bade Dist., Taoyuan City",
      hours: "Opening Hours",
      hoursValue: "Daily 11:30 – 20:30 (open year-round)",
      phone: "Phone",
      phoneValue: "+886 3-000-0000",
      lineTitle: "LINE Online Chat",
      lineText: "Add our official LINE and send a photo of your piece for a quick estimate.",
      formTitle: "Booking / Enquiry Form",
      form: {
        name: "Your Name",
        namePlaceholder: "Enter your name",
        phone: "Phone",
        phonePlaceholder: "Enter your phone",
        email: "Email",
        emailPlaceholder: "Enter your email",
        service: "Service",
        servicePlaceholder: "Select a service",
        message: "Your Request",
        messagePlaceholder: "Briefly describe the condition and what you need…",
        submit: "Submit",
        success: "We've received your request and will be in touch soon!",
        note: "By submitting you agree to be contacted via the details above.",
      },
    },
  },
};

export default en;
