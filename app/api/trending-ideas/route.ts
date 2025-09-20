import { NextResponse } from 'next/server'
import { generateMemeIdeas } from '@/lib/openai'

export async function GET() {
  try {
    const ideas = await generateMemeIdeas(8)

    return NextResponse.json({
      success: true,
      ideas
    })
  } catch (error) {
    console.error('Error generating trending ideas:', error)
    
    // Fallback ideas if AI fails
    const fallbackIdeas = [
      "Monday morning struggle",
      "Coffee addiction level",
      "Weekend plans vs reality",
      "Social media expectations",
      "Procrastination masterclass",
      "Remote work life",
      "Fitness motivation",
      "Food delivery apps"
    ]

    return NextResponse.json({
      success: true,
      ideas: fallbackIdeas
    })
  }
}