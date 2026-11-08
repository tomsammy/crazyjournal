import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { SEED_ANOMALIES, AnomalyItem } from "./seed-anomalies";

export interface JournalSection {
  id: string;
  title: string;
  romanNumeral?: string;
  content: string;
  associatedAnomaly?: AnomalyItem;
}

export interface JournalMeta {
  slug: string;
  title: string;
  subtitle: string;
  aliases: string[];
  tags: string[];
  created: string;
  status: string;
  readingTime: string;
  wordCount: number;
  quote: string;
  excerpt: string;
  promotionalExcerpt?: string;
  thumbnail?: string;
}

export interface JournalFull extends JournalMeta {
  rawContent: string;
  htmlContent: string;
  sections: JournalSection[];
  linkedAnomalies: AnomalyItem[];
}

const JOURNALS_DIR = path.join(process.cwd(), "content", "journals");

function extractRomanNumeral(title: string): string | undefined {
  const match = title.match(/^(?:Section\s+)?([IVXLCDM]+)[\.\:\s]/i);
  return match ? match[1].toUpperCase() : undefined;
}


function getDefaultThumbnailForSlug(slug: string): string {
  const map: Record<string, string> = {
    "uncertainty": "/images/journals/shattered-certainty.png",
    "god-did-not-give-you-a-brain-to-stop-using-it": "/images/journals/break-free.png",
    "you-can-have-power-and-still-be-weak": "/images/journals/power-and-weakness.jpg",
    "the-pigeon-is-still-shitting-it-just-has-a-better-linkedin-profile": "/images/journals/pigeon-linkedin.jpg",
    "the-absalom-pattern-they-want-your-seat": "/images/journals/absalom-pattern.jpg",
    "israel-voted-nobody-won-now-everybody-wants-to-define-democracy": "/images/journals/shattered-certainty.png",
    "you-dont-want-freedom-you-want-permission-to-be-yourself": "/images/journals/courage-to-be-disliked.jpg",
    "trading-is-gambling-charts-make-it-look-intelligent": "/images/journals/overthink.png",
    "what-kind-of-fool-declares-war-on-the-water-he-drinks": "/images/journals/my-thoughts-my-words.png",
    "binary-options-casino-or-trading": "/images/journals/shattered-certainty.png",
  };
  return map[slug] || "/images/journals/overthink.png";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getAllJournals(): JournalMeta[] {
  if (!fs.existsSync(JOURNALS_DIR)) {
    return [];
  }

  const fileNames = fs.readdirSync(JOURNALS_DIR).filter((f) => f.endsWith(".md"));

  const journals = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(JOURNALS_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const wordCount = content.trim().split(/\s+/).length;
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
    const readingTime = `${readingMinutes} min read`;

    // Extract leading blockquote if present
    const quoteMatch = content.match(/^>\s*([\s\S]*?)(?:\n\n|\n##|$)/);
    const quote = quoteMatch ? quoteMatch[1].replace(/\n>\s*/g, " ").trim() : "";

    // Extract first prose paragraph as excerpt
    const proseParagraphs = content
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith("#") && !p.startsWith(">") && !p.startsWith("*"));
    const promotionalExcerpt = data.promotional_excerpt || data.promotionalExcerpt || "";
    const excerpt = data.excerpt || proseParagraphs[0] || quote || "";

    const title = data.title || slug.replace(/-/g, " ");
    const subtitle = data.subtitle || data.description || (data.aliases && data.aliases[0]) || "";
    const created = data.created ? String(data.created) : (data.date ? String(data.date) : new Date().toISOString().split("T")[0]);
    const aliases = data.aliases || (data.description ? [data.description] : []);

    return {
      slug,
      title,
      subtitle,
      aliases,
      tags: data.tags || [],
      created,
      status: data.status || "published",
      readingTime,
      wordCount,
      quote,
      excerpt,
      promotionalExcerpt,
    };
  });

  // Sort by date descending
  return journals.sort((a, b) => (a.created < b.created ? 1 : -1));
}

export function getJournalBySlug(slug: string): JournalFull | null {
  const fullPath = path.join(JOURNALS_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const wordCount = content.trim().split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const readingTime = `${readingMinutes} min read`;

  const quoteMatch = content.match(/^>\s*([\s\S]*?)(?:\n\n|\n##|$)/);
  const quote = quoteMatch ? quoteMatch[1].replace(/\n>\s*/g, " ").trim() : "";

  // Parse Sections divided by ## headings
  const sectionRegex = /##\s+([^\n]+)\n([\s\S]*?)(?=(?:##\s+[^\n]+|$))/g;
  const sections: JournalSection[] = [];
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(content)) !== null) {
    const rawTitle = match[1].trim();
    const sectionBody = match[2].trim();
    const roman = extractRomanNumeral(rawTitle);
    const id = slugify(rawTitle);

    sections.push({
      id,
      title: rawTitle,
      romanNumeral: roman,
      content: sectionBody,
    });
  }

  // Find linked anomalies that complement the essay themes
  const tags: string[] = (data.tags || []).map((t: string) => t.toLowerCase());
  const linkedAnomalies = SEED_ANOMALIES.filter((anomaly) => {
    return anomaly.parallel_themes.some((theme) =>
      tags.includes(theme) ||
      content.toLowerCase().includes(theme.replace(/_/g, " "))
    );
  }).slice(0, 4);

  // Pair top sections with an anomaly mirror
  if (sections.length > 0 && linkedAnomalies.length > 0) {
    const anomalyMapBySlug: Record<string, Record<string, string>> = {
      "uncertainty": {
        "I": "braess-paradox",
        "II": "quantum-zeno-effect",
        "V": "buridans-ass",
        "VI": "boltzmann-brain",
        "VIII": "mpemba-effect",
        "X": "great-emu-war",
      },
      "god-did-not-give-you-a-brain-to-stop-using-it": {
        "II": "dancing-plague-1518",
        "III": "alien-hand-syndrome",
        "V": "great-emu-war",
        "VII": "physarum-polycephalum-subway",
        "VIII": "halifax-slasher",
        "X": "buridans-ass",
        "XIV": "boltzmann-brain",
      },
      "binary-options-casino-or-trading": {
        "I": "boltzmann-brain",
        "II": "braess-paradox",
        "III": "buridans-ass",
        "IV": "time-crystals",
        "V": "turritopsis-dohrnii-immortal-jellyfish",
        "VI": "halifax-slasher",
        "VII": "mpemba-effect",
        "VIII": "alien-hand-syndrome",
      },
      "you-can-have-power-and-still-be-weak": {
        "I": "braess-paradox",
        "II": "great-emu-war-1932",
        "III": "alien-hand-syndrome",
        "IV": "blindsight-paradox",
        "V": "quantum-zeno-effect",
        "VI": "boston-molasses-flood-1919",
        "VII": "mpemba-effect",
        "VIII": "boltzmann-brain",
      },
      "trading-is-gambling-charts-make-it-look-intelligent": {
        "I": "quantum-zeno-effect",
        "II": "alien-hand-syndrome",
        "III": "halifax-slasher-1938",
        "IV": "great-emu-war-1932",
        "V": "braess-paradox",
        "VI": "boston-molasses-flood-1919",
        "VII": "mpemba-effect",
        "IX": "physarum-polycephalum-subway",
        "X": "buridans-ass",
        "XI": "boltzmann-brain",
      },
      "what-kind-of-fool-declares-war-on-the-water-he-drinks": {
        "I": "tanganyika-laughter-1962",
        "II": "alien-hand-syndrome",
        "III": "boston-molasses-flood-1919",
        "IV": "turritopsis-dohrnii-immortal-jellyfish",
        "V": "mpemba-effect",
        "VI": "braess-paradox",
        "VII": "physarum-polycephalum-subway",
      },
    };

    const anomalyMap = anomalyMapBySlug[slug] || {
      "I": "braess-paradox",
      "II": "quantum-zeno-effect",
      "III": "alien-hand-syndrome",
      "V": "buridans-ass",
    };

    sections.forEach((sec) => {
      if (sec.romanNumeral && anomalyMap[sec.romanNumeral]) {
        const targetId = anomalyMap[sec.romanNumeral];
        sec.associatedAnomaly = SEED_ANOMALIES.find((a) => a.id === targetId);
      }
    });
  }

  // Parse markdown body to HTML with marked
  const htmlContent = marked.parse(content) as string;

  const proseParagraphs = content
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#") && !p.startsWith(">") && !p.startsWith("*"));
  const promotionalExcerpt = data.promotional_excerpt || data.promotionalExcerpt || "";
  const excerpt = data.excerpt || proseParagraphs[0] || quote || "";

  const title = data.title || slug.replace(/-/g, " ");
  const subtitle = data.subtitle || data.description || (data.aliases && data.aliases[0]) || "";
  const created = data.created ? String(data.created) : (data.date ? String(data.date) : new Date().toISOString().split("T")[0]);
  const aliases = data.aliases || (data.description ? [data.description] : []);

  const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  const defaultThumbnail = imageMatch ? imageMatch[1] : undefined;
  const thumbnail = data.thumbnail || data.cover_image || data.image || defaultThumbnail || getDefaultThumbnailForSlug(slug);

  return {
    slug,
    title,
    subtitle,
    aliases,
    tags: data.tags || [],
    created,
    status: data.status || "published",
    readingTime,
    wordCount,
    quote,
    excerpt,
    promotionalExcerpt,
    thumbnail,
    rawContent: content,
    htmlContent,
    sections,
    linkedAnomalies,
  };
}

export function getAllTags(): string[] {
  const journals = getAllJournals();
  const set = new Set<string>();
  journals.forEach((j) => j.tags.forEach((t) => set.add(t)));
  return Array.from(set);
}
