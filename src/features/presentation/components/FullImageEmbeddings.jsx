import React from 'react';

const FullImageEmbeddings = () => {
  return (
    <div className="w-full h-full bg-black relative z-0"> {/* Added relative and z-0 */}
      <img 
        src="/embeddings.png"
        alt="Embeddings" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default FullImageEmbeddings;