import { FONTS, elementFromColor } from '../lib/game';
import { COLOR_PRESETS, useGame } from '../lib/store';

/** 生成ステップ2：色とフォント設定。 */
export default function CreateStyleScreen() {
  const s = useGame();
  if (!s.previewMonster) {
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
        <li className="current">2. 色とフォント</li>
        <li>3. 確認</li>
      </ol>
      <div className="color-row">
        <input type="color" className="color-picker" value={s.inputColor} onChange={(e) => s.setInputColor(e.target.value)} aria-label="色を選ぶ" />
        <div className="swatches">
          {COLOR_PRESETS.map((c) => (
            <button key={c} className={`swatch ${s.inputColor === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => s.setInputColor(c)} aria-label={`色 ${c}`} />
          ))}
        </div>
      </div>
      <p className="one-line muted">「{s.firstChar}」― この色は <strong>{elementFromColor(s.inputColor)}属性</strong></p>
      <div className="scroll-region">
        <div className="font-options">
          {FONTS.map((font) => (
            <button key={font.id} className={`font-option ${s.inputFont === font.id ? 'selected' : ''}`} onClick={() => s.setInputFont(font.id)}>
              <span className="font-sample" style={{ fontFamily: font.stack }}>{s.firstChar || 'あ'}</span>
              <span className="font-meta"><strong>{font.label}</strong><small>{font.hint}</small></span>
            </button>
          ))}
        </div>
      </div>
      <div className="footer-actions row">
        <button className="ghost-button" onClick={() => s.go('createChar')}>もどる</button>
        <button className="primary-button grow" onClick={() => s.go('createConfirm')}>次へ</button>
      </div>
    </section>
  );
}
