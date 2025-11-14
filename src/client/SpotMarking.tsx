import { useEffect, useRef } from 'react';
import Zoomist from 'zoomist';
import 'zoomist/css';

interface SpotMarkingProps {
  puzzleImage: string;
  onClose: () => void;
}

export function SpotMarking({ puzzleImage, onClose }: SpotMarkingProps) {
  const zoomistRef = useRef<HTMLDivElement>(null);
  const zoomistInstance = useRef<Zoomist | null>(null);

  useEffect(() => {
    if (zoomistRef.current && !zoomistInstance.current) {
      zoomistInstance.current = new Zoomist(zoomistRef.current, {
        maxScale: 4,
        bounds: true,
        slider: {
          el: '.zoomist-slider',
          direction: 'horizontal',
        },
        zoomer: {
          inEl: '.zoom-in-btn',
          outEl: '.zoom-out-btn',
          resetEl: '.zoom-reset-btn',
        },
      });
    }

    return () => {
      if (zoomistInstance.current) {
        zoomistInstance.current.destroy();
        zoomistInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">

      {/* Controls */}
      <div className="bg-gray-800 p-3 flex items-center gap-3 border-b border-gray-700">
        <button className="zoom-in-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-bold">
          +
        </button>
        <button className="zoom-out-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors font-bold">
          -
        </button>
        <button className="zoom-reset-btn bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
          Reset
        </button>
      </div>

      {/* Image container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="zoomist-container h-full" ref={zoomistRef}>
          <div className="zoomist-wrapper">
            <div className="zoomist-image">
              <img src={puzzleImage} alt="Puzzle to mark spots" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <p className="text-white text-center mb-3">
          Click on the image to mark spots. Zoom and pan to find differences.
        </p>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition-colors">
          Save Spots
        </button>
      </div>
    </div>
  );
}
