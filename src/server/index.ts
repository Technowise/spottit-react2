import express from 'express';
import { InitResponse, IncrementResponse, DecrementResponse } from '../shared/types/api';
import { redis, reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { UiResponse } from '@devvit/web/shared';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const [count, username] = await Promise.all([
        redis.get('count'),
        reddit.getCurrentUsername(),
      ]);

      res.json({
        type: 'init',
        postId: postId,
        count: count ? parseInt(count) : 0,
        username: username ?? 'anonymous',
      });
    } catch (error) {
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
  '/api/increment',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', 1),
      postId,
      type: 'increment',
    });
  }
);

router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
  '/api/decrement',
  async (_req, res): Promise<void> => {
    const { postId } = context;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'postId is required',
      });
      return;
    }

    res.json({
      count: await redis.incrBy('count', -1),
      postId,
      type: 'decrement',
    });
  }
);

router.post('/internal/form/create-game-post', async (req, res): Promise<void> => {
  try {
    const { title, puzzleImage, flair } = req.body;
    const { subredditName } = context;

    if (!subredditName) {
      res.status(400).json({
        status: 'error',
        message: 'subredditName is required',
      });
      return;
    }

    // Get the current user who is creating the post
    const currentUser = await reddit.getCurrentUsername();

    // Create a webview post for the game
    const post = await reddit.submitCustomPost({
      subredditName,
      title: title || 'Spottit Game',
    });

    // Store game data in Redis with creator info
    const gameData = {
      puzzleImage,
      puzzleTitle: title,
      gameState: 'SpotsMarkingPending',
      spots: [],
      createdBy: currentUser || 'unknown',
    };
    
    await redis.set(`game:${post.id}`, JSON.stringify(gameData));

    // Add flair if provided
    if (flair && flair.length > 0) {
      try {
        await reddit.setPostFlair({
          postId: post.id,
          subredditName,
          flairTemplateId: flair[0],
        });
      } catch (error) {
        // Flair setting failed, continue anyway
      }
    }

    const response: UiResponse = {
      showToast: `Spottit game "${title}" created!`,
      navigateTo: `https://reddit.com/r/${subredditName}/comments/${post.id}`,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create game post',
    });
  }
});

router.post('/api/create-game-post', async (req, res): Promise<void> => {
  try {
    const { title, puzzleImage, flair } = req.body;
    const { subredditName } = context;

    if (!subredditName) {
      res.status(400).json({
        status: 'error',
        message: 'subredditName is required',
      });
      return;
    }

    // Create a webview post for the game
    const postOptions: any = {
      subredditName,
      title: title || 'Spottit Game',
      splash: {
        appDisplayName: 'Spottit',
        buttonLabel: 'Start marking spots',
        description: 'Mark the spots on this puzzle',
        heading: title || 'Spottit Game',
        appIconUri: 'default-icon.png',
      },
      postData: {
        puzzleImage: puzzleImage,
        puzzleTitle: title,
        gameState: 'SpotsMarkingPending',
      },
    };

    // Add flair if provided
    if (flair) {
      postOptions.flairId = flair;
    }

    const post = await reddit.submitCustomPost(postOptions);

    res.json({
      success: true,
      postId: post.id,
      postUrl: `https://reddit.com/r/${subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create game post',
    });
  }
});

router.get('/api/game-data', async (_req, res): Promise<void> => {
  try {
    const { postId, subredditName } = context;
    
    if (!postId) {
      res.status(400).json({ error: 'postId is required' });
      return;
    }

    // Get game data from Redis
    const gameData = await redis.get(`game:${postId}`);
    
    if (gameData) {
      const data = JSON.parse(gameData);
      
      // Get current user and check if they're a moderator or the creator
      const currentUser = await reddit.getCurrentUsername();
      
      // Check if user is a moderator
      let isModerator = false;
      if (subredditName && currentUser) {
        try {
          const subreddit = await reddit.getCurrentSubreddit();
          const moderators = subreddit.getModerators();
          const modList = await moderators.all();
          isModerator = modList.some((mod) => mod.username === currentUser);
        } catch (error) {
          // Failed to check moderator status
        }
      }
      
      // Check if user created this game (stored in Redis)
      const isCreator = data.createdBy === currentUser;
      
      // User can mark spots if they're the creator or a moderator
      const isAuthor = isCreator || isModerator;
      
      res.json({
        ...data,
        isAuthor,
        currentUser: currentUser || 'anonymous',
      });
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get game data' });
  }
});



router.post('/internal/menu/create-game', async (_req, res): Promise<void> => {
  try {
    const { subredditName } = context;
    
    if (!subredditName) {
      res.json({
        showToast: 'Error: Subreddit name not found',
      });
      return;
    }

    // Get flair templates
    const subreddit = await reddit.getCurrentSubreddit();
    const flairs = await subreddit.getPostFlairTemplates();
    const flairOptions = flairs.map((flair) => ({
      label: flair.text || flair.id,
      value: flair.id,
    }));

    res.json({
      showForm: {
        name: 'createGamePost',
        form: {
          fields: [
            {
              type: 'string',
              name: 'title',
              label: 'Post title',
              required: true,
              helpText: 'Enter the title for your Spottit puzzle',
            },
            {
              type: 'image',
              name: 'puzzleImage',
              label: 'Puzzle Image',
              required: true,
              helpText: 'Upload a JPG, PNG, or WEBP image',
            },
            {
              type: 'select',
              name: 'flair',
              label: 'Post flair',
              options: flairOptions.length > 0 ? flairOptions : [{ label: 'No flairs available', value: '' }],
              helpText: flairOptions.length > 0 ? 'Select a flair for your post' : 'No flairs available in this subreddit',
              required: false,
            },
          ],
          title: 'Create Spottit Game',
          acceptLabel: 'Create',
          cancelLabel: 'Cancel',
        },
      },
    });
  } catch (error) {
    res.json({
      showToast: 'Failed to load form',
    });
  }
});

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    res.json({
      status: 'success',
      message: `App installed in subreddit ${context.subredditName}`,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to process app install',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', () => {
  // Server error occurred
});
server.listen(port);
