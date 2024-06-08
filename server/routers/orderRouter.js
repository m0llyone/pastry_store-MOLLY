import { Router } from 'express';
import orderController from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const orderRouter = new Router();

// orderRouter.use(authMiddleware);

orderRouter.post('/order', orderController.postOrder);
orderRouter.get('/order', orderController.getOrders);
orderRouter.get('/order/:id', orderController.getOrderAdmin);
// orderRouter.get('/order/:id', orderController.getOrder);
orderRouter.put('/order/:id', orderController.updateOrder);
