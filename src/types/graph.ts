export type NodeType =
  | 'domain'
  | 'service'
  | 'component'
  | 'database'
  | 'queue'
  | 'api'
  | 'cache'
  | 'external'

export type EdgeType = 'http' | 'grpc' | 'kafka' | 'database' | 'cache' | 'websocket'
export type ViewMode = 'diagram2d' | 'layers3d'
export type ToolMode = 'select' | 'connect' | 'pan'

export interface Vector3D {
  x: number
  y: number
  z: number
}

export interface ArchNode {
  id: string
  type: NodeType
  label: string
  position: Vector3D
  color: string
  layerId?: string
  parentId?: string
  children?: string[]
  metadata?: {
    owner?: string
    techStack?: string[]
    repository?: string
    documentation?: string
    description?: string
    dependencies?: string[]
    [key: string]: unknown
  }
}

export interface ArchEdge {
  id: string
  source: string
  target: string
  type: EdgeType
  label?: string
  metadata?: Record<string, unknown>
}

export interface LayerPlane {
  id: string
  name: string
  z: number
  color: string
  visible: boolean
  locked: boolean
}

export interface GraphData {
  version: string
  metadata: {
    name: string
    organization?: string
    lastUpdated: string
    author?: string
  }
  nodes: ArchNode[]
  edges: ArchEdge[]
}
