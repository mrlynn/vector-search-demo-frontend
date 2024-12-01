import React from 'react';

const TitleSlide = ({ title }) => {
  return (
    <div className="title-slide">
      <h1 
        className="text-white"
        style={{
          fontFamily: '"Archivo Black", system-ui, -apple-system, sans-serif',
          letterSpacing: '0.15em',
          fontSize: 'clamp(2rem, 15vw, 8rem)',
          fontWeight: '900',
          textTransform: 'lowercase'
        }}
      >
        {title}
      </h1>
    </div>
  );
};

export default TitleSlide;