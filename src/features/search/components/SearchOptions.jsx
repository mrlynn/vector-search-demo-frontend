// src/features/search/components/SearchOptions.jsx
import React from 'react';

const SearchOptions = ({ options, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {Object.entries(options).map(([key, value]) => (
        <label key={key} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange({ ...options, [key]: e.target.checked })}
            className="rounded text-[#00ED64] focus:ring-[#00ED64]"
          />
          <span className="whitespace-nowrap">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </span>
        </label>
      ))}
    </div>
  );
};

export default SearchOptions;