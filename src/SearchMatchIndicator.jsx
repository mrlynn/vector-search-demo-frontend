// First, add this new component for showing match details
const SearchMatchIndicator = ({ result, searchType, options }) => {
    console.log('SearchMatchIndicator options:', options);
    console.log('SearchMatchIndicator result:', result);
    console.log('SearchMatchIndicator searchType:', searchType);
    if (!result.highlights && !result.matchDetails) {
        return <div>No match details available</div>;
      }
    if (searchType !== 'atlas') return null;
  
    // Extract match information from the result
    const matchTypes = {
      fuzzy: result.matchDetails?.fuzzyMatches?.length > 0,
      phrase: result.matchDetails?.phraseMatches?.length > 0,
      autocomplete: result.matchDetails?.autocompleteMatches?.length > 0
    };
    console.log('matchTypes:', matchTypes);
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {matchTypes.fuzzy && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#eef784] text-[#001E2B]">
            Fuzzy Match
          </span>
        )}
        {matchTypes.phrase && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#ab22a2] text-[#001E2B]">
            Exact Match
          </span>
        )}
        {matchTypes.autocomplete && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#09ff00] text-[#001E2B]">
            Autocomplete
          </span>
        )}
      </div>
    );
  };

  export default SearchMatchIndicator;