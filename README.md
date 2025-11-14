## Spottit - Find the Difference Game for Reddit

Spottit is an interactive "spot the difference" puzzle game built natively for Reddit using Devvit. Creators upload custom puzzle images directly through Reddit's moderator menu, and the game creates beautiful posts with custom splash screens. Players can explore puzzles with professional zoom and pan controls to find hidden differences, all within Reddit posts.

### What Makes Spottit Unique

- **Native Reddit Integration**: Plays directly in Reddit posts without leaving the platform - no external websites or apps needed
- **Beautiful Custom Splash Screens**: Each game post features a custom splash screen with the puzzle title, description, and a "🔍 Play Now" button that appears in the Reddit feed
- **Expanded Mode Support**: Uses Devvit's requestExpandedMode API with localStorage persistence to seamlessly switch between inline game view and full-screen spot marking interface
- **Professional Zoom Controls**: Powered by Zoomist library with +/- buttons, reset functionality, and smooth pan interactions for precise spot marking (up to 4x magnification)
- **Creator-Driven Content**: Moderators upload puzzle images through an intuitive form with title, image upload, and optional flair selection
- **Smart Permission System**: Post creators and subreddit moderators can mark spots, while other users see appropriate status messages based on game state
- **Progressive Game States**: Games flow through three distinct phases - Spots Marking Pending → Ready to Play → Archived
- **Community Gameplay**: Leverages Reddit's social features for sharing puzzles, competing with friends, and building puzzle communities within subreddits
- **Mobile-First Design**: Fully responsive interface optimized for both desktop and mobile Reddit users with viewport constraints preventing accidental zooming
- **Redis-Powered Persistence**: All game data, puzzle images, spot coordinates, and creator information stored reliably in Redis

### Technology Stack

- **[Devvit](https://developers.reddit.com/)**: Reddit's developer platform for building native Reddit apps with custom post types and splash screens
- **[React](https://react.dev/)**: UI framework for the game interface with hooks for state management
- **[Vite](https://vite.dev/)**: Build tool for both client and server bundles with hot module replacement
- **[Express](https://expressjs.com/)**: Serverless Node.js backend for API endpoints and Reddit integration
- **[Zoomist](https://zoomist.samzeng.dev/)**: Professional image zoom and pan library (v2.2.0) for the spot marking interface
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for responsive styling
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development across client, server, and shared code
- **[Redis](https://redis.io/)**: Data persistence via Devvit for game state, puzzle images, spot coordinates, and creator tracking

## How to Play Spottit

### For Creators (Moderators)

1. **Open the Moderator Menu**: In your subreddit, click the moderator menu (three dots) and select "Create Spottit Game"

2. **Fill Out the Creation Form**:
   - **Post title**: Enter a descriptive title for your puzzle (e.g., "Find 5 Differences in This Beach Scene")
   - **Puzzle Image**: Upload your puzzle image (JPG, PNG, or WEBP format)
   - **Post flair** (optional): Select a flair to categorize your puzzle post

3. **Create the Post**: Click "Create" to generate the game post
   - A beautiful custom splash screen is automatically created with your puzzle title
   - The splash screen shows: "Spottit" as the app name, your puzzle title as the heading, an engaging description, and a "🔍 Play Now" button
   - The post appears in your subreddit feed with the custom splash screen
   - Game state is automatically set to "Spots Marking Pending"
   - Your username is stored as the creator in Redis

4. **View Your Created Post**: 
   - Click the post to open it
   - You'll see your puzzle image as a full-screen background with a semi-transparent dark overlay (60% opacity)
   - Your puzzle title appears centered in large white text
   - An orange "Start marking spots" button appears in the center (only visible to you as the creator and other moderators)

5. **Enter Spot Marking Mode**: 
   - Click the orange "Start marking spots" button
   - This triggers Devvit's requestExpandedMode API with the 'spotMarking' entry point
   - A localStorage flag ('spotMarkingMode': 'true') is set to persist the mode
   - The full-screen spot marking interface loads
   
6. **Use the Spot Marking Interface**:
   - **Top Control Bar** (dark gray background):
     - **+ button** (blue): Zoom in incrementally on the image (up to 4x magnification)
     - **- button** (blue): Zoom out incrementally
     - **Reset button** (gray): Return to original size and center position
   - **Main Image Area** (dark gray background):
     - Your puzzle image is displayed in a zoomable/pannable container powered by Zoomist
     - Click and drag to pan around when zoomed in
     - Smooth zoom and pan interactions with bounds enforcement
     - Click on the image to place spot markers (coming soon)
   - **Bottom Footer Bar** (dark gray background):
     - Instructions: "Click on the image to mark spots. Zoom and pan to find differences."
     - **Save Spots button** (green): Saves your marked spots and transitions game to "Ready to Play" (coming soon)
   
7. **Exit Spot Marking Mode**: 
   - Reload the page or navigate away
   - The localStorage flag is cleared via the onClose handler
   - You return to the inline game view

### For Players

1. **Find a Spottit Post**: Browse your subreddit for Spottit game posts
   - Look for posts with the custom Spottit splash screen in the feed
   - Click the "🔍 Play Now" button on the splash screen to open the post

2. **Check the Game Status**: 
   - **Spots Marking Pending**: You'll see the puzzle image as a full-screen background with a dark overlay (60% opacity), the puzzle title centered in white text, and the message "Spots marking pending by OP" - the creator is still marking the hidden spots
   - **Ready to Play**: You'll see the puzzle image as a full-screen background with a dark overlay (60% opacity), the puzzle title centered in white text, and an orange "Start" button - the game is ready to play
   - **Archived**: You'll see the puzzle image as a full-screen background with a lighter overlay (60% opacity), the puzzle title centered in white text, and the message "This game has been archived" - the game has ended

3. **Start Playing** (Ready to Play state):
   - Click the orange "Start" button to begin the game
   - Gameplay features are currently in development

4. **Gameplay Features** (Coming Soon):
   - Explore the puzzle image to find hidden differences
   - Click on areas where you think spots are located
   - Zoom and pan controls for detailed examination
   - Visual feedback when you find a spot
   - Progress tracking showing how many spots you've found
   - Timer to track how long it takes you to complete the puzzle
   - Leaderboard integration with Reddit usernames

### Game States Explained

**Spots Marking Pending**: The creator is still marking the hidden spots on the puzzle. The puzzle image displays as a full-screen background with a 60% opacity dark overlay. The puzzle title appears centered in large white text. Only the post creator and subreddit moderators see the orange "Start marking spots" button. All other users see the message "Spots marking pending by OP" in white text.

**Ready to Play**: All spots have been marked and the game is live for players. The puzzle image displays as a full-screen background with a 60% opacity dark overlay. The puzzle title appears centered in large white text. All users see an orange "Start" button to begin finding the hidden spots.

**Archived**: The game has ended and is in view-only mode. The puzzle image displays as a full-screen background with a 60% opacity overlay (no dark background color applied). The puzzle title appears centered in large white text. All users see the message "This game has been archived" in white text.

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
- **Custom Splash Screens**: Each game post features a beautiful custom splash screen with the puzzle title, engaging description ("Test your observation skills in this classic spot-the-difference puzzle game"), and a "🔍 Play Now" button that appears in the Reddit feed
- **Expanded Mode Integration**: Uses Devvit's requestExpandedMode API with localStorage persistence to seamlessly switch between inline game view and full-screen spot marking interface
- **Professional Zoom Controls**: Powered by Zoomist library (v2.2.0) with +/- buttons, reset functionality, and smooth pan interactions for precise spot marking (up to 4x magnification with bounds enforcement)
- **Three Game States**: Games progress through distinct phases - Spots Marking Pending → Ready to Play → Archived
- **Smart Permission System**: Server-side logic checks if the current user is the post creator (stored in Redis) or a subreddit moderator, then sets the `isAuthor` flag to control access to spot marking
- **Persistent Mode Switching**: localStorage flag ('spotMarkingMode': 'true') maintains spot marking mode across page reloads until explicitly cleared
- **Full-Screen Spot Marking**: Dedicated interface with fixed positioning, dark gray background (#1F2937), and professional control bars for distraction-free puzzle creation

### Technical Implementation
- **Reddit API Integration**: 
  - Automatic user authentication via `reddit.getCurrentUsername()`
  - Custom post creation with `reddit.submitCustomPost()` including splash screen configuration
  - Post flair support via `reddit.setPostFlair()`
  - Moderator detection by fetching subreddit moderators and comparing usernames
  - Creator tracking by storing username in Redis game data
- **Redis Data Persistence**: 
  - Game data stored with key pattern `game:{postId}`
  - Stored fields: puzzleImage, puzzleTitle, gameState, spots (array), createdBy (username)
  - JSON serialization for complex data structures
- **Expanded Mode API**: 
  - Uses `requestExpandedMode(event, 'spotMarking')` to trigger full-screen mode
  - localStorage flag set before requesting expanded mode
  - Fallback to inline mode if expanded mode request fails
- **API Endpoints**:
  - `GET /api/game-data`: Fetches game data from Redis, checks permissions, returns game state with isAuthor flag
  - `POST /internal/menu/create-game`: Displays moderator menu form with title, image upload, and flair selection
  - `POST /internal/form/create-game-post`: Handles form submission, creates custom post with splash screen, stores data in Redis
- **Loading States**: Animated loading.gif (24x24 size) displayed during initial data fetching from `/api/game-data` endpoint
- **Error Handling**: 
  - Comprehensive error messages for missing postId, failed API calls, and missing game data
  - Debug view showing full game data JSON when puzzle image is missing
  - Graceful fallbacks with user-friendly error messages
- **Responsive Design**: 
  - Mobile-first CSS with viewport meta tag: `maximum-scale=1.0, user-scalable=no`
  - Full-height layouts using `min-h-screen` and `h-full` classes
  - Background images with `bg-cover bg-center bg-no-repeat` for proper scaling
- **React Architecture**: 
  - `App.tsx`: Main component managing mode detection via localStorage, game data fetching, and routing between SpottitGame and SpotMarking
  - `SpottitGame.tsx`: Displays game states with conditional rendering based on gameState and isAuthor flags
  - `SpotMarking.tsx`: Full-screen interface with Zoomist integration, zoom controls, and save functionality
  - `main.tsx`: Entry point with React StrictMode and root rendering
- **Zoomist Configuration**: 
  - maxScale: 4 (up to 4x zoom)
  - bounds: true (prevents panning outside image boundaries)
  - Custom control elements: `.zoom-in-btn`, `.zoom-out-btn`, `.zoom-reset-btn`
  - Proper cleanup with destroy() in useEffect return function

## Cursor Integration

This project includes pre-configured Cursor IDE support. [Download Cursor](https://www.cursor.com/downloads) and enable the `devvit-mcp` when prompted for enhanced development experience.
