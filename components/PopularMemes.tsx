import { Meme } from '@/types'

interface PopularMemesProps {
  memes: Meme[]
}

export default function PopularMemes({ memes }: PopularMemesProps) {
  if (!memes || memes.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
            <span className="text-gradient">Community</span> Favorites
          </h2>
          <div className="text-center text-gray-600">
            <p>No memes available yet. Be the first to create one!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            <span className="text-gradient">Community</span> Favorites
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check out the most liked and shared memes from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {memes.map((meme, index) => (
            <div key={meme.id} className="meme-card hover:scale-105 transition-all duration-300">
              {/* Viral Badge */}
              {meme.metadata?.viral_score && meme.metadata.viral_score > 100 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="viral-indicator">
                    🚀 VIRAL
                  </div>
                </div>
              )}

              {/* Meme Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                {meme.metadata?.image_url ? (
                  <img 
                    src={meme.metadata.image_url}
                    alt={meme.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-6xl mb-2">🎭</div>
                    <p className="font-bold text-primary text-lg leading-tight">
                      "{meme.metadata?.caption || meme.title}"
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4">
                {/* Topic */}
                {meme.metadata?.topic && (
                  <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded mb-2">
                    {meme.metadata.topic}
                  </div>
                )}

                {/* Caption */}
                <p className="font-medium text-gray-900 text-sm mb-3 line-clamp-2">
                  {meme.metadata?.caption || meme.title}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <span>👍</span>
                      <span>{meme.metadata?.likes || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>📤</span>
                      <span>{meme.metadata?.shares || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>💾</span>
                      <span>{meme.metadata?.downloads || 0}</span>
                    </span>
                  </div>
                  
                  {meme.metadata?.viral_score && (
                    <div className="text-xs font-bold text-primary">
                      🔥 {meme.metadata.viral_score}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {meme.metadata?.tags && meme.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {meme.metadata.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <span 
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Creation Date */}
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(meme.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between">
                  <button className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                    View Full
                  </button>
                  <button className="text-gray-600 hover:text-primary text-sm transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-semibold transition-all duration-200">
            Load More Memes
          </button>
        </div>
      </div>
    </section>
  )
}