import { characterOf, faceFor } from '../lib/characters';
import { useGame } from '../lib/store';

/**
 * メッセージ履歴：メッセージ窓で流れたみんなの通知を、新しい順に見返す専用画面。
 * 履歴はこの端末に最大100件保存される。
 */
export default function MojikaHistoryScreen() {
  const s = useGame();
  const items = [...s.toastHistory].reverse();
  return (
    <section className="screen">
      <p className="one-line muted">みんなの通知 {s.toastHistory.length}件（最大100件・この端末に保存）</p>
      <div className="scroll-region">
        {items.length === 0 ? (
          <p className="muted">まだ通知はありません。誰かが何か知らせると、ここに残ります。</p>
        ) : (
          <div className="mojika-history">
            {items.map((toast) => {
              const speaker = characterOf(toast.speaker);
              return (
              <div key={toast.id} className="history-item">
                <img className="toast-avatar-img" src={faceFor(speaker, toast.mood)} alt={speaker.name} />
                <span className="toast-body"><strong style={{ color: speaker.color }}>{toast.title}</strong><span>{toast.body}</span></span>
                <span className="history-time">{new Date(toast.at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
