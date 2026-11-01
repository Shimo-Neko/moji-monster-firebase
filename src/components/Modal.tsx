import type { ReactNode } from 'react';

export default function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose?: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-card">
        <div className="modal-head">
          <h2>{title}</h2>
          {onClose && <button className="icon-button" onClick={onClose} aria-label="閉じる">×</button>}
        </div>
        {children}
      </div>
    </div>
  );
}
