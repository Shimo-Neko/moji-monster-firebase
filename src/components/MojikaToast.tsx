import { useEffect, useRef, useState } from 'react';
import mojikaImg from '../assets/mojika.webp';
import { useGame, type ToastItem } from '../lib/store';

const AUTO_DISMISS_MS = 5000;
const LEAVE_MS = 280;
/** 重ねて見せる最大枚数（一番上1枚＋後ろ2枚）。残りはバッジで示す。 */
const MAX_LAYERS = 3;

/**
 * 一番上のトースト。自動消滅のカウントダウンはこのカードだけが持つ。
 * 消えると次のトーストが一番上に上がり、そこからカウントが始まる。
 */
function TopToastCard({ toast, extraCount }: { toast: ToastItem; extraCount: number }) {
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
    <button className={`toast toast-top ${leaving ? 'leaving' : ''}`} onClick={closeNow} title="タップで閉じる">
      <img className="toast-avatar-img" src={mojikaImg} alt="モジカ" />
      <span className="toast-body"><strong>{toast.title}</strong><span>{toast.body}</span></span>
      {extraCount > 0 && <span className="toast-badge">他 {extraCount} 件</span>}
    </button>
  );
}

/**
 * モジカのトースト通知（オーバーレイ＋デッキ方式）。
 * 通知は同じ場所に重なって表示され、占有面積は常に1枚分。
 * 最新の1枚だけが読めて、古いものは下に少しはみ出して存在だけを示す。
 * 過去の通知はメニューの「モジカの履歴」から見返せる。
 */
export default function MojikaToast() {
  const { visibleToasts } = useGame();
  if (visibleToasts.length === 0) return null;
  const top = visibleToasts[visibleToasts.length - 1];
  const behind = visibleToasts.slice(0, -1).slice(-(MAX_LAYERS - 1));
  return (
    <div className="toast-lane" aria-live="polite">
      <div className="toast-stack">
        {behind.map((toast, i) => {
          const layer = behind.length - i;
          return (
            <div
              key={toast.id}
              className="toast toast-behind"
              style={{ transform: `translateY(${layer * 10}px)`, zIndex: 10 - layer }}
              aria-hidden="true"
            >
              <img className="toast-avatar-img" src={mojikaImg} alt="" />
              <span className="toast-body"><strong>{toast.title}</strong><span>{toast.body}</span></span>
            </div>
          );
        })}
        <TopToastCard key={top.id} toast={top} extraCount={visibleToasts.length - 1} />
      </div>
    </div>
  );
}
