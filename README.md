# Rhiz Event Maker

An intelligent event platform powered by AI and the Rhiz Protocol. Design beautiful, identity-aware event experiences with dynamic AI-generated configurations.

## 🎯 Project Overview

This Next.js application generates customized event landing pages using BAML (Boundary Markup Language) and AI. It features:

- **AI-Powered Event Configuration**: Describe your event and get a fully themed landing page
- **Intelligent Networking Graph**: Living visualization showing attendee connections and AI matchmaking
- **Dynamic Hero Sections**: Theme-driven backgrounds with cinematic animations
- **Speaker Spotlight**: Carousel and grid layouts with premium interactions
- **Schedule Grid**: Masonry-style session display with track-based organization
- **Rhiz Protocol Integration**: Identity management and relationship tracking

## 🏗️ Architecture

### Core Technologies

- **Next.js 15** (App Router)
- **TypeScript** with strict mode
- **BAML** for AI-powered structured generation
- **Framer Motion** for animations
- **Tailwind CSS** with custom design tokens
- **Rhiz Protocol SDK** for identity and relationships

### Key Components

#### `/components/networking/`

- **`NetworkingPreview.tsx`**: Main graph visualization component
  - Hierarchical orbit system (inner/outer rings)
  - Continuous 360° rotation with eccentric elliptical paths
  - Energy field background with gradient mesh
  - AI Match badge with pulse animation
- **`OrbitRing.tsx`**: Reusable orbit container
  - Supports `sway` (oscillation) and `continuous` (full rotation) modes
  - Configurable eccentricity for non-circular paths
  - Independent clockwise/counter-clockwise direction

#### `/components/hero/`

- **`HeroSection.tsx`**: Theme-driven hero with cinematic entrance
- **`BackgroundSystem.tsx`**: Procedural or image-based backgrounds

#### `/components/speakers/`

- **`SpeakerSpotlight.tsx`**: Carousel/Grid layouts
- **`SpeakerCard.tsx`**: Grayscale-to-color hover effects

#### `/components/schedule/`

- **`ScheduleGrid.tsx`**: Masonry layout for sessions
- **`SessionCard.tsx`**: Track-specific styling

### BAML Configuration (`/baml_src/`)

- **`event_app_config.baml`**: Main event configuration schema
- **`connection_reasons.baml`**: AI-powered matchmaking logic
- **`attendee_intent_profile.baml`**: User intent modeling
- **`clients.baml`**: AI client definitions (GPT-4)

### Rhiz Protocol (`/lib/protocol-sdk/`)

Integration layer for identity management:

- People/Organizations/Relationships APIs
- Interaction logging
- Connection suggestions based on relationship strength

## 🎨 Design System

### Themes

- **Professional**: Crisp, formal aesthetics
- **Vibrant**: Electric, high-energy
- **Luxury**: Exclusive, premium feel

### Motion System (`/lib/motion.ts`)

- **`rhizEasings`**: Custom cubic bezier curves (float, snap, pulse)
- **`rhizMotion`**: Organic animation presets
  - `randomFloatDuration()`: Desynchronized elements
  - `corkscrew`: Subtle angular drift
  - `intelligencePulse`: AI badge heartbeat

### Color Tokens

Defined in `tailwind.config.ts`:

- **surface-\***: Background layers (950, 900, 800, 700)
- **brand-\***: Primary accent colors (300, 400, 500)
- **foreground**: Text colors

## 🚀 Recent Changes (Dec 7, 2025)

### Intelligent Networking Graph Enhancement

**Commit**: `afe473a` - "feat: enhance NetworkingPreview with continuous orbit animations"

**Changes**:

1. Added `variant` prop to `OrbitRing` (`sway` | `continuous`)
2. Implemented smooth 360° rotation for `continuous` mode
3. Updated `NetworkingPreview` to use slower, cinematic orbits (60s inner / 80s outer)
4. Maintained hierarchical eccentric orbit layout for depth
5. Verified type safety and build status

**Files Modified**:

- `components/networking/OrbitRing.tsx`
- `components/networking/NetworkingPreview.tsx`
- `app/actions.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`
- `baml_src/event_app_config.baml`
- `next.config.ts`, `tailwind.config.ts`

## 💻 Development

### Prerequisites

```bash
Node.js 18+
npm or pnpm
```

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your OpenAI API key to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

### Environment Variables

```
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_RHIZ_API_URL=http://localhost:8000
RHIZ_API_TOKEN=your_token_here
```

### Build & Deploy

```bash
# Type check
npx tsc --noEmit

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Usage Flow

1. **Event Configuration**: Fill in event details (essence, goals, audience, tone)
2. **AI Generation**: BAML generates structured `EventAppConfig`
3. **Landing Page Render**: Dynamic components assembled:
   - Hero Section (theme-based)
   - Speaker Spotlight (carousel/grid)
   - Schedule Grid (masonry)
   - Networking Preview (orbit graph)
4. **Preview & Edit**: Back button returns to configuration

## 🔮 Future Enhancements

### Planned

- **Rhiz Protocol Graph Integration**: Use actual relationship edges from protocol
- **Real-time Attendee Data**: Live connection suggestions
- **Interactive Graph Navigation**: Click avatars to explore connections
- **3D Orbit Visualization**: Depth layers with Z-axis positioning
- **Edge Rendering**: Visual connection lines between related attendees

### Under Consideration

- Export graph visualization as standalone component to Rhiz Protocol SDK
- WebGL-based rendering for performance
- Touch gesture controls for mobile exploration

## 📚 Key Files Reference

| File                                          | Purpose                                       |
| --------------------------------------------- | --------------------------------------------- |
| `app/page.tsx`                                | Main configuration form & landing page router |
| `app/actions.ts`                              | Server action for BAML event generation       |
| `app/components/EventLandingPage.tsx`         | Assembled landing page with all sections      |
| `lib/rhizClient.ts`                           | Rhiz Protocol SDK wrapper                     |
| `lib/motion.ts`                               | Animation utilities and presets               |
| `components/networking/NetworkingPreview.tsx` | Graph visualization                           |

## 🤝 Contributing

This project follows the "Design Standards (2025 AI-Resilient Guidelines)":

- Avoid recognizable AI patterns (gradients, specific color combos)
- Prioritize depth, motion, and visual identity
- Use cinematic animations (not mechanical)
- Implement premium aesthetics (vibrant colors, glassmorphism, dynamic effects)

## 📄 License

[Add your license here]

---

**Last Updated**: December 7, 2025  
**Version**: 2.0.0  
**Status**: Active Development
