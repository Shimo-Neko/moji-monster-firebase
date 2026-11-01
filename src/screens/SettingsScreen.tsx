import { useGame } from '../lib/store';

/** 設定：表示名とアカウント連携だけ。連携の可否はバックエンドの capability で判定する。 */
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
      <p className="one-line muted">バックエンド：{s.backendId === 'firebase' ? 'Firebase' : 'ローカル（localStorage）'}</p>
      {s.capabilities.auth ? (
        <>
          <p className="one-line muted">接続状態：{s.fbStatus === 'connected' ? 'Firebase接続中' : s.fbStatus === 'error' ? '接続エラー' : '接続中…'}</p>
          {s.fbUser?.isAnonymous ? (
            <button className="secondary-button" onClick={() => void s.handleGoogle()}>Googleアカウントと連携する（任意）</button>
          ) : s.fbUser ? (
            <p className="one-line muted">Google連携済み：{s.fbUser.email ?? s.fbUser.displayName ?? ''}</p>
          ) : (
            <p className="one-line muted">Firebaseに接続中…</p>
          )}
        </>
      ) : (
        <p className="note">いまはローカルモードです（データはこのブラウザに保存）。Firebaseを設定すると、クラウド保存と対戦プールが有効になります。</p>
      )}
    </section>
  );
}
