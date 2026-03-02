/**
 * Type definitions matching our Python backend
 * This ensures type safety between frontend and backend
 */

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PalmFeatures {
  palm?: {
    length: number;
    width: number;
    ratio: number;
  };
  fingers?: {
    thumb: number;
    index: number;
    middle: number;
    ring: number;
    pinky: number;
  };
  finger_to_palm_ratio?: number;
  lines?: {
    heart?: LineData;
    head?: LineData;
    life?: LineData;
  };
}

export interface LineData {
  start: { x: number; y: number };
  end: { x: number; y: number };
  type: string;
}

export interface LineAnalysis {
  length: string;
  curve: string;
  interpretation: string;
  strength: string;
}

export interface FingerAnalysis {
  length: string;
  relative_size: number;
  interpretation: string;
}

export interface PersonalityProfile {
  hand_type: string;
  element: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  career: string[];
  relationships: string;
  summary: string;
  detailed: string;
}

export interface Readings {
  personality: string;
  career: string;
  relationships: string;
  love?: string;
  mind?: string;
  life_path?: string;
}

export interface PalmAnalysisResult {
  success: boolean;
  handedness: string;
  confidence: number;
  features: PalmFeatures;
  interpretation: {
    hand_type: string;
    element: string;
    hand_name: string;
    profile: PersonalityProfile;
    readings: Readings;
    lines: Record<string, LineAnalysis>;
    fingers: Record<string, FingerAnalysis>;
    summary: string;
  };
  overlay: string; // base64 image
}

export interface ApiError {
  detail: string;
}
