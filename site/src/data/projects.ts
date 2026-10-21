/**
 * PLACEHOLDER PROJECTS: illustrative concepts only, not verified client work.
 * Replace names, copy, metrics, imagery and video IDs with real case studies.
 * Metrics are example figures and are labelled as such in the UI.
 */
export type Project = {
  slug: string;
  name: string;
  client: string;
  year: string;
  sector: string;
  services: string[];
  headline: string;
  summary: string;
  challenge: string;
  approach: string;
  metrics: { value: string; label: string }[];
  /** cover art palette: [from, via, to] */
  palette: [string, string, string];
  /** which mock UI to render on the cover */
  kind: "agent" | "mobile" | "crm" | "voice" | "web" | "creative";
  youtubeId?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "ledgerline",
    name: "Ledgerline",
    client: "Logistics software company",
    year: "2026",
    sector: "Finance operations",
    services: ["AI Agents", "Custom CRM"],
    headline: "An AI agent that checks invoices against shipments every night.",
    summary: "An agent that reviews incoming invoices, flags anything unusual and sends it to the right person for approval.",
    challenge:
      "The finance team spent the first week of each month matching invoices to shipments by hand. Mistakes were often found only after payment.",
    approach:
      "We built an agent that runs every night. It reads new invoices, compares them with shipment records, approves clear matches and sends exceptions to a reviewer with all the details they need.",
    metrics: [
      { value: "80%", label: "invoices matched automatically" },
      { value: "5 days", label: "of manual work saved each month" },
      { value: "100%", label: "of actions logged" },
    ],
    palette: ["#063b37", "#10a396", "#a8f0e4"],
    kind: "agent",
  },
  {
    slug: "fieldkit",
    name: "Fieldkit",
    client: "HVAC service company",
    year: "2026",
    sector: "Field services",
    services: ["Mobile App", "AI Agents"],
    headline: "One app for technicians to manage their jobs.",
    summary: "An iOS and Android app for field technicians: schedules, parts, photos and customer sign-off, even without signal.",
    challenge: "Technicians used paper job sheets, several apps and phone calls to the office just to close a job.",
    approach:
      "We built one mobile app that works offline and syncs when back online. It covers job details, photos, parts lookup and customer signatures, and it can draft the job report from a voice note.",
    metrics: [
      { value: "35%", label: "less time on paperwork" },
      { value: "1", label: "app instead of 3" },
      { value: "Offline", label: "works without signal" },
    ],
    palette: ["#1b1f4b", "#7c8cff", "#e2e5ff"],
    kind: "mobile",
  },
  {
    slug: "atlas",
    name: "Atlas CRM",
    client: "Industrial parts distributor",
    year: "2025",
    sector: "Manufacturing",
    services: ["Custom CRM", "AI Agents"],
    headline: "A simpler CRM built around three teams.",
    summary: "A custom CRM that gives sales, inside sales and support one shared view of each customer.",
    challenge: "The company paid for a large CRM but only used a few features. Most of the real work happened in spreadsheets.",
    approach:
      "We studied how each team actually worked and built a focused CRM with shared customer timelines, quote tracking and AI call summaries.",
    metrics: [
      { value: "3 → 1", label: "tools replaced" },
      { value: "2×", label: "faster quotes" },
      { value: "90%", label: "of staff using it weekly" },
    ],
    palette: ["#3a1d0f", "#ff8e5e", "#ffe3d6"],
    kind: "crm",
  },
  {
    slug: "halo",
    name: "Halo Voice",
    client: "Dental clinic group",
    year: "2026",
    sector: "Healthcare",
    services: ["Voice Agents", "Websites"],
    headline: "A voice agent that books appointments by phone.",
    summary: "A voice agent that answers calls and can book, move and confirm appointments in the clinic's system.",
    challenge: "During busy hours many calls went unanswered, and reception staff were split between the phone and patients at the desk.",
    approach:
      "We connected a voice agent to the clinic's scheduling system. It checks availability, books or changes appointments during the call, and transfers to staff when needed.",
    metrics: [
      { value: "24/7", label: "calls answered" },
      { value: "< 1s", label: "typical response time" },
      { value: "60%", label: "of calls handled without staff" },
    ],
    palette: ["#03211f", "#2ec4b2", "#7c8cff"],
    kind: "voice",
  },
  {
    slug: "orbitly",
    name: "Orbitly",
    client: "Analytics software startup",
    year: "2025",
    sector: "B2B SaaS",
    services: ["Websites", "SEO", "Google Ads"],
    headline: "A new website, SEO and ads for a software launch.",
    summary: "A new marketing website, an SEO foundation and Google Ads campaigns for an analytics product.",
    challenge: "The company had a template website, very little search traffic, and ads that showed for unrelated searches.",
    approach:
      "We built a fast website with an interactive product tour, reorganised the content for search, and rebuilt the ad campaigns around specific search intent.",
    metrics: [
      { value: "3×", label: "more demo requests" },
      { value: "2×", label: "organic traffic" },
      { value: "40%", label: "lower cost per lead" },
    ],
    palette: ["#0a1416", "#0a6e67", "#6fe3d2"],
    kind: "web",
  },
  {
    slug: "pulse",
    name: "Pulse Season",
    client: "Fitness equipment brand",
    year: "2026",
    sector: "Consumer products",
    services: ["Marketing Content", "Google Ads"],
    headline: "Forty short videos with one consistent style.",
    summary: "A set of Reels and Shorts for one season, plus matching YouTube ads.",
    challenge: "Social content was posted irregularly and did not look consistent from one post to the next.",
    approach:
      "We created a simple video style (fonts, colours, pacing) that made it quick to produce forty consistent videos. The best performers were reused as YouTube ads.",
    metrics: [
      { value: "40", label: "videos delivered" },
      { value: "5%", label: "average engagement" },
      { value: "2.5×", label: "return on YouTube ad spend" },
    ],
    palette: ["#2a0f2e", "#ff8e5e", "#7c8cff"],
    kind: "creative",
  },
];
