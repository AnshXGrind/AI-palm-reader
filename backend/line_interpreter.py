import random
from typing import Dict, List, Any


def interpret_heart_line(heart_lines: List[Dict]) -> Dict[str, str]:
    """Interpret the heart line for love and emotional characteristics"""
    if not heart_lines:
        return {
            "emotional_nature": "You tend to be emotionally reserved and selective in relationships. You value deep connections over superficial interactions.",
            "love_life": "You approach love with caution and thoughtfulness. When you commit, it's with your whole heart.",
            "relationships": "You prefer quality over quantity in relationships and take time to trust new people."
        }
    
    heart_line = max(heart_lines, key=lambda x: x['length'])
    length = heart_line['length']
    center_y = heart_line['center_y']
    
    interpretations = {}
    
    # Emotional nature based on line characteristics
    if length > 150:
        if center_y < 0.3:
            interpretations["emotional_nature"] = "You're deeply emotional and passionate, with a strong capacity for love. You wear your heart on your sleeve and express feelings openly."
        else:
            interpretations["emotional_nature"] = "You have a balanced emotional nature - passionate yet thoughtful. You can be both romantic and practical in relationships."
    elif length > 80:
        interpretations["emotional_nature"] = "You have a moderate emotional temperament. You're caring but maintain healthy boundaries in relationships."
    else:
        interpretations["emotional_nature"] = "You tend to be emotionally cautious and analytical. You think with your head as much as your heart in matters of love."
    
    # Love life predictions
    if center_y < 0.25:
        interpretations["love_life"] = "Romance plays a central role in your life. You're likely to have passionate, transformative relationships that deeply impact your personal growth."
    elif center_y < 0.4:
        interpretations["love_life"] = "You'll experience meaningful love that balances passion with stability. Your relationships tend to grow stronger over time."
    else:
        interpretations["love_life"] = "You approach love pragmatically. Your relationships are built on mutual respect, shared values, and genuine compatibility."
    
    # Relationship style
    if heart_line.get('is_horizontal', False):
        interpretations["relationships"] = "You're straightforward in relationships - honest, loyal, and direct in your communication. Partners appreciate your authenticity."
    else:
        interpretations["relationships"] = "You're emotionally complex and intuitive in relationships. You pick up on subtle cues and have deep empathy for others."
    
    return interpretations


def interpret_head_line(head_lines: List[Dict]) -> Dict[str, str]:
    """Interpret the head line for intelligence and mental characteristics"""
    if not head_lines:
        return {
            "mental_strength": "You rely on intuition and emotional intelligence more than analytical thinking. You're creative and imaginative.",
            "decision_making": "You make decisions based on gut feelings and personal values rather than pure logic.",
            "career_aptitude": "You're well-suited for creative, people-oriented, or service-based careers where emotional intelligence is valued."
        }
    
    head_line = max(head_lines, key=lambda x: x['length'])
    length = head_line['length']
    angle = head_line['angle']
    
    interpretations = {}
    
    # Mental characteristics
    if length > 160:
        interpretations["mental_strength"] = "You possess exceptional analytical abilities and mental clarity. You're a natural problem-solver with strong focus and concentration."
    elif length > 100:
        interpretations["mental_strength"] = "You have well-balanced mental faculties - both logical and creative thinking. You approach problems methodically."
    else:
        interpretations["mental_strength"] = "You're more of a quick thinker than a deep analyzer. You trust instincts and make rapid decisions."
    
    # Decision making style
    if angle < 15:  # Very horizontal
        interpretations["decision_making"] = "You're highly rational and logical in decision-making. You analyze all options thoroughly before choosing."
    elif angle < 45:
        interpretations["decision_making"] = "You balance logic with intuition in your decisions. You consider both facts and feelings."
    else:
        interpretations["decision_making"] = "You're an intuitive decision-maker who often goes with gut feelings. Your instincts are usually reliable."
    
    # Career aptitude
    if length > 140 and angle < 30:
        interpretations["career_aptitude"] = "You're ideal for careers requiring analytical thinking: science, engineering, finance, law, or technology leadership roles."
    elif length > 100:
        interpretations["career_aptitude"] = "You're versatile and could succeed in various fields. Consider careers in management, education, consulting, or creative industries."
    else:
        interpretations["career_aptitude"] = "You excel in fast-paced, dynamic environments. Sales, marketing, entrepreneurship, or creative fields suit you well."
    
    return interpretations


def interpret_life_line(life_lines: List[Dict]) -> Dict[str, str]:
    """Interpret the life line for health and vitality"""
    if not life_lines:
        return {
            "vitality": "You may have a more delicate constitution but compensate with mental strength and spiritual resilience.",
            "health_trends": "Focus on preventive care and stress management. Your health is closely tied to your emotional well-being.",
            "life_energy": "Your energy comes in waves. You're more of a sprinter than a marathon runner - intense bursts followed by recovery periods."
        }
    
    life_line = max(life_lines, key=lambda x: x['length'])
    length = life_line['length']
    center_x = life_line['center_x']
    
    interpretations = {}
    
    # Vitality assessment
    if length > 180:
        interpretations["vitality"] = "You have exceptional physical vitality and stamina. Your constitution is naturally strong and resilient."
    elif length > 120:
        interpretations["vitality"] = "You possess good natural energy and health. With proper care, you maintain vitality throughout life."
    else:
        interpretations["vitality"] = "Your energy is more refined than robust. You excel when you pace yourself and avoid overexertion."
    
    # Health trends
    if center_x < 0.3:
        interpretations["health_trends"] = "You have a strong constitution with good resistance to illness. Regular exercise and outdoor activities benefit you greatly."
    elif center_x < 0.5:
        interpretations["health_trends"] = "Your health is generally stable but benefits from consistent routines. Balance activity with adequate rest."
    else:
        interpretations["health_trends"] = "Your health requires mindful attention. Stress management, proper nutrition, and regular check-ups are important."
    
    # Life energy patterns
    if life_line.get('is_vertical', False):
        interpretations["life_energy"] = "Your energy is steady and consistent throughout life. You're a reliable, enduring presence in others' lives."
    else:
        interpretations["life_energy"] = "Your life energy follows natural cycles - periods of high activity followed by rest and renewal. This rhythm serves you well."
    
    return interpretations


def interpret_fate_line(fate_lines: List[Dict]) -> Dict[str, str]:
    """Interpret the fate line for career and destiny"""
    if not fate_lines:
        return {
            "career_path": "You're a free spirit who creates your own path. Traditional career structures may feel limiting to your entrepreneurial nature.",
            "success_pattern": "Your success comes through innovation and independence rather than following conventional routes.",
            "life_purpose": "Your purpose is to forge new ways of doing things and inspire others to think outside the box."
        }
    
    fate_line = max(fate_lines, key=lambda x: x['length'])
    length = fate_line['length']
    center_y = fate_line['center_y']
    
    interpretations = {}
    
    # Career path characteristics
    if length > 150:
        interpretations["career_path"] = "You have a strong sense of destiny and purpose. Your career will likely follow a clear, upward trajectory with significant achievements."
    elif length > 90:
        interpretations["career_path"] = "You'll experience steady career progress with some interesting turns. Your path may involve multiple career phases or industries."
    else:
        interpretations["career_path"] = "You prefer flexibility and variety in your career. You may change directions several times, each move bringing new growth."
    
    # Success patterns
    if center_y < 0.4:
        interpretations["success_pattern"] = "Early success and recognition are likely. You may achieve prominence in your field at a relatively young age."
    elif center_y < 0.7:
        interpretations["success_pattern"] = "Your major success comes through mid-life experiences and accumulated wisdom. Your best years professionally are ahead."
    else:
        interpretations["success_pattern"] = "You're a late bloomer who achieves significant success later in life. Your unique perspective becomes increasingly valuable with age."
    
    # Life purpose
    if fate_line.get('is_vertical', False):
        interpretations["life_purpose"] = "You're destined for leadership and making a lasting impact. Your life purpose involves guiding and inspiring others."
    else:
        interpretations["life_purpose"] = "Your purpose is to bring balance and harmony to whatever field you enter. You're a natural mediator and bridge-builder."
    
    return interpretations


def analyze_palm_personality(features: Dict) -> Dict[str, str]:
    """Analyze overall personality based on palm features"""
    personality = {}
    
    # Based on palm shape
    if features['palm_shape'] == 'wide':
        personality['temperament'] = "You have an outgoing, social temperament. You're comfortable in groups and often take on leadership roles naturally."
    elif features['palm_shape'] == 'long':
        personality['temperament'] = "You have a contemplative, analytical temperament. You prefer deep conversations and meaningful connections over small talk."
    else:
        personality['temperament'] = "You have a well-balanced temperament that adapts to different social situations. You're equally comfortable alone or with others."
    
    # Based on line density
    if features['line_density'] > 15:
        personality['complexity'] = "You have a complex, multi-faceted personality with many interests and talents. You may sometimes feel pulled in different directions."
    elif features['line_density'] > 8:
        personality['complexity'] = "You have a rich inner life with several key interests that define you. You're selective about where you invest your energy."
    else:
        personality['complexity'] = "You have a focused, streamlined personality. You know what you want and pursue it with single-minded determination."
    
    # Based on dominant direction
    if features['dominant_line_direction'] == 'horizontal':
        personality['approach'] = "You're naturally collaborative and relationship-oriented. You achieve your goals through cooperation and networking."
    elif features['dominant_line_direction'] == 'vertical':
        personality['approach'] = "You're independently motivated and achievement-oriented. You prefer to rely on your own efforts and abilities."
    else:
        personality['approach'] = "You're adaptable in your approach, using both collaboration and independence as situations require."
    
    return personality


def generate_future_predictions(classified_lines: Dict, features: Dict) -> Dict[str, List[str]]:
    """Generate specific future predictions based on palm analysis"""
    predictions = {
        'love_romance': [],
        'career_success': [],
        'health_wellness': [],
        'financial': [],
        'personal_growth': []
    }
    
    # Love & Romance Predictions
    heart_strength = features.get('heart_line_strength', 0)
    if heart_strength > 150:
        predictions['love_romance'].extend([
            "A significant romantic encounter is likely within the next 18 months",
            "You may reconnect with someone from your past in a meaningful way",
            "Your capacity for deep love will attract a soulmate-level connection"
        ])
    elif heart_strength > 80:
        predictions['love_romance'].extend([
            "Existing relationships will deepen and become more meaningful",
            "You'll gain clarity about what you truly want in a life partner",
            "A friendship may evolve into something more romantic"
        ])
    else:
        predictions['love_romance'].extend([
            "Focus on self-love will attract the right romantic energy",
            "You may prefer casual connections before committing to something serious",
            "Your ideal partner will appreciate your independent nature"
        ])
    
    # Career & Success Predictions
    fate_strength = features.get('fate_line_strength', 0)
    head_strength = features.get('head_line_strength', 0)
    
    if fate_strength > 120 and head_strength > 100:
        predictions['career_success'].extend([
            "A major career breakthrough is approaching within 2-3 years",
            "Leadership opportunities will present themselves unexpectedly",
            "Your innovative ideas will gain recognition and financial reward"
        ])
    elif fate_strength > 60 or head_strength > 80:
        predictions['career_success'].extend([
            "Steady career progress with opportunities for advancement",
            "A mentor figure will play an important role in your success",
            "Skills you're developing now will become highly valuable"
        ])
    else:
        predictions['career_success'].extend([
            "Your entrepreneurial spirit will lead to unique opportunities",
            "Non-traditional career paths will suit you better than conventional ones",
            "Your success will come through creativity and innovation"
        ])
    
    # Health & Wellness Predictions
    life_strength = features.get('life_line_strength', 0)
    if life_strength > 160:
        predictions['health_wellness'].extend([
            "Your vitality will remain strong well into your later years",
            "Physical fitness and outdoor activities will be sources of joy",
            "You may inspire others to adopt healthier lifestyles"
        ])
    elif life_strength > 100:
        predictions['health_wellness'].extend([
            "Maintaining balance between activity and rest will serve you well",
            "Pay attention to stress levels as they directly impact your health",
            "Holistic health approaches will be particularly effective for you"
        ])
    else:
        predictions['health_wellness'].extend([
            "Your health improves significantly when you reduce stress",
            "Alternative healing methods may be more effective than traditional ones",
            "Your mental and emotional health are the keys to physical wellness"
        ])
    
    # Financial Predictions
    total_line_strength = sum([
        features.get('heart_line_strength', 0),
        features.get('head_line_strength', 0),
        features.get('fate_line_strength', 0)
    ])
    
    if total_line_strength > 400:
        predictions['financial'].extend([
            "Multiple income streams will provide financial security",
            "A significant financial opportunity will arise through networking",
            "Your financial situation will improve dramatically in the next 3-5 years"
        ])
    elif total_line_strength > 200:
        predictions['financial'].extend([
            "Steady financial growth through consistent effort and smart decisions",
            "An investment or business venture will prove profitable",
            "Your financial intuition will guide you to good opportunities"
        ])
    else:
        predictions['financial'].extend([
            "Financial abundance will come through non-traditional means",
            "Your creativity and unique skills are your greatest financial assets",
            "Avoid get-rich-quick schemes; slow and steady wins for you"
        ])
    
    # Personal Growth Predictions
    minor_lines_count = features.get('minor_lines_count', 0)
    if minor_lines_count > 8:
        predictions['personal_growth'].extend([
            "A period of intense personal transformation is beginning",
            "You'll discover hidden talents that change your life direction",
            "Spiritual or philosophical studies will become important to you"
        ])
    elif minor_lines_count > 3:
        predictions['personal_growth'].extend([
            "You're entering a phase of increased self-awareness and confidence",
            "Old patterns that no longer serve you will naturally fall away",
            "You'll find your authentic voice and purpose"
        ])
    else:
        predictions['personal_growth'].extend([
            "Your growth comes through focused, deliberate practice",
            "A few key relationships will catalyze significant personal development",
            "You'll become a source of wisdom and guidance for others"
        ])
    
    return predictions


def interpret_palm_comprehensive(classified_lines: Dict, features: Dict) -> str:
    """Generate comprehensive palm reading interpretation"""
    
    # Get detailed interpretations for each major line
    heart_reading = interpret_heart_line(classified_lines.get('heart_line', []))
    head_reading = interpret_head_line(classified_lines.get('head_line', []))
    life_reading = interpret_life_line(classified_lines.get('life_line', []))
    fate_reading = interpret_fate_line(classified_lines.get('fate_line', []))
    
    # Get personality analysis
    personality = analyze_palm_personality(features)
    
    # Get future predictions
    predictions = generate_future_predictions(classified_lines, features)
    
    # Count total lines for overview
    total_major_lines = sum(len(lines) for line_type, lines in classified_lines.items() if line_type != 'minor_lines')
    minor_lines_count = len(classified_lines.get('minor_lines', []))
    
    # Build comprehensive reading
    reading_parts = []
    
    # Opening overview
    reading_parts.append("🌟 **COMPREHENSIVE PALM ANALYSIS** 🌟\n")
    reading_parts.append(f"Your palm reveals {total_major_lines} major lines and {minor_lines_count} minor lines, indicating a {'complex and multi-faceted' if total_major_lines + minor_lines_count > 12 else 'focused and purposeful'} personality.\n")
    
    # Personality overview
    reading_parts.append("👤 **PERSONALITY PROFILE**")
    reading_parts.append(f"**Temperament:** {personality.get('temperament', 'You have a unique temperament that defies easy categorization.')}")
    reading_parts.append(f"**Complexity:** {personality.get('complexity', 'Your personality has multiple layers waiting to be discovered.')}")
    reading_parts.append(f"**Life Approach:** {personality.get('approach', 'You have a flexible approach that adapts to circumstances.')}\n")
    
    # Major lines analysis
    reading_parts.append("💝 **LOVE & RELATIONSHIPS** (Heart Line)")
    reading_parts.append(f"**Emotional Nature:** {heart_reading.get('emotional_nature', 'Your emotional nature is complex and evolving.')}")
    reading_parts.append(f"**Love Life:** {heart_reading.get('love_life', 'Love will find you when the timing is right.')}")
    reading_parts.append(f"**Relationship Style:** {heart_reading.get('relationships', 'You bring authenticity to all your relationships.')}\n")
    
    reading_parts.append("🧠 **INTELLIGENCE & DECISION MAKING** (Head Line)")
    reading_parts.append(f"**Mental Strength:** {head_reading.get('mental_strength', 'Your mind is your greatest asset.')}")
    reading_parts.append(f"**Decision Making:** {head_reading.get('decision_making', 'You make decisions in your own unique way.')}")
    reading_parts.append(f"**Career Aptitude:** {head_reading.get('career_aptitude', 'Success will come through leveraging your natural talents.')}\n")
    
    reading_parts.append("🌱 **HEALTH & VITALITY** (Life Line)")
    reading_parts.append(f"**Physical Vitality:** {life_reading.get('vitality', 'Your vitality is tied to your overall life balance.')}")
    reading_parts.append(f"**Health Trends:** {life_reading.get('health_trends', 'Listen to your body and honor its wisdom.')}")
    reading_parts.append(f"**Life Energy:** {life_reading.get('life_energy', 'Your energy patterns are uniquely yours.')}\n")
    
    reading_parts.append("🎯 **CAREER & DESTINY** (Fate Line)")
    reading_parts.append(f"**Career Path:** {fate_reading.get('career_path', 'Your career will be as unique as you are.')}")
    reading_parts.append(f"**Success Pattern:** {fate_reading.get('success_pattern', 'Success will come in your own perfect timing.')}")
    reading_parts.append(f"**Life Purpose:** {fate_reading.get('life_purpose', 'Your purpose will unfold naturally as you follow your authentic path.')}\n")
    
    # Future predictions
    reading_parts.append("🔮 **FUTURE INSIGHTS & PREDICTIONS**\n")
    
    for category, pred_list in predictions.items():
        if pred_list:
            category_name = category.replace('_', ' & ').title()
            reading_parts.append(f"**{category_name}:**")
            for prediction in pred_list[:2]:  # Limit to 2 predictions per category
                reading_parts.append(f"• {prediction}")
            reading_parts.append("")
    
    # Closing wisdom
    reading_parts.append("✨ **FINAL WISDOM**")
    reading_parts.append("Your palm reveals a unique individual with tremendous potential. Trust in your journey, embrace your authentic self, and remember that your destiny is ultimately shaped by your choices and actions. The lines in your palm are a map, but you are the navigator of your own life.")
    
    return "\n".join(reading_parts)


def interpret_lines(classified_lines: Dict, features: Dict = None) -> str:
    """Main interpretation function that handles both old and new formats"""
    
    # Handle legacy format (simple list of lines)
    if isinstance(classified_lines, list):
        # Convert old format to new format for basic compatibility
        simple_lines = classified_lines
        if not simple_lines:
            return "No prominent lines detected. Try a clearer photo with good lighting and the whole palm visible."
        
        # Basic legacy interpretation
        total_length = sum(l.get("length", 0) for l in simple_lines)
        observations = []
        
        if total_length > 1200:
            observations.append("Your palm shows strong, pronounced lines indicating vitality, determination, and a dynamic personality. You approach life with confidence and purpose.")
        else:
            observations.append("Your palm shows refined lines suggesting thoughtfulness, sensitivity, and introspective nature. You prefer quality over quantity in all aspects of life.")
        
        observations.append("For a more detailed reading, please try again with optimal lighting and hand positioning to enable our advanced analysis system.")
        
        return "\n".join(observations)
    
    # Handle new advanced format
    if features is None:
        features = {}
    
    return interpret_palm_comprehensive(classified_lines, features)
