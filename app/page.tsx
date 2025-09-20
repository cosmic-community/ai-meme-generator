import { getTrendingTopics, getMemes } from '@/lib/cosmic'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TrendingTopics from '@/components/TrendingTopics'
import MemeGenerator from '@/components/MemeGenerator'
import PopularMemes from '@/components/PopularMemes'
import Footer from '@/components/Footer'

export default async function HomePage() {
  const [trendingTopics, popularMemes] = await Promise.all([
    getTrendingTopics(),
    getMemes(12)
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-8 space-y-16">
        <TrendingTopics topics={trendingTopics} />
        <MemeGenerator initialTopics={trendingTopics} />
        <PopularMemes memes={popularMemes} />
      </main>
      
      <Footer />
    </div>
  )
}