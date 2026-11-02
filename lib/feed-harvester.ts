import { AnomalyItem } from "./seed-anomalies";

interface FeedConfig {
  name: string;
  url: string;
  category: "contrarian_essay";
}

// Feeds strictly filtered for crazy science, bizarre phenomena, and deep paradoxes (NO self-help or lifestyle)
const FEEDS: FeedConfig[] = [
  { name: "Quanta Magazine", url: "https://api.quantamagazine.org/feed/", category: "contrarian_essay" },
  { name: "Nautilus", url: "https://nautil.us/feed/", category: "contrarian_essay" },
  { name: "Aeon", url: "https://aeon.co/feed.rss", category: "contrarian_essay" },
  { name: "LessWrong Curated", url: "https://www.lesswrong.com/feed.xml?view=curated-rss", category: "contrarian_essay" },
  { name: "Astral Codex Ten", url: "https://astralcodexten.substack.com/feed", category: "contrarian_essay" },
];

const BANNED_SELF_HELP_KEYWORDS = [
  "self-help",
  "wellness",
  "fandom",
  "dating",
  "relationship",
  "dating advice",
  "parenting",
  "lifestyle",
  "tips",
  "hacks",
  "diet",
  "workout",
  "mindfulness",
  "happiness",
  "feel better",
  "self-care",
  "advice",
  "morning routine",
];

function isSelfHelp(title: string, desc: string): boolean {
  const combined = `${title} ${desc}`.toLowerCase();
  return BANNED_SELF_HELP_KEYWORDS.some((kw) => combined.includes(kw));
}

function cleanHtml(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(xml: string, tag: string): string {
  const cdataRegex = new RegExp(`<(?:[a-zA-Z0-9]+:)?${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/(?:[a-zA-Z0-9]+:)?${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const normalRegex = new RegExp(`<(?:[a-zA-Z0-9]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9]+:)?${tag}>`, "i");
  const match = xml.match(normalRegex);
  if (match) return match[1].trim();

  if (tag === "link") {
    const hrefMatch = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
    if (hrefMatch) return hrefMatch[1].trim();
  }

  return "";
}

function extractThemes(text: string): string[] {
  const t = text.toLowerCase();
  const themeMap: Record<string, string[]> = {
    quantum: ["quantum", "physics", "universe", "particles", "reality", "cosmology"],
    neuro: ["brain", "consciousness", "thought", "memory", "perception", "neuroscience", "mind"],
    biology: ["evolution", "species", "animal", "mutation", "dna", "organism", "cellular"],
    anxiety: ["anxiety", "fear", "panic", "worry", "stress"],
    paralysis: ["choice", "career", "options", "paralyzed", "decision", "stuck"],
    paradox: ["paradox", "decay", "entropy", "illusion", "anomaly", "time"],
    imposter: ["imposter", "fraud", "doubt", "confidence", "talker", "doer"],
  };

  const matched: string[] = [];
  for (const [theme, words] of Object.entries(themeMap)) {
    if (words.some((w) => t.includes(w))) {
      matched.push(theme);
    }
  }
  return matched.length > 0 ? matched : ["science_anomaly"];
}

export async function harvestPublicationArticles(limitPerFeed: number = 4): Promise<AnomalyItem[]> {
  const allArticles: AnomalyItem[] = [];

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (CrazyJournal/1.0)",
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;

      const xmlText = await res.text();
      const items = xmlText.split(/<item[\s>]/i).slice(1);
      const entries = items.length > 0 ? items : xmlText.split(/<entry[\s>]/i).slice(1);

      for (const rawItem of entries) {
        if (allArticles.filter((a) => a.outlet === feed.name).length >= limitPerFeed) {
          break;
        }

        const title = cleanHtml(extractTag(rawItem, "title"));
        const link = extractTag(rawItem, "link");
        const rawDesc = extractTag(rawItem, "description") || extractTag(rawItem, "summary") || extractTag(rawItem, "content");
        const cleanDesc = cleanHtml(rawDesc);

        // Strict filter: Discard any soft lifestyle / self-help articles
        if (isSelfHelp(title, cleanDesc)) {
          continue;
        }

        if (title && cleanDesc.length > 30) {
          allArticles.push({
            id: `${feed.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.abs(hashString(title)) % 100000}`,
            title,
            outlet: feed.name,
            category: "contrarian_essay",
            summary: cleanDesc.length > 350 ? cleanDesc.slice(0, 350) + "..." : cleanDesc,
            weird_factor: `Scientific anomaly & counter-take from ${feed.name}`,
            parallel_themes: extractThemes(title + " " + cleanDesc),
            counter_intuitive_lesson: `In '${title}', ${feed.name} dismantles standard intuitions, presenting a startling empirical or philosophical reality.`,
            source: link,
          });
        }
      }
    } catch {
      // Continue on timeout/error
    }
  }

  return allArticles;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
