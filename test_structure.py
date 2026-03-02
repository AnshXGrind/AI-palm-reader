#!/usr/bin/env python3
"""
Test suite to validate the AI Palm Reader project structure and key components
Run this to verify everything is properly set up
"""

import subprocess
import sys
from pathlib import Path

def test_backend_structure():
    """Verify backend has all required files"""
    print("\n🔧 Testing Backend Structure...")
    backend_path = Path("backend")
    
    required_files = [
        "app/__init__.py",
        "app/main.py",
        "app/config.py",
        "app/core/__init__.py",
        "app/core/detector.py",
        "app/core/interpreter.py",
        "app/api/__init__.py",
        "app/utils/__init__.py",
        "tests/__init__.py",
        "tests/test_interpreter.py",
        "requirements/base.txt",
        "requirements/dev.txt",
        "requirements/prod.txt",
        ".env",
        ".env.example",
    ]
    
    all_exist = True
    for file in required_files:
        file_path = backend_path / file
        exists = "✅" if file_path.exists() else "❌"
        print(f"  {exists} {file}")
        if not file_path.exists():
            all_exist = False
    
    return all_exist

def test_frontend_structure():
    """Verify frontend has all required files"""
    print("\n🎨 Testing Frontend Structure...")
    frontend_path = Path("frontend")
    
    required_files = [
        "src/types/palm.ts",
        "src/hooks/usePalmAnalysis.ts",
        "src/components/PalmResults.tsx",
        "src/pages/index.tsx",
        "src/styles/globals.css",
        "tailwind.config.js",
        "postcss.config.js",
        "package.json",
        ".env.local",
    ]
    
    all_exist = True
    for file in required_files:
        file_path = frontend_path / file
        exists = "✅" if file_path.exists() else "❌"
        print(f"  {exists} {file}")
        if not file_path.exists():
            all_exist = False
    
    return all_exist

def test_python_syntax():
    """Check Python files for syntax errors"""
    print("\n🐍 Testing Python Syntax...")
    python_files = [
        "backend/app/main.py",
        "backend/app/config.py",
        "backend/app/core/detector.py",
        "backend/app/core/interpreter.py",
        "backend/tests/test_interpreter.py",
    ]
    
    all_valid = True
    for file in python_files:
        try:
            result = subprocess.run(
                [sys.executable, "-m", "py_compile", file],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print(f"  ✅ {file}")
            else:
                print(f"  ❌ {file}")
                print(f"     Error: {result.stderr}")
                all_valid = False
        except Exception as e:
            print(f"  ❌ {file}")
            print(f"     Error: {e}")
            all_valid = False
    
    return all_valid

def test_imports():
    """Test critical imports"""
    print("\n📦 Testing Python Imports...")
    
    imports_to_test = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "LOGGING_CONFIG"),
        ("pydantic", "BaseSettings"),
        ("cv2", "cvtColor"),
        ("numpy", "array"),
    ]
    
    all_imports_ok = True
    for module, symbol in imports_to_test:
        try:
            mod = __import__(module)
            if hasattr(mod, symbol) or symbol in dir(mod):
                print(f"  ✅ {module}.{symbol}")
            else:
                print(f"  ⚠️  {module} (symbol {symbol} not found, but module exists)")
        except ImportError:
            print(f"  ❌ {module} - NOT INSTALLED")
            print(f"     Install with: pip install {module}")
            all_imports_ok = False
    
    return all_imports_ok

def test_types():
    """Verify TypeScript types are valid"""
    print("\n📘 Testing TypeScript Definitions...")
    ts_file = Path("frontend/src/types/palm.ts")
    
    if ts_file.exists():
        with open(ts_file, 'r') as f:
            content = f.read()
            required_types = [
                "PalmAnalysisResult",
                "PersonalityProfile", 
                "PalmFeatures",
                "Readings"
            ]
            
            all_types_exist = True
            for type_name in required_types:
                if f"export interface {type_name}" in content:
                    print(f"  ✅ {type_name}")
                else:
                    print(f"  ❌ {type_name} - NOT FOUND")
                    all_types_exist = False
            
            return all_types_exist
    else:
        print(f"  ❌ {ts_file} - FILE NOT FOUND")
        return False

def main():
    print("\n" + "="*60)
    print("🔮 AI PALM READER - PROJECT VALIDATION")
    print("="*60)
    
    results = {
        "Backend Structure": test_backend_structure(),
        "Frontend Structure": test_frontend_structure(),
        "Python Syntax": test_python_syntax(),
        "Python Imports": test_imports(),
        "TypeScript Types": test_types(),
    }
    
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name:.<40} {status}")
    
    print("\n" + "="*60)
    if all(results.values()):
        print("✨ ALL TESTS PASSED! Ready to develop.")
        print("\nNext steps:")
        print("1. cd backend && pip install -r requirements/dev.txt")
        print("2. uvicorn app.main:app --reload --port 8000")
        print("3. cd frontend && npm install && npm run dev")
        print("4. Open http://localhost:3000")
        return 0
    else:
        print("⚠️  Some tests failed. Fix the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
