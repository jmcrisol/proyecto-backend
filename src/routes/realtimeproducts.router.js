import express from 'express';
import { realtimeProducts } from "../controllers/realtimeproductsController.js";

const realtimeProductsRouter = express.Router();

realtimeProductsRouter.get('/', realtimeProducts);

export default realtimeProductsRouter;