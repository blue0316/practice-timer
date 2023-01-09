import { combineReducers } from 'redux';
import user from './user';
import nav from './nav';
import team from './team';
import timer from './timer';

const rootReducer = combineReducers({
  user,
  team,
  timer,
  nav,
});

export default rootReducer;
