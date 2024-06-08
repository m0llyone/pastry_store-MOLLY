import { Router } from 'express';
import { authRouter } from './authRouter.js';
import { productRouter } from './productRouter.js';
import { suggestRouter } from './suggestRouter.js';
import { cartRouter } from './cartRouter.js';
import { orderRouter } from './orderRouter.js';

const router = new Router();

router.use(authRouter);
router.use(productRouter);
router.use(suggestRouter);
router.use(cartRouter);
router.use(orderRouter);

export default router;
