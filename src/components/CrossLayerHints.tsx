import { Html, Line } from '@react-three/drei'
import { edgeColors } from '@/constants/colors'
import { useGraphStore } from '@/stores/graphStore'

export function CrossLayerHints() {
  const viewMode = useGraphStore((state) => state.viewMode)
  const activeLayerId = useGraphStore((state) => state.activeLayerId)
  const edges = useGraphStore((state) => Array.from(state.edges.values()))
  const getNodeById = useGraphStore((state) => state.getNodeById)
  const layers = useGraphStore((state) => state.layers)

  if (viewMode !== 'diagram2d') {
    return null
  }

  const hints = edges
    .map((edge) => {
      const source = getNodeById(edge.source)
      const target = getNodeById(edge.target)

      if (!source || !target) {
        return null
      }

      const sourceIsActive = source.layerId === activeLayerId
      const targetIsActive = target.layerId === activeLayerId

      if (sourceIsActive === targetIsActive) {
        return null
      }

      const localNode = sourceIsActive ? source : target
      const remoteNode = sourceIsActive ? target : source
      const remoteLayer = remoteNode.layerId ? layers.get(remoteNode.layerId) : undefined
      const direction = sourceIsActive ? 'out' : 'in'

      return {
        edge,
        localNode,
        remoteNode,
        remoteLayer,
        direction,
      }
    })
    .filter((hint): hint is NonNullable<typeof hint> => Boolean(hint))

  return (
    <>
      {hints.map(({ edge, localNode, remoteLayer, remoteNode, direction }) => {
        const color = edgeColors[edge.type]
        const start: [number, number, number] = [localNode.position.x, localNode.position.y, localNode.position.z + 0.2]
        const end: [number, number, number] = [localNode.position.x + 2.2, localNode.position.y + 1.35, localNode.position.z + 0.2]

        return (
          <group key={`hint-${edge.id}`}>
            <Line points={[start, end]} color={color} lineWidth={2} dashed dashSize={0.28} gapSize={0.2} transparent opacity={0.9} />
            <mesh position={end}>
              <ringGeometry args={[0.24, 0.36, 24]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} transparent opacity={0.95} />
            </mesh>
            <Html position={[end[0] + 0.2, end[1] + 0.2, end[2]]} center distanceFactor={16}>
              <div className="layer-hint">
                <span className="layer-hint-direction">{direction}</span>
                <span>{remoteLayer?.name ?? remoteNode.label}</span>
              </div>
            </Html>
          </group>
        )
      })}
    </>
  )
}
