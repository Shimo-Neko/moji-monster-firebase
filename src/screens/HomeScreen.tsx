import MonsterFace from '../components/MonsterFace';
import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** ホーム：モンスターの姿＋最低限の状態＋次の試合まで＋主ボタン1つだけ。 */
export default function HomeScreen() {
  const s = useGame();
  const active = s.game.active;
  return (
    <section className="screen home-screen">
      {active ? (
        <>
          <div className="home-face"><MonsterFace fighter={active} size={228} /></div>
          <h2 className="home-name">「{active.char}」<span className="muted"> {active.elementType}属性・{active.school}・総合力 {totalOf(active.stats)}</span></h2>
          <p className="one-line muted">{s.matchLabel}｜なつき {active.bond}｜調子 {active.condition}</p>
        </>
      ) : (
        <>
          <div className="disc-stone">円盤石</div>
          <h2 className="home-name">手元にモンスターはいません</h2>
          <p className="one-line muted">1文字・色・フォントで君だけの子を生もう</p>
        </>
      )}
      <div className="footer-actions">
        <button className="primary-button big" onClick={s.primaryAction}>{s.primaryLabel}</button>
      </div>
    </section>
  );
}
