import Modal from '../components/Modal';
import MonsterFace from '../components/MonsterFace';
import StaffCard from '../components/StaffCard';
import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** 凍結保管：氷漬けグリッド（内側スクロール）＋冬眠ボタン。タップで復活／入れ替え確認。 */
export default function FrozenStorageScreen() {
  const s = useGame();
  const active = s.game.active;
  return (
    <section className="screen">
      <StaffCard speaker="chirumi" line={s.game.hibernation.length === 0 ? '冬眠カプセル、全部あいてるよ…。ねむたい子がいたら連れてきて。' : s.game.hibernation.length >= 6 ? 'カプセルは満員…みんな安眠中だよ。起こすときは声をかけてね。' : `${s.game.hibernation.length}体がねむってるよ。温度はばっちり…私がちゃんと見てるからね。`} />
      <button className="primary-button" onClick={s.hibernateActive}>
        今の手持ちを冬眠させる{active && !active.runEnded ? `（「${active.char}」Day ${active.day}）` : ''}
      </button>
      <div className="scroll-region">
        <div className="frozen-grid">
          {Array.from({ length: 6 }, (_, i) => {
            const m = s.game.hibernation[i];
            if (!m) return <div key={i} className="frozen-slot empty"><span>❄</span><small>空きスロット</small></div>;
            return (
              <button key={m.id} className="frozen-slot" onClick={() => s.reviveMonster(m)}>
                <MonsterFace fighter={m} size={84} frozen />
                <strong>「{m.char}」</strong>
                <small>Day {m.day}で凍結中｜総合力 {totalOf(m.stats)}</small>
                <small>{m.elementType}属性・{m.school}</small>
              </button>
            );
          })}
        </div>
      </div>
      {s.swapTarget && active && (
        <Modal title="入れ替えますか？">
          <p>今の手持ち「{active.char}」（Day {active.day}）を凍結保管し、氷漬けの「{s.swapTarget.char}」（Day {s.swapTarget.day}）を復活させます。よろしいですか？</p>
          <div className="button-row">
            <button className="ghost-button" onClick={() => s.setSwapTarget(null)}>キャンセル</button>
            <button className="primary-button grow" onClick={s.confirmSwap}>入れ替える</button>
          </div>
        </Modal>
      )}
    </section>
  );
}
