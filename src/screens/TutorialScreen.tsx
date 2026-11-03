import mojikaImg from '../assets/staff-mojika.webp';
import { TUTORIAL_STEPS, useGame } from '../lib/store';

/** チュートリアル専用画面（モーダルではなく1画面1機能）。 */
export default function TutorialScreen() {
  const s = useGame();
  const step = TUTORIAL_STEPS[Math.min(s.tutorialStep, TUTORIAL_STEPS.length - 1)];
  const isLast = s.tutorialStep >= TUTORIAL_STEPS.length - 1;
  return (
    <section className="screen">
      <div className="tutorial-body">
        <img className="tutorial-mojika" src={mojikaImg} alt="助手のモジカ" />
        <div>
          <h2 className="screen-title">{step.title}</h2>
          <p className="result-text">{step.body}</p>
        </div>
      </div>
      <p className="one-line muted">{s.tutorialStep + 1} / {TUTORIAL_STEPS.length}</p>
      <div className="footer-actions row">
        <button className="ghost-button" onClick={s.closeTutorial}>スキップ</button>
        {isLast ? (
          <button className="primary-button grow" onClick={s.closeTutorial}>研究所へ行く</button>
        ) : (
          <button className="primary-button grow" onClick={() => s.setTutorialStep((v) => v + 1)}>次へ</button>
        )}
      </div>
    </section>
  );
}
