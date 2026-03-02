import { useState, useCallback } from 'react';
import { PalmAnalysisResult, ApiError } from '../types/palm';

interface UsePalmAnalysisReturn {
  analyzePalm: (file: File) => Promise<void>;
  result: PalmAnalysisResult | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function usePalmAnalysis(): UsePalmAnalysisReturn {
  const [result, setResult] = useState<PalmAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePalm = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Try connecting to local backend first
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const data: PalmAnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze palm');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    analyzePalm,
    result,
    loading,
    error,
    reset,
  };
}
