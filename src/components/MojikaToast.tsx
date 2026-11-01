import mojikaImg from '../assets/mojika.webp';
import { useGame } from '../lib/store';

/**
 * モジカのトースト通知。
 * 画面に重ならないよう、アプリのレイアウト内に確保された「トースト専用レーン」の
 * 中で右からスライドインする（レーンが開く分だけ下の画面が縮む）。
 */
export default function MojikaToast() {
  const { visibleToasts, dismissToast } = useGame();
  return (
    <div className={`toast-lane ${visibleToasts.length > 0 ? 'active' : ''}`} aria-live="polite">
      <div className="toast-list">
        {visibleToasts.map((toast) => (
          <button key={toast.id} className="toast" onClick={() => dismissToast(toast.id)} title="タップで閉じる">
            <img className="toast-avatar-img" src={mojikaImg} alt="モジカ" />
            <span className="toast-body"><strong>{toast.title}</strong><span>{toast.body}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
