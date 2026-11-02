import { harvestPublicationArticles } from "@/lib/feed-harvester";
import { SEED_ANOMALIES, AnomalyItem } from "@/lib/seed-anomalies";
import Link from "next/link";
import { ExternalLink, Compass, Sparkles, RefreshCw, BookOpen } from "lucide-react";

export const revalidate = 3600; // Auto-regenerate on Vercel Edge every 1 hour

export default async function DiscoverFeedPage() {
  let liveArticles: AnomalyItem[] = [];
  try {
    liveArticles = await harvestPublicationArticles(6);
  } catch {
    liveArticles = [];
  }

  const allItems: AnomalyItem[] = [...liveArticles, ...SEED_ANOMALIES];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Compass className="w-5 h-5 text-brand-accent" />
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary tracking-tight font-heading">
              Contrarian Discover Feed
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Recent attention-grabbing articles &amp; paradoxes presenting radically opposite viewpoints.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Auto-Refreshed Hourly via ISR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border-t-4 border-t-brand-accent border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl hover:border-gray-300 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-orange-50 text-brand-accent border border-orange-200 font-heading">
                  {item.outlet}
                </span>

                <div className="flex flex-wrap gap-1">
                  {item.parallel_themes.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] uppercase text-gray-400 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <Link href={`/article/${item.id}`} className="block">
                <h2 className="text-lg font-bold text-brand-primary group-hover:text-brand-accent transition-colors mb-2 leading-snug font-heading">
                  {item.title}
                </h2>
              </Link>

              <p className="text-xs italic text-gray-600 border-l-2 border-brand-accent pl-2.5 mb-4">
                &ldquo;{item.weird_factor}&rdquo;
              </p>

              <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed mb-4">
                {item.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {item.category.replace("_", " ")}
              </span>

              <div className="flex items-center gap-3">
                <Link
                  href={`/article/${item.id}`}
                  className="text-xs font-semibold text-brand-accent hover:text-brand-accent-hover inline-flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 border border-brand-accent/20"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read on Blog</span>
                </Link>

                {item.source && (
                  <a
                    href={item.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Original Source"
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
