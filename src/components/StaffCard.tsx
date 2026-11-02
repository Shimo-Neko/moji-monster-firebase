import { CHARACTERS, imageSrcSet, type SpeakerId } from '../lib/characters';

/**
 * 施設の担当者エリア（レイアウト内の専用枠）。
 * 立ち絵＋名前＋その画面の状況に合わせた一言を表示する。オーバーレイはしない。
 */
export default function StaffCard({ speaker, line }: { speaker: SpeakerId; line: string }) {
  const c = CHARACTERS[speaker];
  return (
    <section className="staff-card" style={{ borderLeftColor: c.color }}>
      <img className="staff-card-img" src={c.image} srcSet={imageSrcSet(c)} sizes="140px" alt={c.name} />
      <div className="staff-card-text">
        <p className="staff-card-name">
          <strong style={{ color: c.color }}>{c.name}</strong>
          <span>{c.role}</span>
        </p>
        <p className="staff-card-line">{line}</p>
      </div>
    </section>
  );
}
