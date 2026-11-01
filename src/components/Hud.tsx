import { useGame } from '../lib/store';

/**
 * 左下ではなく、レイアウト最下段に確保された固定フッターとして表示するHUD。
 * ボタン等のインタラクティブ要素に重なることはない。
 */
export default function Hud() {
  const { game, matchLabel } = useGame();
  const active = game.active;
  return (
    <footer className="hud">
      <span>Day {active ? active.day : '―'}/21</span>
      <span className="hud-match">{matchLabel}</span>
      <span>{game.wallet}G</span>
    </footer>
  );
}
