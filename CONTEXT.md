# Project Context & Development Notes

## Current State (Dec 7, 2025)

### What We Just Built

The **Intelligent Networking Graph Visualization** - a living, orbital representation of event attendees with AI-powered matchmaking indicators.

**Key Features**:

- Hierarchical orbit system with eccentric (elliptical) paths
- Continuous 360° rotation creating "always alive" feel
- Two orbit rings: inner (3 attendees, 60s rotation) and outer (7+ attendees, 80s rotation)
- Counter-rotating rings for visual interest
- AI Match badge with pulse animation
- Energy field background (radial gradients with noise texture)
- Graceful degradation with placeholder avatars

### Architecture Decisions

#### Why Continuous Orbits?

Original implementation used "sway" (oscillating wobble). Changed to full continuous rotation for:

1. More "living system" feel
2. Better representation of constant connections
3. Cinematic, meditative quality
4. Avoids mechanical back-and-forth motion

#### Component Structure

```
NetworkingPreview (container)
├── BackgroundField (radial gradients)
├── Center Node (attendee count)
├── MatchBadge (conditional)
└── OrbitRings
    ├── OrbitRing (inner, 110px radius)
    │   └── AvatarNodes (3 attendees)
    └── OrbitRing (outer, 170px radius)
        └── AvatarNodes (7 attendees)
```

#### Motion System Philosophy

All animations use `rhizMotion` utilities from `/lib/motion.ts`:

- **Desynchronization**: Random delays prevent grid-like uniformity
- **Organic easing**: Custom cubic bezier curves (not CSS defaults)
- **Micro-movements**: Avatars have independent float animations
- **Slow tempo**: 60-80s rotations feel contemplative, not frenetic

### Integration Points

#### BAML (AI Generation)

- `baml_src/event_app_config.baml` defines event structure
- `baml_src/connection_reasons.baml` generates matchmaking logic
- Generated types in `lib/baml_client/`

#### Rhiz Protocol (Future)

Current: Mock attendee data in `EventLandingPage.tsx`

**Next Steps**:

1. Query `client.listRelationships()` for actual connection data
2. Use `strength_score` to determine orbit placement (stronger = inner ring)
3. Render edges between connected attendees as SVG paths
4. Add interaction handlers to explore connections

**Files to modify**:

- `lib/rhizClient.ts`: Expand `getSuggestedConnections()`
- `components/networking/NetworkingPreview.tsx`: Accept edges prop
- Create `components/networking/ConnectionEdge.tsx` for SVG lines

### Design Tokens

#### Custom Tailwind Extensions

```typescript
// tailwind.config.ts
colors: {
  surface: { 950, 900, 800, 700, 600, 500 }, // Black surfaces
  brand: { 300, 400, 500 }, // Indigo accents
}

animation: {
  'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

#### Theme System

Themes defined in `components/hero/theme.ts`:

- `professional`: Clean, corporate
- `vibrant`: Energetic, colorful
- `luxury`: Premium, exclusive

Maps to:

- Background patterns
- Typography scales
- Button styles
- Color palettes

### Known Issues & TODOs

#### High Priority

- [ ] Connect Rhiz Protocol API for real attendee data
- [ ] Implement edge rendering for relationship visualization
- [ ] Add click handlers to avatars (detail modal?)
- [ ] Test with 20+ attendees (performance check)

#### Medium Priority

- [ ] Mobile responsiveness for orbit graph (scale down radii)
- [ ] Accessibility: keyboard navigation through attendees
- [ ] Loading states during AI generation
- [ ] Error handling for failed BAML calls

#### Nice to Have

- [ ] Export graph as shareable image
- [ ] WebGL renderer for 100+ attendees
- [ ] 3D orbital paths (Z-axis depth)
- [ ] Gesture controls (pinch to zoom)

### Development Workflow

#### Making Changes to Graph

1. Edit `components/networking/NetworkingPreview.tsx` for layout
2. Edit `components/networking/OrbitRing.tsx` for animation behavior
3. Edit `lib/motion.ts` for new animation presets
4. Test in browser at `http://localhost:3001`
5. Type check: `npx tsc --noEmit`

#### Adding New Themes

1. Define theme in `components/hero/theme.ts`
2. Update `HeroSection.tsx` theme mapping
3. Add corresponding tokens to `tailwind.config.ts`

#### BAML Schema Changes

1. Edit `.baml` files in `baml_src/`
2. Run `npx baml-cli generate` to update types
3. Update consuming components to match new schema

### Performance Notes

#### Current Metrics

- **Initial Load**: ~2s (dev mode)
- **Animation FPS**: 60fps solid on M1 Mac
- **Re-render cost**: Low (Framer Motion optimized)

#### Optimization Strategies

- Use `useMemo` for computed values (angle calculations)
- `pointer-events-none` on non-interactive elements
- Lazy load orbit rings if >100 attendees
- Consider `will-change: transform` for GPU acceleration

### File Organization

```
rhiz-event-maker/
├── app/                        # Next.js app directory
│   ├── page.tsx                # Config form + router
│   ├── actions.ts              # Server actions (BAML)
│   └── components/
│       └── EventLandingPage.tsx # Landing page assembler
├── components/                 # Reusable React components
│   ├── networking/             # Graph visualization
│   ├── hero/                   # Hero sections
│   ├── speakers/               # Speaker components
│   └── schedule/               # Schedule components
├── lib/                        # Utilities & SDK
│   ├── protocol-sdk/           # Rhiz Protocol (copied source)
│   ├── baml_client/            # Generated BAML types
│   ├── motion.ts               # Animation utilities
│   └── rhizClient.ts           # Protocol wrapper
└── baml_src/                   # BAML schemas
```

### Commit Message Conventions

We use conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code restructuring
- `perf:` Performance improvements
- `test:` Adding tests

Example: `feat: enhance NetworkingPreview with continuous orbit animations`

### Questions to Ask When Resuming

1. **What's the current goal?** (Check README "Future Enhancements")
2. **Which component am I modifying?** (See "File Organization")
3. **What's the design philosophy?** (See "Motion System Philosophy")
4. **How do I test changes?** (See "Development Workflow")

### Helpful Commands

```bash
# Development
npm run dev              # Start dev server
npx tsc --noEmit        # Type check
npx baml-cli generate   # Regenerate BAML types

# Git
git status              # Check changes
git add .               # Stage all
git commit -m "msg"     # Commit
git push origin main    # Push to remote

# Debugging
console.log()           # Add to components
# Check browser console at localhost:3001
```

---

**Pro Tip**: When returning to this project, start by:

1. Reading the recent commit messages: `git log --oneline -10`
2. Checking this CONTEXT.md
3. Reviewing `/components/networking/NetworkingPreview.tsx` (the main graph file)
4. Running `npm run dev` and opening localhost:3001

This will get you oriented in ~5 minutes.
