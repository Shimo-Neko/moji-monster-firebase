import summonImg from '../assets/summon.webp';
import MonsterFace from '../components/MonsterFace';
import { useGame } from '../lib/store';

/**
 * 生成ステップ1：文字入力。
 * - 入力欄は切り捨ても maxlength 制限もしない。値は一切加工しない。
 * - 数えるのは Intl.Segmenter の書記素クラスタ単位（☢️・家族絵文字・国旗・結合文字も1文字）。
 * - 2文字目以降は入力欄の中で赤ハイライト表示する。
 * - 「次へ」はグレーアウトせず、0文字／オーバー時はモジカのエラートーストで止める。
 */
export default function CreateCharScreen() {
  const s = useGame();
  const active = s.game.active;

  if (active) {
    return (
      <section className="screen center-screen">
        <MonsterFace fighter={active} size={120} />
        <h2>手元がいっぱいです</h2>
        <p className="one-line muted">新しい子を生むには、手元を空けてね</p>
        <div className="footer-actions">
          <button className="primary-button big" onClick={() => s.go('frozen')}>凍結保管へ</button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <ol className="steps-indicator">
        <li className="current">1. もじ</li>
        <li>2. 色とフォント</li>
        <li>3. 確認</li>
      </ol>
      <h2 className="screen-title">モンスターにしたい文字</h2>
      <img className="summon-visual" src={summonImg} alt="古代文字の石盤" />
      <div className="char-input-wrap">
        <div className="char-input-backdrop" aria-hidden="true">
          <span>{s.firstChar}</span>
          {s.overflowText && <span className={s.isComposing ? '' : 'overflow-highlight'}>{s.overflowText}</span>}
        </div>
        <input
          className="char-input"
          value={s.inputChar}
          onChange={(e) => s.updateInputChar(e.target.value)}
          onCompositionStart={() => s.setIsComposing(true)}
          onCompositionEnd={() => s.setIsComposing(false)}
          placeholder="例：龍"
          autoFocus
          autoComplete="off"
        />
      </div>
      <p className="note">モンスターになるのは<strong>最初の1文字だけ</strong>です。2文字目以降は赤くハイライトされます。</p>
      <p className={`char-status ${s.charCount > 1 ? 'error' : ''}`}>
        {s.charCount === 0 && '文字を入力してください。'}
        {s.charCount === 1 && `「${s.firstChar}」がモンスターになります。`}
        {s.charCount > 1 && `先頭の「${s.firstChar}」だけが有効です（${s.charCount - 1}文字オーバー）。`}
      </p>
      <div className="footer-actions row">
        <button className="ghost-button" onClick={() => s.go('home')}>もどる</button>
        <button className="primary-button grow" onClick={s.handleCharNext}>次へ</button>
      </div>
    </section>
  );
}
