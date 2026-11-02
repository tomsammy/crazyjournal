export interface AnomalyItem {
  id: string;
  title: string;
  outlet: string;
  category: "science_anomaly" | "bizarre_history" | "psychology_anomaly" | "paradox" | "contrarian_essay";
  summary: string;
  weird_factor: string;
  parallel_themes: string[];
  counter_intuitive_lesson: string;
  source: string;
  relevance_score?: number;
}

export const SEED_ANOMALIES: AnomalyItem[] = [
  {
    id: "boltzmann-brain",
    title: "The Boltzmann Brain Paradox: You Are a Cosmic Hallucination",
    outlet: "Cosmological Thermodynamics",
    category: "science_anomaly",
    summary:
      "In statistical thermodynamics, thermal fluctuations make it statistically vastly more probable for random vacuum chaos to spontaneously fluctuate into existence a single isolated conscious brain complete with false memories of an entire life and universe, than for an entire universe of trillions of stars and planets to evolve from the Big Bang.",
    weird_factor: "Mathematically, you are vastly more likely to be a floating disembodied brain hallucinating right now than a biological human on Earth.",
    parallel_themes: ["existential", "dread", "solipsism", "reality", "overthinking", "anxiety", "meaning"],
    counter_intuitive_lesson:
      "Your certainty about external status, social judgment, and mundane anxieties is mathematically absurd. Treating your temporary mental panics with grave solemnity ignores how fundamentally bizarre and fragile conscious existence actually is.",
    source: "https://en.wikipedia.org/wiki/Boltzmann_brain",
  },
  {
    id: "alien-hand-syndrome",
    title: "Alien Hand Syndrome: The Autonomous Rebel Limb",
    outlet: "Neuropsychiatry",
    category: "psychology_anomaly",
    summary:
      "Alien hand syndrome is a neurological disorder where one of a person's hands acts completely involuntarily with its own apparent independent conscious agenda. While the right hand buttons a shirt, the alien left hand unbuttons it; patients have had to physically sit on their own hand to prevent it from slapping themselves or grabbing strangers.",
    weird_factor: "Part of your physical anatomy operates as an independent conscious agent actively sabotaging your commands.",
    parallel_themes: ["self_sabotage", "conflict", "willpower", "fragmentation", "control", "habits"],
    counter_intuitive_lesson:
      "You are not a single unified entity. The human mind is an uneasy confederation of competing neural sub-modules. When you self-sabotage, it is not moral weakness—it is an autonomous neural circuit executing its own contradictory agenda.",
    source: "https://en.wikipedia.org/wiki/Alien_hand_syndrome",
  },
  {
    id: "mpemba-effect",
    title: "The Mpemba Effect: Boiling Water Freezes Faster Than Cold",
    outlet: "Non-Linear Thermodynamics",
    category: "science_anomaly",
    summary:
      "In 1963, Tanzanian student Erasto Mpemba proved that under specific conditions, boiling water cools and freezes faster than room-temperature water. Initially mocked by teachers, his observation overturned centuries of classical assumptions, driven by anomalous hydrogen bonding and convection currents.",
    weird_factor: "A system starting with extreme thermal chaos reaches stillness faster than one starting near calm.",
    parallel_themes: ["burnout", "chaos", "recovery", "intense", "transformation", "stress"],
    counter_intuitive_lesson:
      "High emotional turbulence does not mean it will take longer to regain composure. Often, an acute, intense release precipitates crystalline clarity faster than lingering in lukewarm stagnation.",
    source: "https://en.wikipedia.org/wiki/Mpemba_effect",
  },
  {
    id: "tanganyika-laughter-1962",
    title: "The 1962 Tanganyika Laughter Epidemic",
    outlet: "Mass Psychogenic Events",
    category: "bizarre_history",
    summary:
      "In 1962, at a girls' boarding school in Tanganyika (now Tanzania), three students started laughing uncontrollably. The laughter spread across the student body, causing weeping, fainting, and respiratory attacks. The school was forced to shut down, but the contagion spread to neighboring villages, afflicting over 1,000 people and lasting over six months.",
    weird_factor: "Laughter transformed into an involuntary disabling contagion that paralyzed civil infrastructure.",
    parallel_themes: ["contagion", "stress", "hysteria", "social", "unconscious", "pressure", "breakdown"],
    counter_intuitive_lesson:
      "When cultural or environmental tension becomes unbearable, human physiology will discharge the pressure through the most bizarre, seemingly inappropriate behavioral symptoms.",
    source: "https://en.wikipedia.org/wiki/Tanganyika_laughter_epidemic",
  },
  {
    id: "halifax-slasher-1938",
    title: "The Halifax Slasher: The Phantom Assailant of 1938",
    outlet: "Sociological Mass Hysteria",
    category: "bizarre_history",
    summary:
      "In November 1938, residents of Halifax, England reported violent razor-blade attacks by a mysterious prowler. Over two weeks, dozens of victims came forward with lacerations and slashed clothing, sparking armed vigilante patrols and a Scotland Yard manhunt. Investigators discovered the truth: there was no attacker. Every victim had inflicted wounds on themselves due to shared hysteria.",
    weird_factor: "An entire industrial city mobilized against a phantom attacker created entirely by shared paranoia.",
    parallel_themes: ["paranoia", "victimhood", "imagined_enemies", "fear", "anxiety", "drama"],
    counter_intuitive_lesson:
      "When your mind is convinced you are being undermined or persecuted, your subconscious will manufacture the evidence and wounds to validate your internal fear.",
    source: "https://en.wikipedia.org/wiki/Halifax_Slasher",
  },
  {
    id: "quantum-zeno-effect",
    title: "The Quantum Zeno Effect: Freezing Reality Through Observation",
    outlet: "Quantum Physics",
    category: "science_anomaly",
    summary:
      "In quantum mechanics, an unstable particle will NEVER decay as long as it is continuously observed. Repeated measurement acts like an instant reset button on the quantum wave function, effectively freezing the system in its initial state and stopping time from unfolding.",
    weird_factor: "Merely looking at something repeatedly literally prevents reality from changing.",
    parallel_themes: ["anxiety", "control", "paralysis", "overthinking", "stagnation", "panic", "fear"],
    counter_intuitive_lesson:
      "By obsessively monitoring your anxiety or repeatedly checking if you're feeling better, you act like the quantum observer—actively freezing yourself in the very state of distress you are desperate to escape.",
    source: "https://en.wikipedia.org/wiki/Quantum_Zeno_effect",
  },
  {
    id: "cotard-delusion",
    title: "Cotard's Delusion: Walking Corpse Syndrome",
    outlet: "Neuropsychiatry",
    category: "psychology_anomaly",
    summary:
      "First documented by neurologist Jules Cotard in 1880, patients with Cotard's syndrome hold the unshakable conviction that they do not exist, are already dead, have lost their internal organs, or have rotting flesh. Caused by a complete disconnect between the brain's facial/sensory recognition and emotional processing circuits.",
    weird_factor: "A living, breathing human being looks in the mirror and genuinely believes they are an empty rotting corpse.",
    parallel_themes: ["numbness", "depression", "apathy", "dissociation", "existential", "empty"],
    counter_intuitive_lesson:
      "Feeling 'dead inside' or detached from reality is not an objective philosophical truth—it is merely a sensory-emotional calibration glitch in your neural hardware.",
    source: "https://en.wikipedia.org/wiki/Cotard%27s_delusion",
  },
  {
    id: "great-emu-war-1932",
    title: "The Great Emu War of 1932: Military Defeat by Birds",
    outlet: "Military Anomalies",
    category: "bizarre_history",
    summary:
      "In 1932, the Australian military deployed soldiers armed with Lewis machine guns and 10,000 rounds of ammunition to eradicate 20,000 emus destroying wheat crops. The emus adopted split-squad guerrilla tactics, outrunning military trucks and scattering into brush. The army was humiliated and withdrew having killed only a fraction. The birds won.",
    weird_factor: "A modern industrialized army with automatic heavy weaponry was defeated by flightless birds with no commanding general.",
    parallel_themes: ["brute_force", "ego", "overconfidence", "strategy", "failure", "humility"],
    counter_intuitive_lesson:
      "Applying centralized brute force to a fluid, chaotic problem always ends in humiliating failure. Distributed decentralization and agility beat heavy force.",
    source: "https://en.wikipedia.org/wiki/Emu_War",
  },
  {
    id: "boston-molasses-flood-1919",
    title: "The Great Molasses Flood: The 35-MPH Sweet Tsunami",
    outlet: "Urban Catastrophes",
    category: "bizarre_history",
    summary:
      "In 1919, a massive 50-foot steel tank holding 2.3 million gallons of fermenting molasses ruptured in Boston's North End. A 25-foot tidal wave of viscous molasses surged through streets at 35 mph, destroying buildings, lifting train tracks, and killing 21 people.",
    weird_factor: "A thick baking sweetener transformed into a supersonic, lethal tsunami that flattened city blocks.",
    parallel_themes: ["slow_threats", "neglect", "accumulation", "sudden_crisis", "inertia"],
    counter_intuitive_lesson:
      "Things that seem harmless, sweet, or slow-moving can, under sustained unaddressed pressure, unleash devastating kinetic violence. Pay attention to what is quietly fermenting in your life.",
    source: "https://en.wikipedia.org/wiki/Great_Molasses_Flood",
  },
  {
    id: "braess-paradox",
    title: "Braess's Paradox: Adding Roads Increases Traffic",
    outlet: "Game Theory & Network Science",
    category: "paradox",
    summary:
      "Discovered by mathematician Dietrich Braess in 1968, adding a new road or shortcut to a congested traffic network can paradoxically slow down the average journey time for everyone. Closing roads in Seoul, New York, and Stuttgart actually improved traffic flow.",
    weird_factor: "Removing options and eliminating shortcuts speeds up the entire network.",
    parallel_themes: ["options", "productivity", "habits", "congestion", "paralysis", "indecision", "simplicity"],
    counter_intuitive_lesson:
      "Adding more tools, more habits, more productivity hacks, or more options to your life often exacerbates mental gridlock. Closing paths and constraining choices is the fastest route to flow.",
    source: "https://en.wikipedia.org/wiki/Braess%27s_paradox",
  },
  {
    id: "blindsight-paradox",
    title: "Blindsight: Seeing Without Conscious Sight",
    outlet: "Cognitive Neuroscience",
    category: "psychology_anomaly",
    summary:
      "Patients with damage to their primary visual cortex are completely blind in parts of their visual field. Yet, when researchers ask them to guess whether an obstacle is present or what direction a light is moving, their accuracy exceeds 90%. They vehemently insist they are merely guessing, yet their subconscious motor system navigates the room without tripping.",
    weird_factor: "The brain can possess complete, accurate sensory intelligence while the conscious ego remains 100% in the dark.",
    parallel_themes: ["imposter", "fraud", "doubt", "intuition", "competence", "trust", "unconscious"],
    counter_intuitive_lesson:
      "Your conscious mind is often the last to know what your nervous system has already mastered. You don't need conscious certainty or validation to act with profound competence.",
    source: "https://en.wikipedia.org/wiki/Blindsight",
  },
  {
    id: "time-crystals",
    title: "Time Crystals: Eternal Motion Without Energy",
    outlet: "Frontier Quantum Physics",
    category: "science_anomaly",
    summary:
      "First proposed by Nobel laureate Frank Wilczek in 2012, time crystals are quantum systems whose lowest-energy ground state repeats periodically in time without consuming or expending any net energy. They violate time-translation symmetry, remaining in perpetual motion.",
    weird_factor: "They oscillate forever at absolute zero ground state without violating thermodynamics.",
    parallel_themes: ["routine", "habits", "exhaustion", "loop", "stuck", "repetitive", "burnout"],
    counter_intuitive_lesson:
      "Certain behavioural and mental loops require zero mental energy to maintain. Once an oscillation is locked into your ground state, it will tick forever on autopilot until broken by an external shock.",
    source: "https://en.wikipedia.org/wiki/Time_crystal",
  },
  {
    id: "buridans-ass",
    title: "Buridan's Ass: Starvation by Perfect Reason",
    outlet: "Philosophical Paradox",
    category: "paradox",
    summary:
      "A classical paradox: A donkey that is equally thirsty and hungry is placed exactly halfway between a stack of hay and a bucket of water. Because reason provides no logical bias to choose food over water or water over food, the donkey remains paralyzed by perfect symmetry and starves to death.",
    weird_factor: "Absolute, flawless rationality leads directly to total paralysis and death.",
    parallel_themes: ["career", "choice", "options", "paralyzed", "perfectionism", "stuck", "decision"],
    counter_intuitive_lesson:
      "Waiting for a perfectly optimal reason to make a decision is fatal. Suboptimal, arbitrary action beats mathematically perfect paralysis every single time.",
    source: "https://en.wikipedia.org/wiki/Buridan%27s_ass",
  },
  {
    id: "wheelers-delayed-choice",
    title: "Wheeler's Delayed-Choice: The Present Rewriting the Past",
    outlet: "Cosmological Physics",
    category: "science_anomaly",
    summary:
      "Physicist John Archibald Wheeler proved via experiment that a measurement made in the present dictates whether a photon traveled as a wave through both slits or as a particle through one slit billions of years ago from distant quasars.",
    weird_factor: "Decisions made right now retroactively dictate physical history.",
    parallel_themes: ["regret", "past", "mistakes", "guilt", "meaning", "forgiveness"],
    counter_intuitive_lesson:
      "The meaning and causal reality of past events are not carved in stone. How you observe and frame your past today literally retroactively defines whether that past was a tragedy or essential preparation.",
    source: "https://en.wikipedia.org/wiki/Wheeler%27s_delayed-choice_experiment",
  },
  {
    id: "physarum-subway",
    title: "Physarum Polycephalum: The Slime Mold City Planner",
    outlet: "Biological Systems",
    category: "science_anomaly",
    summary:
      "Japanese researchers placed oat flakes on a map corresponding to the cities surrounding Tokyo and placed a single-celled, brainless slime mold at the center. In hours, the organism formed nutrient tubes that almost perfectly mirrored the multi-decade Tokyo rail system.",
    weird_factor: "Brainless yellow sludge solved complex topological urban optimization better than human engineering teams.",
    parallel_themes: ["overthinking", "planning", "uncertainty", "direction", "imposter"],
    counter_intuitive_lesson:
      "You don't need a master plan with conscious certainty to navigate complex life terrain. Decentralized, adaptive trial-and-error routinely outperforms hyper-rational overthinking.",
    source: "https://en.wikipedia.org/wiki/Physarum_polycephalum",
  },
  {
    id: "dancing-plague-1518",
    title: "The Dancing Plague of 1518",
    outlet: "Historical Psychogenic Hysteria",
    category: "bizarre_history",
    summary:
      "In July 1518, hundreds of citizens in Strasbourg began dancing fervently without music in scorching heat for weeks until collapsing from exhaustion. City authorities hired musicians thinking they had to dance it out, which only accelerated the psychological contagion.",
    weird_factor: "Hundreds of people literally danced themselves to death due to collective social dread.",
    parallel_themes: ["bandwagon", "social", "crowd", "peer", "pressure", "conformity", "trends"],
    counter_intuitive_lesson:
      "Human behavior is hyper-infectious. What feels like an organic personal impulse is often collective emotional contagion.",
    source: "https://en.wikipedia.org/wiki/Dancing_plague_of_1518",
  },
];
