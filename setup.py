#!/usr/bin/env python3
"""
Quick start script for AI Palm Reader development
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(cmd, cwd=None, description=""):
    """Run a shell command and return success status"""
    if description:
        print(f"\n{'='*60}")
        print(f"▶ {description}")
        print('='*60)
    
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {description}")
        print(f"   Command: {cmd}")
        return False

def main():
    project_root = Path(__file__).parent
    backend_path = project_root / "backend"
    frontend_path = project_root / "frontend"
    
    print("\n🔮 AI PALM READER - Development Setup 🔮\n")
    print(f"Project root: {project_root}")
    
    # Check Python
    print("\n📋 Checking requirements...")
    try:
        import mediapipe
        print("✅ Mediapipe installed")
    except ImportError:
        print("⚠️  Mediapipe not found, will install from requirements")
    
    # Set up backend
    print("\n" + "="*60)
    print("BACKEND SETUP")
    print("="*60)
    
    # Create virtual environment if needed
    venv_path = backend_path / ".venv"
    if not venv_path.exists():
        if not run_command(f"python -m venv .venv", cwd=backend_path, 
                          description="Creating Python virtual environment"):
            print("❌ Failed to create virtual environment")
            return False
    
    # Activate venv and install requirements
    if sys.platform == "win32":
        activate_cmd = ".venv\\Scripts\\activate"
        pip_cmd = ".venv\\Scripts\\pip install -r requirements\\dev.txt"
    else:
        activate_cmd = "source .venv/bin/activate"
        pip_cmd = ".venv/bin/pip install -r requirements/dev.txt"
    
    if not run_command(pip_cmd, cwd=backend_path,
                      description="Installing Python dependencies"):
        print("❌ Failed to install dependencies")
        return False
    
    print("✅ Backend dependencies installed")
    
    # Set up frontend
    print("\n" + "="*60)
    print("FRONTEND SETUP")
    print("="*60)
    
    if not run_command("npm install", cwd=frontend_path,
                      description="Installing Node dependencies"):
        print("⚠️  npm install had issues, but continuing...")
    
    print("✅ Frontend setup complete")
    
    # Summary
    print("\n" + "="*60)
    print("✨ SETUP COMPLETE!")
    print("="*60)
    print("""
To start development:

1. Terminal 1 - Backend:
   cd backend
   python -m venv .venv
   .venv\\Scripts\\activate  (Windows) or source .venv/bin/activate (Unix)
   pip install -r requirements/dev.txt
   uvicorn app.main:app --reload --port 8000

2. Terminal 2 - Frontend:
   cd frontend
   npm install
   npm run dev

3. Open browser:
   http://localhost:3000

🔮 Your AI Palm Reader is ready!
    """)

if __name__ == "__main__":
    main()
