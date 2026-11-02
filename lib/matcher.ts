import { AnomalyItem, SEED_ANOMALIES } from "./seed-anomalies";
import { harvestPublicationArticles } from "./feed-harvester";

function tokenize(text: string): string[] {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, " ");
  return cleaned.split(/\s+/).filter((w) => w.length >= 3);
}

export async function matchJournalToAnomaly(
  journalText: string,
  topK: number = 2
): Promise<{ topMatch: AnomalyItem | null; allMatches: AnomalyItem[] }> {
  // Harvest latest publication articles (cached automatically by fetch)
  let liveArticles: AnomalyItem[] = [];
  try {
    liveArticles = await harvestPublicationArticles(3);
  } catch {
    liveArticles = [];
  }

  const corpus: AnomalyItem[] = [...liveArticles, ...SEED_ANOMALIES];
  const queryTokens = tokenize(journalText);

  if (queryTokens.length === 0 || corpus.length === 0) {
    return { topMatch: corpus[0] || null, allMatches: corpus.slice(0, topK) };
  }

  // Token frequency in query
  const queryFreq: Record<string, number> = {};
  for (const t of queryTokens) {
    queryFreq[t] = (queryFreq[t] || 0) + 1;
  }

  const scored = corpus.map((item) => {
    const docTokens = tokenize(
      `${item.title} ${item.summary} ${item.parallel_themes.join(" ")} ${item.weird_factor}`
    );
    const docSet = new Set(docTokens);

    let score = 0;
    // Overlap score
    for (const [t, count] of Object.entries(queryFreq)) {
      if (docSet.has(t)) {
        score += count * 1.5;
      }
    }

    // Theme bonus
    const themeSet = new Set(item.parallel_themes.flatMap((th) => tokenize(th)));
    for (const t of queryTokens) {
      if (themeSet.has(t)) {
        score += 3.0; // heavy weight for psychological theme intersection
      }
    }

    return {
      ...item,
      relevance_score: Number(score.toFixed(2)),
    };
  });

  scored.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

  const filtered = scored.filter((s) => (s.relevance_score || 0) > 0);
  const results = filtered.length > 0 ? filtered.slice(0, topK) : scored.slice(0, topK);

  return {
    topMatch: results[0] || null,
    allMatches: results,
  };
}
