import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

const ProductImage = ({ src, alt, className = "", category = "Product" }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setImageSrc(src);
  }, [src]);

  const getFallbackImage = () => {
    const text = alt?.length > 20 ? `${category}\n${alt.substring(0, 20)}...` : `${category}\n${alt}`;
    return `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(text)}`;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(getFallbackImage());
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-lg">
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleError}
        onLoad={handleLoad}
      />
      
      {hasError && imageSrc === getFallbackImage() && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 rounded-lg">
          <ImageOff className="w-6 h-6 text-slate-400 mb-2" />
          <div className="text-xs text-slate-500 text-center px-2">
            {alt || 'Product Image'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImage;