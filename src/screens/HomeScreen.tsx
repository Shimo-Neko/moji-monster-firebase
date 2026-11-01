import ranchBg from '../assets/ranch.webp';
import MonsterFace from '../components/MonsterFace';
import StaffCard from '../components/StaffCard';
import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** ホーム：モンスターの姿＋最低限の状態＋次の試合まで＋主ボタン1つだけ。 */
export default function HomeScreen() {
  const s = useGame();
  const active = s.game.active;
  const mogumiLine = !active
    ? 'いらっしゃい！新しい子を迎えるなら、研究所でモジカが待ってるよ。'
    : active.condition < 30
      ? `「${active.char}」ちゃん、ちょっとお疲れ気味。おいしいごはんで元気にしてあげて。`
      : active.bond >= 70
        ? `「${active.char}」ちゃん、とってもいい表情してるね！`
        : `今日の「${active.char}」ちゃんも元気いっぱい！ごはんは私に任せて。`;
  return (
    <section
      className="screen home-screen"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(10, 16, 26, 0.55), rgba(10, 16, 26, 0.78)), url(${ranchBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <StaffCard speaker="mogumi" line={mogumiLine} />
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
