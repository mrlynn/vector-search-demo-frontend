// src/features/presentation/slides/applicationSlides.ts
import { SlideSection } from '../types/slideTypes';

export const applicationSection: SlideSection = {
  id: 'applications',
  title: 'Real World Applications',
  description: 'Practical applications of vector search in production',
  duration: 15,
  learningObjectives: [
    'Understand common use cases for vector search',
    'Learn implementation patterns',
    'See real-world examples'
  ],
  keyTakeaways: [
    'Vector search has broad applications',
    'Integration patterns are reusable',
    'Performance considerations are crucial'
  ],
  slides: [
    // Add your application slides here
    {
      id: 'use-cases',
      type: 'text-full',
      title: 'Vector Search Applications',
      note: 'USE CASES',
      content: `
## Common Use Cases

1. **Semantic Document Search**
   - Knowledge base search
   - Documentation search
   - Research papers

2. **Similar Product Search**
   - E-commerce recommendations
   - Content recommendations
   - Image similarity

3. **Natural Language Processing**
   - Question answering
   - Content summarization
   - Semantic analysis
      `
    }
  ]
};

export default applicationSection.slides;