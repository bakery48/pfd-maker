import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export function ProcessNode({ id, data, selected }: NodeProps) {
  const nodeData = data as { label: string };
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(nodeData.label);
  const { setNodes } = useReactFlow();

  const commit = useCallback(() => {
    setEditing(false);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: value } } : n
      )
    );
  }, [id, value, setNodes]);

  return (
    <div className={`pfd-process${selected ? ' selected' : ''}`}>
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />

      {editing ? (
        <textarea
          className="node-textarea"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); }
            if (e.key === 'Escape') { setValue(nodeData.label); setEditing(false); }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="node-text"
          onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
