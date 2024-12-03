import React, { useState, useEffect, useRef } from 'react';
import { Scroll, BookOpen, X, User, Calendar } from 'lucide-react';

const BookModal = ({ book, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-amber-50 rounded-lg max-w-2xl w-full relative border border-amber-200 shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-700 hover:text-amber-900"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
              <Scroll className="w-8 h-8 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-serif font-bold text-amber-900">{book.title}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-amber-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{book.author}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{book.year}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-serif text-lg font-semibold text-amber-900 mb-2">Description</h4>
              <p className="text-amber-800 leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-serif text-lg font-semibold text-amber-900 mb-2">Contents</h4>
              <p className="text-amber-800 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-100/50 px-6 py-4 rounded-b-lg border-t border-amber-200">
          <button
            onClick={onClose}
            className="w-full p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Close Scroll
          </button>
        </div>
      </div>
    </div>
  );
};

const AncientLibraryScroll = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const loaderRef = useRef(null);
  const [page, setPage] = useState(1);
  const itemCountRef = useRef(0); // Use ref to track total items
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
      const currentCount = itemCountRef.current;
      newItems.push({
        id: `scroll-${currentCount + i}`, // Create truly unique IDs
        title: generateTitle(),
        author: generateAuthor(),
        description: generateDescription(8),
        year: Math.floor(Math.random() * 3000) + " BCE"
      });
    }
    
    itemCountRef.current += itemsPerPage; // Update the counter
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
                            className="hover:bg-amber-50 transition-colors text-base group cursor-pointer"
                            onClick={() => setSelectedBook(item)}
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

        {/* Book Modal */}
        {selectedBook && (
          <BookModal 
            book={selectedBook} 
            onClose={() => setSelectedBook(null)} 
          />
        )}
    </div>
  );
};

export default AncientLibraryScroll;