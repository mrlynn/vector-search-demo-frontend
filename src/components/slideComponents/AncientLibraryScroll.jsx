import React, { useState, useEffect, useRef } from 'react';
import { Scroll, BookOpen } from 'lucide-react';

const AncientLibraryScroll = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const [page, setPage] = useState(1);

  // Ancient Egyptian inspired titles
  const titlePrefixes = [
    "Book of the Dead",
    "Papyrus of",
    "Teachings of",
    "Prophecies of",
    "Mysteries of",
    "Scroll of",
    "Wisdom of",
    "Chronicles of",
    "Spells of",
    "Tales from"
  ];

  const titleSuffixes = [
    "the Sacred Temple",
    "the Rising Sun",
    "the Pharaoh's Court",
    "Ancient Memphis",
    "the Great Pyramid",
    "the Nile's Secrets",
    "the Royal Scribe",
    "Divine Knowledge",
    "Eternal Life",
    "the Sacred Lotus"
  ];

  const egyptianNames = [
    "Amenhotep",
    "Imhotep",
    "Nefertiti",
    "Thutmose",
    "Hatshepsut",
    "Akhenaten",
    "Ptolemy",
    "Ramesses",
    "Senusret",
    "Khufu"
  ];

  const generateDescription = (length) => {
    const words = [
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", 
      "λόγος", "σοφία", "ἀρετή", "νοῦς", "ψυχή", "κόσμος",
      "divine", "sacred", "ancient", "wisdom", "eternal", "knowledge",
      "mystical", "prophecy", "ritual", "temple", "pharaoh", "scribe"
    ];
    
    let description = "";
    for (let i = 0; i < length; i++) {
      const word = words[Math.floor(Math.random() * words.length)];
      description += word + " ";
    }
    return description.trim();
  };
  const generateTitle = () => {
    const prefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
    const suffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];
    return `${prefix} ${suffix}`;
  };

  const generateAuthor = () => {
    const name = egyptianNames[Math.floor(Math.random() * egyptianNames.length)];
    const title = Math.random() > 0.5 ? ", Royal Scribe" : ", High Priest";
    return name + title;
  };

  const generateItems = (pageNumber) => {
    const newItems = [];
    const itemsPerPage = 15;
    
    for (let i = 0; i < itemsPerPage; i++) {
      newItems.push({
        id: (pageNumber - 1) * itemsPerPage + i,
        title: generateTitle(),
        author: generateAuthor(),
        description: generateDescription(8),
        year: Math.floor(Math.random() * 3000) + " BCE"
      });
    }
    
    return newItems;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading]);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newItems = generateItems(page);
      setItems(prevItems => [...prevItems, ...newItems]);
      setPage(prevPage => prevPage + 1);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="w-full h-[800px] bg-[#FDF5E6] rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-amber-100 border-b border-amber-200">
            <div className="flex items-center gap-3">
                <BookOpen className="text-amber-800" size={24} />
                <h2 className="text-2xl font-serif text-amber-900">Ancient Library Catalog</h2>
            </div>
            <div className="text-amber-800 text-base">
                Scrolls: {items.length}
            </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="flex-1 overflow-auto">
            <table className="w-full">
                <thead className="bg-amber-50 sticky top-0 z-10">
                    <tr>
                        <th className="text-left p-4 font-serif text-amber-900 text-lg">Title</th>
                        <th className="text-left p-4 font-serif text-amber-900 text-lg">Author</th>
                        <th className="text-left p-4 font-serif text-amber-900 text-lg">Description</th>
                        <th className="text-left p-4 font-serif text-amber-900 text-lg w-32">Year</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                    {items.map((item) => (
                        <tr 
                            key={item.id}
                            className="hover:bg-amber-50 transition-colors text-base group"
                        >
                            <td className="p-4 font-medium text-amber-900">{item.title}</td>
                            <td className="p-4 text-amber-800">{item.author}</td>
                            <td className="p-4 text-amber-700">
                                <div className="truncate max-w-xl">{item.description}</div>
                            </td>
                            <td className="p-4 text-amber-800 text-base">{item.year}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Loading Indicator */}
        <div 
            ref={loaderRef}
            className="flex justify-center items-center p-4 bg-amber-50"
        >
            {isLoading && (
                <div className="flex items-center gap-3 text-amber-800 text-base">
                    <Scroll className="animate-spin" size={20} />
                    <span>Unrolling scrolls...</span>
                </div>
            )}
        </div>
    </div>
);
};

export default AncientLibraryScroll;