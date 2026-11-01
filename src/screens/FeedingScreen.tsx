import foodFruit from '../assets/food-fruit.webp';
import foodMeat from '../assets/food-meat.webp';
import foodPellet from '../assets/food-pellet.webp';
import MonsterFace from '../components/MonsterFace';
import { FOODS } from '../lib/game';
import { useGame } from '../lib/store';

/** 餌ごとの写真（残りものだけ写真なし）。 */
const FOOD_IMAGES: Record<string, string> = {
  pellet: foodPellet,
  meat: foodMeat,
  fruit: foodFruit,
};

/** 餌やり画面：餌の選択だけ。 */
export default function FeedingScreen() {
  const s = useGame();
  const active = s.game.active;
  if (!active) {
    return (
      <section className="screen center-screen">
        <h2>手元にモンスターがいません</h2>
        <div className="footer-actions"><button className="primary-button big" onClick={s.primaryAction}>{s.primaryLabel}</button></div>
      </section>
    );
  }
  if (active.runEnded) {
    return (
      <section className="screen center-screen">
        <h2>育成は終了しました</h2>
        <div className="footer-actions"><button className="primary-button big" onClick={() => s.go('graduate')}>卒業の手続きへ</button></div>
      </section>
    );
  }
  if (active.awaitingBattle) {
    return (
      <section className="screen center-screen">
        <h2>今日は試合の日！</h2>
        <div className="footer-actions"><button className="primary-button big" onClick={() => s.go('arena')}>アリーナへ</button></div>
      </section>
    );
  }
  return (
    <section className="screen">
      <div className="compact-head">
        <MonsterFace fighter={active} size={64} />
        <div>
          <h2>{active.day}日目の朝 ― 「{active.char}」</h2>
          <p className="one-line muted">なつき {active.bond}｜調子 {active.condition}</p>
        </div>
      </div>
      <div className="choice-grid foods">
        {FOODS.map((food) => (
          <button key={food.id} className={`choice-card ${s.selectedFoodId === food.id ? 'selected' : ''}`} onClick={() => s.setSelectedFoodId(food.id)}>
            {FOOD_IMAGES[food.id] && <img className="food-img" src={FOOD_IMAGES[food.id]} alt="" />}
            <strong>{food.label}</strong>
            <span>{food.cost}G｜なつき {food.bond >= 0 ? '+' : ''}{food.bond}{food.condition ? `｜調子+${food.condition}` : ''}</span>
            <small>{food.desc}</small>
          </button>
        ))}
      </div>
      <div className="footer-actions">
        <button className="primary-button big" onClick={s.chooseFood}>この餌であげる</button>
      </div>
    </section>
  );
}
