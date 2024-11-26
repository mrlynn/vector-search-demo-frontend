// src/features/presentation/slides/index.ts
import { lightningTalkSection } from './lightningTalkSlides';
import { SlideSection } from '../types/slideTypes';
import { introductionSection } from './introductionSlides';
import { historicalContextSection } from './historicalContextSlides';

// Original sections remain but are commented out for the lightning talk
export const presentationSections: SlideSection[] = [
  // introductionSection,
  lightningTalkSection
  // Uncomment for full presentation
  // introductionSection,
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