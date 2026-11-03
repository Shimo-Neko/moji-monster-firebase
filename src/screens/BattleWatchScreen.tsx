import { useEffect, useRef, type CSSProperties } from 'react';
import arenaBg from '../assets/arena.webp';
import { BattleFighterView, BattleIntro, SpecialCutIn, VictoryConfetti, type FighterRole } from '../components/BattleEffects';
import { AILMENT_NAMES, ELEMENT_COLORS, FIELDS, type AilmentKind, type BattleTurn, type FieldKind } from '../lib/game';
import { useGame } from '../lib/store';
import { ensureMonsterFonts } from '../lib/fonts';

/** アリーナ背景：観戦ログの視認性を優先し、暗めのオーバーレイ越しに薄く敷く。 */
const ARENA_BG_STYLE: CSSProperties = {
  backgroundImage: `linear-gradient(180deg, rgba(10, 16, 26, 0.8), rgba(10, 16, 26, 0.9)), url(${arenaBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const FIELD_ICONS: Record<FieldKind, string> = { rain: '🌧️', sunny: '☀️', snow: '❄️', thunder: '⚡', storm: '🌪️', mud: '🟤' };
const AILMENT_ICONS: Record<AilmentKind, string> = { nijimi: '💜', yakedo: '🔥', mahi: '⚡', katamari: '🧊', konran: '🌀' };
const STAGE_DEFS: { key: 'power' | 'speed' | 'guard' | 'evade' | 'accuracy'; label: string }[] = [
  { key: 'power', label: '攻撃' },
  { key: 'speed', label: '素早さ' },
  { key: 'guard', label: '耐久' },
  { key: 'evade', label: '回避' },
  { key: 'accuracy', label: '命中' },
];

/** その行時点の状態（状態異常・リジェネ・段階変化）をアイコンチップで示す。 */
function StatusChips({ turn, side }: { turn: BattleTurn; side: 'player' | 'opponent' }) {
  const ailment = side === 'player' ? turn.playerAilment : turn.opponentAilment;
  const stages = side === 'player' ? turn.playerStages : turn.opponentStages;
  const regen = side === 'player' ? turn.playerRegen : turn.opponentRegen;
  return (
    <div className="status-chips">
      {ailment && <span className="st-chip ailment">{AILMENT_ICONS[ailment]} {AILMENT_NAMES[ailment]}</span>}
      {regen > 0 && <span className="st-chip regen">🌿 リジェネ</span>}
      {STAGE_DEFS.map((d) => {
        const v = stages[d.key];
        if (v === 0) return null;
        return <span key={d.key} className={`st-chip ${v > 0 ? 'up' : 'down'}`}>{d.label}{v > 0 ? '▲' : '▼'}{Math.abs(v)}</span>;
      })}
    </div>
  );
}

const KIND_TITLES = {
  tournament: '大会バトル',
  free: 'フリーバトル',
  ghost: 'ゴーストバトル',
  random: 'ランダムマッチ',
  wild: '野生モンスター迎撃',
  dojo: '道場破り',
} as const;

/** バトル観戦：VS導入→対戦カードとHPは固定、ログだけが内側スクロール＋自動スクロール。
 *  ヒット演出・ダメージ数字・必殺カットインなどの演出は components/BattleEffects が担う。 */
export default function BattleWatchScreen() {
  const s = useGame();
  // 対戦相手の字体（装飾フォント）も正しく表示するため、バトル開始時に読み込む。
  useEffect(() => { ensureMonsterFonts(); }, []);
  const session = s.battleSession;
  const turn = s.currentTurn;
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [s.playIndex]);

  if (!session || !turn) {
    return (
      <section className="screen center-screen">
        <h2>観戦中のバトルはありません</h2>
        <div className="footer-actions"><button className="primary-button big" onClick={() => s.go('arena')}>アリーナへ</button></div>
      </section>
    );
  }

  if (s.battleIntro) {
    return (
      <section className="screen battle-screen" style={ARENA_BG_STYLE}>
        <BattleIntro
          title={KIND_TITLES[session.kind]}
          player={session.player}
          opponent={session.opponent}
          playerName={session.playerName}
          opponentName={session.opponentName}
          onStart={s.finishBattleIntro}
        />
      </section>
    );
  }

  const isAction = turn.actor === 'player' || turn.actor === 'opponent';
  const playerRole: FighterRole = !isAction ? null : turn.actor === 'player' ? 'attacker' : 'defender';
  const opponentRole: FighterRole = !isAction ? null : turn.actor === 'opponent' ? 'attacker' : 'defender';
  const attacker = turn.actor === 'player' ? session.player : session.opponent;
  const hitColor = ELEMENT_COLORS[attacker.elementType];
  const won = session.report.won;

  return (
    <section className={`screen battle-screen${turn.kind === 'special' ? ' fx-screen-shake' : ''}${s.battleFinished && !won ? ' defeat-dim' : ''}`} style={ARENA_BG_STYLE} key={session.report.id}>
      {turn.field && (
        <div key={turn.field} className="field-bar field-flash">フィールド：{FIELD_ICONS[turn.field]} {FIELDS[turn.field].name} ― {FIELDS[turn.field].note}</div>
      )}
      <div className="versus-box">
        <BattleFighterView
          fighter={session.player}
          name={session.playerName}
          hp={turn.playerHp}
          maxHp={session.report.playerMaxHp}
          gauge={turn.playerGauge}
          role={playerRole}
          status={<StatusChips turn={turn} side="player" />}
          kind={isAction ? turn.kind : null}
          damage={turn.actor === 'opponent' ? turn.damage : 0}
          hitColor={hitColor}
          turnKey={s.playIndex}
        />
        <span className="vs">VS</span>
        <BattleFighterView
          fighter={session.opponent}
          name={session.opponentName}
          hp={turn.opponentHp}
          maxHp={session.report.opponentMaxHp}
          gauge={turn.opponentGauge}
          enemy
          role={opponentRole}
          status={<StatusChips turn={turn} side="opponent" />}
          kind={isAction ? turn.kind : null}
          damage={turn.actor === 'player' ? turn.damage : 0}
          hitColor={hitColor}
          turnKey={s.playIndex}
        />
      </div>
      <div className="battle-log" ref={logRef}>
        {session.report.turns.slice(0, s.playIndex + 1).map((t, i) => (
          <p key={i} className={t.actor === 'commentary' ? 'commentary' : ''}>{t.text}</p>
        ))}
      </div>
      {turn.kind === 'special' && isAction && <SpecialCutIn key={`cutin-${s.playIndex}`} fighter={attacker} />}
      {s.battleFinished && won && <VictoryConfetti />}
      <div className="footer-actions">
        {s.battleFinished ? (
          <>
            <p className="result-line">{won ? '勝利！' : '敗北…'} {session.prize > 0 ? `賞金${session.prize}G` : ''}</p>
            <button className="primary-button big" onClick={() => s.go(session.after)}>進む</button>
          </>
        ) : (
          <div className="button-row">
            <button className="ghost-button" onClick={() => s.setPlaying((p) => !p)}>{s.playing ? '⏸ 一時停止' : '▶ 再生'}</button>
            <button className="ghost-button" onClick={() => s.setSpeed((v) => (v === 1 ? 2 : 1))}>{s.speed === 1 ? '⏩ 2倍速' : '⏩ 1倍速'}</button>
            <button className="ghost-button" onClick={() => { s.setPlayIndex(session.report.turns.length - 1); s.setPlaying(false); }}>⏭ スキップ</button>
          </div>
        )}
      </div>
    </section>
  );
}
