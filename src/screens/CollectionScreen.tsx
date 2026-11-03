import Modal from '../components/Modal';
import MonsterFace from '../components/MonsterFace';
import StaffCard from '../components/StaffCard';
import { sellPrice, totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** コレクション：一覧（グリッドのみ内側スクロール）と各個体の基本操作。配合は専用画面。 */
export default function CollectionScreen() {
  const s = useGame();
  return (
    <section className="screen">
      <StaffCard speaker="shiori" line={s.game.collection.length === 0 ? 'まだ記録はありません。育て切った子が、ここに保存されます。' : `${s.game.collection.length}体の記録を保管中です。売却は取り消せないので、慎重にどうぞ。`} />
      <div className="screen-bar">
        <span className="one-line">保存中 {s.game.collection.length}体</span>
        <button className="secondary-button" onClick={() => s.go('fusion')}>🧬 配合へ</button>
      </div>
      <div className="scroll-region">
        <div className="mini-grid">
          {s.game.collection.map((m) => (
            <div key={m.id} className="mini-card tall">
              <MonsterFace fighter={m} size={58} />
              <div className="mini-info">
                <strong>「{m.char}」<span className="muted"> 第{m.generation}世代{m.isBred ? '・配合' : ''}</span></strong>
                <small>{m.elementType}属性・{m.school}｜総合力 {totalOf(m.stats)}｜{m.wins}勝{m.losses}敗</small>
                <div className="card-actions">
                  <button className="chip" onClick={() => s.openDetail(m, 'コレクション')}>詳細</button>
                  <button className={`chip ${s.selectedBattleId === m.id ? 'selected' : ''}`} onClick={() => s.setSelectedBattleId(m.id)}>バトル用</button>
                  <button className="chip" onClick={() => void s.publishMonster(m)}>{m.published ? '公開済み' : '公開する'}</button>
                  <button className="chip danger" onClick={() => s.setSellTarget(m)}>売却 {s.sellPriceFor(m)}G</button>
                </div>
              </div>
            </div>
          ))}
          {s.game.collection.length === 0 && <p className="muted">まだ保存されたモンスターはいません。育て切ると（勝っても負けても）ここに保存できます。</p>}
        </div>
      </div>
      {s.sellTarget && (
        <Modal title="お別れしますか？">
          <p>「{s.sellTarget.char}」（総合力 {totalOf(s.sellTarget.stats)}）を売却して、{s.sellPriceFor(s.sellTarget)}Gを受け取ります。この操作は取り消せません。</p>
          <div className="button-row">
            <button className="ghost-button" onClick={() => s.setSellTarget(null)}>キャンセル</button>
            <button className="primary-button danger grow" onClick={s.confirmSell}>売却する</button>
          </div>
        </Modal>
      )}
    </section>
  );
}
