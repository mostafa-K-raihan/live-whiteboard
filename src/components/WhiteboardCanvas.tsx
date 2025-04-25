import React, { useRef, useState, useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import { useDrawingStore } from '../store/useDrawingStore';
import ToolsPanel from './ToolsPanel';

interface WhiteboardCanvasProps {
  width?: number;
  height?: number;
}

// Define the line type with proper composite operation
type LineType = {
  points: number[];
  color: string;
  strokeWidth: number;
  globalCompositeOperation: 'source-over' | 'destination-out';
};

// Define type for event handlers using Konva's types
type KonvaMouseEventHandler = (e: Konva.KonvaEventObject<MouseEvent>) => void;
type KonvaTouchEventHandler = (e: Konva.KonvaEventObject<TouchEvent>) => void;

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  const [lines, setLines] = useState<LineType[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);

  // Get drawing state from store
  const { currentTool, color, strokeWidth } = useDrawingStore();

  const handleMouseDown: KonvaMouseEventHandler = e => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;

    // Set appropriate mode based on selected tool
    const compositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    const drawingColor = currentTool === 'eraser' ? 'white' : color;

    setLines([
      ...lines,
      {
        points: [pos.x, pos.y],
        color: drawingColor,
        strokeWidth: strokeWidth,
        globalCompositeOperation: compositeOperation,
      },
    ]);
  };

  const handleMouseMove: KonvaMouseEventHandler = e => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    if (!stage) return;
    
    const point = stage.getPointerPosition();
    if (!point) return;

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
  const handleTouchStart: KonvaTouchEventHandler = e => {
    e.evt.preventDefault();
    handleMouseDown(e as unknown as Konva.KonvaEventObject<MouseEvent>);
  };

  const handleTouchMove: KonvaTouchEventHandler = e => {
    e.evt.preventDefault();
    handleMouseMove(e as unknown as Konva.KonvaEventObject<MouseEvent>);
  };

  const handleTouchEnd: KonvaTouchEventHandler = e => {
    e.evt.preventDefault();
    handleMouseUp();
  };

  const handleReset = useCallback(() => {
    setLines([]);
  }, []);

  return (
    <div className="whiteboard-container relative w-screen h-screen bg-white">
      <ToolsPanel onReset={handleReset} />
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
        style={{ background: '#ffffff' }}
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
              lineJoin="round"
              globalCompositeOperation={line.globalCompositeOperation}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default WhiteboardCanvas;
