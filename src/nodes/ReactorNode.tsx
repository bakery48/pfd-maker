import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

const ReactorIcon = () => (
  <svg width="28" height="38" viewBox="0 0 28 38">
    <path
      d="M14,2 C20,2 26,5 26,10 L26,28 C26,33 20,36 14,36 C8,36 2,33 2,28 L2,10 C2,5 8,2 14,2 Z"
      fill="none"
      stroke="#e11d48"
      strokeWidth="1.5"
    />
    <path d="M6,16 Q14,13 22,16" fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="2,2" />
    <path d="M6,21 Q14,18 22,21" fill="none" stroke="#e11d48" strokeWidth="1" strokeDasharray="2,2" />
    <line x1="14" y1="2" x2="14" y2="0" stroke="#e11d48" strokeWidth="2" />
    <line x1="14" y1="36" x2="14" y2="38" stroke="#e11d48" strokeWidth="2" />
  </svg>
);

export function ReactorNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data as { label: string }}
      selected={selected}
      className="pfd-reactor-node"
      svgIcon={<ReactorIcon />}
    />
  );
}
