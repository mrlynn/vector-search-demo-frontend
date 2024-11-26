// src/features/presentation/slides/VectorEmbeddingsSlide.ts

import { SlideConfig } from '../types/slideTypes';

export const vectorEmbeddingsSlide: SlideConfig = {
  id: 'vector-embeddings',
  title: 'Understanding Vector Embeddings',
  component: 'VectorEmbeddingsExplanation',
  notes: [
    'Vector embeddings are the foundation of modern AI-powered search',
    'They convert complex data into numerical representations',
    'Similar items are positioned closer together in vector space',
    'This enables semantic understanding and similarity matching',
    'MongoDB Vector Search leverages these embeddings for intelligent queries'
  ],
  transitions: {
    previous: 'introduction',  // Update this based on your slide order
    next: 'implementation'     // Update this based on your slide order
  }
};