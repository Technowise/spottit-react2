/** @jsx Devvit.createElement */
/** @jsxFrag Devvit.Fragment */

import { Devvit, useForm, useAsync } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// Custom post type for Spottit Home
Devvit.addCustomPostType({
  name: 'SpottitHome',
  render: (context) => {
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
        
        // Show success message with the data
        const flairText = flair && flair.length > 0 ? ' with flair' : '';
        const imageText = puzzleImage ? ' and image' : '';
        context.ui.showToast(`Creating "${title}"${flairText}${imageText}...`);
        
        // Form submitted - you can add logic here to create the post
        // puzzleImage will contain the uploaded image URL (i.redd.it URL)
        // flair will contain the selected flair ID array (if any)
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
      // Create a blocks post with SpottitHome custom post type
      const post = await context.reddit.submitPost({
        subredditName,
        title: 'Spottit Home',
        preview: (
          <vstack height="100%" width="100%" alignment="middle center">
            <text size="large">Loading...</text>
          </vstack>
        ),
      });

      context.ui.showToast('Spottit Home created!');
      context.ui.navigateTo(post);
    } catch (error) {
      context.ui.showToast('Failed to create Spottit Home');
    }
  },
});

export default Devvit;
