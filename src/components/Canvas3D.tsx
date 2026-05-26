import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

export function Canvas3D({ children }: Props) {
  return (
    <Canvas
      className="h-screen w-screen"
      camera={{ position: [0, 0, 70], fov: 45, near: 0.1, far: 200 }}
      shadows
      style={{ background: '#07111f' }}
    >
      {children}
    </Canvas>
  )
}
