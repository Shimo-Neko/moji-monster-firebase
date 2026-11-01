import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** バトルに出すコレクション個体を選ぶ、横スクロールのコンパクトなピッカー。 */
export default function FighterPicker() {
  const { game, selectedBattleId, setSelectedBattleId } = useGame();
  if (game.collection.length === 0) {
    return <p className="muted one-line">コレクションに保存された子がいません。</p>;
  }
  return (
    <div className="fighter-picker" role="listbox" aria-label="バトルに出すモンスター">
      {game.collection.map((m) => (
        <button key={m.id} className={`chip ${m.id === selectedBattleId ? 'selected' : ''}`} onClick={() => setSelectedBattleId(m.id)}>
          「{m.char}」総合力 {totalOf(m.stats)}
        </button>
      ))}
    </div>
  );
}
