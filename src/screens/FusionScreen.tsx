import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import MonsterFace from '../components/MonsterFace';
import StaffCard from '../components/StaffCard';
import { moveById, totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** 配合：両親2体の選択・文字継承・実行だけを行う専用画面。 */
export default function FusionScreen() {
  const s = useGame();
  const parents = s.fusionParents;
  const fx = s.fusionFx;
  const [fxPhase, setFxPhase] = useState(0);
  useEffect(() => {
    if (!fx) { setFxPhase(0); return; }
    setFxPhase(0);
    const t1 = window.setTimeout(() => setFxPhase(1), 1700);
    const t2 = window.setTimeout(() => setFxPhase(2), 2150);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [fx]);
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
      {fx && (
        <div className="fusion-fx" onClick={() => { if (fxPhase < 2) setFxPhase(2); }}>
          {fxPhase < 2 ? (
            <>
              <div className="fusion-fx-parents">
                <div className="fx-parent fx-left"><MonsterFace fighter={fx.a} size={104} /></div>
                <div className="fx-orb" style={{ background: fx.child.colorHex }} />
                <div className="fx-parent fx-right"><MonsterFace fighter={fx.b} size={104} /></div>
              </div>
              <p className="fusion-fx-line">ツムギ「二つの文字が、混ざり合っていく…！」</p>
              <p className="one-line muted">タップでスキップ</p>
              {fxPhase === 1 && <div className="fx-flash" />}
            </>
          ) : (
            <>
              <div className="fx-child">
                <MonsterFace fighter={fx.child} size={148} />
                <span className="fx-spark s1">✦</span>
                <span className="fx-spark s2">✦</span>
                <span className="fx-spark s3">✦</span>
                <span className="fx-spark s4">✦</span>
              </div>
              <h3 className="fusion-fx-name">「{fx.child.char}」誕生！</h3>
              <p className="one-line muted">第{fx.child.generation}世代｜{fx.child.elementType}属性・{fx.child.school}｜総合力 {totalOf(fx.child.stats)}</p>
              <p className="one-line muted">{fx.child.lineage}</p>
              {fx.child.moves && fx.child.moves.length > 0 && <p className="one-line muted">技：{fx.child.moves.map((id) => moveById(id)?.name ?? id).join('、')}</p>}
              <button className="primary-button big" onClick={(e) => { e.stopPropagation(); s.clearFusionFx(); s.go('feed'); }}>この子を育てる</button>
            </>
          )}
        </div>
      )}
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
