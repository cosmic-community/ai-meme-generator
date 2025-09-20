// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Trending Topic interface
export interface TrendingTopic extends CosmicObject {
  type: 'trending-topics';
  metadata: {
    description?: string;
    hashtags?: string[];
    popularity_score?: number;
    category?: 'viral' | 'news' | 'entertainment' | 'sports' | 'tech';
    status?: 'active' | 'trending' | 'expired';
    featured_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Meme interface
export interface Meme extends CosmicObject {
  type: 'memes';
  metadata: {
    topic?: string;
    caption: string;
    image_url?: string;
    template_used?: string;
    likes: number;
    shares: number;
    downloads: number;
    created_by?: string;
    ai_generated: boolean;
    viral_score?: number;
    tags?: string[];
    social_shares?: {
      instagram?: number;
      tiktok?: number;
      twitter?: number;
      whatsapp?: number;
    };
  };
}

// User Vote interface
export interface Vote extends CosmicObject {
  type: 'votes';
  metadata: {
    meme_id: string;
    user_id?: string;
    vote_type: 'like' | 'dislike' | 'love' | 'funny';
    ip_address?: string;
  };
}

// Meme Template interface
export interface MemeTemplate extends CosmicObject {
  type: 'meme-templates';
  metadata: {
    template_name: string;
    image_url: string;
    text_positions?: {
      top?: { x: number; y: number; width: number; height: number };
      bottom?: { x: number; y: number; width: number; height: number };
    };
    category?: 'classic' | 'trending' | 'viral' | 'custom';
    usage_count?: number;
    popularity?: number;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Meme generation request
export interface MemeGenerationRequest {
  topic: string;
  template?: string;
  style?: 'funny' | 'sarcastic' | 'witty' | 'relatable';
}

// Meme generation response
export interface MemeGenerationResponse {
  success: boolean;
  meme?: {
    id: string;
    imageUrl: string;
    caption: string;
    downloadUrl: string;
  };
  error?: string;
}

// Social sharing data
export interface SocialShareData {
  platform: 'instagram' | 'tiktok' | 'twitter' | 'whatsapp' | 'facebook';
  memeId: string;
  shareUrl: string;
}

// Trending analytics
export interface TrendingAnalytics {
  topTopics: Array<{
    topic: string;
    memeCount: number;
    totalLikes: number;
    avgViralScore: number;
  }>;
  dailyStats: Array<{
    date: string;
    memesCreated: number;
    totalShares: number;
    topPerformer: string;
  }>;
}

// Type guards
export function isTrendingTopic(obj: CosmicObject): obj is TrendingTopic {
  return obj.type === 'trending-topics';
}

export function isMeme(obj: CosmicObject): obj is Meme {
  return obj.type === 'memes';
}

export function isVote(obj: CosmicObject): obj is Vote {
  return obj.type === 'votes';
}

// Utility types
export type CreateMemeData = Omit<Meme, 'id' | 'created_at' | 'modified_at'>;
export type UpdateMemeData = Partial<Pick<Meme, 'metadata'>>;
export type MemeStatus = 'active' | 'trending' | 'expired';
export type VoteType = 'like' | 'dislike' | 'love' | 'funny';
export type MemeCategory = 'classic' | 'trending' | 'viral' | 'custom';