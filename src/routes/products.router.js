import { Router } from 'express';

import { getProducts, getProductById, newProduct, modPrductById, deleteProductById } from "../controllers/productsController.js";

const productsRouter = Router();



productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductById);
productsRouter.post("/", newProduct);
productsRouter.put("/:pid", modPrductById);
productsRouter.delete("/:pid", deleteProductById);




export default productsRouter;


