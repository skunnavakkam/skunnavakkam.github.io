# this file takes in a directory with images in it, labelled in alphabetical
# order to be the pictures. it, within the directory, creates a file that
# is a digital version of the images
#
# the input images are pictures of my journal
# and the output files are password protected versions of the images
# in my journal. the password protection is done through
# encrypting the input file, and then storing a localstore password
# in your browser

import json
import re
import numpy as np
from google import genai
from PIL import Image, ImageDraw
from docuwarp.unwarp import Unwarp
from dotenv import load_dotenv
from typing import List, Tuple, Dict, Any
import os
import sys

_unwarp = None


def _get_unwarp():
    global _unwarp
    if _unwarp is None:
        _unwarp = Unwarp()
    return _unwarp


def _unload_unwarp():
    global _unwarp
    _unwarp = None


def load_images(directory: str) -> List[Image.Image]:
    """Load all images from directory, sorted alphabetically."""
    exts = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif"}
    paths = sorted(
        p for p in os.listdir(directory) if os.path.splitext(p)[1].lower() in exts
    )
    images = []
    for p in paths:
        img = Image.open(os.path.join(directory, p))
        images.append(img)
        print(f"Loaded {p} ({img.size[0]}x{img.size[1]})")
    print(f"Loaded {len(images)} images from {directory}")
    return images


def segment_one_page(image: Image.Image) -> Image.Image:
    """Dewarp a journal page photo using the UVDoc neural network."""
    return _get_unwarp().inference(image)


def segment_journal_pages(images: List[Image.Image]) -> List[Image.Image]:
    # returns list of dewarped page images
    ret = []
    for image in images:
        ret.append(segment_one_page(image))
    return ret


def detect_regions(page: Image.Image, client) -> Dict[str, Any]:
    """
    Step 1: Detect regions (drawings vs text) with bounding boxes only.
    """
    w, h = page.size

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[
            f"""Look at this journal page ({w}x{h} pixels) and identify all distinct regions.

Return JSON:
{{
  "regions": [
    {{"type": "drawing", "bbox": [x1, y1, x2, y2]}},
    {{"type": "text", "bbox": [x1, y1, x2, y2]}}
  ]
}}

Rules:
- bbox coordinates are pixels: x1,y1 = top-left, x2,y2 = bottom-right
- "drawing" = any sketch, diagram, or illustration
- "text" = any handwritten text block (heading or paragraph)
- List regions in reading order (top to bottom)
- Output ONLY valid JSON""",
            page
        ],
    )

    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]

    try:
        data = json.loads(text)
        return {"page_width": w, "page_height": h, "regions": data.get("regions", [])}
    except json.JSONDecodeError:
        return {"page_width": w, "page_height": h, "regions": [], "raw": response.text}


def ocr_region(page: Image.Image, bbox: List[int], client) -> Dict[str, str]:
    """
    Step 2: OCR a single text region.
    """
    x1, y1, x2, y2 = bbox
    cropped = page.crop((x1, y1, x2, y2))

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[
            "OCR this handwritten text exactly as written. Return JSON: {\"text\": \"...\", \"is_heading\": true/false}. "
            "Set is_heading=true only if this is clearly a title or section heading. "
            "Do not add any emphasis or formatting. Transcribe exactly what you see. "
            "Ignore any captions or labels on drawings/images. Output ONLY JSON.",
            cropped
        ],
    )

    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"text": response.text}


def annotate_one_page(page: Image.Image, client) -> Dict[str, Any]:
    """
    Detect regions, then OCR each text region separately.
    """
    # Step 1: detect regions
    data = detect_regions(page, client)

    # Step 2: OCR each text region
    elements = []
    for region in data.get("regions", []):
        bbox = region.get("bbox", [])
        region_type = region.get("type", "unknown")

        if len(bbox) != 4:
            continue

        if region_type == "drawing":
            elements.append({
                "type": "drawing",
                "bbox": bbox,
                "description": region.get("description", "drawing")
            })
        elif region_type == "text":
            ocr_result = ocr_region(page, bbox, client)
            elem_type = "heading" if ocr_result.get("is_heading", False) else "paragraph"
            elements.append({
                "type": elem_type,
                "bbox": bbox,
                "text": ocr_result.get("text", "")
            })

    return {
        "page_width": data["page_width"],
        "page_height": data["page_height"],
        "elements": elements
    }


def annotate_journal_pages(pages: List[Image.Image]) -> List[Dict[str, Any]]:
    """Annotate all pages with bounding boxes for drawings and text."""
    client = _get_gemini_client()
    results = []
    for i, page in enumerate(pages):
        print(f"Annotating page {i + 1}/{len(pages)}...")
        annotations = annotate_one_page(page, client)
        results.append(annotations)
    return results


def draw_annotations(page: Image.Image, annotations: Dict[str, Any]) -> Image.Image:
    """Draw bounding boxes on a page image."""
    img = page.copy()
    draw = ImageDraw.Draw(img)

    colors = {
        "drawing": "red",
        "heading": "green",
        "paragraph": "blue",
    }

    for elem in annotations.get("elements", []):
        bbox = elem.get("bbox", [])
        elem_type = elem.get("type", "unknown")
        color = colors.get(elem_type, "gray")
        if len(bbox) == 4:
            draw.rectangle(bbox, outline=color, width=3)

    return img


_gemini_client = None


def _get_gemini_client():
    global _gemini_client
    if _gemini_client is None:
        load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
        _gemini_client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    return _gemini_client


def render_page_html(page_idx: int, annotations: Dict[str, Any], out_dir: str) -> str:
    """Render a single page as HTML with text wrapping around images."""
    page_w = annotations.get("page_width", 800)
    page_h = annotations.get("page_height", 1000)

    # Scale factor to make it reasonable on screen (target ~800px wide)
    scale = 800 / page_w

    elements = annotations.get("elements", [])
    elements_html = []

    # Sort elements by vertical position (top of bbox)
    sorted_elements = sorted(
        [(i, elem) for i, elem in enumerate(elements) if len(elem.get("bbox", [])) == 4],
        key=lambda x: x[1]["bbox"][1]
    )

    for i, elem in sorted_elements:
        bbox = elem.get("bbox", [])
        x1, y1, x2, y2 = bbox

        # Scale dimensions
        width = int((x2 - x1) * scale)
        height = int((y2 - y1) * scale)

        # Determine if image is on left or right side of page
        center_x = (x1 + x2) / 2
        float_side = "left" if center_x < page_w / 2 else "right"

        elem_type = elem.get("type", "unknown")

        if elem_type == "drawing":
            img_path = f"page_{page_idx:03d}_drawings/drawing_{i:02d}.jpg"
            elements_html.append(f'''
                <div class="drawing" style="float:{float_side}; width:{width}px; height:{height}px; margin: 10px {'10px 10px 10px 0' if float_side == 'left' else '10px 0 10px 10px'};">
                    <img src="{img_path}" alt="{elem.get('description', 'drawing')}"
                         style="width:100%; height:100%; object-fit:contain;">
                </div>''')
        else:
            # Text element - render exactly as transcribed
            text = elem.get("text", "")
            html_text = text.replace('\n', '<br>')

            if elem_type == "heading":
                elements_html.append(f'''
                <h2 class="heading">{html_text}</h2>''')
            else:
                elements_html.append(f'''
                <div class="paragraph">{html_text}</div>''')

    return f'''
        <div class="page">
            {''.join(elements_html)}
            <div style="clear:both;"></div>
        </div>'''


def render_journal_html(annotations_list: List[Dict[str, Any]], out_dir: str) -> str:
    """Render all pages into a single HTML file."""
    pages_html = []
    for i, annot in enumerate(annotations_list):
        pages_html.append(render_page_html(i, annot, out_dir))

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Journal</title>
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {{
            font-family: 'Caveat', cursive;
            font-size: 1.4em;
            line-height: 1.5;
            background: #f5f5dc;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }}
        .page {{
            background: white;
            margin-bottom: 40px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
        }}
        .heading {{
            font-weight: bold;
            font-size: 1.4em;
            margin: 0.8em 0 0.4em 0;
        }}
        .paragraph {{
            color: #333;
            margin: 0.6em 0;
        }}
        .drawing {{
            box-sizing: border-box;
            padding: 5px;
        }}
        .drawing img {{
            border-radius: 4px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }}
        h1, h2 {{
            margin: 0;
            font-family: 'Caveat', cursive;
        }}
    </style>
</head>
<body>
    {''.join(pages_html)}
</body>
</html>'''

    html_path = os.path.join(out_dir, "journal.html")
    with open(html_path, "w") as f:
        f.write(html)

    return html_path


if __name__ == "__main__":
    directory = sys.argv[1]

    print(f"Loading images from {directory}")

    images = load_images(directory)
    pages = segment_journal_pages(images)

    # save segmented pages
    out_dir = os.path.join(directory, "segmented")
    os.makedirs(out_dir, exist_ok=True)
    for i, page in enumerate(pages):
        out_path = os.path.join(out_dir, f"page_{i:03d}.jpg")
        page.save(out_path)
        print(f"Saved {out_path}")

    # free docuwarp before annotation
    _unload_unwarp()

    # Annotate pages (includes OCR with positions)
    annotations = annotate_journal_pages(pages)
    for i, (page, annot) in enumerate(zip(pages, annotations)):
        # Save annotations JSON
        json_path = os.path.join(out_dir, f"page_{i:03d}_annotations.json")
        with open(json_path, "w") as f:
            json.dump(annot, f, indent=2)
        print(f"Saved annotations to {json_path}")

        # Save annotated image with bounding boxes
        annotated_img = draw_annotations(page, annot)
        annotated_path = os.path.join(out_dir, f"page_{i:03d}_annotated.jpg")
        annotated_img.save(annotated_path)
        print(f"Saved annotated image to {annotated_path}")

        # Extract and save individual drawings
        drawings_dir = os.path.join(out_dir, f"page_{i:03d}_drawings")
        os.makedirs(drawings_dir, exist_ok=True)
        for j, elem in enumerate(annot.get("elements", [])):
            if elem.get("type") == "drawing":
                bbox = elem.get("bbox", [])
                if len(bbox) == 4:
                    cropped = page.crop(bbox)
                    crop_path = os.path.join(drawings_dir, f"drawing_{j:02d}.jpg")
                    cropped.save(crop_path)
                    print(f"  Extracted drawing to {crop_path}")

    # Generate HTML
    html_path = render_journal_html(annotations, out_dir)
    print(f"Generated HTML: {html_path}")
