import { useEffect, useRef, useState } from 'react';
import mojikaImg from '../assets/mojika.webp';
import { useGame, type ToastItem } from '../lib/store';

const AUTO_DISMISS_MS = 5000;
const LEAVE_MS = 280;

/** 1件分のトースト。表示されてから一定時間で自動的に消える（タイマーはカード単位）。 */
function ToastCard({ toast }: { toast: ToastItem }) {
  const { dismissToast } = useGame();
  const [leaving, setLeaving] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLeaving(true), AUTO_DISMISS_MS);
    const removeTimer = window.setTimeout(() => dismissToast(toast.id), AUTO_DISMISS_MS + LEAVE_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [toast.id, dismissToast]);

  const closeNow = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setLeaving(true);
    window.setTimeout(() => dismissToast(toast.id), LEAVE_MS);
  };

  return (
    <button className={`toast ${leaving ? 'leaving' : ''}`} onClick={closeNow} title="タップで閉じる">
      <img className="toast-avatar-img" src={mojikaImg} alt="モジカ" />
      <span className="toast-body"><strong>{toast.title}</strong><span>{toast.body}</span></span>
    </button>
  );
}

/**
 * モジカのトースト通知（オーバーレイ表示）。
 * アプリ枠の右上に重なって表示され、レイアウトには一切干渉しない。
 * 各トーストは表示から約5秒で自動的に消える。過去の通知はメニューの
 * 「モジカの履歴」から見返せる。
 */
export default function MojikaToast() {
  const { visibleToasts } = useGame();
  if (visibleToasts.length === 0) return null;
  return (
    <div className="toast-lane" aria-live="polite">
      <div className="toast-list">
        {visibleToasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
}
