import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { Plane, Raycaster, Vector2, Vector3 } from 'three'
import { useGraphStore } from '@/stores/graphStore'
import type { NodeType, Vector3D } from '@/types/graph'

function isNodeType(value: string | null): value is NodeType {
  return (
    value === 'domain' ||
    value === 'service' ||
    value === 'component' ||
    value === 'database' ||
    value === 'queue' ||
    value === 'api' ||
    value === 'cache' ||
    value === 'external'
  )
}

export function CanvasDropTarget() {
  const { camera, gl } = useThree()
  const addNode = useGraphStore((state) => state.addNode)
  const activeLayer = useGraphStore((state) => state.getActiveLayer())

  useEffect(() => {
    const element = gl.domElement
    const raycaster = new Raycaster()
    const pointer = new Vector2()
    const hit = new Vector3()
    const dropPlane = new Plane(new Vector3(0, 0, 1), -activeLayer.z)

    const getDropPosition = (event: DragEvent): Vector3D | null => {
      const rect = element.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      const intersection = raycaster.ray.intersectPlane(dropPlane, hit)

      if (!intersection) {
        return null
      }

      return {
        x: Number(intersection.x.toFixed(2)),
        y: Number(intersection.y.toFixed(2)),
        z: activeLayer.z,
      }
    }

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
    }

    const handleDrop = (event: DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer?.getData('application/x-archsphere-node') ?? null

      if (!isNodeType(type)) {
        return
      }

      const position = getDropPosition(event)

      if (position) {
        addNode(type, position)
      }
    }

    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)

    return () => {
      element.removeEventListener('dragover', handleDragOver)
      element.removeEventListener('drop', handleDrop)
    }
  }, [activeLayer.z, addNode, camera, gl])

  return null
}
