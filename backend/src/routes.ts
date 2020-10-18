import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import OrphanagesController from './controllers/OrphanagesController';
import UsersController from './controllers/UsersController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);
routes.post('/orphanages/:id', upload.array('images'), OrphanagesController.update);
routes.delete('/orphanages/:id', OrphanagesController.delete);

routes.post('/register', UsersController.create);
routes.post('/authenticate', UsersController.authenticate);

export default routes;