/** @jsx Devvit.createElement */
/** @jsxFrag Devvit.Fragment */

import { Devvit, useForm, useAsync } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// Single custom post type that handles both Home and Game views
Devvit.addCustomPostType({
  name: 'SpottitPost',
  render: (context) => {
    const postType = context.postData?.postType as string;
    
    // Render SpottitGame view
    if (postType === 'game') {
      const puzzleImage = context.postData?.puzzleImage as string;
      const puzzleTitle = context.postData?.puzzleTitle as string;
      const gameState = (context.postData?.gameState as string) || 'SpotsMarkingPending';
      
      // Get current user and post author info
      const { data: userInfo } = useAsync(async () => {
        try {
          const [currentUser, post, subreddit] = await Promise.all([
            context.reddit.getCurrentUsername(),
            context.reddit.getPostById(context.postId!),
            context.reddit.getCurrentSubreddit(),
          ]);
          
          const author = await post.getAuthor();
          const moderators = await subreddit.getModerators();
          const modList = await moderators.all();
          const isModerator = modList.some((mod: any) => mod.username === currentUser);
          const isAuthor = author?.username === currentUser;
          
          return {
            currentUser: currentUser || '',
            postAuthor: author?.username || '',
            isAuthor: isAuthor || false,
            isModerator: isModerator || false,
          };
        } catch (error) {
          return {
            currentUser: '',
            postAuthor: '',
            isAuthor: false,
            isModerator: false,
          };
        }
      });

      const handleStartMarking = () => {
        context.ui.showToast('Opening spot marking interface...');
        // TODO: Implement spot marking logic
      };

      // Render based on game state
      if (gameState === 'SpotsMarkingPending') {
        // Show different UI based on user role
        const canMarkSpots = (userInfo as any)?.isAuthor || (userInfo as any)?.isModerator;
        
        return (
          <zstack height="100%" width="100%" alignment="center middle">
            <image
              imageHeight={1024}
              imageWidth={1024}
              height="100%"
              width="100%"
              url={puzzleImage || ''}
              resizeMode="cover"
            />
            <vstack
              height="100%"
              width="100%"
              alignment="center middle"
              backgroundColor="rgba(28, 29, 28, 0.60)"
              gap="medium"
            >
              <text size="xxlarge" weight="bold" color="white">
                {puzzleTitle || 'Spottit Game'}
              </text>
              {canMarkSpots ? (
                <button appearance="primary" size="large" onPress={handleStartMarking}>
                  Start marking spots
                </button>
              ) : (
                <text size="large" color="white">
                  Spots marking pending by OP
                </text>
              )}
            </vstack>
          </zstack>
        );
      }

      // ReadyToPlay and Archived states (existing Start button logic)
      const handleStart = () => {
        context.ui.showToast('Starting game...');
        // Add game start logic here
      };

      return (
        <zstack height="100%" width="100%" alignment="center middle">
          <image
            imageHeight={1024}
            imageWidth={1024}
            height="100%"
            width="100%"
            url={puzzleImage || ''}
            resizeMode="cover"
          />
          <vstack
            height="100%"
            width="100%"
            alignment="center middle"
            backgroundColor="rgba(28, 29, 28, 0.60)"
            gap="medium"
          >
            <text size="xxlarge" weight="bold" color="white">
              {puzzleTitle || 'Spottit Game'}
            </text>
            <button appearance="primary" size="large" onPress={handleStart}>
              Start
            </button>
          </vstack>
        </zstack>
      );
    }
    
    // Render SpottitHome view (default)
    // Fetch available post flairs for the subreddit
    const { data: flairTemplates, loading } = useAsync(async () => {
      try {
        const subreddit = await context.reddit.getCurrentSubreddit();
        const flairs = await subreddit.getPostFlairTemplates();
        return flairs.map((flair) => ({
          label: flair.text || flair.id,
          value: flair.id,
        }));
      } catch (error) {
        return [];
      }
    });

    const hasFlairs = flairTemplates && flairTemplates.length > 0;

    // Create form for creating a Spottit post
    const createPostForm = useForm(
      {
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
            options: flairTemplates || [{ label: 'No flairs available', value: '' }],
            helpText: hasFlairs ? 'Select a flair for your post' : 'No flairs available in this subreddit',
            required: hasFlairs ? true : false,
          },
        ],
        title: 'Create Spottit Post',
        acceptLabel: 'Create',
        cancelLabel: 'Cancel',
      },
      async (values: { title: string; puzzleImage: string; flair?: string[] }) => {
        const { title, puzzleImage, flair } = values;
        const subredditName = context.subredditName;

        if (!subredditName) {
          context.ui.showToast('Error: Subreddit name not found');
          return;
        }

        try {
          // Create a SpottitGame post with the puzzle image
          const postOptions: any = {
            subredditName,
            title: title || 'Spottit Game',
            preview: <text>Loading...</text>,
            postData: {
              postType: 'game',
              puzzleImage: puzzleImage,
              puzzleTitle: title,
              gameState: 'SpotsMarkingPending',
            },
          };

          // Add flair if selected
          if (flair && flair.length > 0 && flair[0]) {
            postOptions.flairId = flair[0];
          }

          const post = await context.reddit.submitPost(postOptions);

          context.ui.showToast(`Spottit game "${title}" created!`);
          context.ui.navigateTo(post);
        } catch (error) {
          context.ui.showToast('Failed to create Spottit game');
        }
      }
    );

    return (
      <vstack height="100%" width="100%" alignment="middle center" gap="medium">
        <text size="xlarge" weight="bold">
          Spottit Home
        </text>
        {loading ? (
          <text>Loading flairs...</text>
        ) : (
          <button appearance="primary" onPress={() => context.ui.showForm(createPostForm)}>
            Create a Spottit Post
          </button>
        )}
      </vstack>
    );
  },
});

// Menu item to create Spottit Home
Devvit.addMenuItem({
  label: 'Create Spottit Home',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const subredditName = context.subredditName;

    if (!subredditName) {
      context.ui.showToast('Error: Subreddit name not found');
      return;
    }

    try {
      // Create a blocks post with SpottitPost custom post type
      const post = await context.reddit.submitPost({
        subredditName,
        title: 'Spottit Home',
        preview: <text>Loading...</text>,
        postData: {
          postType: 'home',
        },
      });

      context.ui.showToast('Spottit Home created!');
      context.ui.navigateTo(post);
    } catch (error) {
      context.ui.showToast('Failed to create Spottit Home');
    }
  },
});

export default Devvit;
