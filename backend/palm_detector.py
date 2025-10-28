import cv2
import numpy as np
import base64

# Try to import advanced libraries, fallback to basic implementation if not available
try:
    from scipy import ndimage
    SCIPY_AVAILABLE = True
except ImportError:
    SCIPY_AVAILABLE = False

try:
    from skimage import morphology, segmentation
    SKIMAGE_AVAILABLE = True
except ImportError:
    SKIMAGE_AVAILABLE = False

try:
    from sklearn.cluster import KMeans
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


def enhance_image_quality(img):
    """Apply advanced image enhancement techniques"""
    # Convert to LAB color space for better luminance processing
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to L channel
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    
    # Merge back and convert to BGR
    lab = cv2.merge([l, a, b])
    enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    
    return enhanced


def detect_palm_region(img):
    """Detect and extract the palm region using advanced segmentation"""
    # Convert to HSV for better skin detection
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Define multiple skin color ranges to handle different lighting conditions
    skin_ranges = [
        # Light skin
        (np.array([0, 20, 70]), np.array([20, 255, 255])),
        # Medium skin  
        (np.array([0, 30, 60]), np.array([25, 255, 255])),
        # Dark skin
        (np.array([0, 40, 50]), np.array([30, 255, 255]))
    ]
    
    skin_mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
    
    for lower, upper in skin_ranges:
        mask = cv2.inRange(hsv, lower, upper)
        skin_mask = cv2.bitwise_or(skin_mask, mask)
    
    # Morphological operations to clean up the mask
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel)
    skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel)
    
    # Find the largest contour (assumed to be the palm)
    contours, _ = cv2.findContours(skin_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Create a mask for the palm region
        palm_mask = np.zeros(skin_mask.shape, dtype=np.uint8)
        cv2.fillPoly(palm_mask, [largest_contour], 255)
        
        return palm_mask, largest_contour
    
    return skin_mask, None


def advanced_line_detection(img, palm_mask):
    """Apply multiple advanced line detection techniques"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply the palm mask
    gray_masked = cv2.bitwise_and(gray, gray, mask=palm_mask)
    
    # Multiple preprocessing approaches for better line detection
    
    # 1. Ridge enhancement using Frangi filter simulation
    def frangi_like_filter(image, sigma_range=(1, 8)):
        """Simplified ridge enhancement filter"""
        responses = []
        for sigma in np.linspace(sigma_range[0], sigma_range[1], 4):
            # Gaussian derivatives
            gaussian = cv2.GaussianBlur(image, (0, 0), sigma)
            grad_x = cv2.Sobel(gaussian, cv2.CV_64F, 1, 0, ksize=3)
            grad_y = cv2.Sobel(gaussian, cv2.CV_64F, 0, 1, ksize=3)
            
            # Hessian matrix components
            grad_xx = cv2.Sobel(grad_x, cv2.CV_64F, 1, 0, ksize=3)
            grad_yy = cv2.Sobel(grad_y, cv2.CV_64F, 0, 1, ksize=3)
            grad_xy = cv2.Sobel(grad_x, cv2.CV_64F, 0, 1, ksize=3)
            
            # Eigenvalue-based ridge detection
            trace = grad_xx + grad_yy
            det = grad_xx * grad_yy - grad_xy * grad_xy
            
            # Ridge strength
            ridge_strength = np.abs(det) / (np.abs(trace) + 1e-10)
            responses.append(ridge_strength)
        
        # Take maximum response across scales
        return np.maximum.reduce(responses)
    
    # Apply ridge enhancement
    ridge_enhanced = frangi_like_filter(gray_masked)
    ridge_enhanced = np.uint8(255 * ridge_enhanced / ridge_enhanced.max())
    
    # 2. Advanced edge detection with multiple methods
    
    # Canny with automatic thresholds
    blur = cv2.GaussianBlur(gray_masked, (3, 3), 0)
    v = np.median(blur[blur > 0])
    sigma = 0.33
    lower = int(max(0, (1.0 - sigma) * v))
    upper = int(min(255, (1.0 + sigma) * v))
    edges_auto = cv2.Canny(blur, lower, upper)
    
    # Sobel edge detection
    grad_x = cv2.Sobel(blur, cv2.CV_64F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(blur, cv2.CV_64F, 0, 1, ksize=3)
    edges_sobel = np.sqrt(grad_x**2 + grad_y**2)
    edges_sobel = np.uint8(255 * edges_sobel / edges_sobel.max())
    
    # Combine edge detection results
    combined_edges = cv2.bitwise_or(edges_auto, cv2.threshold(edges_sobel, 50, 255, cv2.THRESH_BINARY)[1])
    combined_edges = cv2.bitwise_or(combined_edges, cv2.threshold(ridge_enhanced, 30, 255, cv2.THRESH_BINARY)[1])
    
    # 3. Multiple Hough Line detection with different parameters
    lines_all = []
    
    # Standard Hough Lines with multiple parameter sets
    hough_params = [
        {'rho': 1, 'theta': np.pi/180, 'threshold': 30, 'min_line_length': 30, 'max_line_gap': 10},
        {'rho': 1, 'theta': np.pi/180, 'threshold': 20, 'min_line_length': 25, 'max_line_gap': 15},
        {'rho': 2, 'theta': np.pi/90, 'threshold': 25, 'min_line_length': 35, 'max_line_gap': 8},
    ]
    
    for params in hough_params:
        lines = cv2.HoughLinesP(combined_edges, **params)
        if lines is not None:
            lines_all.extend(lines)
    
    # 4. Contour-based line detection for curved lines
    contours, _ = cv2.findContours(combined_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    contour_lines = []
    for contour in contours:
        if cv2.contourArea(contour) > 100:  # Filter small contours
            # Fit line to contour
            if len(contour) >= 5:
                [vx, vy, x, y] = cv2.fitLine(contour, cv2.DIST_L2, 0, 0.01, 0.01)
                
                # Calculate line endpoints
                lefty = int((-x * vy / vx) + y)
                righty = int(((gray_masked.shape[1] - x) * vy / vx) + y)
                
                if 0 <= lefty < gray_masked.shape[0] and 0 <= righty < gray_masked.shape[0]:
                    contour_lines.append([[0, lefty, gray_masked.shape[1] - 1, righty]])
    
    # Combine all detected lines
    if contour_lines:
        lines_all.extend(contour_lines)
    
    return lines_all, combined_edges, ridge_enhanced


def classify_palm_lines(lines, img_shape):
    """Classify detected lines into major palm lines with advanced analysis"""
    if not lines:
        return {
            'heart_line': [],
            'head_line': [],
            'life_line': [],
            'fate_line': [],
            'minor_lines': []
        }
    
    h, w = img_shape[:2]
    classified_lines = {
        'heart_line': [],
        'head_line': [],
        'life_line': [],
        'fate_line': [],
        'minor_lines': []
    }
    
    # Analyze each line
    for line_group in lines:
        for line in line_group:
            x1, y1, x2, y2 = line
            
            # Calculate line properties
            length = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
            angle = np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi
            
            # Normalize angle to 0-180
            angle = abs(angle) if abs(angle) <= 90 else 180 - abs(angle)
            
            # Calculate line position (relative to image)
            center_y = (y1 + y2) / 2 / h
            center_x = (x1 + x2) / 2 / w
            
            line_data = {
                'coords': [int(x1), int(y1), int(x2), int(y2)],
                'length': int(length),
                'angle': angle,
                'center_x': center_x,
                'center_y': center_y,
                'is_horizontal': angle < 30 or angle > 150,
                'is_vertical': 60 <= angle <= 120,
                'is_curved': False  # This would need more sophisticated curve detection
            }
            
            # Classify based on position and orientation
            if length > 50:  # Only consider significant lines
                if center_y < 0.4 and line_data['is_horizontal']:
                    # Heart line - upper horizontal
                    classified_lines['heart_line'].append(line_data)
                elif 0.3 < center_y < 0.7 and line_data['is_horizontal']:
                    # Head line - middle horizontal
                    classified_lines['head_line'].append(line_data)
                elif center_x < 0.6 and (line_data['is_vertical'] or 30 <= angle <= 60):
                    # Life line - left side, vertical to diagonal
                    classified_lines['life_line'].append(line_data)
                elif 0.4 < center_x < 0.8 and line_data['is_vertical']:
                    # Fate line - center vertical
                    classified_lines['fate_line'].append(line_data)
                else:
                    classified_lines['minor_lines'].append(line_data)
            elif length > 20:  # Smaller significant lines
                classified_lines['minor_lines'].append(line_data)
    
    return classified_lines


def analyze_palm_features(classified_lines, palm_contour, img_shape):
    """Extract advanced palm features for detailed analysis"""
    features = {
        'palm_size': 0,
        'palm_width_ratio': 0,
        'palm_length_ratio': 0,
        'line_density': 0,
        'dominant_line_direction': 'mixed',
        'heart_line_strength': 0,
        'head_line_strength': 0,
        'life_line_strength': 0,
        'fate_line_strength': 0,
        'minor_lines_count': 0,
        'palm_shape': 'oval'
    }
    
    h, w = img_shape[:2]
    
    # Palm size and shape analysis
    if palm_contour is not None:
        palm_area = cv2.contourArea(palm_contour)
        features['palm_size'] = palm_area / (w * h)
        
        # Bounding rectangle for palm shape analysis
        x, y, rect_w, rect_h = cv2.boundingRect(palm_contour)
        features['palm_width_ratio'] = rect_w / w
        features['palm_length_ratio'] = rect_h / h
        
        # Determine palm shape
        aspect_ratio = rect_w / rect_h
        if aspect_ratio > 1.2:
            features['palm_shape'] = 'wide'
        elif aspect_ratio < 0.8:
            features['palm_shape'] = 'long'
        else:
            features['palm_shape'] = 'balanced'
    
    # Line analysis
    all_lines = []
    for line_type, lines in classified_lines.items():
        all_lines.extend(lines)
    
    if all_lines:
        total_length = sum(line['length'] for line in all_lines)
        features['line_density'] = total_length / (w * h) * 1000
        
        # Analyze line strengths
        features['heart_line_strength'] = sum(line['length'] for line in classified_lines['heart_line'])
        features['head_line_strength'] = sum(line['length'] for line in classified_lines['head_line'])
        features['life_line_strength'] = sum(line['length'] for line in classified_lines['life_line'])
        features['fate_line_strength'] = sum(line['length'] for line in classified_lines['fate_line'])
        features['minor_lines_count'] = len(classified_lines['minor_lines'])
        
        # Dominant direction analysis
        horizontal_count = sum(1 for line in all_lines if line['is_horizontal'])
        vertical_count = sum(1 for line in all_lines if line['is_vertical'])
        
        if horizontal_count > vertical_count * 1.5:
            features['dominant_line_direction'] = 'horizontal'
        elif vertical_count > horizontal_count * 1.5:
            features['dominant_line_direction'] = 'vertical'
        else:
            features['dominant_line_direction'] = 'mixed'
    
    return features


def process_image(img: np.ndarray):
    """Advanced palm image processing and analysis with deep line detection.
    
    Returns:
        (classified_lines, features, overlay_b64)
    """
    
    # Step 1: Enhance image quality
    enhanced_img = enhance_image_quality(img)
    
    # Resize for processing (keep aspect ratio)
    h, w = enhanced_img.shape[:2]
    max_dim = 1024
    scale = 1.0
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        enhanced_img = cv2.resize(enhanced_img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    
    # Step 2: Detect palm region
    palm_mask, palm_contour = detect_palm_region(enhanced_img)
    
    # Step 3: Advanced line detection
    lines, edges, ridge_enhanced = advanced_line_detection(enhanced_img, palm_mask)
    
    # Step 4: Classify lines
    classified_lines = classify_palm_lines(lines, enhanced_img.shape)
    
    # Step 5: Extract palm features
    features = analyze_palm_features(classified_lines, palm_contour, enhanced_img.shape)
    
    # Step 6: Create visualization overlay
    overlay = enhanced_img.copy()
    
    # Draw palm boundary
    if palm_contour is not None:
        cv2.drawContours(overlay, [palm_contour], -1, (0, 255, 255), 2)
    
    # Draw classified lines with different colors
    line_colors = {
        'heart_line': (0, 0, 255),    # Red
        'head_line': (0, 255, 0),     # Green  
        'life_line': (255, 0, 0),     # Blue
        'fate_line': (255, 0, 255),   # Magenta
        'minor_lines': (128, 128, 128) # Gray
    }
    
    for line_type, lines in classified_lines.items():
        color = line_colors[line_type]
        for line in lines:
            x1, y1, x2, y2 = line['coords']
            thickness = 3 if line_type != 'minor_lines' else 1
            cv2.line(overlay, (x1, y1), (x2, y2), color, thickness)
            
            # Add line type label
            if line_type != 'minor_lines':
                mid_x, mid_y = (x1 + x2) // 2, (y1 + y2) // 2
                cv2.putText(overlay, line_type.replace('_', ' ').title(), 
                           (mid_x + 5, mid_y), cv2.FONT_HERSHEY_SIMPLEX, 
                           0.5, color, 1)
    
    # Add palm analysis overlay
    cv2.putText(overlay, f"Lines detected: {len(lines)}", 
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.putText(overlay, f"Palm shape: {features['palm_shape']}", 
                (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    # Encode overlay as PNG base64
    success, buffer = cv2.imencode('.png', overlay)
    if not success:
        overlay_b64 = ""
    else:
        overlay_b64 = "data:image/png;base64," + base64.b64encode(buffer).decode('utf-8')
    
    return classified_lines, features, overlay_b64
