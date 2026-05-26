import { OrbitControls, Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useGraphStore } from '@/stores/graphStore'

const pressedKeys = new Set<string>()

function SwimControls() {
  const { camera } = useThree()
  const viewMode = useGraphStore((state) => state.viewMode)
  const toolMode = useGraphStore((state) => state.toolMode)
  const isDraggingNode = useGraphStore((state) => state.isDraggingNode)
  const forward = useRef(new Vector3())
  const right = useRef(new Vector3())
  const up = useRef(new Vector3(0, 1, 0))

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.code)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.code)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      pressedKeys.clear()
    }
  }, [])

  useFrame((_, delta) => {
    if (viewMode !== 'layers3d' || toolMode !== 'pan' || isDraggingNode) {
      return
    }

    const speed = pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight') ? 24 : 12
    const movement = new Vector3()

    camera.getWorldDirection(forward.current)
    right.current.crossVectors(forward.current, camera.up).normalize()

    if (pressedKeys.has('KeyW') || pressedKeys.has('ArrowUp')) movement.add(forward.current)
    if (pressedKeys.has('KeyS') || pressedKeys.has('ArrowDown')) movement.sub(forward.current)
    if (pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight')) movement.add(right.current)
    if (pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft')) movement.sub(right.current)
    if (pressedKeys.has('Space')) movement.add(up.current)
    if (pressedKeys.has('KeyC') || pressedKeys.has('ControlLeft')) movement.sub(up.current)

    if (movement.lengthSq() === 0) {
      return
    }

    movement.normalize().multiplyScalar(speed * delta)
    camera.position.add(movement)
  })

  return null
}

function CameraRig() {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const viewMode = useGraphStore((state) => state.viewMode)
  const toolMode = useGraphStore((state) => state.toolMode)
  const activeLayer = useGraphStore((state) => state.getActiveLayer())
  const isDraggingNode = useGraphStore((state) => state.isDraggingNode)

  useEffect(() => {
    if (viewMode === 'diagram2d') {
      camera.position.set(0, 0, activeLayer.z + 70)
      camera.up.set(0, 1, 0)
      camera.lookAt(0, 0, activeLayer.z)
    } else {
      camera.position.set(32, -36, activeLayer.z + 36)
      camera.up.set(0, 1, 0)
      camera.lookAt(0, 0, activeLayer.z)
    }

    controlsRef.current?.target.set(0, 0, activeLayer.z)
    controlsRef.current?.update()
  }, [activeLayer.z, camera, viewMode])

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isDraggingNode && !(viewMode === 'layers3d' && toolMode === 'pan')}
      enableDamping
      dampingFactor={0.05}
      enableRotate={viewMode === 'layers3d'}
      enablePan
      screenSpacePanning
      minDistance={10}
      maxDistance={120}
    />
  )
}

export function SceneManager() {
  return (
    <>
      <color attach="background" args={['#07111f']} />
      <fog attach="fog" args={['#07111f', 75, 150]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[15, 20, 12]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-18, 12, -12]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[18, 10, 10]} intensity={0.6} color="#a78bfa" />

      <CameraRig />
      <SwimControls />
      <Stars radius={80} depth={30} count={1200} factor={3} saturation={0} fade speed={0.2} />
    </>
  )
}
