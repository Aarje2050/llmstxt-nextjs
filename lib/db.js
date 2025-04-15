// lib/db.js
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB Connection URL - use environment variable in production
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || "llms_txt_generator";

// Global variable to cache the database connection
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // If the connection is already established, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Set the connection options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    // Connect to the cluster
    const client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    const db = client.db(MONGODB_DB);

    // Cache the client and database connection
    cachedClient = client;
    cachedDb = db;

    console.log("Connected successfully to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Helper function to convert string ID to ObjectId
export function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
}