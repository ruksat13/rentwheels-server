const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

async function run() {
    try {
        await client.connect()
        console.log('Connected to MongoDB!')

        const db = client.db('rentwheels')
        const carsCollection = db.collection('cars')
        const bookingsCollection = db.collection('bookings')

        // Test route
        app.get('/', (req, res) => {
            res.send('RentWheels Server is Running!')
        })

        // Get all cars
        app.get('/cars', async (req, res) => {
            const result = await carsCollection.find().sort({ _id: -1 }).toArray()
            res.send(result)
        })

        // Get newest 6 cars for home page
        app.get('/cars/featured', async (req, res) => {
            const result = await carsCollection.find().sort({ _id: -1 }).limit(6).toArray()
            res.send(result)
        })

        // Get single car
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await carsCollection.findOne(query)
            res.send(result)
        })

        // Get cars by provider email
        app.get('/my-cars', async (req, res) => {
            const email = req.query.email
            const query = { providerEmail: email }
            const result = await carsCollection.find(query).toArray()
            res.send(result)
        })

        // Add car
        app.post('/cars', async (req, res) => {
            const car = req.body
            const result = await carsCollection.insertOne(car)
            res.send(result)
        })

        // Update car
        app.put('/cars/:id', async (req, res) => {
            const id = req.params.id
            const car = req.body
            const filter = { _id: new ObjectId(id) }
            const updated = { $set: car }
            const result = await carsCollection.updateOne(filter, updated)
            res.send(result)
        })

        // Delete car
        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await carsCollection.deleteOne(query)
            res.send(result)
        })

        // Add booking
        app.post('/bookings', async (req, res) => {
            const booking = req.body
            // Check if car is already booked
            const existing = await bookingsCollection.findOne({ carId: booking.carId })
            if (existing) {
                return res.send({ alreadyBooked: true })
            }
            const result = await bookingsCollection.insertOne(booking)
            // Update car status to booked
            await carsCollection.updateOne(
                { _id: new ObjectId(booking.carId) },
                { $set: { status: 'booked' } }
            )
            res.send(result)
        })

        // Get bookings by user email
        app.get('/bookings', async (req, res) => {
            const email = req.query.email
            const query = { userEmail: email }
            const result = await bookingsCollection.find(query).toArray()
            res.send(result)
        })

    } finally {
        // Keep connection open
    }
}

run().catch(console.dir)

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`RentWheels server running on port ${port}`)
    })
}

module.exports = app