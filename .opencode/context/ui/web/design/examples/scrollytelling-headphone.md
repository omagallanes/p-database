<!-- Context: ui/scrollytelling-headphone | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->
---
description: "Full Next.js implementation of scroll-linked image sequence animation"
---

# Example: Scrollytelling Headphone Animation

**Purpose**: Full Next.js implementation of scroll-linked image sequence animation
**Last Updated**: 2026-01-07

---

## Overview

Complete working example of "Zenith X" headphone scrollytelling page using Next.js 14, Framer Motion, and Canvas.

**Tech Stack**: Next.js 14 (App Router) + Framer Motion + Canvas + Tailwind CSS

---

## File Structure

```
app/
├── page.tsx
├── components/
│   └── HeadphoneScroll.tsx
└── globals.css
public/
└── frames/
    └── frame_0001.webp through frame_0120.webp
```

---

## 1. globals.css

```css
@tailwind base; @tailwind components; @tailwind utilities;
@layer base {
  body { @apply bg-[#050505] text-white antialiased; font-family: 'Inter', sans-serif; }
}
```

---

## 2. app/page.tsx

```tsx
import HeadphoneScroll from './components/HeadphoneScroll'
export default function Home() { return (<main className="bg-[#050505]"><HeadphoneScroll /></main>); }
```

---

## 3. components/HeadphoneScroll.tsx

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const FRAME_COUNT = 120

export default function HeadphoneScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [loading, setLoading] = useState(true)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1])
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => frameIndex.on('change', (latest) => setCurrentFrame(Math.round(latest))), [frameIndex])

  // Preload all 120 frames
  useEffect(() => {
    const loadImages = async () => {
      const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image()
          img.src = `/frames/frame_${String(i + 1).padStart(4, '0')}.webp`
          img.onload = () => resolve(img)
        })
      })
      setImages(await Promise.all(promises))
      setLoading(false)
    }
    loadImages()
  }, [])

  // Render current frame to canvas
  useEffect(() => {
    if (!canvasRef.current || !images.length) return
    const canvas = canvasRef.current, ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = images[currentFrame]
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
    ctx.drawImage(img, (canvas.width - img.width * scale) / 2, (canvas.height - img.height * scale) / 2,
      img.width * scale, img.height * scale)
  }, [currentFrame, images])

  const title = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0])
  const text1 = useTransform(scrollYProgress, [0.25, 0.3, 0.4], [0, 1, 0])
  const text2 = useTransform(scrollYProgress, [0.55, 0.6, 0.7], [0, 1, 0])
  const cta = useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1])

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050505]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
    </div>
  )

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <canvas ref={canvasRef} className="sticky top-0 h-screen w-full" style={{ willChange: 'transform' }} />

      <motion.div style={{ opacity: title }} className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold tracking-tight text-white/90">Zenith X</h1>
          <p className="mt-4 text-xl text-white/60">Pure Sound.</p>
        </div>
      </motion.div>

      <motion.div style={{ opacity: text1 }} className="pointer-events-none fixed inset-y-0 left-20 flex items-center">
        <p className="text-4xl font-bold tracking-tight text-white/90">Precision Engineering.</p>
      </motion.div>

      <motion.div style={{ opacity: text2 }} className="pointer-events-none fixed inset-y-0 right-20 flex items-center">
        <p className="text-4xl font-bold tracking-tight text-white/90">Titanium Drivers.</p>
      </motion.div>

      <motion.div style={{ opacity: cta }} className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-6xl font-bold tracking-tight text-white/90">Hear Everything.</h2>
          <button className="pointer-events-auto mt-8 rounded-full bg-white px-8 py-3 text-lg font-semibold text-black transition hover:bg-white/90">
            Pre-Order Now
          </button>
        </div>
      </motion.div>
    </div>
  )
}
```

---

## Usage

1. `npm install framer-motion` → 2. Place 120 WebP frames in `/public/frames/` → 3. Copy code → 4. `npm run dev`

## Customization

- **FRAME_COUNT**: Change number of frames
- `h-[400vh]`: Adjust scroll length (300-500vh)
- **Transform ranges**: Modify text fade timing
- `bg-[#050505]`: Match image background color

## Key Implementation Details

- `useScroll` tracks scroll progress (0-1), `useTransform` maps to frame index (0-119)
- Preload all frames with Promise.all before rendering
- Canvas renders current frame scaled and centered
- Text opacity transforms trigger at specific scroll positions

---

## Related

- concepts/scroll-linked-animations.md — Understanding the technique
- guides/scrollytelling-setup.md — Getting started
- lookup/scroll-animation-prompts.md — Generating image sequences

## References

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Next.js App Router](https://nextjs.org/docs/app)