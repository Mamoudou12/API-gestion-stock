import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import productRoutes from './src/routes/productRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import supplierRoutes from './src/routes/supplierRoutes.js';
import saleRoutes from './src/routes/saleRoutes.js';
import receptionRoutes from './src/routes/receptionRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import errorHandler from './src/exceptions/errorHandler.js';
import i18next from './src/config/i18n.js';
import middleware from 'i18next-http-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(middleware.handle(i18next)); // Middleware de i18next

// Montage des routes
app.use('/api', productRoutes, userRoutes, supplierRoutes, saleRoutes, receptionRoutes, inventoryRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
