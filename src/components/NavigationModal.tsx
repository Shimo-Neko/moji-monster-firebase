import Modal from './Modal';
import { useGame, type Screen } from '../lib/store';

/** 画面遷移はこのメニューに一本化する（各画面に重複した戻る導線を置かない）。 */
export default function NavigationModal() {
  const s = useGame();
  if (!s.menuOpen) return null;
  const active = s.game.active;
  const items: { screen: Screen; label: string; show: boolean }[] = [
    { screen: 'home', label: '⌂ ホーム', show: true },
    { screen: 'detail', label: `🔍 手持ちの詳細${active ? `（「${active.char}」）` : ''}`, show: Boolean(active) },
    { screen: 'createChar', label: '✦ 生成（円盤石）', show: !active },
    { screen: 'feed', label: '🍖 育成（餌やり）', show: Boolean(active && !active?.runEnded && !active?.awaitingBattle) },
    { screen: 'arena', label: '⚔ アリーナ', show: true },
    { screen: 'free', label: '🥊 フリーバトル', show: true },
    { screen: 'ghost', label: '🌐 みんなのモンスター', show: true },
    { screen: 'collection', label: `📚 コレクション（${s.game.collection.length}）`, show: true },
    { screen: 'fusion', label: '🧬 配合', show: true },
    { screen: 'frozen', label: `❄ 凍結保管（${s.game.hibernation.length}/6）`, show: true },
    { screen: 'hall', label: `🏆 殿堂入り（${s.game.hall.length}）`, show: true },
    { screen: 'graduate', label: '🎓 卒業手続き', show: Boolean(active?.runEnded) },
    { screen: 'tutorial', label: '❔ チュートリアル', show: true },
    { screen: 'settings', label: '⚙ 設定', show: true },
    { screen: 'mojikaHistory', label: '💬 モジカの履歴', show: true },
    { screen: 'log', label: '📋 診断ログ', show: true },
  ];
  return (
    <Modal title="メニュー" onClose={() => s.setMenuOpen(false)}>
      <div className="nav-list">
        {items.filter((item) => item.show).map((item) => (
          <button key={item.screen} className={s.screen === item.screen ? 'selected' : ''} onClick={() => s.go(item.screen)}>
            {item.label}
          </button>
        ))}
      </div>
    </Modal>
  );
}
