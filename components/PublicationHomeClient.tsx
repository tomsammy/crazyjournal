"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  ShieldAlert,
  Clock,
  Feather,
  Search,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Send
} from "lucide-react";
import { JournalMeta } from "@/lib/journals";

interface Props {
  initialJournals: JournalMeta[];
  allTags: string[];
}

export default function PublicationHomeClient({ initialJournals, allTags }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = initialJournals[0]; // Flagship journal (e.g. Uncertainty or Binary Options)

  // Filter journals based on search query and selected tag
  const filteredJournals = useMemo(() => {
    return initialJournals.filter((j) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        j.title.toLowerCase().includes(query) ||
        j.subtitle.toLowerCase().includes(query) ||
        j.excerpt.toLowerCase().includes(query) ||
        j.quote.toLowerCase().includes(query) ||
        j.tags.some((t) => t.toLowerCase().includes(query));

      const matchesTag =
        selectedTag === "all" ||
        j.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [initialJournals, searchQuery, selectedTag]);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail("");
    }
  }

  return (
    <div className="space-y-16 pb-12">
      {/* 1. NileQuest Quarterly Style Hero Section */}
      <section className="relative py-20 md:py-32 text-center text-white bg-gradient-to-r from-[#0A1120] via-[#0E182A] to-[#14233D] shadow-2xl overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black opacity-35" />

        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-heading font-semibold text-slate-200 uppercase tracking-widest mb-6">
            <Feather className="w-3.5 h-3.5 text-brand-accent" />
            <span>Quarterly Essay Series • October 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 font-heading drop-shadow-lg leading-tight">
            <span className="gradient-text">The Crazy Journal</span>: Truth Without Guarantees
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-slate-200 drop-shadow-md leading-relaxed font-sans">
            Uncomfortable questions, inconvenient truths, and mental models that refuse to behave.
            Confronting human certainty with brutal reality.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href={`/journals/${featured?.slug || "you-can-have-power-and-still-be-weak"}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white font-heading font-bold text-base shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              <span>Read Featured Issue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#essays"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg border-2 border-white text-white hover:bg-white hover:text-brand-primary font-heading font-bold text-base transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Browse All Insights</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. "What is The Crazy Journal?" Mission Section */}
      <section className="container mx-auto px-4 text-center max-w-4xl pt-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-primary mb-6 font-heading">
          What is The Crazy Journal?
        </h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          <strong className="text-brand-primary font-heading">The Crazy Journal</strong> is an independent intellectual platform arguing for the critical necessity of{" "}
          <strong className="text-brand-accent font-semibold">radical reality testing</strong>. We contend that the persistent human obsession with guaranteed outcomes, religious conformity, and magical thinking is the principal impediment to personal agency, intellectual clarity, and authentic creativity.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Our core premise is singular and uncompromising:{" "}
          <strong className="text-brand-primary">the universe has never signed an agreement to reward your effort or validate your comfort</strong>. The purpose of this journal is to examine where our inherited explanations fail, and how to think with courage when no guarantees exist.
        </p>
        <Link
          href="#pillars"
          className="inline-flex items-center text-brand-accent text-lg font-heading font-semibold hover:text-brand-accent-hover transition-colors"
        >
          <span>Explore Our Core Focus Areas</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>

      {/* 3. "Our Focus Areas" 3-Pillar Cards */}
      <section id="pillars" className="container mx-auto px-4 pt-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-nqq-blue text-center mb-12 font-heading">
          Our Focus Areas
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="h-full text-center shadow-lg border-t-4 border-nqq-coral rounded-xl overflow-hidden transition-all duration-300 bg-white hover:-translate-y-1 hover:shadow-xl p-8 flex flex-col justify-between">
            <div>
              <div className="p-4 bg-nqq-coral rounded-full inline-block mb-4 text-white shadow-md">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-nqq-blue font-heading mb-3">
                Zero False Guarantees
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Exposing the fallacy that doing everything right entitles you to win.
                Preparation improves probability; it does not purchase immunity from reality.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="h-full text-center shadow-lg border-t-4 border-nqq-blue rounded-xl overflow-hidden transition-all duration-300 bg-white hover:-translate-y-1 hover:shadow-xl p-8 flex flex-col justify-between">
            <div>
              <div className="p-4 bg-nqq-blue rounded-full inline-block mb-4 text-white shadow-md">
                <Sparkles className="h-8 w-8 text-nqq-coral" />
              </div>
              <h3 className="text-2xl font-bold text-nqq-blue font-heading mb-3">
                Intellectual Courage
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                God did not give you a brain to stop using it. Refusing to confuse obedience to human authority
                with loyalty to God, and dismantling fear disguised as humility.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="h-full text-center shadow-lg border-t-4 border-nqq-coral rounded-xl overflow-hidden transition-all duration-300 bg-white hover:-translate-y-1 hover:shadow-xl p-8 flex flex-col justify-between">
            <div>
              <div className="p-4 bg-nqq-coral rounded-full inline-block mb-4 text-white shadow-md">
                <Flame className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-nqq-blue font-heading mb-3">
                Scientific Paradox Mirrors
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Grounding human decision-making in non-linear physics and game theory—from Braess’s traffic paradox to quantum Zeno freezing and time crystals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "Fresh Perspectives: Insights" (The Essay Grid) */}
      <section id="essays" className="container mx-auto px-4 pt-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-nqq-blue font-heading">
            Fresh Perspectives: Insights
          </h2>
          <p className="text-gray-600 text-sm">
            Read complete long-form essays and mental models. Filter by keyword or thematic tag.
          </p>
        </div>

        {/* Live Search and Tag Filter Bar */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays, paradoxes, keywords..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-nqq-coral focus:ring-2 focus:ring-nqq-coral/20 shadow-sm transition-all"
            />
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag("all")}
              className={`text-xs px-3.5 py-1.5 rounded-full font-heading font-semibold transition-all ${
                selectedTag === "all"
                  ? "bg-nqq-blue text-white shadow-md"
                  : "bg-white text-gray-600 hover:text-nqq-blue border border-gray-200"
              }`}
            >
              #all
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-heading font-semibold transition-all ${
                  selectedTag === tag
                    ? "bg-nqq-coral text-white shadow-md"
                    : "bg-white text-gray-600 hover:text-nqq-coral border border-gray-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Essay Cards (3-Column Grid) */}
        {filteredJournals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 max-w-md mx-auto">
            <p className="text-gray-500 text-sm">No essays found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag("all");
              }}
              className="text-xs text-nqq-coral font-bold mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {filteredJournals.map((j) => (
              <article
                key={j.slug}
                className="group flex flex-col justify-between h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-nqq-coral/40 bg-white"
              >
                <div>
                  {/* Captivating Thumbnail Header */}
                  {j.thumbnail && (
                    <Link href={`/journals/${j.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-gray-100">
                      <img
                        src={j.thumbnail}
                        alt={j.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#0A1120]/85 backdrop-blur-md text-[10px] font-heading font-bold text-nqq-coral uppercase tracking-wider shadow">
                        #{j.tags[0] || "essay"}
                      </span>
                    </Link>
                  )}

                  <div className="p-6">
                    <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
                      <span>{j.created}</span>
                      {!j.thumbnail && (
                        <span className="font-semibold text-nqq-coral uppercase font-heading text-[11px]">
                          #{j.tags[0] || "essay"}
                        </span>
                      )}
                    </div>

                    <Link href={`/journals/${j.slug}`}>
                      <h3 className="text-xl font-bold text-nqq-blue group-hover:text-nqq-coral transition-colors font-heading mb-2 leading-snug line-clamp-2">
                        {j.title.split("—")[0].trim()}
                      </h3>
                    </Link>

                    {j.subtitle && (
                      <p className="text-xs text-gray-500 font-serif italic mb-3 line-clamp-2">
                        {j.subtitle}
                      </p>
                    )}

                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-2">
                      {j.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">
                    {j.readingTime}
                  </span>

                  <Link
                    href={`/journals/${j.slug}`}
                    className="inline-flex items-center text-sm font-heading font-bold text-nqq-coral hover:text-nqq-blue transition-colors group/link"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="ml-1.5 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. NileQuest Quarterly Featured Issue Banner */}
      {featured && (
        <section id="featured" className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl shadow-xl my-12">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-5">
              <span className="px-3 py-1 rounded-full bg-nqq-coral text-white font-heading font-bold text-xs uppercase tracking-wider">
                Featured Quarterly Issue
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-nqq-blue font-heading leading-tight">
                {featured.title}
              </h2>

              {featured.subtitle && (
                <p className="text-xl text-nqq-coral font-heading font-semibold">
                  {featured.subtitle}
                </p>
              )}

              {featured.quote && (
                <blockquote className="p-4 rounded-xl bg-white/80 border-l-4 border-nqq-coral text-gray-800 italic font-serif text-base shadow-sm">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
              )}

              <p className="text-gray-700 text-base leading-relaxed">
                {featured.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href={`/journals/${featured.slug}`}
                  className="px-6 py-3 rounded-lg bg-nqq-blue hover:bg-blue-900 text-white font-heading font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Online</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/journals/${featured.slug}#sparring`}
                  className="px-6 py-3 rounded-lg border-2 border-nqq-blue text-nqq-blue hover:bg-nqq-blue hover:text-white font-heading font-bold text-sm transition-all inline-flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 text-nqq-coral" />
                  <span>Open Sparring Chamber</span>
                </Link>
              </div>
            </div>

            {/* Right: NileQuest Quarterly Styled Cover Card Mockup */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-nqq-blue via-[#0a1128] to-blue-950 p-6 sm:p-7 shadow-2xl border-4 border-nqq-coral/30 flex flex-col justify-between text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-nqq-coral/20 rounded-full blur-2xl" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <span className="font-heading font-bold tracking-widest text-xs uppercase text-nqq-coral">
                      Vol. I • Issue 1
                    </span>
                    <span className="text-xs text-blue-200 font-mono">
                      {featured.created}
                    </span>
                  </div>

                  {featured.thumbnail && (
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-inner">
                      <img
                        src={featured.thumbnail}
                        alt={featured.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white leading-tight">
                    {featured.title.split("—")[0].trim()}
                  </h3>

                  <p className="text-xs text-blue-200 line-clamp-2 leading-relaxed">
                    {featured.subtitle || featured.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-xs">
                  <span className="font-heading font-semibold text-nqq-coral">
                    The Crazy Journal
                  </span>
                  <span className="text-blue-300">
                    {featured.readingTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Newsletter / Reader Reflection Strip */}
      <section className="container mx-auto px-4">
        <div className="py-16 px-6 sm:px-12 rounded-2xl bg-gradient-to-r from-[#0A1120] via-[#0E182A] to-[#14233D] text-white text-center shadow-xl space-y-6">
          <span className="px-3 py-1 rounded-full bg-brand-accent text-white font-heading font-bold text-xs uppercase tracking-wider">
            Quarterly Dispatches
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Receive the Next Edition Directly
          </h2>

          <p className="text-slate-200 max-w-2xl mx-auto text-base leading-relaxed">
            No spam. No promotional clutter. Just long-form essays, non-linear mental models, and reality checks delivered when an issue is ready.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white font-heading font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {subscribed && (
            <p className="text-xs text-emerald-300 font-semibold animate-in fade-in">
              ✓ You are subscribed to the next Crazy Journal edition.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
