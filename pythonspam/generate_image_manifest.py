import argparse
import json
import os
from typing import List, Dict, Any

try:
    from PIL import Image  # type: ignore

    try:
        # Optional: support HEIF/HEIC if available
        from pillow_heif import register_heif_opener  # type: ignore

        register_heif_opener()
    except Exception:
        pass
except ImportError as e:
    print("Error: Pillow is required. Install with: pip3 install pillow [pillow-heif]")
    raise


IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".bmp",
    ".tiff",
    ".tif",
    ".avif",
    ".heic",
    ".heif",
}


def is_image_file(filename: str) -> bool:
    _, ext = os.path.splitext(filename)
    return ext.lower() in IMAGE_EXTENSIONS


def build_manifest(directory: str) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    for name in sorted(os.listdir(directory)):
        path = os.path.join(directory, name)
        if not os.path.isfile(path):
            continue
        if not is_image_file(name):
            continue
        try:
            with Image.open(path) as im:
                width, height = im.size
        except Exception:
            # Skip files Pillow can't open
            continue

        # Use a path relative to the directory for the frontend
        entries.append(
            {
                "file": name,
                "src": name,
                "width": width,
                "height": height,
            }
        )
    return entries


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate a simple image manifest for a directory"
    )
    parser.add_argument(
        "directory",
        nargs="?",
        default="static/vibes",
        help="Directory to scan (default: static/vibes)",
    )
    parser.add_argument(
        "--output",
        "-o",
        default=None,
        help="Output JSON path (default: <directory>/image_widths_heights.json)",
    )
    args = parser.parse_args()

    directory = os.path.abspath(args.directory)
    if not os.path.isdir(directory):
        raise SystemExit(f"Not a directory: {directory}")

    manifest = build_manifest(directory)
    output_path = args.output or os.path.join(directory, "image_widths_heights.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f)

    print(f"Wrote {len(manifest)} images to {output_path}")


if __name__ == "__main__":
    main()
