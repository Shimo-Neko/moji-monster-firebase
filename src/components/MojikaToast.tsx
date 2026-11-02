import { useEffect } from 'react';
import { CHARACTERS, characterOf, faceFor } from '../lib/characters';
import { useGame } from '../lib/store';

const AUTO_ADVANCE_MS = 6000;

/**
 * みんなのメッセージ窓（画面下部の専用表示領域）。
 * レイアウトの一部として HUD の上に常設されるため、ゲーム画面を覆うことは一切ない。
 * 通知は来た順に表示され、約6秒で自動で次へ進む（ボタンでも進められる）。
 * 話者（モジカ・施設担当者など）ごとに顔アイコンと名前の色が切り替わる。
 * 通知が無いときは、モジカの現在のアドバイス（lastMojika）を表示する。
 * 過去の通知はメニューの「メッセージ履歴」から見返せる。
 */
export default function MojikaToast() {
  const { visibleToasts, dismissToast, game } = useGame();
  const current = visibleToasts[0] ?? null;
  const rest = visibleToasts.length - 1;
  const currentId = current?.id ?? null;
  const speaker = current ? characterOf(current.speaker) : CHARACTERS.mojika;

  useEffect(() => {
    if (currentId === null) return;
    const timer = window.setTimeout(() => dismissToast(currentId), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [currentId, dismissToast]);

  return (
    <div className="mojika-bar" role="status">
      <img className="mojika-bar-avatar" src={faceFor(speaker, current?.mood)} alt={speaker.name} style={{ borderColor: speaker.color }} />
      <div className="mojika-bar-text">
        <strong style={{ color: speaker.color }}>{current ? current.title : 'モジカ'}</strong>
        <p key={current ? current.id : 'idle'} className="mojika-bar-body">
          {current ? current.body : game.lastMojika}
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
