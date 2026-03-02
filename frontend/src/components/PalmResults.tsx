import React from 'react';
import { PalmAnalysisResult } from '../types/palm';

interface PalmResultsProps {
  result: PalmAnalysisResult;
  onReset: () => void;
}

export const PalmResults: React.FC<PalmResultsProps> = ({ result, onReset }) => {
  const { handedness, confidence, interpretation, overlay } = result;
  const { hand_name, element, profile, readings, lines, fingers, summary } = interpretation;

  // Helper to get emoji for element
  const getElementEmoji = (element: string) => {
    const emojis: Record<string, string> = {
      'Earth 🌍': '🌍',
      'Air 💨': '💨',
      'Water 💧': '💧',
      'Fire 🔥': '🔥',
      'Harmony ⚖️': '⚖️'
    };
    return emojis[element] || '🔮';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with mystical flair */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {summary}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4 text-2xl">
            <span>{hand_name}</span>
            <span className="text-4xl">{getElementEmoji(element)}</span>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            {handedness} Hand · {(confidence * 100).toFixed(1)}% Confidence
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column - Image and basic info */}
        <div className="space-y-6">
          {/* Palm image with overlay */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
            <div className="relative bg-gray-900 rounded-2xl p-4">
              <img 
                src={overlay} 
                alt="Analyzed palm with landmarks"
                className="w-full rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                ✨ Lines detected
              </div>
            </div>
          </div>

          {/* Quick stats cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-1">📏</div>
              <div className="text-xs text-gray-400">Palm Type</div>
              <div className="font-semibold">{hand_name.split(' ')[0]}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs text-gray-400">Confidence</div>
              <div className="font-semibold">{(confidence * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl mb-1">🤚</div>
              <div className="text-xs text-gray-400">Hand</div>
              <div className="font-semibold">{handedness}</div>
            </div>
          </div>

          {/* Line analysis */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span> Your Palm Lines
            </h3>
            <div className="space-y-4">
              {Object.entries(lines).map(([lineName, lineData]) => (
                <div key={lineName} className="border-b border-white/10 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="capitalize font-medium text-purple-300">{lineName} Line</span>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full">
                      {lineData.length} · {lineData.curve}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{lineData.interpretation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Detailed interpretation */}
        <div className="space-y-6">
          {/* Personality profile */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🌟</span> Your Personality
            </h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              {profile.detailed}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2">✨ Strengths</h4>
                <ul className="space-y-1">
                  {profile.strengths.slice(0, 3).map((strength, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-green-400">•</span> {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-400 mb-2">🌙 Growth Areas</h4>
                <ul className="space-y-1">
                  {profile.weaknesses.slice(0, 3).map((weakness, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-orange-400">•</span> {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Readings cards */}
          <div className="grid gap-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-2xl">🔮</span> Your Insights
            </h3>
            
            {readings.love && (
              <div className="bg-pink-900/20 backdrop-blur-lg rounded-xl p-4 border border-pink-500/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">❤️</span>
                  <div>
                    <h4 className="font-semibold text-pink-300">Love & Relationships</h4>
                    <p className="text-sm text-gray-300">{readings.love}</p>
                  </div>
                </div>
              </div>
            )}

            {readings.mind && (
              <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <h4 className="font-semibold text-blue-300">Mind & Intellect</h4>
                    <p className="text-sm text-gray-300">{readings.mind}</p>
                  </div>
                </div>
              </div>
            )}

            {readings.life_path && (
              <div className="bg-green-900/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h4 className="font-semibold text-green-300">Life Path</h4>
                    <p className="text-sm text-gray-300">{readings.life_path}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Career */}
            <div className="bg-purple-900/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <h4 className="font-semibold text-purple-300">Career Guidance</h4>
                  <p className="text-sm text-gray-300">{readings.career}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.career.slice(0, 4).map((career, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-purple-500/20 rounded-full">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Traits chips */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">YOUR TRAITS</h4>
            <div className="flex flex-wrap gap-2">
              {profile.traits.map((trait, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm border border-purple-500/30"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Try again button */}
          <button
            onClick={onReset}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            ✨ Analyze Another Palm
          </button>
        </div>
      </div>
    </div>
  );
};
