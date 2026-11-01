import MonsterFace from '../components/MonsterFace';
import StaffCard from '../components/StaffCard';
import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** 野生モンスター襲来：迎え撃つか、やり過ごすかを選ぶ専用画面（ランダムイベント）。 */
export default function WildEncounterScreen() {
  const s = useGame();
  const wild = s.pendingWild;
  const active = s.game.active;

  if (!wild || !active) {
    return (
      <section className="screen center-screen">
        <h2>野生モンスターは去っていった…</h2>
        <div className="footer-actions">
          <button className="primary-button big" onClick={() => s.go('home')}>ホームへ</button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <h2 className="screen-title">⚠ 野生モンスター襲来！</h2>
      <StaffCard speaker="mojika" line={`野生の「${wild.char}」が街で暴れてる！「${active.char}」なら迎え撃てるはず。どうする？`} />
      <div className="home-face"><MonsterFace fighter={wild} size={180} /></div>
      <p className="one-line muted">野生の「{wild.char}」｜{wild.elementType}属性・{wild.school}｜総合力 {totalOf(wild.stats)}</p>
      <div className="footer-actions row">
        <button className="ghost-button" onClick={s.fleeWild}>やり過ごす</button>
        <button className="primary-button grow" onClick={s.startWildBattle}>「{active.char}」で戦う</button>
      </div>
      <p className="note">勝てば街からお礼に250Gとなつき+3。負けても育成は終わらないけど調子が-12します。やり過ごすと餌を奪われます（最大-100G）。</p>
    </section>
  );
}
