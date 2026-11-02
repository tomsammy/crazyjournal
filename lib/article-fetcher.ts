import { AnomalyItem, SEED_ANOMALIES } from "./seed-anomalies";
import { harvestPublicationArticles } from "./feed-harvester";

export interface FullArticleData extends AnomalyItem {
  bodyParagraphs: string[];
}

export async function getArticleById(id: string): Promise<FullArticleData | null> {
  // 1. Check seed catalog
  const seed = SEED_ANOMALIES.find((a) => a.id === id);
  if (seed) {
    return {
      ...seed,
      bodyParagraphs: generateSeedArticleBody(seed),
    };
  }

  // 2. Check live harvested feed articles
  let liveArticles: AnomalyItem[] = [];
  try {
    liveArticles = await harvestPublicationArticles(8);
  } catch {
    liveArticles = [];
  }

  const liveMatch = liveArticles.find((a) => a.id === id);
  if (liveMatch) {
    // Attempt to extract live paragraphs from source URL with short timeout
    const paragraphs = await fetchSourceParagraphs(liveMatch.source);
    return {
      ...liveMatch,
      bodyParagraphs: paragraphs.length > 0 ? paragraphs : generateFallbackBody(liveMatch),
    };
  }

  return null;
}

async function fetchSourceParagraphs(url: string): Promise<string[]> {
  if (!url || !url.startsWith("http")) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (CrazyJournal/1.0)",
      },
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache article body for 24h
    });

    clearTimeout(timeoutId);
    if (!res.ok) return [];

    const html = await res.text();

    // Extract all <p> tags with meaningful content
    const rawParagraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const cleaned: string[] = [];

    for (const p of rawParagraphs) {
      const text = p
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Filter out cookie notices, author disclaimers, or tiny fragments
      if (
        text.length > 60 &&
        !text.toLowerCase().includes("cookie") &&
        !text.toLowerCase().includes("subscribe") &&
        !text.toLowerCase().includes("privacy policy")
      ) {
        cleaned.push(text);
      }
    }

    return cleaned.slice(0, 12); // Keep up to 12 cohesive paragraphs
  } catch {
    return [];
  }
}

function generateSeedArticleBody(item: AnomalyItem): string[] {
  return [
    item.summary,
    `What makes this phenomenon so disorienting is that "${item.weird_factor}". Standard rational expectations collapse under close inspection, revealing a reality governed by counter-intuitive dynamics.`,
    `When translated to human psychology and decision-making, the implications are profound: ${item.counter_intuitive_lesson}`,
    `Rather than treating this as an abstract curiosity, it serves as a diagnostic mirror. The human mind consistently projects linearity onto non-linear systems, creating artificial anxiety where organic adaptation is required.`,
  ];
}

function generateFallbackBody(item: AnomalyItem): string[] {
  return [
    item.summary,
    `In conventional wisdom, we are taught to conform to common intuitions. However, as ${item.outlet} details in this provocative essay, reality frequently demands the exact opposite stance.`,
    item.counter_intuitive_lesson,
    `By examining our automatic assumptions through this contrarian lens, we unlock a radically more resilient perspective. What initially looks like a defect or failure transforms into an essential cognitive strategy.`,
  ];
}
