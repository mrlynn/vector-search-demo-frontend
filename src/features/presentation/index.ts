// src/features/presentation/index.ts
import { introductionSection } from "./slides/introductionSlides";
import { historicalContextSection } from "./slides/historicalContextSlides";
import { technicalEvolutionSection } from "./slides/technicalEvolutionSlides";
import { implementationSection } from "./slides/implementationSlides";
import { applicationSection } from "./slides/applicationSlides";
import { futureDirectionSection } from "./slides/futureDirectionSlides";
import { SlideSection } from "./types/slideTypes";

export const presentationSections: SlideSection[] = [
  introductionSection,
  historicalContextSection,
  technicalEvolutionSection,
  implementationSection,
  applicationSection,
  futureDirectionSection
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

export type { SlideSection } from './types/slideTypes';