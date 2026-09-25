# How to Restore Kinetic Typography Working Version (v1)

This backup captures the fully working version of the Kinetic Typography prototype with:
- Centered default text: "TYPE IS ALIVE"
- Real-time custom text input with stacked/single/wave/orbit layouts
- SVG gooey metaball fusion, soft-body spring physics, cursor magnetism
- Draggable stickers, interactive Web Audio sounds, and poster export

## Method 1: Git Restore (Fastest)

To restore via Git:
```bash
git checkout kinetic-typography-working-v1 -- app/prototypes/kinetic-typography app/page.tsx
```
Or switch directly to the backup branch:
```bash
git checkout backup/kinetic-typography-working-v1
```

## Method 2: File Copy Restore

If Git changes are uncommitted or you want to manually copy the files back:
```bash
cp -r .backups/kinetic-typography-working-v1/kinetic-typography/* app/prototypes/kinetic-typography/
cp .backups/kinetic-typography-working-v1/page.homepage.tsx app/page.tsx
```
