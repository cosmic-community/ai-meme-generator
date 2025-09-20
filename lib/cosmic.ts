import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export async function getTrendingTopics() {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'trending-topics',
        'metadata.status': 'active'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects.sort((a, b) => {
      const scoreA = a.metadata?.popularity_score || 0;
      const scoreB = b.metadata?.popularity_score || 0;
      return scoreB - scoreA; // Highest popularity first
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch trending topics');
  }
}

export async function getMemes(limit = 20, skip = 0) {
  try {
    const response = await cosmic.objects
      .find({ type: 'memes' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    return response.objects
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // Newest first
      })
      .slice(skip, skip + limit);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch memes');
  }
}

export async function getMemeById(id: string) {
  try {
    const response = await cosmic.objects.findOne({
      type: 'memes',
      id
    }).depth(1);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch meme');
  }
}

export async function createMeme(memeData: {
  title: string;
  topic: string;
  caption: string;
  imageUrl?: string;
  templateUsed?: string;
  userId?: string;
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'memes',
      title: memeData.title,
      slug: generateSlug(memeData.title),
      metadata: {
        topic: memeData.topic,
        caption: memeData.caption,
        image_url: memeData.imageUrl || '',
        template_used: memeData.templateUsed || 'default',
        likes: 0,
        shares: 0,
        downloads: 0,
        created_by: memeData.userId || 'anonymous',
        ai_generated: true,
        viral_score: 0,
        tags: [],
        social_shares: {
          instagram: 0,
          tiktok: 0,
          twitter: 0,
          whatsapp: 0
        }
      }
    });
    
    return response.object;
  } catch (error) {
    console.error('Error creating meme:', error);
    throw new Error('Failed to create meme');
  }
}

export async function updateMemeStats(memeId: string, updates: {
  likes?: number;
  shares?: number;
  downloads?: number;
  viralScore?: number;
}) {
  try {
    const metadata: Record<string, any> = {};
    
    if (updates.likes !== undefined) metadata.likes = updates.likes;
    if (updates.shares !== undefined) metadata.shares = updates.shares;
    if (updates.downloads !== undefined) metadata.downloads = updates.downloads;
    if (updates.viralScore !== undefined) metadata.viral_score = updates.viralScore;
    
    const response = await cosmic.objects.updateOne(memeId, {
      metadata
    });
    
    return response.object;
  } catch (error) {
    console.error('Error updating meme stats:', error);
    throw new Error('Failed to update meme stats');
  }
}

export async function recordVote(memeId: string, voteType: 'like' | 'dislike' | 'love' | 'funny', userId?: string) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'votes',
      title: `Vote for ${memeId}`,
      slug: `vote-${memeId}-${Date.now()}`,
      metadata: {
        meme_id: memeId,
        user_id: userId || 'anonymous',
        vote_type: voteType,
        ip_address: ''
      }
    });
    
    return response.object;
  } catch (error) {
    console.error('Error recording vote:', error);
    throw new Error('Failed to record vote');
  }
}

// Utility function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Date.now();
}