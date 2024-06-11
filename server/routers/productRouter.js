import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import CategoryController from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const productRouter = new Router();

productRouter.post('/products', ProductController.postProduct);

productRouter.get('/products/:id', ProductController.getProduct);
productRouter.get('/product/:id/similar', ProductController.getSimilarProducts);

productRouter.delete('/products/:id', ProductController.deleteProduct);
productRouter.put('/products/:id', ProductController.updateProduct);

productRouter.post('/category', CategoryController.postCategory);
productRouter.get('/category', CategoryController.getCategories);

productRouter.get('/products', authMiddleware, ProductController.getProducts);
