import { Router } from 'express';
import { getListProducts } from "../controllers/productsController.js";

const productsListRouter = Router();

productsListRouter.get('/',getListProducts);

export default productsListRouter;