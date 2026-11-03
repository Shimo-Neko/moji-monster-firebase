import StaffCard from '../components/StaffCard';
import { STORY_CHAPTERS, chapterUnlocked } from '../lib/story';
import { useGame } from '../lib/store';

/** ストーリー：章の一覧（殿堂入り数で解放）。読む章を選ぶ専用画面。 */
export default function StoryListScreen() {
  const s = useGame();
  const hallCount = s.game.hall.length;
  const seen = s.game.storySeen ?? [];
  return (
    <section className="screen">
      <StaffCard speaker="shiori" line="街と石盤の物語です。殿堂に刻まれた子の数が増えるほど、新しい章が開かれます。" />
      <div className="scroll-region">
        <div className="story-list">
          {STORY_CHAPTERS.map((chapter) => {
            const unlocked = chapterUnlocked(chapter, hallCount);
            const isSeen = seen.includes(chapter.id);
            return (
              <button
                key={chapter.id}
                className="story-row"
                disabled={!unlocked}
                onClick={() => s.openStory(chapter.id)}
              >
                <strong>{unlocked ? chapter.title : '？？？'}</strong>
                <span>{unlocked ? chapter.summary : `殿堂入り ${chapter.unlockHall} 体で解放（現在 ${hallCount} 体）`}</span>
                {unlocked && <span className={`chip ${isSeen ? '' : 'selected'}`}>{isSeen ? '既読' : '未読'}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
