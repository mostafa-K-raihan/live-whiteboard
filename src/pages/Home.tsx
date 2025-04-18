import { useEffect, useState } from 'react';
import WhiteboardCanvas from '../components/WhiteboardCanvas';

function Home() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 40, 1200);
      const height = Math.min(window.innerHeight - 150, 800);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Live Whiteboard MVP</h1>
      <WhiteboardCanvas width={dimensions.width} height={dimensions.height} />
    </div>
  );
}

export default Home;
