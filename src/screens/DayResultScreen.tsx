import { useGame } from '../lib/store';

/** 結果画面：その日のサマリと「次へ」ボタンだけ（詳細はモンスター詳細画面へ）。 */
export default function DayResultScreen() {
  const s = useGame();
  const active = s.game.active;
  return (
    <section className="screen">
      <h2 className="screen-title">{s.lastResult?.title ?? '1日の結果'}</h2>
      <div className="scroll-region">
        <p className="result-text">{s.lastResult?.text ?? '結果がありません。'}</p>
        {s.lastResult?.event && <p className="event-banner">🎲 {s.lastResult.event}</p>}
      </div>
      <div className="footer-actions">
        {active ? (
          <button className="primary-button big" onClick={() => s.go('feed')}>翌日へ（{active.day}日目）</button>
        ) : (
          <button className="primary-button big" onClick={() => s.go('home')}>ホームへ</button>
        )}
      </div>
    </section>
  );
}
