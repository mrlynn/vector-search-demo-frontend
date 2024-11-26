// src/features/presentation/components/VectorEmbeddingsExplanation.tsx
import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';

const VectorEmbeddingsExplanation = () => {
  const concepts = [
    {
      title: "Vector Embeddings",
      description: "Transform data into numerical representations that capture meaning and relationships"
    },
    {
      title: "Semantic Understanding",
      description: "Enable computers to grasp the meaning and context behind words and phrases"
    },
    {
      title: "Similarity Search",
      description: "Find related items by measuring how close their vector representations are"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {concepts.map((concept, index) => (
        <Card key={index} className="bg-white shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">{concept.title}</h3>
            <p className="text-gray-600">{concept.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VectorEmbeddingsExplanation;