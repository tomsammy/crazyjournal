import { getArticleById } from "@/lib/article-fetcher";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, ExternalLink, ShieldAlert, BookOpen, Flame } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
  const article = await getArticleById(params.id);
  if (!article) return { title: "Article Not Found — Crazy Journal" };

  return {
    title: `${article.title} — Crazy Journal Blog`,
    description: article.weird_factor,
  };
}

export default async function ArticleReaderPage({ params }: Props) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-14">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Contrarian Feed</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {article.outlet}
          </span>
          <span className="text-xs text-zinc-500 uppercase font-mono">
            {article.category.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Article Header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400 border-b border-white/10 pb-6">
          <span>Curated for Crazy Journal</span>
          <span>•</span>
          <span>Source: {article.outlet}</span>
          <span>•</span>
          <div className="flex gap-1.5">
            {article.parallel_themes.map((theme, i) => (
              <span key={i} className="text-purple-400 font-mono">
                #{theme}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* The Contrarian Callout Banner */}
      <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 sm:p-6 mb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-purple-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>The Opposite Perspective</span>
        </div>
        <p className="text-base sm:text-lg italic text-purple-100/90 font-serif leading-relaxed mb-3">
          &ldquo;{article.weird_factor}&rdquo;
        </p>
        <div className="text-sm text-zinc-300 border-t border-purple-500/20 pt-3 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{article.counter_intuitive_lesson}</span>
        </div>
      </div>

      {/* Full Article Body */}
      <article className="prose prose-invert max-w-none space-y-6 text-zinc-200 text-base sm:text-lg leading-relaxed font-normal">
        {article.bodyParagraphs.map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Journal Sparring CTA */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-purple-900/30 via-zinc-950 to-indigo-900/30 p-6 sm:p-8 mt-12 mb-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-400 block mb-1">
              Apply This Contrarian Lens
            </span>
            <h3 className="text-xl font-bold text-white mb-2">
              Spar with this perspective in your journal
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Are you caught in the exact opposite trap right now? Test your current dilemmas against this mental model.
            </p>
          </div>

          <Link
            href="/"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Open Sparring Deck</span>
          </Link>
        </div>
      </div>

      {/* Canonical Citation Footer */}
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <span>Originally reported & published by {article.outlet}.</span>
        {article.source && (
          <a
            href={article.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>View Canonical Web Publication</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
