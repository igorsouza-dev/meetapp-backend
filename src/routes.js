import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import SubscriptionController from './app/controllers/SubscriptionController';
import MeetupController from './app/controllers/MeetupController';
import FileController from './app/controllers/FileController';
import OrganizerController from './app/controllers/OrganizerController';

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
routes.put('/meetups/:id', MeetupController.update);
routes.post('/meetups', MeetupController.store);
routes.delete('/meetups/:id', MeetupController.delete);

routes.get('/organizer', OrganizerController.index);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/subscriptions/:id', SubscriptionController.store);
routes.delete('/subscriptions/:id', SubscriptionController.delete);

export default routes;
