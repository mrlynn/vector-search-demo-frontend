// src/features/presentation/v2/layouts/LayoutWrapper.tsx
import React from 'react';
import type { LayoutBaseProps } from './types';
import { LAYOUT_STYLES } from './constants';

export const LayoutWrapper: React.FC<LayoutBaseProps & { children: React.ReactNode }> = ({ 
  children, 
  className,
  style 
}) => {
  return (
    <div 
      className={`${LAYOUT_STYLES.containers.fullscreen} ${className || ''}`}
      style={style}
    >
      {children}
    </div>
  );
};