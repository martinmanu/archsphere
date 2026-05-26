import { Line } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import { edgeColors } from '@/constants/colors'
import type { ArchEdge, ArchNode } from '@/types/graph'

interface Props {
  edge: ArchEdge
  sourceNode: ArchNode
  targetNode: ArchNode
  isSelected: boolean
  onClick: (id: string) => void
}

export function Edge3D({ edge, sourceNode, targetNode, isSelected, onClick }: Props) {
  const sourcePos: [number, number, number] = [
    sourceNode.position.x,
    sourceNode.position.y,
    sourceNode.position.z,
  ]
  const targetPos: [number, number, number] = [
    targetNode.position.x,
    targetNode.position.y,
    targetNode.position.z,
  ]
  const points =
    sourceNode.position.z === targetNode.position.z
      ? [sourcePos, targetPos]
      : [
          sourcePos,
          [sourceNode.position.x, sourceNode.position.y, targetNode.position.z] as [number, number, number],
          targetPos,
        ]
  const isDashed = edge.type !== 'http'
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onClick(edge.id)
  }

  return (
    <Line
      points={points}
      color={isSelected ? '#ffffff' : edgeColors[edge.type]}
      lineWidth={isSelected ? 4 : 2.5}
      dashed={isDashed}
      dashSize={0.7}
      gapSize={0.35}
      transparent
      opacity={isSelected ? 1 : 0.9}
      onClick={handleClick}
    />
  )
}
