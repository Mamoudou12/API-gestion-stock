import express from 'express';
import productRoutes from './src/routes/productRoutes.js';
import errorHandler from './src/exceptions/errorHandler.js';
import userRoutes from './src/routes/userRoutes.js'; 
import authRoutes from './src/routes/authRoutes.js'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); 
// Montage des routes
app.use('/api', productRoutes , userRoutes, authRoutes); 

// Middleware de gestion des erreurs
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
