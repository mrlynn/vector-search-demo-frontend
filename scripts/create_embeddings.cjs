require("dotenv").config();
const { MongoClient } = require('mongodb');
const OpenAI = require('openai');

// MongoDB and OpenAI configuration from .env
const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;
const collectionName = process.env.COLLECTION_NAME;
const openaiApiKey = process.env.OPENAI_API_KEY;

// Validate environment variables
if (!mongoUri || !databaseName || !collectionName || !openaiApiKey) {
  console.error("Missing required environment variables. Check your .env file.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiApiKey });
const client = new MongoClient(mongoUri);

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    // The new OpenAI API returns the embedding directly in the data array
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding for text:", text, error.message);
    throw error;
  }
}

async function updateEmbeddings() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const collection = client.db(databaseName).collection(collectionName);
    
    // Create an index for vector search if it doesn't exist

    const cursor = collection.find({ title_embedding: { $exists: false } });
    let count = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      console.log(`Processing document with _id: ${doc._id}`);

      const title = doc.title;
      if (!title) {
        console.warn(`Skipping document with _id: ${doc._id} (no title)`);
        continue;
      }

      try {
        const embedding = await generateEmbedding(title);
        
        await collection.updateOne(
          { _id: doc._id },
          { $set: { title_embedding: embedding } }
        );

        console.log(`Updated document with _id: ${doc._id}`);
        count++;
        
        // Add a small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (embeddingError) {
        console.error(`Error processing document with _id: ${doc._id}`, embeddingError.message);
      }
    }

    console.log(`Finished processing ${count} documents.`);
  } catch (error) {
    console.error("Error in updateEmbeddings:", error.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Execute the update
updateEmbeddings().catch(console.error);