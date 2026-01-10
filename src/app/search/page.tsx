import { fetchSearchAll } from "@/lib/api";
import SearchPageClient from "./SearchPageClient";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    const query = q || "";

    // Search across ALL 14 providers
    const results = query ? await fetchSearchAll(query, 40) : [];

    return <SearchPageClient query={query} results={results} />;
}
