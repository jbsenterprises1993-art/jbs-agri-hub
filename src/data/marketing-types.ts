export type MarketingChannel = "whatsapp" | "instagram" | "facebook" | "youtube";

export type MarketingPost = {
  id: string;
  title: string;
  caption: string;
  mediaUrl?: string;
  channels: MarketingChannel[];
  status: "draft" | "scheduled" | "published" | "failed";
  scheduledAt?: string;
};