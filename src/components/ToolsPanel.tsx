import React, { useState } from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';

const PRESET_COLORS = [
  '#000000', // Black
  '#4A4A4A', // Dark gray
  '#FF0000', // Red
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#800080', // Purple
  '#FFFFFF', // White
];

interface ToolsPanelProps {
  onReset: () => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({ onReset }) => {
  const { currentTool, color, strokeWidth, setTool, setColor, setStrokeWidth } = useDrawingStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handlePenClick = () => {
    setTool('pen');
    setShowMenu(true);
  };

  return (
    <>
      {/* Main Toolbar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white rounded-lg shadow-lg p-1.5 flex items-center gap-2">
          <button
            className={`p-2.5 rounded-md transition-all ${
              currentTool === 'pen' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={handlePenClick}
          >
            <FaPencilAlt size={20} />
          </button>

          <div className="w-px h-6 bg-gray-200" />

          <button
            className="p-2.5 rounded-md transition-all text-gray-700 hover:bg-gray-100"
            onClick={onReset}
          >
            <FaTrash size={20} />
          </button>
        </div>
      </div>

      {/* Menu Panel with Color Picker */}
      {showMenu && (
        <div className="fixed top-4 left-4 z-20">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <button
                className="text-gray-700 hover:bg-gray-100 p-1.5 rounded-md"
                onClick={() => setShowMenu(false)}
              >
                <HiMenu size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700">Colors</span>
            </div>

            {/* Color Presets */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-7 gap-2 p-1">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    className={`w-7 h-7 rounded transition-all ${
                      color === presetColor 
                        ? 'ring-2 ring-purple-500' 
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: presetColor,
                      border: presetColor === '#ffffff' ? '1px solid #e2e8f0' : 'none'
                    }}
                    onClick={() => setColor(presetColor)}
                  />
                ))}
              </div>

              {/* Stroke Width */}
              <div>
                <div className="text-sm text-gray-700 mb-2">Stroke Width: {strokeWidth}px</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    className="w-32 h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
                  />
                  <div 
                    className="rounded-full"
                    style={{
                      width: `${Math.min(strokeWidth, 20)}px`,
                      height: `${Math.min(strokeWidth, 20)}px`,
                      backgroundColor: color,
                      border: color === '#ffffff' ? '1px solid #e2e8f0' : 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToolsPanel;
