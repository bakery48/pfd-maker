import type { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';

export function ProcessNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      data={data as { label: string }}
      selected={selected}
      className="pfd-process-node"
    />
  );
}
