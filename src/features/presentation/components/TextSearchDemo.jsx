import React, { useState, useEffect } from 'react';
import { Search, Database, ArrowRight, ListFilter } from 'lucide-react';

const TextSearchDemo = () => {
  const [step, setStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('pasta');
  const documents = [
    { id: 1, text: "Fresh pasta with meatballs" },
    { id: 2, text: "Linguine carbonara" },
    { id: 3, text: "Chicken curry" },
    { id: 4, text: "Psta marinara" }, // Intentional typo for fuzzy search
    { id: 5, text: "Spaghetti bolognese" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((prevStep) => (prevStep < 4 ? prevStep + 1 : 0));
    }, 3000);
    return () => clearTimeout(timer);
  }, [step]);

  const getHighlightedText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <span key={i} className="bg-yellow-200">{part}</span> : part
    );
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">MongoDB Text Search Visualization</h2>
      
      <div className="flex items-center gap-4 mb-8">
        <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
          <Search className="w-8 h-8 text-blue-500" />
          <div className="text-sm">Search Query</div>
        </div>
        <ArrowRight className="w-6 h-6" />
        <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
          <ListFilter className="w-8 h-8 text-green-500" />
          <div className="text-sm">Text Analysis</div>
        </div>
        <ArrowRight className="w-6 h-6" />
        <div className={`transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
          <Database className="w-8 h-8 text-purple-500" />
          <div className="text-sm">Index Search</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
          <h3 className="font-bold mb-4">Search Query</h3>
          <div className="flex items-center gap-2 p-2 border rounded">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none outline-none flex-1"
              placeholder="Enter search term..."
            />
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h3 className="font-bold mb-4">Results</h3>
          <div className="space-y-2">
            {documents.map((doc) => {
              const isMatch = doc.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (step >= 2 && doc.text.toLowerCase().includes('psta')); // Fuzzy match
              return (
                <div 
                  key={doc.id}
                  className={`p-2 rounded transition-all duration-500 ${
                    isMatch && step >= 3 ? 'bg-green-100' : 'bg-gray-50'
                  }`}
                >
                  {step >= 3 ? getHighlightedText(doc.text) : doc.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Current Step: {step + 1}/4</h3>
        <p className="text-gray-600">
          {step === 0 && "Enter your search term to begin the text search process"}
          {step === 1 && "MongoDB analyzes the search query and prepares it for processing"}
          {step === 2 && "The text is analyzed, including fuzzy matching for typos"}
          {step === 3 && "Searching through the indexed documents for matches"}
          {step === 4 && "Results are returned with relevant matches highlighted"}
        </p>
      </div>
    </div>
  );
};

export default TextSearchDemo;