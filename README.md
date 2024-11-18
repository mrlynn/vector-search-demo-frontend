# MongoDB Search Evolution Frontend

This is the **frontend** for the **MongoDB Search Evolution Demo** application. It is designed to showcase various search methodologies supported by MongoDB, including **Basic Find**, **Atlas Search**, **Vector Search**, **Semantic Search**, and **Image Search**, through a user-friendly interface. The frontend allows users to explore and compare these search methods with visual explanations and interactive components.

---

## Features

1. **Search Modes**:
   - **Basic Find**: Simple regex-based queries.
   - **Atlas Search**: Advanced full-text search with fuzzy matching, autocomplete, and phrase matching.
   - **Vector Search**: Semantic search using vector similarity with OpenAI embeddings.
   - **Semantic Search**: Enhanced vector search with GPT-generated descriptions.
   - **Image Search**: Search by images with embedded metadata.

2. **Flow Diagrams**:
   - Each search mode features an interactive flow diagram to visually explain the data flow and methodology.
   - Diagrams are accessible via modals to optimize screen space.

3. **Search Comparison**:
   - Compare results across different search types side-by-side for better understanding.

4. **Highlighted Results**:
   - Relevant search terms are highlighted in the results for better clarity.

---

## Getting Started

### Prerequisites

- **Node.js**: Install [Node.js](https://nodejs.org/) (version 14 or later recommended).
- **Backend Service**: Ensure the backend server for the MongoDB Search Evolution Demo is running. The frontend communicates with the backend through its API.

---

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd frontend
