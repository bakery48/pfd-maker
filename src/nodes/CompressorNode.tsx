import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

const CompIcon = () => (
  <svg width="36" height="28" viewBox="0 0 36 28">
    <polygon points="2,2 28,14 2,26" fill="#ec4899" opacity="0.3" stroke="#ec4899" strokeWidth="1.5" />
    <circle cx="28" cy="14" r="8" fill="none" stroke="#ec4899" strokeWidth="1.5" />
  </svg>
);

export function CompressorNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data as { label: string }}
      selected={selected}
      className="pfd-compressor-node"
      svgIcon={<CompIcon />}
    />
  );
}
