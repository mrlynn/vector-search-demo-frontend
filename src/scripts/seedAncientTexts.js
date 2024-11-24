import { MongoClient } from 'mongodb';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const ancientTexts = [
    {
        title: "Book of the Dead",
        author: "Multiple Temple Scribes",
        description: "A comprehensive guide to the afterlife containing magical spells, rituals, and prayers for the deceased's journey through the Duat. Includes instructions for passing judgment before Osiris and navigating the underworld safely.",
        concepts: ["afterlife", "spiritual guidance", "divine judgment", "magical protection", "soul journey", "immortality", "ritual magic", "underworld navigation"],
        era: "New Kingdom",
        year: "1550 BCE"
    },
    {
        title: "Teachings of Ptahhotep",
        author: "Ptahhotep, Vizier of Djedkare Isesi",
        description: "Collection of wisdom teachings focusing on moral behavior, social justice, and proper conduct in ancient Egyptian society. Contains advice on leadership, humility, and maintaining harmony in relationships.",
        concepts: ["wisdom", "ethics", "leadership", "social harmony", "moral conduct", "justice", "education", "hierarchy"],
        era: "Old Kingdom",
        year: "2400 BCE"
    },
    {
        title: "Pyramid Texts",
        author: "Royal Scribes of the Old Kingdom",
        description: "The oldest known religious texts in the world, inscribed on pyramid walls. Contains spells for the pharaoh's resurrection, ascension to the heavens, and union with the gods. Includes astronomical observations and divine rituals.",
        concepts: ["royal afterlife", "divine kingship", "resurrection", "celestial journey", "sacred rituals", "astronomical knowledge", "divine protection"],
        era: "Old Kingdom",
        year: "2400-2300 BCE"
    },
    {
        title: "Instructions of Amenemhat",
        author: "Amenemhat I",
        description: "Royal testament offering political wisdom and warnings about trust and loyalty. Written as advice from a murdered king to his son, discussing kingship, betrayal, and the nature of power.",
        concepts: ["kingship", "political wisdom", "trust", "loyalty", "power", "succession", "royal guidance"],
        era: "Middle Kingdom",
        year: "1975 BCE"
    },
    {
        title: "The Tale of Sinuhe",
        author: "Unknown Court Scribe",
        description: "Literary masterpiece telling the story of an Egyptian official who flees Egypt and finds success abroad. Explores themes of loyalty, identity, homeland, and divine providence in ancient Egyptian culture.",
        concepts: ["exile", "identity", "divine providence", "loyalty", "homecoming", "foreign lands", "royal service"],
        era: "Middle Kingdom",
        year: "1875 BCE"
    },
    {
        title: "Coffin Texts",
        author: "Various Priests and Scribes",
        description: "Collection of funerary spells and incantations inscribed on coffins. Provides magical protection and guidance for common citizens in the afterlife, including spells for transformation and divine protection.",
        concepts: ["afterlife protection", "magical transformation", "divine spells", "netherworld guidance", "soul preservation"],
        era: "Middle Kingdom",
        year: "2134-2000 BCE"
    },
    {
        title: "The Story of the Shipwrecked Sailor",
        author: "Unknown Scribe",
        description: "Tale of a sailor's magical encounter with a divine serpent on a mysterious island. Combines adventure with wisdom literature, teaching lessons about courage, faith, and divine intervention.",
        concepts: ["adventure", "divine encounter", "courage", "storytelling", "wisdom", "supernatural beings"],
        era: "Middle Kingdom",
        year: "2000 BCE"
    },
    {
        title: "The Maxims of Ani",
        author: "Scribe Ani",
        description: "Collection of moral and practical teachings covering daily life, social behavior, and religious obligations. Includes advice on family relations, business practices, and proper conduct in society.",
        concepts: ["practical wisdom", "moral behavior", "social conduct", "family life", "religious duties", "education"],
        era: "New Kingdom",
        year: "1550-1069 BCE"
    },
    {
        title: "Great Hymn to the Aten",
        author: "Akhenaten",
        description: "Revolutionary religious text praising the sun disk as the sole deity. Represents a unique period of ancient Egyptian monotheism, describing the Aten's role as creator and sustainer of all life.",
        concepts: ["monotheism", "solar worship", "religious reform", "creation", "divine power", "natural order"],
        era: "New Kingdom",
        year: "1353-1336 BCE"
    },
    {
        title: "Wisdom of Amenemope",
        author: "Amenemope",
        description: "Sophisticated wisdom text teaching moral behavior and proper conduct. Influences later religious texts, including portions of the Hebrew Bible, particularly the Book of Proverbs.",
        concepts: ["wisdom literature", "moral teachings", "international influence", "proper behavior", "divine justice"],
        era: "New Kingdom",
        year: "1100 BCE"
    }
];

async function generateEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}

async function seedDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db("product_search");
        const collection = db.collection("ancient_texts");

        // Clear existing data
        await collection.deleteMany({});
        console.log('Cleared existing data');

        // Generate embeddings and insert texts
        for (const text of ancientTexts) {
            const combinedText = `${text.title} ${text.description} ${text.concepts.join(' ')}`;
            const embedding = await generateEmbedding(combinedText);
            
            await collection.insertOne({
                ...text,
                description_embedding: embedding,
                dateAdded: new Date(),
                searchableTitle: text.title.toLowerCase()
            });
            
            console.log(`Added: ${text.title}`);
        }

        // Create indexes
        await collection.createIndex({ title: "text", description: "text" });
        
        // Create vector search index
        const vectorIndex = {
            name: "vector_index",
            definition: {
                mappings: {
                    dynamic: false,
                    fields: {
                        description_embedding: {
                            type: "knnVector",
                            dimensions: 1536,
                        }
                    }
                }
            }
        };

        try {
            await collection.createSearchIndex(vectorIndex);
            console.log("Created vector search index");
        } catch (error) {
            console.warn("Warning: Vector search index creation failed:", error.message);
        }

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
    }
}

// Run the seeder
seedDatabase().catch(console.error);