import { useEffect, useState } from 'react';
import { CHARACTERS } from '../lib/characters';
import { STORY_CHAPTERS, chapterUnlocked } from '../lib/story';
import { useGame } from '../lib/store';

/** ストーリー閲覧：立ち絵＋台詞を1行ずつ送る専用画面（レイアウト内完結で、他を覆わない）。 */
export default function StoryReadScreen() {
  const s = useGame();
  const chapter = STORY_CHAPTERS.find((c) => c.id === s.storyId) ?? null;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [s.storyId]);

  if (!chapter || !chapterUnlocked(chapter, s.game.hall.length)) {
    return (
      <section className="screen center-screen">
        <h2>この章はまだ開かれていません</h2>
        <div className="footer-actions">
          <button className="primary-button big" onClick={() => s.go('story')}>章の一覧へ</button>
        </div>
      </section>
    );
  }

  const line = chapter.lines[Math.min(index, chapter.lines.length - 1)];
  const speaker = CHARACTERS[line.speaker];
  const isLast = index >= chapter.lines.length - 1;

  return (
    <section className="screen">
      <p className="one-line muted">{chapter.title}（{index + 1} / {chapter.lines.length}）</p>
      <div className="story-stage">
        <img key={line.speaker} className="story-img" src={speaker.image} alt={speaker.name} />
        <div className="story-text">
          <strong style={{ color: speaker.color }}>{speaker.name}</strong>
          <p key={index} className="story-line">{line.text}</p>
        </div>
      </div>
      <div className="footer-actions row">
        <button className="ghost-button" onClick={() => s.go('story')}>章の一覧へ</button>
        {isLast ? (
          <button className="primary-button grow" onClick={s.completeStory}>読み終える</button>
        ) : (
          <button className="primary-button grow" onClick={() => setIndex((i) => i + 1)}>次へ ▸</button>
        )}
      </div>
    </section>
  );
}
