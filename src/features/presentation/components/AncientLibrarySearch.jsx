import React, { useState, useEffect, useRef } from 'react';
import { Scroll, BookOpen, Search, X } from 'lucide-react';

const AncientLibrarySearch = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('title'); // 'title' or 'author'
    const [noResults, setNoResults] = useState(false);
    const loaderRef = useRef(null);
    const [page, setPage] = useState(1);

    // Ancient Egyptian inspired titles - same data generation as before
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

    const generateItems = (pageNumber) => {
        const newItems = [];
        const itemsPerPage = 10;

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

    // Same helper functions as before
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

    const generateDescription = (length) => {
        const words = [
            "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
            "λόγος", "σοφία", "ἀρετή", "νοῦς", "ψυχή", "κόσμος"
        ];

        let description = "";
        for (let i = 0; i < length; i++) {
            description += words[Math.floor(Math.random() * words.length)] + " ";
        }
        return description.trim();
    };

    // New search functionality
    const performSearch = () => {
        if (!searchTerm) {
            setFilteredItems(items);
            setNoResults(false);
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const results = items.filter(item => {
            if (searchField === 'title') {
                // Exact word match in title
                const titleWords = item.title.toLowerCase().split(' ');
                return titleWords.some(word => word === searchTermLower);
            } else {
                // Exact author name match
                const authorName = item.author.split(',')[0].toLowerCase();
                return authorName === searchTermLower;
            }
        });

        setFilteredItems(results);
        setNoResults(results.length === 0);
    };

    useEffect(() => {
        performSearch();
    }, [searchTerm, searchField, items]);

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
            {/* Header with Search */}
            <div className="flex flex-col bg-amber-100 border-b border-amber-200">
                {/* Title Bar */}
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                        <BookOpen className="text-amber-800" size={24} />
                        <h2 className="text-2xl font-serif text-amber-900">Ancient Library Search</h2>
                    </div>
                    <div className="text-amber-800 text-base">
                        Total Scrolls: {items.length}
                    </div>
                </div>

                {/* Search Interface */}
                <div className="px-6 pb-6 flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`Search by ${searchField}... (exact match required)`}
                            className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-amber-300 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="px-4 py-3 rounded-lg border-2 border-amber-300 text-lg bg-white min-w-[140px]"
                    >
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                    </select>
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-auto">
                {noResults ? (
                    <div className="flex flex-col items-center justify-center h-full text-amber-800">
                        <Search size={32} className="mb-4 opacity-50" />
                        <p className="text-lg mb-2">No exact matches found</p>
                        <p className="text-base opacity-70">Try searching for an exact word in titles or an exact author name</p>
                    </div>
                ) : (
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
                            {filteredItems.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-amber-50 transition-colors text-base"
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
                )}
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

export default AncientLibrarySearch;