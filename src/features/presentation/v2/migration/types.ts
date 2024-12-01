// src/features/presentation/v2/migration/types.ts
import type { SlideProps } from '../types';

export type LegacySlideType = 'text-full' | 'split' | 'title-full' | 'full';

export interface LegacySlide {
  type: LegacySlideType;
  title?: string;
  note?: string;
  content?: string | React.ReactNode;
  component?: React.ComponentType<any>;
  image?: string;
  speakerNotes?: string[];
  textStyle?: Record<string, string>;
  componentProps?: Record<string, unknown>;
}

export interface AdapterOptions {
  preserveOriginalProps?: boolean;
  defaultLayout?: SlideProps['layout'];
}