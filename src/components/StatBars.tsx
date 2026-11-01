import type { Stats } from '../lib/game';

export function statEntries(stats: Stats): { key: keyof Stats; label: string; value: number }[] {
  return [
    { key: 'power', label: 'パワー', value: stats.power },
    { key: 'speed', label: 'スピード', value: stats.speed },
    { key: 'stamina', label: 'スタミナ', value: stats.stamina },
    { key: 'technique', label: 'テクニック', value: stats.technique },
    { key: 'wisdom', label: 'かしこさ', value: stats.wisdom },
  ];
}

export default function StatBars({ stats, compact = false }: { stats: Stats; compact?: boolean }) {
  return (
    <div className={`stat-bars ${compact ? 'compact' : ''}`}>
      {statEntries(stats).map((entry) => (
        <div className="stat-row" key={entry.key}>
          <span>{entry.label}</span>
          <div className="bar"><i style={{ width: `${Math.min(100, (entry.value / 170) * 100)}%` }} /></div>
          <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  );
}
