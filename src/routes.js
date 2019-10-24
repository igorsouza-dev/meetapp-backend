import { Router } from 'express';
import multer from 'multer';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import SubscriptionController from './app/controllers/SubscriptionController';
import MeetupController from './app/controllers/MeetupController';
import FileController from './app/controllers/FileController';
import OrganizerController from './app/controllers/OrganizerController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateMeetupStore from './app/validators/MeetupStore';
import validateMeetupUpdate from './app/validators/MeetupUpdate';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

routes.get('/', (req, res) => res.send('ok'));

routes.post('/users', validateUserStore, UserController.store);
routes.post(
  '/session',
  bruteForce.prevent,
  validateSessionStore,
  SessionController.store
);

// \/ protected routes \/
routes.use(authMiddleware);

routes.put('/users', validateUserUpdate, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/meetups', MeetupController.index);
routes.get('/meetups/:id', MeetupController.find);
routes.put('/meetups/:id', validateMeetupUpdate, MeetupController.update);
routes.post('/meetups', validateMeetupStore, MeetupController.store);
routes.delete('/meetups/:id', MeetupController.delete);

routes.get('/organizer', OrganizerController.index);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/subscriptions/:id', SubscriptionController.store);
routes.delete('/subscriptions/:id', SubscriptionController.delete);

export default routes;
