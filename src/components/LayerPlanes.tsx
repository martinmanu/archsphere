import { Edges, Grid, Text } from '@react-three/drei'
import { useMemo } from 'react'
import { useGraphStore } from '@/stores/graphStore'

const planeWidth = 72
const planeHeight = 42

function CubeSpace() {
  const layers = useGraphStore((state) => Array.from(state.layers.values()).filter((layer) => layer.visible))
  const activeLayerId = useGraphStore((state) => state.activeLayerId)
  const depth = useMemo(() => {
    if (layers.length === 0) {
      return { center: 0, size: 24 }
    }

    const zValues = layers.map((layer) => layer.z)
    const min = Math.min(...zValues) - 8
    const max = Math.max(...zValues) + 8
    return { center: (min + max) / 2, size: max - min }
  }, [layers])
  const anchors = useMemo(() => {
    const xValues = [-planeWidth / 2, 0, planeWidth / 2]
    const yValues = [-planeHeight / 2, 0, planeHeight / 2]
    const zValues = [-depth.size / 2, 0, depth.size / 2]
    const points: Array<[number, number, number]> = []

    xValues.forEach((x) => {
      yValues.forEach((y) => {
        zValues.forEach((z) => {
          const onEdge =
            [Math.abs(x) === planeWidth / 2, Math.abs(y) === planeHeight / 2, Math.abs(z) === depth.size / 2].filter(Boolean)
              .length >= 2

          if (onEdge) {
            points.push([x, y, z])
          }
        })
      })
    })

    return points
  }, [depth.size])

  return (
    <group position={[0, 0, depth.center]}>
      <mesh>
        <boxGeometry args={[planeWidth, planeHeight, depth.size]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.035} depthWrite={false} />
        <Edges color="#67e8f9" />
      </mesh>
      {layers.map((layer) => (
        <mesh key={layer.id} position={[0, 0, layer.z - depth.center]}>
          <planeGeometry args={[planeWidth, planeHeight]} />
          <meshStandardMaterial
            color={layer.color}
            transparent
            opacity={layer.id === activeLayerId ? 0.1 : 0.045}
            depthWrite={false}
          />
        </mesh>
      ))}
      {anchors.map((point) => (
        <mesh key={point.join(':')} position={point}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#38bdf8" emissiveIntensity={0.45} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

export function LayerPlanes() {
  const layers = useGraphStore((state) => Array.from(state.layers.values()))
  const activeLayerId = useGraphStore((state) => state.activeLayerId)
  const viewMode = useGraphStore((state) => state.viewMode)
  const setActiveLayer = useGraphStore((state) => state.setActiveLayer)
  const activeLayer = layers.find((layer) => layer.id === activeLayerId)

  if (!activeLayer) {
    return null
  }

  if (viewMode === 'diagram2d') {
    return (
      <group position={[0, 0, activeLayer.z]} visible={activeLayer.visible}>
        <mesh onClick={() => setActiveLayer(activeLayer.id)}>
          <planeGeometry args={[planeWidth, planeHeight]} />
          <meshStandardMaterial color={activeLayer.color} transparent opacity={0.08} depthWrite={false} />
        </mesh>
        <Grid
          rotation={[Math.PI / 2, 0, 0]}
          args={[planeWidth, planeHeight]}
          cellSize={8}
          cellThickness={0.28}
          cellColor={activeLayer.color}
          sectionSize={24}
          sectionThickness={0.55}
          sectionColor={activeLayer.color}
          fadeDistance={48}
          fadeStrength={1}
        />
        <Text
          position={[-33, 18.5, 0.08]}
          fontSize={1.15}
          color={activeLayer.color}
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#07111f"
        >
          {activeLayer.name}
        </Text>
      </group>
    )
  }

  return (
    <>
      <CubeSpace />
      {layers.map((layer) => (
        <group key={layer.id} position={[0, 0, layer.z]} visible={layer.visible}>
          <Grid
            rotation={[Math.PI / 2, 0, 0]}
            args={[planeWidth, planeHeight]}
            cellSize={6}
            cellThickness={0.25}
            cellColor={layer.color}
            sectionSize={18}
            sectionThickness={0.5}
            sectionColor={layer.color}
            fadeDistance={48}
            fadeStrength={1}
          />
          <Text
            position={[-33, 18.5, 0.08]}
            fontSize={1.05}
            color={layer.color}
            anchorX="left"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor="#07111f"
          >
            {layer.name}
          </Text>
        </group>
      ))}
    </>
  )
}
