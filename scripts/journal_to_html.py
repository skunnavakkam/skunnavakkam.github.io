"""
Journal to HTML converter

Takes a photo of a journal page and converts it to an HTML file where:
- The original image is displayed as background
- Text is overlaid as invisible but selectable/copyable text
- Preserves the visual appearance while enabling text selection

Usage:
    python journal_to_html.py <input_image> <output_html>
"""

import argparse
import base64
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
import pytesseract


def detect_page_boundary(
    image: np.ndarray, min_area_ratio: float = 0.2
) -> np.ndarray | None:
    """
    Detect the journal page boundary in the image.
    Returns the four corners of the page, or None if not detected.

    Args:
        image: Input BGR image
        min_area_ratio: Minimum ratio of detected area to image area (default 0.2 = 20%)
    """
    img_height, img_width = image.shape[:2]
    img_area = img_height * img_width

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)

    # dilate edges to connect broken lines
    kernel = np.ones((3, 3), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)

    # find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return None

    # find the largest quadrilateral contour (likely the page)
    largest_area = 0
    page_contour = None

    for contour in contours:
        area = cv2.contourArea(contour)

        # skip contours that are too small (less than min_area_ratio of image)
        if area < img_area * min_area_ratio:
            continue

        # approximate the contour to a polygon
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)

        # if it's a quadrilateral and larger than previous
        if len(approx) == 4 and area > largest_area:
            largest_area = area
            page_contour = approx

    # additional check: ensure the detected page covers a reasonable portion
    if page_contour is not None:
        detected_area = cv2.contourArea(page_contour)
        # if it covers more than 95% of image, probably not a real page boundary
        if detected_area > img_area * 0.95:
            return None

    return page_contour


def order_points(pts: np.ndarray) -> np.ndarray:
    """
    Order points in: top-left, top-right, bottom-right, bottom-left order.
    """
    rect = np.zeros((4, 2), dtype=np.float32)

    # sum and diff to find corners
    s = pts.sum(axis=1)
    diff = np.diff(pts, axis=1)

    rect[0] = pts[np.argmin(s)]  # top-left has smallest sum
    rect[2] = pts[np.argmax(s)]  # bottom-right has largest sum
    rect[1] = pts[np.argmin(diff)]  # top-right has smallest diff
    rect[3] = pts[np.argmax(diff)]  # bottom-left has largest diff

    return rect


def correct_perspective(image: np.ndarray, corners: np.ndarray) -> np.ndarray:
    """
    Apply perspective transform to get a top-down view of the page.
    """
    rect = order_points(corners.reshape(4, 2))
    (tl, tr, br, bl) = rect

    # compute width and height of new image
    width_a = np.linalg.norm(br - bl)
    width_b = np.linalg.norm(tr - tl)
    max_width = int(max(width_a, width_b))

    height_a = np.linalg.norm(tr - br)
    height_b = np.linalg.norm(tl - bl)
    max_height = int(max(height_a, height_b))

    # destination points for perspective transform
    dst = np.array(
        [
            [0, 0],
            [max_width - 1, 0],
            [max_width - 1, max_height - 1],
            [0, max_height - 1],
        ],
        dtype=np.float32,
    )

    # compute perspective transform and apply
    matrix = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, matrix, (max_width, max_height))

    return warped


def preprocess_for_ocr(image: np.ndarray) -> np.ndarray:
    """
    Preprocess image to improve OCR accuracy, especially for handwriting.
    Returns the preprocessed image (still in BGR for consistency).
    """
    # convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # apply adaptive thresholding to handle varying lighting
    # this helps with handwritten text on paper
    binary = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 10
    )

    # light denoising while preserving edges
    denoised = cv2.fastNlMeansDenoising(binary, h=10)

    # convert back to BGR for consistency
    return cv2.cvtColor(denoised, cv2.COLOR_GRAY2BGR)


def get_ocr_data(image: np.ndarray, preprocess: bool = False) -> dict:
    """
    Run OCR on the image and return word-level bounding boxes and text.

    Args:
        image: Input BGR image
        preprocess: Whether to apply preprocessing for better handwriting OCR
    """
    if preprocess:
        ocr_image = preprocess_for_ocr(image)
    else:
        ocr_image = image

    # convert to PIL for pytesseract
    pil_image = Image.fromarray(cv2.cvtColor(ocr_image, cv2.COLOR_BGR2RGB))

    # get detailed OCR data with bounding boxes
    # use PSM 6 (assume uniform block of text) which often works better for journal pages
    custom_config = r"--psm 6"
    data = pytesseract.image_to_data(
        pil_image, output_type=pytesseract.Output.DICT, config=custom_config
    )

    return data


def image_to_base64(image: np.ndarray, format: str = "png") -> str:
    """Convert OpenCV image to base64 string."""
    pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    from io import BytesIO

    buffer = BytesIO()
    pil_image.save(buffer, format=format.upper())
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def generate_html(
    image: np.ndarray,
    ocr_data: dict,
    output_path: str,
    embed_image: bool = True,
) -> None:
    """
    Generate HTML with the image as background and invisible selectable text overlay.
    """
    height, width = image.shape[:2]

    # build text overlay elements
    text_elements = []

    n_boxes = len(ocr_data["text"])
    for i in range(n_boxes):
        text = ocr_data["text"][i].strip()
        conf = int(ocr_data["conf"][i])

        # skip empty text or low confidence
        if not text or conf < 30:
            continue

        x = ocr_data["left"][i]
        y = ocr_data["top"][i]
        w = ocr_data["width"][i]
        h = ocr_data["height"][i]

        # calculate position as percentage for responsive layout
        left_pct = (x / width) * 100
        top_pct = (y / height) * 100
        width_pct = (w / width) * 100
        height_pct = (h / height) * 100

        # create span element with absolute positioning
        text_elements.append(
            f"""<span class="ocr-text" style="
                left: {left_pct:.2f}%;
                top: {top_pct:.2f}%;
                width: {width_pct:.2f}%;
                height: {height_pct:.2f}%;
                font-size: {h * 0.8}px;
            ">{text}</span>"""
        )

    # get image as base64 or use file path
    if embed_image:
        img_src = f"data:image/png;base64,{image_to_base64(image)}"
    else:
        img_src = "journal_page.png"
        cv2.imwrite(str(Path(output_path).parent / "journal_page.png"), image)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Journal Page</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
            padding: 20px;
        }}

        .journal-container {{
            position: relative;
            max-width: 100%;
            max-height: 90vh;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }}

        .journal-image {{
            display: block;
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
        }}

        .text-overlay {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }}

        .ocr-text {{
            position: absolute;
            color: transparent;
            pointer-events: auto;
            cursor: text;
            white-space: nowrap;
            overflow: hidden;
            line-height: 1;
            user-select: text;
            /* Uncomment below to debug text positioning */
            /* background: rgba(255, 255, 0, 0.3); */
        }}

        .ocr-text::selection {{
            background: rgba(0, 100, 255, 0.4);
            color: transparent;
        }}

        /* Instructions overlay */
        .instructions {{
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-family: system-ui, sans-serif;
            font-size: 14px;
            opacity: 0.7;
            transition: opacity 0.3s;
        }}

        .instructions:hover {{
            opacity: 0;
        }}
    </style>
</head>
<body>
    <div class="journal-container">
        <img src="{img_src}" alt="Journal page" class="journal-image" id="journal-img">
        <div class="text-overlay" id="text-overlay">
            {"".join(text_elements)}
        </div>
    </div>
    <div class="instructions">
        Click and drag to select text • Ctrl+C to copy
    </div>
    <script>
        // Resize text overlay to match image dimensions
        function resizeOverlay() {{
            const img = document.getElementById('journal-img');
            const overlay = document.getElementById('text-overlay');

            overlay.style.width = img.offsetWidth + 'px';
            overlay.style.height = img.offsetHeight + 'px';

            // Scale font sizes based on actual displayed size
            const scale = img.offsetHeight / {height};
            document.querySelectorAll('.ocr-text').forEach(el => {{
                const baseFontSize = parseFloat(el.style.fontSize);
                el.style.fontSize = (baseFontSize * scale) + 'px';
            }});
        }}

        window.addEventListener('load', resizeOverlay);
        window.addEventListener('resize', resizeOverlay);
    </script>
</body>
</html>"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)


def process_journal_image(
    input_path: str,
    output_path: str,
    auto_crop: bool = True,
    embed_image: bool = True,
    preprocess: bool = False,
) -> None:
    """
    Main processing pipeline for converting journal image to HTML.

    Args:
        input_path: Path to input image
        output_path: Path for output HTML file
        auto_crop: Whether to detect and crop to page boundary
        embed_image: Whether to embed image as base64 or save separately
        preprocess: Whether to apply preprocessing for better handwriting OCR
    """
    # load image
    image = cv2.imread(input_path)
    if image is None:
        raise ValueError(f"Could not load image: {input_path}")

    print(f"Loaded image: {image.shape[1]}x{image.shape[0]}")

    # keep original for display
    display_image = image.copy()

    # optionally detect and crop to page boundary
    if auto_crop:
        corners = detect_page_boundary(image)
        if corners is not None:
            print("Page boundary detected, applying perspective correction...")
            image = correct_perspective(image, corners)
            display_image = image.copy()
        else:
            print("No page boundary detected, using full image...")

    # run OCR
    print("Running OCR..." + (" (with preprocessing)" if preprocess else ""))
    ocr_data = get_ocr_data(image, preprocess=preprocess)

    word_count = sum(1 for t in ocr_data["text"] if t.strip())
    print(f"Detected {word_count} words")

    # generate HTML using the display image (original colors)
    print(f"Generating HTML: {output_path}")
    generate_html(display_image, ocr_data, output_path, embed_image)

    print("Done!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Convert journal page image to HTML with selectable text"
    )
    parser.add_argument("input", help="Input image path")
    parser.add_argument("output", help="Output HTML path")
    parser.add_argument(
        "--no-crop",
        action="store_true",
        help="Skip automatic page detection and cropping",
    )
    parser.add_argument(
        "--no-embed",
        action="store_true",
        help="Don't embed image in HTML (save as separate file)",
    )
    parser.add_argument(
        "--preprocess",
        action="store_true",
        help="Apply preprocessing for better handwriting OCR (binarization, denoising)",
    )

    args = parser.parse_args()

    process_journal_image(
        args.input,
        args.output,
        auto_crop=not args.no_crop,
        embed_image=not args.no_embed,
        preprocess=args.preprocess,
    )
