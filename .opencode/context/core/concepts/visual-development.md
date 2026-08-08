<!-- Context: visual-development | Priority: high | Version: 1.0 | Updated: 2025-01-27 -->
# Visual Development Context

**Purpose**: Visual content creation, UI design, image generation, and diagram creation

---

## Quick Routes

| Task Type | Context File | Subagent |
|-----------|-------------|----------|
| **Generate/edit image, diagram** | This file | Image Specialist |
| **UI mockup (static)** | This file | Image Specialist |
| **Interactive UI design** | `../workflows/design-iteration-overview.md` | - |
| **Design system** | `../../ui/web/concepts/design-systems.md` | - |
| **UI standards** | `../../ui/web/concepts/ui-styling.md` | - |
| **Animation patterns** | `../../ui/web/concepts/animation-basics.md` | - |

---

## Image Specialist Capabilities

**What It Does** (via Gemini Nano Banana AI):
- ✅ Generate images from text descriptions
- ✅ Edit existing images (modify, enhance, transform)
- ✅ Analyze images (describe content, extract information)
- ✅ Create diagrams (architecture, flowcharts, system visualizations)
- ✅ Design mockups (UI, wireframes, design concepts)
- ✅ Generate graphics (social media, promotional, icons)

**When to Delegate**: User mentions "create/generate image", "diagram/flowchart", "mockup/wireframe", "graphic/illustration", "edit/enhance image", "screenshot/visual"

**Common Use Cases**: Architecture Diagrams, UI Mockups, Social Media Graphics, Documentation Images, Presentations, Marketing Assets

### How to Invoke
```javascript
task(subagent_type="Image Specialist", description="[3-5 word description]",
  prompt="Context: .opencode/context/core/visual-development.md
  Task: [Detailed requirement]
  Style: [aesthetic]; Dimensions: [WxH]; Colors: [scheme]; Format: [PNG/JPG/SVG]
  Output: [path/to/output]")
```

---

## Use Case Examples

### 1. Architecture Diagram
```javascript
task(subagent_type="Image Specialist", description="Microservices architecture diagram",
  prompt="Technical diagram: API Gateway, Auth/User/Order/Payment/Notification services,
  PostgreSQL per service, Redis cache, RabbitMQ, AWS S3. External: Stripe, SendGrid, Twilio.
  Style: Clean, professional, modern. Colors: Blue services, green DBs, orange external.
  Layout: Left-to-right flow. Format: PNG 1920x1080. Output: docs/architecture-diagram.png")
```

### 2. UI Mockup (Dashboard)
```javascript
task(subagent_type="Image Specialist", description="Analytics dashboard mockup",
  prompt="UI mockup: Header with logo/nav, 4 metric cards (Users, Revenue, Conversion, Sessions),
  line chart for 30-day trends, data table for recent transactions. SaaS dark mode.
  Theme: BG #1e293b, Cards #334155, Accent #3b82f6. Clean sans-serif font.
  Format: PNG 1440x900. Output: design_iterations/dashboard_mockup.png")
```

### 3. Flowchart (User Onboarding)
```javascript
task(subagent_type="Image Specialist", description="User onboarding flowchart",
  prompt="Flowchart: Sign up → Email verification → Profile setup → Choose plan →
  Payment (if paid) → Onboarding tutorial → Dashboard access.
  Decision points: Email verified? Plan selected? Payment successful?
  Standard flowchart symbols: Green start/end, Blue process, Yellow decision, Red error.
  Format: PNG 1600x1200. Output: docs/onboarding-flow.png")
```

### 4. Social Media Graphic
```javascript
task(subagent_type="Image Specialist", description="Feature announcement graphic",
  prompt="Social graphic: 'Introducing Real-Time Collaboration' headline.
  'Work together, ship faster' subhead. Abstract collaboration illustration.
  Colors: Primary #6366f1 (indigo), Secondary #8b5cf6 (purple), white bg.
  Format: PNG 1200x630 (Twitter/LinkedIn). Output: marketing/feature-launch.png")
```

### 5. Image Editing (Screenshot Enhancement)
When user asks: "Make this screenshot look more professional"
```javascript
task(subagent_type="Image Specialist", description="Enhance screenshot",
  prompt="Edit screenshot at docs/raw-screenshot.png: add subtle drop shadow,
  round corners (8px radius), thin border, increase contrast slightly.
  Optional: gradient bg, highlight key elements with arrows.
  Format: PNG, maintain original dimensions. Output: docs/enhanced-screenshot.png")
```

---

## Decision Tree

```
User needs visual content → Is it interactive HTML/CSS?
  YES → design-iteration-overview.md workflow (HTML files, production-ready code)
  NO → Is it a static visual asset? → YES → Use Image Specialist → NO → Clarify
```

| Need | Use |
|------|-----|
| Interactive dashboard / landing page | design-iteration-overview.md |
| Dashboard mockup (static image) | Image Specialist |
| Architecture diagram / flowchart | Image Specialist |
| Social media graphic / icon | Image Specialist |
| UI component library | design-iteration-overview.md |
| Working HTML prototype | design-iteration-overview.md |

---

## Tools & Dependencies

**tool:gemini** — Gemini Nano Banana AI
- Included in Developer profile, requires `GEMINI_API_KEY` env var (get at https://makersuite.google.com/app/apikey)
- **Capabilities**: Text-to-Image, Image-to-Image, Image Analysis
- **Formats**: PNG, JPG, WebP | **Resolution**: Up to 2048x2048

### Configuration
```bash
GEMINI_API_KEY=your_api_key_here
```

---

## Best Practices for Prompts

✅ **Do**: Be specific about dimensions/format, describe visual style clearly (modern, minimalist, professional), specify colors with hex codes, include key elements, mention intended use case, provide brand/aesthetic context
❌ **Don't**: Use vague descriptions ("make it nice"), forget dimensions, assume default styles, skip color specs, omit output location

### Good vs Bad Prompt
**Bad**: "Create a diagram of our system"
**Good**: "Technical architecture diagram: 3 microservices, AWS (EC2, RDS, S3), Stripe, SendGrid. Style: Clean, professional. Colors: Blue services, green databases. PNG 1920x1080. Output: docs/system-architecture.png"

---

## Quality Checklist

Before delegating: [ ] Visual content clearly needed | [ ] Static image appropriate (not interactive) | [ ] Requirements gathered (style, dimensions, colors, elements) | [ ] Output format/location specified | [ ] tool:gemini available | [ ] Detailed prompt prepared
After receiving: [ ] Image meets requirements | [ ] Correct dimensions/format | [ ] Visual style matches request | [ ] All key elements included | [ ] User satisfied

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Image doesn't match expectations | Refine prompt with more specific details, provide reference examples |
| Low image quality | Request higher resolution, specify quality requirements |
| Colors don't match brand | Provide exact hex codes, reference brand guidelines |
| Layout is cluttered | Simplify requirements, specify hierarchy and spacing |
| Text in image unreadable | Request larger text, higher contrast, clearer typography |

---

## Related Context

- **UI Design Workflow**: `../workflows/design-iteration-overview.md`
- **Design Systems**: `../../ui/web/concepts/design-systems.md`
- **UI Styling Standards**: `../../ui/web/concepts/ui-styling.md`
- **Animation Patterns**: `../../ui/web/concepts/animation-basics.md`, `../../ui/web/concepts/animation-advanced.md`
- **Subagent Invocation**: `../../openagents-repo/guides/subagent-invocation.md`
- **Agent Capabilities**: `../../openagents-repo/core-concepts/agents.md`

---

## Keywords for Discovery

image, picture, photo, graphic, diagram, flowchart, visualization, chart, mockup, wireframe, design concept, illustration, icon, asset, visual, generate, create, make, design, screenshot, capture, render, architecture, system, flow, process, social media, marketing, promotional, edit, modify, enhance, transform, UI, interface, dashboard, layout

---

## Backup

Backups of original files are stored at `/tmp/opencode/backup/` before modification.

## Version History

- **v1.0** (2025-01-27): Initial creation with comprehensive use cases and examples
- **v1.1** (2026-07-14): Compacted to 180-190 lines, removed verbose explanations