# Spottit Native Splash Screen Guide

## Overview

Spottit now uses **Devvit's native splash screen feature** instead of a custom HTML splash screen. This provides better performance, consistency with Reddit's UI, and easier maintenance.

## What Changed

### Before (Custom HTML Splash)
- Custom `splash.html`, `splash.css`, and `splash.ts` files
- Separate entry point in `devvit.json`
- Manual styling and animations
- Larger bundle size

### After (Native Splash)
- Configured via `splash` parameter in `submitCustomPost()`
- SVG assets for background and icon
- Automatic Reddit integration
- Optimized performance

## Implementation

### Server Configuration (`src/server/index.ts`)

```typescript
const post = await reddit.submitCustomPost({
  subredditName,
  title: title || 'Spottit Game',
  splash: {
    appDisplayName: 'Spottit',
    heading: title || 'Find the Hidden Differences',
    description: 'Test your observation skills in this classic spot-the-difference puzzle game. Can you find all the hidden differences?',
    buttonLabel: '🔍 Play Now',
    appIconUri: 'spottit-icon.svg',
    backgroundUri: 'default-splash.svg',
  },
});
```

### Assets (`assets/`)

1. **default-splash.svg** - Background image featuring:
   - Purple to violet gradient
   - Decorative dot pattern
   - Central magnifying glass icon
   - Sparkle effects
   - Difference marker circles
   - Wave decoration at bottom

2. **spottit-icon.svg** - App icon featuring:
   - Gradient background matching splash
   - White magnifying glass
   - Red difference marker (circle with X)
   - Professional rounded corners

### Devvit Configuration (`devvit.json`)

```json
{
  "post": {
    "dir": "dist/client",
    "entrypoints": {
      "default": {
        "entry": "index.html",
        "inline": true,
        "height": "tall"
      },
      "spotMarking": {
        "entry": "index.html",
        "height": "tall"
      }
    }
  },
  "media": {
    "dir": "assets"
  }
}
```

## Benefits

1. **Better Performance**: Native splash screens load faster and are optimized by Reddit
2. **Consistent UX**: Matches Reddit's design patterns and user expectations
3. **Dynamic Content**: Heading automatically uses the puzzle title from each post
4. **Easier Maintenance**: No need to maintain separate HTML/CSS/JS files
5. **Mobile Optimized**: Automatically responsive across all devices
6. **Smaller Bundle**: Removed custom splash screen code reduces bundle size

## User Experience

When users see a Spottit post in their Reddit feed:

1. **Native splash screen appears** with gradient background and magnifying glass icon
2. **Dynamic heading** shows the specific puzzle title
3. **Engaging description** explains the game concept
4. **Prominent "🔍 Play Now" button** invites interaction
5. **Clicking the button** opens the full game in inline tall mode

## Asset Guidelines

### Background Image (default-splash.svg/png)
- Recommended size: 1200x630px
- Format: SVG (preferred) or PNG
- Max file size: 2MB
- Should be visually appealing and represent the game theme

### App Icon (spottit-icon.svg/png)
- Recommended size: 512x512px
- Format: SVG (preferred) or PNG
- Should be recognizable at small sizes
- Include game branding elements

## Customization

To customize the splash screen for different puzzle types, modify the `splash` object in `submitCustomPost()`:

```typescript
splash: {
  appDisplayName: 'Spottit',
  heading: customTitle,           // Use puzzle-specific title
  description: customDescription, // Customize per puzzle type
  buttonLabel: '🔍 Play Now',    // Can change emoji or text
  appIconUri: 'custom-icon.svg', // Use different icons
  backgroundUri: 'custom-bg.svg', // Use themed backgrounds
}
```

## Testing

To test the native splash screen:

1. Run `npm run dev`
2. Open the playtest URL in your browser
3. Create a new Spottit post via the moderator menu
4. View the post to see the native splash screen
5. Click "🔍 Play Now" to launch the game

## Resources

- [Devvit Splash Screen Documentation](https://developers.reddit.com/docs/capabilities/server/splash-screen)
- [Splash Screen Best Practices](https://developers.reddit.com/docs/capabilities/server/splash-screen#best-practices)
