# AI Agent Skills & Workflow Guide for ArchSphere

## Overview

This document defines the specific capabilities, tools, and workflows needed when working with AI coding agents (Cursor, Windsurf, GitHub Copilot, etc.) to build the 3D Architecture Explorer.

---

## Agent Capability Requirements

### Tier 1: Critical Skills (Must-Have)

**1. Three.js & WebGL Programming**

Required knowledge:
- Scene, Camera, Renderer architecture
- Mesh, Geometry, Material system
- Raycasting for object picking
- Performance optimization (dispose, frustum culling)
- Custom shaders (vertex + fragment)

Test prompt:
```
Create a Three.js scene with:
- 100 randomly positioned spheres
- OrbitControls for camera
- Click any sphere to change its color
- Dispose geometries on unmount
```

If agent can't handle this → Not suitable for Phase 1-2

**2. React + TypeScript (Advanced)**

Required knowledge:
- Functional components with proper typing
- Custom hooks for complex state
- Ref forwarding and imperative handles
- Suspense and lazy loading
- Performance optimization (memo, useMemo, useCallback)

Test prompt:
```
Create a TypeScript React component that:
- Accepts generic type parameter T
- Uses useRef to store Three.js objects
- Implements cleanup in useEffect
- Properly types all props and callbacks
```

If agent produces `any` types or missing cleanup → Needs refinement

**3. Graph Theory & Algorithms**

Required knowledge:
- Force-directed layout algorithms
- Hierarchical tree positioning
- Shortest path (Dijkstra, A*)
- Spatial indexing (Octree)

Test prompt:
```
Implement a 3D force simulation that:
- Positions parent node at origin
- Arranges N child nodes in sphere around parent
- Applies repulsion between siblings
- Supports dynamic addition/removal
```

If agent can't produce working physics → Use pre-built library (d3-force-3d)

### Tier 2: Important Skills (Should-Have)

**4. Animation & Transitions**

Required knowledge:
- Easing functions (ease-in, ease-out, spring)
- Interpolation (lerp, slerp for quaternions)
- Timeline coordination
- RAF (requestAnimationFrame) optimization

Test prompt:
```
Create a smooth camera transition function:
- Animate from current position to target over 1 second
- Use ease-out curve
- Support cancellation mid-flight
- Return Promise that resolves on complete
```

If agent uses setTimeout instead of RAF → Needs guidance

**5. State Management (Zustand/Redux)**

Required knowledge:
- Store creation with TypeScript
- Selector optimization
- Immutable updates
- Middleware (persist, devtools)

Test prompt:
```
Create a Zustand store for graph state:
- nodes: Map<string, Node>
- edges: Map<string, Edge>
- Actions: addNode, removeNode, updateNodePosition
- Selector: getNodesByType(type: string)
```

If agent uses mutable updates → Needs correction

**6. UI Component Libraries (Radix UI)**

Required knowledge:
- Unstyled component composition
- Accessibility (ARIA, keyboard nav)
- Portal rendering
- Slot pattern

Test prompt:
```
Create a Radix Dialog component:
- Slide in from right (animation)
- Trap focus inside
- Close on Esc or backdrop click
- Accessible announcements
```

If agent adds hardcoded styles instead of Tailwind classes → Needs guidance

### Tier 3: Nice-to-Have Skills

**7. Shader Programming (GLSL)**
**8. Performance Profiling**
**9. Build Tool Configuration (Vite)**
**10. Testing (Vitest, React Testing Library)**

---

## Agent Workflow by Phase

### Phase 1: Core 3D Engine

**Primary Agent Role:** Code Generator

**Workflow:**

1. **Initialize Project**
   - Agent prompt: "Create Vite + React + TS project with Three.js"
   - Review: Check package.json for correct versions
   - Iterate: Fix any missing dependencies

2. **Scene Setup**
   - Agent prompt: "Setup R3F Canvas with orbit controls and lighting"
   - Review: Test camera movement, check lighting is visible
   - Iterate: Adjust camera initial position if needed

3. **Basic Rendering**
   - Agent prompt: "Render a sphere at origin, cube at (5,0,0)"
   - Review: Objects should be visible and distinct
   - Iterate: Fix any geometry/material issues

**Agent Skills Used:**
- Three.js (Tier 1, Skill #1)
- React + TypeScript (Tier 1, Skill #2)

**Expected Agent Output Quality:** 8/10
- Should produce working code with minimal fixes
- May need guidance on Three.js disposal patterns

**Human Intervention Points:**
- Visual tweaking (colors, sizes)
- Camera positioning preferences
- Performance settings (antialiasing, shadows)

---

### Phase 2: Graph Layout & Hierarchy

**Primary Agent Role:** Algorithm Implementer

**Workflow:**

1. **Graph Data Structure**
   - Agent prompt: "Create TypeScript interfaces for hierarchical graph"
   - Review: Check parent-child relationships are typed correctly
   - Iterate: Add helper methods if needed

2. **Force Layout Integration**
   - Agent prompt: "Integrate d3-force-3d for node positioning"
   - Review: Run simulation, nodes should stabilize without overlap
   - Iterate: Tune force strengths if nodes collapse or fly apart

3. **Hierarchy Visualization**
   - Agent prompt: "Implement click to expand/collapse node children"
   - Review: Animation should be smooth, state updates correctly
   - Iterate: Fix any race conditions in state updates

**Agent Skills Used:**
- Graph Theory (Tier 1, Skill #3)
- State Management (Tier 2, Skill #5)
- Animation (Tier 2, Skill #4)

**Expected Agent Output Quality:** 6/10
- May struggle with force simulation tuning
- Likely needs iteration on animation timing
- State updates might have edge cases

**Human Intervention Points:**
- Force strength calibration
- Animation curve selection
- Collision detection parameters

**Red Flags:**
- Nodes overlapping after stabilization
- State updates causing re-layout on every click
- Memory leaks from undisposed force simulation

---

### Phase 3: Detail Panel & Metadata

**Primary Agent Role:** UI Builder

**Workflow:**

1. **Panel Component**
   - Agent prompt: "Create slide-in panel with Radix Dialog + Tailwind"
   - Review: Should slide smoothly, trap focus correctly
   - Iterate: Adjust animation timing, panel width

2. **Metadata Display**
   - Agent prompt: "Display node metadata in sections with icons"
   - Review: Layout should be scannable, icons aligned
   - Iterate: Improve spacing, add loading states

3. **Dependency List**
   - Agent prompt: "Show inbound/outbound connections as clickable lists"
   - Review: Clicking should focus connected node in 3D view
   - Iterate: Add hover effects, connection strength indicators

**Agent Skills Used:**
- UI Components (Tier 2, Skill #6)
- React + TypeScript (Tier 1, Skill #2)
- State Management (Tier 2, Skill #5)

**Expected Agent Output Quality:** 7/10
- Should produce clean React components
- May need styling refinement
- Accessibility might need manual checks

**Human Intervention Points:**
- Visual design tweaks
- Information hierarchy
- Icon selection
- Mobile responsiveness (if needed)

---

### Phase 4: Advanced Visuals

**Primary Agent Role:** Graphics Specialist

**Workflow:**

1. **Edge Animations**
   - Agent prompt: "Animate dashed lines along edges using shaders"
   - Review: Dashes should flow in direction of dependency
   - Iterate: Adjust speed, dash length

2. **Node Effects**
   - Agent prompt: "Add glow effect on hover, pulse on search match"
   - Review: Effects should feel polished, no performance drops
   - Iterate: Reduce glow intensity if too aggressive

3. **LOD System**
   - Agent prompt: "Implement level-of-detail rendering based on camera distance"
   - Review: Transitions between LOD levels should be smooth
   - Iterate: Tune distance thresholds

**Agent Skills Used:**
- Shader Programming (Tier 3, Skill #7) - Optional
- Animation (Tier 2, Skill #4)
- Performance Profiling (Tier 3, Skill #8)

**Expected Agent Output Quality:** 5/10
- Shader code likely needs manual review
- Performance optimizations may be naive
- Visual polish requires designer input

**Human Intervention Points:**
- All shader code (if agent produces any)
- Visual effect intensity
- Performance tuning
- Cross-browser testing

**Alternatives if Agent Struggles:**
- Use pre-built shaders from Three.js examples
- Skip custom shaders, use Three.js built-in materials with emissive
- Focus on CSS-based effects instead of GPU shaders

---

### Phase 5: Import/Export & Polish

**Primary Agent Role:** Integration Engineer

**Workflow:**

1. **File Import**
   - Agent prompt: "Add file upload with Zod validation for architecture JSON"
   - Review: Invalid JSON should show clear error messages
   - Iterate: Add example schemas, improve validation messages

2. **Export Features**
   - Agent prompt: "Export current 3D view as PNG using three-to-png"
   - Review: Image should capture full scene at high resolution
   - Iterate: Add resolution options, fix canvas sizing issues

3. **Persistence**
   - Agent prompt: "Save/load workspace to LocalStorage with Zustand persist"
   - Review: Should survive page refresh, handle quota errors
   - Iterate: Add versioning, migration for schema changes

**Agent Skills Used:**
- React + TypeScript (Tier 1, Skill #2)
- Build Tools (Tier 3, Skill #9)

**Expected Agent Output Quality:** 8/10
- File handling should work well
- May need error handling improvements
- Edge cases (large files, quota limits) need attention

**Human Intervention Points:**
- Error message copy
- File size limits
- Export image quality settings

---

## Agent Selection Guide

### For Cursor AI

**Strengths:**
- Excellent at React + TypeScript boilerplate
- Good with modern libraries (Radix UI, Tailwind)
- Fast iteration on UI components

**Weaknesses:**
- Can struggle with complex 3D math
- Shader code often needs manual fixes
- May produce over-engineered solutions

**Best Used For:** Phases 1, 3, 5

**Prompt Style:**
- Be very specific about TypeScript types
- Reference exact library versions
- Provide example code structure

**Example Cursor Prompt:**
```
Using @react-three/fiber v8.15.0, create a component <SceneManager> that:
- Wraps <Canvas> with these props: camera={{ position: [0, 5, 10], fov: 75 }}
- Includes <OrbitControls> from @react-three/drei
- Adds <ambientLight intensity={0.5} /> and <directionalLight position={[5, 5, 5]} />
- Types all props with TypeScript

File: src/components/SceneManager.tsx
```

### For GitHub Copilot

**Strengths:**
- Great autocomplete for repetitive patterns
- Good at inferring types from context
- Fast for small, well-defined functions

**Weaknesses:**
- Limited context window for large refactors
- May suggest outdated patterns
- Not great for architecture decisions

**Best Used For:** Fine-tuning existing code, writing tests, utility functions

**Workflow:**
- Use Cursor/Windsurf to generate initial structure
- Use Copilot to fill in implementation details
- Review all suggestions carefully

### For Windsurf (Cascade)

**Strengths:**
- Multi-file editing and refactoring
- Good at understanding project structure
- Can handle larger architectural changes

**Weaknesses:**
- Slower than Cursor for simple tasks
- May make too many changes at once
- Requires more specific prompting

**Best Used For:** Phases 2, 4 (complex, multi-file features)

**Prompt Style:**
- Describe the feature end-to-end
- Specify all affected files
- Provide clear acceptance criteria

**Example Windsurf Prompt:**
```
Implement hierarchical node expansion feature across:
- src/stores/graphStore.ts - Add `expandedNodes: Set<string>` and `toggleNode(id)`
- src/components/NodeRenderer.tsx - Show children only if parent is expanded
- src/lib/layoutEngine.ts - Reposition children when parent expands
- src/components/Breadcrumb.tsx - Update trail on expansion

Acceptance:
- Click domain node → children appear with animation
- Click again → children hide
- Breadcrumb shows current depth
- State persists across rerenders
```

---

## Quality Checkpoints

### After Each Phase

**Code Quality:**
- [ ] No TypeScript `any` types (except external library types)
- [ ] All Three.js objects properly disposed in cleanup
- [ ] No console errors or warnings in browser
- [ ] ESLint passes with no errors

**Performance:**
- [ ] 60fps with 50 nodes (check Chrome DevTools)
- [ ] No memory leaks (check Heap Snapshots)
- [ ] Bundle size <500KB (check Vite build output)

**User Experience:**
- [ ] All interactions feel responsive (<100ms feedback)
- [ ] Animations are smooth, no jank
- [ ] Error states have clear messages
- [ ] Keyboard navigation works

**Testing:**
- [ ] Can load example architecture JSON
- [ ] Can navigate to 3+ levels deep
- [ ] Panel shows correct data for selected node
- [ ] Export produces valid PNG

---

## Troubleshooting Agent Issues

### Issue: Agent Produces Untyped Code

**Symptoms:**
- Lots of `any` types
- Missing interface definitions
- Props typed as `{}`

**Solution:**
```
Prompt: "Rewrite this component with strict TypeScript:
- No `any` types
- Define interface for all props
- Type all function parameters
- Use generics where appropriate"
```

### Issue: Agent Doesn't Understand Three.js Patterns

**Symptoms:**
- No geometry/material disposal
- Creates new objects every render
- Uses deprecated API

**Solution:**
- Provide example code snippet in prompt
- Link to Three.js documentation
- Ask for specific pattern: "Use useRef to store mesh, update position in useFrame"

### Issue: Agent Overcomplicates Simple Features

**Symptoms:**
- Adds unnecessary abstractions
- Creates too many files
- Over-engineers state management

**Solution:**
```
Prompt: "Simplify this implementation:
- Keep it in one file
- No custom hooks unless necessary
- Use built-in React features first
- Optimize for readability, not reusability"
```

### Issue: Agent Can't Debug Performance Problems

**Symptoms:**
- Frame rate drops with many nodes
- Memory usage grows over time
- Browser hangs on interactions

**Solution:**
- Run Chrome DevTools Performance profiler yourself
- Share flame graph with agent
- Ask for specific fix: "The bottleneck is in NodeRenderer line 45, optimize this loop"

---

## Agent Prompting Best Practices

### Do's

✅ **Be Specific About Libraries:**
```
Good: "Use Zustand v4.5.0 with TypeScript, create store with persist middleware"
Bad: "Add state management"
```

✅ **Provide Example Output:**
```
Good: "Return object matching this shape: { position: Vector3, rotation: Quaternion }"
Bad: "Return the transformed node"
```

✅ **Reference Existing Code:**
```
Good: "Follow the pattern in src/components/EdgeRenderer.tsx for material setup"
Bad: "Make it similar to the other renderer"
```

✅ **Set Performance Constraints:**
```
Good: "This must run at 60fps with 200 nodes, use instancing if needed"
Bad: "Make it fast"
```

### Don'ts

❌ **Vague Feature Requests:**
```
Bad: "Make the UI better"
Good: "Increase panel width to 450px, add 16px padding, use Inter font"
```

❌ **Assuming Agent Knows Your Codebase:**
```
Bad: "Update the graph logic"
Good: "In src/stores/graphStore.ts, modify the addNode action to also update the spatial index"
```

❌ **Asking for "Best Practices" Without Context:**
```
Bad: "Use best practices for React performance"
Good: "Memoize this component to prevent re-render when parent graph store updates unrelated nodes"
```

❌ **Relying on Agent for Design Decisions:**
```
Bad: "What should the color scheme be?"
Good: "Use these colors: primary #3b82f6, secondary #8b5cf6, background #0f172a"
```

---

## Recommended Agent Workflow

### Week 1-2: Foundation (Cursor AI)

1. Generate project structure
2. Setup Three.js scene
3. Implement basic node rendering
4. Add click interaction

### Week 2-3: Graph Logic (Windsurf)

1. Implement force layout
2. Add hierarchy expansion
3. Wire up state management
4. Test with sample data

### Week 3-4: UI Polish (Cursor AI)

1. Build detail panel
2. Add breadcrumb navigation
3. Implement search
4. Style with Tailwind

### Week 4-5: Visual Effects (Manual + Agent Assistance)

1. Write shaders manually or find examples
2. Use agent for animation utilities
3. Agent for LOD system logic
4. Manual testing and tuning

### Week 5-6: Integration (Cursor AI)

1. File upload/download
2. LocalStorage persistence
3. Error handling
4. Documentation

---

## Expected Agent Efficiency by Phase

| Phase | Agent Contribution | Human Contribution | Quality Score |
|-------|-------------------|-------------------|---------------|
| Phase 1 | 80% | 20% (tweaking) | 8/10 |
| Phase 2 | 60% | 40% (algorithm tuning) | 6/10 |
| Phase 3 | 75% | 25% (design decisions) | 7/10 |
| Phase 4 | 40% | 60% (shader writing, visual polish) | 5/10 |
| Phase 5 | 70% | 30% (edge cases, testing) | 8/10 |

**Overall:** Agent can handle ~65% of implementation, human needed for critical 35% (algorithms, shaders, UX polish)

---

## Final Checklist Before Production

**Code:**
- [ ] All agent-generated code reviewed by human
- [ ] No TODO comments left in production code
- [ ] All console.log statements removed
- [ ] TypeScript strict mode enabled, no errors

**Performance:**
- [ ] Lighthouse score >90 for performance
- [ ] No memory leaks over 5-minute session
- [ ] Bundle size optimized (code splitting, tree shaking)

**UX:**
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Keyboard navigation works completely
- [ ] Touch gestures work on mobile (if supported)
- [ ] Loading states for all async operations

**Documentation:**
- [ ] README with setup instructions
- [ ] Architecture JSON schema documented
- [ ] Component storybook (optional)
- [ ] Deployment guide

---

## Summary

**Agent Strengths:**
- Boilerplate React/TypeScript code
- UI component structure
- Standard patterns (state management, hooks)
- File handling and validation

**Agent Weaknesses:**
- Complex 3D math and physics
- Shader programming
- Visual design decisions
- Performance optimization edge cases

**Optimal Strategy:**
Use agents for scaffolding and repetitive work, reserve human effort for algorithms, shaders, and creative decisions.

**Realistic Timeline with Agent Assistance:**
6 weeks for MVP vs. 10-12 weeks fully manual = ~40% time savings

**Risk:** Over-reliance on agent output without review can introduce subtle bugs in state management and memory leaks in Three.js objects. Always verify disposal patterns and performance.
