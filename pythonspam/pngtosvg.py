import os
from PIL import Image
import base64


def png_to_svg(png_path, svg_path):
    # Open the PNG image to get its dimensions
    image = Image.open(png_path)
    width, height = image.size

    # Read the PNG file data and encode it in base64
    with open(png_path, "rb") as img_file:
        png_data = img_file.read()
    b64_data = base64.b64encode(png_data).decode("utf-8")

    # Create an SVG that embeds the PNG as a raster image
    svg_content = (
        f'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">\n'
        f'  <image width="{width}" height="{height}" href="data:image/png;base64,{b64_data}" />\n'
        f"</svg>"
    )

    # Save the SVG file
    with open(svg_path, "w") as f:
        f.write(svg_content)


def convert_sprites_directory():
    # Get current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sprites_dir = os.path.join(current_dir, "sprites")

    # Create output directory if it doesn't exist
    output_dir = os.path.join(current_dir, "..", "sprites_svg")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Convert each PNG file
    for filename in os.listdir(sprites_dir):
        if filename.lower().endswith(".png"):
            png_path = os.path.join(sprites_dir, filename)
            svg_path = os.path.join(output_dir, filename[:-4] + ".svg")
            try:
                png_to_svg(png_path, svg_path)
                print(f"Converted {filename} to SVG")
            except Exception as e:
                print(f"Error converting {filename}: {str(e)}")


if __name__ == "__main__":
    convert_sprites_directory()
