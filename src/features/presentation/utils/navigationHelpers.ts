// src/presentation/utils/navigationHelpers.ts
export const getNextSlide = (currentSlide: number, totalSlides: number): number => {
    return (currentSlide + 1) % totalSlides;
  };
  
  export const getPreviousSlide = (currentSlide: number, totalSlides: number): number => {
    return (currentSlide - 1 + totalSlides) % totalSlides;
  };