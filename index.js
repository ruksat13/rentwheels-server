const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
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
    const { _id, ...updateData } = req.body
    const result = await db.collection('cars').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData }
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


app.get('/seed-luxury', async (req, res) => {
    const db = await connectDB()
    const luxuryCars = [
        {
            carName: 'Range Rover Autobiography 2024',
            description: 'The pinnacle of British luxury SUVs. Features a commanding presence, sumptuous interior with massaging seats, and superior off-road capability.',
            category: 'Luxury',
            rentPrice: 35000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Toyota Land Cruiser 2024',
            description: 'The legendary off-road SUV with unmatched reliability, powerful V8 engine and luxurious interior perfect for any terrain.',
            category: 'SUV',
            rentPrice: 20000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Mercedes-Benz S-Class 2024',
            description: 'The ultimate luxury sedan with MBUX Hyperscreen, Burmester 4D surround sound and self-driving capabilities.',
            category: 'Luxury',
            rentPrice: 40000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'BMW 7 Series 2024',
            description: 'A masterpiece of German engineering with Theatre Screen, crystal controls and a powerful twin-turbo engine for an unforgettable ride.',
            category: 'Luxury',
            rentPrice: 38000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Audi A8 L 2024',
            description: 'Audi flagship sedan with predictive active suspension, Bang & Olufsen 3D sound and ultra-luxurious rear passenger experience.',
            category: 'Luxury',
            rentPrice: 36000,
            location: 'Chittagong',
            imageURL: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Porsche Cayenne Turbo 2024',
            description: 'The perfect blend of sports car performance and SUV practicality. Twin-turbo V8 with 541 hp and Porsche active suspension.',
            category: 'Luxury',
            rentPrice: 45000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Aston Martin DBX 707 2024',
            description: 'The worlds most powerful luxury SUV with 707 hp, hand-stitched leather interior and breathtaking performance.',
            category: 'Luxury',
            rentPrice: 60000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Rolls-Royce Cullinan 2024',
            description: 'The only Rolls-Royce SUV ever made. Magic Carpet Ride suspension, starlight headliner and bespoke luxury beyond imagination.',
            category: 'Luxury',
            rentPrice: 80000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Porsche 911 Turbo S 2024',
            description: 'The iconic sports car with 650 hp, 0-100 in 2.7 seconds and legendary Porsche driving dynamics.',
            category: 'Luxury',
            rentPrice: 55000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'BMW X7 M60i 2024',
            description: 'BMWs flagship SUV with 3-row seating, panoramic sky lounge roof and a powerful 523 hp V8 engine.',
            category: 'Luxury',
            rentPrice: 32000,
            location: 'Sylhet',
            imageURL: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Mercedes-Benz G63 AMG 2024',
            description: 'The legendary G-Wagon with AMG 577 hp V8, three locking differentials and iconic boxy design that never goes out of style.',
            category: 'Luxury',
            rentPrice: 50000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Audi Q8 e-tron 2024',
            description: 'Audis flagship electric SUV with up to 600 km range, quattro all-wheel drive and ultra-premium interior.',
            category: 'Electric',
            rentPrice: 28000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Rolls-Royce Ghost 2024',
            description: 'The junior Rolls-Royce with post-opulence design philosophy, illuminated fascia and the most refined driving experience money can buy.',
            category: 'Luxury',
            rentPrice: 70000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Lamborghini Urus 2024',
            description: 'The super SUV with 666 hp V8, 0-100 in 3.3 seconds and Italian exotic styling that turns heads everywhere.',
            category: 'Luxury',
            rentPrice: 75000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Ferrari Purosangue 2024',
            description: 'Ferraris first ever SUV with a naturally aspirated V12 engine, 725 hp and the most exclusive 4-door vehicle ever made.',
            category: 'Luxury',
            rentPrice: 90000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
    ]
    await db.collection('cars').insertMany(luxuryCars)
    res.send({ message: 'Luxury cars inserted successfully!', count: luxuryCars.length })
})

app.delete('/bookings/:id', async (req, res) => {
    const db = await connectDB()
    const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(req.params.id) })
    res.send(result)
})
module.exports = app