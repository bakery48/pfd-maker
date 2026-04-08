import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

const TankIcon = () => (
  <svg width="32" height="22" viewBox="0 0 32 22">
    <ellipse cx="16" cy="4" rx="14" ry="4" fill="none" stroke="#22c55e" strokeWidth="1.5" />
    <rect x="2" y="4" width="28" height="14" fill="none" stroke="#22c55e" strokeWidth="1.5" />
    <ellipse cx="16" cy="18" rx="14" ry="4" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
  </svg>
);

export function TankNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data as { label: string }}
      selected={selected}
      className="pfd-tank-node"
      svgIcon={<TankIcon />}
    />
  );
}
