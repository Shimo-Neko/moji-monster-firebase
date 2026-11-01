import { totalOf, type Monster, type PublicMonster } from '../lib/game';

/** 属性・流派・総合力などの小さな要約ピル群。 */
export default function MonsterSummary({ monster }: { monster: Monster | PublicMonster }) {
  const total = 'total' in monster ? monster.total : totalOf(monster.stats);
  return (
    <div className="summary-lines">
      <span className="pill">{monster.elementType}属性</span>
      <span className="pill">{monster.school}</span>
      <span className="pill">総合力 {total}</span>
      <span className="pill">{monster.trait}</span>
      <span className="pill wide">必殺技：{monster.specialMove}</span>
    </div>
  );
}
