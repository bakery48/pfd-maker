import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

interface PfdNodeData extends Record<string, unknown> {
  label: string;
  sublabel?: string;
}

interface BaseNodeProps {
  id: string;
  data: PfdNodeData;
  selected?: boolean;
  className: string;
  svgIcon?: React.ReactNode;
  minWidth?: number;
  handles?: { type: 'source' | 'target'; position: Position; id: string }[];
}

export type { NodeProps };

export function BaseNode({
  id,
  data,
  selected,
  className,
  svgIcon,
  minWidth = 100,
  handles,
}: BaseNodeProps) {
  const [editing, setEditing] = useState(false);
  const [labelValue, setLabelValue] = useState(data.label);
  const { setNodes } = useReactFlow();

  const commitEdit = useCallback(() => {
    setEditing(false);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: labelValue } } : n
      )
    );
  }, [id, labelValue, setNodes]);

  const defaultHandles = handles ?? [
    { type: 'target' as const, position: Position.Left, id: 'left' },
    { type: 'source' as const, position: Position.Right, id: 'right' },
    { type: 'target' as const, position: Position.Top, id: 'top' },
    { type: 'source' as const, position: Position.Bottom, id: 'bottom' },
  ];

  return (
    <div
      className={`${className}${selected ? ' selected' : ''}`}
      style={{ minWidth }}
    >
      {defaultHandles.map((h) => (
        <Handle key={h.id} type={h.type} position={h.position} id={h.id} />
      ))}

      {svgIcon && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          {svgIcon}
        </div>
      )}

      {editing ? (
        <input
          className="node-label-input"
          value={labelValue}
          autoFocus
          onChange={(e) => setLabelValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit();
            if (e.key === 'Escape') {
              setLabelValue(data.label);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="node-label-text"
          style={{ fontSize: 12, fontWeight: 600 }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          {labelValue}
        </span>
      )}

      {data.sublabel && (
        <span style={{ fontSize: 10, color: '#64748b', display: 'block', textAlign: 'center' }}>
          {data.sublabel}
        </span>
      )}
    </div>
  );
}
