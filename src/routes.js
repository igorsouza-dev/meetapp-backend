import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import SubscriptionController from './app/controllers/SubscriptionController';
import MeetupController from './app/controllers/MeetupController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  return res.json({ hello: 'World' });
});

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// \/ protected routes \/
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.delete('/meetups/:id', MeetupController.delete);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/subscriptions', SubscriptionController.store);

export default routes;
