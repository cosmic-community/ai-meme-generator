export default function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl floating"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-accent/10 rounded-full blur-xl floating" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            AI-Powered Meme Generator
          </div>

          {/* Main Heading */}
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            <span className="text-gradient">Create Viral Memes</span>
            <br />
            <span className="text-gray-900">in Seconds!</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stay on top of the trend with instant laughs! Just type a trending topic and get 
            AI-generated memes ready for Instagram, TikTok, and WhatsApp.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="trend-chip">🔥 Trending Topics</span>
            <span className="trend-chip">🤖 AI-Powered</span>
            <span className="trend-chip">📱 Social Ready</span>
            <span className="trend-chip">⚡ Instant Generation</span>
            <span className="trend-chip">💯 Viral Content</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#generate"
              className="generate-button text-center min-w-[200px]"
            >
              🚀 Start Creating
            </a>
            <a 
              href="#trending"
              className="flex items-center space-x-2 px-8 py-3 rounded-xl border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-semibold transition-all duration-200 min-w-[200px] justify-center"
            >
              <span>📈</span>
              <span>See What's Trending</span>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-gray-600">Memes Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-secondary">50K+</div>
              <div className="text-sm text-gray-600">Social Shares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-accent">1M+</div>
              <div className="text-sm text-gray-600">Laughs Generated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}