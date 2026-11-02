/**
 * 装飾フォント（モンスターの字体5種）の遅延読み込み。
 *
 * 初回表示を軽くするため、index.html では UI 用の2種（Noto Sans JP／M PLUS Rounded 1c）だけを読み込み、
 * 残り5種（Shippori Mincho／Yuji Syuku／Mochiy Pop One／Yomogi／DotGothic16）は
 * 必要な場面（スタイル選択・バトル・装飾フォントのモンスター所持時）で初めて読み込む。
 * 読み込みは一度きりで、display=swap により読み込み中も代替フォントで表示される。
 */

/** 装飾フォントを使うフォントID（game.ts の FONTS と対応）。 */
export const DECORATIVE_FONT_IDS = ['mincho', 'brush', 'pop', 'hand', 'dot'];

const FONT_CSS_URL =
  'https://fonts.googleapis.com/css2?family=DotGothic16&family=Mochiy+Pop+One&family=Shippori+Mincho:wght@600;700;800&family=Yomogi&family=Yuji+Syuku&display=swap';

let requested = false;

/** 装飾フォントのスタイルシートを（未投入なら）読み込む。何度呼んでも安全。 */
export function ensureMonsterFonts(): void {
  if (requested) return;
  requested = true;
  if (typeof document === 'undefined') return;
  if (document.querySelector('link[data-monster-fonts]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONT_CSS_URL;
  link.setAttribute('data-monster-fonts', '');
  document.head.appendChild(link);
}
