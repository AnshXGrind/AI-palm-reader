#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple test script to verify backend functionality
"""
import requests
import json
import os

def test_backend_health():
    """Test if backend is running and responsive"""
    try:
        response = requests.get("http://localhost:8000/docs", timeout=5)
        if response.status_code == 200:
            print("[OK] Backend is running and accessible")
            return True
        else:
            print(f"[ERROR] Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Cannot connect to backend: {e}")
        return False

def test_backend_analyze():
    """Test the analyze endpoint with a mock image"""
    try:
        # Create a small test image (1x1 pixel)
        import io
        from PIL import Image
        import numpy as np
        
        # Create a simple test image
        img_array = np.zeros((100, 100, 3), dtype=np.uint8)
        img_array.fill(128)  # Gray image
        img = Image.fromarray(img_array)
        
        # Convert to bytes
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        # Test the endpoint
        files = {'file': ('test.png', img_bytes, 'image/png')}
        response = requests.post("http://localhost:8000/analyze", files=files, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("[OK] Analyze endpoint is working")
            print(f"   - Detected {len(result.get('lines', []))} lines")
            print(f"   - Has interpretation: {'interpretation' in result}")
            print(f"   - Has overlay: {'overlay' in result}")
            return True
        else:
            print(f"[ERROR] Analyze endpoint returned status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error testing analyze endpoint: {e}")
        return False

if __name__ == "__main__":
    print("Testing AI Palm Reader Backend...")
    print()
    
    # Test 1: Health check
    health_ok = test_backend_health()
    print()
    
    # Test 2: Analyze endpoint (only if health check passes)
    if health_ok:
        analyze_ok = test_backend_analyze()
    else:
        print("Skipping analyze test (backend not accessible)")
        analyze_ok = False
    
    print()
    print("=" * 50)
    if health_ok and analyze_ok:
        print("All tests passed! Backend is working correctly.")
    else:
        print("Some tests failed. Check the output above.")
    print("=" * 50)