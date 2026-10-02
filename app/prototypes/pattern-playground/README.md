# Pattern Playground

An interactive visual pattern experiment built with **PixiJS v8** and procedural 2D vector graphics.

## Concept & Visual Direction

- **Playful Geometric Aesthetic:** Fresh, graphic, and modernist Swiss/Bauhaus-inspired design.
- **Color System:** Vibrant mint green (`#10D597` default), deep forest mint (`#0B9E70`), and light mint tint (`#A9F3D8`) paired with crisp dark charcoal gray (`#22262B` / `#3E4651`) on an off-white paper canvas (`#FAF9F5`).
- **Abstract Vector Shapes:** Procedurally generated without external image assets:
  - **Capsules:** Rounded pills with full corner radii
  - **Circles & Rings:** Solid disks and hollow stroked circles
  - **Rounded Rectangles:** Crisp squares with softened fillets
  - **Organic Blobs:** Smooth asymmetrical pebbles drawn using cubic bezier curves
  - **Rounded Crosses:** Intersecting rounded graphic bars

## Real-Time Customization Controls

The prototype includes a floating controls drawer allowing visitors to modify the pattern live:

1. **Color Picker & Quick Swatches:** Change the main theme color in real time with GPU-accelerated harmonic tint derivation (`#10D597` Mint default, Electric Cyan, Lime Zing, Coral Orange, Lavender, Sunset Rose).
2. **Shape Size Slider (`0.5x` – `2.0x`):** Dynamically scales geometric elements with spring-damper easing.
3. **Spacing Slider (`45px` – `115px`):** Expands or contracts the grid distance smoothly from the center.
4. **Density Slider (`40` – `240` nodes):** Seamlessly adds or prunes PixiJS v8 `Graphics` nodes on the fly with no canvas reload or flicker.
5. **Interaction Strength Slider (`0.2x` – `2.5x`):** Modulates cursor repulsion force, ripple wave impulse, and click scatter explosion power.
6. **Reset Button:** Restores all sliders and color to default values in a single click.

## Existing Interactions & Controls

1. **Layout Presets:**
   - **Staggered:** Alternating row offsets create an organic textile-like weave.
   - **Grid:** Strict rectangular alignment.
   - **Orbit:** Concentric radial rings expanding from the center.
2. **Cursor Proximity Repulsion:** Shapes gently push away from the cursor with non-linear spring physics.
3. **Neighbor Ripple Waves:** Cursor movements generate expanding wave fronts that propagate smoothly through neighboring shapes.
4. **Velocity-Sensitive Disturbance (Dynamic Speed toggle):** Faster mouse sweeps expand the disturbance radius and impart higher kinetic momentum.
5. **Spring-Damper Return:** When the cursor rests or leaves the canvas, shapes smoothly decelerate and oscillate back to their home slots without jitter.
6. **Click to Scatter:** Clicking triggers an omnidirectional shockwave bursting shapes outwards with randomized angular velocity, after which they slowly reorganize back to the original pattern.

## Technical Architecture

- **Engine:** PixiJS v8 (`pixi.js`) utilizing WebGL/WebGPU with Canvas fallback.
- **Rendering Performance:** Shapes are tessellated as `Graphics` nodes on mount. Live color changes update GPU `tint` properties instantly. Physics, springs, and ripples run inside `app.ticker` at 60 FPS without GC spikes or re-tessellation.
- **Dynamic Density:** Elements are added/removed via `Container.addChild` / `Container.removeChild` + `Graphics.destroy()`, keeping the Pixi `Application` instance running continuously.
- **Cleanup:** Full teardown on unmount with `app.destroy({ removeView: true }, { children: true })` to prevent WebGL context leaks.
