import { fetchHomeAll } from "@/lib/api";
import HomeClient from "./HomeClient";

export default async function Home() {
  // Fetch dramas from ALL 14 providers
  const dramas = await fetchHomeAll(60); // Get top 60 dramas across all providers

  return <HomeClient dramas={dramas} />;
}
