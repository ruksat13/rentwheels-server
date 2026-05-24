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

async function run() {
    try {
        await client.connect()

        const db = client.db('rentwheels')
        const carsCollection = db.collection('cars')
        const bookingsCollection = db.collection('bookings')

        app.get('/', (req, res) => {
            res.send('RentWheels Server is Running!')
        })

        app.get('/cars', async (req, res) => {
            const result = await carsCollection.find().sort({ _id: -1 }).toArray()
            res.send(result)
        })

        app.get('/cars/featured', async (req, res) => {
            const result = await carsCollection.find().sort({ _id: -1 }).limit(6).toArray()
            res.send(result)
        })

        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await carsCollection.findOne(query)
            res.send(result)
        })

        app.get('/my-cars', async (req, res) => {
            const email = req.query.email
            const query = { providerEmail: email }
            const result = await carsCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/cars', async (req, res) => {
            const car = req.body
            const result = await carsCollection.insertOne(car)
            res.send(result)
        })

        app.put('/cars/:id', async (req, res) => {
            const id = req.params.id
            const car = req.body
            const filter = { _id: new ObjectId(id) }
            const updated = { $set: car }
            const result = await carsCollection.updateOne(filter, updated)
            res.send(result)
        })

        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await carsCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body
            const existing = await bookingsCollection.findOne({ carId: booking.carId })
            if (existing) {
                return res.send({ alreadyBooked: true })
            }
            const result = await bookingsCollection.insertOne(booking)
            await carsCollection.updateOne(
                { _id: new ObjectId(booking.carId) },
                { $set: { status: 'booked' } }
            )
            res.send(result)
        })

        app.get('/bookings', async (req, res) => {
            const email = req.query.email
            const query = { userEmail: email }
            const result = await bookingsCollection.find(query).toArray()
            res.send(result)
        })

    } catch (err) {
        console.error(err)
    }
}

run()

module.exports = app