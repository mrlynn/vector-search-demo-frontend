import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Code,
  ChevronsRight,
  FileText,
  ShoppingBag,
  Book,
  ExternalLink,
  X
} from 'lucide-react';

const Modal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold mb-4">Code Snippet</h3>
        <pre className="bg-black p-4 text-white rounded-lg border overflow-x-auto">
          <code className="language-javascript">{content}</code>
        </pre>
      </div>
    </div>
  );
};

const CodeComparison = () => {
  const [selectedExample, setSelectedExample] = useState('product');
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const examples = {
    product: {
      icon: <ShoppingBag className="w-4 h-4" />,
      title: 'Product Search',
      traditional: {
        code: `// Traditional keyword-based search
db.products.find({
  $or: [
    { name: { $regex: /leather.*jacket/i } },
    { description: { $regex: /leather.*jacket/i } }
  ]
})`,
        result: `[
  {
    name: "Leather Jacket",
    description: "Classic leather jacket..."
  },
  // Misses: "Faux leather blazer"
  // Misses: "Genuine cowhide coat"
]`
      },
      vector: {
        code: `// Vector semantic search
const embedding = await openai.embeddings.create({
  model: "text-embedding-ada-002",
  input: "leather jacket"
});

await collection.aggregate([
  {
    "$vectorSearch": {
      "queryVector": embedding.data[0].embedding,
      "path": "description_vector",
      "numCandidates": 100,
      "index": "default"
    }
  },
  { "$limit": 5 }
])`,
        result: `[
  {
    name: "Leather Jacket",
    score: 0.92,
    description: "Classic leather jacket..."
  },
  {
    name: "Faux Leather Blazer", // ✓ Found!
    score: 0.87,
    description: "Modern faux leather..."
  },
  {
    name: "Genuine Cowhide Coat", // ✓ Found!
    score: 0.85,
    description: "Premium cowhide..."
  }
]`
      }
    },
    similar: {
      icon: <FileText className="w-4 h-4" />,
      title: 'Similar Items',
      traditional: {
        code: `// Traditional category-based related items
db.products.find({
  category: currentProduct.category,
  _id: { $ne: currentProduct._id }
}).limit(5)`,
        result: `[
  {
    name: "Denim Jacket",
    category: "jackets"
  },
  // Misses similar style items
  // from other categories
]`
      },
      vector: {
        code: `// Vector similarity search
await collection.aggregate([
  {
    "$vectorSearch": {
      "queryVector": currentProduct.styleVector,
      "path": "style_vector",
      "numCandidates": 100
    }
  },
  {
    "$match": {
      "_id": { "$ne": currentProduct._id }
    }
  },
  { "$limit": 5 }
])`,
        result: `[
  {
    name: "Biker Jacket",
    score: 0.89,
    category: "jackets"
  },
  {
    name: "Leather Vest", // ✓ Found!
    score: 0.85,
    category: "vests"
  }
]`
      }
    },
    content: {
      icon: <Book className="w-4 h-4" />,
      title: 'Content Search',
      traditional: {
        code: `// Traditional text search
db.articles.find({
  $text: { 
    $search: "machine learning tutorials" 
  }
})`,
        result: `[
  {
    title: "Machine Learning Tutorial",
    content: "Step by step ML guide..."
  }
  // Misses: "AI learning guide"
  // Misses: "Neural network basics"
]`
      },
      vector: {
        code: `// Semantic content search
const query = "Help me learn about AI and ML";
const embedding = await openai.embeddings.create({
  model: "text-embedding-ada-002",
  input: query
});

await collection.aggregate([
  {
    "$vectorSearch": {
      "queryVector": embedding.data[0].embedding,
      "path": "content_vector",
      "numCandidates": 100
    }
  },
  {
    "$addFields": {
      "score": { "$meta": "vectorSearchScore" }
    }
  }
])`,
        result: `[
  {
    title: "Machine Learning Tutorial",
    score: 0.91,
    content: "Step by step ML guide..."
  },
  {
    title: "AI Learning Guide", // ✓ Found!
    score: 0.88,
    content: "Introduction to AI..."
  },
  {
    title: "Neural Network Basics", // ✓ Found!
    score: 0.85,
    content: "Understanding neural..."
  }
]`
      }
    }
  };
  const handleOpenModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] overflow-y-auto px-4">
      {/* Example Selector - Keep this visible */}
      <div className="sticky top-0 bg-white z-10 pb-4 pt-2">
        <div className="flex justify-center space-x-4 mb-6">
          {Object.entries(examples).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedExample(key)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center space-x-2 ${
                selectedExample === key
                  ? 'bg-blue-500 text-white scale-105'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {value.icon}
              <span>{value.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Traditional Search */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-white">Traditional Search</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm relative">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Query</h4>
              <button
                onClick={() => handleOpenModal(examples[selectedExample].traditional.code)}
                className="text-gray-600 hover:text-gray-800"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
              <code className="language-javascript">{examples[selectedExample].traditional.code}</code>
            </pre>
          </div>
        </div>

        {/* Vector Search */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">Vector Search</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm relative">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Query</h4>
              <button
                onClick={() => handleOpenModal(examples[selectedExample].vector.code)}
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
              <code className="language-javascript">{examples[selectedExample].vector.code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2 ">Key Benefits of Vector Search</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Understands semantic meaning beyond exact matches</span>
          </li>
          <li className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Finds similar items across different categories</span>
          </li>
          <li className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Provides relevance scores for better ranking</span>
          </li>
          <li className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Handles natural language queries effectively</span>
          </li>
        </ul>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        content={modalContent}
      />
    </div>
  );
};

export default CodeComparison;