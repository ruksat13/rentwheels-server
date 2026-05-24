const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

let isConnected = false

const connectDB = async () => {
    if (!isConnected) {
        await client.connect()
        isConnected = true
    }
    return client.db('rentwheels')
}

app.get('/', async (req, res) => {
    res.send('RentWheels Server is Running!')
})

app.get('/cars/featured', async (req, res) => {
    const db = await connectDB()
    const result = await db.collection('cars').find().sort({ _id: -1 }).limit(6).toArray()
    res.send(result)
})

app.get('/cars', async (req, res) => {
    const db = await connectDB()
    const result = await db.collection('cars').find().sort({ _id: -1 }).toArray()
    res.send(result)
})

app.get('/my-cars', async (req, res) => {
    const db = await connectDB()
    const email = req.query.email
    const result = await db.collection('cars').find({ providerEmail: email }).toArray()
    res.send(result)
})

app.get('/cars/:id', async (req, res) => {
    const db = await connectDB()
    const result = await db.collection('cars').findOne({ _id: new ObjectId(req.params.id) })
    res.send(result)
})

app.post('/cars', async (req, res) => {
    const db = await connectDB()
    const result = await db.collection('cars').insertOne(req.body)
    res.send(result)
})

app.put('/cars/:id', async (req, res) => {
    const db = await connectDB()
    const result = await db.collection('cars').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
    )
    res.send(result)
})

app.delete('/cars/:id', async (req, res) => {
    const db = await connectDB()
    const result = await db.collection('cars').deleteOne({ _id: new ObjectId(req.params.id) })
    res.send(result)
})

app.post('/bookings', async (req, res) => {
    const db = await connectDB()
    const booking = req.body
    const existing = await db.collection('bookings').findOne({ carId: booking.carId })
    if (existing) {
        return res.send({ alreadyBooked: true })
    }
    const result = await db.collection('bookings').insertOne(booking)
    await db.collection('cars').updateOne(
        { _id: new ObjectId(booking.carId) },
        { $set: { status: 'booked' } }
    )
    res.send(result)
})

app.get('/bookings', async (req, res) => {
    const db = await connectDB()
    const email = req.query.email
    const result = await db.collection('bookings').find({ userEmail: email }).toArray()
    res.send(result)
})

module.exports = app