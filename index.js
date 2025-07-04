const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup — Make sure these come before routes
app.use(cors({
    origin: ['http://localhost:5173', 'https://naresh-anchara.github.io'], // frontend origin
    credentials: true
}));
app.use(express.json({ limit: '25mb' })); // Handle base64 JSON image data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Image upload utility
const uploadImage = require('./src/utils/uploadImage');

// Routes
const authRoutes = require('./src/users/user.route');
const productRoutes = require('./src/products/products.route');
const reviewRoutes = require('./src/reviews/reviews.router');
const orderRoutes = require('./src/orders/orders.route');
const statsRoutes = require('./src/stats/stats.route');

// Registering API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// Image upload endpoint
app.post("/uploadImage", async (req, res) => {
    try {
        const image = req.body.image;
        if (!image) return res.status(400).send("No image provided");

        const url = await uploadImage(image);
        res.status(200).send(url);
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).send("Image upload failed");
    }
});

// Health check route
app.get('/', (req, res) => {
    res.send('Lebaba E-commerce server is running...!');
});

// MongoDB connection
async function connectDB() {
    if (!process.env.DB_URL) {
        console.error("DB_URL is not defined in environment variables");
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB is successfully connected");
    } catch (err) {
        console.error("Database connection failed", err);
        process.exit(1);
    }
}

connectDB();

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
