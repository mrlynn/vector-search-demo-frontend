// src/presentation/types/slideTypes.ts
import { ReactNode, ComponentType } from 'react';
import { SlideComponentKey } from '../components/slideComponentRegistry';

export type SlideType = 'text-full' | 'split' | 'code' | 'diagram' | 'title-full' | 'image-full';

export interface Slide {
  id: string;
  title: string;
  content: string;
  note: string;
  type?: SlideType;
  image?: string;
  animation?: {
    preset: string;
    duration: number;
    delay: number;
  };
  component?: ComponentType;
  duration?: number; // in minutes
  speakerNotes?: string[];
  textStyle?: {
    tracking?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
  };
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