import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  ACTIONS,
  FOODS,
  blendColors,
  clamp,
  elementFromColor,
  firstGrapheme,
  generateMonster,
  graphemesOf,
  initialState,
  publicToMonster,
  sampleGhosts,
  scaleStatsToTotal,
  sellPrice,
  simulateBattle,
  specialMoveName,
  stageName,
  rivalOpponent,
  tierOpponent,
  totalOf,
  tournamentOpponent,
  wildOpponent,
  type BattleFighter,
  type BattleReport,
  type GameAction,
  type GameState,
  type Monster,
  type PublicMonster,
  type Stats,
  type TournamentOpponent,
} from './game';
import { CHARACTERS, RAN_TAUNTS, type SpeakerId } from './characters';
import { STORY_CHAPTERS } from './story';
import { backend, readCachedState, type AuthUserInfo, type BackendCapabilities } from './backend';
import { codePointsOf, formatLogs, type LogEntry, type LogKind } from './log';

export type Screen =
  | 'home'
  | 'createChar'
  | 'createStyle'
  | 'createConfirm'
  | 'feed'
  | 'action'
  | 'result'
  | 'detail'
  | 'arena'
  | 'battle'
  | 'free'
  | 'ghost'
  | 'collection'
  | 'fusion'
  | 'frozen'
  | 'hall'
  | 'tutorial'
  | 'graduate'
  | 'wild'
  | 'story'
  | 'storyRead'
  | 'settings'
  | 'mojikaHistory'
  | 'log';

export interface ToastItem {
  id: number;
  title: string;
  body: string;
  at: string;
  /** 話者（施設担当者など）。未指定はモジカ扱い。 */
  speaker?: SpeakerId;
}

export interface BattleSession {
  report: BattleReport;
  player: BattleFighter;
  opponent: BattleFighter;
  playerName: string;
  opponentName: string;
  kind: 'tournament' | 'free' | 'ghost' | 'random' | 'wild';
  prize: number;
  after: Screen;
}

export interface LastResult {
  title: string;
  text: string;
  mojika: string;
  /** その日に起きたランダムイベントの表示文（イベント名＋効果＋モジカのひと言）。 */
  event?: string;
}

export interface DetailSelection {
  monster: Monster | PublicMonster;
  source: string;
}

export const MATCH_DAYS = [7, 14, 21];
export const TOURNAMENT_PRIZES = [400, 800, 1500];
export const COLOR_PRESETS = ['#d43a2f', '#e07b24', '#f2c230', '#2f9e5f', '#35b6c9', '#2476c9', '#7656c9', '#ef7fb3', '#f5f2ea', '#22242a', '#8a8f98', '#8a5a2b'];
export const STORAGE_KEY = 'moji-monster-firebase-state-v1';
export const LOG_STORAGE_KEY = 'moji-monster-firebase-log-v1';
export const TOAST_HISTORY_KEY = 'moji-monster-toast-history-v1';

export const TUTORIAL_STEPS = [
  {
    title: 'ようこそ文字モンスター研究所へ！',
    body: 'わたしは助手のモジカ。ここでは「1文字＋色＋フォント」から、世界にひとつだけのモンスターが生まれるよ。同じ組み合わせからは、いつも同じ子が生まれるんだ。',
  },
  {
    title: '1日は、餌やりと行動で進むよ',
    body: '朝に餌を選ぶと、なつき度とお財布が変わるよ。そのあと特訓・自主練・労務・休息などの行動を選ぶと1日が終わる。コンディションが低いと伸びが鈍るから、休ませるのも大事！',
  },
  {
    title: '7日ごとに大会。21日目の決勝がゴール！',
    body: '7日目にデビュー戦、14日目に準決勝、21日目に決勝。全勝すれば殿堂入りだよ。育てた子は保存してフリーバトルや配合にも使える。Firebaseを設定すれば、ほかの人の子ともゴーストバトルできるよ。',
  },
];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadInitialState(): GameState {
  // 初回描画はアダプタのローカルキャッシュから同期的に復元する。
  // クラウド側の状態はサインイン後にアダプタ経由で取り込む。
  return readCachedState() ?? initialState();
}

export function statEntries(stats: Stats): { key: keyof Stats; label: string; value: number }[] {
  return [
    { key: 'power', label: 'パワー', value: stats.power },
    { key: 'speed', label: 'スピード', value: stats.speed },
    { key: 'stamina', label: 'スタミナ', value: stats.stamina },
    { key: 'technique', label: 'テクニック', value: stats.technique },
    { key: 'wisdom', label: 'かしこさ', value: stats.wisdom },
  ];
}

interface Store {
  game: GameState;
  setGame: React.Dispatch<React.SetStateAction<GameState>>;
  screen: Screen;
  go: (screen: Screen) => void;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  visibleToasts: ToastItem[];
  toastHistory: ToastItem[];
  addToast: (body: string, title?: string) => void;
  addStaffToast: (speaker: SpeakerId, body: string) => void;
  dismissToast: (id: number) => void;
  logs: LogEntry[];
  logText: string;
  clearLogs: () => void;
  addLog: (kind: LogKind, message: string) => void;
  updateInputChar: (value: string) => void;
  fbUser: AuthUserInfo | null;
  fbStatus: 'local' | 'connecting' | 'connected' | 'error';
  backendId: 'local' | 'firebase';
  capabilities: BackendCapabilities;
  publicMonsters: PublicMonster[];
  poolBusy: boolean;
  refreshPool: (notify?: boolean) => Promise<void>;
  handleGoogle: () => Promise<void>;
  inputChar: string;
  setInputChar: React.Dispatch<React.SetStateAction<string>>;
  inputColor: string;
  setInputColor: React.Dispatch<React.SetStateAction<string>>;
  inputFont: string;
  setInputFont: React.Dispatch<React.SetStateAction<string>>;
  isComposing: boolean;
  setIsComposing: React.Dispatch<React.SetStateAction<boolean>>;
  charCount: number;
  firstChar: string;
  overflowText: string;
  previewMonster: Monster | null;
  handleCharNext: () => void;
  createMonster: () => void;
  openCreate: () => void;
  selectedFoodId: string | null;
  setSelectedFoodId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedFood: (typeof FOODS)[number] | null;
  chooseFood: () => void;
  chooseAction: (action: GameAction) => void;
  lastResult: LastResult | null;
  battleSession: BattleSession | null;
  battleIntro: boolean;
  finishBattleIntro: () => void;
  playIndex: number;
  setPlayIndex: React.Dispatch<React.SetStateAction<number>>;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  speed: 1 | 2;
  setSpeed: React.Dispatch<React.SetStateAction<1 | 2>>;
  currentTurn: BattleReport['turns'][number] | null;
  battleFinished: boolean;
  startTournament: () => void;
  pendingWild: TournamentOpponent | null;
  startWildBattle: () => void;
  fleeWild: () => void;
  storyId: string | null;
  openStory: (id: string) => void;
  completeStory: () => void;
  startFreeBattle: () => void;
  startGhostBattle: (pub: PublicMonster, kind?: 'ghost' | 'random') => void;
  startRandomMatch: () => void;
  tier: 'weak' | 'normal' | 'strong';
  setTier: React.Dispatch<React.SetStateAction<'weak' | 'normal' | 'strong'>>;
  selectedBattleId: string;
  setSelectedBattleId: React.Dispatch<React.SetStateAction<string>>;
  selectedFighter: Monster | null;
  publishMonster: (monster: Monster) => Promise<void>;
  graduateSave: () => void;
  graduateDiscard: () => void;
  publishOnGraduate: boolean;
  setPublishOnGraduate: React.Dispatch<React.SetStateAction<boolean>>;
  sellTarget: Monster | null;
  setSellTarget: React.Dispatch<React.SetStateAction<Monster | null>>;
  confirmSell: () => void;
  fusionIds: string[];
  toggleFusion: (id: string) => void;
  fusionParents: Monster[];
  fusionLetter: 'a' | 'b';
  setFusionLetter: React.Dispatch<React.SetStateAction<'a' | 'b'>>;
  showFusionConfirm: boolean;
  setShowFusionConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  doFusion: () => void;
  hibernateActive: () => void;
  reviveMonster: (monster: Monster) => void;
  swapTarget: Monster | null;
  setSwapTarget: React.Dispatch<React.SetStateAction<Monster | null>>;
  confirmSwap: () => void;
  detail: DetailSelection | null;
  openDetail: (monster: Monster | PublicMonster, source: string) => void;
  tutorialStep: number;
  setTutorialStep: React.Dispatch<React.SetStateAction<number>>;
  closeTutorial: () => void;
  openTutorial: () => void;
  nextMatchDay: number | null;
  matchLabel: string;
  primaryLabel: string;
  primaryAction: () => void;
}

const GameContext = createContext<Store | null>(null);

export function useGame(): Store {
  const store = useContext(GameContext);
  if (!store) throw new Error('useGame must be used inside GameProvider');
  return store;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const initialRef = useRef<GameState | null>(null);
  if (!initialRef.current) initialRef.current = loadInitialState();

  const [game, setGame] = useState<GameState>(initialRef.current);
  const [screen, setScreen] = useState<Screen>(() => (initialRef.current?.tutorialSeen ? 'home' : 'tutorial'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [battleSession, setBattleSession] = useState<BattleSession | null>(null);
  const [pendingWild, setPendingWild] = useState<TournamentOpponent | null>(null);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [battleIntro, setBattleIntro] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [inputChar, setInputChar] = useState('龍');
  const [inputColor, setInputColor] = useState(() => COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
  const [inputFont, setInputFont] = useState('gothic');
  const [isComposing, setIsComposing] = useState(false);
  const [selectedBattleId, setSelectedBattleId] = useState('');
  const [tier, setTier] = useState<'weak' | 'normal' | 'strong'>('normal');
  const [fusionIds, setFusionIds] = useState<string[]>([]);
  const [fusionLetter, setFusionLetter] = useState<'a' | 'b'>('a');
  const [showFusionConfirm, setShowFusionConfirm] = useState(false);
  const [sellTarget, setSellTarget] = useState<Monster | null>(null);
  const [swapTarget, setSwapTarget] = useState<Monster | null>(null);
  const [publishOnGraduate, setPublishOnGraduate] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [detail, setDetail] = useState<DetailSelection | null>(null);
  const [visibleToasts, setVisibleToasts] = useState<ToastItem[]>([]);
  const [toastHistory, setToastHistory] = useState<ToastItem[]>(() => {
    try {
      const raw = localStorage.getItem(TOAST_HISTORY_KEY);
      const parsed = raw ? (JSON.parse(raw) as ToastItem[]) : [];
      return Array.isArray(parsed) ? parsed.slice(-100) : [];
    } catch {
      return [];
    }
  });
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const raw = localStorage.getItem(LOG_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as LogEntry[]) : [];
      return Array.isArray(parsed) ? parsed.slice(-400) : [];
    } catch {
      return [];
    }
  });
  const [fbUser, setFbUser] = useState<AuthUserInfo | null>(null);
  const [fbStatus, setFbStatus] = useState<Store['fbStatus']>(backend.id === 'firebase' ? 'connecting' : 'local');
  const [publicMonsters, setPublicMonsters] = useState<PublicMonster[]>(() => sampleGhosts());
  const [poolBusy, setPoolBusy] = useState(false);

  const stateRef = useRef(game);
  const visibleRef = useRef<ToastItem[]>([]);
  const syncReadyRef = useRef(false);
  const welcomedRef = useRef(false);

  const go = useCallback((next: Screen) => {
    setMenuOpen(false);
    // 生成フローへ外から入るたび、デフォルト色をランダムに選び直す（毎回同じ赤にならないように）。
    // フロー内の行き来（もどる／次へ）では選んだ色を保持する。
    if (next === 'createChar' && screen !== 'createChar' && screen !== 'createStyle' && screen !== 'createConfirm') {
      setInputColor(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
    }
    setScreen(next);
  }, [screen]);

  const active = game.active;
  const selectedFood = FOODS.find((food) => food.id === selectedFoodId) ?? null;
  const nextMatchDay = active ? MATCH_DAYS[Math.min(active.stage, 2)] : null;
  const matchLabel = !active
    ? '育成中なし'
    : active.runEnded
      ? active.runEnded === 'cleared' ? '全勝クリア！' : '育成終了'
      : active.awaitingBattle
        ? '本日 試合！'
        : nextMatchDay
          ? `次の試合まで ${Math.max(1, nextMatchDay - active.day + 1)}日`
          : '';

  const setVisibleBoth = useCallback((items: ToastItem[]) => {
    visibleRef.current = items;
    setVisibleToasts(items);
  }, []);

  // トーストは「束（デッキ）」として保持する：末尾が最新で一番上に表示される。
  // 上限を超えたら一番古いものから落とす（履歴には全件残る）。
  const addToast = useCallback((body: string, title = 'モジカ') => {
    const item: ToastItem = { id: Date.now() + Math.random(), title, body, at: new Date().toISOString() };
    setToastHistory((prev) => [...prev.slice(-99), item]);
    setVisibleBoth([...visibleRef.current, item].slice(-8));
  }, [setVisibleBoth]);

  // 施設担当者などが話す通知。タイトルは話者名、アイコンは話者の顔になる。
  const addStaffToast = useCallback((speaker: SpeakerId, body: string) => {
    const item: ToastItem = { id: Date.now() + Math.random(), title: CHARACTERS[speaker].name, body, at: new Date().toISOString(), speaker };
    setToastHistory((prev) => [...prev.slice(-99), item]);
    setVisibleBoth([...visibleRef.current, item].slice(-8));
  }, [setVisibleBoth]);

  const dismissToast = useCallback((id: number) => {
    setVisibleBoth(visibleRef.current.filter((toast) => toast.id !== id));
  }, [setVisibleBoth]);

  const addLog = useCallback((kind: LogKind, message: string) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      time: new Date().toISOString(),
      kind,
      message,
    };
    setLogs((prev) => [...prev.slice(-399), entry]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);
  const logText = useMemo(() => formatLogs(logs), [logs]);

  useEffect(() => {
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(TOAST_HISTORY_KEY, JSON.stringify(toastHistory));
    } catch {
      // 履歴を保存できなくてもゲーム表示は続行する
    }
  }, [toastHistory]);

  const prevScreenRef = useRef<Screen | null>(null);
  useEffect(() => {
    if (prevScreenRef.current !== screen) {
      addLog('screen', prevScreenRef.current ? `画面遷移: ${prevScreenRef.current} → ${screen}` : `初期画面: ${screen}`);
      prevScreenRef.current = screen;
    }
  }, [screen, addLog]);

  useEffect(() => {
    stateRef.current = game;
    // 保存はアダプタ経由に一本化する。LocalAdapterは即時にlocalStorageへ書く。
    // FirebaseAdapterのクラウド保存は下のデバウンス付きeffectが担う（キャッシュも併記される）。
    if (backend.id === 'local') void backend.saveState(game);
  }, [game]);

  useEffect(() => {
    if (welcomedRef.current) return;
    welcomedRef.current = true;
    if (stateRef.current.tutorialSeen) {
      const timer = window.setTimeout(() => addToast(stateRef.current.lastMojika), 450);
      return () => window.clearTimeout(timer);
    }
  }, [addToast]);

  useEffect(() => {
    if (game.collection.length > 0 && !game.collection.some((monster) => monster.id === selectedBattleId)) {
      setSelectedBattleId(game.collection[0].id);
    }
  }, [game.collection, selectedBattleId]);

  const refreshPool = useCallback(async (notify = true) => {
    if (!backend.capabilities.publicPool) {
      // ローカル環境では実プールは存在しない。表示はサンプル、対戦ボタンは無効化される。
      setPublicMonsters(sampleGhosts());
      return;
    }
    setPoolBusy(true);
    try {
      const fetched = await backend.fetchPublicMonsters();
      setPublicMonsters(fetched);
      if (notify) addToast(fetched.length > 0 ? `公開プールを更新したよ。${fetched.length}体のゴーストが見つかったよ。` : '公開プールはまだ空っぽ。サンプル相手とも戦えるよ。');
    } catch (error) {
      console.error(error);
      addLog('error', `公開プール取得失敗: ${error instanceof Error ? error.message : String(error)}`);
      setPublicMonsters(sampleGhosts());
      if (notify) addToast('公開プールの読み込みに失敗したから、サンプル相手を表示しているよ。', 'システム');
    } finally {
      setPoolBusy(false);
    }
  }, [addToast]);

  useEffect(() => {
    void refreshPool(false);
  }, [refreshPool]);

  useEffect(() => {
    if (backend.id === 'local') {
      setFbStatus('local');
      return;
    }
    const unsubscribe = backend.init(async (user) => {
      if (!user) {
        setFbStatus('error');
        return;
      }
      setFbUser(user);
      try {
        const cloud = await backend.loadState();
        const local = stateRef.current;
        const localIsFresh = !local.active && local.collection.length === 0 && local.hall.length === 0 && local.hibernation.length === 0;
        if (cloud && localIsFresh) setGame(cloud);
        else if (!cloud) await backend.saveState(local);
        syncReadyRef.current = true;
        setFbStatus('connected');
        void refreshPool(false);
      } catch (error) {
        console.error(error);
        addLog('error', `バックエンド接続/同期失敗: ${error instanceof Error ? error.message : String(error)}`);
        setFbStatus('error');
      }
    });
    return unsubscribe;
  }, [refreshPool]);

  useEffect(() => {
    if (backend.id !== 'firebase' || !fbUser || !syncReadyRef.current) return;
    const timer = window.setTimeout(() => {
      backend.saveState(stateRef.current).catch((error) => console.error(error));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [game, fbUser]);

  /* ---------- 生成フロー ---------- */
  const previewMonster = useMemo(() => {
    const grapheme = firstGrapheme(inputChar);
    if (!grapheme) return null;
    return generateMonster(grapheme, inputColor, inputFont);
  }, [inputChar, inputColor, inputFont]);

  // 入力値は一切加工しない。文字数の判定は書記素（grapheme）単位で行う。
  const inputGraphemes = useMemo(() => graphemesOf(inputChar), [inputChar]);
  const charCount = inputChar.trim() === '' ? 0 : inputGraphemes.length;
  const firstChar = inputGraphemes[0] ?? '';
  const overflowText = inputGraphemes.slice(1).join('');

  const openCreate = useCallback(() => {
    setMenuOpen(false);
    setScreen('createChar');
  }, []);

  /** 文字入力のたびに診断ログを残す。入力値そのものは一切加工しない。 */
  const updateInputChar = (value: string) => {
    setInputChar(value);
    const parts = graphemesOf(value);
    const effective = value.trim() === '' ? 0 : parts.length;
    addLog('input', `raw=${JSON.stringify(value)} codePoints=[${codePointsOf(value).join(' ')}] graphemes=[${parts.map((p) => JSON.stringify(p)).join(' ')}] count=${effective} overflow=${effective > 1}`);
  };

  const handleCharNext = () => {
    if (isComposing) return; // IME変換中は判定しない
    if (charCount === 0) {
      addLog('error', `文字ステップ検証NG: count=0（未入力） raw=${JSON.stringify(inputChar)}`);
      addToast('まだ文字が入力されていないよ。モンスターにしたい文字を1文字だけ入力してね。');
      return;
    }
    if (charCount > 1) {
      addLog('error', `文字ステップ検証NG: count=${charCount} overflow=true graphemes=[${inputGraphemes.map((p) => JSON.stringify(p)).join(' ')}]`);
      addToast(`「${firstChar}」のうしろに${charCount - 1}文字くっついているよ。モンスターになるのは最初の1文字だけだから、余分な文字を消してから進んでね。`);
      return;
    }
    addLog('input', `文字ステップ検証OK: char=${JSON.stringify(firstChar)} codePoints=[${codePointsOf(firstChar).join(' ')}] count=1`);
    setScreen('createStyle');
  };

  const createMonster = () => {
    if (active) {
      addToast('手元に育成中の子がいるよ。その子を冬眠させるか、育て切ってから新しい子を生もうね。');
      return;
    }
    if (!previewMonster || charCount !== 1) {
      addToast('あれ、文字が1文字じゃないみたい。最初のステップで確認してね。');
      setScreen('createChar');
      return;
    }
    const monster = previewMonster;
    setGame((prev) => ({
      ...prev,
      active: monster,
      lastEvent: `石盤の楔形文字が光り、文字モンスター「${monster.char}」が錬成された！${monster.elementType}属性・${monster.school}、性格は${monster.trait}。`,
      lastMojika: `やったぁ！「${monster.char}」ちゃんの誕生だよ！まずは朝ごはんをあげよう！`,
    }));
    addLog('create', `モンスター作成: char=${JSON.stringify(monster.char)} codePoints=[${codePointsOf(monster.char).join(' ')}] color=${monster.colorHex} font=${monster.fontId} element=${monster.elementType} school=${monster.school} total=${totalOf(monster.stats)}`);
    addToast(`「${monster.char}」の誕生だよ！${monster.elementType}属性・${monster.school}。まずは朝の餌やりから始めよう！`);
    setSelectedFoodId(null);
    setScreen('feed');
  };

  /* ---------- 1日の進行 ---------- */
  const chooseFood = () => {
    if (!active || active.runEnded || active.awaitingBattle) return;
    if (!selectedFood) {
      addToast('餌を1つ選んでから「この餌であげる」を押してね。安い餌はなつき度が下がるから気をつけて。');
      return;
    }
    if (game.wallet < selectedFood.cost) {
      addToast(`お金が足りないよ。${selectedFood.label}は${selectedFood.cost}G。今日は安い餌にするか、労務で稼ごう。`);
      return;
    }
    const food = selectedFood;
    const reaction =
      food.id === 'fruit' ? '星屑フルーツ！目をキラキラさせて大喜びしているよ。たまの贅沢は絆を深めるね。'
      : food.id === 'meat' ? '肉盛りプレート、もりもり食べたよ！いい食べっぷりだね。'
      : food.id === 'pellet' ? 'ペレットかぁ…。文句は言わないけど、ちょっと寂しそうだよ。'
      : 'うぅ…残りものはさすがに可哀そうだよぉ。お金がない日は労務で稼ごう？わたしも手伝うから！';
    setGame((prev) => prev.active ? {
      ...prev,
      wallet: prev.wallet - food.cost,
      active: {
        ...prev.active,
        bond: clamp(prev.active.bond + food.bond, 0, 100),
        condition: clamp(prev.active.condition + food.condition, 0, 100),
      },
      lastEvent: `${food.label}を食べた（なつき度${food.bond >= 0 ? '+' : ''}${food.bond}）。`,
      lastMojika: reaction,
    } : prev);
    addLog('turn', `Day ${active.day} 餌やり: ${food.label} cost=${food.cost}G bond=${food.bond >= 0 ? '+' : ''}${food.bond}`);
    addToast(reaction);
    setScreen('action');
  };

  const chooseAction = (action: GameAction) => {
    if (!active || active.runEnded || active.awaitingBattle) return;
    if (game.wallet < action.cost) {
      addToast(`「${action.label}」には${action.cost}Gかかるよ。今のお金じゃ足りないから、自主練か労務にしよう。`);
      return;
    }
    const before = active;
    const condFactor = before.condition < 35 ? 0.45 : before.condition < 55 ? 0.7 : 1;
    const bondFactor = before.bond >= 75 ? 1.15 : 1;
    const sabotaged = (action.id === 'tokkun' || action.id === 'jishu') && before.bond < 20 && Math.random() < 0.3;
    const gains: Stats = { power: 0, speed: 0, stamina: 0, technique: 0, wisdom: 0 };
    let condDelta = 0;
    let bondDelta = 0;
    let earned = 0;
    const add = (base: Partial<Stats>) => {
      (Object.keys(base) as (keyof Stats)[]).forEach((key) => {
        const v = base[key] ?? 0;
        if (v <= 0) return;
        const varied = Math.max(1, v + Math.floor(Math.random() * 3) - 1);
        gains[key] += Math.round(varied * condFactor * bondFactor);
      });
    };
    switch (action.id) {
      case 'tokkun': add({ power: 9, speed: 5, stamina: 7, technique: 7, wisdom: 4 }); condDelta = -24; break;
      case 'jishu': add({ power: 4, speed: 3, stamina: 3, technique: 3, wisdom: 2 }); condDelta = -12; break;
      case 'roumu': add({ power: 1, speed: 1, stamina: 2, technique: 2, wisdom: 1 }); condDelta = -18; earned = 300; break;
      case 'kyusoku': condDelta = 45; break;
      case 'asobu': add({ speed: 1, wisdom: 1 }); condDelta = 10; bondDelta = 8; break;
      case 'meisou': add({ technique: 3, wisdom: 6, stamina: 1 }); condDelta = 6; bondDelta = 2; break;
      default: break;
    }
    if (sabotaged) (Object.keys(gains) as (keyof Stats)[]).forEach((key) => { gains[key] = 0; });
    const updated: Monster = {
      ...before,
      stats: {
        power: before.stats.power + gains.power,
        speed: before.stats.speed + gains.speed,
        stamina: before.stats.stamina + gains.stamina,
        technique: before.stats.technique + gains.technique,
        wisdom: before.stats.wisdom + gains.wisdom,
      },
      bond: clamp(before.bond + bondDelta, 0, 100),
      condition: clamp(before.condition + condDelta, 0, 100),
    };
    const isMatchDay = MATCH_DAYS[Math.min(before.stage, 2)] === before.day;
    if (isMatchDay) updated.awaitingBattle = true;
    else updated.day = before.day + 1;

    // ランダムイベント：試合日でない日に約18%の確率で小さな出来事が起きる（バランスを壊さない範囲の効果のみ）。
    let eventWallet = 0;
    let dayEvent: { text: string; mojika: string } | null = null;
    let wild: TournamentOpponent | null = null;
    if (!isMatchDay && Math.random() < 0.18) {
      let roll = Math.floor(Math.random() * 6);
      if (roll === 5 && before.day < 3) roll = 4; // 野生の襲来は3日目から
      if (roll === 5) {
        wild = wildOpponent(totalOf(updated.stats));
        dayEvent = { text: `野生の「${wild.char}」が街に現れて暴れている！`, mojika: '大変！野生の文字モンスターだ！街が危ないよ！' };
      } else if (roll === 0) {
        const keys = Object.keys(updated.stats) as (keyof Stats)[];
        const key = keys[Math.floor(Math.random() * keys.length)];
        const label = statEntries(updated.stats).find((e) => e.key === key)?.label ?? key;
        updated.stats = { ...updated.stats, [key]: updated.stats[key] + 4 };
        dayEvent = { text: `${action.label}の最中、「${before.char}」がコツを掴んだ！${label}+4。`, mojika: `すごいすごい！「${before.char}」、今日は冴えてたね！` };
      } else if (roll === 1) {
        updated.condition = clamp(updated.condition + 12, 0, 100);
        dayEvent = { text: 'モジカが特製ドリンクを差し入れてくれた。コンディション+12。', mojika: 'ふふ、わたしの特製ドリンクだよ。元気出していこ！' };
      } else if (roll === 2) {
        eventWallet = 120;
        dayEvent = { text: '帰り道、落とし物を届けたら、お礼に120Gもらった。', mojika: 'いいことすると返ってくるんだね。ラッキー！' };
      } else if (roll === 3) {
        updated.bond = clamp(updated.bond + 6, 0, 100);
        dayEvent = { text: `「${before.char}」が楽しそうに寝言を言っていた。いい夢を見たみたい。なつき度+6。`, mojika: 'どんな夢だったんだろ。なんだか距離が縮まった気がするよ。' };
      } else {
        updated.stats = { ...updated.stats, technique: updated.stats.technique + 3 };
        updated.condition = clamp(updated.condition - 5, 0, 100);
        dayEvent = { text: '近所の子と模擬戦をした。テクニック+3、コンディション-5。', mojika: '実戦の感覚は大事だね。いい経験になったはず！' };
      }
    }

    const gainText = statEntries(gains).filter((e) => e.value !== 0).map((e) => `${e.label}+${e.value}`).join('、');
    const eventText = `${selectedFood ? `${selectedFood.label}を食べた。` : ''}${action.label}をした。`
      + (sabotaged ? '…と思ったら、なつき度が低くてサボっちゃった！' : gainText ? ` ${gainText}。` : '')
      + (earned ? ` ${earned}G稼いだ。` : '')
      + (dayEvent ? ` 【イベント】${dayEvent.text}` : '')
      + (isMatchDay ? ` 今日は${stageName(before.stage)}の日！` : '');
    const mojika = sabotaged
      ? 'あぁっ、サボっちゃった…！なつき度が低いとこうなるんだ。明日はいい餌で機嫌を取ってあげよう。'
      : condFactor < 1 && gainText
        ? `コンディション${before.condition}で伸びが鈍ったよ。無理させず、休息も混ぜてあげてね。`
        : action.id === 'kyusoku' ? 'ゆっくり休めたみたい。コンディションが回復したよ！'
        : action.id === 'roumu' ? 'お仕事お疲れさま！300G稼げたよ。これでいい餌が買えるね。'
        : action.id === 'asobu' ? 'たくさん遊んで、距離が縮まった気がするよ！'
        : 'いい調子！この積み重ねが試合で効いてくるよ。';
    setGame((prev) => ({ ...prev, wallet: prev.wallet - action.cost + earned + eventWallet, active: updated, lastEvent: eventText, lastMojika: mojika }));
    addLog('turn', `Day ${before.day} 行動=${action.label} sabotaged=${sabotaged} earned=${earned}G text=${eventText}`);
    if (dayEvent) addLog('turn', `Day ${before.day} ランダムイベント発生: ${dayEvent.text} eventWallet=${eventWallet}G`);
    setLastResult({ title: `${before.day}日目 ― ${action.label}`, text: eventText, mojika, event: dayEvent ? `${dayEvent.text} モジカ「${dayEvent.mojika}」` : undefined });
    setSelectedFoodId(null);
    addToast(isMatchDay ? `今日は${stageName(before.stage)}の日！アリーナへ向かおう！` : mojika);
    if (dayEvent) addToast(`【イベント】${dayEvent.text} ${dayEvent.mojika}`, 'イベント');
    if (wild) {
      setPendingWild(wild);
      addLog('turn', `Day ${before.day} 野生モンスター襲来: ${wild.name} total=${totalOf(wild.stats)}`);
    }
    setScreen(wild ? 'wild' : isMatchDay ? 'arena' : 'result');
  };

  /* ---------- バトル ---------- */
  const beginBattle = (session: BattleSession) => {
    setBattleSession(session);
    setBattleIntro(true);
    setPlayIndex(0);
    setPlaying(true);
    setScreen('battle');
  };

  const finishBattleIntro = useCallback(() => setBattleIntro(false), []);

  useEffect(() => {
    if (screen !== 'battle' || !battleSession || !playing || battleIntro) return;
    if (playIndex >= battleSession.report.turns.length - 1) return;
    // 表示中の行の種別で滞在時間を変える（必殺・会心・決着は長めに間を取る）。
    const kind = battleSession.report.turns[playIndex]?.kind;
    const baseMs = kind === 'special' ? 2000 : kind === 'crit' ? 1050 : kind === 'end' ? 1500 : 780;
    const timer = window.setTimeout(() => setPlayIndex((i) => i + 1), Math.round(baseMs / speed));
    return () => window.clearTimeout(timer);
  }, [screen, battleSession, playing, playIndex, speed, battleIntro]);

  const currentTurn = battleSession ? battleSession.report.turns[Math.min(playIndex, battleSession.report.turns.length - 1)] : null;
  const battleFinished = battleSession ? playIndex >= battleSession.report.turns.length - 1 : false;

  const startTournament = () => {
    if (!active || !active.awaitingBattle || active.runEnded) {
      if (active && !active.runEnded) addToast(`次の試合は${MATCH_DAYS[Math.min(active.stage, 2)]}日目の${stageName(active.stage)}だよ。育成を進めてね。`);
      else addToast('大会に出るには、試合当日の育成中の子が必要だよ。');
      return;
    }
    const opponent = rivalOpponent(active.stage, totalOf(active.stats));
    const report = simulateBattle(active, opponent, `「${active.char}」`, opponent.name);
    const prize = report.won ? TOURNAMENT_PRIZES[Math.min(active.stage, 2)] : 0;
    const updated: Monster = { ...active, awaitingBattle: false };
    if (report.won) {
      updated.wins = active.wins + 1;
      if (active.stage >= 2) { updated.runEnded = 'cleared'; updated.source = 'cleared'; }
      else { updated.stage = active.stage + 1; updated.day = active.day + 1; }
    } else {
      updated.losses = active.losses + 1;
      updated.runEnded = 'gameover';
      updated.source = 'gameover';
    }
    setGame((prev) => ({
      ...prev,
      wallet: prev.wallet + prize,
      active: updated,
      rivalRecord: {
        wins: (prev.rivalRecord?.wins ?? 0) + (report.won ? 1 : 0),
        losses: (prev.rivalRecord?.losses ?? 0) + (report.won ? 0 : 1),
      },
      lastEvent: report.won ? `${stageName(active.stage)}で${opponent.name}に勝利！賞金${prize}G。` : `${stageName(active.stage)}で${opponent.name}に敗北…。`,
      lastMojika: report.mojikaComment,
    }));
    addLog('battle', `大会 ${stageName(active.stage)} vs ${opponent.name}: ${report.won ? '勝利' : '敗北'} prize=${prize}G turns=${report.turns.length} rivalRecord=${(game.rivalRecord?.wins ?? 0) + (report.won ? 1 : 0)}勝${(game.rivalRecord?.losses ?? 0) + (report.won ? 0 : 1)}敗`);
    const stageIdx = Math.min(active.stage, 2);
    addStaffToast('ran', RAN_TAUNTS.pre[stageIdx]);
    beginBattle({ report, player: active, opponent, playerName: `「${active.char}」`, opponentName: opponent.name, kind: 'tournament', prize, after: updated.runEnded ? 'graduate' : 'feed' });
    addStaffToast('ran', report.won ? RAN_TAUNTS.win[stageIdx] : RAN_TAUNTS.lose[stageIdx]);
    addToast(report.mojikaComment);
  };

  /* ---------- 野生モンスター襲来 ---------- */
  const startWildBattle = () => {
    if (!active || !pendingWild) return;
    const wild = pendingWild;
    const report = simulateBattle(active, wild, `「${active.char}」`, wild.name);
    const prize = report.won ? 250 : 0;
    setGame((prev) => (prev.active ? {
      ...prev,
      wallet: prev.wallet + prize,
      active: {
        ...prev.active,
        bond: clamp(prev.active.bond + (report.won ? 3 : 0), 0, 100),
        condition: clamp(prev.active.condition - (report.won ? 0 : 12), 0, 100),
      },
      lastEvent: report.won ? `野生の「${wild.char}」を退治！街からお礼に${prize}G。` : `野生の「${wild.char}」に敗北…。調子-12。`,
      lastMojika: report.mojikaComment,
    } : prev));
    addLog('battle', `襲来迎撃 vs ${wild.name}: ${report.won ? '勝利' : '敗北'} prize=${prize}G turns=${report.turns.length}`);
    setPendingWild(null);
    addStaffToast('kotoha', `緊急実況！野生の「${wild.char}」を「${active.char}」が迎え撃つ！街の平和は守られるのかー！`);
    beginBattle({ report, player: active, opponent: wild, playerName: `「${active.char}」`, opponentName: wild.name, kind: 'wild', prize, after: 'result' });
    addToast(report.mojikaComment);
  };

  const fleeWild = () => {
    if (!pendingWild) return;
    const wild = pendingWild;
    const stolen = Math.min(100, game.wallet);
    setGame((prev) => ({
      ...prev,
      wallet: prev.wallet - stolen,
      lastEvent: `野生の「${wild.char}」をやり過ごしたが、餌を奪われた（-${stolen}G）。`,
    }));
    setLastResult((prev) => (prev ? { ...prev, text: `${prev.text} やり過ごしたら、野生の「${wild.char}」に餌を奪われてしまった（-${stolen}G）。` } : prev));
    addLog('turn', `野生モンスター襲来を回避: ${wild.name} stolen=${stolen}G`);
    setPendingWild(null);
    addStaffToast('mogumi', 'あぁっ、私の餌箱が…！まあ、みんな無事ならいいんだけど。');
    setScreen('result');
  };

  const applyCollectionBattle = (fighter: Monster, opponent: BattleFighter, opponentName: string, kind: 'free' | 'ghost' | 'random', rewardWin: number, rewardLose: number) => {
    const report = simulateBattle(fighter, opponent, `「${fighter.char}」`, opponentName);
    let prize = report.won ? rewardWin : rewardLose;
    let nextCount = stateRef.current.ghostRewardCount;
    let nextDate = stateRef.current.ghostRewardDate;
    if (kind !== 'free') {
      const today = todayKey();
      const used = stateRef.current.ghostRewardDate === today ? stateRef.current.ghostRewardCount : 0;
      if (used >= 5) prize = 0;
      else { nextCount = used + 1; nextDate = today; }
    }
    const updatedFighter: Monster = { ...fighter, wins: fighter.wins + (report.won ? 1 : 0), losses: fighter.losses + (report.won ? 0 : 1) };
    setGame((prev) => ({
      ...prev,
      wallet: prev.wallet + prize,
      collection: prev.collection.map((m) => (m.id === fighter.id ? updatedFighter : m)),
      ghostRewardCount: nextCount,
      ghostRewardDate: nextDate,
      lastEvent: `${opponentName}とのバトルに${report.won ? '勝利' : '敗北'}（${prize}G）。`,
      lastMojika: report.mojikaComment,
    }));
    addLog('battle', `${kind}バトル vs ${opponentName}: ${report.won ? '勝利' : '敗北'} prize=${prize}G turns=${report.turns.length}`);
    beginBattle({ report, player: fighter, opponent, playerName: `「${fighter.char}」`, opponentName, kind, prize, after: kind === 'free' ? 'collection' : 'ghost' });
    addToast(report.mojikaComment);
  };

  const selectedFighter = game.collection.find((m) => m.id === selectedBattleId) ?? null;

  const startFreeBattle = () => {
    if (!selectedFighter) { addToast('まずはコレクションに保存された子を選んでね。'); return; }
    const opponent = tierOpponent(tier, totalOf(selectedFighter.stats));
    const rewards = { weak: [100, 20], normal: [180, 30], strong: [300, 40] }[tier];
    applyCollectionBattle(selectedFighter, opponent, opponent.name, 'free', rewards[0], rewards[1]);
  };

  const startGhostBattle = (pub: PublicMonster, kind: 'ghost' | 'random' = 'ghost') => {
    if (!backend.capabilities.publicPool) { addToast('ほかの人のモンスターとの対戦は、Firebaseに接続すると遊べるよ。'); return; }
    if (!selectedFighter) { addToast('バトルに出す子を、コレクションから選んでね。'); return; }
    applyCollectionBattle(selectedFighter, publicToMonster(pub), `${pub.ownerName}の「${pub.char}」`, kind, 120, 30);
  };

  const startRandomMatch = () => {
    if (!backend.capabilities.publicPool) { addToast('ランダムマッチは、Firebaseに接続すると遊べるよ。'); return; }
    if (!selectedFighter) { addToast('バトルに出す子を、コレクションから選んでね。'); return; }
    const candidates = publicMonsters.filter((p) => p.ownerUid !== fbUser?.uid);
    if (candidates.length === 0) { addToast('まだ対戦相手が見つからないよ。公開プールを更新してみてね。'); return; }
    const ft = totalOf(selectedFighter.stats);
    const sorted = [...candidates].sort((a, b) => Math.abs(a.total - ft) - Math.abs(b.total - ft));
    const near = sorted.filter((p) => Math.abs(p.total - ft) <= Math.max(60, ft * 0.35));
    const pool = near.length > 0 ? near : sorted.slice(0, 3);
    startGhostBattle(pool[Math.floor(Math.random() * pool.length)], 'random');
  };

  /* ---------- ストーリー ---------- */
  const openStory = (id: string) => {
    setStoryId(id);
    setMenuOpen(false);
    setScreen('storyRead');
  };

  const completeStory = () => {
    if (storyId) {
      setGame((prev) => ({ ...prev, storySeen: [...new Set([...(prev.storySeen ?? []), storyId])] }));
      addLog('turn', `ストーリー既読: ${storyId}`);
    }
    setScreen('story');
  };

  /* ---------- 卒業・公開・売却 ---------- */
  const publishMonster = async (monster: Monster) => {
    if (!backend.capabilities.publicPool) { addToast('今はFirebase未接続（ローカルモード）だよ。Firebaseに接続すると、公開プールに登録できるようになるよ。'); return; }
    if (!fbUser) { addToast('Firebaseに接続中だよ。少し待ってからもう一度押してね。', 'システム'); return; }
    try {
      await backend.publishMonster(monster, game.displayName);
      setGame((prev) => ({
        ...prev,
        collection: prev.collection.map((m) => (m.id === monster.id ? { ...m, published: true } : m)),
        hall: prev.hall.map((m) => (m.id === monster.id ? { ...m, published: true } : m)),
      }));
      addToast(`「${monster.char}」を公開プールに登録したよ。ほかのブリーダーの挑戦を待とう！`);
      void refreshPool(false);
    } catch (error) {
      console.error(error);
      addLog('error', `公開プール登録失敗: ${error instanceof Error ? error.message : String(error)}`);
      addToast('公開に失敗しちゃった。通信状態とFirebaseの設定を確認してね。', 'システム');
    }
  };

  const graduateSave = () => {
    if (!active || !active.runEnded) return;
    const saved: Monster = { ...active, awaitingBattle: false };
    const alreadyCollected = game.collection.some((m) => m.id === saved.id);
    const alreadyHall = game.hall.some((m) => m.id === saved.id);
    setGame((prev) => ({
      ...prev,
      active: null,
      collection: alreadyCollected ? prev.collection : [...prev.collection, saved],
      hall: saved.runEnded === 'cleared' && !alreadyHall ? [...prev.hall, saved] : prev.hall,
      lastEvent: `「${saved.char}」が卒業し、コレクションに保存された。`,
      lastMojika: 'お疲れさま！これからもフリーバトルや配合で活躍できるよ。',
    }));
    if (publishOnGraduate && saved.runEnded === 'cleared' && backend.capabilities.publicPool) void publishMonster(saved);
    if (saved.runEnded === 'cleared') addStaffToast('shiori', `「${saved.char}」の記録、殿堂に大切に登録しました。全勝クリア、本当におめでとうございます。`);
    if (saved.runEnded === 'cleared' && !alreadyHall) {
      const newHallCount = game.hall.length + 1;
      STORY_CHAPTERS.filter((c) => c.unlockHall === newHallCount).forEach((c) => {
        addStaffToast('shiori', `物語の新しい章が開かれました。「${c.title}」――メニューのストーリーから読めます。`);
      });
    }
    addToast('コレクションに保存したよ。いつでもフリーバトルに連れて行けるよ。');
    setScreen('collection');
  };

  const graduateDiscard = () => {
    if (!active) return;
    setGame((prev) => ({ ...prev, active: null, lastMojika: 'うん、分かった。次はどんな子を生もうか？' }));
    setScreen('home');
  };

  const confirmSell = () => {
    if (!sellTarget) return;
    const target = sellTarget;
    const price = sellPrice(target);
    setSellTarget(null);
    setGame((prev) => ({
      ...prev,
      wallet: prev.wallet + price,
      collection: prev.collection.filter((m) => m.id !== target.id),
      lastEvent: `「${target.char}」とお別れした（${price}G）。`,
    }));
    if (backend.capabilities.publicPool && target.published) void backend.unpublishMonster(target).catch(() => undefined);
    addStaffToast('shiori', `「${target.char}」の記録は、私が最後まで大切に保管しておきますね。`);
    addToast(`「${target.char}」、今までありがとう…！${price}Gを受け取ったよ。`);
  };

  /* ---------- 配合 ---------- */
  const toggleFusion = (id: string) => {
    setFusionIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 2 ? [prev[1], id] : [...prev, id]));
  };
  const fusionParents = fusionIds.map((id) => game.collection.find((m) => m.id === id)).filter((m): m is Monster => Boolean(m));

  const doFusion = () => {
    if (fusionParents.length !== 2) return;
    if (active) {
      setShowFusionConfirm(false);
      addToast('配合で生まれる子は手元で育てるよ。今の子を冬眠させて、手元を空けてから配合してね。');
      return;
    }
    const [a, b] = fusionParents;
    const childChar = (fusionLetter === 'a' ? a : b).char;
    const color = blendColors(a.colorHex, b.colorHex);
    const fontId = a.fontId === b.fontId ? a.fontId : Math.random() < 0.5 ? a.fontId : b.fontId;
    const base = generateMonster(childChar, color, fontId);
    const keys = Object.keys(base.stats) as (keyof Stats)[];
    const stats: Stats = { ...base.stats };
    keys.forEach((key) => {
      const av = a.stats[key];
      const bv = b.stats[key];
      const low = Math.min(av, bv);
      const high = Math.max(av, bv);
      const mid = (av + bv) / 2;
      const r = Math.random();
      let v: number;
      if (r < 0.5) v = mid * (0.9 + Math.random() * 0.2);
      else if (r < 0.75) v = high - Math.random() * Math.max(1, (high - mid) * 0.5);
      else if (r < 0.9) v = low + Math.random() * Math.max(1, (mid - low) * 0.5);
      else v = high * (1.05 + Math.random() * 0.1);
      stats[key] = Math.round(v);
    });
    if (a.fontId === b.fontId) keys.forEach((key) => { stats[key] += 2; });
    if (a.char === b.char) keys.forEach((key) => { stats[key] += 3; });
    const floor = Math.max(totalOf(a.stats), totalOf(b.stats));
    const finalStats = totalOf(stats) < floor ? scaleStatsToTotal(stats, floor) : stats;
    const generation = Math.max(a.generation, b.generation) + 1;
    const avgBond = (a.bond + b.bond) / 2;
    const child: Monster = {
      ...base,
      id: `fusion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      stats: finalStats,
      specialMove: specialMoveName(childChar, elementFromColor(color), fontId),
      bond: clamp(50 + Math.max(0, (avgBond - 60) / 2), 50, 80),
      condition: 100,
      day: 1,
      stage: 0,
      wins: 0,
      losses: 0,
      generation,
      isBred: true,
      source: 'fusion',
      lineage: `「${a.char}」（第${a.generation}世代）×「${b.char}」（第${b.generation}世代）`,
      createdAt: new Date().toISOString(),
    };
    setGame((prev) => ({
      ...prev,
      active: child,
      collection: prev.collection.filter((m) => m.id !== a.id && m.id !== b.id),
      lastEvent: `配合で「${child.char}」（第${generation}世代）が誕生した！`,
      lastMojika: '配合成功！両親のいいところを受け継いでいるよ。1日目から大切に育てよう！',
    }));
    setFusionIds([]);
    setShowFusionConfirm(false);
    addLog('create', `配合作成: parents=${a.char}×${b.char} char=${JSON.stringify(child.char)} color=${color} font=${fontId} total=${totalOf(finalStats)} generation=${generation}`);
    addStaffToast('tsumugi', `「${a.char}」と「${b.char}」の特徴、ちゃんと受け継がれてるよ。第${generation}世代の誕生、立ち会えて光栄だわ。`);
    addToast(`配合で「${child.char}」が生まれたよ！総合力${totalOf(finalStats)}、第${generation}世代だよ。`);
    setSelectedFoodId(null);
    setScreen('feed');
  };

  /* ---------- 冬眠（凍結保管） ---------- */
  const hibernateActive = () => {
    if (!active || active.runEnded) { addToast('冬眠できるのは育成中の子だけだよ。'); return; }
    if (game.hibernation.length >= 6) { addToast('凍結保管がいっぱいだよ（6体まで）。どれか復活させてからにしてね。'); return; }
    const frozen = { ...active };
    setGame((prev) => ({ ...prev, active: null, hibernation: [...prev.hibernation, frozen], lastMojika: '冬眠中はチルミがしっかり見ててくれるよ。' }));
    addStaffToast('chirumi', `「${frozen.char}」ちゃん、おやすみ…。温度はばっちり、私が見てるから安心してね。`);
    addToast(`「${frozen.char}」を凍結保管したよ。${frozen.day}日目から続きを育てられるよ。`);
  };

  const reviveMonster = (monster: Monster) => {
    if (active) {
      if (active.runEnded) { addToast('今の子の卒業手続きを先に済ませてね。'); return; }
      setSwapTarget(monster);
      return;
    }
    setGame((prev) => ({ ...prev, active: { ...monster }, hibernation: prev.hibernation.filter((m) => m.id !== monster.id), lastMojika: '冬眠から復活！続きを育てよう。' }));
    addStaffToast('chirumi', `「${monster.char}」ちゃん、おはよ…。よく眠れたみたいだね。`);
    addToast(`「${monster.char}」が目覚めたよ！${monster.day}日目の続きから育てよう。`);
    setSelectedFoodId(null);
    setScreen('feed');
  };

  const confirmSwap = () => {
    if (!swapTarget || !active) return;
    const current = { ...active };
    const target = swapTarget;
    setSwapTarget(null);
    setGame((prev) => ({ ...prev, active: { ...target }, hibernation: prev.hibernation.map((m) => (m.id === target.id ? current : m)), lastMojika: '入れ替え完了！' }));
    addStaffToast('chirumi', '入れ替え完了…。二人とも、しっかり管理するからね。');
    addToast(`「${current.char}」は凍結保管へ、「${target.char}」が手元に来たよ。`);
    setSelectedFoodId(null);
    setScreen('feed');
  };

  /* ---------- 詳細・アカウント・チュートリアル ---------- */
  const openDetail = (monster: Monster | PublicMonster, source: string) => {
    setDetail({ monster, source });
    setMenuOpen(false);
    setScreen('detail');
  };

  const handleGoogle = async () => {
    if (!fbUser || !backend.capabilities.googleLink) return;
    try {
      const info = await backend.linkGoogle();
      setFbUser(info);
      addToast('Googleアカウントと連携できたよ。ほかの端末でも同じデータで遊べるようになるよ。', 'システム');
    } catch (error) {
      console.error(error);
      addLog('error', `Google連携失敗: ${error instanceof Error ? error.message : String(error)}`);
      addToast('Google連携に失敗しちゃった。ポップアップがブロックされていないか確認してね。', 'システム');
    }
  };

  const closeTutorial = () => {
    setGame((prev) => (prev.tutorialSeen ? prev : { ...prev, tutorialSeen: true }));
    setScreen('home');
  };

  const openTutorial = () => {
    setTutorialStep(0);
    setMenuOpen(false);
    setScreen('tutorial');
  };

  const primaryLabel = !active ? '石盤でモンスターを錬成する' : active.runEnded ? '卒業の手続きへ' : active.awaitingBattle ? 'アリーナへ ― 今日は試合の日！' : '育成をはじめる';
  const primaryAction = () => {
    if (!active) { openCreate(); return; }
    if (active.runEnded) { setScreen('graduate'); return; }
    if (active.awaitingBattle) { setScreen('arena'); return; }
    setScreen('feed');
  };

  const value: Store = {
    game, setGame, screen, go, menuOpen, setMenuOpen,
    visibleToasts, toastHistory, addToast, addStaffToast, dismissToast,
    logs, logText, clearLogs, addLog, updateInputChar,
    fbUser, fbStatus, backendId: backend.id, capabilities: backend.capabilities, publicMonsters, poolBusy, refreshPool, handleGoogle,
    inputChar, setInputChar, inputColor, setInputColor, inputFont, setInputFont,
    isComposing, setIsComposing, charCount, firstChar, overflowText, previewMonster,
    handleCharNext, createMonster, openCreate,
    selectedFoodId, setSelectedFoodId, selectedFood, chooseFood, chooseAction, lastResult,
    battleSession, battleIntro, finishBattleIntro, playIndex, setPlayIndex, playing, setPlaying, speed, setSpeed,
    currentTurn, battleFinished, startTournament, pendingWild, startWildBattle, fleeWild, storyId, openStory, completeStory, startFreeBattle, startGhostBattle, startRandomMatch,
    tier, setTier, selectedBattleId, setSelectedBattleId, selectedFighter,
    publishMonster, graduateSave, graduateDiscard, publishOnGraduate, setPublishOnGraduate,
    sellTarget, setSellTarget, confirmSell,
    fusionIds, toggleFusion, fusionParents, fusionLetter, setFusionLetter,
    showFusionConfirm, setShowFusionConfirm, doFusion,
    hibernateActive, reviveMonster, swapTarget, setSwapTarget, confirmSwap,
    detail, openDetail, tutorialStep, setTutorialStep, closeTutorial, openTutorial,
    nextMatchDay, matchLabel, primaryLabel, primaryAction,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
