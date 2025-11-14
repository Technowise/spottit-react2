import { requestExpandedMode } from '@devvit/web/client';

document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('play-button');

  if (playButton) {
    playButton.addEventListener('click', async (event) => {
      try {
        // Request expanded mode to launch the full game
        await requestExpandedMode(event as PointerEvent, 'game');
      } catch (error) {
        console.error('Failed to enter expanded mode:', error);
        // Fallback: could show an error message to the user
      }
    });
  }
});
