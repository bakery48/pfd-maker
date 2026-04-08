import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

const SepIcon = () => (
  <svg width="24" height="38" viewBox="0 0 24 38">
    <ellipse cx="12" cy="5" rx="10" ry="4" fill="none" stroke="#10b981" strokeWidth="1.5" />
    <rect x="2" y="5" width="20" height="28" fill="none" stroke="#10b981" strokeWidth="1.5" />
    <ellipse cx="12" cy="33" rx="10" ry="4" fill="#f0fdf4" stroke="#10b981" strokeWidth="1.5" />
    <line x1="2" y1="22" x2="22" y2="22" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2" />
  </svg>
);

export function SeparatorNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data as { label: string }}
      selected={selected}
      className="pfd-separator-node"
      svgIcon={<SepIcon />}
    />
  );
}
