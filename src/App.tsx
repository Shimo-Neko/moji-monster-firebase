import { useEffect, useState } from 'react';
import Hud from './components/Hud';
import MojikaToast from './components/MojikaToast';
import NavigationModal from './components/NavigationModal';
import GoogleConflictModal from './components/GoogleConflictModal';
import { GameProvider, useGame, type Screen } from './lib/store';
import ActionScreen from './screens/ActionScreen';
import ArenaScreen from './screens/ArenaScreen';
import BattleWatchScreen from './screens/BattleWatchScreen';
import CollectionScreen from './screens/CollectionScreen';
import CreateCharScreen from './screens/CreateCharScreen';
import CreateConfirmScreen from './screens/CreateConfirmScreen';
import CreateStyleScreen from './screens/CreateStyleScreen';
import DayResultScreen from './screens/DayResultScreen';
import FeedingScreen from './screens/FeedingScreen';
import FreeBattleScreen from './screens/FreeBattleScreen';
import FrozenStorageScreen from './screens/FrozenStorageScreen';
import FusionScreen from './screens/FusionScreen';
import GhostBattleScreen from './screens/GhostBattleScreen';
import GraduateScreen from './screens/GraduateScreen';
import HallOfFameScreen from './screens/HallOfFameScreen';
import HomeScreen from './screens/HomeScreen';
import LogScreen from './screens/LogScreen';
import MojikaHistoryScreen from './screens/MojikaHistoryScreen';
import MonsterDetailScreen from './screens/MonsterDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import TutorialScreen from './screens/TutorialScreen';
import CharactersScreen from './screens/CharactersScreen';
import DojoScreen from './screens/DojoScreen';
import ItemsScreen from './screens/ItemsScreen';
import StoryListScreen from './screens/StoryListScreen';
import StoryReadScreen from './screens/StoryReadScreen';
import WildEncounterScreen from './screens/WildEncounterScreen';
import './styles.css';

const TITLES: Record<Screen, string> = {
  home: '文字モンスター研究所',
  createChar: '生成 ― もじ',
  createStyle: '生成 ― 色とフォント',
  createConfirm: '生成 ― 確認',
  feed: '朝の餌やり',
  action: '今日の行動',
  result: '1日の結果',
  detail: 'モンスター詳細',
  arena: 'アリーナ',
  battle: 'バトル観戦',
  free: 'フリーバトル',
  ghost: 'みんなのモンスター',
  collection: 'コレクション',
  fusion: '配合',
  frozen: '凍結保管',
  hall: '殿堂入り',
  tutorial: 'チュートリアル',
  graduate: '卒業',
  wild: '野生モンスター襲来',
  story: 'ストーリー',
  storyRead: 'ストーリー',
  dojo: '道場破り',
  characters: 'みんな',
  items: 'アイテム',
  settings: '設定',
  mojikaHistory: 'メッセージ履歴',
  log: '診断ログ',
};

function CurrentScreen() {
  const { screen } = useGame();
  switch (screen) {
    case 'createChar': return <CreateCharScreen />;
    case 'createStyle': return <CreateStyleScreen />;
    case 'createConfirm': return <CreateConfirmScreen />;
    case 'feed': return <FeedingScreen />;
    case 'action': return <ActionScreen />;
    case 'result': return <DayResultScreen />;
    case 'detail': return <MonsterDetailScreen />;
    case 'arena': return <ArenaScreen />;
    case 'battle': return <BattleWatchScreen />;
    case 'free': return <FreeBattleScreen />;
    case 'ghost': return <GhostBattleScreen />;
    case 'collection': return <CollectionScreen />;
    case 'fusion': return <FusionScreen />;
    case 'frozen': return <FrozenStorageScreen />;
    case 'hall': return <HallOfFameScreen />;
    case 'tutorial': return <TutorialScreen />;
    case 'graduate': return <GraduateScreen />;
    case 'wild': return <WildEncounterScreen />;
    case 'story': return <StoryListScreen />;
    case 'storyRead': return <StoryReadScreen />;
    case 'dojo': return <DojoScreen />;
    case 'characters': return <CharactersScreen />;
    case 'items': return <ItemsScreen />;
    case 'settings': return <SettingsScreen />;
    case 'mojikaHistory': return <MojikaHistoryScreen />;
    case 'log': return <LogScreen />;
    case 'home':
    default: return <HomeScreen />;
  }
}

function Shell() {
  const { screen, setMenuOpen } = useGame();
  // ソフトウェアキーボード表示中はシェルに目印を付ける（メッセージ窓を畳んで入力領域を空けるため）。
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setKeyboardOpen(vv.height < window.innerHeight * 0.8);
    vv.addEventListener('resize', onResize);
    onResize();
    return () => vv.removeEventListener('resize', onResize);
  }, []);
  return (
    <div className={`app-shell${keyboardOpen ? ' keyboard-open' : ''}`}>
      <header className="topbar">
        <button className="ghost-button menu-button" onClick={() => setMenuOpen(true)} aria-label="メニューを開く">☰</button>
        <h1>{TITLES[screen]}</h1>
        <span className="topbar-spacer" aria-hidden="true" />
      </header>
      <main className="main">
        <CurrentScreen />
      </main>
      <MojikaToast />
      <Hud />
      <NavigationModal />
      <GoogleConflictModal />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}
