# Custom image assets with Codex: research notes and plan

## What I found (Codex CLI 0.163.0 on this machine)

| Path | Model | Transparent PNG? | Needs | Status here |
|---|---|---|---|---|
| Built-in `image_gen` tool (via the bundled `imagegen` skill) | OpenAI image model (ChatGPT login) | **Yes** — ask for a transparent background; alpha is preserved | ChatGPT sign-in | **Not exposed to `codex exec`** on this account (tested `gpt-6-luna` and `gpt-5.6-terra`; the tool list has no image tool). Use the interactive `codex` TUI or the Codex desktop app instead. |
| Fallback CLI script `~/.codex/skills/.system/imagegen/scripts/image_gen.py` | `gpt-image-2` (default) | **No** — `gpt-image-2` does not support `background=transparent` | `OPENAI_API_KEY` | Key not set. `gpt-image-1.5` supports transparency, but the skill requires asking before switching to it. |
| Chroma-key workaround | any | Yes, after keying | Python + Pillow | `scripts/remove_chroma_key.py` in the same skill: generate on a flat `#00FF00` backdrop, then key it out. Edges can fringe on glass/translucent objects. |

Other notes:
- The default model in `~/.codex/config.toml` (`gpt-6.1-sol`) is rejected for ChatGPT accounts. Pass `-m gpt-6-luna` (or fix the config) when running Codex.
- Generated files land in `$CODEX_HOME/generated_images/...`; copy finals into the project.
- Budget: about **5 images**, so none are spent on tests. Everything else on the site (pixel icon pack, halftone terrain, wordmark, project covers, agent simulation) is code-native, so the site does not depend on generated images.

### How to run (interactive, uses the built-in tool)
```bash
cd /Users/deeparsh/Documents/MyProjects/TechNerv-Redesign
codex -m gpt-6-luna
```
Then paste one prompt below and ask Codex to copy the result to the listed path. Verify transparency with:
```bash
python3 -c "from PIL import Image; im=Image.open('site/public/assets/FILE.png'); print(im.mode, im.getpixel((2,2)))"
```
Expected: mode `RGBA` and a corner pixel with alpha `0`.

## The 5-image plan (highest value per generation)

Shared style line for all prompts:
> Premium 3D render, frosted translucent glass with soft internal glow, lagoon teal palette (#0A6E67, #10A396, #6FE3D2) with a small apricot (#FF8E5E) accent and a hint of iris blue (#7C8CFF), soft studio lighting, subtle chromatic refraction, clean and minimal, no text, no logos.

1. **Service icon sheet (8 icons in one image)** → `site/public/assets/icons-glass.png`, 2048×1024, transparent.
   > A 4×2 grid of eight separate 3D glass icons with equal spacing, each centred in its own cell: (1) a browser window, (2) a four-point AI sparkle, (3) a magnifying glass over a rising bar chart, (4) a target with an arrow, (5) a vertical video frame with a play button, (6) a smartphone, (7) three stacked kanban cards, (8) a sound waveform. [style line] Fully transparent background (alpha 0) around every icon, no shadow plane, no backdrop.
   Slice into 8 PNGs; use as hover/hero art on the Services page next to the pixel icons.

2. **Glass logo mark** → `site/public/assets/mark-glass.png`, 1024×1024, transparent.
   > A rounded square glass tile; on its face, five raised glass cubes form a "T" shape (three across the top, two down the centre) and a single apricot cube sits at the bottom right. Isometric three-quarter view. [style line] Fully transparent background.
   Use on About (replacing the pixel grid art) and in the Open Graph image.

3. **Signal ribbon accent** → `site/public/assets/ribbon.png`, 1536×1024, transparent.
   > A single flowing ribbon of frosted glass that twists gently from left to right, with tiny glowing dots travelling along it like data. [style line] Fully transparent background.
   Use behind the CTA headline and on the Contact page.

4. **Open Graph / social share image** → `site/public/og.png`, 1536×1024 (crop to 1200×630), opaque.
   > A light, cool off-white background (#F4F6F5) with a soft halftone dot landscape rolling across the lower half in teal tones. Centered large clean sans-serif text "Tech Nerv" and below it smaller text "Websites, apps and AI tools for businesses". [style line, but text allowed exactly as written]
   Add `<meta property="og:image" content="/og.png">` in `site/index.html`.

5. **Spare** — keep for one retry on whichever of the above comes out weakest.

## Done: glass icon sheet (2026-10-18)
- Source sheet: `assets-gen/icons-sheet.png` (1448×1086, user-generated). Its "transparent" background contained a low-alpha cyan haze (44% of pixels at alpha 1–30).
- Cleaned and sliced by connected object (not a fixed grid, since the rocket overlapped its cell) into `site/public/icons/{web,ai,seo,ads,marketing,mobile,crm,voice,discover,design,build,launch}.{webp,png}`, 512×512, centred with 4% padding.
- Rendered via `src/components/GlassIcon.tsx`. Pixel icons remain only for small functional glyphs (checks, play, arrow).
