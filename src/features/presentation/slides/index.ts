// src/features/presentation/slides/index.ts
import { lightningTalkSection } from './lightningTalkSlides';
import { vectorSearchPresentation } from './vectorSearchPresentation';
import { vectorEducationSlides } from './vectorEducationSlides';
import { SlideSection } from '../types/slideTypes';
import { introductionSection } from './introductionSlides';
import { historicalContextSection } from './historicalContextSlides';
import { ancientWisdomPresentation } from './ancientWisdomPresentation';
// Original sections remain but are commented out for the lightning talk
export const presentationSections: SlideSection[] = [
  // introductionSection,
  vectorSearchPresentation,
  // lightningTalkSection,
//  ancientWisdomPresentation,
  // Uncomment for full presentation
// historicalContextSection,
  // technicalEvolutionSection,
  // implementationSection,
  // applicationSection,
  // futureDirectionSection
];

// Flatten all slides for presentation mode
export const presentationSlides = presentationSections.flatMap(section => section.slides);

// Export metadata about the presentation
export const presentationMetadata = {
  title: 'From Data to Intelligence',
  subtitle: 'MongoDB Vector Search and AI Integration',
  presenter: 'Michael Lynn',
  role: 'Principal Developer Advocate',
  company: 'MongoDB',
  totalDuration: presentationSections.reduce((acc, section) => acc + section.duration, 0),
  sections: presentationSections,
  totalSlides: presentationSlides.length
};

export { lightningTalkSection };