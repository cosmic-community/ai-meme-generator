// app/api/memes/[id]/vote/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getMemeById, updateMemeStats, recordVote } from '@/lib/cosmic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { voteType, userId } = await request.json()

    if (!id || !voteType) {
      return NextResponse.json(
        { error: 'Meme ID and vote type are required' },
        { status: 400 }
      )
    }

    // Get current meme
    const meme = await getMemeById(id)
    if (!meme) {
      return NextResponse.json(
        { error: 'Meme not found' },
        { status: 404 }
      )
    }

    // Record the vote
    await recordVote(id, voteType, userId)

    // Update meme stats
    const currentLikes = meme.metadata?.likes || 0
    const newLikes = voteType === 'like' || voteType === 'love' || voteType === 'funny' 
      ? currentLikes + 1 
      : Math.max(0, currentLikes - 1)

    // Calculate viral score based on engagement
    const viralScore = calculateViralScore(newLikes, meme.metadata?.shares || 0, meme.metadata?.downloads || 0)

    const updatedMeme = await updateMemeStats(id, {
      likes: newLikes,
      viralScore
    })

    return NextResponse.json({
      success: true,
      meme: {
        id: updatedMeme.id,
        likes: newLikes,
        viralScore
      }
    })
  } catch (error) {
    console.error('Error processing vote:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
}

function calculateViralScore(likes: number, shares: number, downloads: number): number {
  // Simple viral score calculation
  // Shares are worth more than likes, downloads show serious engagement
  return Math.round((likes * 1) + (shares * 3) + (downloads * 2))
}