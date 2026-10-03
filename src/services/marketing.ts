import type { MarketingPost } from "@/data/marketing-types";

export function validateMarketingPost(post: MarketingPost): boolean {
  return Boolean(
    post.id.trim() &&
    post.title.trim() &&
    post.caption.trim() &&
    post.channels.length > 0,
  );
}

export function canPublishPost(post: MarketingPost): boolean {
  return validateMarketingPost(post) && (post.status === "draft" || post.status === "scheduled");
}

export function scheduleMarketingPost(post: MarketingPost, scheduledAt: string): MarketingPost {
  if (!validateMarketingPost(post) || !Number.isFinite(new Date(scheduledAt).getTime())) {
    throw new Error("Invalid marketing post or schedule time");
  }
  return { ...post, status: "scheduled", scheduledAt };
}

export function markPostPublished(post: MarketingPost): MarketingPost {
  if (!canPublishPost(post)) return post;
  return { ...post, status: "published" };
}
