import { useState } from "react";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("basic");
  const [searchOptions, setSearchOptions] = useState<any>({});
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchTime, setSearchTime] = useState<string>("0");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState<string>("");

  // Handle search term change
  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle search type change
  const handleSearchTypeChange = (newType: string) => {
    setSearchType(newType);
  };

  // Handle search options change
  const handleSearchOptionsChange = (options: any) => {
    setSearchOptions(options);
  };

  // Handle image selection
  const handleImageSelect = (image: File) => {
    setSelectedImage(image);
    // Example: Call an API to process the image and set a description
    setImageDescription("Sample image description"); // Replace with actual logic
  };

  // Handle image removal
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImageDescription("");
  };

  // Simulate a search operation
  const handleSearch = async () => {
    setIsSearching(true);
    const start = performance.now();

    // Simulated API call (replace with actual API call)
    setTimeout(() => {
      const simulatedResults = [
        { title: "Result 1", description: "Description for result 1" },
        { title: "Result 2", description: "Description for result 2" },
      ];
      setResults(simulatedResults);
      setIsSearching(false);

      const end = performance.now();
      setSearchTime((end - start).toFixed(2));
    }, 1000); // Simulate a 1-second delay
  };

  return {
    searchTerm,
    searchType,
    searchOptions,
    isSearching,
    results,
    searchTime,
    selectedImage,
    imageDescription,
    handleSearch,
    handleSearchTermChange,
    handleSearchTypeChange,
    handleSearchOptionsChange,
    handleImageSelect,
    handleImageRemove,
  };
};
