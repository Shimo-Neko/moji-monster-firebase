import { useEffect, useRef, useState } from 'react';
import mojikaImg from '../assets/mojika.webp';
import { useGame, type ToastItem } from '../lib/store';

const AUTO_DISMISS_MS = 5000;
const LEAVE_MS = 280;
/** 新着トーストを開いて見せる時間（ms）。過ぎると小さなアイコンに畳まれる。 */
const PEEK_MS = 2600;
/** 同時に重ねて見せる最大枚数。溢れた分は後ろで待機する。 */
const MAX_LAYERS = 3;

/**
 * トースト1枚分の表示。
 * 自動消滅タイマーは「開いている間」だけ進む。畳まれている間は保持され、
 * 開いたときにその枚のカウントが始まる（画面を読みたいときに邪魔をしないため）。
 * layer が 0 の枚だけが一番手前で読めてタップで閉じられ、それ以外は後ろに重なる。
 */
function StackCard({ toast, layer, extraCount, counting }: { toast: ToastItem; layer: number; extraCount: number; counting: boolean }) {
  const { dismissToast } = useGame();
  const [leaving, setLeaving] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    if (!counting) {
      setLeaving(false);
      return;
    }
    const fadeTimer = window.setTimeout(() => setLeaving(true), AUTO_DISMISS_MS);
    const removeTimer = window.setTimeout(() => dismissToast(toast.id), AUTO_DISMISS_MS + LEAVE_MS);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [toast.id, dismissToast, counting]);

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
 * モジカのトースト通知（オーバーレイ＋スタック＋自動で畳む方式）。
 * 新着が来たら約2.6秒だけ開いて見せ、その後は右上の小さな丸アイコンに畳まれる。
 * 画面を覆い続けないので、結果画面などを読む邪魔をしない。
 * アイコンをタップすると未読分が開き、開いている間だけ各トーストの消滅タイマーが進む。
 * 過去の通知はメニューの「モジカの履歴」からも見返せる。
 */
export default function MojikaToast() {
  const { visibleToasts } = useGame();
  const [expanded, setExpanded] = useState(false);
  const peekTimerRef = useRef<number | null>(null);
  const topId = visibleToasts.length > 0 ? visibleToasts[visibleToasts.length - 1].id : null;
  const prevTopIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (topId === null) {
      prevTopIdRef.current = null;
      setExpanded(false);
      return;
    }
    if (prevTopIdRef.current !== topId) {
      prevTopIdRef.current = topId;
      setExpanded(true);
      peekTimerRef.current = window.setTimeout(() => setExpanded(false), PEEK_MS);
      return () => {
        if (peekTimerRef.current !== null) window.clearTimeout(peekTimerRef.current);
      };
    }
  }, [topId]);

  if (visibleToasts.length === 0) return null;
  const shown = visibleToasts.slice(-MAX_LAYERS);
  const extraCount = visibleToasts.length - 1;

  const toggle = () => {
    if (peekTimerRef.current !== null) window.clearTimeout(peekTimerRef.current);
    setExpanded((prev) => !prev);
  };

  return (
    <div className="toast-lane" aria-live="polite">
      <div className="toast-dock">
        <button className="toast-bubble" onClick={toggle} aria-label={expanded ? '通知をたたむ' : '通知を開く'}>
          <img src={mojikaImg} alt="モジカ" />
          <span className="toast-bubble-count">{visibleToasts.length}</span>
        </button>
        {expanded && (
          <div className="toast-stack">
            {shown.map((toast, i) => {
              const layer = shown.length - 1 - i;
              return <StackCard key={toast.id} toast={toast} layer={layer} extraCount={extraCount} counting={expanded} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
