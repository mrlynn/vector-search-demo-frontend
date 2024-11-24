require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const mongoUri = process.env.MONGODB_URI;
const dbName = "product_search";
const ancientTextsCollection = "ancient_texts";
const booksCollection = "books";

const migrateData = async () => {
  const client = new MongoClient(mongoUri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const ancientTexts = db.collection(ancientTextsCollection);
    const books = db.collection(booksCollection);

    // Fetch all documents from `ancient_texts`
    const texts = await ancientTexts.find({}).toArray();
    console.log(`Found ${texts.length} documents in ${ancientTextsCollection}`);

    const migratedData = texts.map((doc) => {
      const {
        title,
        author,
        description, // map to summary
        period,
        date,
        contents,
        significance,
        keywords,
        description_embedding, // preserve embeddings
        title_embedding,
        ...rest
      } = doc;

      // Transform to match Book model
      return {
        title,
        author,
        summary: description || "No summary provided",
        period: period || "Unknown",
        date,
        contents,
        significance,
        keywords: keywords || [],
        embeddings: {
          description: description_embedding,
          title: title_embedding,
        },
        metadata: {
          dateAdded: new Date(),
          lastUpdated: new Date(),
          ...rest.metadata,
        },
        references: rest.references || [],
      };
    });

    // Insert transformed data into `books`
    const result = await books.insertMany(migratedData);
    console.log(`Migrated ${result.insertedCount} documents into ${booksCollection}`);

    // Drop `ancient_texts` collection
    await ancientTexts.drop();
    console.log(`Dropped ${ancientTextsCollection}`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.close();
  }
};

migrateData();
