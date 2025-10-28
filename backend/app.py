from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import palm_detector
import line_interpreter

app = FastAPI(title="AI Palm Reader - Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    """Receive an uploaded image, run advanced palm analysis with deep learning techniques,
    return comprehensive palm reading with classified lines, features, and detailed interpretation.
    """
    try:
        contents = await file.read()
        import numpy as np
        import cv2

        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return {"error": "Could not decode image. Please ensure you're uploading a valid image file (JPG, PNG, etc.)"}

        # Advanced palm analysis
        classified_lines, features, overlay_b64 = palm_detector.process_image(img)
        
        # Comprehensive interpretation
        interpretation = line_interpreter.interpret_lines(classified_lines, features)
        
        # Enhanced response with detailed analysis
        return {
            "success": True,
            "classified_lines": classified_lines,
            "palm_features": features,
            "interpretation": interpretation,
            "overlay": overlay_b64,
            "analysis_summary": {
                "total_major_lines": sum(len(lines) for line_type, lines in classified_lines.items() if line_type != 'minor_lines'),
                "minor_lines_count": len(classified_lines.get('minor_lines', [])),
                "palm_shape": features.get('palm_shape', 'unknown'),
                "analysis_confidence": "high" if sum(len(lines) for lines in classified_lines.values()) > 5 else "moderate"
            }
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Analysis error: {error_details}")
        
        return {
            "error": f"Analysis failed: {str(e)}. Please try with a clearer image with good lighting.",
            "success": False
        }
