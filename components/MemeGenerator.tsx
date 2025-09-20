'use client'

import { useState, useEffect, useRef } from 'react'
import { TrendingTopic } from '@/types'
import { generateMemeImage, downloadImage, shareToSocial } from '@/lib/meme-generator'

interface MemeGeneratorProps {
  initialTopics: TrendingTopic[]
}

export default function MemeGenerator({ initialTopics }: MemeGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState<'funny' | 'sarcastic' | 'witty' | 'relatable'>('funny')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMeme, setGeneratedMeme] = useState<any>(null)
  const [memeImageUrl, setMemeImageUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Listen for topic selection from trending topics
  useEffect(() => {
    const handleSetTopic = (event: any) => {
      setTopic(event.detail)
    }

    window.addEventListener('setTopic', handleSetTopic)
    return () => window.removeEventListener('setTopic', handleSetTopic)
  }, [])

  const generateMeme = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    
    try {
      // Call API to generate meme caption
      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          style,
          userId: 'anonymous' // In a real app, you'd get this from auth
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate meme')
      }

      const data = await response.json()
      
      if (data.success) {
        setGeneratedMeme(data.meme)
        
        // Generate visual meme
        const imageUrl = await generateMemeImage({
          text: data.meme.caption,
          fontSize: 42,
          fontColor: '#ffffff',
          backgroundColor: '#667eea'
        })
        
        setMemeImageUrl(imageUrl)
      } else {
        throw new Error(data.error || 'Failed to generate meme')
      }
    } catch (error) {
      console.error('Error generating meme:', error)
      alert('Failed to generate meme. Please try again!')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (memeImageUrl && generatedMeme) {
      downloadImage(memeImageUrl, `${generatedMeme.topic}-meme.png`)
    }
  }

  const handleShare = (platform: string) => {
    if (memeImageUrl && generatedMeme) {
      shareToSocial(platform, memeImageUrl, generatedMeme.caption)
    }
  }

  const handleVote = async (voteType: 'like' | 'love' | 'funny') => {
    if (!generatedMeme) return

    try {
      const response = await fetch(`/api/memes/${generatedMeme.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voteType,
          userId: 'anonymous'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Update local state with new vote count
        setGeneratedMeme(prev => ({
          ...prev,
          likes: data.meme.likes
        }))
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  return (
    <section id="generate" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              <span className="text-gradient">AI Meme</span> Generator
            </h2>
            <p className="text-xl text-gray-600">
              Type any topic and watch the magic happen!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Generator Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  What's your meme about?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Monday mornings, coffee addiction, remote work..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && generateMeme()}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Choose your style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'funny', label: '😂 Funny', desc: 'Pure comedy gold' },
                    { value: 'sarcastic', label: '🙄 Sarcastic', desc: 'Witty and sharp' },
                    { value: 'witty', label: '🧠 Witty', desc: 'Clever humor' },
                    { value: 'relatable', label: '👥 Relatable', desc: 'Everyone gets it' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStyle(option.value as any)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        style === option.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateMeme}
                disabled={!topic.trim() || isGenerating}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  !topic.trim() || isGenerating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'generate-button'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Magic...</span>
                  </div>
                ) : (
                  '🚀 Generate Meme'
                )}
              </button>

              {/* Quick Topics */}
              <div className="mt-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick starts:</p>
                <div className="flex flex-wrap gap-2">
                  {initialTopics.slice(0, 6).map((quickTopic) => (
                    <button
                      key={quickTopic.id}
                      onClick={() => setTopic(quickTopic.title)}
                      className="trend-chip text-sm"
                    >
                      {quickTopic.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Meme Preview */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-heading font-semibold text-lg mb-4 text-center">
                  Your Meme Preview
                </h3>
                
                {memeImageUrl ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <img 
                        src={memeImageUrl}
                        alt="Generated meme"
                        className="w-full rounded-lg meme-shadow"
                      />
                    </div>

                    {/* Meme Info */}
                    {generatedMeme && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-gray-600 text-sm mb-2">Topic: {generatedMeme.topic}</p>
                          <p className="font-medium text-gray-900">"{generatedMeme.caption}"</p>
                        </div>

                        {/* Voting */}
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            onClick={() => handleVote('like')}
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span>👍</span>
                            <span className="text-sm">Like</span>
                          </button>
                          <button
                            onClick={() => handleVote('love')}
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span>❤️</span>
                            <span className="text-sm">Love</span>
                          </button>
                          <button
                            onClick={() => handleVote('funny')}
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <span>😂</span>
                            <span className="text-sm">Funny</span>
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <button
                            onClick={handleDownload}
                            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                          >
                            💾 Download Meme
                          </button>
                          
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { platform: 'twitter', icon: '🐦', bg: 'bg-blue-500' },
                              { platform: 'facebook', icon: '📘', bg: 'bg-blue-600' },
                              { platform: 'whatsapp', icon: '💬', bg: 'bg-green-500' },
                              { platform: 'instagram', icon: '📷', bg: 'bg-pink-500' }
                            ].map(({ platform, icon, bg }) => (
                              <button
                                key={platform}
                                onClick={() => handleShare(platform)}
                                className={`social-share-btn ${bg}`}
                                title={`Share on ${platform}`}
                              >
                                <span>{icon}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p>Your meme will appear here</p>
                      <p className="text-sm">Enter a topic and hit generate!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}