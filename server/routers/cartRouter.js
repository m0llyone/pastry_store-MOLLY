import cartController from '../controllers/cartController.js';
import { Router } from 'express';

export const cartRouter = new Router();

cartRouter.get('/cart/:id', cartController.getBasket);
cartRouter.post('/cart', cartController.setBasket);
cartRouter.delete('/cart/:id', cartController.deleteBasket);
cartRouter.delete('/cart', cartController.deleteProduct);
