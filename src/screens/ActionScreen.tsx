import MonsterFace from '../components/MonsterFace';
import { ACTIONS } from '../lib/game';
import { MATCH_DAYS, useGame } from '../lib/store';

/** 行動画面：今日の行動の選択だけ。選ぶと1日が終わる。 */
export default function ActionScreen() {
  const s = useGame();
  const active = s.game.active;
  if (!active) {
    return (
      <section className="screen center-screen">
        <h2>手元にモンスターがいません</h2>
        <div className="footer-actions"><button className="primary-button big" onClick={() => s.go('home')}>ホームへ</button></div>
      </section>
    );
  }
  const isMatchDay = MATCH_DAYS[Math.min(active.stage, 2)] === active.day;
  return (
    <section className="screen">
      <div className="compact-head">
        <MonsterFace fighter={active} size={64} />
        <div>
          <h2>{active.day}日目 ― 今日の行動</h2>
          <p className="one-line muted">{s.selectedFood ? `${s.selectedFood.label}を食べた。` : ''}なつき {active.bond}｜調子 {active.condition}{isMatchDay ? '｜今日は試合日' : ''}</p>
        </div>
      </div>
      <div className="choice-grid actions">
        {ACTIONS.map((action) => (
          <button key={action.id} className="choice-card" onClick={() => s.chooseAction(action)}>
            <strong>{action.label}</strong>
            <span>{action.cost > 0 ? `${action.cost}G` : action.id === 'roumu' ? '+300G' : '無料'}</span>
            <small>{action.desc}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
