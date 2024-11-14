// First, create a new component to handle highlighted text:
const HighlightedText = ({ text, highlights }) => {
    if (!highlights || !highlights.length) return text;
  
    // Sort highlights by score in descending order
    const sortedHighlights = [...highlights].sort((a, b) => b.score - a.score);
    
    // Take the highest scoring highlight
    const bestHighlight = sortedHighlights[0];
    if (!bestHighlight) return text;
  
    const { texts } = bestHighlight;
    if (!texts) return text;
  
    return (
      <span>
        {texts.map((part, index) => (
          <span
            key={index}
            className={part.type === 'hit' ? 
              'bg-[#00ED64] bg-opacity-20 text-[#001E2B] font-medium px-1 rounded' : 
              ''}
          >
            {part.value}
          </span>
        ))}
      </span>
    );
  };

  export default HighlightedText;