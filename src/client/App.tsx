import { SpotMarking } from './SpotMarking';
import { SpottitGame } from './SpottitGame';
import { useState, useEffect } from 'react';
import { requestExpandedMode } from '@devvit/web/client';

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<{
    puzzleImage: string;
    puzzleTitle: string;
    gameState: string;
    isAuthor: boolean;
  } | null>(null);
  const [isMarkingSpots, setIsMarkingSpots] = useState(false);

  useEffect(() => {
    // Check localStorage to see if we should show spot marking mode
    const spotMarkingMode = localStorage.getItem('spotMarkingMode');
    if (spotMarkingMode === 'true') {
      setIsMarkingSpots(true);
    }

    // Load game data
    const loadGameData = async () => {
      try {
        const gameResponse = await fetch('/api/game-data');
        if (gameResponse.ok) {
          const data = await gameResponse.json();
          setGameData(data);
        }
      } catch (error) {
        // Failed to load game data
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, []);

  const handleStartMarking = async (event: React.MouseEvent) => {
    try {
      // Set localStorage flag before requesting expanded mode
      localStorage.setItem('spotMarkingMode', 'true');
      // Request expanded mode with spot marking entry point
      await requestExpandedMode(event, 'spotMarking');
    } catch (error) {
      // Fallback to inline mode if expanded mode fails
      setIsMarkingSpots(true);
    }
  };

  const handleCloseMarking = () => {
    // Clear localStorage flag and reload to return to inline view
    localStorage.removeItem('spotMarkingMode');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <img src="/loading.gif" alt="Loading" className="w-24 h-24" />
      </div>
    );
  }

  // Show spot marking if in expanded mode
  if (isMarkingSpots && gameData) {
    return (
      <SpotMarking
        puzzleImage={gameData.puzzleImage}
        onClose={handleCloseMarking}
      />
    );
  }

  return <SpottitGame onStartMarking={handleStartMarking} />;
};
