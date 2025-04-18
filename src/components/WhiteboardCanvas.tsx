import React, { useRef, useState } from 'react';
import { Stage, Layer, Line, KonvaEventObject } from 'react-konva';
import Konva from 'konva';

interface WhiteboardCanvasProps {
  width?: number;
  height?: number;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  width = window.innerWidth,
  height = window.innerHeight - 80,
}) => {
  const [lines, setLines] = useState<{ points: number[]; color: string; strokeWidth: number }[]>(
    []
  );
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);

  // Check if canvas is empty
  const isCanvasEmpty = lines.length === 0;

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], color: '#222', strokeWidth: 3 }]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines(prevLines => {
      const lastLine = prevLines[prevLines.length - 1];
      const newLines = prevLines.slice(0, -1);
      return [
        ...newLines,
        {
          ...lastLine,
          points: [...lastLine.points, point.x, point.y],
        },
      ];
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Handle touch events with specific preventDefault to avoid issues
  const handleTouchStart = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    handleMouseDown(e as unknown as KonvaEventObject<MouseEvent>);
  };

  const handleTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    handleMouseMove(e as unknown as KonvaEventObject<MouseEvent>);
  };

  const handleTouchEnd = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    handleMouseUp();
  };

  // Clear the canvas
  const clearCanvas = () => {
    setLines([]);
  };

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-tools p-2">
        <button
          onClick={clearCanvas}
          className={`px-4 py-2 rounded ${
            isCanvasEmpty
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={isCanvasEmpty}
          aria-disabled={isCanvasEmpty}
        >
          Clear Canvas
        </button>
      </div>
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={stageRef}
        style={{ background: '#fff', border: '1px solid #eee' }}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default WhiteboardCanvas;
