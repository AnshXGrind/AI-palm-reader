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
    """Receive an uploaded image, run simple palm processing, return detected lines + interpretation + overlay image (base64).
    This is intentionally small and rule-based to serve as Phase 1 prototype.
    """
    contents = await file.read()
    import numpy as np
    import cv2

    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return {"error": "Could not decode image"}

    line_data, overlay_b64 = palm_detector.process_image(img)
    interpretation = line_interpreter.interpret_lines(line_data)

    return {"lines": line_data, "interpretation": interpretation, "overlay": overlay_b64}
