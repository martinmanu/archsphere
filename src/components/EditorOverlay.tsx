import {
  Box,
  Braces,
  Boxes,
  CircleDotDashed,
  Database,
  Eye,
  EyeOff,
  Layers3,
  MousePointer2,
  Move3D,
  Network,
  Plus,
  Route,
  Server,
  Trash2,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { edgeColors } from '@/constants/colors'
import { useGraphStore } from '@/stores/graphStore'
import type { EdgeType, NodeType, ToolMode, ViewMode } from '@/types/graph'

const palette: Array<{
  type: NodeType
  label: string
  detail: string
  icon: typeof Layers3
}> = [
  { type: 'domain', label: 'Domain Zone', detail: 'Transparent container', icon: Layers3 },
  { type: 'service', label: 'Service Box', detail: 'Deployable app/service', icon: Server },
  { type: 'api', label: 'API Gateway', detail: 'Rectangular gateway', icon: Network },
  { type: 'component', label: 'Component', detail: 'Internal module', icon: Box },
  { type: 'database', label: 'Database', detail: 'Cylinder datastore', icon: Database },
  { type: 'queue', label: 'Queue', detail: 'Event stream/broker', icon: CircleDotDashed },
  { type: 'cache', label: 'Cache', detail: 'Fast state layer', icon: Boxes },
  { type: 'external', label: 'External', detail: 'Third-party system', icon: Braces },
]

const edgeTypes: EdgeType[] = ['http', 'grpc', 'kafka', 'database', 'cache', 'websocket']

function ToolbarButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean
  children: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-md border transition ${
        active
          ? 'border-cyan-200/60 bg-cyan-300/20 text-cyan-50'
          : 'border-white/10 bg-white/[0.06] text-slate-300 hover:border-cyan-200/40 hover:text-white'
      }`}
      type="button"
      onClick={onClick}
      title={label}
    >
      {children}
    </button>
  )
}

export function EditorOverlay() {
  const selectedNodeId = useGraphStore((state) => state.selectedNodeId)
  const selectedEdgeId = useGraphStore((state) => state.selectedEdgeId)
  const pendingConnectionSourceId = useGraphStore((state) => state.pendingConnectionSourceId)
  const layers = useGraphStore((state) => Array.from(state.layers.values()))
  const activeLayerId = useGraphStore((state) => state.activeLayerId)
  const viewMode = useGraphStore((state) => state.viewMode)
  const toolMode = useGraphStore((state) => state.toolMode)
  const getNodeById = useGraphStore((state) => state.getNodeById)
  const getEdgeById = useGraphStore((state) => state.getEdgeById)
  const setActiveLayer = useGraphStore((state) => state.setActiveLayer)
  const setToolMode = useGraphStore((state) => state.setToolMode)
  const setViewMode = useGraphStore((state) => state.setViewMode)
  const toggleLayerVisibility = useGraphStore((state) => state.toggleLayerVisibility)
  const addLayer = useGraphStore((state) => state.addLayer)
  const removeEdge = useGraphStore((state) => state.removeEdge)
  const updateEdgeType = useGraphStore((state) => state.updateEdgeType)
  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : undefined
  const selectedEdge = selectedEdgeId ? getEdgeById(selectedEdgeId) : undefined
  const sourceNode = selectedEdge ? getNodeById(selectedEdge.source) : undefined
  const targetNode = selectedEdge ? getNodeById(selectedEdge.target) : undefined
  const pendingSource = pendingConnectionSourceId ? getNodeById(pendingConnectionSourceId) : undefined

  const setTool = (mode: ToolMode) => setToolMode(mode)
  const setMode = (mode: ViewMode) => setViewMode(mode)

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <aside className="pointer-events-auto absolute left-4 top-4 flex max-h-[calc(100vh-2rem)] w-[21rem] flex-col gap-3 rounded-lg border border-cyan-300/20 bg-slate-950/60 p-4 text-white shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">ArchSphere</p>
            <h1 className="text-xl font-semibold">Layered Editor</h1>
          </div>
          <div className="rounded-md border border-cyan-300/25 bg-cyan-300/10 p-2 text-cyan-100">
            <Layers3 size={20} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ToolbarButton active={toolMode === 'select'} label="Select" onClick={() => setTool('select')}>
            <MousePointer2 size={18} />
          </ToolbarButton>
          <ToolbarButton active={toolMode === 'connect'} label="Connect" onClick={() => setTool('connect')}>
            <Route size={18} />
          </ToolbarButton>
          <ToolbarButton active={toolMode === 'pan'} label={viewMode === 'layers3d' ? 'Swim' : 'Pan'} onClick={() => setTool('pan')}>
            <Move3D size={18} />
          </ToolbarButton>
          <div className="ml-auto flex rounded-md border border-white/10 bg-white/[0.04] p-1">
            <button
              className={`rounded px-2 py-1 text-xs ${viewMode === 'diagram2d' ? 'bg-cyan-300/20 text-white' : 'text-slate-300'}`}
              type="button"
              onClick={() => setMode('diagram2d')}
            >
              2D
            </button>
            <button
              className={`rounded px-2 py-1 text-xs ${viewMode === 'layers3d' ? 'bg-cyan-300/20 text-white' : 'text-slate-300'}`}
              type="button"
              onClick={() => setMode('layers3d')}
            >
              3D
            </button>
          </div>
        </div>

        {toolMode === 'connect' ? (
          <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-50">
            {pendingSource ? `Connector source: ${pendingSource.label}. Click a target node.` : 'Click a source node to start a connector.'}
          </div>
        ) : null}

        {viewMode === 'diagram2d' ? (
          <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
            2D shows only the active layer. Small portals mark connections to other layers.
          </div>
        ) : toolMode === 'pan' ? (
          <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-50">
            Swim: W/A/S/D or arrows move, Space rises, C descends, Shift speeds up.
          </div>
        ) : (
          <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
            3D shows the transparent architecture cube and layer slices.
          </div>
        )}

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Layers</h2>
            <button
              className="grid h-7 w-7 place-items-center rounded border border-white/10 bg-white/[0.06] text-slate-200 hover:text-white"
              type="button"
              onClick={() => addLayer(`Layer ${layers.length + 1}`)}
              title="Add Layer"
            >
              <Plus size={15} />
            </button>
          </div>
          <div className="grid gap-1.5">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${
                  activeLayerId === layer.id ? 'border-cyan-200/50 bg-cyan-300/10' : 'border-white/10 bg-slate-950/25'
                }`}
              >
                <button
                  className="h-3 w-3 rounded-full"
                  style={{ background: layer.color }}
                  type="button"
                  onClick={() => setActiveLayer(layer.id)}
                  title={`Set ${layer.name} active`}
                />
                <button className="min-w-0 flex-1 truncate text-left text-xs" type="button" onClick={() => setActiveLayer(layer.id)}>
                  {layer.name}
                  <span className="ml-2 text-slate-400">z {layer.z}</span>
                </button>
                <button
                  className="text-slate-300 hover:text-white"
                  type="button"
                  onClick={() => toggleLayerVisibility(layer.id)}
                  title={layer.visible ? 'Hide layer' : 'Show layer'}
                >
                  {layer.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-0 overflow-y-auto pr-1">
          <h2 className="mb-2 text-sm font-semibold">Node Palette</h2>
          <div className="grid gap-2">
            {palette.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.type}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('application/x-archsphere-node', item.type)
                    event.dataTransfer.effectAllowed = 'copy'
                  }}
                  className="group flex cursor-grab items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-left transition hover:border-cyan-200/50 hover:bg-cyan-300/[0.12] active:cursor-grabbing"
                  type="button"
                >
                  <span className={`palette-icon palette-icon-${item.type}`}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block text-xs text-slate-300">{item.detail}</span>
                  </span>
                  <Plus className="text-cyan-200/80 opacity-0 transition group-hover:opacity-100" size={16} />
                </button>
              )
            })}
          </div>
        </section>
      </aside>

      <section className="pointer-events-auto absolute bottom-4 right-4 w-[22rem] rounded-lg border border-white/10 bg-slate-950/60 p-4 text-white shadow-2xl backdrop-blur-xl">
        {selectedEdge ? (
          <>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Connector</p>
                <h2 className="text-lg font-semibold">{selectedEdge.label ?? selectedEdge.type}</h2>
              </div>
              <span className="h-3 w-3 rounded-full" style={{ background: edgeColors[selectedEdge.type] }} />
            </div>
            <div className="grid gap-3 text-sm text-slate-200">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-2">
                {sourceNode?.label ?? selectedEdge.source} -&gt; {targetNode?.label ?? selectedEdge.target}
              </div>
              <label className="grid gap-1">
                <span className="text-xs text-slate-400">Type</span>
                <select
                  className="rounded-md border border-white/10 bg-slate-900 px-2 py-2 text-sm text-white"
                  value={selectedEdge.type}
                  onChange={(event) => updateEdgeType(selectedEdge.id, event.target.value as EdgeType)}
                >
                  {edgeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-md border border-red-300/30 bg-red-500/12 px-3 py-2 text-sm text-red-100 hover:bg-red-500/20"
                type="button"
                onClick={() => removeEdge(selectedEdge.id)}
              >
                <Trash2 size={16} />
                Delete connector
              </button>
            </div>
          </>
        ) : selectedNode ? (
          <>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{selectedNode.type}</p>
                <h2 className="text-lg font-semibold">{selectedNode.label}</h2>
              </div>
              <span className="h-3 w-3 rounded-full" style={{ background: selectedNode.color }} />
            </div>
            <dl className="grid gap-2 text-sm text-slate-200">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Position</dt>
                <dd>
                  {selectedNode.position.x}, {selectedNode.position.y}, {selectedNode.position.z}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Layer</dt>
                <dd>{layers.find((layer) => layer.id === selectedNode.layerId)?.name ?? 'Unassigned'}</dd>
              </div>
              {selectedNode.metadata?.owner ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Owner</dt>
                  <dd>{selectedNode.metadata.owner}</dd>
                </div>
              ) : null}
              {selectedNode.metadata?.techStack ? (
                <div>
                  <dt className="mb-1 text-slate-400">Stack</dt>
                  <dd className="flex flex-wrap gap-1">
                    {selectedNode.metadata.techStack.map((item) => (
                      <span key={item} className="rounded bg-white/10 px-2 py-0.5 text-xs">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </>
        ) : (
          <div className="text-sm text-slate-300">
            <p className="mb-2 font-medium text-white">Build on the active layer.</p>
            <p>Use Select to move nodes, Connect to create edges, and 3D/Pan to swim through the cube.</p>
          </div>
        )}
      </section>
    </div>
  )
}
