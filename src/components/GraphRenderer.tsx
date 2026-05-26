import { Edge3D } from '@/components/Edge3D'
import { Node3D } from '@/components/Node3D'
import { useGraphStore } from '@/stores/graphStore'

export function GraphRenderer() {
  const visibleNodes = useGraphStore((state) => state.getVisibleNodes())
  const visibleEdges = useGraphStore((state) => state.getVisibleEdges())
  const selectedNodeId = useGraphStore((state) => state.selectedNodeId)
  const selectedEdgeId = useGraphStore((state) => state.selectedEdgeId)
  const pendingConnectionSourceId = useGraphStore((state) => state.pendingConnectionSourceId)
  const toolMode = useGraphStore((state) => state.toolMode)
  const addEdge = useGraphStore((state) => state.addEdge)
  const selectNode = useGraphStore((state) => state.selectNode)
  const selectEdge = useGraphStore((state) => state.selectEdge)
  const setPendingConnectionSource = useGraphStore((state) => state.setPendingConnectionSource)
  const toggleNodeExpansion = useGraphStore((state) => state.toggleNodeExpansion)
  const getNodeById = useGraphStore((state) => state.getNodeById)

  const handleNodeClick = (id: string) => {
    if (toolMode !== 'connect') {
      selectNode(id)
      return
    }

    if (!pendingConnectionSourceId) {
      setPendingConnectionSource(id)
      selectNode(id)
      return
    }

    if (pendingConnectionSourceId === id) {
      setPendingConnectionSource(null)
      return
    }

    addEdge(pendingConnectionSourceId, id, 'http')
  }

  return (
    <>
      {visibleEdges.map((edge) => {
        const source = getNodeById(edge.source)
        const target = getNodeById(edge.target)

        if (!source || !target) {
          return null
        }

        return (
          <Edge3D
            key={edge.id}
            edge={edge}
            sourceNode={source}
            targetNode={target}
            isSelected={edge.id === selectedEdgeId}
            onClick={selectEdge}
          />
        )
      })}

      {visibleNodes.map((node) => (
        <Node3D
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          onClick={handleNodeClick}
          onDoubleClick={toggleNodeExpansion}
        />
      ))}
    </>
  )
}
