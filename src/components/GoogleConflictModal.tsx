import { useGame } from '../lib/store';

/**
 * Google連携時に、そのGoogleアカウントが別のユーザーとして登録済みだった場合の選択モーダル。
 * （auth/credential-already-in-use のときに store が googleConflict を立てる）
 * どちらのセーブデータを残すかをユーザーが選ぶ。
 */
export default function GoogleConflictModal() {
  const s = useGame();
  if (!s.googleConflict) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-head">
          <h2>Googleアカウントのセーブデータ</h2>
        </div>
        <p>Googleアカウントに紐付くセーブデータが既に存在します。どうしますか？</p>
        <div className="conflict-actions">
          <button className="primary-button" onClick={() => void s.resolveGoogleConflict('load')}>
            今のセーブデータを削除し、Googleアカウントのセーブデータをロードする
          </button>
          <button className="secondary-button" onClick={() => void s.resolveGoogleConflict('overwrite')}>
            今のセーブデータをGoogleアカウントに上書きする
          </button>
          <button className="ghost-button" onClick={() => void s.resolveGoogleConflict('cancel')}>
            キャンセル（匿名アカウントのまま続行）
          </button>
        </div>
      </div>
    </div>
  );
}
