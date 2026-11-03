import foodCurry from '../assets/food-curry.webp';
import foodFruit from '../assets/food-fruit.webp';
import foodJelly from '../assets/food-jelly.webp';
import foodMeat from '../assets/food-meat.webp';
import foodPellet from '../assets/food-pellet.webp';
import foodSalad from '../assets/food-salad.webp';
import foodStew from '../assets/food-stew.webp';
import MonsterFace from '../components/MonsterFace';
import StaffCard from '../components/StaffCard';
import { FOODS, type Food } from '../lib/game';
import { useGame } from '../lib/store';

/** 餌ごとの写真（残りものだけ写真なし）。 */
const FOOD_IMAGES: Record<string, string> = {
  pellet: foodPellet,
  meat: foodMeat,
  fruit: foodFruit,
  curry: foodCurry,
  salad: foodSalad,
  stew: foodStew,
  jelly: foodJelly,
};

const STAT_LABELS: Record<string, string> = { power: 'パワー', speed: 'スピード', stamina: 'スタミナ', technique: 'テクニック', wisdom: 'かしこさ' };

/** 餌のステータス偏りを「パワー+2・スタミナ+2」形式で返す。 */
const biasTextOf = (food: Food): string => (food.bias
  ? Object.entries(food.bias).filter(([, v]) => (v ?? 0) > 0).map(([k, v]) => `${STAT_LABELS[k] ?? k}+${v}`).join('・')
  : '');

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
  const selectedFood = FOODS.find((food) => food.id === s.selectedFoodId) ?? null;
  const affordSelected = selectedFood ? s.game.wallet >= selectedFood.cost : false;
  const feedLabel = !selectedFood
    ? '餌を選んでね'
    : affordSelected
      ? `この餌であげる（${selectedFood.cost}G）`
      : `お金が足りない（${selectedFood.cost}G／所持金${s.game.wallet}G）`;
  const mogumiLine = selectedFood
    ? `${selectedFood.label}だね。${selectedFood.desc} ${selectedFood.cost}G、なつき${selectedFood.bond >= 0 ? '+' : ''}${selectedFood.bond}${selectedFood.condition ? `、調子${selectedFood.condition >= 0 ? '+' : ''}${selectedFood.condition}` : ''}だよ。${selectedFood.bias ? `今日の特訓・自主練では ${biasTextOf(selectedFood)} が伸びやすくなるよ。` : ''}`
    : s.game.wallet < 50
      ? '所持金が少なめだね。残りものごはんでも、愛情があれば大丈夫だよ。'
      : `「${active.char}」の好みに合わせて選んであげて。ごはんで なつき と調子が変わるよ。`;
  return (
    <section className="screen">
      <div className="compact-head">
        <MonsterFace fighter={active} size={64} />
        <div>
          <h2>{active.day}日目の朝 ― 「{active.char}」</h2>
          <p className="one-line muted">なつき {active.bond}｜調子 {active.condition}</p>
        </div>
      </div>
      <StaffCard speaker="mogumi" line={mogumiLine} />
      <div className="scroll-region">
        <div className="choice-grid foods">
          {FOODS.map((food) => {
            const afford = s.game.wallet >= food.cost;
            return (
            <button key={food.id} className={`choice-card ${s.selectedFoodId === food.id ? 'selected' : ''} ${afford ? '' : 'cant-afford'}`} onClick={() => s.setSelectedFoodId(food.id)}>
              {FOOD_IMAGES[food.id]
                ? <img className="food-img" src={FOOD_IMAGES[food.id]} alt="" />
                : <span className="food-img food-img-ph" aria-hidden="true">🍚</span>}
              <strong>{food.label}</strong>
              <small>{food.cost}G{afford ? '' : '（お金不足）'}</small>
              {food.bias ? <small className="food-bias">{biasTextOf(food)}</small> : null}
            </button>
            );
          })}
        </div>
      </div>
      <div className="footer-actions">
        <button className="primary-button big" onClick={s.chooseFood}>{feedLabel}</button>
      </div>
    </section>
  );
}
