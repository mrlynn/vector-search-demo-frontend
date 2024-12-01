import { SlideSection } from '../types/slideTypes';
import {
  AncientLibraryScroll,
  AncientLibrarySearch,
  Vector3DForce,
  VectorSearchProcess,
  SemanticSearchExplained,
  VectorSearchDemo,
  VectorSpaceVisualization,
  SwimLaneFlow,
  FullImageSlide
} from '../components';

export const ancientWisdomPresentation: SlideSection = {
  id: 'ancient-wisdom-presentation',
  title: 'From Data to Intelligence',
  description: 'Ancient Wisdom Meets Modern Technology: Building AI-Powered Applications with MongoDB Vector Search',
  duration: 15,
  slides: [
    // Opening - The Hook (2 minutes)
    {
      id: 'opening-hook',
      type: 'split',
      title: 'From Data to Intelligence',
      note: 'OPENING HOOK',
      content: `
## The Great Library of Alexandria

* 700,000+ scrolls
* World's knowledge in one place
* The eternal challenge:
  * How do you find what you seek?
  * How do you connect ideas?
  * How do you transform data into wisdom?
      `,
      image: '/library-of-alexandria.png',
      duration: 1,
      speakerNotes: [
        'Start with the powerful visual of the Library of Alexandria',
        'Connect ancient challenges to modern problems',
        'Set up the journey from data to intelligence'
      ]
    },
    
    // The Challenge (3 minutes)
    {
      id: 'endless-scrolls',
      type: 'text-full',
      title: 'The Challenge of Scale',
      note: 'DEMONSTRATION OF PROBLEM',
      component: AncientLibraryScroll,
      content: '',
      duration: 1.5,
      speakerNotes: [
        'Let the audience feel the overwhelming nature of endless scrolling',
        'Point out how this mirrors modern data overload',
        'Highlight the need for better solutions'
      ]
    },
    {
      id: 'basic-search',
      type: 'text-full',
      title: 'First Attempts at Organization',
      note: 'EVOLUTION OF SEARCH',
      component: AncientLibrarySearch,
      content: '',
      duration: 1.5,
      speakerNotes: [
        'Show how basic keyword search helps but is limited',
        'Demonstrate the gap between words and meaning',
        'Set up the need for semantic understanding'
      ]
    },

    // The Modern Sage (3 minutes)
    {
      id: 'modern-sage',
      type: 'split',
      title: 'Enter the Modern Sage',
      note: 'INTRODUCING VECTOR SEARCH',
      content: `
## From Keywords to Understanding

Modern AI combines:
* Pattern recognition like human intuition
* Mathematical precision of vectors
* Speed of modern databases
* Scale of cloud computing
      `,
      image: '/modern-sage.png',
      duration: 1
    },
    {
      id: 'vector-space',
      type: 'text-full',
      title: 'The Mathematics of Meaning',
      note: 'VECTOR SPACE VISUALIZATION',
      component: Vector3DForce,
      content: '',
      duration: 2,
      speakerNotes: [
        'Show how vectors capture relationships',
        'Point out natural clustering of related concepts',
        'Emphasize how this mirrors human understanding'
      ]
    },

    // The Transformation (5 minutes)
    {
      id: 'vector-process',
      type: 'text-full',
      title: 'How Vector Search Works',
      note: 'PROCESS EXPLANATION',
      component: VectorSearchProcess,
      content: '',
      duration: 1.5
    },
    {
      id: 'semantic-search',
      type: 'text-full',
      title: 'Understanding, Not Just Matching',
      note: 'SEMANTIC SEARCH EXPLANATION',
      component: SemanticSearchExplained,
      content: '',
      duration: 1.5
    },
    {
      id: 'live-demo',
      type: 'text-full',
      title: 'Vector Search in Action',
      note: 'LIVE DEMONSTRATION',
      component: VectorSearchDemo,
      content: '',
      duration: 2,
      speakerNotes: [
        'Show real-world example of vector search',
        'Demonstrate semantic understanding',
        'Highlight speed and accuracy'
      ]
    },

    // Closing (2 minutes)
    {
      id: 'modern-library',
      type: 'split',
      title: 'Building the Modern Library',
      note: 'IMPLEMENTATION STEPS',
      content: `
## Getting Started

1. Create Atlas M10+ cluster
2. Enable vector search
3. Generate embeddings
4. Create indexes
5. Transform your data into intelligence

Clone starter repo:
github.com/mongodb-developer/vector-search-starter
      `,
      image: '/modern-library.png',
      duration: 1
    },
    {
      id: 'closing',
      type: 'text-full',
      title: 'From Ancient Wisdom to Modern Intelligence',
      note: 'CLOSING THOUGHTS',
      content: `
## The Journey Continues

What the ancient librarians dreamed of, we can now build:
* Instant access to knowledge
* Understanding of meaning
* Connections across concepts
* Wisdom at scale

Start building your intelligent library today.
      `,
      duration: 1,
      speakerNotes: [
        'Bring the metaphor full circle',
        'Emphasize how we have solved ancient challenges',
        'Inspire action with clear next steps'
      ]
    }
  ]
};

export default ancientWisdomPresentation;