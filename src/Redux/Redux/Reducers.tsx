import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

// You have to import every reducers and combine them.
import { ToastReducer } from './ToastRedux';
import { UserReducer } from './UserRedux';
import { NotificationReducer } from './NotificationRedux';

const config = {
  key: 'root',
  storage,
  blacklist: [
    'netInfo',
    'toast',
    'nav',
    'layouts',
  ],
};

export default persistCombineReducers(config, {
    toast: ToastReducer,
    user: UserReducer,
    notification: NotificationReducer
});
