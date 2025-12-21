#!/usr/bin/env python3
"""
Video Generation Script using Google Gemini API (Veo 3.1)

Generates videos from first and last frame images using the Gemini API's
frames-to-video feature powered by Veo 3.1.

Usage:
    python generate_video.py --first <first_frame> --last <last_frame> --output <output.mp4>
    python generate_video.py --preset product  # Use preset for AI Community product video
    python generate_video.py --preset portrait  # Use preset for personal portrait video
"""

import argparse
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

# Load environment variables from project root
load_dotenv(Path(__file__).parent.parent / ".env")

# === PROMPTS FROM requirements.md ===

PRODUCT_PROMPT = """Create a dynamic transition from the base product frame to the
final element-burst frame.

Begin with the product tilted slightly, on a pure black background.

As motion progresses, introduce AI elements (neural nodes, connection lines,
chat bubbles, glowing particles) gradually entering from behind and around
the product.

Increase floating elements as motion builds toward full burst. Add
high-energy glow effects emerging from behind product and wrapping
partially around it.

All elements should look sharp and suspended in high-speed motion.

Product stays well-lit, centered, and unobstructed.

Background remains pure solid black (#000000).

End in fully exploded element-burst composition.

MOTION STYLE:
- Smooth pacing
- Subtle, refined transitions
- Modern premium feel
- No jarring movements"""

PORTRAIT_PROMPT = """A smooth cinematic 3D transition

The subject smoothly transitions from looking upward with an inspiring,
heroic pose to looking directly toward the screen.

Maintain the dramatic dual-tone lighting throughout--deep blues on one side,
warm oranges on the other. The transition should feel premium and intentional,
like a high-end brand reveal.

MOTION STYLE:
- Smooth pacing
- Subtle, refined transitions
- Modern premium feel
- No jarring movements"""

# === PRESETS ===

PRESETS = {
    "product": {
        "first_frame": "docs/media-assets/Product Image 01 - AI Community - Start.png",
        "last_frame": "docs/media-assets/Product Image 02 - AI Community - Finish.png",
        "output": "docs/media-assets/Product Video - AI Community - Generated.mp4",
        "prompt": PRODUCT_PROMPT,
    },
    "portrait": {
        "first_frame": "docs/media-assets/Self Image 01 - Facing Up.png",
        "last_frame": "docs/media-assets/Self Image 02 - Facing Forward Reduced.png",
        "output": "docs/media-assets/Portrait Video - Generated.mp4",
        "prompt": PORTRAIT_PROMPT,
    },
}


def get_project_root() -> Path:
    """Get the project root directory."""
    return Path(__file__).parent.parent


def load_image(image_path: str | Path) -> Image.Image:
    """Load an image from the given path."""
    path = Path(image_path)
    if not path.is_absolute():
        path = get_project_root() / path

    if not path.exists():
        raise FileNotFoundError(f"Image not found: {path}")

    return Image.open(path)


def generate_video(
    first_frame_path: str | Path,
    last_frame_path: str | Path,
    output_path: str | Path,
    prompt: str,
    model: str = "veo-3.1-generate-preview",
    aspect_ratio: str = "16:9",
    duration_seconds: int = 8,
    poll_interval: int = 10,
) -> Path:
    """
    Generate a video from first and last frame images using Gemini API.

    Args:
        first_frame_path: Path to the first frame image
        last_frame_path: Path to the last frame image
        output_path: Path where the output video will be saved
        prompt: Motion/transition prompt describing the video
        model: Veo model to use (default: veo-3.1-generate-preview)
        aspect_ratio: Video aspect ratio (default: 16:9)
        duration_seconds: Video duration in seconds (default: 8)
        poll_interval: Seconds between status checks (default: 10)

    Returns:
        Path to the generated video file
    """
    # Get API key
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "No API key found. Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable."
        )

    # Initialize client
    client = genai.Client(api_key=api_key)

    # Load images
    print(f"Loading first frame: {first_frame_path}")
    first_image = load_image(first_frame_path)

    print(f"Loading last frame: {last_frame_path}")
    last_image = load_image(last_frame_path)

    # Prepare output path
    output = Path(output_path)
    if not output.is_absolute():
        output = get_project_root() / output
    output.parent.mkdir(parents=True, exist_ok=True)

    print(f"\nGenerating video with {model}...")
    print(f"  Aspect ratio: {aspect_ratio}")
    print(f"  Duration: {duration_seconds}s")
    print(f"  Output: {output}")
    print(f"\nPrompt:\n{prompt[:200]}...")

    # Start video generation
    operation = client.models.generate_videos(
        model=model,
        prompt=prompt,
        image=first_image,
        config=types.GenerateVideosConfig(
            last_frame=last_image,
            aspect_ratio=aspect_ratio,
            number_of_videos=1,
        ),
    )

    # Poll for completion
    print("\nWaiting for video generation...")
    start_time = time.time()

    while not operation.done:
        elapsed = int(time.time() - start_time)
        print(f"  Still generating... ({elapsed}s elapsed)")
        time.sleep(poll_interval)
        operation = client.operations.get(operation)

    elapsed = int(time.time() - start_time)
    print(f"\nGeneration complete! ({elapsed}s total)")

    # Check for errors
    if operation.error:
        raise RuntimeError(f"Video generation failed: {operation.error}")

    # Download the video
    if not operation.response or not operation.response.generated_videos:
        raise RuntimeError("No video was generated")

    video = operation.response.generated_videos[0]

    print(f"Downloading video to {output}...")
    client.files.download(file=video.video)
    video.video.save(str(output))

    print(f"\nVideo saved successfully: {output}")
    return output


def main():
    parser = argparse.ArgumentParser(
        description="Generate videos from first/last frame images using Gemini API (Veo 3.1)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Use a preset
  python generate_video.py --preset product
  python generate_video.py --preset portrait

  # Custom images with default product prompt
  python generate_video.py --first start.png --last end.png --output video.mp4

  # Custom images with custom prompt
  python generate_video.py --first start.png --last end.png --output video.mp4 --prompt "A smooth transition..."
        """,
    )

    parser.add_argument(
        "--preset",
        choices=["product", "portrait"],
        help="Use a preset configuration (product or portrait)",
    )
    parser.add_argument(
        "--first",
        type=str,
        help="Path to the first frame image",
    )
    parser.add_argument(
        "--last",
        type=str,
        help="Path to the last frame image",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=str,
        help="Output video path (default: output.mp4)",
        default="output.mp4",
    )
    parser.add_argument(
        "--prompt",
        "-p",
        type=str,
        help="Motion/transition prompt (default: product prompt from requirements.md)",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="veo-3.1-generate-preview",
        help="Veo model to use (default: veo-3.1-generate-preview)",
    )
    parser.add_argument(
        "--aspect-ratio",
        type=str,
        default="16:9",
        choices=["16:9", "9:16"],
        help="Video aspect ratio (default: 16:9)",
    )
    parser.add_argument(
        "--duration",
        type=int,
        default=8,
        choices=[4, 6, 8],
        help="Video duration in seconds (default: 8)",
    )
    parser.add_argument(
        "--list-presets",
        action="store_true",
        help="List available presets and exit",
    )

    args = parser.parse_args()

    # List presets
    if args.list_presets:
        print("Available presets:\n")
        for name, config in PRESETS.items():
            print(f"  {name}:")
            print(f"    First frame: {config['first_frame']}")
            print(f"    Last frame:  {config['last_frame']}")
            print(f"    Output:      {config['output']}")
            print()
        return

    # Determine configuration
    if args.preset:
        preset = PRESETS[args.preset]
        first_frame = preset["first_frame"]
        last_frame = preset["last_frame"]
        output = preset["output"]
        prompt = preset["prompt"]
        print(f"Using preset: {args.preset}")
    elif args.first and args.last:
        first_frame = args.first
        last_frame = args.last
        output = args.output
        prompt = args.prompt or PRODUCT_PROMPT
    else:
        parser.error("Either --preset or both --first and --last are required")
        return

    # Override with command line args if provided
    if args.output != "output.mp4":
        output = args.output
    if args.prompt:
        prompt = args.prompt

    try:
        generate_video(
            first_frame_path=first_frame,
            last_frame_path=last_frame,
            output_path=output,
            prompt=prompt,
            model=args.model,
            aspect_ratio=args.aspect_ratio,
            duration_seconds=args.duration,
        )
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"Configuration error: {e}", file=sys.stderr)
        sys.exit(1)
    except RuntimeError as e:
        print(f"Generation error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
