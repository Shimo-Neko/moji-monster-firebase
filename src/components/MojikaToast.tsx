import { useEffect } from 'react';
import { CHARACTERS, characterOf, faceFor, faceSrcSet } from '../lib/characters';
import { useGame } from '../lib/store';

const AUTO_ADVANCE_MS = 6000;

/**
 * みんなのメッセージ窓（画面下部の専用表示領域）。
 * レイアウトの一部として HUD の上に常設されるため、ゲーム画面を覆うことは一切ない。
 * 通知は「束（バースト）」単位で来た順に表示され、約6秒で自動で次へ進む（ボタンでも進められる）。次の操作の束が来ると、前の束の未表示分は破棄される（履歴には残る）。
 * 話者（モジカ・施設担当者など）ごとに顔アイコンと名前の色が切り替わる。
 * 通知が無いときは、モジカの現在のアドバイス（lastMojika）を表示する。
 * 過去の通知はメニューの「メッセージ履歴」から見返せる。
 */
export default function MojikaToast() {
  const { visibleToasts, dismissToast, game, toastHistory } = useGame();
  const current = visibleToasts[0] ?? null;
  const rest = visibleToasts.length - 1;
  const currentId = current?.id ?? null;
  const speaker = current ? characterOf(current.speaker) : CHARACTERS.mojika;
  // 待機表示（lastMojika）が直前に表示した通知と同一文なら、その文はもう伝わっているので汎用の案内に切り替える（同じ文の繰り返し表示防止）。
  const lastToastBody = toastHistory.length > 0 ? toastHistory[toastHistory.length - 1].body : null;
  const activeMonster = game.active;
  const idleText = game.lastMojika && game.lastMojika !== lastToastBody
    ? game.lastMojika
    : !activeMonster
      ? '石盤からモンスターを錬成してみよう！'
      : activeMonster.runEnded
        ? '卒業の手続きを進めよう。'
        : activeMonster.awaitingBattle
          ? '今日は試合の日！アリーナへ向かおう。'
          : `${activeMonster.day}日目。「${activeMonster.char}」の様子を見てあげてね。`;

  useEffect(() => {
    if (currentId === null) return;
    const timer = window.setTimeout(() => dismissToast(currentId), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [currentId, dismissToast]);

  return (
    <div className="mojika-bar" role="status">
      <img className="mojika-bar-avatar" src={faceFor(speaker, current?.mood)} srcSet={faceSrcSet(speaker, current?.mood)} sizes="48px" alt={speaker.name} style={{ borderColor: speaker.color }} />
      <div className="mojika-bar-text">
        <strong style={{ color: speaker.color }}>{current ? current.title : 'モジカ'}</strong>
        <p key={current ? current.id : 'idle'} className="mojika-bar-body">
          {current ? current.body : idleText}
        </p>
      </div>
      {current && rest > 0 && (
        <button className="mojika-bar-next" onClick={() => dismissToast(current.id)}>あと{rest}件 ▸</button>
      )}
      {current && rest === 0 && (
        <button className="mojika-bar-next" onClick={() => dismissToast(current.id)} aria-label="メッセージを閉じる">✕</button>
      )}
    </div>
  );
}
