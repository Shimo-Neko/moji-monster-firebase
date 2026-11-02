import { useGame } from '../lib/store';

/** 設定：表示名とアカウント（ログイン）状態。連携の可否はバックエンドの capability で判定する。 */
export default function SettingsScreen() {
  const s = useGame();
  return (
    <section className="screen">
      <label className="field-label">表示名（公開プールに表示されます）
        <input
          className="text-input"
          value={s.game.displayName}
          onChange={(e) => s.setGame((prev) => ({ ...prev, displayName: e.target.value.slice(0, 40) }))}
          placeholder="名無しブリーダー"
        />
      </label>
      <h3>アカウント・接続</h3>
      <p className="one-line muted">バックエンド：{s.backendId === 'firebase' ? 'Firebase' : 'ローカル（localStorage）'}</p>
      {s.capabilities.auth ? (
        <>
          <p className="one-line muted">接続状態：{s.fbStatus === 'connected' ? 'Firebase接続中' : s.fbStatus === 'error' ? '接続エラー' : s.fbStatus === 'signedOut' ? 'サインインしていません' : '接続中…'}</p>
          {s.fbUser?.isAnonymous ? (
            <>
              <p className="one-line muted">ログイン：匿名アカウントで接続中（データはクラウドに保存されています）</p>
              <button className="secondary-button" onClick={() => void s.handleGoogle()}>Googleアカウントでログイン／連携する</button>
              <p className="note">連携すると、別の端末でも同じデータで遊べます。</p>
              <p className="note warn">⚠ 匿名アカウントは30日で削除され、セーブデータも消えてしまいます。長く遊ぶ場合はGoogleアカウントと連携してください。</p>
            </>
          ) : s.fbUser ? (
            <p className="one-line muted">ログイン：Google連携済み（{s.fbUser.email ?? s.fbUser.displayName ?? ''}）</p>
          ) : (
            <p className="one-line muted">Firebaseに接続中…</p>
          )}
        </>
      ) : (
        <>
          <p className="one-line muted">ログイン：なし（ローカルモード）</p>
          <p className="note">いまはローカルモードです（データはこのブラウザに保存され、ログインはありません）。Firebaseに接続されたビルドでは、ここにGoogleログイン／連携ボタンが表示されます。</p>
        </>
      )}
    </section>
  );
}
