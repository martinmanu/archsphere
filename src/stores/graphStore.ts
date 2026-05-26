import { create } from 'zustand'
import { sampleGraph } from '@/data/sampleGraph'
import type {
  ArchEdge,
  ArchNode,
  EdgeType,
  GraphData,
  LayerPlane,
  NodeType,
  ToolMode,
  Vector3D,
  ViewMode,
} from '@/types/graph'

interface GraphState {
  nodes: Map<string, ArchNode>
  edges: Map<string, ArchEdge>
  layers: Map<string, LayerPlane>
  selectedNodeId: string | null
  selectedEdgeId: string | null
  pendingConnectionSourceId: string | null
  isDraggingNode: boolean
  draggedNodeId: string | null
  viewMode: ViewMode
  toolMode: ToolMode
  activeLayerId: string
  expandedNodeIds: Set<string>
  visibleNodeIds: Set<string>
  loadGraph: (data: GraphData) => void
  selectNode: (id: string | null) => void
  selectEdge: (id: string | null) => void
  setPendingConnectionSource: (id: string | null) => void
  setDraggingNode: (isDraggingNode: boolean) => void
  setDraggedNodeId: (id: string | null) => void
  setViewMode: (viewMode: ViewMode) => void
  setToolMode: (toolMode: ToolMode) => void
  setActiveLayer: (id: string) => void
  addLayer: (name: string) => void
  toggleLayerVisibility: (id: string) => void
  addNode: (type: NodeType, position: Vector3D) => void
  updateNodePosition: (id: string, position: Vector3D) => void
  addEdge: (sourceId: string, targetId: string, type?: EdgeType, label?: string) => void
  removeEdge: (edgeId: string) => void
  updateEdgeType: (edgeId: string, type: EdgeType) => void
  toggleNodeExpansion: (id: string) => void
  moveNodeRelative: (id: string, dx: number, dy: number) => void
  moveNodeLayer: (id: string, direction: 'front' | 'behind') => void
  getVisibleNodes: () => ArchNode[]
  getVisibleEdges: () => ArchEdge[]
  getNodeById: (id: string) => ArchNode | undefined
  getEdgeById: (id: string) => ArchEdge | undefined
  getNodeChildren: (nodeId: string) => ArchNode[]
  getVisibleLayers: () => LayerPlane[]
  getActiveLayer: () => LayerPlane
}

export const defaultLayers: LayerPlane[] = [
  { id: 'ui-layer', name: 'UI Layer', z: -12, color: '#38bdf8', visible: true, locked: false },
  { id: 'services-layer', name: 'Services Layer', z: 0, color: '#a78bfa', visible: true, locked: false },
  { id: 'data-layer', name: 'Data Layer', z: 12, color: '#10b981', visible: true, locked: false },
  { id: 'infra-layer', name: 'Infra Layer', z: 24, color: '#f59e0b', visible: true, locked: false },
]

function buildMaps(data: GraphData) {
  return {
    nodes: new Map(data.nodes.map((node) => [node.id, node])),
    edges: new Map(data.edges.map((edge) => [edge.id, edge])),
  }
}

function isNodeVisible(
  node: ArchNode,
  nodes: Map<string, ArchNode>,
  expandedNodeIds: Set<string>,
  layers: Map<string, LayerPlane>,
) {
  if (node.layerId && layers.get(node.layerId)?.visible === false) {
    return false
  }

  if (!node.parentId) {
    return true
  }

  let current: ArchNode | undefined = node

  while (current?.parentId) {
    if (!expandedNodeIds.has(current.parentId)) {
      return false
    }

    current = nodes.get(current.parentId)
  }

  return true
}

function deriveVisibleNodeIds(
  nodes: Map<string, ArchNode>,
  expandedNodeIds: Set<string>,
  layers: Map<string, LayerPlane>,
) {
  const visibleNodeIds = new Set<string>()

  nodes.forEach((node) => {
    if (isNodeVisible(node, nodes, expandedNodeIds, layers)) {
      visibleNodeIds.add(node.id)
    }
  })

  return visibleNodeIds
}

const initialGraph = buildMaps(sampleGraph)
const initialLayers = new Map(defaultLayers.map((layer) => [layer.id, layer]))
const initialVisibleNodeIds = deriveVisibleNodeIds(initialGraph.nodes, new Set(), initialLayers)

const nodeDefaults: Record<NodeType, { label: string; color: string; parent?: string }> = {
  domain: { label: 'New Domain', color: '#38bdf8' },
  service: { label: 'New Service', color: '#a78bfa', parent: 'domain-backend' },
  component: { label: 'Component', color: '#c4b5fd', parent: 'svc-api' },
  database: { label: 'Database', color: '#10b981', parent: 'svc-auth' },
  queue: { label: 'Event Queue', color: '#f59e0b', parent: 'svc-analytics' },
  api: { label: 'API Gateway', color: '#60a5fa', parent: 'domain-backend' },
  cache: { label: 'Cache', color: '#22d3ee', parent: 'svc-api' },
  external: { label: 'External App', color: '#94a3b8' },
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: initialGraph.nodes,
  edges: initialGraph.edges,
  layers: initialLayers,
  selectedNodeId: null,
  selectedEdgeId: null,
  pendingConnectionSourceId: null,
  isDraggingNode: false,
  draggedNodeId: null,
  viewMode: 'diagram2d',
  toolMode: 'select',
  activeLayerId: 'services-layer',
  expandedNodeIds: new Set(),
  visibleNodeIds: initialVisibleNodeIds,

  loadGraph: (data) => {
    const { nodes, edges } = buildMaps(data)
    const layers = new Map(defaultLayers.map((layer) => [layer.id, layer]))
    const expandedNodeIds = new Set<string>()

    set({
      nodes,
      edges,
      layers,
      selectedNodeId: null,
      selectedEdgeId: null,
      pendingConnectionSourceId: null,
      isDraggingNode: false,
      draggedNodeId: null,
      viewMode: 'diagram2d',
      toolMode: 'select',
      activeLayerId: 'services-layer',
      expandedNodeIds,
      visibleNodeIds: deriveVisibleNodeIds(nodes, expandedNodeIds, layers),
    })
  },

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),

  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  setPendingConnectionSource: (id) => set({ pendingConnectionSourceId: id }),

  setDraggingNode: (isDraggingNode) => set({ isDraggingNode }),

  setDraggedNodeId: (id) => set({ draggedNodeId: id, isDraggingNode: !!id }),

  setViewMode: (viewMode) => set({ viewMode }),

  setToolMode: (toolMode) => set({ toolMode, pendingConnectionSourceId: null }),

  setActiveLayer: (id) => {
    if (!get().layers.has(id)) {
      return
    }

    set({ activeLayerId: id })
  },

  addLayer: (name) => {
    const { layers } = get()
    const id = `layer-${Date.now()}`
    const z = Math.max(...Array.from(layers.values()).map((layer) => layer.z)) + 12
    const nextLayers = new Map(layers)
    nextLayers.set(id, {
      id,
      name,
      z,
      color: '#e2e8f0',
      visible: true,
      locked: false,
    })
    set({ layers: nextLayers, activeLayerId: id })
  },

  toggleLayerVisibility: (id) => {
    const { layers, nodes, expandedNodeIds } = get()
    const layer = layers.get(id)

    if (!layer) {
      return
    }

    const nextLayers = new Map(layers)
    nextLayers.set(id, { ...layer, visible: !layer.visible })
    set({
      layers: nextLayers,
      visibleNodeIds: deriveVisibleNodeIds(nodes, expandedNodeIds, nextLayers),
    })
  },

  addNode: (type, position) => {
    const { activeLayerId, layers, nodes, expandedNodeIds } = get()
    const defaults = nodeDefaults[type]
    const activeLayer = layers.get(activeLayerId) ?? defaultLayers[1]
    const id = `${type}-${Date.now()}`
    const parentId = defaults.parent && nodes.has(defaults.parent) ? defaults.parent : undefined
    const node: ArchNode = {
      id,
      type,
      label: defaults.label,
      parentId,
      color: defaults.color,
      layerId: activeLayer.id,
      position: { ...position, z: activeLayer.z },
      metadata: {
        description: 'Created in the 3D editor',
      },
    }
    const nextNodes = new Map(nodes)
    nextNodes.set(id, node)

    if (parentId) {
      const parent = nextNodes.get(parentId)

      if (parent) {
        nextNodes.set(parentId, {
          ...parent,
          children: Array.from(new Set([...(parent.children ?? []), id])),
        })
      }
    }

    const nextExpandedNodeIds = new Set(expandedNodeIds)

    let ancestorId = parentId

    while (ancestorId) {
      nextExpandedNodeIds.add(ancestorId)
      ancestorId = nextNodes.get(ancestorId)?.parentId
    }

    set({
      nodes: nextNodes,
      selectedNodeId: id,
      selectedEdgeId: null,
      expandedNodeIds: nextExpandedNodeIds,
      visibleNodeIds: deriveVisibleNodeIds(nextNodes, nextExpandedNodeIds, layers),
    })
  },

  updateNodePosition: (id, position) => {
    const { layers, nodes, visibleNodeIds } = get()
    const node = nodes.get(id)

    if (!node) {
      return
    }

    const layer = node.layerId ? layers.get(node.layerId) : undefined
    const nextNodes = new Map(nodes)
    nextNodes.set(id, { ...node, position: { ...position, z: layer?.z ?? position.z } })
    set({ nodes: nextNodes, visibleNodeIds: new Set(visibleNodeIds) })
  },

  addEdge: (sourceId, targetId, type = 'http', label) => {
    const { edges } = get()

    if (sourceId === targetId) {
      return
    }

    const id = `edge-${sourceId}-${targetId}-${Date.now()}`
    const nextEdges = new Map(edges)
    nextEdges.set(id, {
      id,
      source: sourceId,
      target: targetId,
      type,
      label: label ?? `${type.toUpperCase()} connection`,
    })
    set({
      edges: nextEdges,
      selectedEdgeId: id,
      selectedNodeId: null,
      pendingConnectionSourceId: null,
      toolMode: 'select',
    })
  },

  removeEdge: (edgeId) => {
    const nextEdges = new Map(get().edges)
    nextEdges.delete(edgeId)
    set({ edges: nextEdges, selectedEdgeId: null })
  },

  updateEdgeType: (edgeId, type) => {
    const { edges } = get()
    const edge = edges.get(edgeId)

    if (!edge) {
      return
    }

    const nextEdges = new Map(edges)
    nextEdges.set(edgeId, { ...edge, type })
    set({ edges: nextEdges })
  },

  toggleNodeExpansion: (id) => {
    const { layers, nodes, expandedNodeIds } = get()
    const nextExpandedNodeIds = new Set(expandedNodeIds)

    if (nextExpandedNodeIds.has(id)) {
      nextExpandedNodeIds.delete(id)
    } else {
      nextExpandedNodeIds.add(id)
    }

    set({
      expandedNodeIds: nextExpandedNodeIds,
      visibleNodeIds: deriveVisibleNodeIds(nodes, nextExpandedNodeIds, layers),
    })
  },

  moveNodeRelative: (id, dx, dy) => {
    const { nodes, updateNodePosition } = get()
    const node = nodes.get(id)
    if (!node) return
    updateNodePosition(id, {
      x: Number((node.position.x + dx).toFixed(2)),
      y: Number((node.position.y + dy).toFixed(2)),
      z: node.position.z,
    })
  },

  moveNodeLayer: (id, direction) => {
    const { nodes, layers, expandedNodeIds } = get()
    const node = nodes.get(id)
    if (!node || !node.layerId) return

    const sortedLayers = Array.from(layers.values()).sort((a, b) => a.z - b.z)
    const currentIndex = sortedLayers.findIndex((l) => l.id === node.layerId)
    if (currentIndex === -1) return

    const nextIndex = direction === 'front' ? currentIndex - 1 : currentIndex + 1

    if (nextIndex >= 0 && nextIndex < sortedLayers.length) {
      const nextLayer = sortedLayers[nextIndex]
      const nextNodes = new Map(nodes)
      nextNodes.set(id, {
        ...node,
        layerId: nextLayer.id,
        position: {
          x: node.position.x,
          y: node.position.y,
          z: nextLayer.z,
        },
      })

      set({
        nodes: nextNodes,
        visibleNodeIds: deriveVisibleNodeIds(nextNodes, expandedNodeIds, layers),
      })
    }
  },

  getVisibleNodes: () => {
    const { activeLayerId, nodes, viewMode, visibleNodeIds } = get()
    return Array.from(visibleNodeIds)
      .map((id) => nodes.get(id))
      .filter((node): node is ArchNode => {
        if (!node) {
          return false
        }

        return viewMode === 'layers3d' || !node.layerId || node.layerId === activeLayerId
      })
  },

  getVisibleEdges: () => {
    const { activeLayerId, edges, nodes, viewMode, visibleNodeIds } = get()

    return Array.from(edges.values()).filter((edge) => {
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) {
        return false
      }

      if (viewMode === 'layers3d') {
        return true
      }

      const source = nodes.get(edge.source)
      const target = nodes.get(edge.target)

      return source?.layerId === activeLayerId && target?.layerId === activeLayerId
    })
  },

  getNodeById: (id) => get().nodes.get(id),

  getEdgeById: (id) => get().edges.get(id),

  getNodeChildren: (nodeId) => {
    const { nodes } = get()
    return Array.from(nodes.values()).filter((node) => node.parentId === nodeId)
  },

  getVisibleLayers: () => Array.from(get().layers.values()).filter((layer) => layer.visible),

  getActiveLayer: () => get().layers.get(get().activeLayerId) ?? defaultLayers[1],
}))
