import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';
import EnrollmentController from './app/controllers/EnrollmentMailController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/students', StudentsController.store);

routes.use(authMiddleware); // Needs authentication down below

routes.put('/students/:id', StudentsController.update);

routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/students/help-orders', HelpOrderController.index);
routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.put('/students/:id/help-orders', HelpOrderController.update);
routes.delete('/help-orders/:id/answer', HelpOrderController.delete);

export default routes;
