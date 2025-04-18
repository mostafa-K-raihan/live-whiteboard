import WhiteboardCanvas from '../components/WhiteboardCanvas';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Live Whiteboard MVP</h1>
      <WhiteboardCanvas />
    </div>
  );
}

export default Home;