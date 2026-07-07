import 'dotenv/config'
import mongoose from 'mongoose'
import { seedDatabase } from './seedData.js'

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Set it in server/.env before seeding a real database.')
    process.exit(1)
  }
  await mongoose.connect(process.env.MONGO_URI)
  const result = await seedDatabase()
  console.log(`Seeded ${result.categories} categories and ${result.products} products.`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
