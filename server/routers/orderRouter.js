import { Router } from 'express';
import orderController from '../controllers/orderController.js';

export const orderRouter = new Router();

orderRouter.post('/order', orderController.postOrder);
orderRouter.get('/order', orderController.getOrders);
orderRouter.get('/order/:id', orderController.getOrderAdmin);
orderRouter.put('/order/:id', orderController.updateOrder);
orderRouter.delete('/order/:id', orderController.deleteOrder);
