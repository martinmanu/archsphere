# ArchSphere Quick-Start Guide

## Day 1: Get Something Working (2-4 hours)

### Prerequisites

- Node.js 18+ installed
- VS Code with Cursor AI / Windsurf, OR GitHub Copilot
- Basic familiarity with React + TypeScript

---

## Step 1: Project Initialization (30 mins)

### Use this exact prompt in Cursor:

```
Create a new Vite + React + TypeScript project called "archsphere" with:

Dependencies:
- react@18.2.0, react-dom@18.2.0
- typescript@5.0.0
- @react-three/fiber@8.15.0
- @react-three/drei@9.96.0
- three@0.160.0
- zustand@4.5.0
- @radix-ui/react-dialog@1.0.5
- lucide-react@0.344.0

Dev dependencies:
- vite@5.0.0
- @vitejs/plugin-react@4.2.0
- @types/react@18.2.0
- @types/three@0.160.0
- tailwindcss@3.4.0
- autoprefixer@10.4.0
- postcss@8.4.0
- eslint + prettier with recommended configs

Initialize Tailwind CSS and create this project structure:
/src
  /components
    Canvas3D.tsx
    SceneManager.tsx
  /stores
    graphStore.ts
  /types
    graph.ts
  App.tsx
  main.tsx

Configure:
- tsconfig.json with strict mode
- tailwind.config.js with dark mode
- vite.config.ts with alias @/ for src/

Generate package.json with these exact versions.
Initialize git repository.
```

**Expected output:** Working Vite project that runs with `npm run dev`

**Verify:** 
```bash
npm install
npm run dev
```
Should open localhost:5173 with React logo.

---

## Step 2: Create Type Definitions (15 mins)

### Paste this into `src/types/graph.ts`:

```typescript
export type NodeType = 'domain' | 'service' | 'component' | 'database' | 'queue';
export type EdgeType = 'http' | 'grpc' | 'kafka' | 'database';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface ArchNode {
  id: string;
  type: NodeType;
  label: string;
  position: Vector3D;
  color: string;
  parentId?: string;
  children?: string[];
  metadata?: {
    owner?: string;
    techStack?: string[];
    repository?: string;
    description?: string;
    [key: string]: any;
  };
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  metadata?: Record<string, any>;
}

export interface GraphData {
  version: string;
  metadata: {
    name: string;
    organization?: string;
    lastUpdated: string;
  };
  nodes: ArchNode[];
  edges: ArchEdge[];
}
```

No AI needed - just copy-paste this.

---

## Step 3: Sample Data (15 mins)

### Create `src/data/sampleGraph.ts`:

```typescript
import { GraphData } from '../types/graph';

export const sampleGraph: GraphData = {
  version: '1.0',
  metadata: {
    name: 'Sample E-Commerce Architecture',
    organization: 'Demo Corp',
    lastUpdated: new Date().toISOString(),
  },
  nodes: [
    {
      id: 'domain-frontend',
      type: 'domain',
      label: 'Frontend',
      position: { x: -15, y: 0, z: 0 },
      color: '#3b82f6',
      children: ['svc-web-app'],
      metadata: {
        description: 'User-facing applications'
      }
    },
    {
      id: 'svc-web-app',
      type: 'service',
      label: 'Web App',
      position: { x: -15, y: 5, z: 0 },
      color: '#60a5fa',
      parentId: 'domain-frontend',
      children: ['comp-auth-client'],
      metadata: {
        techStack: ['React', 'TypeScript', 'Vite'],
        owner: 'frontend-team',
        repository: 'https://github.com/demo/web-app'
      }
    },
    {
      id: 'comp-auth-client',
      type: 'component',
      label: 'Auth Client',
      position: { x: -15, y: 8, z: 0 },
      color: '#93c5fd',
      parentId: 'svc-web-app',
      metadata: {
        description: 'Handles authentication flow'
      }
    },
    {
      id: 'domain-backend',
      type: 'domain',
      label: 'Backend',
      position: { x: 0, y: 0, z: 0 },
      color: '#8b5cf6',
      children: ['svc-auth', 'svc-api'],
      metadata: {
        description: 'Core business logic services'
      }
    },
    {
      id: 'svc-auth',
      type: 'service',
      label: 'Auth Service',
      position: { x: -5, y: 5, z: 0 },
      color: '#a78bfa',
      parentId: 'domain-backend',
      children: ['db-users'],
      metadata: {
        techStack: ['Node.js', 'Express', 'JWT'],
        owner: 'backend-team'
      }
    },
    {
      id: 'db-users',
      type: 'database',
      label: 'Users DB',
      position: { x: -5, y: 8, z: 0 },
      color: '#10b981',
      parentId: 'svc-auth',
      metadata: {
        type: 'PostgreSQL',
        version: '15.2'
      }
    },
    {
      id: 'svc-api',
      type: 'service',
      label: 'API Gateway',
      position: { x: 5, y: 5, z: 0 },
      color: '#a78bfa',
      parentId: 'domain-backend',
      metadata: {
        techStack: ['Go', 'GraphQL'],
        owner: 'platform-team'
      }
    },
    {
      id: 'domain-data',
      type: 'domain',
      label: 'Data Layer',
      position: { x: 15, y: 0, z: 0 },
      color: '#10b981',
      children: ['svc-analytics'],
      metadata: {
        description: 'Data processing and analytics'
      }
    },
    {
      id: 'svc-analytics',
      type: 'service',
      label: 'Analytics Service',
      position: { x: 15, y: 5, z: 0 },
      color: '#34d399',
      parentId: 'domain-data',
      children: ['queue-events'],
      metadata: {
        techStack: ['Python', 'Pandas', 'Spark'],
        owner: 'data-team'
      }
    },
    {
      id: 'queue-events',
      type: 'queue',
      label: 'Event Queue',
      position: { x: 15, y: 8, z: 0 },
      color: '#f59e0b',
      parentId: 'svc-analytics',
      metadata: {
        type: 'Kafka',
        topics: ['user-events', 'system-events']
      }
    }
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'comp-auth-client',
      target: 'svc-auth',
      type: 'http',
      label: 'POST /auth/login'
    },
    {
      id: 'edge-2',
      source: 'svc-auth',
      target: 'db-users',
      type: 'database',
      label: 'User queries'
    },
    {
      id: 'edge-3',
      source: 'svc-web-app',
      target: 'svc-api',
      type: 'http',
      label: 'GraphQL queries'
    },
    {
      id: 'edge-4',
      source: 'svc-api',
      target: 'queue-events',
      type: 'kafka',
      label: 'Publish events'
    },
    {
      id: 'edge-5',
      source: 'queue-events',
      target: 'svc-analytics',
      type: 'kafka',
      label: 'Consume events'
    }
  ]
};
```

---

## Step 4: Zustand Store (20 mins)

### Prompt for Cursor:

```
Create a Zustand store in src/stores/graphStore.ts that:

State:
- nodes: Map<string, ArchNode> (from sample data)
- edges: Map<string, ArchEdge>
- selectedNodeId: string | null
- expandedNodeIds: Set<string> (nodes with visible children)
- visibleNodeIds: Set<string> (currently rendered nodes)

Actions:
- loadGraph(data: GraphData): void - Load from JSON
- selectNode(id: string | null): void
- toggleNodeExpansion(id: string): void - Show/hide children
- getVisibleNodes(): ArchNode[] - Return only nodes that should render
- getNodeById(id: string): ArchNode | undefined

Initial state should load sampleGraph from src/data/sampleGraph.ts
Initially, only show nodes with type='domain' (root level)

Use TypeScript with proper types from src/types/graph.ts
```

**Verify:** 
```tsx
// In App.tsx, test the store
import { useGraphStore } from './stores/graphStore';

function App() {
  const nodes = useGraphStore(state => state.getVisibleNodes());
  console.log('Visible nodes:', nodes);
  return <div>Check console</div>;
}
```

Should log 3 domain nodes.

---

## Step 5: 3D Scene Setup (30 mins)

### Prompt for Cursor:

```
Create src/components/Canvas3D.tsx:

A full-screen R3F Canvas component with:
- Dark background (#0f172a)
- Perspective camera at position [0, 10, 30], fov 50
- OrbitControls from drei (enable damping)
- Ambient light (intensity 0.6)
- Directional light at [10, 10, 10] (intensity 0.8, cast shadows)

Props: { children?: ReactNode }

Styling: Use Tailwind class "w-screen h-screen"

---

Create src/components/SceneManager.tsx:

Renders lights, camera controls, and a ground plane.
Ground plane: 
- PlaneGeometry 100x100, rotated -90deg on X axis
- MeshStandardMaterial color #1e293b, receives shadows
- Position at y=-1

No props needed, just sets up the scene environment.

---

Update src/App.tsx:

Import Canvas3D and SceneManager
Render:
<Canvas3D>
  <SceneManager />
</Canvas3D>

Should see dark scene with grid plane when you run dev server.
```

**Verify:** Run `npm run dev`, should see dark 3D scene with orbit controls working.

---

## Step 6: Render Nodes (45 mins)

### Prompt for Cursor:

```
Create src/components/Node3D.tsx:

Props:
- node: ArchNode
- isSelected: boolean
- onClick: (id: string) => void

Rendering logic based on node.type:
- 'domain': <Sphere args={[3, 32, 32]} />
- 'service': <Box args={[2, 2, 2]} />
- 'component': <Box args={[1, 1, 1]} />
- 'database': <Cylinder args={[0.8, 0.8, 1.5, 32]} />
- 'queue': <Torus args={[0.8, 0.3, 16, 32]} />

Material:
- MeshStandardMaterial with color from node.color
- If isSelected, add emissive property with same color at 0.3 intensity
- If hovered, scale up to 1.2x (use useState for hover)

Position mesh at node.position (x, y, z)

Add Text from @react-three/drei above the node:
- Position at [0, geometryHeight + 1, 0] relative to node
- fontSize 0.5
- color white
- anchorX center
- Shows node.label

Handle click with raycasting (mesh onClick event)

---

Create src/components/GraphRenderer.tsx:

Component that:
- Gets visible nodes from graphStore
- Gets selected node ID from graphStore
- Maps over nodes and renders <Node3D> for each
- Passes onClick handler that calls graphStore.selectNode(id)

Use useGraphStore hook to access state.

---

Update App.tsx to render GraphRenderer inside Canvas3D:

<Canvas3D>
  <SceneManager />
  <GraphRenderer />
</Canvas3D>
```

**Verify:** Should see 3 colored spheres (domains) with labels. Clicking a sphere should make it glow slightly (emissive).

---

## Step 7: Node Expansion (30 mins)

### Prompt for Cursor:

```
Update src/stores/graphStore.ts:

Modify getVisibleNodes() logic:
- Start with root nodes (no parentId)
- For each node in expandedNodeIds Set, include its children
- Recursively include children of expanded children

Add helper method:
- getNodeChildren(nodeId: string): ArchNode[] - Returns child nodes

---

Update src/components/Node3D.tsx:

Add double-click handler:
- onDoubleClick prop: (id: string) => void
- On double-click, call this function with node.id

---

Update src/components/GraphRenderer.tsx:

Add onDoubleClick handler that calls graphStore.toggleNodeExpansion(id)

When a node expands, animate children appearing:
- Use useSpring from @react-spring/three
- Animate scale from 0 to 1 over 0.3s
- Animate position from parent position to target position
```

**Verify:** 
1. See 3 domains initially
2. Double-click "Frontend" domain → "Web App" service appears
3. Double-click "Web App" → "Auth Client" component appears
4. Should animate smoothly

---

## Step 8: Edge Rendering (20 mins)

### Prompt for Cursor:

```
Create src/components/Edge3D.tsx:

Props:
- edge: ArchEdge
- sourceNode: ArchNode
- targetNode: ArchNode

Render a line from source to target:
- Use Line from @react-three/drei
- points: [sourceNode.position as Vector3, targetNode.position as Vector3]
- color based on edge.type:
  - 'http': '#60a5fa' (blue)
  - 'grpc': '#a78bfa' (purple)
  - 'kafka': '#f59e0b' (orange)
  - 'database': '#10b981' (green)
- lineWidth: 2

Add arrow at midpoint pointing toward target (optional for v1)

---

Update src/components/GraphRenderer.tsx:

After rendering nodes, map over edges:
- Filter edges where both source and target are in visibleNodeIds
- Render <Edge3D> for each with source/target nodes looked up from store
```

**Verify:** Should see colored lines connecting nodes when you expand them.

---

## Testing Your Day 1 Build

### Checklist:

- [ ] `npm run dev` works without errors
- [ ] See 3 domain spheres with labels
- [ ] Can orbit camera around scene
- [ ] Clicking a node makes it glow
- [ ] Double-clicking Frontend domain reveals Web App service
- [ ] Double-clicking Web App reveals Auth Client component
- [ ] See colored line from Auth Client to Auth Service (if expanded)
- [ ] No console errors

### If something broke:

**Common issues:**
1. **Three.js objects not disposing:** Check for `useEffect` cleanup
2. **TypeScript errors:** Make sure all types are imported correctly
3. **Nothing renders:** Check Canvas3D is actually in the DOM
4. **Animations janky:** Reduce node count or disable shadows

---

## What You Have Now

✅ Working 3D scene with orbit controls  
✅ Hierarchical graph data structure  
✅ Click to select nodes  
✅ Double-click to expand/collapse hierarchy  
✅ Colored edges between nodes  
✅ Smooth animations  
✅ Type-safe TypeScript codebase  

**You've built the core MVP in one day!**

---

## Next Steps (Day 2+)

### Day 2: Detail Panel (4 hours)

Use this prompt:

```
Add a detail panel that slides in from the right when a node is selected.

Use Radix UI Dialog component with:
- Open when selectedNodeId is not null
- Slide-in animation from right
- Width 400px
- Dark theme matching canvas background

Panel content:
- Node name (h2)
- Node type badge (colored pill)
- Metadata display (owner, tech stack, etc.)
- List of dependencies (inbound + outbound edges)
- Close button

When clicking a dependency, select that node in 3D view.
```

### Day 3: Search & Filters (3 hours)

### Day 4: Visual Polish (4 hours)

### Day 5: Import/Export (3 hours)

---

## Resources

**Three.js Learning:**
- https://threejs.org/manual/#en/fundamentals
- https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

**Example Projects:**
- https://github.com/pmndrs/drei-vanilla (Three.js examples)
- https://codesandbox.io/examples/package/@react-three/fiber

**Debugging:**
- Chrome DevTools > Performance tab
- React DevTools > Profiler
- drei `<Stats />` component for FPS monitoring

---

## Success Metrics for Day 1

**If you can answer YES to these:**

1. Can you see nodes in 3D space? → **Core rendering works**
2. Can you click nodes? → **Interaction works**
3. Can you expand nodes? → **Hierarchy works**
4. Do animations feel smooth? → **Performance is OK**

**Then you're ready to continue to Day 2.**

If NO to any of these, debug that specific area before moving forward.

---

## Emergency Debugging

### Nothing shows up

```bash
# Check console for errors
console.log in GraphRenderer to verify nodes array has data
console.log in Node3D render to verify it's being called
```

### TypeScript errors everywhere

```bash
# Relax strictness temporarily
# In tsconfig.json, set "strict": false
# Fix incrementally later
```

### Performance terrible

```bash
# Reduce node count
# In sampleGraph.ts, comment out some nodes
# Or disable shadows in SceneManager
```

### AI agent confused

```
Clear, specific prompt format:
"In file X, modify function Y to do Z.
Current code: [paste code]
Expected behavior: [describe]
Return only the modified function, not the whole file."
```

---

## Final Note

**Day 1 goal:** Working prototype you can demo to someone.

**NOT perfect code.** NOT production-ready. Just **working and explorable.**

You can refactor, optimize, and polish later. First, get something you can click around in and show "this is the concept."

**Time estimate:** 2-4 hours with AI assistance, assuming no major blockers.

**Realistic outcome:** By end of Day 1, you have a 3D scene where you can navigate hierarchical architecture. That's enough to validate the core UX and decide if this is worth building further.

**Good luck! 🚀**
