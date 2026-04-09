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
  type IsValidConnection,
  reconnectEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';

import './App.css';
import { Sidebar } from './components/Sidebar';
import { DeliverableNode } from './nodes/DeliverableNode';
import { ProcessNode } from './nodes/ProcessNode';

const nodeTypes = {
  deliverable: DeliverableNode,
  process: ProcessNode,
};

const defaultEdgeOptions = {
  markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
  style: { stroke: '#334155', strokeWidth: 2 },
};

let nodeId = 0;
function newId() {
  return `node-${++nodeId}-${Date.now()}`;
}

function FlowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, getNodes, getEdges } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // PFDルール: 成果物↔プロセス のみ接続可（同種は禁止）
  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      const allNodes = getNodes();
      const sourceNode = allNodes.find((n) => n.id === connection.source);
      const targetNode = allNodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return false;
      // 同種同士は禁止
      if (sourceNode.type === targetNode.type) return false;
      // 成果物への複数プロセスからの入力を禁止（1つのプロセスからのみ生成）
      if (targetNode.type === 'deliverable') {
        const allEdges = getEdges();
        const existingIncoming = allEdges.filter((e) => e.target === connection.target);
        if (existingIncoming.length > 0) return false;
      }
      return true;
    },
    [getNodes, getEdges]
  );

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

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
    },
    [setEdges]
  );

  const handleSave = useCallback(() => {
    const data = { nodes: getNodes(), edges: getEdges() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pfd.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [getNodes, getEdges]);

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

  const handleExportPng = useCallback(() => {
    const el = document.querySelector('.react-flow') as HTMLElement;
    if (!el) return;
    toPng(el, { backgroundColor: '#ffffff', pixelRatio: 2 }).then((dataUrl) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'pfd.png';
      a.click();
    });
  }, []);

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

      <div className="canvas-area">
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
            <div className="hint-icon">📋</div>
            <div className="hint-text">左のパネルから要素をドラッグしてください</div>
            <div className="hint-sub">成果物とプロセスを配置して接続します</div>
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
          isValidConnection={isValidConnection}
          onReconnect={onReconnect}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          snapToGrid
          snapGrid={[16, 16]}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
          <Controls />
          <MiniMap
            nodeColor={(n) => (n.type === 'deliverable' ? '#3b82f6' : '#f97316')}
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
