# Kinetic Typography Experiment

An interactive kinetic typography prototype inspired by retro-pop graphic design, chunky eclectic letterforms, decorative stickers, and fluid metaball shader physics.

## Overview

This prototype explores the intersection of expressive, handcrafted graphic display lettering and liquid physical simulations. Rather than static type, letters behave as soft-body physical entities that respond dynamically to the cursor, stretch and squish with spring elasticity, and organically melt and fuse into neighboring letters using SVG gooey metaball filters.

## Key Features

1. **Eclectic Display Letterforms**:
   - Distinctive vector glyph personalities inspired by retro-pop collages:
     - `F`: Lollipop flower tree with scalloped blossom core
     - `A`: Flared serif cutout arch with inner star accent
     - `Q`: Plump teardrop with diagonal hatching stroke tail
     - `U`: Tubular horseshoe pipe with inner racing stripe
     - `I`: Double-spot peanut capsule
     - `T`: Heavy slab with rounded terminal
     - `O`: Diagonal-slash donut pill
     - `P`: Bulbous cloud counter
     - `R`: Sweeping flared kick leg
     - `M`: Bouncy zigzag accordion peaks
     - `S`: Wavy ribbon snake
     - `E`: Heavy rounded slab shelves
     - `N` / `C`: Chunky cutout geometries
     - Dynamic fallback for any other typed letterform.

2. **Fluid Metaball & Spring Physics**:
   - **Liquid Metaball Mode**: High-viscosity gooey SVG filter that causes nearby letters to dynamically merge and stretch like molten drops.
   - **Jelly Spring Mode**: Elastic squish and stretch oscillations when letters are dragged, nudged, or released.
   - **Magnetic Orbit Mode**: Distance-based cursor attraction and orbital swirl vector forces directly inspired by generative GLSL shader math.
   - **Kinetic Wave Mode**: Continuous sinusoidal undulation rippling through word strings.

3. **Interactive Graphic Stickers**:
   - Draggable, spring-loaded retro stickers:
     - Winking Smiling Star (`> <` eyes and cheerful smile)
     - 8-petal Scalloped Daisy blossom with white paper cutout border
     - 12-point Spiky Starburst
     - 3-tier Multicolored Wavy Ribbon snake
     - Floating Color Palette pill card ("02 PALETAS DE COLORES")
   - Stamp new stickers directly onto the canvas from the Stickers drawer.

4. **Real-Time Controls & Audio Synthesis**:
   - Interactive bottom control dock with tabs for Motion, Layout, Palettes, and Stickers.
   - Procedural Web Audio API sound synthesizer producing tactile boings, squishes, pops, and chimes (with mute toggle).
   - Dynamic canvas backgrounds: Sunburst Rays, Scallop Waves, Halftone Dots, and Clean Paper.
   - 2x Retina PNG snapshot poster export.

## How to Run & Use

1. Navigate to the prototype route in your browser: `http://localhost:3000/prototypes/kinetic-typography`.
2. Type any custom word into the bottom text input (or click quick presets like `FAQUITO`, `PROMISE`, `NICE`, `BOUNCE`, `GROOVY`, `WOBBLE`).
3. Click and drag any letter or sticker to stretch and fling it with inertia.
4. Move your cursor near the letterforms to observe magnetic repulsion and gooey fluid stretching.
5. Click anywhere on the open canvas to trigger a burst fountain of pastel particle stars.
6. Open the **Controls** drawer to adjust gooey viscosity, pulse wobble, bounce elasticity, letter kerning, or switch color palettes.
7. Click **Export Poster** in the top header to save a high-resolution 2x retina PNG snapshot.
