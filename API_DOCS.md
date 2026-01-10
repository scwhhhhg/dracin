# API Documentation - Multi-Provider Integration

## Overview

This project integrates with **14 different drama streaming providers** through the dramabos.asia API gateway. All providers follow the same API structure, making it easy to aggregate content.

## Base URL

```
https://dramabos.asia/api
```

## Supported Providers

| Provider | Identifier | Description |
|----------|------------|-------------|
| RadReel | `radreel` | Short drama platform |
| FlickReels | `flickreels` | Reels and short videos |
| DotDrama | `dotdrama` | Drama collection |
| NetShort | `netshort` | Short form content |
| ShortMax | `shortmax` | Premium shorts |
| SnackShort | `snackshort` | Bite-sized dramas |
| MintShorts | `mintshorts` | Fresh content |
| Bobo | `bobo` | Entertainment platform |
| ReelShort | `reelshort` | Quick dramas |
| GoodShort | `goodshort` | Quality shorts |
| DramaBox | `dramabox` | Drama collections |
| Flixi | `flixi` | Streaming service |
| DramaCool | `dramacool` | Asian dramas |
| KissAsian | `kissasian` | Asian content |

## API Endpoints

### 1. Home / Browse

```
GET /{provider}/api/v1/home?lang=id&tab=17&page={page}&limit={limit}
```

**Parameters:**
- `lang`: Language (default: `id` for Indonesian)
- `tab`: Category tab (17 for general)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
[
  {
    "fakeId": "string",
    "title": "string",
    "coverImgUrl": "string",
    "introduce": "string",
    "heat": number,
    "compilationsTags": ["string"]
  }
]
```

### 2. Search

```
GET /{provider}/api/v1/search?lang=id&keyword={keyword}
```

**Parameters:**
- `lang`: Language code
- `keyword`: Search query

**Response:**
```json
[
  {
    "fakeId": "string",
    "title": "string",
    "coverImgUrl": "string",
    "introduce": "string",
    "heat": number
  }
]
```

### 3. Drama Detail

```
GET /{provider}/api/v1/drama/{id}
```

**Response:**
```json
{
  "fakeId": "string",
  "title": "string",
  "coverImgUrl": "string",
  "introduce": "string",
  "heat": number,
  "compilationsTags": ["string"]
}
```

### 4. Episode List

```
GET /{provider}/api/v1/episodes/{id}
```

**Response:**
```json
[
  {
    "sequence": number,
    "title": "string",
    "vip": boolean
  }
]
```

###  5. Play URL

```
GET /{provider}/api/v1/play/{id}?seq={sequence}
```

**Parameters:**
- `seq`: Episode sequence number

**Response:**
```json
{
  "videoUrl": "string"
}
```

## Implementation Functions

### Single Provider Functions

#### fetchHome(provider, page)
```typescript
fetchHome('radreel', 1)
// Returns: Drama[] from RadReel provider
```

#### fetchSearch(keyword, provider)
```typescript
fetchSearch('romance', 'dramabox')
// Returns: Drama[] matching keyword from DramaBox
```

### Multi-Provider Functions

#### fetchHomeAll(limit)
```typescript
fetchHomeAll(50)
// Fetches from ALL 14 providers
// Combines, deduplicates, and sorts by popularity
// Returns: Top 50 Drama[] across all providers
```

#### fetchSearchAll(keyword, limit)
```typescript
fetchSearchAll('action', 30)
// Searches across ALL 14 providers
// Removes duplicate titles
// Returns: Top 30 results sorted by heat
```

#### fetchTrending(limit)
```typescript
fetchTrending(40)
// Fetches from top 5 providers
// Returns: Top 40 trending dramas
```

#### fetchByGenre(genre, limit)
```typescript
fetchByGenre('thriller', 30)
// Searches all providers for genre
// Returns: Top 30 matching dramas
```

## Drama ID Format

### Original Format
Each provider returns dramas with their own IDs:
```
Drama from provider: { fakeId: "abc123", ... }
```

### Our Format
We prefix IDs with provider for routing:
```
provider:originalId
Examples:
- radreel:abc123
- dramabox:xyz789
- reelshort:def456
```

### Parsing
```typescript
function parseProviderId(fakeId: string) {
  const [provider, id] = fakeId.split(':');
  return { provider, id };
}

// Usage
const { provider, id } = parseProviderId('radreel:abc123');
// provider = 'radreel'
// id = 'abc123'
```

## Error Handling

All functions include:
- **Retry Logic**: 3 attempts with exponential backoff
- **Timeout**: 10-second limit per request
- **Graceful Degradation**: Returns empty array on failure
- **Promise.allSettled**: Continues even if some providers fail

Example:
```typescript
// Even if 10 providers fail, you still get results from 4 successful ones
const results = await fetchHomeAll(50);
```

## Performance Optimization

### Parallel Requests
```typescript
// All 14 providers called simultaneously
Promise.allSettled(
  PROVIDERS.map(provider => fetchHome(provider, 1))
)
```

### Caching
```typescript
fetch(url, {
  next: { revalidate: 3600 } // 1 hour cache
})
```

### Deduplication
```typescript
// Removes duplicate titles, keeps highest heat
const uniqueResults = allResults.reduce((acc, drama) => {
  const existing = acc.find(d => 
    d.title.toLowerCase() === drama.title.toLowerCase()
  );
  if (!existing || drama.heat > existing.heat) {
    return [...acc.filter(d => 
      d.title.toLowerCase() !== drama.title.toLowerCase()
    ), drama];
  }
  return acc;
}, []);
```

## Usage Examples

### Homepage
```typescript
export default async function Home() {
  // Get diverse content from all 14 providers
  const dramas = await fetchHomeAll(60);
  
  const featured = dramas.slice(0, 5);  // For carousel
  const trending = dramas.slice(5, 13); // Popular section
  const latest = dramas.slice(13);      // Latest section
  
  return <HomeClient dramas={dramas} />;
}
```

### Search
```typescript
export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  
  // Search all providers for maximum results
  const results = await fetchSearchAll(q, 40);
  
  return <SearchPageClient query={q} results={results} />;
}
```

### Trending
```typescript
export default async function TrendingPage() {
  // Get from top 5 most popular providers
  const dramas = await fetchTrending(50);
  
  return <TrendingPageClient dramas={dramas} />;
}
```

### Drama Detail
```typescript
export default async function DramaPage({ params }) {
  const { id } = await params;
  
  // Automatically routes to correct provider
  const drama = await fetchDramaDetail(id);        // radreel:123 → radreel API
  const episodes = await fetchEpisodeList(id);
  
  return <DramaPageClient drama={drama} episodes={episodes} />;
}
```

## Provider Statistics

Get analytics on all providers:

```typescript
const stats = await getProviderStats();

// Returns:
[
  {
    provider: 'radreel',
    count: 20,
    avgHeat: 85000
  },
  {
    provider: 'dramabox',
    count: 18,
    avgHeat: 72000
  },
  // ... sorted by avgHeat
]
```

## Rate Limiting

The API has no documented rate limits, but we implement:
- 10-second timeout per request
- Retry with exponential backoff (1s, 2s, 3s)
- Parallel requests capped at 14 (one per provider)

## Best Practices

1. **Use Multi-Provider Functions** for diverse content
2. **Cache Results** with Next.js revalidation
3. **Handle Errors Gracefully** - don't break on single provider failure
4. **Sort by Heat** for popularity-based listings
5. **Deduplicate** when combining multiple sources
6. **Track Provider** to route requests correctly

## Troubleshooting

### "No results found"
- Try different providers: some have more content than others
- Check if keyword matches provider's catalog
- Verify API endpoint is accessible

### "Timeout errors"
- Normal for some providers during peak times
- Retry logic handles this automatically
- Function returns partial results from successful providers

### "Video won't play"
- Some videos may require VPN
- Check if videoUrl is valid HLS stream
- Browser may not support HLS (use hls.js)

## API Credits

API provided by:
- **Website**: https://dramabos.asia
- **Developer**: [@nanomilkiss](https://t.me/nanomilkiss)
- **Telegram Group**: Join for updates and support

⚠️ **Note**: API may change without notice. Join Telegram group for updates.

---

Last Updated: January 2026
