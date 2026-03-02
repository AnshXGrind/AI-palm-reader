"""
Real palm detection using Mediapipe hand tracking.
This replaces the fake edge detection with actual ML-based hand landmark detection.
"""

import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
from typing import Dict, Any, Optional, List, Tuple
import logging
from dataclasses import dataclass
import base64
import os
import urllib.request

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class HandLandmark:
    """Represents a single hand landmark point"""
    x: int
    y: int
    z: float
    visibility: float = 1.0


class PalmDetector:
    """
    Professional palm detector using Google Mediapipe.
    Detects 21 precise hand landmarks and extracts meaningful palm features.
    """
    
    # Mediapipe hand landmark indices
    LANDMARK_NAMES = {
        0: 'wrist',
        1: 'thumb_cmc',
        2: 'thumb_mcp',
        3: 'thumb_ip',
        4: 'thumb_tip',
        5: 'index_mcp',
        6: 'index_pip',
        7: 'index_dip',
        8: 'index_tip',
        9: 'middle_mcp',
        10: 'middle_pip',
        11: 'middle_dip',
        12: 'middle_tip',
        13: 'ring_mcp',
        14: 'ring_pip',
        15: 'ring_dip',
        16: 'ring_tip',
        17: 'pinky_mcp',
        18: 'pinky_pip',
        19: 'pinky_dip',
        20: 'pinky_tip'
    }
    
    # MediaPipe Tasks model
    _MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    _MODEL_PATH = os.path.join(os.path.dirname(__file__), "hand_landmarker.task")

    def __init__(self, min_detection_confidence: float = 0.5, min_tracking_confidence: float = 0.5):
        """
        Initialize the Mediapipe hand detector using the Tasks API (mediapipe 0.10+).
        
        Args:
            min_detection_confidence: Minimum confidence for hand detection
            min_tracking_confidence: Minimum confidence for landmark tracking
        """
        if not os.path.exists(self._MODEL_PATH):
            logger.info("Downloading hand landmarker model...")
            urllib.request.urlretrieve(self._MODEL_URL, self._MODEL_PATH)
            logger.info(f"Model saved to {self._MODEL_PATH}")

        base_options = mp_python.BaseOptions(model_asset_path=self._MODEL_PATH)
        options = mp_vision.HandLandmarkerOptions(
            base_options=base_options,
            num_hands=1,
            min_hand_detection_confidence=min_detection_confidence,
            min_hand_presence_confidence=0.5,
            min_tracking_confidence=min_tracking_confidence,
        )
        self.landmarker = mp_vision.HandLandmarker.create_from_options(options)
        logger.info(f"PalmDetector initialised (Tasks API, confidence={min_detection_confidence})")
    
    def detect_from_image(self, image: np.ndarray) -> Dict[str, Any]:
        """
        Detect hand landmarks from an image array.
        
        Args:
            image: BGR image array (from OpenCV)
            
        Returns:
            Dictionary with detection results
        """
        try:
            # Validate input
            if image is None or image.size == 0:
                return {"success": False, "error": "Invalid image"}
            
            # Convert BGR to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Wrap in MediaPipe Image
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

            # Run detection
            result = self.landmarker.detect(mp_image)

            if not result.hand_landmarks:
                logger.warning("No hand detected in image")
                return {
                    "success": False,
                    "error": "No hand found. Please ensure your palm is clearly visible."
                }

            hand_landmarks = result.hand_landmarks[0]   # list of NormalizedLandmark

            handedness = "Unknown"
            if result.handedness:
                handedness = result.handedness[0][0].display_name  # "Left" / "Right"

            landmarks = self._extract_landmarks(hand_landmarks, image.shape)
            features = self._calculate_palm_features(landmarks)
            overlay = self._draw_landmarks(image, hand_landmarks)

            _, buffer = cv2.imencode('.png', overlay)
            overlay_base64 = base64.b64encode(buffer).decode('utf-8')

            confidence = result.handedness[0][0].score if result.handedness else 1.0
            logger.info(f"Successfully detected {handedness} hand (score={confidence:.2f})")

            return {
                "success": True,
                "handedness": handedness,
                "landmarks": landmarks,
                "features": features,
                "overlay": f"data:image/png;base64,{overlay_base64}",
                "confidence": confidence,
            }
            
        except Exception as e:
            logger.error(f"Detection failed: {str(e)}", exc_info=True)
            return {"success": False, "error": f"Detection error: {str(e)}"}
    
    def detect_from_bytes(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Detect hand landmarks from image bytes.
        
        Args:
            image_bytes: Raw image bytes (JPEG/PNG)
            
        Returns:
            Dictionary with detection results
        """
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None:
                return {"success": False, "error": "Could not decode image"}
            
            return self.detect_from_image(image)
            
        except Exception as e:
            logger.error(f"Detection from bytes failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def _extract_landmarks(self, hand_landmarks, image_shape: Tuple[int, int, int]) -> Dict[str, Dict[str, float]]:
        """
        Extract landmarks into a readable dictionary.
        Works with the Tasks API NormalizedLandmark list.
        """
        h, w = image_shape[:2]
        landmarks = {}

        for idx, landmark in enumerate(hand_landmarks):
            name = self.LANDMARK_NAMES.get(idx, f"landmark_{idx}")
            landmarks[name] = {
                'x': int(landmark.x * w),
                'y': int(landmark.y * h),
                'z': landmark.z,
                'visibility': 1.0
            }

        return landmarks
    
    def _calculate_palm_features(self, landmarks: Dict[str, Dict[str, float]]) -> Dict[str, Any]:
        """
        Calculate meaningful palm features from landmarks.
        
        Args:
            landmarks: Dictionary of hand landmarks
            
        Returns:
            Dictionary of calculated features
        """
        features = {}
        
        # 1. Palm dimensions
        if all(k in landmarks for k in ['wrist', 'middle_mcp']):
            palm_length = abs(landmarks['middle_mcp']['y'] - landmarks['wrist']['y'])
            palm_width = abs(landmarks['index_mcp']['x'] - landmarks['pinky_mcp']['x'])
            features['palm'] = {
                'length': palm_length,
                'width': palm_width,
                'ratio': palm_width / palm_length if palm_length > 0 else 0
            }
        
        # 2. Finger lengths (relative to palm)
        fingers = ['thumb', 'index', 'middle', 'ring', 'pinky']
        finger_lengths = {}
        
        for finger in fingers:
            tip = f"{finger}_tip"
            mcp = f"{finger}_mcp"
            
            if tip in landmarks and mcp in landmarks:
                length = abs(landmarks[tip]['y'] - landmarks[mcp]['y'])
                finger_lengths[finger] = length
        
        if finger_lengths:
            features['fingers'] = finger_lengths
            
            # Calculate ratios
            if 'palm' in features:
                avg_finger = sum(finger_lengths.values()) / len(finger_lengths)
                features['finger_to_palm_ratio'] = avg_finger / features['palm']['length']
        
        # 3. Approximate major lines (based on crease points)
        features['lines'] = self._approximate_major_lines(landmarks)
        
        return features
    
    def _approximate_major_lines(self, landmarks: Dict[str, Dict[str, float]]) -> Dict[str, Any]:
        """
        Approximate the three major palm lines based on landmarks.
        Note: This is a heuristic - actual lines would require crease detection.
        
        Args:
            landmarks: Dictionary of hand landmarks
            
        Returns:
            Dictionary with line approximations
        """
        lines = {}
        
        # Heart line (runs under fingers)
        if all(k in landmarks for k in ['index_mcp', 'pinky_mcp']):
            lines['heart'] = {
                'start': {'x': landmarks['index_mcp']['x'], 'y': landmarks['index_mcp']['y'] - 20},
                'end': {'x': landmarks['pinky_mcp']['x'], 'y': landmarks['pinky_mcp']['y'] - 20},
                'type': 'major'
            }
        
        # Head line (across palm center)
        if all(k in landmarks for k in ['thumb_mcp', 'pinky_mcp']):
            mid_y = (landmarks['thumb_mcp']['y'] + landmarks['pinky_mcp']['y']) // 2
            lines['head'] = {
                'start': {'x': landmarks['thumb_mcp']['x'] + 20, 'y': mid_y},
                'end': {'x': landmarks['pinky_mcp']['x'] - 20, 'y': mid_y},
                'type': 'major'
            }
        
        # Life line (around thumb)
        if all(k in landmarks for k in ['wrist', 'thumb_mcp']):
            lines['life'] = {
                'start': {'x': landmarks['wrist']['x'] - 15, 'y': landmarks['wrist']['y']},
                'end': {'x': landmarks['thumb_mcp']['x'] - 15, 'y': landmarks['thumb_mcp']['y']},
                'type': 'major'
            }
        
        return lines
    
    # Hand connections for drawing (Tasks API doesn't expose HAND_CONNECTIONS)
    HAND_CONNECTIONS = [
        (0,1),(1,2),(2,3),(3,4),
        (5,6),(6,7),(7,8),
        (9,10),(10,11),(11,12),
        (13,14),(14,15),(15,16),
        (17,18),(18,19),(19,20),
        (0,5),(5,9),(9,13),(13,17),(0,17),
    ]

    def _draw_landmarks(self, image: np.ndarray, hand_landmarks) -> np.ndarray:
        """
        Draw landmarks on the image using Tasks API NormalizedLandmark list.
        """
        annotated = image.copy()
        h, w = image.shape[:2]

        pts = [(int(lm.x * w), int(lm.y * h)) for lm in hand_landmarks]

        for start, end in self.HAND_CONNECTIONS:
            cv2.line(annotated, pts[start], pts[end], (0, 255, 0), 2)

        for pt in pts:
            cv2.circle(annotated, pt, 4, (255, 0, 0), -1)

        return annotated
    
    def get_hand_orientation(self, landmarks: Dict[str, Dict[str, float]]) -> str:
        """
        Determine hand orientation (palm up/down, facing camera, etc.)
        
        Args:
            landmarks: Dictionary of hand landmarks
            
        Returns:
            String describing orientation
        """
        if 'wrist' not in landmarks or 'middle_tip' not in landmarks:
            return "unknown"
        
        # Simple heuristic: if fingertips are higher than wrist, palm is facing up
        wrist_y = landmarks['wrist']['y']
        fingertip_y = landmarks['middle_tip']['y']
        
        if fingertip_y < wrist_y:
            return "palm_facing_up"
        else:
            return "palm_facing_down"


# Singleton instance for reuse
_detector_instance: Optional[PalmDetector] = None


def get_detector() -> PalmDetector:
    """Get or create the global detector instance"""
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = PalmDetector()
    return _detector_instance
