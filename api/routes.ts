import { Router } from 'express';

// ROUTES
import MiscRoutes from './routes/misc.route';
import ListsRoutes from './routes/lists.route';
import ProductRoutes from './routes/product.route';
import SearchRoutes from './routes/search.route';
import TransactionRoutes from './routes/transaction.route';
import UserRoutes from './routes/user.route';
import RegisterRoutes from './routes/register.route';
import errorHandler from './misc/error-handler';

// ROUTER
export const routes = Router();

// REFERENCE
routes.use('/misc', MiscRoutes);
routes.use('/products', ProductRoutes);
routes.use('/search', SearchRoutes);
routes.use('/users', UserRoutes);
routes.use('/user', UserRoutes);
routes.use('/transactions', TransactionRoutes);
routes.use('/lists', ListsRoutes);
routes.use('/register', RegisterRoutes);

// ERROR
routes.use(errorHandler);

export default routes;
