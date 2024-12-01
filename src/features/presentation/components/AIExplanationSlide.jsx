import React from 'react';
import { Brain, Cpu, ChartLine, Bot } from 'lucide-react';

const AIExplanationSlide = () => {
  const concepts = [
    {
      icon: Brain,
      title: "Pattern Recognition",
      description: "AI systems identify patterns in data, similar to how humans learn from experience"
    },
    {
      icon: Cpu,
      title: "Problem Solving",
      description: "Programs that can analyze complex situations and make intelligent decisions"
    },
    {
      icon: ChartLine,
      title: "Continuous Learning",
      description: "Systems that improve over time through exposure to more data and feedback"
    },
    {
      icon: Bot,
      title: "Task Automation",
      description: "Performing complex tasks that traditionally required human intelligence"
    }
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-black">What is Artificial Intelligence?</h2>
          <p className="text-lg text-black">
            AI is computer systems designed to simulate human intelligence and perform tasks that typically require human-level understanding.
          </p>
        </div>

        {/* Core Concepts Grid */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {concepts.map((concept, index) => {
            const IconComponent = concept.icon;
            return (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-black">{concept.title}</h3>
                    <p className="text-black">{concept.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-black italic">
            Modern AI systems combine these capabilities to solve increasingly complex problems and assist humans in various fields.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIExplanationSlide;