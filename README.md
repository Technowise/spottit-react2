## Spottit - Find the Difference Game for Reddit

Spottit is an interactive "spot the difference" puzzle game built natively for Reddit using Devvit. Moderators and creators upload custom puzzle images and mark hidden spots using an advanced spot-marking interface with professional zoom and pan controls powered by the Zoomist library. The game uses localStorage-based mode switching to transition between inline game view and full-screen spot marking interface, running entirely within Reddit posts.

### What Makes Spottit Unique

- **Native Reddit Integration**: Plays directly in Reddit posts without leaving the platform - no external websites or apps needed
- **Expanded Mode Integration**: Uses Devvit's requestExpandedMode API with localStorage persistence to seamlessly switch between inline game view and full-screen spot marking interface
- **Advanced Image Interaction**: Professional zoom and pan controls powered by Zoomist library with +/- buttons and reset functionality for precise spot marking (up to 4x magnification)
- **Creator-Driven Content**: Post authors and moderators upload puzzle images and mark hidden spots using an intuitive full-screen interface with real-time zoom controls
- **Role-Based Access**: Intelligent permission system - post creators and subreddit moderators can mark spots, while other users see status messages based on game state
- **Progressive Game States**: Games transition through three distinct states - Spots Marking Pending → Ready to Play → Archived
- **Community Gameplay**: Leverages Reddit's social features for sharing puzzles, competing with friends, and building puzzle communities within subreddits
- **Mobile-First Design**: Fully responsive interface optimized for both desktop and mobile Reddit users with viewport constraints (no user scaling)
- **Seamless Workflow**: From creation to spot marking to gameplay, everything happens within a single Reddit post interface

### Technology Stack

- [Devvit](https://developers.reddit.com/): Reddit's developer platform for building native Reddit apps
- [React](https://react.dev/): UI framework for the game interface
- [Vite](https://vite.dev/): Build tool for client and server bundles
- [Express](https://expressjs.com/): Backend API server for game logic
- [Zoomist](https://zoomist.samzeng.dev/): Image zoom and pan library for spot marking interface
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for styling
- [TypeScript](https://www.typescriptlang.org/): Type-safe development across client and server
- [Redis](https://redis.io/): Data persistence via Devvit for game state and spot data

## How to Play Spottit

### For Creators (Moderators & Post Authors)

1. **Access the Create Menu**: In your subreddit, open the moderator menu and select "Create Spottit Game"

2. **Fill Out the Form**:
   - Enter a descriptive title for your puzzle (e.g., "Find 5 Differences in This Beach Scene")
   - Upload your puzzle image (JPG, PNG, or WEBP format)
   - Optionally select a post flair to categorize your puzzle

3. **Submit**: Click "Create" to generate the game post - the post will be created in "Spots Marking Pending" state

4. **Mark the Spots**: 
   - After creation, you'll see your puzzle image with a semi-transparent dark overlay (60% opacity)
   - An orange "Start marking spots" button appears in the center (visible to post author and moderators only)
   - Click it to request expanded mode and trigger the spot marking interface
   
5. **Use the Spot Marking Interface** (Full-Screen Mode):
   - The interface opens in expanded mode via Devvit's requestExpandedMode API
   - A localStorage flag ('spotMarkingMode') persists the mode state across reloads
   - **Zoom Controls Bar**: Professional control panel with dark gray theme at the top
     - **+ button**: Zoom in incrementally (blue button, up to 4x magnification)
     - **- button**: Zoom out incrementally (blue button)
     - **Reset button**: Return to original size and position (gray button)
   - **Image Area**: Main workspace with dark gray background
     - Click and drag to pan around the image when zoomed in
     - Smooth zoom and pan interactions powered by Zoomist library
     - Click anywhere on the image to place spot markers (feature in development)
   - **Footer Bar**: Bottom control panel with dark gray theme
     - Instruction text: "Click on the image to mark spots. Zoom and pan to find differences."
     - Green "Save Spots" button: Saves your marked spots and transitions game to "Ready to Play" (feature in development)
   
6. **Finish Marking**: 
   - Click "Save Spots" when you've marked all differences (feature in development)
   - Reload the page to return to inline game view
   - The game will automatically transition to "Ready to Play" state once spots are saved (feature in development)

### For Players

1. **Find a Spottit Post**: Browse your subreddit for Spottit game posts (look for posts with puzzle images)

2. **Check Game Status**: 
   - **Spots Marking Pending**: You'll see the puzzle image with a dark overlay and text "Spots marking pending by OP" - wait for the creator to finish marking spots
   - **Ready to Play**: You'll see the puzzle image with a dark overlay and an orange "Start" button - the game is ready to play
   - **Archived**: You'll see "This game has been archived" - the game has ended

3. **Launch the Game**: Click the orange "Start" button to begin playing (gameplay features in development)

4. **Gameplay** (Coming Soon):
   - Explore the puzzle image to find hidden spots
   - Click on areas where you think differences are located
   - Zoom and pan controls for detailed examination
   - Track your progress as you find spots

### Game States Explained

- **Spots Marking Pending**: The post author/moderator is still marking the hidden spots. Only creators and moderators see the orange "Start marking spots" button. Other users see "Spots marking pending by OP" message. The puzzle image is displayed as a full-screen background with a semi-transparent dark overlay (60% opacity) and the game title centered on screen.

- **Ready to Play**: All spots have been marked and the game is live. Players see an orange "Start" button to begin finding spots. The puzzle image is displayed as a full-screen background with a semi-transparent dark overlay (60% opacity) and the game title centered on screen.

- **Archived**: The game has ended and is in view-only mode. Shows "This game has been archived" message with the puzzle image displayed as a full-screen background with a semi-transparent dark overlay (60% opacity) and the game title centered on screen.

## Development Setup

> Make sure you have Node 22 or higher installed before running!

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run login` to authenticate with Reddit
4. Run `npm run dev` to start development mode

## Development Commands

- `npm run dev`: Starts development mode with live testing on Reddit (creates a test subreddit automatically)
- `npm run build`: Builds both client and server bundles for production
- `npm run deploy`: Uploads a new version to Reddit
- `npm run launch`: Publishes the app for Reddit review (required for subreddits with 200+ members)
- `npm run login`: Authenticates your CLI with Reddit
- `npm run check`: Runs type checking, linting, and code formatting

## Project Structure

```
src/
├── client/          # React frontend
│   ├── App.tsx              # Main app component with localStorage-based mode detection
│   ├── SpottitGame.tsx      # Game interface with state management (3 game states)
│   ├── SpotMarking.tsx      # Spot marking interface with Zoomist integration
│   ├── main.tsx             # React entry point with StrictMode
│   ├── index.html           # HTML template with viewport configuration (no user scaling)
│   ├── index.css            # Tailwind + custom styles for spot marking UI
│   └── hooks/
│       └── useCounter.ts    # Counter hook (legacy, not used in current game)
├── server/          # Express backend
│   └── index.ts             # API endpoints, Reddit integration, and game state management
└── shared/          # Shared TypeScript types
    └── types/
        └── api.ts           # API response types
```

## Key Features

### Core Functionality
- **Expanded Mode Integration**: Uses Devvit's requestExpandedMode API with localStorage persistence to seamlessly switch between inline game view and full-screen spot marking interface
- **Zoomist Integration**: Professional zoom and pan controls with +/- buttons and reset functionality for precise spot marking (up to 4x magnification)
- **State Management**: Games progress through three distinct states - Spots Marking Pending → Ready to Play → Archived
- **Role-Based Permissions**: Post authors and subreddit moderators can mark spots, other users see status messages based on game state
- **Persistent Mode Switching**: localStorage flag ('spotMarkingMode') maintains spot marking mode across page reloads
- **Full-Screen Experience**: Spot marking interface uses full viewport with fixed positioning and dark gray background for distraction-free puzzle creation

### Technical Implementation
- **Reddit API Integration**: Automatic user authentication, custom post creation, flair support, moderator detection, and creator tracking
- **Redis Persistence**: Game state, puzzle images, spot coordinates, and creator username stored in Redis with keys like `game:{postId}`
- **Expanded Mode API**: Uses requestExpandedMode with 'spotMarking' entry point and localStorage for mode persistence
- **Permission System**: Server checks if current user is post creator or moderator before setting `isAuthor` flag in game data response
- **Loading States**: Animated loading.gif displayed during initial data fetching from `/api/game-data` endpoint
- **Error Handling**: Comprehensive error messages, debug views for missing puzzle images, and graceful fallbacks for failed API calls
- **Responsive Design**: Mobile-first CSS with viewport constraints (no user scaling) optimized for both desktop and mobile Reddit users
- **React Architecture**: Component-based structure with App.tsx for mode management, SpottitGame.tsx for game states, and SpotMarking.tsx for spot marking interface
- **Zoomist Library**: Third-party zoom/pan library (v2.2.0) with configuration for max 4x scale, bounds enforcement, and custom control elements (zoom in/out buttons and reset button)

## Cursor Integration

This project includes pre-configured Cursor IDE support. [Download Cursor](https://www.cursor.com/downloads) and enable the `devvit-mcp` when prompted for enhanced development experience.
