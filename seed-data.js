import { MongoClient } from 'mongodb';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = "product_search";
const collectionName = "products";

const products = [
  {
    title: "Professional DSLR Camera",
    description: "High-end digital camera with 24MP full-frame sensor, 4K video capabilities, weather-sealed body, and advanced autofocus system. Perfect for professional photography and videography.",
    category: "Electronics",
    price: 1299.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Ergonomic Office Chair",
    description: "Premium mesh office chair with adjustable lumbar support, 4D armrests, synchronized tilt mechanism, and breathable fabric. Designed for all-day comfort.",
    category: "Furniture",
    price: 299.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Wireless Noise-Cancelling Headphones",
    description: "Over-ear headphones with active noise cancellation, 30-hour battery life, premium audio drivers, and comfortable memory foam ear cushions.",
    category: "Electronics",
    price: 249.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 20+ sport modes. Water-resistant and features a bright AMOLED display.",
    category: "Wearables",
    price: 199.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Leather Messenger Bag",
    description: "Handcrafted full-grain leather messenger bag with padded laptop compartment, multiple organizer pockets, and adjustable shoulder strap.",
    category: "Accessories",
    price: 159.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Smart Home Security Camera",
    description: "1080p HD security camera with night vision, two-way audio, motion detection, and cloud storage. Easy to set up and monitor from your smartphone.",
    category: "Smart Home",
    price: 79.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Portable Power Bank",
    description: "20000mAh high-capacity power bank with fast charging, multiple ports, and LED display. Charges multiple devices simultaneously.",
    category: "Electronics",
    price: 49.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Yoga Mat Premium",
    description: "Extra thick eco-friendly yoga mat with alignment lines, non-slip surface, and carrying strap. Perfect for yoga, pilates, and floor exercises.",
    category: "Fitness",
    price: 39.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Smart LED Light Bulbs (4-Pack)",
    description: "Color-changing smart LED bulbs compatible with voice assistants. Features millions of colors, schedules, and scene settings.",
    category: "Smart Home",
    price: 44.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with hot-swappable switches, macro keys, and aircraft-grade aluminum construction. Features anti-ghosting and N-key rollover.",
    category: "Gaming",
    price: 129.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Minimalist Wall Clock",
    description: "Modern wall clock with silent sweep movement, brushed metal finish, and clean design. Perfect for home or office.",
    category: "Home Decor",
    price: 34.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Air Purifier Pro",
    description: "HEPA air purifier with activated carbon filter, air quality sensor, and quiet operation. Covers up to 500 square feet.",
    category: "Appliances",
    price: 199.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Wireless Charging Pad",
    description: "Fast wireless charger compatible with all Qi-enabled devices. Features LED indicator and foreign object detection.",
    category: "Electronics",
    price: 29.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Premium Coffee Maker",
    description: "Programmable coffee maker with thermal carafe, brew strength control, and self-cleaning function. Makes up to 12 cups.",
    category: "Appliances",
    price: 149.99,
    image: "/api/placeholder/400/400"
  },
  {
    title: "Smart Door Lock",
    description: "Keyless entry door lock with fingerprint scanner, PIN code, and smartphone control. Features automatic locking and temporary access codes.",
    category: "Smart Home",
    price: 199.99,
    image: "/api/placeholder/400/400"
  }
];

async function generateEmbeddings() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Generate embeddings for each product
    for (const product of products) {
      console.log(`Generating embedding for: ${product.title}`);
      
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${product.title} ${product.description} ${product.category}`
      });

      const productWithEmbedding = {
        ...product,
        description_embedding: embeddingResponse.data[0].embedding
      };

      // Insert or update the product
      await collection.updateOne(
        { title: product.title },
        { $set: productWithEmbedding },
        { upsert: true }
      );

      console.log(`Added/updated product: ${product.title}`);
    }

    console.log("All products processed successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
    console.log("Database connection closed");
  }
}

// Run the script
generateEmbeddings().catch(console.error);