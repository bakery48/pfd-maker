import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

const ValveIcon = () => (
  <svg width="36" height="22" viewBox="0 0 36 22">
    <polygon points="2,2 18,11 2,20" fill="#eab308" opacity="0.5" stroke="#eab308" strokeWidth="1.5" />
    <polygon points="34,2 18,11 34,20" fill="#eab308" opacity="0.5" stroke="#eab308" strokeWidth="1.5" />
    <line x1="18" y1="1" x2="18" y2="11" stroke="#eab308" strokeWidth="1.5" />
    <line x1="14" y1="1" x2="22" y2="1" stroke="#eab308" strokeWidth="1.5" />
  </svg>
);

export function ValveNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data as { label: string }}
      selected={selected}
      className="pfd-valve-node"
      svgIcon={<ValveIcon />}
    />
  );
}
