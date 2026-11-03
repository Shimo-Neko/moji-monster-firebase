import { useRef, type CSSProperties } from 'react';
import MonsterFace from './MonsterFace';
import { ELEMENT_COLORS, fontById, totalOf, type BattleFighter, type BattleTurn } from '../lib/game';

/** バトル演出部品群：ヒット演出・カットイン・VS導入・決着演出。
 *  観戦画面（screens/BattleWatchScreen）から使う。アニメーション定義は styles.css。 */

type TurnKind = BattleTurn['kind'];
export type FighterRole = 'attacker' | 'defender' | null;

interface FighterViewProps {
  fighter: BattleFighter;
  name: string;
  hp: number;
  maxHp: number;
  gauge: number;
  enemy?: boolean;
  role: FighterRole;
  kind: TurnKind | null;
  damage: number;
  /** 被弾側に使う、攻撃側の属性色。 */
  hitColor?: string;
  /** ターン識別子（playIndex）。変わるたびにアニメーションを再生し直す。 */
  turnKey: number;
}

/** 対戦者1体分の表示：顔＋ヒット演出＋ダメージ数字＋HPバー（残像ゴースト付き）。 */
export function BattleFighterView({ fighter, name, hp, maxHp, gauge, enemy = false, role, kind, damage, hitColor, turnKey }: FighterViewProps) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  // 必殺はカットインの後にヒットさせるため、被弾側の演出を少し遅らせる。
  const hitDelay = kind === 'special' ? '0.85s' : '0s';

  let animClass = '';
  if (role === 'attacker') {
    animClass = enemy ? 'fx-lunge-l' : 'fx-lunge-r';
    if (kind === 'crit') animClass += ' fx-lunge-crit';
    if (kind === 'special') animClass += ' fx-charge';
  } else if (role === 'defender') {
    if (kind === 'evade') animClass = 'fx-dodge';
    else if (kind === 'special') animClass = 'fx-hit fx-hit-special';
    else if (kind === 'crit') animClass = 'fx-hit fx-hit-crit';
    else if (damage > 0) animClass = 'fx-hit';
  }

  const showParticles = role === 'defender' && damage > 0 && kind !== 'evade';
  const popKind = kind === 'special' ? 'special' : kind === 'crit' ? 'crit' : 'normal';

  return (
    <div className="battle-fighter">
      <div className="fx-face-wrap">
        <div key={turnKey} className={animClass} style={role === 'defender' ? { animationDelay: hitDelay } : undefined}>
          <MonsterFace fighter={fighter} size={92} />
        </div>
        {role === 'defender' && kind !== 'evade' && damage > 0 && (
          <span key={`flash-${turnKey}`} className="fx-flash" style={{ background: hitColor ?? '#ffffff', animationDelay: hitDelay }} />
        )}
        {showParticles && (
          <span key={`particles-${turnKey}`} className="fx-particles" style={{ '--fx-delay': hitDelay } as CSSProperties}>
            {Array.from({ length: 7 }, (_, i) => {
              const ang = (((i * 53 + turnKey * 41) % 360) * Math.PI) / 180;
              const dist = 36 + ((i * 29 + turnKey * 13) % 34);
              const style = {
                '--tx': `${Math.round(Math.cos(ang) * dist)}px`,
                '--ty': `${Math.round(Math.sin(ang) * dist)}px`,
                background: hitColor ?? '#ffffff',
              } as CSSProperties;
              return <i key={i} style={style} />;
            })}
          </span>
        )}
        {role === 'defender' && kind === 'evade' && <span key={`pop-${turnKey}`} className="damage-pop evade-pop">回避！</span>}
        {role === 'defender' && kind !== 'evade' && damage > 0 && (
          <span key={`pop-${turnKey}`} className={`damage-pop pop-${popKind}`} style={{ animationDelay: hitDelay }}>-{damage}</span>
        )}
        {role === 'defender' && kind !== 'evade' && damage === 0 && kind === 'attack' && <span key={`pop-${turnKey}`} className="damage-pop miss-pop">MISS</span>}
      </div>
      <p>{name}</p>
      <div className={`hp-bar${enemy ? ' enemy' : ''}`}>
        <i className="hp-ghost" style={{ width: `${pct}%` }} />
        <i className="hp-main" style={{ width: `${pct}%` }} />
      </div>
      <small>HP {hp}/{maxHp}｜ゲージ {gauge}%</small>
    </div>
  );
}

/** 必殺カットイン：文字の拡大＋技名の帯＋属性色フラッシュ。 */
export function SpecialCutIn({ fighter }: { fighter: BattleFighter }) {
  const elColor = ELEMENT_COLORS[fighter.elementType];
  const font = fontById(fighter.fontId);
  return (
    <div className="cutin-overlay" aria-hidden>
      <div className="cutin-flash" style={{ background: `radial-gradient(circle at 50% 42%, ${elColor}66 0, transparent 62%)` }} />
      <div
        className="cutin-glyph"
        style={{ color: fighter.colorHex, fontFamily: font.stack, textShadow: `0 0 34px ${elColor}, 0 6px 0 #00000055` }}
      >
        {fighter.char}
      </div>
      <div className="cutin-band" style={{ borderColor: elColor }}>
        <span>{fighter.specialMove}</span>
      </div>
    </div>
  );
}

/** 勝利時の紙吹雪／光の粒子（CSSのみ）。 */
export function VictoryConfetti() {
  const colors = ['#ffd166', '#57c7ff', '#ff7847', '#7be382', '#ef7fb3', '#fff3b0'];
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 16 }, (_, i) => {
        const style = {
          left: `${(i * 61 + 7) % 100}%`,
          background: colors[i % colors.length],
          animationDelay: `${(i % 8) * 0.16}s`,
          animationDuration: `${2.1 + ((i * 7) % 10) / 9}s`,
        } as CSSProperties;
        return <i key={i} style={style} />;
      })}
    </div>
  );
}

interface BattleIntroProps {
  title: string;
  player: BattleFighter;
  opponent: BattleFighter;
  playerName: string;
  opponentName: string;
  onStart: () => void;
}

/** VS導入：両者の大きな顔とステータス比較。タップで開始する（自動では始まらない）。
 *  前の画面のボタンへのタップが、画面切替後のこの全面ボタンへ貫通して
 *  即開始してしまうのを防ぐため、表示直後600msのタップは無効化する（タップスルー対策）。 */
export function BattleIntro({ title, player, opponent, playerName, opponentName, onStart }: BattleIntroProps) {
  const mountedAtRef = useRef(Date.now());
  const handleStart = () => {
    if (Date.now() - mountedAtRef.current < 600) return;
    onStart();
  };

  const rows: { label: string; p: string; o: string }[] = [
    { label: '属性', p: player.elementType, o: opponent.elementType },
    { label: '流派', p: player.school, o: opponent.school },
    { label: '総合力', p: String(totalOf(player.stats)), o: String(totalOf(opponent.stats)) },
  ];

  return (
    <button type="button" className="battle-intro" onClick={handleStart} aria-label="バトル開始">
      <span className="intro-title">{title}</span>
      <span className="intro-faces">
        <span className="intro-side">
          <MonsterFace fighter={player} size={112} />
          <strong>{playerName}</strong>
        </span>
        <span className="vs intro-vs">VS</span>
        <span className="intro-side">
          <MonsterFace fighter={opponent} size={112} />
          <strong>{opponentName}</strong>
        </span>
      </span>
      <span className="intro-compare">
        {rows.map((row) => (
          <span key={row.label} className="intro-row">
            <span className="intro-val">{row.p}</span>
            <span className="intro-label">{row.label}</span>
            <span className="intro-val">{row.o}</span>
          </span>
        ))}
      </span>
      <span className="intro-hint">タップで開始</span>
    </button>
  );
}
