#!/usr/bin/env python3
"""
Journal Transcription Pipeline

Transcribes handwritten journal images into markdown notebook entries using Claude's vision API.

Usage:
    python transcribe_journal.py path/to/image.jpg
    python transcribe_journal.py path/to/image.jpg --output-dir ../content/notebook/
    python transcribe_journal.py path/to/image.jpg --slug my-entry-name
"""

import argparse
import base64
import json
import os
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

import anthropic


def encode_image_to_base64(image_path: str) -> str:
    """Read and encode an image file to base64."""
    with open(image_path, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")


def get_image_media_type(image_path: str) -> str:
    """Get the media type based on file extension."""
    ext = Path(image_path).suffix.lower()
    media_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }
    return media_types.get(ext, "image/jpeg")


def transcribe_journal_image(image_path: str, client: anthropic.Anthropic) -> dict:
    """
    Use Claude's vision to transcribe a handwritten journal image.
    
    Returns a dict with:
        - title: suggested title for the entry
        - date: extracted date (YYYY-MM-DD format)
        - location: location if mentioned
        - content: the transcribed text in markdown
        - has_images: whether there are drawings/images to preserve
        - image_descriptions: descriptions of any drawings
    """
    
    image_data = encode_image_to_base64(image_path)
    media_type = get_image_media_type(image_path)
    
    transcription_prompt = """You are transcribing a handwritten journal entry into markdown format.

Please analyze this image and provide a JSON response with the following structure:

{
    "title": "A short, descriptive title for this entry (2-6 words)",
    "date": "YYYY-MM-DD format if a date is visible, otherwise null",
    "location": "Location if mentioned, otherwise null",
    "content": "The full transcribed text in clean markdown format",
    "has_drawings": true/false,
    "drawings": [
        {
            "description": "Description of the drawing",
            "caption": "Any caption or label near the drawing"
        }
    ],
    "signature": "Author signature if present, otherwise null"
}

Guidelines for transcription:
1. Preserve paragraph breaks and natural flow
2. Use markdown formatting where appropriate (emphasis, lists, etc.)
3. If words are unclear, make your best guess with [?] after uncertain words
4. Preserve the emotional tone and personal voice
5. Don't add content - only transcribe what's written
6. For drawings, describe them but don't try to recreate them in text

Return ONLY valid JSON, no other text."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": transcription_prompt,
                    },
                ],
            }
        ],
    )
    
    response_text = message.content[0].text
    
    # Try to extract JSON from the response
    try:
        # Handle case where response might have markdown code blocks
        if "```json" in response_text:
            json_match = re.search(r"```json\s*(.*?)\s*```", response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
        elif "```" in response_text:
            json_match = re.search(r"```\s*(.*?)\s*```", response_text, re.DOTALL)
            if json_match:
                response_text = json_match.group(1)
        
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        print(f"Warning: Could not parse JSON response: {e}")
        print(f"Raw response:\n{response_text}")
        # Return a basic structure with the raw content
        return {
            "title": "Untitled Journal Entry",
            "date": None,
            "location": None,
            "content": response_text,
            "has_drawings": False,
            "drawings": [],
            "signature": None,
        }


def generate_slug(title: str, date: str | None) -> str:
    """Generate a URL-friendly slug from title."""
    # Remove special characters, convert to lowercase
    slug = re.sub(r"[^\w\s-]", "", title.lower())
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = slug.strip("-")
    
    # Add date prefix if available
    if date:
        date_prefix = date.replace("-", "")[:8]  # YYYYMMDD
        return f"{date_prefix}-{slug}"
    
    return slug


def format_as_notebook_entry(transcription: dict, original_image: str | None = None) -> str:
    """
    Format the transcription as a Zola notebook entry.
    """
    
    # Build frontmatter
    title = transcription.get("title", "Untitled Entry")
    date = transcription.get("date")
    location = transcription.get("location")
    
    if not date:
        date = datetime.now().strftime("%Y-%m-%d")
    
    frontmatter_parts = [
        "+++",
        f'title="{title}"',
        f'date="{date}"',
    ]
    
    # Add description if we have location
    if location:
        frontmatter_parts.append(f'description="Journal entry from {location}"')
    
    frontmatter_parts.append("+++")
    
    frontmatter = "\n".join(frontmatter_parts)
    
    # Build content
    content_parts = []
    
    # Add location header if present
    if location:
        content_parts.append(f"*{location}*\n")
    
    # Main content
    content_parts.append(transcription.get("content", ""))
    
    # Add drawing descriptions if present
    if transcription.get("has_drawings") and transcription.get("drawings"):
        content_parts.append("\n---\n")
        content_parts.append("*Drawings in this entry:*\n")
        for drawing in transcription["drawings"]:
            desc = drawing.get("description", "A drawing")
            caption = drawing.get("caption", "")
            if caption:
                content_parts.append(f"- **{caption}**: {desc}")
            else:
                content_parts.append(f"- {desc}")
    
    # Add signature if present
    if transcription.get("signature"):
        content_parts.append(f"\n\n— {transcription['signature']}")
    
    # Reference to original image
    if original_image:
        content_parts.append(f"\n\n---\n*Original scan: [{Path(original_image).name}]({Path(original_image).name})*")
    
    content = "\n".join(content_parts)
    
    return f"{frontmatter}\n\n{content}\n"


def create_notebook_entry(
    image_path: str,
    output_dir: str | None = None,
    slug: str | None = None,
    keep_original: bool = True,
    dry_run: bool = False,
) -> str:
    """
    Main pipeline: transcribe image and create notebook entry.
    
    Args:
        image_path: Path to the journal image
        output_dir: Directory to create the entry in (default: ../content/notebook/)
        slug: Custom slug for the entry folder name
        keep_original: Whether to copy the original image to the entry folder
        dry_run: If True, only print the output without creating files
        
    Returns:
        Path to the created entry directory
    """
    
    # Verify image exists
    image_path = Path(image_path).resolve()
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    # Initialize Anthropic client
    client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var
    
    print(f"📷 Processing image: {image_path}")
    print("🤖 Transcribing with Claude...")
    
    # Transcribe the image
    transcription = transcribe_journal_image(str(image_path), client)
    
    print(f"✅ Transcription complete!")
    print(f"   Title: {transcription.get('title', 'Untitled')}")
    print(f"   Date: {transcription.get('date', 'Unknown')}")
    print(f"   Location: {transcription.get('location', 'Not specified')}")
    
    # Generate slug if not provided
    if not slug:
        slug = generate_slug(
            transcription.get("title", "journal-entry"),
            transcription.get("date"),
        )
    
    # Determine output directory
    if not output_dir:
        # Default to content/notebook/ relative to this script
        script_dir = Path(__file__).parent
        output_dir = script_dir.parent / "content" / "notebook"
    else:
        output_dir = Path(output_dir)
    
    entry_dir = output_dir / slug
    
    # Format the entry
    original_image_ref = image_path.name if keep_original else None
    markdown_content = format_as_notebook_entry(transcription, original_image_ref)
    
    if dry_run:
        print("\n📝 Generated markdown (dry run):\n")
        print("-" * 60)
        print(markdown_content)
        print("-" * 60)
        print(f"\nWould create: {entry_dir}/index.md")
        if keep_original:
            print(f"Would copy: {image_path} -> {entry_dir}/{image_path.name}")
        return str(entry_dir)
    
    # Create the entry directory
    entry_dir.mkdir(parents=True, exist_ok=True)
    
    # Write the markdown file
    index_path = entry_dir / "index.md"
    index_path.write_text(markdown_content)
    print(f"📄 Created: {index_path}")
    
    # Copy original image if requested
    if keep_original:
        dest_image = entry_dir / image_path.name
        shutil.copy2(image_path, dest_image)
        print(f"🖼️  Copied: {dest_image}")
    
    print(f"\n✨ Entry created at: {entry_dir}")
    
    return str(entry_dir)


def main():
    parser = argparse.ArgumentParser(
        description="Transcribe handwritten journal images into notebook entries",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python transcribe_journal.py ~/Photos/journal_page.jpg
    python transcribe_journal.py image.png --slug my-thoughts
    python transcribe_journal.py image.jpg --dry-run
    python transcribe_journal.py image.jpg --no-keep-original
        """,
    )
    
    parser.add_argument(
        "image",
        help="Path to the journal image to transcribe",
    )
    
    parser.add_argument(
        "--output-dir", "-o",
        help="Output directory for notebook entries (default: ../content/notebook/)",
    )
    
    parser.add_argument(
        "--slug", "-s",
        help="Custom slug for the entry folder name",
    )
    
    parser.add_argument(
        "--no-keep-original",
        action="store_true",
        help="Don't copy the original image to the entry folder",
    )
    
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Print the output without creating files",
    )
    
    args = parser.parse_args()
    
    # Check for API key
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("❌ Error: ANTHROPIC_API_KEY environment variable not set")
        print("   Set it with: export ANTHROPIC_API_KEY='your-api-key'")
        sys.exit(1)
    
    try:
        create_notebook_entry(
            image_path=args.image,
            output_dir=args.output_dir,
            slug=args.slug,
            keep_original=not args.no_keep_original,
            dry_run=args.dry_run,
        )
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    except anthropic.APIError as e:
        print(f"❌ API Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

