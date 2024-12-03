import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import config from '../../../config';

const TextSearchDemo2 = () => {
  const [searchParams, setSearchParams] = useState({
    topic: '',
    period: '',
    keywords: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(searchParams);
      const response = await fetch(`${config.apiUrl}/books/recommendations?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchParams(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getHighlightedText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={index} className="bg-yellow-200">{part}</span> : part
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          MongoDB Text Search Demo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Input
                name="topic"
                placeholder="Enter topic..."
                value={searchParams.topic}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <Input
                name="period"
                placeholder="Enter time period..."
                value={searchParams.period}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <Input
                name="keywords"
                placeholder="Enter keywords..."
                value={searchParams.keywords}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Books'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {results.map((book, index) => (
            <div key={index} className="p-4 border rounded hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">
                  {getHighlightedText(book.title, searchParams.topic)}
                </h3>
                <span className="text-sm text-gray-500">
                  Score: {book.score.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                {getHighlightedText(book.summary, searchParams.topic)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {book.keywords?.map((keyword, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                  >
                    {getHighlightedText(keyword, searchParams.keywords)}
                  </span>
                ))}
              </div>
              {book.period && (
                <div className="mt-2 text-sm text-gray-500">
                  Period: {getHighlightedText(book.period, searchParams.period)}
                </div>
              )}
            </div>
          ))}
          
          {results.length === 0 && !loading && !error && (
            <div className="text-center text-gray-500 py-8">
              No results found. Try different search terms.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextSearchDemo2;