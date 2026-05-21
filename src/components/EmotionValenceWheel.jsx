import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Terminal, ShieldAlert, Heart, Smile, Sparkles } from 'lucide-react';

// Core dictionary mapping word stems to emotional classifications
const LEXICON = {
  // Joy
  happy: { emotion: 'joy', weight: 0.85 },
  joy: { emotion: 'joy', weight: 0.90 },
  great: { emotion: 'joy', weight: 0.70 },
  awesome: { emotion: 'joy', weight: 0.80 },
  brilliant: { emotion: 'joy', weight: 0.85 },
  wonderful: { emotion: 'joy', weight: 0.85 },
  glad: { emotion: 'joy', weight: 0.65 },
  smile: { emotion: 'joy', weight: 0.60 },
  laugh: { emotion: 'joy', weight: 0.65 },
  win: { emotion: 'joy', weight: 0.75 },
  success: { emotion: 'joy', weight: 0.80 },
  stable: { emotion: 'joy', weight: 0.55 },
  excel: { emotion: 'joy', weight: 0.75 },
  proud: { emotion: 'joy', weight: 0.80 },
  satisfy: { emotion: 'joy', weight: 0.70 },
  pleasant: { emotion: 'joy', weight: 0.60 },
  good: { emotion: 'joy', weight: 0.50 },
  cheerful: { emotion: 'joy', weight: 0.75 },
  delight: { emotion: 'joy', weight: 0.80 },
  excit: { emotion: 'joy', weight: 0.80 },
  excited: { emotion: 'joy', weight: 0.80 },
  thrill: { emotion: 'joy', weight: 0.85 },
  thrilled: { emotion: 'joy', weight: 0.85 },
  optimistic: { emotion: 'joy', weight: 0.75 },
  hopeful: { emotion: 'joy', weight: 0.70 },
  bliss: { emotion: 'joy', weight: 0.90 },
  content: { emotion: 'joy', weight: 0.60 },
  positive: { emotion: 'joy', weight: 0.65 },
  thrive: { emotion: 'joy', weight: 0.75 },
  accomplish: { emotion: 'joy', weight: 0.75 },
  victory: { emotion: 'joy', weight: 0.85 },
  celebrate: { emotion: 'joy', weight: 0.80 },
  funny: { emotion: 'joy', weight: 0.60 },
  amuse: { emotion: 'joy', weight: 0.60 },
  jubilant: { emotion: 'joy', weight: 0.85 },

  // Sadness
  sad: { emotion: 'sadness', weight: 0.85 },
  grief: { emotion: 'sadness', weight: 0.90 },
  unhappy: { emotion: 'sadness', weight: 0.80 },
  cry: { emotion: 'sadness', weight: 0.75 },
  tears: { emotion: 'sadness', weight: 0.70 },
  failure: { emotion: 'sadness', weight: 0.80 },
  lost: { emotion: 'sadness', weight: 0.65 },
  broken: { emotion: 'sadness', weight: 0.75 },
  gloomy: { emotion: 'sadness', weight: 0.75 },
  dark: { emotion: 'sadness', weight: 0.55 },
  lonely: { emotion: 'sadness', weight: 0.85 },
  depress: { emotion: 'sadness', weight: 0.90 },
  sorrow: { emotion: 'sadness', weight: 0.85 },
  pain: { emotion: 'sadness', weight: 0.70 },
  bad: { emotion: 'sadness', weight: 0.50 },
  poor: { emotion: 'sadness', weight: 0.50 },
  disappoint: { emotion: 'sadness', weight: 0.75 },
  mourn: { emotion: 'sadness', weight: 0.85 },
  weep: { emotion: 'sadness', weight: 0.80 },
  blue: { emotion: 'sadness', weight: 0.55 },
  downcast: { emotion: 'sadness', weight: 0.70 },
  miserable: { emotion: 'sadness', weight: 0.85 },
  hopeless: { emotion: 'sadness', weight: 0.85 },
  defeat: { emotion: 'sadness', weight: 0.75 },
  heavy: { emotion: 'sadness', weight: 0.60 },
  hurt: { emotion: 'sadness', weight: 0.70 },
  empty: { emotion: 'sadness', weight: 0.65 },

  // Anger
  angry: { emotion: 'anger', weight: 0.85 },
  hate: { emotion: 'anger', weight: 0.90 },
  furious: { emotion: 'anger', weight: 0.95 },
  rage: { emotion: 'anger', weight: 0.95 },
  mad: { emotion: 'anger', weight: 0.75 },
  annoy: { emotion: 'anger', weight: 0.65 },
  upset: { emotion: 'anger', weight: 0.70 },
  bitter: { emotion: 'anger', weight: 0.70 },
  irritat: { emotion: 'anger', weight: 0.65 },
  toxic: { emotion: 'anger', weight: 0.80 },
  chaos: { emotion: 'anger', weight: 0.60 },
  crash: { emotion: 'anger', weight: 0.65 },
  despise: { emotion: 'anger', weight: 0.85 },
  hostile: { emotion: 'anger', weight: 0.85 },
  resent: { emotion: 'anger', weight: 0.75 },
  outrage: { emotion: 'anger', weight: 0.90 },
  scream: { emotion: 'anger', weight: 0.75 },
  yell: { emotion: 'anger', weight: 0.70 },
  insult: { emotion: 'anger', weight: 0.80 },
  violence: { emotion: 'anger', weight: 0.85 },
  agitated: { emotion: 'anger', weight: 0.70 },
  jealous: { emotion: 'anger', weight: 0.70 },
  envy: { emotion: 'anger', weight: 0.65 },
  offend: { emotion: 'anger', weight: 0.75 },

  // Fear
  fear: { emotion: 'fear', weight: 0.85 },
  scared: { emotion: 'fear', weight: 0.80 },
  anxious: { emotion: 'fear', weight: 0.75 },
  worry: { emotion: 'fear', weight: 0.65 },
  nervous: { emotion: 'fear', weight: 0.65 },
  panic: { emotion: 'fear', weight: 0.90 },
  risk: { emotion: 'fear', weight: 0.55 },
  threat: { emotion: 'fear', weight: 0.80 },
  danger: { emotion: 'fear', weight: 0.85 },
  alert: { emotion: 'fear', weight: 0.60 },
  scary: { emotion: 'fear', weight: 0.75 },
  phobia: { emotion: 'fear', weight: 0.90 },
  dread: { emotion: 'fear', weight: 0.80 },
  terrified: { emotion: 'fear', weight: 0.90 },
  horror: { emotion: 'fear', weight: 0.85 },
  creepy: { emotion: 'fear', weight: 0.70 },
  paranoid: { emotion: 'fear', weight: 0.80 },
  vulnerable: { emotion: 'fear', weight: 0.65 },
  warning: { emotion: 'fear', weight: 0.60 },
  fright: { emotion: 'fear', weight: 0.75 },

  // Surprise
  surprise: { emotion: 'surprise', weight: 0.80 },
  shock: { emotion: 'surprise', weight: 0.85 },
  sudden: { emotion: 'surprise', weight: 0.55 },
  wow: { emotion: 'surprise', weight: 0.80 },
  amaze: { emotion: 'surprise', weight: 0.80 },
  predict: { emotion: 'surprise', weight: 0.45 },
  unexpected: { emotion: 'surprise', weight: 0.75 },
  reveal: { emotion: 'surprise', weight: 0.60 },
  disrupt: { emotion: 'surprise', weight: 0.70 },
  incredible: { emotion: 'surprise', weight: 0.80 },
  strange: { emotion: 'surprise', weight: 0.60 },
  unbelievable: { emotion: 'surprise', weight: 0.85 },
  puzzle: { emotion: 'surprise', weight: 0.60 },
  mysterious: { emotion: 'surprise', weight: 0.65 },
  unusual: { emotion: 'surprise', weight: 0.60 },
  dramatic: { emotion: 'surprise', weight: 0.65 },
  stunned: { emotion: 'surprise', weight: 0.80 },
  startle: { emotion: 'surprise', weight: 0.75 },
  marvel: { emotion: 'surprise', weight: 0.75 },

  // Love
  love: { emotion: 'love', weight: 0.90 },
  passion: { emotion: 'love', weight: 0.80 },
  sweet: { emotion: 'love', weight: 0.70 },
  admire: { emotion: 'love', weight: 0.75 },
  adore: { emotion: 'love', weight: 0.85 },
  heart: { emotion: 'love', weight: 0.60 },
  kind: { emotion: 'love', weight: 0.65 },
  warm: { emotion: 'love', weight: 0.60 },
  friendly: { emotion: 'love', weight: 0.65 },
  trust: { emotion: 'love', weight: 0.70 },
  care: { emotion: 'love', weight: 0.65 },
  devote: { emotion: 'love', weight: 0.85 },
  affection: { emotion: 'love', weight: 0.80 },
  cherish: { emotion: 'love', weight: 0.85 },
  intimacy: { emotion: 'love', weight: 0.80 },
  appreciate: { emotion: 'love', weight: 0.75 },
  supportive: { emotion: 'love', weight: 0.70 },
  comfort: { emotion: 'love', weight: 0.65 },
  empathy: { emotion: 'love', weight: 0.75 },
  compassion: { emotion: 'love', weight: 0.80 },
  hug: { emotion: 'love', weight: 0.70 },
  kiss: { emotion: 'love', weight: 0.75 },

  // Emoji dictionary items
  '😂': { emotion: 'joy', weight: 0.90 },
  '😊': { emotion: 'joy', weight: 0.80 },
  '😀': { emotion: 'joy', weight: 0.85 },
  '😁': { emotion: 'joy', weight: 0.85 },
  '😆': { emotion: 'joy', weight: 0.85 },
  '🎉': { emotion: 'joy', weight: 0.90 },
  '🥳': { emotion: 'joy', weight: 0.90 },
  '✨': { emotion: 'joy', weight: 0.70 },
  '💃': { emotion: 'joy', weight: 0.80 },
  '🕺': { emotion: 'joy', weight: 0.80 },
  '😭': { emotion: 'sadness', weight: 0.95 },
  '😢': { emotion: 'sadness', weight: 0.90 },
  '😔': { emotion: 'sadness', weight: 0.80 },
  '😞': { emotion: 'sadness', weight: 0.85 },
  '💔': { emotion: 'sadness', weight: 0.95 },
  '😿': { emotion: 'sadness', weight: 0.80 },
  '😡': { emotion: 'anger', weight: 0.95 },
  '😠': { emotion: 'anger', weight: 0.90 },
  '🤬': { emotion: 'anger', weight: 0.95 },
  '👿': { emotion: 'anger', weight: 0.85 },
  '😱': { emotion: 'fear', weight: 0.95 },
  '😨': { emotion: 'fear', weight: 0.90 },
  '😰': { emotion: 'fear', weight: 0.90 },
  '💀': { emotion: 'fear', weight: 0.75 },
  '👻': { emotion: 'fear', weight: 0.70 },
  '😲': { emotion: 'surprise', weight: 0.90 },
  '😮': { emotion: 'surprise', weight: 0.85 },
  '😳': { emotion: 'surprise', weight: 0.85 },
  '🤯': { emotion: 'surprise', weight: 0.95 },
  '❤️': { emotion: 'love', weight: 0.95 },
  '💖': { emotion: 'love', weight: 0.95 },
  '🥰': { emotion: 'love', weight: 0.95 },
  '😍': { emotion: 'love', weight: 0.95 },
  '💝': { emotion: 'love', weight: 0.90 },
  '💕': { emotion: 'love', weight: 0.90 },
  '💋': { emotion: 'love', weight: 0.95 }
};

// Advanced Phrase/Idiom dictionary
const IDIOMS = [
  // Joy
  { phrase: 'over the moon', emotion: 'joy', weight: 0.90, details: 'over the moon' },
  { phrase: 'on top of the world', emotion: 'joy', weight: 0.90, details: 'on top of the world' },
  { phrase: 'made my day', emotion: 'joy', weight: 0.85, details: 'made my day' },
  { phrase: 'so far so good', emotion: 'joy', weight: 0.65, details: 'so far so good' },
  { phrase: 'happy as a clam', emotion: 'joy', weight: 0.85, details: 'happy as a clam' },
  
  // Sadness
  { phrase: 'down in the dumps', emotion: 'sadness', weight: 0.85, details: 'down in the dumps' },
  { phrase: 'feeling blue', emotion: 'sadness', weight: 0.80, details: 'feeling blue' },
  { phrase: 'heart broken', emotion: 'sadness', weight: 0.90, details: 'heart broken' },
  { phrase: 'crying out loud', emotion: 'sadness', weight: 0.75, details: 'crying out loud' },
  { phrase: 'cry my eyes out', emotion: 'sadness', weight: 0.85, details: 'cry my eyes out' },
  
  // Anger
  { phrase: 'fed up', emotion: 'anger', weight: 0.85, details: 'fed up' },
  { phrase: 'pissed off', emotion: 'anger', weight: 0.90, details: 'pissed off' },
  { phrase: 'on my nerves', emotion: 'anger', weight: 0.75, details: 'on my nerves' },
  { phrase: 'make my blood boil', emotion: 'anger', weight: 0.95, details: 'make my blood boil' },
  { phrase: 'lost my temper', emotion: 'anger', weight: 0.90, details: 'lost my temper' },
  
  // Fear
  { phrase: 'scared to death', emotion: 'fear', weight: 0.95, details: 'scared to death' },
  { phrase: 'on edge', emotion: 'fear', weight: 0.80, details: 'on edge' },
  { phrase: 'scared stiff', emotion: 'fear', weight: 0.90, details: 'scared stiff' },
  { phrase: 'gives me the creeps', emotion: 'fear', weight: 0.85, details: 'gives me the creeps' },
  
  // Love
  { phrase: 'head over heels', emotion: 'love', weight: 0.95, details: 'head over heels' },
  { phrase: 'fall for', emotion: 'love', weight: 0.80, details: 'fall for' },
  { phrase: 'care about', emotion: 'love', weight: 0.75, details: 'care about' },
  { phrase: 'mean the world', emotion: 'love', weight: 0.90, details: 'mean the world' }
];

// Amplifiers, negators, and conjunction lists
const AMPLIFIERS = ['very', 'extremely', 'highly', 'super', 'absolutely', 'really', 'incredibly', 'totally', 'completely', 'intensely', 'much', 'so', 'dramatically', 'extraordinarily'];
const NEGATORS = ['not', 'never', 'no', "don't", 'cannot', "won't", 'hardly', 'lack', 'without', "doesn't", "shouldn't", "couldn't", "isn't", "aren't", "wasn't", "weren't"];
const CONJUNCTIONS = ['but', 'however', 'yet', 'although', 'nevertheless', 'though', 'nonetheless'];

// Map of opposites for negation logic
const OPPOSITES = {
  joy: 'sadness',
  sadness: 'joy',
  love: 'anger',
  anger: 'love',
  surprise: 'fear',
  fear: 'surprise'
};

// Suffixes and prefixes for morphological analysis
const PREFIXES = ['un', 'dis', 'mis', 'non'];

const stemWord = (word) => {
  let w = word.toLowerCase().trim();
  if (w.length <= 2) return w;

  // Plurals and basic inflection
  if (w.endsWith("sses")) w = w.slice(0, -2);
  else if (w.endsWith("ies")) w = w.slice(0, -3) + "y";
  else if (w.endsWith("ss")) {}
  else if (w.endsWith("s") && !w.endsWith("us") && !w.endsWith("as") && !w.endsWith("is")) w = w.slice(0, -1);

  // Past tense and participles
  if (w.endsWith("eed")) {
    w = w.slice(0, -1);
  } else if (w.endsWith("ed")) {
    const base = w.slice(0, -2);
    if (base.endsWith("at") || base.endsWith("bl") || base.endsWith("iz")) {
      w = base + "e"; // e.g. created -> create
    } else if (base.length > 3 && base[base.length - 1] === base[base.length - 2]) {
      w = base.slice(0, -1); // double consonant, e.g. hopped -> hop
    } else {
      w = base;
    }
  } else if (w.endsWith("ing")) {
    const base = w.slice(0, -3);
    if (base.endsWith("at") || base.endsWith("bl") || base.endsWith("iz")) {
      w = base + "e";
    } else if (base.length > 3 && base[base.length - 1] === base[base.length - 2]) {
      w = base.slice(0, -1);
    } else {
      // Reconstruct trailing 'e' for common emotional verbs
      const commonEnds = ['lov', 'amaz', 'amus', 'excit', 'scar', 'hop', 'dread', 'hate', 'adre', 'ador', 'devot', 'valu', 'puzzl', 'stunn'];
      let matched = false;
      for (let end of commonEnds) {
        if (base.endsWith(end)) {
          w = base + "e";
          matched = true;
          break;
        }
      }
      if (!matched) w = base;
    }
  }

  // Y-inflections (adverbs/adjectives)
  if (w.endsWith("ily")) {
    w = w.slice(0, -3) + "y"; // happily -> happy
  } else if (w.endsWith("iness")) {
    w = w.slice(0, -5) + "y"; // happiness -> happy
  } else if (w.endsWith("ier")) {
    w = w.slice(0, -3) + "y"; // angrier -> angry
  } else if (w.endsWith("iest")) {
    w = w.slice(0, -4) + "y"; // angriest -> angry
  }

  // Adverbial & noun suffixes
  if (w.endsWith("fully")) {
    w = w.slice(0, -4); // wonderfully -> wonderful
  } else if (w.endsWith("ment")) {
    w = w.slice(0, -4); // excitement -> excite
  } else if (w.endsWith("ly")) {
    w = w.slice(0, -2); // sadly -> sad
  }

  return w;
};

const analyzeAffixes = (word) => {
  let w = word.toLowerCase().trim();
  
  // 1. Check for negative suffix '-less'
  if (w.endsWith('less') && w.length > 4) {
    const base = w.slice(0, -4);
    const stemmedBase = stemWord(base);
    return { base: stemmedBase, isInverted: true, type: 'suffix', affix: 'less' };
  }

  // 2. Check for negative prefixes
  for (let prefix of PREFIXES) {
    if (w.startsWith(prefix) && w.length > prefix.length + 2) {
      const base = w.slice(prefix.length);
      const stemmedBase = stemWord(base);
      return { base: stemmedBase, isInverted: true, type: 'prefix', affix: prefix };
    }
  }

  return { base: stemWord(w), isInverted: false };
};

// Emotion metadata for visual rendering
const EMOTIONS_METADATA = [
  { name: 'joy', angle: -Math.PI / 2, color: 'var(--accent-cyan)', hex: '#00f0ff', icon: '⚡' },
  { name: 'love', angle: -Math.PI / 2 + Math.PI / 3, color: '#ff007f', hex: '#ff007f', icon: '💖' },
  { name: 'surprise', angle: -Math.PI / 2 + 2 * Math.PI / 3, color: '#ffae00', hex: '#ffae00', icon: '✨' },
  { name: 'fear', angle: -Math.PI / 2 + Math.PI, color: '#bd59ff', hex: '#bd59ff', icon: '🌀' },
  { name: 'sadness', angle: -Math.PI / 2 + 4 * Math.PI / 3, color: '#3b82f6', hex: '#3b82f6', icon: '💧' },
  { name: 'anger', angle: -Math.PI / 2 + 5 * Math.PI / 3, color: '#ef4444', hex: '#ef4444', icon: '🔥' }
];

export default function EmotionValenceWheel() {
  const [inputText, setInputText] = useState(
    'Developing highly intelligent neural systems fills me with pure joy, but I am fearless when facing system crashes! 😂'
  );
  
  const [scores, setScores] = useState({
    joy: 0.15,
    love: 0.15,
    surprise: 0.15,
    fear: 0.15,
    sadness: 0.15,
    anger: 0.15
  });

  const [dominantEmotion, setDominantEmotion] = useState('joy');
  const [tokenMetrics, setTokenMetrics] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [latency, setLatency] = useState(0);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scoresRef = useRef({ joy: 0.15, love: 0.15, surprise: 0.15, fear: 0.15, sadness: 0.15, anger: 0.15 });
  const particlesRef = useRef([]);

  // NLP Semantic Engine
  useEffect(() => {
    const startTime = performance.now();

    // A. Preprocess emojis: pad spaces around them to isolate them as tokens
    let preppedText = inputText;
    const emojisList = Object.keys(LEXICON).filter(k => k.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/));
    emojisList.forEach(emo => {
      preppedText = preppedText.replaceAll(emo, ` ${emo} `);
    });

    // B. Count exclamations & questions
    const exclamationCount = (preppedText.match(/!/g) || []).length;
    const questionCount = (preppedText.match(/\?/g) || []).length;

    // C. Detect ALL CAPS words (excluding punctuation) for intensity multipliers
    const rawWords = preppedText.split(/\s+/).filter(Boolean);
    const allCapsList = rawWords.filter(word => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
      return cleanWord.length > 1 && /^[A-Z\u00C0-\u00DF]+$/.test(cleanWord);
    }).map(w => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ""));

    // D. Multi-word phrase/idiom matching before token separation
    let processedText = preppedText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ");
    const matchedIdiomsList = [];
    IDIOMS.forEach((idiom, idx) => {
      if (processedText.includes(idiom.phrase)) {
        matchedIdiomsList.push({ ...idiom, idx });
        processedText = processedText.replace(new RegExp(idiom.phrase, 'g'), ` __idiom_${idiom.emotion}_${idx}__ `);
      }
    });

    const words = processedText.split(/\s+/).filter(Boolean);

    const activeScores = { joy: 0.15, love: 0.15, surprise: 0.15, fear: 0.15, sadness: 0.15, anger: 0.15 };
    const logs = [];
    const tokensAnalyzed = [];

    logs.push(`>> [NLP_PIPELINE]: Tokenizing character stream (${inputText.length} bytes)...`);
    logs.push(`>> [NLP_PIPELINE]: Extracted ${words.length} lexical node instances.`);
    
    if (exclamationCount > 0) logs.push(`>> [SIGNAL_DETECTOR]: Detected ${exclamationCount} exclamation mark(s) (!). Scaling intensity.`);
    if (questionCount > 0) logs.push(`>> [SIGNAL_DETECTOR]: Detected ${questionCount} question mark(s) (?). Elevating uncertainty vectors.`);
    if (allCapsList.length > 0) logs.push(`>> [SIGNAL_DETECTOR]: Found ${allCapsList.length} capitalized emphasized token(s).`);

    let ampMultiplier = 1.0;
    let amplifierWindow = 0;
    let lastAmpWord = '';

    let isNegated = false;
    let negationWindow = 0;
    let lastNegWord = '';

    let totalTriggersCount = 0;

    words.forEach((word) => {
      // 1. Check for pre-matched idioms
      if (word.startsWith('__idiom_') && word.endsWith('__')) {
        const parts = word.split('_');
        const idiomIdx = parseInt(parts[parts.length - 1], 10);
        const idiom = IDIOMS[idiomIdx];
        if (idiom) {
          let scoreVal = idiom.weight * ampMultiplier;
          let targetEmotion = idiom.emotion;
          
          let logMsg = `Matched phrase '${idiom.phrase}' -> [${targetEmotion.toUpperCase()}] (+${scoreVal.toFixed(2)})`;
          
          const activeNegation = isNegated && negationWindow > 0;
          if (activeNegation) {
            const originalEmotion = targetEmotion;
            targetEmotion = OPPOSITES[originalEmotion] || originalEmotion;
            logMsg = `Inversion: '${lastNegWord}' shifted idiom '${idiom.phrase}' to opposite [${targetEmotion.toUpperCase()}] (+${scoreVal.toFixed(2)})`;
            tokensAnalyzed.push({
              word: idiom.phrase,
              type: 'trigger',
              emotion: targetEmotion,
              details: `Inverted phrase (+${scoreVal.toFixed(1)})`
            });
            isNegated = false;
            negationWindow = 0;
          } else {
            tokensAnalyzed.push({
              word: idiom.phrase,
              type: 'trigger',
              emotion: targetEmotion,
              details: `Phrase trigger (+${scoreVal.toFixed(1)})`
            });
          }

          if (ampMultiplier > 1.0 && amplifierWindow > 0) {
            logMsg += ` [Amplified by '${lastAmpWord}']`;
            ampMultiplier = 1.0;
            amplifierWindow = 0;
          }

          activeScores[targetEmotion] += scoreVal;
          totalTriggersCount++;
          logs.push(`>> [PHRASE_ANALYZER]: ${logMsg}`);
        }
        return;
      }

      // 2. Check for Conjunctions (Discourse weight shift)
      if (CONJUNCTIONS.includes(word)) {
        // Multiply prior accumulated scores by 0.35 (shifting emphasis to upcoming clause)
        for (let key in activeScores) {
          activeScores[key] = Math.max(0.12, activeScores[key] * 0.35);
        }
        logs.push(`>> [DISCOURSE_ANALYZER]: Contrastive marker '${word}' detected. Attenuating prior clause weights by 65%.`);
        tokensAnalyzed.push({ word, type: 'conjunction', details: 'Clause shift (prior scores x0.35)' });
        
        // Reset active modifier windows
        ampMultiplier = 1.0;
        amplifierWindow = 0;
        isNegated = false;
        negationWindow = 0;
        return;
      }

      // 3. Check for Amplifiers
      if (AMPLIFIERS.includes(word)) {
        ampMultiplier = 1.8;
        amplifierWindow = 3;
        lastAmpWord = word;
        tokensAnalyzed.push({ word, type: 'amplifier', details: 'Multiplier x1.8 active' });
        return;
      }

      // 4. Check for Negators
      if (NEGATORS.includes(word)) {
        isNegated = true;
        negationWindow = 3;
        lastNegWord = word;
        tokensAnalyzed.push({ word, type: 'negator', details: 'Valence inverter active' });
        return;
      }

      // 5. Check dictionary matching using affix & stem analysis
      const affixResult = analyzeAffixes(word);
      const matchedBase = affixResult.base;
      
      let matchedStem = null;
      // Exact dictionary check first on morphological root
      if (LEXICON[matchedBase]) {
        matchedStem = matchedBase;
      } else {
        // Fallback substring checks for compound or unstemmed forms
        for (let stem in LEXICON) {
          if (matchedBase === stem || (matchedBase.startsWith(stem) && stem.length >= 4)) {
            matchedStem = stem;
            break;
          }
        }
      }

      if (matchedStem) {
        const item = LEXICON[matchedStem];
        let targetEmotion = item.emotion;
        let baseWeight = item.weight;

        // Apply ALL CAPS emphasis multiplier
        let wordAmp = 1.0;
        if (allCapsList.includes(word)) {
          wordAmp = 1.4;
        }

        let scoreVal = baseWeight * ampMultiplier * wordAmp;
        let logMsg = `Matched stem '${matchedStem}' (raw: '${word}') -> [${targetEmotion.toUpperCase()}] (+${scoreVal.toFixed(2)})`;

        // Resolve inversions (suffix -less, prefix un-, or preceding negators)
        let finalInverted = affixResult.isInverted;
        const activeNegation = isNegated && negationWindow > 0;
        
        if (activeNegation) {
          // Double negations cancel each other out
          finalInverted = !finalInverted;
          isNegated = false;
          negationWindow = 0;
        }

        if (finalInverted) {
          const originalEmotion = targetEmotion;
          targetEmotion = OPPOSITES[originalEmotion] || originalEmotion;
          const cause = affixResult.isInverted ? `Affix '${affixResult.affix}'` : `Negator '${lastNegWord}'`;
          logMsg = `Inversion: ${cause} shifted '${word}' to opposite [${targetEmotion.toUpperCase()}] (+${scoreVal.toFixed(2)})`;
          tokensAnalyzed.push({ 
            word, 
            type: 'trigger', 
            emotion: targetEmotion, 
            details: `Inverted from ${originalEmotion} (+${scoreVal.toFixed(1)})` 
          });
        } else {
          tokensAnalyzed.push({ 
            word, 
            type: 'trigger', 
            emotion: targetEmotion, 
            details: `Triggers ${targetEmotion} (+${scoreVal.toFixed(1)})` 
          });
        }

        if (ampMultiplier > 1.0 && amplifierWindow > 0) {
          logMsg += ` [Amplified by '${lastAmpWord}']`;
          ampMultiplier = 1.0;
          amplifierWindow = 0;
        }
        if (wordAmp > 1.0) {
          logMsg += ` [Casing emphasis x1.4]`;
        }

        activeScores[targetEmotion] += scoreVal;
        totalTriggersCount++;
        logs.push(`>> [VALENCE_ENGINE]: ${logMsg}`);
      } else {
        tokensAnalyzed.push({ word, type: 'normal' });
      }

      // Sliding window ticks
      if (negationWindow > 0) {
        negationWindow--;
        if (negationWindow === 0) isNegated = false;
      }
      if (amplifierWindow > 0) {
        amplifierWindow--;
        if (amplifierWindow === 0) ampMultiplier = 1.0;
      }
    });

    // 6. Apply sentence-level punctuation multipliers
    if (totalTriggersCount > 0) {
      if (exclamationCount > 0) {
        const boost = Math.min(0.25, exclamationCount * 0.05);
        for (let emo in activeScores) {
          if (activeScores[emo] > 0.15) {
            activeScores[emo] += boost;
          }
        }
        logs.push(`>> [SIGNAL_DETECTOR]: Raised emotional valence by +${(boost * 100).toFixed(0)}% due to exclamation counts.`);
      }
      if (questionCount > 0) {
        const qBoost = Math.min(0.20, questionCount * 0.05);
        activeScores['surprise'] += qBoost;
        activeScores['fear'] += qBoost;
        logs.push(`>> [SIGNAL_DETECTOR]: Elevated cognitive uncertainty vectors (Surprise/Fear) by +${(qBoost * 100).toFixed(0)}%.`);
      }
    }

    // 7. Resolve dominant emotion or trigger neutral fallback
    let dom = 'joy';
    if (totalTriggersCount === 0) {
      dom = 'neutral';
      logs.push(`>> [INFERENCE]: No active emotional tokens matched. Standardizing balanced neutral configuration.`);
    } else {
      const maxVal = Math.max(...Object.values(activeScores));
      for (let emo in activeScores) {
        if (activeScores[emo] === maxVal) dom = emo;
      }
      logs.push(`>> [INFERENCE]: Dominant prediction -> ${dom.toUpperCase()} (${(activeScores[dom] * 100).toFixed(0)}%)`);
    }

    // Clamp scores safely
    for (let emo in activeScores) {
      activeScores[emo] = Math.min(1.0, Math.max(0.12, activeScores[emo]));
    }

    setScores(activeScores);
    setDominantEmotion(dom);
    setTokenMetrics(tokensAnalyzed);
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    setLatency(duration);

    logs.push(`>> [SYS]: Compute pipeline fully stable. Latency: ${duration}ms`);
    setConsoleLogs(logs);

  }, [inputText]);

  // Handle dynamic radar canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resizeCanvas = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 320;
      }
    };

    // Initialize/update background particles floating towards dominant emotion node
    const updateParticles = (centerX, centerY, targetR) => {
      if (particlesRef.current.length < 25) {
        const fallbackHex = dominantEmotion === 'neutral' ? '#ffffff' : (EMOTIONS_METADATA.find(e => e.name === dominantEmotion)?.hex || '#00f0ff');
        particlesRef.current.push({
          x: centerX + (Math.random() - 0.5) * 80,
          y: centerY + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 0.8 + 0.2,
          color: fallbackHex
        });
      }

      particlesRef.current.forEach((p, idx) => {
        const activeEmo = EMOTIONS_METADATA.find(e => e.name === dominantEmotion);
        if (activeEmo) {
          const domWeight = scoresRef.current[dominantEmotion] || 0.15;
          const targetX = centerX + Math.cos(activeEmo.angle) * (targetR * domWeight);
          const targetY = centerY + Math.sin(activeEmo.angle) * (targetR * domWeight);
          
          p.vx += (targetX - p.x) * 0.0003;
          p.vy += (targetY - p.y) * 0.0003;
        } else {
          // Neutral: slow orbital float towards the origin center
          p.vx += (centerX - p.x) * 0.0001;
          p.vy += (centerY - p.y) * 0.0001;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= 0.004;

        if (p.life <= 0) {
          const activeEmoNew = EMOTIONS_METADATA.find(e => e.name === dominantEmotion);
          const fallbackHex = dominantEmotion === 'neutral' ? '#ffffff' : (activeEmoNew?.hex || '#00f0ff');
          particlesRef.current[idx] = {
            x: centerX + (Math.random() - 0.5) * 60,
            y: centerY + (Math.random() - 0.5) * 60,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            life: Math.random() * 0.8 + 0.2,
            color: fallbackHex
          };
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.38;

      // 1. Interpolate rendering scores (Lerp for smooth warping morph effect)
      EMOTIONS_METADATA.forEach(emo => {
        const key = emo.name;
        // If neutral, lerp all axes to a baseline symmetric value of 0.25 to show a beautiful resting hexagon
        const target = dominantEmotion === 'neutral' ? 0.25 : (scores[key] || 0.15);
        scoresRef.current[key] += (target - scoresRef.current[key]) * 0.085;
      });

      // 2. Draw radar concentric hexagons (Web scales)
      const concentricScale = [0.2, 0.4, 0.6, 0.8, 1.0];
      ctx.shadowBlur = 0;
      concentricScale.forEach(scale => {
        ctx.beginPath();
        EMOTIONS_METADATA.forEach((emo, idx) => {
          const x = centerX + Math.cos(emo.angle) * (baseRadius * scale);
          const y = centerY + Math.sin(emo.angle) * (baseRadius * scale);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${scale === 1.0 ? 0.08 : 0.035})`;
        ctx.lineWidth = scale === 1.0 ? 1 : 0.5;
        ctx.stroke();
      });

      // 3. Draw Axis Rays
      EMOTIONS_METADATA.forEach(emo => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(emo.angle) * baseRadius,
          centerY + Math.sin(emo.angle) * baseRadius
        );
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // 4. Update and Draw floating particles
      updateParticles(centerX, centerY, baseRadius);
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.life * 2), 0, Math.PI * 2);
        const alphaHex = Math.floor(p.life * 0.45 * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = p.color + alphaHex;
        ctx.fill();
      });

      // 5. Build and draw the Morphing Emotion Valence Polygon
      const polygonVertices = EMOTIONS_METADATA.map(emo => {
        const val = scoresRef.current[emo.name] || 0.15;
        return {
          x: centerX + Math.cos(emo.angle) * (baseRadius * val),
          y: centerY + Math.sin(emo.angle) * (baseRadius * val),
          color: emo.hex
        };
      });

      ctx.beginPath();
      polygonVertices.forEach((v, idx) => {
        if (idx === 0) ctx.moveTo(v.x, v.y);
        else ctx.lineTo(v.x, v.y);
      });
      ctx.closePath();

      // Determine active stroke and glow color
      const activeEmo = EMOTIONS_METADATA.find(e => e.name === dominantEmotion);
      const activeColor = dominantEmotion === 'neutral' 
        ? 'rgba(255, 255, 255, 0.7)' 
        : (activeEmo?.hex || '#00f0ff');

      ctx.fillStyle = dominantEmotion === 'neutral' 
        ? 'rgba(255, 255, 255, 0.04)' 
        : activeColor + '1a'; // 10% opacity fills
      ctx.fill();

      // Glow strokes
      ctx.shadowBlur = dominantEmotion === 'neutral' ? 8 : 15;
      ctx.shadowColor = dominantEmotion === 'neutral' ? '#ffffff' : activeColor;
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset glow

      // 6. Draw axis nodes and emotional labels
      EMOTIONS_METADATA.forEach(emo => {
        const val = scoresRef.current[emo.name] || 0.15;
        const x = centerX + Math.cos(emo.angle) * (baseRadius * val);
        const y = centerY + Math.sin(emo.angle) * (baseRadius * val);
        const isDominant = emo.name === dominantEmotion;

        // Draw axis node point
        ctx.beginPath();
        ctx.arc(x, y, isDominant ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = dominantEmotion === 'neutral' ? 'rgba(255, 255, 255, 0.6)' : emo.hex;
        if (isDominant) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = emo.hex;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Outer pulse circle for dominant node
        if (isDominant) {
          ctx.beginPath();
          ctx.arc(x, y, 10 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = emo.hex + '55';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw static text anchor position (edge of base radius)
        const textDistance = baseRadius + 18;
        const textX = centerX + Math.cos(emo.angle) * textDistance;
        const textY = centerY + Math.sin(emo.angle) * textDistance;

        ctx.font = isDominant ? 'bold 10px var(--font-mono)' : '9px var(--font-mono)';
        ctx.fillStyle = isDominant ? '#ffffff' : 'var(--text-secondary)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const labelScore = dominantEmotion === 'neutral' ? 0.0 : val;
        ctx.fillText(`${emo.icon} ${emo.name.toUpperCase()} (${(labelScore * 100).toFixed(0)}%)`, textX, textY);
      });

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scores, dominantEmotion]);

  return (
    <div ref={containerRef} style={styles.container} className="glass-panel">
      {/* Visual Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={14} color="var(--accent-cyan)" />
          <span style={styles.title}>LIVE_NLP_EMOTION_VALENCE_WHEEL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={styles.statusBadge}>INFERENCE_SPEED: {latency}ms</span>
          <span style={styles.stabilityDot} />
        </div>
      </div>

      <div style={styles.labLayout}>
        {/* Left Column: Input and Parsed Tokens */}
        <div style={styles.interactiveArea}>
          <span style={styles.label}>INPUT TEXT STREAM FOR LEXICAL EVALUATION:</span>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={styles.textArea}
            maxLength={180}
          />
          
          <div style={styles.tokenSection}>
            <span style={styles.label}>NLP PARSED NODES:</span>
            <div style={styles.tokensGrid}>
              <AnimatePresence>
                {tokenMetrics.map((t, idx) => {
                  let pillColor = 'rgba(255, 255, 255, 0.02)';
                  let borderColor = 'rgba(255, 255, 255, 0.05)';
                  let textColor = 'var(--text-secondary)';

                  if (t.type === 'amplifier') {
                    pillColor = 'rgba(255, 174, 0, 0.05)';
                    borderColor = 'rgba(255, 174, 0, 0.3)';
                    textColor = '#ffae00';
                  } else if (t.type === 'negator') {
                    pillColor = 'rgba(239, 68, 68, 0.05)';
                    borderColor = 'rgba(239, 68, 68, 0.3)';
                    textColor = '#ef4444';
                  } else if (t.type === 'trigger') {
                    const emoMeta = EMOTIONS_METADATA.find(e => e.name === t.emotion);
                    pillColor = emoMeta ? `${emoMeta.hex}12` : 'rgba(255, 255, 255, 0.08)';
                    borderColor = emoMeta ? `${emoMeta.hex}44` : 'rgba(255, 255, 255, 0.3)';
                    textColor = emoMeta?.hex || '#fff';
                  }

                  return (
                    <motion.div
                      key={idx}
                      className="glass-panel"
                      style={{
                        ...styles.tokenPill,
                        backgroundColor: pillColor,
                        borderColor: borderColor
                      }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.015 }}
                    >
                      <span style={{ ...styles.pillText, color: textColor }}>{t.word}</span>
                      {t.type !== 'normal' && (
                        <span style={styles.pillSubText}>[{t.details || t.type}]</span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Canvas Radar Wheel & Telemetry */}
        <div style={styles.visualizerArea}>
          <div style={styles.canvasContainer}>
            <canvas ref={canvasRef} style={styles.canvas} />
            <span style={styles.canvasHint}>MORPHING MATRIX GRAPH (LERP ACTIVE)</span>
          </div>

          {/* Cyber Telemetry Terminal */}
          <div style={styles.telemetryCard}>
            <div style={styles.telemetryCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Terminal size={12} color="var(--accent-purple)" />
                <span>VALENCE_MODEL_LOG_STREAM</span>
              </div>
              <Activity size={12} color="#10b981" style={{ animation: 'pulse 1.5s infinite' }} />
            </div>
            
            <div style={styles.telemetrySplit}>
              {/* Left Side: Dominant Badge */}
              <div style={styles.dominantCol}>
                <span style={styles.telemetryLabel}>DOMINANT_VECTOR</span>
                <div 
                  style={{
                    ...styles.dominantBadge,
                    borderColor: dominantEmotion === 'neutral' ? 'rgba(255,255,255,0.4)' : (EMOTIONS_METADATA.find(e => e.name === dominantEmotion)?.hex || 'var(--accent-cyan)'),
                    boxShadow: dominantEmotion === 'neutral' ? '0 0 6px rgba(255,255,255,0.1)' : `0 0 10px ${EMOTIONS_METADATA.find(e => e.name === dominantEmotion)?.hex}33`,
                    backgroundColor: dominantEmotion === 'neutral' ? 'rgba(255,255,255,0.02)' : `${EMOTIONS_METADATA.find(e => e.name === dominantEmotion)?.hex}08`
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>
                    {dominantEmotion === 'neutral' ? '⚪' : (EMOTIONS_METADATA.find(e => e.name === dominantEmotion)?.icon || '⚪')}
                  </span>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontWeight: 'bold', 
                    fontSize: '1rem',
                    color: dominantEmotion === 'neutral' ? '#ffffff' : (EMOTIONS_METADATA.find(e => e.name === dominantEmotion)?.hex || '#fff') 
                  }}>
                    {dominantEmotion.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Right Side: Log Lines */}
              <div style={styles.terminalLogs}>
                {consoleLogs.map((log, lIdx) => (
                  <div key={lIdx} style={styles.logLine}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: '450px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#fff',
  },
  statusBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--accent-cyan)',
    fontWeight: '700',
  },
  stabilityDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 6px #10b981',
    animation: 'pulse 1.8s infinite',
  },
  labLayout: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '5fr 7fr',
    alignItems: 'stretch',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    }
  },
  interactiveArea: {
    padding: '1.25rem',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
    '@media (max-width: 900px)': {
      borderRight: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    }
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    textAlign: 'left',
  },
  textArea: {
    width: '100%',
    height: '90px',
    backgroundColor: '#020204',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '6px',
    padding: '0.75rem',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.92rem',
    outline: 'none',
    resize: 'none',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
    lineHeight: '1.5',
    ':focus': {
      borderColor: 'var(--accent-cyan)',
    }
  },
  tokenSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  tokensGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
    maxHeight: '180px',
    overflowY: 'auto',
    paddingRight: '0.2rem',
    alignContent: 'flex-start',
  },
  tokenPill: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    border: '1px solid var(--border-color)',
    transition: 'all 0.2s',
  },
  pillText: {
    fontSize: '0.78rem',
    fontWeight: '500',
  },
  pillSubText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.55rem',
    color: 'var(--text-muted)',
    marginTop: '0.05rem',
  },
  visualizerArea: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  canvasContainer: {
    height: '320px',
    backgroundColor: '#020205',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    position: 'relative',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  canvasHint: {
    position: 'absolute',
    top: '0.5rem',
    left: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  telemetryCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    padding: '0.75rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  telemetryCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    fontWeight: '700',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.4rem',
    marginBottom: '0.6rem',
  },
  telemetrySplit: {
    display: 'grid',
    gridTemplateColumns: '3fr 7fr',
    gap: '1rem',
    alignItems: 'center',
    '@media (max-width: 500px)': {
      gridTemplateColumns: '1fr',
    }
  },
  dominantCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  telemetryLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.58rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  dominantBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    border: '1px solid',
    borderRadius: '6px',
    padding: '0.6rem 0.4rem',
    minHeight: '56px',
  },
  terminalLogs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    color: '#a7f3d0',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    maxHeight: '75px',
    overflowY: 'auto',
    backgroundColor: '#020204',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  logLine: {
    lineHeight: '1.4',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textAlign: 'left',
  }
};
