import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';

import './App.css';
import { Sidebar } from './components/Sidebar';
import { ProcessNode } from './nodes/ProcessNode';
import { TankNode } from './nodes/TankNode';
import { HeatExchangerNode } from './nodes/HeatExchangerNode';
import { PumpNode } from './nodes/PumpNode';
import { ValveNode } from './nodes/ValveNode';
import { SeparatorNode } from './nodes/SeparatorNode';
import { CompressorNode } from './nodes/CompressorNode';
import { ReactorNode } from './nodes/ReactorNode';
import { StreamLabelNode } from './nodes/StreamLabelNode';

const nodeTypes = {
  process: ProcessNode,
  tank: TankNode,
  heatex: HeatExchangerNode,
  pump: PumpNode,
  valve: ValveNode,
  separator: SeparatorNode,
  compressor: CompressorNode,
  reactor: ReactorNode,
  streamLabel: StreamLabelNode,
};

const defaultEdgeOptions = {
  markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
  style: { stroke: '#475569', strokeWidth: 2 },
};

let nodeId = 0;
function newId() {
  return `node-${++nodeId}-${Date.now()}`;
}

function FlowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, getNodes, getEdges } = useReactFlow();
  const flowRef = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/pfd-node-type');
      const label = e.dataTransfer.getData('application/pfd-node-label');
      if (!type) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const newNode: Node = {
        id: newId(),
        type,
        position,
        data: { label },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  // Save as JSON
  const handleSave = useCallback(() => {
    const data = { nodes: getNodes(), edges: getEdges() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pfd-diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [getNodes, getEdges]);

  // Load from JSON
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleLoad = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.nodes) setNodes(data.nodes);
          if (data.edges) setEdges(data.edges);
        } catch {
          alert('ファイルの読み込みに失敗しました');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [setNodes, setEdges]
  );

  // Export as PNG
  const handleExportPng = useCallback(() => {
    const el = document.querySelector('.react-flow') as HTMLElement;
    if (!el) return;
    toPng(el, { backgroundColor: '#f8fafc', pixelRatio: 2 }).then((dataUrl) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'pfd-diagram.png';
      a.click();
    });
  }, []);

  // Clear
  const handleClear = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    if (confirm('ダイアグラムをクリアしますか？')) {
      setNodes([]);
      setEdges([]);
    }
  }, [nodes.length, edges.length, setNodes, setEdges]);

  return (
    <div className="app">
      <Sidebar />

      <div className="canvas-area" ref={flowRef}>
        {/* Toolbar */}
        <div className="toolbar">
          <button className="toolbar-btn secondary" onClick={handleLoad}>
            📂 開く
          </button>
          <button className="toolbar-btn primary" onClick={handleSave} disabled={nodes.length === 0}>
            💾 保存
          </button>
          <div className="toolbar-sep" />
          <button className="toolbar-btn secondary" onClick={handleExportPng} disabled={nodes.length === 0}>
            🖼️ PNG出力
          </button>
          <div className="toolbar-sep" />
          <button className="toolbar-btn danger" onClick={handleClear} disabled={nodes.length === 0 && edges.length === 0}>
            🗑️ クリア
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        {nodes.length === 0 && (
          <div className="empty-hint">
            <div className="hint-icon">⚙️</div>
            <div className="hint-text">左のパネルから機器をドラッグしてください</div>
            <div className="hint-sub">ノードを接続してプロセスフロー図を作成します</div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          snapToGrid
          snapGrid={[16, 16]}
          proOptions={{ hideAttribution: false }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              const colorMap: Record<string, string> = {
                process: '#3b82f6',
                tank: '#22c55e',
                heatex: '#f97316',
                pump: '#a855f7',
                valve: '#eab308',
                separator: '#10b981',
                compressor: '#ec4899',
                reactor: '#e11d48',
                streamLabel: '#94a3b8',
              };
              return colorMap[n.type ?? ''] ?? '#94a3b8';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowApp />
    </ReactFlowProvider>
  );
}
