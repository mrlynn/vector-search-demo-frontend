// First, create a new component for the diagrams
import React from 'react';
import Mermaid from './components/ui/mermaid'; // Assuming you have a Mermaid component

const SearchFlowDiagram = ({ searchType }) => {

  const diagrams = {
    basic: `flowchart LR
      Query[/"User Query"/]
      DB[(MongoDB)]
      Results[/"Search Results"/]
      
      subgraph Regular Expression Search
          Regex["$regex Operator<br>Case-insensitive"]
      end
      
      Query --> Regex
      Regex --> DB
      DB --> Results

      style Query fill:#E3FCF7,stroke:#001E2B
      style DB fill:#00ED64,stroke:#001E2B
      style Results fill:#E3FCF7,stroke:#001E2B
      style Regex fill:#fff,stroke:#001E2B`,

    atlas: `flowchart LR
      Query[/"User Query"/]
      DB[(MongoDB)]
      Results[/"Scored Results"/]
      
      subgraph "Atlas Search"
          direction TB
          Fuzzy["Fuzzy Matching<br>Handle typos"]
          Auto["Autocomplete<br>Partial words"]
          Phrase["Phrase Matching<br>Exact matches"]
          
          Score["Score & Highlight<br>Compute relevance"]
      end
      
      Query --> Fuzzy & Auto & Phrase
      Fuzzy & Auto & Phrase --> Score
      Score --> DB
      DB --> Results

      style Query fill:#E3FCF7,straoke:#001E2B
      style DB fill:#00ED64,stroke:#001E2B
      style Results fill:#E3FCF7,stroke:#001E2B
      style Score fill:#fff,stroke:#001E2B
      style Fuzzy fill:#fff,stroke:#001E2B
      style Auto fill:#fff,stroke:#001E2B
      style Phrase fill:#fff,stroke:#001E2B`,

    vector: `flowchart LR
      Query[/"User Query"/]
      OpenAI{"OpenAI<br>Embeddings"}
      DB[(MongoDB)]
      Results[/"Similarity Ranked<br>Results"/]
      
      subgraph "Vector Search"
          direction TB
          Vector["Vector Generation"]
          KNN["k-Nearest Neighbors<br>Similarity Search"]
      end
      
      Query --> OpenAI
      OpenAI --> Vector
      Vector --> KNN
      KNN --> DB
      DB --> Results

      style Query fill:#E3FCF7,stroke:#001E2B
      style DB fill:#00ED64,stroke:#001E2B
      style Results fill:#E3FCF7,stroke:#001E2B
      style OpenAI fill:#fff,stroke:#001E2B
      style Vector fill:#fff,stroke:#001E2B
      style KNN fill:#fff,stroke:#001E2B`,

    semantic: `flowchart LR
      Query[/"User Query"/]
      GPT4{"GPT-4<br>Query Enhancement"}
      OpenAI{"OpenAI<br>Embeddings"}
      DB[(MongoDB)]
      Results[/"Semantic Matches"/]
      
      subgraph "Semantic Search"
          direction TB
          Enhance["Query Enhancement"]
          Vector["Vector Generation"]
          KNN["k-Nearest Neighbors<br>Similarity Search"]
      end
      
      Query --> GPT4
      GPT4 --> Enhance
      Enhance --> OpenAI
      OpenAI --> Vector
      Vector --> KNN
      KNN --> DB
      DB --> Results

      style Query fill:#E3FCF7,stroke:#001E2B
      style DB fill:#00ED64,stroke:#001E2B
      style Results fill:#E3FCF7,stroke:#001E2B
      style GPT4 fill:#fff,stroke:#001E2B
      style OpenAI fill:#fff,stroke:#001E2B
      style Enhance fill:#fff,stroke:#001E2B
      style Vector fill:#fff,stroke:#001E2B
      style KNN fill:#fff,stroke:#001E2B`,

    image: `flowchart LR
      Image[/"Uploaded Image"/]
      Vision{"GPT-4 Vision<br>Image Analysis"}
      OpenAI{"OpenAI<br>Embeddings"}
      DB[(MongoDB)]
      Results[/"Similar Products"/]
      
      subgraph "Image Search"
          direction TB
          Describe["Image Description"]
          Vector["Vector Generation"]
          KNN["k-Nearest Neighbors<br>Similarity Search"]
      end
      
      Image --> Vision
      Vision --> Describe
      Describe --> OpenAI
      OpenAI --> Vector
      Vector --> KNN
      KNN --> DB
      DB --> Results

      style Image fill:#E3FCF7,stroke:#001E2B
      style DB fill:#00ED64,stroke:#001E2B
      style Results fill:#E3FCF7,stroke:#001E2B
      style Vision fill:#fff,stroke:#001E2B
      style OpenAI fill:#fff,stroke:#001E2B
      style Describe fill:#fff,stroke:#001E2B
      style Vector fill:#fff,stroke:#001E2B
      style KNN fill:#fff,stroke:#001E2B`
  };
  const currentDiagram = diagrams[searchType] || diagrams.basic;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      
      <h3 className="text-lg font-semibold text-[#001E2B] mb-4">
        {searchType.charAt(0).toUpperCase() + searchType.slice(1)} Flow Diagram
      </h3>
      <div key={searchType} className="overflow-x-auto">
        <Mermaid chart={currentDiagram} />
      </div>
    </div>
  );
};

export default SearchFlowDiagram;