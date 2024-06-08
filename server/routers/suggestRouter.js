import { Router } from 'express';
import suggestController from '../controllers/suggestController.js';
export const suggestRouter = new Router();

suggestRouter.get('/suggestions', suggestController.getSuggest);
suggestRouter.post('/suggestions', suggestController.postSuggest);
suggestRouter.delete('/suggestions', suggestController.deleteSuggest);
