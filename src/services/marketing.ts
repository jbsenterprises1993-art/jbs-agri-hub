import type { MarketingPost } from "@/data/marketing-types";

export function canPublishPost(post: MarketingPost): boolean {
  return post.status === "draft" || post.status === "scheduled";
}

export function markPostPublished(post: MarketingPost): MarketingPost {
  if (!canPublishPost(post)) return post;
  return { ...post, status: "published" };
}