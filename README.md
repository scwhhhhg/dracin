# 🎬 Drama Streaming Website - Multi-Provider Platform

Modern, premium drama streaming website that aggregates content from **14 different providers** via dramabos.asia API.

## 🌟 Features

### Multi-Provider Integration
- ✅ **14 Providers Supported**:
  - RadReel
  - FlickReels
  - DotDrama
  - NetShort
  - ShortMax
  - SnackShort
  - MintShorts
  - Bobo
  - ReelShort
  - GoodShort
  - DramaBox
  - Flixi
  - DramaCool
  - KissAsian

- ✅ **Automatic Aggregation**: Fetches and combines content from all providers
- ✅ **Smart Deduplication**: Removes duplicate content based on title
- ✅ **Provider Tracking**: Each drama displays its source provider
- ✅ **Popularity Sorting**: Content sorted by heat/popularity across all providers

### Core Features
- 🏠 **Homepage**: Auto-carousel with top 60 dramas from all providers
- 🔍 **Universal Search**: Search across all 14 providers simultaneously
- 🔥 **Trending**: Aggregated trending content from top 5 providers
- 🎭 **Genres**: Browse dramas by category
- 📺 **Drama Details**: Comprehensive information with episode lists
- ▶️ **Video Player**: HLS streaming with error handling
- 📱 **Fully Responsive**: Mobile-first design
- ⚡ **Fast Loading**: Parallel API requests with retry logic
- 🎨 **Premium UI**: Glassmorphism, gradients, smooth animations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel
```

## 📡 API Integration

### Architecture

The application uses a multi-provider architecture that:
1. Fetches data from all 14 providers in parallel
2. Aggregates and deduplicates results
3. Sorts by popularity (heat score)
4. Tracks provider source for each drama

### Key Functions

#### `fetchHomeAll(limit: number)`
Fetches dramas from ALL 14 providers, combines them, and returns top results.

```typescript
import { fetchHomeAll } from "@/lib/api";

// Get top 60 dramas from all providers
const dramas = await fetchHomeAll(60);
```

#### `fetchSearchAll(keyword: string, limit: number)`
Searches across ALL 14 providers simultaneously.

```typescript
import { fetchSearchAll } from "@/lib/api";

// Search all providers
const results = await fetchSearchAll("romance", 30);
```

#### `fetchTrending(limit: number)`
Get trending dramas from top 5 providers.

```typescript
import { fetchTrending } from "@/lib/api";

// Get trending content
const trending = await fetchTrending(40);
```

#### `fetchByGenre(genre: string, limit: number)`
Fetch dramas by genre across all providers.

```typescript
import { fetchByGenre } from "@/lib/api";

// Get action dramas
const actionDramas = await fetchByGenre("action", 30);
```

### Provider ID Format

Each drama has a compound ID format: `{provider}:{originalId}`

Examples:
- `radreel:12345`
- `dramabox:67890`
- `reelshort:abcde`

This allows the system to route requests to the correct provider API.

## 🎨 UI Components

### DramaCard
- Provider badge showing source
- HOT badge for popular content
- Rating display
- View count
- Hover animations
- Loading states

### Video Player
- HLS streaming support
- Loading overlay
- Error handling with retry
- Poster image support
- Native controls

### Search
- Real-time input
- Multi-provider results
- Suggestions
- Empty states

## 📊 Performance

- **Parallel Fetching**: All provider APIs called simultaneously
- **Timeout Protection**: 10-second timeout with exponential backoff
- **Error Resilience**: Continues even if some providers fail
- **Caching**: 1-hour revalidation for static content
- **Lazy Loading**: Images loaded on demand with skeleton states

## 🔧 Configuration

### Environment Variables

No environment variables needed! The API is publicly accessible.

### Provider Configuration

Add or remove providers in `src/lib/api.ts`:

```typescript
export const PROVIDERS = [
    'radreel',
    'flickreels',
    // ... add more providers
] as const;
```

## 📱 Pages

1. **Homepage** (`/`)
   - Auto-carousel hero (5s interval)
   - Trending dramas (from all providers)
   - Latest episodes
   - CTA sections

2. **Search** (`/search?q=...`)
   - Multi-provider search results
   - Search suggestions
   - Empty state with CTAs

3. **Trending** (`/trending`)
   - Featured top drama
   - Grid of trending shows
   - From top 5 providers

4. **Genres** (`/genres`)
   - Category browsing
   - Links to genre searches

5. **Drama Detail** (`/drama/[id]`)
   - Full drama information
   - Episode grid (paginated)
   - Provider badge
   - Cinematic header

6. **Watch** (`/watch/[id]/[seq]`)
   - HLS video player
   - Episode playlist
   - Navigation controls
   - Download option

7. **404** (`/not-found`)
   - Animated error page
   - Quick navigation links

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Video**: HLS.js
- **API**: dramabos.asia (14 providers)
- **Deployment**: Vercel

## 📈 API Statistics

Use `getProviderStats()` to get analytics:

```typescript
import { getProviderStats } from "@/lib/api";

const stats = await getProviderStats();
// Returns: { provider, count, avgHeat }[] sorted by avgHeat
```

## 🎯 Best Practices

1. **Always use multi-provider functions** for best content diversity
2. **Provider-specific functions** available for targeted queries
3. **Error handling** is built-in with try-catch and Promise.allSettled
4. **Results are auto-sorted** by popularity (heat)
5. **Duplicates removed** automatically in multi-provider fetches

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build and serve the `.next` folder:

```bash
npm run build
npm start
```

## 📄 License

MIT

## 👏 Credits

- **API**: [dramabos.asia](https://dramabos.asia) by [@nanomilkiss](https://t.me/nanomilkiss)
- **Design**: Premium UI with glassmorphism
- **Icons**: Lucide React
- **Fonts**: Outfit (Google Fonts)

## 🔗 Links

- **Telegram**: [@nanomilkiss](https://t.me/nanomilkiss)
- **API Docs**: [https://dramabos.asia](https://dramabos.asia)

---

Made with ❤️ using Next.js and dramabos.asia API
