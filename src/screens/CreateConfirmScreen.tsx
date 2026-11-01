import MonsterFace from '../components/MonsterFace';
import MonsterSummary from '../components/MonsterSummary';
import StatBars from '../components/StatBars';
import { useGame } from '../lib/store';

/** 生成ステップ3：確認画面。「この設定で作成する」を押して初めて作成される。 */
export default function CreateConfirmScreen() {
  const s = useGame();
  const monster = s.previewMonster;
  if (!monster) {
    return (
      <section className="screen center-screen">
        <h2>文字が決まっていません</h2>
        <div className="footer-actions">
          <button className="primary-button big" onClick={() => s.go('createChar')}>文字入力へ</button>
        </div>
      </section>
    );
  }
  return (
    <section className="screen">
      <ol className="steps-indicator">
        <li className="done">1. もじ</li>
        <li className="done">2. 色とフォント</li>
        <li className="current">3. 確認</li>
      </ol>
      <div className="confirm-top">
        <MonsterFace fighter={monster} size={150} />
        <div className="confirm-info">
          <p className="one-line">文字「{monster.char}」／色 {monster.colorHex}／{monster.fontLabel}</p>
          <MonsterSummary monster={monster} />
        </div>
      </div>
      <div className="scroll-region">
        <StatBars stats={monster.stats} compact />
        <p className="note">同じ「文字・色・フォント」からは、いつも同じモンスターが生まれます。</p>
      </div>
      <div className="footer-actions row">
        <button className="ghost-button" onClick={() => s.go('createStyle')}>もどる</button>
        <button className="primary-button grow" onClick={s.createMonster}>この設定で作成する</button>
      </div>
    </section>
  );
}
