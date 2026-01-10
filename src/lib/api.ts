const BASE_URL = 'https://dramabos.asia/api';

// All 14 providers from dramabos.asia
export const PROVIDERS = [
    'radreel',
    'flickreels',
    'dotdrama',
    'netshort',
    'shortmax',
    'snackshort',
    'mintshorts',
    'bobo',
    'reelshort',
    'goodshort',
    'dramabox',
    'flixi',
    'dramacool',
    'kissasian'
] as const;

export type Provider = typeof PROVIDERS[number];

export interface Drama {
    fakeId: string;
    title: string;
    cover: string;
    summary?: string;
    heat?: number;
    tag?: string;
    provider?: Provider; // Track which provider this drama is from
}

export interface Episode {
    seq: number;
    title: string;
    vip: boolean;
}

export interface DramaDetail extends Drama {
    episodes: Episode[];
}

// Helper function to fetch with retry
async function fetchWithRetry(url: string, retries = 2): Promise<any> {
    for (let i = 0; i <= retries; i++) {
        try {
            const res = await fetch(url, {
                next: { revalidate: 3600 },
                signal: AbortSignal.timeout(10000) // 10s timeout
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            if (i === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        }
    }
}

// Fetch from a single provider
export async function fetchHome(provider: Provider = 'radreel', page: number = 1): Promise<Drama[]> {
    try {
        const data = await fetchWithRetry(
            `${BASE_URL}/${provider}/api/v1/home?lang=id&tab=17&page=${page}&limit=20`
        );

        return (Array.isArray(data) ? data : []).map((item: any) => ({
            fakeId: `${provider}:${item.fakeId}`, // Prefix with provider
            title: item.title,
            cover: item.coverImgUrl,
            summary: item.introduce,
            heat: item.heat || 0,
            tag: item.compilationsTags?.[0] || 'Drama',
            provider: provider
        })) as Drama[];
    } catch (error) {
        console.error(`Error fetching home from ${provider}:`, error);
        return [];
    }
}

// Fetch from ALL providers and combine
export async function fetchHomeAll(limit: number = 50): Promise<Drama[]> {
    try {
        // Fetch from all providers in parallel
        const results = await Promise.allSettled(
            PROVIDERS.map(provider => fetchHome(provider, 1))
        );

        // Combine all successful results
        const allDramas = results
            .filter((result): result is PromiseFulfilledResult<Drama[]> => result.status === 'fulfilled')
            .flatMap(result => result.value);

        // Sort by heat (popularity) and limit
        return allDramas
            .sort((a, b) => (b.heat || 0) - (a.heat || 0))
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching from all providers:', error);
        return [];
    }
}

// Search across a single provider
export async function fetchSearch(keyword: string, provider: Provider = 'radreel'): Promise<Drama[]> {
    try {
        const data = await fetchWithRetry(
            `${BASE_URL}/${provider}/api/v1/search?lang=id&keyword=${encodeURIComponent(keyword)}`
        );

        return (Array.isArray(data) ? data : []).map((item: any) => ({
            fakeId: `${provider}:${item.fakeId}`,
            title: item.title,
            cover: item.coverImgUrl,
            summary: item.introduce,
            heat: item.heat || 0,
            provider: provider
        })) as Drama[];
    } catch (error) {
        console.error(`Error searching ${provider}:`, error);
        return [];
    }
}

// Search across ALL providers
export async function fetchSearchAll(keyword: string, limit: number = 30): Promise<Drama[]> {
    try {
        // Search all providers in parallel
        const results = await Promise.allSettled(
            PROVIDERS.map(provider => fetchSearch(keyword, provider))
        );

        // Combine all successful results
        const allResults = results
            .filter((result): result is PromiseFulfilledResult<Drama[]> => result.status === 'fulfilled')
            .flatMap(result => result.value);

        // Remove duplicates by title and sort by relevance (heat)
        const uniqueResults = allResults.reduce((acc, drama) => {
            const existing = acc.find(d => d.title.toLowerCase() === drama.title.toLowerCase());
            if (!existing || (drama.heat || 0) > (existing.heat || 0)) {
                return [...acc.filter(d => d.title.toLowerCase() !== drama.title.toLowerCase()), drama];
            }
            return acc;
        }, [] as Drama[]);

        return uniqueResults
            .sort((a, b) => (b.heat || 0) - (a.heat || 0))
            .slice(0, limit);
    } catch (error) {
        console.error('Error searching all providers:', error);
        return [];
    }
}

// Parse provider and ID from combined fakeId
function parseProviderId(fakeId: string): { provider: Provider; id: string } {
    const parts = fakeId.split(':');
    if (parts.length === 2 && PROVIDERS.includes(parts[0] as Provider)) {
        return { provider: parts[0] as Provider, id: parts[1] };
    }
    // Fallback to radreel if no provider prefix
    return { provider: 'radreel', id: fakeId };
}

export async function fetchDramaDetail(fakeId: string): Promise<DramaDetail | null> {
    try {
        if (!fakeId || fakeId === 'undefined') return null;

        const { provider, id } = parseProviderId(fakeId);
        const data = await fetchWithRetry(`${BASE_URL}/${provider}/api/v1/drama/${id}`);

        return {
            fakeId: fakeId, // Keep the combined ID
            title: data.title,
            cover: data.coverImgUrl,
            summary: data.introduce,
            heat: data.heat || 0,
            tag: data.compilationsTags?.[0] || 'Drama',
            provider: provider,
            episodes: []
        } as DramaDetail;
    } catch (error) {
        console.error('Error fetching drama detail:', error);
        return null;
    }
}

export async function fetchEpisodeList(fakeId: string): Promise<Episode[]> {
    try {
        if (!fakeId || fakeId === 'undefined') return [];

        const { provider, id } = parseProviderId(fakeId);
        const data = await fetchWithRetry(`${BASE_URL}/${provider}/api/v1/episodes/${id}`);

        return (Array.isArray(data) ? data : []).map((item: any) => ({
            seq: item.sequence,
            title: item.title || `Episode ${item.sequence}`,
            vip: item.vip || false
        })) as Episode[];
    } catch (error) {
        console.error('Error fetching episodes:', error);
        return [];
    }
}

export async function fetchPlayUrl(fakeId: string, seq: number): Promise<string> {
    try {
        const { provider, id } = parseProviderId(fakeId);
        const data = await fetchWithRetry(`${BASE_URL}/${provider}/api/v1/play/${id}?seq=${seq}`);

        return data?.videoUrl || '';
    } catch (error) {
        console.error('Error fetching play url:', error);
        return '';
    }
}

// Get trending dramas from top 5 providers
export async function fetchTrending(limit: number = 40): Promise<Drama[]> {
    try {
        const topProviders: Provider[] = ['radreel', 'flickreels', 'dotdrama', 'reelshort', 'dramabox'];

        const results = await Promise.allSettled(
            topProviders.map(provider => fetchHome(provider, 1))
        );

        const allDramas = results
            .filter((result): result is PromiseFulfilledResult<Drama[]> => result.status === 'fulfilled')
            .flatMap(result => result.value);

        // Sort by heat and return top dramas
        return allDramas
            .sort((a, b) => (b.heat || 0) - (a.heat || 0))
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching trending:', error);
        return [];
    }
}

// Get dramas by specific tag/genre across providers
export async function fetchByGenre(genre: string, limit: number = 30): Promise<Drama[]> {
    try {
        // Use search to find dramas matching the genre
        return await fetchSearchAll(genre, limit);
    } catch (error) {
        console.error('Error fetching by genre:', error);
        return [];
    }
}

// Get provider statistics
export async function getProviderStats(): Promise<{ provider: Provider; count: number; avgHeat: number }[]> {
    try {
        const results = await Promise.allSettled(
            PROVIDERS.map(async (provider) => {
                const dramas = await fetchHome(provider, 1);
                const avgHeat = dramas.length > 0
                    ? dramas.reduce((sum, d) => sum + (d.heat || 0), 0) / dramas.length
                    : 0;
                return {
                    provider,
                    count: dramas.length,
                    avgHeat
                };
            })
        );

        return results
            .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
            .map(result => result.value)
            .sort((a, b) => b.avgHeat - a.avgHeat);
    } catch (error) {
        console.error('Error getting provider stats:', error);
        return [];
    }
}

