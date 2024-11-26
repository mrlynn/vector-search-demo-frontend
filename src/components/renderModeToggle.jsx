// src/components/renderModeToggle.jsx
import React from 'react';
import { Search, Layout, Database, MonitorPlay } from 'lucide-react';
import { VIEW_MODES, VIEW_MODE_LABELS } from '../constants/viewModes';

const renderModeToggle = ({ currentMode, onModeChange }) => {
  const getIcon = (mode) => {
    switch (mode) {
      case VIEW_MODES.SEARCH:
        return <Search className="w-4 h-4" />;
      case VIEW_MODES.COMPARE:
        return <Layout className="w-4 h-4" />;
      case VIEW_MODES.DATA:
        return <Database className="w-4 h-4" />;
      case VIEW_MODES.PRESENTATION:
        return <MonitorPlay className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2">
      {Object.values(VIEW_MODES).map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentMode === mode
              ? 'bg-blue-600 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          {getIcon(mode)}
          <span>{VIEW_MODE_LABELS[mode]}</span>
        </button>
      ))}
    </div>
  );
};

export default renderModeToggle;