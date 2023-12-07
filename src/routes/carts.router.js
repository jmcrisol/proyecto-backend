import { Router } from 'express';
import {loadCarts, loadCartsId, newCart, addProductById, removeProductFromCart, updateCartProducts, updateProductQuantity, removeAllProductsFromCart } from "../controllers/cartsController.js";


const cartsRouter = Router();


cartsRouter.get("/",loadCarts);//Listar los productos del carrito
cartsRouter.get('/:cid',loadCartsId);// mostrar los productos en un carrito específico
cartsRouter.post("/",newCart);// Crear un nuevo carrito
cartsRouter.post("/:cid/product/:pid",addProductById);

cartsRouter.delete("/:cid/products/:pid", removeProductFromCart);
cartsRouter.put("/:cid", updateCartProducts);
cartsRouter.put("/:cid/products/:pid", updateProductQuantity);
cartsRouter.delete("/:cid", removeAllProductsFromCart);



export default cartsRouter;

