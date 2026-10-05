import "dotenv/config";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import cookieParser from 'cookie-parser';
import cors from 'cors';

import { prisma } from "./lib/prisma.js";

const app = express();

// Cors configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://portfolio-frontend-neon-nu.vercel.app"
    ],
    credentials: true, // This allows the cookies to be sent back and forth
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie']
}))


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());


// Import routes
import authRoute from './routes/authRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the uploads folder statically so frontend can see images via /uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/auth', authRoute);
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running and listening on port ${PORT}`);
});