# Aura Mesh Gradient (Grainy Blur Prototype)

An interactive exploration of the **Grainy Blur** aesthetic, combining high-radius Gaussian blur diffusion with a mathematical SVG `feTurbulence` tactile film-grain noise overlay and warm pastel twilight tones.

## Features

- **Dynamic Mesh Orbs**: Floating multi-point radial gradients with subtle non-linear oscillation keyframes.
- **Diffused Gaussian Blur**: Real-time adjustable blur slider (30px – 140px) to demonstrate how hard geometric shapes soften into an ethereal atmospheric aura.
- **Tactile Film-Grain Overlay**: SVG filter with `feTurbulence` and `feColorMatrix` blended via `mix-blend-mode: overlay` to remove digital flat perfection and simulate physical paper/film texture.
- **Interactive Light Cursor**: Cursor-tracking ambient glow orb that perturbs the background in real time.
- **Palette Presets**:
  - **Twilight** (Warm Apricot `#ffaa71`, Lavender `#d8b4f8`, Dusky Rose `#ff9ebb`, Twilight Blue `#a0c4ff`, Amber `#ffe29f`)
  - **Sunset Gold**
  - **Pastel Aura**
  - **Cosmic Glow**

## Implementation Details

- Built with Next.js Client Component (`use client`).
- Styled using CSS Modules (`styles.module.css`).
- Zero external image assets or heavy canvas libraries—rendered natively via modern browser CSS filters and SVG primitives.
