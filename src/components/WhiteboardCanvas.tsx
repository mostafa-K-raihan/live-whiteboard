import React, { useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const WhiteboardCanvas: React.FC = () => {
  const [lines, setLines] = useState<{ points: number[]; color: string; strokeWidth: number }[]>([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], color: '#222', strokeWidth: 3 }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines((prevLines) => {
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

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight - 80}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
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
  );
};

export default WhiteboardCanvas;