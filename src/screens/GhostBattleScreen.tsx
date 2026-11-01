import FighterPicker from '../components/FighterPicker';
import MonsterFace from '../components/MonsterFace';
import { useGame } from '../lib/store';

/**
 * みんなのモンスター：公開プール一覧とランダムマッチ。リスト部分だけ内側スクロール。
 * オンライン機能はバックエンドの capability で判定する。LocalAdapter（Firebase未設定）では
 * 対戦ボタンをグレーアウトし、理由を注記する（1人プレイ部分は両環境で同一）。
 */
export default function GhostBattleScreen() {
  const s = useGame();
  const online = s.capabilities.publicPool;
  return (
    <section className="screen">
      <p className="one-line muted">
        {online
          ? '公開プールのゴーストと対戦できます。報酬は1日5回まで'
          : 'ローカルモード：ほかの人との対戦は「Firebaseに接続すると遊べるよ」（サンプルを表示中）'}
      </p>
      <FighterPicker />
      <div className="button-row">
        <button className="primary-button grow" onClick={s.startRandomMatch} disabled={!online}>🎲 ランダムマッチ</button>
        <button className="ghost-button" onClick={() => void s.refreshPool()} disabled={!online || s.poolBusy}>{s.poolBusy ? '更新中…' : '更新'}</button>
      </div>
      <div className="scroll-region">
        <div className="mini-grid">
          {s.publicMonsters.map((pub) => (
            <div key={pub.docId} className="mini-card">
              <MonsterFace fighter={pub} size={58} />
              <div className="mini-info">
                <strong>「{pub.char}」<span className="muted"> {pub.elementType}・{pub.school}</span></strong>
                <small>{pub.ownerName}｜総合力 {pub.total}｜{pub.wins}勝</small>
              </div>
              <button className="chip" onClick={() => s.openDetail(pub, '公開プール')}>詳細</button>
              <button className="secondary-button" onClick={() => s.startGhostBattle(pub)} disabled={!online}>挑む</button>
            </div>
          ))}
          {s.publicMonsters.length === 0 && <p className="muted">公開プールはまだ空です。殿堂入りや保存した子を公開して、最初の挑戦者を待とう。</p>}
        </div>
      </div>
    </section>
  );
}
