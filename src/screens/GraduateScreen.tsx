import MonsterFace from '../components/MonsterFace';
import MonsterSummary from '../components/MonsterSummary';
import { totalOf } from '../lib/game';
import { useGame } from '../lib/store';

/** 卒業手続き：保存（＋任意で公開）か、手放すかだけ。 */
export default function GraduateScreen() {
  const s = useGame();
  const active = s.game.active;
  if (!active?.runEnded) {
    return (
      <section className="screen center-screen">
        <h2>卒業手続き中のモンスターはいません</h2>
        <div className="footer-actions"><button className="primary-button big" onClick={() => s.go('home')}>ホームへ</button></div>
      </section>
    );
  }
  return (
    <section className="screen">
      <h2 className="screen-title">{active.runEnded === 'cleared' ? '🎉 全勝クリア！殿堂入り！' : '育成終了 ― 卒業'}</h2>
      <div className="confirm-top">
        <MonsterFace fighter={active} size={120} />
        <div className="confirm-info">
          <p className="one-line">「{active.char}」｜戦績 {active.wins}勝{active.losses}敗｜総合力 {totalOf(active.stats)}</p>
          <MonsterSummary monster={active} />
        </div>
      </div>
      <p className="note">{active.runEnded === 'cleared' ? '決勝まで全勝！保存すれば配合やゴーストバトルの主役になれます。' : '大会には敗れてしまったけれど、この子は無事です。卒業として保存すれば、フリーバトルや配合で活躍できます。'}</p>
      {active.runEnded === 'cleared' && (
        <label className="checkbox-line">
          <input type="checkbox" checked={s.publishOnGraduate} onChange={(e) => s.setPublishOnGraduate(e.target.checked)} disabled={!s.capabilities.publicPool} />
          公開プールに登録する{s.capabilities.publicPool ? '' : '（Firebase接続時のみ）'}
        </label>
      )}
      <div className="footer-actions row">
        <button className="ghost-button danger" onClick={s.graduateDiscard}>保存せずに手放す</button>
        <button className="primary-button grow" onClick={s.graduateSave}>保存して卒業</button>
      </div>
    </section>
  );
}
