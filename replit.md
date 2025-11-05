# Blackwing Wallets

## Overview

Blackwing Wallets is a Next.js-based cryptocurrency wallet tracking application that allows users to monitor wallet performance, trades, and discover new wallets. The application features a mobile-first design with animated interactions, wallet filtering, and detailed performance metrics across multiple timeframes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 16.0.1 with React 19.2.0
- Uses App Router architecture (app directory)
- Client-side rendering for interactive components
- TypeScript for type safety

**Styling**: Tailwind CSS v4
- Custom CSS variables for theming (dark mode by default)
- Inline theme configuration using `@theme` directive
- Inter font family via next/font optimization

**Animation Library**: Motion (Framer Motion) v12
- Used for complex gesture interactions (swipe actions on wallet rows)
- Handles drag/pan gestures with spring physics
- Provides motion values and transforms for smooth animations

**State Management**: React hooks (useState, useMemo, useEffect)
- Local component state for UI interactions
- No global state management library currently implemented
- Derived state computed via useMemo for performance

### Component Architecture

**Feature-based organization**: 
- Components organized under `app/features/wallets/components/`
- Separation of concerns between presentation and business logic
- Reusable components like AnimatedList, WalletRow, BottomTabs

**Key Design Patterns**:
- Compound components (WalletRow with expandable trade lists)
- Render props pattern (AnimatedList accepts renderItem function)
- Motion values for gesture-driven animations (swipe-to-reveal actions)

**Type System**:
- Comprehensive TypeScript types defined in `constants.ts` and `data.ts`
- Discriminated unions for polymorphic data (TradeListEntry with "kind" field)
- Strong typing for component props and state

### Data Layer

**Current Implementation**: Static mock data
- Wallet records and token records defined in `app/data.ts`
- Deterministic pseudo-random number generation for consistent demo data
- No database or API integration currently

**Data Model**:
- WalletRecord: Core wallet information with PNL across timeframes
- TokenRecord: Individual token/trade information
- WalletView: Extended wallet with associated trades
- Performance metrics tracked across 4 timeframes: 1d, 7d, 30d, 1yr

**Future Considerations**:
- The architecture anticipates database integration (potential for Drizzle ORM)
- Data fetching logic would likely use Next.js server components or API routes
- Real-time updates may require WebSocket or polling mechanisms

### UI/UX Features

**Navigation**: Bottom tab bar with three sections (Wallets, Discover, Sugar)
- Sticky positioning with backdrop blur effect
- Custom SVG icons for each tab

**Wallet Management**:
- Three sections: Auto-trade, Watching, Discover
- Filtering by wallet status (All, Watching, KOLs, Whales, Alpha)
- Expandable wallet rows showing trade history
- Swipe gestures for contextual actions (varies by section)

**Interactions**:
- Swipe-to-reveal actions on wallet rows (different actions per section)
- Modal for adding new wallets (placeholder)
- Bottom sheet for sorting options in Discover view
- Staggered animations for expanding/collapsing trade lists

### Configuration

**Development Server**: Runs on port 5000, binds to 0.0.0.0
- Allows external connections (useful for mobile testing)

**TypeScript**: Strict mode enabled
- Target: ES2017
- Module resolution: bundler (Next.js optimized)
- Path alias: `@/*` maps to project root

## External Dependencies

### Core Framework
- **Next.js**: React framework with app router, image optimization, and font loading
- **React 19.2.0**: Latest React with concurrent features
- **React DOM**: React rendering for web

### Styling & Animation
- **Tailwind CSS v4**: Utility-first CSS framework with PostCSS integration
- **Motion v12**: Animation library for gesture-based interactions and spring physics
- **clsx**: Utility for conditional className composition

### UI Utilities
- **react-merge-refs**: Combines multiple React refs into one (likely for motion + DOM refs)
- **react-use-motion-measure**: Hook for measuring element dimensions with Motion

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting with Next.js configuration
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind CSS v4

### Image Assets
The application references image assets in `/top-icons/` directory for tab navigation icons (not shown in repository contents but referenced in code).