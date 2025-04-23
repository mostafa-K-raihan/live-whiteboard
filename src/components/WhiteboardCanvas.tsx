import React, { useRef, useState } from 'react';
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
  height = window.innerHeight - 80,
}) => {
  const [lines, setLines] = useState<LineType[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);

  // Get drawing state from store
  const { currentTool, color, strokeWidth } = useDrawingStore();

  // Check if canvas is empty
  const isCanvasEmpty = lines.length === 0;

  const handleMouseDown: KonvaMouseEventHandler = e => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();

    // Check if position is not null before adding a new line
    if (pos) {
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
    }
  };

  const handleMouseMove: KonvaMouseEventHandler = e => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // Check if point is not null before updating
    if (point) {
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
    }
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

  // Clear the canvas
  const clearCanvas = () => {
    setLines([]);
  };

  // Calculate adjusted canvas width to account for the tools panel
  const toolsPanelWidth = 60; // Width of slimmer tools panel
  const adjustedWidth = width - toolsPanelWidth - 2; // Subtract tools panel width

  return (
    <div className="whiteboard-container flex border border-gray-300 rounded shadow-sm">
      {/* Tools panel on the left - made thinner */}
      <div className="whiteboard-tools-panel w-[60px] min-w-[60px] bg-white border-r border-gray-300">
        <ToolsPanel />
      </div>

      {/* Canvas area on the right */}
      <div className="whiteboard-drawing-area flex-1 flex flex-col">
        {/* Canvas toolbar */}
        <div className="canvas-toolbar bg-gray-100 border-b border-gray-300 p-2 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Canvas</span>
          <button
            onClick={clearCanvas}
            className={`px-3 py-1 text-xs rounded ${
              isCanvasEmpty
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={isCanvasEmpty}
            aria-disabled={isCanvasEmpty}
          >
            Clear Canvas
          </button>
        </div>

        {/* The actual canvas */}
        <div className="canvas-container flex-1">
          <Stage
            width={adjustedWidth}
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
      </div>
    </div>
  );
};

export default WhiteboardCanvas;
