/** 診断ログの型と整形ユーティリティ。
 *  ログ本体の保持・記録は lib/store.tsx（GameProvider）が担う。 */

export type LogKind = 'input' | 'screen' | 'create' | 'turn' | 'battle' | 'error' | 'system';

export interface LogEntry {
  id: string;
  /** ISO 8601（ミリ秒付き） */
  time: string;
  kind: LogKind;
  message: string;
}

/** 文字列をコードポイント単位で "U+XXXX" 表記の配列にする（診断用）。 */
export function codePointsOf(value: string): string[] {
  return Array.from(value, (ch) => {
    const cp = ch.codePointAt(0) ?? 0;
    return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
  });
}

/** ログ全件をコピー用のプレーンテキストに整形する。 */
export function formatLogs(logs: LogEntry[]): string {
  return logs.map((entry) => `[${entry.time}] [${entry.kind}] ${entry.message}`).join('\n');
}
