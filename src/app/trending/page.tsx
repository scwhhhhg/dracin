import { fetchTrending } from "@/lib/api";
import TrendingPageClient from "./TrendingPageClient";

export default async function TrendingPage() {
    // Fetch trending dramas from top  providers
    const dramas = await fetchTrending(50);

    return <TrendingPageClient dramas={dramas} />;
}
