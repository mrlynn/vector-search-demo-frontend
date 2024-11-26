// src/presentation/types/slideTypes.ts
import { ReactNode, ComponentType } from 'react';

export type SlideType = 'text-full' | 'split' | 'code' | 'diagram';

export interface Slide {
  id: string;
  title: string;
  content: string;
  note: string;
  type?: SlideType;
  image?: string;
  component?: ComponentType;
  duration?: number; // in minutes
  speakerNotes?: string[];
}

export interface SlideSection {
  id: string;
  title: string;
  description: string;
  duration: number;
  slides: Slide[];
  learningObjectives?: string[];
  keyTakeaways?: string[];
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  description?: string;
  notes?: string[];
}

export interface ContentBlock {
  id: string;
  type: 'markdown' | 'code' | 'list';
  content: string;
  notes?: string[];
}