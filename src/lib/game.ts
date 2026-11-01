export type ElementType = '炎' | '土' | '雷' | '草' | '氷' | '水' | '闇' | '光' | '無';
export type School = '剛流' | '雅流' | '柔流' | '荒流' | '速流' | '変流' | '奇流';

export interface Stats {
  power: number;
  speed: number;
  stamina: number;
  technique: number;
  wisdom: number;
}

export interface Monster {
  id: string;
  char: string;
  colorHex: string;
  fontId: string;
  fontLabel: string;
  elementType: ElementType;
  school: School;
  trait: string;
  specialMove: string;
  stats: Stats;
  bond: number;
  condition: number;
  day: number;
  stage: number;
  wins: number;
  losses: number;
  generation: number;
  isBred: boolean;
  lineage?: string;
  source?: 'generated' | 'fusion' | 'cleared' | 'gameover';
  runEnded?: 'cleared' | 'gameover';
  awaitingBattle?: boolean;
  createdAt: string;
  published?: boolean;
}

export interface PublicMonster {
  docId: string;
  monsterId: string;
  ownerUid: string;
  ownerName: string;
  char: string;
  colorHex: string;
  fontId: string;
  fontLabel: string;
  elementType: ElementType;
  school: School;
  trait: string;
  specialMove: string;
  stats: Stats;
  total: number;
  wins: number;
  losses: number;
  generation: number;
  isBred: boolean;
  sample?: boolean;
}

export interface GameState {
  wallet: number;
  active: Monster | null;
  collection: Monster[];
  hibernation: Monster[];
  hall: Monster[];
  displayName: string;
  tutorialSeen: boolean;
  ghostRewardDate: string;
  ghostRewardCount: number;
  lastEvent: string;
  lastMojika: string;
}

export interface FontOption {
  id: string;
  label: string;
  school: School;
  stack: string;
  hint: string;
}

export const FONTS: FontOption[] = [
  { id: 'gothic', label: 'ゴシック', school: '剛流', stack: '"Noto Sans JP", "Hiragino Sans", sans-serif', hint: '剛流：バランスよく堅実' },
  { id: 'mincho', label: '明朝', school: '雅流', stack: '"Shippori Mincho", "Hiragino Mincho ProN", "Yu Mincho", serif', hint: '雅流：命中と会心に優れる' },
  { id: 'round', label: '丸ゴシック', school: '柔流', stack: '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif', hint: '柔流：粘り強く、なつきが力になる' },
  { id: 'brush', label: '筆文字', school: '荒流', stack: '"Yuji Syuku", "Kaiti SC", "YuKyokasho", "Hiragino Mincho ProN", serif', hint: '荒流：一撃が重いが荒い' },
  { id: 'pop', label: 'ポップ', school: '速流', stack: '"Mochiy Pop One", "Arial Rounded MT Bold", "Hiragino Sans", sans-serif', hint: '速流：素早く連撃を狙う' },
  { id: 'hand', label: '手書き', school: '変流', stack: '"Yomogi", "Comic Sans MS", "Hiragino Maru Gothic ProN", cursive', hint: '変流：毎ターン何かが起こる' },
  { id: 'dot', label: 'ドット', school: '奇流', stack: '"DotGothic16", "Courier New", monospace', hint: '奇流：回避と搦め手が得意' },
];

export interface Food {
  id: string;
  label: string;
  cost: number;
  bond: number;
  condition: number;
  desc: string;
}

export const FOODS: Food[] = [
  { id: 'leftovers', label: '昨日の残りもの', cost: 0, bond: -10, condition: 0, desc: 'タダ。でも、モジカの視線が痛い。' },
  { id: 'pellet', label: 'カリカリペレット', cost: 50, bond: -6, condition: 0, desc: '最低限の栄養。安いけど少し寂しい。' },
  { id: 'meat', label: '肉盛りプレート', cost: 180, bond: 4, condition: 2, desc: '満足度が高い定番メニュー。' },
  { id: 'fruit', label: '星屑フルーツ盛り', cost: 350, bond: 10, condition: 6, desc: '高級なごちそう。なつき度も調子も上がる。' },
];

export interface GameAction {
  id: string;
  label: string;
  cost: number;
  desc: string;
}

export const ACTIONS: GameAction[] = [
  { id: 'tokkun', label: '特訓', cost: 300, desc: 'お金をかけて大きく鍛える。疲れも大きい。' },
  { id: 'jishu', label: '自主練', cost: 0, desc: '無料でコツコツ鍛える。' },
  { id: 'roumu', label: '労務', cost: 0, desc: '働いて300G稼ぐ。少しだけ成長。' },
  { id: 'kyusoku', label: '休息', cost: 0, desc: 'しっかり休んでコンディション回復。' },
  { id: 'asobu', label: '遊ぶ', cost: 0, desc: 'なつき度を上げて、少しリフレッシュ。' },
  { id: 'meisou', label: '瞑想', cost: 0, desc: 'かしこさとテクニックを静かに伸ばす。' },
];

export const initialState = (): GameState => ({
  wallet: 1000,
  active: null,
  collection: [],
  hibernation: [],
  hall: [],
  displayName: '名無しブリーダー',
  tutorialSeen: false,
  ghostRewardDate: '',
  ghostRewardCount: 0,
  lastEvent: '文字モンスター研究所へようこそ。',
  lastMojika: 'わたしは助手のモジカ！まずは円盤石で、君だけの文字モンスターを生もう！',
});

export const totalOf = (stats: Stats): number =>
  stats.power + stats.speed + stats.stamina + stats.technique + stats.wisdom;

export const fontById = (fontId: string): FontOption => FONTS.find((font) => font.id === fontId) ?? FONTS[0];

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.round(value)));

export const uid = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function hashSeed(text: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0) * 4294967296 + (h1 >>> 0);
}

function rngFromSeed(seed: number): () => number {
  let a = seed >>> 0;
  let b = Math.floor(seed / 4294967296) >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    b = (b + 0x9e3779b9) >>> 0;
    const mixed = ((t ^ (t >>> 14)) >>> 0) ^ b;
    return (mixed >>> 0) / 4294967296;
  };
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function hexToHsl(hex: string): Hsl {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s: s * 100, l: l * 100 };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const lig = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lig - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function elementFromColor(hex: string): ElementType {
  const { h } = hexToHsl(hex);
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  // 白・黒・無彩色はRGBのレンジで先に判定する。
  // HSLの彩度はクリーム色のような白系で当てにならず、土と誤判定していたため。
  if (Math.min(r, g, b) >= 0.8) return '光';
  if (Math.max(r, g, b) <= 0.2) return '闇';
  if (Math.max(r, g, b) - Math.min(r, g, b) <= 0.09) return '無';
  if (h < 14 || h >= 345) return '炎';
  if (h < 40) return '土';
  if (h < 72) return '雷';
  if (h < 165) return '草';
  if (h < 200) return '氷';
  if (h < 255) return '水';
  return '闇';
}

const SPECIAL_BY_ELEMENT: Record<ElementType, string[]> = {
  炎: ['灼熱バースト', '紅蓮フレア', '爆炎フィナーレ'],
  土: ['岩壁プレス', '大地の鉄槌', '地層ブレイク'],
  雷: ['雷鳴スラッシュ', '稲妻ラッシュ', '天雷フィナーレ'],
  草: ['若葉ストーム', '森羅バインド', '新緑の審判'],
  氷: ['凍てつく審判', '氷結プリズム', '絶対零度アリア'],
  水: ['蒼流インパクト', '深海プレッシャー', '大渦の裁き'],
  闇: ['影縫いノクターン', '黒曜インパクト', '深淵の審判'],
  光: ['聖光ジャッジメント', '黎明フラッシュ', '天輪の裁き'],
  無: ['無垢ストライク', '空白インパクト', '虚無の審判'],
};

const TRAITS = ['自由人', '努力家', 'のんびり屋', '負けず嫌い', 'ひらめき型', '職人気質', '甘えん坊', 'クール', '食いしん坊', '大器晩成'];

export function specialMoveName(char: string, element: ElementType, seedPart: string): string {
  const rng = rngFromSeed(hashSeed(`${char}|${element}|${seedPart}`));
  const list = SPECIAL_BY_ELEMENT[element];
  return `「${char}」式・${list[Math.floor(rng() * list.length)]}`;
}

export function generateMonster(char: string, colorHex: string, fontId: string): Monster {
  const cleanChar = graphemesOf(char.trim())[0] ?? 'あ';
  const cleanColor = /^#[0-9a-fA-F]{6}$/.test(colorHex) ? colorHex.toLowerCase() : '#888888';
  const font = fontById(fontId);
  const element = elementFromColor(cleanColor);
  const rng = rngFromSeed(hashSeed(`${cleanChar}|${cleanColor}|${font.id}`));
  const roll = (min: number, max: number) => Math.floor(min + rng() * (max - min + 1));
  const stats: Stats = {
    power: roll(25, 42),
    speed: roll(24, 42),
    stamina: roll(25, 43),
    technique: roll(24, 42),
    wisdom: roll(23, 41),
  };
  // 流派らしい小さな個性づけ。決定論の範囲で寄せる。
  if (font.school === '剛流') stats.power += 3;
  if (font.school === '雅流') stats.technique += 4;
  if (font.school === '柔流') stats.stamina += 4;
  if (font.school === '荒流') { stats.power += 6; stats.technique -= 2; }
  if (font.school === '速流') stats.speed += 6;
  if (font.school === '変流') stats.wisdom += 4;
  if (font.school === '奇流') { stats.speed += 3; stats.technique += 3; }
  return {
    id: uid(),
    char: cleanChar,
    colorHex: cleanColor,
    fontId: font.id,
    fontLabel: font.label,
    elementType: element,
    school: font.school,
    trait: TRAITS[Math.floor(rng() * TRAITS.length)],
    specialMove: specialMoveName(cleanChar, element, font.id),
    stats,
    bond: 50,
    condition: 100,
    day: 1,
    stage: 0,
    wins: 0,
    losses: 0,
    generation: 1,
    isBred: false,
    source: 'generated',
    createdAt: new Date().toISOString(),
  };
}

export function scaleStatsToTotal(stats: Stats, target: number): Stats {
  const current = totalOf(stats);
  if (current <= 0) return { ...stats };
  const factor = target / current;
  const scaled: Stats = {
    power: Math.max(5, Math.round(stats.power * factor)),
    speed: Math.max(5, Math.round(stats.speed * factor)),
    stamina: Math.max(5, Math.round(stats.stamina * factor)),
    technique: Math.max(5, Math.round(stats.technique * factor)),
    wisdom: Math.max(5, Math.round(stats.wisdom * factor)),
  };
  let diff = target - totalOf(scaled);
  const keys: (keyof Stats)[] = ['power', 'stamina', 'technique', 'speed', 'wisdom'];
  let i = 0;
  while (diff !== 0 && i < 100) {
    const key = keys[i % keys.length];
    if (diff > 0) { scaled[key] += 1; diff -= 1; }
    else if (scaled[key] > 5) { scaled[key] -= 1; diff += 1; }
    i += 1;
  }
  return scaled;
}

export interface TournamentOpponent extends Monster {
  name: string;
}

/** 大会相手の基準総合力（従来の固定値）。 */
export const TOURNAMENT_BASE_TARGETS = [168, 232, 298];
/** 動的スケーリング倍率：手元の総合力に寄せて接戦にする（ステージ順）。 */
export const TOURNAMENT_SCALE_RATIOS = [0.82, 0.94, 1.02];

export function tournamentOpponent(stage: number, playerTotal?: number): TournamentOpponent {
  const specs = [
    { name: '鉄壁の鋼', char: '鋼', color: '#4a90d9', font: 'gothic' },
    { name: 'ぬかるみの泥', char: '泥', color: '#8a5a2b', font: 'gothic' },
    { name: '覇王の覇', char: '覇', color: '#b03a2e', font: 'brush' },
  ];
  const idx = Math.min(Math.max(stage, 0), specs.length - 1);
  const spec = specs[idx];
  // 目標総合力は「従来の固定値」と「手元の総合力×倍率」の大きい方。
  // 育て込むほど相手も強くなるが、弱いうちは従来バランスを下回らない。
  const scaled = playerTotal && playerTotal > 0 ? Math.round(playerTotal * TOURNAMENT_SCALE_RATIOS[idx]) : 0;
  const target = Math.max(TOURNAMENT_BASE_TARGETS[idx], scaled);
  const base = generateMonster(spec.char, spec.color, spec.font);
  return { ...base, id: `cpu-${stage}`, name: spec.name, stats: scaleStatsToTotal(base.stats, target), bond: 55, condition: 90 };
}

export function tierOpponent(tier: 'weak' | 'normal' | 'strong', baseTotal: number): TournamentOpponent {
  const ratio = tier === 'weak' ? 0.78 : tier === 'strong' ? 1.18 : 0.98;
  const seeds = [
    { char: '岩', color: '#8a5a2b', font: 'gothic' },
    { char: '風', color: '#35b558', font: 'pop' },
    { char: '影', color: '#5b3ea8', font: 'dot' },
  ];
  const seed = seeds[Math.floor(Math.random() * seeds.length)];
  const base = generateMonster(seed.char, seed.color, seed.font);
  const name = tier === 'weak' ? '駆け出しの挑戦者' : tier === 'strong' ? '強豪ゲスト' : '公式ゲスト';
  return { ...base, id: `free-${tier}-${Date.now()}`, name, stats: scaleStatsToTotal(base.stats, Math.round(baseTotal * ratio)), bond: 55, condition: 90 };
}

export function sampleGhosts(): PublicMonster[] {
  const samples = [
    { char: '龍', color: '#d43a2f', font: 'gothic', target: 372, owner: 'サンプル研究所', wins: 12 },
    { char: '猫', color: '#ef7fb3', font: 'pop', target: 318, owner: 'サンプル研究所', wins: 8 },
    { char: '夢', color: '#7656c9', font: 'hand', target: 426, owner: 'サンプル研究所', wins: 17 },
    { char: '海', color: '#2476c9', font: 'mincho', target: 286, owner: 'サンプル研究所', wins: 6 },
    { char: '森', color: '#2f9e5f', font: 'round', target: 344, owner: 'サンプル研究所', wins: 10 },
  ];
  return samples.map((sample, index) => {
    const monster = generateMonster(sample.char, sample.color, sample.font);
    const stats = scaleStatsToTotal(monster.stats, sample.target);
    return {
      docId: `sample-${index}`,
      monsterId: `sample-${index}`,
      ownerUid: 'sample',
      ownerName: sample.owner,
      char: monster.char,
      colorHex: monster.colorHex,
      fontId: monster.fontId,
      fontLabel: monster.fontLabel,
      elementType: monster.elementType,
      school: monster.school,
      trait: monster.trait,
      specialMove: monster.specialMove,
      stats,
      total: totalOf(stats),
      wins: sample.wins,
      losses: 2,
      generation: 1,
      isBred: false,
      sample: true,
    };
  });
}

export function blendColors(a: string, b: string): string {
  const ca = hexToHsl(a);
  const cb = hexToHsl(b);
  let dh = cb.h - ca.h;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  const variance = (Math.random() - 0.5) * 18;
  return hslToHex(
    ca.h + dh / 2 + variance,
    (ca.s + cb.s) / 2 + (Math.random() - 0.5) * 8,
    (ca.l + cb.l) / 2 + (Math.random() - 0.5) * 6,
  );
}

export function monsterToPublic(monster: Monster, ownerUid: string, ownerName: string, docId: string): PublicMonster {
  return {
    docId,
    monsterId: monster.id,
    ownerUid,
    ownerName,
    char: monster.char,
    colorHex: monster.colorHex,
    fontId: monster.fontId,
    fontLabel: monster.fontLabel,
    elementType: monster.elementType,
    school: monster.school,
    trait: monster.trait,
    specialMove: monster.specialMove,
    stats: monster.stats,
    total: totalOf(monster.stats),
    wins: monster.wins,
    losses: monster.losses,
    generation: monster.generation,
    isBred: monster.isBred,
  };
}

export function publicToMonster(pub: PublicMonster): Monster {
  return {
    id: pub.monsterId,
    char: pub.char,
    colorHex: pub.colorHex,
    fontId: pub.fontId,
    fontLabel: pub.fontLabel,
    elementType: pub.elementType,
    school: pub.school,
    trait: pub.trait,
    specialMove: pub.specialMove,
    stats: pub.stats,
    bond: 60,
    condition: 95,
    day: 21,
    stage: 3,
    wins: pub.wins,
    losses: pub.losses,
    generation: pub.generation,
    isBred: pub.isBred,
    source: 'cleared',
    createdAt: new Date().toISOString(),
  };
}

const ELEMENT_BEATS: Record<ElementType, ElementType[]> = {
  炎: ['草', '氷'],
  草: ['土'],
  土: ['雷'],
  雷: ['水'],
  水: ['炎'],
  氷: ['水'],
  闇: ['光'],
  光: ['闇'],
  無: [],
};

const ELEMENT_LOSES: Record<ElementType, ElementType[]> = {
  炎: ['水'],
  草: ['炎'],
  土: ['草'],
  雷: ['土'],
  水: ['雷', '氷'],
  氷: ['炎'],
  闇: [],
  光: [],
  無: [],
};

/** 属性ごとの代表色（バトル演出のフラッシュ／粒子で使う）。 */
export const ELEMENT_COLORS: Record<ElementType, string> = {
  炎: '#ff7847',
  氷: '#7fe7ff',
  雷: '#ffe14d',
  草: '#7be382',
  水: '#57b6ff',
  土: '#d9a066',
  光: '#fff3b0',
  闇: '#b18cff',
  無: '#cccccc',
};

export function elementMultiplier(attacker: ElementType, defender: ElementType): number {
  if (ELEMENT_BEATS[attacker].includes(defender)) return 1.3;
  if (ELEMENT_LOSES[attacker].includes(defender)) return 0.75;
  if ((attacker === '光' && defender === '闇') || (attacker === '闇' && defender === '光')) return 1.3;
  return 1;
}

const SCHOOL_RING: School[] = ['剛流', '荒流', '速流', '柔流', '雅流'];

export function schoolMultiplier(attacker: School, defender: School): number {
  const ai = SCHOOL_RING.indexOf(attacker);
  const di = SCHOOL_RING.indexOf(defender);
  if (ai === -1 || di === -1) return 1;
  if ((ai + 1) % SCHOOL_RING.length === di) return 1.15;
  if ((di + 1) % SCHOOL_RING.length === ai) return 0.87;
  return 1;
}

export interface BattleFighter {
  char: string;
  colorHex: string;
  fontId: string;
  fontLabel: string;
  elementType: ElementType;
  school: School;
  trait: string;
  specialMove: string;
  stats: Stats;
  bond?: number;
  condition?: number;
  displayName?: string;
}

export interface BattleTurn {
  turn: number;
  actor: 'player' | 'opponent' | 'commentary';
  kind: 'start' | 'attack' | 'crit' | 'special' | 'evade' | 'combo' | 'commentary' | 'end';
  text: string;
  damage: number;
  playerHp: number;
  opponentHp: number;
  playerGauge: number;
  opponentGauge: number;
}

export interface BattleReport {
  id: string;
  won: boolean;
  turns: BattleTurn[];
  log: string[];
  mojikaComment: string;
  playerMaxHp: number;
  opponentMaxHp: number;
}

function effectiveStats(fighter: BattleFighter, useCondition: boolean): Stats {
  let factor = 1;
  if (useCondition) {
    const condition = fighter.condition ?? 100;
    if (condition < 30) factor *= 0.86;
    else if (condition < 50) factor *= 0.93;
    else if (condition >= 85) factor *= 1.03;
    const bond = fighter.bond ?? 50;
    if (fighter.school === '柔流') factor *= 1 + Math.max(0, bond - 50) / 1000;
  }
  return {
    power: Math.round(fighter.stats.power * factor),
    speed: Math.round(fighter.stats.speed * factor),
    stamina: Math.round(fighter.stats.stamina * factor),
    technique: Math.round(fighter.stats.technique * factor),
    wisdom: Math.round(fighter.stats.wisdom * factor),
  };
}

export function simulateBattle(playerInput: BattleFighter, opponentInput: BattleFighter, playerName?: string, opponentName?: string): BattleReport {
  const player = { ...playerInput, stats: effectiveStats(playerInput, true) };
  const opponent = { ...opponentInput, stats: effectiveStats(opponentInput, false) };
  const pName = playerName ?? player.char;
  const oName = opponentName ?? opponent.char;
  const playerMaxHp = Math.round(170 + player.stats.stamina * 2.1 + totalOf(player.stats) * 0.15);
  const opponentMaxHp = Math.round(170 + opponent.stats.stamina * 2.1 + totalOf(opponent.stats) * 0.15);
  let playerHp = playerMaxHp;
  let opponentHp = opponentMaxHp;
  let playerGauge = 0;
  let opponentGauge = 0;
  let turn = 0;
  let cheeredPlayerLow = false;
  let cheeredOpponentLow = false;
  const turns: BattleTurn[] = [];
  const push = (actor: BattleTurn['actor'], kind: BattleTurn['kind'], text: string, damage = 0) => {
    turns.push({ turn, actor, kind, text, damage, playerHp, opponentHp, playerGauge, opponentGauge });
  };

  push('commentary', 'start', `実況モジカ「さあバトル開始！${player.elementType}属性・${player.school}の${pName} 対 ${opponent.elementType}属性・${opponent.school}の${oName}！」`);

  // 開始時：属性／流派の有利不利に触れる実況を1行だけ添える。
  const pElem = elementMultiplier(player.elementType, opponent.elementType);
  const oElem = elementMultiplier(opponent.elementType, player.elementType);
  const pSchool = schoolMultiplier(player.school, opponent.school);
  const oSchool = schoolMultiplier(opponent.school, player.school);
  if (pElem > 1 && oElem <= 1) {
    push('commentary', 'commentary', `実況モジカ「${pName}の${player.elementType}属性は、${oName}の${opponent.elementType}属性に有利！序盤から攻めていこう！」`);
  } else if (oElem > 1 && pElem <= 1) {
    push('commentary', 'commentary', `実況モジカ「属性相性は${oName}が有利…。でも勝負は最後まで分からないよ、${pName}、応援してる！」`);
  } else if (pSchool > 1 && oSchool <= 1) {
    push('commentary', 'commentary', `実況モジカ「流派の相性は${pName}の${player.school}が一歩リード。手堅くいこう！」`);
  } else if (oSchool > 1 && pSchool <= 1) {
    push('commentary', 'commentary', `実況モジカ「流派の相性は少し不利かも…。${pName}、自分のペースを守って！」`);
  } else {
    push('commentary', 'commentary', `実況モジカ「相性は互角！純粋な力比べになりそうだね！」`);
  }

  // 試合中の反応実況は最大2行まで。同じ種類の出来事には初回だけ、確率で間引く。
  let reactionCount = 0;
  const reactedKinds = new Set<string>();
  const maybeReact = (kind: 'crit' | 'special' | 'evade' | 'combo', byPlayer: boolean, atkName: string) => {
    if (reactionCount >= 2 || reactedKinds.has(kind)) return;
    if (Math.random() >= 0.6) return;
    reactedKinds.add(kind);
    reactionCount += 1;
    const text =
      kind === 'crit'
        ? byPlayer
          ? `実況モジカ「今の会心、効いたはず！${atkName}、いいぞ！」`
          : `実況モジカ「いたた…！今のは効いたね。でもまだまだこれからだよ！」`
        : kind === 'special'
          ? byPlayer
            ? `実況モジカ「出たぁ！これが${atkName}の必殺技！会場が沸いてるよ！」`
            : `実況モジカ「相手の必殺技…！でも、まだ倒れてない。大丈夫、立て直そう！」`
          : kind === 'evade'
            ? byPlayer
              ? `実況モジカ「よく避けた！${atkName}、さすがの身のこなしだね！」`
              : `実況モジカ「あぁ、避けられちゃった…！次は当てるよ、焦らないで！」`
            : byPlayer
              ? `実況モジカ「連撃が止まらない！${atkName}の速流、冴えてるね！」`
              : `実況モジカ「連撃で畳みかけてきた…！${pName}、耐えるんだ！」`;
    push('commentary', 'commentary', text);
  };

  const attack = (isPlayer: boolean) => {
    if (playerHp <= 0 || opponentHp <= 0) return;
    turn += 1;
    const atk = isPlayer ? player : opponent;
    const def = isPlayer ? opponent : player;
    const atkName = isPlayer ? pName : oName;
    const defName = isPlayer ? oName : pName;

    if (def.school === '奇流' && Math.random() < 0.14) {
      push(isPlayer ? 'player' : 'opponent', 'evade', `${defName}はひらりと身をかわした！${atkName}の攻撃は空を切る。`, 0);
      // 回避した側の視点で反応する（byPlayer＝回避したのが手元かどうか）。
      maybeReact('evade', !isPlayer, defName);
      return;
    }
    if (atk.school === '荒流' && Math.random() < 0.1) {
      push(isPlayer ? 'player' : 'opponent', 'attack', `${atkName}の攻撃は大きく外れた！荒流らしい大味な一撃。`, 0);
      return;
    }

    const useSpecial = (isPlayer ? playerGauge : opponentGauge) >= 100;
    if (useSpecial) {
      if (isPlayer) playerGauge = 0; else opponentGauge = 0;
    }
    let base = atk.stats.power * 0.62 + atk.stats.technique * 0.3 + atk.stats.speed * 0.14;
    base *= elementMultiplier(atk.elementType, def.elementType);
    base *= schoolMultiplier(atk.school, def.school);
    if (atk.school === '荒流') base *= 1.1;
    if (atk.school === '剛流') base *= 1.03;
    if (atk.school === '変流') base *= 0.78 + Math.random() * 0.55;
    const mitigation = Math.min(0.34, (def.stats.stamina + def.stats.wisdom) * 0.0011);
    base *= 1 - mitigation;
    base *= 0.88 + Math.random() * 0.24;
    let kind: BattleTurn['kind'] = useSpecial ? 'special' : 'attack';
    let crit = false;
    const critChance = 0.07 + atk.stats.technique / 1100 + (atk.school === '雅流' ? 0.07 : 0) + (isPlayer ? Math.max(0, (player.bond ?? 50) - 50) / 900 : 0);
    if (!useSpecial && Math.random() < critChance) {
      crit = true;
      kind = 'crit';
      base *= 1.55;
    }
    if (useSpecial) base *= 1.85;
    const damage = Math.max(6, Math.round(base));
    if (isPlayer) opponentHp = Math.max(0, opponentHp - damage); else playerHp = Math.max(0, playerHp - damage);

    // ゲージ増加（必殺を「1戦に1回あるかないかの見せ場」に寄せるため控えめに）
    const gaugeGain = Math.round(9 + atk.stats.speed * 0.13 + atk.stats.technique * 0.04 + (isPlayer ? Math.max(0, (player.bond ?? 50) - 50) / 8 : 0));
    if (isPlayer) playerGauge = Math.min(100, playerGauge + gaugeGain); else opponentGauge = Math.min(100, opponentGauge + gaugeGain);
    if (isPlayer) opponentGauge = Math.min(100, opponentGauge + 6); else playerGauge = Math.min(100, playerGauge + 6);

    if (useSpecial) {
      push(isPlayer ? 'player' : 'opponent', 'special', `必殺技！${atkName}の${atk.specialMove}が炸裂！${defName}に${damage}ダメージ！`, damage);
      maybeReact('special', isPlayer, atkName);
    } else if (crit) {
      push(isPlayer ? 'player' : 'opponent', 'crit', `会心の一撃！${atkName}の攻撃が${defName}を捉えた！${damage}ダメージ！`, damage);
      maybeReact('crit', isPlayer, atkName);
    } else {
      push(isPlayer ? 'player' : 'opponent', 'attack', `${atkName}の攻撃！${defName}に${damage}ダメージ。`, damage);
    }

    // 速流の連撃
    if (atk.school === '速流' && opponentHp > 0 && playerHp > 0 && Math.random() < 0.26) {
      const combo = Math.max(4, Math.round(damage * 0.45));
      if (isPlayer) opponentHp = Math.max(0, opponentHp - combo); else playerHp = Math.max(0, playerHp - combo);
      push(isPlayer ? 'player' : 'opponent', 'combo', `速流の連撃！${atkName}の追撃が${defName}に${combo}ダメージ！`, combo);
      maybeReact('combo', isPlayer, atkName);
    }

    if (!cheeredOpponentLow && opponentHp > 0 && opponentHp / opponentMaxHp <= 0.32) {
      cheeredOpponentLow = true;
      turn += 0;
      push('commentary', 'commentary', `実況モジカ「${oName}を追い詰めたよ！あと一押し！」`);
    }
    if (!cheeredPlayerLow && playerHp > 0 && playerHp / playerMaxHp <= 0.32) {
      cheeredPlayerLow = true;
      push('commentary', 'commentary', `実況モジカ「${pName}が苦しい…！でも目がまだ死んでない！」`);
    }
  };

  let rounds = 0;
  while (playerHp > 0 && opponentHp > 0 && rounds < 50) {
    rounds += 1;
    const playerFirst = player.stats.speed + Math.random() * 12 >= opponent.stats.speed + Math.random() * 12;
    if (playerFirst) { attack(true); attack(false); }
    else { attack(false); attack(true); }
  }
  if (playerHp === opponentHp) {
    if (player.stats.technique >= opponent.stats.technique) opponentHp = 0; else playerHp = 0;
  }
  const won = opponentHp <= 0 && playerHp > 0;
  turn += 1;
  push('commentary', 'end', won
    ? `決着！${pName}の勝利！実況モジカ「やったぁ！${pName}、最後まで立ってたよ！」`
    : `決着…${oName}の勝利。実況モジカ「${pName}、よく頑張ったよ…！」`);
  return {
    id: uid(),
    won,
    turns,
    log: turns.map((t) => t.text),
    mojikaComment: won
      ? `勝ったぁ！${pName}、すごくいいバトルだったよ！`
      : `負けちゃった…。でも${pName}は無事だよ。立て直して、また挑もう！`,
    playerMaxHp,
    opponentMaxHp,
  };
}

export function sellPrice(monster: Monster): number {
  return Math.round(totalOf(monster.stats) * 8 + monster.wins * 150 + monster.generation * 120);
}

export function stageName(stage: number): string {
  return ['デビュー戦', '準決勝', '決勝'][Math.min(stage, 2)] ?? '決勝';
}

export function firstGrapheme(value: string): string {
  return graphemesOf(value.trim())[0] ?? '';
}

/** Split a string into grapheme clusters (user-perceived characters).
 *  Uses Intl.Segmenter when available so combining characters and
 *  surrogate pairs count as one character. Never mutates the input. */
export function graphemesOf(value: string): string[] {
  const SegmenterCtor = (Intl as unknown as {
    Segmenter?: new (locale: string, options: { granularity: 'grapheme' }) => {
      segment: (input: string) => Iterable<{ segment: string }>;
    };
  }).Segmenter;
  if (SegmenterCtor) {
    const segmenter = new SegmenterCtor('ja', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(value), (part) => part.segment);
  }
  return Array.from(value);
}
