import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMemeCaption(topic: string, style: 'funny' | 'sarcastic' | 'witty' | 'relatable' = 'funny'): Promise<string> {
  try {
    const stylePrompts = {
      funny: "Create a hilarious and lighthearted meme caption",
      sarcastic: "Create a sarcastic and witty meme caption",
      witty: "Create a clever and witty meme caption",
      relatable: "Create a relatable and authentic meme caption"
    };

    const prompt = `${stylePrompts[style]} about "${topic}". 
    The caption should be:
    - Short and punchy (max 2 lines)
    - Internet-friendly and shareable
    - Appropriate for all audiences
    - Trendy and current
    - Perfect for social media
    
    Just return the caption text, nothing else.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a viral meme creator who knows what makes content shareable and funny. Create captions that would get thousands of likes and shares on social media."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
      temperature: 0.9,
    });

    const caption = response.choices[0]?.message?.content?.trim() || `When ${topic} hits different 🔥`;
    
    // Clean up the caption - remove quotes if AI added them
    return caption.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Error generating meme caption:', error);
    // Fallback captions based on style
    const fallbacks = {
      funny: `When ${topic} hits different 😂`,
      sarcastic: `Oh wow, ${topic}... how original 🙄`,
      witty: `${topic}: Expectation vs Reality`,
      relatable: `Me dealing with ${topic} be like:`
    };
    return fallbacks[style];
  }
}

export async function generateMemeIdeas(count: number = 5): Promise<string[]> {
  try {
    const prompt = `Generate ${count} trending, viral-worthy meme topics that are:
    - Currently relevant and timely
    - Relatable to a wide audience
    - Perfect for social media sharing
    - Safe for all audiences
    - Likely to generate engagement
    
    Just return the topics as a simple list, one per line.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a social media trend expert who knows what content goes viral. Generate topics that would make great memes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    return content.split('\n').filter(topic => topic.trim().length > 0).slice(0, count);
  } catch (error) {
    console.error('Error generating meme ideas:', error);
    // Fallback trending topics
    return [
      "Monday morning energy",
      "Coffee addiction problems",
      "Weekend plans vs reality",
      "Social media vs real life",
      "Procrastination masterclass"
    ];
  }
}