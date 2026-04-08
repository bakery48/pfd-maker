import type { DragEvent } from 'react';

interface NodeDef {
  type: string;
  label: string;
  defaultLabel: string;
  icon: React.ReactNode;
}

const EQUIPMENT: NodeDef[] = [
  {
    type: 'process',
    label: 'プロセス装置',
    defaultLabel: 'プロセス',
    icon: (
      <svg width="32" height="20" viewBox="0 0 32 20">
        <rect x="1" y="1" width="30" height="18" rx="3" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="8" y1="7" x2="24" y2="7" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
        <line x1="8" y1="13" x2="24" y2="13" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    type: 'tank',
    label: 'タンク / 容器',
    defaultLabel: 'タンク',
    icon: (
      <svg width="24" height="28" viewBox="0 0 24 28">
        <ellipse cx="12" cy="5" rx="10" ry="3.5" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <rect x="2" y="5" width="20" height="18" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        <ellipse cx="12" cy="23" rx="10" ry="3.5" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    type: 'heatex',
    label: '熱交換器',
    defaultLabel: '熱交換器',
    icon: (
      <svg width="34" height="20" viewBox="0 0 34 20">
        <circle cx="17" cy="10" r="8" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <line x1="0" y1="10" x2="9" y2="10" stroke="#f97316" strokeWidth="1.5" />
        <line x1="25" y1="10" x2="34" y2="10" stroke="#f97316" strokeWidth="1.5" />
        <line x1="12" y1="6" x2="22" y2="6" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="2,2" />
        <line x1="12" y1="14" x2="22" y2="14" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="2,2" />
      </svg>
    ),
  },
  {
    type: 'pump',
    label: 'ポンプ',
    defaultLabel: 'ポンプ',
    icon: (
      <svg width="28" height="24" viewBox="0 0 28 24">
        <circle cx="14" cy="12" r="11" fill="none" stroke="#a855f7" strokeWidth="1.5" />
        <polygon points="8,6 22,12 8,18" fill="#a855f7" opacity="0.4" stroke="#a855f7" strokeWidth="1" />
      </svg>
    ),
  },
  {
    type: 'valve',
    label: 'バルブ',
    defaultLabel: 'バルブ',
    icon: (
      <svg width="32" height="22" viewBox="0 0 32 22">
        <polygon points="2,2 16,11 2,20" fill="#eab308" opacity="0.5" stroke="#eab308" strokeWidth="1.5" />
        <polygon points="30,2 16,11 30,20" fill="#eab308" opacity="0.5" stroke="#eab308" strokeWidth="1.5" />
        <line x1="16" y1="1" x2="16" y2="11" stroke="#eab308" strokeWidth="1.5" />
        <line x1="12" y1="1" x2="20" y2="1" stroke="#eab308" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    type: 'separator',
    label: 'セパレーター',
    defaultLabel: 'セパレーター',
    icon: (
      <svg width="20" height="30" viewBox="0 0 20 30">
        <ellipse cx="10" cy="4" rx="8" ry="3" fill="none" stroke="#10b981" strokeWidth="1.5" />
        <rect x="2" y="4" width="16" height="22" fill="none" stroke="#10b981" strokeWidth="1.5" />
        <ellipse cx="10" cy="26" rx="8" ry="3" fill="#f0fdf4" stroke="#10b981" strokeWidth="1.5" />
        <line x1="2" y1="17" x2="18" y2="17" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    ),
  },
  {
    type: 'compressor',
    label: 'コンプレッサー',
    defaultLabel: 'コンプレッサー',
    icon: (
      <svg width="30" height="22" viewBox="0 0 30 22">
        <polygon points="2,2 24,11 2,20" fill="#ec4899" opacity="0.3" stroke="#ec4899" strokeWidth="1.5" />
        <circle cx="23" cy="11" r="6" fill="none" stroke="#ec4899" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    type: 'reactor',
    label: 'リアクター',
    defaultLabel: 'リアクター',
    icon: (
      <svg width="20" height="28" viewBox="0 0 20 28">
        <path
          d="M10,1 C15,1 19,4 19,8 L19,20 C19,24 15,27 10,27 C5,27 1,24 1,20 L1,8 C1,4 5,1 10,1 Z"
          fill="none"
          stroke="#e11d48"
          strokeWidth="1.5"
        />
        <path d="M4,13 Q10,10 16,13" fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="2,2" />
        <path d="M4,18 Q10,15 16,18" fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    ),
  },
];

const ANNOTATION: NodeDef[] = [
  {
    type: 'streamLabel',
    label: 'ストリームラベル',
    defaultLabel: 'S-101',
    icon: (
      <svg width="34" height="16" viewBox="0 0 34 16">
        <rect x="1" y="1" width="32" height="14" rx="3" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
        <text x="17" y="11" textAnchor="middle" fontSize="8" fill="#64748b">S-101</text>
      </svg>
    ),
  },
];

function DndItem({ def }: { def: NodeDef }) {
  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/pfd-node-type', def.type);
    e.dataTransfer.setData('application/pfd-node-label', def.defaultLabel);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="dnd-node" draggable onDragStart={onDragStart}>
      <div className="dnd-icon">{def.icon}</div>
      <span className="dnd-label">{def.label}</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-header-icon">⚙️</span>
        PFD Maker
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">プロセス機器</div>
        {EQUIPMENT.map((def) => (
          <DndItem key={def.type} def={def} />
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">注釈</div>
        {ANNOTATION.map((def) => (
          <DndItem key={def.type} def={def} />
        ))}
      </div>
    </div>
  );
}
