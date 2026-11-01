import { fontById, type BattleFighter } from '../lib/game';

/** モンスターの「顔」表示。文字・色・フォントで描く共通部品。 */
export default function MonsterFace({ fighter, size = 150, frozen = false }: { fighter: BattleFighter; size?: number; frozen?: boolean }) {
  const font = fontById(fighter.fontId);
  const glyph = Math.round(size * 0.58);
  return (
    <div
      className={`monster-visual ${frozen ? 'is-frozen' : ''}`}
      style={{
        width: `min(${size}px, 58vw)`,
        height: `min(${size}px, 58vw)`,
        borderColor: fighter.colorHex,
        background: `radial-gradient(circle at 35% 25%, #ffffffcc 0 12%, transparent 34%), linear-gradient(145deg, ${fighter.colorHex}2b, #101827 78%)`,
        boxShadow: `0 14px 34px ${fighter.colorHex}44, inset 0 0 0 1px #ffffff22`,
      }}
      aria-label={`${fighter.char}の文字モンスター`}
    >
      <span
        style={{
          color: fighter.colorHex,
          fontFamily: font.stack,
          fontSize: `min(${glyph}px, 34vw)`,
          lineHeight: 1,
          textShadow: `0 4px 0 #ffffff30, 0 10px 28px ${fighter.colorHex}`,
        }}
      >
        {fighter.char}
      </span>
      {frozen && <div className="ice-overlay">❄</div>}
    </div>
  );
}
