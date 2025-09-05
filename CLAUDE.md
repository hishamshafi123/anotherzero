# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two CRM dashboard implementations focused on **interest-based lead generation** from Instagram and Facebook interactions:

1. **crm-dashboard** - React Create React App version (legacy)
2. **crm-dashboard-nextjs** - Next.js 15 with TypeScript version (**primary**)

The system extracts interest signals from social media comments/DMs, manages contact engagement levels, and runs targeted campaigns with A/B testing. **No conversation storage** - focuses purely on interest detection and lead nurturing.

## Development Commands

### React App (crm-dashboard)
```bash
cd crm-dashboard
npm install           # Install dependencies
npm start            # Start development server on http://localhost:3000
npm test             # Run test runner in watch mode
npm run build        # Build for production (outputs to /build folder)
```

### Next.js App (crm-dashboard-nextjs)
```bash
cd crm-dashboard-nextjs
npm install           # Install dependencies
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Architecture

### React App (crm-dashboard)
- **Single-file architecture**: Main dashboard logic in `src/Dashboard.js` (598 lines)
- **Entry point**: `src/App.js` imports and renders Dashboard component
- **Styling**: Uses Tailwind CSS with custom utility classes
- **Charts**: Recharts library for data visualization
- **Icons**: Lucide React icon library
- **Animation**: Framer Motion for UI animations

### Next.js App (crm-dashboard-nextjs)
- **Component-based architecture**: Modular components in `src/components/`
- **App Router**: Uses Next.js 15 App Router pattern
- **TypeScript**: Full TypeScript implementation
- **Data layer**: Mock data in `src/data/mockData.ts`
- **Styling**: Tailwind CSS v4 with PostCSS

### Key Components (Next.js version)
- `Dashboard.tsx` - Main dashboard with interest-based KPIs
- `ContactList.tsx` - Interest-tagged contact management
- `Card.tsx` family - Reusable card UI components
- `Kpi.tsx` - Key Performance Indicator displays
- Various UI components: Badge, FilterPill, ChannelSwitch

### API Routes
- `/api/webhooks/meta` - Simplified Meta webhook for interest detection
- `/api/campaigns/dispatch` - Campaign dispatch to n8n (targets interested contacts only)
- `/api/analytics/dashboard` - Interest-focused analytics

### Types & Utilities
- `src/types/index.ts` - TypeScript interfaces for interest-based data
- `src/utils/analytics.ts` - Interest detection and engagement calculations

## Data Structure

**Simplified for interest detection:**
- **engagementByDay** - Daily contacts, interest detection, clicks
- **campaignCTr** - Campaign click-through rates (removed purchase tracking)
- **channelSplit** - Instagram/Facebook distribution
- **campaigns** - Campaign performance (CTR focus, no revenue)
- **abTests** - A/B test results (click-based, not purchase-based)
- **recentContacts** - Contact activity with interest levels

## Dependencies

### Shared Dependencies
- React 19.1.x
- Framer Motion 12.x - UI animations
- Lucide React 0.542.x - Icon library
- Recharts 3.x - Charts and data visualization
- Tailwind CSS 4.x - Utility-first styling

### React App Specific
- React Scripts 5.0.1 - Build tooling
- Testing Library suite - Testing utilities

### Next.js App Specific
- Next.js 15.5.2 - React framework
- TypeScript 5.x - Type checking
- ESLint 9.x - Code linting

## Deployment

Both applications are production-ready:
- **React App**: Deploy `build/` folder contents to static hosting
- **Next.js App**: Deploy to Vercel, Netlify, or similar platforms
- Configuration files included for Vercel (`vercel.json`) and Netlify (`_redirects`, `netlify.toml`)

## Design System

Theme colors:
- **Brand Blue**: #1d4ed8 (blue-700)
- **Brand Black**: #0b0f19 (near-black)
- **Brand Blue Light**: #dbeafe (blue-100)

The UI follows a clean, high-contrast design with card-based layouts and consistent spacing using Tailwind utilities.

## Database Schema (Migration Available)

See `database/migrations/001_refactor_to_interest_based.sql` for the simplified schema that:
- **Removes**: conversations, messages, purchases, followups tables
- **Simplifies**: contacts table with interest_level field
- **Adds**: events table for analytics tracking
- **Focus**: Interest detection over conversation management

## Key Principles

1. **Interest Detection Over Message Storage** - Analyze messages for interest, don't store them
2. **Click Tracking Over Purchase Tracking** - Measure engagement, not sales conversion
3. **Simple Campaigns Over Complex Sequences** - A/B test messages, focus on interested contacts
4. **Real-time Analytics** - Show interest rates, CTR, and engagement metrics