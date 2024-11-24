const { MongoClient } = require('mongodb');
const OpenAI = require('openai');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ancientTexts = [
  {
    title: "Book of the Dead",
    author: "Various Egyptian Priests",
    summary: "A collection of funerary texts consisting of spells and instructions to help the deceased navigate the afterlife.",
    period: "New Kingdom",
    date: "1550-1070 BCE",
    contents: "Collection of approximately 200 spells and ritual instructions including the famous Weighing of the Heart ceremony.",
    significance: "One of the most important religious texts in ancient Egyptian history, providing detailed insights into Egyptian beliefs about death and the afterlife.",
    keywords: [
      "afterlife",
      "funerary rituals",
      "spells",
      "Weighing of the Heart",
      "Osiris",
      "judgment",
      "immortality"
    ],
    references: [
      {
        title: "The Egyptian Book of the Dead - British Museum",
        url: "https://www.britishmuseum.org/collection/egyptian-book-dead"
      }
    ]
  },
  {
    title: "Pyramid Texts",
    author: "Royal Scribes of the Old Kingdom",
    summary: "The oldest known religious texts in the world, inscribed on pyramid walls. Contains spells for the pharaoh's resurrection and ascension.",
    period: "Old Kingdom",
    date: "2400-2300 BCE",
    contents: "Spells and rituals for the pharaoh's afterlife journey, astronomical observations, and divine ceremonies.",
    significance: "Earliest known corpus of ancient Egyptian religious texts, fundamental to understanding early Egyptian beliefs.",
    keywords: [
      "pyramids",
      "royal afterlife",
      "resurrection",
      "ascension",
      "stellar religion",
      "divine kingship"
    ]
  },
  {
    title: "Instructions of Ptahhotep",
    author: "Ptahhotep",
    summary: "A collection of wisdom teachings from the vizier Ptahhotep, offering advice on behavior, social relationships, and moral living.",
    period: "Middle Kingdom",
    date: "2000-1800 BCE",
    contents: "Maxims and teachings on proper conduct, leadership, and wisdom.",
    significance: "One of the earliest works of moral philosophy and wisdom literature.",
    keywords: [
      "wisdom literature",
      "moral teachings",
      "leadership",
      "social conduct",
      "ethics",
      "vizier"
    ]
  },
  {
    title: "Tale of the Shipwrecked Sailor",
    author: "Unknown",
    summary: "A narrative text telling the story of a sailor who becomes shipwrecked on a magical island and encounters a giant serpent.",
    period: "Middle Kingdom",
    date: "2000-1700 BCE",
    contents: "Adventure story with moral and religious themes",
    significance: "Important example of ancient Egyptian literature combining entertainment with moral instruction.",
    keywords: [
      "adventure",
      "mythology",
      "serpent",
      "magical island",
      "narrative",
      "literature"
    ]
  },
  {
    title: "Coffin Texts",
    author: "Various Egyptian Priests",
    summary: "Collection of funerary spells painted on coffins, evolved from the Pyramid Texts and predecessor to the Book of the Dead.",
    period: "Middle Kingdom",
    date: "2134-1991 BCE",
    contents: "Spells for protection and guidance in the afterlife, accessible to non-royal Egyptians.",
    significance: "Demonstrates the democratization of the afterlife in ancient Egyptian society.",
    keywords: [
      "afterlife",
      "spells",
      "coffins",
      "funerary texts",
      "protection",
      "democratic afterlife"
    ]
  },
  {
    title: "Story of Sinuhe",
    author: "Unknown",
    summary: "A literary tale about an Egyptian official who flees Egypt, lives in foreign lands, and eventually returns home.",
    period: "Middle Kingdom",
    date: "1900 BCE",
    contents: "Narrative combining adventure, political themes, and cultural identity.",
    significance: "Considered one of the finest works of ancient Egyptian literature.",
    keywords: [
      "exile",
      "adventure",
      "politics",
      "cultural identity",
      "autobiography",
      "literature"
    ]
  }
];

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection('books');

    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing data');

    // Process each text
    for (const text of ancientTexts) {
      console.log(`Processing ${text.title}...`);

      // Generate embeddings for title and description
      const titleEmbedding = await generateEmbedding(text.title);
      const descriptionEmbedding = await generateEmbedding(text.summary);

      // Create searchable title
      const searchableTitle = text.title.toLowerCase().replace(/[^a-z0-9 ]/g, '');

      // Create the document with all fields
      const document = {
        ...text,
        title_embedding: titleEmbedding,
        description_embedding: descriptionEmbedding,
        searchableTitle,
        metadata: {
          dateAdded: new Date(),
          lastUpdated: new Date(),
          searchableTitle
        }
      };

      await collection.insertOne(document);
      console.log(`Added ${text.title}`);
    }

    console.log('Database seeding complete');

    // Create indexes
    await collection.createIndex({ searchableTitle: 1 });
    await collection.createIndex({ keywords: 1 });
    await collection.createIndex({ period: 1 });
    await collection.createIndex({ title: 1 });

    // Create vector search index
    await collection.createIndex(
      { description_embedding: "vectorSearch" },
      {
        name: "vector_index",
        vectorSearchOptions: {
          dimension: 384,  // for text-embedding-3-small
          similarity: "cosine"
        }
      }
    );

    console.log('Indexes created successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seeder
seedDatabase().catch(console.error);