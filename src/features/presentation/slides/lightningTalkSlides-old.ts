// src/features/presentation/slides/lightningTalkSlides.ts
import { SlideSection } from '../types/slideTypes';
import {
  SearchEvolution,
  VectorEmbeddingsExplanation,
  AncientLibraryScroll,
  AncientTextQA,
  DataFlowAnimation,
  SearchJourney,
  DataExplorer
} from '../components';
import { AncientLibraryFlow } from '../components';

export const lightningTalkSection: SlideSection = {
  id: 'lightning-talk',
  title: 'From Data to Intelligence',
  description: 'A Journey Through Time',
  duration: 15,
  slides: [
    // Opening: Data to Intelligence Concept (2 minutes)
    {
        id: 'hand',
        title: 'Welcome',
        content: 'From Data to Intelligence',
        note: 'Michael Lynn',
        image: '/slide2.png',
        speakerNotes: [
            'Introduce yourself',
            'Introduce the topic',
            'Introduce the audience'
        ],
        duration: 2,
        type: 'split'
      },
      {
      id: 'data-evolution',
      type: 'split',
      title: 'From Data to Intelligence',
      note: 'THE JOURNEY',
      content: `
## The Evolution of Understanding

### Data
Raw facts and figures without context

### Knowledge
Information organized and structured

### Intelligence
Understanding and applying knowledge

> "The journey from storing to understanding"
      `,
      image: '/intelligence.webp',
      duration: 2,
      speakerNotes: [
        'Set up the fundamental concepts',
        'Draw the distinction between data and intelligence',
        'Set up the parallel with historical libraries'
      ]
    },
    {
        id: 'definition',
        title: 'Data',
        note: 'DEFINITION',
        content: `
## Definition
Raw, unprocessed facts and figures without context or meaning.

### Characteristics
- Data is the building block for knowledge and intelligence
- It can be numbers, text, measurements, or observations
- Raw data requires processing to be meaningful

### Purpose
- It serves as input to be processed into meaningful insights
- Forms the foundation for all analytical processes

### Role in Decision-Making
- Limited utility unless organized and contextualized
- Becomes valuable through proper analysis and interpretation

> "Data is the new oil of the digital economy"
        `,
        image: '/data.webp'
      },
      {
        id: 'knowledge',
        title: 'Knowledge',
        note: 'DEFINITION',
        content: `
## Definition
Information that has been processed and contextualized to provide meaning and context.

### Characteristics
- Knowledge is derived from data
- It is organized and structured to support decision-making
- It can be expressed in various forms, including text, numbers, and visualizations

### Purpose
- It serves as input to be processed into meaningful insights
- Forms the foundation for all analytical processes

### Role in Decision-Making
- It is essential for making informed decisions
- It can be used to predict outcomes and trends
- It is a key driver of competitive advantage

> "Knowledge is power"
        `,
        image: '/knowledge.webp'
      },
      {
        id: 'intelligence',
        title: 'Intelligence',
        note: 'DEFINITION',
        content: `
## Definition
The ability to learn, understand, and apply knowledge to make decisions and solve problems.

### Characteristics
- Intelligence is the ability to learn and adapt
- It is a complex process that involves multiple cognitive functions
- It can be expressed in various forms, including text, numbers, and visualizations

### Purpose
- It serves as input to be processed into meaningful insights
- Forms the foundation for all analytical processes

### Role in Decision-Making
- It is essential for making informed decisions
- It can be used to predict outcomes and trends
- It is a key driver of competitive advantage
        `,
        image: '/intelligence.webp'
      },
    // Library of Alexandria (2 minutes)
    {
      id: 'alexandria-parallel',
      type: 'split',
      title: 'The Great Library',
      note: 'HISTORICAL PARALLEL',
      content: `
## Lessons from Alexandria

The world's first universal library:
* 700,000+ scrolls and books
* Complex organization system
* Expert librarians and scholars
* Knowledge synthesis and creation

> "Ancient wisdom meets modern technology"
      `,
      image: '/library.png',
      duration: 2,
      speakerNotes: [
        'Draw parallel between ancient and modern challenges',
        'Set up the scrolling demonstration',
        'Highlight the scale of information'
      ]
    },

    // Endless Scroll Demo (2 minutes)
    {
      id: 'endless-scroll',
      type: 'text-full',
      title: 'Searching the Ancient Library',
      note: 'THE CHALLENGE',
      component: AncientLibraryScroll,
      content: `
## Manual Search Process

Imagine searching through endless scrolls...
      `,
      duration: 2,
      speakerNotes: [
        'Show endless scrolling component',
        'Emphasize the challenge of manual search',
        'Set up need for better solution'
      ]
    },
    {
        id: 'challenge',
        title: 'The Challenge',
        content: 'Finding the right information quickly and effectively in vast datasets',
        note: 'The Problem',
        component: DataExplorer
      },
    // Introduce the Sage (2 minutes)
    {
      id: 'enter-sage',
      type: 'split',
      title: 'Enter the Sage',
      note: 'THE SOLUTION',
      content: `
## The Ancient Librarian

* Deep knowledge of all texts
* Understanding of context
* Ability to make connections
* Instant access to wisdom
      `,
      image: '/sage.webp',
      duration: 2,
      speakerNotes: [
        'Introduce the concept of the wise guide',
        'Set up parallel with AI assistance',
        'Transition to modern implementation'
      ]
    },

    // Ancient Library Flow (2 minutes)
    {
      id: 'ancient-flow',
      type: 'text-full',
      title: 'Knowledge Flow in Alexandria',
      note: 'THE PROCESS',
      component: AncientLibraryFlow,
      content: '',
      duration: 2,
      speakerNotes: [
        'Show how knowledge flowed in ancient library',
        'Highlight organization methods',
        'Prepare for modern parallel'
      ]
    },

    // MongoDB Data Flow (2 minutes)
    {
      id: 'modern-flow',
      type: 'text-full',
      title: 'Modern Knowledge Architecture',
      note: 'THE TECHNOLOGY',
      component: DataFlowAnimation,
      content: '',
      duration: 2,
      speakerNotes: [
        'Show MongoDBs modern approach',
        'Draw parallels with ancient library',
        'Highlight vector search capabilities'
      ]
    },

    // Search Demo (2 minutes)
    {
      id: 'search-demo',
      type: 'text-full',
      title: 'Intelligence in Action',
      note: 'THE DEMO',
      component: AncientTextQA,
      content: `
## Modern Search Capabilities

* Semantic understanding
* Context awareness
* Intelligent matching
* Real-time insights
      `,
      duration: 2,
      speakerNotes: [
        'Demonstrate search capabilities',
        'Show semantic understanding',
        'Highlight speed and accuracy'
      ]
    },

    // Closing (1 minute)
    {
      id: 'closing',
      type: 'split',
      title: 'The Future is Here',
      note: 'NEXT STEPS',
      content: `
## Build Your Intelligent Library

1. MongoDB Atlas M10+ cluster
2. Enable Vector Search
3. Connect to AI models
4. Start building

> "Transform your data into intelligence"
      `,
      image: '/data.webp',
      duration: 1,
      speakerNotes: [
        'Recap the journey',
        'Provide clear next steps',
        'Inspire action'
      ]
    }
  ]
};

export default lightningTalkSection.slides;