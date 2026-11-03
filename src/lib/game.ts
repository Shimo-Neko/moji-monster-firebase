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
  /** 覚えている補助技のID（古いセーブでは未記録＝空として扱う）。 */
  moves?: string[];
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
  /** ライバル「ラン」との大会での対戦成績（プレイヤー視点）。 */
  rivalRecord: { wins: number; losses: number };
  /** 読み終えたストーリー章のID。 */
  storySeen: string[];
  /** キャラ別好感度（0〜100）。 */
  affection: Partial<Record<string, number>>;
  /** 所持アイテム数（アイテムID→個数）。 */
  items: Record<string, number>;
  /** 特訓ドリンクの効果が次の特訓・自主練に乗っているか。 */
  trainingBoost: boolean;
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
  /** その日の特訓・自主練の伸びに付くボーナス（育成の方向づけ）。 */
  bias?: Partial<Stats>;
}

export const FOODS: Food[] = [
  { id: 'leftovers', label: '昨日の残りもの', cost: 0, bond: -10, condition: 0, desc: 'タダ。でも、モジカの視線が痛い。' },
  { id: 'pellet', label: 'カリカリペレット', cost: 50, bond: -6, condition: 0, desc: '最低限の栄養。安いけど少し寂しい。' },
  { id: 'curry', label: '激辛カレー', cost: 150, bond: 2, condition: -12, desc: '辛い！でもパワーがみなぎる。調子は少し下がる。', bias: { power: 4 } },
  { id: 'meat', label: '肉盛りプレート', cost: 180, bond: 4, condition: 2, desc: '満足度が高い定番メニュー。', bias: { power: 2, stamina: 2 } },
  { id: 'salad', label: '疾風サラダ', cost: 220, bond: 6, condition: 2, desc: '野菜たっぷりで体が軽くなる。素早さと技が冴える。', bias: { speed: 2, technique: 2 } },
  { id: 'stew', label: '大地のシチュー', cost: 260, bond: 5, condition: 10, desc: '具だくさんで芯から温まる。丈夫な体づくりに。', bias: { stamina: 2, power: 2 } },
  { id: 'fruit', label: '星屑フルーツ盛り', cost: 350, bond: 10, condition: 6, desc: '高級なごちそう。なつき度も調子も上がる。', bias: { technique: 2, wisdom: 2 } },
  { id: 'jelly', label: '月光ゼリー', cost: 420, bond: 12, condition: 4, desc: '月光を閉じ込めた高級ゼリー。全部の力が少しずつ伸びる。', bias: { power: 1, speed: 1, stamina: 1, technique: 1, wisdom: 1 } },
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
  { id: 'roumu', label: '労務', cost: 0, desc: '大会運営を手伝って300G稼ぐ。少しだけ成長。' },
  { id: 'kyusoku', label: '休息', cost: 0, desc: 'しっかり休んでコンディション回復。' },
  { id: 'asobu', label: '遊ぶ', cost: 0, desc: 'なつき度を上げて、少しリフレッシュ。' },
  { id: 'meisou', label: '瞑想', cost: 0, desc: 'かしこさとテクニックを静かに伸ばす。' },
];

export interface ItemDef {
  id: string;
  label: string;
  price: number;
  desc: string;
}

/** パワーアップアイテム。効果は既存パラメータの範囲に限定する。 */
export const ITEMS: ItemDef[] = [
  { id: 'drink', label: '特訓ドリンク', price: 400, desc: '次の特訓・自主練の伸びが1.5倍になる' },
  { id: 'vitality', label: '活力の実', price: 300, desc: '手元の子の調子を全快する' },
  { id: 'charm', label: '絆のお守り', price: 500, desc: '手元の子のなつき+15' },
  { id: 'extract-power', label: 'パワーエキス', price: 300, desc: '手元の子のパワー+5（すぐ効く）' },
  { id: 'extract-speed', label: 'スピードエキス', price: 300, desc: '手元の子のスピード+5（すぐ効く）' },
  { id: 'extract-stamina', label: 'スタミナエキス', price: 300, desc: '手元の子のスタミナ+5（すぐ効く）' },
  { id: 'extract-technique', label: 'テクニックエキス', price: 300, desc: '手元の子のテクニック+5（すぐ効く）' },
  { id: 'extract-wisdom', label: 'かしこさエキス', price: 300, desc: '手元の子のかしこさ+5（すぐ効く）' },
];

/** エキス系アイテムが伸ばすステータス。 */
export const EXTRACT_STAT: Record<string, keyof Stats> = {
  'extract-power': 'power',
  'extract-speed': 'speed',
  'extract-stamina': 'stamina',
  'extract-technique': 'technique',
  'extract-wisdom': 'wisdom',
};

export const itemById = (id: string): ItemDef => ITEMS.find((i) => i.id === id) ?? ITEMS[0];

export const STAT_LABELS: Record<keyof Stats, string> = { power: 'パワー', speed: 'スピード', stamina: 'スタミナ', technique: 'テクニック', wisdom: 'かしこさ' };

/* ---------- 技（バトルの補助技）と属性の成長特性 ---------- */

export type MoveKind = 'buffPower' | 'buffSpeed' | 'buffGuard' | 'buffEvade' | 'heal' | 'regen' | 'debuffPower' | 'debuffSpeed' | 'debuffGuard' | 'poison' | 'drain' | 'multiHit' | 'priority' | 'accuracyDown' | 'confuse' | 'reset' | 'berserk' | 'wall' | 'setField' | 'buffAccuracy' | 'debuffEvade';

export interface MoveDef {
  id: string;
  name: string;
  kind: MoveKind;
  desc: string;
  /** フィールド変更技（setField）の変更先。 */
  field?: FieldKind;
}

/** 補助技の一覧。攻撃の代わりに使い、段階（-2〜+2）や回復で戦況を組み立てる。 */
export const MOVES: MoveDef[] = [
  { id: 'power-up', name: 'パワーアップ', kind: 'buffPower', desc: '自分の攻撃が上がる（最大2段階）' },
  { id: 'speed-up', name: 'スピードアップ', kind: 'buffSpeed', desc: '自分の素早さが上がる（最大2段階）' },
  { id: 'guard-up', name: 'ガードアップ', kind: 'buffGuard', desc: '自分の耐久が上がる（最大2段階）' },
  { id: 'evade-up', name: '回避アップ', kind: 'buffEvade', desc: '自分の回避が上がる（最大2段階）' },
  { id: 'heal', name: 'ヒール', kind: 'heal', desc: '自分のHPを回復する（1戦に2回まで）' },
  { id: 'regen', name: 'リジェネ', kind: 'regen', desc: '少しずつHPが回復し続ける（3ターン）' },
  { id: 'power-down', name: 'パワーダウン', kind: 'debuffPower', desc: '相手の攻撃を下げる（最大2段階）' },
  { id: 'speed-down', name: 'スピードダウン', kind: 'debuffSpeed', desc: '相手の素早さを下げる（最大2段階）' },
  { id: 'guard-down', name: 'ガードダウン', kind: 'debuffGuard', desc: '相手の耐久を下げる（最大2段階）' },
  { id: 'poison', name: 'ポイズン', kind: 'poison', desc: '相手を「滲み」（持続ダメージ）にする' },
  { id: 'drain', name: 'ドレイン', kind: 'drain', desc: '攻撃して、与えたダメージの半分を回復する' },
  { id: 'multi-hit', name: '連続攻撃', kind: 'multiHit', desc: '素早い2連撃を放つ' },
  { id: 'priority', name: '先制', kind: 'priority', desc: '素早さが上がり、次の手番は必ず先に動ける' },
  { id: 'accuracy-down', name: '命中ダウン', kind: 'accuracyDown', desc: '相手の命中を下げる（最大2段階）' },
  { id: 'confuse', name: '混乱', kind: 'confuse', desc: '相手を「混乱」にする（自分を攻撃することがある）' },
  { id: 'reset', name: 'リセット', kind: 'reset', desc: '両者の段階変化をすべてリセットする' },
  { id: 'berserk', name: '捨て身', kind: 'berserk', desc: '自分の攻撃が2段階上がるが、耐久が1段階下がる' },
  { id: 'wall', name: '鉄壁', kind: 'wall', desc: '自分の耐久と回避が上がる' },
  { id: 'field-rain', name: '雨乞い', kind: 'setField', field: 'rain', desc: 'フィールドを「雨」に変える（水・氷が強くなる）' },
  { id: 'field-sunny', name: '晴天', kind: 'setField', field: 'sunny', desc: 'フィールドを「晴れ」に変える（炎・草・光が強くなる）' },
  { id: 'field-snow', name: '吹雪', kind: 'setField', field: 'snow', desc: 'フィールドを「雪」に変える（氷が強くなる）' },
  { id: 'field-thunder', name: '雷雨', kind: 'setField', field: 'thunder', desc: 'フィールドを「雷鳴」に変える（雷が強くなる）' },
  { id: 'field-mud', name: '泥沼', kind: 'setField', field: 'mud', desc: 'フィールドを「汚泥」に変える（闇・土が強くなる）' },
  { id: 'accuracy-up', name: '命中アップ', kind: 'buffAccuracy', desc: '自分の命中が上がる（相手の回避を打ち消す。最大2段階）' },
  { id: 'evade-down', name: '回避ダウン', kind: 'debuffEvade', desc: '相手の回避を下げる（最大2段階）' },
];

export const moveById = (id: string): MoveDef | undefined => MOVES.find((m) => m.id === id);

/** 属性ごとに覚えられる技（生まれつきの1つ＋特訓で閃く候補）。 */
export const ELEMENT_MOVE_POOL: Record<ElementType, string[]> = {
  炎: ['power-up', 'guard-down', 'berserk'],
  土: ['guard-up', 'power-up', 'wall', 'field-mud'],
  雷: ['speed-up', 'power-down', 'priority', 'field-thunder'],
  草: ['regen', 'drain', 'guard-down', 'field-sunny'],
  水: ['guard-up', 'speed-down', 'multi-hit', 'field-rain'],
  氷: ['evade-up', 'speed-down', 'accuracy-down', 'field-snow'],
  光: ['heal', 'multi-hit', 'reset'],
  闇: ['power-down', 'poison', 'confuse', 'evade-down'],
  無: ['power-up', 'speed-up', 'reset', 'accuracy-up'],
};

/** どの属性でも特訓で閃きうる共通の技。 */
export const COMMON_MOVE_POOL: string[] = ['guard-up', 'evade-up', 'speed-down'];

/** 覚えられる技の上限（生まれつき＋特訓の閃き＋配合の継承）。 */
export const MAX_MOVES = 4;

/** 属性の成長特性：このステータスが伸びやすい（無属性は特性なし）。 */
export const ELEMENT_APTITUDE: Record<ElementType, keyof Stats | null> = {
  炎: 'power',
  土: 'stamina',
  雷: 'speed',
  草: 'wisdom',
  水: 'technique',
  氷: 'speed',
  光: 'wisdom',
  闇: 'technique',
  無: null,
};

/** CPU相手用：総合力を保ったまま、属性の得意ステータスに少し寄せる。 */
export function biasStatsToElement(stats: Stats, element: ElementType): Stats {
  const fav = ELEMENT_APTITUDE[element];
  if (!fav) return stats;
  const total = totalOf(stats);
  const movePts = Math.max(1, Math.round(total * 0.06));
  const keys = (Object.keys(stats) as (keyof Stats)[]).filter((k) => k !== fav);
  const donor = keys.reduce((a, b) => (stats[a] <= stats[b] ? a : b));
  const take = Math.min(movePts, Math.max(0, stats[donor] - 10));
  if (take <= 0) return stats;
  return { ...stats, [fav]: stats[fav] + take, [donor]: stats[donor] - take };
}

/** CPU相手の技：生まれつきの1つに加え、準決勝（stage>=1）以降は属性プールのもう1つも持つ。 */
export function opponentMoves(base: Monster, stage: number): string[] {
  const moves = [...(base.moves ?? [])];
  if (stage >= 1) {
    for (const id of ELEMENT_MOVE_POOL[base.elementType]) {
      if (!moves.includes(id) && moves.length < 2) moves.push(id);
    }
  }
  return moves;
}

/** 所持数（未記録は0）。 */
export function itemCount(state: GameState, id: string): number {
  return state.items?.[id] ?? 0;
}

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
  rivalRecord: { wins: 0, losses: 0 },
  storySeen: [],
  affection: {},
  items: {},
  trainingBoost: false,
  lastEvent: '文字モンスター研究所へようこそ。',
  lastMojika: 'わたしは助手のモジカ！まずは古代の石盤に文字を刻んで、君だけの文字モンスターを錬成しよう！',
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
  炎: ['灼熱バースト', '紅蓮フレア', '爆炎フィナーレ', '連炎乱舞', '紅蓮ピアス'],
  土: ['岩礫ラッシュ', '岩壁プレス', '大地の鉄槌', '連岩乱打', '地層ブレイク'],
  雷: ['稲妻ラッシュ', '雷鳴スラッシュ', '天雷フィナーレ', '連雷乱舞', '雷貫ボルト'],
  草: ['若葉ストーム', '森羅バインド', '新緑の審判', '連葉乱舞', '貫きの蔦'],
  氷: ['氷結プリズム', '凍てつく審判', '絶対零度アリア', '連氷乱舞', '氷柱ピアス'],
  水: ['蒼流インパクト', '深海プレッシャー', '大渦の裁き', '連流乱舞', '水圧ピアス'],
  闇: ['影縫いノクターン', '黒曜インパクト', '深淵の審判', '連影乱舞', '影の貫き'],
  光: ['黎明フラッシュ', '聖光ジャッジメント', '天輪の裁き', '連光乱舞', '貫く聖光'],
  無: ['無垢ストライク', '空白インパクト', '虚無の審判', '空白ラッシュ', '虚無ピアス'],
};

/** 必殺技の型。名前リストの並び順と対応する（速攻／標準／重撃／連撃／貫通）。 */
export type SpecialType = 'rapid' | 'standard' | 'heavy' | 'multi' | 'pierce';
export const SPECIAL_TYPE_ORDER: SpecialType[] = ['rapid', 'standard', 'heavy', 'multi', 'pierce'];
export const SPECIAL_TYPES: Record<SpecialType, { name: string; gauge: number; power: number; desc: string }> = {
  rapid: { name: '速攻型', gauge: 60, power: 1.4, desc: 'ゲージ60で発動。威力は小さいが早く撃てる' },
  standard: { name: '標準型', gauge: 100, power: 1.85, desc: 'ゲージ100で発動。バランスの取れた威力' },
  heavy: { name: '重撃型', gauge: 120, power: 2.7, desc: 'ゲージ120で発動。ダメージを受けるとゲージが溜まりやすい。滅多に撃てないが絶大な威力' },
  multi: { name: '連撃型', gauge: 100, power: 1.15, desc: 'ゲージ100で発動。威力1.15倍を2回攻撃' },
  pierce: { name: '貫通型', gauge: 100, power: 1.6, desc: 'ゲージ100で発動。相手の軽減を無視する' },
};
/** 必殺技名から型を引く（名前の位置で決まる。既存の子の必殺技名もそのまま判定できる）。 */
export function specialTypeOf(fighter: { specialMove: string; elementType: ElementType }): SpecialType {
  const list = SPECIAL_BY_ELEMENT[fighter.elementType];
  const idx = list.findIndex((n) => fighter.specialMove.endsWith(n));
  return SPECIAL_TYPE_ORDER[idx >= 0 ? idx : 1];
}

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
    moves: [ELEMENT_MOVE_POOL[element][Math.floor(rng() * ELEMENT_MOVE_POOL[element].length)]],
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
  return { ...base, id: `cpu-${stage}`, name: spec.name, stats: biasStatsToElement(scaleStatsToTotal(base.stats, target), base.elementType), moves: opponentMoves(base, idx), bond: 55, condition: 90 };
}

/** ライバル育成者ラン の相棒「嵐」。大会の全ステージで立ちはだかる（強さは従来の大会スケーリングと同一）。 */
export function rivalOpponent(stage: number, playerTotal?: number): TournamentOpponent {
  const fonts = ['gothic', 'pop', 'brush'];
  const idx = Math.min(Math.max(stage, 0), 2);
  const scaled = playerTotal && playerTotal > 0 ? Math.round(playerTotal * TOURNAMENT_SCALE_RATIOS[idx]) : 0;
  const target = Math.max(TOURNAMENT_BASE_TARGETS[idx], scaled);
  const base = generateMonster('嵐', '#7656c9', fonts[idx]);
  return { ...base, id: `rival-${stage}`, name: 'ランの「嵐」', stats: biasStatsToElement(scaleStatsToTotal(base.stats, target), base.elementType), moves: opponentMoves(base, idx), bond: 70, condition: 95 };
}

/** 一般出場者（デビュー戦・準決勝の相手）。トレーナー名・文字・色・フォントはランダムで、強さは大会スケーリングと同一。 */
export interface QualifierOpponent extends TournamentOpponent {
  trainer: string;
  intro: string;
}

const QUALIFIER_TRAINERS = ['ヒナタ', 'ユイ', 'サクラ', 'ミオ', 'アカリ', 'リン', 'ノア', 'カエデ', 'ホノカ', 'シズク', 'ユメ', 'ツバサ'];
const QUALIFIER_CHARS = ['炎', '氷', '森', '月', '星', '雷', '雪', '花', '音', '翼', '拳', '姫', '猫', '龍', '夢', '影', '光', '波', '空', '兎'];
const QUALIFIER_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f2c230', '#9b59b6', '#e67e22', '#1abc9c', '#fd79a8', '#6c5ce7', '#00b894', '#d63031', '#0984e3', '#e84393', '#00cec9', '#fdcb6e', '#a29bfe'];
const QUALIFIER_FONTS = ['gothic', 'mincho', 'round', 'brush', 'pop', 'hand', 'dot'];
const QUALIFIER_INTROS = [
  '勢いのある若手選手です！',
  '地元で評判の実力者、侮れません！',
  '初出場ながら注目の存在です！',
  '落ち着いた試合運びが持ち味のベテラン！',
  '予選を勝ち上がってきた強敵です！',
];

export function qualifierOpponent(stage: number, playerTotal?: number): QualifierOpponent {
  const idx = Math.min(Math.max(stage, 0), 2);
  const scaled = playerTotal && playerTotal > 0 ? Math.round(playerTotal * TOURNAMENT_SCALE_RATIOS[idx]) : 0;
  const target = Math.max(TOURNAMENT_BASE_TARGETS[idx], scaled);
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const trainer = pick(QUALIFIER_TRAINERS);
  const char = pick(QUALIFIER_CHARS);
  const base = generateMonster(char, pick(QUALIFIER_COLORS), pick(QUALIFIER_FONTS));
  return {
    ...base,
    id: `qualifier-${stage}-${Date.now()}`,
    name: `${trainer}の「${char}」`,
    stats: biasStatsToElement(scaleStatsToTotal(base.stats, target), base.elementType),
    moves: opponentMoves(base, idx),
    bond: 55,
    condition: 90,
    trainer,
    intro: pick(QUALIFIER_INTROS),
  };
}

/** 道場破りのラン「嵐」。手元の子より少し弱め（総合力×0.95）。 */
export function dojoOpponent(playerTotal: number): TournamentOpponent {
  const base = generateMonster('嵐', '#7656c9', 'brush');
  const target = Math.max(60, Math.round(playerTotal * 0.95));
  return { ...base, id: `dojo-${Date.now()}`, name: 'ランの「嵐」', stats: biasStatsToElement(scaleStatsToTotal(base.stats, target), base.elementType), bond: 70, condition: 95 };
}

/** 好感度の現在値（未記録は0）。 */
export function affectionOf(state: GameState, id: string): number {
  return state.affection?.[id] ?? 0;
}

/** 好感度の段階。仲良し（25）から各キャラの特典が有効になる。 */
export function affectionTier(points: number): { name: string; benefitActive: boolean } {
  if (points >= 50) return { name: '大好き', benefitActive: true };
  if (points >= 25) return { name: '仲良し', benefitActive: true };
  if (points >= 10) return { name: '顔なじみ', benefitActive: false };
  return { name: '顔見知り', benefitActive: false };
}

/** そのキャラの好感度特典が有効かどうか（段階から判定する。閾値の直書きはしない）。 */
export function isBenefitActive(state: GameState, id: string): boolean {
  return affectionTier(affectionOf(state, id)).benefitActive;
}

const WILD_SEEDS = [
  { char: '牙', color: '#b03a2e', font: 'brush' },
  { char: '爪', color: '#8a5a2b', font: 'pop' },
  { char: '影', color: '#22242a', font: 'dot' },
  { char: '獣', color: '#2f9e5f', font: 'gothic' },
  { char: '荒', color: '#e07b24', font: 'brush' },
];

/** 街に現れる野生の文字モンスター。手元の子より少し弱め（総合力×0.85）に調整する。 */
export function wildOpponent(playerTotal: number): TournamentOpponent {
  const seed = WILD_SEEDS[Math.floor(Math.random() * WILD_SEEDS.length)];
  const base = generateMonster(seed.char, seed.color, seed.font);
  const target = Math.max(60, Math.round(playerTotal * 0.85));
  return { ...base, id: `wild-${Date.now()}`, name: `野生の「${seed.char}」`, stats: biasStatsToElement(scaleStatsToTotal(base.stats, target), base.elementType), bond: 20, condition: 80 };
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
  return { ...base, id: `free-${tier}-${Date.now()}`, name, stats: biasStatsToElement(scaleStatsToTotal(base.stats, Math.round(baseTotal * ratio)), base.elementType), bond: 55, condition: 90 };
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
    moves: [ELEMENT_MOVE_POOL[pub.elementType][0]],
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

export type AilmentKind = 'nijimi' | 'yakedo' | 'mahi' | 'katamari' | 'konran';

export const AILMENT_NAMES: Record<AilmentKind, string> = { nijimi: '滲み', yakedo: 'やけど', mahi: '麻痺', katamari: '固まり', konran: '混乱' };

/** 属性の固有異常：この属性は固有異常を与えやすく、同時に自分はその異常にならない。 */
export const ELEMENT_AILMENT: Partial<Record<ElementType, AilmentKind>> = { 炎: 'yakedo', 雷: 'mahi', 水: 'katamari', 氷: 'katamari', 闇: 'nijimi' };

/** バトルのフィールド（天候・地形）。そのバトル中ずっと有効で、属性の与ダメージ倍率と小さな特殊ルールで戦況を揺らす。 */
export type FieldKind = 'rain' | 'sunny' | 'snow' | 'thunder' | 'storm' | 'mud';
export interface FieldDef { name: string; note: string; mult: Partial<Record<ElementType, number>> }
export const FIELDS: Record<FieldKind, FieldDef> = {
  rain: { name: '雨', note: '水と氷が勢いづき、炎と土が弱る。やけどは付かない', mult: { 水: 1.25, 氷: 1.1, 炎: 0.85, 土: 0.8 } },
  sunny: { name: '晴れ', note: '炎・草・光が輝き、氷と闇が陰る。回復が冴える', mult: { 炎: 1.25, 草: 1.2, 光: 1.2, 氷: 0.8, 闇: 0.85 } },
  snow: { name: '雪', note: '氷が冴え、炎と草が弱る。固まりが長引く', mult: { 氷: 1.25, 炎: 0.8, 草: 0.85, 雷: 0.9 } },
  thunder: { name: '雷鳴', note: '雷が轟き、水も帯電する。土が弱り、麻痺しやすい', mult: { 雷: 1.25, 水: 1.1, 土: 0.85 } },
  storm: { name: '嵐', note: '雷と水が荒れ、土が弱る。強風で攻撃が逸れやすい', mult: { 雷: 1.15, 水: 1.15, 土: 0.8 } },
  mud: { name: '汚泥', note: '闇と土が増し、草と光が汚れる。滲みが重くなる', mult: { 闇: 1.25, 土: 1.2, 草: 0.75, 光: 0.85 } },
};
export function fieldMultiplier(field: FieldKind | null, element: ElementType): number {
  if (!field) return 1;
  return FIELDS[field].mult[element] ?? 1;
}
/** フィールドの抽選：約1/3は「なし」、残りは6種から均等。 */
function rollField(): FieldKind | null {
  if (Math.random() < 0.34) return null;
  const kinds: FieldKind[] = ['rain', 'sunny', 'snow', 'thunder', 'storm', 'mud'];
  return kinds[Math.floor(Math.random() * kinds.length)];
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
  moves?: string[];
  stats: Stats;
  bond?: number;
  condition?: number;
  displayName?: string;
}

/** バトル中の段階変化（-2〜+2）のスナップショット。観戦画面の状態アイコン表示に使う。 */
export interface BattleStages { power: number; speed: number; guard: number; evade: number; accuracy: number }

export interface BattleTurn {
  turn: number;
  actor: 'player' | 'opponent' | 'commentary';
  kind: 'start' | 'attack' | 'crit' | 'special' | 'evade' | 'combo' | 'commentary' | 'end' | 'ailment' | 'support';
  text: string;
  damage: number;
  playerHp: number;
  opponentHp: number;
  playerGauge: number;
  opponentGauge: number;
  /** その行時点のフィールド（変化の検出と表示に使う）。 */
  field: FieldKind | null;
  playerAilment: AilmentKind | null;
  opponentAilment: AilmentKind | null;
  playerStages: BattleStages;
  opponentStages: BattleStages;
  playerRegen: number;
  opponentRegen: number;
}

export interface BattleReport {
  id: string;
  won: boolean;
  turns: BattleTurn[];
  log: string[];
  mojikaComment: string;
  playerMaxHp: number;
  opponentMaxHp: number;
  field: FieldKind | null;
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

export function simulateBattle(playerInput: BattleFighter, opponentInput: BattleFighter, playerName?: string, opponentName?: string, options?: { ailments?: boolean; moves?: boolean; field?: FieldKind | null }): BattleReport {
  const ailmentsOn = options?.ailments !== false;
  const movesOn = options?.moves !== false;
  let field: FieldKind | null = options?.field !== undefined ? options.field : rollField();
  const initialField = field;
  const player = { ...playerInput, stats: effectiveStats(playerInput, true) };
  const opponent = { ...opponentInput, stats: effectiveStats(opponentInput, false) };
  const playerSpecialType = specialTypeOf(player);
  const opponentSpecialType = specialTypeOf(opponent);
  const playerSpecialDef = SPECIAL_TYPES[playerSpecialType];
  const opponentSpecialDef = SPECIAL_TYPES[opponentSpecialType];
  const pName = playerName ?? player.char;
  const oName = opponentName ?? opponent.char;
  const playerMaxHp = Math.round(170 + player.stats.stamina * 2.1 + totalOf(player.stats) * 0.15);
  const opponentMaxHp = Math.round(170 + opponent.stats.stamina * 2.1 + totalOf(opponent.stats) * 0.15);
  let playerHp = playerMaxHp;
  let opponentHp = opponentMaxHp;
  let playerGauge = 0;
  let opponentGauge = 0;
  // 状態異常：滲み=持続ダメージ（4%×3）、やけど=持続ダメージ（5%×2）、麻痺=25%で行動不能（3ターン）、固まり=1回休み。
  type Ailment = { kind: AilmentKind; left: number };
  let playerAilment: Ailment | null = null;
  let opponentAilment: Ailment | null = null;
  // 補助技による段階（-2〜+2）とリジェネ・回復回数。
  type Stages = { power: number; speed: number; guard: number; evade: number; accuracy: number };
  const newStages = (): Stages => ({ power: 0, speed: 0, guard: 0, evade: 0, accuracy: 0 });
  const playerStages = newStages();
  const opponentStages = newStages();
  let playerRegen = 0;
  let opponentRegen = 0;
  let playerHealUses = 0;
  let opponentHealUses = 0;
  let playerActions = 0;
  let opponentActions = 0;
  let playerHealAtAction = -9;
  let opponentHealAtAction = -9;
  let playerPriority = false;
  let opponentPriority = false;
  let turn = 0;
  let cheeredPlayerLow = false;
  let cheeredOpponentLow = false;
  const turns: BattleTurn[] = [];
  const push = (actor: BattleTurn['actor'], kind: BattleTurn['kind'], text: string, damage = 0) => {
    turns.push({ turn, actor, kind, text, damage, playerHp, opponentHp, playerGauge: Math.min(100, Math.round((playerGauge / playerSpecialDef.gauge) * 100)), opponentGauge: Math.min(100, Math.round((opponentGauge / opponentSpecialDef.gauge) * 100)), field, playerAilment: playerAilment?.kind ?? null, opponentAilment: opponentAilment?.kind ?? null, playerStages: { ...playerStages }, opponentStages: { ...opponentStages }, playerRegen, opponentRegen });
  };

  push('commentary', 'start', `実況コトハ「さあバトル開始！${player.elementType}属性・${player.school}の${pName}、対するは${opponent.elementType}属性・${opponent.school}の${oName}！どんな試合になるのか注目です！」`);
  if (field) {
    push('commentary', 'commentary', `実況コトハ「今日のフィールドは『${FIELDS[field].name}』！${FIELDS[field].note}！」`);
  }

  // 開始時：属性／流派の有利不利に触れる実況を1行だけ添える。
  const pElem = elementMultiplier(player.elementType, opponent.elementType);
  const oElem = elementMultiplier(opponent.elementType, player.elementType);
  const pSchool = schoolMultiplier(player.school, opponent.school);
  const oSchool = schoolMultiplier(opponent.school, player.school);
  if (pElem > 1 && oElem <= 1) {
    push('commentary', 'commentary', `実況コトハ「${pName}の${player.elementType}属性は、${oName}の${opponent.elementType}属性に有利！序盤の主導権を握れるか！」`);
  } else if (oElem > 1 && pElem <= 1) {
    push('commentary', 'commentary', `実況コトハ「属性相性は${oName}が有利！${pName}は苦しい展開を覆せるか、見どころです！」`);
  } else if (pSchool > 1 && oSchool <= 1) {
    push('commentary', 'commentary', `実況コトハ「流派の相性は${pName}の${player.school}が一歩リード。手堅い試合運びに期待しましょう！」`);
  } else if (oSchool > 1 && pSchool <= 1) {
    push('commentary', 'commentary', `実況コトハ「流派の相性は少し不利な${pName}。自分のペースを守れるかが鍵です！」`);
  } else {
    push('commentary', 'commentary', `実況コトハ「相性は互角！純粋な力比べ、これは好試合の予感です！」`);
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
          ? `実況コトハ「今の会心、効いたはず！${atkName}、見事な一撃です！」`
          : `実況コトハ「いたた…！今のは効いたー！大きなダメージです！」`
        : kind === 'special'
          ? byPlayer
            ? `実況コトハ「出たぁ！これが${atkName}の必殺技！会場が沸いています！」`
            : `実況コトハ「相手の必殺技…！${pName}、ここを耐えられるかー！」`
          : kind === 'evade'
            ? byPlayer
              ? `実況コトハ「よく避けた！${atkName}、さすがの身のこなしです！」`
              : `実況コトハ「あぁ、避けられたー！攻撃が空を切りました！」`
            : byPlayer
              ? `実況コトハ「連撃が止まらない！${atkName}の速流、冴えています！」`
              : `実況コトハ「連撃で畳みかけてきたー！${pName}、耐えどころです！」`;
    push('commentary', 'commentary', text);
  };

  const applyMove = (move: MoveDef, isPlayer: boolean, atkName: string, defName: string) => {
    const myStages = isPlayer ? playerStages : opponentStages;
    const foeStages = isPlayer ? opponentStages : playerStages;
    const actor = isPlayer ? 'player' : 'opponent';
    const stageText = (v: number) => `（現在${v > 0 ? '+' : ''}${v}段階）`;
    switch (move.kind) {
      case 'buffPower': myStages.power = Math.min(2, myStages.power + 1); push(actor, 'support', `${atkName}の『${move.name}』！攻撃が上がった！${stageText(myStages.power)}`); break;
      case 'buffSpeed': myStages.speed = Math.min(2, myStages.speed + 1); push(actor, 'support', `${atkName}の『${move.name}』！素早さが上がった！${stageText(myStages.speed)}`); break;
      case 'buffGuard': myStages.guard = Math.min(2, myStages.guard + 1); push(actor, 'support', `${atkName}の『${move.name}』！耐久が上がった！${stageText(myStages.guard)}`); break;
      case 'buffEvade': myStages.evade = Math.min(2, myStages.evade + 1); push(actor, 'support', `${atkName}の『${move.name}』！回避が上がった！${stageText(myStages.evade)}`); break;
      case 'heal': {
        const amt = Math.max(5, Math.round((isPlayer ? playerMaxHp : opponentMaxHp) * 0.26 * (field === 'sunny' ? 1.25 : 1)));
        if (isPlayer) { playerHp = Math.min(playerMaxHp, playerHp + amt); playerHealUses += 1; playerHealAtAction = playerActions; }
        else { opponentHp = Math.min(opponentMaxHp, opponentHp + amt); opponentHealUses += 1; opponentHealAtAction = opponentActions; }
        push(actor, 'support', `${atkName}の『${move.name}』！HPが${amt}回復した！`);
        break;
      }
      case 'regen':
        if (isPlayer) playerRegen = 3; else opponentRegen = 3;
        push(actor, 'support', `${atkName}の『${move.name}』！少しずつ回復するようになった！`);
        break;
      case 'priority':
        myStages.speed = Math.min(2, myStages.speed + 1);
        if (isPlayer) playerPriority = true; else opponentPriority = true;
        push(actor, 'support', `${atkName}の『${move.name}』！素早さが上がり、次の手番は必ず先に動ける！`);
        break;
      case 'accuracyDown': foeStages.accuracy = Math.max(-2, foeStages.accuracy - 1); push(actor, 'support', `${atkName}の『${move.name}』！${defName}の命中が下がった！${stageText(foeStages.accuracy)}`); break;
      case 'confuse':
        if (Math.random() < 0.75) {
          if (isPlayer) opponentAilment = { kind: 'konran', left: 3 }; else playerAilment = { kind: 'konran', left: 3 };
          push(actor, 'support', `${atkName}の『${move.name}』！${defName}は「混乱」にかかった！`);
        } else {
          push(actor, 'support', `${atkName}の『${move.name}』！しかし外れてしまった！`);
        }
        break;
      case 'reset': {
        const zero = newStages();
        Object.assign(playerStages, zero);
        Object.assign(opponentStages, newStages());
        push(actor, 'support', `${atkName}の『${move.name}』！全ての段階変化がリセットされた！`);
        break;
      }
      case 'berserk':
        myStages.power = Math.min(2, myStages.power + 2);
        myStages.guard = Math.max(-2, myStages.guard - 1);
        push(actor, 'support', `${atkName}の『${move.name}』！攻撃がぐんと上がったが、耐久が下がった！`);
        break;
      case 'wall':
        myStages.guard = Math.min(2, myStages.guard + 1);
        myStages.evade = Math.min(2, myStages.evade + 1);
        push(actor, 'support', `${atkName}の『${move.name}』！耐久と回避が上がった！`);
        break;
      case 'setField': {
        field = move.field ?? field;
        push(actor, 'support', `${atkName}の『${move.name}』！フィールドが「${move.field ? FIELDS[move.field].name : ''}」に変わった！`);
        break;
      }
      case 'buffAccuracy': myStages.accuracy = Math.min(2, myStages.accuracy + 1); push(actor, 'support', `${atkName}の『${move.name}』！命中が上がった！${stageText(myStages.accuracy)}`); break;
      case 'debuffEvade': foeStages.evade = Math.max(-2, foeStages.evade - 1); push(actor, 'support', `${atkName}の『${move.name}』！${defName}の回避が下がった！${stageText(foeStages.evade)}`); break;
      case 'debuffPower': foeStages.power = Math.max(-2, foeStages.power - 1); push(actor, 'support', `${atkName}の『${move.name}』！${defName}の攻撃が下がった！${stageText(foeStages.power)}`); break;
      case 'debuffSpeed': foeStages.speed = Math.max(-2, foeStages.speed - 1); push(actor, 'support', `${atkName}の『${move.name}』！${defName}の素早さが下がった！${stageText(foeStages.speed)}`); break;
      case 'debuffGuard': foeStages.guard = Math.max(-2, foeStages.guard - 1); push(actor, 'support', `${atkName}の『${move.name}』！${defName}の耐久が下がった！${stageText(foeStages.guard)}`); break;
      case 'poison':
        if (Math.random() < 0.85) {
          if (isPlayer) opponentAilment = { kind: 'nijimi', left: 3 }; else playerAilment = { kind: 'nijimi', left: 3 };
          push(actor, 'support', `${atkName}の『${move.name}』！${defName}は「滲み」にかかった！`);
        } else {
          push(actor, 'support', `${atkName}の『${move.name}』！しかし外れてしまった！`);
        }
        break;
    }
  };

  const attack = (isPlayer: boolean) => {
    if (playerHp <= 0 || opponentHp <= 0) return;
    turn += 1;
    if (isPlayer) playerActions += 1; else opponentActions += 1;
    const myActionCount = isPlayer ? playerActions : opponentActions;
    const atk = isPlayer ? player : opponent;
    const def = isPlayer ? opponent : player;
    const atkName = isPlayer ? pName : oName;
    const defName = isPlayer ? oName : pName;

    // リジェネ：自分のターン開始時に少し回復する。
    if (movesOn && (isPlayer ? playerRegen : opponentRegen) > 0) {
      const amt = Math.max(3, Math.round((isPlayer ? playerMaxHp : opponentMaxHp) * 0.1 * (field === 'sunny' ? 1.25 : 1)));
      if (isPlayer) { playerHp = Math.min(playerMaxHp, playerHp + amt); playerRegen -= 1; }
      else { opponentHp = Math.min(opponentMaxHp, opponentHp + amt); opponentRegen -= 1; }
      push(isPlayer ? 'player' : 'opponent', 'support', `${atkName}は「芽吹き」で回復している…${amt}回復。`);
    }

    // 状態異常：自分のターン開始時に処理する。
    const myAilment = isPlayer ? playerAilment : opponentAilment;
    if (ailmentsOn && myAilment) {
      const aName = AILMENT_NAMES[myAilment.kind];
      if (myAilment.kind === 'nijimi' || myAilment.kind === 'yakedo') {
        const dot = Math.max(3, Math.round((isPlayer ? playerMaxHp : opponentMaxHp) * (myAilment.kind === 'nijimi' ? (field === 'mud' ? 0.05 : 0.04) : 0.05)));
        if (isPlayer) playerHp = Math.max(0, playerHp - dot); else opponentHp = Math.max(0, opponentHp - dot);
        push(isPlayer ? 'player' : 'opponent', 'ailment', `${atkName}は「${aName}」に蝕まれている…${dot}ダメージ。`, dot);
        myAilment.left -= 1;
        if (myAilment.left <= 0) {
          if (isPlayer) playerAilment = null; else opponentAilment = null;
          push('commentary', 'ailment', `${atkName}の「${aName}」が消えた。`);
        }
        if (playerHp <= 0 || opponentHp <= 0) return;
      } else if (myAilment.kind === 'mahi') {
        myAilment.left -= 1;
        const expires = myAilment.left <= 0;
        if (expires) { if (isPlayer) playerAilment = null; else opponentAilment = null; }
        if (Math.random() < 0.25) {
          push(isPlayer ? 'player' : 'opponent', 'ailment', `${atkName}は「麻痺」で体が痺れて動けない！`, 0);
          if (expires) push('commentary', 'ailment', `${atkName}の「麻痺」が消えた。`);
          return;
        }
        if (expires) push('commentary', 'ailment', `${atkName}の「麻痺」が消えた。`);
      } else if (myAilment.kind === 'konran') {
        myAilment.left -= 1;
        const expires = myAilment.left <= 0;
        if (expires) { if (isPlayer) playerAilment = null; else opponentAilment = null; }
        if (Math.random() < 0.3) {
          const selfDmg = Math.max(4, Math.round((atk.stats.power * 0.5 + atk.stats.technique * 0.2) * (0.88 + Math.random() * 0.24)));
          if (isPlayer) playerHp = Math.max(0, playerHp - selfDmg); else opponentHp = Math.max(0, opponentHp - selfDmg);
          push(isPlayer ? 'player' : 'opponent', 'ailment', `${atkName}は「混乱」して自分を攻撃した！${selfDmg}ダメージ。`, selfDmg);
          if (expires) push('commentary', 'ailment', `${atkName}の「混乱」が消えた。`);
          if (playerHp <= 0 || opponentHp <= 0) return;
          return;
        }
        if (expires) push('commentary', 'ailment', `${atkName}の「混乱」が消えた。`);
      } else {
        push(isPlayer ? 'player' : 'opponent', 'ailment', `${atkName}は「固まり」で動けない！`, 0);
        if (isPlayer) playerAilment = null; else opponentAilment = null;
        return;
      }
    }

    // 補助技：使える技があれば、一定確率で攻撃の代わりに使う（ピンチの回復は優先）。
    if (movesOn) {
      const myMoveDefs = (atk.moves ?? []).map((id) => moveById(id)).filter((m): m is MoveDef => Boolean(m));
      if (myMoveDefs.length > 0) {
        const myStages = isPlayer ? playerStages : opponentStages;
        const foeStages = isPlayer ? opponentStages : playerStages;
        const myHpNow = isPlayer ? playerHp : opponentHp;
        const myMax = isPlayer ? playerMaxHp : opponentMaxHp;
        const foeAilment = isPlayer ? opponentAilment : playerAilment;
        const healUsed = isPlayer ? playerHealUses : opponentHealUses;
        const usable = myMoveDefs.filter((m) => {
          switch (m.kind) {
            // バフ・デバフは序盤の仕込みでのみ使う（終盤に使うと攻撃回数を失って割に合わないため）。
            case 'buffPower': return myActionCount <= 2 && myStages.power < 2;
            case 'buffSpeed': return myActionCount <= 2 && myStages.speed < 2;
            case 'buffGuard': return myActionCount <= 2 && myStages.guard < 2;
            case 'buffEvade': return myActionCount <= 2 && myStages.evade < 2;
            case 'heal': return myHpNow >= myMax * 0.28 && myHpNow <= myMax * 0.55 && healUsed < 2 && myActionCount - (isPlayer ? playerHealAtAction : opponentHealAtAction) >= 2;
            case 'regen': return (isPlayer ? playerRegen : opponentRegen) <= 0 && (myActionCount === 1 || (myHpNow >= myMax * 0.5 && myHpNow <= myMax * 0.9));
            case 'debuffPower': return myActionCount <= 3 && foeStages.power > -2;
            case 'debuffSpeed': return myActionCount <= 3 && foeStages.speed > -2;
            case 'debuffGuard': return myActionCount <= 3 && foeStages.guard > -2;
            case 'poison': return myActionCount <= 4 && ailmentsOn && !foeAilment && ELEMENT_AILMENT[def.elementType] !== 'nijimi';
            case 'drain': return myHpNow <= myMax * 0.92;
            case 'multiHit': return true;
            case 'priority': return myActionCount <= 2 && myStages.speed < 2;
            case 'accuracyDown': return myActionCount <= 3 && foeStages.accuracy > -2;
            case 'confuse': return myActionCount <= 4 && ailmentsOn && !foeAilment;
            case 'reset': {
              const foeUp = foeStages.power + foeStages.speed + foeStages.guard + foeStages.evade + foeStages.accuracy;
              const myDown = myStages.power + myStages.speed + myStages.guard + myStages.evade + myStages.accuracy;
              return foeUp > 0 || myDown < 0;
            }
            case 'berserk': return myActionCount <= 2 && myStages.power < 2;
            case 'wall': return myActionCount <= 2 && (myStages.guard < 2 || myStages.evade < 2);
            case 'buffAccuracy': return myActionCount <= 2 && myStages.accuracy < 2 && (myStages.accuracy < 0 || foeStages.evade > 0);
            case 'debuffEvade': return myActionCount <= 3 && foeStages.evade > -2;
            case 'setField': {
              const target = m.field;
              if (!target || target === field || myActionCount > 3) return false;
              return fieldMultiplier(target, atk.elementType) >= 1.1 || fieldMultiplier(target, def.elementType) <= 0.9;
            }
            default: return false;
          }
        });
        const useChance = myActionCount === 1 ? 0.55 : 0.3;
        const resetMove = usable.find((m) => m.kind === 'reset');
        const foeUpSum = foeStages.power + foeStages.speed + foeStages.guard + foeStages.evade;
        const fieldMove = usable.find((m) => m.kind === 'setField');
        let chosen: MoveDef | undefined;
        if (resetMove && foeUpSum >= 2 && Math.random() < 0.7) chosen = resetMove;
        else if (fieldMove && fieldMultiplier(field, atk.elementType) <= 0.85 && Math.random() < 0.6) chosen = fieldMove;
        else if (Math.random() < useChance && usable.length > 0) chosen = usable[Math.floor(Math.random() * usable.length)];
        if (chosen) {
          turn += 0;
          const gg = Math.round(9 + atk.stats.speed * 0.13 + atk.stats.technique * 0.04 + (isPlayer ? playerStages.speed : opponentStages.speed) * 3 + (isPlayer ? Math.max(0, (player.bond ?? 50) - 50) / 8 : 0));
          if (isPlayer) { playerGauge = Math.min(150, playerGauge + gg); opponentGauge = Math.min(150, opponentGauge + (opponentSpecialType === 'heavy' ? 14 : 6)); }
          else { opponentGauge = Math.min(150, opponentGauge + gg); playerGauge = Math.min(150, playerGauge + (playerSpecialType === 'heavy' ? 14 : 6)); }
          // 攻撃系の技（吸収・連撃）はここでダメージ処理する。
          if (chosen.kind === 'drain' || chosen.kind === 'multiHit') {
            const hitDamage = (rate: number): number => {
              let d = atk.stats.power * 0.62 + atk.stats.technique * 0.3 + atk.stats.speed * 0.14 + atk.stats.wisdom * 0.12;
              d *= elementMultiplier(atk.elementType, def.elementType);
              d *= fieldMultiplier(field, atk.elementType);
              d *= schoolMultiplier(atk.school, def.school);
              d *= 1 + 0.24 * (isPlayer ? playerStages.power : opponentStages.power);
              if (atk.school === '荒流') d *= 1.1;
              if (atk.school === '剛流') d *= 1.03;
              const mit = Math.max(0, Math.min(0.55, (def.stats.stamina + def.stats.wisdom) * 0.0011 + 0.12 * (isPlayer ? opponentStages.guard : playerStages.guard)));
              d *= 1 - mit;
              return Math.max(3, Math.round(d * rate * (0.88 + Math.random() * 0.24)));
            };
            if (chosen.kind === 'drain') {
              const dmg = hitDamage(0.8);
              if (isPlayer) opponentHp = Math.max(0, opponentHp - dmg); else playerHp = Math.max(0, playerHp - dmg);
              const healed = Math.max(2, Math.round(dmg * 0.7));
              if (isPlayer) playerHp = Math.min(playerMaxHp, playerHp + healed); else opponentHp = Math.min(opponentMaxHp, opponentHp + healed);
              push(isPlayer ? 'player' : 'opponent', 'support', `${atkName}の『${chosen.name}』！${defName}に${dmg}ダメージ、${healed}回復した！`, dmg);
            } else {
              const d1 = hitDamage(0.55);
              if (isPlayer) opponentHp = Math.max(0, opponentHp - d1); else playerHp = Math.max(0, playerHp - d1);
              let text = `${atkName}の『${chosen.name}』！${defName}に${d1}ダメージ！`;
              if (opponentHp > 0 && playerHp > 0) {
                const d2 = hitDamage(0.55);
                if (isPlayer) opponentHp = Math.max(0, opponentHp - d2); else playerHp = Math.max(0, playerHp - d2);
                text += `さらに${d2}ダメージ！`;
              }
              push(isPlayer ? 'player' : 'opponent', 'support', text, d1);
            }
            return;
          }
          applyMove(chosen, isPlayer, atkName, defName);
          // バフ・デバフ・毒は「刻みながらの攻撃」として半分の威力の攻撃も同時に行う（行動コストの緩和）。
          if (chosen.kind !== 'heal' && chosen.kind !== 'regen' && playerHp > 0 && opponentHp > 0) {
            let chip = atk.stats.power * 0.62 + atk.stats.technique * 0.3 + atk.stats.speed * 0.14 + atk.stats.wisdom * 0.12;
            chip *= elementMultiplier(atk.elementType, def.elementType);
            chip *= fieldMultiplier(field, atk.elementType);
            chip *= schoolMultiplier(atk.school, def.school);
            chip *= 1 + 0.24 * (isPlayer ? playerStages.power : opponentStages.power);
            if (atk.school === '荒流') chip *= 1.1;
            if (atk.school === '剛流') chip *= 1.03;
            const chipMitigation = Math.max(0, Math.min(0.55, (def.stats.stamina + def.stats.wisdom) * 0.0011 + 0.12 * (isPlayer ? opponentStages.guard : playerStages.guard)));
            chip *= 1 - chipMitigation;
            const chipRate = chosen.kind === 'buffPower' || chosen.kind === 'buffSpeed' || chosen.kind === 'buffGuard' || chosen.kind === 'buffEvade' || chosen.kind === 'berserk' || chosen.kind === 'wall' || chosen.kind === 'priority' || chosen.kind === 'buffAccuracy' ? 0.5 : 0.35;
            chip *= chipRate * (0.88 + Math.random() * 0.24);
            const chipDamage = Math.max(3, Math.round(chip));
            if (isPlayer) opponentHp = Math.max(0, opponentHp - chipDamage); else playerHp = Math.max(0, playerHp - chipDamage);
            push(isPlayer ? 'player' : 'opponent', 'attack', `さらに${atkName}の攻撃！${defName}に${chipDamage}ダメージ。`, chipDamage);
          }
          return;
        }
      }
    }

    const evadeChance = Math.max(0, (def.school === '奇流' ? 0.14 : 0) + 0.15 * (isPlayer ? opponentStages.evade : playerStages.evade) + (field === 'storm' ? 0.05 : 0) - 0.09 * Math.max(0, isPlayer ? playerStages.accuracy : opponentStages.accuracy));
    if (evadeChance > 0 && Math.random() < evadeChance) {
      push(isPlayer ? 'player' : 'opponent', 'evade', `${defName}はひらりと身をかわした！${atkName}の攻撃は空を切る。`, 0);
      // 回避した側の視点で反応する（byPlayer＝回避したのが手元かどうか）。
      maybeReact('evade', !isPlayer, defName);
      return;
    }
    const missChance = (atk.school === '荒流' ? 0.1 : 0) + 0.12 * Math.max(0, -(isPlayer ? playerStages.accuracy : opponentStages.accuracy));
    if (missChance > 0 && Math.random() < missChance) {
      push(isPlayer ? 'player' : 'opponent', 'attack', atk.school === '荒流' ? `${atkName}の攻撃は大きく外れた！荒流らしい大味な一撃。` : `${atkName}の攻撃は外れた！`, 0);
      return;
    }

    const atkSpecialType = isPlayer ? playerSpecialType : opponentSpecialType;
    const atkSpecialDef = SPECIAL_TYPES[atkSpecialType];
    const useSpecial = (isPlayer ? playerGauge : opponentGauge) >= atkSpecialDef.gauge;
    if (useSpecial) {
      if (isPlayer) playerGauge = 0; else opponentGauge = 0;
    }
    let base = atk.stats.power * 0.62 + atk.stats.technique * 0.3 + atk.stats.speed * 0.14 + atk.stats.wisdom * 0.12;
    base *= elementMultiplier(atk.elementType, def.elementType);
    base *= fieldMultiplier(field, atk.elementType);
    base *= schoolMultiplier(atk.school, def.school);
    base *= 1 + 0.24 * (isPlayer ? playerStages.power : opponentStages.power);
    if (atk.school === '荒流') base *= 1.1;
    if (atk.school === '剛流') base *= 1.03;
    if (atk.school === '変流') base *= 0.78 + Math.random() * 0.55;
    const mitigation = useSpecial && atkSpecialType === 'pierce' ? 0 : Math.max(0, Math.min(0.55, (def.stats.stamina + def.stats.wisdom) * 0.0011 + 0.12 * (isPlayer ? opponentStages.guard : playerStages.guard)));
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
    if (useSpecial) base *= atkSpecialDef.power;
    const damage = Math.max(6, Math.round(base));
    if (isPlayer) opponentHp = Math.max(0, opponentHp - damage); else playerHp = Math.max(0, playerHp - damage);

    // 状態異常の付与：固有異常のある属性（炎=やけど、雷=麻痺、水・氷=固まり、闇=滲み）は通常命中でも低確率、
    // それ以外は従来どおり属性有利の命中でのみ「滲み」。相手がその異常にならない体質なら付かない。連鎖付与はしない。
    let inflicted: AilmentKind | null = null;
    if (ailmentsOn) {
      const defAilment = isPlayer ? opponentAilment : playerAilment;
      if (!defAilment) {
        const signature = ELEMENT_AILMENT[atk.elementType];
        const advantage = elementMultiplier(atk.elementType, def.elementType) > 1;
        let kind: AilmentKind | null = null;
        let chance = 0;
        if (signature) { kind = signature; chance = advantage ? 0.18 : 0.1; }
        else if (advantage) { kind = 'nijimi'; chance = 0.18; }
        if (kind === 'mahi' && field === 'thunder') chance += 0.06;
        if (kind === 'yakedo' && field === 'rain') kind = null;
        if (kind && ELEMENT_AILMENT[def.elementType] !== kind && Math.random() < chance) {
          inflicted = kind;
          const left = kind === 'yakedo' ? 2 : kind === 'katamari' ? (field === 'snow' ? 2 : 1) : 3;
          if (isPlayer) opponentAilment = { kind, left }; else playerAilment = { kind, left };
        }
      }
    }

    // ゲージ増加（必殺を「1戦に1回あるかないかの見せ場」に寄せるため控えめに）
    const gaugeGain = Math.round(9 + atk.stats.speed * 0.13 + atk.stats.technique * 0.04 + (isPlayer ? playerStages.speed : opponentStages.speed) * 3 + (isPlayer ? Math.max(0, (player.bond ?? 50) - 50) / 8 : 0));
    if (isPlayer) playerGauge = Math.min(150, playerGauge + gaugeGain); else opponentGauge = Math.min(150, opponentGauge + gaugeGain);
    if (isPlayer) opponentGauge = Math.min(150, opponentGauge + (opponentSpecialType === 'heavy' ? 14 : 6)); else playerGauge = Math.min(150, playerGauge + (playerSpecialType === 'heavy' ? 14 : 6));

    if (useSpecial) {
      const typeTag = atkSpecialType === 'standard' ? '' : `（${atkSpecialDef.name}）`;
      push(isPlayer ? 'player' : 'opponent', 'special', `必殺技${typeTag}！${atkName}の${atk.specialMove}が炸裂！${defName}に${damage}ダメージ！`, damage);
      maybeReact('special', isPlayer, atkName);
      if (atkSpecialType === 'multi' && opponentHp > 0 && playerHp > 0) {
        const second = Math.max(4, Math.round(damage * (0.88 + Math.random() * 0.24)));
        if (isPlayer) opponentHp = Math.max(0, opponentHp - second); else playerHp = Math.max(0, playerHp - second);
        push(isPlayer ? 'player' : 'opponent', 'special', `連撃型の必殺技、2段目！${defName}に${second}ダメージ！`, second);
      }
    } else if (crit) {
      push(isPlayer ? 'player' : 'opponent', 'crit', `会心の一撃！${atkName}の攻撃が${defName}を捉えた！${damage}ダメージ！`, damage);
      maybeReact('crit', isPlayer, atkName);
    } else {
      push(isPlayer ? 'player' : 'opponent', 'attack', `${atkName}の攻撃！${defName}に${damage}ダメージ。`, damage);
    }

    if (inflicted) {
      push(isPlayer ? 'player' : 'opponent', 'ailment', `${defName}は「${AILMENT_NAMES[inflicted]}」にかかった！`);
    }

    // 速流の連撃
    if (atk.school === '速流' && opponentHp > 0 && playerHp > 0 && Math.random() < 0.26 + 0.04 * (isPlayer ? playerStages.speed : opponentStages.speed)) {
      const combo = Math.max(4, Math.round(damage * 0.45));
      if (isPlayer) opponentHp = Math.max(0, opponentHp - combo); else playerHp = Math.max(0, playerHp - combo);
      push(isPlayer ? 'player' : 'opponent', 'combo', `速流の連撃！${atkName}の追撃が${defName}に${combo}ダメージ！`, combo);
      maybeReact('combo', isPlayer, atkName);
    }

    if (!cheeredOpponentLow && opponentHp > 0 && opponentHp / opponentMaxHp <= 0.32) {
      cheeredOpponentLow = true;
      turn += 0;
      push('commentary', 'commentary', `実況コトハ「${oName}を追い詰めた！あと一押しです！」`);
    }
    if (!cheeredPlayerLow && playerHp > 0 && playerHp / playerMaxHp <= 0.32) {
      cheeredPlayerLow = true;
      push('commentary', 'commentary', `実況コトハ「${pName}が苦しい…！でも目がまだ死んでいない！」`);
    }
  };

  let rounds = 0;
  while (playerHp > 0 && opponentHp > 0 && rounds < 50) {
    rounds += 1;
    const playerFirst = playerPriority ? true : opponentPriority ? false : player.stats.speed + playerStages.speed * 7 + Math.random() * 12 >= opponent.stats.speed + opponentStages.speed * 7 + Math.random() * 12;
    playerPriority = false;
    opponentPriority = false;
    if (playerFirst) { attack(true); attack(false); }
    else { attack(false); attack(true); }
  }
  if (playerHp === opponentHp) {
    if (player.stats.technique >= opponent.stats.technique) opponentHp = 0; else playerHp = 0;
  }
  const won = opponentHp <= 0 && playerHp > 0;
  turn += 1;
  push('commentary', 'end', won
    ? `決着！${pName}の勝利！実況コトハ「決まったー！${pName}、最後まで立っていた！見事な勝利です！」`
    : `決着…${oName}の勝利。実況コトハ「${pName}もよく戦いました、拍手を送りましょう！」`);
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
    field: initialField,
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
