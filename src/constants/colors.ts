import type { EdgeType } from '@/types/graph'

export const edgeColors: Record<EdgeType, string> = {
  http: '#60a5fa',
  grpc: '#a78bfa',
  kafka: '#f59e0b',
  database: '#10b981',
  cache: '#22d3ee',
  websocket: '#f472b6',
}
