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


app.get('/seed', async (req, res) => {
    const db = await connectDB()
    const sampleCars = [
        {
            carName: 'Toyota Camry',
            description: 'A comfortable and fuel-efficient sedan perfect for city and highway drives. Well-maintained with AC and GPS.',
            category: 'Sedan',
            rentPrice: 3500,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80',
            providerName: 'Akib Ruksat',
            providerEmail: 'akib@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Toyota Prado',
            description: 'A powerful SUV with spacious interior, perfect for family trips and off-road adventures.',
            category: 'SUV',
            rentPrice: 7000,
            location: 'Chittagong',
            imageURL: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
            providerName: 'Akib Ruksat',
            providerEmail: 'akib@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Honda Civic',
            description: 'A stylish and sporty sedan with excellent fuel economy and smooth ride quality.',
            category: 'Sedan',
            rentPrice: 2800,
            location: 'Sylhet',
            imageURL: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&q=80',
            providerName: 'Akib Ruksat',
            providerEmail: 'akib@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'BMW 5 Series',
            description: 'A premium luxury sedan with advanced technology, powerful engine and superior comfort.',
            category: 'Luxury',
            rentPrice: 12000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
            providerName: 'Akib Ruksat',
            providerEmail: 'akib@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Tesla Model 3',
            description: 'A fully electric car with autopilot features, zero emissions and long range battery.',
            category: 'Electric',
            rentPrice: 9000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
            providerName: 'Akib Ruksat',
            providerEmail: 'akib@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Toyota Vitz',
            description: 'A compact and affordable hatchback perfect for daily city commutes with great fuel economy.',
            category: 'Hatchback',
            rentPrice: 2000,
            location: 'Rajshahi',
            imageURL: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80',
            providerName: 'Akib Ruksat',
            providerEmail: 'akib@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Mercedes E-Class',
            description: 'An elegant luxury car with premium interior, advanced safety features and smooth performance.',
            category: 'Luxury',
            rentPrice: 15000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
            providerName: 'Akib Ruksat',
            providerEmail: 'akib@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Mitsubishi Pajero',
            description: 'A rugged and reliable SUV ideal for long trips and rough terrain across Bangladesh.',
            category: 'SUV',
            rentPrice: 6500,
            location: 'Khulna',
            imageURL: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80',
            providerName: 'Akib Ruksat',
            providerEmail: 'akib@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
    ]
    await db.collection('cars').insertMany(sampleCars)
    res.send({ message: 'Sample cars inserted successfully!', count: sampleCars.length })
})

app.delete('/bookings/:id', async (req, res) => {
  const db = await connectDB()
  const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(req.params.id) })
  res.send(result)
})
module.exports = app