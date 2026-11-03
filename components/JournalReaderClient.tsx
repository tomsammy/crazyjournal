"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  ShieldAlert,
  Flame,
  CheckCircle2,
  ChevronRight,
  Share2,
  Type,
  Compass,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  VolumeX,
  Copy,
  Check,
  Printer,
  Calendar,
  Clock,
  User,
  ExternalLink
} from "lucide-react";
import { JournalFull, JournalSection } from "@/lib/journals";

interface Props {
  journal: JournalFull;
}

interface SparResult {
  diagnostic: string;
  surgicalQuestion: string;
  anomalyTitle: string;
  anomalyLesson: string;
  operationalShift: string;
}


function cleanMarkdownForSpeech(text: string): string {
  return text
    .replace(/^---[\s\S]*?---/, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    .replace(/^>\s*/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/^-{3,}$/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoSpeechChunks(text: string): string[] {
  const rawSentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const s of rawSentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;

    if (current && (current.length + trimmed.length + 1) <= 180) {
      current += " " + trimmed;
    } else {
      if (current) chunks.push(current);
      if (trimmed.length > 220) {
        const sub = trimmed.match(/[^,;:—]+[,;:—]+(?:\s+|$)|[^,;:—]+$/g) || [trimmed];
        let subCurrent = "";
        for (const part of sub) {
          const pTrim = part.trim();
          if (!pTrim) continue;
          if (subCurrent && (subCurrent.length + pTrim.length + 1) <= 180) {
            subCurrent += " " + pTrim;
          } else {
            if (subCurrent) chunks.push(subCurrent);
            subCurrent = pTrim;
          }
        }
        if (subCurrent) chunks.push(subCurrent);
        current = "";
      } else {
        current = trimmed;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function getBestVoice(availableVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!availableVoices || availableVoices.length === 0) return null;
  const preferred = availableVoices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Natural") ||
       v.name.includes("Google") ||
       v.name.includes("Samantha") ||
       v.name.includes("Daniel") ||
       v.name.includes("Premium") ||
       v.name.includes("Karen") ||
       v.name.includes("Arthur"))
  );
  if (preferred) return preferred;
  return availableVoices.find((v) => v.lang.startsWith("en")) || availableVoices[0] || null;
}

export default function JournalReaderClient({ journal }: Props) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSerif, setFontSerif] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  // Audio Narrator State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);
  const isSpeakingRef = useRef<boolean>(false);
  const playbackRateRef = useRef<number>(1);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const html5AudioRef = useRef<HTMLAudioElement | null>(null);
  const audioEngineRef = useRef<"speech" | "html5">("speech");

  // Prepare clean speech chunks for mobile and desktop
  const chunks = useMemo(() => {
    const parts: string[] = [
      journal.title,
      journal.subtitle,
      journal.quote,
      ...journal.sections.map((s) => `${s.title}. ${s.content}`),
    ];
    const combined = parts.filter(Boolean).join("\n\n");
    const cleaned = cleanMarkdownForSpeech(combined);
    return splitIntoSpeechChunks(cleaned);
  }, [journal]);

  useEffect(() => {
    chunksRef.current = chunks;
  }, [chunks]);

  // Load and cache voices across mobile browsers
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const updateVoices = () => {
        try {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length > 0) {
            setVoices(v);
          }
        } catch {
          // ignore
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
      return () => {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.onvoiceschanged = null;
          window.speechSynthesis.cancel();
        }
        if (html5AudioRef.current) {
          html5AudioRef.current.pause();
        }
      };
    } else {
      // In-app browsers (Facebook, Instagram, TikTok) without SpeechSynthesis
      audioEngineRef.current = "html5";
    }
  }, []);

  function playHtml5Chunk(index: number, text: string) {
    if (typeof window === "undefined") return;

    if (html5AudioRef.current) {
      html5AudioRef.current.pause();
      html5AudioRef.current.onended = null;
      html5AudioRef.current.onerror = null;
    }

    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}`;
    const audio = new Audio(audioUrl);
    audio.playbackRate = playbackRateRef.current;
    html5AudioRef.current = audio;

    audio.onended = () => {
      if (isSpeakingRef.current) {
        const nextIndex = currentChunkIndexRef.current + 1;
        if (nextIndex < chunksRef.current.length) {
          speakChunk(nextIndex);
        } else {
          handleStopAudio();
        }
      }
    };

    audio.onerror = (e) => {
      console.warn("HTML5 audio playback error on chunk", index, e);
      if (isSpeakingRef.current) {
        const nextIndex = currentChunkIndexRef.current + 1;
        if (nextIndex < chunksRef.current.length) {
          speakChunk(nextIndex);
        } else {
          handleStopAudio();
        }
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Audio play prevented or interrupted:", err);
      });
    }
  }

  function speakChunk(index: number) {
    if (typeof window === "undefined") return;
    const currentChunks = chunksRef.current;
    if (!currentChunks || currentChunks.length === 0 || index < 0 || index >= currentChunks.length) {
      handleStopAudio();
      return;
    }

    currentChunkIndexRef.current = index;
    setCurrentChunkIndex(index);
    isSpeakingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);

    const chunkText = currentChunks[index];

    // Detect if browser lacks SpeechSynthesis (e.g. Facebook/Instagram/TikTok In-App Browser)
    const hasSpeechSynthesis = "speechSynthesis" in window && !!window.speechSynthesis;
    if (!hasSpeechSynthesis || audioEngineRef.current === "html5") {
      playHtml5Chunk(index, chunkText);
      return;
    }

    // Native Speech Synthesis Engine with auto-fallback
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = "en-US";
      utterance.rate = playbackRateRef.current;
      utterance.pitch = 1.0;

      const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      const voiceToUse = getBestVoice(availableVoices);
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }

      utterance.onend = () => {
        if (isSpeakingRef.current) {
          const nextIndex = currentChunkIndexRef.current + 1;
          if (nextIndex < currentChunks.length) {
            speakChunk(nextIndex);
          } else {
            handleStopAudio();
          }
        }
      };

      utterance.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") {
          return;
        }
        console.warn("SpeechSynthesis error, seamlessly falling back to HTML5 audio stream:", e);
        audioEngineRef.current = "html5";
        playHtml5Chunk(index, chunkText);
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("SpeechSynthesis exception, using HTML5 audio fallback:", err);
      audioEngineRef.current = "html5";
      playHtml5Chunk(index, chunkText);
    }
  }

  function handleToggleAudio() {
    if (isPlaying && !isPaused) {
      // Virtual Pause
      isSpeakingRef.current = false;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (html5AudioRef.current) {
        html5AudioRef.current.pause();
      }
      setIsPaused(true);
      return;
    }

    if (isPlaying && isPaused) {
      // Resume from current sentence
      isSpeakingRef.current = true;
      setIsPaused(false);
      speakChunk(currentChunkIndexRef.current);
      return;
    }

    // Fresh play from currentChunkIndex
    isSpeakingRef.current = true;
    speakChunk(currentChunkIndexRef.current);
  }

  function handleStopAudio() {
    isSpeakingRef.current = false;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (html5AudioRef.current) {
      html5AudioRef.current.pause();
      html5AudioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    currentChunkIndexRef.current = 0;
    setCurrentChunkIndex(0);
  }

  function handleSkipForward() {
    const nextIndex = Math.min(chunks.length - 1, currentChunkIndexRef.current + 1);
    currentChunkIndexRef.current = nextIndex;
    setCurrentChunkIndex(nextIndex);
    if (isPlaying && !isPaused) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (html5AudioRef.current) {
        html5AudioRef.current.pause();
      }
      speakChunk(nextIndex);
    }
  }

  function handleSkipBack() {
    const prevIndex = Math.max(0, currentChunkIndexRef.current - 1);
    currentChunkIndexRef.current = prevIndex;
    setCurrentChunkIndex(prevIndex);
    if (isPlaying && !isPaused) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (html5AudioRef.current) {
        html5AudioRef.current.pause();
      }
      speakChunk(prevIndex);
    }
  }

  function handleChangeSpeed(rate: number) {
    playbackRateRef.current = rate;
    setPlaybackRate(rate);
    if (html5AudioRef.current) {
      html5AudioRef.current.playbackRate = rate;
    }
    if (isPlaying && !isPaused) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (html5AudioRef.current) {
        html5AudioRef.current.pause();
      }
      speakChunk(currentChunkIndexRef.current);
    }
  }

  // Sparring State
  const [sparInput, setSparInput] = useState("");
  const [sparResult, setSparResult] = useState<SparResult | null>(null);
  const [sparring, setSparring] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Track scroll position for reading progress and active section
  useEffect(() => {
    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }

      const sectionElements = journal.sections.map((s) => document.getElementById(s.id)).filter(Boolean);
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220) {
            setActiveSection(journal.sections[i].id);
            break;
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [journal.sections]);

  

  function handleCopyQuote(quoteText: string) {
    if (typeof window !== "undefined") {
      const formatted = `“${quoteText}”\n— The Crazy Journal | ${journal.title}\n${window.location.href}`;
      navigator.clipboard.writeText(formatted);
      setCopiedQuote(quoteText);
      setTimeout(() => setCopiedQuote(null), 2500);
    }
  }

  function handleCopyLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  // Surgical Sparring Logic
  function handleSparAudit() {
    if (!sparInput.trim()) return;
    setSparring(true);

    setTimeout(() => {
      const text = sparInput.toLowerCase();
      let res: SparResult;

      if (journal.slug.includes("binary") || journal.slug.includes("options")) {
        // Essay: BINARY OPTIONS
        if (text.includes("recover") || text.includes("erase") || text.includes("revenge") || text.includes("lost") || text.includes("deposit again")) {
          res = {
            diagnostic: "Section III Violation: Revenge Trading & The Recovery Trap",
            surgicalQuestion: "Are you taking this next trade because you have a verified mathematical edge, or because your ego cannot bear walking away without erasing the loss?",
            anomalyTitle: "Buridan's Ass",
            anomalyLesson: "A donkey starves to death between equal piles of food due to paralyzed indecision and refusal to accept constraints; revenge trading repeats the same self-inflicted execution.",
            operationalShift: "You are no longer trading to make money—you are trading to erase psychological embarrassment. Stop immediately. Accept the loss as the tuition fee of reality."
          };
        } else if (text.includes("compound") || text.includes("grow") || text.includes("small account") || text.includes("millionaire")) {
          res = {
            diagnostic: "Section IV Trap: Compounding an Imaginary Advantage",
            surgicalQuestion: "Have you audited your last 500 trades across actual deposits and withdrawals, or are you multiplying paper wins on an Excel spreadsheet?",
            anomalyTitle: "Time Crystals: Motion Without Output",
            anomalyLesson: "Quantum systems in perpetual cyclical oscillation consume zero net energy; similarly, binary accounts churn tens of thousands in volume while finishing in net drawdown.",
            operationalShift: "You cannot compound an advantage you don't possess. If your expected return is negative, increasing exposure merely accelerates liquidation."
          };
        } else if (text.includes("quit") || text.includes("stop") || text.includes("addicted") || text.includes("rent") || text.includes("savings") || text.includes("borrow")) {
          res = {
            diagnostic: "Section V & VIII Emergency: Financial Self-Preservation Override",
            surgicalQuestion: "How many sleepless nights and borrowed funds will it take to realize that stopping completely is the highest ROI decision you can make today?",
            anomalyTitle: "Turritopsis Dohrnii (The Immortal Jellyfish)",
            anomalyLesson: "When trauma strikes, the immortal jellyfish regresses to its infant polyp state; survival in nature requires complete retreat and biological reset.",
            operationalShift: "The greatest breakthrough of your life is not one lucky 80% trade—it is the day you stop losing what you already worked hard to earn. Withdraw and block the platform."
          };
        } else {
          res = {
            diagnostic: "Section II & VII Reality Check: Negative Expected Value & Desperation",
            surgicalQuestion: "At an 80% payout where you lose 100% on failure, you can win 55 out of 100 trades and STILL lose money. Do you have a verified 60%+ edge, or are you buying financial adrenaline?",
            anomalyTitle: "Braess's Paradox",
            anomalyLesson: "Adding new roads can slow down traffic; similarly, taking more trades on negative expectancy guarantees greater financial ruin.",
            operationalShift: "Ask yourself honestly: Are you trading because you have proven multi-year profitability, or because desperation makes shortcuts look attractive? Slower vehicles build real wealth."
          };
        }
      } else if (journal.slug.includes("brain") || journal.slug.includes("god")) {
        // Essay: God Did Not Give You a Brain
        if (text.includes("pastor") || text.includes("leader") || text.includes("rebellion") || text.includes("authority") || text.includes("disobey")) {
          res = {
            diagnostic: "Section VIII Trap: Surrendering Judgement to Human Authority",
            surgicalQuestion: "Are you submitting to divine truth, or are you shielding an incompetent human leader from ordinary standards of evidence?",
            anomalyTitle: "The Halifax Slasher (1938)",
            anomalyLesson: "An entire city mobilized around a phantom attacker because community panic and unquestioned authority replaced empirical investigation.",
            operationalShift: "Respect does not require intellectual surrender. Distinguish loyalty to God from fear of disappointing men."
          };
        } else if (text.includes("pray") || text.includes("spiritual") || text.includes("demon") || text.includes("attack") || text.includes("fast")) {
          res = {
            diagnostic: "Section V Trap: Spiritualizing Practical Operational Incompetence",
            surgicalQuestion: "If you remove the spiritual vocabulary from this problem, does it simply reveal a flawed strategy, poor financial literacy, or inadequate preparation?",
            anomalyTitle: "The Great Emu War (1932)",
            anomalyLesson: "Modern military artillery deployed brute force against agile birds and lost because brute conviction cannot defeat systemic realities.",
            operationalShift: "Stop treating a strategy failure as a spiritual mystery. Study, correct management structures, and build competence."
          };
        } else if (text.includes("doubt") || text.includes("fear") || text.includes("humble") || text.includes("afraid") || text.includes("sin")) {
          res = {
            diagnostic: "Section X Trap: Mistaking Intellectual Cowardice for Humility",
            surgicalQuestion: "Is your silence really spiritual humility, or are you terrified of losing social acceptance from your religious group?",
            anomalyTitle: "The Dancing Plague of 1518",
            anomalyLesson: "Hundreds danced themselves to physical exhaustion due to social contagion and religious stress conformity that no single individual dared question.",
            operationalShift: "Being certain is easy; having the courage to discover where your inherited traditions are mistaken requires true humility."
          };
        } else {
          res = {
            diagnostic: "Section VII & XIV Trap: The Tragedy of an Unused Mind",
            surgicalQuestion: "If God created an intelligible universe and equipped you with cognitive capacity, why are you behaving as though investigating that universe is an act of hostility?",
            anomalyTitle: "Physarum Polycephalum (Slime Mold)",
            anomalyLesson: "A brainless slime mold outdesigned human engineers by organic trial and error—showing that adaptive curiosity beats dogmatic overplanning.",
            operationalShift: "God did not give you a brain to stop using it. Worship the Creator by developing the creative and investigative faculties you possess."
          };
        }
      } else {
        // Essay: UNCERTAINTY
        if (text.includes("should have") || text.includes("regret") || text.includes("mistake") || text.includes("stupid")) {
          res = {
            diagnostic: "Section III Violation: The Cruelty of Hindsight Bias",
            surgicalQuestion: "Are you prosecuting your former self using knowledge that only became available after the future revealed itself?",
            anomalyTitle: "The Boltzmann Brain Paradox",
            anomalyLesson: "Human certainty about causality and reality collapses under cosmological scrutiny; judging the past with present clarity is a mathematical illusion.",
            operationalShift: "Self-punishment asks 'How long must I suffer?' Responsibility asks 'What must I change?' Pivot immediately to process refinement."
          };
        } else if (text.includes("already invested") || text.includes("too late") || text.includes("give up") || text.includes("wasted") || text.includes("quit")) {
          res = {
            diagnostic: "Section V Trap: The Sunk Cost Creditor",
            surgicalQuestion: "Is your current suffering actually moving you closer to success, or are you defending the emotional money you already lost?",
            anomalyTitle: "Buridan's Ass",
            anomalyLesson: "A donkey starves halfway between equal food and water because hyper-rational hesitation creates fatal paralysis.",
            operationalShift: "The past is not a creditor you must keep paying. Cut the losses before you sacrifice the future to defend the dead."
          };
        } else if (text.includes("control") || text.includes("anxious") || text.includes("paralyzed") || text.includes("what if") || text.includes("worry")) {
          res = {
            diagnostic: "Section II Alert: The Illusion of Purchased Immunity",
            surgicalQuestion: "Are you researching to gain real insight, or are you desperately trying to buy an impossible guarantee from a universe that owes you none?",
            anomalyTitle: "The Quantum Zeno Effect",
            anomalyLesson: "Continuously observing an unstable particle freezes it in time; obsessively monitoring your anxiety freezes you in the very distress you seek to escape.",
            operationalShift: "Preparation improves probability; it does not purchase immunity. Act with incomplete information rather than stagnating in false security."
          };
        } else {
          res = {
            diagnostic: "Section VII & X Principle: Good Decisions vs Disappointing Outcomes",
            surgicalQuestion: "Given what you reasonably knew at the time, was your decision defensible? If yes, why are you calling an uncertain outcome a character flaw?",
            anomalyTitle: "Braess's Paradox",
            anomalyLesson: "Adding new roads can slow down traffic; sometimes adding options creates congestion while embracing constraints speeds up flow.",
            operationalShift: "Make peace with the unfinished story. You have influence over probabilities, but zero absolute control over outcomes. Keep moving."
          };
        }
      }

      setSparResult(res);
      setSparring(false);
    }, 500);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-brand-primary pb-24">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-20 left-0 right-0 h-1 z-40 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-brand-accent to-amber-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Audio Narrator Dock */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg pb-[env(safe-area-inset-bottom,0px)]">
        <div className="rounded-2xl border border-slate-800 bg-[#0A1120]/95 backdrop-blur-xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2.5 text-white">
          {/* Subtle Scrubber Progress Bar when reading or paused */}
          {chunks.length > 0 && (isPlaying || isPaused) && (
            <div className="w-full bg-slate-800/80 h-1 rounded-full overflow-hidden">
              <div
                className="bg-brand-accent h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round(((currentChunkIndex + 1) / chunks.length) * 100))}%`,
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Play/Pause + Skip Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <button
                onClick={handleSkipBack}
                disabled={currentChunkIndex === 0}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-25 disabled:hover:text-slate-400 transition-colors active:scale-95"
                title="Previous Sentence"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleAudio}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-accent hover:bg-brand-accent-hover flex items-center justify-center text-white shadow-lg shadow-orange-500/30 transition-all flex-shrink-0 active:scale-95"
                title={isPlaying && !isPaused ? "Pause Narration" : "Listen to Essay"}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleSkipForward}
                disabled={currentChunkIndex >= chunks.length - 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-25 disabled:hover:text-slate-400 transition-colors active:scale-95"
                title="Next Sentence"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Track Info & Progress Label */}
            <div className="min-w-0 flex-1 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-heading font-bold tracking-wide text-nqq-coral uppercase truncate">
                  {isPlaying && !isPaused ? "Narrating Essay" : isPaused ? "Paused" : "Audio Reader"}
                </span>
                {isPlaying && !isPaused && (
                  <span className="flex items-end gap-0.5 h-3 flex-shrink-0">
                    <span className="w-0.5 h-full bg-nqq-coral animate-pulse" />
                    <span className="w-0.5 h-2 bg-nqq-coral animate-pulse delay-75" />
                    <span className="w-0.5 h-3 bg-nqq-coral animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-blue-200 truncate font-sans">
                {isPlaying || isPaused
                  ? `Sentence ${currentChunkIndex + 1} of ${chunks.length}`
                  : `${journal.title.split("—")[0].trim()} • ${journal.readingTime}`}
              </p>
            </div>

            {/* Speed & Stop */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              {[1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleChangeSpeed(rate)}
                  className={`px-1.5 sm:px-2 py-1 rounded text-[10px] sm:text-[11px] font-mono font-semibold transition-all ${
                    playbackRate === rate
                      ? "bg-nqq-coral text-white"
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  {rate}x
                </button>
              ))}

              {(isPlaying || isPaused) && (
                <button
                  onClick={handleStopAudio}
                  className="p-1.5 rounded text-blue-200 hover:text-red-400 transition-colors active:scale-95"
                  title="Stop Audio"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reader Container (NileQuest Quarterly White Paper / Card Layout) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation & Toolbar */}
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-gray-500 hover:text-nqq-blue transition-colors px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-nqq-coral" />
            <span>← Back to All Issues</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSerif(!fontSerif)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-heading font-semibold text-gray-700 hover:text-nqq-blue shadow-sm"
            >
              <Type className="w-3.5 h-3.5 text-nqq-coral" />
              <span>{fontSerif ? "Serif" : "Sans"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-heading font-semibold text-gray-700 hover:text-nqq-blue shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span>Print Essay</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-heading font-semibold text-gray-700 hover:text-nqq-blue shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-gray-500" />
              <span>{copiedLink ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Main Article White Card (NileQuest Quarterly Style) */}
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 md:p-14 rounded-2xl shadow-xl border border-gray-200">
          {/* Header Block */}
          <header className="mb-10 pb-8 border-b border-gray-200">
            <p className="text-xs sm:text-sm font-heading font-bold tracking-widest uppercase text-nqq-coral mb-3">
              Vol. I • Quarterly Cover Feature
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-nqq-blue mb-4 font-heading leading-tight tracking-tight">
              {journal.title.split("—")[0].trim()}
            </h1>

            {journal.subtitle && (
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 font-sans italic">
                {journal.subtitle}
              </p>
            )}

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-gray-500 pt-2">
              <span className="flex items-center font-medium">
                <User className="mr-1.5 h-4 w-4 text-nqq-coral" />
                The Author, Crazy Journal
              </span>
              <span className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4 text-nqq-coral" />
                {journal.readingTime}
              </span>
              <span className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4 text-nqq-coral" />
                {journal.created}
              </span>
            </div>

            {/* Captivating Post Thumbnail / Hero Visual Banner */}
            {journal.thumbnail && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 bg-slate-900 shadow-md">
                <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden flex items-center justify-center">
                  <img
                    src={journal.thumbnail}
                    alt={journal.title}
                    className="w-full h-full object-cover object-center opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                    <span className="font-heading font-semibold tracking-wider uppercase text-nqq-coral text-[11px]">
                      The Crazy Journal • Visual Metaphor
                    </span>
                    <span className="font-mono text-[10px] text-slate-300">
                      Editorial Art
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Core Opening Pull Quote */}
            {journal.quote && (
              <div className="mt-8 relative group p-6 rounded-xl bg-gradient-to-r from-blue-50/70 via-white to-red-50/70 border-l-4 border-nqq-coral text-gray-800 font-serif italic text-lg leading-relaxed shadow-sm">
                <p>&ldquo;{journal.quote}&rdquo;</p>
                <button
                  onClick={() => handleCopyQuote(journal.quote)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-nqq-coral shadow-sm"
                  title="Copy Quote Card"
                >
                  {copiedQuote === journal.quote ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </header>

          {/* Essay Body */}
          <article className={`space-y-12 ${fontSerif ? "font-serif" : "font-sans"}`}>
            {journal.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 pt-4"
              >
                {/* Section Title */}
                <div className="flex items-baseline gap-3 mb-6 pb-2 border-b border-gray-100">
                  {section.romanNumeral && (
                    <span className="text-2xl sm:text-3xl font-heading font-extrabold text-nqq-coral">
                      {section.romanNumeral}.
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-bold text-nqq-blue font-heading tracking-tight">
                    {section.title.replace(/^[IVXLCDM0-9]+\.\s*/i, "")}
                  </h2>
                </div>

                {/* Section Paragraphs */}
                <div className="text-gray-800 text-base sm:text-lg leading-[1.85] font-normal flow-root">
                  {section.content.split("\n\n").map((para, pIdx) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;

                    // Bold Takeaway Axiom Box
                    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                      const inner = trimmed.slice(2, -2);
                      return (
                        <div
                          key={pIdx}
                          className="relative group p-6 my-6 rounded-xl bg-blue-50/60 border-l-4 border-nqq-blue text-nqq-blue font-heading font-bold text-lg sm:text-xl leading-relaxed shadow-sm flex items-start justify-between gap-4 clear-both"
                        >
                          <span>{inner}</span>
                          <button
                            onClick={() => handleCopyQuote(inner)}
                            className="opacity-40 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-white hover:bg-gray-50 text-nqq-coral border border-gray-200 flex-shrink-0 shadow-sm"
                            title="Copy Axiom"
                          >
                            {copiedQuote === inner ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      );
                    }

                    // Blockquote
                    if (trimmed.startsWith(">")) {
                      return (
                        <blockquote
                          key={pIdx}
                          className="p-4 my-5 border-l-4 border-nqq-coral bg-gray-50/80 italic font-serif text-gray-800 rounded-r-lg clear-both"
                        >
                          {trimmed.replace(/^>\s*/, "")}
                        </blockquote>
                      );
                    }

                    // Markdown Image: ![caption](url) (Left-aligned with text wrapping)
                    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                    if (imgMatch) {
                      const altText = imgMatch[1];
                      const imgSrc = imgMatch[2];
                      return (
                        <figure
                          key={pIdx}
                          className="float-none sm:float-left w-full sm:w-[46%] md:w-[38%] max-w-[340px] sm:mr-8 mb-6 mt-1 rounded-2xl overflow-hidden border border-gray-200 bg-slate-50/80 p-2.5 shadow-md clear-left"
                        >
                          <img
                            src={imgSrc}
                            alt={altText}
                            className="w-full h-auto max-h-[380px] object-contain rounded-xl mx-auto bg-white"
                            loading="lazy"
                          />
                          {altText && (
                            <figcaption className="text-center text-xs text-gray-600 font-heading font-medium mt-2 pb-0.5 italic leading-snug">
                              — {altText} —
                            </figcaption>
                          )}
                        </figure>
                      );
                    }

                    return (
                      <p key={pIdx} className="mb-5">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>

                {/* Associated Anomaly Mirror Callout */}
                {section.associatedAnomaly && (
                  <div className="mt-8 rounded-xl bg-white border-t-4 border-nqq-coral border-x border-b border-gray-200 p-6 shadow-md font-sans clear-both">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-nqq-coral">
                        <Sparkles className="w-4 h-4 text-nqq-coral" />
                        <span>The Crazy Anomaly Mirror</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-nqq-blue border border-blue-200 font-semibold">
                        {section.associatedAnomaly.category.replace("_", " ")}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-nqq-blue font-heading mb-1">
                      {section.associatedAnomaly.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      {section.associatedAnomaly.weird_factor}
                    </p>
                    <div className="p-4 rounded-lg bg-red-50/50 border border-red-100 text-xs text-gray-800 leading-relaxed flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-nqq-coral flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-nqq-coral font-heading font-bold">Parallels this chapter: </strong>
                        {section.associatedAnomaly.counter_intuitive_lesson}
                      </span>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </article>

          {/* 4-Part Sparring Chamber (Styled in NileQuest Editorial Theme) */}
          <div id="sparring" className="mt-16 rounded-2xl border-t-4 border-nqq-blue border-x border-b border-gray-200 bg-gradient-to-br from-blue-50/50 via-white to-red-50/30 p-6 sm:p-10 font-sans shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-heading font-bold uppercase tracking-widest text-nqq-coral mb-3">
              <Flame className="w-5 h-5 text-nqq-coral" />
              <span>The Sparring Chamber • Intellectual Audit</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-nqq-blue font-heading mb-3">
              Spar with this Essay
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Submit your own situation, dilemma, or counter-argument. The engine will dissect your assumptions
              using the 4-part surgical audit framework.
            </p>

            <div className="space-y-4">
              <textarea
                value={sparInput}
                onChange={(e) => setSparInput(e.target.value)}
                placeholder="e.g. 'I keep telling myself that if I just stick with this losing trade, I will recover my capital...'"
                rows={4}
                className="w-full rounded-xl bg-white border border-gray-300 p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-nqq-coral focus:ring-2 focus:ring-nqq-coral/20 transition-all font-sans resize-none shadow-inner"
              />

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gray-400 font-mono">
                  Evaluated against all core essay axioms
                </span>
                <button
                  onClick={handleSparAudit}
                  disabled={!sparInput.trim() || sparring}
                  className="px-6 py-2.5 rounded-lg bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 text-white text-sm font-heading font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {sparring ? "Conducting Surgical Audit..." : "Audit Thought"}
                </button>
              </div>

              {sparResult && (
                <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-7 space-y-5 shadow-md">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase text-nqq-coral">
                      <CheckCircle2 className="w-4 h-4 text-nqq-coral" />
                      <span>Surgical Audit Verdict</span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400">
                      The Crazy Journal Engine
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-heading uppercase tracking-wider text-nqq-coral font-bold block">
                      1. Cognitive Diagnostic
                    </span>
                    <p className="text-base font-bold text-nqq-blue font-heading">
                      {sparResult.diagnostic}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                    <span className="text-[11px] font-heading uppercase tracking-wider text-nqq-blue font-bold block">
                      2. The Surgical Question
                    </span>
                    <p className="text-sm sm:text-base font-serif italic text-gray-800 leading-relaxed">
                      &ldquo;{sparResult.surgicalQuestion}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-heading uppercase tracking-wider text-gray-500 font-bold block">
                      3. Scientific Mirror: {sparResult.anomalyTitle}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {sparResult.anomalyLesson}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-green-50/60 border border-green-200 space-y-1">
                    <span className="text-[11px] font-heading uppercase tracking-wider text-emerald-700 font-bold block">
                      4. Operational Shift
                    </span>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {sparResult.operationalShift}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Footer Action Strip */}
          <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-heading font-semibold text-gray-700 hover:text-nqq-blue hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              <span>Print Essay</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-nqq-blue hover:bg-blue-900 text-white text-sm font-heading font-bold shadow-md transition-all"
            >
              <span>Explore More Issues</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
