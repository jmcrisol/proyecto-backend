import { Router } from 'express';
import { renderCartsId } from "../controllers/cartsController.js";

const cartsIdRouter = Router();

cartsIdRouter.get('/:cid',renderCartsId);

export default cartsIdRouter;

