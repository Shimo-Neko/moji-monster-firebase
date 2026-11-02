import { CHARACTERS, faceFor } from '../lib/characters';
import { affectionOf, affectionTier } from '../lib/game';
import { useGame } from '../lib/store';

/** みんな：キャラ一覧と好感度・特典の確認専用画面。 */
export default function CharactersScreen() {
  const s = useGame();
  return (
    <section className="screen">
      <p className="one-line muted">研究所と街のみんな。お世話になるほど好感度が上がり、「仲良し」になると特典が解放されます。</p>
      <div className="scroll-region">
        <div className="char-list">
          {Object.values(CHARACTERS).map((c) => {
            const points = affectionOf(s.game, c.id);
            const tier = affectionTier(points);
            return (
              <div key={c.id} className="char-row">
                <img src={faceFor(c, tier.benefitActive ? 'smile' : undefined)} alt={c.name} style={{ border: `2px solid ${c.color}` }} />
                <div className="char-row-text">
                  <strong style={{ color: c.color }}>{c.name}<span className="muted"> ― {c.role}</span></strong>
                  <span>{tier.benefitActive ? `特典：${c.benefit}` : `仲良し特典：${c.benefit}`}</span>
                </div>
                <div className="char-aff">
                  <strong>{tier.name}</strong>
                  <span>好感度 {points}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
