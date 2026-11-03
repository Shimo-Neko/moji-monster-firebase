import MonsterFace from '../components/MonsterFace';
import MonsterSummary from '../components/MonsterSummary';
import StatBars from '../components/StatBars';
import { ELEMENT_APTITUDE, SPECIAL_TYPES, STAT_LABELS, moveById, specialTypeOf, stageName, totalOf, type Monster, type PublicMonster } from '../lib/game';
import { useGame } from '../lib/store';

function isRaised(monster: Monster | PublicMonster): monster is Monster {
  return 'bond' in monster;
}

/** モンスター詳細：全ステータスと履歴はここに集約する。 */
export default function MonsterDetailScreen() {
  const s = useGame();
  const detail = s.detail ?? (s.game.active ? { monster: s.game.active, source: '手持ち' } : null);
  if (!detail) {
    return (
      <section className="screen center-screen">
        <h2>表示するモンスターがいません</h2>
        <div className="footer-actions"><button className="primary-button big" onClick={() => s.go('home')}>ホームへ</button></div>
      </section>
    );
  }
  const m = detail.monster;
  const raised = isRaised(m);
  return (
    <section className="screen">
      <div className="compact-head">
        <MonsterFace fighter={m} size={76} />
        <div>
          <h2>「{m.char}」<span className="muted"> {detail.source}</span></h2>
          <p className="one-line muted">第{m.generation}世代{m.isBred ? '・配合個体' : ''}｜{m.fontLabel}</p>
        </div>
      </div>
      <div className="scroll-region">
        <MonsterSummary monster={m} />
        <StatBars stats={m.stats} />
        <dl className="detail-list">
          <div><dt>総合力</dt><dd>{totalOf(m.stats)}</dd></div>
          <div><dt>属性 / 流派</dt><dd>{m.elementType}属性 / {m.school}</dd></div>
          <div><dt>性格</dt><dd>{m.trait}</dd></div>
          <div><dt>必殺技</dt><dd>{m.specialMove}（{SPECIAL_TYPES[specialTypeOf(m)].name}：{SPECIAL_TYPES[specialTypeOf(m)].desc}）</dd></div>
          <div><dt>属性特性</dt><dd>{ELEMENT_APTITUDE[m.elementType] ? `${STAT_LABELS[ELEMENT_APTITUDE[m.elementType]!]}が伸びやすい` : 'なし（バランス型）'}</dd></div>
          {raised && <div><dt>技</dt><dd>{(m.moves ?? []).length > 0 ? (m.moves ?? []).map((id) => { const mv = moveById(id); return mv ? `${mv.name}（${mv.desc}）` : id; }).join('／') : 'まだ覚えていない（特訓で閃くことがあるよ）'}</dd></div>}
          <div><dt>戦績</dt><dd>{m.wins}勝 {m.losses}敗</dd></div>
          {raised && <div><dt>なつき度 / コンディション</dt><dd>{m.bond} / {m.condition}</dd></div>}
          {raised && <div><dt>育成日数</dt><dd>{m.day}日目（次は{stageName(m.stage)}）</dd></div>}
          {raised && m.lineage && <div><dt>血統</dt><dd>{m.lineage}</dd></div>}
          {raised && <div><dt>誕生</dt><dd>{new Date(m.createdAt).toLocaleString('ja-JP')}</dd></div>}
          {!raised && <div><dt>持ち主</dt><dd>{m.ownerName}</dd></div>}
        </dl>
        {raised && s.game.active?.id === m.id && (
          <div className="detail-log">
            <h3>最近の出来事</h3>
            <p>{s.game.lastEvent}</p>
            <p className="muted">モジカ：{s.game.lastMojika}</p>
          </div>
        )}
      </div>
    </section>
  );
}
