import Modal from '../components/Modal';
import MonsterFace from '../components/MonsterFace';
import StaffCard from '../components/StaffCard';
import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** 配合：両親2体の選択・文字継承・実行だけを行う専用画面。 */
export default function FusionScreen() {
  const s = useGame();
  const parents = s.fusionParents;
  return (
    <section className="screen">
      <StaffCard speaker="tsumugi" line={s.game.collection.length < 2 ? `配合には保存済みの子が2体必要よ。今は${s.game.collection.length}体。卒業した子を集めてきてね。` : 'さあ、どの子とどの子を掛け合わせる？遺伝の瞬間って、何度見てもドキドキするの。'} />
      <p className="one-line muted">両親になる2体を選んでね（選択中 {parents.length}/2）</p>
      <div className="scroll-region">
        <div className="mini-grid">
          {s.game.collection.map((m) => (
            <button key={m.id} className={`mini-card as-button ${s.fusionIds.includes(m.id) ? 'fusion-selected' : ''}`} onClick={() => s.toggleFusion(m.id)}>
              <MonsterFace fighter={m} size={52} />
              <div className="mini-info">
                <strong>「{m.char}」<span className="muted"> 第{m.generation}世代</span></strong>
                <small>{m.elementType}属性・{m.school}｜総合力 {totalOf(m.stats)}</small>
              </div>
              <span className="chip">{s.fusionIds.includes(m.id) ? '選択中' : '選ぶ'}</span>
            </button>
          ))}
          {s.game.collection.length < 2 && <p className="muted">配合には保存されたモンスターが2体必要です。</p>}
        </div>
      </div>
      <div className="fusion-footer">
        {parents.length === 2 ? (
          <>
            <div className="segmented">
              <button className={s.fusionLetter === 'a' ? 'selected' : ''} onClick={() => s.setFusionLetter('a')}>「{parents[0].char}」を継承</button>
              <button className={s.fusionLetter === 'b' ? 'selected' : ''} onClick={() => s.setFusionLetter('b')}>「{parents[1].char}」を継承</button>
            </div>
            <button className="primary-button big" onClick={() => s.setShowFusionConfirm(true)}>配合する</button>
          </>
        ) : (
          <p className="one-line muted">色は2体の中間、ステータスは項目ごとに抽選＋強い親の総合力が下限保証。両親は消費されます。</p>
        )}
      </div>
      {s.showFusionConfirm && parents.length === 2 && (
        <Modal title="配合の確認" onClose={() => s.setShowFusionConfirm(false)}>
          <p>「{parents[0].char}」と「{parents[1].char}」を配合します。両親の2体は消費され、「{(s.fusionLetter === 'a' ? parents[0] : parents[1]).char}」を受け継ぐ新しい子が手元に生まれます（1日目から育成）。よろしいですか？</p>
          <div className="button-row">
            <button className="ghost-button" onClick={() => s.setShowFusionConfirm(false)}>キャンセル</button>
            <button className="primary-button grow" onClick={s.doFusion}>配合する</button>
          </div>
        </Modal>
      )}
    </section>
  );
}
