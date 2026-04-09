import type { DragEvent } from 'react';

function DndItem({
  type,
  label,
  description,
  icon,
}: {
  type: string;
  label: string;
  description: string;
  defaultLabel: string;
  icon: React.ReactNode;
}) {
  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/pfd-node-type', type);
    e.dataTransfer.setData('application/pfd-node-label', label === '成果物' ? '成果物' : 'プロセス');
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="dnd-node" draggable onDragStart={onDragStart}>
      <div className="dnd-icon">{icon}</div>
      <div>
        <div className="dnd-label">{label}</div>
        <div className="dnd-desc">{description}</div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>PFD Maker</span>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">要素</div>

        <DndItem
          type="deliverable"
          label="成果物"
          description="文書・データ・モノ"
          defaultLabel="成果物"
          icon={
            <svg width="44" height="28" viewBox="0 0 44 28">
              <rect x="1" y="1" width="42" height="26" rx="3" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <line x1="8" y1="9" x2="36" y2="9" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
              <line x1="8" y1="14" x2="28" y2="14" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
              <line x1="8" y1="19" x2="32" y2="19" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
            </svg>
          }
        />

        <DndItem
          type="process"
          label="プロセス"
          description="作業・タスク・活動"
          defaultLabel="プロセス"
          icon={
            <svg width="44" height="28" viewBox="0 0 44 28">
              <ellipse cx="22" cy="14" rx="21" ry="13" fill="#fff7ed" stroke="#f97316" strokeWidth="2" />
              <line x1="10" y1="10" x2="34" y2="10" stroke="#f97316" strokeWidth="1" opacity="0.4" />
              <line x1="10" y1="18" x2="34" y2="18" stroke="#f97316" strokeWidth="1" opacity="0.4" />
            </svg>
          }
        />
      </div>

      <div className="sidebar-rule">
        <div className="rule-title">接続ルール</div>
        <div className="rule-item">
          <span className="rule-box">成果物</span>
          <span className="rule-arrow">→</span>
          <span className="rule-oval">プロセス</span>
        </div>
        <div className="rule-item">
          <span className="rule-oval">プロセス</span>
          <span className="rule-arrow">→</span>
          <span className="rule-box">成果物</span>
        </div>
        <div className="rule-note">同種同士の接続は不可</div>
      </div>

      <div className="sidebar-tips">
        <div className="rule-title">操作方法</div>
        <div className="tip-item">ドラッグ → 配置</div>
        <div className="tip-item">ハンドルドラッグ → 接続</div>
        <div className="tip-item">ダブルクリック → 編集</div>
        <div className="tip-item">Delete/BS → 削除</div>
      </div>
    </div>
  );
}
