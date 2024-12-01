// src/features/presentation/slides/vectorEducationSlides.ts
import { SlideSection } from '../types/slideTypes';
import TitleSlide from '../components/TitleSlide';
import VectorFieldVisualizer from '../components/VectorFieldVisualizer';
import {
  Vector2DVisualization,
  Vector3DVisualization,
  VectorMathVisualization,
  VectorSpaceVisualization,
  AtlasVectorVisualizer,
  Atlas3DVisualizer,
  Vector3DForce
} from '../components';

export const vectorEducationSlides: SlideSection = {
  id: 'vector-education',
  title: 'Understanding Vectors',
  description: 'From Words to High-Dimensional Space',
  duration: 10,
  slides: [
    {
        id: 'vectors-title',
        type: 'title-full',
        title: 'vectors',
        content: '',
        note: '',
        component: TitleSlide,
        textStyle: {
          tracking: '0.15em',
          fontSize: 'clamp(2rem, 15vw, 8rem)',
          fontWeight: '900',
          fontFamily: '"Archivo Black", system-ui, -apple-system, sans-serif'
        },
        speakerNotes: [
          'Simple, impactful title slide',
          'Let the concept sink in'
        ],
        duration: 0.5
      },{
      id: 'words-as-vectors',
      type: 'split',
      title: 'Words as Numbers',
      note: 'VECTOR FOUNDATIONS',
      content: `
## How Machines Understand Words

Consider these relationships:
- King is to Queen as Man is to Woman
- Sister is to Brother as Daughter is to Son
- Morning is to Breakfast as Evening is to Dinner

**Machines learn these patterns through vectors!**

> These relationships can be represented mathematically, 
> allowing computers to understand meaning.
      `,
      image: '/word-relationships.png',
      duration: 2,
      speakerNotes: [
        'Start with familiar analogies everyone knows',
        'Introduce the concept of word relationships as patterns',
        'Build anticipation for how machines understand this',
        'Set up the transition to mathematical representation'
      ]
    },
    {
      id: '2d-vectors',
      type: 'text-full',
      title: '2D Vector Space',
      note: '2D VECTORS',
      component: Vector2DVisualization,
      content: `
## Understanding 2D Vectors

\`\`\`javascript
// Words as 2D coordinates
const vectors = {
  king:    [0.9, 0.7],  // [royal, male]
  queen:   [0.9, 0.2],  // [royal, female]
  man:     [0.2, 0.7],  // [common, male]
  woman:   [0.2, 0.2]   // [common, female]
}

// Finding similarity between words
const similarity = cosineSimilarity(
  vectors.king, 
  vectors.queen
) // Returns: 0.85 (very similar)
\`\`\`
      `,
      duration: 2,
      speakerNotes: [
        'Introduce 2D space with familiar x-y coordinates',
        'Show how words become points in space',
        'Demonstrate how distance represents meaning',
        'Use interactive visualization to show relationships'
      ]
    },
    {
      id: '3d-vectors',
      type: 'text-full',
      title: 'Adding a Third Dimension',
      note: '3D VECTORS',
      component: Vector3DForce,
      content: `
## 3D Vector Space

\`\`\`javascript
// Words as 3D coordinates
const vectors = {
  // [royal, gender, age]
  king:    [0.9, 0.7, 0.8], // royal, male, older
  queen:   [0.9, 0.2, 0.8], // royal, female, older
  prince:  [0.9, 0.7, 0.2], // royal, male, younger
  princess:[0.9, 0.2, 0.2]  // royal, female, younger
}

// Complex relationships emerge
const youngRoyalty = vectors.filter(v => 
  v[0] > 0.7 && v[2] < 0.5
)
\`\`\`
      `,
      duration: 2,
      speakerNotes: [
        'Show how adding a dimension enables richer relationships',
        'Demonstrate real 3D vector examples',
        'Explain how each dimension adds meaning',
        'Use visualization to show clustering'
      ]
    },
    {
      id: 'vector-math',
      type: 'split',
      title: 'Vector Mathematics',
      note: 'VECTOR OPERATIONS',
      content: `
## The Magic of Vector Math

Famous Example:
King - Man + Woman ≈ Queen

\`\`\`javascript
// Vector operations
function vectorAdd(a, b) {
  return a.map((x, i) => x + b[i])
}

function vectorSubtract(a, b) {
  return a.map((x, i) => x - b[i])
}

// King - Man + Woman = ?
const result = vectorAdd(
  vectorSubtract(vectors.king, vectors.man),
  vectors.woman
)
// result ≈ vectors.queen
\`\`\`

> These operations enable semantic reasoning!
      `,
      image: '/vector-math.png',
      duration: 2,
      speakerNotes: [
        'Introduce vector arithmetic with word2vec example',
        'Show how math operations reveal meaning',
        'Demonstrate practical vector calculations',
        'Connect math to semantic understanding'
      ]
    },
    {
      id: 'vector-field',
      type: 'text-full',
      title: 'Vector Field',
      note: 'VECTOR FIELD',
      component: VectorFieldVisualizer,
      content: '',
      duration: 2,
    },
    {
      id: 'atlas-vector-visualizer',
      type: 'text-full',
      title: 'Atlas Vector Visualizer',
      note: 'ATLAS VECTOR VISUALIZER',
      component: AtlasVectorVisualizer,
      content: '',
      duration: 2,
    },
    {
      id: 'atlas-3d-visualizer',
      type: 'text-full',
      title: 'Atlas 3D Visualizer',
      note: 'ATLAS 3D VISUALIZER',
      component: Atlas3DVisualizer,
      content: '',
      duration: 2,
    },
    {
      id: 'high-dimensions',
      type: 'text-full',
      title: 'Beyond Three Dimensions',
      note: 'HIGH DIMENSIONS',
      component: Vector3DForce,
      content: `
## Real-World Vector Embeddings

Common embedding dimensions:
- OpenAI ada-002: 1536D
- CLIP: 512D
- BERT: 768D

Why so many dimensions?
- Capture subtle meanings
- Enable complex relationships
- Improve accuracy

\`\`\`javascript
// Real-world example with MongoDB
db.products.aggregate([
  {
    "$vectorSearch": {
      "queryVector": embedding, // 1536D vector
      "path": "description_vector",
      "numCandidates": 100,
      "index": "vector_index"
    }
  }
])
\`\`\`
      `,
      duration: 2,
      speakerNotes: [
        'Connect previous concepts to production use',
        'Explain why we need high dimensions',
        'Show real MongoDB vector search example',
        'Transition to practical applications'
      ]
    }
  ]
};

export default vectorEducationSlides;