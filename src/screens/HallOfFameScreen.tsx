import MonsterFace from '../components/MonsterFace';
import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** 殿堂入り：一覧（グリッドのみ内側スクロール）。 */
export default function HallOfFameScreen() {
  const s = useGame();
  return (
    <section className="screen">
      <p className="one-line muted">全勝クリアした {s.game.hall.length}体の記録</p>
      <div className="scroll-region">
        <div className="mini-grid">
          {s.game.hall.map((m) => (
            <div key={m.id} className="mini-card tall hall-card">
              <MonsterFace fighter={m} size={58} />
              <div className="mini-info">
                <strong>🏆「{m.char}」<span className="muted"> 第{m.generation}世代</span></strong>
                <small>{m.elementType}属性・{m.school}｜総合力 {totalOf(m.stats)}｜全勝 {m.wins}勝</small>
                <div className="card-actions">
                  <button className="chip" onClick={() => s.openDetail(m, '殿堂入り')}>詳細</button>
                  <button className="chip" onClick={() => void s.publishMonster(m)}>{m.published ? '公開済み' : '公開プールに登録'}</button>
                </div>
              </div>
            </div>
          ))}
          {s.game.hall.length === 0 && <p className="muted">まだ殿堂入りはいません。21日目の決勝に勝つと、ここに名が刻まれます。</p>}
        </div>
      </div>
    </section>
  );
}
