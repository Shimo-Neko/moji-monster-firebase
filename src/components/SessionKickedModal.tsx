import { useGame } from '../lib/store';

/**
 * 単一セッション：別のタブ／端末で同じセーブのプレイが始まったため、この画面を停止したことを知らせるモーダル。
 * 認証やセーブデータには触らない。「このタブ／端末でプレイする」を選ぶと札を取り直し、最新のセーブで再開する。
 */
export default function SessionKickedModal() {
  const s = useGame();
  if (!s.sessionKickedBy) return null;
  const place = s.sessionKickedBy === 'tab' ? 'タブ' : '端末';
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-head">
          <h2>別の{place}でプレイが始まりました</h2>
        </div>
        <p>このセーブは同時に1つの{place}でだけ遊べるため、この{place}の画面を停止しました。セーブデータは無事です。</p>
        <div className="conflict-actions">
          <button className="primary-button" onClick={() => void s.retakeSession()}>
            この{place}でプレイする
          </button>
        </div>
        <p className="note">押すと相手の{place}が停止し、最新のセーブから再開します。この{place}の未保存の操作は破棄されます。</p>
      </div>
    </div>
  );
}
