import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Plane, Vector3 } from 'three'
import { useGraphStore } from '@/stores/graphStore'

export function GlobalDragHandler() {
  const draggedNodeId = useGraphStore((state) => state.draggedNodeId)
  const updateNodePosition = useGraphStore((state) => state.updateNodePosition)
  const setDraggedNodeId = useGraphStore((state) => state.setDraggedNodeId)
  const getNodeById = useGraphStore((state) => state.getNodeById)

  const { raycaster } = useThree()
  const dragPoint = useRef(new Vector3())

  useFrame(() => {
    if (!draggedNodeId) {
      return
    }

    const node = getNodeById(draggedNodeId)
    if (!node) {
      return
    }

    // Define a plane parallel to the layer slice plane at the node's Z depth
    const dragPlane = new Plane(new Vector3(0, 0, 1), -node.position.z)
    const hit = raycaster.ray.intersectPlane(dragPlane, dragPoint.current)

    if (hit) {
      updateNodePosition(draggedNodeId, {
        x: Number(hit.x.toFixed(2)),
        y: Number(hit.y.toFixed(2)),
        z: node.position.z,
      })
    }
  })

  // Safely intercept mouse up on window level to release dragging
  useEffect(() => {
    if (!draggedNodeId) {
      return undefined
    }

    const handlePointerUp = () => {
      setDraggedNodeId(null)
      document.body.style.cursor = 'default'
    }

    window.addEventListener('pointerup', handlePointerUp)
    return () => window.removeEventListener('pointerup', handlePointerUp)
  }, [draggedNodeId, setDraggedNodeId])

  return null
}
