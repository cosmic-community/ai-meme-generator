export interface MemeConfig {
  text: string;
  template?: string;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
}

export function generateMemeImage(config: MemeConfig): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Background
    ctx.fillStyle = config.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add gradient background for better visual appeal
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text styling
    const fontSize = config.fontSize || 48;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = config.fontColor || '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';

    // Split text into lines if too long
    const maxWidth = canvas.width - 40;
    const lines = wrapText(ctx, config.text, maxWidth);
    
    // Calculate starting y position for centered text
    const lineHeight = fontSize + 10;
    const totalHeight = lines.length * lineHeight;
    let y = (canvas.height - totalHeight) / 2 + fontSize;

    // Draw text with outline
    lines.forEach((line, index) => {
      const currentY = y + (index * lineHeight);
      
      // Draw text outline
      ctx.strokeText(line, canvas.width / 2, currentY);
      // Draw text fill
      ctx.fillText(line, canvas.width / 2, currentY);
    });

    // Add meme watermark
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Created with AI Meme Generator', canvas.width - 150, canvas.height - 15);

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png', 0.9);
    resolve(dataUrl);
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function shareToSocial(platform: string, memeUrl: string, caption: string) {
  const encodedCaption = encodeURIComponent(caption);
  const encodedUrl = encodeURIComponent(memeUrl);
  
  const shareUrls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedCaption}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedCaption}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedCaption}`,
    instagram: memeUrl // Instagram doesn't support direct sharing, just copy the image
  };

  if (shareUrls[platform]) {
    if (platform === 'instagram') {
      // For Instagram, we'll copy the image to clipboard or show instructions
      navigator.clipboard.writeText(memeUrl).then(() => {
        alert('Meme URL copied to clipboard! You can now post it on Instagram.');
      }).catch(() => {
        alert('Save the meme image and upload it to Instagram manually.');
      });
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  }
}

// Meme templates data
export const memeTemplates = [
  {
    id: 'classic-meme',
    name: 'Classic Meme',
    description: 'Traditional top and bottom text format',
    preview: '/templates/classic-preview.png'
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Stylish gradient background',
    preview: '/templates/gradient-preview.png'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple clean design',
    preview: '/templates/minimal-preview.png'
  }
];