"""
Tests for the palm interpretation engine.
"""

import pytest
from app.core.interpreter import PalmInterpreter, get_interpreter


class TestPalmInterpreter:
    """Test suite for PalmInterpreter"""
    
    @pytest.fixture
    def interpreter(self):
        """Create interpreter instance for testing"""
        return PalmInterpreter()
    
    @pytest.fixture
    def sample_features(self):
        """Sample palm features for testing"""
        return {
            'palm': {
                'length': 200,
                'width': 150,
                'ratio': 0.75
            },
            'fingers': {
                'thumb': 80,
                'index': 95,
                'middle': 100,
                'ring': 92,
                'pinky': 70
            },
            'finger_to_palm_ratio': 0.45,
            'lines': {
                'heart': {
                    'start': {'x': 100, 'y': 50},
                    'end': {'x': 200, 'y': 60},
                    'type': 'major'
                },
                'head': {
                    'start': {'x': 90, 'y': 120},
                    'end': {'x': 210, 'y': 125},
                    'type': 'major'
                },
                'life': {
                    'start': {'x': 80, 'y': 180},
                    'end': {'x': 120, 'y': 250},
                    'type': 'major'
                }
            }
        }
    
    def test_hand_type_determination(self, interpreter, sample_features):
        """Test that hand type is determined correctly"""
        hand_type = interpreter._determine_hand_type(sample_features)
        assert hand_type in interpreter.HAND_TYPES.keys()
    
    def test_line_analysis(self, interpreter, sample_features):
        """Test line analysis"""
        lines = sample_features.get('lines', {})
        analysis = interpreter._analyze_lines(lines)
        
        assert 'heart' in analysis
        assert 'head' in analysis
        assert 'life' in analysis
        
        # Check that analysis has expected fields
        for line_name, line_data in analysis.items():
            assert 'length' in line_data
            assert 'curve' in line_data
            assert 'interpretation' in line_data
    
    def test_finger_analysis(self, interpreter, sample_features):
        """Test finger analysis"""
        fingers = sample_features.get('fingers', {})
        analysis = interpreter._analyze_fingers(fingers)
        
        assert len(analysis) == 5  # All five fingers
        
        for finger_name, finger_data in analysis.items():
            assert 'length' in finger_data
            assert 'relative_size' in finger_data
            assert 'interpretation' in finger_data
    
    def test_complete_interpretation(self, interpreter, sample_features):
        """Test full interpretation pipeline"""
        result = interpreter.interpret(sample_features)
        
        # Check structure
        assert 'hand_type' in result
        assert 'element' in result
        assert 'hand_name' in result
        assert 'profile' in result
        assert 'readings' in result
        assert 'summary' in result
        
        # Check profile contents
        profile = result['profile']
        assert hasattr(profile, 'traits')
        assert hasattr(profile, 'strengths')
        assert hasattr(profile, 'weaknesses')
        assert hasattr(profile, 'detailed')
        
        # Check readings
        readings = result['readings']
        assert 'personality' in readings
        assert 'career' in readings
        assert 'relationships' in readings
    
    def test_hand_type_variations(self, interpreter):
        """Test different hand type classifications"""
        
        # Test Earth hand (short fingers, large palm)
        earth_features = {
            'finger_to_palm_ratio': 0.3,
            'palm': {'ratio': 0.9}
        }
        assert interpreter._determine_hand_type(earth_features) == 'earth'
        
        # Test Air hand (long fingers, narrow palm)
        air_features = {
            'finger_to_palm_ratio': 0.55,
            'palm': {'ratio': 0.7}
        }
        assert interpreter._determine_hand_type(air_features) == 'air'
        
        # Test Fire hand (very long fingers)
        fire_features = {
            'finger_to_palm_ratio': 0.65,
            'palm': {'ratio': 0.8}
        }
        assert interpreter._determine_hand_type(fire_features) == 'fire'
    
    def test_singleton_pattern(self):
        """Test that get_interpreter returns the same instance"""
        interpreter1 = get_interpreter()
        interpreter2 = get_interpreter()
        assert interpreter1 is interpreter2


def test_interpretation_consistency():
    """Test that same features produce same interpretation"""
    interpreter = PalmInterpreter()
    
    features = {
        'finger_to_palm_ratio': 0.45,
        'palm': {'ratio': 0.8},
        'fingers': {'thumb': 80, 'index': 95, 'middle': 100, 'ring': 92, 'pinky': 70},
        'lines': {}
    }
    
    # Run interpretation twice
    result1 = interpreter.interpret(features)
    result2 = interpreter.interpret(features)
    
    # Should be identical
    assert result1['hand_type'] == result2['hand_type']
    assert result1['summary'] == result2['summary']
