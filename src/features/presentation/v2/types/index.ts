// src/features/presentation/v2/types/index.ts

import type { ReactNode } from 'react';

export type SlideLayout = 'title' | 'content' | 'split' | 'full';

export interface SlideProps {
  layout: SlideLayout;
  title?: string;
  subtitle?: string;
  content?: ReactNode;
  visual?: ReactNode;
  notes?: string[];
}

export interface PresentationProps {
  slides: SlideProps[];
  currentSlide: number;
  onNavigate: (index: number) => void;
}