import { TrendingTopic } from '@/types'

interface TrendingTopicsProps {
  topics: TrendingTopic[]
}

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  if (!topics || topics.length === 0) {
    return (
      <section id="trending" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
            <span className="text-gradient">Today's Trending</span> Topics
          </h2>
          <div className="text-center text-gray-600">
            <p>Loading trending topics...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="trending" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            <span className="text-gradient">Today's Trending</span> Topics
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jump on the hottest trends and create memes that everyone will be sharing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topics.slice(0, 8).map((topic, index) => (
            <div
              key={topic.id}
              className={`meme-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 ${
                index === 0 ? 'trending-glow' : ''
              }`}
              onClick={() => {
                // Scroll to generator and set topic
                const generator = document.getElementById('generate')
                if (generator) {
                  generator.scrollIntoView({ behavior: 'smooth' })
                  // Set topic in the generator (we'll implement this in the generator component)
                  const event = new CustomEvent('setTopic', { detail: topic.title })
                  window.dispatchEvent(event)
                }
              }}
            >
              {/* Trending Badge */}
              {index === 0 && (
                <div className="viral-indicator mb-3">
                  🔥 VIRAL
                </div>
              )}
              
              {/* Category */}
              {topic.metadata?.category && (
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
                  {topic.metadata.category}
                </div>
              )}

              {/* Topic Title */}
              <h3 className="font-heading font-semibold text-lg mb-2 text-gray-900">
                {topic.title}
              </h3>

              {/* Description */}
              {topic.metadata?.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {topic.metadata.description}
                </p>
              )}

              {/* Hashtags */}
              {topic.metadata?.hashtags && topic.metadata.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.metadata.hashtags.slice(0, 3).map((hashtag: string, idx: number) => (
                    <span 
                      key={idx}
                      className="text-primary text-xs font-medium"
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              )}

              {/* Popularity Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>🔥</span>
                  <span>Popularity: {topic.metadata?.popularity_score || 0}</span>
                </div>
                
                <div className="text-primary font-semibold text-sm hover:underline">
                  Create Meme →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {topics.length > 8 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-semibold transition-all duration-200">
              Show More Topics
            </button>
          </div>
        )}
      </div>
    </section>
  )
}