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
  Send,
  Mail,
  ShieldCheck,
  Cpu,
  BarChart3,
  ExternalLink
} from "lucide-react";
import { JournalMeta } from "@/lib/journals";
import { AUTHOR_DETAILS } from "@/lib/author";

interface Props {
  initialJournals: JournalMeta[];
  allTags: string[];
}

export default function PublicationHomeClient({ initialJournals, allTags }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [featuredSlug, setFeaturedSlug] = useState<string>(
    initialJournals.find((j) => j.slug === "you-can-have-power-and-still-be-weak")?.slug ||
    initialJournals[0]?.slug || ""
  );
  const featured = initialJournals.find((j) => j.slug === featuredSlug) || initialJournals[0];

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
      {/* 1. Pinaade-Style Editorial Magazine Cover Feature Hero */}
      <section id="featured" className="container mx-auto px-4 pt-4 sm:pt-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#060D1F] via-[#091538] to-[#0E1E4A] border border-white/15 shadow-2xl overflow-hidden grid md:grid-cols-12 min-h-[540px]">
          
          {/* Left Column: Full-Bleed Magazine Cover Photo */}
          <div className="relative md:col-span-5 lg:col-span-5 min-h-[380px] md:min-h-full overflow-hidden group">
            <img
              src={featured?.thumbnail || "/images/journals/power-and-weakness.jpg"}
              alt={featured?.title || "Cover Feature"}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Cinematic Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/75" />
            
            {/* Masthead & Badge Overlay in Top-Left Corner */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 flex flex-col items-start">
              <span className="px-2.5 py-1 rounded bg-[#F05438] text-white font-heading font-extrabold text-[10px] sm:text-xs uppercase tracking-widest shadow-md">
                COVER FEATURE
              </span>
              <h2 className="mt-2.5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tighter text-white drop-shadow-xl uppercase leading-none">
                THE CRAZY<br />JOURNAL
              </h2>
            </div>

            {/* Bottom Photo Issue Pill */}
            <div className="absolute bottom-5 left-6 right-6 z-10 flex items-center justify-between text-white/80 text-xs font-mono">
              <span className="text-[11px] font-heading font-semibold text-nqq-coral uppercase tracking-wider">
                Quarterly Publication
              </span>
              <span className="text-[11px] text-slate-300">
                Vol. I • Issue 1
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Essay Narrative */}
          <div className="md:col-span-7 lg:col-span-7 p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between text-white space-y-6">
            <div className="space-y-4">
              {/* Issue Sub-header */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-heading font-bold text-nqq-coral uppercase tracking-widest">
                  VOL. I • ESSAY SERIES
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-nqq-coral" />
                <span className="text-xs text-slate-400 font-mono">
                  {featured?.created}
                </span>
              </div>

              {/* Big Bold Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight leading-[1.12]">
                {featured?.title.split("—")[0].trim()}
              </h1>

              {/* Subtitle in Coral */}
              {featured?.subtitle && (
                <p className="text-base sm:text-lg lg:text-xl font-heading font-semibold text-nqq-coral leading-snug">
                  {featured?.subtitle}
                </p>
              )}

              {/* Editorial Narrative / Excerpt */}
              <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed font-sans pt-2 max-w-2xl line-clamp-6 sm:line-clamp-none">
                {featured?.excerpt}
              </p>
            </div>

            {/* Bottom: Author Metadata + Action Buttons */}
            <div className="pt-6 border-t border-white/10 space-y-5">
              {/* Metadata Line */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300 font-sans">
                <span className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Feather className="w-3.5 h-3.5 text-nqq-coral" />
                  <span>{AUTHOR_DETAILS.name}, Editor</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-nqq-coral" />
                  <span>{featured?.readingTime}</span>
                </span>
                <span className="text-slate-400 font-mono">
                  Winter 2026
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href={`/journals/${featured?.slug}`}
                  className="px-6 py-3 rounded-xl bg-nqq-coral hover:bg-orange-600 text-white font-heading font-bold text-sm shadow-lg shadow-orange-500/25 transition-all inline-flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/journals/${featured?.slug}#sparring`}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-heading font-semibold text-sm backdrop-blur-sm transition-all inline-flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-nqq-coral" />
                  <span>Sparring Chamber</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Featured Cover Story Switcher Carousel */}
        <div className="mt-4 flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap pl-1">
            Featured Stories:
          </span>
          <div className="flex items-center gap-2">
            {initialJournals.slice(0, 6).map((j) => {
              const isActive = j.slug === featured.slug;
              return (
                <button
                  key={j.slug}
                  onClick={() => setFeaturedSlug(j.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-nqq-blue text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-nqq-coral" : "bg-gray-300"}`} />
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">
                    {j.title.split(":")[0].split("—")[0].trim()}
                  </span>
                </button>
              );
            })}
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



      {/* 6. Spotlight: About The Author & Founder */}
      <section id="author" className="container mx-auto px-4 py-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0A1120] via-[#0E182A] to-[#14233D] text-white p-8 sm:p-12 md:p-16 shadow-2xl border border-white/10 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-12 gap-10 md:gap-12 items-center">
            {/* Author Portrait Column */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand-accent via-amber-400 to-blue-500 opacity-80 blur group-hover:opacity-100 transition-opacity" />
                <img
                  src={AUTHOR_DETAILS.avatar}
                  alt={AUTHOR_DETAILS.name}
                  className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full object-cover border-4 border-[#0A1120] shadow-2xl"
                />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold font-heading text-white">
                {AUTHOR_DETAILS.name}
              </h3>
              <p className="text-xs sm:text-sm text-brand-accent font-heading font-semibold uppercase tracking-wider mt-1">
                Founder, Editor &amp; Systems Architect
              </p>

              {/* Direct LinkedIn & Email Buttons */}
              <div className="flex items-center gap-3 mt-5">
                <a
                  href={AUTHOR_DETAILS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0077b5] hover:bg-[#005f93] text-white text-xs font-heading font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn Profile</span>
                </a>

                <a
                  href={`mailto:${AUTHOR_DETAILS.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white text-xs font-heading font-semibold transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact</span>
                </a>
              </div>
            </div>

            {/* Author Narrative Column */}
            <div className="md:col-span-8 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-xs font-heading font-bold uppercase tracking-wider">
                <Feather className="w-3.5 h-3.5" />
                <span>The Voice Behind The Journal</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
                Dissecting Complexity Through Software, Defense &amp; Cognitive Models
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
                {AUTHOR_DETAILS.extendedBio}
              </p>

              {/* Three Core Disciplines Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    Software Architecture
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    15+ years engineering scalable enterprise systems, SaaS platforms (Edukate, Edupay), and student information systems (SkoolBoard).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    Defensive Security
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Certified network &amp; systems security instructor training engineers in threat defense, secure infrastructure, and zero-trust design.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    Data &amp; Systems Logic
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Synthesizing quantitative analytics with non-linear mental models to make rational decisions under uncertainty.
                  </p>
                </div>
              </div>

              {/* Proven Track Record / SaaS Products Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono font-medium">Platforms &amp; Initiatives:</span>
                  {AUTHOR_DETAILS.products.map((p) => (
                    <span
                      key={p.name}
                      className="px-2.5 py-1 rounded-md bg-white/10 text-slate-300 text-xs font-mono font-medium border border-white/10"
                      title={p.desc}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>

                <a
                  href={AUTHOR_DETAILS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-heading font-semibold text-brand-accent hover:text-white transition-colors inline-flex items-center gap-1 group/lnk"
                >
                  <span>View Full Professional Journey on LinkedIn</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/lnk:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Newsletter / Reader Reflection Strip */}
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
