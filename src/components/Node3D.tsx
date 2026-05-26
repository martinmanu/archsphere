import { Edges, Html, RoundedBox, Text } from '@react-three/drei'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Plane, Vector3 } from 'three'
import type { Group } from 'three'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronsDown, ChevronsUp } from 'lucide-react'
import { useGraphStore } from '@/stores/graphStore'
import type { ArchNode } from '@/types/graph'

interface Props {
  node: ArchNode
  isSelected: boolean
  onClick: (id: string) => void
  onDoubleClick: (id: string) => void
}

function getLabelOffset(type: ArchNode['type']) {
  switch (type) {
    case 'domain':
      return 4.4
    case 'service':
    case 'api':
      return 2.2
    case 'database':
    case 'queue':
      return 2
    default:
      return 1.6
  }
}

function NodeGeometry({ type }: { type: ArchNode['type'] }) {
  switch (type) {
    case 'domain':
      return <boxGeometry args={[9, 6.5, 0.35]} />
    case 'service':
      return <boxGeometry args={[2, 2, 2]} />
    case 'api':
      return <boxGeometry args={[3, 1.4, 1.2]} />
    case 'component':
    case 'cache':
    case 'external':
      return <boxGeometry args={[1, 1, 1]} />
    case 'database':
      return <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />
    case 'queue':
      return <torusGeometry args={[0.8, 0.3, 16, 32]} />
  }
}

function TypeIcon({ type }: { type: ArchNode['type'] }) {
  switch (type) {
    case 'database':
      return (
        <group>
          <cylinderGeometry args={[0.95, 0.95, 1.4, 48]} />
        </group>
      )
    default:
      return null
  }
}

function NodeShape({ node, isSelected }: { node: ArchNode; isSelected: boolean }) {
  const commonMaterial = (
    <meshStandardMaterial
      color={node.color}
      emissive={isSelected ? node.color : '#000000'}
      emissiveIntensity={isSelected ? 0.45 : 0.08}
      roughness={0.3}
      metalness={0.2}
      transparent={node.type === 'domain'}
      opacity={node.type === 'domain' ? 0.26 : 0.95}
    />
  )

  if (node.type === 'service') {
    return (
      <RoundedBox args={[2.5, 1.7, 2.1]} radius={0.18} smoothness={4}>
        {commonMaterial}
        <Edges color={isSelected ? '#ffffff' : '#d8b4fe'} />
      </RoundedBox>
    )
  }

  if (node.type === 'database') {
    return (
      <group>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 1.7, 48]} />
          {commonMaterial}
        </mesh>
        <mesh position={[0, 0, 0.88]}>
          <torusGeometry args={[0.95, 0.05, 8, 48]} />
          <meshStandardMaterial color="#d1fae5" emissive="#10b981" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.18]}>
          <torusGeometry args={[0.95, 0.04, 8, 48]} />
          <meshStandardMaterial color="#6ee7b7" emissive="#10b981" emissiveIntensity={0.2} />
        </mesh>
      </group>
    )
  }

  if (node.type === 'queue') {
    return (
      <group>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.05, 0.25, 18, 48]} />
          {commonMaterial}
        </mesh>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.45, 1.1]} />
          <meshStandardMaterial color="#fed7aa" emissive="#f59e0b" emissiveIntensity={0.22} />
        </mesh>
      </group>
    )
  }

  if (node.type === 'domain') {
    return (
      <mesh receiveShadow>
        <NodeGeometry type={node.type} />
        {commonMaterial}
        <Edges color={isSelected ? '#ffffff' : node.color} />
      </mesh>
    )
  }

  return (
    <mesh castShadow receiveShadow>
      <NodeGeometry type={node.type} />
      <TypeIcon type={node.type} />
      {commonMaterial}
      <Edges color={isSelected ? '#ffffff' : '#bae6fd'} />
    </mesh>
  )
}

export function Node3D({ node, isSelected, onClick, onDoubleClick }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef<Group>(null)
  const labelOffset = useMemo(() => getLabelOffset(node.type), [node.type])
  
  const setDraggedNodeId = useGraphStore((state) => state.setDraggedNodeId)
  const moveNodeRelative = useGraphStore((state) => state.moveNodeRelative)
  const moveNodeLayer = useGraphStore((state) => state.moveNodeLayer)
  const viewMode = useGraphStore((state) => state.viewMode)
  const toolMode = useGraphStore((state) => state.toolMode)
  const pendingConnectionSourceId = useGraphStore((state) => state.pendingConnectionSourceId)

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return
    }

    const targetScale = isHovered ? 1.2 : 1
    const nextScale = groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * Math.min(delta * 10, 1)
    groupRef.current.scale.setScalar(nextScale)
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onClick(node.id)
  }

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onClick(node.id)

    if (toolMode === 'connect') {
      return
    }

    setDraggedNodeId(node.id)
    document.body.style.cursor = 'grabbing'
  }

  const handleDoubleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onDoubleClick(node.id)
  }

  return (
    <group
      ref={groupRef}
      position={[node.position.x, node.position.y, node.position.z]}
      scale={0.001}
    >
      <group
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerEnter={(event) => {
          event.stopPropagation()
          setIsHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setIsHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <NodeShape node={node} isSelected={isSelected || pendingConnectionSourceId === node.id} />
      </group>

      <Text
        position={[0, labelOffset, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#0f172a"
      >
        {node.label}
      </Text>
      
      <Html position={[0, labelOffset + 0.62, 0]} center distanceFactor={13}>
        <div className={`node-chip node-chip-${node.type}`}>
          <span>{node.type}</span>
        </div>
      </Html>

      {isSelected && viewMode === 'layers3d' ? (
        <Html position={[0, labelOffset + 1.35, 0]} center distanceFactor={13}>
          <div className="pointer-events-auto flex flex-col items-center gap-1 p-1 rounded-lg border border-cyan-400/20 bg-slate-950/85 shadow-2xl backdrop-blur-md select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-1">
              <button
                className="grid h-6 w-6 place-items-center rounded bg-slate-900/60 border border-white/5 hover:border-cyan-400/40 text-slate-300 hover:text-white hover:bg-cyan-500/25 transition active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  moveNodeLayer(node.id, 'front')
                }}
                title="Move layer front"
                type="button"
              >
                <ChevronsUp size={13} />
              </button>

              <button
                className="grid h-6 w-6 place-items-center rounded bg-slate-900/60 border border-white/5 hover:border-cyan-400/40 text-slate-300 hover:text-white hover:bg-cyan-500/25 transition active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  moveNodeRelative(node.id, 0, 2)
                }}
                title="Move Up"
                type="button"
              >
                <ArrowUp size={13} />
              </button>

              <button
                className="grid h-6 w-6 place-items-center rounded bg-slate-900/60 border border-white/5 hover:border-cyan-400/40 text-slate-300 hover:text-white hover:bg-cyan-500/25 transition active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  moveNodeLayer(node.id, 'behind')
                }}
                title="Move layer behind"
                type="button"
              >
                <ChevronsDown size={13} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="grid h-6 w-6 place-items-center rounded bg-slate-900/60 border border-white/5 hover:border-cyan-400/40 text-slate-300 hover:text-white hover:bg-cyan-500/25 transition active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  moveNodeRelative(node.id, -2, 0)
                }}
                title="Move Left"
                type="button"
              >
                <ArrowLeft size={13} />
              </button>

              <button
                className="grid h-6 w-6 place-items-center rounded bg-slate-900/60 border border-white/5 hover:border-cyan-400/40 text-slate-300 hover:text-white hover:bg-cyan-500/25 transition active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  moveNodeRelative(node.id, 0, -2)
                }}
                title="Move Down"
                type="button"
              >
                <ArrowDown size={13} />
              </button>

              <button
                className="grid h-6 w-6 place-items-center rounded bg-slate-900/60 border border-white/5 hover:border-cyan-400/40 text-slate-300 hover:text-white hover:bg-cyan-500/25 transition active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  moveNodeRelative(node.id, 2, 0)
                }}
                title="Move Right"
                type="button"
              >
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </Html>
      ) : null}
    </group>
  )
}
