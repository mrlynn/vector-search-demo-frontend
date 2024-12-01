import React, { useState } from 'react';
import { Menu, X, Search, GitCompare, Database, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VIEW_MODES } from '../features/search/constants/SearchTypes';

const ResponsiveNav = ({ currentMode, onModeChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: VIEW_MODES.SEARCH, label: 'Search', icon: Search },
    { id: VIEW_MODES.COMPARE, label: 'Compare', icon: GitCompare },
    { id: VIEW_MODES.DATA, label: 'Data', icon: Database },
    { id: VIEW_MODES.PRESENTATION, label: 'Present', icon: Presentation }
  ];

  const handleModeSelect = (mode) => {
    onModeChange(mode);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 py-4 px-4 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
      {/* Logo/Title area */}
      <div className="text-white font-semibold text-lg">
      Data to Intelligence
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentMode === id ? "secondary" : "ghost"}
              className={`flex items-center gap-2 ${
                currentMode === id 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => handleModeSelect(id)}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden text-white hover:bg-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentMode === id ? "secondary" : "ghost"}
              className="w-full flex items-center gap-2 justify-start px-4 py-3"
              onClick={() => handleModeSelect(id)}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default ResponsiveNav;