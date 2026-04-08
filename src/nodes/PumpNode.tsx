import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

const PumpIcon = () => (
  <svg width="32" height="28" viewBox="0 0 32 28">
    <circle cx="16" cy="14" r="12" fill="none" stroke="#a855f7" strokeWidth="1.5" />
    <polygon points="10,8 26,14 10,20" fill="#a855f7" opacity="0.4" stroke="#a855f7" strokeWidth="1" />
  </svg>
);

export function PumpNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data as { label: string }}
      selected={selected}
      className="pfd-pump-node"
      svgIcon={<PumpIcon />}
    />
  );
}
