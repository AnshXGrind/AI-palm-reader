import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock palm reading analysis for Vercel deployment
    // This is a simplified version that works without OpenCV
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock palm reading data
    const mockLines = [
      { coords: [100, 50, 200, 80], length: 120 },
      { coords: [80, 100, 180, 140], length: 140 },
      { coords: [90, 150, 190, 200], length: 160 },
      { coords: [110, 200, 210, 250], length: 180 }
    ];

    const mockInterpretation = `✨ Welcome to your AI Palm Reading! ✨

Your palm shows 4 prominent lines, suggesting a rich and varied life path.

🔮 Heart Line Analysis:
The upper horizontal line indicates emotional depth and strong relationships. You tend to wear your heart on your sleeve and form deep connections with others.

🧠 Head Line Insights:  
Your mental line shows clarity of thought and practical decision-making. You balance logic with intuition effectively.

⚡ Life Line Reading:
A strong life line suggests vitality and resilience. You have the energy to pursue your goals with determination.

🌟 Overall Reading:
Your palm indicates someone who is emotionally intelligent, mentally sharp, and full of life energy. Trust your instincts and embrace the journey ahead!

*Note: This is a demo reading generated for Vercel deployment. For the full AI-powered experience with real computer vision analysis, please visit our local development version.*`;

    // Create a simple overlay image (base64 encoded)
    const mockOverlay = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJkM2E0ZiIgLz4KICA8dGV4dCB4PSIxNTAiIHk9IjIwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4J+UriBNb2NrIFBhbG0gQW5hbHlzaXMgZm9yIERlbW88L3RleHQ+CiAgPGxpbmUgeDE9IjEwMCIgeTE9IjUwIiB4Mj0iMjAwIiB5Mj0iODAiIHN0cm9rZT0iI2ZmMDA2NiIgc3Ryb2tlLXdpZHRoPSIzIiAvPgogIDxsaW5lIHgxPSI4MCIgeTE9IjEwMCIgeDI9IjE4MCIgeTI9IjE0MCIgc3Ryb2tlPSIjZmYwMDY2IiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPGxpbmUgeDE9IjkwIiB5MT0iMTUwIiB4Mj0iMTkwIiB5Mj0iMjAwIiBzdHJva2U9IiNmZjAwNjYiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8bGluZSB4MT0iMTEwIiB5MT0iMjAwIiB4Mj0iMjEwIiB5Mj0iMjUwIiBzdHJva2U9IiNmZjAwNjYiIHN0cm9rZS13aWR0aD0iMyIgLz4KPC9zdmc+";

    res.status(200).json({
      lines: mockLines,
      interpretation: mockInterpretation,
      overlay: mockOverlay
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Palm analysis failed',
      message: 'Unable to process the image. Please try again.'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}