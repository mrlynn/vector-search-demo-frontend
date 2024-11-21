// src/services/productImageService.js

// Expanded category mappings with verified images
const categoryFallbacks = {
  // Electronics & Technology
  'Electronics': 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845',
  'Computers': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
  'Computer Accessories': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
  'Mobile Phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
  'Cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  'Photography': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd',
  
  // Audio & Entertainment
  'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  'Speakers': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
  'Gaming': 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9',
  
  // Home & Kitchen
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
  'Kitchen Appliances': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7',
  'Coffee & Tea': 'https://images.unsplash.com/photo-1520970014086-2208d761a0e0',
  'Cooking': 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d',
  'Small Appliances': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7',
  
  // Fitness & Wearables
  'Fitness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
  'Wearables': 'https://images.unsplash.com/photo-1544441893-675973e31985',
  'Smart Devices': 'https://images.unsplash.com/photo-1544441893-675973e31985',
  'Health': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
  
  'Default': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
};

// Category synonyms to handle different naming conventions
const categorySynonyms = {
  'mobile': ['phones', 'mobile phones', 'smartphones', 'cell phones'],
  'audio': ['sound', 'music', 'speakers', 'headphones'],
  'computers': ['laptops', 'desktops', 'computer', 'pc'],
  'cameras': ['photography', 'photo', 'dslr', 'digital cameras'],
  'kitchen': ['appliances', 'cooking', 'home'],
  'wearables': ['smartwatch', 'fitness tracker', 'smart devices', 'smart home'],
  'gaming': ['games', 'video games', 'console'],
  'fitness': ['exercise', 'workout', 'health', 'sports']
};

// Enhanced product-specific mappings
const productImageMap = {
  // Electronics & Computers
  'laptop computer': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
  'desktop computer': 'https://images.unsplash.com/photo-1547082299-de196ea013d6',
  'computer monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
  'wireless keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
  'wireless mouse': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7',
  
  // Mobile & Tablets
  'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  'mobile phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  'tablet device': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
  
  // Audio
  'wireless headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  'bluetooth speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
  'microphone': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
  
  // Cameras & Photography
  'digital camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  'dslr camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd',
  'camera lens': 'https://images.unsplash.com/photo-1617005082133-518286b3f3db',
  
  // Kitchen & Home
  'coffee machine': 'https://images.unsplash.com/photo-1520970014086-2208d761a0e0',
  'espresso maker': 'https://images.unsplash.com/photo-1587075417738-aa74c80c199b',
  'electric kettle': 'https://images.unsplash.com/photo-1594213114663-d94db9b67521',
  'food blender': 'https://images.unsplash.com/photo-1570275239925-4af0aa93a0dc',
  'stand mixer': 'https://images.unsplash.com/photo-1578598336003-1514a96268a0',
  
  // Wearables & Fitness
  'smart watch': 'https://images.unsplash.com/photo-1544441893-675973e31985',
  'activity tracker': 'https://images.unsplash.com/photo-1557166983-5939628991ed'
};

const findBestMatch = (title = '', description = '', category = '') => {
  const searchText = `${title} ${description}`.toLowerCase();
  const categoryLower = category.toLowerCase();

  // 1. Try exact product match first
  for (const [key, url] of Object.entries(productImageMap)) {
    if (searchText.includes(key.toLowerCase())) {
      return url;
    }
  }

  // 2. Try category match
  if (category) {
    // Direct category match
    if (categoryFallbacks[category]) {
      return categoryFallbacks[category];
    }

    // Try synonym matching
    for (const [mainCategory, synonyms] of Object.entries(categorySynonyms)) {
      if (synonyms.some(synonym => categoryLower.includes(synonym.toLowerCase()))) {
        const matchedCategory = Object.keys(categoryFallbacks).find(key => 
          key.toLowerCase().includes(mainCategory.toLowerCase())
        );
        if (matchedCategory) {
          return categoryFallbacks[matchedCategory];
        }
      }
    }

    // Partial category match
    const partialMatch = Object.keys(categoryFallbacks).find(key =>
      key.toLowerCase().includes(categoryLower) ||
      categoryLower.includes(key.toLowerCase())
    );
    if (partialMatch) {
      return categoryFallbacks[partialMatch];
    }
  }

  // 3. Try to extract category from title or description
  const words = searchText.split(/\s+/);
  for (const word of words) {
    for (const [mainCategory, synonyms] of Object.entries(categorySynonyms)) {
      if (synonyms.some(synonym => word.includes(synonym.toLowerCase()))) {
        const matchedCategory = Object.keys(categoryFallbacks).find(key => 
          key.toLowerCase().includes(mainCategory.toLowerCase())
        );
        if (matchedCategory) {
          return categoryFallbacks[matchedCategory];
        }
      }
    }
  }

  // 4. Default fallback
  return categoryFallbacks.Default;
};

const formatImageUrl = (url) => {
  if (url.includes('unsplash.com')) {
    return `${url}?auto=format&fit=crop&w=400&h=400&q=80`;
  }
  return url;
};

export const productImageService = {
  findBestMatch: (title, description, category) => {
    const imageUrl = findBestMatch(title, description, category);
    return formatImageUrl(imageUrl);
  },
  preloadImages: async () => {
    const uniqueUrls = new Set([
      ...Object.values(productImageMap),
      ...Object.values(categoryFallbacks)
    ]);
    await Promise.all(Array.from(uniqueUrls).map(url => {
      const img = new Image();
      img.src = formatImageUrl(url);
      return img.decode().catch(() => {});
    }));
  }
};

export default productImageService;