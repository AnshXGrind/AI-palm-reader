"""
Professional palm interpretation engine.
Maps real hand metrics to meaningful personality insights using traditional palmistry principles.
"""

from typing import Dict, Any, List, Optional
import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class PersonalityProfile:
    """Represents a complete personality profile"""
    hand_type: str
    element: str
    traits: List[str]
    strengths: List[str]
    weaknesses: List[str]
    career: List[str]
    relationships: str
    summary: str
    detailed: str


class PalmInterpreter:
    """
    Interprets palm features using traditional palmistry rules.
    Maps hand measurements to consistent, repeatable personality insights.
    """
    
    # Element classifications based on hand shape
    HAND_TYPES = {
        'earth': {
            'name': 'Earth Hand',
            'description': 'Practical, grounded, and reliable',
            'element': 'Earth 🌍',
            'traits': ['Practical', 'Stable', 'Hardworking', 'Patient'],
            'strengths': ['Reliability', 'Persistence', 'Practical wisdom'],
            'weaknesses': ['Resistance to change', 'Can be stubborn'],
            'career': ['Engineering', 'Construction', 'Agriculture', 'Finance'],
            'relationships': 'Loyal and devoted partner who values stability'
        },
        'air': {
            'name': 'Air Hand',
            'description': 'Intellectual, communicative, and curious',
            'element': 'Air 💨',
            'traits': ['Analytical', 'Communicative', 'Curious', 'Adaptable'],
            'strengths': ['Quick thinking', 'Problem-solving', 'Communication'],
            'weaknesses': ['Overthinking', 'Can be detached'],
            'career': ['Writing', 'Teaching', 'Programming', 'Law'],
            'relationships': 'Seeks intellectual connection and stimulating conversation'
        },
        'water': {
            'name': 'Water Hand',
            'description': 'Emotional, intuitive, and creative',
            'element': 'Water 💧',
            'traits': ['Intuitive', 'Creative', 'Empathetic', 'Artistic'],
            'strengths': ['Emotional intelligence', 'Creativity', 'Empathy'],
            'weaknesses': ['Oversensitivity', 'Mood swings'],
            'career': ['Art', 'Music', 'Counseling', 'Healthcare'],
            'relationships': 'Deeply emotional and seeks soulful connections'
        },
        'fire': {
            'name': 'Fire Hand',
            'description': 'Energetic, passionate, and dynamic',
            'element': 'Fire 🔥',
            'traits': ['Energetic', 'Passionate', 'Charismatic', 'Impulsive'],
            'strengths': ['Leadership', 'Enthusiasm', 'Courage'],
            'weaknesses': ['Impatience', 'Can be aggressive'],
            'career': ['Entrepreneurship', 'Sales', 'Entertainment', 'Sports'],
            'relationships': 'Passionate and exciting, but needs independence'
        },
        'mixed': {
            'name': 'Mixed Hand',
            'description': 'Balanced and adaptable',
            'element': 'Harmony ⚖️',
            'traits': ['Adaptable', 'Versatile', 'Balanced'],
            'strengths': ['Flexibility', 'Seeing multiple perspectives'],
            'weaknesses': ['May lack direction', 'Can be indecisive'],
            'career': ['Project management', 'Consulting', 'Diplomacy'],
            'relationships': 'Adapts well to different partner needs'
        }
    }
    
    # Line interpretations
    LINE_MEANINGS = {
        'heart': {
            'long': 'Deep emotional capacity and strong relationships',
            'short': 'Focused emotional energy, selective with trust',
            'curved': 'Expressive and open with feelings',
            'straight': 'Practical approach to emotions',
            'deep': 'Intense emotional experiences',
            'faint': 'Subtle emotional nature, private',
            'chained': 'Emotional ups and downs, sensitive',
            'forked': 'Balances heart and mind in decisions'
        },
        'head': {
            'long': 'Deep thinker, analytical mind',
            'short': 'Quick decisions, practical thinker',
            'curved': 'Creative problem solver, artistic',
            'straight': 'Logical, methodical thinker',
            'sloping': 'Imaginative, intuitive thinker',
            'forked': 'Can see multiple sides of issues'
        },
        'life': {
            'long': 'Strong vitality, steady energy',
            'short': 'Intense life force, lives in the moment',
            'curved': 'Enthusiastic, embraces life',
            'straight': 'Cautious, protected approach',
            'wide_curve': 'Travel-loving, adventurous',
            'close_curve': 'Home-oriented, careful'
        }
    }
    
    # Finger length meanings
    FINGER_MEANINGS = {
        'thumb': {
            'long': 'Strong willpower and determination',
            'short': 'Flexible, adaptable, goes with the flow',
            'flexible': 'Adaptable, spontaneous',
            'stiff': 'Firm principles, stubborn'
        },
        'index': {
            'long': 'Natural leader, confident',
            'short': 'Humble, prefers supporting roles',
            'straight': 'Direct, honest',
            'curved': 'Diplomatic, indirect'
        },
        'middle': {
            'long': 'Responsible, serious, disciplined',
            'short': 'Carefree, spontaneous',
            'straight': 'Reliable, consistent',
            'curved': 'Creative, unconventional'
        },
        'ring': {
            'long': 'Artistic, expressive, creative',
            'short': 'Practical, down-to-earth',
            'straight': 'Balanced self-expression',
            'curved': 'Unique artistic vision'
        },
        'pinky': {
            'long': 'Excellent communicator, persuasive',
            'short': 'Concise, direct communicator',
            'straight': 'Honest, straightforward',
            'curved': 'Charming, manipulative'
        }
    }
    
    def __init__(self, use_ml_fallback: bool = False):
        """
        Initialize the interpreter.
        
        Args:
            use_ml_fallback: If True, use ML model when available (future)
        """
        self.use_ml_fallback = use_ml_fallback
        logger.info("PalmInterpreter initialized")
    
    def interpret(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a complete interpretation from palm features.
        
        Args:
            features: Palm features from detector
            
        Returns:
            Complete interpretation dictionary
        """
        try:
            # Determine hand type (element)
            hand_type = self._determine_hand_type(features)
            element_profile = self.HAND_TYPES[hand_type]
            
            # Analyze lines
            line_analysis = self._analyze_lines(features.get('lines', {}))
            
            # Analyze fingers
            finger_analysis = self._analyze_fingers(features.get('fingers', {}))
            
            # Combine into personality profile
            personality = self._build_personality(
                element_profile,
                line_analysis,
                finger_analysis
            )
            
            # Generate readings
            readings = self._generate_readings(
                features,
                element_profile,
                line_analysis,
                finger_analysis
            )
            
            return {
                'hand_type': hand_type,
                'element': element_profile['element'],
                'hand_name': element_profile['name'],
                'profile': personality,
                'readings': readings,
                'lines': line_analysis,
                'fingers': finger_analysis,
                'summary': self._generate_summary(element_profile, line_analysis)
            }
            
        except Exception as e:
            logger.error(f"Interpretation failed: {str(e)}", exc_info=True)
            return {
                'error': 'Interpretation failed',
                'fallback': self._get_fallback_reading()
            }
    
    def _determine_hand_type(self, features: Dict[str, Any]) -> str:
        """
        Determine hand type based on finger-to-palm ratio.
        
        Traditional palmistry classification:
        - Earth: Short fingers, large palm (ratio < 0.4)
        - Water: Long fingers, medium palm (ratio 0.4-0.5)
        - Air: Long fingers, narrow palm (ratio 0.5-0.6)
        - Fire: Short fingers, energetic (ratio > 0.6)
        """
        # Get finger-to-palm ratio
        ratio = features.get('finger_to_palm_ratio', 0.5)
        
        # Also consider palm shape
        palm = features.get('palm', {})
        palm_ratio = palm.get('ratio', 1.0)  # width/height
        
        # Classification logic
        if ratio < 0.4:
            return 'earth'
        elif ratio < 0.5:
            return 'water' if palm_ratio < 0.9 else 'earth'
        elif ratio < 0.6:
            return 'air' if palm_ratio < 0.8 else 'mixed'
        else:
            return 'fire'
    
    def _analyze_lines(self, lines: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze the major palm lines.
        
        Args:
            lines: Line approximations from detector
            
        Returns:
            Analysis of each line
        """
        analysis = {}
        
        for line_name, line_data in lines.items():
            if line_name in self.LINE_MEANINGS:
                meanings = self.LINE_MEANINGS[line_name]
                
                # Determine line characteristics
                if 'start' in line_data and 'end' in line_data:
                    # Calculate line length
                    start = line_data['start']
                    end = line_data['end']
                    length = ((end['x'] - start['x'])**2 + (end['y'] - start['y'])**2)**0.5
                    
                    # Classify length
                    if length > 150:
                        length_type = 'long'
                    elif length > 80:
                        length_type = 'medium'
                    else:
                        length_type = 'short'
                    
                    # Get interpretation
                    interpretation = meanings.get(length_type, meanings.get('medium', ''))
                    
                    # Add curve analysis (simplified)
                    if abs(end['y'] - start['y']) > 30:
                        curve = 'curved'
                    else:
                        curve = 'straight'
                    
                    curve_meaning = meanings.get(curve, '')
                    
                    analysis[line_name] = {
                        'length': length_type,
                        'curve': curve,
                        'interpretation': f"{interpretation} {curve_meaning}".strip(),
                        'strength': 'deep' if length > 120 else 'normal'
                    }
        
        return analysis
    
    def _analyze_fingers(self, fingers: Dict[str, float]) -> Dict[str, Any]:
        """
        Analyze finger lengths and proportions.
        
        Args:
            fingers: Dictionary of finger lengths
            
        Returns:
            Analysis of each finger
        """
        analysis = {}
        
        if not fingers:
            return analysis
        
        # Find average finger length for comparison
        avg_length = sum(fingers.values()) / len(fingers)
        
        for finger, length in fingers.items():
            if finger in self.FINGER_MEANINGS:
                meanings = self.FINGER_MEANINGS[finger]
                
                # Determine if finger is long or short
                if length > avg_length * 1.1:
                    length_type = 'long'
                elif length < avg_length * 0.9:
                    length_type = 'short'
                else:
                    length_type = 'medium'
                
                # Get base interpretation
                interpretation = meanings.get(length_type, '')
                
                # Add to analysis
                analysis[finger] = {
                    'length': length_type,
                    'relative_size': length / avg_length if avg_length > 0 else 1.0,
                    'interpretation': interpretation
                }
        
        return analysis
    
    def _build_personality(
        self,
        element_profile: Dict[str, Any],
        line_analysis: Dict[str, Any],
        finger_analysis: Dict[str, Any]
    ) -> PersonalityProfile:
        """
        Build a complete personality profile.
        
        Args:
            element_profile: Base element characteristics
            line_analysis: Line interpretations
            finger_analysis: Finger interpretations
            
        Returns:
            Complete personality profile
        """
        # Start with base traits
        traits = element_profile['traits'].copy()
        strengths = element_profile['strengths'].copy()
        weaknesses = element_profile['weaknesses'].copy()
        
        # Add line-based traits
        for line_name, line_data in line_analysis.items():
            if line_name == 'heart':
                if line_data.get('curve') == 'curved':
                    traits.append('Emotionally expressive')
                if line_data.get('length') == 'long':
                    strengths.append('Deep emotional connections')
            elif line_name == 'head':
                if line_data.get('curve') == 'curved':
                    traits.append('Creative thinker')
                elif line_data.get('curve') == 'straight':
                    traits.append('Analytical thinker')
            elif line_name == 'life':
                if line_data.get('length') == 'long':
                    strengths.append('Strong vitality')
        
        # Add finger-based traits
        for finger_name, finger_data in finger_analysis.items():
            if finger_name == 'thumb' and finger_data.get('length') == 'long':
                traits.append('Strong-willed')
            elif finger_name == 'index' and finger_data.get('length') == 'long':
                traits.append('Natural leader')
            elif finger_name == 'pinky' and finger_data.get('length') == 'long':
                traits.append('Persuasive communicator')
        
        # Remove duplicates
        traits = list(dict.fromkeys(traits))
        strengths = list(dict.fromkeys(strengths))
        weaknesses = list(dict.fromkeys(weaknesses))
        
        # Generate detailed description
        detailed = self._generate_detailed_description(
            element_profile,
            traits,
            line_analysis,
            finger_analysis
        )
        
        return PersonalityProfile(
            hand_type=element_profile['name'],
            element=element_profile['element'],
            traits=traits,
            strengths=strengths,
            weaknesses=weaknesses,
            career=element_profile['career'],
            relationships=element_profile['relationships'],
            summary=element_profile['description'],
            detailed=detailed
        )
    
    def _generate_detailed_description(
        self,
        element_profile: Dict[str, Any],
        traits: List[str],
        line_analysis: Dict[str, Any],
        finger_analysis: Dict[str, Any]
    ) -> str:
        """Generate a detailed, flowing description"""
        
        description = f"Your hands reveal you as an {element_profile['name']}. "
        description += f"{element_profile['description']}. "
        
        # Add line insights
        if line_analysis:
            description += "\n\nYour palm lines show that "
            insights = []
            for line_name, line_data in line_analysis.items():
                if 'interpretation' in line_data and line_data['interpretation']:
                    insights.append(f"your {line_name} line indicates {line_data['interpretation'].lower()}")
            
            if insights:
                description += ", and ".join(insights) + ". "
        
        # Add finger insights
        if finger_analysis:
            description += "\n\nYour finger proportions suggest "
            finger_insights = []
            for finger_name, finger_data in finger_analysis.items():
                if 'interpretation' in finger_data and finger_data['interpretation']:
                    finger_insights.append(f"your {finger_name} ({finger_data['interpretation'].lower()})")
            
            if finger_insights:
                description += ", with ".join(finger_insights) + ". "
        
        # Add strengths
        if element_profile['strengths']:
            description += f"\n\nYour greatest strengths include: {', '.join(element_profile['strengths'])}."
        
        # Career guidance
        if element_profile['career']:
            description += f"\n\nYou would thrive in careers involving {', '.join(element_profile['career'][:3])}."
        
        return description
    
    def _generate_readings(
        self,
        features: Dict[str, Any],
        element_profile: Dict[str, Any],
        line_analysis: Dict[str, Any],
        finger_analysis: Dict[str, Any]
    ) -> Dict[str, str]:
        """Generate specific readings for different life areas"""
        
        readings = {
            'personality': element_profile['description'],
            'career': f"You're suited for {', '.join(element_profile['career'][:2])}",
            'relationships': element_profile['relationships'],
        }
        
        # Add line-specific readings
        if 'heart' in line_analysis:
            readings['love'] = f"In love, you {line_analysis['heart'].get('interpretation', 'seek deep connections')}"
        
        if 'head' in line_analysis:
            readings['mind'] = f"Your thinking style is {line_analysis['head'].get('interpretation', 'balanced')}"
        
        if 'life' in line_analysis:
            readings['life_path'] = f"Your life energy shows {line_analysis['life'].get('interpretation', 'vitality')}"
        
        return readings
    
    def _generate_summary(self, element_profile: Dict[str, Any], line_analysis: Dict[str, Any]) -> str:
        """Generate a one-line summary"""
        
        # Choose based on heart line if available
        if 'heart' in line_analysis:
            if line_analysis['heart'].get('curve') == 'curved':
                return f"The Emotional {element_profile['name'].split()[0]}"
            else:
                return f"The Practical {element_profile['name'].split()[0]}"
        
        return f"The {element_profile['name'].split()[0]} Soul"
    
    def _get_fallback_reading(self) -> Dict[str, str]:
        """Get a fallback reading when interpretation fails"""
        return {
            'personality': 'A unique and complex individual',
            'career': 'Multiple paths await you',
            'relationships': 'Meaningful connections ahead',
            'love': 'Open your heart to possibilities',
            'mind': 'Trust your intuition',
            'life_path': 'Your journey is just beginning'
        }


# Export singleton
_interpreter_instance: Optional[PalmInterpreter] = None


def get_interpreter() -> PalmInterpreter:
    """Get or create the global interpreter instance"""
    global _interpreter_instance
    if _interpreter_instance is None:
        _interpreter_instance = PalmInterpreter()
    return _interpreter_instance
