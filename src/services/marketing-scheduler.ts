import type { MarketingPost } from "@/data/marketing-types";

export function getDueScheduledPosts(posts: MarketingPost[], now = new Date()): MarketingPost[] {
  const nowMs = now.getTime();
  return posts.filter((post) => {
    if (post.status !== "scheduled" || !post.scheduledAt) return false;
    const scheduledMs = new Date(post.scheduledAt).getTime();
    return Number.isFinite(scheduledMs) && scheduledMs <= nowMs;
  });
}

export function canExternallyPublish(post: MarketingPost): boolean {
  return post.status === "scheduled" && Boolean(post.scheduledAt) && post.channels.length > 0;
}
