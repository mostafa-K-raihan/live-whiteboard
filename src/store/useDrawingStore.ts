import { create } from 'zustand';

export type ToolType = 'pen' | 'eraser';

interface DrawingState {
  currentTool: ToolType;
  color: string;
  strokeWidth: number;
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}

export const useDrawingStore = create<DrawingState>(set => ({
  currentTool: 'pen',
  color: '#222222',
  strokeWidth: 3,
  setTool: tool => set({ currentTool: tool }),
  setColor: color => set({ color }),
  setStrokeWidth: strokeWidth => set({ strokeWidth }),
}));
