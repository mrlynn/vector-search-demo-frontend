import React, { useState } from 'react';
import { Database, Book, Brain, ArrowRight } from 'lucide-react';

const EvolutionExplorer = () => {
  const [activeSection, setActiveSection] = useState('data');

  const sectionData = {
    data: {
      title: 'Data',
      icon: <Database className="w-6 h-6" />,
      image: '/data.webp',
      definition: 'Raw, unprocessed facts and figures without context or meaning.',
      characteristics: [
        'Data is the building block for knowledge and intelligence',
        'It can be numbers, text, measurements, or observations',
        'Raw data requires processing to be meaningful'
      ],
      purpose: [
        'It serves as input to be processed into meaningful insights',
        'Forms the foundation for all analytical processes'
      ],
      decisionMaking: [
        'Limited utility unless organized and contextualized',
        'Becomes valuable through proper analysis and interpretation'
      ],
      quote: 'Data is the new oil of the digital economy'
    },
    knowledge: {
      title: 'Knowledge',
      icon: <Book className="w-6 h-6" />,
      image: '/knowledge.webp',
      definition: 'Information that has been processed and contextualized to provide meaning and context.',
      characteristics: [
        'Knowledge is derived from data',
        'It is organized and structured to support decision-making',
        'It can be expressed in various forms, including text, numbers, and visualizations'
      ],
      purpose: [
        'It serves as input to be processed into meaningful insights',
        'Forms the foundation for all analytical processes'
      ],
      decisionMaking: [
        'It is essential for making informed decisions',
        'It can be used to predict outcomes and trends',
        'It is a key driver of competitive advantage'
      ],
      quote: 'Knowledge is power'
    },
    intelligence: {
      title: 'Intelligence',
      icon: <Brain className="w-6 h-6" />,
      image: '/intelligence.webp',
      definition: 'The ability to learn, understand, and apply knowledge to make decisions and solve problems.',
      characteristics: [
        'Intelligence is the ability to learn and adapt',
        'It is a complex process that involves multiple cognitive functions',
        'It can be expressed in various forms, including text, numbers, and visualizations'
      ],
      purpose: [
        'It serves as input to be processed into meaningful insights',
        'Forms the foundation for all analytical processes'
      ],
      decisionMaking: [
        'It is essential for making informed decisions',
        'It can be used to predict outcomes and trends',
        'It is a key driver of competitive advantage'
      ],
      quote: 'Understanding is the bridge to innovation'
    }
  };

  const currentSection = sectionData[activeSection];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Navigation Buttons */}
      <div className="flex justify-between border-b">
        {Object.entries(sectionData).map(([key, section], index) => (
          <div key={key} className="flex-1 flex">
            <button
              onClick={() => setActiveSection(key)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 text-lg font-semibold transition-all ${
                activeSection === key
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              {section.icon}
              {section.title}
            </button>
            {index < Object.entries(sectionData).length - 1 && (
              <ArrowRight className="w-6 h-6 text-gray-400 self-center" />
            )}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column: Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentSection.title}</h2>
              <p className="text-lg text-gray-700">{currentSection.definition}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Characteristics</h3>
              <ul className="list-disc pl-6 space-y-2">
                {currentSection.characteristics.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Purpose</h3>
              <ul className="list-disc pl-6 space-y-2">
                {currentSection.purpose.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Role in Decision-Making</h3>
              <ul className="list-disc pl-6 space-y-2">
                {currentSection.decisionMaking.map((item, i) => (
                  <li key={i} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>

            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
              {currentSection.quote}
            </blockquote>
          </div>

          {/* Right Column: Image */}
          <div className="relative">
            <img
              src={currentSection.image}
              alt={currentSection.title}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvolutionExplorer;