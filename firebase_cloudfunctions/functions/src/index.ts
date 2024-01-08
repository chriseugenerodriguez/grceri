
import * as admin from 'firebase-admin';

admin.initializeApp();

export * from './lists.cloudfunctions';
export * from './misc.cloudfunctions';
export * from './register.cloudfunctions';
export * from './transactions.cloudfunctions';
export * from './users.cloudfunctions';
export * from './products.cloudfunctions';
export * from './search.cloudfunctions'
