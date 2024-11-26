// src/features/search/constants/searchTypes.js
import { Database, Search, Radar, Brain, Image } from 'lucide-react';

export const VIEW_MODES = {
  SEARCH: 'search',
  COMPARE: 'compare',
  DATA: 'data',
  PRESENTATION: 'presentation'
};

export const searchTypes = [
  {
    id: 'basic',
    name: 'Basic Find',
    icon: Database,
    description: 'Traditional MongoDB find() - Exact text matching',
    color: 'bg-slate-600',
    placeholder: 'Enter exact text to match...',
    tip: 'Uses standard MongoDB queries with regex matching'
  },
  {
    id: 'atlas',
    name: 'Atlas Search',
    icon: Search,
    description: 'Atlas Search - Full-text search with fuzzy matching',
    color: 'bg-blue-600',
    placeholder: 'Try searching with typos...',
    tip: 'Supports fuzzy matching, autocomplete, and exact phrases'
  },
  {
    id: 'vector',
    name: 'Vector Search',
    icon: Radar,
    description: 'Vector Search - Semantic text similarity',
    color: 'bg-green-600',
    placeholder: 'Describe what you\'re looking for...',
    tip: 'Converts text to vectors for similarity search'
  },
  {
    id: 'semantic',
    name: 'Semantic Search',
    icon: Brain,
    description: 'Semantic Search - Natural language understanding',
    color: 'bg-purple-600',
    placeholder: 'Ask in natural language...',
    tip: 'Uses AI to understand search intent'
  },
  {
    id: 'image',
    name: 'Image Search',
    icon: Image,
    description: 'Image Search - Visual similarity using vectors',
    color: 'bg-pink-600',
    placeholder: 'Upload an image to search...',
    tip: 'Converts images to vectors for similarity matching'
  }
];

export const defaultSearchOptions = {
  fuzzyMatching: true,
  autoComplete: true,
  phraseMatching: true
};