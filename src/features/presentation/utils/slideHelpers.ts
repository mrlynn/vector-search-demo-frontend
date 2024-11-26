// src/presentation/utils/slideHelpers.ts
import { Slide, SlideSection } from '../types/slideTypes';

export const getTotalDuration = (sections: SlideSection[]): number => {
  return sections.reduce((total, section) => total + section.duration, 0);
};

export const generateTableOfContents = (sections: SlideSection[]): string => {
  return sections
    .map(section => `${section.title} (${section.duration} mins)\n${section.description}`)
    .join('\n\n');
};

export const getSlideByIndex = (sections: SlideSection[], index: number): Slide | null => {
  let count = 0;
  for (const section of sections) {
    for (const slide of section.slides) {
      if (count === index) return slide;
      count++;
    }
  }
  return null;
};