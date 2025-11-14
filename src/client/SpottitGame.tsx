import { useState, useEffect } from 'react';

type GameState = 'SpotsMarkingPending' | 'ReadyToPlay' | 'Archived';

type GameData = {
  puzzleImage: string;
  puzzleTitle: string;
  gameState: GameState;
  spots: Array<{ x: number; y: number }>;
  isAuthor: boolean;
  currentUser: string;
};

type SpottitGameProps = {
  onStartMarking: (event: React.MouseEvent) => void;
};

export const SpottitGame = ({ onStartMarking }: SpottitGameProps) => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch('/api/game-data');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to load game data`);
        }
        const data = await response.json();
        setGameData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <img src="/loading.gif" alt="Loading" className="w-24 h-24" />
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">{error || 'Game not found'}</div>
      </div>
    );
  }

  const { puzzleImage, puzzleTitle, gameState, isAuthor } = gameData;
  
  // Debug: Show data if image is missing
  if (!puzzleImage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-white text-xl mb-4">Puzzle image not found</div>
        <div className="text-white text-sm">Debug info:</div>
        <pre className="text-white text-xs mt-2 bg-gray-800 p-4 rounded overflow-auto max-w-full">
          {JSON.stringify(gameData, null, 2)}
        </pre>
      </div>
    );
  }

  // SpotsMarkingPending state
  if (gameState === 'SpotsMarkingPending') {
    return (
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${puzzleImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-bold text-white text-center px-4">{puzzleTitle}</h1>
          {isAuthor ? (
            <button
              onClick={(e) => onStartMarking(e)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              Start marking spots
            </button>
          ) : (
            <p className="text-xl text-white">Spots marking pending by OP</p>
          )}
        </div>
      </div>
    );
  }

  // ReadyToPlay state
  if (gameState === 'ReadyToPlay') {
    return (
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${puzzleImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-bold text-white text-center px-4">{puzzleTitle}</h1>
          <button
            onClick={() => {
              // TODO: Start game logic
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // Archived state
  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${puzzleImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold text-white text-center px-4">{puzzleTitle}</h1>
        <p className="text-xl text-white">This game has been archived</p>
      </div>
    </div>
  );
};
