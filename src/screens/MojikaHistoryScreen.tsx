import mojikaImg from '../assets/mojika.webp';
import { useGame } from '../lib/store';

/**
 * モジカの履歴：トーストで流れたモジカの通知を、新しい順に見返す専用画面。
 * 履歴はこの端末に最大100件保存される。
 */
export default function MojikaHistoryScreen() {
  const s = useGame();
  const items = [...s.toastHistory].reverse();
  return (
    <section className="screen">
      <p className="one-line muted">モジカの通知 {s.toastHistory.length}件（最大100件・この端末に保存）</p>
      <div className="scroll-region">
        {items.length === 0 ? (
          <p className="muted">まだ通知はありません。モジカが何か知らせると、ここに残ります。</p>
        ) : (
          <div className="mojika-history">
            {items.map((toast) => (
              <div key={toast.id} className="history-item">
                <img className="toast-avatar-img" src={mojikaImg} alt="モジカ" />
                <span className="toast-body"><strong>{toast.title}</strong><span>{toast.body}</span></span>
                <span className="history-time">{new Date(toast.at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
