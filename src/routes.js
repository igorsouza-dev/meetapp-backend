import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ hello: 'World' });
});

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// \/ protected routes \/
routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
