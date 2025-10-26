import { NextApiRequest, NextApiResponse } from 'next';

interface PalmFeatures {
  heartLineStrength: number;
  headLineLength: number;
  lifeLineDepth: number;
  fateLine: boolean;
  marriageLines: number;
  mounts: {
    venus: number;
    jupiter: number;
    saturn: number;
    apollo: number;
    mercury: number;
    mars: number;
    luna: number;
  };
}

interface PalmLine {
  coords: number[];
  length: number;
  type: string;
  strength?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simulate AI processing for realistic experience  
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Generate comprehensive palm analysis
    const features = analyzePalmFeatures();
    const analysis = generateCompleteAnalysis(features);

    res.status(200).json(analysis);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Palm analysis failed',
      message: 'Unable to process your palm image. Please try again.'
    });
  }
}

function analyzePalmFeatures(): PalmFeatures {
  return {
    heartLineStrength: Math.random() * 100,
    headLineLength: Math.random() * 100,  
    lifeLineDepth: Math.random() * 100,
    fateLine: Math.random() > 0.3,
    marriageLines: Math.floor(Math.random() * 4) + 1,
    mounts: {
      venus: Math.random() * 100,
      jupiter: Math.random() * 100,
      saturn: Math.random() * 100,
      apollo: Math.random() * 100,
      mercury: Math.random() * 100,
      mars: Math.random() * 100,
      luna: Math.random() * 100
    }
  };
}

function generateCompleteAnalysis(features: PalmFeatures) {
  // Generate palm lines
  const lines: PalmLine[] = [
    { coords: [100, 50, 200, 80], length: 120, type: 'heart', strength: features.heartLineStrength },
    { coords: [80, 100, 180, 140], length: 140, type: 'head', strength: features.headLineLength },
    { coords: [90, 150, 190, 200], length: 160, type: 'life', strength: features.lifeLineDepth }
  ];

  if (features.fateLine) {
    lines.push({ coords: [150, 80, 170, 220], length: 180, type: 'fate', strength: 85 });
  }

  // Generate comprehensive reading
  let interpretation = `🔮 **YOUR COMPLETE PALM READING & FUTURE PREDICTIONS** 🔮\n\n`;

  // Heart Line - Love & Relationships
  interpretation += `💖 **LOVE & RELATIONSHIPS**\n`;
  if (features.heartLineStrength > 70) {
    interpretation += `Your heart line reveals exceptional emotional depth and passionate love capacity. You experience intense, transformative relationships.\n\n**FUTURE LOVE PREDICTIONS:**\n• A significant romantic encounter awaits you within the next 6-8 months\n• This relationship will be unlike anything you've experienced before\n• Marriage or deep commitment is strongly indicated within 2-3 years\n• Your soulmate may have artistic or creative talents\n\n`;
  } else if (features.heartLineStrength > 40) {
    interpretation += `Your heart line shows balanced emotional nature and thoughtful approach to love. You create stable, lasting relationships.\n\n**FUTURE LOVE PREDICTIONS:**\n• Existing relationships will deepen and strengthen over the next year\n• If single, love will come through social circles or work connections\n• A meaningful partnership will develop gradually but surely\n• Family expansion or commitment ceremonies are in your near future\n\n`;
  } else {
    interpretation += `Your heart line indicates a careful, discerning approach to love. You value deep connection over surface attraction.\n\n**FUTURE LOVE PREDICTIONS:**\n• Someone patient and understanding will appreciate your depth\n• Love may come later in life but will be profound and lasting\n• Focus on self-love first - this will attract the right partner\n• A quiet, meaningful relationship will bring you great joy\n\n`;
  }

  // Head Line - Career & Success  
  interpretation += `🧠 **CAREER & SUCCESS PREDICTIONS**\n`;
  if (features.headLineLength > 70) {
    interpretation += `Your head line reveals brilliant analytical abilities and strategic thinking. You're destined for intellectual leadership.\n\n**CAREER PREDICTIONS:**\n• A major breakthrough or promotion is coming within 6-12 months\n• Your innovative ideas will revolutionize your field\n• Leadership positions and increased responsibility await you\n• Financial prosperity through intellectual work is strongly indicated\n• You may become known as an expert or thought leader in your industry\n\n`;
  } else if (features.headLineLength > 40) {
    interpretation += `Your head line shows practical intelligence and sound decision-making. Success comes through steady progress.\n\n**CAREER PREDICTIONS:**\n• Consistent growth and advancement over the next 2-3 years\n• Your reliable nature will be recognized and rewarded\n• New opportunities will come through networking and referrals\n• A stable, well-paying position is in your future\n• You'll find the perfect balance between challenge and security\n\n`;
  } else {
    interpretation += `Your head line emphasizes intuition and creativity over pure logic. Success comes through following your heart.\n\n**CAREER PREDICTIONS:**\n• Creative or people-focused careers will bring fulfillment\n• Trust your instincts in upcoming career decisions\n• Artistic or healing talents may become profitable\n• Non-traditional career paths will suit you better than corporate roles\n• Your empathy and intuition are your greatest professional assets\n\n`;
  }

  // Life Line - Health & Longevity
  interpretation += `⚡ **HEALTH & LIFE ENERGY PREDICTIONS**\n`;
  if (features.lifeLineDepth > 70) {
    interpretation += `Your life line indicates exceptional vitality and robust health throughout your life.\n\n**HEALTH & LONGEVITY PREDICTIONS:**\n• You'll maintain excellent health well into your 80s and beyond\n• High energy levels will allow you to pursue ambitious goals\n• Physical activities and sports may play important roles in your life\n• Quick recovery from any health challenges\n• Your active lifestyle will inspire others around you\n\n`;
  } else if (features.lifeLineDepth > 40) {
    interpretation += `Your life line shows good overall health with natural energy cycles.\n\n**HEALTH & LONGEVITY PREDICTIONS:**\n• Balanced lifestyle choices will ensure continued vitality\n• Pay attention to stress management for optimal health\n• Regular exercise and good nutrition will be especially beneficial\n• Minor health improvements will have major positive impacts\n• Your later years will be comfortable and fulfilling\n\n`;
  } else {
    interpretation += `Your life line suggests the importance of mindful health management and self-care.\n\n**HEALTH & LONGEVITY PREDICTIONS:**\n• Focus on wellness will dramatically improve your life quality\n• Stress reduction and relaxation techniques will be crucial\n• Alternative healing methods may be particularly effective for you\n• Your health journey will teach you valuable lessons about self-care\n• Proper attention to health will unlock your full potential\n\n`;
  }

  // Fate Line
  if (features.fateLine) {
    interpretation += `🌟 **DESTINY & LIFE PURPOSE**\n`;
    interpretation += `Your fate line reveals a strong sense of destiny and clear life purpose.\n\n**DESTINY PREDICTIONS:**\n• Major life changes are coming that will align you with your true path\n• Success will come through following your authentic calling\n• A significant opportunity around age ${Math.floor(Math.random() * 10) + 35} will be life-changing\n• Your work will have lasting impact on others\n• Recognition and achievement await those who stay true to their purpose\n\n`;
  }

  // Mount Analysis with Predictions
  interpretation += `🏔️ **PERSONALITY STRENGTHS & FUTURE OPPORTUNITIES**\n`;
  
  if (features.mounts.jupiter > 60) {
    interpretation += `• **Leadership Mount Strong**: You're destined for positions of authority and influence. Expect leadership opportunities within the next year.\n`;
  }
  if (features.mounts.mercury > 60) {
    interpretation += `• **Communication Mount Strong**: Your words have power. Writing, speaking, or technology ventures will bring success.\n`;
  }
  if (features.mounts.apollo > 60) {
    interpretation += `• **Creativity Mount Strong**: Artistic recognition and creative success are in your future. Your talents will be discovered.\n`;
  }
  if (features.mounts.venus > 60) {
    interpretation += `• **Love Mount Strong**: You attract love and beauty effortlessly. Romantic opportunities and artistic appreciation surround you.\n`;
  }
  if (features.mounts.saturn > 60) {
    interpretation += `• **Wisdom Mount Strong**: You'll become a trusted advisor. Others will seek your counsel on important matters.\n`;
  }
  if (features.mounts.mars > 60) {
    interpretation += `• **Courage Mount Strong**: You'll overcome significant challenges through determination. Victory awaits the brave.\n`;
  }
  if (features.mounts.luna > 60) {
    interpretation += `• **Intuition Mount Strong**: Your psychic abilities are highly developed. Trust your inner voice for guidance.\n`;
  }

  // Specific Future Events
  interpretation += `\n🎯 **SPECIFIC FUTURE EVENTS TO WATCH FOR**\n`;
  interpretation += `• Within 3 months: An unexpected message or call will bring good news\n`;
  interpretation += `• Within 6 months: A financial opportunity or bonus will improve your situation\n`;
  interpretation += `• Within 1 year: A relationship will reach a new level of commitment\n`;
  interpretation += `• Within 2 years: A long-held dream will begin to manifest in reality\n`;
  interpretation += `• Within 5 years: You'll be recognized as an expert in your chosen field\n\n`;

  // Marriage/Relationship Lines
  interpretation += `💍 **MARRIAGE & PARTNERSHIP PREDICTIONS**\n`;
  if (features.marriageLines === 1) {
    interpretation += `One deep marriage line indicates a single, profound life partnership. This relationship will define your understanding of love.\n`;
  } else if (features.marriageLines === 2) {
    interpretation += `Two marriage lines suggest two significant relationships - one may be a learning experience, the other your true match.\n`;
  } else {
    interpretation += `Multiple marriage lines indicate a rich emotional life with several meaningful relationships. Each teaches valuable lessons.\n`;
  }

  // Lucky periods
  interpretation += `\n🍀 **YOUR MOST FORTUNATE PERIODS**\n`;
  interpretation += `• Ages ${Math.floor(Math.random() * 10) + 25}-${Math.floor(Math.random() * 10) + 35}: Major career and love breakthroughs\n`;
  interpretation += `• Ages ${Math.floor(Math.random() * 10) + 40}-${Math.floor(Math.random() * 10) + 50}: Peak earning potential and recognition\n`;
  interpretation += `• Ages ${Math.floor(Math.random() * 10) + 55}-${Math.floor(Math.random() * 10) + 65}: Wisdom, respect, and spiritual fulfillment\n\n`;

  interpretation += `✨ **FINAL MESSAGE**: Your palm reveals someone with tremendous potential for happiness, success, and meaningful relationships. Trust in your journey - the universe has wonderful plans for you!`;

  // Generate detailed overlay
  const overlay = createEnhancedOverlay(lines, features);

  return {
    lines,
    interpretation,
    overlay
  };
}

function createEnhancedOverlay(lines: PalmLine[], features: PalmFeatures): string {
  const svgLines = lines.map((line, index) => {
    const colors = ['#ff1744', '#00e676', '#3f51b5', '#ff9800'];
    const lineNames = ['Heart', 'Head', 'Life', 'Fate'];
    return `<g>
      <line x1="${line.coords[0]}" y1="${line.coords[1]}" x2="${line.coords[2]}" y2="${line.coords[3]}" 
            stroke="${colors[index % colors.length]}" stroke-width="4" stroke-linecap="round" />
      <text x="${line.coords[2] + 5}" y="${line.coords[3]}" font-family="Arial" font-size="10" 
            fill="${colors[index % colors.length]}">${lineNames[index % lineNames.length]}</text>
    </g>`;
  }).join('\n    ');

  const svg = `<svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="palmBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="400" height="500" fill="url(#palmBg)" />
  
  <!-- Title -->
  <text x="200" y="30" font-family="Arial" font-size="18" fill="#ffd700" text-anchor="middle" font-weight="bold">
    🔮 Advanced Palm Analysis
  </text>
  <text x="200" y="50" font-family="Arial" font-size="12" fill="#e0e6ed" text-anchor="middle">
    Your Future Revealed Through Ancient Wisdom
  </text>
  
  <!-- Palm outline -->
  <ellipse cx="200" cy="250" rx="120" ry="180" fill="none" stroke="#444" stroke-width="2" stroke-dasharray="5,5" opacity="0.6"/>
  
  <!-- Palm lines -->
  ${svgLines}
  
  <!-- Analysis box -->
  <rect x="20" y="420" width="360" height="70" fill="rgba(0,0,0,0.8)" rx="10" stroke="#ffd700" stroke-width="1"/>
  
  <!-- Stats -->
  <text x="30" y="440" font-family="Arial" font-size="12" fill="#ffd700" font-weight="bold">Palm Reading Results:</text>
  <text x="30" y="455" font-family="Arial" font-size="10" fill="#ff1744">💖 Heart Strength: ${features.heartLineStrength.toFixed(0)}%</text>
  <text x="150" y="455" font-family="Arial" font-size="10" fill="#00e676">🧠 Mind Power: ${features.headLineLength.toFixed(0)}%</text>
  <text x="270" y="455" font-family="Arial" font-size="10" fill="#3f51b5">⚡ Life Force: ${features.lifeLineDepth.toFixed(0)}%</text>
  
  <text x="30" y="470" font-family="Arial" font-size="10" fill="#e0e6ed">Marriage Lines: ${features.marriageLines}</text>
  <text x="150" y="470" font-family="Arial" font-size="10" fill="${features.fateLine ? '#ff9800' : '#666'}">
    🌟 Fate Line: ${features.fateLine ? 'Present & Strong' : 'Developing'}
  </text>
  
  <text x="30" y="485" font-family="Arial" font-size="10" fill="#ffd700">
    ✨ Dominant Mount: ${getDominantMount(features.mounts)}
  </text>
</svg>`;

  return "data:image/svg+xml;base64," + Buffer.from(svg).toString('base64');
}

function getDominantMount(mounts: PalmFeatures['mounts']): string {
  const mountNames = {
    venus: 'Venus (Love)',
    jupiter: 'Jupiter (Leadership)', 
    saturn: 'Saturn (Wisdom)',
    apollo: 'Apollo (Creativity)',
    mercury: 'Mercury (Communication)',
    mars: 'Mars (Courage)',
    luna: 'Luna (Intuition)'
  };

  let maxMount = 'venus';
  let maxValue = mounts.venus;

  Object.entries(mounts).forEach(([mount, value]) => {
    if (value > maxValue) {
      maxValue = value;
      maxMount = mount as keyof typeof mountNames;
    }
  });

  return mountNames[maxMount as keyof typeof mountNames];
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};