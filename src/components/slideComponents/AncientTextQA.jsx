import React, { useState, useRef, useEffect } from "react";
import { Send, Book, User, X, ExternalLink, MapPin } from "lucide-react";
import config from '../../config';

const AssistantAvatar = () => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-50 border border-amber-200 overflow-hidden">
    <img 
      src="/assistant.png" 
      alt="Ancient Egyptian Philosopher" 
      className="w-7 h-7 object-cover"
      style={{ 
        borderRadius: '50%',
        filter: 'sepia(20%)'
      }}
    />
  </div>
);

// Helper function to generate consistent random positions for a book based on its ID
function generateRandomPosition(id) {
  const seed = parseInt(id.slice(-6), 16); // Use the last 6 characters of the ID
  const x = (seed % 1000) / 10; // Normalize to 0-100
  const y = ((seed / 1000) % 1000) / 10; // Normalize to 0-100
  return { x: `${x}%`, y: `${y}%` }; // Return as percentages
}

const BookModal = ({ book, onClose }) => {
  // Generate random position for the pin
  const pinPosition = generateRandomPosition(book._id);

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
              <Book className="w-8 h-8 text-amber-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-900">{book.title}</h3>
              {book.period && (
                <p className="text-sm text-amber-700 mt-1">Period: {book.period}</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {book.description && (
              <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-medium text-amber-900">Description</h4>
                <p className="mt-2 text-amber-800">{book.description}</p>
              </div>
            )}

            {book.contents && (
              <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-medium text-amber-900">Contents</h4>
                <p className="mt-2 text-amber-800">{book.contents}</p>
              </div>
            )}

            {/* Add Map with Pin */}
            <div className="relative mt-6">
              <h4 className="font-medium text-amber-900 mb-2">Pinakes Location</h4>
              <div className="relative w-full h-64 border border-amber-200 rounded-lg overflow-hidden">
                {/* Map Image */}
                <img 
                  src="/map.png" // Ensure this points to your map image
                  alt="Map of Ancient Locations in the Pinakes"
                  className="w-full h-full object-cover"
                />
                {/* Pin Overlay */}
                <div 
                  className="absolute w-6 h-6 bg-red-500 rounded-full shadow-lg flex items-center justify-center"
                  style={{
                    top: pinPosition.y,
                    left: pinPosition.x,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-100/50 px-6 py-4 rounded-b-lg border-t border-amber-200">
          <button
            onClick={() => onClose()}
            className="w-full p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AncientTextQA() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const messagesEndRef = useRef(null);
  const API_URL = config.apiUrl;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBookClick = async (book) => {
    console.log('Clicked book:', book);
    
    try {
      if (!book.title) {
        console.error('No book title provided');
        return;
      }
  
      // Remove duplicate /api from the URL
      const endpoint = `${API_URL}/books/${encodeURIComponent(book._id)}`;
      console.log('Fetching from:', endpoint); // Debug log
  
      const response = await fetch(endpoint);
      console.log('Book details response:', response.status, response.statusText);
      
      if (!response.ok) {
        // Safely handle error response
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error;
        } catch (e) {
          errorMessage = response.statusText;
        }
        throw new Error(`Failed to fetch book details: ${errorMessage}`);
      }
      
      const bookDetails = await response.json();
      console.log('Fetched book details:', bookDetails);
      
      if (!bookDetails) {
        throw new Error('No book details received');
      }
  
      // Set the book details in state
      setSelectedBook({
        ...bookDetails,
        // Make sure we always have required fields
        title: bookDetails.title || book.title,
        description: bookDetails.description || bookDetails.summary || 'No description available',
        period: bookDetails.period || 'Period unknown',
        author: bookDetails.author || 'Author unknown'
      });
    } catch (err) {
      console.error('Error fetching book details:', err);
      // Optionally show error to user
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/ask-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the answer. Please try again.");
      }

      const data = await response.json();
      
      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        books: data.books
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message);
      const errorMessage = {
        type: 'error',
        content: err.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[800px] flex flex-col bg-gradient-to-b from-amber-50 to-amber-100/30 rounded-lg shadow-lg border border-amber-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-amber-200 flex items-center gap-3 bg-amber-50">
        <div className="w-10 h-10">
          <img 
            src="/assistant.png" 
            alt="Ancient Egyptian Philosopher" 
            className="w-full h-full object-cover rounded-full border-2 border-amber-200"
          />
        </div>
        <div>
          <h2 className="font-bold text-amber-900">Ancient Egyptian Wisdom</h2>
          <p className="text-sm text-amber-700">
            Seek knowledge from the ancient texts
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-amber-800 mt-8">
            <div className="w-20 h-20 mx-auto mb-4">
              <img 
                src="/assistant.png" 
                alt="Ancient Egyptian Philosopher" 
                className="w-full h-full object-cover rounded-full border-2 border-amber-200"
              />
            </div>
            <p className="font-serif text-lg">Greetings, seeker of wisdom.</p>
            <p className="text-sm mt-2 text-amber-700">
              Ask about the ancient teachings and sacred texts of Egypt.
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              {message.type === 'user' ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-600">
                  <User className="w-5 h-5 text-amber-50" />
                </div>
              ) : (
                <AssistantAvatar />
              )}
              
              {/* Message Content */}
              <div className="space-y-2">
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user' 
                    ? 'bg-amber-600 text-white' 
                    : message.type === 'error'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {/* Book recommendations */}
                {message.books && message.books.length > 0 && (
  <div className="bg-amber-50 rounded-lg p-3 mt-2 border border-amber-200">
    <h4 className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
      <Book className="w-4 h-4" />
      Sacred Texts:
    </h4>
    <div className="space-y-2">
      {message.books.map((book, idx) => (
        <button
          key={idx}
          onClick={() => handleBookClick(book)} // Pass the entire book object
          className="w-full text-left p-2 rounded hover:bg-amber-100 transition-colors flex items-center gap-2 border border-amber-200"
        >
          <Book className="w-4 h-4 text-amber-700" />
          <div>
            <span className="text-amber-900 font-medium block">{book.title}</span>
            {book.summary && (
              <span className="text-amber-700 text-sm block">{book.summary.substring(0, 100)}...</span>
            )}
          </div>
        </button>
      ))}
    </div>
  </div>
)}
                
                {/* Timestamp */}
                <p className={`text-xs text-amber-700 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center gap-2">
            <AssistantAvatar />
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="w-8 h-2 relative">
                <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-amber-600 animate-bounce" 
                     style={{ animationDelay: '0ms' }}></div>
                <div className="absolute top-0 left-3 w-2 h-2 rounded-full bg-amber-600 animate-bounce" 
                     style={{ animationDelay: '300ms' }}></div>
                <div className="absolute top-0 left-6 w-2 h-2 rounded-full bg-amber-600 animate-bounce" 
                     style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-amber-200 bg-amber-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask your question, seeker of wisdom..."
            className="flex-1 p-3 rounded-full border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-amber-900 placeholder-amber-300"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-amber-600 text-white p-3 rounded-full hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Book Details Modal */}
      {selectedBook && (
  <BookModal 
    book={selectedBook} 
    onClose={() => setSelectedBook(null)} 
  />
)}
    </div>
  );
}