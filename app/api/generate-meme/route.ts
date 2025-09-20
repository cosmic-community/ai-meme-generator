import { NextRequest, NextResponse } from 'next/server'
import { generateMemeCaption } from '@/lib/openai'
import { createMeme } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const { topic, style, userId } = await request.json()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Generate AI caption
    const caption = await generateMemeCaption(topic, style || 'funny')
    
    // Create meme title
    const title = `${topic} Meme - ${new Date().toISOString().split('T')[0]}`

    // Save to Cosmic
    const meme = await createMeme({
      title,
      topic,
      caption,
      userId: userId || 'anonymous',
      templateUsed: 'ai-generated'
    })

    return NextResponse.json({
      success: true,
      meme: {
        id: meme.id,
        caption,
        topic,
        title: meme.title,
        slug: meme.slug
      }
    })
  } catch (error) {
    console.error('Error generating meme:', error)
    return NextResponse.json(
      { error: 'Failed to generate meme' },
      { status: 500 }
    )
  }
}