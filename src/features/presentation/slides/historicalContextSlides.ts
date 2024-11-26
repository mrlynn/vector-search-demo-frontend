// src/features/presentation/slides/historicalContextSlides.ts
import { SlideSection } from '../types/slideTypes';
import { 
  AncientLibraryScroll, 
  AncientLibraryFlowWrapper 
} from '../components';

export const historicalContextSlides: SlideSection[] = [
  {
    id: 'alexandria',
    title: 'The Great Library',
    content: `
## Lessons from Alexandria

The world's first universal library holds valuable lessons for modern data systems.

### Historical Parallel
- 700,000+ scrolls and books
- Complex organization system
- Expert librarians and scholars
- Knowledge synthesis and creation

### Enduring Challenges
- Information discovery
- Context preservation
- Knowledge organization
- Wisdom transfer

> "The past illuminates our path to the future"
    `,
    note: 'HISTORICAL CONTEXT',
    image: '/library.png',
    duration: 3
  },
  {
    id: 'basic',
    title: 'In the beginning...',
    content: 'The search for knowledge begins with the simplest of tools... your eyes, hands, a ladder, perhaps a torch. You look around, see what you can find, and take what you need.',
    note: 'Basic Search',
    image: '/slide5.png',
    component: AncientLibraryScroll
  },
  {
    id: 'ancient-parallel',
    type: 'text-full',
    title: 'Ancient Wisdom, Modern Solutions',
    note: 'PARALLEL SYSTEMS',
    component: AncientLibraryFlowWrapper,
    content: ''
  }
  // ... other historical context slides
];

export const historicalContextSection = {
    id: 'historical-context',
    title: 'Historical Context',
    description: 'Learning from the past to build the future',
    duration: 12,
    slides: historicalContextSlides
  };