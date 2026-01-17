// ========================================
// CONFIGURATION & STATE
// ========================================
const CONFIG = {
    // Drama APIs (Working endpoints)
    dramaAPI: 'https://dramabos.asia/api',

    // API Endpoints (verified working)
    apiEndpoints: {
        flickreels: {
            home: '/flick/home',
            detail: '/flick/drama',
            episodes: '/flick/drama', // Contains episodes in detail
            play: '/flick/drama' // Video URLs included in detail
        },
        radreel: {
            home: '/radreel/api/v1/home',
            detail: '/radreel/api/v1/drama',
            episodes: '/radreel/api/v1/episodes',
            play: '/radreel/api/v1/play'
        },
        dramabox: {
            home: '/dramabox/api/foryou',
            detail: '/dramabox/api/drama',
            episodes: '/dramabox/api/chapters',
            play: '/dramabox/api/watch/player' // NEW: Working endpoint!
        },
        meloshort: {
            home: '/meloshort/api/home',
            detail: '/meloshort/api/drama',
            episodes: '/meloshort/api/episodes',
            play: '/meloshort/api/episode'  // Returns full_play_url (.m3u8)
        },
        starshort: {
            home: '/starshort/api/home',
            detail: '/starshort/api/drama',
            episodes: '/starshort/api/episodes',
            play: '/starshort/api/play'
        },
        goodshort: {
            home: '/goodshort/api/home',
            detail: '/goodshort/api/drama',
            episodes: '/goodshort/api/episodes',
            play: '/goodshort/api/play'
        },
        netshort: {
            home: '/netshort/api/home',
            detail: '/netshort/api/drama',
            episodes: '/netshort/api/episodes',
            play: '/netshort/api/play'
        },
        hishort: {
            home: '/hishort/api/home',
            detail: '/hishort/api/drama',
            episodes: '/hishort/api/episodes',
            play: '/hishort/api/play'
        }
    },

    // Current filters
    filters: {
        source: 'all', // all, flickreels, radreel, dramabox
        genre: 'all',  // all, romance, drama, action, etc
        sort: 'latest' // latest, popular, rating
    },

    // Cache duration (15 minutes)
    cacheDuration: 15 * 60 * 1000,

    // Items per page
    itemsPerPage: 20
};

const STATE = {
    currentPage: 'home',
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    cache: {},
    searchTimeout: null
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const utils = {
    // Show toast notification
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    },

    // Format rating
    formatRating(rating) {
        if (!rating) return 'N/A';
        return parseFloat(rating).toFixed(1);
    },

    // Truncate text
    truncate(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Get cached data
    getCache(key) {
        const cached = STATE.cache[key];
        if (!cached) return null;

        const now = Date.now();
        if (now - cached.timestamp > CONFIG.cacheDuration) {
            delete STATE.cache[key];
            return null;
        }

        return cached.data;
    },

    // Set cached data
    setCache(key, data) {
        STATE.cache[key] = {
            data,
            timestamp: Date.now()
        };
    },

    // Generate unique ID
    generateId(item) {
        return `${item.source || 'unknown'}_${item.fakeId || item.id || Math.random()}`;
    },

    // Check if item is favorited
    isFavorite(id) {
        return STATE.favorites.some(fav => fav.id === id);
    },

    // Toggle favorite
    toggleFavorite(item) {
        const id = utils.generateId(item);
        const index = STATE.favorites.findIndex(fav => fav.id === id);

        if (index > -1) {
            STATE.favorites.splice(index, 1);
            utils.showToast('Dihapus dari favorit');
        } else {
            STATE.favorites.push({ ...item, id });
            utils.showToast('Ditambahkan ke favorit');
        }

        localStorage.setItem('favorites', JSON.stringify(STATE.favorites));

        // Update favorite buttons
        document.querySelectorAll(`.favorite-btn[data-id="${id}"]`).forEach(btn => {
            btn.classList.toggle('active');
        });

        // Refresh favorites page if active
        if (STATE.currentPage === 'favorites') {
            renderFavorites();
        }
    },

    // Scroll to section
    scrollToSection(id) {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// ========================================
// DUMMY DATA (Fallback)
// ========================================
const DUMMY_DATA = {
    dramas: [
        {
            fakeId: '1',
            title: 'My Precious CEO',
            coverImgUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
            score: 9.2,
            source: 'radreel',
            introduce: 'Seorang CEO muda yang dingin jatuh cinta dengan sekretarisnya yang ceria.',
            year: '2024',
            type: 'Drama',
            isNew: true
        },
        {
            fakeId: '2',
            title: 'Revenge in Love',
            coverImgUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
            score: 8.8,
            source: 'radreel',
            introduce: 'Kisah balas dendam yang berubah menjadi cinta sejati.',
            year: '2024',
            type: 'Drama'
        },
        {
            fakeId: '3',
            title: 'Flash Marriage',
            coverImgUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop',
            score: 9.0,
            source: 'dramabox',
            introduce: 'Pernikahan kontrak yang berakhir dengan cinta sejati.',
            year: '2024',
            type: 'Romance',
            isNew: true
        },
        {
            fakeId: '4',
            title: 'Hidden Billionaire',
            coverImgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
            score: 8.5,
            source: 'dramabox',
            introduce: 'Seorang miliarder menyamar sebagai orang biasa untuk menemukan cinta sejati.',
            year: '2024',
            type: 'Romance'
        },
        {
            fakeId: '5',
            title: 'The Substitute Wife',
            coverImgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
            score: 8.7,
            source: 'netshort',
            introduce: 'Menggantikan kakaknya untuk menikahi CEO yang misterius.',
            year: '2024',
            type: 'Drama'
        },
        {
            fakeId: '6',
            title: 'Love After Divorce',
            coverImgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
            score: 9.1,
            source: 'netshort',
            introduce: 'Setelah perceraian, dia menemukan dirinya dan cinta yang baru.',
            year: '2024',
            type: 'Drama',
            isNew: true
        },
        {
            fakeId: '7',
            title: 'My Contract Husband',
            coverImgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
            score: 8.9,
            source: 'radreel',
            introduce: 'Pernikahan kontrak yang penuh dengan kejutan dan cinta.',
            year: '2024',
            type: 'Romance'
        },
        {
            fakeId: '8',
            title: 'Reborn Rich Lady',
            coverImgUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
            score: 9.3,
            source: 'dramabox',
            introduce: 'Terlahir kembali untuk membalas dendam dan mengubah takdirnya.',
            year: '2024',
            type: 'Fantasy',
            isNew: true
        },
        {
            fakeId: '9',
            title: 'Mafia King\'s Love',
            coverImgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
            score: 8.6,
            source: 'netshort',
            introduce: 'Raja mafia yang kejam jatuh cinta pada gadis polos.',
            year: '2024',
            type: 'Romance'
        },
        {
            fakeId: '10',
            title: 'Unexpected Wife',
            coverImgUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
            score: 8.8,
            source: 'radreel',
            introduce: 'Pertemuan tak terduga yang berujung pada pernikahan.',
            year: '2024',
            type: 'Romance'
        },
        {
            fakeId: '11',
            title: 'Secret Love',
            coverImgUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
            score: 9.0,
            source: 'dramabox',
            introduce: 'Cinta terlarang antara dua dunia yang berbeda.',
            year: '2024',
            type: 'Drama',
            isNew: true
        },
        {
            fakeId: '12',
            title: 'Double Life',
            coverImgUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop',
            score: 8.7,
            source: 'netshort',
            introduce: 'Menjalani dua kehidupan berbeda dengan identitas rahasia.',
            year: '2024',
            type: 'Thriller'
        },
        {
            fakeId: '13',
            title: 'Perfect Match',
            coverImgUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop',
            score: 8.9,
            source: 'radreel',
            introduce: 'Pasangan sempurna yang ditakdirkan bersama.',
            year: '2024',
            type: 'Romance'
        },
        {
            fakeId: '14',
            title: 'CEO\'s Secret',
            coverImgUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop',
            score: 9.2,
            source: 'dramabox',
            introduce: 'Rahasia kelam seorang CEO yang terungkap.',
            year: '2024',
            type: 'Drama',
            isNew: true
        },
        {
            fakeId: '15',
            title: 'Love & Betrayal',
            coverImgUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=600&fit=crop',
            score: 8.5,
            source: 'netshort',
            introduce: 'Cinta yang diuji oleh pengkhianatan dan kebohongan.',
            year: '2024',
            type: 'Drama'
        },
        {
            fakeId: '16',
            title: 'My Secret Husband',
            coverImgUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
            score: 8.8,
            source: 'radreel',
            introduce: 'Suami rahasia dengan identitas yang mengejutkan.',
            year: '2024',
            type: 'Romance'
        },
        {
            fakeId: '17',
            title: 'Royal Romance',
            coverImgUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
            score: 9.1,
            source: 'dramabox',
            introduce: 'Cinta di antara keluarga kerajaan yang penuh intrik.',
            year: '2024',
            type: 'Romance',
            isNew: true
        },
        {
            fakeId: '18',
            title: 'Fake Marriage Real Love',
            coverImgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
            score: 8.6,
            source: 'netshort',
            introduce: 'Pernikahan palsu yang berubah menjadi cinta sejati.',
            year: '2024',
            type: 'Romance'
        },
        {
            fakeId: '19',
            title: 'Time Traveler\'s Wife',
            coverImgUrl: 'https://images.unsplash.com/photo-1502378735452-bc7d86632805?w=400&h=600&fit=crop',
            score: 9.4,
            source: 'radreel',
            introduce: 'Cinta melintasi waktu dan dimensi.',
            year: '2024',
            type: 'Fantasy',
            isNew: true
        },
        {
            fakeId: '20',
            title: 'Undercover Love',
            coverImgUrl: 'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?w=400&h=600&fit=crop',
            score: 8.7,
            source: 'dramabox',
            introduce: 'Cinta yang dimulai dari misi penyamaran.',
            year: '2024',
            type: 'Action'
        }
    ]
};

// ========================================
// API FUNCTIONS
// ========================================
const api = {
    // Fetch latest dramas from FlickReels (TERBARU)
    async fetchFlickReelsDramas(page = 1) {
        const cacheKey = `flickreels_home_${page}`;
        const cached = utils.getCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${CONFIG.dramaAPI}${CONFIG.apiEndpoints.flickreels.home}?page=${page}&page_size=20&lang=6`);

            if (!response.ok) {
                throw new Error('API response not ok');
            }

            const data = await response.json();

            // FlickReels returns data in data[0].list format
            const list = data.data?.[0]?.list || [];
            const dramas = list.map(item => ({
                ...item,
                id: item.playlet_id || item.id, // Use playlet_id as primary ID
                fakeId: item.playlet_id || item.id,
                playletId: item.playlet_id,
                source: 'flickreels',
                title: item.title,
                coverImgUrl: item.cover,
                image: item.cover,
                score: item.score || 8.5,
                rating: item.score || 8.5,
                introduce: item.introduce,
                type: item.playlet_tag_name?.[0] || 'Drama',
                genre: item.playlet_tag_name || ['Drama'],
                isNew: true
            }));

            if (dramas.length > 0) {
                utils.setCache(cacheKey, dramas);
                return dramas;
            }

            throw new Error('No data returned');
        } catch (error) {
            console.warn('Using dummy data for FlickReels due to error:', error.message);
            return DUMMY_DATA.dramas.filter(d => d.isNew).slice(0, 10);
        }
    },

    // Fetch drama list from RadReel
    async fetchRadReelDramas(page = 1) {
        const cacheKey = `radreel_home_${page}`;
        const cached = utils.getCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${CONFIG.dramaAPI}${CONFIG.apiEndpoints.radreel.home}?lang=id&tab=17&page=${page}&limit=20`);

            if (!response.ok) {
                throw new Error('API response not ok');
            }

            const data = await response.json();

            // RadReel returns array directly
            const dramas = (Array.isArray(data) ? data : []).map(item => ({
                ...item,
                id: item.compilationsId || item.fakeId || item.id, // Use compilationsId as primary ID
                fakeId: item.compilationsId || item.fakeId || item.id,
                compilationsId: item.compilationsId,
                source: 'radreel',
                title: item.title || item.name,
                coverImgUrl: item.coverImgUrl,
                image: item.coverImgUrl || item.coverVerticalUrl,
                score: item.score || 0,
                rating: item.score || 0,
                introduce: item.introduce,
                type: 'Drama',
                genre: ['Drama']
            }));

            if (dramas.length > 0) {
                utils.setCache(cacheKey, dramas);
                return dramas;
            }

            throw new Error('No data returned');
        } catch (error) {
            console.warn('Using dummy data for RadReel due to error:', error.message);
            return DUMMY_DATA.dramas.filter(d => d.source === 'radreel');
        }
    },

    // Fetch drama list from Dramabox
    async fetchDramaboxDramas(page = 1) {
        const cacheKey = `dramabox_home_${page}`;
        const cached = utils.getCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${CONFIG.dramaAPI}${CONFIG.apiEndpoints.dramabox.home}/${page}`);

            if (!response.ok) {
                throw new Error('API response not ok');
            }

            const data = await response.json();

            // Dramabox returns data.list
            const list = data.data?.list || [];
            const dramas = list.map(item => ({
                ...item,
                id: item.bookId || item.id, // Use bookId as primary ID
                fakeId: item.bookId || item.id,
                bookId: item.bookId,
                source: 'dramabox',
                title: item.bookName || item.title,
                coverImgUrl: item.cover,
                image: item.cover,
                score: item.score || 8.0,
                rating: item.score || 8.0,
                introduce: item.introduction,
                type: item.tags?.[0] || 'Drama',
                genre: item.tags || ['Drama']
            }));

            if (dramas.length > 0) {
                utils.setCache(cacheKey, dramas);
                return dramas;
            }

            throw new Error('No data returned');
        } catch (error) {
            console.warn('Using dummy data for Dramabox due to error:', error.message);
            return DUMMY_DATA.dramas.filter(d => d.source === 'dramabox');
        }
    },

    // Fetch NetShort dramas
    async fetchNetShortDramas(page = 1) {
        const cacheKey = `netshort_home_${page}`;
        const cached = utils.getCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${CONFIG.dramaAPI}/netshort/home?page=${page}`);

            if (!response.ok) {
                throw new Error('API response not ok');
            }

            const data = await response.json();

            // Normalize data
            const dramas = data.data?.map(item => ({
                ...item,
                source: 'netshort',
                title: item.title || item.name,
                image: item.coverImgUrl || item.coverVerticalUrl,
                rating: item.score || 0,
                type: 'drama'
            })) || [];

            if (dramas.length > 0) {
                utils.setCache(cacheKey, dramas);
                return dramas;
            }

            throw new Error('No data returned');
        } catch (error) {
            console.warn('Using dummy data for NetShort due to error:', error.message);
            // Return dummy data as fallback
            const dummyData = DUMMY_DATA.dramas
                .filter(d => d.source === 'netshort')
                .map(item => ({
                    ...item,
                    image: item.coverImgUrl,
                    rating: item.score
                }));
            return dummyData;
        }
    },

    // Search dramas
    async searchDramas(query) {
        if (!query || query.trim().length < 2) return [];

        const cacheKey = `search_${query}`;
        const cached = utils.getCache(cacheKey);
        if (cached) return cached;

        try {
            // Search RadReel
            const radreelResponse = await fetch(`${CONFIG.dramaAPI}/v1/search?q=${encodeURIComponent(query)}&lang=id`);

            if (!radreelResponse.ok) {
                throw new Error('API search failed');
            }

            const radreelData = await radreelResponse.json();
            const radreelResults = radreelData.data?.map(item => ({
                ...item,
                source: 'radreel',
                title: item.title || item.name,
                image: item.coverImgUrl || item.coverVerticalUrl,
                rating: item.score || 0,
                type: 'drama'
            })) || [];

            // Search Dramabox
            const dramaboxResponse = await fetch(`${CONFIG.dramaAPI}/search/${encodeURIComponent(query)}/1`);
            const dramaboxData = await dramaboxResponse.json();
            const dramaboxResults = dramaboxData.data?.map(item => ({
                ...item,
                source: 'dramabox',
                title: item.title || item.name,
                image: item.coverImgUrl || item.coverVerticalUrl,
                rating: item.score || 0,
                type: 'drama'
            })) || [];

            // Combine results
            const results = [...radreelResults, ...dramaboxResults];

            if (results.length > 0) {
                utils.setCache(cacheKey, results);
                return results;
            }

            throw new Error('No results from API');
        } catch (error) {
            console.warn('Using dummy data for search due to error:', error.message);
            // Search in dummy data as fallback
            const searchLower = query.toLowerCase();
            const results = DUMMY_DATA.dramas
                .filter(item =>
                    item.title.toLowerCase().includes(searchLower) ||
                    item.introduce.toLowerCase().includes(searchLower) ||
                    item.type.toLowerCase().includes(searchLower)
                )
                .map(item => ({
                    ...item,
                    image: item.coverImgUrl,
                    rating: item.score
                }));
            return results;
        }
    },

    // Fetch drama details
    async fetchDramaDetails(id, source) {
        const cacheKey = `detail_${source}_${id}`;
        const cached = utils.getCache(cacheKey);
        if (cached) return cached;

        try {
            let url;
            if (source === 'flickreels') {
                url = `${CONFIG.dramaAPI}${CONFIG.apiEndpoints.flickreels.home}?id=${id}`;
            } else if (source === 'radreel') {
                url = `${CONFIG.dramaAPI}${CONFIG.apiEndpoints.radreel.detail}/${id}`;
            } else if (source === 'dramabox') {
                url = `${CONFIG.dramaAPI}${CONFIG.apiEndpoints.dramabox.detail}/${id}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('API response not ok');
            }

            const data = await response.json();

            utils.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.warn('Using dummy data for details due to error:', error.message);
            // Find in dummy data as fallback
            const drama = DUMMY_DATA.dramas.find(d => d.fakeId === id && d.source === source);
            if (drama) {
                return {
                    data: drama,
                    code: 200
                };
            }
            return null;
        }
    },

    // Fetch episodes
    async fetchEpisodes(id, source) {
        const cacheKey = `episodes_${source}_${id}`;
        const cached = utils.getCache(cacheKey);
        if (cached) return cached;

        try {
            let url;
            if (source === 'flickreels') {
                // FlickReels uses detail endpoint that includes episodes
                url = `${CONFIG.dramaAPI}/flick/detail?playlet_id=${id}`;
            } else if (source === 'radreel') {
                url = `${CONFIG.dramaAPI}/radreel/api/v1/episodes/${id}`;
            } else if (source === 'dramabox') {
                url = `${CONFIG.dramaAPI}/dramabox/api/chapters/${id}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            // Normalize response structure
            let normalized;
            if (source === 'flickreels') {
                // FlickReels detail returns episodes in data.episodes
                normalized = {
                    data: data.data?.episodes || data.data?.episode_list || []
                };
            } else if (source === 'dramabox') {
                // Dramabox returns chapterList
                normalized = {
                    data: data.data?.chapterList || data.data || []
                };
            } else {
                // RadReel returns array directly
                normalized = {
                    data: Array.isArray(data) ? data : (data.data || [])
                };
            }

            utils.setCache(cacheKey, normalized);
            return normalized;
        } catch (error) {
            console.error('Error fetching episodes:', error);
            return null;
        }
    },

    // Fetch video streaming URL
    async fetchVideoUrl(episodeId, dramaId, source, episodeIndex = 1) {
        console.log('fetchVideoUrl called:', { episodeId, dramaId, source, episodeIndex });

        try {
            let url;

            if (source === 'flickreels') {
                url = `${CONFIG.dramaAPI}/flick/drama/${dramaId}?lang=6`;
                // FlickReels includes video URLs in drama detail for each episode
            } else if (source === 'radreel') {
                url = `${CONFIG.dramaAPI}/radreel/api/v1/play/${episodeId}`;
            } else if (source === 'dramabox') {
                // ✅ NEW WORKING ENDPOINT! Uses bookId + index pattern
                url = `${CONFIG.dramaAPI}/dramabox/api/watch/player?bookId=${dramaId}&index=${episodeIndex}&lang=in`;
            } else if (source === 'meloshort') {
                // MeloShort uses dramaId/chapterId pattern
                url = `${CONFIG.dramaAPI}/meloshort/api/episode/${dramaId}/${episodeId}`;
            } else if (source === 'starshort' || source === 'goodshort' || source === 'netshort' || source === 'hishort') {
                // Other short drama platforms use similar pattern
                url = `${CONFIG.dramaAPI}/${source}/api/play/${episodeId}`;
            }

            console.log('Fetching video URL from:', url);
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`API returned ${response.status}:`, response.statusText);
                return null;
            }

            const data = await response.json();
            console.log('Video URL response:', data);

            // Extract video URL based on source
            let videoUrl = null;

            if (source === 'dramabox') {
                // ✅ FIXED: Dramabox returns direct videoUrl, NOT playInfo array!
                // Response structure: { success: true, data: { videoUrl: "https://..." } }
                videoUrl = data.data?.videoUrl || data.videoUrl || null;

                console.log('Dramabox extraction:', {
                    hasDataVideoUrl: !!data.data?.videoUrl,
                    hasVideoUrl: !!data.videoUrl,
                    extracted: videoUrl
                });
            } else if (source === 'meloshort') {
                // MeloShort returns full_play_url (.m3u8)
                videoUrl = data.data?.full_play_url || data.data?.play_url || null;
            } else if (source === 'flickreels') {
                // FlickReels has video URLs in episodes array
                const episodes = data.data?.episodes || [];
                const episode = episodes.find(ep => ep.episode_id == episodeId) || episodes[episodeIndex - 1];
                videoUrl = episode?.video_url || episode?.url || null;
            } else {
                // Generic extraction for other sources
                videoUrl = data.data?.videoUrl || data.data?.url || data.data?.play_url ||
                    data.videoUrl || data.url || data.play_url || null;
            }

            if (videoUrl) {
                console.log('✅ Video URL extracted:', videoUrl);
            } else {
                console.warn('⚠️ No video URL found in response');
                console.warn('Response data:', data);
            }

            return videoUrl;
        } catch (error) {
            console.error('Error fetching video URL:', error);
            return null;
        }
    }
};

// ========================================
// RENDER FUNCTIONS
// ========================================
const render = {
    // Create content card
    createCard(item) {
        const id = utils.generateId(item);
        const isFav = utils.isFavorite(id);

        // Use source-specific ID fields
        let dramaId;
        if (item.source === 'flickreels') {
            dramaId = item.playletId || item.playlet_id || item.fakeId || item.id || '';
        } else if (item.source === 'radreel') {
            dramaId = item.compilationsId || item.fakeId || item.id || '';
        } else if (item.source === 'dramabox') {
            dramaId = item.bookId || item.fakeId || item.id || '';
        } else {
            dramaId = item.fakeId || item.id || '';
        }

        return `
            <div class="content-card" data-id="${id}" data-source="${item.source}" data-drama-id="${dramaId}">
                <div class="card-image-wrapper">
                    <img src="${item.image || 'https://via.placeholder.com/300x450?text=No+Image'}\" 
                         alt="${item.title}" 
                         class="card-image"
                         onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'"
                         loading="lazy">
                    <div class="card-overlay">
                        <div class="card-actions">
                            <button class="card-btn" onclick="showDetails('${dramaId}', '${item.source}')">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                Detail
                            </button>
                            <button class="card-btn play-btn" data-drama-id="${dramaId}" data-source="${item.source}">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
                                </svg>
                                Play
                            </button>
                        </div>
                    </div>
                    ${item.isNew ? '<div class="card-badge">New</div>' : ''}
                    <button class="favorite-btn ${isFav ? 'active' : ''}" 
                            data-id="${id}"
                            onclick="handleFavorite(event, ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                                  stroke="currentColor" 
                                  stroke-width="2"/>
                        </svg>
                    </button>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">
                        ${item.rating ? `
                            <span class="card-rating">
                                <svg viewBox="0 0 24 24">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                                </svg>
                                ${utils.formatRating(item.rating)}
                            </span>
                        ` : ''}
                        <span>${item.type || 'Drama'}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // Render grid
    renderGrid(container, items) {
        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <h3>Tidak ada konten</h3>
                    <p>Coba cari dengan kata kunci lain</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => render.createCard(item)).join('');
    },

    // Show loading
    showLoading(show = true) {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = show ? 'flex' : 'none';
    }
};

// ========================================
// PAGE HANDLERS
// ========================================
async function loadHomePage() {
    render.showLoading(true);

    try {
        // Load latest dramas from FlickReels (TERBARU)
        const latest = await api.fetchFlickReelsDramas(1);
        render.renderGrid(document.getElementById('trendingGrid'), latest.slice(0, 10));

        // Load movies (Dramabox)
        const movies = await api.fetchDramaboxDramas(1);
        render.renderGrid(document.getElementById('moviesGrid'), movies.slice(0, 10));

        // Load dramas (RadReel)
        const dramas = await api.fetchRadReelDramas(1);
        render.renderGrid(document.getElementById('dramasGrid'), dramas.slice(0, 10));

    } catch (error) {
        console.error('Error loading home page:', error);
        utils.showToast('Gagal memuat konten. Silakan refresh halaman.');
    } finally {
        render.showLoading(false);
    }
}

async function loadMoviesPage() {
    render.showLoading(true);

    try {
        const movies = await api.fetchDramaboxDramas(1);
        render.renderGrid(document.getElementById('moviesGrid'), movies);
    } catch (error) {
        console.error('Error loading movies:', error);
    } finally {
        render.showLoading(false);
    }
}

async function loadDramasPage() {
    render.showLoading(true);

    try {
        const dramas = await api.fetchRadReelDramas(1);
        render.renderGrid(document.getElementById('dramasGrid'), dramas);
    } catch (error) {
        console.error('Error loading dramas:', error);
    } finally {
        render.showLoading(false);
    }
}

function renderFavorites() {
    const grid = document.getElementById('favoritesGrid');

    if (STATE.favorites.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <h3>Belum ada favorit</h3>
                <p>Mulai tambahkan film atau drama favorit kamu!</p>
            </div>
        `;
    } else {
        render.renderGrid(grid, STATE.favorites);
    }
}

// ========================================
// MODAL HANDLERS
// ========================================
async function showDetails(id, source) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');

    modal.classList.add('active');
    modalBody.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner"></div>
            <p>Loading details...</p>
        </div>
    `;

    try {
        const details = await api.fetchDramaDetails(id, source);
        const episodes = await api.fetchEpisodes(id, source);

        if (!details) {
            modalBody.innerHTML = `
                <div class="empty-state">
                    <h3>Gagal memuat detail</h3>
                    <p>Silakan coba lagi nanti</p>
                </div>
            `;
            return;
        }

        const data = details.data || details;
        const episodesList = episodes?.data || [];

        // Normalize data fields based on source
        const normalizedData = {
            title: data.title || data.name || data.bookName || 'Untitled',
            description: data.introduce || data.description || data.introduction || 'Tidak ada deskripsi tersedia',
            coverImage: data.coverImgUrl || data.coverHorizontalUrl || data.cover || 'https://via.placeholder.com/900x500',
            score: data.score || data.rating || 0,
            year: data.year || data.releaseYear || '',
            ...data // Keep all original data
        };

        modalBody.innerHTML = `
            <div class="modal-hero">
                <img src="${normalizedData.coverImage}" 
                     alt="${normalizedData.title}"
                     class="modal-hero-image"
                     onerror="this.src='https://via.placeholder.com/900x500'">
                <div class="modal-hero-overlay">
                    <h2 class="modal-title">${normalizedData.title}</h2>
                </div>
            </div>
            
            <div class="modal-meta">
                ${normalizedData.score ? `
                    <div class="modal-meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                        </svg>
                        <span>${utils.formatRating(normalizedData.score)}/10</span>
                    </div>
                ` : ''}
                ${normalizedData.year ? `
                    <div class="modal-meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span>${normalizedData.year}</span>
                    </div>
                ` : ''}
                ${episodesList.length > 0 ? `
                    <div class="modal-meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M16 3h4v4M8 3H4v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span>${episodesList.length} Episodes</span>
                    </div>
                ` : ''}
            </div>
            
            <p class="modal-description">${normalizedData.description}</p>
            
            <div class="modal-actions">
                <button class="modal-btn" onclick="playDrama('${id}', '${source}')">
                    <svg viewBox="0 0 24 24" fill="none">
                        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
                    </svg>
                    Mulai Nonton
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="handleFavoriteFromModal('${id}', '${source}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Tambah ke Favorit
                </button>
            </div>
            
            ${episodesList.length > 0 ? `
                <div style="margin-top: 2rem;">
                    <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.5rem;">Episodes</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;">
                        ${episodesList.slice(0, 20).map((ep, idx) => `
                            <button class="modal-btn" style="padding: 0.75rem;" onclick="playEpisode('${id}', '${source}', ${idx + 1})">
                                Episode ${idx + 1}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    } catch (error) {
        console.error('Error showing details:', error);
        modalBody.innerHTML = `
            <div class="empty-state">
                <h3>Terjadi kesalahan</h3>
                <p>Silakan coba lagi nanti</p>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

async function playDrama(id, source) {
    console.log('playDrama called with:', { id, source });

    const playerModal = document.getElementById('playerModal');
    const playerContent = document.getElementById('playerContent');

    playerModal.classList.add('active');

    // Show loading
    playerContent.innerHTML = `
        <div class="loading-screen">
            <div class="loading-spinner"></div>
            <p>Loading episodes...</p>
        </div>
    `;

    try {
        // Fetch episodes
        const episodesData = await api.fetchEpisodes(id, source);

        if (!episodesData || !episodesData.data || episodesData.data.length === 0) {
            playerContent.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <h3>Episode tidak tersedia</h3>
                    <p>Belum ada episode yang tersedia untuk konten ini</p>
                </div>
            `;
            return;
        }

        const episodes = episodesData.data;

        // Create player UI with episode list
        playerContent.innerHTML = `
            <div class="player-wrapper">
                <div class="video-container">
                    <video id="videoPlayer" controls playsinline class="video-player">
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="video-loading" id="videoLoading">
                        <div class="loading-spinner"></div>
                        <p>Loading video...</p>
                    </div>
                </div>
                <div class="episodes-sidebar">
                    <div class="episodes-header">
                        <h3>Episodes</h3>
                        <span class="episodes-count">${episodes.length} eps</span>
                    </div>
                    <div class="episodes-list" id="episodesList">
                        ${episodes.map((ep, index) => {
            // Get episode ID based on source
            let episodeId;
            if (source === 'flickreels') {
                episodeId = ep.episode_id || ep.episodeId || ep.id || '';
            } else if (source === 'radreel') {
                episodeId = ep.episodeId || ep.id || '';
            } else if (source === 'dramabox') {
                episodeId = ep.chapterId || ep.id || ep.chapter_id || '';
            } else {
                episodeId = ep.id || ep.episodeId || ep.chapterId || '';
            }

            console.log(`Episode ${index + 1} ID for ${source}:`, episodeId, 'Full episode:', ep);

            return `
                                <div class="episode-item" 
                                     data-episode-id="${episodeId}" 
                                     data-source="${source}"
                                     data-index="${index + 1}">
                                    <div class="episode-number">${index + 1}</div>
                                    <div class="episode-info">
                                        <div class="episode-title">${ep.title || ep.name || ep.chapterName || `Episode ${index + 1}`}</div>
                                        ${ep.duration ? `<div class="episode-duration">${ep.duration}</div>` : ''}
                                    </div>
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add event listeners to episode items
        const episodeItems = playerContent.querySelectorAll('.episode-item');
        episodeItems.forEach(item => {
            item.addEventListener('click', async () => {
                const episodeId = item.dataset.episodeId;
                const episodeIndex = item.dataset.index;
                const episodeSource = item.dataset.source;

                console.log('Episode clicked:', { episodeId, episodeIndex, episodeSource, dramaId: id });



                // Remove active class from all episodes
                episodeItems.forEach(ep => ep.classList.remove('active'));
                item.classList.add('active');

                await loadVideo(episodeId, id, source, episodeIndex);
            });
        });

        // Auto-play first episode
        if (episodes.length > 0) {
            const firstEpisode = episodes[0];

            // Get first episode ID based on source (same logic as episode list)
            let firstEpisodeId;
            if (source === 'flickreels') {
                firstEpisodeId = firstEpisode.episode_id || firstEpisode.episodeId || firstEpisode.id || '';
            } else if (source === 'radreel') {
                firstEpisodeId = firstEpisode.episodeId || firstEpisode.id || '';
            } else if (source === 'dramabox') {
                firstEpisodeId = firstEpisode.chapterId || firstEpisode.id || firstEpisode.chapter_id || '';
            } else {
                firstEpisodeId = firstEpisode.id || firstEpisode.episodeId || firstEpisode.chapterId || '';
            }

            console.log('Auto-playing first episode:', { firstEpisodeId, source, firstEpisode });

            episodeItems[0].classList.add('active');
            await loadVideo(firstEpisodeId, id, source, 1);
        }

    } catch (error) {
        console.error('Error playing drama:', error);
        playerContent.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3>Gagal memuat player</h3>
                <p>${error.message || 'Silakan coba lagi nanti'}</p>
            </div>
        `;
    }
}

async function loadVideo(episodeId, dramaId, source, episodeNumber) {
    console.log('loadVideo called with:', { episodeId, dramaId, source, episodeNumber });

    const videoPlayer = document.getElementById('videoPlayer');
    const videoLoading = document.getElementById('videoLoading');

    if (!videoPlayer) {
        console.error('Video player element not found!');
        return;
    }

    // Validate episode ID
    if (!episodeId || episodeId === 'undefined' || episodeId === 'null') {
        console.error('Invalid episode ID:', episodeId);
        utils.showToast('Episode ID tidak valid');
        return;
    }

    // Show loading
    videoLoading.style.display = 'flex';
    videoPlayer.style.opacity = '0.5';

    try {
        console.log('Fetching video URL for:', { episodeId, dramaId, source, episodeNumber });

        //Fetch video URL (pass episodeNumber for Dramabox index param)
        const videoUrl = await api.fetchVideoUrl(episodeId, dramaId, source, episodeNumber);


        console.log('Video URL received:', videoUrl);

        if (!videoUrl) {
            console.warn('Video URL is null or undefined');
            utils.showToast('Video URL tidak tersedia untuk episode ini');
            videoLoading.style.display = 'none';
            videoPlayer.style.opacity = '1';
            return;
        }

        // Set video source
        console.log('Setting video source:', videoUrl);
        videoPlayer.src = videoUrl;
        videoPlayer.load();

        // Hide loading when video is ready
        videoPlayer.addEventListener('loadeddata', () => {
            console.log('Video loaded successfully');
            videoLoading.style.display = 'none';
            videoPlayer.style.opacity = '1';
            videoPlayer.play().catch(err => {
                console.error('Error playing video:', err);
                utils.showToast('Gagal memutar video. Silakan klik tombol play.');
            });
        }, { once: true });

        // Handle video error
        videoPlayer.addEventListener('error', (e) => {
            console.error('Video player error:', e, videoPlayer.error);
            videoLoading.style.display = 'none';
            videoPlayer.style.opacity = '1';
            utils.showToast('Gagal memuat video. URL mungkin tidak valid.');
        }, { once: true });

        utils.showToast(`Playing Episode ${episodeNumber}`);

    } catch (error) {
        console.error('Error loading video:', error);
        videoLoading.style.display = 'none';
        videoPlayer.style.opacity = '1';
        utils.showToast('Gagal memuat video: ' + error.message);
    }
}

function playEpisode(episodeId, dramaId, source, episodeNumber) {
    loadVideo(episodeId, dramaId, source, episodeNumber);
}

function closePlayer() {
    const playerModal = document.getElementById('playerModal');
    const playerContent = document.getElementById('playerContent');
    const videoPlayer = document.getElementById('videoPlayer');

    // Pause video if playing
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
    }

    playerModal.classList.remove('active');
    playerContent.innerHTML = '';
}

// ========================================
// EVENT HANDLERS
// ========================================
function handleFavorite(event, item) {
    event.stopPropagation();
    utils.toggleFavorite(item);
}

function handleFavoriteFromModal(id, source, data) {
    const item = {
        ...data,
        source,
        fakeId: id,
        title: data.title || data.name,
        image: data.coverImgUrl || data.coverVerticalUrl
    };
    utils.toggleFavorite(item);
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();

    clearTimeout(STATE.searchTimeout);

    if (query.length < 2) {
        document.getElementById('searchSection').style.display = 'none';
        switchPage('home');
        return;
    }

    STATE.searchTimeout = setTimeout(async () => {
        const sections = ['trending', 'moviesSection', 'dramasSection', 'favoritesSection'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) section.style.display = 'none';
        });

        const searchSection = document.getElementById('searchSection');
        searchSection.style.display = 'block';

        render.showLoading(true);

        try {
            const results = await api.searchDramas(query);
            render.renderGrid(document.getElementById('searchGrid'), results);
        } catch (error) {
            console.error('Error searching:', error);
            utils.showToast('Pencarian gagal. Silakan coba lagi.');
        } finally {
            render.showLoading(false);
        }
    }, 500);
}

function switchPage(page) {
    STATE.currentPage = page;

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // Hide all sections
    const sections = ['trending', 'moviesSection', 'dramasSection', 'favoritesSection', 'searchSection'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.style.display = 'none';
    });

    // Show relevant sections
    switch (page) {
        case 'home':
            document.getElementById('trending').style.display = 'block';
            document.getElementById('moviesSection').style.display = 'block';
            document.getElementById('dramasSection').style.display = 'block';
            break;
        case 'movies':
            document.getElementById('moviesSection').style.display = 'block';
            loadMoviesPage();
            break;
        case 'dramas':
            document.getElementById('dramasSection').style.display = 'block';
            loadDramasPage();
            break;
        case 'favorites':
            document.getElementById('favoritesSection').style.display = 'block';
            renderFavorites();
            break;
    }

    // Close mobile menu
    document.getElementById('navLinks').classList.remove('active');
    document.getElementById('mobileMenuBtn').classList.remove('active');
}

function scrollToSection(id) {
    utils.scrollToSection(id);
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                switchPage(page);
            }
        });
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Close modals on overlay click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
        if (e.target.classList.contains('player-overlay')) {
            closePlayer();
        }
    });

    // Close modals on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closePlayer();
        }
    });

    // Play button event delegation
    document.addEventListener('click', (e) => {
        const playBtn = e.target.closest('.play-btn');
        if (playBtn) {
            e.preventDefault();
            e.stopPropagation();

            const dramaId = playBtn.dataset.dramaId;
            const source = playBtn.dataset.source;

            if (dramaId && source) {
                console.log('Play button clicked:', { dramaId, source });
                playDrama(dramaId, source);
            } else {
                console.error('Missing drama ID or source:', { dramaId, source });
                utils.showToast('Error: Drama ID tidak tersedia');
            }
        }
    });

    // Filter functionality
    const sourceFilter = document.getElementById('sourceFilter');
    const genreFilter = document.getElementById('genreFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');

    // Apply filters
    function applyFilters() {
        const source = sourceFilter.value;
        const genre = genreFilter.value.toLowerCase();
        const sort = sortFilter.value;

        // Update CONFIG
        CONFIG.filters.source = source;
        CONFIG.filters.genre = genre;
        CONFIG.filters.sort = sort;

        // Reload current page with filters
        if (STATE.currentPage === 'home') {
            loadHomePage();
        } else if (STATE.currentPage === 'movies') {
            loadMoviesPage();
        } else if (STATE.currentPage === 'dramas') {
            loadDramasPage();
        }

        utils.showToast(`Filter diterapkan: ${source === 'all' ? 'Semua' : source}, ${genre === 'all' ? 'Semua Genre' : genre}`);
    }

    // Filter all items
    function filterItems(items) {
        let filtered = [...items];

        // Filter by source
        if (CONFIG.filters.source !== 'all') {
            filtered = filtered.filter(item => item.source === CONFIG.filters.source);
        }

        // Filter by genre
        if (CONFIG.filters.genre !== 'all') {
            filtered = filtered.filter(item => {
                const itemGenres = item.genre || [item.type];
                return itemGenres.some(g => g.toLowerCase().includes(CONFIG.filters.genre));
            });
        }

        // Sort items
        if (CONFIG.filters.sort === 'latest') {
            filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        } else if (CONFIG.filters.sort === 'rating') {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (CONFIG.filters.sort === 'popular') {
            filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        return filtered;
    }

    // Attach filter to API functions
    const originalFetchFlickReels = api.fetchFlickReelsDramas;
    const originalFetchRadReel = api.fetchRadReelDramas;
    const originalFetchDramabox = api.fetchDramaboxDramas;

    // Override API functions to apply filters
    api.fetchFlickReelsDramas = async (page) => {
        const items = await originalFetchFlickReels(page);
        return filterItems(items);
    };

    api.fetchRadReelDramas = async (page) => {
        const items = await originalFetchRadReel(page);
        return filterItems(items);
    };

    api.fetchDramaboxDramas = async (page) => {
        const items = await originalFetchDramabox(page);
        return filterItems(items);
    };

    // Filter event listeners
    sourceFilter.addEventListener('change', applyFilters);
    genreFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);

    // Reset filters
    resetFiltersBtn.addEventListener('click', () => {
        sourceFilter.value = 'all';
        genreFilter.value = 'all';
        sortFilter.value = 'latest';
        CONFIG.filters.source = 'all';
        CONFIG.filters.genre = 'all';
        CONFIG.filters.sort = 'latest';

        if (STATE.currentPage === 'home') {
            loadHomePage();
        } else if (STATE.currentPage === 'movies') {
            loadMoviesPage();
        } else if (STATE.currentPage === 'dramas') {
            loadDramasPage();
        }

        utils.showToast('Filter direset');
    });

    // Load initial content
    loadHomePage();

    console.log('%c🎬 CineStream initialized successfully!', 'color: #6366f1; font-size: 14px; font-weight: bold;');
});
