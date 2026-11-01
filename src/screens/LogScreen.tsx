import { useGame } from '../lib/store';

/**
 * 診断ログ専用画面：閲覧（内側スクロール）＋全件コピー。
 * 文字入力の生データ（コードポイント／書記素分割）や主要イベントが時刻付きで残る。
 */
export default function LogScreen() {
  const s = useGame();

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(s.logText);
      s.addLog('system', `ログをコピーしました（${s.logs.length}件）`);
      s.addToast('ログを全部コピーしたよ。', 'システム');
    } catch (error) {
      s.addLog('error', `ログコピー失敗: ${error instanceof Error ? error.message : String(error)}`);
      s.addToast('コピーに失敗しちゃった。ブラウザのクリップボード権限を確認してね。', 'システム');
    }
  };

  return (
    <section className="screen">
      <div className="screen-bar">
        <span className="one-line">{s.logs.length}件（最大400件）</span>
        <div className="button-row compact">
          <button className="ghost-button" onClick={s.clearLogs}>消去</button>
          <button className="primary-button" onClick={() => void copyAll()}>ログをコピー</button>
        </div>
      </div>
      <div className="scroll-region log-region">
        {s.logs.length === 0 ? (
          <p className="muted">ログはまだありません。</p>
        ) : s.logs.map((entry) => (
          <p key={entry.id} className={`log-line kind-${entry.kind}`}>
            <span className="log-time">{entry.time}</span>
            <span className="log-kind">[{entry.kind}]</span>
            <span>{entry.message}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
