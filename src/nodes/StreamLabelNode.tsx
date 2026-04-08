import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export function StreamLabelNode({ id, data, selected }: NodeProps) {
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
    <div
      className="node-stream-label"
      style={{
        outline: selected ? '2px solid #3b82f6' : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      {editing ? (
        <input
          className="node-label-input"
          value={value}
          autoFocus
          style={{ minWidth: 60 }}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') {
              setValue(nodeData.label);
              setEditing(false);
            }
          }}
        />
      ) : (
        <span
          className="node-label-text"
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
