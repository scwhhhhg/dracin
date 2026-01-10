import { fetchDramaDetail, fetchEpisodeList } from "@/lib/api";
import DramaPageClient from "./DramaPageClient";

export default async function DramaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const drama = await fetchDramaDetail(id);
    const episodes = await fetchEpisodeList(id);

    if (!drama) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl font-bold text-gray-400">Drama Not Found</h1>
                <p className="text-gray-500">The drama you're looking for doesn't exist.</p>
                <a href="/" className="primary-button mt-4">
                    Back to Home
                </a>
            </div>
        );
    }

    return <DramaPageClient drama={{ ...drama, episodes }} id={id} />;
}
