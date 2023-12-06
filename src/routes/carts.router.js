import { Router } from 'express';
import fs from 'fs';
import {loadCarts, loadCartsId, newCart, addProductById} from "../controllers/cartsController.js";
import cartsModel from '../dao/models/carts.model.js';

const cartsRouter = Router();


cartsRouter.get("/",loadCarts);//Listar los productos del carrito
cartsRouter.get('/:cid',loadCartsId);// mostrar los productos en un carrito específico
cartsRouter.post("/",newCart);// Crear un nuevo carrito
cartsRouter.post("/:cid/product/:pid",addProductById);



export default cartsRouter;
