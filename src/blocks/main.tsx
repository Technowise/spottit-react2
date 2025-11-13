/** @jsx Devvit.createElement */
/** @jsxFrag Devvit.Fragment */

import { Devvit, useForm } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// Custom post type for Spottit Home
Devvit.addCustomPostType({
  name: 'SpottitHome',
  render: (context) => {
    // Create form for creating a Spottit post
    const createPostForm = useForm(
      {
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Post title',
            required: true,
          },
        ],
        title: 'Create Spottit Post',
        acceptLabel: 'Create',
        cancelLabel: 'Cancel',
      },
      async (values: { title: string }) => {
        const { title } = values;
        context.ui.showToast(`Post "${title}" will be created`);
        // Form submitted - you can add logic here to create the post
      }
    );

    return (
      <vstack height="100%" width="100%" alignment="middle center" gap="medium">
        <text size="xlarge" weight="bold">
          Spottit Home
        </text>
        <button appearance="primary" onPress={() => context.ui.showForm(createPostForm)}>
          Create a Spottit Post
        </button>
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
