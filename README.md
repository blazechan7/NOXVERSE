# NOX:VERSE Interactive Logo - Step by Step

This project builds an interactive logo step by step for learning purposes.

## Current Step: Step 1 - Color Selection

The logo is currently displayed with a basic color palette. No animations or interactions yet.

### SVG Structure

The logo is organized with these IDs:
- `#logo-noxverse` - Main wrapper group
- `#logo-ring` - The eclipse ring (the "O")
- `#logo-star` - The star inside the ring
- `#logo-text-nox` - The word "NOX"
- `#logo-text-verse` - The word "VERSE"

### Color Customization

To change colors, edit the `:root` section in `styles.css`:

1. **`--color-main-start/mid/end`** - Main color for text and shapes
2. **`--color-star-center/mid/outer`** - Star center element gradient
3. **`--color-eclipse-inner/outer`** - Eclipse ring gradient

### Color Palette Ideas

- **Cosmic** (current): Soft blues, purples, whites
- **Monochrome**: Grays, whites, blacks
- **Warm**: Oranges, yellows, reds
- **Cool**: Blues, cyans, teals
- **Neon**: Bright, saturated colors

## Next Steps

After deciding on colors:
- Step 2: Add initial entrance animation
- Step 3: Add idle state animations
- Step 4: Add mouse interaction
- Step 5: Add camera tracking (optional)

## Git Workflow

This project uses a 3-branch workflow:
- **`design`** - Color experiments and visual tweaks
- **`develop`** - Feature development (animations, interactions)
- **`main`** - Stable, completed steps

See `GIT_WORKFLOW.md` for detailed instructions on using Git branches.



