// src/presentation/slides/introductionSlides.ts
import { SlideSection, Slide } from '../types/slideTypes';
import { contentBlocks } from '../constants/contentBlocks';
import { AncientLibraryScroll } from '../components';
import { AncientLibraryFlowWrapper } from '../components';
import { DataFlowAnimation } from '../components';
import { SwimLaneFlowWrapper } from '../components';

export const introductionSection: SlideSection = {
  id: 'introduction',
  title: 'Introduction',
  description: 'Setting the stage for the journey from data to intelligence',
  duration: 10,
  learningObjectives: [
    'Understand the evolution of data processing',
    'Recognize the importance of vector search',
    'Identify key challenges in modern data systems'
  ],
  slides: [
    {
      id: 'enter-sage',
      title: 'Enter the Sage',
      content: 'The library is a place of learning, where the wise can share their knowledge and the curious can seek answers. You enter the library, and the doors close behind you.',
      note: 'Enter the Sage',
      image: '/sage.webp',
      speakerNotes: [
        'Explain the concept of entering the sage',
        'Highlight the role of the library as a place of learning',
        'Use a quote to emphasize the importance of seeking knowledge'
      ]
    },
    {
      id: 'ancient-parallel',
      type: 'text-full',
      title: 'Ancient Wisdom, Modern Solutions',
      note: 'PARALLEL SYSTEMS',
      component: AncientLibraryFlowWrapper,
      content: '',
      speakerNotes: [
        'Explain the parallel between ancient wisdom and modern solutions',
        'Highlight the importance of context preservation',
        'Use a quote to emphasize the importance of historical context'
      ]
    },
    {
      id: 'modern-parallel',
      type: 'text-full',
      title: 'Modern Data Systems',
      note: 'MODERN SYSTEMS',
      component: DataFlowAnimation,
      content: '',
      speakerNotes: [
        'Explain the parallel between ancient wisdom and modern solutions',
        'Highlight the importance of context preservation',
        'Use a quote to emphasize the importance of historical context'
      ]
    },
    {
      id: 'modern-context',
      type: 'text-full',
      title: 'MongoDB AI Data Flow',
      note: 'MongoDB Vector Application',
      component: SwimLaneFlowWrapper,
      content: '',
      speakerNotes: [
        'Explain the swimlane',
        'Highlight the importance of context preservation',
        'Use a quote to emphasize the importance of historical context'
      ]
    }
  ]
};

export default introductionSection.slides;