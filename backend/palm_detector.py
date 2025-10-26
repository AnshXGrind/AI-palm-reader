import cv2
import numpy as np
import base64


def process_image(img: np.ndarray):
    """Simple palm image preprocessing and line detection prototype.
    Steps:
    - Resize to a reasonable max dimension
    - Convert to grayscale, blur, and Canny edges
    - Apply HoughLinesP to extract line segments
    - Draw detected lines on an overlay and return base64 PNG + list of lines with lengths

    Returns:
        (line_list, overlay_b64)
    """

    # Normalize size (keep aspect)
    h, w = img.shape[:2]
    max_dim = 900
    scale = 1.0
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blur, 50, 150)

    # Hough Line Transform (probabilistic) to get line segments
    lines = cv2.HoughLinesP(edges, rho=1, theta=np.pi / 180, threshold=50, minLineLength=40, maxLineGap=15)

    overlay = img.copy()
    line_list = []
    if lines is not None:
        for seg in lines:
            x1, y1, x2, y2 = [int(v) for v in seg[0]]
            length = int(np.hypot(x2 - x1, y2 - y1))
            line_list.append({"coords": [x1, y1, x2, y2], "length": length})
            # draw red line on overlay
            cv2.line(overlay, (x1, y1), (x2, y2), (0, 0, 255), 2)

    # Fallback: if no lines detected, return edges as overlay for visualization
    if not line_list:
        # colorize edges (white on black) into RGB for returning
        edges_rgb = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
        overlay = cv2.addWeighted(img, 0.6, edges_rgb, 0.8, 0)

    # encode overlay as PNG base64 data URL
    success, buffer = cv2.imencode('.png', overlay)
    if not success:
        overlay_b64 = ""
    else:
        overlay_b64 = "data:image/png;base64," + base64.b64encode(buffer).decode('utf-8')

    return line_list, overlay_b64
