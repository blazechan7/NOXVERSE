# NOX:VERSE Interactive Logo

An interactive cosmic-themed logo with GSAP animations and user interactions.

## Features

- **Logo Entrance Animation** - Stellar emergence animation on page load
- **Orbit Animation** - Click the star to trigger a cosmic particle orbit
- **Letter Interactions** - Click "NOX" or "VERSE" for animated effects
- **Starfield Background** - Animated twinkling stars
- **Scroll Animations** - ScrollTrigger available for scroll-based effects

## Project Structure

### JavaScript Modules (`js/`)
- `logo-entrance.js` - Page load entrance animation
- `orbit-animation.js` - Star click orbit effect
- `letter-n.js` - NOX text animation
- `letter-x.js` - VERSE text animation
- `starfield.js` - Background starfield animation
- `instructions.js` - Help panel functionality
- `main.js` - Main initialization
- `config.js` - Shared configuration
- `utils.js` - Utility functions

### SVG Structure

The logo is organized with these IDs:
- `#logo-noxverse` - Main wrapper group
- `#logo-ring` - The eclipse ring (the "O")
- `#logo-star` - The star inside the ring (clickable)
- `#logo-text-nox` - The word "NOX" (clickable)
- `#logo-text-verse` - The word "VERSE" (clickable)
- `#logo-text-noxverse-bottom` - Bottom text

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

## Technologies

- **GSAP 3.12.5** - Animation library
- **ScrollTrigger** - Scroll-based animations (available)
- **Vanilla JavaScript** - No frameworks
- **SVG** - Vector graphics

## Documentation

- `ORBIT_ANIMATION_GUIDE.md` - Detailed guide for the orbit animation feature
- `GIT_WORKFLOW.md` - Git branching workflow instructions

## Git Workflow

This project uses a 3-branch workflow:
- **`design`** - Color experiments and visual tweaks
- **`develop`** - Feature development (animations, interactions)
- **`main`** - Stable, completed steps

See `GIT_WORKFLOW.md` for detailed instructions on using Git branches.



