import type { GlassName } from "../components/GlassIcon";

export type Service = {
  slug: string;
  icon: GlassName;
  short: string;
  title: string;
  tagline: string;
  summary: string;
  body: string;
  outcomes: string[];
  stack: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "websites",
    icon: "web",
    short: "Websites",
    title: "Website Development",
    tagline: "Fast, well-built websites for your business.",
    summary: "Business websites, portfolios and product sites that load quickly and are easy to update.",
    body:
      "We design and build websites for many kinds of businesses, from a simple portfolio to a full product website. Each site is built to load quickly, work well on phones, and be easy for your team to update. We also set up analytics so you can see how visitors use the site.",
    outcomes: ["Business & company websites", "Portfolios", "Product showcase sites", "Content management setup"],
    stack: ["React", "Next.js", "Astro", "Sanity", "Webflow"],
  },
  {
    slug: "ai-agents",
    icon: "ai",
    short: "AI & Automation",
    title: "AI Solutions & Automated Pipelines",
    tagline: "AI that handles routine work, with people in control.",
    summary: "AI agents that monitor your business data, run scheduled tasks and automate workflows.",
    body:
      "We build custom AI agents that keep an eye on your business data, run tasks on a schedule, and move work between your systems. When a decision needs a person, such as approving a payment, the agent stops and asks. Every action is logged, so you can always see what happened and why.",
    outcomes: ["Agents that monitor your data", "Scheduled and triggered tasks", "Human approval steps", "Document and email processing"],
    stack: ["Claude", "OpenAI", "LangGraph", "Temporal", "Postgres"],
  },
  {
    slug: "seo",
    icon: "seo",
    short: "SEO",
    title: "Search Engine Optimization",
    tagline: "Help the right customers find you on Google.",
    summary: "Technical fixes, page improvements and content planning to improve your search visibility.",
    body:
      "We review your website for technical problems that affect search rankings, fix them, and help you plan content around what your customers are searching for. You get clear monthly reports that show how your search traffic is changing.",
    outcomes: ["Technical SEO audit and fixes", "Page and content improvements", "Structured data", "Monthly reporting"],
    stack: ["Search Console", "GA4", "Ahrefs", "Screaming Frog"],
  },
  {
    slug: "google-ads",
    icon: "ads",
    short: "Google Ads",
    title: "Google Ads & Advertising",
    tagline: "Advertising that reaches the people you want to reach.",
    summary: "Search, Performance Max and YouTube campaigns, set up and managed with clear reporting.",
    body:
      "We set up and manage Google Ads campaigns to promote your products and services to the right audience. We track conversions properly, adjust campaigns regularly, and report on what your ad spend is producing.",
    outcomes: ["Search and Performance Max", "YouTube and display ads", "Conversion tracking", "Landing page testing"],
    stack: ["Google Ads", "GTM", "GA4", "Looker Studio"],
  },
  {
    slug: "creative",
    icon: "marketing",
    short: "Marketing Content",
    title: "Digital Marketing & Creative Assets",
    tagline: "Short videos and graphics for your marketing channels.",
    summary: "Instagram Reels, YouTube Shorts and other marketing content that fits your brand.",
    body:
      "We create marketing content for Instagram Reels, YouTube Shorts, LinkedIn and other channels, including short videos, motion graphics and ad designs. Everything follows your brand so your content looks consistent across platforms.",
    outcomes: ["Reels and Shorts", "Motion graphics", "Ad designs", "Content templates"],
    stack: ["After Effects", "Figma", "Premiere", "Blender"],
  },
  {
    slug: "mobile",
    icon: "mobile",
    short: "Mobile Apps",
    title: "Custom Mobile Applications",
    tagline: "iOS and Android apps for customers or your team.",
    summary: "Full mobile apps for your customers, your employees or your internal operations.",
    body:
      "We build complete mobile apps for iOS and Android. An app might be for your customers, for staff working in the field, or for internal operations. We handle design, development, testing and publishing to the App Store and Google Play, and we support the app after launch.",
    outcomes: ["Customer apps", "Employee and field apps", "Internal tools", "App store publishing"],
    stack: ["Swift", "Kotlin", "React Native", "Expo", "Firebase"],
  },
  {
    slug: "crm",
    icon: "crm",
    short: "Custom CRM",
    title: "Custom CRM Solutions",
    tagline: "A CRM built around how your business works.",
    summary: "A CRM made for your teams and workflows, with only the features you need.",
    body:
      "Many off-the-shelf CRMs have features you never use and are missing the ones you need. We build a CRM around your actual workflows, so sales, operations and support can work together in one place. We leave out what you don't need, and can add AI to help with tasks like call summaries and follow-ups.",
    outcomes: ["Customer and deal tracking", "Shared workflows across teams", "Role-based access", "AI summaries and follow-ups"],
    stack: ["TypeScript", "Postgres", "Supabase", "tRPC", "Claude"],
  },
  {
    slug: "voice-chat",
    icon: "voice",
    short: "Voice & Chatbots",
    title: "Voice Bots & Chatbots",
    tagline: "Chat and voice assistants that can complete tasks.",
    summary: "Website chatbots and voice agents that can look up and update your business data during a conversation.",
    body:
      "We build chatbots for your website and voice agents that can handle phone calls in real time. They can do more than answer questions. For example, they can book an appointment, check an order or update a customer record during the conversation, and pass the call to a person when needed.",
    outcomes: ["Website chatbots", "Inbound and outbound voice agents", "Actions on your business data", "Hand-off to staff"],
    stack: ["Realtime APIs", "Twilio", "Vapi", "Claude", "Webhooks"],
  },
];
