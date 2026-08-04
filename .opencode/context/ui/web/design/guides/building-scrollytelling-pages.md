<!-- Context: ui/building-scrollytelling-pages | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->
---
description: "Step-by-step implementation of scroll-linked image sequence animations"
---

# Guide: Building Scrollytelling Pages

**Purpose**: Step-by-step implementation of scroll-linked image sequence animations
**Last Updated**: 2026-01-07

---

## Prerequisites

- Next.js 14+ project with App Router
- Framer Motion installed (`npm i framer-motion`)
- Tailwind CSS configured
- Image sequence ready (60-240 WebP frames)

---

## Step 1: Generate Image Sequences

Use AI tools (Runway, Pika) to create start/end frames then interpolate between them.

**Start frame prompt**: Ultra-premium product photography of [product] on matte black surface, minimalistic studio shoot, deep black background with subtle gradient, soft rim lighting, cinematic, high contrast, luxury aesthetic, sharp focus, no clutter, DSLR 85mm f/1.8, photorealistic

**End frame prompt**: Exploded technical diagram of same [product], every component separated and floating in alignment, deep black studio background, visible internal structure, hyper-realistic, studio rim lighting, cinematic, no labels, photorealistic

**Generate video**: Use Runway or Pika to interpolate between frames. Settings: Duration 4-5s, 30fps, camera static or slow orbit.
**Export frames**: `ffmpeg -i animation.mp4 -vf fps=30 frame_%04d.webp`

---

## Step 2: Project Structure

```
app/
├── page.tsx                    # Main landing page
├── components/
│   └── HeadphoneScroll.tsx    # Scroll animation component
└── globals.css                 # Dark theme, Inter font
public/
└── frames/
    ├── frame_0001.webp        # 120+ frames
    ├── frame_0002.webp
    └── ...
```

---

## Step 3: globals.css

```css
@tailwind base; @tailwind components; @tailwind utilities;
@layer base { body { @apply bg-[#050505] text-white antialiased; font-family: 'Inter', sans-serif; } }
```

---

## Step 4-6: Core Scroll Component

**Key patterns**: Container with `h-[400vh]` for long scroll, canvas with `sticky top-0` stays fixed, `useScroll` tracks progress (0-1), `useTransform` maps to frame index

**Core logic**:
```tsx
const { scrollYProgress } = useScroll({ target: containerRef })
const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 119])
```

**Preloader** (always preload before starting animation):
```tsx
useEffect(() => {
  const promises = Array.from({ length: 120 }, (_, i) => new Promise(resolve => {
    const img = new Image()
    img.src = `/frames/frame_${String(i + 1).padStart(4, '0')}.webp`
    img.onload = () => resolve(img)
  }))
  setImages(await Promise.all(promises)); setLoading(false)
}, [])
```

**Canvas rendering** (draw current frame on scroll update):
```tsx
useEffect(() => {
  if (!canvasRef.current || !images.length) return
  const canvas = canvasRef.current, ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth; canvas.height = window.innerHeight
  ctx.drawImage(images[Math.round(currentFrame)],
    (canvas.width - img.width) / 2, (canvas.height - img.height) / 2)
}, [currentFrame, images])
```

---

## Step 7: Text Overlays

Fade text in/out at specific scroll positions using useTransform:
- [0.25, 0.30, 0.35] = fade in at 25%, visible 25-30%, fade out 30-35%
- Each text section gets its own opacity transform range

```tsx
<motion.div style={{ opacity: useTransform(scrollYProgress, [0.25, 0.30, 0.35], [0, 1, 0]) }}
  className="absolute left-20 text-4xl font-bold">Precision Engineering.</motion.div>
```

---

## Step 8: Match Backgrounds (CRITICAL)

Page background MUST match image background exactly. Open first frame in image editor → Use eyedropper tool on background (e.g., `#050505`) → Set page background to exact same color in globals.css → Test: Image edges should be invisible

---

## Step 9: Performance Optimization

- Add `willChange: 'transform'` to canvas for GPU hint
- Throttle redraws with requestAnimationFrame on mobile
- Use WebP format (not PNG/JPEG) for smaller files

```tsx
<canvas ref={canvasRef} className="sticky top-0 h-screen w-full" style={{ willChange: 'transform' }} />
```

---

## Step 10: Loading State

Show spinner while frames load:
```tsx
{loading && <div className="fixed inset-0 flex items-center justify-center bg-[#050505]">
  <div className="animate-spin h-12 w-12 border-4 border-white/20 border-t-white rounded-full" />
</div>}
```

---

## Step 11: Full Page Assembly

Combine all pieces in page.tsx:
1. Import the scroll component
2. Wrap in dark-themed main container
3. Add any additional sections (header, footer) outside the scroll container
4. Ensure body background matches image background globally

---

## Video Interpolation Settings

For best results with AI video tools:
- **Duration**: 4-5 seconds (yields 120-150 frames at 30fps)
- **Camera**: Static or slow orbit (not fast movement)
- **Motion**: Smooth, controlled separation of components
- **Lighting**: Must be consistent between start and end frames

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Images not loading** | Check file paths match exactly (case-sensitive), verify frames exist in /public/frames/, check console for 404 errors |
| **Stuttering animation** | Ensure all images preloaded before starting, use WebP format, check canvas size isn't too large for device |
| **Visible image edges** | Background colors don't match exactly — use eyedropper tool on first frame, not guessing colors |
| **Mobile performance** | Reduce frame count (use every 2nd frame), debounce with requestAnimationFrame, consider disabling on small screens |

---

## Testing Checklist

- [ ] All frames load without 404s
- [ ] Animation smooth from 0-100% scroll
- [ ] Text fades in/out at correct positions
- [ ] Background seamlessly blends with images
- [ ] Loading spinner shows before animation
- [ ] Works on mobile (or gracefully disabled)
- [ ] No console errors

---

## Related

- concepts/scroll-linked-animations.md — Understanding the technique
- examples/headphone-scrollytelling.md — Full code example
- lookup/animation-image-prompts.md — Prompts for frame generation

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Framer Motion useScroll](https://www.framer.com/motion/use-scroll/)