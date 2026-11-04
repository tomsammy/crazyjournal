import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { BookOpen, Compass, Feather, Flame, Sparkles, ChevronRight, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  metadataBase: new URL("https://crazyjournal.ng"),
  title: "The Crazy Journal — Inconvenient Truths, Brutal Reality & Cognitive Models",
  description: "An independent quarterly publication of long-form essays questioning human certainty, dogma, and the illusions of control.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased flex flex-col min-h-screen bg-[#f8fafc] text-brand-primary">
        {/* The Crazy Journal Masthead Navigation Header */}
        <header className="sticky top-0 z-50 shadow-lg bg-gradient-to-r from-[#0A1120] via-[#0E182A] to-[#14233D] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo & Brand Masthead */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform font-heading font-extrabold text-xl">
                  CJ
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-white group-hover:text-brand-accent transition-colors">
                      The Crazy Journal
                    </span>
                    <span className="w-2 h-2 rounded-full bg-brand-accent inline-block" />
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-widest font-heading font-semibold">
                    Quarterly Essays &amp; Mental Models
                  </p>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 text-sm font-heading font-semibold">
                <Link
                  href="/"
                  className="px-3.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/#essays"
                  className="px-3.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Insights &amp; Essays
                </Link>
                <Link
                  href="/#featured"
                  className="px-3.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Featured Issue
                </Link>
                <Link
                  href="/#author"
                  className="px-3.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  The Author
                </Link>
                <Link
                  href="/feed"
                  className="px-3.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Contrarian Feed
                </Link>
              </nav>

              {/* Action Button */}
              <div className="flex items-center gap-3">
                <Link
                  href="/journals/what-kind-of-fool-declares-war-on-the-water-he-drinks"
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white font-heading font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Read Latest Issue
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Deep Slate Ink Editorial Footer */}
        <footer className="bg-brand-primary text-white pt-16 pb-12 border-t-4 border-brand-accent mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
              {/* Publication Bio */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                    The Crazy Journal
                  </span>
                  <span className="w-2 h-2 rounded-full bg-brand-accent inline-block" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                  An independent quarterly publication dedicated to intellectual honesty, radical uncertainty,
                  and the dismantlement of cognitive dogmas. Where uncomfortable questions are given room to breathe.
                </p>
                <div className="pt-2 text-xs text-slate-400 font-mono">
                  Author Edition • Published Quarterly
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="md:col-span-3 space-y-3">
                <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-brand-accent">
                  Navigation
                </h4>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li>
                    <Link href="/" className="hover:text-brand-accent transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-accent" />
                      <span>Publication Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#essays" className="hover:text-brand-accent transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-accent" />
                      <span>All Essays &amp; Insights</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#author" className="hover:text-brand-accent transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-accent" />
                      <span>About the Author</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/feed" className="hover:text-brand-accent transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-brand-accent" />
                      <span>Contrarian Discover Feed</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Core Axioms */}
              <div className="md:col-span-4 space-y-3">
                <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-brand-accent">
                  Guiding Axioms
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-300 italic">
                  <li className="border-l-2 border-brand-accent pl-3">
                    &ldquo;You can do everything right and still lose. Preparation improves probability; it does not purchase immunity.&rdquo;
                  </li>
                  <li className="border-l-2 border-brand-accent pl-3">
                    &ldquo;God did not give you a brain to stop using it. Tradition can preserve wisdom; it can also preserve mistakes.&rdquo;
                  </li>
                  <li className="border-l-2 border-brand-accent pl-3">
                    &ldquo;You cannot compound an advantage you do not have.&rdquo;
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-2">
                <p>&copy; 2026 The Crazy Journal • Founded &amp; Edited by Adebayo Samuel Tomori.</p>
                <a
                  href="https://www.linkedin.com/in/tomsammy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077b5] hover:text-white transition-colors"
                  title="Adebayo Samuel Tomori on LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current inline-block" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
              <p className="text-slate-400">
                Inconvenient truths and thoughts that refuse to behave.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
