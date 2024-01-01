import {
Router,
} from 'express';

import RegisterAPI from '../functions/register.functions';

const routes = Router();

routes.route('/:phone')
.post(RegisterAPI.registerPhoneNumber);

export default routes;
