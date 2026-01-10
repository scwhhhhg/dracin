import { fetchDramaDetail, fetchEpisodeList, fetchPlayUrl } from "@/lib/api";
import WatchPageClient from "./WatchPageClient";

export default async function WatchPage({ params }: { params: Promise<{ id: string; seq: string }> }) {
    const { id, seq: seqParam } = await params;
    const seq = parseInt(seqParam);

    const [drama, episodes, playUrl] = await Promise.all([
        fetchDramaDetail(id),
        fetchEpisodeList(id),
        fetchPlayUrl(id, seq)
    ]);

    if (!drama) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-4xl font-bold text-gray-400 mb-4">Drama Not Found</h1>
                <p className="text-gray-500">The drama you're looking for doesn't exist.</p>
                <a href="/" className="primary-button mt-6 inline-flex">
                    Back to Home
                </a>
            </div>
        );
    }

    return (
        <WatchPageClient
            drama={drama}
            episodes={episodes}
            playUrl={playUrl}
            currentEpisode={seq}
            id={id}
        />
    );
}
