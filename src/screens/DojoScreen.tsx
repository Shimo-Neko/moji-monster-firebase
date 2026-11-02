import MonsterFace from '../components/MonsterFace';
import StaffCard from '../components/StaffCard';
import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** 道場破り：ランからの挑戦を受けるか断るかを選ぶ専用画面（不定期イベント）。 */
export default function DojoScreen() {
  const s = useGame();
  const foe = s.pendingDojo;
  const active = s.game.active;

  if (!foe || !active) {
    return (
      <section className="screen center-screen">
        <h2>ランは帰っていった…</h2>
        <div className="footer-actions">
          <button className="primary-button big" onClick={() => s.go('home')}>ホームへ</button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <h2 className="screen-title">⚔ 道場破り ― ラン</h2>
      <StaffCard speaker="ran" line={`あんたの「${active.char}」の噂、聞いてるわ。あたしの「嵐」と勝負しなさい。逃げるなら……まあ、止めないけど。`} />
      <div className="home-face"><MonsterFace fighter={foe} size={180} /></div>
      <p className="one-line muted">ランの「嵐」｜{foe.elementType}属性・{foe.school}｜総合力 {totalOf(foe.stats)}</p>
      <div className="footer-actions row">
        <button className="ghost-button" onClick={s.refuseDojo}>断る</button>
        <button className="primary-button grow" onClick={s.startDojoBattle}>勝負を受ける</button>
      </div>
      <p className="note">受けるだけでランとの好感度+3。勝てば手元の子のステータスが1つ+3（仲良しなら+5）＆好感度さらに+3。負けてもペナルティはありません。断るとランの好感度-5。</p>
    </section>
  );
}
