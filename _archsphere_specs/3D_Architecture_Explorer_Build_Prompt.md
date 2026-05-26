# 3D Architecture Explorer - Complete Build Specification

## Product Vision

**Name:** ArchSphere (working title)

**Tagline:** "Navigate your distributed architecture like exploring a universe"

**Core Problem:** Modern distributed systems with 50+ microservices become impossible to understand through traditional 2D diagrams. Engineers spend hours tracing dependencies, onboarding takes weeks, and architectural decisions are made without full system context.

**Solution:** An immersive 3D spatial environment where system architects can explore software architecture hierarchically - zooming from high-level domains down to individual service internals, revealing dependencies, data flows, and technical details on demand.

---

## Product Requirements

### MVP Features (v0.1.0)

**1. 3D Canvas & Navigation**
- WebGL-based 3D rendering environment
- Smooth camera controls (orbit, pan, zoom, fly-through)
- Spatial clustering of related services
- Minimap/overview mode for orientation

**2. Node Hierarchy System**
- Root level: Architecture domains (Frontend, Backend, Data, Infrastructure)
- Level 2: Services/Microservices
- Level 3: Internal components (APIs, message queues, databases, caches)
- Level 4: Technical details (endpoints, schemas, configurations)

**3. Interactive Exploration**
- Click node → reveal internal architecture in-place
- Breadcrumb navigation trail
- "Return to parent" / "Zoom to fit" controls
- Level-of-detail rendering (simplified when far, detailed when close)

**4. Node Detail Panel**
- Right sidebar displays on node click:
  - Service metadata (name, owner, repo, docs link)
  - Inbound/outbound dependencies
  - Tech stack (language, framework, databases)
  - API contracts / message schemas
  - Health metrics (optional for v1.0)

**5. Dependency Visualization**
- Edges show connections between nodes
- Color-coded by type (HTTP, gRPC, Kafka, database)
- Animated flow direction indicators
- Highlight path on hover

**6. Import/Export**
- JSON import format for architecture data
- Export current view as PNG/SVG
- Save/load workspace sessions

### Post-MVP Features (v0.2.0+)

- Multi-user collaboration (shared cursors, annotations)
- Version history (compare architectures over time)
- Auto-import from Kubernetes, Terraform, Backstage
- Search & filter nodes by tags/owners
- Critical path analysis (highlight bottlenecks)
- VR/AR support for enterprise demos

---

## Technical Architecture

### Technology Stack

**Frontend Core:**
- **Framework:** React 18+ with TypeScript
- **3D Engine:** Three.js (r160+)
- **3D Controls:** @react-three/fiber + @react-three/drei
- **State Management:** Zustand (lightweight, perfect for 3D state)
- **UI Components:** Radix UI (unstyled, accessible primitives)
- **Styling:** Tailwind CSS + CSS variables
- **Build Tool:** Vite

**Data & Graph:**
- **Graph Library:** Graphology (efficient graph operations)
- **Layout Algorithm:** 3D force-directed layout (d3-force-3d)
- **Data Format:** Custom JSON schema (defined below)

**Backend (Minimal for MVP):**
- **Runtime:** Node.js / Bun
- **Framework:** Fastify (for API if needed)
- **Storage:** LocalStorage (MVP), PostgreSQL + Prisma (v0.2.0)
- **Auth:** Clerk / Auth0 (post-MVP)

**DevOps:**
- **Hosting:** Vercel (frontend) + Railway (backend when needed)
- **Analytics:** PostHog (self-hosted or cloud)

---

## Data Model

### Architecture Graph Schema

```json
{
  "version": "1.0",
  "metadata": {
    "name": "Production Architecture",
    "organization": "Acme Corp",
    "lastUpdated": "2026-05-24T10:00:00Z",
    "author": "architecture-team"
  },
  "nodes": [
    {
      "id": "node-001",
      "type": "domain",
      "label": "Frontend Domain",
      "position": { "x": 0, "y": 0, "z": 0 },
      "color": "#3b82f6",
      "metadata": {
        "owner": "frontend-team",
        "description": "User-facing applications"
      },
      "children": ["node-002", "node-003"]
    },
    {
      "id": "node-002",
      "type": "service",
      "label": "Web App",
      "parentId": "node-001",
      "position": { "x": -5, "y": 2, "z": 3 },
      "color": "#60a5fa",
      "metadata": {
        "techStack": ["React", "TypeScript", "Vite"],
        "repository": "https://github.com/acme/web-app",
        "owner": "alice@acme.com",
        "documentation": "https://docs.acme.com/web-app"
      },
      "children": ["node-010", "node-011"]
    },
    {
      "id": "node-010",
      "type": "component",
      "label": "Auth API Client",
      "parentId": "node-002",
      "position": { "x": -7, "y": 3, "z": 4 },
      "color": "#93c5fd",
      "metadata": {
        "type": "HTTP Client",
        "endpoints": [
          "POST /api/auth/login",
          "POST /api/auth/refresh"
        ],
        "dependencies": ["node-050"]
      }
    }
  ],
  "edges": [
    {
      "id": "edge-001",
      "source": "node-010",
      "target": "node-050",
      "type": "http",
      "label": "Authentication",
      "metadata": {
        "protocol": "HTTPS",
        "avgLatency": "45ms"
      }
    }
  ]
}
```

### Node Types Hierarchy

```typescript
type NodeType = 
  | 'domain'      // Top-level organizational unit
  | 'service'     // Microservice / application
  | 'component'   // Internal service component
  | 'database'    // Data store
  | 'queue'       // Message queue / event bus
  | 'api'         // API endpoint / gateway
  | 'cache'       // Redis / Memcached
  | 'external';   // Third-party service

type EdgeType = 
  | 'http'        // REST / GraphQL
  | 'grpc'        // gRPC
  | 'kafka'       // Event streaming
  | 'database'    // DB connection
  | 'cache'       // Cache read/write
  | 'websocket';  // Real-time connection
```

---

## UI/UX Design Requirements

### Visual Design Language

**Color System:**
- Domain nodes: Blue gradient (#3b82f6 → #1e40af)
- Service nodes: Purple gradient (#8b5cf6 → #6d28d9)
- Database nodes: Green gradient (#10b981 → #047857)
- Queue nodes: Orange gradient (#f59e0b → #d97706)
- External nodes: Gray gradient (#6b7280 → #374151)

**Node Rendering:**
- Spheres for domains (radius proportional to child count)
- Cubes for services
- Cylinders for databases
- Torus for queues
- Octahedrons for external services

**Edge Rendering:**
- Curved lines (CatmullRom splines)
- Animated dashes flowing in direction of dependency
- Thickness proportional to traffic volume (if data available)
- Glow effect on hover

### Camera & Controls

**Navigation Modes:**

1. **Orbit Mode (Default):**
   - Left-click drag: rotate around target
   - Right-click drag: pan
   - Scroll: zoom
   - Double-click node: focus and reveal children

2. **Fly Mode (Advanced):**
   - WASD: move camera
   - Mouse: look around
   - Space: ascend, Shift: descend
   - Tab: toggle mode

**UI Overlays:**
- Top-left: Breadcrumb trail (Domain > Service > Component)
- Top-right: Search bar + filters
- Bottom-right: Minimap (2D projection of 3D space)
- Right panel: Node details (slides in on click)

### Interaction Patterns

**Node Click:**
1. Camera smoothly transitions to focus node
2. Children nodes animate into view (fade + scale)
3. Parent/sibling nodes fade to 30% opacity
4. Detail panel slides in from right
5. Breadcrumb updates

**Node Hover:**
1. Node scales up 1.2x
2. Connected edges highlight
3. Tooltip shows basic info (name, type)

**Zoom Behavior:**
- Far view: Show only domains (LOD 0)
- Medium view: Show services (LOD 1)
- Close view: Show components (LOD 2)
- Very close: Show technical details as text labels (LOD 3)

---

## Implementation Roadmap

### Phase 1: Core 3D Engine (Week 1-2)

**Agent Skills Required:**
- Three.js scene setup
- React Three Fiber integration
- Camera controls implementation
- Basic geometry rendering

**Deliverables:**
1. Empty 3D canvas with orbit controls
2. Render static spheres/cubes from hardcoded data
3. Click to select node (raycast detection)
4. Basic lighting (ambient + directional)

**Key Files:**
```
src/
├── components/
│   ├── Canvas3D.tsx          // R3F Canvas wrapper
│   ├── SceneManager.tsx      // Lights, camera, controls
│   ├── NodeRenderer.tsx      // Renders individual node geometries
│   └── EdgeRenderer.tsx      // Renders connection lines
├── hooks/
│   ├── useCamera.ts          // Camera state & transitions
│   └── useNodeInteraction.ts // Click/hover handling
├── stores/
│   └── graphStore.ts         // Zustand store for graph data
└── types/
    └── graph.ts              // TypeScript interfaces
```

### Phase 2: Graph Layout & Hierarchy (Week 2-3)

**Agent Skills Required:**
- 3D force-directed graph algorithms
- Hierarchical layout (parent-child positioning)
- Spatial clustering (group related nodes)
- Performance optimization (instancing)

**Deliverables:**
1. Load graph from JSON file
2. Auto-layout nodes using force simulation
3. Click node → reveal children with animation
4. Breadcrumb navigation trail
5. "Zoom to fit" all visible nodes

**Key Files:**
```
src/
├── lib/
│   ├── layoutEngine.ts       // 3D force layout
│   ├── hierarchyManager.ts   // Parent-child logic
│   └── spatialIndex.ts       // Octree for performance
├── components/
│   ├── GraphContainer.tsx    // Manages node/edge rendering
│   └── Breadcrumb.tsx        // Navigation trail UI
└── utils/
    └── cameraAnimations.ts   // Smooth transitions
```

### Phase 3: Detail Panel & Metadata (Week 3-4)

**Agent Skills Required:**
- React component design (Radix UI)
- TypeScript type safety for metadata
- Responsive panel animations
- Data formatting & presentation

**Deliverables:**
1. Slide-in detail panel on node click
2. Display all node metadata fields
3. Show inbound/outbound dependencies as lists
4. Render tech stack icons
5. Link to external documentation

**Key Files:**
```
src/
├── components/
│   ├── DetailPanel.tsx       // Main panel component
│   ├── MetadataSection.tsx   // Metadata display
│   ├── DependencyList.tsx    // Connections list
│   └── TechStackBadges.tsx   // Tech icons
└── stores/
    └── uiStore.ts            // Panel open/close state
```

### Phase 4: Advanced Visuals (Week 4-5)

**Agent Skills Required:**
- Custom Three.js shaders
- Particle systems for effects
- Post-processing (bloom, outline)
- Animation curves (GSAP or Framer Motion)

**Deliverables:**
1. Edge animations (flowing dashes)
2. Node hover effects (glow, scale)
3. Search highlight (pulse effect)
4. Level-of-detail (LOD) rendering
5. Minimap component

**Key Files:**
```
src/
├── shaders/
│   ├── nodeGlow.glsl         // Shader for hover glow
│   └── edgeFlow.glsl         // Animated edge shader
├── components/
│   ├── Minimap.tsx           // 2D overview map
│   └── SearchHighlight.tsx   // Pulse effect component
└── lib/
    └── lodManager.ts         // Level of detail logic
```

### Phase 5: Import/Export & Polish (Week 5-6)

**Agent Skills Required:**
- File upload/download handling
- JSON schema validation (Zod)
- PNG/SVG export (html2canvas / three-to-svg)
- LocalStorage persistence

**Deliverables:**
1. Import architecture JSON via file upload
2. Export current view as PNG
3. Save/load workspace to LocalStorage
4. Settings panel (controls, colors, performance)
5. Loading states & error handling

**Key Files:**
```
src/
├── lib/
│   ├── importExport.ts       // File handling
│   ├── validation.ts         // Zod schemas
│   └── exportImage.ts        // Render to PNG
├── components/
│   ├── ImportDialog.tsx      // File upload modal
│   ├── ExportDialog.tsx      // Export options
│   └── SettingsPanel.tsx     // User preferences
└── stores/
    └── persistenceStore.ts   // LocalStorage sync
```

---

## AI Agent Skill Requirements

### Required Capabilities

**1. Three.js / WebGL Expertise**
- Scene setup, lighting, camera management
- Custom geometries and materials
- Raycasting for mouse interaction
- Performance optimization (frustum culling, instancing)
- Shader programming (GLSL)

**2. React + TypeScript Proficiency**
- React 18 features (Suspense, Concurrent rendering)
- TypeScript generics and advanced types
- Custom hooks for 3D state management
- Component composition patterns

**3. Graph Algorithms**
- Force-directed layout in 3D space
- Hierarchical clustering
- Shortest path algorithms
- Spatial indexing (Octree/KD-tree)

**4. Animation & Interaction**
- Smooth camera transitions (lerp, slerp)
- Spring physics for node animations
- Gesture handling (mouse, touch, keyboard)
- GSAP or Framer Motion integration

**5. Data Modeling**
- Graph data structures (nodes, edges, adjacency)
- JSON schema design and validation
- State management patterns (Zustand/Redux)
- Normalization strategies for nested data

**6. UI/UX Implementation**
- Accessible component libraries (Radix UI)
- Responsive layouts (CSS Grid, Flexbox)
- Modal/panel animations
- Form handling and validation

**7. Build Tools & Performance**
- Vite configuration and optimization
- Code splitting and lazy loading
- Web Workers for heavy computation
- Memory management (dispose geometries/textures)

---

## Sample Agent Prompts

### Prompt 1: Initialize Project

```
Create a new React + TypeScript + Vite project for a 3D architecture visualization SaaS called "ArchSphere".

Setup requirements:
- React 18.2+, TypeScript 5.0+
- Three.js via @react-three/fiber and @react-three/drei
- Zustand for state management
- Radix UI for UI components
- Tailwind CSS for styling
- ESLint + Prettier with strict rules

Project structure:
/src
  /components   - React components
  /lib          - Core logic (layout, graph)
  /stores       - Zustand stores
  /types        - TypeScript interfaces
  /hooks        - Custom React hooks
  /utils        - Helper functions
  /shaders      - GLSL shader files

Initialize with a basic 3D canvas that renders a single blue sphere with orbit controls.
Include proper TypeScript types for all components.
```

### Prompt 2: Graph Layout Engine

```
Implement a 3D force-directed graph layout engine for ArchSphere.

Requirements:
- Use d3-force-3d for physics simulation
- Support hierarchical parent-child relationships
- Cluster related nodes spatially (e.g., all services in same domain)
- Position nodes to minimize edge crossing
- Allow manual node positioning with physics stabilization

Input: Graph data matching this TypeScript interface:
[paste GraphData interface from data model section]

Output: Updated node positions { x, y, z } after simulation converges

Create these files:
- src/lib/layoutEngine.ts - Main layout logic
- src/lib/forceSimulation.ts - D3 force wrapper
- src/types/layout.ts - Layout configuration types

Include tests for:
- Single parent with N children positions correctly
- Deep hierarchy (4+ levels) doesn't overlap
- Edge lengths are proportional to connection strength
```

### Prompt 3: Node Detail Panel

```
Build a slide-in detail panel component for ArchSphere that displays node metadata.

Component: DetailPanel.tsx

Props:
- node: ArchNode | null (node data or null when closed)
- onClose: () => void

Design requirements:
- Slides in from right (400px width)
- Smooth animation (300ms ease-out)
- Sections: Metadata, Dependencies, Tech Stack, Documentation
- Use Radix UI Dialog primitive for accessibility
- Tailwind classes for styling
- Dark theme optimized

Metadata display:
- Node name (h2)
- Type badge (colored pill)
- Owner (with avatar icon)
- Description (prose)
- Tech stack (icon grid)

Dependencies:
- Inbound connections (clickable list)
- Outbound connections (clickable list)
- Click dependency → highlight in 3D view

Include keyboard shortcuts:
- Esc to close
- Arrow keys to navigate between connected nodes
```

---

## Success Metrics

### MVP Success Criteria

**Technical:**
- Renders 200+ nodes at 60fps on mid-range GPU
- Initial load time <3s for average architecture
- Camera transitions feel smooth (no jank)
- Works in Chrome, Firefox, Safari

**User Experience:**
- New user can explore sample architecture in <2 minutes
- Breadcrumb navigation is intuitive (no "lost in space")
- Detail panel loads in <100ms after click
- Search finds nodes in <500ms

**Product:**
- Users can import their own architecture JSON
- Export PNG captures current view accurately
- LocalStorage persists workspace across sessions

### Post-MVP Metrics

- 100+ active workspaces
- Avg session time >5 minutes
- <20% bounce rate on landing page
- Positive feedback on Product Hunt launch

---

## Risk Mitigation

### Technical Risks

**Risk 1: Performance with large graphs (500+ nodes)**
- Mitigation: Implement aggressive LOD, instancing, frustum culling
- Fallback: Virtual scrolling / pagination by domain

**Risk 2: 3D navigation too complex for non-technical users**
- Mitigation: Guided tutorial on first load
- Fallback: Add 2D "map view" toggle

**Risk 3: JSON import format too rigid**
- Mitigation: Build adapters for common formats (Backstage, k8s)
- Fallback: Visual editor to create graphs from scratch

### Market Risks

**Risk 1: "Cool demo, no real use case"**
- Mitigation: Focus on onboarding and documentation use cases
- Validation: Interview 10 enterprise architects before v0.2.0

**Risk 2: Existing tools add 3D view**
- Mitigation: Focus on hierarchical exploration (our differentiator)
- Moat: Open-source core, paid collaboration features

---

## Next Steps

### Immediate Actions (Week 0)

1. **Setup project:** Run Prompt 1 in Cursor/Windsurf
2. **Create sample data:** Build example architecture JSON (e-commerce system with 20-30 nodes)
3. **Design mockups:** Sketch 3 key states (overview, service-level, component-level)
4. **Validate assumptions:** Show prototype to 3 engineers, get feedback

### Decision Points

**Before Phase 3:**
- Validate graph layout feels intuitive
- Test performance with 100+ node sample
- Decide on final color scheme

**Before Phase 5:**
- Decide on SaaS vs open-source model
- Choose auth provider (if going SaaS)
- Plan beta launch strategy

---

## Resources & References

**Inspiration:**
- Neo4j Bloom (3D graph viz)
- Backstage Software Catalog (service metadata)
- CodeSee Maps (dependency visualization)
- Miro / FigJam (collaborative canvas)

**Technical Docs:**
- Three.js manual: https://threejs.org/manual/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- D3 Force: https://github.com/vasturiano/d3-force-3d
- Graphology: https://graphology.github.io/

**Design System:**
- Radix UI: https://www.radix-ui.com/
- Tailwind CSS: https://tailwindcss.com/
- Lucide Icons: https://lucide.dev/

---

## Appendix: Example Architecture JSON

```json
{
  "version": "1.0",
  "metadata": {
    "name": "E-Commerce Platform",
    "organization": "ShopCo",
    "lastUpdated": "2026-05-24T10:00:00Z"
  },
  "nodes": [
    {
      "id": "domain-frontend",
      "type": "domain",
      "label": "Frontend",
      "position": { "x": -20, "y": 0, "z": 0 },
      "color": "#3b82f6",
      "children": ["svc-web", "svc-mobile"]
    },
    {
      "id": "svc-web",
      "type": "service",
      "label": "Web App",
      "parentId": "domain-frontend",
      "position": { "x": -22, "y": 3, "z": 2 },
      "metadata": {
        "owner": "frontend-team@shopco.com",
        "techStack": ["React", "TypeScript", "Next.js"],
        "repository": "https://github.com/shopco/web-app"
      },
      "children": ["comp-auth-client", "comp-catalog-client"]
    },
    {
      "id": "comp-auth-client",
      "type": "component",
      "label": "Auth Client",
      "parentId": "svc-web",
      "position": { "x": -24, "y": 4, "z": 3 },
      "metadata": {
        "type": "HTTP Client",
        "endpoints": ["POST /auth/login", "POST /auth/refresh"]
      }
    },
    {
      "id": "domain-backend",
      "type": "domain",
      "label": "Backend Services",
      "position": { "x": 0, "y": 0, "z": 0 },
      "color": "#8b5cf6",
      "children": ["svc-auth", "svc-catalog", "svc-orders"]
    },
    {
      "id": "svc-auth",
      "type": "service",
      "label": "Auth Service",
      "parentId": "domain-backend",
      "position": { "x": -5, "y": 3, "z": 2 },
      "metadata": {
        "owner": "backend-team@shopco.com",
        "techStack": ["Node.js", "Express", "JWT"],
        "repository": "https://github.com/shopco/auth-service"
      },
      "children": ["db-users"]
    },
    {
      "id": "db-users",
      "type": "database",
      "label": "Users DB",
      "parentId": "svc-auth",
      "position": { "x": -7, "y": 4, "z": 3 },
      "metadata": {
        "type": "PostgreSQL",
        "version": "15.2",
        "size": "50GB"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "comp-auth-client",
      "target": "svc-auth",
      "type": "http",
      "label": "Authentication"
    },
    {
      "id": "edge-2",
      "source": "svc-auth",
      "target": "db-users",
      "type": "database",
      "label": "User Queries"
    }
  ]
}
```

---

## END OF SPECIFICATION

This document should be used as the source of truth for building ArchSphere v0.1.0. Each phase can be tackled independently by AI coding agents with the specified skill sets.

For questions or clarifications, refer to the data model section for schema definitions and the UI/UX section for interaction patterns.
