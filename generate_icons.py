from PIL import Image, ImageDraw

def create_icon(size):
    # Create a new image with a white background
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions
    padding = size // 10
    circle_bbox = [padding, padding, size - padding, size - padding]
    
    # Draw a green circle
    draw.ellipse(circle_bbox, fill='#4CAF50')
    
    # Save the image
    img.save(f'icons/icon-{size}.png')

# Create directory for icons
import os
if not os.path.exists('icons'):
    os.makedirs('icons')

# Generate icons
create_icon(192)
create_icon(512)