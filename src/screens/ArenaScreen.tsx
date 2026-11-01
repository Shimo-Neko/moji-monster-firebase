import arenaBg from '../assets/arena.webp';
import { stageName } from '../lib/game';
import { MATCH_DAYS, useGame } from '../lib/store';

/** アリーナ：モード選択だけ。相手リストや観戦は別画面。 */
export default function ArenaScreen() {
  const s = useGame();
  const active = s.game.active;
  const tournamentReady = Boolean(active?.awaitingBattle && !active?.runEnded);
  return (
    <section
      className="screen"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(10, 16, 26, 0.62), rgba(10, 16, 26, 0.82)), url(${arenaBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="screen-title">モードを選んでね</h2>
      <p className="one-line muted">
        {tournamentReady ? `今日は${stageName(active?.stage ?? 0)}の日！` : active && !active.runEnded ? `次の試合は${MATCH_DAYS[Math.min(active.stage, 2)]}日目` : '大会は育成中の子が必要です'}
      </p>
      <div className="mode-list">
        <button className="mode-button" onClick={s.startTournament}>
          <strong>🏆 大会</strong>
          <span>{tournamentReady ? `${stageName(active?.stage ?? 0)}に挑む` : '試合日に挑めます'}</span>
        </button>
        <button className="mode-button" onClick={() => s.go('free')}>
          <strong>🥊 フリーバトル</strong>
          <span>保存した子で気軽に対戦</span>
        </button>
        <button className="mode-button" onClick={() => s.go('ghost')}>
          <strong>🌐 みんなのモンスター</strong>
          <span>殿堂入り＆ランダムマッチ</span>
        </button>
      </div>
    </section>
  );
}
