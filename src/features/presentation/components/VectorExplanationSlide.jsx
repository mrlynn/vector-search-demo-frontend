import React from 'react';
import { ArrowDown, Ruler, Grid } from 'lucide-react';

const VectorExplanationSlide = () => {
  // Sample vector point data
  const pointCoords = [0.2, 0.8, 0.3];

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-black">Understanding Vectors</h2>
          <p className="text-lg text-black">
            Vectors are numerical representations in multi-dimensional space
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Side: Vector Example */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-4">Sample Vector</h3>
              <div className="font-mono text-black text-lg">
                [0.2, 0.8, 0.3]
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Dimension 1: 0.2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-black">Dimension 2: 0.8</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-black">Dimension 3: 0.3</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-4">Vector Properties</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <Ruler className="text-blue-500" />
                  <span className="text-black">Each number represents a position in one dimension</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Grid className="text-blue-500" />
                  <span className="text-black">AI typically uses hundreds or thousands of dimensions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowDown className="text-blue-500" />
                  <span className="text-black">Similar concepts have similar vector values</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Real World Examples */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-black mb-4">Real-World Examples</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium text-black">Text Vectors</h4>
                <div className="p-4 bg-white rounded border border-gray-200">
                  <p className="text-2xl text-black mb-2">"MongoDB is a database"</p>
                  <p className="font-mono text-xs text-black">[0.2, 0.8, 0.3, ...]</p>
                </div>
                <p className="text-2xl text-black">Captures semantic meaning and context</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-black">Image Vectors</h4>
                <div className="p-4 bg-white rounded border border-gray-200">
                  <div className="w-12 h-12 bg-gray-200 rounded mb-2"></div>
                  <p className="font-mono text-xs text-black">[0.7, 0.2, 0.9, ...]</p>
                </div>
                <p className="text-2xl text-black">Represents visual features and patterns</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-black">User Behavior Vectors</h4>
                <div className="p-4 bg-white rounded border border-gray-200">
                  <p className="text-2xl text-black mb-2">Clicks, views, purchases</p>
                  <p className="font-mono text-xs text-black">[0.4, 0.6, 0.1, ...]</p>
                </div>
                <p className="text-2xl text-black">Encodes user preferences and patterns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorExplanationSlide;