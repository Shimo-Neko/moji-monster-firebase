import FighterPicker from '../components/FighterPicker';
import { useGame } from '../lib/store';

/** フリーバトル：出す子と相手の強さを選んで開始するだけ。 */
export default function FreeBattleScreen() {
  const s = useGame();
  return (
    <section className="screen">
      <h2 className="screen-title">出す子を選ぶ</h2>
      <FighterPicker />
      <h3 className="sub-title">相手の強さ</h3>
      <div className="segmented">
        <button className={s.tier === 'weak' ? 'selected' : ''} onClick={() => s.setTier('weak')}>弱い（100G）</button>
        <button className={s.tier === 'normal' ? 'selected' : ''} onClick={() => s.setTier('normal')}>普通（180G）</button>
        <button className={s.tier === 'strong' ? 'selected' : ''} onClick={() => s.setTier('strong')}>強い（300G）</button>
      </div>
      <div className="footer-actions">
        <button className="primary-button big" onClick={s.startFreeBattle}>バトル開始</button>
      </div>
    </section>
  );
}
