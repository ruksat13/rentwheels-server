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

app.get('/seed-luxury2', async (req, res) => {
    const db = await connectDB()
    const moreCars = [
        {
            carName: 'Bentley Bentayga 2024',
            description: 'The worlds most luxurious SUV with handcrafted Mulliner interior, powerful W12 engine and unrivaled comfort.',
            category: 'Luxury',
            rentPrice: 65000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Maserati Levante 2024',
            description: 'Italian elegance meets SUV practicality. Twin-turbo V6 with Ferrari-derived engine and stunning Trident styling.',
            category: 'Luxury',
            rentPrice: 42000,
            location: 'Chittagong',
            imageURL: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Lexus LX 600 2024',
            description: 'Japanese luxury at its finest. Ultra-luxurious 4-seat configuration with executive rear seating and legendary reliability.',
            category: 'Luxury',
            rentPrice: 30000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Aston Martin Vantage 2024',
            description: 'Pure British sports car with AMG-sourced twin-turbo V8, 503 hp and stunning hand-built bodywork.',
            category: 'Luxury',
            rentPrice: 58000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'McLaren Artura 2024',
            description: 'Next generation McLaren supercar with hybrid V6 powertrain, 680 hp and revolutionary lightweight carbon fiber construction.',
            category: 'Luxury',
            rentPrice: 85000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Toyota GR Supra 2024',
            description: 'The legendary Supra returns with BMW-derived inline-6, 382 hp and razor-sharp handling for the ultimate driving experience.',
            category: 'Sedan',
            rentPrice: 15000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'BMW M5 Competition 2024',
            description: 'The ultimate sports sedan with 627 hp twin-turbo V8, M xDrive AWD and a comfortable yet thrilling daily driver experience.',
            category: 'Luxury',
            rentPrice: 35000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Mercedes-AMG GT 63 S 2024',
            description: 'Four-door AMG GT with 630 hp V8, drift mode and the most thrilling Mercedes ever made for everyday use.',
            category: 'Luxury',
            rentPrice: 48000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Audi RS7 Sportback 2024',
            description: 'The sleekest Audi ever with 591 hp twin-turbo V8, mild-hybrid system and stunning fastback design.',
            category: 'Luxury',
            rentPrice: 33000,
            location: 'Sylhet',
            imageURL: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Porsche Panamera Turbo S 2024',
            description: 'The sports car among luxury sedans with 630 hp, adaptive air suspension and Porsche exclusive interior.',
            category: 'Luxury',
            rentPrice: 43000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Rolls-Royce Spectre 2024',
            description: 'The first fully electric Rolls-Royce with 577 hp, 520 km range and the most silent luxury experience ever created.',
            category: 'Electric',
            rentPrice: 95000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Land Rover Range Rover Sport 2024',
            description: 'The sportier Range Rover with Dynamic Air Suspension, 530 hp supercharged V8 and configurable terrain response.',
            category: 'Luxury',
            rentPrice: 28000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Lamborghini Huracan EVO 2024',
            description: 'Italian supercar with naturally aspirated V10, 640 hp, 0-100 in 2.9 seconds and spine-tingling exhaust note.',
            category: 'Luxury',
            rentPrice: 95000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Bugatti Chiron 2024',
            description: 'The most powerful production car ever made with quad-turbo W16, 1500 hp and a top speed of 420 km/h.',
            category: 'Luxury',
            rentPrice: 200000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
        {
            carName: 'Tesla Model S Plaid 2024',
            description: 'The fastest accelerating production car ever with tri-motor AWD, 1020 hp and 0-100 in under 2 seconds.',
            category: 'Electric',
            rentPrice: 22000,
            location: 'Dhaka',
            imageURL: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
            providerName: 'RentWheels Premium',
            providerEmail: 'premium@rentwheels.com',
            status: 'available',
            createdAt: new Date().toISOString(),
        },
    ]
    await db.collection('cars').insertMany(moreCars)
    res.send({ message: 'More luxury cars inserted!', count: moreCars.length })
})

app.get('/fix-images', async (req, res) => {
    const db = await connectDB()
    await db.collection('cars').updateMany(
        { carName: 'Porsche 911 Turbo S 2024' },
        { $set: { imageURL: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80' } }
    )
    await db.collection('cars').updateMany(
        { carName: 'McLaren Artura 2024' },
        { $set: { imageURL: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80' } }
    )
    res.send({ message: 'Images fixed!' })
})
app.get('/delete-cars', async (req, res) => {
    const db = await connectDB()
    await db.collection('cars').deleteMany({ carName: 'McLaren Artura 2024' })
    await db.collection('cars').deleteMany({ carName: 'Porsche 911 Turbo S 2024' })
    res.send({ message: 'Cars deleted successfully!' })
})

app.delete('/bookings/:id', async (req, res) => {
    const db = await connectDB()
    const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(req.params.id) })
    res.send(result)
})
module.exports = app