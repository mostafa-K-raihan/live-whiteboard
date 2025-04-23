import { useEffect, useState } from 'react';
import WhiteboardCanvas from '../components/WhiteboardCanvas';

function Home() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      // Make sure we have enough space for both the canvas and tools panel
      const width = Math.min(window.innerWidth - 40, 1400);
      const height = Math.min(window.innerHeight - 100, 800);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-4">
        <h1 className="text-xl font-medium text-gray-800">Live Whiteboard</h1>
        <p className="text-sm text-gray-500">Create and share your drawings in real-time</p>
      </header>

      <div className="bg-white shadow-md rounded">
        <WhiteboardCanvas width={dimensions.width} height={dimensions.height} />
      </div>
    </div>
  );
}

export default Home;
