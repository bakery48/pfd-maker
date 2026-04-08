import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

const HeatExIcon = () => (
  <svg width="40" height="22" viewBox="0 0 40 22">
    <circle cx="20" cy="11" r="10" fill="none" stroke="#f97316" strokeWidth="1.5" />
    <line x1="0" y1="11" x2="10" y2="11" stroke="#f97316" strokeWidth="1.5" />
    <line x1="30" y1="11" x2="40" y2="11" stroke="#f97316" strokeWidth="1.5" />
    <line x1="14" y1="6" x2="26" y2="6" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
    <line x1="14" y1="16" x2="26" y2="16" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2,2" />
  </svg>
);

export function HeatExchangerNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data as { label: string }}
      selected={selected}
      className="pfd-heatex-node"
      svgIcon={<HeatExIcon />}
    />
  );
}
