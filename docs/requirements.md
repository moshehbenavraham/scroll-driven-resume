# Building a Scroll-Synchronized Frame Animated Parallax Portfolio

## Combining Two Technologies: Frame Animation + Parallax Layering

---

## The Two Technologies You're Combining

This guide merges two distinct motion techniques into one premium experience:

### Technology 1: Scroll-Synchronized Frame Animation

**What it is:** Instead of autoplaying video, scroll position directly controls which frame displays. Scrolling down advances frames forward; scrolling up reverses them. Users "scrub" through a video sequence like a film editor.

**The effect:** Cinematic sequences that feel interactive--visitors control the pace of your visual story.

**How it works:**

- Video converted to individual WebP frames (e.g., 240 frames)
- JavaScript maps scroll position to frame index
- `scrollPercent x totalFrames = currentFrame`
- Frames swap using opacity switching (smoother than src swapping)

### Technology 2: Parallax Layering

**What it is:** Multiple visual layers move at different speeds as the user scrolls, creating an illusion of depth. Background moves slower than foreground; elements float at varying rates.

**The effect:** A sense of dimensional space--the site feels alive, layered, and premium rather than flat.

**How it works:**

- Background layers move at 0.3x-0.5x scroll speed
- Foreground elements move at 1x or faster
- Text overlays, UI elements, and decorative elements each have independent movement rates
- Creates perceived depth without true 3D

### The Combined Approach

Your portfolio uses BOTH:

| Layer | Technology | Behavior |
|-------|------------|----------|
| Background | Scroll-Synchronized Frame Animation | Video frames advance/reverse with scroll |
| Mid-layer | Parallax | Decorative elements float at 0.5x speed |
| Foreground | Parallax | Text, buttons, UI move at different rates |
| Fixed elements | Static | Navbar stays fixed, blurs content beneath |

**The result:** A cinematic video background that responds to scroll, with text and UI elements floating over it at varying speeds--creating both narrative control AND dimensional depth.

---

## What You're Building

A personal tech portfolio with two hero sections, each combining both technologies:

### Section 1: Personal Brand Hero

- **Frame Animation:** Cinematic portrait sequence (you looking upward -> looking at screen)
- **Parallax:** Name, title, skills floating over the animation at different rates

### Section 2: AI Community Product Feature

- **Frame Animation:** Product burst sequence (static -> dynamic element explosion)
- **Parallax:** Product name, stats, CTAs layered with depth movement

---

## The Five-Tool Pipeline

| Step | Tool | Purpose | Cost |
|------|------|---------|------|
| 1 | Google Whisk + Nano Banana Pro | Generate first and last frames for both sections | Free |
| 2 | Google Flow (Veo 3.1) | Animate between frames | Free tier / $22-250/mo |
| 3 | EZGIF | Convert videos to WebP frame sequences | Free |
| 4 | Self-Hosted Docker Stack | Local storage for frame sequences (MinIO + PostgreSQL + Nginx) | Free |
| 5 | Firebase Studio | Build website with combined frame animation + parallax | Free tier |

**Total time:** 3-5 hours for the complete dual-section portfolio

---

## Tool Deep Dive

### Google Whisk + Nano Banana Pro

**What it is:** Google Whisk is an experimental AI tool from Google Labs that takes a visual-first approach to image generation. Unlike traditional text-to-image generators, Whisk lets you use images as prompts--dragging and dropping pictures to define subject, scene, and style.

**How It Works:**

- Behind the scenes, Gemini automatically writes detailed captions of your uploaded images
- These descriptions feed into Imagen 3, Google's latest image generation model
- The process captures the essence of your inputs rather than creating exact replicas

Nano Banana Pro (built on Gemini 3 Pro, November 2025) is integrated into Whisk and provides:

- Blending multiple images into cohesive compositions
- Maintaining character and product consistency across generations
- Targeted transformations using natural language
- Commercial-grade outputs ideal for both portraits and product photography

Precise Mode gives greater control over preserving facial features, scenes, and styles.

**Key Features (2025):**

- **Image-Based Prompting:** Upload images for subject, scene, and style to remix together
- **Whisk Animate:** Powered by Veo 2, converts static creations into 8-second video clips
- **Prompt Editing:** View and modify the underlying text prompts Gemini generates
- **Global Availability:** Now available in 100+ countries

**Access:**

- URL: labs.google/whisk
- Also available via: Google AI Studio (ai.google.dev/aistudio), Gemini App, Google Flow
- Cost: Free
- Requirements: Google account

---

### Google Flow + Veo 3.1

**What it is:** Flow is Google's AI filmmaking tool, custom-designed for Veo (Google DeepMind's state-of-the-art video generation model). It transforms still images into cinematic video clips with smooth transitions and motion.

**Current Status (December 2025):**

- Evolution of the VideoFX experiment from Google Labs
- Now powered by Veo 3.1 with enhanced creative controls
- Over 275 million videos generated since May 2025 launch
- Available in 149+ countries

**Key Features:**

| Feature | Description |
|---------|-------------|
| Frames to Video | Provide start and end images; Flow generates seamless video with audio |
| Extend | Create longer shots that continue action from original clips |
| Insert | Add new elements to scenes with proper shadows and lighting |
| Remove | Eliminate objects while maintaining scene coherence |
| Ingredients to Video | Generate videos from reference images and characters (up to 3 images) |
| Native Audio | Veo 3.1 generates synchronized dialogue, sound effects, and ambient noise |
| Scene Extension | Extend clips beyond 8 seconds to 60+ seconds (up to 148 seconds / 2.5+ minutes) |

**Technical Specs:**

- Resolution: 720p or 1080p
- Frame rate: 24fps (cinematic), with 30fps and 60fps options
- Base generation: 4, 6, or 8 seconds
- Aspect ratios: 16:9 (horizontal) or 9:16 (vertical)

**Access & Pricing:**

| Plan | Features | Cost |
|------|----------|------|
| Free Tier | Limited generations | Free |
| Google AI Pro | ~90 Veo 3.1 Fast generations or ~10 full Veo 3.1, 100 generations/month | ~$22/month |
| Google AI Ultra | 12,500 credits/month, early Veo 3 access with audio | ~$250/month |
| API (Veo 3.1 Fast) | Per-second pricing | ~$0.15/second |
| API (Veo 3.1 Standard) | Per-second pricing | ~$0.40/second |

URL: labs.google/fx/tools/flow (also accessible via labs.google/flow)

---

### EZGIF

**What it is:** Free online tool for video-to-WebP conversion and frame extraction.

**Why WebP Frame Sequences for Scroll-Synchronized Animation?**

- Precise scroll control: Each scroll position maps to a specific frame
- Lightweight: WebP offers 25-35% smaller files than JPEG
- No autoplay issues: Works consistently across all browsers
- Responsive: Frames load progressively
- Loop capability: Can be set to loop seamlessly

URL: ezgif.com

---

### Self-Hosted Docker Stack (MinIO + PostgreSQL + Nginx)

**What it is:** A self-hosted storage solution using Docker containers for complete control over your frame sequence assets.

**Components:**

| Container | Purpose |
|-----------|---------|
| **MinIO** | S3-compatible object storage for WebP frames |
| **PostgreSQL** | Database for metadata, analytics, or future features |
| **Nginx** | Reverse proxy with caching for CDN-like performance |

**Key Features:**

- **Full Control:** Own your data and infrastructure
- **S3-Compatible API:** MinIO works with any S3 client/SDK
- **Local Caching:** Nginx provides fast asset delivery with caching
- **Zero Cost:** No usage fees or tier limits
- **Portable:** Easy to deploy anywhere Docker runs

**Requirements:**

- Docker & Docker Compose installed
- VPS/server with public IP (for production) or localhost (for development)
- Domain name + SSL certificate (for production)

---

### Firebase Studio

**What it is:** Google's cloud-based, agentic development environment for building full-stack AI applications. Launched April 2025 at Google Cloud Next.

**Components:**

- Project IDX: Flexible cloud-based VM with Code OSS editor
- Genkit: AI workflow orchestration
- Gemini in Firebase: AI-powered coding assistance
- App Prototyping Agent: Natural language to functional prototype

**Key Features:**

| Feature | Description |
|---------|-------------|
| App Prototyping Agent | Create apps using natural language, images, or drawings |
| 60+ Templates | Pre-built starting points for React, Next.js, Flutter, etc. |
| AI-Optimized Templates | Autonomous agent mode for faster development |
| Firebase Integration | Direct deployment to Firebase App Hosting |
| Gemini Code Assist | AI assistance for coding, debugging, and testing |

**Supported Frameworks:**

- Next.js (default for prototyping)
- React, Angular, Vue.js
- Flutter (mobile)
- Node.js, Python, Go, Java, .NET

**Access:**

- URL: firebase.studio or studio.firebase.google.com
- Free Tier: 3 workspaces
- Google Developer Program: Up to 30 workspaces

---

## Step 1: Generate Visual Assets with Google Whisk

You need two sets of first/last frames:

1. **Personal Hero:** Your cinematic portrait
2. **Product Feature:** Your AI Community product

---

### SECTION A: Personal Portrait Frames

#### First Frame Prompt (Portrait - Opening)

```
Cinematic portrait with high-contrast dual-tone lighting, combining
deep blues and fiery oranges. The mood feels dramatic, premium, and
modern -- like a movie poster or high-end branding website hero section.

Lighting & Color:
- Key lighting: Strong overhead/front key light in warm orange/red tones
- Fill lighting: Cool blue gradient shadows on the opposite side
- Color palette: Deep navy blue background fading into warm orange
- Contrast: Very high contrast with sharp separation between tones

Subject Look:
- Close-up portrait facing upward, giving an inspiring, heroic vibe
- Low-angle camera perspective for a powerful, aspirational feeling
- Soft, subtle rim light around edges to separate from background

Background:
- Gradient blend from dark blue at top to warm orange/red at bottom
- No distractions; fully blurred or minimal texture

Mood/Branding Feel:
- Bold, confident, modern
- Strong cinematic atmosphere with directional lighting
```

#### Last Frame Prompt (Portrait - Closing)

```
[Same visual style as first frame]

Make the person looking towards the screen
```

**Portrait Pro Tips:**

- Run the prompt multiple times to find the best output
- Check spacing, lighting, and color balance
- Use Precise Mode for better control over facial features
- Upload a reference photo of yourself for consistency
- Download both frames--they act as "bookends" defining your visual arc

---

### SECTION B: AI Community Product Frames

#### First Frame Prompt (Product - Opening)

```
Create a high-quality product image using the uploaded product visual
(AI Community logo/interface/mockup).

Place the product floating in the center of the frame with a slight
natural tilt, similar to commercial tech product ads.

Use clean, soft studio lighting with subtle highlights and shadows
to make the product look glossy and premium. Keep all original details
sharp and readable.

STYLE:
- Same aesthetic as modern tech/SaaS product ads
- Simple, minimal, flat background
- Clean color separation
- Slight vignette but no gradients

BACKGROUND:
- Pure solid black (#000000)
- No reflections, no textures

FRAMING:
- Full vertical frame
- Product centered
- Enough margins for later motion-tracking

OUTPUT:
- High-resolution still image
- Black background for easy masking
- Maintain exact shape, colors, and proportions of uploaded product
```

#### Last Frame Prompt (Product - Closing / Dynamic Burst)

```
Using the uploaded product image, generate the final frame of a
product animation. The product should appear floating and tilted
slightly forward, while multiple AI/tech elements burst
dynamically around it.

ELEMENT BURST:
- Surround product with floating AI icons, neural network nodes,
  chat bubbles, connection lines in dynamic outward explosion
- Include high-energy glow/particle effects wrapping partially around the product
- Elements captured in high-speed photography style: sharp, crisp, mid-air
- Keep product/logo visible and unobstructed

STYLE:
- Clean, soft commercial studio lighting
- Bright highlights on edges
- Sharp element details, no motion blur
- Energetic composition similar to tech advertising key visuals

PRODUCT POSITION:
- Center of frame
- Slight forward tilt for dynamic hero-shot angle
- Elements positioned with natural spacing for animation

BACKGROUND:
- Pure solid black (#000000)
- No gradients, textures, fog, or shadows
- Designed for clean masking and compositing

OUTPUT:
- High-resolution final frame
- Product centered with bursting AI/tech effects
- Completely black background
```

### Quality Checklist (Both Sections)

When reviewing generated images, verify:

- [x] Clean lighting with balanced highlights and shadows
- [x] Sharp, readable details (face for portrait, logo/text for product)
- [x] Consistent color tones across all frames
- [x] Clean edges suitable for masking
- [x] Professional commercial aesthetic
- [x] Sufficient margins for motion-tracking

Download all approved images before proceeding.

---

## Step 2: Animate with Google Flow (Veo 3.1)

### Setting Up in Flow

1. Open Google Flow (labs.google/fx/tools/flow)
2. Start a new project
3. Locate the generation mode selector (defaults to "Text to Video")
4. Switch to "Frames to Video" mode

---

### Animation A: Personal Portrait Transition

**Upload:**

- First frame: Your opening portrait (looking upward)
- Last frame: Your closing portrait (looking at screen)

**Motion Prompt:**

```
A smooth cinematic 3D transition

The subject smoothly transitions from looking upward with an inspiring,
heroic pose to looking directly toward the screen.

Maintain the dramatic dual-tone lighting throughout--deep blues on one side,
warm oranges on the other. The transition should feel premium and intentional,
like a high-end brand reveal.

MOTION STYLE:
- Smooth pacing
- Subtle, refined transitions
- Modern premium feel
- No jarring movements
```

---

### Animation B: AI Community Product Transition

**Upload:**

- First frame: Your static product shot
- Last frame: Your dynamic burst composition

**Motion Prompt:**

```
Create a dynamic transition from the base product frame to the
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
- No jarring movements
```

---

### Flow Settings (Both Animations)

| Setting | Value |
|---------|-------|
| Mode | Frames to Video |
| Duration | 6-8 seconds recommended |
| Resolution | 1080p for best quality |
| Frame Rate | 24fps (cinematic) |
| Aspect Ratio | 16:9 for standard web |

**Generation & Review:**

- Flow typically provides 2 versions
- Look for: smooth motion, clean transitions, consistent lighting, no distracting artifacts
- Download the version that best matches your vision
- Check audio: Veo 3.1 generates native audio--you can keep it or plan to replace it

**Tips for Better Animation Results:**

- Keep prompts specific: Describe exactly how elements should move
- Use reference images: Up to 3 images can guide the visual style
- Iterate if needed: If first results aren't perfect, refine your prompt and regenerate

---

## Step 3: Convert to WebP Frame Sequences with EZGIF

### Conversion Steps (Repeat for Both Animations)

1. Go to ezgif.com
2. Select "Video to WebP"
3. Upload your Flow animation
4. Configure settings:
   - Resolution: Original (keep visuals sharp)
   - FPS: Use the closest native FPS shown (aim for 24-30fps)
   - Quality: 85 (balance between quality and file size)
   - Enable "Forever loop" option
5. Click Convert
6. Click "Split" to extract individual frames
7. Download the ZIP containing all frames

### Optimization Guidelines

| Parameter | Recommendation |
|-----------|----------------|
| Quality | 75-85% WebP quality |
| Frame Rate | 24-30fps sweet spot |
| Expected Size | ~50-100MB for 240 frames at 1920x1080 |
| Target per sequence | Under 10MB for good performance |

**For Production Quality:**

- Extract individual frames as WebP images
- Create an image sequence that JavaScript controls
- Consider upscaling frames with AI tools if quality drops significantly
- Use a CDN for faster loading

---

## Step 4: Asset Storage with Self-Hosted Docker Stack

### Docker Compose Setup

Create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: portfolio-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
      POSTGRES_DB: portfolio
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfolio"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: portfolio-storage
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"   # API
      - "9001:9001"   # Console
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: portfolio-cdn
    restart: unless-stopped
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - nginx_cache:/var/cache/nginx
    ports:
      - "8080:80"
    depends_on:
      - minio

volumes:
  postgres_data:
  minio_data:
  nginx_cache:
```

### Nginx Configuration

Create an `nginx.conf` file for caching and CDN-like behavior:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Cache configuration
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=assets_cache:100m max_size=10g inactive=7d use_temp_path=off;

    server {
        listen 80;
        server_name localhost;

        # Serve MinIO assets with caching
        location /frames/ {
            proxy_pass http://minio:9000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;

            # Cache settings for CDN-like performance
            proxy_cache assets_cache;
            proxy_cache_valid 200 7d;
            proxy_cache_valid 404 1m;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            add_header X-Cache-Status $upstream_cache_status;

            # CORS headers for web access
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, OPTIONS';
            add_header Cache-Control "public, max-age=604800";
        }

        # Health check endpoint
        location /health {
            return 200 'OK';
            add_header Content-Type text/plain;
        }
    }
}
```

### Environment Variables

Create a `.env` file for sensitive credentials:

```bash
POSTGRES_PASSWORD=your_secure_password_here
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_secure_minio_password
```

### Setup Process

1. **Start the Docker stack:**
   ```bash
   docker-compose up -d
   ```

2. **Access MinIO Console:**
   - Open `http://localhost:9001` in your browser
   - Login with your MINIO_ROOT_USER and MINIO_ROOT_PASSWORD

3. **Create buckets:**
   - Click "Create Bucket"
   - Create `portfolio-hero-frames` bucket
   - Create `portfolio-product-frames` bucket
   - Set both buckets to **Public** access policy

4. **Upload WebP sequences:**
   - Navigate to each bucket
   - Upload your frame sequences (frame_0001.webp, frame_0002.webp, etc.)

5. **Verify access through Nginx:**
   - Test: `http://localhost:8089/frames/portfolio-hero-frames/frame_0001.webp`

### URL Format

**Development (localhost):**
```
http://localhost:8089/frames/[BUCKET]/frame_0001.webp
```

**Production (with domain):**
```
https://assets.yourdomain.com/frames/[BUCKET]/frame_0001.webp
```

**Example URLs you'll use:**

- Hero: `http://localhost:8089/frames/portfolio-hero-frames/frame_0001.webp`
- Product: `http://localhost:8089/frames/portfolio-product-frames/frame_0001.webp`

### Production Deployment

For production, add SSL with Let's Encrypt:

```yaml
# Add to docker-compose.yml
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: certonly --webroot -w /var/www/certbot -d assets.yourdomain.com --email you@email.com --agree-tos --non-interactive
```

Update `nginx.conf` to include SSL configuration and redirect HTTP to HTTPS.

### MinIO CLI Upload (Alternative)

For bulk uploads, use the MinIO client:

```bash
# Install mc (MinIO Client)
brew install minio/stable/mc  # macOS
# or download from https://min.io/download

# Configure connection
mc alias set local http://localhost:9000 minioadmin your_password

# Upload frames
mc cp --recursive ./hero-frames/ local/portfolio-hero-frames/
mc cp --recursive ./product-frames/ local/portfolio-product-frames/

# Set public access
mc anonymous set public local/portfolio-hero-frames
mc anonymous set public local/portfolio-product-frames
```

---

## Step 5: Build the Website with Firebase Studio

### Getting Started

1. Go to firebase.studio
2. Sign in with your Google account
3. In the "Prototype an app with AI" field, enter your website prompt

---

### Complete Website Prompt (Combining Both Technologies)

```
Design a premium, single-page personal tech portfolio website that combines
TWO motion technologies:

1. SCROLL-SYNCHRONIZED FRAME ANIMATION: Video sequences where scroll position
   controls which frame displays (scroll down = advance frames, scroll up = reverse)

2. PARALLAX LAYERING: Text and UI elements move at different speeds than the
   background, creating depth (background at 0.3-0.5x speed, foreground at 1x+)

============================
SECTION 1: HERO (Personal Brand)
============================

BACKGROUND LAYER (Scroll-Synchronized Frame Animation):
- Full-screen WebP image sequence
- Scroll down -> frames advance; Scroll up -> frames reverse
- Animation must feel smooth and cinematic
- Load all images first, use opacity switching (100/0) for frame changes
- WebP Link: [YOUR_DOCKER_HOST]/frames/portfolio-hero-frames/frame_0001.webp
- Total Frames: 240

MID-LAYER (Parallax at 0.5x scroll speed):
- Subtle floating decorative elements (geometric shapes, gradient orbs)
- Move slower than scroll to create depth behind text

FOREGROUND LAYER (Parallax at 1x-1.2x scroll speed):

Left Side Text Block:
- Small intro line in accent color: "Hey, welcome to the"
- Large two-line title:
  Line 1: "[YOUR NAME]"
  Line 2: "TECH PORTFOLIO"
- Horizontal skill indicators below title (#01 AI/ML, #02 Full-Stack, #03 Product, #04 Community)
- Text should have slight upward parallax movement as user scrolls

Right Side Text Block:
- Bold subheadline: "Building the future of AI communities"
- Supporting paragraph (2-3 lines about your mission/expertise)
- Centered social icons at bottom (GitHub, LinkedIn, Twitter/X, Email)
- Moves at slightly different rate than left side for dimensional feel

============================
SECTION 2: FEATURED PRODUCT (AI Community)
============================

BACKGROUND LAYER (Scroll-Synchronized Frame Animation):
- Full-screen WebP image sequence (separate from hero)
- Same scroll-synchronized behavior: scroll controls frame index
- Scroll down -> frames advance; Scroll up -> frames reverse
- WebP Link: [YOUR_DOCKER_HOST]/frames/portfolio-product-frames/frame_0001.webp
- Total Frames: 240

MID-LAYER (Parallax at 0.4x scroll speed):
- Floating tech icons, connection lines, subtle particle effects
- Creates depth between video background and text

FOREGROUND LAYER (Parallax at 1x-1.3x scroll speed):

Left Side:
- Small label in accent color: "Featured Project"
- Large product name: "[AI COMMUNITY NAME]"
- Smaller subtitle: "Building the next generation of AI practitioners"
- Short descriptive paragraph about the community
- Two CTA buttons side by side: "Join Community" | "Learn More"

Right Side:
- Large number: "01"
- Key stats displayed vertically (each moves at slightly different rate):
  - "10K+ Members"
  - "500+ Resources"
  - "Weekly Events"

============================
SCROLL-SYNCHRONIZED FRAME ANIMATION LOGIC
============================

For each section with frame animation:
- Map scroll position within that section to frame index
- Formula: frameIndex = floor(scrollPercent x (totalFrames - 1))
- Preload first 10 frames immediately for instant visual
- Background-load remaining frames
- Use opacity switching (not src swapping) for smooth transitions
- Debounce scroll handlers for 60fps performance

============================
PARALLAX LAYER LOGIC
============================

Layer speed ratios:
- Background frame animation: Fixed position within section
- Mid-layer decorative: 0.3x-0.5x scroll speed (moves slower)
- Foreground text/UI: 1x-1.3x scroll speed (moves with or slightly faster)
- This creates perceived depth without true 3D

============================
GLOBAL ELEMENTS
============================

NAVIGATION (Fixed, no parallax):
- Fixed navbar with rounded corners, faint white outline, and 70% opacity
- Backdrop blur so it softly obscures content beneath
- Brand logo/name on left
- Section links: About, Skills, Projects, AI Community, Contact
- Dark/light mode toggle on right

LOADING EXPERIENCE:
- Full-screen loading overlay before content reveals
- Brand logo centered
- Horizontal loading bar with percentage indicator
- Only reveal content after ALL frame sequences are fully preloaded
- Show: "Loading experience... X%"

============================
ADDITIONAL SECTIONS (Standard parallax, no frame animation)
============================

ABOUT SECTION:
- Brief professional bio with parallax text movement
- Profile photo with subtle float effect
- Key achievements/credentials

SKILLS SECTION:
- Visual skill cards or progress bars
- Cards have staggered parallax entrance
- Categories: AI/ML, Development, Product, Leadership

PROJECTS SECTION:
- Grid of 3-6 project cards
- Each with thumbnail, title, description, tech stack, links
- Cards shift at different parallax rates on scroll

AI COMMUNITY DETAILS:
- What the community offers
- Testimonials from members (carousel or stacked with parallax)
- Join/Subscribe CTA with hover animation

CONTACT SECTION:
- Contact form
- Social links
- Location/timezone info

FOOTER:
- Navigation links
- Social icons
- Copyright
- Minimal parallax (subtle upward drift)

============================
THEME
============================

- Dark mode default (black/charcoal backgrounds)
- Accent color: [YOUR BRAND COLOR - e.g., Electric Blue, Neon Orange]
- Accent affects buttons, highlights, hover states, skill indicators
- Clean, minimal, premium aesthetic
- Typography: Modern sans-serif, high contrast
- Smooth easing on all parallax movements (ease-out curves)

============================
PERFORMANCE REQUIREMENTS
============================

- Target 60fps scroll performance
- Preload hero frames before reveal
- Lazy load product section frames as user approaches
- Use RequestAnimationFrame for scroll handlers
- Implement will-change hints for parallax layers
- Total parallax layers: Maximum 5 active at once
```

---

## Refinement Prompts

After initial generation, use these follow-up prompts to fine-tune:

### Navbar with Blur

```
Create a fixed navbar with rounded corners, faint white outline,
and 70% opacity so it blurs the elements it overlaps. Use backdrop-filter
for the blur effect.
```

### Hero Parallax Text

```
Make the hero text elements move at different parallax rates:
- "Hey, welcome to the" moves at 1.1x scroll speed
- Main name moves at 1.0x scroll speed
- Skill indicators move at 0.9x scroll speed
This creates subtle depth within the text block itself.
```

### Mid-Layer Decorative Elements

```
Add floating decorative elements between the frame animation background
and the foreground text:
- Subtle gradient orbs (20% opacity)
- Thin geometric lines
- Small dot patterns
These move at 0.4x scroll speed to create perceived depth.
```

### Skill Indicators

```
Add horizontal skill indicators below the main title showing:
#01 AI/ML  #02 Full-Stack  #03 Product  #04 Community
Each with a small accent-colored number and label.
Stagger their parallax rates slightly (0.85x, 0.9x, 0.95x, 1.0x).
```

### Product Section Stats

```
On the right side of the product section, add vertical stats display:
- Large "01" number (moves at 1.2x for emphasis)
- "10K+ Members" with icon (1.1x)
- "500+ Resources" with icon (1.0x)
- "Weekly Events" with icon (0.9x)
The staggered rates make them feel like floating cards.
```

### Loading Screen

```
Create a premium loading screen that shows:
- Centered logo
- Horizontal progress bar with smooth animation
- Percentage text (0% to 100%)
- Subtle pulsing glow on the logo
- Only dismiss after both frame sequences are fully loaded
- Fade out with 0.5s ease-out transition
```

### Mobile Optimization

```
For mobile (below 768px):
- Disable parallax layering (performance)
- Show static first frame instead of scroll-synchronized animation
- Stack text blocks vertically
- Ensure touch scrolling works smoothly
- Make CTAs full-width
- Reduce decorative mid-layer elements
```

---

## Technical Implementation Details

### How the Two Technologies Work Together

```
+------------------------------------------------------------------+
|                    VIEWPORT (What user sees)                      |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------------------------------------------------+  |
|  | LAYER 4: Fixed Navbar (no movement)                         |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  | LAYER 3: Foreground Text/UI (1x-1.3x parallax speed)        |  |
|  | - Name, title, CTAs                                         |  |
|  | - Moves WITH scroll or slightly faster                      |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  | LAYER 2: Mid-layer decorative (0.3x-0.5x parallax)          |  |
|  | - Floating shapes, orbs, lines                              |  |
|  | - Moves SLOWER than scroll                                  |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  | LAYER 1: Background Frame Animation                         |  |
|  | - WebP sequence controlled by scroll position               |  |
|  | - frame = scrollPercent x totalFrames                       |  |
|  | - Creates cinematic "scrubbing" effect                      |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

### Scroll-Synchronized Frame Animation Logic

```javascript
// Core concept: scroll position -> frame index
scrollPercent = scrollY / (documentHeight - viewportHeight)
frameIndex = floor(scrollPercent * (totalFrames - 1))

// For sectioned approach (two hero sections):
// Section 1 (0-50% of page): Maps to hero frames 1-240
// Section 2 (50-100% of page): Maps to product frames 1-240
```

### Parallax Layer Logic

```javascript
// Each layer moves at different rate relative to scroll
layerOffset = scrollY * speedMultiplier

// Speed multipliers:
// 0.3x = moves at 30% of scroll speed (feels far away)
// 0.5x = moves at 50% of scroll speed (mid-distance)
// 1.0x = moves with scroll (neutral)
// 1.2x = moves faster than scroll (feels close/emphasized)
```

### Performance Optimization Techniques

| Technique | Technology | Benefit |
|-----------|------------|---------|
| Preload first 10 frames | Frame Animation | Immediate visual feedback |
| Background load remaining | Frame Animation | Seamless experience |
| WebP format | Frame Animation | 25-35% smaller than JPEG |
| Opacity switching | Frame Animation | Smoother than src swapping |
| RequestAnimationFrame | Both | 60fps synchronized updates |
| Debounce scroll handlers | Both | Prevent performance degradation |
| will-change CSS hint | Parallax | GPU acceleration for layers |
| Limit to 5 active layers | Parallax | Prevent compositor overload |
| Lazy load | Both | Load assets outside viewport on demand |
| transform: translate3d | Parallax | Hardware acceleration |

### Accessibility Considerations

For users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable frame animation - show static first frame */
  .frame-animation-container {
    background-image: url('frame_0001.webp');
  }

  /* Disable parallax - all layers move at same rate */
  .parallax-layer {
    transform: none !important;
  }
}
```

**Additional accessibility requirements:**

- Provide alternative navigation ensuring site is fully usable without animations
- Maintain contrast: Keep text readable over moving backgrounds
- Test with screen readers: Verify logical reading order

### Technical Checklist

- [x] Test across browsers (Chrome, Safari, Firefox, Edge)
- [x] Test on multiple devices and screen sizes
- [x] Verify Core Web Vitals (LCP < 2.5s, CLS < 0.1, FID < 100ms)
- [x] Add loading states for asset preloading
- [x] Implement error handling for failed asset loads
- [x] Enable HTTPS for production
- [x] Mobile: Disable parallax + show static frame below 768px width
- [x] Respect prefers-reduced-motion preference

---

## Building & Deploying in Firebase Studio

### Build Process

1. Paste your prompt and click "Prototype with AI"
2. Review the blueprint Firebase generates (app name, features, style guidelines)
3. Click "Prototype this app" to generate code
4. Wait for code generation (typically 2-5 minutes)
5. Preview and iterate:
   - Use the chat interface to request changes
   - Modify fonts, colors, spacing as needed
   - Replace placeholder URLs with your Docker stack URLs

### Asset Integration

1. Update paths in your code:
   - Replace placeholder URLs with your hosted WebP URLs
   - Ensure paths follow your sequence naming convention (frame_0001.webp, frame_0002.webp, etc.)

2. Test both technologies:
   - Verify frame animation advances/reverses smoothly with scroll
   - Verify parallax layers move at different rates
   - Check transition between hero and product sections

### Exporting from Firebase Studio

1. Click "Switch to Code Editor"
2. Select all files
3. Right-click -> "Zip and Download"

### Publishing

1. Click "Publish" in Firebase Studio
2. Follow prompts to deploy to Firebase App Hosting
3. Share your live URL

### Deployment Alternatives

| Platform | Best For | Notes |
|----------|----------|-------|
| Firebase App Hosting | Integrated deployment | Direct from Firebase Studio |
| Vercel | Next.js projects | Automatic builds from Git |
| Netlify | Static sites | Drag-and-drop deployment |
| GitHub Pages | Simple hosting | Free for public repos |
| Cloudflare Pages | Global CDN | Fast edge deployment |

### Custom Domain Setup

1. Purchase domain from registrar
2. Configure DNS to point to hosting provider
3. Enable HTTPS/SSL
4. Wait 24-48 hours for full propagation

---

## Troubleshooting Common Issues

### Frame Animation Issues

**Images Not Generating Well:**

- Add more specific details to prompts
- Include reference images for style guidance
- Try multiple generations and select the best
- Use Precise Mode in Whisk for better control

**Animation Looks Choppy:**

- Reduce frame rate expectations (24fps is fine)
- Simplify motion descriptions in prompts
- Use higher quality Veo 3.1 (not Fast) for production

**WebP Files Too Large:**

- Reduce frame rate during conversion
- Lower quality slightly (try 75% instead of 85%)
- Consider splitting into multiple shorter sequences

**Scroll Not Syncing to Frames:**

- Verify JavaScript is mapping scroll position to frame index correctly
- Check that total frame count matches your sequence
- Test scroll behavior on different browsers
- Ensure each section has its own scroll range properly defined

### Parallax Issues

**Layers Feel Janky/Stuttery:**

- Add `will-change: transform` to parallax elements
- Use `transform: translate3d()` instead of top/left
- Reduce number of active parallax layers
- Debounce scroll event handlers

**Depth Doesn't Feel Right:**

- Adjust speed multipliers (try 0.3x, 0.6x, 1.0x spread)
- Add more visual separation between layers
- Increase opacity difference between layers

**Text Hard to Read Over Animation:**

- Add subtle dark gradient overlay on frame animation
- Increase text shadow or outline
- Use semi-transparent backdrop behind text blocks

### General Issues

**Website Loading Slowly:**

- Compress WebP files further
- Implement progressive loading
- Use a CDN for asset delivery
- Add a proper loading screen with progress indicator

**Mobile Performance Poor:**

- Disable parallax on mobile (< 768px)
- Show static first frame instead of animation
- Reduce decorative elements
- Test on actual devices, not just emulators

---

## Complete Workflow Summary

```
+------------------------------------------------------------------+
|  1. GOOGLE WHISK + NANO BANANA                                    |
|     PORTRAIT SEQUENCE:                                            |
|     - Create first frame (looking upward, heroic, dual-tone)      |
|     - Create last frame (looking at screen, same style)           |
|     PRODUCT SEQUENCE:                                             |
|     - Create first frame (static, centered, black background)     |
|     - Create last frame (dynamic burst with AI elements)          |
|     - Download all four as high-quality images                    |
|     - Time: 30-45 minutes                                         |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|  2. GOOGLE FLOW (VEO 3.1)                                         |
|     PORTRAIT ANIMATION:                                           |
|     - Upload portrait first + last frames                         |
|     - Prompt: "A smooth cinematic 3D transition"                  |
|     - Generate smooth cinematic portrait transition               |
|     PRODUCT ANIMATION:                                            |
|     - Upload product first + last frames                          |
|     - Prompt: Dynamic transition with element burst               |
|     - Generate dynamic product burst transition                   |
|     - Download both animations (6-8 seconds, 1080p, 24fps)        |
|     - Time: 45-90 minutes                                         |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|  3. EZGIF                                                         |
|     FOR EACH ANIMATION:                                           |
|     - Upload to ezgif.com -> Video to WebP                        |
|     - Settings: Original resolution, native FPS, 85% quality      |
|     - Convert -> Split into individual frames                     |
|     - Download ZIP (expect ~240 frames per sequence)              |
|     - Time: 15-20 minutes                                         |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|  4. SELF-HOSTED DOCKER STACK                                      |
|     - Run docker-compose up -d (PostgreSQL + MinIO + Nginx)       |
|     - Access MinIO Console at http://localhost:9001               |
|     - Create portfolio-hero-frames bucket (public)                |
|     - Create portfolio-product-frames bucket (public)             |
|     - Upload all WebP frames via Console or mc CLI                |
|     - Verify URLs: http://localhost:8089/frames/[bucket]/...      |
|     - Time: 15-20 minutes                                         |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|  5. FIREBASE STUDIO                                               |
|     - Use App Prototyping Agent                                   |
|     - Paste complete website prompt specifying BOTH:              |
|       - Scroll-synchronized frame animation (background)          |
|       - Parallax layering (mid-layer + foreground)                |
|     - Include both Docker stack URLs and frame counts                 |
|     - Refine with follow-up prompts (navbar, parallax rates)      |
|     - Test: frames advance with scroll AND layers have depth      |
|     - Deploy to Firebase App Hosting                              |
|     - Time: 1.5-2.5 hours                                         |
+------------------------------------------------------------------+

Total Time: 3-5 hours
```

---

## Tool Links Summary

| Tool | URL | Cost |
|------|-----|------|
| Google Whisk | labs.google/whisk | Free |
| Google AI Studio | ai.google.dev/aistudio | Free |
| Google Flow | labs.google/fx/tools/flow | Free tier / $22-250/mo |
| EZGIF | ezgif.com | Free |
| MinIO | min.io | Free (self-hosted) |
| PostgreSQL | postgresql.org | Free (self-hosted) |
| Nginx | nginx.org | Free (self-hosted) |
| Firebase Studio | firebase.studio | Free tier |

---

## What You've Built

By following this workflow, you've created a portfolio that combines TWO motion technologies:

### Scroll-Synchronized Frame Animation

- Cinematic video sequences that respond to scroll position
- Portrait animation: Your personal brand reveal
- Product animation: AI Community dynamic showcase
- Users control the pace--scroll down advances, scroll up reverses

### Parallax Layering

- Multiple visual layers moving at different speeds
- Background (frame animation), mid-layer (decorative), foreground (text/UI)
- Creates dimensional depth and premium feel
- Text and UI elements float over the video at varying rates

### The Combined Effect

- A cinematic video background you control by scrolling
- Text and elements that float over it with perceived depth
- Two distinct sections showcasing you AND your product
- Premium, modern, and alive from the first interaction

### Key Principles

1. Two technologies, one experience (frame animation + parallax)
2. Start with strong visual bookends (first and last frames)
3. Let AI handle the in-between (Flow transitions)
4. Optimize for performance (WebP, debouncing, layer limits)
5. Use scroll as both narrative tool (frame control) AND depth tool (parallax)
6. Iterate with AI assistance (Firebase Studio refinement prompts)

Your portfolio now looks premium, feels dimensional, and puts visitors in control of the experience.

---

*Guide current as of December 2025. Tool interfaces and features may evolve--always refer to official Google documentation for the latest capabilities.*
