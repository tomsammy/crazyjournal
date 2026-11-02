"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { marked } from "marked";
import {
  Feather,
  Copy,
  Check,
  Eye,
  FileCode,
  Download,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Flame,
  Clock,
  Layers
} from "lucide-react";

const TEMPLATES = [
  {
    name: "Classic Crazy Journal Essay",
    title: "THE ILLUSION OF SPEED — Why Doing Less Faster Is Breaking Us",
    subtitle: "The Mathematical Physics of Exhaustion",
    tags: "crazy-journal, philosophy, productivity, time, mental-models",
    body: `# THE ILLUSION OF SPEED
### The Mathematical Physics of Exhaustion

*The Crazy Journal | October 2026*

> We treat velocity as evidence of progress. Yet in non-linear systems, increasing speed without direction simply accelerates collision with the wrong wall.

## I. THE OBSESSION WITH ACCELERATION

We live in a culture that worships rapid execution.

Answer messages in seconds.
Ship features in hours.
Scale businesses in months.
Make decisions immediately.

It sounds decisive. It feels productive.

**Unfortunately, velocity is not the same as vector.**

A bullet traveling at Mach 3 in the wrong direction does not become helpful simply because it is moving quickly.

## II. THE PARADOX OF LOCAL EFFICIENCY

When you optimize every micro-second of your day, you eliminate the slack required for radical adaptation.

What feels like laziness is often the incubation chamber for breakthrough insight.

## III. THE CLOSING AXIOM

Make peace with slower deliberation.
Do not mistake panic for momentum.`,
  },
  {
    name: "The Cognitive Paradox Review",
    title: "EGO DEATH AS AN OPERATING SYSTEM",
    subtitle: "What Biology Teaches Us About Reinvention",
    tags: "crazy-journal, biology, psychology, reinvention, ego",
    body: `# EGO DEATH AS AN OPERATING SYSTEM
### What Biology Teaches Us About Reinvention

*The Crazy Journal | October 2026*

> Most people defend obsolete versions of themselves because admitting the previous identity has decayed feels like dying.

## I. THE BIOLOGICAL PRECEDENT

The immortal jellyfish Turritopsis dohrnii does not fight aging with desperate cosmetic repairs.

When environmental stress strikes, it regresses its mature cells back into infant polyps.

It survives by abandoning what it was.

## II. THE HUMAN RESISTANCE TO REBIRTH

We cling to titles, credentials, and past victories even when they have become cages.

**Reinvention requires the courage to become an amateur again.**`,
  },
];

export default function AuthorWritingStudio() {
  const [title, setTitle] = useState(TEMPLATES[0].title);
  const [subtitle, setSubtitle] = useState(TEMPLATES[0].subtitle);
  const [tags, setTags] = useState(TEMPLATES[0].tags);
  const [status, setStatus] = useState("published-draft");
  const [markdownBody, setMarkdownBody] = useState(TEMPLATES[0].body);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"split" | "editor" | "preview">("split");

  // Word count and Reading Time
  const wordCount = useMemo(() => {
    return markdownBody.trim() ? markdownBody.trim().split(/\s+/).length : 0;
  }, [markdownBody]);

  const readingTime = useMemo(() => {
    return `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
  }, [wordCount]);

  // Generate full markdown with YAML frontmatter
  const fullMarkdownOutput = useMemo(() => {
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => `  - ${t}`)
      .join("\n");

    const today = new Date().toISOString().split("T")[0];

    return `---
title: "${title}"
description: "${subtitle}"
date: ${today}
journal: Crazy Journal
tags:
${tagList}
status: ${status}
---

${markdownBody}`;
  }, [title, subtitle, tags, status, markdownBody]);

  // Parse HTML preview
  const previewHtml = useMemo(() => {
    try {
      return marked.parse(markdownBody) as string;
    } catch {
      return "<p>Preview error</p>";
    }
  }, [markdownBody]);

  function handleCopyMarkdown() {
    navigator.clipboard.writeText(fullMarkdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const blob = new Blob([fullMarkdownOutput], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug || "journal"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleLoadTemplate(tmpl: typeof TEMPLATES[0]) {
    setTitle(tmpl.title);
    setSubtitle(tmpl.subtitle);
    setTags(tmpl.tags);
    setMarkdownBody(tmpl.body);
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-nqq-coral font-heading font-bold uppercase mb-1">
            <Feather className="w-4 h-4" />
            <span>The Crazy Journal • Editorial Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-nqq-blue font-heading tracking-tight">
            Author Writing Studio
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Draft long-form essays in Obsidian-compatible Markdown. Copy or download into <code className="text-nqq-coral font-mono font-semibold">content/journals/</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Templates */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 hidden sm:inline font-heading">Templates:</span>
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => handleLoadTemplate(t)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors text-[11px] font-heading font-semibold shadow-sm"
              >
                {t.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-heading font-bold shadow-md transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Frontmatter!" : "Copy Full .MD"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary hover:bg-[#12233C] text-white text-xs font-heading font-bold shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Metadata Form Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="md:col-span-6 space-y-1.5">
          <label className="text-[11px] font-heading uppercase text-gray-600 font-bold">
            Essay Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-nqq-blue text-sm focus:outline-none focus:border-nqq-coral focus:ring-1 focus:ring-nqq-coral font-heading font-semibold"
            placeholder="e.g. UNCERTAINTY — The Brutal Truth..."
          />
        </div>

        <div className="md:col-span-6 space-y-1.5">
          <label className="text-[11px] font-heading uppercase text-gray-600 font-bold">
            Subtitle / Description
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:outline-none focus:border-nqq-coral focus:ring-1 focus:ring-nqq-coral"
            placeholder="e.g. Living in a World That Owes You No Guarantees"
          />
        </div>

        <div className="md:col-span-8 space-y-1.5">
          <label className="text-[11px] font-heading uppercase text-gray-600 font-bold">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 text-sm focus:outline-none focus:border-nqq-coral focus:ring-1 focus:ring-nqq-coral font-mono text-xs"
            placeholder="crazy-journal, philosophy, mental-models, uncertainty"
          />
        </div>

        <div className="md:col-span-4 flex items-center justify-between pt-6 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-heading uppercase text-gray-500 font-semibold block">Metrics</span>
            <div className="text-xs font-heading font-bold text-nqq-blue">
              {wordCount.toLocaleString()} words • {readingTime}
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setActiveTab("editor")}
              className={`p-1.5 rounded text-xs transition-colors ${activeTab === "editor" ? "bg-nqq-blue text-white" : "text-gray-500"}`}
              title="Editor Only"
            >
              <FileCode className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("split")}
              className={`p-1.5 rounded text-xs transition-colors ${activeTab === "split" ? "bg-nqq-blue text-white" : "text-gray-500"}`}
              title="Split View"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`p-1.5 rounded text-xs transition-colors ${activeTab === "preview" ? "bg-nqq-blue text-white" : "text-gray-500"}`}
              title="Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left: Markdown Editor */}
        {(activeTab === "split" || activeTab === "editor") && (
          <div className={`${activeTab === "split" ? "lg:col-span-6" : "lg:col-span-12"} flex flex-col space-y-2`}>
            <div className="flex items-center justify-between text-xs font-mono text-gray-500 px-1">
              <span>Markdown Source</span>
              <span>Use ## for Roman Numeral Sections (## I., ## II.)</span>
            </div>
            <textarea
              value={markdownBody}
              onChange={(e) => setMarkdownBody(e.target.value)}
              className="flex-1 w-full min-h-[550px] p-5 rounded-xl bg-white border border-gray-300 text-gray-800 text-sm font-mono focus:outline-none focus:border-nqq-coral leading-relaxed resize-y shadow-sm"
              placeholder="Write your essay here in Markdown..."
            />
          </div>
        )}

        {/* Right: Real-Time Editorial Preview */}
        {(activeTab === "split" || activeTab === "preview") && (
          <div className={`${activeTab === "split" ? "lg:col-span-6" : "lg:col-span-12"} flex flex-col space-y-2`}>
            <div className="flex items-center justify-between text-xs font-heading font-bold text-nqq-coral px-1">
              <span>NileQuest Style Preview</span>
              <span className="text-gray-400 font-normal">Rendered with Marked</span>
            </div>
            <div className="flex-1 min-h-[550px] p-8 rounded-xl bg-white border border-gray-200 overflow-y-auto max-h-[750px] space-y-6 shadow-md">
              <header className="border-b border-gray-200 pb-6 space-y-2">
                <span className="text-xs uppercase font-heading font-bold text-nqq-coral">
                  {status}
                </span>
                <h1 className="text-3xl font-extrabold text-nqq-blue font-heading leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-lg text-gray-600 font-serif italic">
                    {subtitle}
                  </p>
                )}
                <div className="text-xs text-gray-400 font-mono">
                  {wordCount} words • {readingTime}
                </div>
              </header>

              <div
                className="prose max-w-none text-gray-800 font-sans text-base leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
