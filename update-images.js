import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = "product_search";
const collectionName = "products";

// Function to generate a relevant placeholder image URL based on category
function getPlaceholderImage(category) {
  const size = '400x400';
  const bgColor = 'e2e8f0';
  const textColor = '1e293b';
  let text = encodeURIComponent(category);
  
  return `https://placehold.co/${size}/${bgColor}/${textColor}?text=${text}`;
}

async function updateProductImages() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Get all products
    const products = await collection.find({}).toArray();
    console.log(`Found ${products.length} products to update`);

    // Update each product
    for (const product of products) {
      const newImageUrl = getPlaceholderImage(product.category);
      
      await collection.updateOne(
        { _id: product._id },
        { 
          $set: { 
            image: newImageUrl 
          } 
        }
      );
      
      console.log(`Updated image for: ${product.title}`);
    }

    console.log("All product images updated successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
    console.log("Database connection closed");
  }
}

// Run the update
updateProductImages().catch(console.error);