const { MongoClient } = require("mongodb");
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;
const collectionName = process.env.COLLECTION_NAME;

async function migrateBooks() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Get all existing documents
    const documents = await collection.find({}).toArray();
    console.log(`Found ${documents.length} documents to migrate`);

    for (const doc of documents) {
      // Create new book structure
      const newBook = {
        title: doc.title,
        summary: doc.description, // Using existing description as summary
        category: "Ancient Egyptian Texts", // Default category
        period: doc.era || "Unknown",
        significance: null, // Can be filled later
        contents: null, // Can be filled later
        keywords: doc.concepts || [], // Using existing concepts as keywords
        date: doc.year || "Unknown",
        author: doc.author || "Unknown",
        embeddings: {
          description: doc.description_embedding,
          title: doc.title_embedding
        },
        metadata: {
          dateAdded: doc.dateAdded || new Date(),
          lastUpdated: new Date(),
          searchableTitle: doc.searchableTitle
        },
        references: [] // Can be filled later
      };

      // Update the document
      await collection.updateOne(
        { _id: doc._id },
        { 
          $set: newBook,
          $unset: {
            description_embedding: "",
            title_embedding: "",
            description: "",
            era: "",
            year: "",
            concepts: ""
          }
        }
      );

      console.log(`Migrated document: ${doc.title}`);
    }

    console.log('Migration completed');

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the migration
migrateBooks().catch(console.error);