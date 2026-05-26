import { Canvas3D } from '@/components/Canvas3D'
import { CanvasDropTarget } from '@/components/CanvasDropTarget'
import { CrossLayerHints } from '@/components/CrossLayerHints'
import { EditorOverlay } from '@/components/EditorOverlay'
import { GraphRenderer } from '@/components/GraphRenderer'
import { LayerPlanes } from '@/components/LayerPlanes'
import { SceneManager } from '@/components/SceneManager'

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <EditorOverlay />
      <Canvas3D>
        <SceneManager />
        <CanvasDropTarget />
        <LayerPlanes />
        <CrossLayerHints />
        <GraphRenderer />
      </Canvas3D>
    </div>
  )
}

export default App
