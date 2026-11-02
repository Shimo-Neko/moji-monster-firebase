import { ITEMS, itemCount } from '../lib/game';
import { useGame } from '../lib/store';

/** アイテム：所持品の使用とショップでの購入を扱う専用画面。 */
export default function ItemsScreen() {
  const s = useGame();
  const active = s.game.active;
  return (
    <section className="screen">
      <p className="one-line muted">
        所持金 {s.game.wallet}G{active ? `｜「${active.char}」調子 ${active.condition}・なつき ${active.bond}` : ''}
        {s.game.trainingBoost ? '｜特訓ドリンク効果中' : ''}
      </p>
      <div className="scroll-region">
        <h3 className="panel-title">持ち物</h3>
        <div className="char-list">
          {ITEMS.map((item) => {
            const count = itemCount(s.game, item.id);
            const usable = count > 0 && (item.id === 'drink' ? !s.game.trainingBoost : Boolean(active));
            return (
              <div key={item.id} className="char-row">
                <div className="char-row-text">
                  <strong>{item.label} ×{count}</strong>
                  <span>{item.desc}</span>
                </div>
                <button className="chip" disabled={!usable} onClick={() => s.useItem(item.id)}>使う</button>
              </div>
            );
          })}
        </div>
        <h3 className="panel-title">ショップ</h3>
        <div className="char-list">
          {ITEMS.map((item) => (
            <div key={item.id} className="char-row">
              <div className="char-row-text">
                <strong>{item.label} ― {item.price}G</strong>
                <span>{item.desc}</span>
              </div>
              <button className="chip" disabled={s.game.wallet < item.price} onClick={() => s.buyItem(item.id)}>買う</button>
            </div>
          ))}
        </div>
        <p className="note">野生モンスターを倒すと落とすことがあります。道場破りでランに勝つと「絆のお守り」がもらえます。</p>
      </div>
    </section>
  );
}
