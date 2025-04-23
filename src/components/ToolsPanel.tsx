import React from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { FaPencilAlt, FaEraser } from 'react-icons/fa';

const ToolsPanel: React.FC = () => {
  const { currentTool, color, strokeWidth, setTool, setColor, setStrokeWidth } = useDrawingStore();

  return (
    <div className="tools-panel h-full flex flex-col">
      {/* Tools header */}
      <div className="bg-gray-100 border-b border-gray-300 py-2 px-1">
        <h3 className="text-xs font-medium text-center text-gray-700">Tools</h3>
      </div>

      {/* Drawing Tools - vertical layout */}
      <div className="tool-grid flex flex-col gap-2 p-2 border-b border-gray-200">
        {/* Pen tool */}
        <div className="relative group">
          <button
            className={`tool-btn p-2 w-full rounded-full flex items-center justify-center ${
              currentTool === 'pen'
                ? 'bg-blue-100 text-blue-600 border border-blue-300'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setTool('pen')}
            aria-label="Pen Tool"
            title="Pen Tool"
          >
            <FaPencilAlt size={16} />
          </button>
          <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs rounded py-1 px-2 invisible group-hover:visible whitespace-nowrap z-10">
            Pen Tool
          </div>
        </div>

        {/* Eraser tool */}
        <div className="relative group">
          <button
            className={`tool-btn p-2 w-full rounded-full flex items-center justify-center ${
              currentTool === 'eraser'
                ? 'bg-blue-100 text-blue-600 border border-blue-300'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setTool('eraser')}
            aria-label="Eraser Tool"
            title="Eraser Tool"
          >
            <FaEraser size={16} />
          </button>
          <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs rounded py-1 px-2 invisible group-hover:visible whitespace-nowrap z-10">
            Eraser Tool
          </div>
        </div>
      </div>

      {/* Properties section */}
      <div className="tool-properties p-2 border-b border-gray-200">
        {/* Color picker with tooltip */}
        <div className="mb-3 relative group">
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-full h-6 cursor-pointer border border-gray-300 rounded-sm"
            aria-label="Color picker"
            title="Choose a color"
          />
          <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs rounded py-1 px-2 invisible group-hover:visible whitespace-nowrap z-10">
            Color: {color}
          </div>
        </div>

        {/* Stroke width with tooltip */}
        <div className="relative group">
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={e => setStrokeWidth(parseInt(e.target.value))}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-gray-200"
            aria-label="Adjust stroke width"
            title={`Stroke width: ${strokeWidth}px`}
          />
          <div className="mt-1 flex justify-center">
            <div
              className="rounded-full"
              style={{
                width: `${Math.min(strokeWidth, 20)}px`,
                height: `${Math.min(strokeWidth, 20)}px`,
                backgroundColor: currentTool === 'pen' ? color : '#ffffff',
              }}
            />
          </div>
          <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs rounded py-1 px-2 invisible group-hover:visible whitespace-nowrap z-10">
            Width: {strokeWidth}px
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;
