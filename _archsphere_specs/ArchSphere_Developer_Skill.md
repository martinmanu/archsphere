# ArchSphere - Developer Skill Manual

This file serves as a **Skill File** for AI coding agents and human developers working on the ArchSphere codebase. It outlines the core architecture, state model, rendering pipeline, interaction patterns, and code conventions to enable rapid and safe feature implementation.

---

## 1. System Architecture & Tech Stack

ArchSphere is a 3D layered visualization platform for exploring hierarchical systems.
- **Frontend Framework**: React 18 (TypeScript) + Vite
- **3D Graphics**: Three.js via `@react-three/fiber` (R3F) and `@react-three/drei`
- **State Management**: Zustand
- **Styling**: Tailwind CSS + Vanilla CSS (`src/index.css`)
- **Icons**: `lucide-react`

---

## 2. Key Directories & Components

- `src/types/graph.ts` — Core TypeScript interfaces (nodes, edges, layers, vectors).
- `src/stores/graphStore.ts` — Zustand store managing state for the graph, layers, and viewport options.
- `src/components/Canvas3D.tsx` — Full-screen Three.js Canvas with fog and shadows.
- `src/components/SceneManager.tsx` — Setup for lights, camera, OrbitControls, and custom Keyboard Swim controls.
- `src/components/LayerPlanes.tsx` — Renders visual guides for layers (2D grid or 3D transparent cube).
- `src/components/CrossLayerHints.tsx` — Draws dashed portals/hints indicating connections between the active and inactive layers in 2D mode.
- `src/components/Node3D.tsx` — Renders 3D meshes for different node types with pointer hover scaling, drag-and-drop repositioning, selection glow, and double-click hierarchy toggle.
- `src/components/Edge3D.tsx` — Renders HTTP/gRPC/Kafka/Database lines between nodes.
- `src/components/CanvasDropTarget.tsx` — Translates screen-space drag-and-drop coordinates to 3D positions on the active layer using raycasting.
- `src/components/EditorOverlay.tsx` — The UI control panel containing the toolbox, view toggles, layer list, and detailed property panel.

---

## 3. Zustand State & Actions Reference (`graphStore.ts`)

### State Schema
- `nodes: Map<string, ArchNode>`: Map of all node IDs to nodes.
- `edges: Map<string, ArchEdge>`: Map of all edge IDs to edges.
- `layers: Map<string, LayerPlane>`: Layer specifications (z-index, visibility, active status).
- `selectedNodeId: string | null` / `selectedEdgeId: string | null`: Selected elements.
- `pendingConnectionSourceId: string | null`: Used in the 'connect' tool mode.
- `viewMode: 'diagram2d' | 'layers3d'`: Toggles 2D single-layer vs. 3D transparent cube view.
- `toolMode: 'select' | 'connect' | 'pan'`: Toggles active pointer tools.
- `activeLayerId: string`: Current layer being edited.
- `expandedNodeIds: Set<string>` / `visibleNodeIds: Set<string>`: Set of nodes whose children are visible, and nodes currently rendered.

### Core Helper Methods
- `getVisibleNodes()`: Returns nodes that should be rendered based on layer visibility and parent expansion.
- `getVisibleEdges()`: Returns edges whose source and target are both visible.
- `getNodeChildren(nodeId)`: Returns children of a specific node.

### Core Mutators
- `addNode(type, position)`: Adds a node of a given type at a 3D coordinate on the active layer.
- `updateNodePosition(id, position)`: Updates the coordinates of a node.
- `addEdge(source, target, type, label)`: Connects two nodes.
- `toggleNodeExpansion(id)`: Toggles showing/hiding children of a node.

---

## 4. 3D Interaction Rules & Calculations

### Drag-and-Drop Drop Target (`CanvasDropTarget.tsx`)
To drop a node from the 2D palette into the 3D scene:
1. Capture the drop event client coordinates `clientX` and `clientY`.
2. Convert coordinates to normalized device coordinates (NDC) from `-1` to `1`.
3. Cast a ray using Three.js `Raycaster` from the perspective camera through the NDC point.
4. Calculate the intersection with a horizontal plane at `z = activeLayer.z`:
   $$\text{Intersection} = \vec{r}_{\text{origin}} + t \cdot \vec{r}_{\text{direction}} \quad \text{where} \quad z_{\text{intersection}} = z_{\text{layer}}$$
5. Round the coordinates (`x.toFixed(2)`) and trigger `addNode(type, position)`.

### Interactive Drag-to-Move (`Node3D.tsx`)
To drag a node in 3D:
1. On `onPointerDown`, set pointer capture and set `isDragging = true`.
2. Maintain a `Plane` mathematical object parallel to the layer slice (`z = node.position.z`).
3. On `onPointerMove`, cast a ray from the camera, intersect with the mathematical plane, and update the node position via `updateNodePosition(id, hit)`.
4. On `pointerup`, release pointer capture and set `isDragging = false`.

### Keyboard Swim Controls (`SceneManager.tsx`)
In `layers3d` view mode and `pan` tool mode, the developer can "swim" through the system using keyboard keys:
- **W / ArrowUp**: Move camera forward (`getWorldDirection`).
- **S / ArrowDown**: Move camera backward.
- **A / ArrowLeft**: Move camera left (cross-product of forward vector and camera up).
- **D / ArrowRight**: Move camera right.
- **Space**: Ascend (move camera up along global Y axis).
- **C / ControlLeft**: Descend (move camera down).
- **Shift (Left/Right)**: Double movement speed (24 units/sec instead of 12).

---

## 5. Development Guidelines & How-To Recipes

### How to Add a New Node Type
1. Add the type name to `NodeType` union in `src/types/graph.ts`.
2. Define default properties (label, color, parent) in `nodeDefaults` in `src/stores/graphStore.ts`.
3. Add details and an icon to the palette list in `src/components/EditorOverlay.tsx`.
4. In `src/components/Node3D.tsx`:
   - Specify the 3D geometry in `NodeGeometry`.
   - Implement custom visual elements inside `NodeShape` (e.g. composite shapes, outline edges).
   - Define custom label offset in `getLabelOffset`.
5. Add custom CSS styles for the chip component in `src/index.css` (e.g. `.palette-icon-[type]`, `.node-chip-[type]`).

### How to Implement Custom Shaders (GLSL)
For glowing nodes or animated dash flows:
1. Define your shader constants or load `.glsl` files using Vite GLSL plugins.
2. Replace standard materials with `shaderMaterial` using `@react-three/drei`'s `shaderMaterial` helper or a raw `<shaderMaterial />`.
3. Pass `uTime` or `uColor` uniforms and update them using R3F's `useFrame` loop.

### Performance Optimization Guidelines
1. **Disposal**: Always let R3F dispose of standard geometries and materials automatically. For custom Three.js objects inside refs, always dispose them manually on component unmount to prevent WebGL context memory leaks.
2. **Re-renders**: Selectors should target primitive values or memoized structures. Avoid grabbing the entire Zustand state object inside 3D mesh components. Use narrow selectors (e.g., `useGraphStore(state => state.viewMode)`).
3. **Instanced Meshes**: If node count exceeds 200, group static node representations under a single `instancedMesh` for optimized draw calls.
