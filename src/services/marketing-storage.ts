import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MarketingPost } from "@/data/marketing-types";

export const MARKETING_POSTS_KEY = "jbs_marketing_posts";

export async function getMarketingPosts(): Promise<MarketingPost[]> {
  try {
    const raw = await AsyncStorage.getItem(MARKETING_POSTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MarketingPost[]) : [];
  } catch {
    return [];
  }
}

export async function saveMarketingPost(post: MarketingPost): Promise<void> {
  const posts = await getMarketingPosts();
  const next = posts.filter((item) => item.id !== post.id);
  await AsyncStorage.setItem(MARKETING_POSTS_KEY, JSON.stringify([post, ...next].slice(0, 200)));
}
