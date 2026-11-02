import summonBg from '../assets/summon.webp';
import { CHARACTERS, imageSrcSet } from '../lib/characters';
import { useGame } from '../lib/store';

/**
 * スタート画面（TOP）。Firebase接続時で未サインインのときだけ Shell が表示する。
 * Googleアカウントで始めるか、匿名で始めるかを選ぶ。
 */
export default function StartScreen() {
  const s = useGame();
  const mojika = CHARACTERS.mojika;
  return (
    <section className="screen start-screen">
      <img className="start-bg" src={summonBg} alt="" />
      <h2 className="game-logo">文字モンスター</h2>
      <p className="start-sub">1文字から生まれる、小さな相棒の育成ゲーム</p>
      <img className="start-mojika" src={mojika.image} srcSet={imageSrcSet(mojika)} sizes="180px" alt="助手のモジカ" />
      <p className="start-line">「はじめまして！文字モンスター研究所の助手、モジカだよ。どうやって始める？」</p>
      <div className="conflict-actions">
        <button className="primary-button big" onClick={() => void s.startWithGoogle()}>Googleアカウントで始める</button>
        <button className="secondary-button big" onClick={() => void s.startAnonymous()}>匿名で始める</button>
      </div>
      <p className="note">Googleアカウントで始めると、別の端末でも同じデータで遊べます。</p>
      <p className="note warn">⚠ 匿名アカウントは30日で削除され、セーブデータも消えてしまいます。長く遊ぶ場合はGoogleアカウントがおすすめです。</p>
    </section>
  );
}
