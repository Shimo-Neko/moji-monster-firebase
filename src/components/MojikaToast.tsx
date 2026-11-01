import { useEffect, useRef, useState } from 'react';
import mojikaImg from '../assets/mojika.webp';
import { useGame, type ToastItem } from '../lib/store';

const AUTO_DISMISS_MS = 5000;
const LEAVE_MS = 280;
/** 同時に重ねて見せる最大枚数。溢れた分は後ろで待機し、枠が空いたら表示される。 */
const MAX_LAYERS = 3;

/**
 * トースト1枚分の表示。
 * 自動消滅タイマーは「表示された瞬間」からその枚だけのものが進む（Sonner等の
 * スタック方式と同じ）。新しいトーストが来ても、既存の枚のタイマーはリセットされない。
 * layer が 0 の枚だけが一番手前で読めてタップで閉じられ、それ以外は後ろに重なる。
 */
function StackCard({ toast, layer, extraCount }: { toast: ToastItem; layer: number; extraCount: number }) {
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

  const content = (
    <>
      <img className="toast-avatar-img" src={mojikaImg} alt={layer === 0 ? 'モジカ' : ''} />
      <span className="toast-body"><strong>{toast.title}</strong><span>{toast.body}</span></span>
      {layer === 0 && extraCount > 0 && <span className="toast-badge">他 {extraCount} 件</span>}
    </>
  );

  if (layer === 0) {
    return (
      <button className={`toast toast-top ${leaving ? 'leaving' : ''}`} onClick={closeNow} title="タップで閉じる">
        {content}
      </button>
    );
  }
  return (
    <div
      className={`toast toast-behind ${leaving ? 'leaving' : ''}`}
      style={{ transform: `translateY(${layer * 10}px)`, zIndex: 10 - layer }}
      aria-hidden="true"
    >
      {content}
    </div>
  );
}

/**
 * モジカのトースト通知（オーバーレイ＋スタック方式）。
 * イベントが発火したら即座に一番手前へ表示し、前のトーストは強制的に後ろへ押しやる。
 * 同時表示は最大3枚で、占有面積は常に1枚分。各トーストは表示から約5秒で個別に消える。
 * 過去の通知はメニューの「モジカの履歴」から見返せる。
 */
export default function MojikaToast() {
  const { visibleToasts } = useGame();
  if (visibleToasts.length === 0) return null;
  const shown = visibleToasts.slice(-MAX_LAYERS);
  const extraCount = visibleToasts.length - 1;
  return (
    <div className="toast-lane" aria-live="polite">
      <div className="toast-stack">
        {shown.map((toast, i) => {
          const layer = shown.length - 1 - i;
          return <StackCard key={toast.id} toast={toast} layer={layer} extraCount={extraCount} />;
        })}
      </div>
    </div>
  );
}
